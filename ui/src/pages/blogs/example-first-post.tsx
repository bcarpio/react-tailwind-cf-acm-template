import { BlogMetadata } from '../../types/blog'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Link } from 'react-router-dom'

export const metadata: BlogMetadata = {
  title: 'Welcome to the Blog',
  description: 'This is an example blog post demonstrating the auto-discovery blog system. Drop a TSX file in the blogs folder with exported metadata and it appears automatically.',
  date: '2025-01-01',
  slug: 'example-first-post',
  author: 'Your Name',
  tags: ['Getting Started', 'Template']
}

export default function ExampleFirstPost() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <article className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
                {metadata.title}
              </h1>
              <div className="flex items-center text-gray-600 space-x-4">
                <span>{metadata.author}</span>
                <span>•</span>
                <time dateTime={metadata.date}>
                  {new Date(metadata.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed">
                This is an example blog post that demonstrates the auto-discovery blog system.
                When you create a new <code>.tsx</code> file in the <code>src/pages/blogs/</code> directory
                with an exported <code>metadata</code> object, it automatically appears in the blog index.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-8">How It Works</h2>

              <p>
                The blog system uses Vite's <code>import.meta.glob()</code> to discover all TSX files
                in the blogs directory at build time. Each file must export:
              </p>

              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li><strong>metadata</strong> - A <code>BlogMetadata</code> object with title, description, date, slug, and author</li>
                <li><strong>default component</strong> - The React component that renders the blog post</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mt-8">Creating a New Post</h2>

              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>Create a new file in <code>ui/src/pages/blogs/</code> (e.g., <code>my-new-post.tsx</code>)</li>
                <li>Export a <code>metadata</code> object with the required fields</li>
                <li>Export a default component with your blog content</li>
                <li>The post appears automatically - no routing changes needed</li>
              </ol>

              <h2 className="text-2xl font-bold text-gray-900 mt-8">Static Site Generation</h2>

              <p>
                During the build process, the SSG script (<code>scripts/generate-static.js</code>)
                discovers all blog posts, generates individual HTML pages for each one, and creates
                a sitemap.xml with all URLs. This gives you full SEO support with pre-rendered content.
              </p>
            </div>

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <Link
                to="/blogs"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                <svg className="mr-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to all posts
              </Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
