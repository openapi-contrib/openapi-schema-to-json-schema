import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    threads: false,
    isolate: false,
    reporters: "verbose",
  },
  esbuild: {
    target: "node10",
  },
});
