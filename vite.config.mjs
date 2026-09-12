import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Matches a package directory under node_modules on either path separator.
const pkg = (names) => new RegExp("node_modules[\\\\/](" + names.join("|") + ")[\\\\/]");

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 4173,
  },
  build: {
    outDir: "dist",
    target: "es2020",
    rolldownOptions: {
      output: {
        // Stable vendor chunks so a copy edit does not re-fingerprint React.
        codeSplitting: {
          groups: [
            { name: "react", test: pkg(["react", "react-dom", "scheduler"]) },
            { name: "motion", test: pkg(["framer-motion", "motion-dom", "motion-utils"]) },
            { name: "i18n", test: pkg(["i18next", "react-i18next", "i18next-browser-languagedetector"]) },
          ],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.js",
    css: false,
  },
});
