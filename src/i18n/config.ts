export const supportedLanguages = [
  {
    code: 'en',
    label: 'English',
    default: true
  },
  {
    code: 'es',
    label: 'Spanish'
  }
]

export const i18n = {
  locales: supportedLanguages.map(({ code }) => code),
  defaultLocale: supportedLanguages.find(({ default: isDefault }) => isDefault)?.code ?? 'en'
} as const
