# Atlantic AI CRM

A production-ready AI Lead Management CRM built with Next.js, Node.js, Express, PostgreSQL, and Prisma.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 16, TypeScript, Tailwind CSS, React Query, Axios, Recharts |
| Backend    | Node.js, Express.js, TypeScript, MVC Architecture |
| Database   | PostgreSQL, Prisma ORM (v7)                     |
| Auth       | JWT, bcrypt, Role-based Access Control          |
| Security   | Helmet, CORS, Rate Limiting, Input Validation   |
| DevOps     | Docker, Docker Compose                          |

---

## Features

- **Authentication** — Register, Login, JWT, Role-based access (Admin / Manager / Sales Executive)
- **Dashboard** — Real-time stats: total leads, today's leads, converted, lost, revenue, recent activity
- **Lead Management** — Full CRUD, search, filter by status/source, pagination, sorting, CSV export
- **Lead Pipeline** — Kanban board with drag-and-drop across 8 stages
- **Follow-ups** — Schedule calls, meetings, reminders, emails with timeline
- **Analytics** — Daily leads chart, leads by source (pie), leads by status, conversion rate
- **Profile** — Edit name, avatar, change password
- **Security** — Helmet, CORS, rate limiting, password hashing, JWT validation

---

## Project Structure

```
atlantic-ai-crm/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── middleware/        # Auth, error handling
│   │   ├── prisma/            # Prisma client singleton
│   │   ├── routes/            # Express routers
│   │   ├── utils/             # Response helper, CSV export
│   │   ├── validators/        # express-validator rules
│   │   ├── app.ts             # Express app setup
│   │   └── server.ts          # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/            # Login, Register
│   │   └── dashboard/         # All dashboard pages
│   ├── lib/
│   │   ├── api.ts             # Axios instance
│   │   ├── hooks.ts           # React Query hooks
│   │   └── providers.tsx      # QueryClientProvider
│   ├── middleware.ts           # Route protection
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/achal1104/atlantic-crm.git
cd atlantic-crm
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL and JWT_SECRET in .env
npm install
npx prisma migrate dev
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
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
JWT_SECRET="your_super_secret_jwt_key"
PORT=5000
FRONTEND_URL="http://localhost:3000"
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

| Method | Endpoint             | Access  | Description        |
|--------|----------------------|---------|--------------------|
| POST   | /auth/register       | Public  | Register new user  |
| POST   | /auth/login          | Public  | Login, get JWT     |

**Register Request:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123" }
```

**Login Response:**
```json
{ "success": true, "token": "<jwt>", "user": { "id": "...", "name": "...", "role": "SALES_EXECUTIVE" } }
```

---

### Leads

> All routes require `Authorization: Bearer <token>` header

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | /leads                | List leads (search, filter, paginate, sort) |
| GET    | /leads/:id            | Get single lead with follow-ups    |
| POST   | /leads                | Create lead                        |
| PUT    | /leads/:id            | Update lead                        |
| DELETE | /leads/:id            | Delete lead                        |
| GET    | /leads/export/csv     | Export all leads as CSV            |

**Query Parameters for GET /leads:**
```
?page=1&limit=10&search=john&status=NEW&source=WEBSITE&sortBy=createdAt&order=desc
```

**Create Lead Request:**
```json
{
  "name": "Alice Johnson",
  "phone": "+1234567890",
  "email": "alice@example.com",
  "source": "WEBSITE",
  "status": "NEW",
  "business": "TechCorp",
  "city": "Mumbai",
  "state": "Maharashtra",
  "budget": 50000,
  "leadScore": 85,
  "remarks": "Interested in enterprise plan"
}
```

---

### Dashboard

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| GET    | /dashboard/stats     | Total, today, converted, lost, revenue, activity |

---

### Analytics

| Method | Endpoint       | Description                                      |
|--------|----------------|--------------------------------------------------|
| GET    | /analytics     | Daily leads, by source, by status, conversion %  |

---

### Follow-ups

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /followups                | List all (filter by leadId) |
| POST   | /followups                | Create follow-up         |
| PUT    | /followups/:id/complete   | Mark as completed        |

**Create Follow-up Request:**
```json
{
  "leadId": "uuid",
  "type": "CALL",
  "notes": "Discuss pricing",
  "scheduledAt": "2025-08-01T10:00:00Z"
}
```

---

### Users

| Method | Endpoint               | Access         | Description          |
|--------|------------------------|----------------|----------------------|
| GET    | /users/profile         | Authenticated  | Get own profile      |
| PUT    | /users/profile         | Authenticated  | Update name/avatar   |
| PUT    | /users/change-password | Authenticated  | Change password      |
| GET    | /users                 | Admin/Manager  | List all users       |
| DELETE | /users/:id             | Admin only     | Delete user          |

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
User          — id, name, email, password, avatar, role
Lead          — id, name, phone, email, source, status, business, city, state, budget, leadScore, assignedToId
FollowUp      — id, leadId, userId, type, notes, scheduledAt, isCompleted
ActivityLog   — id, leadId, action, description
```

---

## Security

- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT** tokens with 1-day expiry
- **Helmet** sets secure HTTP headers
- **CORS** restricted to frontend origin
- **Rate limiting** on auth routes (20 req / 15 min)
- **express-validator** on all input fields
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
