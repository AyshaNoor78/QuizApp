# BDApps Integration Guide

## 1. What is BDApps?
BDApps is a national app store in Bangladesh that provides APIs for Telecom network services, primarily for Robi and Airtel subscribers. It allows developers to integrate direct carrier billing (subscriptions) and SMS gateway functionalities.

## 2. Required Credentials
To go live, you need to register on the [BDApps Developer Portal](https://dev.bdapps.com/) and create an application.

You will receive:
- **App ID**: Uniquely identifies your application.
- **App Password**: Secret used to authenticate API requests.
- **Service/Product ID**: If you are creating a subscription service, you'll need the specific product ID.

## 3. Environment Variables
In your `.env` file, configure:
```env
BDAPPS_APP_ID="your_production_app_id"
BDAPPS_APP_PASSWORD="your_production_password"
BDAPPS_SUBSCRIPTION_URL="https://developer.bdapps.com/subscription/send"
BDAPPS_SMS_URL="https://developer.bdapps.com/sms/send"
```

## 4. Subscription API Integration Points
The Quiz App handles subscriptions using a two-step OTP or direct confirmation flow depending on BDApps SDK limits:
- **Request OTP/Subscribe**: The user requests a subscription. The backend calls the BDApps API to initiate the subscription for `mobileNumber`.
- **Status Check**: The app must periodically verify if a user's subscription is still valid.

## 5. SMS API Integration Points
- **Daily Scores**: The system aggregates user scores at midnight. A cron job queries all active subscribers who took a quiz and formats a message string. The backend sends this via the BDApps SMS API.
- **OTP Delivery**: For user verification.

## 6. Callback/Webhook Setup
BDApps uses asynchronous webhooks to inform your server of subscription lifecycle events (Renewals, Unsubscriptions, Billing Failures).
- **Endpoint Route**: `POST /api/v1/subscription/callback`
- **Configuration**: You must provide your server's public URL (e.g., `https://api.yourdomain.com/api/v1/subscription/callback`) in the BDApps developer portal.

## 7. Testing (Mock vs. Production)
- **Sandbox Mode**: Use the BDApps sandbox environment during local development. Use test phone numbers provided by BDApps.
- **Production Mode**: Swap out URLs and credentials when deploying.

## 8. Going Live Checklist
- [ ] Registered app in BDApps Portal.
- [ ] Webhook URL is publicly accessible and configured in BDApps.
- [ ] Correct App ID and Password are in production environment variables.
- [ ] User flow handles "Insufficient Balance" errors gracefully.
- [ ] SMS templates are approved by BDApps (if required).
