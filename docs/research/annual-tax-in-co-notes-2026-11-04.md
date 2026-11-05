# Annual-tax branch research notes (Indiana excise, Colorado SOT), 2026-11-04

Cliff's ruling: if the buyer pays it when they register and the state publishes the table or rate, it belongs in the estimate, using the list-price input the site already has. Indiana's vehicle excise tax and Colorado's specific ownership tax both pass.

## Indiana vehicle excise tax (BMV)
- Source: https://www.in.gov/bmv/fees-taxes/vehicle-registration-fees-and-taxes/excise-tax-information (Passenger Vehicle Excise Tax Fees table, read 2026-11-04).
- Class by the manufacturer's original retail price, 17 classes ($0 to $1,499 up to $42,500 and over); amount by age 0 to 9+, where age = the calendar year the vehicle is due to be registered minus the model year.
- Range $12 (class 1) to $532 (class 17, age 0). Class 15 ($30,000 to $34,999): 406, 353, 307, 257, 210, 169, 134, 91, 50, 42.
- Proration and credits (IC 6-6-5-7.2): a vehicle acquired after the owner's annual registration date pays a reduced amount, and the seller's credit for a vehicle sold applies to their next vehicle. The current IC text on iga.in.gov did not render as text in the browser; older code versions (Justia/FindLaw search results) describe monthly proration. Not modeled: the estimate shows a full year and the copy says the amount due can differ.
- County and municipal vehicle excise and wheel taxes: local, not modeled.
- Motorcycles: not modeled (the BMV table covers passenger vehicles).

## Colorado specific ownership tax (DMV)
- Source: https://dmv.colorado.gov/taxes-and-fees (SOT Tax Rates by Vehicle Age, read 2026-11-04).
- Class C (most passenger vehicles): taxable value 85% of the original MSRP; 2.1% first year, 1.5% second, 1.2% third, 0.9% fourth, 0.45% fifth through ninth, $3 from the tenth year.
- Year of service mapped to the calculator's registration year (model year = year 1), the same mapping Oklahoma, Michigan, and Minnesota use.
- Motorcycles: not modeled.

## Engine
- New optional rule `registration.listPriceAnnualTax` (class table or rate on a share of the list price, optional flat amount from a year), passenger vehicles only, added to registration for each year of the term; uses the existing list-price (MSRP) input, default $30,000 like Arizona.
- Comparison page totals for Indiana and Colorado rise by the default-list-price tax, as Arizona's VLT already does.
