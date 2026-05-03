# PushyOn

A Next.js application with passwordless OTP authentication and real-time push notifications.

## Features

- **Passwordless OTP Authentication** - Email-based one-time password login via Gmail SMTP
- **Push Notifications** - Real-time notifications powered by Knock
- **Serverless Database** - Neon PostgreSQL with Prisma ORM
- **Vercel Deployment** - Optimized for Vercel serverless platform

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT sessions with email OTP
- **Email**: Nodemailer with Gmail SMTP
- **Notifications**: Knock
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database
- Gmail App Password for SMTP
- Knock account with configured workflow

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```
DATABASE_URL=your_neon_connection_string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
JWT_SECRET=your_secret
KNOCK_API_KEY=your_knock_secret_key
NEXT_PUBLIC_KNOCK_PUBLIC_API_KEY=your_knock_public_key
NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID=your_knock_channel_id
KNOCK_WORKFLOW_KEY=your_knock_workflow_key
```

### Installation

```bash
cd pushyon
npm install
npx prisma db push
npm run dev
```

### Database Schema

The app uses two models:

- **User** - Stores registered users (email-based)
- **Otp** - Stores OTP codes with expiration and usage tracking

### How It Works

1. User enters their email on the login page
2. A 6-digit OTP is generated, stored in the database, and sent via email
3. User enters the OTP to verify and create a session
4. On successful auth, user is identified in Knock for push notifications
5. Dashboard shows notification feed and allows sending test notifications
6. Notifications from Knock workspace are received in real-time via polling
