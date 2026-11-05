# Batch 7 research notes (GA, NC, NJ), 2026-10-28

Working notes from the official-source re-check. Nothing is built yet. Not for commit as is.

## Georgia (DOR)
- TAVT is 7.0% of fair market value. New residents pay 3%. A family transfer pays 0.5% if the previous owner paid TAVT (Form MV-16, notarized; spouse, parent, child, stepchild, sibling, grandparent, grandchild). https://dor.georgia.gov/motor-vehicles/vehicle-taxes-title-ad-valorem-tax-tavt-and-annual-ad-valorem-tax
- A private sale is taxed on the assessment-manual value, not the price, and gets no trade-in reduction (the TAVT FAQ). The current "or purchase price if higher" text has no DOR support, so remove it. https://dor.georgia.gov/title-ad-valorem-tax-tavt-faq
- The title is $18, and a lien is included (no separate fee). The plate is $20. The DOR schedule shows a $20 motorcycle plate (CY). https://dor.georgia.gov/motor-vehicles-fees-fines-and-penalties and https://dor.georgia.gov/document/instructions/schedule-motor-vehicle-license-plates-and-fees/download
- The non-commercial alternative-fuel fee is $238.59 for July 2026 to June 2027. It covers all-electric vehicles, and plug-in hybrids only if they elect the alternative-fuel plate. https://dor.georgia.gov/alternative-fuel-and-low-speed-vehicles-annual-licensing-fees-july-2026
- Deadline conflict: the casual-sale page says to title and register within 7 days, but the fees page has a $10 penalty after 30 days and a TAVT late penalty after day 30. State both. https://dor.georgia.gov/motor-vehicles/title-motor-vehicles/title-and-register-vehicle-purchased-casual-sale
- What to bring for a private sale: a Georgia license or ID, the assigned title with liens released, Form MV-1, insurance (filed electronically or a binder), an emissions certificate if one applies, and $20 + $18 + TAVT.
- New residents have 30 days and need a Georgia license first. Emissions inspections are required in Cherokee, Clayton, Cobb, Coweta, DeKalb, Douglas, Fayette, Forsyth, Fulton, Gwinnett, Henry, Paulding and Rockdale counties. Georgia insurance is required. https://dor.georgia.gov/motor-vehicles/vehicle-registration-license-plates/new-georgia
- Dead source to replace: dor.georgia.gov/motor-vehicles/vehicle-registration-and-licensing.

## North Carolina (NCDMV, G.S.)
- Fees: title $66.75 (we show $56), passenger registration $46.25 ($38.75), motorcycle $29.50 ($24), EV $214.50 ($140), plug-in hybrid $107.25 (new). https://www.ncdot.gov/dmv/title-registration/vehicle/Pages/fees.aspx
- Some counties add registration taxes: Wake, Durham and Orange $7 county + $10 regional; Randolph $1 + $1.
- The highway use tax is 3%. Its $2,000 cap applies only to commercial vehicles over 26,000 lb, so remove maxExciseTax. The $250 cap is for a vehicle titled in the owner's name in another state for at least 90 days. https://www.ncdot.gov/dmv/title-registration/taxes/Pages/default.aspx (the old highway-use-tax.aspx redirects to the homepage, so it's dead)
- G.S. 105-187.3(b): a non-retailer sale is taxed on market value (the Commissioner's schedule, at or below wholesale) minus any trade-in the seller allows. So taxBase is fairMarketValue, trade-in stays deductible, and the existing NC FAQs that describe tax on the "purchase price" need correcting.
- G.S. 20-85: the title is $66.75. A supplementary lien is $25. The current $21.50 lien fee has no source; set it to 0 and add a note.
- A gift between spouses, parent and child, or stepparent and stepchild is exempt with MVR-613, but only NC resident to NC resident on an NC title (G.S. 105-187.6(a)(5)).
- Documents: the title, notarized if it's an NC title; MVR-1, notarized; MVR-180 if the vehicle is under 10 years old; MVR-181; a lien release. NC insurance is required, and out-of-state policies are not accepted. The late penalty is $20 after 28 days. Property tax can be paid at registration or deferred for 60 days. https://www.ncdot.gov/dmv/title-registration/vehicle/Pages/default.aspx and .../documents-forms.aspx
- New residents have 60 days to get a license, title and register. The license comes first. The first registration needs no inspection, but renewal does. https://www.ncdot.gov/dmv/help/moving/Pages/new-residents.aspx

## New Jersey (MVC, Division of Taxation)
- Sales tax is 6.625% of the purchase price (casual sales). A swap is taxed at fair market value. There is no private trade-in credit. The Casual Sales Unit may use NADA values. https://www.nj.gov/treasury/taxation/moveqa.shtml
- The ZEV sales tax exemption ended in July 2025, so EVs pay the full rate.
- Title: $60, $85 with one lien, $110 with two. The transfer must happen in person within 10 working days ($25 penalty). The seller keeps the plates. https://www.nj.gov/mvc/vehicles/transowner.htm
- Registration: under 3,500 lb $46.50 (older than 2 years) or $59 (within 2 years); over 3,500 lb $71.50 or $84; motorcycle $65. Set passengerWeightSplitLbs to 3500. A new rule is needed for the +$12.50 on model years within 2. https://www.nj.gov/mvc/vehicles/regfees.htm
- ZEV fee: $250 from July 2024, rising $10 a year to $290 in July 2028. That makes July 2026 $270 (by arithmetic from the MVC text; the MVC doesn't list the 2026 figure).
- Exemptions: a gift is exempt if the price line on the title says "GIFT"; inheritance; a vehicle bought, titled and registered in another state while the buyer was a non-resident. https://www.nj.gov/mvc/vehicletopics/taxexempt.htm
- Registration documents: the title, ID, NJ insurance, BA-49, and an appointment. https://www.nj.gov/mvc/vehicles/reginitial.htm
- Still unverified: the new-resident deadline (60 days?) and inspection timing. Next page to read: https://www.nj.gov/mvc/drivertopics/movetonj.htm
- Dead source to replace: nj.gov/treasury/taxation/sales_use_tax.shtml.

## Remaining work
1. NJ new-resident page.
2. Data commit: stateRules GA/NC/NJ, the NJ age rule, sourceLinkStatus repaired entries, tests (gaNcNjRecheck), and regenerate the link report.
3. Guides commit: nine guides in guides.ts, guide and metadata test counts (57 guides).
4. Full checks, browser check, push, hold the merge.
