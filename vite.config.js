import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";
import libraryAdmin from "./vite-plugin-library-admin.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), libraryAdmin()],
})
