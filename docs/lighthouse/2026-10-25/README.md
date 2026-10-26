# Lighthouse reports, 2026-10-25 pass

Lighthouse 12.8.2 on headless Microsoft Edge 156 (Chromium), default mobile settings and the desktop preset. Pages: home (`/`), the Maryland calculator, the Maryland private sale guide, and the comparison page (`/vehicle-tax-by-state`). Findings and fixes are in [REPORT.md](REPORT.md).

## What is in this folder

| Files | What they are | Format |
|---|---|---|
| `before-live-*.report.json` and `.report.html` | Live site before the pass (cartaxhub.com at 6f54200), one run per page and form factor | Raw JSON and HTML |
| `local/before-local-*`, `local/after-local-*` | Local production builds of `main` (6f54200) and the pass branch, all three analytics scripts loading; mobile has three runs per page (`run2`, `run3`) | Gzipped JSON |
| `production-after/after-live-*` | Live site after the merge (cartaxhub.com at a6b49cb), run on 2026-10-26; mobile has three runs per page and desktop home has three runs | Gzipped JSON |

The gzipped JSON files are full Lighthouse reports with only the embedded screenshot images removed (`fullPageScreenshot` and the details of `screenshot-thumbnails` and `final-screenshot`). Every score, metric, and audit is intact. To view one, unzip it (`gunzip file.report.json.gz`) and open the JSON in the Lighthouse Viewer (https://googlechrome.github.io/lighthouse/viewer/).

## Production after the merge (a6b49cb)

Performance / accessibility / best practices / SEO. Mobile is the median of three runs; desktop is one run, except home, which is the median of three. The before column is the single live baseline run.

| Page | Mobile before | Mobile after | Desktop before | Desktop after |
|---|---|---|---|---|
| Home | 72 / 96 / 100 / 100 | 79 / 100 / 100 / 100 | 100 / 96 / 100 / 100 | 95 / 100 / 100 / 100 |
| Calculator | 59 / 95 / 100 / 100 | 78 / 100 / 100 / 100 | 98 / 95 / 100 / 100 | 100 / 100 / 100 / 100 |
| Guide | 79 / 95 / 100 / 100 | 88 / 100 / 100 / 100 | 100 / 95 / 100 / 100 | 99 / 100 / 100 / 100 |
| Comparison | 73 / 96 / 100 / 100 | 82 / 100 / 100 / 100 | 99 / 96 / 100 / 100 | 98 / 100 / 100 / 100 |

Accessibility is 100 on every page and form factor, and first-party JavaScript fell from 212 to 216 KB to 170 to 174 KB transferred on every page. Mobile performance varies a lot between identical runs (home scored 70, 79, and 94; desktop home 90, 100, and 95), mostly from when Google Tag Manager's work lands, so read the performance column as "same or better" rather than as exact gains.
