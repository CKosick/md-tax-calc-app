# Batch 18 research notes (WY), 2026-11-22

Working notes from the official-source re-check for guide batch 18. Items marked **For ruling** were not changed. Items marked **unsourced** are on the page today with no source found; they are flagged here, not replaced. Items marked **not primary** rest on a search summary.

## Registration (W.S. 31-3-101, 31-1-101; county treasurer)

- County registration fee (31-3-101(a)(i)), confirmed: the greater of $5 or 3% of 60%, 50%, 40%, 30%, 20%, then 15% (sixth year and after) of the factory price plus special equipment value. Matches `listPriceAnnualTax` (`valueShare` 0.03, `ratesByYear`, `minAmount` 5). The Laramie County Treasurer gives the same formula and examples.
- Factory price (31-1-101): "the manufacturer's suggested retail price of the make, model and trim level of a vehicle, when new," excluding federal excise tax and transportation, "determined from any current, nationally recognized price guide." The Laramie County Treasurer: "The County Clerk office determines the factory cost on Wyoming titles." The estimate uses the MSRP the user enters ($30,000 if blank); the copy now says so and says the clerk uses a national price guide.
- Year of service: a vehicle of the current model year is in its first year of service regardless of purchase date (31-2-214(a)(i)). The engine counts the model year as year 1. Confirmed.
- State fee (31-3-101(a)(ii)): passenger car $30, confirmed. **Motorcycle $25** (31-3-101(a)(ii)(D), "Motorcycles, autocycles and multipurpose vehicles"; Laramie County: "Motorcycle & MPVs $25" since July 1, 2017). **Config $15 -> $25.**
- **For ruling:** the county fee in 31-3-101(a)(i) applies to every vehicle, motorcycles included; the engine applies it to passenger vehicles only, and the copy discloses that motorcycles are shown without it. Adding it for motorcycles is an engine change.
- On a sale the registration expires and the seller removes the plates (31-2-214(a)). **For ruling (small):** a transfer between joint owners or to a spouse, child, brother, sister, or parent gets a new registration for a $4 fee (31-3-102(a)(xii)) and keeps the plates for the rest of the registration year (31-2-214(b)); the estimate shows a full registration for a family gift. Disclosed in the gift guide.
- Fees for a vehicle not previously qualified in Wyoming are reduced by the share of the year before first operation (31-3-101(b)(vii)); disclosed for new residents.

## Sales and use tax (W.S. 39-15; DOR)

- 4% state rate (39-15-103). Confirmed.
- The county treasurer collects the tax before the first Wyoming registration, at the rate of the county of the owner's principal residence per the driver's license (39-15-107(b)(i)). Not collected if the vehicle was previously registered by the same nonresident owner in another state (same paragraph).
- **Local range: config 1% to 2% -> 0% to 3%.** DOR Excise Tax Division master rate chart effective October 1, 2026: Park and Sublette 4% (no county option); most counties 5%; Goshen 5.25% (economic development 0.25%); six counties 6%; Teton 7% (4% + 1% + 2%). The resort district taxes (Grand Targhee, Teton Village) apply to sales within those districts and are not part of a county rate. The copy's claim that "all 23 counties" add 1% to 2% was wrong for Park and Sublette. **Registered in `datedFigures.json`** (stale on 2027-04-01; the chart is reissued as rates change).
- Gifts (39-15-107(b)(ii)): tax "collected from the donee prior to the first registration based upon the fair market value of the gift." Family exemption (39-15-105(a)(xi)): purchases from or transfers to immediate family (parent, child, spouse, sibling, stepparent, stepchild, stepsibling, grandparent, grandchild) are exempt if the seller or donor paid sales or use tax when they bought or received the vehicle.
- Credit for another state's tax: "The department shall allow a credit for sales tax legally imposed and paid to another state on a purchase equal to but not exceeding the liability for use tax" (39-15-109(d)(v), as revised by 2026 SF 79, which moved the use tax into chapter 15 and repealed chapter 16). Section 2 of SF 79 takes effect July 1, 2027; the compiled code already shows chapter 16 repealed. Cited as 39-15-109(d)(v).
- **For ruling:** trade-ins. 39-15-105(a)(ix)(A) excludes "the trade-in value of tangible personal property ... from the sales price of new tangible personal property when trade-in and purchase occur in one (1) transaction," to avoid taxing the same property twice; the text does not limit it to dealer sales. A 2024 DOR presentation to the legislature says this exemption applies "primarily [to] motor vehicles where sales tax is charged by our County Treasurers." The page says private sales get no trade-in deduction and cites 39-15-101; no definition there limits it to dealers (**unsourced** claim). The estimate and copy are unchanged pending the ruling (compare the North Dakota ruling of 2026-11-22).

## Title and lien (W.S. 31-3-102; county clerk)

- Title $15 (31-3-102(a)(vii)). Titles and liens are processed by the county clerk in the county of residence (WYDOT). Laramie County Clerk fee table: title $15, VIN inspection $10, new lien $20. Config $15 and $20 confirmed.
- VIN inspection $10 for a vehicle from out of state (31-3-102(b); Laramie County Clerk); disclosed for new residents.

## Fuel fees (W.S. 31-3-102(a)(xxiii), (xxiv); 39-17-301; 2026 HB 145)

- Annual decal: $100 for an all-electric vehicle and $50 for a plug-in hybrid, effective July 1, 2026 (2026 HB 145, enrolled act 33). Confirmed.
- **Motorcycles excluded by statute:** "All-electric vehicle" (39-17-301(a)(l)) and "Plug-in hybrid electric vehicle" (39-17-301(a)(xxxviii)) both exclude "a motorcycle as defined in W.S. 31-1-101(a)(xv)(E)." The `excluded` outcome stands; the copy now gives the citation.
- HB 145 also adds a per-kilowatt-hour license tax on electricity at charging stations; not a registration fee, not in the estimate.

## Deadlines and residency (W.S. 31-2-201)

- Private transfer: register within 45 days; the buyer may drive during those 45 days with a properly executed title (31-2-201(a)(ii)(D)). Dealer sales with temporary permits: 60 days.
- New residents: register "upon becoming a resident" (31-2-201(a)(iii)); a nonresident working in Wyoming registers immediately (a)(iv) or may buy a temporary worker registration permit at $50 a month for up to 180 days (31-2-201(j)).

## Unsourced (flagged, not replaced)

- The trade-in claim above (dealer-only, citing 39-15-101).

## `lastVerified`

- Held at September 2026 in 8fcbd5a while the private trade-in, the motorcycle county fee, and the family-transfer registration fee were open; moved to November 2026 once the rulings below were applied (2026-11-22).

## Sources

- DOR and WYDOT homepages (homepage-only flags) replaced with the DOR Excise Tax Division rate chart page, the WYDOT titles and registration page, the Laramie County Treasurer and Clerk pages, Wyoming Statutes Titles 31 and 39, 2026 HB 145, and 2026 SF 79. The wyoleg.gov label rule now reads Senate files ("2026 Wyo. SF 79").

## Search summaries used (not primary)

- The DOR presentation, the gift and county-of-residence rules, and the other-state credit were found by search and then read in the presentation PDF, W.S. 39-15-105 and 39-15-107, and 2026 SF 79 (primary).

## Rulings applied (Cliff, 2026-11-22)

1. **Private trade-ins:** deductible. 39-15-105(a)(ix)(A) excludes the trade-in value whenever the trade and the purchase happen in one transaction, with no limit to dealer sales, and nothing in 39-15-101 adds one. `tradeInDeductible` set to true with a `tradeInNote` citing (a)(ix)(A) (the form now shows "Wyoming: Deductible" and the note); the dealer-only note, disclaimer, and FAQ were replaced, and the private-sale guide's tax step and calculator note say the trade-in comes off the price. $15,000 less a $5,000 trade-in now shows $400 in state tax instead of $600.
2. **County fee on motorcycles:** the 31-3-101(a)(i) county registration fee now applies to motorcycles too, from the same MSRP input (or the $30,000 default). New `listPriceAnnualTax.appliesToMotorcycles` flag (Wyoming only); the engine and the form honor it, so the MSRP input appears for a Wyoming motorcycle. The copy that said motorcycles are shown without the fee (notes, disclaimer, FAQ, guide FAQ) now says the estimate includes it for cars and motorcycles. A 2021 motorcycle at the $30,000 default now shows $25 + $135 = $160.
3. **Family re-registration:** no change. The $4 re-registration for a transfer to a spouse, child, brother, sister, or parent (31-3-102(a)(xii); 31-2-214(b)) stays explained in the gift guide and out of the estimate, which shows a full year of registration.
4. Wyoming moved to November 2026.
