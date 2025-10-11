import type { RouterInputs, RouterOutputs } from '../client'

import { createId } from '@paralleldrive/cuid2'
import { TRPCError } from '@trpc/server'
import { and, asc, desc, eq, gt, isNotNull, isNull, lt, ne, count, sql } from 'drizzle-orm'
import { z } from 'zod'

import { db, comments, rates, users } from '@/lib/db'
import { env, flags } from '@/lib/env'
import { Comment as CommentEmail, Reply as ReplyEmail } from '@/lib/emails'
import { ratelimit } from '@/lib/rate-limit'
import { isProduction } from '@/lib/constants'
import { resend } from '@/lib/resend'
import { getDefaultImage } from '@/utils/get-default-image'
import { getIp } from '@/utils/get-ip'

import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from '../init'

const getKey = (id: string) => `comments:${id}`

export const commentsRouter = createTRPCRouter({
  getComments: adminProcedure.query(async ({ ctx }) => {
    const query = await db
      .select({
        id: comments.id,
        userId: comments.userId,
        parentId: comments.parentId,
        body: comments.body,
        createdAt: comments.createdAt,
      })
      .from(comments)

    const result = query.map((comment) => ({
      ...comment,
      type: comment.parentId ? 'reply' : 'comment'
    }))

    return {
      comments: result
    }
  }),

  getInfiniteComments: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        parentId: z.string().optional(),
        sort: z.enum(['newest', 'oldest']).default('newest'),
        cursor: z.date().nullish(),
        limit: z.number().min(1).max(50).default(10),
        type: z.enum(['comments', 'replies']).default('comments'),
        highlightedCommentId: z.string().optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const session = ctx.session
      const ip = getIp(ctx.headers)

      const { success } = await ratelimit.limit(getKey(`getInfiniteComments:${ip}`))
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const getCursorFilter = () => {
        if (!input.cursor) return
        return input.sort === 'newest'
          ? lt(comments.createdAt, input.cursor)
          : gt(comments.createdAt, input.cursor)
      }

      let query = db
        .select({
          id: comments.id,
          userId: comments.userId,
          parentId: comments.parentId,
          body: comments.body,
          createdAt: comments.createdAt,
          isDeleted: comments.isDeleted,
          user: {
            name: users.name,
            image: users.image,
            role: users.role,
            id: users.id,
          },
        })
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(
          and(
            eq(comments.postId, input.slug),
            input.parentId ? eq(comments.parentId, input.parentId) : isNull(comments.parentId),
            input.type === 'comments' ? isNull(comments.parentId) : isNotNull(comments.parentId),
            getCursorFilter(),
            input.highlightedCommentId ? ne(comments.id, input.highlightedCommentId) : undefined
          )
        )
        .limit(input.limit)
        .orderBy(input.sort === 'newest' ? desc(comments.createdAt) : asc(comments.createdAt))

      const result = await query

      const commentsWithStats = await Promise.all(
        result.map(async (comment) => {
          const [replies, likes, dislikes] = await Promise.all([
            db.select({ value: count() }).from(comments).where(eq(comments.parentId, comment.id)),
            db.select({ value: count() }).from(rates).where(and(eq(rates.commentId, comment.id), eq(rates.like, true))),
            db.select({ value: count() }).from(rates).where(and(eq(rates.commentId, comment.id), eq(rates.like, false))),
          ])

          // Get user's rate for this comment
          let selfRate = null
          if (session?.user.id) {
            const userRates = await db
              .select()
              .from(rates)
              .where(and(eq(rates.commentId, comment.id), eq(rates.userId, session.user.id)))
            selfRate = userRates[0]
          }

          const defaultImage = getDefaultImage(comment.user.id)

          return {
            ...comment,
            body: comment.body,
            replies: replies[0]?.value ?? 0,
            likes: likes[0]?.value ?? 0,
            dislikes: dislikes[0]?.value ?? 0,
            liked: selfRate?.like ?? null,
            user: {
              ...comment.user,
              image: comment.user.image ?? defaultImage,
              name: comment.user.name
            }
          }
        })
      )

      // Handle highlighted comment
      if (input.highlightedCommentId && !input.cursor) {
        const highlightedComment = await db
          .select({
            id: comments.id,
            userId: comments.userId,
            parentId: comments.parentId,
            body: comments.body,
            createdAt: comments.createdAt,
            isDeleted: comments.isDeleted,
            user: {
              name: users.name,
              image: users.image,
              role: users.role,
              id: users.id,
            },
          })
          .from(comments)
          .leftJoin(users, eq(comments.userId, users.id))
          .where(eq(comments.id, input.highlightedCommentId))
          .then(rows => rows[0])

        if (highlightedComment) {
          const [replies, likes, dislikes] = await Promise.all([
            db.select({ value: count() }).from(comments).where(eq(comments.parentId, highlightedComment.id)),
            db.select({ value: count() }).from(rates).where(and(eq(rates.commentId, highlightedComment.id), eq(rates.like, true))),
            db.select({ value: count() }).from(rates).where(and(eq(rates.commentId, highlightedComment.id), eq(rates.like, false))),
          ])

          let selfRate = null
          if (session?.user.id) {
            const userRates = await db
              .select()
              .from(rates)
              .where(and(eq(rates.commentId, highlightedComment.id), eq(rates.userId, session.user.id)))
            selfRate = userRates[0]
          }

          const defaultImage = getDefaultImage(highlightedComment.user.id)
          const highlightedCommentWithStats = {
            ...highlightedComment,
            replies: replies[0]?.value ?? 0,
            likes: likes[0]?.value ?? 0,
            dislikes: dislikes[0]?.value ?? 0,
            liked: selfRate?.like ?? null,
            user: {
              ...highlightedComment.user,
              image: highlightedComment.user.image ?? defaultImage,
              name: highlightedComment.user.name
            }
          }

          commentsWithStats.unshift(highlightedCommentWithStats)
        }
      }

      return {
        comments: commentsWithStats,
        nextCursor: commentsWithStats.at(-1)?.createdAt ?? null
      }
    }),

  getTotalCommentsCount: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const ip = getIp(ctx.headers)
      const { success } = await ratelimit.limit(getKey(`getTotalCommentsCount:${ip}`))
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const value = await db
        .select({ value: count() })
        .from(comments)
        .where(eq(comments.postId, input.slug))

      return {
        comments: value[0]?.value ?? 0
      }
    }),

  getCommentsCount: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const ip = getIp(ctx.headers)
      const { success } = await ratelimit.limit(getKey(`getCommentsCount:${ip}`))
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const value = await db
        .select({ value: count() })
        .from(comments)
        .where(and(eq(comments.postId, input.slug), isNull(comments.parentId)))

      return {
        comments: value[0]?.value ?? 0
      }
    }),

  getRepliesCount: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const ip = getIp(ctx.headers)
      const { success } = await ratelimit.limit(getKey(`getRepliesCount:${ip}`))
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const value = await db
        .select({ value: count() })
        .from(comments)
        .where(and(eq(comments.postId, input.slug), isNotNull(comments.parentId)))

      return {
        replies: value[0]?.value ?? 0
      }
    }),

  post: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        content: z.string().min(1),
        date: z.string().min(1),
        parentId: z.string().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user
      const { success } = await ratelimit.limit(getKey(`post:${user.id}`))
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const commentId = createId()
      const allPosts = await import('content-collections').then(mod => mod.allPosts)
      const page = allPosts.find((post: any) => post.slug === input.slug)

      if (!page) throw new TRPCError({ code: 'NOT_FOUND', message: 'Blog post not found' })

      const title = page.title
      const defaultImage = getDefaultImage(user.id)
      const userProfile = {
        name: user.name,
        image: user.image ?? defaultImage
      }
      const post = {
        title,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${input.slug}`
      }

      await db.transaction(async (tx) => {
        await tx.insert(comments).values({
          id: commentId,
          body: input.content,
          userId: user.id,
          postId: input.slug,
          parentId: input.parentId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        // Notify the author of the blog post via email
        if (!input.parentId && user.role === 'user') {
          if (!isProduction || !resend) return

          await resend.emails.send({
            from: 'Nelson Lai <me@honghong.me>',
            to: env.AUTHOR_EMAIL,
            subject: 'New comment on your blog post',
            react: CommentEmail({
              comment: input.content,
              commenter: userProfile,
              id: `comment=${commentId}`,
              date: input.date,
              post
            })
          })
        }

        // Notify the parent comment owner via email
        if (input.parentId) {
          if (!isProduction || !resend) return

          const parentComment = await tx
            .select()
            .from(comments)
            .leftJoin(users, eq(comments.userId, users.id))
            .where(eq(comments.id, input.parentId))
            .then(rows => rows[0])

          if (parentComment && parentComment.users?.email !== user.email) {
            await resend.emails.send({
              from: 'Nelson Lai <me@honghong.me>',
              to: parentComment.users!.email!,
              subject: 'New reply to your comment',
              react: ReplyEmail({
                reply: input.content,
                replier: userProfile,
                comment: parentComment.comments.body,
                id: `comment=${input.parentId}&reply=${commentId}`,
                date: input.date,
                post
              })
            })
          }
        }
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.session.user
      const { success } = await ratelimit.limit(getKey(`delete:${user.id}`))
      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const comment = await db
        .select()
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.id, input.id))
        .then(rows => rows[0])

      if (!comment) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Comment not found'
        })
      }

      // Check if the user is the owner of the comment
      if (comment.users?.email !== user.email) {
        throw new TRPCError({
          code: 'UNAUTHORIZED'
        })
      }

      // If the comment has replies, just mark it as deleted
      const replyCount = await db
        .select({ value: count() })
        .from(comments)
        .where(eq(comments.parentId, input.id))

      if (replyCount[0]?.value > 0) {
        await db
          .update(comments)
          .set({ isDeleted: true })
          .where(eq(comments.id, input.id))
        return
      }

      // Otherwise, delete the comment
      await db.delete(comments).where(eq(comments.id, input.id))

      // Case: deleting a reply
      if (comment.comments.parentId) {
        const parentComment = await db
          .select()
          .from(comments)
          .where(and(
            eq(comments.id, comment.comments.parentId),
            eq(comments.isDeleted, true)
          ))
          .then(rows => rows[0])

        // If the parent comment (which is marked as deleted) has no replies, delete it also
        if (parentComment) {
          const remainingReplies = await db
            .select({ value: count() })
            .from(comments)
            .where(eq(comments.parentId, parentComment.id))

          if (remainingReplies[0]?.value === 0) {
            await db.delete(comments).where(eq(comments.id, parentComment.id))
          }
        }
      }
    })
})

export type GetInfiniteCommentsInput = RouterInputs['comments']['getInfiniteComments']
export type GetInfiniteCommentsOutput = RouterOutputs['comments']['getInfiniteComments']
export type GetCommentsOutput = RouterOutputs['comments']['getComments']