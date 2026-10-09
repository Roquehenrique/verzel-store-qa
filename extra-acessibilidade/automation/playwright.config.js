// @ts-check
// Config própria desse teste extra, separada da suíte principal (../../playwright.config.js).
// Fica num arquivo à parte justamente pra não rodar junto do "npm test" da raiz do projeto.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
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
