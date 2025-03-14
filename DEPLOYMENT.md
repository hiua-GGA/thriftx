# ThriftX Deployment Guide

This document provides detailed instructions for deploying the ThriftX application to production environments.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
- [Backend Deployment (Render)](#backend-deployment-render)
- [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
- [Environment Variables](#environment-variables)
- [CI/CD Pipeline](#cicd-pipeline)
- [Domain Configuration](#domain-configuration)
- [SSL Certificates](#ssl-certificates)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup Strategy](#backup-strategy)
- [Scaling Considerations](#scaling-considerations)
- [Troubleshooting](#troubleshooting)

## Architecture Overview

ThriftX uses a modern architecture with the following components:

- **Frontend**: Next.js application deployed on Vercel
- **Backend**: Node.js/Express API deployed on Render
- **Database**: MongoDB Atlas for data storage
- **File Storage**: Cloudinary for image uploads
- **Payment Processing**: Stripe for payment handling
- **Shipping**: Shippo for shipping rate calculations and label generation
- **Email Service**: SendGrid for transactional emails
- **Caching**: Redis for performance optimization

## Prerequisites

Before deployment, ensure you have:

1. Accounts on the following services:
   - [Vercel](https://vercel.com)
   - [Render](https://render.com)
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - [Cloudinary](https://cloudinary.com)
   - [Stripe](https://stripe.com)
   - [Shippo](https://goshippo.com)
   - [SendGrid](https://sendgrid.com)
   - [GitHub](https://github.com) (for CI/CD)

2. Domain name registered and accessible

3. Node.js and npm installed locally for development and testing

## Frontend Deployment (Vercel)

### Initial Setup

1. Push your code to a GitHub repository
2. Log in to Vercel and create a new project
3. Connect your GitHub repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### Environment Variables

Set up the following environment variables in the Vercel project settings:

```
NEXT_PUBLIC_API_URL=https://api.thriftx.com/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://thriftx.com
```

### Custom Domain Setup

1. Go to the Vercel project settings
2. Navigate to the "Domains" section
3. Add your domain (e.g., `thriftx.com`)
4. Follow the instructions to configure DNS settings

### Deployment

Vercel will automatically deploy your application when you push to the main branch. You can also manually trigger deployments from the Vercel dashboard.

## Backend Deployment (Render)

### Initial Setup

1. Log in to Render and create a new Web Service
2. Connect your GitHub repository
3. Configure the service:
   - Name: `thriftx-api`
   - Environment: Node
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm run start:prod`
   - Auto-Deploy: Yes

### Environment Variables

Set up the environment variables in the Render dashboard:

```
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thriftx?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@thriftx.com
EMAIL_FROM_NAME=ThriftX
SHIPPO_API_KEY=your_shippo_api_key
REDIS_URL=redis://your-redis-instance:6379
CORS_ORIGIN=https://thriftx.com
```

### Custom Domain Setup

1. Go to the Render service settings
2. Navigate to the "Custom Domain" section
3. Add your API subdomain (e.g., `api.thriftx.com`)
4. Follow the instructions to configure DNS settings

## Database Setup (MongoDB Atlas)

### Cluster Creation

1. Log in to MongoDB Atlas
2. Create a new project (if needed)
3. Create a new cluster:
   - Choose a cloud provider and region close to your target audience
   - Select a cluster tier (M10 or higher recommended for production)
   - Configure additional settings as needed

### Database User Setup

1. Navigate to "Database Access" in the security section
2. Create a new database user:
   - Authentication Method: Password
   - Username and Password: Create strong credentials
   - Database User Privileges: Read and write to any database

### Network Access

1. Navigate to "Network Access" in the security section
2. Add IP addresses:
   - Add the IP addresses of your Render service
   - Alternatively, allow access from anywhere (less secure)

### Database Initialization

Run the MongoDB Atlas setup script to create collections and indexes:

```bash
node scripts/mongodb-atlas-setup.js
```

## Environment Variables

Ensure all environment variables are properly set in both Vercel and Render. Use the `.env.example` file as a reference.

### Secret Management

For production, use a secure method to generate and store secrets:

```bash
# Generate a secure random string for JWT secret
openssl rand -base64 64
```

## CI/CD Pipeline

The CI/CD pipeline is configured using GitHub Actions. The workflow file is located at `.github/workflows/ci-cd.yml`.

### Pipeline Stages

1. **Lint**: Checks code quality
2. **Backend Tests**: Runs server-side tests
3. **Frontend Tests**: Runs client-side tests
4. **E2E Tests**: Runs end-to-end tests with Cypress
5. **Performance Tests**: Runs Lighthouse performance tests
6. **Security Scan**: Performs security checks
7. **Deploy to Staging**: Deploys to staging environment (develop branch)
8. **Deploy to Production**: Deploys to production environment (main branch)

### GitHub Secrets

Set up the following secrets in your GitHub repository:

```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
RENDER_API_KEY
CODECOV_TOKEN
```

## Domain Configuration

### DNS Configuration

Configure your DNS settings with the following records:

1. **Frontend (Vercel)**:
   - Type: A or CNAME
   - Name: @
   - Value: (Vercel's IP or domain)

2. **API (Render)**:
   - Type: CNAME
   - Name: api
   - Value: (Render's domain for your service)

### SSL Certificates

Both Vercel and Render provide automatic SSL certificate management through Let's Encrypt. Ensure HTTPS is enforced for all traffic.

## Monitoring and Logging

### Application Monitoring

1. Set up [Sentry](https://sentry.io) for error tracking:
   - Create a Sentry project
   - Add the Sentry DSN to your environment variables
   - Initialize Sentry in both frontend and backend code

2. Configure [New Relic](https://newrelic.com) or [Datadog](https://www.datadoghq.com) for performance monitoring

### Log Management

1. Set up [LogDNA](https://www.logdna.com) or [Papertrail](https://www.papertrail.com) for centralized logging
2. Configure log rotation and retention policies

## Backup Strategy

### Database Backups

1. Configure MongoDB Atlas backups:
   - Enable continuous backups
   - Set up scheduled snapshots
   - Configure retention policy (30 days recommended)

2. Implement application-level backups:
   - Create a scheduled job to export critical data
   - Store exports in a secure location (e.g., AWS S3)

## Scaling Considerations

### Frontend Scaling

Vercel automatically scales your frontend application based on traffic.

### Backend Scaling

1. Configure Render to scale your backend:
   - Increase the number of instances
   - Upgrade to a higher performance plan

2. Implement caching strategies:
   - Use Redis for caching frequently accessed data
   - Implement CDN caching for static assets

### Database Scaling

1. MongoDB Atlas scaling options:
   - Increase cluster tier
   - Enable sharding for horizontal scaling
   - Add read replicas for read-heavy workloads

## Troubleshooting

### Common Issues

1. **Deployment Failures**:
   - Check build logs in Vercel or Render
   - Verify environment variables are correctly set
   - Ensure dependencies are properly installed

2. **Database Connection Issues**:
   - Verify network access settings in MongoDB Atlas
   - Check connection string in environment variables
   - Ensure database user has correct permissions

3. **API Errors**:
   - Check server logs in Render
   - Verify CORS settings
   - Test API endpoints with Postman or similar tool

### Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com)

For additional support, contact the development team at dev@thriftx.com. 