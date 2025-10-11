import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { env } from '@/lib/env'
import { ratelimit } from '@/lib/rate-limit'
import { getIp } from '@/utils/get-ip'

import { createTRPCRouter, publicProcedure } from '../init'

const getKey = (id: string) => `wakatime:${id}`

export const wakatimeRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const ip = getIp(ctx.headers)

    const { success } = await ratelimit.limit(getKey(ip))

    if (!success) throw new TRPCError({ code: 'TOO_MANY_REQUESTS' })

    // Check if WakaTime API key is configured
    if (!env.WAKATIME_API_KEY) {
      return {
        seconds: 0
      }
    }

    try {
      const res = await fetch('https://wakatime.com/api/v1/users/current/all_time_since_today', {
        headers: {
          Authorization: `Basic ${Buffer.from(env.WAKATIME_API_KEY).toString('base64')}`
        },
        next: {
          revalidate: 3600 // Cache for 1 hour
        }
      })

      if (!res.ok) {
        throw new Error('WakaTime API request failed')
      }

      const data = await res.json()

      return {
        seconds: data.data.total_seconds as number
      }
    } catch (error) {
      console.error('WakaTime API error:', error)
      return {
        seconds: 0
      }
    }
  })
})