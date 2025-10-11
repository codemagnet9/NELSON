'use client'

import { useQuery } from '@tanstack/react-query'
import { ListFilterIcon } from 'lucide-react'

import { useCommentsContext } from '@/contexts/comments'
import { useTRPC } from '@/trpc/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NumberFlow from '@/components/ui/number-flow'

const CommentHeader = () => {
  const { slug, sort, setSort } = useCommentsContext()
  const trpc = useTRPC()

  const commentsCountQuery = useQuery({
    queryKey: ['comments', 'count', slug],
    queryFn: () => trpc.comments.getCommentsCount.query({ slug })
  })

  const repliesCountQuery = useQuery({
    queryKey: ['replies', 'count', slug],
    queryFn: () => trpc.comments.getRepliesCount.query({ slug })
  })

  return (
    <div className='flex items-center justify-between px-1'>
      <div>
        {commentsCountQuery.status === 'pending'
          ? `-- comments`
          : null}
        {commentsCountQuery.status === 'error' ? 'Error' : null}
        {commentsCountQuery.status === 'success' ? (
          <NumberFlow 
            value={commentsCountQuery.data.comments}
            suffix={` comment${commentsCountQuery.data.comments === 1 ? '' : 's'}`}
          />
        ) : null}
        {' · '}
        {repliesCountQuery.status === 'pending'
          ? `-- replies`
          : null}
        {repliesCountQuery.status === 'error' ? 'Error' : null}
        {repliesCountQuery.status === 'success' ? (
          <NumberFlow 
            value={repliesCountQuery.data.replies}
            suffix={` repl${repliesCountQuery.data.replies === 1 ? 'y' : 'ies'}`}
          />
        ) : null}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='sm' className='h-7 gap-1 text-sm'>
            <ListFilterIcon className='size-3.5' />
            <span>Sort by</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuRadioGroup
            value={sort}
            onValueChange={(value) => {
              setSort(value as any)
            }}
          >
            <DropdownMenuRadioItem value='newest'>
              Newest
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='oldest'>
              Oldest
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default CommentHeader