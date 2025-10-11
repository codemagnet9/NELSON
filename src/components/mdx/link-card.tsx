import Image from 'next/image'
import { ExternalLinkIcon } from 'lucide-react'
import Link from '../link'

type LinkCardProps = {
  href: string
  hostname: string
  title: string
}

const LinkCard = (props: LinkCardProps) => {
  const { href, hostname, title } = props

  return (
    <div className='not-prose flex justify-center'>
      <Link
        href={href}
        className='my-8 flex items-center justify-center gap-4 rounded-lg border p-4 no-underline transition-colors hover:bg-accent'
      >
        <Image
          src={`/images/website-icons/${hostname}.png`}
          className='rounded-lg'
          width={48}
          height={48}
          alt={hostname}
        />
        <div>
          <div className='font-medium'>{title}</div>
          <div className='text-muted-foreground text-sm'>{href}</div>
        </div>
        <ExternalLinkIcon className='size-[22px]' />
      </Link>
    </div>
  )
}

export default LinkCard