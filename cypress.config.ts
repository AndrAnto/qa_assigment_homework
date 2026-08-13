import { defineConfig } from 'cypress';

export default defineConfig({
  allowCypressEnv: false,

  e2e: {
    // Overridable via `--config baseUrl=https://mirror.example.com` for CI resilience if the live site is down.
    baseUrl: 'https://www.online-calculator.com',
    setupNodeEvents(_on, _config) {
      // node event listeners
    },
  },
});
