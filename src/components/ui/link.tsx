import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import NextLink from 'next/link'

const linkVariants = cva(
  // Base styles
  'transition-colors',
  {
    variants: {
      variant: {
        muted: 'text-muted-foreground hover:text-foreground'
      }
    }
  }
)

type LinkProps = {
  href: string
} & Omit<React.ComponentProps<'a'>, 'href'> &
  VariantProps<typeof linkVariants>

const Link = (props: LinkProps) => {
  const { href, className, children, variant, ...rest } = props

  if (href.startsWith('/')) {
    return (
      <NextLink className={cn(linkVariants({ variant, className }))} href={href} {...rest}>
        {children}
      </NextLink>
    )
  }

  if (href.startsWith('#')) {
    return (
      <a className={cn(linkVariants({ variant, className }))} href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <a
      className={cn(linkVariants({ variant, className }))}
      target='_blank'
      rel='noopener noreferrer'
      href={href}
      {...rest}
    >
      {children}
    </a>
  )
}

export { Link, linkVariants }