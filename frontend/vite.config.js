import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  // This 'resolve' section is the critical part that was missing.
  // It tells Vite how to handle import aliases.
  resolve: {
    alias: {
      // This line maps the "@" symbol to your "src" folder.
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})