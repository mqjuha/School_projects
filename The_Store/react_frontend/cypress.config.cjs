/** @format */

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  screenshotOnRunFailure: false,
  video: false,
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    configFile: "reporter-config.json",
  },
  // debug on
  chromeWebSecurity: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "src/tests/cypress/support/e2e.js",
    downloadsFolder: "src/tests/cypress/downloads",
    fixturesFolder: "src/tests/cypress/fixtures",
    specPattern: "src/tests/cypress/e2e/",
    // reporter: "cypress-multi-reporters",
    // reporterOptions: {
    //   configFile: "reporter-config.json",
    // },
  },
});
