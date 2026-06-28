# Chronotype / SASD Handoff Context

Last updated: **2026-06-28 16:14 IST**

---

## Completed Features

### Auth

- Custom auth forms: email-first for members, email+password for admin/superadmin
- Server-side session creation (`createClerkSession`) — no pending session issues
- Middleware JWT fallback — decodes `__session` cookie when Clerk `auth()` returns null
- Client Trust must be OFF in Clerk Dashboard
- Login audit tracking in `login_audit` table

### Dashboards

- **Superadmin**: Command Center, Organizations (detail + modals), Assessments (CRUD), Members, Users (admin CRUD + detail modal), Reports (charts), Activity (logs), Recommendations (CRUD), Settings, Search
- **Admin**: Dashboard, Participants, Results, Analytics, Share Link, White Label (branding), Settings (org info)
- **Member**: Score, Chronotype, Energy, Blueprint, Recommendations, Progress (reports), Goals (create), Profile

### Organization Detail (`/superadmin/organizations/[code]`)

- Clickable Members stat card → modal with full member list (name, email, gender, age, chronotype)
- Clickable Admins stat card → modal with full admin list (name, email, role, status)
- Clickable Lark/Eagle/Owl → modal with gender-filterable member list
- Chronotype distribution bar + org info card

### PDF Reports

- Puppeteer-powered premium 2-page A4 PDF
- Cover section, score breakdown, sleep window, peak energy, recommendations, warnings, disclaimer
- Chronotype-specific recommendations (6 each for Lark/Eagle/Owl)
- Report snapshot stored as JSON in `reports.report_snapshot` — re-generate on demand
- Download from assessment result screen or member progress page

### Public Result Page

- `/reports/{assessmentId}` — no auth required
- Shows chronotype, scores, confidence, breakdown
- Share buttons copy public URL to clipboard

### White Label

- Admin can set brand name + logo URL
- Navbar detects org code from URL path and swaps branding

### Search

- Functional search bar in dashboard header with real `<input>`
- Enter navigates to `/{dashboard}/search?q={query}`
- Superadmin: searches orgs, members, admins, assessment versions
- Admin: searches members in own org
- Member: searches chronotype, reports, goals

### Performance

- `revalidate = 60` on all data pages
- React `cache()` on all data functions
- Loading.tsx on all 15 nested routes
- `router.push` instead of `location.href`
- Layouts use `auth()` + JWT decode (no Clerk API call)
- Unused imports cleaned from layout-content files

### NEW Pages Added (this session)

| Page                      | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `/superadmin/search`      | Full-text search across orgs, members, admins, assessments |
| `/admin/search`           | Search members within the admin's org                      |
| `/member/search`          | Search chronotype, reports, goals                          |
| `/admin/white-label`      | Brand name + logo URL (edit/save/view)                     |
| `/reports/[assessmentId]` | Public shareable result page (no auth)                     |

### Missing Fields Added

- `marital_status`, `department`, `location` to assessment form
- `phone` column to users table
- `assessment_id` to reports query

### Database Schema Covered

- All 18 tables covered: `organizations`, `organization_admins`, `members`, `referrals`, `assessment_versions`, `questions`, `question_options`, `scoring_rules`, `assessments`, `assessment_answers`, `chronotype_results`, `recommendations`, `member_recommendations`, `reports`, `organization_links`, `member_goals`, `activity_logs`, `login_audit`

### GitHub

- Pushed to `https://github.com/prathameshtwrwc-collab/chrono-next-001`
- `README.md` with full setup instructions
- `.env.example` with documented variables
- `.gitignore` covers `.env`, `.env.local`, `.env.production`

---

## Remaining / Known Issues

- **Dev mode slow**: Expected — `npm run dev` is always slower than `npm run build && npm run start`
- **No `error.tsx` files** — unhandled errors show React error overlay
- **`/member/energy` page** still uses mock data (no energy tracking data source)
- **`pages/_error.tsx`** — Pages Router file alongside App Router, harmless but unused

---

## Build Verification

```bash
npm exec tsc -- --noEmit   # passes
npm run build              # passes
npm run start -- -p 3000   # production server
```

## Commands

```bash
npm run dev -- -p 3000     # dev server
npm run build              # production build
npm run start -- -p 3000   # production server
```
