import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, 
    allowedHosts: [
      'c94dd77213b8.ngrok-free.app' // exact hostname of your ngrok URL
    ]
  }
})
