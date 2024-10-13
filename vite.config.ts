import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env': {
        VITE_FRONTEND_URL: env.VITE_FRONTEND_URL,
        VITE_BACKEND_URL: env.VITE_BACKEND_URL,
        VITE_RUNNER_URL: env.VITE_RUNNER_URL,
        VITE_AUTH0_DOMAIN: env.VITE_AUTH0_DOMAIN,
        VITE_AUTH0_AUDIENCE: env.VITE_AUTH0_AUDIENCE,
        VITE_AUTH0_CLIENT_ID: env.VITE_AUTH0_CLIENT_ID,
      }
    },
    plugins: [react()],
  }
})
