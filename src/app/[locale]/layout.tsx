import type { Metadata, Viewport } from 'next'
import { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ThemeProvider } from 'next-themes'
import { SpeedInsights } from '@vercel/speed-insights/next'

import '@/styles/globals.css'
import MainLayout from '@/components/main-layout'
import { SITE_NAME, SITE_URL, SITE_KEYWORDS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { calSans, inter } from '@/lib/fonts'
import { i18n } from '@/i18n/config'

type LayoutProps = {
  children: ReactNode
  params: Promise<{ // CHANGED: Added Promise wrapper
    locale: string
  }>
}

export const generateStaticParams = () => {
  return i18n.locales.map((locale) => ({ locale }))
}

export const generateMetadata = async ({ params }: LayoutProps): Promise<Metadata> => {
  const { locale } = await params // CHANGED: Added await
  
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`
    },
    description: 'A modern blog and portfolio built with Next.js 15, TypeScript, and Tailwind CSS. Sharing knowledge and experiences through writing.',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    manifest: '/favicon/site.webmanifest',
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: 'A modern blog and portfolio built with Next.js 15, TypeScript, and Tailwind CSS.',
      images: [
        {
          url: `${SITE_URL}/images/og.png`,
          width: 1200,
          height: 630,
          alt: 'Personal website and blog'
        }
      ]
    },
    keywords: SITE_KEYWORDS,
    creator: SITE_NAME,
    openGraph: {
      url: SITE_URL,
      type: 'website',
      title: SITE_NAME,
      siteName: SITE_NAME,
      description: 'A modern blog and portfolio built with Next.js 15, TypeScript, and Tailwind CSS.',
      locale,
      images: [
        {
          url: `${SITE_URL}/images/og.png`,
          width: 1200,
          height: 630,
          alt: 'Personal website and blog',
          type: 'image/png'
        }
      ]
    },
    icons: {
      icon: [
        { url: '/favicon/favicon.ico' },
        { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
      ],
      shortcut: '/favicon/favicon.ico',
      apple: [
        {
          url: '/favicon/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png'
        }
      ],
      other: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/favicon/favicon.svg'
        }
      ]
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default async function RootLayout({
  children,
  params
}: LayoutProps) { // CHANGED: Use the defined type
  const { locale } = await params // CHANGED: Added await

  let messages
  try {
    messages = await getMessages()
  } catch (error) {
    console.error('Error loading messages:', error)
    // Fallback to empty messages
    messages = {}
  }

  return (
    <html
      lang={locale}
      className={cn(
        calSans.variable,
        inter.variable,
        'scroll-smooth'
      )}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark')
                } else {
                  document.documentElement.classList.remove('dark')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.className
      )}>
        <NextIntlClientProvider 
          messages={messages}
          timeZone="UTC"
          now={new Date()}
        >
          <ThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            disableTransitionOnChange
            storageKey="theme"
          >
            <MainLayout>
              {children}
            </MainLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}