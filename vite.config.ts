import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    base: './',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'pdf-lib': path.resolve(__dirname, 'node_modules/pdf-lib/dist/pdf-lib.esm.js'),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
    },
})
