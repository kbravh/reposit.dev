import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // eslint-disable-next-line no-undef
  forbidOnly: !!process.env.CI,
  // eslint-disable-next-line no-undef
  retries: process.env.CI ? 2 : 0,
  // eslint-disable-next-line no-undef
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    // eslint-disable-next-line no-undef
    reuseExistingServer: !process.env.CI,
    env: {
      // eslint-disable-next-line no-undef
      DATABASE_URL: process.env.DATABASE_URL || '',
      // eslint-disable-next-line no-undef
      DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN || '',
      // eslint-disable-next-line no-undef
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || '',
      // eslint-disable-next-line no-undef
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || '',
      // eslint-disable-next-line no-undef
      GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
      // eslint-disable-next-line no-undef
      GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
      // eslint-disable-next-line no-undef
      SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || '',
    },
  },
});
