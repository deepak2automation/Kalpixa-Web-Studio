import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.VERIFY_BASE_URL || 'http://127.0.0.1:4173';
const chromium = process.platform === 'win32' ? { channel: 'chrome' as const } : {};

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { outputFolder: '.qa-artifacts/playwright-report', open: 'never' }]],
  outputDir: '.qa-artifacts/test-results',
  use: { baseURL, reducedMotion: 'reduce', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: process.env.VERIFY_BASE_URL ? undefined : { command: 'node scripts/serve-static.mjs', url: baseURL, env: { PORT: '4173' }, reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], ...chromium, viewport: { width: 1440, height: 1000 } } },
    { name: 'tablet', use: { ...devices['Desktop Chrome'], ...chromium, viewport: { width: 834, height: 1112 }, hasTouch: true } },
    { name: 'mobile', use: { ...devices['Pixel 7'], ...chromium, viewport: { width: 390, height: 844 } } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
