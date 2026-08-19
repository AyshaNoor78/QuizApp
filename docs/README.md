# BDApps Quiz App Documentation

Welcome to the documentation for the BDApps Quiz App! This set of documents provides comprehensive information on setting up, developing, securing, and deploying the application.

## Documentation Index

- [Setup Guide](./SETUP.md) - Instructions for local development environment setup.
- [API Reference](./API.md) - Detailed documentation of all backend REST endpoints.
- [BDApps Integration](./BDAPPS_INTEGRATION.md) - Guide for connecting to the real BDApps platform for subscription and SMS services.
- [Security Architecture](./SECURITY.md) - Overview of security measures, authentication, and data protection.
- [Deployment Guide](./DEPLOYMENT.md) - Best practices for deploying the app to a production environment.

## Architecture Overview

This project is a full-stack monorepo consisting of:
- **Client**: A modern web frontend built with React, Next.js or similar (depending on the client-side implementation).
- **Server**: A Node.js backend using Express, protected by JWT authentication and connected to a PostgreSQL database via Prisma ORM. Redis may be used for caching and OTP rate limiting.

### Core Features

1. **User Authentication**: Secure mobile-based login with BDApps OTP validation.
2. **Subscription Management**: Full lifecycle management of Robi/Airtel subscriptions (New, Renew, Cancel).
3. **Dynamic Quiz Engine**: Subject > Chapter > Section > Question hierarchy with granular access controls based on subscription status.
4. **Daily Scores & Notifications**: Automated daily score calculation and background SMS dispatch via BDApps.

Please refer to the individual markdown files above for detailed instructions on each domain.
