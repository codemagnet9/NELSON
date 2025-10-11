'use client'

import { useEffect, useState } from 'react'
import { CodeBlock } from '@/components/ui/code-block'
import { useHighlighterStore } from '@/store/highlighter'

type CommentCodeBlockProps = {
  children: {
    props: {
      children: string
      className?: string
      title?: string
    }
  }
}

const CommentCodeBlock = (props: CommentCodeBlockProps) => {
  const {
    children: {
      props: { children: code, className, title }
    }
  } = props
  const lang = className?.replace('lang-', '') ?? 'plaintext'
  const { highlighter } = useHighlighterStore()
  const [highlightedHtml, setHighlightedHtml] = useState('')
  const [isHighlighted, setIsHighlighted] = useState(false)

  useEffect(() => {
    if (!highlighter) return

    const generateHighlightedHtml = async () => {
      try {
        const html = await highlighter.codeToHtml(code, {
          lang: lang,
          themes: {
            light: 'github-light',
            dark: 'github-dark'
          },
        })
        return html
      } catch (error) {
        // Fallback to plain text
        return `<pre><code>${code}</code></pre>`
      }
    }

    generateHighlightedHtml().then((newHtml) => {
      setHighlightedHtml(newHtml)
      setIsHighlighted(true)
    })
  }, [code, highlighter, lang])

  const codeHtml = /<code\b[^>]*>([\s\S]*?)<\/code>/.exec(highlightedHtml)?.[1]

  return (
    <CodeBlock data-lang={lang} title={title} className='shiki' figureClassName='my-2'>
      {isHighlighted && codeHtml ? (
        <code
          dangerouslySetInnerHTML={{
            __html: codeHtml
          }}
        />
      ) : (
        <code>{code}</code>
      )}
    </CodeBlock>
  )
}

export default CommentCodeBlock