import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { env } from '@/lib/env'
import { ratelimit } from '@/lib/rate-limit'
import { getIp } from '@/utils/get-ip'

import { createTRPCRouter, publicProcedure } from '../init'

const getKey = (id: string) => `youtube:${id}`

export const youtubeRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const ip = getIp(ctx.headers)

    const { success } = await ratelimit.limit(getKey(ip))

    if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

    // Check if Google API key is configured
    if (!env.GOOGLE_API_KEY) {
      return {
        subscribers: 0,
        views: 0
      }
    }

    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC2hMWOaOlk9vrkvFVaGmn0Q&key=${env.GOOGLE_API_KEY}`,
        {
          next: {
            revalidate: 3600 // Cache for 1 hour
          }
        }
      )

      if (!res.ok) {
        throw new Error('YouTube API request failed')
      }

      const data = await res.json()

      if (!data.items || data.items.length === 0) {
        return {
          subscribers: 0,
          views: 0
        }
      }

      const channel = data.items[0]
      const statistics = channel.statistics

      return {
        subscribers: Number(statistics.subscriberCount) || 0,
        views: Number(statistics.viewCount) || 0
      }
    } catch (error) {
      console.error('YouTube API error:', error)
      return {
        subscribers: 0,
        views: 0
      }
    }
  })
})