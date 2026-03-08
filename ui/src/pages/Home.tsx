import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero */}
        <div className="animated-gradient py-24 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
                Welcome to My Site
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
                A modern React + Tailwind CSS site powered by AWS CloudFront, with auto-discovered blogs and SSG.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/blogs"
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-lg font-medium"
                >
                  Read the Blog
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3 border border-white text-white hover:bg-white hover:text-gray-900 rounded-md text-lg font-medium"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What's Included</h2>
              <p className="mt-4 text-lg text-gray-600">Everything you need to launch a modern static site</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">React + Tailwind</h3>
                <p className="text-gray-600">
                  React 19 with TypeScript, Tailwind CSS v4, and Vite for fast builds. SSR/SSG for SEO.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AWS Infrastructure</h3>
                <p className="text-gray-600">
                  CloudFront CDN, S3 hosting, ACM SSL certificates, Route53 DNS - all via Terraform.
                </p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-Discovered Blogs</h3>
                <p className="text-gray-600">
                  Drop a TSX file in the blogs folder with metadata - it's automatically indexed and sitemap'd.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
