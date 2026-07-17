import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Large MP4s lock on Windows and crash the file watcher
      ignored: ['**/public/videos/**', '**/*.mp4'],
    },
  },
})
