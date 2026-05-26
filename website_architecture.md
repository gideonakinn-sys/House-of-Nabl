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
| Fonts | Roboto (body), MADE Mirage (headings) |
| Data | Static `data/products.json` |

## 3. Source Structure

```
├── index.html              Entry point (loads /src/js/app.js + /src/css/styles.css)
├── src/
│   ├── css/styles.css      All styles (design tokens, layout, components)
│   └── js/
│       ├── app.js              Init orchestrator
│       ├── smoothScroll.js     Lenis setup + ScrollTrigger integration
│       └── animations/
│           ├── reveal.js       Scroll-triggered fade/y reveal (GSAP ScrollTrigger)
│           ├── hover.js        Gallery image hover — dim others in same row, scale up
│           └── focus.js        Click-to-expand FLIP animation + product detail panel
├── data/
│   └── products.json       Static product catalog (name, price, variants)
├── public/                 Vite's static public dir (served at /)
│   ├── data/products.json  Product JSON for production
│   └── img/                WebP copies of product images
├── img/                    Source image files (PNG + WebP)
├── designsystem.md         Design token reference
├── package.json
└── vite.config.js
```

## 4. Module Responsibilities

### `app.js`
- Imports all 4 modules and calls their `init*()` functions on DOMContentLoaded
- Lenis instance returned but unused in this scope (accessible via `getLenis()` export)

### `smoothScroll.js`
- Creates Lenis instance with custom easing and wheel smoothing
- Registers ScrollTrigger with GSAP
- Syncs Lenis scroll with ScrollTrigger via `gsap.ticker.add()`
- Exports `initSmoothScroll()` and `getLenis()`

### `animations/reveal.js`
- Targets `.hero__img` elements
- Animates `y: 60 → 0` and `opacity: 0 → 1` via ScrollTrigger
- Staggered reveal with 0.15s delay between images

### `animations/hover.js`
- Targets `.hero__row` elements, attaches per-row state via `WeakMap`
- On `mouseenter` (gated behind `(pointer: fine)`): scale up hovered image, dim all others in same row
- On `mouseleave` to another image in same row: transfer highlight state
- On `mouseleave` the row entirely: restore all images
- Guards against activation during focus mode (`body.focus-active` check)

### `animations/focus.js`
- Click-to-expand FLIP animation using GSAP transforms (`x`, `y`, `scaleX`, `scaleY`)
- Creates a fixed-position clone of the clicked image, animated from grid position to centered target
- Overlay with `backdrop-filter: blur(50px)` and stone-50 tint at 70% opacity
- Product detail panel (300px wide, right-aligned, bottom-aligned on desktop; stacked below on mobile)
- Panel content: collection name, product name, price, description, delivery info, "Add to Cart" button
- Product data mapped by image filename in a local `productDataMap`
- `isClosing` guard prevents double-trigger; `closeFocus()` reads current transforms for safe reverse
- Escape key and overlay click both close focus mode

## 5. Data Flow

```
DOMContentLoaded
  → initSmoothScroll()     Lenis instance created
  → initReveal()           ScrollTrigger observers attached
  → initHover()            Mouseenter/leave listeners on each hero__row
  → initFocus()            Click + keydown listeners (delegated)

User clicks image
  → openFocus(img)
  → getProductData(src)    Looks up product by image filename
  → getBoundingClientRect() → calculateTargetRect() → FLIP deltas
  → clone created at rect, appended to body
  → other images fade to 0
  → clone animated to center via GSAP transforms
  → panel created + animated in (with "Add to Cart" button)

User clicks overlay / presses Escape
  → closeFocus()
  → clone animated back to origin transforms
  → overlay + panel animate out
  → images restored to opacity 1
  → clone + overlay + panel removed from DOM
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

- **No clone on focus exit**: Original image stays in grid at `opacity: 0`. Clone animates back → removed → original fades to `opacity: 1`. No overlap.
- **CSS class for scroll lock** (`body.focus-active`) instead of inline style.
- **`var` used in focus.js** (not `const`/`let`) — legacy pattern, acceptable for consistency within that module.
- **Product data disconnected from JSON** — `productDataMap` in focus.js is a separate data source from `data/products.json`. Kept intentionally to allow image-filename-based lookup without requiring JSON restructuring.
- **`prefers-reduced-motion`** respected via CSS media query (GSAP animations still run but final state is correct).
