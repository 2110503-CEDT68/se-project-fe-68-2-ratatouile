import { defineConfig, devices } from "@playwright/test";

const appPort = process.env.PLAYWRIGHT_APP_PORT || "3100";
const mockApiPort = process.env.PLAYWRIGHT_MOCK_API_PORT || "3999";
const baseURL = process.env.BASE_URL || `http://127.0.0.1:${appPort}`;
const mockApiURL = `http://127.0.0.1:${mockApiPort}`;
const slowMo = Number(process.env.PLAYWRIGHT_SLOW_MO || 0);

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["junit", { outputFile: "/tmp/ratatouille-playwright-junit.xml" }],
  ],
  outputDir: "/tmp/ratatouille-playwright-results",
  use: {
    baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      slowMo,
    },
  },
  webServer: [
    {
      command: `PLAYWRIGHT_MOCK_API_PORT=${mockApiPort} node e2e/support/mock-api-server.mjs`,
      url: `${mockApiURL}/__test/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: [
        `NEXT_PUBLIC_API_BASE_URL=${mockApiURL}`,
        `INTERNAL_API_BASE_URL=${mockApiURL}`,
        `NEXTAUTH_URL=${baseURL}`,
        "NEXTAUTH_SECRET=playwright-test-secret",
        `npm run dev -- -p ${appPort}`,
      ].join(" "),
      url: baseURL,
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
