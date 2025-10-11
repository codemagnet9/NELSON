import type { auth } from './auth'

import { createAuthClient } from 'better-auth/react'

// Mock implementation - replace with your actual Better Auth setup
const mockAuthClient = {
  signIn: async (options: any) => {
    console.log('Signing in with:', options)
    return {
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          image: '/images/avatar.png',
          role: 'user',
          username: 'testuser',
        },
        session: {
          id: '1',
          expiresAt: new Date(Date.now() + 86400000),
          token: 'mock-token',
        },
      },
      error: null,
    }
  },
  signOut: async () => {
    console.log('Signing out')
    return { data: null, error: null }
  },
  useSession: () => {
    // Mock session state
    return {
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          image: '/images/avatar.png',
          role: 'user',
          username: 'testuser',
        },
        session: {
          id: '1',
          expiresAt: new Date(Date.now() + 86400000),
          token: 'mock-token',
        },
      },
      isPending: false,
      error: null,
    }
  },
  $Infer: {
    Session: {} as any,
  },
}

// Create the actual auth client (commented out for now since we're using mock)
// const authClient: ReturnType<typeof createAuthClient> = createAuthClient({
//   baseURL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
//   plugins: [], // Add any plugins you need
//   fetchOptions: {
//     onError(e) {
//       if (e.error.status === 429) {
//         // You can add toast notification here
//         console.error('Too many requests. Please try again later.')
//       }
//     }
//   }
// })

// For now, using mock implementation
const authClient = mockAuthClient

export const signIn: typeof authClient.signIn = authClient.signIn
export const signOut: typeof authClient.signOut = authClient.signOut
export const useSession: typeof authClient.useSession = authClient.useSession

export type Session = typeof authClient.$Infer.Session
export type User = (typeof authClient.$Infer.Session)['user']