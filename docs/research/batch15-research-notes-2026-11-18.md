# Batch 15 research notes (NH, ME, RI), 2026-11-18

Working notes from the official-source re-check for guide batch 15. Items marked **For ruling** were not changed. Items marked **not primary** rest on a search summary.

## New Hampshire (RSA 261, NH DMV)

- No state sales tax on vehicles. Registration is two-part: the town or city clerk first (municipal permit fee), then the state (DMV page "Vehicle Registrations").
- Municipal permit fee (RSA 261:153): 18, 15, 12, 9, 6, then 3 mills on the maker's list price for the current, first through fourth preceding, and fifth preceding and older model years; $5 minimum; list price rounded to the nearest $100 and **the fee rounded to the nearest dollar** (261:153, II). Modeled schedule matches; `roundToDollar` added (the list price rounding to $100 is not modeled; the default $30,000 is unaffected). Proration for birth-month alignment (261:153, III) not modeled.
- State registration (RSA 261:141, III(g)): 0 to 3,000 lbs $42; 3,001 to 5,000 lbs $48; 5,001 to 8,000 lbs $66. Motorcycle $30 (261:141, III(o)). **Config motorcycle $24 -> $30.**
- Plates: "there is an $8.00 plate fee for the first time you order plates" (DMV page). **Added to the car registration ($48 -> $56)** under the precedent of the Idaho and Nebraska rulings that include a new plate fee; the DMV page does not give a motorcycle plate amount (search summary: $4 per plate by statute, not read), so the motorcycle stays $30.
- Title $35 from January 1, 2026 (RSA 261:20, I(a) and (b)); notice of security interest $20 (261:20, I(e)), not in config (`lienFilingFee` 0). **For ruling (small):** the $20 security interest filing fee. **For ruling:** vehicles of model year 1999 or older are not titled in New Hampshire (DMV "Exempt Vehicles", RSA 261:3); the calculator charges the $35 title at every age.
- EV fees (RSA 261:141-c): battery electric $100 and plug-in hybrid $50 until January 1, 2027; from then a GVWR schedule ($0 to 1,000 lbs, $50 to 3,000, $100 to 8,000, $150 over) and plug-in hybrids $50. **Written inquiry:** the 2027 schedule sets battery electric fees down to 1 lb GVWR, a band electric motorcycles fall into; that bears on the November 8 question (whether motorcycles pay), so it is flagged here and not folded in. Config and the motorcycle "silent" outcome unchanged.
- Deadlines: a private buyer can get a $20, 20-day temporary plate (RSA 261:57, DMV "Temporary Plates"); no separate day count for a private buyer found. New residents register within 60 days of establishing residency (RSA 261:45) and get a license within 60 days.
- Inspections: the state inspection program has been suspended since February 13, 2026 after a court order and contract lapse (DMV "Inspections & Emissions"); drivers remain responsible for a safe vehicle.
- No sales tax on gifts, family transfers, or vehicles brought in; title and registration fees and the town permit fee apply.
- Sources: nh.gov DMV homepage replaced with the DMV registration, temporary plate, new resident, and exempt vehicle pages and RSA 261:20, 261:141, and 261:45; RSA links get "RSA 261:153" style labels.

## Maine (36 M.R.S., 29-A M.R.S., BMV, MRS)

- Excise tax (36 M.R.S. 1482(1)(C)): 24, 17½, 13½, 10, 6½, then 4 mills on the maker's list price for the first through sixth and later model years; $5 minimum. Modeled schedule matches. Applies to motorcycles too (shown without it, disclosed).
- Sales or use tax 5.5% on a private sale, paid at registration (BMV "Register a Passenger Vehicle"; 36 M.R.S. 1764 use tax on casual sales of motor vehicles). Trade-in credit for a motor vehicle traded toward another (36 M.R.S. 1765); the section excludes only dealer-to-dealer inventory exchanges, so it reaches private sales. Config unchanged.
- Gifts (MRS Bulletin 42, **not primary**: the PDF returned 403 and opened as a download; quoted via search summary): a true gift with nothing paid is not taxable; a transfer between family members or spouses for consideration is taxable; taking over the loan balance is consideration.
- Title $33, for vehicle models 25 years old and newer (BMV). **For ruling:** the calculator charges $33 at every age. Registration $35 for an automobile or pickup to 6,000 lbs (29-A 501(1)); motorcycle $21 (29-A 515; BMV fee page). Confirmed.
- New residents: 30 days after establishing residency to convert registration and title; a Maine use tax form with the out-of-state registration proves the sales tax exemption (BMV). MRS guidance via search summary (**not primary**): an automobile bought and used outside Maine by a bona fide resident of that state is exempt.
- No private-buyer day count found; register before driving.
- No state EV registration fee found; config $0 unchanged.
- Sources: Maine Revenue and BMV homepages replaced with the BMV registration and fee pages and 36 M.R.S. 1764 and 1765 and 29-A M.R.S. 501 and 515.

## Rhode Island (RI DMV, Division of Taxation)

- Sales tax 7%. Private party (DMV "Sales Tax"): vehicles 7 years old or less, 7% of "NADA Clean Retail book value or sale price, whichever is greater"; 8 to 29 years old, 7% of the sale price unless on the Cars of Particular Interest list; CPI and 30 years and older, the greater of NADA Clean Retail or CPI book value or price. NADA wording kept, per the DMV's own page. The calculator uses the price entered; the copy discloses the book value rule.
- Trade-ins: the DMV lists the trade-in allowance only for dealer sales ("7% of the purchase price, minus trade-in"); private party has none. Config unchanged.
- Gifts: immediate family (parent, step-parent, sibling, step-sibling, spouse, child, step-child) with a signed gift letter; anyone else with a notarized gift letter and the Affidavit of Gift (SU 87-65). No sales tax either way unless outstanding taxes are due.
- Due date: sales tax by the 20th of the month after the sale, even if the vehicle is not registered, or interest and penalties (DMV "Sales Tax"). Division of Taxation: 30 days from payment to request redetermination of the value (Form C-REF-SU).
- Title $53.50 including the $3.50 technology surcharge (DMV fee table). **Config $52.50 -> $53.50.** Security lien statement $53.50. **Config lien $0 -> $53.50.**
- Registration (DMV fee table and weight table): passenger to 4,000 lbs $30 a year, plus $3.50 and the $20 a year DOT surcharge; two years = $60 + $3.50 + $40 = $103.50. **Config $60 -> $103.50.** Motorcycle renewal (2 years) $47.50 (fee table). **Config $32.50 -> $47.50.**
- EV fees (DMV weight table; § 39-18.1-4; Public Law 2025, ch. 278, per search summary): battery electric $200 a year, plug-in hybrid $100, hybrid (including mild hybrid) $50, from January 1, 2026. **Config had none; now +$200 and +$100 a year ($400 and $200 over the two-year term).** The non-plug-in hybrid $50 is disclosed (no form choice). Motorcycles: the table covers passenger and commercial vehicles only; set to "silent" (not added).
- New residents: title and register within 30 days of moving; inspection within 5 days of registering; VIN check for an out-of-state title; sales tax exemption certificate (T-333-1) and affidavit (SU-NR-1).
- Title required for model year 2001 and newer; older vehicles from a non-title state register with proof of ownership.
- Sources: DMV and Taxation homepages replaced with the DMV sales tax, new registration, fee, weight table, and new resident pages and the Division of Taxation casual sales summary.

## `lastVerified`

- Rhode Island: November 2026 (every figure checked; no open finding).
- New Hampshire and Maine: held at September 2026 in 41e5a0d while the age-based title exemptions (and New Hampshire's $20 security interest fee) waited on a ruling; moved to November 2026 once the rulings were applied (2026-11-19).

## Rulings applied (Cliff, 2026-11-19)

1. **New Hampshire, title exemption:** no $35 title fee for vehicles of model year 1999 or older (RSA 261:3), via a new `titleExempt.throughModelYear` field (1999); the breakdown line says no title is issued for that model year. Copy, FAQ, disclaimer, and the private-sale guide's calculator note match.
2. **New Hampshire, lien fee:** $20 security interest filing fee for financed purchases (RSA 261:20, I(e)), replacing $0.
3. **Maine, title age cutoff:** $33 title fee only for vehicles 25 model years old or newer, counting the current model year as year 1 (`titleExempt.fromRegistrationYear` 26); older vehicles pay none. Copy, FAQ, disclaimer, and the guide's calculator note match.
