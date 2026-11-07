# Notes field audit, 2026-11-07 (report only, for Cliff's ruling)

No page reads `rule.notes` in `src/config/stateRules.json`. Visitors see the local tax note, disclaimers, FAQs, and form text, but never the notes. This report lists the facts that exist only in notes. Nothing was changed.

## Result

- 214 notes across 51 jurisdictions were read.
- 129 distinct facts that looked at risk were tested against that state's page.
- 88 of them also appear on the page, usually in an FAQ or form text.
- **41 appear only in notes**: 2 show a calculator gap, 1 is a caveat buyers need, 22 are worth a ruling on moving, and 16 can stay out of sight.

## Method and limits

- Each page came from a production build of main at 22da661. Scripts, the state selector, and the footer were stripped, so only visible state text was searched. FAQ answers count as visible, even when collapsed.
- I chose the facts by reading each note, and tested each with a pattern for that fact, so a different judgment could add or drop a few.
- A match shows the words are on the page, not that they mean the same thing in every case. I read the surrounding text on the first pass and re-tested the false matches I found (Hawaii's $50, New Hampshire's $5,000).
- The Guide column shows whether the state's guides carry the fact. 31 states have guides, so a guide does not help a buyer in the other 20.
- These facts were not re-verified against official sources unless stated. Many notes date from September 2026.

## 1. Calculator gap (recommend: verify, then add to the estimate)

| State | Note says | Page says | Evidence |
|---|---|---|---|
| New Hampshire | Plug-in hybrids pay $50 a year | Form: "Plug-in Hybrid $0 state fee" | [Manchester tax office and RSA 261:141-c](https://gc.nh.gov/rsa/html/XXI/261/261-141-c.htm), via search summary. 2026 bills HB1594 and HB1682 are unchecked. |
| North Dakota | Plug-in hybrids pay $50 a year | Form: "Plug-in Hybrid $0 state fee" | NDDOT schedule and legislative tables, via search summaries; no official page opened. |

Both states configure `evSurchargeAnnual` but not `phevSurchargeAnnual`, so the estimate is $50 low and the form states $0 as fact.

## 2. Caveat buyers need (recommend: move to a disclaimer)

| State | Fact | Guide | Note |
|---|---|---|---|
| Indiana | Registering partway through the registration year, or a credit for excise paid on a vehicle you sold, can change the excise tax (IC 6-6-5-7.2) | No | **I told Cliff the copy said this. It is only in the note, so buyers do not see it.** The estimate shows a full year. The current statute text is still unread, so the wording should stay general. |

## 3. Worth a ruling on moving (recommend: move to disclaimers)

| State | Fact | Guide | Why it matters |
|---|---|---|---|
| Alabama | Licensing officials may add small commissions and local fees | Yes | The buyer pays more than shown |
| Alaska | The $100 biennial fee is for vehicles under 4,000 lbs | No | Heavier vehicles pay differently |
| California | District taxes add up to 4.50% | No | Explains the range |
| Colorado | Registration assumes 2,001 to 5,000 lbs, with the base fee at 3,500 lbs | No | Assumption behind the total |
| Colorado | Electric road usage fee of $26 ($13 plug-in hybrid), through June 30, 2027 | No | In the EV total, but never explained |
| District of Columbia | The 5% baseline models a car of 3,499 lbs or less with 21 to 25 city MPG | No | The rate runs from 1% to 11%, so the assumption matters |
| Florida | A paper title is $77.75, not $75.25 | No | The buyer may pay more |
| Georgia | Plug-in hybrids pay the $238.59 fee only with the alternative fuel plate | No | The form shows $0 without saying why |
| Maine | Excise schedule 24, 17.5, 13.5, 10, 6.5, 4 mills, and the $5 minimum | No | Added in the six-state branch; the FAQ gives only the ends of the range |
| Massachusetts | Excise value shares of 90%, 60%, 40%, 25%, 10%, and the $5 minimum | No | Copy-only tax, so this is the only way to figure it |
| Massachusetts | A motorcycle is $20 a year, shown as $40 for the two-year view | No | Explains the $40 on the page |
| Nebraska | Tax ends after the 13th year; base $25 to $1,900; fee $5, $20, or $30 | No | Added in the six-state branch |
| Nevada | GST age schedule and the $16 minimum | No | Added in the six-state branch |
| New Hampshire | Permit fee has a $5 minimum | No | Added in the six-state branch |
| New Hampshire | $48 is for 3,001 to 5,000 lb vehicles | No | Other weights pay differently |
| New Mexico | $34 depends on weight and age | No | The page says "approximately" without saying why. On the December list |
| Oregon | New plates are $26 | Yes | Added cost for buyers without Oregon plates |
| South Carolina | Registration is $36 at age 65 or with a disability | No | A saving the buyer could miss |
| Virginia | A 2-year registration is $2 off in person or by mail, $3 online | No | Explains the 2-year figure |
| Washington | Other hybrids pay $75 | No | The form has only a plug-in hybrid option |
| Indiana | A motorcycle is $26.35 plus the $15 fee | No | Breakdown of a shown total |
| Kansas | The sold-vehicle window is given as "120/180 days"; the FAQ says 120 | No | **Possible conflict; check K.S.A. 79-3602 before moving** |

## 4. Can stay out of sight (recommend: leave as research)

| State | Fact | Guide |
|---|---|---|
| Alabama | Alabama does not require emissions testing | No |
| Alaska | $100 biennial is $50 a year | No |
| Colorado | Fee breakdown: $19.30 road safety, $18 bridge, age fee of $12, $10, or $7 | No |
| Georgia | The $238.59 fee applies July 2026 to June 2027 | No |
| Iowa | $14 of the fee is the assumed weight part (the disclaimer gives the 3,500 lbs) | No |
| Missouri | A motorcycle is $8.75 plus $9 | No |
| Missouri | Decal schedule: $75 and $37.50 in 2021, up 20% a year | No |
| Montana | Title breakdown: $10 plus $2 | No |
| Tennessee | Title breakdown: $5.50 state and $8.50 county clerk | Yes |
| Washington | Tab breakdown: $30, $35, $6, $11, $0.75 | No |
| Washington | EV fee breakdown: $100, $50, and $75 | No |
| Washington | Luxury tax period, July 1, 2026 to June 30, 2027 | Yes |
| Hawaii, Maine, Montana, New Hampshire | Statute citations only: HRS Chapter 237, 36 M.R.S. 1811, MCA 61-3-203, RSA 261:141 (4 facts) | No |

The last row is four facts, so this section has 16.

## 5. What depends on notes today

- **Staleness test.** `tests/datedFigures.test.ts` searches the whole state config. Two Colorado entries match only in notes: "$26 ($13 for plug-in hybrids)" and "$19.30". Deleting notes would fail CI until those change.
- **Copy tests.** 9 test files include `rule.notes` when checking copy, so a passing test there does not prove a buyer can read the text. Only the six-state tests check the rendered page, though they still read notes in one check.
- **Stale wording.** Some notes are not written for buyers, such as Idaho's "For our 2019 test vehicle".

## Recommendation for the ruling

1. **Do not render notes as a block.** Most repeat what the page already says, and some are internal wording.
2. **Section 1:** verify New Hampshire and North Dakota, then add `phevSurchargeAnnual`.
3. **Section 2 and section 3:** move these into disclaimers, state by state. Check Kansas first.
4. **Section 4:** leave as is.
5. **Keep the field for now** as research. If you want it removed later, first move the two Colorado dated figures out of notes and change those test files to check rendered text.
6. **Going forward:** buyer-facing facts go in the local tax note, disclaimers, or FAQs.
