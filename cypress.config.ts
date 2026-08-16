import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import allureWriter from '@shelex/cypress-allure-plugin/writer';

export default defineConfig({
  e2e: {
    // Overridable via `--config baseUrl=https://mirror.example.com` for CI resilience if the live site is down.
    baseUrl: 'https://www.online-calculator.com',
    specPattern: 'cypress/e2e/features/**/*.feature',
    async setupNodeEvents(on, config) {
      // Required so the cucumber preprocessor can generate reports and resolve step definitions.
      await addCucumberPreprocessorPlugin(on, config);

      on(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        }),
      );

      allureWriter(on, config);

      return config;
    },
  },
});
