# CarTaxHub: Private-Party Vehicle Tax, Tags & Title Calculator

CarTaxHub estimates the true first-year cost of buying a vehicle in a private-party sale: sales or excise tax, title fee, lien fee, and tag registration. It covers **all 50 states plus Washington, D.C. (51 jurisdictions)**, each with its own calculator page.

**Live site:** [https://cartaxhub.com](https://cartaxhub.com)

Built with **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS 4**, hosted on **Vercel**.

---

## Features

### 1. 51 jurisdiction calculators
- One statically generated page per jurisdiction at `/calculator/<state>-private-sale-tax-calculator`, plus a state directory at `/calculator`.
- Handles flat rates, price tiers, luxury rates, statutory minimums and caps, flat-fee tables (for example Illinois Form RUT-50), trade-in credit rules, local tax ranges, weight-based registration tiers, 1 and 2-year terms, and EV / PHEV surcharges.
- Shareable result links (`?price=&year=&type=&term=...`). A link without `term` uses the state's default term.
- `/vehicle-tax-by-state` ranks every jurisdiction on a standard scenario, with sortable tables and a CSV download.

### 2. Config-driven rules engine
- No fees or tax formulas are hard-coded in React components. The pure engine in [`src/lib/calculator.ts`](src/lib/calculator.ts) reads per-state rules from [`src/config/stateRules.json`](src/config/stateRules.json), and each state lists its official source URLs.
- Years live in [`src/lib/constants.ts`](src/lib/constants.ts):
  - `getCalculationYear()` (the calendar year) drives vehicle age math, model year presets, and the CSV filename.
  - `RATES_VERIFIED_YEAR` drives the "Verified for 2026" style badges. Change it only when the rates are re-verified.

### 3. Partner-slot monetization
- Affiliate slots are defined in [`src/config/partnerSlots.json`](src/config/partnerSlots.json): auto insurance below the results for everyone, and auto loan rates in the sidebar only when the buyer marks the purchase as financed.
- Destination URLs come from environment variables (see [`.env.example`](.env.example)), for example `NEXT_PUBLIC_PARTNER_INSURANCE_URL` and `NEXT_PUBLIC_PARTNER_LOAN_URL`. They are resolved on the server in [`src/lib/partnerLinks.ts`](src/lib/partnerLinks.ts) and passed to the client as props, because Next.js does not inline dynamically named `NEXT_PUBLIC_*` variables into browser code. Pages are prerendered, so changing a URL requires a redeploy.
- A slot stays hidden until it has a real URL. `NEXT_PUBLIC_ENABLE_MONETIZATION=false` turns all slots off.
- Clicks are recorded as a `partner_click` event (`slot`, `state`) in Vercel Analytics, and in GA4 when it is configured.

### 4. SEO and structured data
- Per-jurisdiction titles, meta descriptions, and canonical URLs; sitemap and robots.
- JSON-LD for `BreadcrumbList`, `FAQPage`, and `WebApplication`, plus a `Dataset` on the comparison page.
- Long-tail FAQ accordion per state.

### 5. Statutory disclaimers
- Notices covering estimates, book-value assessment rules (such as Maryland's 7-year rule), and trade-in treatment.

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict)
- **Styling:** Tailwind CSS 4
- **Testing:** Vitest, React Testing Library, jsdom
- **Analytics:** Vercel Analytics, Cloudflare Web Analytics, optional GA4
- **Hosting:** Vercel
- **CI:** GitHub Actions runs lint, tests, and a production build on every push and pull request to `main`

---

## Getting started

### Prerequisites
- Node.js 20 or newer (CI uses 22)
- npm 10 or newer

### Installation
```bash
git clone https://github.com/CKosick/md-tax-calc-app.git
cd md-tax-calc-app
npm install
```
Copy `.env.example` to `.env.local` and fill in any values you need. Everything is optional for local development.

### Running locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Lint, test, build
```bash
npm run lint
npm test
npm run build
```

---

## Test suite

177 tests across 11 files (`tests/`), covering:

- **Calculator engine:** worked examples per state, trade-in rules, minimums and caps, tiers, flat tables, local tax ranges, and edge cases.
- **Config schema:** all 51 jurisdictions present and complete, with sane rates and official sources.
- **Components and pages:** results card, form, disclaimers, FAQ, directory and comparison pages, JSON-LD.
- **Partner slots:** server-side URL resolution, a server-render-then-hydrate check, click tracking, and the financed-only loan slot.
- **Years and share links:** calendar-derived age math, presets, and CSV filename; no negative ages; state-aware term default.
- **Configuration purity:** no state numbers hard-coded in components.
