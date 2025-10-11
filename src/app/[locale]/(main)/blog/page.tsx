// apps/web/src/app/[locale]/(main)/blog/page.tsx
import type { Metadata } from 'next'
import type { Blog, WithContext } from 'schema-dts'

import { i18n } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'

import FilteredPosts from '@/components/filtered-posts'
import PageTitle from '@/components/page-title'
import { SITE_NAME, SITE_URL } from '@/lib/constants'

type PageProps = {
  params: Promise<{ locale: string }>
}

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const title = t('title')
  const description = t('description')
  const url = `/${locale}/blog`

  return {
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      url,
      title,
      description
    },
    twitter: {
      title,
      description
    }
  }
}

// Safe data access with fallback
async function getBlogPosts(locale: string) {
  try {
    // Method 1: Try direct import
    const content = await import('content-collections')
    if (content.allBlogs) {
      console.log('✅ Loaded blog posts from content-collections')
      return content.allBlogs.filter((post: any) => 
        post.locale === locale && post.published !== false
      )
    }
  } catch (error) {
    console.log('Method 1 failed, trying method 2...')
  }

  try {
    // Method 2: Try built file directly
    const content = await import('../../../../../.content-collections/index.js')
    if (content.allBlogs) {
      console.log('✅ Loaded blog posts from built file')
      return content.allBlogs.filter((post: any) => 
        post.locale === locale && post.published !== false
      )
    }
  } catch (error) {
    console.log('Method 2 failed, using empty array')
  }

  // Return empty array if all methods fail
  return []
}

const Page = async (props: PageProps) => {
  const { locale } = await props.params
  const t = await getTranslations({ locale, namespace: 'blog' })
  const title = t('title')
  const description = t('description')
  const url = `${SITE_URL}/${locale}/blog`

  const posts = await getBlogPosts(locale)
  const sortedPosts = posts.sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const jsonLd: WithContext<Blog> = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': url,
    name: title,
    description,
    url,
    author: {
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
      <PageTitle title={title} description={description} />
      <FilteredPosts posts={sortedPosts} />
    </>
  )
}

export default Page