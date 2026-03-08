import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                About
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed">
                This is a template site built with React, Tailwind CSS, and deployed to AWS
                using CloudFront, S3, ACM, and Route53 - all managed with Terraform.
              </p>
              <p className="text-gray-600 mt-4">
                Replace this content with your own about page.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
