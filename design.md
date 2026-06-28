# CHRONOTYPE — Design Philosophy & Visual System

## Design Philosophy

CHRONOTYPE is a premium sleep intelligence platform. The design language communicates **depth, science, and warmth**. Every visual decision reinforces trust, biological truth, and the sense of returning to a natural rhythm.

The core design principles:
- **Dark + Warm**: Midnight backgrounds with gold/amber accents create a nocturnal, premium atmosphere.
- **Scientific but Human**: Clean typography and data visualization balanced with organic curves, gradients, and warm tones.
- **Motion with Purpose**: Animations are slow, smooth, and meaningful — never decorative noise. They mirror biological rhythms (orbital spins, pulse glows, float effects).
- **Depth through Layers**: Translucent panels, backdrop blur, gradient overlays, and parallax create a rich spatial experience.

---

## Typography Rules

### Font Stack
- **Headings**: `Poppins` (300–800 weight) — geometric, clean, premium serif alternative.
- **Body**: `Open Sans` (300–700 weight) — highly readable, warm sans-serif.
- **Monospace / Data**: System monospace (no explicit declaration, but used sparingly).
- **Fallback**: Poppins falls back to Georgia (serif); Open Sans falls back to system-ui.

### Type Scale
- **Hero headlines**: `clamp(2.75rem, 7.5vw, 7rem)` — fluid scaling across viewports.
- **Section headings**: `clamp(2.3rem, 5vw, 5.5rem)` — prominent but subservient to hero.
- **Card titles**: `font-serif text-2xl` (1.5rem) or `text-3xl` (1.875rem).
- **Body / descriptive**: `text-base` (1rem) to `text-lg` (1.125rem), `leading-relaxed`.
- **Eyebrows**: `text-[11px] font-semibold uppercase tracking-[0.35em]` — tiny, spaced, gold-tinted.
- **Labels / stats**: `text-xs uppercase tracking-widest` — small, uppercase, low opacity.

### Usage Rules
- `.font-serif` is ALWAYS used for headings, large numbers, and emphasis words.
- Body text is default sans-serif (Open Sans).
- `gold-text` class with animated gradient is reserved for hero emphasis and brand moments only.
- Italic (`italic`) is used for key conceptual words (e.g. "natural", "potential", "science").
- Tracking (letter-spacing) is generous on uppercase text: `0.3em–0.5em`.

---

## Color System

### Dark Palette (Primary)
| Token | Hex | Usage |
|-------|-----|-------|
| `midnight` | `#081421` | Page backgrounds, dark sections |
| `indigo-deep` | `#10203b` | Sidebar, card surfaces, overlays |
| `ocean` | `#132642` | Secondary dark sections |
| `royal` | `#2c3d73` | Emphasis, CTAs (dark mode), interactive elements |
| `elegant` | `#354a82` | Bars, charts, secondary surfaces |

### Warm Accent Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `gold` | `#f4b54d` | Primary accent, active states, badges |
| `amber` | `#f2a640` | Secondary accent, warmth |
| `champagne` | `#f5d18c` | Gradient edges, soft highlights |
| `sunrise` | `#e7a95b` | Gradient partner to gold |

### Light Palette (Landing Sections)
| Token | Hex | Usage |
|-------|-----|-------|
| `ivory` | `#faf8f4` | Light text, light section bg |
| `linen` | `#f4f0ea` | Light section backgrounds |
| `stone` | `#efeae2` | Alternate light section |
| `sand` | `#e9ded4` | Warm light sections |
| `mist` | `#f2f2f0` | Neutral light sections |
| `sage` | `#eef2ea` | Green-tinted light sections |
| `lavender` | `#e9e2f5` | Purple-tinted accent sections |

### Semantic Colors
- Success: `emerald-400/15` bg, `emerald-300` text
- Warning/Risk: `amber-400/15` bg, `amber-300` text
- Selection: `gold` background, `midnight` text

### Color Application Rules
- Text on dark backgrounds: `text-ivory` (primary), `text-ivory/xx` (various opacities for hierarchy)
- Text on light backgrounds: `text-midnight` (primary), `text-midnight/xx` (hierarchy)
- Active navigation items: `bg-gradient-to-r from-gold/20 to-transparent` with `text-gold`
- Inactive navigation: `text-ivory/60 hover:bg-ivory/5 hover:text-ivory`
- Gold is ALWAYS used for the primary CTA color and active indicators
- Royal (blue) is the secondary accent for charts and non-gold emphasis

---

## Spacing System

### Page Level
- Section vertical padding: `py-28` (7rem) to `py-32` (8rem) for major sections.
- Landing content max-width: `max-w-7xl` (80rem).
- Horizontal padding: `px-6` on sections, `px-6 lg:px-10` in portal main.
- Portal main content: `p-6 lg:p-10`.

### Card Level
- Default card padding: `p-6`.
- Card gaps in grids: `gap-6`.
- Cards have `rounded-2xl` (1rem) border radius.
- Card borders: `border border-ivory/10`.
- Card backgrounds: `bg-ivory/[0.04]` with `backdrop-blur`.

### Element Spacing
- Between heading and description: `mt-6` to `mt-7`.
- Between section eyebrow and heading: `mb-6`.
- Between adjacent cards/sections: `mt-6`, `mt-8`, `mt-9`, `mt-16`.
- Grid gaps: `gap-4`, `gap-6`, `gap-12`.
- Button padding: `px-7 py-3.5` (standard), `px-5 py-2.5` (compact).
- Badge padding: `px-2.5 py-1`.
- Table cell padding: `px-6 py-4`.

---

## Component Patterns

### Cards
- Always `rounded-2xl` with `border border-ivory/10`.
- Background `bg-ivory/[0.04]` with `backdrop-blur`.
- Entry animation: fade up `opacity: 0, y: 16` → `opacity: 1, y: 0` over 0.5s.
- Hover state: `hover:bg-ivory/[0.07]` where interactive.

### Buttons
- **GoldButton**: `rounded-full bg-gradient-to-r from-champagne via-gold to-sunrise` with gold shadow. Hover: `scale-[1.03]`.
- **GhostButton**: `rounded-full border` with hover fill.
- **Portal sidebar links**: `rounded-xl` with active gold gradient background.
- All CTAs use `rounded-full`.

### Tables
- Contained in `Card` with `overflow-x-auto p-0`.
- Header row: `border-b border-ivory/10 text-xs uppercase tracking-widest text-ivory/40`.
- Body rows: `border-b border-ivory/5 hover:bg-ivory/[0.03]`.
- Status badges use colored backgrounds with matching text.

### Charts (Custom SVG)
- **MiniLine**: Polylines with gradient fill, `preserveAspectRatio="none"` for fluid width.
- **Bars**: Flex-based bars with `flex-1 rounded-t`.
- **Ring**: SVG circle with dashoffset animation for progress display.

### Navigation
- Sidebar: fixed 288px (`w-72`), `bg-indigo-deep/80 backdrop-blur-xl`.
- Active indicator: gold left bar (`h-6 w-1 rounded-r bg-gold`) with framer-motion `layoutId`.
- Mobile: hamburger toggle with overlay.

---

## Animation Rules

### Scroll Animations
- **Reveal**: Elements fade up (`opacity: 0, y: 34` → `0, 0`) on scroll into view. Duration: 0.9s. Easing: `[0.22, 1, 0.36, 1]` (custom cubic bezier).
- **Parallax**: Elements move at different speeds relative to scroll using `useTransform`.
- **Scroll Progress Bar**: Fixed 3px bar at top of landing page.

### Hover Animations
- Scale transforms: Buttons scale to `1.03` on hover.
- Underline: Nav links have gold underline that grows from 0 to full width.
- Progress bars: Cards in WhySleepMatters have a bottom gradient bar that expands on hover.

### Entrance Animations
- Navbar: Slides down from `y: -80`.
- Hero text: Lines animate from `y: 110%` with staggered delays.
- Orbital elements: Continuous CSS `@keyframes` for orbit spin, pulse glow, float.

### Duration & Easing Standards
- Entrance transitions: 0.8s–1s.
- Hover transitions: 0.3s.
- Page/section transitions: 0.5s–0.9s.
- Default easing: `[0.22, 1, 0.36, 1]` (smooth, natural).
- CSS transitions: `duration-300` or `duration-500`.

---

## Layout Principles

### Landing Page
- Full-height hero sections (`138vh` for main hero).
- Alternating dark/light/colored sections throughout the scroll narrative.
- Max-width `max-w-7xl` centered content with `px-6` padding.
- Grain texture overlay on all dark backgrounds.
- Scroll progress bar fixed at top.

### Portal Pages
- Fixed sidebar (288px) + fluid main area with `lg:pl-72`.
- Sticky header with backdrop blur.
- Main content pad: `p-6 lg:p-10`.
- Responsive break at `lg` (1024px) for sidebar toggle.

### Grid Patterns
- Portal dashboards: `lg:grid-cols-3`, `lg:grid-cols-4` for stats.
- Marketing sections: `lg:grid-cols-12` for complex layouts.
- Card grids: `sm:grid-cols-2 lg:grid-cols-3`.

---

## Visual Hierarchy

1. **Hero headline** → largest, animated, gold accent words.
2. **Section titles** → serif, fluid scale, italic on key words.
3. **Stat values** → `font-serif text-4xl` or larger, colored accent (gold/champagne/royal).
4. **Card titles** → `font-serif text-2xl`.
5. **Eyebrows** → tiny uppercase gold text.
6. **Body text** → sans-serif, lower opacity (55%–70% on dark, 60%–70% on light).

---

## UX Principles

- Every interaction has a micro-animation (hover, enter, transition).
- Data is always visual first (charts, rings, bars) with text secondary.
- Loading/empty states use the CircadianOrbit motif.
- Dark mode is the default (portals) — light mode exists only on landing.
- All CTAs offer clear next steps with arrow indicators (→).
- Scrolling is smooth via Lenis on landing.
- Navigation is persistent via sidebar in portals.
- Search bar is placeholder-ready but visually present.
- Notification dot indicator is always visible.
- User avatar is gradient-created initials (no photo placeholders).
