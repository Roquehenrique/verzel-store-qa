// @ts-check
// Separate config for this extra, self-contained suite - not part of the official scope,
// so it doesn't run together with the main "npm test".
const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'step-definitions/**/*.js',
  tags: 'not @known-bug',
});

module.exports = defineConfig({
  testDir,
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'relatorio-html', open: 'never' }]],
  use: {
    baseURL: 'https://verzel-store.qa-test-verzel-store.workers.dev',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
