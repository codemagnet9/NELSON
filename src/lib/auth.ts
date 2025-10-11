import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

// Mock adapter - replace with your actual database adapter
const mockAdapter = {
  user: {
    create: async (data: any) => ({ id: '1', ...data }),
    get: async (id: string) => ({ id, email: 'test@example.com', name: 'Test User' }),
    update: async (id: string, data: any) => ({ id, ...data }),
    delete: async (id: string) => ({ id }),
    getByEmail: async (email: string) => ({ id: '1', email, name: 'Test User' }),
  },
  session: {
    create: async (data: any) => ({ id: '1', ...data }),
    get: async (id: string) => ({ id, userId: '1', expiresAt: new Date(Date.now() + 86400000) }),
    update: async (id: string, data: any) => ({ id, ...data }),
    delete: async (id: string) => ({ id }),
    getByToken: async (token: string) => ({ id: '1', token, userId: '1', expiresAt: new Date(Date.now() + 86400000) }),
  },
  account: {
    create: async (data: any) => ({ id: '1', ...data }),
    get: async (id: string) => ({ id, userId: '1', provider: 'github' }),
    update: async (id: string, data: any) => ({ id, ...data }),
    delete: async (id: string) => ({ id }),
    getByProvider: async (provider: string, providerAccountId: string) => ({ id: '1', provider, providerAccountId, userId: '1' }),
  },
  verification: {
    create: async (data: any) => ({ id: '1', ...data }),
    get: async (id: string) => ({ id, identifier: 'test@example.com', expiresAt: new Date(Date.now() + 3600000) }),
    update: async (id: string, data: any) => ({ id, ...data }),
    delete: async (id: string) => ({ id }),
    getByToken: async (token: string) => ({ id: '1', token, identifier: 'test@example.com', expiresAt: new Date(Date.now() + 3600000) }),
  },
}

export const auth = betterAuth({
  database: mockAdapter,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 1 week
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      username: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
      },
      image: {
        type: 'string',
        required: false,
      },
    },
  },
})

export type Auth = typeof auth