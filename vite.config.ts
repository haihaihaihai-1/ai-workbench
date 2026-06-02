import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: "127.0.0.1",
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react-router") ||
            id.includes("node_modules/react-router-dom") ||
            id.includes("node_modules/@remix-run/router")
          ) {
            return "vendor-react";
          }
          if (id.includes("node_modules/recharts") || id.includes("node_modules/d3-")) {
            return "vendor-charts";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "vendor-icons";
          }
          if (id.includes("node_modules/@radix-ui")) {
            return "vendor-radix";
          }
          if (id.includes("node_modules/motion")) {
            return "vendor-motion";
          }
          if (
            id.includes("node_modules/@tanstack/") ||
            id.includes("node_modules/zustand")
          ) {
            return "vendor-state";
          }
          if (id.includes("node_modules/sonner") || id.includes("node_modules/cmdk")) {
            return "vendor-ui";
          }
          if (
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge") ||
            id.includes("node_modules/class-variance-authority") ||
            id.includes("node_modules/tailwindcss-animate")
          ) {
            return "vendor-utils";
          }
          if (id.includes("node_modules/date-fns")) {
            return "vendor-date";
          }
          return undefined;
        },
      },
    },
  },
});
