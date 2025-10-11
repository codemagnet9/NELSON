import type { MetadataRoute } from 'next'

import { allPages, allPosts, allProjects } from 'content-collections'

import { SITE_URL } from '@/lib/constants'
import { getLocalizedPath } from '@/utils/get-localized-path'

// Replace the private i18n config with your local i18n config
// Create this in your i18n config or constants
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese' },
  // Add other languages you support
]

const sitemap = (): MetadataRoute.Sitemap => {
  const routes = [
    '',
    '/blog',
    '/guestbook',
    '/projects',
    '/dashboard',
    ...new Set(allPages.map((page) => `/${page.slug}`)),
    ...new Set(allProjects.map((project) => `/projects/${project.slug}`)),
    ...new Set(allPosts.map((post) => `/blog/${post.slug}`))
  ]

  return supportedLanguages.flatMap((locale) => {
    return routes.map((route) => ({
      url: `${SITE_URL}${getLocalizedPath({ slug: route, locale: locale.code })}`,
      lastModified: new Date()
    }))
  })
}

export default sitemap