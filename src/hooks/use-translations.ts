'use client'


export const useTranslations = () => {
  const t = (key: string, params?: Record<string, any>): string => {
    const translations: Record<string, string> = {
      'blog.comments.like': 'Like',
      'blog.comments.dislike': 'Dislike',
      'blog.comments.reply': 'Reply',
      'blog.comments.replies': 'replies',
      'blog.comments.need-logged-in-to-rate': 'You need to be logged in to rate comments',
    }

    let translation = translations[key] || key

    // Handle pluralization and parameters
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param])
      })
    }

    return translation
  }

  return t
}