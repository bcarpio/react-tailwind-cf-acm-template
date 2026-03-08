import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '../dist')
const distServerPath = path.join(__dirname, '../dist-server')
const srcPath = path.join(__dirname, '../src')

// TODO: Update this to your production domain
const CANONICAL_ORIGIN = 'https://www.example.com'

// Extract a string value from a TS/JS object literal, handling escaped quotes
function extractStringValue(content, key) {
  // Try single-quoted string (handles escaped apostrophes like \')
  const singleQuoteRe = new RegExp(key + ":\\s*'((?:[^'\\\\]|\\\\.)*)'")
  const singleMatch = content.match(singleQuoteRe)
  if (singleMatch) {
    return singleMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"')
  }
  // Try double-quoted string (handles escaped quotes like \")
  const doubleQuoteRe = new RegExp(key + ':\\s*"((?:[^"\\\\]|\\\\.)*)"')
  const doubleMatch = content.match(doubleQuoteRe)
  if (doubleMatch) {
    return doubleMatch[1].replace(/\\"/g, '"').replace(/\\'/g, "'")
  }
  return null
}

// Escape a string for safe use inside an HTML attribute (content="...")
function escapeHtmlAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Extract metadata from a TSX file
function extractMetadata(content) {
  const title = extractStringValue(content, 'title')
  const description = extractStringValue(content, 'description')
  const slug = extractStringValue(content, 'slug')
  const date = extractStringValue(content, 'date')
  return { title, description, slug, date }
}

// Discover blog posts by scanning the blogs directory
async function discoverBlogPosts() {
  const blogFiles = await glob('pages/blogs/*.tsx', { cwd: srcPath })
  const blogPosts = []

  for (const file of blogFiles) {
    const filePath = path.join(srcPath, file)
    const content = fs.readFileSync(filePath, 'utf-8')
    const { title, description, slug, date } = extractMetadata(content)

    if (title && description && slug) {
      blogPosts.push({ title, description, slug, date })
    }
  }

  return blogPosts
}

// Static routes to prerender
const staticRoutes = [
  { path: '/', file: 'index.html' },
  { path: '/about', file: 'about.html' },
  { path: '/blogs', file: 'blogs.html' },
  { path: '/contact', file: 'contact.html' },
  { path: '/privacy', file: 'privacy.html' },
]

// Route-specific meta tags
// TODO: Update these with your site's content
const routeMeta = {
  '/': {
    title: 'My Site - Home',
    description: 'Welcome to my site. A modern React + Tailwind CSS site powered by AWS CloudFront.'
  },
  '/about': {
    title: 'About - My Site',
    description: 'Learn about us and what we do.'
  },
  '/blogs': {
    title: 'Blog - My Site',
    description: 'Read our latest blog posts and insights.'
  },
  '/contact': {
    title: 'Contact - My Site',
    description: 'Get in touch with us.'
  },
  '/privacy': {
    title: 'Privacy Policy - My Site',
    description: 'Our privacy policy.'
  }
}

// Generate HTML for a route using SSR
async function generateHtmlForRoute(render, template, route, meta) {
  const { html: appHtml } = render(route.path)

  const safeTitle = escapeHtmlAttr(meta.title)
  const safeDesc = escapeHtmlAttr(meta.description)
  const canonicalUrl = `${CANONICAL_ORIGIN}${route.path}`

  let html = template
    .replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`)
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${safeDesc}" />`
    )
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  // Add canonical link and Open Graph tags
  const seoTags = `
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />`

  html = html.replace('</head>', `${seoTags}\n</head>`)

  const filePath = path.join(distPath, route.file)
  fs.writeFileSync(filePath, html)
  console.log(`Generated ${route.file}`)
}

// Generate sitemap.xml
function generateSitemap(blogPosts) {
  const staticUrls = [
    { loc: `${CANONICAL_ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
    { loc: `${CANONICAL_ORIGIN}/about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${CANONICAL_ORIGIN}/blogs`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${CANONICAL_ORIGIN}/contact`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${CANONICAL_ORIGIN}/privacy`, priority: '0.3', changefreq: 'yearly' },
  ]

  const blogUrls = blogPosts.map(post => ({
    loc: `${CANONICAL_ORIGIN}/blogs/${post.slug}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: post.date || new Date().toISOString().split('T')[0]
  }))

  const allUrls = [...staticUrls, ...blogUrls]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`

  const sitemapPath = path.join(distPath, 'sitemap.xml')
  fs.writeFileSync(sitemapPath, sitemap)
  console.log(`Generated sitemap.xml with ${allUrls.length} URLs`)
}

// Main execution
async function main() {
  console.log('Starting static site generation with SSR...\n')

  // Read the built index.html as template
  const template = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8')

  // Import the SSR render function
  const { render } = await import(path.join(distServerPath, 'entry-server.js'))

  // Generate static routes
  for (const route of staticRoutes) {
    const meta = routeMeta[route.path]
    await generateHtmlForRoute(render, template, route, meta)
  }

  // Discover and generate blog post pages
  const blogPosts = await discoverBlogPosts()
  console.log(`\nFound ${blogPosts.length} blog post(s)`)

  // Create blogs directory if it doesn't exist
  const blogsDir = path.join(distPath, 'blogs')
  if (!fs.existsSync(blogsDir)) {
    fs.mkdirSync(blogsDir, { recursive: true })
  }

  for (const post of blogPosts) {
    const route = {
      path: `/blogs/${post.slug}`,
      file: `blogs/${post.slug}.html`
    }

    const meta = {
      title: `${post.title} - Blog`,
      description: post.description
    }

    await generateHtmlForRoute(render, template, route, meta)
  }

  // Generate sitemap with all URLs including blog posts
  generateSitemap(blogPosts)

  console.log('\nStatic site generation complete!')
}

main().catch(err => {
  console.error('Error during static site generation:', err)
  process.exit(1)
})
