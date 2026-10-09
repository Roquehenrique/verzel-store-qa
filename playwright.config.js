// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

const testDir = defineBddConfig({
  features: 'tests/features/**/*.feature',
  steps: 'tests/step-definitions/**/*.js',
  // @known-bug scenarios run on purpose, as regression tests for confirmed bugs (see bugs/):
  // they describe the CORRECT behavior and fail until the bug is fixed. @documentation is the
  // only tag excluded - it's just a note, there's nothing sensible to automate as a negative proof.
  tags: 'not @documentation',
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
