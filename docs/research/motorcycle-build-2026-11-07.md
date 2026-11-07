# Motorcycle EV and plug-in hybrid fees, build notes, 2026-11-07

Option D as Cliff ruled it, from `motorcycle-ev-fees-2026-11-07.md`. `lastVerified` is unchanged for every state, because this covered only these fees.

## What a motorcycle gets

| Outcome | Form label | States |
|---|---|---|
| Excluded, nothing added, reason on the page | Not charged | Virginia, Texas, Ohio, Michigan, Wisconsin, Oregon, Utah, Montana, South Dakota, Vermont, Wyoming; North Carolina (EV); Kansas (plug-in hybrid) |
| Different amount | +$N/yr | Washington EV $30; Kentucky $60 / $60; Iowa $9 / $9; Kansas EV +$14 (the $30 fee replaces the $16); Nebraska $75 / $75; Oklahoma $100 / $30 |
| Car amount, as ruled | +$N/yr | Indiana $242 / $81 |
| Source silent, nothing added, disclosed | Not in estimate | Maryland, California, Illinois, Georgia, New Jersey, Tennessee, Missouri, Colorado, Minnesota, South Carolina, Alabama, Louisiana, Arkansas, Mississippi, Idaho, West Virginia, Hawaii, New Hampshire, North Dakota; North Carolina and Washington (plug-in hybrid) |
| No fee in the state | $0 state fee | Nevada, after its fees were removed |

South Dakota uses the $24 electric motorcycle fee and Vermont the $56 DMV lists for a battery electric motorcycle. `evSurchargePassengerOnly` is gone, replaced by `motorcycleFuelFees`. A test fails if a state has one of these fees without saying what a motorcycle pays.

## What I read and what rests on the report

Re-read this session in the official text: Virginia, Ohio, North Carolina, Michigan, Wisconsin, Utah, Montana, South Dakota, Vermont, Wyoming, Kansas, Kentucky, Washington, Iowa, Nebraska, Oklahoma's 47 O.S. 1132.7, and Indiana's BMV page.

These rest on the report's reading, not on mine: Texas and Oregon (my script could not extract those sections), 68 O.S. 6511 in Oklahoma, Indiana's IC 9-18.1-5-12, and all the silent states.

## Limits on the page

- **Oklahoma:** $100 and $30 are a reading of two statutes, and the page says so. 47 O.S. 1132(A) was not read line by line.
- **Kansas:** the plug-in hybrid result is a reading, and the page says so.
- **Washington:** RCW 46.17.324's $75 may also apply, for $105. The page says so and the estimate uses $30.
- **Kentucky:** $60 is the base, and the adjusted figure was not found. The page says so. Kentucky's car figure has the same gap.
- **Nebraska:** the definition of "alternative fuel" was not located. The fee schedule itself names motorcycles.
- **Vermont:** DMV's table has no plug-in hybrid motorcycle column, so that case stays at the $58 gas figure.
- **Silent states:** these estimates run low if the state does charge motorcycles. The page says to confirm.

## Deferred written inquiries

To send after these fixes ship, as ruled.

- **Do motorcycles pay the EV or plug-in hybrid fee?** Maryland, California, Illinois, Georgia, New Jersey, Tennessee, Missouri, Colorado, Minnesota, South Carolina, Alabama, Louisiana, Arkansas, Mississippi, Idaho, West Virginia, Hawaii, New Hampshire, North Dakota; North Carolina and Washington for plug-in hybrids.
- **Washington:** does the $75 in RCW 46.17.324 apply to an electric motorcycle?
- **Mississippi:** what are the current inflation-adjusted amounts under Sections 27-19-21 and 27-19-23?
- **Indiana:** confirm the car amount applies to motorcycles.

## Wave 2

`feat/december-recheck-2026` adds New Mexico's $70 and $35 fees. Once merged, the new test will fail until New Mexico says what a motorcycle pays, and I have not researched that. The registry and its test will also conflict. Both need handling at the January merge.
