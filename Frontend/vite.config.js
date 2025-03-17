import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: mode === "development"
    ? {
        proxy: {
          "/api": {
            target: process.env.VITE_BACKEND_URL || "http://localhost:4002",
            changeOrigin: true,
          },
        },
      }
    : {},
}));
