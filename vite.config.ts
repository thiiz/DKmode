import preact from '@preact/preset-vite'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    preact(),
    {
      name: 'copy-extension-files',
      closeBundle() {
        // Copy popup.html to root of dist folder and fix paths
        const popupSrc = resolve(__dirname, 'dist/src/popup/popup.html')
        const popupDest = resolve(__dirname, 'dist/popup.html')
        if (existsSync(popupSrc)) {
          let content = readFileSync(popupSrc, 'utf-8')
          // Fix relative paths - remove ../../ since files are in same directory
          content = content.replace(/src="\.\.\/\.\.\/popup\.js"/g, 'src="./popup.js"')
          content = content.replace(/href="\.\.\/\.\.\/style\.css"/g, 'href="./style.css"')
          writeFileSync(popupDest, content)
        }

        // Copy content.css to root of dist folder
        const cssSrc = resolve(__dirname, 'src/content/content.css')
        const cssDest = resolve(__dirname, 'dist/content.css')
        if (existsSync(cssSrc)) {
          copyFileSync(cssSrc, cssDest)
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.html'),
        content: resolve(__dirname, 'src/content/content.js'),
        background: resolve(__dirname, 'src/background/background.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          // Keep CSS files in root, other assets in their folders
          if (assetInfo.name?.endsWith('.css')) {
            return '[name].[ext]'
          }
          return 'assets/[name].[ext]'
        },
        // Prevent code splitting for Chrome extension compatibility
        manualChunks: undefined,
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
    // Disable CSS code splitting
    cssCodeSplit: false,
  },
  publicDir: 'public'
})
