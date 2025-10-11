'use client'

import { useState } from 'react'
import { AlignLeftIcon } from 'lucide-react'

import Link from '@/components/link'
import { Button } from '@/components/ui/button'

type TOC = {
  title: string
  url: string
  depth: number
}

type MobileTableOfContentsProps = {
  toc: TOC[]
}

const MobileTableOfContents = (props: MobileTableOfContentsProps) => {
  const { toc } = props
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='lg:hidden'>
      <Button
        variant='secondary'
        className='fixed bottom-4 right-4 z-50 gap-2 shadow-lg'
        onClick={() => setIsOpen(!isOpen)}
      >
        <AlignLeftIcon className='size-4' /> On this page
      </Button>

      {isOpen && (
        <div className='fixed inset-0 z-40 bg-background/80 backdrop-blur-sm' onClick={() => setIsOpen(false)}>
          <div 
            className='fixed bottom-16 right-4 w-64 rounded-lg border bg-background p-4 shadow-lg'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-3 font-medium'>On this page</div>
            <div className='max-h-64 space-y-1 overflow-y-auto'>
              {toc.map((item) => {
                const { title, url, depth } = item

                return (
                  <Link
                    key={url}
                    href={`#${url}`}
                    className='text-muted-foreground hover:text-foreground block py-1.5 text-sm leading-[1.2] transition-colors'
                    style={{
                      paddingLeft: (depth - 1) * 16
                    }}
                    onClick={() => setIsOpen(false)}
                  >
                    {title}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileTableOfContents