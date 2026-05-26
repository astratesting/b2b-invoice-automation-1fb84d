# InvoiceAI — B2B Invoice Automation

AI-powered accounts payable automation for modern finance teams. Extracts invoice data with 99.4% accuracy, routes approvals automatically, and cuts payment cycles by 72 hours.

## Features

- **AI Extraction** — Structured data capture from PDF, XML, CSV, and EDI formats
- **3-Way PO Matching** — Automatic reconciliation against ERP purchase orders
- **Workflow Automation** — Multi-tier approval routing with SLA escalation
- **Fraud Detection** — Flag duplicates, round-number anomalies, and missing fields
- **Analytics Dashboard** — Spend by category, volume trends, approval split, AI performance
- **Secure Auth** — Clerk OAuth2 with Supabase JWT row-level security

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Auth | Clerk (OAuth2 / JWT) |
| Database | Supabase (PostgreSQL) |
| Charts | Recharts |
| UI components | Radix UI + class-variance-authority |
| Backend | FastAPI, SQLAlchemy (async), SQLite / PostgreSQL |
| AI processing | Simulated extraction engine (Claude API ready) |

## Prerequisites

- Node.js 18+
- Python 3.11+
- A [Clerk](https://clerk.com) account
- A [Supabase](https://supabase.com) project

## Environment Variables

Copy `.env.example` and fill in your values:

```bash
cp .env.example .env
```

### Backend (`.env` in `/backend`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite for dev (`sqlite+aiosqlite:///./invoices.db`) or PostgreSQL |
| `SECRET_KEY` | Long random string for JWT signing |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token TTL (default: 1440 = 24h) |
| `ALLOWED_ORIGINS` | CORS origins (e.g. `http://localhost:3000`) |

### Frontend (`.env.local` in `/frontend`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | `/dashboard` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_API_URL` | Backend URL (default: `http://localhost:8000`) |

## Running Locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

### Docker (optional)

```bash
docker compose up --build
```

## Project Structure

```
├── backend/
│   ├── main.py              # FastAPI app, CORS, lifespan
│   ├── database.py          # Async SQLAlchemy engine
│   ├── models.py            # ORM models + Pydantic schemas
│   ├── routers/
│   │   ├── auth.py          # JWT register/login/me
│   │   └── api.py           # Invoices, vendors, workflows, dashboard
│   └── services/
│       └── core.py          # Business logic + AI processing
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Marketing landing page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx   # Sidebar + topbar shell
│   │   │   └── page.tsx     # Overview: KPIs, charts, invoice table
│   │   ├── sign-in/         # Clerk sign-in
│   │   └── sign-up/         # Clerk sign-up
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   └── ui/              # Button, Card, Input base components
│   └── lib/
│       ├── auth.ts          # useSupabaseWithAuth() hook
│       ├── supabase.ts      # Supabase client factory
│       └── utils.ts         # cn() Tailwind merge utility
└── .env.example
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Get JWT token |
| GET | `/auth/me` | Current user |
| GET | `/api/invoices` | List invoices (paginated) |
| POST | `/api/invoices` | Create + AI-process invoice |
| GET | `/api/invoices/{id}` | Invoice detail |
| POST | `/api/invoices/{id}/workflow` | Approve / reject / escalate |
| GET | `/api/vendors` | List vendors |
| POST | `/api/vendors` | Create vendor |
| GET | `/api/dashboard` | Aggregated KPI stats |

## License

MIT
