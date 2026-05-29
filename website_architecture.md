# Website Architecture — House of Nabl

## 1. System Overview

A **static-first, serverless** web application that displays a product gallery and delegates order completion to WhatsApp. Built with Vite, GSAP, and Lenis. No backend, no database, no payment processing.

> The website is a **read-only product viewer + order intent generator**. WhatsApp handles all conversation, negotiation, and fulfillment.

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Bundler | Vite 8 (JS entry: `index.html` → `src/js/app.js`) |
| Animations | GSAP 3.15 (`gsap`, `gsap/ScrollTrigger`) |
| Smooth Scroll | Lenis 1.3.23 |
| Styling | Plain CSS with custom properties |
| Fonts | Roboto (body), Anton (headings), Motterdam (designer notes) |
| Data | Static `data/products.json` (fetched at runtime) |

## 3. Source Structure

```
├── index.html                  Entry point (loads /src/js/app.js + /src/css/styles.css)
├── src/
│   ├── css/styles.css          All styles (design tokens, layout, components)
│   └── js/
│       ├── app.js              Init orchestrator
│       ├── smoothScroll.js     Lenis setup + ScrollTrigger integration
│       ├── utils/
│       │   ├── dom.js          isMobile(), lockScroll(), unlockScroll(), formatPrice(), prefersReducedMotion()
│       │   └── data.js         fetchProducts(), getProductById()
│       ├── animations/
│       │   ├── reveal.js       Scroll-triggered fade/y reveal (GSAP ScrollTrigger)
│       │   └── hover.js        Gallery image hover — dim others in same row, scale up
│       └── focus/
│           ├── index.js        openFocus(), closeFocus(), initFocus() — orchestrator
│           ├── state.js        Shared focus state (isFocusActive, isClosing, focusData, cartCount)
│           ├── overlay.js      Overlay creation and animation
│           ├── clone.js        FLIP clone creation, flipIn(), flipOut()
│           ├── gallery.js      Gallery creation, rAF-throttled scroll handler, scrollGalleryTo()
│           ├── panel.js        Product panel + CTA button, dynamic sizes from JSON
│           ├── indicator.js    Scroll indicator with clickable thumbnails
│           └── note.js         Designer's note creation, positioning, animation
├── data/
│   └── products.json           Single source of truth for product catalog
├── public/                     Vite's static public dir (served at /)
│   ├── data/products.json      Production copy of product JSON
│   ├── img/                    WebP product images + logo
│   └── font/                   Self-hosted fonts (FREESCPT.TTF, Motterdam-K74zp.ttf)
├── designsystem.md             Design token reference
├── package.json
└── vite.config.js
```

## 4. Module Responsibilities

### `app.js`
- Imports all modules and calls their `init*()` functions on DOMContentLoaded

### `smoothScroll.js`
- Creates Lenis instance with custom easing and wheel smoothing
- Registers ScrollTrigger with GSAP
- Syncs Lenis scroll with ScrollTrigger via `gsap.ticker.add()`
- Exports `initSmoothScroll()` and `getLenis()`

### `utils/dom.js`
- `isMobile()` — checks `window.innerWidth < 769`
- `lockScroll()` / `unlockScroll()` — body scroll lock with scrollbar-width compensation
- `formatPrice()` — formats number with Naira symbol
- `prefersReducedMotion()` — checks `prefers-reduced-motion` media query

### `utils/data.js`
- `fetchProducts()` — fetches and caches `/data/products.json`
- `getProductById(data, id)` — looks up product by ID

### `animations/reveal.js`
- Targets `.hero__row` elements
- Animates `y: 60 → 0` and `opacity: 0 → 1` via ScrollTrigger
- Staggered reveal with 0.15s delay between rows

### `animations/hover.js`
- Targets `.hero__row` elements, attaches per-row state via `WeakMap`
- On `mouseenter` (gated behind `(pointer: fine)`): scale up hovered image, dim all others in same row
- On `mouseleave` to another image in same row: transfer highlight state
- On `mouseleave` the row entirely: restore all images
- Guards against activation during focus mode (`body.focus-active` check)

### `focus/index.js`
- Orchestrator: `openFocus()`, `closeFocus()`, `initFocus()`
- Creates all focus mode elements via sub-modules
- Manages FLIP animation sequence
- Replaces header logo with close button
- Stores runtime state via `focus/state.js`

### `focus/state.js`
- Module-level state with getter/setter functions
- `isFocusActive`, `isClosing`, `focusData`, `cartCount`

### `focus/overlay.js`
- Creates overlay element with `bg-grid-dots` and ARIA attributes
- `animateOverlayIn()` / `animateOverlayOut()`

### `focus/clone.js`
- `createClone()` — clones clicked image at its grid position
- `flipOut()` — animates clone back to origin with `prefers-reduced-motion` support

### `focus/gallery.js`
- `createGallery()` — creates scrollable gallery with mobile/desktop variants
- `initGalleryScroll()` — attaches rAF-throttled scroll handler
- `scrollGalleryTo()` — shared scroll-to-image function

### `focus/panel.js`
- `createPanel()` — creates product detail panel with dynamic sizes from JSON
- `createPanelBtn()` — creates "Add to Cart" CTA button
- `createPanelGroup()` — composes panel + button with mobile/desktop positioning

### `focus/indicator.js`
- `createIndicator()` — creates scroll indicator with thumbnails
- `initIndicatorClicks()` — attaches thumbnail click-to-scroll handlers

### `focus/note.js`
- `createDesignerNote()` — creates designer's note element
- `positionNote()` — positions note aligned with panel top
- `animateNoteIn()` / `animateNoteOut()` — GSAP opacity animations

## 5. Data Flow

```
DOMContentLoaded
  → initSmoothScroll()     Lenis instance created
  → initReveal()           ScrollTrigger observers attached
  → initHover()            Mouseenter/leave listeners on each hero__row
  → initFocus()            Click + keydown listeners (delegated)

User clicks image
  → openFocus(img)
  → fetchProducts()        Fetches /data/products.json (cached after first call)
  → getProductById(id)     Looks up product by data-product-id
  → getBoundingClientRect() → calculateTargetRect() → FLIP deltas
  → createOverlay/Clone/Gallery/Panel/Indicator/Note via sub-modules
  → clone animated to center via GSAP transforms
  → panel animated in with "Add to Cart" button

User clicks overlay / presses Escape / clicks Close
  → closeFocus()
  → clone animated back to origin via flipOut()
  → overlay + panel animate out
  → images restored to opacity 1
  → clone + overlay + content wrapper removed from DOM
  → original logo element restored
```

## 6. Responsive Breakpoints

| Range | Grid | Container Padding |
|-------|------|-------------------|
| ≤ 480px | 2 columns | `--space-md` (16px) |
| 481–768px | 3 columns | `--space-md` (16px) |
| ≥ 769px | 7 columns | `--space-lg` (32px) |

Mobile (`< 769px`): mobile-only rows shown, desktop rows hidden.
Desktop (`≥ 769px`): desktop rows shown, mobile rows hidden.
Both sets exist in DOM simultaneously.

## 7. Key Design Decisions

- **Single data source**: All product data lives in `data/products.json`, fetched at runtime. No more hardcoded `productDataMap` in JS.
- **`data-product-id` linking**: Gallery images link to products via `data-product-id` attribute instead of regex filename parsing.
- **Modular focus mode**: Focus logic decomposed into 8 sub-modules under `src/js/focus/` for maintainability.
- **CSS classes over inline styles**: Layout/positioning moved to CSS classes. Only truly dynamic values (runtime-calculated positions) remain as inline styles.
- **CSS custom properties for z-index**: All z-index values use `--z-*` tokens instead of magic numbers.
- **Logo element reference**: Original logo stored as DOM element reference (not HTML string) for safe restoration.
- **rAF-throttled gallery scroll**: Scroll handler uses `requestAnimationFrame` to prevent layout thrashing.
- **`prefers-reduced-motion` support**: `flipOut()` sets final state immediately when reduced motion is preferred.
- **Scrollbar compensation**: `lockScroll()` measures scrollbar width and applies `padding-right` to prevent layout shift.
- **CSS class for scroll lock** (`body.focus-active`) instead of inline style.
