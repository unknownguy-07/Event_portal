# Project Overview

This document specifies the requirements for the **Landing Page** of a University Event Portal — a web application that allows students to discover, browse, and bookmark events happening at their college, and allows organizers to publish event listings in a single, organized location instead of scattered WhatsApp messages.

The application will be built using **React**, **Firebase** (Authentication, Firestore, Storage), and **Tailwind CSS**. This document covers the landing page only. Backend logic, authentication flows, and dashboard features are noted for future integration but are not the primary scope of this document.

This document is intended to be handed directly to an AI coding agent (Google Antigravity) for implementation. It should be treated as a complete specification — the agent should not need to guess intent.

---

# Objective

Build a landing page that:

- Presents university events in a clean, scannable, browsable format
- Feels like a polished consumer product, not a typical institutional/university website
- Surfaces the most important, time-sensitive, or promoted events prominently (Featured Events)
- Allows fast discovery through search, categories, and sorting
- Funnels users toward a dedicated event detail page for full information — the landing page intentionally shows only summary information per event
- Is fully responsive and accessible
- Is architected in a way that supports future features (authentication, registration, dashboards, ticketing) without requiring a structural rebuild

---

# Target Users

**Students** — the primary audience. They come to browse events, search for specific events, bookmark ones they're interested in, and eventually register. They are likely using both desktop and mobile, with mobile usage being significant.

**Organizers** — a secondary audience for this specific page. On the landing page, organizers behave like any other visitor (browsing/searching). Their event-creation and management experience lives in a separate Organizer Dashboard (out of scope for this document, noted under Future Integration).

**Guests (not signed in)** — should be able to browse and search events freely. Sign-in is only required for interactive/personalized features such as bookmarking ("Interested Events") and registration.

---

# Landing Page Layout

The landing page is composed of the following sections, in this vertical order:

1. Navigation Bar
2. Category Bar (horizontal, pill-style)
3. Featured Events (single rotating carousel banner)
4. Event Listing Controls (sort dropdown)
5. Event List (grid/list of event cards)

Each section is detailed fully below.

---

# Functional Requirements

## 1. Navigation Bar

**Layout:** Three horizontal zones — left, center, right.

**Left side:**
- App logo (image/icon)
- Application name (text, next to logo)

**Center:**
- College name (text)
- College address (text, displayed below or beside the college name)
- The college address must be a clickable element. Clicking it opens Google Maps in a new tab, pre-populated with the college's address as the search query.

**Right side:**
- Search bar
  - Placeholder text should indicate it searches events (e.g., "Search events...")
  - Search must dynamically filter/query event names as the user types (live search, not requiring a separate submit action)
  - Search should be debounced to avoid excessive queries while typing
- Google Sign In button
  - Displays a "Sign in with Google" button when the user is not authenticated
  - Once authenticated, this element should transform into a user avatar/profile indicator (implementation detail for future integration — for now, build the signed-out state as the default, with the component structured to support a signed-in state later)

## 2. Category Bar

- A horizontal row of pill-shaped category buttons, positioned directly below the navigation bar
- Pills use fully rounded corners (pill styling), not sharp or slightly-rounded corners
- The default/first pill is always **"All"**, and it should be selected/active by default on page load
- Additional category pills will be populated dynamically from Firebase Firestore (categories are not hardcoded; the component should render whatever category list it receives from data)
- Only one category can be selected/active at a time
- Selecting a category filters the Event List section below (categories do not filter the Featured Events carousel)
- **"Interested Events"** is a distinct button in this same bar (visually or functionally distinguished from category pills — it is an action/filter, not a content category)
  - Clicking it opens/filters to the current user's bookmarked events
  - If the user is not signed in, clicking this should prompt sign-in rather than showing an empty or broken state
- On mobile, this entire bar scrolls horizontally rather than wrapping to multiple lines

## 3. Featured Events

- A single large rotating carousel banner (not a row of multiple static banners)
- Each slide in the carousel represents one featured/promoted event
- Each slide must display:
  - Event image (large, prominent, fills most of the banner)
  - Event title
  - A short tagline/subtitle (one line, brief description or hook)
  - A call-to-action button labeled **"View Event"**
- Interaction:
  - Clicking anywhere on the banner (excluding nothing — the whole banner is clickable) navigates to that event's detail page
  - Clicking the "View Event" CTA button also navigates to that event's detail page (same destination, just an additional obvious click target)
- Automatic behavior:
  - The carousel auto-advances to the next slide every few seconds (recommend 5–6 second interval)
  - Auto-advance should pause on hover/focus so users can read content without it changing under them
- Manual navigation:
  - Left/right arrow controls to move between slides
  - Pagination dots below or overlaid on the banner indicating current slide position and total slide count; dots should be clickable to jump to a specific slide

## 4. Event Listing Controls

- Positioned between the Featured Events section and the Event List
- Contains a **Sort dropdown** with the following options:
  - Latest (default selection)
  - Registration Fee (Low to High)
  - Registration Fee (High to Low)
- The component should be structured to allow additional filter controls to be added later (e.g., date range, venue, free-only) without requiring a layout rebuild — leave visual/structural room for this, but do not build those filters now

## 5. Event List

**Critical constraint: the landing page must NOT display full event details.** This is intentional — full details live only on the dedicated event detail page.

Each event card in the list must display only:

- Event thumbnail (image)
- Event name
- A small category tag (visually distinct label indicating which category the event belongs to)
- Date
- Registration fee (or "Free" if applicable)
- Bookmark icon (toggles the "interested"/bookmarked state for the signed-in user; if not signed in, clicking should prompt sign-in)

Explicitly excluded from the event card (these belong only on the detail page): full description, venue, time, organizer name, tags beyond the single category tag, gallery images, rules.

**Interaction:**
- Clicking anywhere on the event card (except the bookmark icon, which has its own isolated click behavior) navigates to that event's dedicated detail page
- The bookmark icon click must not trigger navigation (event propagation should be stopped on that element)

**Layout:**
- Events display in a responsive grid (desktop: multi-column grid; mobile: single column or two-column, per Responsive Behaviour section)

---

# UI Components

The following distinct, reusable components should be built for this page:

1. `NavigationBar` — contains logo, app name, college info block, search bar, sign-in button
2. `CollegeInfoBlock` — college name + clickable address (could be a sub-component of NavigationBar)
3. `SearchBar` — live/debounced search input
4. `SignInButton` — Google sign-in trigger, with signed-out state built now and signed-in state stubbed for later
5. `CategoryPill` — individual selectable pill button
6. `CategoryBar` — horizontal scrollable container of `CategoryPill` components + the "Interested Events" button
7. `FeaturedCarousel` — the rotating banner component, including arrows and pagination dots
8. `FeaturedSlide` — individual slide content (image, title, tagline, CTA)
9. `SortDropdown` — the sort control
10. `EventCard` — individual event summary card (thumbnail, name, category tag, date, fee, bookmark icon)
11. `EventGrid` — responsive container/list of `EventCard` components
12. `BookmarkIcon` — toggleable icon button, isolated click handling

Each component should be self-contained, accept data via props, and avoid hardcoded content (aside from static UI labels like "View Event" or "All").

---

# User Experience Requirements

- Page should load with a clear visual hierarchy: navigation → categories → featured carousel → controls → event list, guiding the eye naturally downward
- Search should feel instant and responsive; results should update the Event List section without a full page reload
- Category selection should give immediate visual feedback (active pill state clearly distinguished from inactive pills)
- The featured carousel should never feel jarring — transitions must be smooth, not an abrupt cut
- Loading states should be considered for the Event List (e.g., skeleton cards) and Featured Carousel (e.g., placeholder/skeleton banner) since data will be fetched from Firebase asynchronously
- Empty states should be handled gracefully — for example, if a category has no events, or a search returns no results, show a clear, friendly empty-state message rather than a blank section
- Bookmarking should give immediate visual feedback (icon state change) even before/without waiting on network confirmation, with graceful handling if the action fails
- Sign-in prompts (triggered by bookmarking or "Interested Events" while signed out) should be non-disruptive — a modal or inline prompt rather than a jarring redirect

---

# Visual Design Guidelines

The UI should **not** resemble a traditional university/institutional website. It should feel like a modern startup consumer product.

**Design inspiration:** Linear, Notion, Airbnb, Apple, Discord.

**Characteristics to embody:**
- Generous, clean whitespace — avoid cramped, dense layouts
- Modern, legible typography with clear hierarchy (distinct sizing/weight between headings, body text, and labels)
- Rounded corners throughout (cards, buttons, pills, images) — soft, friendly geometry rather than sharp edges
- Soft, subtle shadows for depth (cards, carousel, dropdowns) — avoid harsh or heavy drop shadows
- Smooth, purposeful animations and transitions (see Animations section)
- Minimalistic, consistent iconography (search icon, bookmark icon, arrows, etc. should share a single icon style/library)
- Consistent spacing scale applied throughout (uniform padding/margin rhythm, not ad hoc values)
- Overall impression should feel premium, intentional, and polished — not like a default template or generic Bootstrap-style layout

---

# Responsive Behaviour

**Approach:** Desktop-first design, then adapted down for tablet and mobile.

**Desktop:**
- Full navigation bar with all elements visible inline
- Multi-column event grid
- Full-width featured carousel

**Tablet:**
- Navigation bar elements may condense slightly (e.g., reduced spacing) but remain inline where possible
- Event grid reduces to fewer columns
- Category bar remains horizontally scrollable if it doesn't fit

**Mobile:**
- Navigation collapses into a **hamburger menu** for secondary elements
- Search must remain easily accessible (not buried multiple taps deep inside the hamburger menu — it should be visible or one tap away)
- Featured carousel scales down proportionally, remains full-width, and remains swipeable/touch-friendly
- Category bar scrolls horizontally (does not wrap to multiple lines)
- Event cards stack responsively (single or two-column grid depending on available width)

---

# Accessibility

- Full keyboard navigation support — all interactive elements (search, sign-in, category pills, carousel arrows/dots, sort dropdown, event cards, bookmark icons) must be reachable and operable via keyboard (Tab, Enter, Space, Arrow keys where appropriate)
- Proper semantic heading hierarchy (e.g., a single primary heading structure, with section headings appropriately nested — do not skip heading levels)
- ARIA labels on icon-only buttons and interactive elements without visible text labels (e.g., bookmark icon, carousel arrows, hamburger menu button)
- Color contrast must meet accessibility compliance standards (WCAG AA minimum) for text against backgrounds, including text overlaid on carousel images
- Visible focus states on all interactive elements — focus outlines must not be removed without an accessible replacement

---

# Animations

Use subtle, purposeful animations only. Avoid anything flashy, bouncy, or distracting.

**Include:**
- Button hover states (subtle color/scale/shadow shift)
- Card lift effect on hover (slight elevation/shadow increase on event cards and featured slides)
- Smooth carousel transition between slides (fade or slide transition, not an instant cut)
- Fade-in effect for sections/content as they load or enter view
- Smooth scrolling behavior where applicable (e.g., horizontal category scroll, anchor navigation if used)

**Avoid:**
- Bouncing, spinning, or exaggerated motion
- Animations that delay user interaction or feel sluggish
- Excessive simultaneous animations that feel chaotic

---

# Future Integration Notes

This landing page will later integrate with the following systems and features. The current implementation should be architected modularly (clear separation of components, data-fetching logic, and UI) so these can be added without requiring a structural rebuild of the landing page:

- **Firebase Authentication** — full sign-in/sign-out state management, replacing the current signed-out-only stub for the Sign In button
- **Firestore** — live data source for events, categories, and user bookmark data (replacing any placeholder/mock data used during initial build)
- **Firebase Storage** — hosting for event images, banners, and thumbnails
- **Admin Dashboard** — a separate interface for platform-level administration
- **Organizer Dashboard** — a separate interface where organizers create, edit, and manage their events, and view registrations
- **Event Registration** — a registration flow accessible from the event detail page, including handling of limited-seat events
- **QR Ticketing** — generation and display of QR-code-based tickets for registered users
- **Notifications** — user-facing notifications (e.g., reminders, registration confirmations, event updates)

---

# Acceptance Criteria

The landing page implementation is considered complete when all of the following are true:

1. Navigation bar renders logo, app name, college name, clickable college address (opens Google Maps in a new tab), live search bar, and Google Sign In button (signed-out state)
2. Search bar dynamically filters events by name as the user types, without requiring a page reload
3. Category bar renders "All" as the default active category plus dynamically-provided additional categories as pill-styled buttons, with only one active at a time
4. An "Interested Events" button exists in the category bar area, filters to the signed-in user's bookmarked events when clicked, and prompts sign-in if the user is not authenticated
5. Featured Events section renders as a single rotating carousel (not multiple static banners), with each slide showing image, title, tagline, and a "View Event" CTA
6. Carousel auto-advances on a timer, pauses on hover/focus, and supports manual navigation via arrows and clickable pagination dots
7. Clicking a featured slide (anywhere on it) or its CTA navigates to that event's detail page
8. A sort dropdown exists with "Latest," "Registration Fee (Low to High)," and "Registration Fee (High to Low)" options, defaulting to "Latest"
9. Event list displays only: thumbnail, name, category tag, date, registration fee, and bookmark icon — no other event details are shown on this page
10. Clicking an event card (outside the bookmark icon) navigates to that event's detail page; clicking the bookmark icon toggles bookmark state without triggering navigation
11. Layout is fully responsive across desktop, tablet, and mobile per the Responsive Behaviour section, including a mobile hamburger menu and horizontally scrolling category bar
12. All interactive elements are keyboard-navigable, properly labeled with ARIA where needed, and meet color contrast requirements
13. Animations are present as specified (hover, card lift, carousel transitions, fade-ins, smooth scrolling) and are subtle, not flashy
14. Empty states and loading states are handled gracefully for the event list and featured carousel
15. Component structure is modular and clearly separated, in a way that supports the Future Integration items without requiring a rebuild of existing components
