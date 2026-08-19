# Security Architecture

Security is a primary concern for the BDApps Quiz App, ensuring data integrity, authorized access, and protection of premium content.

## 1. Authentication
- **Mechanism**: JSON Web Tokens (JWT).
- **Token Rotation**: Short-lived Access Tokens (e.g., 15 minutes) and long-lived Refresh Tokens (stored in DB).
- **Password Hashing**: `bcrypt` is used with a minimum salt rounds of 10.

## 2. Authorization
- **Role-Based Access Control (RBAC)**: Users are either `USER` or `ADMIN`. Admin endpoints verify the role claim in the JWT.
- **Subscription-Based Access**: The core `QuizService` layers enforce logic preventing `INACTIVE` or `EXPIRED` users from exceeding the 3-question limit per section.

## 3. Data Protection (Premium Content)
To prevent API bypass (where a user inspects network traffic to find answers without subscribing):
- When a non-subscriber submits an answer, the backend **strips** the `correctAnswer`, `isCorrect`, and `explanation` fields from the response payload.
- Non-subscribers cannot access the `getResult` endpoint.

## 4. Input Validation
- All incoming requests (body, query, params) are validated using **Zod** schemas.
- Invalid requests return a `400 Bad Request` before hitting controller logic.

## 5. Rate Limiting
- Applied via `express-rate-limit`.
- Strict limits on `/auth/login`, `/auth/register`, and `/subscription/request-otp` to prevent brute forcing and SMS bombing.

## 6. SQL Injection Protection
- The **Prisma ORM** uses parameterized queries under the hood, inherently protecting against standard SQL injection attacks.

## 7. XSS & CSRF Protection
- **XSS**: React/Next.js automatically escapes output. If rendering raw HTML explanations, a sanitization library (like DOMPurify) must be used.
- **CSRF**: As the API relies on Authorization headers (Bearer tokens) rather than cookies for state, CSRF is largely mitigated.

## 8. Secure Headers
- The `helmet` package is used in Express to set secure HTTP headers (HSTS, X-Frame-Options, X-Content-Type-Options).

## 9. Environment Secrets
- Sensitive keys (`JWT_SECRET`, `DATABASE_URL`, `BDAPPS_APP_PASSWORD`) are never committed.
- `dotenv` manages variables in development.

## 10. Audit Logging
- Changes to subscriptions are logged in `SubscriptionTransaction`.
- All outbound SMS messages are logged in `SmsLog` for debugging and billing disputes.

## 11. OTP Security
- OTPs are hashed using `bcrypt` before storage.
- An OTP is valid for a short window (e.g., 5 minutes).
- `attempts` are tracked; exceeding 3 failed attempts invalidates the OTP.
