// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/step-definitions/**/*.js',
  // @known-bug: a confirmed bug (see bugs/) - kept as documentation, not run as a test that's
  // expected to fail on purpose. @documentation: a note that isn't really an automatable check.
  tags: 'not @known-bug and not @documentation',
});

module.exports = defineConfig({
  testDir,
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'tests/html-report', open: 'never' }]],
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
