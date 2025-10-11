'use client'

import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import BlurImage from '@/components/ui/blur-image'

import { useFormattedDate } from '@/hooks/use-formatted-date'
// import { useTRPC } from '@/trpc/client' - We'll create a placeholder for now

import Link from './link'

// Define Post type
type Post = {
  slug: string
  title: string
  summary: string
  date: string
  locale: string
  modifiedTime?: string
}

type PostCardsProps = {
  posts: Post[]
}

type PostCardProps = Post

// Placeholder for tRPC - remove this when you set up tRPC
const useTRPC = () => ({
  views: {
    get: {
      queryOptions: ({ slug }: { slug: string }) => ({
        queryKey: ['views', slug],
        queryFn: async () => ({ views: 0 })
      })
    }
  },
  likes: {
    get: {
      queryOptions: ({ slug }: { slug: string }) => ({
        queryKey: ['likes', slug],
        queryFn: async () => ({ likes: 0 })
      })
    }
  }
})

const PostCards = (props: PostCardsProps) => {
  const { posts } = props

  return (
    <div className='grid gap-4 md:grid-cols-2'>
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  )
}

const PostCard = (props: PostCardProps) => {
  const { slug, title, summary, date } = props
  const formattedDate = useFormattedDate(date)
  const trpc = useTRPC()
  const t = useTranslations()

  const viewsQuery = useQuery(trpc.views.get.queryOptions({ slug }))
  const likesQuery = useQuery(trpc.likes.get.queryOptions({ slug }))

  return (
    <Link href={`/blog/${slug}`} className='shadow-feature-card group rounded-xl px-2 py-4 block'>
      <BlurImage
        src={`/images/blog/${slug}/cover.png`}
        className='rounded-lg'
        width={1200}
        height={630}
        imageClassName='transition-transform group-hover:scale-105'
        alt={title}
        // Fallback if image doesn't exist
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/images/placeholder-blog.png'
        }}
      />
      <div className='flex items-center justify-between gap-2 px-2 pt-4 text-sm text-zinc-500'>
        {formattedDate}
        <div className='flex gap-2'>
          {likesQuery.status === 'pending' ? '--' : null}
          {likesQuery.status === 'error' ? t('common.error') : null}
          {likesQuery.status === 'success' ? (
            <div>{t('common.likes', { count: likesQuery.data.likes })}</div>
          ) : null}
          <div>&middot;</div>
          {viewsQuery.status === 'pending' ? '--' : null}
          {viewsQuery.status === 'error' ? t('common.error') : null}
          {viewsQuery.status === 'success' ? (
            <div>{t('common.views', { count: viewsQuery.data.views })}</div>
          ) : null}
        </div>
      </div>
      <div className='flex flex-col px-2 py-4'>
        <h3 className='text-2xl font-semibold'>{title}</h3>
        <p className='text-muted-foreground mt-2'>{summary}</p>
      </div>
    </Link>
  )
}

export default PostCards