import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Privacy from './pages/Privacy'
import BlogIndex from './pages/BlogIndex'
import BlogPost from './pages/BlogPost'
import NotFound from './pages/NotFound'

export function render(url: string, _context: any = {}) {
  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<BlogIndex />} />
          <Route path="/blogs/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </StaticRouter>
    </React.StrictMode>
  )
  return { html }
}
