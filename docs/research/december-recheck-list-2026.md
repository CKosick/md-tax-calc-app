# December 2026 re-check list

Re-checked November 7, 2026; results in `december-recheck-2026-11-07.md`. The rows below stay open until each state publishes. The staleness test (`src/config/datedFigures.json`) fails CI on January 1, 2027 for any still listed.

## Due January 1, 2027 (the staleness test fails CI from this date)

| State | Figure on the site | What to re-check | Also check |
|---|---|---|---|
| Washington | Local sales tax range 1.1% to 4.2% | DOR rate chart for January to March 2027. On November 7, only change notices were posted, no rate list. | Washington guides |
| Missouri | Local sales tax range 1.0% to 7.263% | DOR motor vehicle chart for January to March 2027. On November 7, the posted chart was still October to December 2026. | Missouri guides |
| Tennessee | $200 all-electric vehicle fee | Confirmed $274 for 2027 on VR-5. Built in the branch's January commit, to go live on or after January 1. | Tennessee guides |
| Colorado | Local sales tax range 0% to 8.3% | Next DR 1002 edition, January 1, 2027. Not posted on November 7. | `localTaxMaxRate` and the Colorado private-sale guide |
| Kentucky | $9 title fee and $3 registration add-on | Find the Transportation Cabinet regulation under KRS 186.017 that sets both. Not found on November 7. The statutes from January 1 give only the split of each fee. | `titleFee`, the $20.50 registration, and Kentucky guides |
| Kentucky | $120 electric vehicle ownership fee | Whether the Department of Revenue has published an adjusted amount (KRS 138.475) | `evSurchargeAnnual` and `phevSurchargeAnnual` |

## Closed November 7, 2026

- **New Mexico:** the July 1 increase happened and is in the estimate. Its new EV and plug-in hybrid fees start January 1, 2027.
- **Idaho:** H0533 changed no registration fee. It removes registration stickers.
- **New Hampshire:** the EV fee classes are explained on the page. The statute sets no later change, so the registry entry is removed.

## When re-checking

- Update the `datedFigures.json` entry with the next `staleOn` date.
- Bump `lastVerified` only where a re-check completes.
- Regenerate the link report if sources change (`node scripts/source-link-report.mjs`).
- Put buyer-facing text in the local tax note, disclaimers, or FAQs. The page does not display `notes`.
