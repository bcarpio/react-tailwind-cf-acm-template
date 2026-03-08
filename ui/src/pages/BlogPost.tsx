import { useParams, Navigate } from 'react-router-dom'
import { getBlogPostBySlug } from '../utils/blogUtils'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()

  if (!slug) {
    return <Navigate to="/blogs" replace />
  }

  const post = getBlogPostBySlug(slug)

  if (!post) {
    return <Navigate to="/blogs" replace />
  }

  const PostComponent = post.component
  return <PostComponent />
}
