# BDApps Quiz App

A full-stack, production-ready educational Quiz Application integrated with the BDApps ecosystem for carrier billing (Robi/Airtel) and SMS notifications.

## Features

- **Hierarchical Content Engine**: Subjects > Chapters > Sections > Questions.
- **Freemium Model**: Non-subscribers can answer up to 3 questions per section without explanations. Subscribers get full access to all questions, correct answers, and detailed explanations.
- **BDApps Integration**: Seamless mobile carrier billing and OTP SMS verification.
- **Daily Scores**: Automated calculation and SMS notification of daily performance.
- **Admin Dashboard Ready**: Full set of administrative endpoints for user and content management.

## Project Structure

```text
quiz-app/
├── client/         # Frontend web application (React/Next.js)
├── server/         # Backend Node.js/Express application
│   ├── prisma/     # Prisma ORM schema and seed scripts
│   ├── src/        # Source code for the backend API
│   └── tests/      # Automated test suites (Vitest)
└── docs/           # Comprehensive project documentation
```

## Quick Start

1. Ensure **Node.js (v20+)** and **Docker** are installed.
2. Clone the repository and navigate into the `server` directory.
3. Copy `.env.example` to `.env`.
4. Run `docker-compose up -d` to start the local database.
5. Install dependencies: `npm install`.
6. Run migrations: `npx prisma migrate dev`.
7. Seed the database: `npm run seed`.
8. Start the server: `npm run dev`.

## Documentation Links

For detailed guides, please refer to the `docs/` folder:

- [Setup Guide](docs/SETUP.md)
- [API Reference](docs/API.md)
- [BDApps Integration](docs/BDAPPS_INTEGRATION.md)
- [Security Architecture](docs/SECURITY.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Testing

This project uses `vitest` for automated testing.
To run the tests:
```bash
cd server
npm test
```
*(Runs the quiz access and subscription integration tests mock suite)*
