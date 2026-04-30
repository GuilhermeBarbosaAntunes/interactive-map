import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    include: [
      "test/**/*.{test,spec}.ts",
      "test/**/*.{test,spec}.tsx",
    ],
    exclude: [
      "node_modules",
      "dist",
      "coverage",
      "**/*.e2e.*",
    ],

    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.d.ts",
        "src/**/types/**",
        "src/**/mocks/**",
        "src/**/setupTests.ts",
      ],
    },
  },
});