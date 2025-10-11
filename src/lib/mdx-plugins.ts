import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

export const remarkPlugins = [remarkGfm]
export const rehypePlugins = [rehypeSlug, rehypeAutolinkHeadings, rehypePrettyCode]

// Simple TOC function to replace getTOC
export async function getTOC(content: string) {
  // Basic TOC extraction - you can enhance this
  const headings = content.match(/#{2,3}\s+(.+)/g) || []
  return headings.map(heading => ({
    title: heading.replace(/#{2,3}\s+/, ''),
    depth: heading.match(/#/g)?.length || 2,
    url: '#' + heading.replace(/#{2,3}\s+/, '').toLowerCase().replace(/\s+/g, '-')
  }))
}