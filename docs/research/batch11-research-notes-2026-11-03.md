# Batch 11 research notes (AL, KY, OR), 2026-11-03 to 2026-11-04

Working notes from the official-source re-check.

## Oregon (ODOT DMV, Oregon DOR)
- No sales tax on private sales. Vehicle use tax 0.5% only on vehicles bought from dealers (new or 7,500 miles or less, never registered in OR). https://www.oregon.gov/dor/programs/businesses/Pages/vehicle-privilege-and-use-taxes.aspx
- Title fee by MPG: 0-19 $101, 20-39 $106, 40+ $116, all-electric $192; motorcycle $101. Late title: $25 (31-60 days), $50 (after 60).
- Registration (2 years) by MPG: 0-19 $126, 20-39 $136, 40+ $216 (not in OReGO), EV $376 (not in OReGO), OReGO $86; motorcycle $88. New plates $26 (two-plated); moving plates $30. County fees: Multnomah $112; Washington or Clackamas $60. Registration due only when no Oregon plates or expired plates. EV changes July 1, 2027 (used EVs $86 + flat or per-mile). https://www.oregon.gov/odot/dmv/pages/fees/vehicle.aspx
- Title within 30 days of sale; VIN inspection $9 for out-of-state titles; DEQ emissions in Portland and Medford areas. https://www.oregon.gov/odot/dmv/pages/vehicle/titlereg.aspx
- New residents: within 30 days get license and title/register. https://www.oregon.gov/odot/dmv/pages/new2or/moving.aspx
- Structural: fees by MPG (not weight); title fee differs for EV; registration not due on transfer if plates current.

## Kentucky (DOR usage tax guide 2025, KRS, DRIVE)
- MVUT 6% of "retail price": total consideration on notarized affidavit (TC 96-182 / 71A100) less seller's trade-in allowance, floor 50% of (trade-in value of purchased vehicle minus trade-in value of traded vehicle); without affidavit, average retail value from the reference manual. Gift (KRS 138.450(17)): taxed at average trade-in value. Exempt: spouse, (step)parent/(step)child, grandparent/grandchild (KRS 138.470(6), Form 71A101, KY residents). New residents: tax due with credit for tax paid to a state with a substantially identical tax (KRS 138.460(6)(a)). https://revenue.ky.gov/ClerkNetwork/Documents/Motor%20Vehicle%20Usage%20Tax%20(2025).pdf , https://revenue.ky.gov/Property/Motor-Vehicles/Pages/Motor-Vehicle-Usage-Tax.aspx
- Title $9 (KRS 186A.130, until Jan 1, 2027; then set by regulation). Lien notation $12 (KRS 64.012(1)(b), eff. July 15, 2026) -- config had $22.
- Registration: $11.50 (KRS 186.050) + $6 clerk + $3 (KRS 186.040, until Jan 1, 2027) = $20.50; motorcycle $9 + $9 = $18. Config had $21/$15.
- EV ownership fee: base $120 (KRS 138.475), adjusted yearly by DOR (2026 amount not published on DRIVE); includes plug-in hybrids; no fee for regular hybrids since 2025. Electric motorcycle $60 base.
- Seller keeps plates (KRS 186.190); transfers within 15 days. In-state title: KY insurance (45 days), KY license/ID or SSN card, notarized signed title. Out-of-state: TC 96-182, sheriff's inspection. https://drive.ky.gov/Vehicles/Pages/Vehicle-Titling.aspx
- New residents: title and register within 10 days of residency; license within 30 days. https://drive.ky.gov/Drivers/Pages/New-To-Kentucky.aspx
- Annual vehicle property tax: assessed on January 1 ownership, paid at renewal, local rates vary -> does not meet the "paid when they register" test for a private purchase; flag.
- Dead link: https://drive.ky.gov/motor-vehicle-licensing/Pages/Vehicle-Taxes.aspx

- New residents, conflict on the same DRIVE page: "title and register your property within 10 days of establishing residency" and "must apply for registration within 15 days" after bringing a vehicle in. Copy states both and says plan on 10.
- Statute ids (apps.legislature.ky.gov statute.aspx?id=): 55787 KRS 138.475, 56142 KRS 186.040 (until 2027-01-01), 58258 KRS 186.040 (from 2027-01-01), 56307 KRS 186.050, 57720 KRS 64.012, 57802 KRS 186A.130 (until 2027-01-01), 58266 KRS 186A.130 (from 2027-01-01), 56144/58262 KRS 186.190.
- KRS 186.050 also adds a $10 wildlife contribution unless the registrant opts out.

## Alabama (ALDOR, Code of Alabama on ALISON), 2026-11-04
- Casual sales tax (private sale): 2% state (Ala. Code 40-23-101(a)) plus county and city rates where the purchaser resides (40-23-101(c)); collected by the county licensing official before the plate. https://www.revenue.alabama.gov/tax-types/casual-sales-tax/ ; ALDOR Automotive Sales/Use/Lease Tax Guide: purchaser pays state and local use tax when registering in county of residence.
- Trade-in: 40-23-103 (casual sales article) taxes the net difference after a vehicle taken in trade. The old config said the opposite while citing the same section. Now tradeInDeductible true.
- Local range: taxrates_current.csv (November 2026), ST/AUTO rows. Minimum 0% (Monroe County 7050 AUTO 0, no unabated levy, outside city limits). Highest combination matched to one place: Shorter (9702) 5% + Macon County (7044) 0.25% = 5.25% (Macon has one county levy; Shorter PJ N). Not settleable from the file: counties split levies into base, CL (corporate limits), PJ (police jurisdiction), UNINC, EXC n CITIES, and UNABATED portions, and the city CountyCode cross-reference lists several associated county codes (for example Hurtsboro lists 7057, 7157, and 7757; Wadley lists a Chambers PJ code). Upper-bound sums: Phenix City in Russell County 6.5% to 7.5%; Wadley up to 10% (cross-reference artifact). Range set to 0% to 5.25% with copy saying a few places may be higher.
- Fees: title $15, notice of security interest $15 (title fee page); designated agent commission $1.50, plate official may add $1.50, local fees possible (FAQ). Passenger plate $23 + $1.25 issuance (FAQ); motorcycle $15; BEV $203, PHEV $103 since July 1, 2023, +$3 every fourth year (Memo 2023-002), so next July 1, 2027.
- Deadline: plate within 20 calendar days; title application before registration; title assignment need not be notarized; seller removes plate; state plate transfer fee $1.25; Alabama liability insurance; no emissions testing. The prerequisites FAQ ties the VIN/ownership inspection to vehicles that get only a registration, so that claim was left out.
- New residents: 30 days from entering the state (Ala. Code 40-12-262, FAQ). Vehicle substantially used in another state (registered or titled there): no sales or use tax (ALDOR notice to licensing officials). Register in county of residence (Rule 810-5-1-.479); military on orders exempt from registration laws.
- Gifts: Rule 810-6-1-.150, a transfer as a gift is not a sale; casual tax is on purchase price. No family exemption beyond that found.
- Ad valorem: property tax collected at registration; follows the vehicle (buyer pays accrued tax). Value from ALDOR schedules and local millage vary, so it fails the "state publishes the table or rate" test; described, not modeled.
- ALISON returns 502 to curl; pages load in a browser.

## Oregon follow-ups, 2026-11-04
- Modeled tier: 20 to 39 MPG ($106 title, $136 registration). EV: evSurchargeAnnual 120 x 2 years = $376 total; EV title $192 not modeled (engine has one title fee). No separate lien fee on the DMV fee page.
