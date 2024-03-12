import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    env: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      API_URL: 'http://localhost:5000/api',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    API_URL: 'http://localhost:5000/api',
  },
  video: false,
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  retries: 2,
});
