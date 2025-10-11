'use client'

import { useTranslations } from 'next-intl'
import { motion, useInView } from 'motion/react'
import { useRef } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import Link from '../link'

const variants = {
  initial: {
    y: 40,
    opacity: 0
  },
  animate: {
    y: 0,
    opacity: 1
  }
}

const LatestArticles = () => {
  const projectsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(projectsRef, { once: true, margin: '-100px' })
  const t = useTranslations()

  return (
    <motion.div
      initial='initial'
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      ref={projectsRef}
      transition={{
        duration: 0.5
      }}
      className='my-24'
    >
      <motion.h2
        className='text-center text-3xl font-semibold'
        initial={{
          y: 30,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          duration: 0.3
        }}
      >
        {t('homepage.latest-articles.title')}
      </motion.h2>
      <motion.div
        className='mt-12 grid gap-4 md:grid-cols-2'
        initial={{
          y: 40,
          opacity: 0
        }}
        animate={{
          y: 0,
          opacity: 1
        }}
        transition={{
          duration: 0.3
        }}
      >
        <div className='shadow-feature-card rounded-xl p-8 text-center'>
          <p className='text-muted-foreground'>Articles coming soon...</p>
        </div>
        <div className='shadow-feature-card rounded-xl p-8 text-center'>
          <p className='text-muted-foreground'>More articles coming soon...</p>
        </div>
      </motion.div>
      <div className='my-8 flex items-center justify-center'>
        <Link
          href='/blog'
          className={cn(
            buttonVariants({
              variant: 'outline'
            }),
            'rounded-xl'
          )}
        >
          {t('homepage.latest-articles.more')}
        </Link>
      </div>
    </motion.div>
  )
}

export default LatestArticles