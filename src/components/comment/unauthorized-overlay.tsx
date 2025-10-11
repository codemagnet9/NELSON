import { Button } from '@/components/ui'

import { useDialogsStore } from '@/store/dialogs'

// Common i18n imports - choose one:
import { useTranslations } from 'next-intl'
// import { useTranslation } from 'react-i18next'
// import { useI18n } from '@/locales/client'

const UnauthorizedOverlay = () => {
  const { setIsSignInOpen } = useDialogsStore()
  
  // Choose one based on your i18n setup:
  const t = useTranslations()
  // const { t } = useTranslation()
  // const t = useI18n()

  return (
    <div className='absolute inset-0 flex items-center justify-center rounded-lg bg-black/5 backdrop-blur-[0.8px]'>
      <Button size='sm' onClick={() => setIsSignInOpen(true)}>
        {t('common.sign-in')}
      </Button>
    </div>
  )
}

export default UnauthorizedOverlay