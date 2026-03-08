export interface BlogMetadata {
  title: string
  description: string
  date: string // YYYY-MM-DD format
  slug: string
  author: string
  tags?: string[]
}

export interface BlogPost {
  metadata: BlogMetadata
  component: React.ComponentType
}
