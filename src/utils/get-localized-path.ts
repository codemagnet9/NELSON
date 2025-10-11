type GetLocalizedPathProps = {
  slug: string
  locale: string
}

export const getLocalizedPath = ({ slug, locale }: GetLocalizedPathProps) => {
  if (slug === '') {
    return `/${locale}`
  }
  return `/${locale}/${slug}`
}