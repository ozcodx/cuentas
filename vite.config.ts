import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-mui-core': ['@mui/material', '@mui/system'],
          'vendor-mui-icons': ['@mui/icons-material'],
          'vendor-mui-pickers': ['@mui/x-date-pickers'],
          'vendor-date': ['date-fns'],
          'vendor-charts': ['recharts'],
          'vendor-utils': [
            'react-firebase-hooks',
            'react-google-button'
          ]
        },
      },
    },
  },
})
