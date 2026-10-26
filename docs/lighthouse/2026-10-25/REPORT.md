# CarTaxHub Lighthouse pass (2026-10-25)

Branch `perf/lighthouse-pass`. Lighthouse 12.8.2, headless Microsoft Edge 156 (Chromium), default mobile (simulated slow 4G, 4x CPU) and the desktop preset. The browser ran in dark color scheme, so contrast was audited against the dark theme; the fixes below also pass in the light theme.

Pages: home (`/`), the Maryland calculator, the Maryland private sale guide, and the comparison page (`/vehicle-tax-by-state`).

## How it was measured

1. **Live baseline** (cartaxhub.com, all three analytics stacks loading): one run per page and form factor. Raw reports: `before-live-*.report.json` and `.html` in this folder.
2. **Before and after on equal terms**: production builds of `main` (6f54200) and this branch, run locally with `next start` and the site's public GA4 ID set, so Google Analytics, Cloudflare Web Analytics, and Vercel Analytics scripts all load as on the live site. Mobile scores are the median of three runs; desktop is one run. The branch's Vercel preview could not be used because it sits behind Vercel login. Raw reports: `local/*.report.json.gz` (gzipped JSON with the embedded screenshot images removed; every score, metric, and audit is intact; open with the Lighthouse Viewer after unzipping).

Local best practices is 96 on both sides only because the analytics beacons cannot report from localhost (Cloudflare CORS error, Vercel insights script 404). The live site scores 100.

Mobile performance moves several points between identical runs (one `main` comparison run scored 60, the next two 83), mostly from total blocking time, so only differences larger than that noise are claimed below.

## Scores (performance / accessibility / best practices / SEO)

| Page | Live before (mobile) | Local before (mobile, median) | Local after (mobile, median) | Live before (desktop) | Local before (desktop) | Local after (desktop) |
|---|---|---|---|---|---|---|
| Home | 72 / 96 / 100 / 100 | 81 / 96 / 96 / 100 | **90 / 100** / 96 / 100 | 100 / 96 / 100 / 100 | 99 / 96 / 96 / 100 | **100 / 100** / 96 / 100 |
| Calculator | 59 / 95 / 100 / 100 | 88 / 95 / 96 / 100 | 89 / **100** / 96 / 100 | 98 / 95 / 100 / 100 | 100 / 95 / 96 / 100 | 100 / **100** / 96 / 100 |
| Guide | 79 / 95 / 100 / 100 | 89 / 95 / 96 / 100 | 86 / **100** / 96 / 100 | 100 / 95 / 100 / 100 | 100 / 95 / 96 / 100 | 100 / **100** / 96 / 100 |
| Comparison | 73 / 96 / 100 / 100 | 83 / 96 / 96 / 100 | 83 / **100** / 96 / 100 | 99 / 96 / 100 / 100 | 99 / 96 / 96 / 100 | **100 / 100** / 96 / 100 |

Mobile medians (local): home total blocking time 649 ms to 323 ms; calculator, guide, and comparison within noise (LCP 2.6 to 2.8 s on both sides). First-party JavaScript on every page: 214 KB to 174 KB transferred (801 KB to 584 KB uncompressed) on home and comparison, 210 KB to 170 KB (784 KB to 567 KB) on the calculator and guide.

## Fixes, in impact order

| Commit | Fix | Audit it answers |
|---|---|---|
| 21ca965 | The client `Calculator` no longer imports all of `stateRules.json` (about 306 KB raw, 63 KB gzipped) just to list state names; the calculator and guide pages pass a small list from `getStateOptions()` on the server. Saves about 40 KB transferred and 217 KB of JavaScript to parse on every page (it was also prefetched on home and the comparison page). | `unused-javascript` (home: chunk 99.95% unused, 64 KB), `bootup-time`, `mainthread-work-breakdown` |
| eca80f7 | Muted text at 3.7 to 3.9:1 (footer note, waived lien amount, comparison rank and verified dates) now slate-500 in light theme and slate-400 in dark. | `color-contrast` (308 elements on the comparison page) |
| eca80f7 | VEIP note heading is an `h3` under the results `h2` instead of an `h4`. | `heading-order` |
| eca80f7 | The share button drops its `aria-label`, so its accessible name is its visible text ("Save / Share Result"). | `label-content-name-mismatch` |
| bf06108 | Comparison page "0%" badge: white on emerald-700 instead of emerald-600 (3.65:1). | `color-contrast` (last remaining item) |

No calculator behavior, total, or copy changed. The full test suite (including every worked-example total) passes unchanged; the only test edits find the share button by its visible name.

## Analytics: costs for Cliff to decide (not changed)

From the live mobile reports. All three load after the page is interactive (`afterInteractive`), so none blocks first paint; the cost is main-thread time and bytes.

| Stack | Bytes | Main thread / blocking time (mobile) | Other findings |
|---|---|---|---|
| Google Analytics (gtag.js via Google Tag Manager) | 177 KB transferred (528 KB raw), about 42% unused | 351 to 529 ms main thread, 237 to 396 ms blocking, the largest single cost on every page | |
| Cloudflare Web Analytics | 10 KB | 49 to 117 ms, 0 to 49 ms blocking | `legacy-javascript` (10 KB of polyfills), `uses-long-cache-ttl` (1-day cache), and `uses-rel-preconnect` suggests preconnecting to cloudflareinsights.com (est. 300 ms on home) |
| Vercel Analytics | 2 KB | negligible | 31-day cache flagged by `uses-long-cache-ttl` |

Options if you want them: load GA later (on idle or first interaction) to take its 240 to 400 ms of blocking time off the load window, or drop one stack. Expected effect of deferring or removing GA: roughly 5 to 15 mobile performance points on the calculator and guide pages, by the blocking-time figures above. A preconnect hint for Cloudflare is a one-line change but touches how an analytics stack loads, so it is listed here instead of done.

## Structural items (reported, not built)

| Item | Evidence | Expected gain |
|---|---|---|
| The whole calculator UI is one client component tree that hydrates on load, and its first-party chunk still runs about 560 ms of script on mobile. Moving static parts (header, FAQ, disclaimers, guide links) to server components and hydrating only the form and results would shrink it. | `bootup-time`, `mainthread-work-breakdown`, LCP render delay (LCP element is text; render delay 1.7 to 3.5 s of LCP on live mobile) | About 100 to 250 ms less blocking time and a few mobile points on calculator and guide pages |
| The comparison page renders three full 51-row tables at once (2,072 DOM elements). Rendering one table at a time, or the other two on demand, is a layout change. | `dom-size`, `mainthread-work-breakdown` | About 100 to 300 ms less style and layout work on mobile |
| Next.js ships polyfills for already-supported features (for example `Array.prototype.at`) in its framework chunk. | `legacy-javascript-insight` (14 KB first-party) | About 14 KB less JavaScript; needs a framework or browserslist configuration change |
| Server response time is 650 to 750 ms on live mobile runs (simulated slow 4G includes network latency). | LCP phase TTFB | Depends on Vercel region and caching; pages are already prerendered |
