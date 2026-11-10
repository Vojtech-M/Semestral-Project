import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(process.cwd(), 'index.html'),
                form: resolve(process.cwd(), 'form.html'),
                schools: resolve(process.cwd(), 'schools.html'),
                registrations: resolve(process.cwd(), 'registrations.html'),
            },
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
