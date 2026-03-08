import { BlogMetadata, BlogPost } from '../types/blog'

// Auto-discover all blog posts using Vite's glob import
const blogModules = import.meta.glob<{
  metadata: BlogMetadata
  default: React.ComponentType
}>('../pages/blogs/*.tsx', { eager: true })

export function getAllBlogPosts(): BlogPost[] {
  const posts: BlogPost[] = []

  for (const path in blogModules) {
    const module = blogModules[path]
    if (module.metadata && module.default) {
      posts.push({
        metadata: module.metadata,
        component: module.default
      })
    }
  }

  // Sort by date, newest first
  return posts.sort((a, b) => {
    return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  })
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const posts = getAllBlogPosts()
  return posts.find(post => post.metadata.slug === slug)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
