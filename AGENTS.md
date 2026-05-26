# AGENTS.md — House of Nabl

## Build & Dev Commands

```bash
npm run dev      # Start Vite dev server (port 3000, auto-open)
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
```

No lint, typecheck, or test commands exist. No lint config, TypeScript, or test framework is installed.

## Project Overview

Vanilla JS e-commerce gallery site. Vite builds from `index.html` at root. Entry point: `/src/js/app.js`. Styles: `/src/css/styles.css`. Two runtime deps: GSAP 3.15 (animations), Lenis 1.3.23 (smooth scroll). Body font: Roboto. Heading font: MADE Mirage. No framework (React/Vue/etc.).

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

- `src/js/app.js` — init orchestrator (imports all modules, runs on DOMContentLoaded)
- `src/js/smoothScroll.js` — Lenis smooth scroll setup
- `src/js/animations/reveal.js` — scroll-triggered GSAP/ScrollTrigger reveal
- `src/js/animations/hover.js` — gallery image hover (dim others, scale up)
- `src/js/animations/focus.js` — click-to-expand focus mode with FLIP animation

## Data Flow

- `data/products.json` — static product catalog (name, description, price, variants, images)
- Public dir `public/` — static assets served at `/` (prod JSON + webp copies)
- WhatsApp deep link generated from product data for order intent

## Code Style Guidelines

### Imports
- Default imports for libraries: `import gsap from 'gsap'`
- Named imports for subpath/local: `import { ScrollTrigger } from 'gsap/ScrollTrigger'`
- Named imports for local modules: `import { initHover } from './animations/hover.js'`
- Order: third-party defaults → third-party named → local relative
- Always include `.js` extension in local imports

### Strings
- Single quotes for all JS strings (`'expo.out'` not `"expo.out"`)
- Template literals (backticks) only for interpolation or multi-line strings

### Functions
- Named `function` declarations for all module-level functions
- Arrow functions for callbacks, event handlers, iteration, GSAP callbacks
- Single-param arrows omit parens in `.forEach()` but include in event listeners

### Exports
- Named exports only — `export function initX()` inline on declaration
- No `export default` anywhere

### Naming
- camelCase: variables, functions, parameters, object keys
- ALL_CAPS: only for `CONFIG` object (module-level constants config)
- PascalCase: third-party constructors (`Lenis`, `ScrollTrigger`)
- CSS classes: BEM (`hero__row`, `hero__img`, `hero__row--desktop`)
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

### Comments & JSDoc
- None present in codebase. The code relies entirely on descriptive identifier names.

### DOM & Animations
- Use `document.querySelectorAll()` / `el.closest()` for DOM traversal
- GSAP for all animations (no CSS transitions/animations)
- Animate only `transform` and `opacity` for 60fps compositor performance
- Use `gsap.to()` for forward animations, `gsap.fromTo()` when starting from a non-default state
- `gsap.killTweensOf()` before animating an element to prevent conflicts
- Use `overwrite: 'auto'` on GSAP tweens for interruption safety

### Focus Mode (FLIP Animation)
- Record element's `getBoundingClientRect()` = "First"
- Clone element positioned at that rect
- Calculate target rect = "Last"
- Animate clone using only `x`, `y`, `scaleX`, `scaleY` (no `left/top/width/height` animation)
- `transformOrigin: '0 0'` when scaling
- Use `gsap.getProperty()` to read current transform values for safe reverse
- Use `will-change: transform, opacity` on animated clones

### State Management
- Module-level `let` variables with guards against re-entrance
- Pattern: `let isXActive = false; let isClosing = false;` with early returns
- State stored in a nullable object (`let focusData = null`)

### Responsive / Device Handling
- Check `window.matchMedia('(pointer: fine)')` to gate hover-only interactions
- Mobile rows and desktop rows both exist in DOM; toggled via CSS `display: none`

### Media / Images
- WebP with PNG fallback in `img/`
- Images use `loading="lazy"` and explicit `width/height` attributes
- Use `object-fit: cover` for grid images

### Scroll Lock
- Toggle `body.focus-active` CSS class (which sets `overflow: hidden`)
- Use CSS class over inline style for scroll locking

### CSS Conventions
- Plain CSS (no preprocessor)
- CSS custom properties in `:root` for all design tokens
- `@import` for Google Fonts at top
- Reset via `* { box-sizing: border-box; margin: 0; padding: 0; }`

## What NOT To Do
- Don't add a framework (React/Vue/etc.) without explicit request
- Don't add linting/prettier config unless asked
- Don't convert to TypeScript unless asked
- Don't create `.env` or commit secrets
- Don't introduce backend/database logic
- Don't add npm packages unnecessarily (only GSAP + Lenis are used)
