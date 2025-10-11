import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import { z } from 'zod'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

const blog = defineCollection({
  name: 'blog',
  directory: 'src/content/blog',
  include: '**/*.mdx',
  schema: (z) => ({
    title: z.string(),
    date: z.string(),
    summary: z.string(),
    modifiedTime: z.string().optional(),
    tags: z.array(z.string()).optional(),
    published: z.boolean().default(true),
    locale: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
          },
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['anchor'],
            },
          },
        ],
      ],
    })
    return {
      ...document,
      body,
      url: `/blog/${document.slug || document._meta.path}`, // ADDED: URL field for blog posts
    }
  },
})

const projects = defineCollection({
  name: 'projects',
  directory: 'src/content/projects',
  include: '**/*.mdx',
  schema: (z) => ({
    name: z.string(),
    description: z.string(),
    homepage: z.string().optional(),
    github: z.string(),
    techstack: z.array(z.string()),
    selected: z.boolean().optional().default(false),
    locale: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypeSlug],
    })
    return {
      ...document,
      body,
    }
  },
})

const pages = defineCollection({
  name: 'pages',
  directory: 'src/content/pages',
  include: '**/*.mdx',
  schema: (z) => ({
    title: z.string(),
    slug: z.string(),
    locale: z.string(),
  }),
  transform: async (document, context) => {
    const body = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
          },
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['anchor'],
            },
          },
        ],
      ],
    })
    return {
      ...document,
      body,
    }
  },
})

export default defineConfig({
  collections: [blog, projects, pages],
})