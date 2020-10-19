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
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  let options = {
    failOnStatusCode: false,
    mode: 'cors',
    credentials: 'include'
  };
  const token = Cypress.env('cust_auth_token');
  if (token) {
    options.auth = {
      bearer: token
    };
  }
  if (typeof args[0] === 'object') {
    options = {...args[0]};
  } else if (args.length === 1) {
    [options.url] = args;
  } else if (args.length === 2) {
    [options.method, options.url] = args;
  } else if (args.length === 3) {
    [options.method, options.url, options.body] = args;
  }

  return originalFn({...options});
});
Cypress.Commands.add('login', () => {
  cy.request('POST', '/jwt/login', {
    username: 'username1',
    password: 'p2ssword'
  }).then(response => {
    const {body} = response;
    const token = body.data[0].token;
    Cypress.env('cust_auth_token', token); 
  });
});

Cypress.Commands.add('logout', () => {
  cy.request('POST', '/jwt/logout').then(response => {
    Cypress.env('cust_auth_token', null);
  });
});
