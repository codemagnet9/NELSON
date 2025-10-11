import type { RouterOutputs } from '../client'

import { db, users } from '@/lib/db'

import { adminProcedure, createTRPCRouter } from '../init'

export const usersRouter = createTRPCRouter({
  getUsers: adminProcedure.query(async ({ ctx }) => {
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role
      })
      .from(users)

    return {
      users: result
    }
  })
})

export type GetUsersOutput = RouterOutputs['users']['getUsers']