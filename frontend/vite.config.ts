// vite.config.ts (v /Users/vojta/Bakalarska/repo/frontend/vite.config.ts)
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        outDir: resolve(__dirname, '../src/main/resources/static'), // uprav podle přesného názvu složky resources
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                dashboard: resolve(__dirname, 'dashboard.html'),
            },
        },
    },
});
