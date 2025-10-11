import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
    
    // Authentication
    AUTH_SECRET: z.string().min(1),
    AUTH_GITHUB_ID: z.string().min(1),
    AUTH_GITHUB_SECRET: z.string().min(1),
    
    // Email
    AUTHOR_EMAIL: z.string().email(),
    RESEND_API_KEY: z.string().min(1),
    
    // APIs
    GITHUB_TOKEN: z.string().min(1),
    SPOTIFY_CLIENT_ID: z.string().min(1),
    SPOTIFY_CLIENT_SECRET: z.string().min(1),
    SPOTIFY_REFRESH_TOKEN: z.string().min(1),
    WAKATIME_API_KEY: z.string().min(1),
    GOOGLE_API_KEY: z.string().min(1),
    
    // Rate limiting
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    
    // Notifications
    DISCORD_WEBHOOK_URL: z.string().url().optional(),
  },
  client: {
    // Client-side environment variables
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTHOR_EMAIL: process.env.AUTHOR_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
    WAKATIME_API_KEY: process.env.WAKATIME_API_KEY,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
    
    // Client
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
})

export const flags = {
  guestbookNotification: process.env.GUESTBOOK_NOTIFICATION === 'true',
  likeButton: process.env.LIKE_BUTTON === 'true',
  comment: process.env.COMMENT === 'true',
}