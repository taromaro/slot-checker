import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    coverage: {
      provider: "v8",
      reporter: ["text"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/main.tsx", "src/setupTests.ts", "src/vite-env.d.ts"],
      // 下限を下回ると失敗する。テストを追加したら引き上げること（下げない）
      thresholds: {
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
        // 共通 hook と機種ごとのソース（状態・計算・画面）はすべてテストする
        "src/{hooks,machines}/**": {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },
  },
  base: "/slot-checker/",
});
