import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 5173, // Default Vite port
    proxy: {
      "/api": {
        target: process.env.VITE_BACKEND_URL || "http://localhost:4002", // Use Render backend URL
        changeOrigin: true,
      },
    },
  },
});
