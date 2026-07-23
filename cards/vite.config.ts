import { defineConfig } from "vite";

// Build the panel as a single self-contained ES module. All deps (Lit) are
// bundled so Home Assistant can load it directly via module_url.
export default defineConfig({
  build: {
    lib: {
      entry: "src/main.ts",
      formats: ["es"],
      fileName: () => "puppy-tracker-panel.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    target: "es2021",
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
