export const isProduction = process.env.NODE_ENV === 'production'

export const SITE_URL = isProduction 
  ? process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'
  : 'http://localhost:3000'

export const GITHUB_USERNAME = 'yourusername'

export const SITE_NAME = 'Your Name'
export const SITE_KEYWORDS = ['yourusername', 'Next.js', 'React', 'TypeScript', 'Node.js', 'Web Development', 'Frontend Developer']

export const SITE_GITHUB_URL = `https://github.com/${GITHUB_USERNAME}`
export const SITE_FACEBOOK_URL = `https://www.facebook.com/${GITHUB_USERNAME}`
export const SITE_INSTAGRAM_URL = `https://www.instagram.com/${GITHUB_USERNAME}`
export const SITE_X_URL = `https://x.com/${GITHUB_USERNAME}`
export const SITE_YOUTUBE_URL = `https://www.youtube.com/@${GITHUB_USERNAME}`