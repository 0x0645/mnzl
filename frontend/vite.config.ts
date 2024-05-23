import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: 'frontend',
    origin: 'http://localhost:8000',
    port: 8000,
  },
  plugins: [react()],
})
