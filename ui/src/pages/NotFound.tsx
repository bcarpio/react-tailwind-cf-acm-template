import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFound() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-6xl font-bold text-primary-400 mb-4">404</p>
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                Page Not Found
              </h1>
              <p className="mt-4 text-lg text-gray-300">
                The page <code className="bg-slate-700 px-2 py-1 rounded text-primary-300">{location.pathname}</code> doesn't exist.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Here's what you might be looking for:
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link
                to="/"
                className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 mb-2">
                  Home
                </h3>
                <p className="text-gray-600 text-sm">
                  Start from the homepage.
                </p>
              </Link>

              <Link
                to="/about"
                className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 mb-2">
                  About
                </h3>
                <p className="text-gray-600 text-sm">
                  Learn about us.
                </p>
              </Link>

              <Link
                to="/blogs"
                className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 mb-2">
                  Blog
                </h3>
                <p className="text-gray-600 text-sm">
                  Read our latest posts.
                </p>
              </Link>

              <Link
                to="/contact"
                className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 mb-2">
                  Contact
                </h3>
                <p className="text-gray-600 text-sm">
                  Get in touch with us.
                </p>
              </Link>
            </div>

            <div className="mt-12 text-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
