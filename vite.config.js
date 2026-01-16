import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 添加这一行，注意前后都要有斜杠
  base: '/east-africa-budget/', 
})
