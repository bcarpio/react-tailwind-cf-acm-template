import path from "path"
import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'

export default defineConfig(({ mode, command, isSsrBuild }) => {
  // Copy appropriate robots.txt based on environment (only for client build)
  if (!isSsrBuild && command === 'build') {
    fs.copyFileSync(
      `public/robots.${mode === 'development' ? 'dev' : 'prod'}.txt`,
      'public/robots.txt'
    )
  }

  const robotMetaTag =
    mode === 'development'
      ? '<meta name="robots" content="noindex, nofollow">'
      : '<meta name="robots" content="index, follow">'

  const injectRobotMeta: Plugin = {
    name: 'inject-robots-meta',
    transformIndexHtml(html) {
      return html.replace('%ROBOT_META%', robotMetaTag)
    }
  }

  return {
    plugins: [react(), injectRobotMeta],
    css: {
      postcss: {
        plugins: [
          tailwindcss(),
          autoprefixer()
        ]
      }
    },
    server: {
      host: true,
      port: 5173
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: isSsrBuild ? {
        input: './src/entry-server.tsx',
        output: {
          format: 'es',
          entryFileNames: 'entry-server.js',
        }
      } : undefined
    },
    ssr: {
      // Don't externalize dependencies for SSR build
      noExternal: isSsrBuild ? true : undefined
    }
  }
})
