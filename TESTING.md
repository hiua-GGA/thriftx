# ThriftX Testing Guide

This document provides comprehensive instructions for running tests in the ThriftX application.

## Table of Contents

- [Setup](#setup)
- [Backend Tests](#backend-tests)
- [Frontend Tests](#frontend-tests)
- [End-to-End Tests](#end-to-end-tests)
- [Performance Tests](#performance-tests)
- [Continuous Integration](#continuous-integration)
- [Test Coverage](#test-coverage)
- [Troubleshooting](#troubleshooting)

## Setup

Before running tests, make sure you have installed all dependencies:

```bash
npm install
```

## Backend Tests

Backend tests use Jest and are located in the `server/tests` directory.

### Running Backend Tests

```bash
# Run all backend tests
npm run test:backend

# Run tests in watch mode
npm run test:backend -- --watch

# Run tests with coverage
npm run test:backend -- --coverage
```

### Backend Test Structure

- `server/tests/models/` - Tests for database models
- `server/tests/controllers/` - Tests for API controllers
- `server/tests/middleware/` - Tests for middleware functions
- `server/tests/utils/` - Tests for utility functions

## Frontend Tests

Frontend tests use Jest and React Testing Library and are located in the `client/components/__tests__` and `client/app/__tests__` directories.

### Running Frontend Tests

```bash
# Run all frontend tests
npm run test:frontend

# Run tests in watch mode
npm run test:frontend -- --watch

# Run tests with coverage
npm run test:frontend -- --coverage
```

### Frontend Test Structure

- Component tests are located alongside the components in `__tests__` directories
- Page tests are located in `client/app/**/__tests__` directories

## End-to-End Tests

End-to-end tests use Cypress and are located in the `cypress/e2e` directory.

### Running E2E Tests

```bash
# Start the application in development mode
npm run dev

# In a separate terminal, run Cypress tests
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

### E2E Test Structure

- `cypress/e2e/auth/` - Authentication flow tests
- `cypress/e2e/user/` - User flow tests
- `cypress/e2e/vendor/` - Vendor flow tests
- `cypress/e2e/admin/` - Admin flow tests
- `cypress/e2e/checkout/` - Checkout flow tests

## Performance Tests

Performance tests use Lighthouse and are located in the `performance` directory.

### Running Performance Tests

```bash
# Start the application in production mode
npm run build
npm run start

# In a separate terminal, run performance tests
npm run test:performance

# Run with custom options
npm run test:performance -- --url=http://localhost:3000 --routes=/,/products,/checkout --threshold=85
```

### Performance Test Options

- `--url` - Base URL to test (default: http://localhost:3000)
- `--routes` - Comma-separated list of routes to test (default: /)
- `--threshold` - Performance score threshold (0-100, default: 80)
- `--output` - Output directory for reports (default: ./lighthouse-reports)

## Continuous Integration

Our CI pipeline runs all tests on each pull request and merge to main. The configuration is in `.github/workflows/test.yml`.

## Test Coverage

We aim to maintain at least 70% test coverage for both frontend and backend code. Coverage reports are generated when running tests with the `--coverage` flag.

To view the coverage report:

1. Run tests with coverage: `npm run test:coverage`
2. Open the coverage report: `open coverage/lcov-report/index.html`

## Troubleshooting

### Common Issues

1. **Tests failing due to database connection**
   - Make sure MongoDB is running locally or the MongoDB memory server is properly configured

2. **Cypress tests failing to find elements**
   - Check if selectors have changed
   - Ensure the application is running before starting Cypress tests

3. **Performance tests failing**
   - Ensure you're running the application in production mode
   - Try increasing the threshold for development environments

### Getting Help

If you encounter issues not covered here, please contact the development team or create an issue in the repository. 