# Notes facts moved to the page, research notes, 2026-11-07

Cliff's ruling on `notes-field-audit-2026-11-07.md`: verify and add the New Hampshire and North Dakota plug-in hybrid fees, move Indiana's caveat, move the 22 useful facts to disclaimers, resolve Kansas first, repoint tests to rendered text, and leave the 16 research-only facts in notes. `lastVerified` is unchanged for every state, because only these facts were checked.

## Verified

| Fact | Result | Source |
|---|---|---|
| New Hampshire plug-in hybrid fee | $50, confirmed | [RSA 261:141-c](https://gc.nh.gov/rsa/html/XXI/261/261-141-c.htm) |
| North Dakota plug-in hybrid fee | $50, confirmed; the EV fee is $120 | [N.D.C.C. 39-04-19.2](https://ndlegis.gov/cencode/t39c04.pdf), [NDDOT 2026 passenger fee schedule](https://www.dot.nd.gov/sites/www/files/documents/Motor%20Vehicle%20Services/mvd-2-passenger-fee-2026.pdf) |
| Kansas sold-vehicle window | 120 days before or after the sale. No 180-day rule found. The statute is K.S.A. 79-3697, not 79-3602, for sales on or after January 1, 2025, and the replacement must be of greater value. | [K.S.A. 79-3697](https://ksrevisor.gov/statutes/chapters/ch79/079_036_0097.html), [KDOR FAQ](https://www.ksrevenue.gov/faqs-taxsales.html) |
| DC 5% baseline | 3,499 lbs or less at 21 to 25 city MPG, confirmed | [DC DMV](https://dmv.dc.gov/book/dmv-fees/vehicle-title-and-excise-tax-fees) |
| New Hampshire $48 | 3,001 to 5,000 lbs, confirmed; also $42 and $66 | [RSA 261:141](https://gc.nh.gov/rsa/html/XXI/261/261-141.htm) |
| New Mexico basis | Weight and model year, confirmed. The $27 to $62 range on that page may predate the July 1 change on the December list. | [MVD](https://www.mvd.newmexico.gov/what-is-the-fee-for-registering-my-vehicle/) |
| Alaska "under 4,000 lbs" | **Not supported.** The chart lists passenger vehicles at $100 biennial with no weight limit. Removed from the note, not moved. | [Alaska DMV 2026 chart](https://dmv.alaska.gov/media/lknb3cwi/2026-mvrt-by-location.pdf) |

The other moved facts were not re-read for this branch. They come from October and November re-checks or the November six-state build.

## Differences from the ruling

- **21 of the 22 facts moved.** Alaska's did not check out.
- **South Carolina's exclusion for heirs is a 42nd fact.** The audit counted the family exclusion as rendered because its pattern matched "spouse", but heirs appeared only in the note. A repointed copy test caught it, and it is now in the FAQ. This came from the October re-check and was not re-read today.
- **Colorado's $19.30 is shown, though its fee breakdown stays in notes.** The ruling leaves that breakdown as research and also has the staleness check look at rendered text. Showing only that surcharge with its September 1, 2027 change satisfies both.

## Tests

- `tests/datedFigures.test.ts` now looks in the local tax note, trade-in note, disclaimers, and FAQs. All entries pass there.
- Six copy helpers and checks no longer include notes. Five expected strings relied on note wording and now use the rendered wording.
- Em dash checks that scan notes are unchanged, because they look for an absence and match nothing.
- `tests/notesFactsMoved.test.tsx` renders the real page component for each moved fact.

## Found, not changed

- **New Hampshire EV fee from January 1, 2027.** [RSA 261:141-c as amended](https://gc.nh.gov/rsa/html/XXI/261/261-141-c.htm) (2026, 235:1) sets the battery electric fee by weight: $0, $50, $100, or $150. $100 stays right for 3,001 to 8,000 lbs, and the plug-in hybrid fee stays $50. Not on the December list yet.
- **North Dakota electric motorcycles** pay a $20 road use fee (N.D.C.C. 39-04-19.2), which is not modeled.
- **Kansas** still calls this a trade-in deduction in the FAQ question and the form. The statute covers selling instead of trading in.
- **Iowa, Nebraska, and others:** the audit's search patterns can miss part of a compound fact, as South Carolina showed, so a few more may exist.
