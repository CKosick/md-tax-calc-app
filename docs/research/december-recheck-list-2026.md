# December 2026 re-check list

Noted, not started. Do these in December, so the figures are current before the staleness test (`src/config/datedFigures.json`) fails CI on January 1, 2027. Some states may not publish 2027 figures until close to that date.

## Due January 1, 2027 (the staleness test fails CI from this date)

| State | Figure on the site | What to re-check | Also check |
|---|---|---|---|
| Washington | Local sales tax range 1.1% to 4.2% | DOR rate chart for January to March 2027 | Washington guides |
| Missouri | Local sales tax range 1.0% to 7.263% | DOR motor vehicle chart for January to March 2027 | Missouri guides |
| Tennessee | $200 all-electric vehicle fee | Fee for registrations from January 1, 2027 ($274 per the current entry) | Tennessee guides |
| Colorado | Local sales tax range 0% to 8.3% | Next DR 1002 edition, January 1, 2027 | `localTaxMaxRate` and the Colorado private-sale guide |
| Kentucky | $9 title fee and $3 registration add-on | Set in statute until January 1, 2027, by regulation after (KRS 186A.130, 186.040) | `titleFee`, the $20.50 registration, and Kentucky guides |
| Kentucky | $120 electric vehicle ownership fee | Whether the Department of Revenue has published an adjusted amount (KRS 138.475) | `evSurchargeAnnual` and `phevSurchargeAnnual` |

## Added by ruling (no staleness test entry)

| State | Figure on the site | What to re-check | Why |
|---|---|---|---|
| New Mexico | $34 passenger registration ($15 motorcycle), verified September 2026 | Current passenger fee schedule on the MVD site | A [June 29, 2026 state press release](https://biz.nm.gov/newsroom/press-release-vehicle-registration-fees-weight-distance-tax-to-increas-100004574) says passenger fees rise about 25% on July 1, 2026. This came from a search summary; the release has not been opened. New Mexico's fees depend on weight and model year, so also check how $34 maps to the default car. |
| Idaho | $45 passenger registration, verified September 2026 | Read the [final text of H0533](https://legislature.idaho.gov/sessioninfo/2026/legislation/H0533/) (Session Law Chapter 9, effective July 1, 2026) and confirm the $69, $57, and $45 age tiers in Idaho Code 49-402 did not change | Signed March 2, 2026. Its title is about eliminating registration stickers, and a search summary showed the same fee amounts, but the bill text has not been read in full. An earlier search summary said it restructured the tiers. |

## When re-checking

- Update the `datedFigures.json` entry with the next `staleOn` date.
- Bump `lastVerified` only where a re-check completes.
- Regenerate the link report if sources change (`node scripts/source-link-report.mjs`).
- Put buyer-facing text in the local tax note, disclaimers, or FAQs. The page does not display `notes`.
