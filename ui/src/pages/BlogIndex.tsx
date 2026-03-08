import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getAllBlogPosts, formatDate } from '../utils/blogUtils'

const POSTS_PER_PAGE = 5

export default function BlogIndex() {
  const [searchParams] = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const allPosts = getAllBlogPosts()
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)

  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const currentPosts = allPosts.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Blog
              </h1>
              <p className="mt-2 text-lg text-gray-300">
                Latest posts and insights
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Blog Posts */}
            <div className="max-w-4xl mx-auto">
              <div className="space-y-12">
                {currentPosts.map((post) => (
                  <article
                    key={post.metadata.slug}
                    className="border-b border-gray-200 pb-12 last:border-b-0"
                  >
                    <div className="flex flex-col space-y-4">
                      {/* Date and Author */}
                      <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <time dateTime={post.metadata.date}>
                          {formatDate(post.metadata.date)}
                        </time>
                        <span>•</span>
                        <span>{post.metadata.author}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl font-bold text-gray-900 hover:text-primary-600">
                        <Link to={`/blogs/${post.metadata.slug}`}>
                          {post.metadata.title}
                        </Link>
                      </h2>

                      {/* Description */}
                      <p className="text-lg text-gray-600">
                        {post.metadata.description}
                      </p>

                      {/* Tags */}
                      {post.metadata.tags && post.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.metadata.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Read More Link */}
                      <div>
                        <Link
                          to={`/blogs/${post.metadata.slug}`}
                          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Read more
                          <svg
                            className="ml-2 w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center space-x-4">
                  {currentPage > 1 ? (
                    <Link
                      to={`/blogs?page=${currentPage - 1}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="px-4 py-2 border border-gray-300 text-gray-400 rounded-md cursor-not-allowed">
                      Previous
                    </span>
                  )}

                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        to={`/blogs?page=${page}`}
                        className={`px-4 py-2 rounded-md ${
                          page === currentPage
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                  </div>

                  {currentPage < totalPages ? (
                    <Link
                      to={`/blogs?page=${currentPage + 1}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="px-4 py-2 border border-gray-300 text-gray-400 rounded-md cursor-not-allowed">
                      Next
                    </span>
                  )}
                </div>
              )}

              {/* No Posts Message */}
              {allPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No blog posts yet. Check back soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
