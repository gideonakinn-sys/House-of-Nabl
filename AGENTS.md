# AGENTS.md — House of Nabl

## Build & Dev Commands

```bash
npm run dev      # Start Vite dev server (port 3000, auto-open)
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

No lint, typecheck, or test commands exist. No lint config, TypeScript, or test framework is installed.

## Project Overview

Vanilla JS e-commerce gallery site. Vite builds from `index.html` at root. Entry point: `/src/js/app.js`. Styles: `/src/css/styles.css`. Two runtime deps: GSAP 3.15 (animations), Lenis 1.3.23 (smooth scroll). Body font: Roboto. Heading font: Anton. No framework (React/Vue/etc.).

## File Structure

```
index.html
src/
  css/styles.css
  js/
    app.js
    smoothScroll.js
    animations/
      reveal.js
      hover.js
      focus.js
data/products.json
public/
img/
```

## Module Architecture

- `src/js/app.js` — init orchestrator (imports all 4 modules, runs on DOMContentLoaded)
- `src/js/smoothScroll.js` — Lenis smooth scroll setup with ScrollTrigger registration
- `src/js/animations/reveal.js` — scroll-triggered GSAP/ScrollTrigger reveal (y 60→0, opacity 0→1, stagger 0.15s)
- `src/js/animations/hover.js` — gallery image hover (dim others in same row, scale up). Gated behind `(pointer: fine)` media query. Guards via `body.focus-active` class.
- `src/js/animations/focus.js` — click-to-expand FLIP animation with scrollable gallery, product info panel, scroll indicator, size selector, cart counter

## Data Flow

- `data/products.json` — static product catalog (name, description, price, variants, images)
- Public dir `public/` — static assets served at `/` (prod JSON + WebP copies)
- WhatsApp deep link used for order intent (phone in footer)
- Contact email `info@houseofnabl.com` in footer
- Product data in focus mode is pulled from a local `productDataMap` (keyed by image filename), NOT from `products.json`

## Code Style Guidelines

### Imports
- Default imports for libraries: `import gsap from 'gsap'`, `import Lenis from 'lenis'`
- Named imports for subpath/local: `import { ScrollTrigger } from 'gsap/ScrollTrigger'`
- Named imports for local modules: `import { initHover } from './animations/hover.js'`
- Order: third-party defaults → third-party named → local relative
- Always include `.js` extension in local imports

### Strings
- Single quotes for all JS strings (`'expo.out'` not `"expo.out"`)
- Template literals (backticks) only for interpolation or multi-line strings
- `\u20A6` for Naira symbol if needed

### Functions
- Named `function` declarations for all module-level functions
- Arrow functions for callbacks, event handlers, iteration, GSAP callbacks
- Single-param arrows omit parens in `.forEach()` but use parens in event listeners

### Exports
- Named exports only — `export function initX()` inline on declaration
- No `export default` anywhere

### Naming
- camelCase: variables, functions, parameters, object keys
- ALL_CAPS: only for `CONFIG` object (module-level constants config). Note: `var` is used in focus.js (intentional, module-wide legacy pattern).
- PascalCase: third-party constructors (`Lenis`, `ScrollTrigger`)
- CSS classes: BEM (`hero__row`, `hero__img`, `hero__row--desktop`, `hero__focus-panel-btn`)
- CSS custom properties: kebab-case (`--color-primary`, `--space-lg`)

### Formatting
- 2-space indentation, no tabs
- Semicolons always present
- Trailing commas on multi-line object literals
- Single-line objects (GSAP inline configs) omit trailing commas
- One space after keywords (`if (`, `function name(`)
- One space around binary operators
- No space inside parentheses
- One blank line between function definitions

### Error Handling
- Guard clause early returns only (no try/catch, no throw, no logging)
- Preconditions checked at top of function: `if (!element) return;`
- Module-level `let` state guards: `if (isFocusActive) return;`

### Comments & JSDoc
- None present in codebase. The code relies entirely on descriptive identifier names.

## Key Interaction Patterns

### Focus Mode Entry (openFocus)
1. Kill hover tweens, clear z-index on clicked image
2. Record `getBoundingClientRect()` (First position)
3. Calculate target rect via `calculateTargetRect()` (centered, accounting for panel)
4. Create overlay (z-index: 100), gallery (z-index: 101), FLIP clone (z-index: 102), panel (z-index: 102), indicator (z-index: 103)
5. FLIP clone animates from grid position to gallery position using GSAP `x`, `y`, `scaleX`, `scaleY` with `transformOrigin: '0 0'`
6. On FLIP complete: clone fades out, gallery fades in, panel slides up (drawer reveal), indicator appears
7. Clicking a gallery image or indicator thumbnail scrolls gallery to that image

### Gallery Scroll (onGalleryScroll)
- Listens to native `scroll` event on gallery element (Lenis passes through via `data-lenis-prevent`)
- Computes overlap ratio for each image against gallery's visible rect
- Fully visible images: opacity 1, blur 0px
- Partially/not visible images: opacity 0.4, blur 8px
- Updates indicator's active thumbnail and counter

### Scroll Indicator (desktop only)
- Fixed left, bottom-aligned, frosted glass pill (blur 12px, 70% white)
- Shows "Scroll" label, counter (01/04), and 4 image thumbnails
- Active thumbnail has thin black outline; inactive ones at 30% opacity
- Clicking a thumbnail scrolls the gallery to that image

### Panel
- 332px wide, right-aligned, bottom-aligned on desktop
- Contains: collection name (uppercase, 12px, stone-400), product name (25px Anton), description, size selector (M/L/XL/2XL), delivery info, CTA button with "Add to Cart" + price spaced apart
- Panel slides up from below (translateY drawer animation)
- On mobile: below the horizontal scroll gallery
- Size selection: click to toggle `.selected` class (black border), only one active at a time

### Header During Focus Mode
- Header becomes `position: fixed; z-index: 200` with frosted glass background
- Shows logo, "House of Nabl" (19px Anton), Size Guide, Cart counter

### Cart
- Module-level `cartCount` variable incremented on "Add to Cart" click
- Header cart display updates via `updateCartDisplay()`
- Cart count persists across focus sessions

## State Management
- Module-level `let` variables with guards against re-entrance
- Pattern: `let isFocusActive = false; let isClosing = false; let focusData = null;`
- `focusData` stores all runtime state for the current focus session (img, clone, gallery, overlay, panelGroup, indicator, allImages)
- Guards at top of each entry/exit function with early returns

## DOM & Animations
- Use `document.querySelectorAll()` / `el.closest()` for DOM traversal
- GSAP for all animations (no CSS transitions/animations)
- Animate only `transform` and `opacity` for 60fps compositor performance
- Use `gsap.to()` for forward animations, `gsap.fromTo()` when starting from a non-default state
- `gsap.killTweensOf()` before animating an element to prevent conflicts
- Use `overwrite: 'auto'` on GSAP tweens for interruption safety
- Use `will-change: transform, opacity` on animated clones

## Lenis Integration
- Lenis intercepts all wheel/trackpad events by default
- Add `data-lenis-prevent` attribute to elements that need native scroll (gallery)
- Lenis is destroyed/recreated if `initSmoothScroll()` runs again (avoid via singleton guard)

## Responsive Breakpoints
- ≤ 480px: 2-column grid, `--space-md` padding, row min-height 220px
- 481–768px: 3-column grid, `--space-md` padding, row min-height 190px
- ≥ 769px: 7-column grid, `--space-lg` padding, row min-height 125px
- `isMobile()` helper checks `window.innerWidth < 769`
- `(pointer: fine)` media query gates hover-only interactions
- `hero__row--mobile` and `hero__row--desktop` both exist in DOM; toggled via `display: none/grid`

## CSS Conventions
- Plain CSS (no preprocessor)
- CSS custom properties in `:root` for all design tokens (color, font, spacing, typography scale)
- Stone palette: 900 (darkest) through 50 (lightest)
- `@import` for Google Fonts at top
- Reset via `* { box-sizing: border-box; margin: 0; padding: 0; }`
- `prefers-reduced-motion` media query at bottom of stylesheet
- `body.focus-active` class controls scroll lock + header positioning
- Use `min-height` on grid rows to prevent layout shift before images load
- Footer uses `::after` pseudo-element on `> span:not(:last-child)` for `/` separators
- `.bg-grid-dots` utility class for decorative grid + dot pattern backgrounds

## What NOT To Do
- Don't add a framework (React/Vue/etc.) without explicit request
- Don't add linting/prettier config unless asked
- Don't convert to TypeScript unless asked
- Don't create `.env` or commit secrets
- Don't introduce backend/database logic
- Don't add npm packages unnecessarily (only GSAP + Lenis are used)
- Don't create root-level `js/` or `css/` directories — all source lives under `src/`
- Don't use CSS transitions/animations — use GSAP for everything
- Don't use `export default` — named exports only