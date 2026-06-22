import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';
import { buildWsEndpoint } from './utils/capabilities';

/**
 * Two run modes:
 *  - Local (default):  `npm test`        — runs Chromium + Firefox locally.
 *  - Cloud:             `npm run test:cloud` — runs on TestMu AI's grid
 *    across Windows 10 / Chromium and macOS Catalina / Firefox in parallel,
 *    satisfying the assignment's "at least 2 browser/OS combinations" rule.
 */
const isCloud = process.env.RUN_ON === 'cloud';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'https://www.testmuai.com',
    // Network logs, video, screenshots, and console logs enabled for every run,
    // satisfying the assignment's logging requirement at the Playwright level.
    // The TestMu AI-specific network/video/console capabilities are set
    // separately in utils/capabilities.ts for cloud runs.
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },

  projects: isCloud
    ? [
        {
          name: 'Windows 10 - Chromium',
          use: {
            browserName: 'chromium',
            connectOptions: {
              wsEndpoint: buildWsEndpoint({
                platform: 'Windows 10',
                browserName: 'pw-chromium',
                browserVersion: 'latest',
              }),
            },
          },
        },
        {
          name: 'macOS Catalina - Firefox',
          use: {
            browserName: 'firefox',
            connectOptions: {
              wsEndpoint: buildWsEndpoint({
                platform: 'macOS Catalina',
                browserName: 'pw-firefox',
                browserVersion: 'latest',
              }),
            },
          },
        },
      ]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      ],
});
