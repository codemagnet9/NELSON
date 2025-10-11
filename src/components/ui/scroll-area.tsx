'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        {...props}
      >
        <div className="h-full w-full rounded-[inherit]">
          {children}
        </div>
      </div>
    )
  }
)
ScrollArea.displayName = 'ScrollArea'

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: 'horizontal' | 'vertical'
  }
>(({ className, orientation = 'vertical', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex touch-none select-none transition-colors',
        orientation === 'vertical' &&
          'h-full w-2.5 border-l border-l-transparent p-[1px]',
        orientation === 'horizontal' &&
          'h-2.5 flex-col border-t border-t-transparent p-[1px]',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative rounded-full bg-border',
          orientation === 'vertical' && 'w-2',
          orientation === 'horizontal' && 'h-2'
        )}
      />
    </div>
  )
})
ScrollBar.displayName = 'ScrollBar'

export { ScrollArea, ScrollBar }