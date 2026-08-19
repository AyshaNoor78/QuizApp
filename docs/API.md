# API Reference

This document outlines the REST API endpoints available in the BDApps Quiz App. All requests containing a request body should use `Content-Type: application/json`.

## Base URL
`http://localhost:<PORT>/api/v1`

---

## 1. Authentication Endpoints

### 1.1 Register
- **Method**: `POST /auth/register`
- **Auth Required**: No
- **Body**: `{ "mobileNumber": "018...", "operator": "ROBI", "name": "John Doe", "password": "..." }`
- **Response (201)**: `{ "success": true, "message": "User registered" }`
- **Errors**: `400` (Invalid input, operator must be ROBI/AIRTEL), `409` (Mobile number already exists)

### 1.2 Login
- **Method**: `POST /auth/login`
- **Auth Required**: No
- **Body**: `{ "mobileNumber": "018...", "password": "..." }`
- **Response (200)**: `{ "accessToken": "...", "refreshToken": "...", "user": { ... } }`

### 1.3 Refresh Token
- **Method**: `POST /auth/refresh`
- **Auth Required**: No
- **Body**: `{ "refreshToken": "..." }`
- **Response (200)**: `{ "accessToken": "..." }`

### 1.4 Get Me
- **Method**: `GET /auth/me`
- **Auth Required**: Yes (Bearer Token)
- **Response (200)**: `{ "id": "...", "mobileNumber": "...", "role": "USER", "subscriptionStatus": "ACTIVE" }`

### 1.5 Logout
- **Method**: `POST /auth/logout`
- **Auth Required**: Yes
- **Body**: `{ "refreshToken": "..." }`
- **Response (200)**: `{ "success": true }`

---

## 2. Subscription Endpoints

### 2.1 Request OTP
- **Method**: `POST /subscription/request-otp`
- **Auth Required**: Yes
- **Response (200)**: `{ "success": true, "message": "OTP sent via SMS" }`

### 2.2 Verify OTP
- **Method**: `POST /subscription/verify-otp`
- **Auth Required**: Yes
- **Body**: `{ "otp": "123456" }`
- **Response (200)**: `{ "success": true, "status": "ACTIVE" }`

### 2.3 Status
- **Method**: `GET /subscription/status`
- **Auth Required**: Yes
- **Response (200)**: `{ "status": "ACTIVE", "expiry": "2024-12-31T23:59:59Z" }`

### 2.4 Cancel Subscription
- **Method**: `POST /subscription/cancel`
- **Auth Required**: Yes
- **Response (200)**: `{ "success": true, "message": "Subscription cancelled successfully" }`

### 2.5 BDApps Webhook Callback
- **Method**: `POST /subscription/callback`
- **Auth Required**: No (Verified via BDApps IP/Signature)
- **Body**: Standard BDApps sync payload (register, renew, unregister)
- **Response (200)**: `{ "statusCode": "S1000", "statusDetail": "Success" }`

---

## 3. Quiz Endpoints

### 3.1 Get Subjects
- **Method**: `GET /quiz/subjects`
- **Auth Required**: Yes
- **Response (200)**: `[ { "id": "...", "nameEn": "Physics", "icon": "⚛️", "color": "#6366f1" } ]`

### 3.2 Get Chapters
- **Method**: `GET /quiz/subjects/:subjectId/chapters`
- **Auth Required**: Yes
- **Response (200)**: `[ { "id": "...", "nameEn": "Mechanics", "sections": [...] } ]`

### 3.3 Get Sections
- **Method**: `GET /quiz/chapters/:chapterId/sections`
- **Auth Required**: Yes

### 3.4 Start Section Quiz
- **Method**: `POST /quiz/sections/:sectionId/start`
- **Auth Required**: Yes
- **Response (200)**: `{ "sessionId": "..." }`

### 3.5 Get Next Question
- **Method**: `GET /quiz/sessions/:sessionId/next`
- **Auth Required**: Yes
- **Response (200)**: `{ "id": "...", "questionTextEn": "...", "optionAEn": "...", "optionBEn": "...", "optionCEn": "...", "optionDEn": "..." }`
- **Response (403)**: `{ "locked": true, "message": "Subscribe to continue" }` (If non-subscriber exceeds 3 questions)

### 3.6 Submit Answer
- **Method**: `POST /quiz/sessions/:sessionId/answer`
- **Auth Required**: Yes
- **Body**: `{ "questionId": "...", "answer": "A" }`
- **Response (200 - Subscriber)**: `{ "success": true, "isCorrect": true, "correctAnswer": "A", "explanation": "..." }`
- **Response (200 - Non-Subscriber)**: `{ "success": true, "message": "Answer recorded" }` (Correctness data stripped)

### 3.7 Get Quiz Result
- **Method**: `GET /quiz/sessions/:sessionId/result`
- **Auth Required**: Yes
- **Response (200 - Subscriber)**: `{ "score": 8, "total": 10, "percentage": 80 }`
- **Response (403 - Non-Subscriber)**: `{ "restricted": true, "message": "Subscribe to view your score" }`

### 3.8 Get Quiz History
- **Method**: `GET /quiz/history`
- **Auth Required**: Yes

---

## 4. Daily Score Endpoint

### 4.1 Get Daily Score
- **Method**: `GET /scores/daily`
- **Auth Required**: Yes
- **Response (200)**: `{ "date": "2024-05-20", "totalQuestions": 15, "correctAnswers": 12, "percentage": 80 }`

---

## 5. Admin Endpoints

All admin endpoints require a valid JWT belonging to a user with `role: "ADMIN"`.

- `GET /admin/stats` - Overall platform statistics
- `GET /admin/users` - List all users
- `GET /admin/subscriptions` - List all subscriptions
- `GET /admin/sms-logs` - View SMS delivery logs
- `GET /admin/transactions` - View billing transactions
- `POST /admin/questions/import` - Bulk import questions via CSV/JSON
