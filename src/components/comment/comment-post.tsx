'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toaster' 
import { Button } from '@/components/ui/button' // or your UI components path
import { SendIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useCommentsContext } from '@/contexts/comments'
import { useCommentParams } from '@/hooks/use-comment-params'
import { useSession } from '@/lib/auth-client'
import { useTRPC } from '@/trpc/client'

import CommentEditor from './comment-editor'
import UnauthorizedOverlay from './unauthorized-overlay'

// Common i18n imports - choose one:
import { useTranslations } from 'next-intl'
// import { useTranslation } from 'react-i18next'
// import { useI18n } from '@/locales/client'

const CommentPost = () => {
  const { slug, sort } = useCommentsContext()
  const [params] = useCommentParams()
  const [content, setContent] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const { data: session, isPending } = useSession()
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  
  // Choose one based on your i18n setup:
  const t = useTranslations()
  // const { t } = useTranslation()
  // const t = useI18n()

  const commentsMutation = useMutation(
    trpc.comments.post.mutationOptions({
      onSuccess: () => {
        setContent('')
        toast.success(t('blog.comments.comment-posted'))
      },
      onError: (error) => toast.error(error.message),
      onSettled: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getInfiniteComments.infiniteQueryKey({
            slug,
            sort,
            type: 'comments',
            highlightedCommentId: params.comment ?? undefined
          })
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getCommentsCount.queryKey({ slug })
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getRepliesCount.queryKey({ slug })
        })
        queryClient.invalidateQueries({
          queryKey: trpc.comments.getTotalCommentsCount.queryKey({ slug })
        })
      }
    })
  )

  const submitComment = () => {
    if (!content) {
      toast.error(t('blog.comments.comment-cannot-be-empty'))

      return
    }

    commentsMutation.mutate({
      slug,
      content: content,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })
  }

  useEffect(() => {
    setIsMounted(true)

    return () => setIsMounted(false)
  }, [])

  if (isPending || !isMounted) return null

  const disabled = session === null || commentsMutation.isPending

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submitComment()
      }}
    >
      <div className='relative'>
        <CommentEditor
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
          }}
          onModEnter={submitComment}
          placeholder={t('blog.comments.placeholder')}
          disabled={disabled}
          data-testid='comment-textarea-post'
        />
        <Button
          variant='ghost'
          size='icon'
          className='absolute bottom-1.5 right-2 size-7'
          type='submit'
          disabled={disabled || !content}
          aria-label={t('blog.comments.send-comment')}
          aria-disabled={disabled || !content}
          data-testid='comment-submit-button'
        >
          <SendIcon className='size-4' />
        </Button>
        {session === null ? <UnauthorizedOverlay /> : null}
      </div>
    </form>
  )
}

export default CommentPost