import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/Protein-Purification-Strategy-Explorer/",
  plugins: [react()],
  build: { outDir: "dist", emptyOutDir: true },
});
