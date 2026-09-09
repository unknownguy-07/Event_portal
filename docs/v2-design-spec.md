# Event Portal v2 — Design Specification

## Product Vision

A mobile-first university event discovery app for Manav Rachna University students. The design philosophy is **"scan, tap, done"** — students on their phones between classes should find what's happening on campus within 3 seconds.

---

## Design Principles

1. **Mobile-first, desktop-compatible.** Every layout decision starts from a 375px viewport. Desktop gets more columns, not a different interface.
2. **Content density over decoration.** No hero banners, no carousels. Students want a feed of events, not a marketing page.
3. **Light mode default with dark toggle.** Students use phones outdoors and in bright classrooms. Light mode respects battery on OLED screens when browsing quickly. Dark mode is available for night owls. Preference persists via `localStorage`.
4. **Flat, warm, approachable.** Inspired by iOS native apps, Google Material You, and Notion mobile. Subtle rounded corners, generous touch targets (min 44px), no harsh shadows.
5. **Information hierarchy on cards.** Every card answers: *What? When? Where? Free or paid?* — in that order, scannable in under 2 seconds.

---

## Color System

### Light Mode (Default)
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#FFFFFF` | Page background |
| `--bg-card` | `#F8F9FA` | Card surfaces |
| `--bg-elevated` | `#FFFFFF` | Elevated surfaces (nav, modals) |
| `--text-primary` | `#1A1A2E` | Headings, event names |
| `--text-secondary` | `#6B7280` | Metadata, labels |
| `--text-muted` | `#9CA3AF` | Placeholder, disabled |
| `--border` | `#E5E7EB` | Dividers, card borders |
| `--accent` | `#4F46E5` | Primary actions, active states |
| `--accent-light` | `#EEF2FF` | Active pill backgrounds |
| `--success` | `#059669` | "Free" badge |
| `--warning` | `#D97706` | "Paid" badge |

### Dark Mode
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0F0F14` | Page background |
| `--bg-card` | `#1A1A24` | Card surfaces |
| `--bg-elevated` | `#1E1E2A` | Elevated surfaces |
| `--text-primary` | `#F1F1F4` | Headings |
| `--text-secondary` | `#9CA3AF` | Metadata |
| `--text-muted` | `#6B7280` | Placeholder |
| `--border` | `#2A2A3A` | Dividers |
| `--accent` | `#818CF8` | Primary actions |
| `--accent-light` | `#1E1B4B` | Active pill backgrounds |
| `--success` | `#34D399` | "Free" badge |
| `--warning` | `#FBBF24` | "Paid" badge |

---

## Typography

- **Font family:** `Inter` via Google Fonts (fallback: system-ui, sans-serif)
- **Scale (mobile):** 14px base, headings 18–24px
- **Scale (desktop):** 16px base, headings 20–28px
- **Weight ladder:** 400 (body), 500 (labels), 600 (subheadings), 700 (headings)

---

## Landing Page Layout (Top to Bottom)

The landing page is a single scrollable feed:

1. **Top Bar** — Compact. Logo + App name (left), Theme toggle + Sign in (right). Sticky on scroll.
2. **Search Bar** — Full-width below top bar. Always visible, never hidden. Large touch target.
3. **Category Pills** — Horizontal scroll row. "All" default. Single select.
4. **Filter & Sort Bar** — Inline compact controls: Fee filter chips (All / Free / Paid), Organizer dropdown, Sort dropdown (Popular / Latest).
5. **Event Feed** — Responsive card grid. Mobile: single column stacked list. Tablet: 2-col. Desktop: 3-col. No featured section. No carousel. Every event is equal.
6. **Footer** — Minimal. University name, copyright.

### What's Removed
- ❌ Featured Events carousel — all events are treated equally in the feed
- ❌ College info block in navbar — unnecessary for students who already know their college
- ❌ Hero banners — replaced with immediate content

### What's Added
- ✅ Theme toggle (light/dark) with localStorage persistence
- ✅ Search promoted to its own full-width row for maximum thumb accessibility on mobile
- ✅ Compact vertical event cards optimized for single-column mobile scanning

---

## Component Specifications

### 1. TopBar
- **Height:** 56px mobile, 64px desktop
- **Left:** App icon (24px rounded square) + "EventPortal" text (font-weight 700, 18px)
- **Right:** Theme toggle icon button (Sun/Moon, 40px touch target) + Sign-in button or avatar
- **Style:** Sticky, slight bottom border, elevated surface background
- **Mobile behavior:** Identical layout, no hamburger menu needed (search + pills are always visible)

### 2. SearchBar
- **Position:** Below TopBar, full-width with horizontal padding
- **Height:** 48px input (large touch target)
- **Icon:** Search icon left-aligned inside input
- **Clear button:** X icon appears when query is non-empty
- **Behavior:** Debounced (300ms), filters event feed by name/organizer/venue
- **Styling:** Rounded-2xl, subtle border, no heavy shadow

### 3. CategoryBar
- **Position:** Below SearchBar
- **Style:** Horizontal scroll, no-scrollbar, pill-shaped buttons
- **"All" is first and default-active**
- **"Saved" pill at the end** — replaces the old "Interested Events" button. Functionally identical. Prompts sign-in if unauthenticated.
- **Active state:** Accent background, white text. Inactive: muted background, secondary text.
- **Touch target:** Min 40px height per pill

### 4. FilterSortBar
- **Layout:** Single row, scrollable on mobile. Contains:
  - Fee chips: `All` / `Free` / `Paid` (toggle group, segmented control style)
  - Organizer: Compact select dropdown
  - Sort: Compact select dropdown (`Popular` default, `Latest`)
- **Style:** Compact, inline, 32px height controls. Below category bar.

### 5. EventCard (Redesigned)
- **Layout:** Vertical card, full-width on mobile
- **Structure (top to bottom):**
  1. Thumbnail image (aspect-ratio 16/9, rounded-xl, fills width)
  2. Content area below image:
     - **Row 1:** Event name (font-weight 700, 16px, max 2 lines, clamp)
     - **Row 2:** Organizer badge pill + Category badge pill (tiny, inline)
     - **Row 3:** Venue with map-pin icon (single line, truncated)
     - **Row 4:** Description (2 lines max, text-secondary, clamp)
     - **Row 5 (footer):** Date (left) + Fee badge (right) + Bookmark icon (far right)
- **Interactions:**
  - Entire card clickable → navigates to detail page
  - Bookmark icon: `e.stopPropagation()`, toggles saved state
  - Subtle scale(1.01) lift on hover (desktop only)
- **No contact number on card** (detail page only)

### 6. ThemeToggle
- **Type:** Icon button (Sun icon in dark mode, Moon icon in light mode)
- **Persistence:** Reads from `localStorage('theme')` on mount. Defaults to `'light'`. Writes on toggle.
- **Implementation:** CSS custom properties via `data-theme` attribute on `<html>`. No Tailwind dark: prefix needed — use CSS variables.
- **Transition:** `transition: background-color 0.2s, color 0.2s` on body for smooth mode switch

### 7. EventDetailPage
- **Full information display:**
  - Banner image (full-width, rounded bottom)
  - Event name, category, organizer badges
  - Full description (multi-paragraph)
  - Venue with map icon
  - Date
  - Contact number (clickable tel: link)
  - Registration type badge (Free/Paid with fee amount)
  - Register button (placeholder action)
  - Bookmark toggle
  - Back link to landing page

---

## Responsive Breakpoints

| Breakpoint | Width | Event grid | Card style |
|------------|-------|-----------|------------|
| Mobile | < 640px | 1 column | Full-width stacked |
| Tablet | 640–1024px | 2 columns | Grid cards |
| Desktop | > 1024px | 3 columns | Grid cards |

---

## Accessibility

- All interactive elements: min 44px touch target
- `focus-visible` outlines using accent color
- ARIA labels on icon-only buttons (theme toggle, bookmark, search clear)
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`
- Heading hierarchy: single `<h1>` (app name in TopBar), `<h2>` per section, `<h3>` per card
- Color contrast: WCAG AA minimum in both light and dark modes

---

## Animations

- Card hover: `transform: translateY(-2px)` + subtle shadow increase (desktop only, `prefers-reduced-motion` respected)
- Theme toggle: Smooth 200ms color transition on `background-color` and `color`
- Category pill active: Background color transition 150ms
- Fade-in on initial page load (single 300ms animation, not per-card)
- Search clear: opacity fade 150ms

---

## Empty States

- **Search no results:** Search icon + "No events match '[query]'" + suggestion to adjust
- **Empty category:** Calendar icon + "No events in this category yet"
- **Empty saved:** Bookmark icon + "Tap the bookmark icon on any event to save it here"
- **Filter no results:** Filter icon + "No events match your current filters"

---

## Future Integration (Not in Scope)

- Firebase Auth (replace mock sign-in)
- Firestore live data (replace mock data)
- Event registration flow
- Push notifications
- Admin/Organizer dashboard
