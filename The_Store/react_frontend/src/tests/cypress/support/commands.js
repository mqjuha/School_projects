// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// const letRequestThrough = req => {
//   // req.continue(res => {});
// };

// Cypress.Commands.add('stubServer', () => {
//   // login and registration
//   cy.intercept('get', '**/api/check-status', letRequestThrough).as('checkStatus');
//   cy.intercept('post', '**/api/register', letRequestThrough).as('registerUser');
//   cy.intercept('post', '**/api/login', letRequestThrough).as('loginUser');
//   cy.intercept('get', '**/api/logout', letRequestThrough).as('logOut');
//   // products
//   cy.intercept('get', '**/api/products', letRequestThrough).as('getProducts');
//   cy.intercept('post', '**/api/products', letRequestThrough).as('createProduct');
//   cy.intercept('get', '**/api/products/:productId', letRequestThrough).as('getProduct');
//   cy.intercept('put', '**/api/products/:productId', letRequestThrough).as('updateProduct');
//   cy.intercept('delete', '**/api/products/:productId', letRequestThrough).as('deleteProduct');
//   // users
//   cy.intercept('get', '**/api/users', letRequestThrough).as('getUsers');
//   cy.intercept('get', '**/api/users/:userId', letRequestThrough).as('getUser');
//   cy.intercept('put', '**/api/users/:userId', letRequestThrough).as('updateUserRole');
//   cy.intercept('delete', '**/api/users/:userId', letRequestThrough).as('deleteUser');
//   // orders
//   cy.intercept('get', '**/api/orders', letRequestThrough).as('getOrders');
//   cy.intercept('post', '**/api/orders', letRequestThrough).as('createOrder');
//   cy.intercept('get', '**/api/orders/:orderId', letRequestThrough).as('getOrder');
// });
