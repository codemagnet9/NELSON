import type { Metadata } from 'next'
import type { WebSite, WithContext } from 'schema-dts'

import { i18n } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'

import AboutMe from '@/components/home/about-me'
import GetInTouch from '@/components/home/get-in-touch'
import Hero from '@/components/home/hero'
import LatestArticles from '@/components/home/latest-articles'
import SelectedProjects from '@/components/home/selected-projects'
import {
  SITE_FACEBOOK_URL,
  SITE_GITHUB_URL,
  SITE_INSTAGRAM_URL,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
  SITE_X_URL,
  SITE_YOUTUBE_URL
} from '@/lib/constants'

type PageProps = {
  params: Promise<{ // CHANGED: Added Promise wrapper
    locale: string
  }>
}

export const generateStaticParams = (): Array<{ locale: string }> => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { locale } = await props.params // CHANGED: Added await

  return {
    alternates: {
      canonical: `/${locale}`
    }
  }
}

const Page = async (props: PageProps) => {
  const { locale } = await props.params // CHANGED: Added await
  const t = await getTranslations('metadata')

  const url = `${SITE_URL}/${locale}`

  const jsonLd: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: 'A modern blog and portfolio built with Next.js 15, TypeScript, and Tailwind CSS',
    url,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
      url: SITE_URL,
      sameAs: [SITE_FACEBOOK_URL, SITE_INSTAGRAM_URL, SITE_X_URL, SITE_GITHUB_URL, SITE_YOUTUBE_URL]
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': SITE_URL
    },
    inLanguage: locale,
    copyrightYear: new Date().getFullYear(),
    keywords: SITE_KEYWORDS,
    dateCreated: '2020-12-05',
    dateModified: new Date().toISOString()
  }

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <SelectedProjects />
      <AboutMe />
      <LatestArticles />
      <GetInTouch />
    </>
  )
}

export default Page