import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // ✅ Important for correct route handling
  build: {
    outDir: "dist", // ✅ Ensure build output matches Render "Publish Directory"
  },
  server: {
    port: 5173, // optional, for local dev only
  },
});
