import { TRPCError } from '@trpc/server'
import { and, eq, sql, sum } from 'drizzle-orm'
import { z } from 'zod'

import { db, likesSessions, posts } from '@/lib/db'
import { ratelimit, redis, redisKeys } from '@/lib/rate-limit'
import { getIp } from '@/utils/get-ip'
import { getSessionId } from '@/utils/get-session-id'

import { createTRPCRouter, publicProcedure } from '../init'

const getKey = (id: string) => `likes:${id}`

export const likesRouter = createTRPCRouter({
  getCount: publicProcedure.query(async ({ ctx }) => {
    const ip = getIp(ctx.headers)

    const { success } = await ratelimit.limit(getKey(`getCount:${ip}`))

    if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

    const cachedLikeCount = await redis.get<number>(redisKeys.postLikeCount)

    if (cachedLikeCount) {
      return {
        likes: cachedLikeCount
      }
    }

    const result = await db
      .select({
        value: sum(posts.likes)
      })
      .from(posts)

    const likes = result[0]?.value ? Number(result[0].value) : 0

    await redis.set(redisKeys.postLikeCount, likes)

    return {
      likes
    }
  }),

  get: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1)
      })
    )
    .query(async ({ ctx, input }) => {
      const ip = getIp(ctx.headers)
      const sessionId = getSessionId(input.slug, ip)

      const { success } = await ratelimit.limit(getKey(`get:${sessionId}`))

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const cachedLikes = await redis.get<number>(redisKeys.postLikes(input.slug))
      const cachedCurrentUserLikes = await redis.get<number>(
        redisKeys.currentUserLikes(input.slug, sessionId)
      )

      if (cachedLikes && cachedCurrentUserLikes) {
        return {
          likes: cachedLikes,
          currentUserLikes: cachedCurrentUserLikes
        }
      }

      const [post, user] = await Promise.all([
        db
          .select({
            likes: posts.likes
          })
          .from(posts)
          .where(eq(posts.slug, input.slug)),
        db
          .select({
            likes: likesSessions.likes
          })
          .from(likesSessions)
          .where(eq(likesSessions.id, sessionId))
      ])

      await redis.set(redisKeys.postLikes(input.slug), post[0]?.likes ?? 0)
      await redis.set(redisKeys.currentUserLikes(input.slug, sessionId), user[0]?.likes ?? 0)

      return {
        likes: post[0]?.likes ?? 0,
        currentUserLikes: user[0]?.likes ?? 0
      }
    }),

  patch: publicProcedure
    .input(
      z.object({
        slug: z.string().min(1),
        value: z.number().int().positive().min(1).max(3)
      })
    )
    .mutation(async ({ ctx, input }) => {
      const ip = getIp(ctx.headers)
      const sessionId = getSessionId(input.slug, ip)

      const { success } = await ratelimit.limit(getKey(`patch:${sessionId}`))

      if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

      const session = await db
        .select({
          likes: likesSessions.likes
        })
        .from(likesSessions)
        .where(eq(likesSessions.id, getSessionId(input.slug, ip)))

      if (session[0] && session[0].likes + input.value > 3) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You can only like a post 3 times'
        })
      }

      const likes = await db
        .insert(posts)
        .values({
          slug: input.slug,
          likes: input.value,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: posts.slug,
          set: {
            likes: sql<number>`${posts.likes} + ${input.value}`,
            updatedAt: new Date(),
          }
        })
        .returning()

      const currentUserLikes = await db
        .insert(likesSessions)
        .values({
          id: sessionId,
          likes: input.value,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: likesSessions.id,
          set: {
            likes: sql<number>`${likesSessions.likes} + ${input.value}`,
            updatedAt: new Date(),
          }
        })
        .returning()

      await redis.set(redisKeys.postLikes(input.slug), likes[0]?.likes)
      await redis.set(redisKeys.currentUserLikes(input.slug, sessionId), currentUserLikes[0]?.likes)
    })
})