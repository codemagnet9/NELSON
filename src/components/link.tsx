'use client'

import NextLink from 'next/link'
import { ComponentProps } from 'react'
import { useLocale } from 'next-intl'

type LinkProps = ComponentProps<typeof NextLink>

const Link = (props: LinkProps) => {
  const locale = useLocale()
  
  let href = props.href
  
  // Only modify relative URLs that don't already have a locale
  if (typeof href === 'string' && 
      href.startsWith('/') && 
      !href.startsWith(`/${locale}`) &&
      !href.startsWith('/en') && 
      !href.startsWith('/es')) {
    href = `/${locale}${href}`
  }

  return <NextLink {...props} href={href} />
}

export default Link