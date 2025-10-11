'use client'

import { useFormatter } from 'next-intl'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// Initialize dayjs with relativeTime plugin
dayjs.extend(relativeTime)

type DateTimeFormatOptions = Intl.DateTimeFormatOptions

type Options = {
  relative?: boolean
  formatOptions?: DateTimeFormatOptions
}

export const useFormattedDate = (date: Date | string, options: Options = {}) => {
  const {
    relative = false,
    formatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  } = options

  const format = useFormatter()
  const now = new Date()

  const convertedDate = typeof date === 'string' ? new Date(date) : date

  if (relative) {
    const weeksDiff = dayjs().diff(date, 'week')

    return Math.abs(weeksDiff) > 1
      ? format.dateTime(convertedDate, formatOptions)
      : format.relativeTime(convertedDate, now)
  } else {
    return format.dateTime(convertedDate, formatOptions)
  }
}