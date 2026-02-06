import { defineConfig } from 'vite'
import path from 'path'
import electron from 'vite-plugin-electron'

export default defineConfig({
    plugins: [
        electron([
            {
                entry: 'electron/main.ts',
            },
            {
                entry: 'electron/preload.ts',
            },
        ]),
    ],
    resolve: {
        alias: {
            'pdf-lib': path.resolve(__dirname, 'node_modules/pdf-lib/dist/pdf-lib.esm.js'),
        },
    },
    build: {
        outDir: 'dist-electron',
        emptyOutDir: true,
    },
})
