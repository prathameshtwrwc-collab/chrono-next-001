# Chronotype / SASD Handoff Context

Last updated: **2026-06-28 03:30 IST**

This file is a handoff note for continuing the project. It summarizes all work done, the current state, and pending tasks.

---

## Previous Sessions (Summary)

- Initial project setup with Clerk auth + Supabase
- Assessment flow: profile → questions → result → report
- Organization management: create org + admin with unique code
- Custom auth pages: `/sign-in`, `/superadmin/sign-in`
- Role-based routing: superadmin → `/superadmin`, admin → `/admin`, member → `/member`

---

## Session: 2026-06-27/28 — Auth Overhaul + Performance + Dashboard Pages

### What was done

#### 1. Auth Flow Complete Rewrite
- **Removed Clerk `<SignIn />` component** from `/superadmin/sign-in` — replaced with custom `AuthForm` (email + password only)
- **`/sign-in` now has member-first flow**: show email only → check email status → auto sign-in for members (via `createClerkSession`), show password for admin/superadmin
- **`AuthForm.tsx`** rewritten: no sign-up mode (assessment is the sign-up), no Google OAuth on sign-in
- **`checkEmailStatus()`** server action: checks Clerk first for admin/superadmin role, then Supabase `members` table for member status, then Clerk for existing user
- **`signInAsMember()`** server action: auto-creates Clerk session for members (no password needed)
- **Fixed admin/superadmin redirect**: after password verification, uses `createClerkSession` instead of Clerk client-side `setActive` (which produced "pending" sessions rejected by middleware)

#### 2. Client Trust Issue Fixed
- Clerk Dashboard setting **Client Trust** must be OFF
- Without this, `attemptFirstFactor` returns `needs_client_trust` status instead of `complete`
- User toggled this OFF in Clerk Dashboard

#### 3. Middleware JWT Fallback
- `middleware.ts` now decodes `__session` cookie JWT directly when `auth()` returns null
- This allows server-created sessions (from `createClerkSession`) to be recognized

#### 4. Performance Optimizations
- **Removed `force-dynamic`** from root layout — enables Next.js caching
- **Replaced `location.href` with `router.push`** — no more full page reloads on sign-in/logout
- **Added `loading.tsx`** files to all 15 nested dashboard routes
- **Added `export const revalidate = 60`** to all data-fetching pages
- **Removed `currentUser()` from `getRoleContext()`** — was the main cause of 10-second page loads. Replaced with `auth()` (reads JWT, instant) + JWT cookie decode fallback. On layouts, uses `clerkClient().users.getUser(id)` with JWT-extracted userId.
- **React `cache()`** wrappers added to all data functions (`getRoleContext`, `getPlatformDashboardData`, `getOrganizationDashboardData`, `getMemberDashboardData`, `getOrganizationAdmins`, etc.)
- **Cleaned unused imports** from admin/member layout-content files

#### 5. New Dashboard Pages

| Page | Description |
|------|-------------|
| `/superadmin/assessments` | List assessment versions, View (modal: questions + lark/eagle/owl scores), Add Assessment (form with questions, options, scores), Activate |
| `/superadmin/members` | All platform members table from `members` table |
| `/superadmin/organizations/[code]` | Org detail view with stats, modals for members/admins, chronotype breakdown with gender filterable modals |
| `/superadmin/settings` | Editable form → saves to Supabase `__PLATFORM__` record via `settings_json` |

#### 6. New Modal Components
- `ViewAssessmentButton.tsx` — renders via `createPortal` to `document.body` (avoids CSS transform containment issues)
- `AddAssessmentForm.tsx` — dynamic form for creating assessment versions with questions, options, and lark/eagle/owl scores
- `OrgModals.tsx` — `DetailModal` (auto-renders rows from data properties), `ChronotypeModal` (gender-filterable)
- `AddAdminForm.tsx` — create admin user under an organization (select org, enter admin details)

#### 7. Assessment Modal Fixes
- **Body scroll locked** when modal is open via `useEffect`
- **Gender dropdown** instead of text input
- **Age max 120** on number input
- **Number spinner arrows hidden** via CSS
- **Org code locked** when auto-detected from URL
- **Scrollbar inside modal**: motion.div has `overflow-y-auto max-h-[90vh]`, backdrop has `overflow-hidden` with `onWheel` stop propagation

#### 8. Organization Link Paused Check
- `app/[entryCode]/page.tsx` now checks `organization_links.active` for the unique code
- If paused: shows "Link Expired" page with "Go Home" button
- If active: renders landing page normally

#### 9. Account Switching Documentation
- Created `switching.md` in `.kilo/memory-bank/`
- Documents all 5 env variables to change, Clerk Dashboard setup, Supabase schema, seed data, and verification checklist

#### 10. Security
- Deleted `app/debug-auth/` (password reset endpoint — security risk)
- Created `.env.example` with documented variables

---

## Current Architecture

### Auth Flow
```
/sign-in → email only → checkEmailStatus:
  → member (in Supabase `members`): createClerkSession → set cookie → redirect /member
  → admin/superadmin (in Clerk metadata): show password → signIn.create + attemptFirstFactor
    → success: createClerkSession → set cookie → redirect /admin or /superadmin

/superadmin/sign-in → email + password (always both fields)
  → Clerk SDK create + attemptFirstFactor → createClerkSession → set cookie → redirect /superadmin
```

### Session Creation
All sessions are created server-side via `createClerkSession()`:
```typescript
POST /v1/sessions { user_id }
  → PATCH /v1/sessions/{id} { status: "active" }
  → POST /v1/sessions/{id}/tokens → returns JWT
  → set cookie `__session={jwt}`
```
The middleware accepts these via JWT decode fallback in `middleware.ts`.

### Performance
- `revalidate = 60` on all data pages (ISR cache)
- `cache()` from React on all data functions (within-request dedup)
- No `force-dynamic` anywhere
- Layouts use `auth()` + JWT decode (fast, no API call)
- `router.push` for client-side navigation

---

## Environment

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://wqoplsaxjjazctvcccxn.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_2MOoHXux_A2piT5ZL3j0dw_NokxzGJp
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YWNjdXJhdGUtaG9yc2UtMjUuY2xlcmsuYWNjb3VudHMuZGV2JA
CLERK_SECRET_KEY=sk_test_8cmxwYr3xPLkUS5g5HXVyAFaXkOqluS7F19fEzkGjr

# Routing
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/member
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/member
```

---

## Known Issues / Pending

- **Dev mode slow**: Expected — `npm run dev` is always slower than `npm run build && npm run start`
- **No `error.tsx` files** anywhere — unhandled errors show React error overlay
- **`/member/energy` page** still uses mock data (no energy tracking data source in DB yet)
- **Clerk Organizations disabled** in Dashboard (was causing org creation page after sign-in)
- **`getAssessmentVersionDetail`** in `dashboard.ts` is unused (the API route `GET /api/assessments?id=...` is used instead) — can be removed
- **`pages/_error.tsx`** exists alongside App Router — harmless but unused

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
