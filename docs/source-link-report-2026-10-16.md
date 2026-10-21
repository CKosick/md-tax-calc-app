# CarTaxHub source link report (2026-10-16)

Every state source URL in `src/config/stateRules.json` was checked. This report is generated from `src/config/sourceLinkStatus.json` (by `scripts/source-link-report.mjs`), which is also what the site uses to hide dead links.

**Method:** Each state source URL was requested with curl, then every non-200 or suspect result was opened in a real browser and judged by the page shown (403s and timeouts from scripts are often bot blocking, so they were not treated as dead without a browser check).

## Summary

- Source links configured now: 109 across 51 jurisdictions
- Hidden on the site (dead or unreachable): 37
- Working but only an agency homepage, not a specific page: 16
- States showing no source link ("Official source links ... are being updated"): 10
- States with some links hidden: 16
- States re-verified since the check: California (October 2026), Florida (October 2026), Maryland (October 2026), Pennsylvania (October 2026), Texas (October 2026), Virginia (October 2026)

All other states keep their September 2026 verified date until their rates are re-checked in a repair batch.

## Repaired

| State | Repaired on | What changed |
|---|---|---|
| Virginia | 2026-10-17 | Dead fee and registration links replaced with the DMV 201 fee sheet, registration page, and buying/selling page; rates and fees re-checked. |
| Pennsylvania | 2026-10-17 | Retired PennDOT links replaced with the current MV-70S fee schedule, buying/selling page and fact sheet, and the Revenue sales tax page; rates and fees re-checked. |
| Texas | 2026-10-20 | Comptroller publication link (showed the homepage) replaced with the SPV and gift tax pages; TxDMV registration and buying/selling pages added; rates and fees re-checked. |
| California | 2026-10-20 | Dead CDTFA rate link replaced with the CDTFA vehicles page and the October 2026 rate notice; DMV fee and private-party pages added; rates and fees re-checked. |
| Florida | 2026-10-20 | Sources replaced with the FLHSMV fee, private sale, and registration pages and the DOR motor vehicle sales tax brochure; rates and fees re-checked. |

## Priority: states with no working source link

- Arkansas
- Connecticut
- Illinois
- Louisiana
- Michigan
- Minnesota
- New York
- Ohio
- Oklahoma
- Utah

## Hidden links by state

| State | URL | What the browser showed |
|---|---|---|
| Arizona | https://azdor.gov/transaction-privilege-tax | Page not found |
| Arkansas | https://www.dfa.arkansas.gov/excise-tax/sales-and-use-tax/motor-vehicle-tax/ | Page not found |
| Arkansas | https://www.dfa.arkansas.gov/driver-services/fees/ | Page not found |
| Connecticut | https://portal.ct.gov/dmv/vehicle-services/fees-dmv-services | 404 |
| Connecticut | https://portal.ct.gov/drs/sales-tax/sales-and-use-tax | Redirects to a 404 error page |
| District of Columbia | https://dmv.dc.gov/service/vehicle-excise-tax | Page not found |
| District of Columbia | https://dmv.dc.gov/service/vehicle-registration-fees | Page not found |
| Georgia | https://dor.georgia.gov/motor-vehicles/vehicle-registration-and-licensing | Page not found |
| Illinois | https://tax.illinois.gov/research/taxrates/rut-50.html | 404 |
| Illinois | https://www.ilsos.gov/departments/vehicles/fees.html | Not found |
| Indiana | https://www.in.gov/bmv/registration-plates/vehicle-registration-fees/ | Page not found |
| Iowa | https://iowadot.gov/mvd/buyingselling/registering-a-vehicle | Page not found |
| Kansas | https://www.ksrevenue.gov/prtaxrates.html | Redirects to a 404 page |
| Kentucky | https://drive.ky.gov/motor-vehicle-licensing/Pages/Vehicle-Taxes.aspx | Redirects to a 404 page |
| Louisiana | https://omv.dps.louisiana.gov/Fee_Schedule.aspx | Site did not load (script and browser) |
| Louisiana | https://revenue.louisiana.gov/SalesTax | Page not found |
| Massachusetts | https://www.mass.gov/info-details/motor-vehicle-sales-and-use-tax | Not found |
| Michigan | https://www.michigan.gov/sos/vehicle/pricing | Redirects to a 404 page |
| Michigan | https://www.michigan.gov/treasury/taxes/business-taxes/sales-use-tax | Redirects to a 404 page |
| Minnesota | https://dps.mn.gov/divisions/dvs/fees/Pages/default.aspx | 404 |
| Minnesota | https://www.revenue.state.mn.us/motor-vehicle-sales-tax | Page not found |
| Nebraska | https://dmv.nebraska.gov/dvr/title/motor-vehicle-titling | 404 Not Found |
| Nevada | https://dmv.nv.gov/fees.htm | 404 |
| New Jersey | https://www.nj.gov/treasury/taxation/sales_use_tax.shtml | 404 Page Not Found |
| New Mexico | https://www.mvd.newmexico.gov/vehicles/taxes-fees/ | 404 Not Found |
| New York | https://dmv.ny.gov/registration/registration-fees-and-taxes-passenger-vehicles | Redirects to site search (404) |
| New York | https://www.tax.ny.gov/pit/sp/sales_tax_rates.htm | 404 Page not found |
| North Carolina | https://www.ncdot.gov/dmv/title-registration/taxes/Pages/highway-use-tax.aspx | Redirects to a page-not-found page |
| Ohio | https://bmv.ohio.gov/vr-fees.aspx | The resource cannot be found |
| Ohio | https://tax.ohio.gov/help-center/faqs/sales-and-use-taxes-motor-vehicles | Redirects to a 404 page |
| Oklahoma | https://oklahoma.gov/service/all-services/vehicle-registration.html | 404 resource not found |
| Oklahoma | https://oksenate.gov/legislation/oklahoma-statutes | Error page ("Oops") |
| South Carolina | https://www.scdmvonline.com/Vehicle-Owners/Titles-and-Registration | Page not found |
| Utah | https://dmv.utah.gov/taxes-fees/fees | Redirects to an unrelated page (Impound Fees) |
| Utah | https://dmv.utah.gov/taxes-fees/sales-tax | 404 |
| Washington | https://dol.wa.gov/vehicles-and-boats/vehicle-registration-tabs-and-plates/renew-vehicle-tabs/calculate-vehicle-tab-fees | 404 Page Not Found |
| Wisconsin | https://www.revenue.wi.gov/Pages/FAQS/pcs-motorveh.aspx | Redirects to a page-not-found page |

## Working, but homepage only (replace with a specific page when convenient)

| State | URL | Note |
|---|---|---|
| Alaska | https://dmv.alaska.gov | Agency homepage |
| Hawaii | https://hidot.hawaii.gov | Agency homepage |
| Hawaii | https://mvinquiry.hnl.info | Lookup tool homepage |
| Iowa | https://iowatreasurers.org | Agency homepage |
| Maine | https://www.maine.gov/revenue | Agency homepage |
| Mississippi | https://www.dor.ms.gov | Agency homepage |
| Montana | https://mvdmt.gov | Agency homepage |
| Nevada | https://tax.nv.gov | Agency homepage |
| New Hampshire | https://www.nh.gov/safety/divisions/dmv | Redirects to the DMV homepage |
| North Dakota | https://www.dot.nd.gov | Agency homepage |
| Rhode Island | https://dmv.ri.gov | Agency homepage |
| Rhode Island | https://tax.ri.gov | Agency homepage |
| Vermont | https://dmv.vermont.gov | Agency homepage |
| West Virginia | https://transportation.wv.gov/dmv | Redirects to the DMV homepage |
| Wyoming | https://revenue.wyo.gov | Agency homepage |
| Wyoming | https://www.dot.state.wy.us | Agency homepage |

## Repairing a state

1. Find the current official page(s) for the state's tax rate and title/registration fees, and confirm they load in a real browser.
2. Re-check every configured number for the state in `stateRules.json` (rates, minimums, fees, registration tiers, surcharges, FAQ and disclaimer text) and fix anything that changed.
3. Replace the dead or homepage-only URLs in that state's `sources`, remove its entries from `sourceLinkStatus.json` (`hidden` / `homepageOnly`), add a `repaired` entry, and set its `lastVerified` to the month of the re-check only if the re-check completed.
4. Run `node scripts/source-link-report.mjs`.
