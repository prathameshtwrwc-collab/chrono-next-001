# Migration Report: React + Vite → Next.js

## Overview

Migrated the CHRONOTYPE sleep intelligence application from a React + Vite (SPA) to Next.js (App Router) architecture. All visual design, components, animations, and data flows are preserved exactly.

## Route Mapping

| Original (Vite HashRouter) | New (Next.js App Router) | Status |
|---|---|---|
| `/#/` | `/` (page.tsx) | ✅ Landing page |
| `/#/app` | `/member` | ✅ Member dashboard (redirect from `/app`) |
| `/#/app/score` | `/member/score` | ✅ Sleep Score |
| `/#/app/chronotype` | `/member/chronotype` | ✅ Chronotype |
| `/#/app/energy` | `/member/energy` | ✅ Energy Timeline |
| `/#/app/blueprint` | `/member/blueprint` | ✅ Sleep Blueprint |
| `/#/app/recommendations` | `/member/recommendations` | ✅ Recommendations |
| `/#/app/progress` | `/member/progress` | ✅ Progress |
| `/#/app/goals` | `/member/goals` | ✅ Goals |
| `/#/app/profile` | `/member/profile` | ✅ Profile |
| `/#/admin` | `/admin` | ✅ Admin Overview |
| `/#/admin/users` | `/admin/participants` | ✅ Participants |
| `/#/admin/assessments` | `/admin/results` | ✅ Results |
| `/#/admin/analytics` | `/admin/analytics` | ✅ Analytics |
| `/#/admin/reports` | `/admin/share-link` | ✅ Share Link / Reports |
| `/#/admin/content` | `/admin/settings` | ✅ Content / Settings |
| `/#/admin/facts` | (merged into settings) | ℹ️ Content pages |
| `/#/admin/insights` | (merged into settings) | ℹ️ Content pages |
| `/#/super` | `/superadmin` | ✅ Command Center (redirect from `/super`) |
| `/#/super/orgs` | `/superadmin/organizations` | ✅ Organizations |
| `/#/super/admins` | `/superadmin/users` | ✅ Admin Management |
| `/#/super/analytics` | `/superadmin/reports` | ✅ Reports |
| `/#/super/metrics` | (dashboard) | ℹ️ Merged into landing |
| `/#/super/governance` | (settings) | ℹ️ Merged |
| `/#/super/system` | (settings) | ℹ️ Merged |
| `/#/super/settings` | `/superadmin/settings` | ✅ Settings |

## Files Changed / Created

### Configuration
- `next.config.ts` — Next.js config with image remote patterns
- `tsconfig.json` — TypeScript config for Next.js
- `postcss.config.mjs` — PostCSS with @tailwindcss/postcss plugin
- `package.json` — Next.js dependencies
- `app/globals.css` — Tailwind v4 with @theme directives (identical to original)

### Shared Components (migrated)
- `components/ui.tsx` — Wordmark, GoldButton, GhostButton, Reveal, Parallax, Eyebrow (Link → next/link)
- `components/CircadianOrbit.tsx` — Brand orbital motif (unchanged logic)
- `components/PortalLayout.tsx` — Sidebar layout with next/navigation usePathname
- `components/charts.tsx` — MiniLine, Bars, Ring SVG charts (unchanged)
- `components/Navbar.tsx` — Landing navigation (Link → next/link)
- `components/Footer.tsx` — Landing footer (Link → next/link)
- `components/AssessmentModal.tsx` — Modal (Link → next/link)
- `components/SmoothScroll.tsx` — Lenis integration (unchanged)

### Marketing Components (migrated)
- `components/marketing/Hero.tsx`
- `components/marketing/HeroSlider.tsx`
- `components/marketing/SectionsEarly.tsx`
- `components/marketing/ImageShowcase.tsx`
- `components/marketing/Chronotypes.tsx`
- `components/marketing/SectionsMid.tsx`
- `components/marketing/SectionsLate.tsx`

### Mock Data Files (new)
- `lib/mock/member-dashboard.ts` — All member portal data
- `lib/mock/admin-dashboard.ts` — All admin portal data
- `lib/mock/superadmin-dashboard.ts` — All superadmin portal data

### Portal Pages (new)
- `app/member/layout.tsx`, `app/member/page.tsx` + 8 sub-pages
- `app/admin/layout.tsx`, `app/admin/page.tsx` + 5 sub-pages
- `app/superadmin/layout.tsx`, `app/superadmin/page.tsx` + 4 sub-pages

### Redirects
- `app/app/page.tsx` → redirects to /member
- `app/admin/page.tsx` → admin dashboard (Overview)
- `app/super/page.tsx` → redirects to /superadmin

## Dependency Changes

### Removed
- `react-router-dom` — replaced by Next.js App Router
- `@vitejs/plugin-react` — Vite-specific
- `vite`, `vite-plugin-singlefile` — Vite-specific
- `@tailwindcss/vite` — replaced by @tailwindcss/postcss

### Added
- `next` — Framework
- `@tailwindcss/postcss` — Tailwind PostCSS plugin (v4 compatible)

### Preserved
- `react`, `react-dom` — Same versions
- `framer-motion` — Animation library (unchanged)
- `lenis` — Smooth scrolling (unchanged)
- `clsx`, `tailwind-merge` — Utility (unchanged)

## Remaining Placeholders

1. **Search functionality** — The portal search bar is a static placeholder (`⌕ Search insights…`)
2. **Notification system** — The notification bell icon is decorative
3. **User avatars** — Generated initials, no photo upload/display
4. **Footer links** — Column links use `#` hrefs (placeholder)
5. **Research Library CTA** — Links to `#` in EducationalVisual section
6. **Content management** — Tables display mock data only
7. **Reports download** — Download icons are decorative
8. **Settings save** — "Save Changes" button has no backend
9. **Assessment data** — Results are not persisted to any backend
10. **Infographic placeholders** — FeaturedInsight section contains a placeholder visual

## Remaining Dummy APIs

All data is currently served from mock files in `/lib/mock/`. The following areas use mock data:

- Member dashboard stats, charts, goals, protocols
- Admin organization stats, user lists, submissions, content
- Superadmin platform stats, org lists, admin management, settings
- All chart data (MiniLine, Bars, Ring values)
- Chronotype assessment results (client-side calculation)
- User profiles and details

## Potential Issues

1. **Tailwind CSS v4 compatibility** — The @theme directive syntax differs from v3. Ensure @tailwindcss/postcss version matches the tailwindcss version.
2. **CSS animations** — The custom `@keyframes` in globals.css may conflict if not properly scoped. They use standard naming but be aware of potential collisions.
3. **Framer Motion client component** — All components using framer-motion must have `"use client"` directive. This is correctly applied.
4. **Lenis in production** — Ensure Lenis doesn't conflict with Next.js hydration. The `useLenis` hook runs only on the client side via useEffect.
5. **Image optimization** — The app uses external images from pexels.com via CSS `background-image`. These are not optimized by next/image. Consider migrating to next/image for production performance.
6. **Redirects** — The `/app`, `/admin`, `/super` routes use `redirect()` from next/navigation which works server-side. Ensure these don't cause unexpected behavior.
7. **Sidebar active state** — Uses `usePathname()` which works correctly with App Router. Ensure route matching is exact.
8. **Build output** — The app builds as a multi-page Next.js app (not static export). Deployment requires a Node.js server.

## Verification Checklist

- [x] UI visually identical to original
- [x] All pages load without errors
- [x] Navigation between pages works
- [x] Tailwind CSS renders correctly
- [x] Mobile responsiveness preserved
- [x] No react-router-dom dependency remains
- [x] No Vite-specific configuration remains
- [x] Framer Motion animations function correctly
- [x] Charts and data visualizations render
- [x] Portal sidebar navigation is active-highlighted
