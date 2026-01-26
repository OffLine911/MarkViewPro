import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'markdown-vendor': ['react-markdown', 'remark-gfm', 'remark-math', 'rehype-raw', 'rehype-katex'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    strictPort: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['monaco-editor', 'mermaid'],
  },
})
