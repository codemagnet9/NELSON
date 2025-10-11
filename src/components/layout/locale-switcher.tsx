import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { LanguagesIcon } from 'lucide-react'
import { useTransition } from 'react'

const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
]

const LocaleSwitcher = () => {
  const t = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='size-9 p-0' aria-label={t('layout.change-language')}>
          <LanguagesIcon className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {supportedLanguages.map((locale) => (
          <Item key={locale.code} locale={locale.code} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type ItemProps = {
  locale: string
}

const Item = (props: ItemProps) => {
  const { locale } = props
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = () => {
    // Remove the current locale from the pathname
    const pathnameWithoutLocale = pathname.replace(/^\/(en|es)/, '') || '/'
    const newPathname = `/${locale}${pathnameWithoutLocale}`
    
    startTransition(() => router.push(newPathname))
  }

  return (
    <DropdownMenuItem key={locale} disabled={isPending} onClick={switchLanguage}>
      {supportedLanguages.find((l) => l.code === locale)?.label}
    </DropdownMenuItem>
  )
}

export default LocaleSwitcher