'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { cn } from '@/lib/utils'

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
  lazy?: boolean
}

const BlurImage = (props: BlurImageProps) => {
  const { className, lazy = true, ...rest } = props
  const [isLoading, setLoading] = useState(true)

  return (
    <Image
      className={cn(
        className,
        'duration-700 ease-in-out',
        isLoading ? 'scale-105 blur-lg' : 'scale-100 blur-0'
      )}
      onLoad={() => setLoading(false)}
      loading={lazy ? 'lazy' : 'eager'}
      {...rest}
    />
  )
}

export default BlurImage