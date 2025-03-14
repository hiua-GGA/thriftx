// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Declare global Cypress namespace to add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a user
       * @example cy.login('user@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to create a test product
       * @example cy.createTestProduct({ name: 'Test Product', price: 19.99 })
       */
      createTestProduct(product: any): Chainable<any>;
      
      /**
       * Custom command to clean up test data
       * @example cy.cleanupTestData()
       */
      cleanupTestData(): Chainable<void>;
      
      /**
       * Custom command to select DOM element by data-testid attribute
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to check if an element is visible in viewport
       * @example cy.get('.element').isVisibleInViewport()
       */
      isVisibleInViewport(): Chainable<boolean>;
    }
  }
}

// Custom command to get element by test ID
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Custom command to check if element is visible in viewport
Cypress.Commands.add('isVisibleInViewport', { prevSubject: true }, (subject) => {
  const element = subject[0];
  
  return new Cypress.Promise((resolve) => {
    const observer = new IntersectionObserver((entries) => {
      observer.disconnect();
      resolve(entries[0].isIntersecting);
    });
    
    observer.observe(element);
  });
});

// Prevent TypeScript from showing errors for custom commands
export {}; 