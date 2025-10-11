'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import MainLayout from '@/components/main-layout'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <MainLayout>
      <div className="mb-40 mt-52 flex flex-col items-center justify-center gap-12">
        <h1 className="text-center text-6xl font-bold">{t('title')}</h1>
        <Button asChild>
          <Link href="/">{t('go-to-homepage')}</Link>
        </Button>
      </div>
    </MainLayout>
  )
}