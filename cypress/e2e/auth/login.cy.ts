describe('Login Page', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/login');
  });

  it('should display the login form', () => {
    // Check if the login form elements are visible
    cy.get('h1').should('contain', 'Login');
    cy.get('form').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should show validation errors for empty fields', () => {
    // Submit the form without filling in any fields
    cy.get('button[type="submit"]').click();

    // Check if validation errors are displayed
    cy.get('form').contains('Email is required').should('be.visible');
    cy.get('form').contains('Password is required').should('be.visible');
  });

  it('should show error for invalid email format', () => {
    // Enter an invalid email format
    cy.get('input[type="email"]').type('invalid-email');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Check if validation error for invalid email is displayed
    cy.get('form').contains('Invalid email format').should('be.visible');
  });

  it('should show error for incorrect credentials', () => {
    // Enter credentials that don't exist in the system
    cy.get('input[type="email"]').type('nonexistent@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check if error message for incorrect credentials is displayed
    cy.get('[data-testid="login-error"]').should('be.visible');
    cy.get('[data-testid="login-error"]').should('contain', 'Invalid email or password');
  });

  it('should successfully log in with valid credentials', () => {
    // Intercept the login API request
    cy.intercept('POST', '/api/auth/login').as('loginRequest');

    // Enter valid credentials (this would be a test user in your system)
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Wait for the login request to complete
    cy.wait('@loginRequest').then((interception) => {
      // Check if the request was successful
      expect(interception.response?.statusCode).to.be.oneOf([200, 201]);
    });

    // Check if the user is redirected to the dashboard or home page
    cy.url().should('include', '/dashboard');
    
    // Check if the user's name is displayed in the header
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should navigate to forgot password page', () => {
    // Click on the forgot password link
    cy.contains('Forgot password?').click();

    // Check if the user is redirected to the forgot password page
    cy.url().should('include', '/forgot-password');
  });

  it('should navigate to registration page', () => {
    // Click on the register link
    cy.contains('Create an account').click();

    // Check if the user is redirected to the registration page
    cy.url().should('include', '/register');
  });

  it('should remember user email when "Remember me" is checked', () => {
    // Enter email and check "Remember me"
    const testEmail = 'test@example.com';
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="checkbox"]').check();
    
    // Submit the form (we'll intercept and mock the response)
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: { success: true }
    }).as('loginRequest');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    
    // Now navigate back to login page
    cy.visit('/login');
    
    // Email should be pre-filled
    cy.get('input[type="email"]').should('have.value', testEmail);
  });
}); 