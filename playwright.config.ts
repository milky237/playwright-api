import { defineConfig, devices } from '@playwright/test';
import { on } from 'events';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', {open: 'never'}], ['list']],
  timeout: 10*1000,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    trace: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    // { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'api-testing',
      testDir: './tests/api-tests',
    },
    // {
    //   name: 'ui-tests',
    //   testDir: './tests/ui-tests',
    //   use:{
    //     defaultBrowserType: 'chromium',
    //     launchOptions: {
    //       args: ['--force-dark-mode']
    //     }
    //   }
    // }
  ],
});
