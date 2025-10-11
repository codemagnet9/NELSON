'use client'

import Link from '@/components/link'
import { useScrollspy } from '@/hooks/use-scrollspy'

type TOC = {
  title: string
  url: string
  depth: number
}

type TableOfContentsProps = {
  toc: TOC[]
}

const TableOfContents = (props: TableOfContentsProps) => {
  const { toc } = props
  const activeId = useScrollspy(
    toc.map((item) => item.url),
    { rootMargin: '0% 0% -80% 0%' }
  )

  return (
    <div className='hidden pl-4 lg:block'>
      <div className='mb-4 font-medium'>On this page</div>
      <div className='space-y-1 text-sm'>
        {toc.map((item) => {
          const { title, url, depth } = item
          const isActive = activeId === url

          return (
            <Link
              key={url}
              href={`#${url}`}
              className={`block py-1.5 transition-colors ${
                isActive
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              style={{
                paddingLeft: (depth - 1) * 12
              }}
            >
              {title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default TableOfContents