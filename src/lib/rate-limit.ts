import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
})

export const redisKeys = {
  postLikeCount: 'post:like:count',
  postLikes: (slug: string) => `post:likes:${slug}`,
  currentUserLikes: (slug: string, sessionId: string) => `user:likes:${slug}:${sessionId}`,
  postViewCount: 'post:view:count',
  postViews: (slug: string) => `post:views:${slug}`,
}