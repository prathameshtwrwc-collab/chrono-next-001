# CHRONOTYPE — Sleep Intelligence Platform

A protected sleep intelligence platform that helps users discover their chronotype through a science-backed assessment. Built with Next.js 15 (App Router), Clerk, and Supabase.

## Features

- **Chronotype Assessment** — Multi-step questionnaire → score calculation → personalized report (PDF)
- **Three role dashboards**: Super Admin (platform-wide), Admin (org-scoped), Member (personal)
- **Organization management** with unique registration links, admin controls, and member mapping
- **White Label** — Organizations can customize branding (logo, name) on shared links
- **PDF Reports** — Premium 2-page downloadable reports via Puppeteer
- **Public sharable** result pages at `/reports/{assessmentId}`

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/prathameshtwrwc-collab/chrono-next-001.git
cd chrono-next-001
npm install
```

### 2. Create `.env.local`

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### 3. Configure Supabase

**Create a Supabase project** at https://supabase.com → New Project

Run the SQL schema from `.kilo/memory-bank/databaseSchema.sql` in **Supabase Dashboard → SQL Editor**.

**Get your keys:**
- Supabase Dashboard → **Project Settings → API**
- Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy the **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Copy the **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

### 4. Configure Clerk

**Create a Clerk application** at https://clerk.com → Add Application → Next.js

**Get your keys:**
- Clerk Dashboard → **API Keys**
- Copy the **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Copy the **Secret key** → `CLERK_SECRET_KEY`

**Configure Clerk Dashboard settings:**

| Setting | Value |
|---------|-------|
| Authentication | Enable **Email** + **Password** |
| Client Trust | **OFF** (required — prevents `needs_client_trust`) |
| Organizations | **OFF** (optional — managed via Supabase) |

**Set role metadata for users:**
- Clerk Dashboard → Users → Edit user → Public Metadata
- Super Admin: `{"role":"superadmin"}`
- Admin: `{"role":"admin"}` (set automatically when created)
- Member: `{"role":"member"}` (set automatically on assessment)

### 5. Seed Required Data

Run in **Supabase Dashboard → SQL Editor**:

```sql
-- Assessment version
INSERT INTO assessment_versions (name, version, status) VALUES ('SASD Chronotype Assessment v1', 1, 'ACTIVE');

-- Recommendations (at least one per chronotype for dashboard to work)
INSERT INTO recommendations (chronotype, title, description, category, priority_order, is_active) VALUES
  ('LARK', 'Morning Optimization', 'Optimize your early morning routine for peak performance.', 'sleep', 1, true),
  ('EAGLE', 'Midday Peak Strategy', 'Leverage your balanced energy window for deep work.', 'energy', 1, true),
  ('OWL', 'Evening Protocol', 'Design a wind-down routine that respects your late rhythm.', 'sleep', 1, true);
```

### 6. Run

```bash
# Development
npm run dev -- -p 3000

# Production
npm run build
npm run start -- -p 3000
```

### 7. Create Your First Super Admin

1. Go to `http://localhost:3000/sign-up`
2. Sign up with your email + password
3. In **Clerk Dashboard → Users**, find your user and set Public Metadata: `{"role":"superadmin"}`
4. Sign out and sign in at `http://localhost:3000/superadmin/sign-in`

---

## Environment Variables

| Variable | Source | Required | Notes |
|----------|--------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API | Yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Settings → API | Yes | anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API | Yes | service_role key (bypasses RLS) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | Yes | Starts with `pk_` |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | Yes | Starts with `sk_` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | — | No | Default: `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | — | No | Default: `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | — | No | Default: `/member` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | — | No | Default: `/member` |

---

## Project Structure

```
app/
├── (auth)/                     # Custom auth pages
│   ├── superadmin/sign-in      # Superadmin login (email + password)
│   └── ...
├── sign-in/                    # Main sign-in (member-first flow)
├── sign-up/                    # Redirects to assessment
├── superadmin/                 # Super Admin dashboard
│   ├── organizations/          # Org list + detail pages
│   ├── assessments/            # Assessment versions CRUD
│   ├── members/                # All platform members
│   ├── users/                  # Organization admins + Add Admin
│   ├── reports/                # Chronotype analytics
│   ├── activity/               # Platform activity log
│   ├── recommendations/        # Recommendation CRUD
│   └── settings/               # Platform settings
├── admin/                      # Admin dashboard
│   ├── participants/           # Org members
│   ├── results/                # Assessment results
│   ├── analytics/              # Org analytics
│   ├── share-link/             # Org registration link
│   ├── white-label/            # Branding (logo + name)
│   └── settings/               # Org info
├── member/                     # Member dashboard
│   ├── score/                  # Sleep score
│   ├── chronotype/             # Chronotype detail
│   ├── energy/                 # Energy timeline
│   ├── blueprint/              # Sleep blueprint
│   ├── recommendations/        # Personalized tips
│   ├── progress/               # Reports + progress
│   ├── goals/                  # Goal management
│   └── profile/                # Member profile
├── reports/[assessmentId]      # Public shareable result page
├── [entryCode]/                # Org code URL handler
├── api/                        # API routes
│   ├── reports/generate        # PDF generation (Puppeteer)
│   ├── branding/               # Public org branding lookup
│   ├── admin-branding/         # Admin org branding API
│   ├── assessments/            # Assessment version detail
│   ├── organizations/list      # Org list for forms
│   ├── settings/               # Platform settings
│   └── member-data/            # Member dashboard data
├── actions/                    # Server actions
│   ├── auth.ts                 # Sign-in, session creation, email check
│   ├── assessment.ts           # Assessment submission + scoring
│   ├── organizations.ts        # Organization + admin CRUD
│   ├── assessments.ts          # Assessment version management
│   └── extras.ts               # Recommendations, goals, branding
├── components/                 # Shared components
│   ├── AuthForm.tsx             # Custom auth (email-first)
│   ├── AssessmentModal.tsx      # Assessment flow (profile → questions → result)
│   ├── PortalLayout.tsx         # Dashboard sidebar layout
│   ├── AddOrganizationForm.tsx  # Create org form
│   ├── AddAdminForm.tsx         # Add admin to org
│   ├── AddAssessmentForm.tsx    # Assessment version creator
│   ├── AddRecommendationForm.tsx
│   ├── AddGoalForm.tsx
│   ├── Pagination.tsx          # Reusable pagination
│   └── AdminDetailModal.tsx     # Admin detail/edit modal
├── lib/
│   ├── data/dashboard.ts       # All data fetching functions (cached)
│   ├── assessment.ts           # Scoring engine
│   └── mock/                   # Nav items only (no mock data used by pages)
└── middleware.ts               # Auth + role-based routing
```

---

## Switching to a New Account

See `switching.md` in the repo for detailed steps. In short:

1. Replace all 5 values in `.env.local` with the new account's keys
2. Restart the server
3. No code changes needed

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth**: Clerk (custom auth form, JWT fallback)
- **Database**: Supabase (PostgreSQL)
- **PDF**: Puppeteer
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Forms**: Zod validation
