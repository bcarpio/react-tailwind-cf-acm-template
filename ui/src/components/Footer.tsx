export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              My Site
            </h3>
            <p className="mt-4 text-base text-gray-500">
              Your site tagline goes here.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Navigation
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/" className="text-base text-gray-500 hover:text-gray-900">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-base text-gray-500 hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="/blogs" className="text-base text-gray-500 hover:text-gray-900">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Resources
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} My Site. All rights reserved.
            </p>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
