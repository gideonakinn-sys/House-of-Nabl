# Website Design System

Welcome to the official design system documentation for the website. This document establishes a cohesive visual language, ensuring consistency across all user interfaces, digital experiences, and component developments. 

Our brand balances the bold, editorial typography of **Anton** with the clean, legible structure of **Roboto**, grounded in a natural, earthy neutral palette (**Stone**) and a distinct warm primary accent (**#A4674C**).

---

## 1. Color Palette

The color system is divided into three primary categories: the Brand Primary Color, the Neutral Palette (Stone), and structural application roles. These colors maintain clear contrast, establish visual hierarchy, and define interactive states.

### 1.1 Primary Brand Color
Our primary color is an earthy, warm terracotta tone that brings a premium, grounded feel to the interface.

| Token | Hex Code | Sample | Primary Usage & Guidelines |
| :--- | :--- | :--- | :--- |
| `color-primary` | `#A4674C` | 🤎 | Main brand accent. Used for interactive elements like primary Call-To-Action (CTA) buttons, text links, active navigation states, focus rings, and high-impact design highlights. Avoid using for blocks of long-form text to maintain accessibility. |

### 1.2 Neutral Palette (Stone Series)
Derived from the provided specification, the Stone palette provides structural support, backgrounds, borders, and text variations. 

| Token | Hex Code | Visual | Usage & Context |
| :--- | :--- | :---: | :--- |
| `stone-900` | `#1C1917` | ⬛ | **Primary Typography & High Contrast Surfaces:** Used for main page headers, body copy on light backgrounds, and dominant text states. Ensures optimal readability (exceeding WCAG AAA contrast ratios). |
| `stone-800` | `#292524` | ⬛ | **Secondary Typography & Dark Elements:** Used for body text on sub-sections, dark-mode cards, secondary headings, and deep structural containers. |
| `stone-700` | `#44403C` | 🔲 | **Muted Text & Supporting Copy:** Ideal for sub-headings, side notes, labels, unselected tabs, and secondary icons that do not require immediate attention. |
| `stone-600` | `#57534E` | 🔲 | **Captions & Secondary Controls:** Used for microcopy, meta-text, disabled input icons, and subtle illustrative graphics. |
| `stone-500` | `#78716C` | ⬜ | **Placeholders & Dark Borders:** Ideal for input field placeholder text, non-emphasized UI icons, and structural borders on darker background variations. |
| `stone-400` | `#A8A29E` | ⬜ | **Standard Borders & Dividers:** The baseline token for structural lines, component dividers, input field borders, and disabled component outlines. |
| `stone-300` | `#D6D3D1` | ⬜ | **Light Dividers & Disabled Surfaces:** Used for soft decorative lines, layout dividers on light backgrounds, and backgrounds for disabled button states. |
| `stone-200` | `#E7E5E4` | ⬜ | **Hover States & Component Backgrounds:** Applied to interactive component hover states (e.g., list items, table rows) and subtle backgrounds for blockquotes or callout boxes. |
| `stone-100` | `#F5F5F4` | ⬜ | **Section Backgrounds:** Used for alternating section stripes, card backgrounds, and framing content regions off the main baseline canvas. |
| `stone-50`  | `#FAFAF9` | ⬜ | **Global Canvas Background:** The primary background color for the website. Creates a soft, warm off-white canvas that reduces eye strain compared to pure white (`#FFFFFF`). |

---

## 2. Typography

The typography system relies on a mathematical proportional type scale with a **Base Value of 21px** and a **Scale Factor of 1.2**. This ensures harmonic progression across all display formats.

### 2.1 Font Families
* **Headings Font (Display, H1–H6):** `Anton`
    * *Characteristics:* Bold, condensed display sans-serif with dramatic visual weight. Used to evoke luxury, craftsmanship, and a structured editorial layout.
* **Body & UI Font (Paragraphs, Links, Buttons, Inputs):** `Roboto`
    * *Characteristics:* A modern, clean, geometric sans-serif font designed specifically for high digital legibility. Its open shapes maintain clarity at small sizes and complex interface layouts.
* **Designer's Note Font:** `Motterdam`
    * *Characteristics:* A handwritten script font for decorative, editorial notes. Used sparingly for designer's commentary.

### 2.2 Proportional Type Scale
The website utilizes explicit font size tokens to map every typographic instance from display headers to tiny legal microcopy.

| CSS Token | Font Size | Recommended Font Family | Line Height | Semantic Application / Layout Role |
| :--- | :--- | :--- | :--- | :--- |
| `--font-size-body` | 1.000rem (21px) | `Roboto` | 1.6 | **Body Base (Regular):** Standard baseline body text for all articles, paragraphs, and extended prose. |
| `--font-size-small` | 0.810rem (17px) | `Roboto` | 1.6 | **Body Small:** Form fields, inputs, button texts, metadata labels, navigation links, description text. |
| `--font-size-caption` | 0.714rem (15px) | `Roboto` | 1.6 | **Caption / Legal:** Tooltips, form validation errors, copyright notices, micro-labels. |

Note: Heading sizes are applied directly in component CSS using the `Anton` font family. The type scale tokens (`--font-size-*`) are reserved for body/UI text sizes.

---

## 3. UI Component Applications & Token Pairing

To guarantee that components look intentional and accessible, apply the color tokens and typography configurations according to the following strict rules:

### 3.1 Primary Call-To-Action (CTA) Buttons
* **Background Color:** `stone-800` (`#292524`) — dark, grounding tone for "Add to Cart" buttons
* **Text Color:** `#fff` — Ensures excellent readability and contrast.
* **Font Typography:** `Roboto`, size `--font-size-caption` (15px), weight 600, letter-spacing -0.02em.

### 3.2 Main Content Typography Configuration
* **Product Title (H2):** 25px | Font: `Anton` | Color: `stone-800` (`#292524`)
* **Collection Label:** 12px | Font: `Roboto` | Color: `stone-400` | Text-transform: uppercase
* **Running Text Paragraphs:** `--font-size-small` (17px) | Font: `Roboto` | Color: `stone-600` | Line-Height: `1.6`

### 3.3 Cards and Content Layout Containers
* **Container Background:** `stone-50` (`#FAFAF9`) or pure white (`#FFFFFF`).
* **Section Wrapper Background:** Alternate sections between `stone-50` and `stone-100` (`#F5F5F4`) to create natural content breaks without relying on heavy borders.
* **Borders/Separators:** `stone-400` (`#A8A29E`) for crisp borders, or `stone-300` (`#D6D3D1`) for ultra-subtle item separation.

### 3.4 Accessibility & Contrast Checklist
1.  **Text on Stone 50/100:** Always use `stone-900` or `stone-800` for standard running body text. Never use `stone-500` or lower for essential information.
2.  **Primary Accent Text Links:** `color-primary` (`#A4674C`) text links must only be used on light backgrounds (`stone-50`, `stone-100`, white) and should include an underline state on hover to meet WCAG interactive target visibility standards.

---

## 4. Spacing Scale

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--space-xs` | 0.25rem (4px) | Micro-gaps, tight spacing |
| `--space-sm` | 0.5rem (8px) | Small gaps, grid gaps |
| `--space-md` | 1rem (16px) | Standard padding, form spacing |
| `--space-lg` | 2rem (32px) | Section padding, large gaps |
| `--space-xl` | 3rem (48px) | Section padding (hero), major separations |

---

## 5. Z-Index Scale

| Token | Value | Usage |
| :--- | :--- | :--- |
| `--z-overlay` | 100 | Focus mode overlay |
| `--z-content` | 101 | Content wrapper, gallery |
| `--z-clone` | 102 | FLIP animation clone |
| `--z-panel` | 102 | Product detail panel |
| `--z-note` | 102 | Designer's note |
| `--z-indicator` | 103 | Scroll indicator |
| `--z-header-focus` | 200 | Fixed header during focus mode |
