# Batch 12 research notes (NV, IA, KS), 2026-11-13

Working notes from the official-source re-check for guide batch 12. Items marked **For ruling** were not changed.

## Nevada (Nevada DMV, NRS, NAC)

- No sales tax on private sales. The DMV says "Sales taxes are not charged on private party vehicle sales, family sales or gifts." https://dmv.nv.gov/registervehicle.htm
- Title fee: $28.25. NAC 482.907 sets $20 for a title on a vehicle present or registered in Nevada (sub. 1), plus $8.25 to process an endorsed title from a sale by a non-dealer (sub. 8). The registration fee page says "The fee for a first-time Nevada title is $28.25." https://www.leg.state.nv.us/NAC/NAC-482.html , https://dmv.nv.gov/regfees.htm
  - Conflict on the DMV's own site: the title page lists "Complete change of ownership on any vehicle $28.50". It is $0.25 off the regulation and the fee page, so $28.25 stays. https://dmv.nv.gov/title.htm
- No separate lien fee found. Lienholders hold the title.
- Registration: $33 passenger car. Motorcycle: $33 plus a $6 motorcycle safety fee, except trimobiles (NRS 482.480(4); fee page). **Config had $33; now $39.**
- GST: 4% of 35% of MSRP, 5% off in year 1 and 10% a year after, down to 15%; $16 minimum; Supplemental GST of 1% in Clark and Churchill counties. The DMV example (2 years old, $20,000 MSRP, $238) matches the engine's year-3 factor (85%). Unchanged.
- EV and plug-in hybrid fees: still none found on the fee page. The written inquiry (2026-11-08) has no reply. `fuelFeesUnverified` stays; nothing added. Guides do not state any EV fee.
- After a private purchase: drive up to 3 days with the signed title or a bill of sale and Nevada insurance on a direct route home or to the DMV. After that, a movement permit ($1 online, 30 days, NAC 482.906) or registration. Register online with Rapid Registration or at an office. The seller keeps the plates. A bill of sale alone is not proof of ownership; the seller must give a signed-off title, liens satisfied first. 2011 and newer vehicles need the odometer reading on the title.
  - No statutory day count for a private buyer was found. The old private-party page that gave 30 days (`dmv.nv.gov/regprivate.htm`) is now a 404, so the guides do not give a day count.
- Insurance: Nevada-licensed carrier only, in the exact names on the registration and title, effective on or before the registration date.
- VIN inspection (Form VP 015) for a vehicle never registered or titled in Nevada; done at DMV inspection stations, by a sworn officer, or by an authorized business. The DMV or its agents charge $1 for it (NAC 482.9005).
- Emissions: urban Clark and Washoe counties; gasoline 1968 and newer and diesel up to 14,000 lbs GVWR; new vehicles exempt for the first three registrations, hybrids for five model years; electric vehicles and motorcycles exempt. The test is valid 90 days; a transfer is exempt if the last test was within 90 days, and transfers between spouses are exempt. In a private sale the test is the buyer's responsibility. https://dmv.nv.gov/emission.htm
- New residents: register within 30 days after becoming a resident or when getting a Nevada driver's license, whichever is earlier (NRS 482.385(3)); 30 days also applies after starting work or enrolling a child in school (sub. 5). Bring current registration, odometer reading, out-of-state plates, a VIN inspection, Nevada insurance, and an emissions report if required. https://dmv.nv.gov/newresident.htm , https://www.leg.state.nv.us/NRS/NRS-482.html
- Death of owner without trust or probate: Form VP 024. Turbo Title takes private, family, gift, new-resident, and estate titles online, with an office visit for originals. https://dmv.nv.gov/turbotitles.htm
- Dead link: https://dmv.nv.gov/fees.htm (404). Homepage-only `tax.nv.gov` dropped; its fact (no sales tax on private sales) is on the DMV page.

## Iowa (Iowa Code ch. 321 2026, Iowa DOT, county treasurers)

- Fee for new registration: Iowa Code 321.105A(2) now reads "ten dollars plus five percent of the purchase price". Linn County's January 8, 2025 release lists "5% of the purchase price + $10" from January 1, 2025, and Woodbury County's treasurer page says "$10.00 plus 5%". The DOT memo cited in search results (`iowadot.gov/media/6992/download`) is now a 404. **For ruling: the calculator charges 5% only, so every taxable Iowa purchase is $10 low.**
- Trade-in: 321.105A(2)(a)(2)(b) exempts "In a transaction between persons, neither of which is a retailer ... the amount of the trade-in value allowed". Sub. (c) requires the same person on both titles, with exceptions for spouses, lineal family (including adopted and step), entities, and cosigners. **For ruling: config has `tradeInDeductible: false` and copy says trade-ins are not permitted.**
- Gifts: exempt, "A vehicle transferred from one individual to another individual as a gift in a transaction in which no consideration is present" (321.105A(2)(c)(19)). Trusts with no consideration (11), transfers by operation of law under 321.47 (10).
- New residents: exempt if the vehicle was bought for use in the old state and not for use in Iowa (321.105A(2)(c)(8)). Credit for sales, use, or occupational tax paid to another state; the difference is due if the Iowa fee is higher (7).
- Title $35 (Linn County: regular title $25 to $35 on January 1, 2025; Woodbury and Marion counties list $35). The 2026 Code text in 321.20 and 321.46 says thirty dollars; the counties charge $35 after the 2025 county-retained increase. $35 stays.
- Lien notation $20 (321.50).
- Deadline: 30 calendar days after purchase or transfer (321.46(1)). Late: $10 title penalty (321.49), plus a registration penalty (Woodbury: 5% of the registration, $5 minimum, growing monthly). Registration credit for the unexpired fee on a vehicle sold, claimed within 6 months, $10 minimum (321.46(3)).
- Documents (DOT title page): signed title, bill of sale on the title or a purchase agreement, Form 411007, Form 411168 if a lien shows, odometer statement, Damage Disclosure (411108) for vehicles 8 years old or newer.
- Registration: 1% of list price plus 40 cents per 100 lbs; 75% after 7 model years, 50% after 9, $50 floor; $50 flat from 12 model years (321.109, 321.113). Fee table (iowataxandtags.org) bands: 1 to 7 years 100%, 8 to 9 75%, 10 to 11 50%, 12 and after $50.
- **$239 (not ratified):** the fee table's bands start at 1, with no zero, which supports treating the current model year as year 1 (the $239 build). No source found showing Iowa subtracts instead ($314). The DOT fee calculator was not reached. No change; no new evidence either way.
- EV $130 and PHEV $65 (321.116), unchanged since 2023 Acts ch 66.
- Motorcycle: $20, but $10 when more than five model years old (321.117(1)); fee table "1 to 5 years: $20, 6 or older: $10". **For ruling: config charges $20 at every age.** The existing `feesByRegistrationYear` field could carry it, but "more than five model years old" raises the same counting question as the $239.
- New residents: title and register within 30 days of establishing residency, even with valid out-of-state plates (DOT register page).
- Dead link: https://iowadot.gov/mvd/buyingselling/registering-a-vehicle. Homepage-only `iowatreasurers.org` replaced by the treasurers' fee table page.

## Kansas (KDOR, K.S.A., Johnson County)

- State rate 6.5%. Private sale ("isolated or occasional sale"): the buyer pays the County Treasurer at registration at the rate where the buyer lives (Pub. KS-1526, Rev. 7-29-25; K.A.R. 92-19-30).
- Local range: KDOR Pub. KS-1700 rate file effective October 1, 2026 (`pub17001026.xlsx`), county plus city, special districts excluded (CIDs and similar are location-based retail districts, not a buyer's home rate). Lowest 0% (33 places, for example Butler County outside cities, Rush County); highest 4.25%, Kanorado (Sherman County 2.25% plus city 2%). The January 1, 2027 file has the same extremes. **Config had 1% to 4%; now 0% to 4.25% (combined 6.5% to 10.75%).**
- Trade-in in an isolated sale: fair market value of a vehicle traded in may be deducted (Pub. KS-1526). Config true; unchanged. K.S.A. 79-3697 sold-vehicle credit unchanged.
- Gifts: a bona fide gift, given without consideration, is not a sale (Pub. KS-1526). Presumed a gift between spouse, parent, sibling, child, grandparent, aunt, uncle, niece, nephew if no money changes hands. Sales between immediate family (lineal ascendants and descendants and their spouses, including step and adopted; in-laws to parents-in-law) are exempt with Form TR-215; siblings, aunts, uncles, nieces, nephews, cousins are not. Gift paperwork: Vehicle Gift Certification on Form TR-12, or TR-215 for child, parent, grandchild, grandparent.
- New residents / out of state: credit for sales or use tax legally paid to another state, up to the Kansas amount; no use tax if the first actual use was substantial and outside Kansas (K.A.R. 92-20-13; KDOR example: more than six months). Register when the vehicle has been in Kansas 90 days (DOV FAQ).
- Title $10 (K.S.A. 8-135(c)(4)); lien $1.50 service fee (8-135(c)(5)); plate transfer $1.50 (8-135(a)).
- Registration (K.S.A. 8-143(a)): $30 at 4,500 lbs or less, $40 over; motorcycle $16; all-electric motorcycle $30; electric hybrid $70; plug-in hybrid $100; all-electric $165. These are the whole fee for those vehicles, in place of the $30. **Config added $165 and $100 on top of $30; now +$135 and +$70**, the same reading already adopted for the electric motorcycle (+$14).
- **For ruling: surcharges at every registration, not in the estimate ($12.25):** $5 service fee (K.S.A. 8-145d), $2 Highway Patrol staffing and training surcharge (8-1,176), $1.25 surcharge (8-1,177), $4 division of vehicles modernization surcharge (disposition in 8-145(d)(4); imposing section not found; listed on Johnson County's 2026 fee page). Counties may also add up to $5 or $2.50 (8-145d). Johnson County lists a $5 transaction fee and $0.50 reflectorized plate fee.
- Deadline: 60 days, weekends and holidays included (K.S.A. 8-135(b)); penalty on and after day 61; no driving in that window without temporary registration (60-day permit from the County Treasurer). Out-of-state title or out-of-state bill of sale: Kansas Highway Patrol inspection (MVE-1) first. "Kansas does not have a safety or emissions inspection requirement or program." Most title assignments need no notary; lien releases do. Seller removes the plate. https://www.ksrevenue.gov/dovtitleused.html , https://www.ksrevenue.gov/dovtitlefaq.html
- Property tax paid at registration (DOV used-vehicle page). Disclosed, not modeled, as before.
- Dead link: https://www.ksrevenue.gov/prtaxrates.html. Homepage-only `www.ksrevenue.gov/` replaced.

## `lastVerified`

- Nevada: November 2026. Every figure was checked; the EV question is the open written inquiry and adds nothing to the estimate.
- Iowa and Kansas: unchanged (September 2026). The re-check found figures the estimate leaves out ($10 fee for new registration; $12.25 Kansas surcharges) that wait on a ruling, so the page should not carry a new verified date until they are settled.
