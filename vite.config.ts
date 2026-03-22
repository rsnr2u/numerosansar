import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    base: '/',
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('jspdf')) return 'vendor-jspdf';
                        if (id.includes('html2canvas')) return 'vendor-html2canvas';
                        if (id.includes('xlsx')) return 'vendor-xlsx';
                        if (id.includes('lucide')) return 'vendor-icons';
                        return 'vendor';
                    }
                }
            }
        }
    },
    server: {
        port: 3000,
        open: false,
    },
});
