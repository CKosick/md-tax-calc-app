# Private-Party Vehicle Tax, Tags & Title Calculator

A single-page, high-performance web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS** that calculates the true first-year cost of buying a vehicle in a private-party sale (excise tax, title fee, tag/registration fee).

🚀 **Live Deployment:** [https://md-tax-calc-app.vercel.app](https://md-tax-calc-app.vercel.app/calculator/maryland-private-sale-tax-calculator)

Starting with **Maryland**, the system is architected to expand to all 50 states through a pure, config-driven state rules engine.

---

## Features

### 1. Verified Maryland Statutory Rules (2025 / 2026 MVA Listing)
- **6.5% Vehicle Excise Tax:** Assessed on purchase price or NADA fair market value, with a statutory minimum tax floor of **$41.60** (derived from the $640 assessed valuation minimum).
- **$200 Title Certificate Fee:** Reflects the official fee increase effective July 1, 2025.
- **$40 Security Interest / Lien Fee:** Included when a purchase is financed through a lender.
- **Annual or 2-Year Tag Registration:** Accommodates Maryland's 1-year and 2-year registration terms, including the mandatory $40/year Emergency Medical Services (EMS) surcharge:
  - Class A Passenger ($\le$ 3,700 lbs): **$125.50/yr** (2-year: **$251.00**)
  - Class A Passenger ($>$ 3,700 lbs): **$191.50/yr** (2-year: **$383.00**)
  - Class D Motorcycle: **$105.00/yr** (2-year: **$210.00**)
- **EV & PHEV Surcharges:** $125/year for zero-emission electric vehicles and $100/year for plug-in hybrids.
- **Trade-in Exemption Invariance:** Maryland statute taxes the full purchase price on private sales; trade-ins and rebates do not reduce excise tax.
- **Vehicle Emissions (VEIP):** $14–$30 inspection note (displayed as informational only, not part of the titling total).

### 2. Config-Driven Architecture
- Zero hardcoded fees or tax formulas inside React components.
- State rules live in [`src/config/stateRules.json`](src/config/stateRules.json).
- Monetization slots live in [`src/config/partnerSlots.json`](src/config/partnerSlots.json).

### 3. SEO & Structured Data
- Canonical dynamic route: `/calculator/maryland-private-sale-tax-calculator`.
- Dynamic title and meta descriptions per jurisdiction.
- JSON-LD structured data for `FAQPage` and `WebApplication`.
- Long-tail query FAQ accordion targeting Maryland vehicle titling search intents.

### 4. Statutory Disclaimers
- Prominently displays required notices regarding estimates, the $\le$ 7-year book-value assessment rule, and the private-party trade-in non-deductibility rule.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Testing:** Vitest + React Testing Library + jsdom
- **Hosting:** Vercel

---

## Getting Started

### Prerequisites
- Node.js >= 20
- npm >= 10

### Installation
```bash
git clone https://github.com/CKosick/md-tax-calc-app.git
cd md-tax-calc-app
npm install
```

### Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/calculator/maryland-private-sale-tax-calculator](http://localhost:3000/calculator/maryland-private-sale-tax-calculator).

### Running Tests
The project includes a comprehensive suite of 24 unit and component tests:
```bash
npm test
```

### Building for Production
```bash
npm run build
```

---

## Test Suite Coverage

- **Worked Acceptance Example:** Validates $15,000 car, 2019 model year, passenger $\le$ 3,700 lbs, 2-year registration, cash purchase $\rightarrow$ $975.00 (tax) + $200.00 (title) + $0.00 (lien) + $251.00 (tags) = **$1,426.00**.
- **Trade-in Invariance:** Proves trade-in deductions do not alter the Maryland tax base.
- **Boundary & Edge Cases:** $0 purchase price, $639 vs $640 minimum tax threshold, negative number handling, and vehicle age boundaries.
- **Component Rendering:** Validates partner slot hrefs (`#`), visible statutory disclaimers, and interactive FAQ accordions.
- **Configuration Purity:** Verifies zero state numbers are hardcoded in components.
