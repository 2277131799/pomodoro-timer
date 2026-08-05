import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'out/main',
      lib: {
        entry: path.resolve('src/main/index.ts'),
        formats: ['cjs'],
        fileName: () => 'index.js',
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'out/preload',
      lib: {
        entry: path.resolve('src/preload/index.ts'),
        formats: ['cjs'],
        fileName: () => 'index.js',
      },
    },
  },
  renderer: {
    root: path.resolve('src/renderer'),
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: path.resolve('src/renderer/index.html'),
      },
    },
    plugins: [react(), tailwindcss()],
  },
})
