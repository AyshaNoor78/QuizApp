# Deployment Guide

This guide covers deploying the BDApps Quiz App to a production environment.

## 1. Build Process

Ensure the TypeScript code is compiled before running in production.

```bash
cd server
npm ci
npx prisma generate
npm run build
```

## 2. Environment Variables

Create a production `.env` file on your server:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL="postgresql://user:pass@db-host:5432/quizapp?schema=public"
REDIS_URL="redis://redis-host:6379"
JWT_SECRET="your_strong_random_secret"
ADMIN_MOBILE="01700000000"

BDAPPS_APP_ID="prod_app_id"
BDAPPS_APP_PASSWORD="prod_password"
```

## 3. Database Migration

Run migrations against the production database:
```bash
npx prisma migrate deploy
```
*(Do NOT use `migrate dev` in production)*

## 4. Reverse Proxy (Nginx)

Set up Nginx to proxy requests to your Node application and serve static assets if necessary.

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 5. SSL / HTTPS

Use Let's Encrypt / Certbot to secure the endpoint. BDApps Webhooks *require* HTTPS.

```bash
sudo certbot --nginx -d api.yourdomain.com
```

## 6. Process Management (PM2)

Use PM2 to run the application in the background and ensure it restarts on crashes.

```bash
npm install -g pm2
pm2 start dist/index.js --name "quiz-api"
pm2 save
pm2 startup
```

## 7. Monitoring

- Use PM2's built-in monitoring (`pm2 monit`).
- Set up external uptime monitoring (e.g., UptimeRobot) for the `/api/v1/health` endpoint.

## 8. Backup Strategy

Schedule daily pg_dump backups of the PostgreSQL database and store them off-site (e.g., AWS S3).
```bash
pg_dump $DATABASE_URL > backup_$(date +%F).sql
```
