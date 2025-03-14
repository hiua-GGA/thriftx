// ***********************************************************
// This example support/e2e.ts is processed and
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
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests in the command log
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.setAttribute('data-hide-command-log-request', '');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  app.document.head.appendChild(style);
}

// Preserve cookies between tests
Cypress.Cookies.defaults({
  preserve: ['token', 'session_id', 'remember_email'],
});

// Add custom command to login programmatically
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// Add custom command to create a test product
Cypress.Commands.add('createTestProduct', (product: any) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/products`,
    body: product,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  }).then((response) => {
    return response.body;
  });
});

// Add custom command to clean up test data
Cypress.Commands.add('cleanupTestData', () => {
  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('apiUrl')}/api/test/cleanup`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
}); 