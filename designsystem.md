# Website Design System

Welcome to the official design system documentation for the website. This document establishes a cohesive visual language, ensuring consistency across all user interfaces, digital experiences, and component developments. 

Our brand balances the elegant, editorial typography of **Anton** with the clean, geometric structure of **Questrial**, grounded in a natural, earthy neutral palette (**Stone**) and a distinct warm primary accent (**#A4674C**).

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
    * *Characteristics:* Elegant, editorial serif with rich contrast between thick and thin strokes. Used to evoke luxury, craftsmanship, and a structured editorial layout.
* **Body & UI Font (Paragraphs, Links, Buttons, Inputs):** `Questrial`
    * *Characteristics:* A modern, clean, geometric sans-serif font designed specifically for high digital legibility. Its open shapes maintain clarity at small sizes and complex interface layouts.

### 2.2 Proportional Type Scale
The website utilizes 13 explicit font size tokens to map every typographic instance from massive hero displays to tiny legal microcopy.

| Scale Token | Font Size (px) | Font Size (rem) | Recommended Font Family | Line Height | Semantic Application / Layout Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `font-size-130` | 130px | 6.190rem | `Anton` | 1.1 | **Display 1:** Used for oversized landing page heroes, large numerical metrics, or minimal splash headers. |
| `font-size-108` | 108px | 5.143rem | `Anton` | 1.1 | **Display 2:** Supporting oversized headers, large intro typographic treatments. |
| `font-size-90`  | 90px | 4.286rem | `Anton` | 1.15 | **Display 3:** Alternative hero headers or landing pages with dense copy layouts. |
| `font-size-75`  | 75px | 3.571rem | `Anton` | 1.2 | **Heading 1 (Max):** Main page titles on primary interior landing pages. |
| `font-size-63`  | 63px | 3.000rem | `Anton` | 1.2 | **Heading 1:** Standard top-level section title for standard pages. |
| `font-size-52`  | 52px | 2.476rem | `Anton` | 1.25 | **Heading 2:** Primary sub-section heading within a webpage. |
| `font-size-44`  | 44px | 2.095rem | `Anton` | 1.3 | **Heading 3:** Mid-level titles separating distinct text or card groups. |
| `font-size-36`  | 36px | 1.714rem | `Anton` | 1.35 | **Heading 4:** Card component titles, descriptive group titles. |
| `font-size-30`  | 30px | 1.429rem | `Anton` | 1.4 | **Heading 5:** Small sidebar headings, localized block descriptors. |
| `font-size-25`  | 25px | 1.190rem | `Anton` | 1.4 | **Heading 6 / Lead Paragraph:** Bold section labels or introduction text blocks. |
| `font-size-21`  | 21px | 1.000rem | `Questrial` | 1.6 | **Body Base (Regular):** **Standard baseline body text** for all articles, paragraphs, and extended prose. |
| `font-size-17`  | 17px | 0.810rem | `Questrial` | 1.5 | **Body Small:** Form fields, inputs, button texts, metadata labels, navigation links. |
| `font-size-15`  | 15px | 0.714rem | `Questrial` | 1.4 | **Caption / Legal:** Tooltips, form validation errors, copyright notices, micro-labels. |

---

## 3. UI Component Applications & Token Pairing

To guarantee that components look intentional and accessible, apply the color tokens and typography configurations according to the following strict rules:

### 3.1 Primary Call-To-Action (CTA) Buttons
* **Background Color:** `color-primary` (`#A4674C`)
* **Text Color:** `stone-50` (`#FAFAF9`) — *Ensures excellent readability and contrast on the warm terracotta base.*
* **Font Typography:** `Questrial`, size `font-size-17` (`0.810rem`), Bold / Medium weight.
* **Hover State:** Lighten or shift to a slightly deeper tone, or transition with a border outline utilizing `stone-900`.

### 3.2 Main Content Typography Configuration
* **Page Title (H1):** `font-size-63` (`3.000rem`) | Font: `Anton` | Color: `stone-900` (`#1C1917`)
* **Section Title (H2):** `font-size-52` (`2.476rem`) | Font: `Anton` | Color: `stone-900` (`#1C1917`) or `color-primary` (`#A4674C`) for custom editorial emphasis.
* **Running Text Paragraphs:** `font-size-21` (`1.000rem`) | Font: `Questrial` | Color: `stone-900` (`#1C1917`) | Line-Height: `1.6` for an open, clean digital presentation.

### 3.3 Cards and Content Layout Containers
* **Container Background:** `stone-50` (`#FAFAF9`) or pure white (`#FFFFFF`).
* **Section Wrapper Background:** Alternate sections between `stone-50` and `stone-100` (`#F5F5F4`) to create natural content breaks without relying on heavy borders.
* **Borders/Separators:** `stone-400` (`#A8A29E`) for crisp borders, or `stone-300` (`#D6D3D1`) for ultra-subtle item separation.

### 3.4 Accessibility & Contrast Checklist
1.  **Text on Stone 50/100:** Always use `stone-900` or `stone-800` for standard running body text. Never use `stone-500` or lower for essential information.
2.  **Primary Accent Text Links:** `color-primary` (`#A4674C`) text links must only be used on light backgrounds (`stone-50`, `stone-100`, white) and should include an underline state on hover to meet WCAG interactive target visibility standards.
