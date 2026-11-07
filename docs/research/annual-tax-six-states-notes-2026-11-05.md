# Six-state annual-tax branch research notes, 2026-11-05

Cliff's ruling: build Iowa, Nevada, Nebraska, Wyoming, New Hampshire, and Maine under the annual-tax ruling. Washington stays copy-only with a Sound Transit mention. Massachusetts stays copy-only. Add local-vehicle-tax mentions for Missouri, Montana, Virginia, and West Virginia, with Virginia from a primary source. New Mexico's possible July 1 change goes on the December re-check list, not here.

All six use `registration.listPriceAnnualTax` with the $30,000 default, for passenger vehicles only, one full year, added to registration. Model year = year 1. `lastVerified` is unchanged for every state, because only these rules were re-checked.

| State | Rule | Default car (2019, $30,000) | Registration before, after |
|---|---|---|---|
| Iowa | 1% of list price through the 7th model year, 75% in the 8th and 9th, 50% in the 10th and 11th, $50 floor; flat $50 from the 12th; plus 40 cents per 100 lbs; whole dollars | $225 + $14 | $50, $239 |
| Nevada | 4% of 35% of MSRP; 100, 95, 85, 75, 65, 55, 45, 35, 25, then 15% by age; $16 minimum | $147 | $33, $180 |
| Nebraska | Base tax by value × age fraction, plus fee of $5, $20, or $30 (age cut at $20,000 and up) | $165 + $14 | $23.20, $202.20 |
| Wyoming | 3% of 60, 50, 40, 30, 20, then 15% of factory price; $5 minimum | $135 | $30, $165 |
| New Hampshire | $18, $15, $12, $9, $6, then $3 per $1,000 of list price; $5 minimum | $90 | $48, $138 |
| Maine | 24, 17.5, 13.5, 10, 6.5, then 4 mills on list price; $5 minimum | $120 | $35, $155 |

## Sources read

- **Iowa:** [Iowa Code 321.109](https://www.legis.iowa.gov/docs/code/321.109.pdf), [ch. 321, 2026 code, for 321.113](https://www.legis.iowa.gov/docs/code/2026/321.pdf), 321.110 (rounding), [IAC 761-400.22](https://www.legis.iowa.gov/docs/iac/rule/761.400.22.pdf) (retail list price).
- **Nevada:** [NRS 371](https://www.leg.state.nv.us/nrs/nrs-371.html), [DMV fees page](https://dmv.nv.gov/regfees.htm). The DMV example ($20,000 MSRP, two years old, $238) is a test case.
- **Nebraska:** [60-3,187](https://nebraskalegislature.gov/laws/statutes.php?statute=60-3,187) (50 brackets, age fractions, current model year is first year), [60-3,190](https://nebraskalegislature.gov/laws/statutes.php?statute=60-3,190) (fee), [60-3,140](https://nebraskalegislature.gov/laws/statutes.php?statute=60-3%2C140) via search summary (paid to the county treasurer). LB714 was indefinitely postponed April 17, 2026, via search summary.
- **Wyoming:** [Title 31](https://www.wyoleg.gov/statutes/compress/title31.pdf), [Laramie County](https://www.laramiecountywy.gov/County-Government/Elected-Officials/County-Treasurer/Vehicle-Registration). 2026 HB0030 would have changed the sixth-year-and-later rate. The [2026 session laws](https://wyoleg.gov/2026/SessionLaws.pdf) amend only 31-3-101(g)(i), and the only related act is the tribal governments bill, so (a)(i) stands.
- **New Hampshire:** [RSA 261:153](https://gc.nh.gov/rsa/html/XXI/261/261-153.htm).
- **Maine:** [36 M.R.S. 1482](https://legislature.maine.gov/statutes/36/title36sec1482.html), current through PL 2025 c. 523, with credit in subsection 5 and the late-year half rate in subsection 2.
- **Washington:** [DOL RTA tax page](https://dol.wa.gov/vehicles-and-boats/vehicles/taxes-and-fees/regional-transit-authority-rta-tax).
- **Missouri:** [DOR buying a vehicle](https://dor.mo.gov/motor-vehicle/titling-registration/buying-vehicle.html).
- **Montana:** [MCA 61-3-537](https://mca.legmt.gov/bills/mca/title_0610/chapter_0030/part_0050/section_0370/0610-0030-0050-0370.html).
- **Virginia:** [Va. Code 58.1-3506](https://law.lis.virginia.gov/vacode/title58.1/chapter35/section58.1-3506/) (classification, and localities may levy). The commissioner of the revenue's role comes from [Va. Code 58.1-3535](https://law.lis.virginia.gov/vacode/title58.1/chapter35.1/section58.1-3535/), via search summary. The DMV relief page refused the connection.
- **West Virginia:** [DMV registrations](https://dmv.wv.gov/vehicle-services/vehicles/registrations).

## Engine variants

- `minAmount`: Nevada, Wyoming, New Hampshire, Maine, Iowa.
- `roundToDollar`: Iowa only (321.110).
- Iowa needs no weight input. Its base is a fixed $14 (3,500 lbs), and `minAmount` 36 plus `flatFromYear` {12, 36} produce the $50 floor and flat fee. The statute's floor applies after 7 model years; the engine applies it at every age, which only matters below a $3,600 list price.
- Nebraska needs no new code. Tax and fee are combined per bracket in `classTable`, 50 rows by 14 ages.
- `taxLineName`: Maine, for the same reason as Indiana.

## Judgment items for review

1. **Iowa age counting (decided, not settled).** The statute says "more than seven model years old" and does not say how to count. The [Iowa Tax & Tags fee table](https://www.iowataxandtags.org/vehicle-registration/registration-fees-by-vehicle-type/) lists "Model Years Old" as 1 to 7, 8 to 9, 10 to 11, and 12 and older, with no zero, so the current model year is treated as 1. That matches how the calculator counts everywhere else, so a 2019 in 2026 is in its 8th model year and pays 75% ($239). If Iowa subtracts instead, that car pays $314. The DOT fee calculator was not reachable, so a county treasurer or the calculator should confirm it.
2. **Nevada age counting.** The statute gives no rule. I count 2026 minus model year. A used vehicle is never "new" in the statute's sense, so a current-model-year private sale may start at 95%, not 100%.
3. **Nevada Supplemental GST.** It is not in the estimate and adds 25% to the GST in Clark and Churchill counties. Clark is the state's most populous county, so many buyers will pay more than shown. The disclaimer says so.
4. **Nebraska rounding.** The statutes give no rounding rule, so amounts keep cents. County figures may round.
5. **Full year everywhere.** No proration, credits, or mid-year rules are modeled.
6. **Motorcycles excluded.** Nebraska's table and other states' taxes cover motorcycles, but they are shown without the tax, as in Indiana and Colorado.
7. **New Hampshire local fees.** The $3 reclamation fee and the optional municipal fee of up to $5 are disclosed, not added.
8. **Comparison page.** Totals rise for all six. Hawaii stays cheapest and California highest.

## Copy corrections in existing text

- Nevada FAQ named Clark and Washoe counties; the DMV says Clark and Churchill.
- Nevada disclaimer said registration includes the GST when the estimate did not.
- Wyoming's local note cited 31-3-102 for the county fee; it is in 31-3-101.
- Wyoming and Nebraska copy called these fees property taxes; the statutes and DMV do not, so that wording is gone.

## Found while building: `notes` do not display

No page component reads `rule.notes`. The field only reaches the page data, so visitors never see it. Only the local tax note, disclaimers, and FAQs display. For this branch, the new mentions are in disclaimers and an FAQ, and the new tests check rendered text. Notes in other states are still unseen, and notes elsewhere may hold facts that appear nowhere else on the page. Not changed here.
