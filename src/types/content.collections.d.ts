declare module 'content-collections' {
  interface Page {
    title: string
    slug: string
    locale: string
    body: React.ReactNode
  }

  interface Blog {
    title: string
    date: string
    summary: string
    modifiedTime?: string
    tags?: string[]
    published: boolean
    locale: string
    body: React.ReactNode
    url: string
  }

  interface Project {
    name: string
    description: string
    homepage?: string
    github: string
    techstack: string[]
    selected: boolean
    locale: string
    body: React.ReactNode
  }

  export const allPages: Page[]
  export const allBlogs: Blog[]
  export const allProjects: Project[]
}