import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  root: "./ui",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./ui/src"),
      "components": path.resolve(__dirname, "./ui/src/components"),
      "shadcn": path.resolve(__dirname, "./ui/src/components/shadcn"),
      "utils": path.resolve(__dirname, "./ui/src/utils"),
      "hooks": path.resolve(__dirname, "./ui/src/hooks"),
      "apis": path.resolve(__dirname, "./ui/src/apis"),
    },
  },
});
