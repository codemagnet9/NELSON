'use client'

import { PostProvider } from '@/contexts/post'

type Post = {
  slug: string
  title: string
  date: string
  modifiedTime: string
  summary: string
  toc: any[]
}

type ProvidersProps = {
  children: React.ReactNode
  post: Post
}

const Providers = (props: ProvidersProps) => {
  const { children, post } = props

  return <PostProvider value={post}>{children}</PostProvider>
}

export default Providers