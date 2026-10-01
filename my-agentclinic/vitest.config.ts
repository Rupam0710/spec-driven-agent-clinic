import { defineConfig } from "vitest/config";

export default defineConfig({
  oxc: {
    transform: {
      jsxImportSource: "hono/jsx",
    },
  },
  test: {
    // Each test file runs against a fresh, throwaway in-memory SQLite database
    // (src/data/db.ts reads DATABASE_PATH), so tests stay isolated and leave no
    // files behind. Reference data is re-seeded per run; no appointments carry over.
    env: {
      DATABASE_PATH: ":memory:",
    },
  },
});
