/** @format */

// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import { http, worker } from "../../mocks/worker";

Cypress.on("test:before:run:async", async () => {
  // start msw mocking before any tests are run
  console.log("starting msw");
  await worker.start({ quiet: false });
});

Cypress.on("window:before:load", (window) => {
  // regular cy.intercept() should probably be used to fake network errors etc.
  // bu make worker and http available to the page (just in case)

  // Example usage inside a test:
  // cy.window().then(window => {
  //   const { http, worker } = window.msw;
  //   worker.use(() => {
  //     http.get('**/api/products', (req, res, ctx) => {
  //       return res(ctx.json([]));
  //     });
  //   });
  // });

  console.log("setting up msw");
  if (!window.msw) window.msw = { http, worker };
});

Cypress.on("test:after:run", () => {
  // stop msw mocking after all tests are run
  worker.stop();
});

// Global beforeEach for all e2e tests
beforeEach(() => {
  // Reset any runtime handlers tests may use.
  // using cy.intercept() instead of direct manipulation should make this unnecessary
  cy.window().then((window) => {
    if (window?.msw?.worker) {
      console.log("resetting msw handlers");
      const { worker } = window.msw;
      worker.resetHandlers();
    }
  });
});
