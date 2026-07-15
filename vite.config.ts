import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/protein-purification-strategy-explorer/",
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true },
});
