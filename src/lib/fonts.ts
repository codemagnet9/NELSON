import localFont from 'next/font/local'

export const calSans = localFont({
  src: [
    {
      path: '../../public/fonts/CalSans-semibold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-cal-sans',
  display: 'swap',
})

export const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter-semibold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})