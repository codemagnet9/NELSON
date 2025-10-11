'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import MainLayout from '@/components/main-layout'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error(props: ErrorProps) {
  const { error, reset } = props
  const t = useTranslations('Error')

  return (
    <MainLayout>
      <div className="space-y-4 px-2 py-8">
        <h1 className="text-2xl font-bold">{t('something-went-wrong')}</h1>
        <Button onClick={reset}>{t('try-again')}</Button>
        <p className="break-words rounded-md bg-zinc-100 p-4 dark:bg-zinc-800">
          {error.message}
        </p>
      </div>
    </MainLayout>
  )
}