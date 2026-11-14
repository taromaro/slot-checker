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
        statements: 50,
        branches: 70,
        functions: 60,
        lines: 49,
        // ロジック（状態・計算）は高い水準を求める
        "src/{hooks,logic}/**": {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90,
        },
      },
    },
  },
  base: "/slot-checker/",
});
