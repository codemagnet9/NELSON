import { initTRPC, TRPCError } from '@trpc/server'
import { headers } from 'next/headers'
import { cache } from 'react'
import { SuperJSON } from 'superjson'
import { ZodError } from 'zod'

// Mock database - replace with your actual database
const mockDb = {
  query: {
    comments: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    guestbook: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    users: {
      findMany: async () => [],
      findFirst: async () => null,
    },
    posts: {
      findMany: async () => [],
      findFirst: async () => null,
    },
  },
  select: () => ({
    from: () => ({
      where: () => ({
        value: 0,
      }),
    }),
  }),
  insert: () => ({
    values: () => ({
      onConflictDoUpdate: () => ({
        returning: () => [{
          likes: 0,
          views: 0,
        }],
      }),
      returning: () => [{}],
    }),
  }),
  update: () => ({
    set: () => ({
      where: () => {},
    }),
  }),
  delete: () => ({
    where: () => {},
  }),
  transaction: async (callback: any) => await callback(mockDb),
}

// Mock session - replace with your actual auth
const getSession = async () => {
  return {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as const,
    },
  }
}

export const createTRPCContext = cache(async () => {
  const session = await getSession()

  return {
    db: mockDb,
    session,
    headers: await headers(),
  }
})

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: SuperJSON,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`)

  return result
})

export const publicProcedure = t.procedure.use(timingMiddleware)

export const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.session.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' })
  }

  return next({ ctx })
})