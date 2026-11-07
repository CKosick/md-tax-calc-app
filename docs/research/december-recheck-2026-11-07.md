# December re-check, research notes, 2026-11-07

This pass ran on November 7, 2026, about seven weeks before the January 1 changes. Several 2027 figures are not published yet. They are listed as open with what was found, and nothing was estimated. `lastVerified` is unchanged for every state, because each re-check covered only the listed figure.

## Results

| Item | Result | Source |
|---|---|---|
| Washington local range | **Not published.** The January 1, 2027 section has change notices only, with no county rate list or sortable rate file. Range and date unchanged. | [DOR local sales and use tax](https://dor.wa.gov/taxes-rates/sales-use-tax-rates/local-sales-use-tax) |
| Missouri local range | **Not published.** The posted chart, updated August 25, 2026, covers October to December 2026. Range and date unchanged. | [DOR motor vehicle chart](https://dor.mo.gov/forms/MV%20-%20Local%20Sales%20Tax.pdf) |
| Colorado local range | **Not published.** DR 1002 is updated January 1 and July 1. No January 2027 edition or rate change list was found. Range and date unchanged. | [DR 1002](https://tax.colorado.gov/DR1002), [rate changes](https://tax.colorado.gov/sales-tax-rate-changes) |
| Tennessee EV fee | **$274 confirmed** for January 1 to December 31, 2027. From January 1, 2028, this fee and the $100 hybrid fee adjust each year for inflation. Built in a separate commit that must not go live before January 1. | [VR-5](https://revenue.support.tn.gov/hc/en-us/articles/360060541291-VR-5-Registration-Fees-for-Hybrid-or-Electric-Vehicles) |
| Kentucky $9 title fee and $3 add-on | **Replacement not found.** From January 1, 2027, the statutes point to fees the Transportation Cabinet sets by regulation under KRS 186.017, and they give only the split of each fee. No regulation setting them was found. Amounts unchanged. | [KRS 186A.130 from January 1, 2027](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=58266), [KRS 186.017](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=57801), [2026 Ky. Acts ch. 135](https://apps.legislature.ky.gov/law/acts/26RS/documents/0135.pdf), [601 KAR Chapter 9 list](https://apps.legislature.ky.gov/law/kar/titles/601/009/) |
| Kentucky EV ownership fee | **Not published.** Not on your item list, but on the December list. No adjusted amount was found. A search result for 2024's HB 122 says the department tells county clerks the next year's amount at least 20 days before January 1, so about December 12; that timing was not read in the current statute. $120 base unchanged. | [KRS 138.475](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=55787) |
| New Hampshire EV fee | Classes explained on the page. Estimate stays at $100. See below. | [RSA 261:141-c](https://gc.nh.gov/rsa/html/XXI/261/261-141-c.htm) |
| New Mexico registration | **The change happened.** SB 2 was signed February 5, 2026 (chapter 4), and sections 1, 2, and 5 took effect July 1, 2026. Updated. | [SB 2 final text](https://www.nmlegis.gov/Sessions/26%20Regular/final/SB0002.pdf), [bill status](https://www.nmlegis.gov/Legislation/Legislation?Chamber=S&LegType=B&LegNo=2&year=26), [state press release](https://biz.nm.gov/newsroom/press-release-vehicle-registration-fees-weight-distance-tax-to-increas-100004574) |
| Idaho H0533 | **No registration fee changed.** The bill removes registration stickers. Passenger fees stay $69, $57, and $45, and motorcycles stay $19. The whole bill was read. No change to the site. | [H0533](https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0533.pdf), [statement of purpose](https://legislature.idaho.gov/wp-content/uploads/sessioninfo/2026/legislation/H0533SOP.pdf) |
| Kansas wording | Form, FAQ, and credit notice now name a vehicle sold instead of traded in. | [K.S.A. 79-3697](https://ksrevisor.gov/statutes/chapters/ch79/079_036_0097.html) |
| North Dakota electric motorcycle | $20 fee confirmed and disclosed, not charged. | [N.D.C.C. 39-04-19.2](https://ndlegis.gov/cencode/t39c04.pdf) |

## New Mexico

NMSA 66-6-2 as amended, per twelve-month registration, plus a $1.50 tire recycling fee:

| Factory shipping weight | First five years | After five years |
|---|---|---|
| 2,000 lbs or less | $33.75 | $26.25 |
| 2,001 to 3,000 lbs | $48.75 | $38.75 |
| Over 3,000 lbs | $70.00 | $56.25 |

- The estimate assumes over 3,000 lbs, so it shows $71.50, then $57.75. The default 2019 car moves from $34 to $57.75. The state has no weight question on the form, because the engine's weight classes do not fit three tiers plus age.
- The statute counts five years from first registration. The estimate counts from the model year.
- The motorcycle fee stays $15. The press release says motorcycles are not affected.
- [The MVD fee page](https://www.mvd.newmexico.gov/what-is-the-fee-for-registering-my-vehicle/) still said $27 to $62 on November 7, which does not match the old or new statutory range. The estimate follows the statute. The page's other source, `mvd.newmexico.gov/vehicles/taxes-fees/`, returned 404 to a script and has not been checked in a browser.
- **Not on the December list:** section 3 of the same act adds a yearly fee from January 1, 2027. Electric vehicles pay $70, then $80 in 2028 and $90 from 2029. Plug-in hybrids pay $35, $40, then $45. It is disclosed now and added to the estimate in the January commit.

## New Hampshire

The ruling was to build the fee from the weight class the form already asks for. The New Hampshire form does not ask one, because the state's two passenger entries are both $48, so the weight question stays hidden. The classes used elsewhere split at 3,700 lbs, which would not map to GVWR classes of 1,000, 3,000, and 8,000 lbs in any case.

So the page explains the classes and the estimate stays at $100, which is right for 3,001 to 8,000 lbs. A vehicle in another class sees the wrong dollar amount, with the disclaimer giving the right one. Charging by class needs a new GVWR question, which was left for ruling.

The registry entry was removed because the statute sets no later change.

## North Dakota

Testing the "left uncharged" ruling showed that choosing Motorcycle and Battery EV added the $120 car fee. North Dakota's EV and plug-in hybrid fees now apply to passenger vehicles only, and the form shows "Not in estimate" for a motorcycle.

The same behavior remains in the other states with these fees. Thirty-nine states have them in all, and some charge motorcycles a different amount, so it needs a state-by-state check.

## Kansas

The form's estimate takes any amount entered. The law's conditions, a greater-value purchase and the 120 days, are in the notice under the field. The tax line in the breakdown does not mention the credit, so its wording was not changed.

## Merge order

The commits up to and including this one are correct today. The January commits are not, because they show $274 for Tennessee and add New Mexico's EV fee before either applies.
