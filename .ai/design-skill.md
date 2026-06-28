# CHRONOTYPE Design Skill — For AI Agents

This document defines the design rules and visual standards for CHRONOTYPE. All AI-generated pages, components, or modifications MUST follow these guidelines to maintain visual consistency.

## What Must Never Change

1. **Color Palette**: The exact color tokens defined in `app/globals.css` (`midnight`, `indigo-deep`, `ocean`, `royal`, `elegant`, `gold`, `amber`, `champagne`, `sunrise`, `ivory`, `linen`, `stone`, `sand`, `mist`, `sage`, `lavender`). Never introduce new colors without approval.

2. **Typography**: Poppins for headings/serif, Open Sans for body. Never change the font stack. Always use `font-serif` for headings and emphasis numbers.

3. **Grain Overlay**: The `.grain` CSS class must be present on every dark-bg page (landing and portals). It provides the proprietary texture.

4. **Animation System**: Framer Motion is the ONLY animation library. Easing must use `[0.22, 1, 0.36, 1]`. The `Reveal`, `Parallax` components are the standard scroll animation primitives.

5. **CircadianOrbit Motif**: This proprietary SVG component is the brand identifier. It appears on the hero, chronotype section, sleep blueprint, global impact, and portal loading states. It must never be removed or significantly altered.

6. **Portal Layout**: The `PortalLayout` component with fixed sidebar (288px) and sticky header is the standard for all authenticated pages. Never create a different layout pattern for portal pages.

## Design Rules to Follow

### Typography Standards
- All headings use `font-serif` (Poppins).
- Body text is sans-serif by default.
- `gold-text` with shimmer animation is reserved for hero emphasis ONLY.
- Eyebrow labels: `text-[11px] font-semibold uppercase tracking-[0.35em] text-gold/80`.
- Stat values: `font-serif text-4xl` with accent color.
- Phase out utility classes like `text-balance` — use standard Tailwind.
- On dark backgrounds, text opacity hierarchy: primary 100%, secondary 55–65%, tertiary 40%.
- On light backgrounds, text opacity hierarchy: primary 100%, secondary 55–65%, tertiary 40%.

### Component Standards
- Cards: `rounded-2xl border border-ivory/10 bg-ivory/[0.04] p-6 backdrop-blur`.
- Gold buttons: Gradient from `champagne` via `gold` to `sunrise`, with gold shadow, `rounded-full`.
- Tables: Inside `Card overflow-x-auto p-0` with styled header row.
- Charts: Use the existing `MiniLine`, `Bars`, `Ring` components from `/components/charts.tsx`.
- Navigation items: Active state = gold gradient bg, inactive = low opacity with hover effect.

### Layout Principles
- Landing sections: `py-32` vertical padding, `max-w-7xl` width.
- Portal content: Main area starts at `lg:pl-72` to account for sidebar.
- Portal page padding: `p-6 lg:p-10`.
- Mobile sidebar: Overlay pattern with black/50 backdrop.
- Grid gaps: Use `gap-6` as the standard.
- Section spacing: `mt-6` between adjacent sections in portals.

### Responsive Behavior
- Sidebar collapses below `lg` breakpoint.
- Stat grids: `sm:grid-cols-2 lg:grid-cols-4`.
- Card grids: `md:grid-cols-2 lg:grid-cols-3`.
- Landing typography: Always use `clamp()` for fluid sizing.
- Always test on mobile (375px) and desktop (1440px) widths.

## Reusable UI Patterns

Always use these patterns rather than creating new ones:

1. **Reveal Section**: Wrap section content in `Reveal` component for scroll-triggered fade-up animation.
2. **Eyebrow + Title**: `Eyebrow` component + `h2` with serif font and `clamp()` sizing.
3. **Stat Cards**: Using `Stat` component from PortalLayout.
4. **Data Display**: Using `MiniLine`, `Bars`, or `Ring` from charts.tsx.
5. **CTA Pairs**: GoldButton + GhostButton side by side.
6. **Page Sections**: `PageHeader` component for portal page titles.

## When Creating New Pages

1. Always check `design.md` for the complete design reference.
2. Use mock data from `/lib/mock/` for development data.
3. Never hardcode data that should come from an API — put it in mock files.
4. Use the existing `PortalLayout` for all authenticated pages.
5. Use `PageHeader` for page titles.
6. Use `Card` for content containers.
7. Use `Stat` for metric displays.
8. Use chart components for data visualization.
9. Always include the `.grain` overlay on dark pages.
10. Framer Motion animations must use the standard easing: `[0.22, 1, 0.36, 1]`.

## File Structure Rules

- Components go in `/components/` or `/components/marketing/`.
- Mock data goes in `/lib/mock/`.
- Page files go in `/app/` following App Router conventions.
- Shared utilities go in `/lib/utils.ts`.
- Do NOT create new directories outside these patterns without approval.
