# Atlantic AI CRM

A production-ready AI Lead Management CRM built with Next.js, Node.js, Express, PostgreSQL, and Prisma.

---

## Tech Stack

| Layer      | Technology                                                          |
|------------|---------------------------------------------------------------------|
| Frontend   | Next.js 16, TypeScript, Tailwind CSS, React Query, Axios, Recharts |
| Backend    | Node.js, Express.js, TypeScript, MVC Architecture                   |
| Database   | PostgreSQL, Prisma ORM (v7)                                         |
| Auth       | JWT, bcrypt, Role-based Access Control                              |
| Security   | Helmet, CORS, Rate Limiting, Input Validation, XSS Sanitization     |
| DevOps     | Docker, Docker Compose                                              |

---

## Features

- **Authentication** — Register, Login, Forgot/Reset Password, JWT, Role-based access (Admin / Manager / Sales Executive)
- **Dashboard** — Real-time stats: total leads, today's leads, converted, lost, revenue, appointments, recent activity
- **Lead Management** — Full CRUD, search, filter by status/source, pagination, sorting, CSV export
- **Lead Pipeline** — Kanban board with drag-and-drop across 8 stages
- **Follow-ups** — Schedule calls, meetings, reminders, emails with grouped timeline view
- **Analytics** — Daily leads, monthly leads, leads by source (pie), leads by status, conversion rate, sales performance
- **Notifications** — In-app bell with unread count; DB notifications for lead assigned/updated, follow-up reminders; optional email via SMTP
- **Profile** — Edit name, avatar URL, change password
- **Security** — Helmet, CORS, rate limiting, bcrypt, JWT, express-validator, XSS sanitization middleware
- **API Docs** — Swagger UI at `http://localhost:5000/api/docs`

---

## Project Structure

```
atlantic-ai-crm/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/       # Business logic (auth, leads, dashboard, analytics, followups, notifications, users)
│   │   ├── middleware/        # auth, error handler, XSS sanitize
│   │   ├── prisma/            # Prisma client singleton
│   │   ├── routes/            # Express routers
│   │   ├── services/          # notification.service (DB + email)
│   │   ├── utils/             # response helper, CSV export, email (nodemailer)
│   │   ├── validators/        # express-validator rule sets
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/            # login, register, forgot-password, reset-password
│   │   └── dashboard/         # dashboard, leads, pipeline, followups, analytics, profile
│   ├── lib/
│   │   ├── api.ts             # Axios instance + token helpers
│   │   ├── hooks.ts           # React Query hooks
│   │   └── providers.tsx      # QueryClientProvider
│   ├── middleware.ts           # Next.js route protection
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── docs/
│   └── openapi.yaml           # OpenAPI 3.0 spec
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/achal1104/atlantic-crm.git
cd atlantic-crm
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL and JWT_SECRET (SMTP vars optional)
npm install
npx prisma migrate dev
npm run dev
```

Backend runs on: `http://localhost:5000`
Swagger UI: `http://localhost:5000/api/docs`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

### 4. Docker Setup (Full Stack)

```bash
# From project root
docker-compose up --build
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/atlantic_ai_crm?schema=public"
JWT_SECRET="your_super_secret_jwt_key_change_this"
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Optional — email notifications & password reset
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_app_password"
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

## API Documentation

Interactive Swagger UI: **`http://localhost:5000/api/docs`**

Full spec: [`docs/openapi.yaml`](./docs/openapi.yaml)

### Base URL
```
http://localhost:5000/api
```

### Authentication

| Method | Endpoint               | Access | Description                  |
|--------|------------------------|--------|------------------------------|
| POST   | /auth/register         | Public | Register new user            |
| POST   | /auth/login            | Public | Login, get JWT               |
| POST   | /auth/forgot-password  | Public | Send password reset email    |
| POST   | /auth/reset-password   | Public | Reset password via token     |

**Login Response:**
```json
{ "success": true, "token": "<jwt>", "user": { "id": "...", "name": "...", "role": "SALES_EXECUTIVE" } }
```

---

### Leads

> All routes require `Authorization: Bearer <token>` header

| Method | Endpoint           | Description                                      |
|--------|--------------------|--------------------------------------------------|
| GET    | /leads             | List leads (search, filter, paginate, sort)      |
| GET    | /leads/:id         | Get single lead with follow-ups & activity       |
| POST   | /leads             | Create lead                                      |
| PUT    | /leads/:id         | Update lead                                      |
| DELETE | /leads/:id         | Delete lead                                      |
| GET    | /leads/export/csv  | Export all leads as CSV                          |

**Query Parameters for GET /leads:**
```
?page=1&limit=10&search=john&status=NEW&source=WEBSITE&sortBy=createdAt&order=desc
```

---

### Dashboard

| Method | Endpoint          | Description                                              |
|--------|-------------------|----------------------------------------------------------|
| GET    | /dashboard/stats  | totalLeads, todayLeads, convertedLeads, lostLeads, revenue, appointments, recentActivity |

---

### Analytics

| Method | Endpoint    | Description                                                    |
|--------|-------------|----------------------------------------------------------------|
| GET    | /analytics  | dailyLeads, monthlyLeads, bySource, byStatus, conversionRate, salesPerformance |

---

### Follow-ups

| Method | Endpoint                | Description              |
|--------|-------------------------|--------------------------|
| GET    | /followups              | List all (filter by leadId) |
| POST   | /followups              | Create follow-up         |
| PUT    | /followups/:id/complete | Mark as completed        |

---

### Notifications

| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | /notifications            | Get last 20 notifications + unread count |
| PUT    | /notifications/read-all   | Mark all as read                   |
| PUT    | /notifications/:id/read   | Mark single notification as read   |

---

### Users

| Method | Endpoint               | Access        | Description          |
|--------|------------------------|---------------|----------------------|
| GET    | /users/profile         | Authenticated | Get own profile      |
| PUT    | /users/profile         | Authenticated | Update name/avatar   |
| PUT    | /users/change-password | Authenticated | Change password      |
| GET    | /users                 | Admin/Manager | List all users       |
| DELETE | /users/:id             | Admin only    | Delete user          |

---

### Health Check

| Method | Endpoint    | Description     |
|--------|-------------|-----------------|
| GET    | /health     | API status ping |

---

## Roles & Permissions

| Role            | Permissions                                      |
|-----------------|--------------------------------------------------|
| ADMIN           | Full access — all users, leads, settings         |
| MANAGER         | View all leads, assign leads, view users         |
| SALES_EXECUTIVE | Manage own assigned leads, follow-ups            |

---

## Lead Status Flow

```
NEW → QUALIFIED → CONTACTED → INTERESTED → MEETING_SCHEDULED → PROPOSAL_SENT → WON / LOST
```

## Lead Sources

`WEBSITE` | `FACEBOOK_ADS` | `GOOGLE_ADS` | `WHATSAPP` | `AI_CALLING` | `MANUAL`

---

## Database Schema

```
User          — id, name, email, password, avatar, role, resetToken, resetTokenExpiry
Lead          — id, name, phone, email, source, status, business, city, state, budget, leadScore, assignedToId, remarks, nextFollowUp
FollowUp      — id, leadId, userId, type, notes, scheduledAt, isCompleted
Notification  — id, userId, type, message, isRead, leadId
ActivityLog   — id, leadId, action, description
```

**Indexes:** `Lead(status)`, `Lead(source)`, `Lead(assignedToId)`, `FollowUp(leadId)`, `FollowUp(userId)`, `Notification(userId)`, `Notification(isRead)`, `ActivityLog(leadId)`

---

## Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT** tokens with 1-day expiry
- **Helmet** sets secure HTTP headers
- **CORS** restricted to frontend origin
- **Rate limiting** on auth routes (20 req / 15 min)
- **express-validator** on all input fields
- **XSS sanitization** middleware strips `<`, `>`, `"`, `'` from all request body/query strings
- `.env` excluded from git via `.gitignore`

---

## Scripts

### Backend
```bash
npm run dev      # Development with tsx watch
npm run build    # Compile TypeScript
npm run start    # Run compiled output
```

### Frontend
```bash
npm run dev      # Next.js dev server
npm run build    # Production build
npm run start    # Production server
```
