# Local Setup Guide

Follow these steps to set up the BDApps Quiz App for local development.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v20+ recommended)
- **Docker** and **Docker Compose** (for running local PostgreSQL and Redis)
- **Git**

## 2. Clone Repository

```bash
git clone <repository-url> quiz-app
cd quiz-app
```

## 3. Environment Variables

Navigate to the `server/` directory and copy the example environment file:

```bash
cd server
cp .env.example .env
```

Ensure the following default variables are set in your `.env` (adjust if necessary):

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quizapp?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="super-secret-local-key"
ADMIN_MOBILE="01700000000"

# BDApps Dummy/Sandbox Credentials
BDAPPS_APP_ID="your_sandbox_app_id"
BDAPPS_APP_PASSWORD="your_sandbox_password"
```

## 4. Start Docker Containers

Start the required background services (PostgreSQL and Redis) using Docker Compose:

```bash
# From the root of the project
docker-compose up -d
```
*Wait a few seconds for the database to be fully ready.*

## 5. Install Dependencies

Install dependencies for both server and client:

```bash
# In the server directory
cd server
npm install

# In the client directory (if applicable)
cd ../client
npm install
```

## 6. Run Migrations

Run Prisma migrations to create the database schema:

```bash
cd ../server
npx prisma migrate dev --name init
```

## 7. Generate Prisma Client

Generate the type-safe Prisma client:

```bash
npx prisma generate
```

## 8. Seed the Database

Populate the database with the initial subjects, chapters, questions, and test users:

```bash
npm run seed
# or npx ts-node prisma/seed.ts
```

This will create:
- Admin user: `01700000000` (or `ADMIN_MOBILE` from `.env`)
- Test subscriber: `01811111111`
- Test non-subscriber: `01822222222`
- ~155 questions across 13 subjects.

## 9. Start Development Servers

Start the backend server:
```bash
# In the server directory
npm run dev
```

Start the frontend client:
```bash
# In the client directory
cd ../client
npm run dev
```

## 10. Access the Application

- **Frontend**: http://localhost:3000 (or the port specified by your client framework)
- **Backend API**: http://localhost:5000 (or the port specified in server/.env)
