import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/Portfolio-de-competences",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        sae: resolve(__dirname, "sae-template.html"),
        saeYears: resolve(__dirname, "sae-annees.html"),
      },
    },
  },
});
