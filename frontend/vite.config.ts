import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: '../src/main/resources/static',  // cesta relativně ke složce s frontendem
        emptyOutDir: true                        // povolí mazání složky mimo root projektu
    }
});