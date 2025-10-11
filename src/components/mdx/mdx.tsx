'use client'

import { useMDXComponent } from '@content-collections/mdx/react'
import { BlurImage } from '@/components/ui/blur-image'
import { CodeBlock } from '@/components/ui/code-block'
import { Kbd } from '@/components/ui/kbd'

import ImageZoom from '@/components/image-zoom'
import Link from './link'

import Heading from './mdx/heading'
import ItemGrid from './mdx/item-grid'
import LinkCard from './mdx/link-card'
import Logo from './mdx/logo'
import Table from './mdx/table'
import TreeView from './mdx/tree-view'
import Video from './mdx/video'

type MdxProps = {
  code?: string // For legacy Contentlayer usage
  children?: React.ReactNode // For Content Collections
}

const components = {
  // Headings with custom styling and anchor links
  h1: (props: React.ComponentProps<'h1'>) => <Heading as='h1' {...props} />,
  h2: (props: React.ComponentProps<'h2'>) => <Heading as='h2' {...props} />,
  h3: (props: React.ComponentProps<'h3'>) => <Heading as='h3' {...props} />,
  h4: (props: React.ComponentProps<'h4'>) => <Heading as='h4' {...props} />,
  h5: (props: React.ComponentProps<'h5'>) => <Heading as='h5' {...props} />,
  h6: (props: React.ComponentProps<'h6'>) => <Heading as='h6' {...props} />,
  
  // Custom link component with hover effects
  a: (props: React.ComponentProps<'a'>) => {
    const { children, ...rest } = props

    return (
      <Link 
        className='hover:text-foreground text-anchor no-underline transition-colors' 
        {...rest}
      >
        {children}
      </Link>
    )
  },
  
  // Image with zoom functionality and blur effect
  Image: (props: React.ComponentProps<typeof BlurImage>) => {
    const { alt, ...rest } = props

    return (
      <>
        <ImageZoom>
          <BlurImage 
            className='rounded-lg border' 
            alt={alt} 
            {...rest} 
          />
        </ImageZoom>
        <figcaption className='mt-4 text-center text-sm text-muted-foreground'>
          {alt}
        </figcaption>
      </>
    )
  },
  
  // Regular img tag fallback with same styling
  img: (props: React.ComponentProps<'img'>) => {
    const { alt, src, ...rest } = props
    
    return (
      <>
        <ImageZoom>
          <BlurImage 
            src={src || ''}
            className='rounded-lg border' 
            alt={alt || ''} 
            width={800}
            height={400}
            {...rest} 
          />
        </ImageZoom>
        {alt && (
          <figcaption className='mt-4 text-center text-sm text-muted-foreground'>
            {alt}
          </figcaption>
        )}
      </>
    )
  },
  
  // Code blocks with syntax highlighting and copy functionality
  pre: (props: React.ComponentProps<'pre'>) => {
    const { children, className, ...rest } = props
    
    // Extract language from className (common pattern in MDX)
    const langMatch = className?.match(/language-(\w+)/)
    const lang = langMatch ? langMatch[1] : undefined
    
    // Extract title from data attributes or meta
    const title = (props as any)['data-title'] || 
                  (props as any)['data-metastring']?.replace(/^"|"$/g, '') ||
                  undefined

    return (
      <CodeBlock 
        data-lang={lang}
        className={className}
        {...rest}
      >
        {children}
      </CodeBlock>
    )
  },
  
  // Inline code styling
  code: (props: React.ComponentProps<'code'>) => {
    const { children, className, ...rest } = props
    
    // Check if it's a code block (has language class) or inline code
    const isInline = !className?.includes('language-')
    
    if (isInline) {
      return (
        <code 
          className='rounded bg-muted px-1.5 py-0.5 font-mono text-sm'
          {...rest}
        >
          {children}
        </code>
      )
    }
    
    return (
      <code className={className} {...rest}>
        {children}
      </code>
    )
  },
  
  // Blockquote styling
  blockquote: (props: React.ComponentProps<'blockquote'>) => {
    const { children, ...rest } = props
    
    return (
      <blockquote 
        className='border-l-4 border-border pl-4 italic text-muted-foreground'
        {...rest}
      >
        {children}
      </blockquote>
    )
  },
  
  // Table styling
  table: (props: React.ComponentProps<'table'>) => {
    const { children, ...rest } = props
    
    return (
      <div className='my-6 w-full overflow-x-auto'>
        <table 
          className='w-full border-collapse border-spacing-0 text-sm'
          {...rest}
        >
          {children}
        </table>
      </div>
    )
  },
  
  // Custom components
  Table: (props: React.ComponentProps<typeof Table>) => <Table {...props} />,
  ItemGrid: (props: React.ComponentProps<typeof ItemGrid>) => <ItemGrid {...props} />,
  Video: (props: React.ComponentProps<typeof Video>) => <Video {...props} />,
  LinkCard: (props: React.ComponentProps<typeof LinkCard>) => <LinkCard {...props} />,
  Logo: (props: React.ComponentProps<typeof Logo>) => <Logo {...props} />,
  TreeView: (props: React.ComponentProps<typeof TreeView>) => <TreeView {...props} />,
  Kbd: (props: React.ComponentProps<typeof Kbd>) => <Kbd {...props} />,

  // Additional semantic elements with proper styling
  hr: (props: React.ComponentProps<'hr'>) => (
    <hr className='my-8 border-border' {...props} />
  ),
  
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul className='my-4 list-disc space-y-2 pl-6' {...props} />
  ),
  
  ol: (props: React.ComponentProps<'ol'>) => (
    <ol className='my-4 list-decimal space-y-2 pl-6' {...props} />
  ),
  
  li: (props: React.ComponentProps<'li'>) => (
    <li className='pl-2' {...props} />
  ),
  
  p: (props: React.ComponentProps<'p'>) => (
    <p className='my-4 leading-7' {...props} />
  ),
  
  strong: (props: React.ComponentProps<'strong'>) => (
    <strong className='font-semibold' {...props} />
  ),
  
  em: (props: React.ComponentProps<'em'>) => (
    <em className='italic' {...props} />
  ),
}

const Mdx = (props: MdxProps) => {
  const { code, children } = props

  // Content Collections mode: children are pre-compiled React components
  if (children) {
    return (
      <div className='prose prose-zinc w-full max-w-none dark:prose-invert'>
        <style jsx global>{`
          .prose {
            color: hsl(var(--foreground));
          }
          
          .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            color: hsl(var(--foreground));
            font-weight: 600;
            scroll-margin-top: 6rem;
          }
          
          .prose h1 {
            font-size: 2.25rem;
            line-height: 2.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          
          .prose h2 {
            font-size: 1.875rem;
            line-height: 2.25rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid hsl(var(--border));
            padding-bottom: 0.5rem;
          }
          
          .prose h3 {
            font-size: 1.5rem;
            line-height: 2rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          
          .prose a {
            color: hsl(var(--anchor));
            text-decoration: none;
            font-weight: 500;
          }
          
          .prose a:hover {
            color: hsl(var(--foreground));
          }
          
          .prose code {
            background: hsl(var(--muted));
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
          
          .prose pre {
            background: transparent;
            padding: 0;
            margin: 0;
          }
          
          .prose blockquote {
            border-left-color: hsl(var(--border));
            background: hsl(var(--muted) / 0.3);
            padding: 1rem;
            border-radius: 0 0.5rem 0.5rem 0;
          }
          
          .prose table {
            border: 1px solid hsl(var(--border));
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .prose th {
            background: hsl(var(--muted));
            font-weight: 600;
          }
          
          .prose th, .prose td {
            border: 1px solid hsl(var(--border));
            padding: 0.75rem;
          }
          
          .prose tr:nth-child(even) {
            background: hsl(var(--muted) / 0.3);
          }
        `}</style>
        {children}
      </div>
    )
  }

  // Legacy Contentlayer mode: compile code string to React components
  if (code) {
    const MDXContent = useMDXComponent(code)

    return (
      <div className='prose prose-zinc w-full max-w-none dark:prose-invert'>
        <style jsx global>{`
          .prose {
            color: hsl(var(--foreground));
          }
          
          .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
            color: hsl(var(--foreground));
            font-weight: 600;
            scroll-margin-top: 6rem;
          }
          
          .prose h1 {
            font-size: 2.25rem;
            line-height: 2.5rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          
          .prose h2 {
            font-size: 1.875rem;
            line-height: 2.25rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            border-bottom: 1px solid hsl(var(--border));
            padding-bottom: 0.5rem;
          }
          
          .prose h3 {
            font-size: 1.5rem;
            line-height: 2rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
          }
          
          .prose a {
            color: hsl(var(--anchor));
            text-decoration: none;
            font-weight: 500;
          }
          
          .prose a:hover {
            color: hsl(var(--foreground));
          }
          
          .prose code {
            background: hsl(var(--muted));
            padding: 0.125rem 0.25rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          }
          
          .prose pre {
            background: transparent;
            padding: 0;
            margin: 0;
          }
          
          .prose blockquote {
            border-left-color: hsl(var(--border));
            background: hsl(var(--muted) / 0.3);
            padding: 1rem;
            border-radius: 0 0.5rem 0.5rem 0;
          }
          
          .prose table {
            border: 1px solid hsl(var(--border));
            border-radius: 0.5rem;
            overflow: hidden;
          }
          
          .prose th {
            background: hsl(var(--muted));
            font-weight: 600;
          }
          
          .prose th, .prose td {
            border: 1px solid hsl(var(--border));
            padding: 0.75rem;
          }
          
          .prose tr:nth-child(even) {
            background: hsl(var(--muted) / 0.3);
          }
        `}</style>
        <MDXContent components={components} />
      </div>
    )
  }

  // No content provided
  return null
}

export default Mdx