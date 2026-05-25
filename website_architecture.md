# Product Architecture & Systems Definition – Clothing Brand WhatsApp Order Website

## 1. System Overview

A **static-first, serverless** web application that serves a product catalog and delegates order completion to WhatsApp. No backend, no database, no payment processing.

### 1.1 Core Principle
> The website is a **read-only product viewer + order intent generator**. WhatsApp handles all conversation, negotiation, and fulfillment.

### 1.2 System Boundary

| Inside System | Outside System |
|---------------|----------------|
| Product catalog rendering | Order management |
| Variant selection UI | Inventory tracking |
| WhatsApp deep link generation | Payments & receipts |
| Image serving & optimization | Customer support chat |

---

## 2. System Architecture Diagram (Text Representation)

```
[User Device]
     │
     ▼
[CDN / Static Host] ── serves ──► [HTML/CSS/JS]
     │                                      │
     │                                      │ fetch()
     ▼                                      ▼
[products.json]                    [Browser Memory]
                                              │
                                              ▼
                                   [Variant Selector]
                                              │
                                              ▼
                               [Generate WhatsApp URL]
                                              │
└──────────────────────────────────────────────┘
                                              │
                                              ▼
                                   [wa.me deep link]
                                              │
                                              ▼
                               [WhatsApp App / Web]
                                              │
                                              ▼
                                   [Brand's Phone]
```

---

## 3. System Components

### 3.1 Static Hosting & CDN Layer
**Responsibility:** Deliver files with low latency.

| Requirement | Specification |
|-------------|---------------|
| Uptime | 99.9% |
| Global edge cache | Yes (CDN) |
| HTTPS | Mandatory |
| Custom domain | Yes |
| Deployment | Git-based (push to main = deploy) |

**Recommended:** Netlify, Vercel, or Cloudflare Pages.

### 3.2 Frontend Application (Browser)
**Responsibility:** Render UI, manage state, handle user interactions.

#### 3.2.1 State Management (Vanilla JS)
No framework. State lives in browser memory as plain JS objects.

```javascript
window.AppState = {
  products: [],
  selectedProduct: null,
  selectedVariant: null,
  isLoading: false,
  error: null
}
```

#### 3.2.2 Modules (ES6)

| Module | File | Responsibility |
|--------|------|----------------|
| dataLoader.js | Fetch and cache products.json |
| productRenderer.js | Generate grid cards and modal HTML |
| variantManager.js | Handle size/color selection, update price |
| whatsappLink.js | Build wa.me URL with pre-filled text |
| modalController.js | Open/close product detail modal |
| imageOptimizer.js | Lazy loading + srcset generation |

### 3.3 Data Layer (Static JSON)

**File:** `/data/products.json`

(kept as-is for implementation fidelity)

### 3.4 Image Optimization System

Raw image → CDN processing → served with srcset

### 3.5 WhatsApp Integration System

`https://wa.me/<phone>?text=<encoded_message>`

### 3.6 Analytics System
Privacy-lean optional event logging.

---

## 4. Data Flow (End-to-End)

User visit → load HTML → fetch JSON → render grid → open modal → select variant → generate WhatsApp link → redirect → order in WhatsApp

---

## 5. Security & Privacy Specs

- XSS prevention via textContent
- Safe JSON parsing with fallback UI
- No user data storage
- Trusted CDN images only

---

## 6. Deployment & CI/CD

Git push → CDN deploy → preview + production build

---

## 7. Failure Modes & Resilience

- JSON fetch failure → retry UI
- Image error → placeholder
- Invalid WhatsApp number → validation in CI
- Slow network → loading state

---

## 8. Scalability Notes

Fully static architecture scales via CDN. Pagination or SSG recommended for large catalogs.

---

## 9. Developer Onboarding Checklist

- Clone repo
- Update products.json
- Set WhatsApp number
- Add images
- Test WhatsApp flow
- Deploy

---

## 10. Folder Structure

```
project-root/
├── index.html
├── css/
├── js/
├── data/
├── img/
└── README.md
```

