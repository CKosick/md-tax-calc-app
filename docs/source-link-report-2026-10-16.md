# CarTaxHub source link report (2026-10-16)

Every state source URL in `src/config/stateRules.json` was checked. This report is generated from `src/config/sourceLinkStatus.json` (by `scripts/source-link-report.mjs`), which is also what the site uses to hide dead links.

**Method:** Each state source URL was requested with curl, then every non-200 or suspect result was opened in a real browser and judged by the page shown (403s and timeouts from scripts are often bot blocking, so they were not treated as dead without a browser check).

## Summary

- Source links configured now: 142 across 51 jurisdictions
- Hidden on the site (dead or unreachable): 17
- Working but only an agency homepage, not a specific page: 16
- States showing no source link ("Official source links ... are being updated"): 0
- States with some links hidden: 16
- States re-verified since the check: Arkansas (October 2026), California (October 2026), Connecticut (October 2026), Florida (October 2026), Illinois (October 2026), Louisiana (October 2026), Maryland (October 2026), Michigan (October 2026), Minnesota (October 2026), New York (October 2026), Ohio (October 2026), Oklahoma (October 2026), Pennsylvania (October 2026), Texas (October 2026), Utah (October 2026), Virginia (October 2026)

All other states keep their September 2026 verified date until their rates are re-checked in a repair batch.

## Repaired

| State | Repaired on | What changed |
|---|---|---|
| Virginia | 2026-10-17 | Dead fee and registration links replaced with the DMV 201 fee sheet, registration page, and buying/selling page; rates and fees re-checked. |
| Pennsylvania | 2026-10-17 | Retired PennDOT links replaced with the current MV-70S fee schedule, buying/selling page and fact sheet, and the Revenue sales tax page; rates and fees re-checked. |
| Texas | 2026-10-20 | Comptroller publication link (showed the homepage) replaced with the SPV and gift tax pages; TxDMV registration and buying/selling pages added; rates and fees re-checked. |
| California | 2026-10-20 | Dead CDTFA rate link replaced with the CDTFA vehicles page and the October 2026 rate notice; DMV fee and private-party pages added; rates and fees re-checked. |
| Florida | 2026-10-20 | Sources replaced with the FLHSMV fee, private sale, and registration pages and the DOR motor vehicle sales tax brochure; rates and fees re-checked. |
| New York | 2026-10-21 | Dead DMV fee and Tax Department rate links replaced with the DMV passenger fee chart, sales tax, and ownership transfer pages and Publication 718; rates and fees re-checked. |
| Illinois | 2026-10-21 | Dead RUT-50 and Secretary of State fee links replaced with the RUT-50 instructions, the RUT-5 tax chart, the SOS fee list, and the SOS new resident page; rates and fees re-checked. |
| Ohio | 2026-10-21 | Dead BMV and Department of Taxation links replaced with the Taxation motor vehicle and county rate pages, the BMV fee and title pages, and R.C. 4505.09; rates and fees re-checked. |
| Michigan | 2026-10-22 | Dead Treasury and SOS pricing links replaced with the SOS title transfer, ownership, titles FAQ, and plates pages and MCL 257.801; rates and fees re-checked. |
| Minnesota | 2026-10-22 | Dead Revenue and DVS fee links replaced with the Revenue motor vehicle sales, nontaxable, and miscellaneous sales guides, the DVS fees and registration pages, and Minn. Stat. 168.013; rates and fees re-checked. |
| Oklahoma | 2026-10-22 | Dead Service Oklahoma and statute links replaced with the Service Oklahoma fees, titles, and out-of-state transfer pages, the title transfer procedure, and OTC Form 579; rates and fees re-checked. |
| Arkansas | 2026-10-25 | Dead DFA motor vehicle tax and fee links replaced with the DFA motor vehicle FAQs, law changes, used-vehicle credit, sales tax FAQs, the October to December 2026 local rate table, and the MyDMV fee schedule; rates and fees re-checked. |
| Connecticut | 2026-10-25 | Dead DMV fee and DRS links replaced with the DMV sales tax, fees, ownership transfer, and out-of-state registration pages and C.G.S. chapter 246; rates and fees re-checked. |
| Louisiana | 2026-10-25 | Dead OMV fee schedule and LDR links replaced with the OMV fee and used title pages, the LDR state rate page, the OMV parish tax table, and OMV policies 52.00 and 48.00; rates and fees re-checked. |
| Utah | 2026-10-25 | Dead DMV links replaced with the DMV registration fees, uniform fees, title transfer, and registration pages, the October 2026 Tax Commission rate chart, the 2026 fee schedule, and the road usage charge site; rates and fees re-checked. |

## Priority: states with no working source link



## Hidden links by state

| State | URL | What the browser showed |
|---|---|---|
| Arizona | https://azdor.gov/transaction-privilege-tax | Page not found |
| District of Columbia | https://dmv.dc.gov/service/vehicle-excise-tax | Page not found |
| District of Columbia | https://dmv.dc.gov/service/vehicle-registration-fees | Page not found |
| Georgia | https://dor.georgia.gov/motor-vehicles/vehicle-registration-and-licensing | Page not found |
| Indiana | https://www.in.gov/bmv/registration-plates/vehicle-registration-fees/ | Page not found |
| Iowa | https://iowadot.gov/mvd/buyingselling/registering-a-vehicle | Page not found |
| Kansas | https://www.ksrevenue.gov/prtaxrates.html | Redirects to a 404 page |
| Kentucky | https://drive.ky.gov/motor-vehicle-licensing/Pages/Vehicle-Taxes.aspx | Redirects to a 404 page |
| Massachusetts | https://www.mass.gov/info-details/motor-vehicle-sales-and-use-tax | Not found |
| Nebraska | https://dmv.nebraska.gov/dvr/title/motor-vehicle-titling | 404 Not Found |
| Nevada | https://dmv.nv.gov/fees.htm | 404 |
| New Jersey | https://www.nj.gov/treasury/taxation/sales_use_tax.shtml | 404 Page Not Found |
| New Mexico | https://www.mvd.newmexico.gov/vehicles/taxes-fees/ | 404 Not Found |
| North Carolina | https://www.ncdot.gov/dmv/title-registration/taxes/Pages/highway-use-tax.aspx | Redirects to a page-not-found page |
| South Carolina | https://www.scdmvonline.com/Vehicle-Owners/Titles-and-Registration | Page not found |
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
