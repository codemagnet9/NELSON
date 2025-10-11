import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'
import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin'] }).default('user').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Comments table
export const comments = sqliteTable('comments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  body: text('body').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  postId: text('post_id').notNull(),
  parentId: text('parent_id'),
  isDeleted: integer('is_deleted', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Rates table (likes/dislikes for comments)
export const rates = sqliteTable('rates', {
  userId: text('user_id').notNull().references(() => users.id),
  commentId: text('comment_id').notNull().references(() => comments.id),
  like: integer('like', { mode: 'boolean' }).notNull(),
}, (table) => ({
  compoundKey: primaryKey({ columns: [table.userId, table.commentId] }),
}))

// Guestbook table
export const guestbook = sqliteTable('guestbook', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  body: text('body').notNull(),
  userId: text('user_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Posts table (for views and likes tracking)
export const posts = sqliteTable('posts', {
  slug: text('slug').primaryKey(),
  views: integer('views').default(0).notNull(),
  likes: integer('likes').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Likes sessions table
export const likesSessions = sqliteTable('likes_sessions', {
  id: text('id').primaryKey(),
  likes: integer('likes').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  comments: many(comments),
  guestbook: many(guestbook),
  rates: many(rates),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'replies',
  }),
  replies: many(comments, {
    relationName: 'replies',
  }),
  rates: many(rates),
}))

export const ratesRelations = relations(rates, ({ one }) => ({
  user: one(users, {
    fields: [rates.userId],
    references: [users.id],
  }),
  comment: one(comments, {
    fields: [rates.commentId],
    references: [comments.id],
  }),
}))

export const guestbookRelations = relations(guestbook, ({ one }) => ({
  user: one(users, {
    fields: [guestbook.userId],
    references: [users.id],
  }),
}))