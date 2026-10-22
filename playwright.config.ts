import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.e2e.ts",
  fullyParallel: true,
  timeout: 60_000,
  workers: 2,
  forbidOnly: Boolean(process.env.CI),
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
  },
  webServer: {
    command: "pnpm start --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
  },
});
