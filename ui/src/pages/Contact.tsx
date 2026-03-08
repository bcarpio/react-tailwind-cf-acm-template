import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                Contact Us
              </h1>
              <p className="mt-2 text-lg text-gray-300">
                We'd love to hear from you
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  Have questions or want to learn more? Reach out to us using any of the methods below.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                      <a href="mailto:support@example.com" className="text-primary-600 hover:text-primary-700">
                        support@example.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                      <a href="tel:+15555555555" className="text-primary-600 hover:text-primary-700">
                        (555) 555-5555
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <svg className="w-6 h-6 text-primary-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                      <p className="text-gray-600">
                        123 Main Street<br />
                        Suite 100<br />
                        Anytown, USA 12345
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hours / Additional Info */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h2>
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="font-medium text-gray-900">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="font-medium text-gray-900">10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium text-gray-900">Closed</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-primary-50 rounded-xl border border-primary-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Response</h3>
                  <p className="text-gray-600">
                    We typically respond to all inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
