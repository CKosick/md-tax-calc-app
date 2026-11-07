# Car EV and plug-in hybrid fee re-check, 2026-11-07

Seven states flagged by `motorcycle-ev-fees-2026-11-07.md`. Five are fixed. Nevada and Mississippi are unchanged and need a ruling. `lastVerified` is unchanged for every state, because this covered only these fees.

## Results

| State | Site before | Site now | Source | Status |
|---|---|---|---|---|
| Wyoming | EV $200, no plug-in hybrid fee | $100 / $50 | [2026 Enrolled Act 33](https://wyoleg.gov/2026/Enroll/HB0145.pdf), effective July 1, 2026; codified in [W.S. 31-3-102](https://www.wyoleg.gov/statutes/compress/title31.pdf) | Fixed |
| Nebraska | EV $150, no plug-in hybrid fee | $150 / $75 | [Neb. Rev. Stat. 60-3,191](https://nebraskalegislature.gov/laws/statutes.php?statute=60-3,191), effective July 18, 2026 | Fixed |
| South Dakota | EV $50 | $100 | [SDCL 32-5-188](https://sdlegislature.gov/Statutes/32-5-188), [HB 1227 enrolled](https://mylrc.sdlegislature.gov/api/Documents/304125.pdf), [SDCL 2-14-16](https://sdlegislature.gov/Statutes/2-14-16) | Fixed |
| Montana | EV $130, no plug-in hybrid fee | $130 / $70, under 6,000 lbs | [MCA 61-3-572](https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0050/section_0720/0610-0030-0050-0720.html), [61-3-571](https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0050/section_0710/0610-0030-0050-0710.html) | Fixed |
| Vermont | EV +$89, no plug-in hybrid fee | +$87 / +$44.50 | [DMV registration fees](https://dmv.vermont.gov/registrations/fees), [DMV infrastructure fee](https://dmv.vermont.gov/registrations/fees/ev-infrastructure-fee), [23 V.S.A. 361](https://legislature.vermont.gov/statutes/section/23/007/00361) | Fixed |
| Nevada | $125 / $75 | Unchanged | None found | For ruling |
| Mississippi | $150 / $75 | Unchanged | Base amounts only | For ruling |

## Judgment calls in the fixes

- **South Dakota's date.** HB 1227 has no effective date clause. SDCL 2-14-16 makes a regular session act effective on July 1 after passage, so the page says July 1, 2026. The signing date, February 26, 2026, comes from a search summary of the governor's release, which I did not open. The codified section already shows $100.
- **Montana's weight.** The form's weight question does not split at 6,000 lbs, and the state does not show it, so the estimate uses the class under 6,000 lbs. The page gives the next class ($190 / $100). Heavier classes are not on the page because they are not typical passenger vehicles. The law sets minimum battery sizes (20 and 5 kWh), which are on the page.
- **Vermont's +$87.** The report's $2 gap is the Clean Air Fund fee, which DMV says is included in its totals. A gas car pays $91 and $167. A battery electric car's registration is $89 and $163, without that fee, plus $89 a year. The engine adds a fee to the gas registration, so +$87 a year gives DMV's totals exactly: $178 and $341. The form label reads +$87 and the disclaimer explains why. Plug-in hybrids keep the fee, so +$44.50 gives $135.50 and $256.

## Vermont on January 1, 2027

Subsection 361(b), the battery electric fee, is repealed that day. The plug-in hybrid fee stays under 361(c). Battery electric owners would then pay registration of $89 or $163, which is below the gas figure the engine starts from, so the fix needs either a negative add-on or a fuel-specific base fee. DMV has not posted 2027 totals. The figure is in the staleness registry and on the December list. No January commit is built.

## Interim motorcycle behavior

Adding plug-in hybrid fees and raising South Dakota would have made motorcycle estimates worse. Wyoming, South Dakota, Montana and Vermont exclude motorcycles, so all four now use `evSurchargePassengerOnly`, which charges them $0. The form shows "Not in estimate" until the motorcycle build replaces that label. Nebraska keeps charging a motorcycle $150 until that build, which sets $75. South Dakota's $24 electric motorcycle base fee and Vermont's $56 also wait for that build.

## Nevada, for ruling

**No primary source for $125 or $75 was found.**

- [NRS 482](https://www.leg.state.nv.us/nrs/nrs-482.html), the registration chapter, has no EV or plug-in hybrid fee. Its only electric references are a fuel type list and an extra weight allowance for alternative fuel vehicles at no added fee.
- [NRS 371](https://www.leg.state.nv.us/nrs/nrs-371.html), the Governmental Services Tax chapter, has no reference to electric or hybrid vehicles.
- [The DMV registration fee page](https://dmv.nv.gov/regfees.htm) lists no such fee. `dmv.nv.gov/fees.htm`, in the state's sources, returns 404.
- Secondary sources disagree. The [Tax Foundation table](https://taxfoundation.org/data/all/state/electric-vehicle-ev-taxes/) shows $0, and others say $100. A [Fox Reno item](https://foxreno.com/news/local/washoe-county-voters-to-weigh-advisory-question-on-ev-and-hybrid-road-fees) describes an advisory question in Washoe County on whether lawmakers should allow such a fee, which suggests none exists. I saw that item and the table only in search summaries. None of these settles it.

Absence from these sources does not prove there is no fee, but no source supports the amounts. Every Nevada EV estimate is $125 higher than any source supports, and every plug-in hybrid estimate $75 higher.

**Recommendation:** remove both fees and say on the page that no state EV registration fee was found in NRS 482 or the DMV schedule, so confirm with the DMV. Keeping them shows amounts with no source. Disclosure alone leaves the estimate high.

## Mississippi, for ruling

- **Base amounts confirmed, current amounts not.** [HB 1 (2018)](https://billstatus.ls.state.ms.us/documents/20181E/html/HB/0001-0099/HB0001SG.htm), sections 5 and 6, sets $150 and $75 and raises them each July 1 from 2021 by the prior year's inflation, rounded to the whole dollar. The [2024 code text on Justia](https://law.justia.com/codes/mississippi/title-27/chapter-19/article-1/section-27-19-21/) (not an official site) still has that clause, and [2026 HB 288](https://billstatus.ls.state.ms.us/documents/2026/html/HB/0200-0299/HB0288IN.htm) reprints it. That bill [died in committee](https://billstatus.ls.state.ms.us/2026/pdf/history/HB/HB0288.xml) on February 25, 2026.
- **No published amount.** The [DOR motor vehicle page](https://www.dor.ms.gov/motor-vehicle) has no figure, and no official page with the adjusted amounts was found. I did not calculate one, because the certified rate and the rounding order would be my assumptions.
- **So $150 and $75 are probably low,** by an unknown amount, if the adjustment has been applied.
- **Not the same class.** Mississippi's "hybrid vehicle" covers any vehicle using more than one form of onboard energy, so it may include hybrids that do not plug in. The site's fuel question has no choice for those.

**Recommendation:** keep the base amounts and add this disclosure: "Mississippi's law raises these amounts each July for inflation, and the state does not publish the current figures we could find, so your county tax collector's amount may be higher." Then ask a county tax collector or DOR, with the deferred written inquiries.

## Other changes

- The form printed +$44.5/yr style labels for fees ending in a 5 or 0 in the cents, as in North Carolina ($214.5) and Utah ($56.5). They now show cents in full.

## Wave 2

`feat/december-recheck-2026` edits `datedFigures.json` and the same lines of `tests/datedFigures.test.ts`. This branch adds Vermont to both, so its merge will need a small conflict fix in January.
