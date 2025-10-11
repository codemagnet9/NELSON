import type { Metadata, ResolvingMetadata } from 'next'
import type { Article, WithContext } from 'schema-dts'

import { allPosts } from 'content-collections'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import Comment from '@/components/comment'
import Mdx from '@/components/mdx'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

// Feature flags (you can move these to environment variables)
const flags = {
  likeButton: true,
  comment: true
}

type PageProps = {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export const generateStaticParams = () => {
  return allPosts.map((post) => ({
    slug: post.slug,
    locale: post.locale
  }))
}

export const generateMetadata = async (
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> => {
  const params = await props.params
  const { slug, locale } = params

  const post = allPosts.find((p) => p.slug === slug && p.locale === locale)

  if (!post) return {}

  const { date, modifiedTime, title, summary } = post

  const ISOPublishedTime = new Date(date).toISOString()
  const ISOModifiedTime = new Date(modifiedTime).toISOString()
  const previousTwitter = (await parent).twitter ?? {}
  const previousOpenGraph = (await parent).openGraph ?? {}
  const url = `${SITE_URL}/blog/${slug}`

  return {
    title: title,
    description: summary,
    alternates: {
      canonical: url
    },
    openGraph: {
      ...previousOpenGraph,
      url,
      type: 'article',
      title: title,
      description: summary,
      publishedTime: ISOPublishedTime,
      modifiedTime: ISOModifiedTime,
      authors: SITE_URL,
      images: [
        {
          url: `/og/${slug}`,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png'
        }
      ]
    },
    twitter: {
      ...previousTwitter,
      title: title,
      description: summary,
      images: [
        {
          url: `/og/${slug}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    }
  }
}

const Page = async (props: PageProps) => {
  const params = await props.params
  const { slug, locale } = params

  const post = allPosts.find((p) => p.slug === slug && p.locale === locale)
  const url = `${SITE_URL}/blog/${slug}`

  if (!post) {
    notFound()
  }

  const { title, summary, date, modifiedTime, code, toc } = post

  const jsonLd: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    name: title,
    description: summary,
    url,
    datePublished: date,
    dateModified: modifiedTime,
    image: `${SITE_URL}/og/${slug}`,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL
    },
    publisher: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL
    }
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Providers post={post}>
        <Header />

        <div className='mt-8 flex flex-col justify-between lg:flex-row'>
          <article className='w-full lg:w-[670px]'>
            <Mdx code={code} />
          </article>
          <aside className='lg:min-w-[270px] lg:max-w-[270px]'>
            <div className='sticky top-24'>
              {toc.length > 0 ? <TableOfContents toc={toc} /> : null}
              {flags.likeButton ? <LikeButton slug={slug} /> : null}
            </div>
          </aside>
        </div>
        <ProgressBar />

        {toc.length > 0 ? <MobileTableOfContents toc={toc} /> : null}
        <Footer />
      </Providers>

      {flags.comment ? (
        <Suspense>
          <Comment slug={slug} />
        </Suspense>
      ) : null}
    </>
  )
}

export default Page