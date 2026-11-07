# Motorcycle EV and plug-in hybrid fees, 38 states, for Cliff's ruling

Research as of November 7, 2026, against main at c35c67b. Nothing under `src/` or `tests/` changed.

## Summary

Of the 38 states, none has a source that names motorcycles and charges them the car amount. Going by the battery EV fee, 12 states exclude motorcycles (Virginia, Texas, Ohio, North Carolina, Michigan, Wisconsin, Oregon, Utah, Montana, South Dakota, Vermont, Wyoming), 6 set a different motorcycle amount (Washington, Kentucky, Iowa, Kansas, Nebraska, and Oklahoma on my reading), 19 are source silent because their wording is general and never mentions motorcycles, and 1 is unverified because I found no source for the fee at all (Nevada). The site adds the full car fee in all 38, so 18 states are wrong for Motorcycle plus Battery EV, by $44 to $267 a year, and 9 are wrong for Motorcycle plus Plug-in Hybrid, 8 too high and Nebraska $75 too low. The site's figure is unverified in the other 20 EV cases. I recommend correcting the 18 from their statutes and showing the silent states as not in the estimate, as in North Dakota, with a separate ruling on Indiana, Maryland and Alabama. The reading also turned up car amounts that look wrong for all vehicles: South Dakota, Wyoming, Nebraska, Montana, Vermont, Nevada and Mississippi (see "Car figures that look wrong").

## How to read this

- **Outcomes.** "Excluded" means the source's text leaves motorcycles out, either by name or by limiting the fee to a class they are not in. "Different" means the source sets another amount for them. "Source silent" means the source never mentions motorcycles. I do not infer a result for a silent state. Where a definition points one way I quote it and label the conclusion "my reading".
- **Read how.** "Read" means I read the official text myself, by download or in the built-in browser ("browser"). "Summary only" means I saw it only in a search summary, and no finding rests on one of these. "Not read" means I could not reach the text.
- **Site today.** From `calculateVehicleCosts` with Motorcycle, model year 2020, $10,000 price and not financed, on the state's offered terms. "+$X" is `evSurcharge` and "reg" is `registrationTotal`, which includes the state's motorcycle fee. Oklahoma and Utah registration varies with age, and California's with price.
- **Right?** This column answers for the EV and plug-in hybrid fee only. It does not check the base motorcycle fee, except South Dakota and Kansas, where the statute changes the base fee for an electric motorcycle.

## Per-state table

| State | Car EV / PHEV on site | Motorcycle outcome | Motorcycle amount, dates | Citation and URL | Read how | Site today: Moto + EV | Site today: Moto + PHEV | Right? |
|---|---|---|---|---|---|---|---|---|
| Maryland | $125 / $100 | Source silent | Not stated. MVA lists the surcharges without naming motorcycles. A plug-in electric drive vehicle's battery test covers "2-wheeled or 3-wheeled motor vehicles", and a zero-emission vehicle is "any vehicle". My reading: both may apply. Inflation adjusted from fiscal 2026 per DLS. | [MVA fees](https://mva.maryland.gov/title-registration/fees-payment-options); [Transp. 23-206.4](https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gtr&section=23-206.4&enactments=false); [Transp. 11-145.1](https://mgaleg.maryland.gov/mgawebsite/Laws/StatuteText?article=gtr&section=11-145.1&enactments=false); [HB 1457 fiscal note](https://mgaleg.maryland.gov/2025RS/fnotes/bil_0007/hb1457.pdf) | Read. The 2024 BRFA charging text not read (404). | 1 yr +$125 (reg $230); 2 yr +$250 (reg $460) | 1 yr +$100 (reg $205); 2 yr +$200 (reg $410) | Unverified |
| Virginia | $135.63 / none | Excluded | $0. The fee "shall not apply to: 1. An autocycle, moped, or motorcycle". | [Va. Code 46.2-772](https://law.lis.virginia.gov/vacode/title46.2/chapter6/section46.2-772/); [DMV](https://www.dmv.virginia.gov/vehicles/taxes-fees/highway-use) | Read | 1 yr +$135.63 (reg $160.38); 2 yr +$271.26 (reg $318.76) | +$0 (reg $24.75; 2 yr $47.50) | EV no, PHEV yes |
| California | $121 / none | Source silent | Not stated. Fee is on "every zero-emission motor vehicle model year 2020 and later", with no motorcycle wording. | [Veh. Code 9250.6](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=VEH&sectionNum=9250.6); [H&S 44258](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=44258); [DMV](https://www.dmv.ca.gov/portal/vehicle-registration/registration-fees/) | Read | +$121 (reg $364) | +$0 (reg $243) | EV unverified, PHEV yes |
| Texas | $200 / none | Excluded | $0. "Electric vehicle" does "not include... a motorcycle". | [Transp. Code 502.360](https://statutes.capitol.texas.gov/Docs/TN/htm/TN.502.htm); [TxDMV](https://www.txdmv.gov/motorists/register-your-vehicle) | Read (statute in browser) | +$200 (reg $230) | +$0 (reg $30) | EV no, PHEV yes |
| Illinois | $100 / none | Source silent | Not stated. 3-805(b) has one $100 surcharge. SB 1248 would set $50 for electric motorcycles but is not law (re-referred June 2, 2025). | [625 ILCS 5/3-805](https://www.ilga.gov/documents/legislation/ilcs/documents/062500050K3-805.htm); [SB 1248](https://ilga.gov/ftp/legislation/104/SB/10400SB1248.htm); [status](https://www.ilga.gov/Legislation/BillStatus?DocNum=1248&GAID=18&DocTypeID=SB&SessionID=114); [SOS fees](https://www.ilsos.gov/departments/vehicles/basicfees.html) | Read (SOS in browser) | +$100 (reg $141) | +$0 (reg $41) | EV unverified, PHEV yes |
| Ohio | $200 / $150 | Excluded | $0. Both terms are defined as "a passenger car" powered by the battery system. BMV lists them under "Passenger Vehicle Fuel Type". | [R.C. 4503.10](https://codes.ohio.gov/ohio-revised-code/section-4503.10); [R.C. 4501.01](https://codes.ohio.gov/ohio-revised-code/section-4501.01); [BMV](https://bmv.ohio.gov/doc-fees.aspx) | Read | +$200 (reg $230) | +$150 (reg $180) | No, no |
| Georgia | $238.59 / none | Source silent | Not stated. DOR applies it to "vehicles that operate solely on electricity" and plug-in hybrids only if they elect the alternative fuel plate. Figure runs July 2026 to June 2027. | [DOR notice](https://dor.georgia.gov/alternative-fuel-and-low-speed-vehicles-annual-licensing-fees-july-2026); [DOR schedule](https://dor.georgia.gov/document/instructions/schedule-motor-vehicle-license-plates-and-fees/download) | Read. O.C.G.A. not read. | +$238.59 (reg $258.59) | +$0 (reg $20) | Unverified |
| North Carolina | $214.50 / $107.25 | Excluded (EV); source silent (PHEV) | EV $0: a plug-in electric vehicle is "A four-wheeled motor vehicle". PHEV: no definition of "plug-in hybrid vehicle" found in 20-4.01, so not stated. | [G.S. 20-87](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-87.html); [G.S. 20-4.01(28b)](https://www.ncleg.gov/EnactedLegislation/Statutes/HTML/BySection/Chapter_20/GS_20-4.01.html) | Read | +$214.50 (reg $244) | +$107.25 (reg $136.75) | EV no, PHEV unverified |
| Michigan | $267 / $113 | Excluded | $0. The increase applies to "a vehicle using 4 or more tires". | [MCL 257.801(7)](https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-257-801) | Read | +$267 (reg $292) | +$113 (reg $138) | No, no |
| New Jersey | $270 / none | Source silent | Not stated. Fee is on "every zero-emission vehicle to be registered", meaning one certified under CARB standards. $280 from July 1, 2027. | [P.L.2024, c.7, sec. 8 (C.39:3-8.5)](https://pub.njleg.gov/Bills/2024/PL24/7_.HTM); [MVC](https://www.nj.gov/mvc/vehicles/regfees.htm) | Read | +$270 (reg $335) | +$0 (reg $65) | EV unverified, PHEV yes |
| Washington | $225 / $75 | Different (EV); source silent (PHEV and the $75) | EV $30 under 46.17.323(5), and (1) and (4) say "except for electric motorcycles". Separately, 46.17.324 charges $75 on "A vehicle" with no motorcycle wording, so the total is $30 or $105. | [RCW 46.17.323](https://app.leg.wa.gov/rcw/default.aspx?cite=46.17.323); [RCW 46.17.324](https://app.leg.wa.gov/rcw/default.aspx?cite=46.17.324); [DOL](https://dol.wa.gov/vehicles-and-boats/vehicles/vehicle-registration/calculate-vehicle-tab-fees) | Read | +$225 (reg $307.75) | +$75 (reg $157.75) | EV no, PHEV unverified |
| Tennessee | $200 / $100 | Source silent | Not stated. All-electric vehicle "Means a passenger or commercial motor vehicle", and I did not find whether that covers a motorcycle. $274 from January 1, 2027, on hold on `feat/december-recheck-2026`. | [Pub. Ch. 159 (2023), sec. 32](https://publications.tnsosfiles.com/acts/113/pub/pc0159.pdf); [VR-5](https://revenue.support.tn.gov/hc/en-us/articles/360060541291-VR-5-Registration-Fees-for-Hybrid-or-Electric-Vehicles) | Read. Current T.C.A. 55-4-116 not read. | +$200 (reg $219.50) | +$100 (reg $119.50) | Unverified |
| Indiana | $242 / $81 | Source silent | Not named. Applies to "each electric vehicle and hybrid vehicle" that must be registered, except motor carrier fuel tax vehicles and "motor driven cycles". My reading: motorcycles pay the same amount. Low speed vehicles added to the exempt list January 1, 2027. | [IC 9-18.1-5-12](https://iga.in.gov/ic/2026/Title_9.html); [BMV](https://www.in.gov/bmv/fees-taxes/vehicle-registration-fees-and-taxes); [Fee chart](https://www.in.gov/bmv/files/Fee_Chart.pdf) | Read | +$242 (reg $283.35) | +$81 (reg $122.35) | Unverified, probably right |
| Missouri | $150 / $75 | Source silent | Not stated. The decal covers each "passenger motor vehicle, school bus... and commercial motor vehicle" and heavier classes. Motorcycle is not listed. 301.010(38) defines it separately. | [RSMo 142.869](https://revisor.mo.gov/main/OneSection.aspx?section=142.869); [RSMo 301.010](https://revisor.mo.gov/main/OneSection.aspx?section=301.010); [DOR fees](https://dor.mo.gov/motor-vehicle/titling-registration/fees.html) | Read | +$150 (reg $167.75) | +$75 (reg $92.75) | Unverified |
| Wisconsin | $175 / $75 | Excluded | $0. Surcharges apply "If a motor truck or automobile is" hybrid or electric, added "to the fee under par. (a) or (c)". Motorcycles are par. (b). | [Wis. Stat. 341.25(1)(b), (L)](https://docs.legis.wisconsin.gov/document/statutes/341.25(1)); [DMV chart](https://wisconsindot.gov/Pages/dmv/vehicles/title-plates/fee-chart.aspx) | Read | +$175 (reg $198) | +$75 (reg $98) | No, no |
| Colorado | $89.05 / $76.05 | Source silent | Not stated. The fees fall on "every electric motor vehicle", and the plug-in definition is "Any motor vehicle" that can be recharged externally. Road usage part rises July 1, 2027 ($36 / $16). | [DMV fees](https://dmv.colorado.gov/taxes-and-fees); [DMV EVs](https://dmv.colorado.gov/electric-vehicles); [C.R.S. 42-3-304(25), 42-1-102(69.5) (2024 Title 42 PDF)](https://content.leg.colorado.gov/sites/default/files/images/olls/crs2024-title-42.pdf) | Read, 2024 edition (2025 PDF returned 404). | +$89.05 (reg $126.24) | +$76.05 (reg $113.24) | Unverified |
| Minnesota | $150 / $75 | Source silent | Not stated. The definitions cover any qualifying "motor vehicle". The surcharges are "in addition to the tax under subdivision 1a", and motorcycles pay under subdivision 1b. My reading: this points away from motorcycles, but no text says so. Minimums fall to $100 / $50 from July 1, 2027. | [Minn. Stat. 168.013](https://www.revisor.mn.gov/statutes/cite/168.013); [169.011](https://www.revisor.mn.gov/statutes/cite/169.011); [DVS](https://dps.mn.gov/divisions/dvs/vehicle/vehicle-fees) | Read | +$150 (reg $160) | +$75 (reg $85) | Unverified |
| South Carolina | $60 / $30 a year | Source silent | Not stated. Fee is on "motor vehicles" powered exclusively by electricity ($120 biennial) or by a combination ($60 biennial). | [S.C. Code 56-3-645](https://www.scstatehouse.gov/code/t56c003.php); [DMV](https://dmv.sc.gov/fees) | Read (statute in browser) | 2 yr +$120 (reg $130) | 2 yr +$60 (reg $70) | Unverified |
| Alabama | $203 / $103 | Source silent | Not named. The fee is "In addition to" subsection (a), which covers automobiles and motorcycles, on "any motor vehicle" that qualifies. My reading: motorcycles pay the same. | [Ala. Code 40-12-242](https://alison.legislature.state.al.us/code-of-alabama?section=40-12-242); [ALDOR](https://www.revenue.alabama.gov/tax-types/motor-vehicle-registration-fees/) | Read (statute in browser) | +$203 (reg $218) | +$103 (reg $118) | Unverified, probably right |
| Louisiana | $110 / $60 a year | Source silent | Not stated. Fee is on "each electric vehicle" required to be registered, and the only exemption is school buses. | [R.S. 32:461](https://legis.la.gov/Legis/LawPrint.aspx?d=1294995); [RIB 24-006](https://dam.ldr.la.gov/lawspolicies/RIB%2024-006%20Electric%20and%20Hybrid%20Vehicle%20Road%20Usage%20Fee.pdf) | Read | 2 yr +$220 (reg $232) | 2 yr +$120 (reg $132) | Unverified |
| Kentucky | $120 / $120 | Different | $60 base for "electric motorcycles", which include plug-in hybrids. Adjusted yearly, never below base. Adjusted 2026 figure not found. | [KRS 138.475](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=55787); [KRS 186.050(16)](https://apps.legislature.ky.gov/law/statutes/statute.aspx?id=56307) | Read | +$120 (reg $138) | +$120 (reg $138) | No, no |
| Oregon | $120 / none | Excluded | $0. The electric amount is "in addition to" ORS 803.420(6)(a), passenger vehicles. Motorcycles are (6)(c), $44 a year. DMV lists "motorcycle or moped... $88". Fees change July 1, 2027. | [ORS 803.420, 803.422](https://www.oregonlegislature.gov/bills_laws/ors/ors803.html); [DMV](https://www.oregon.gov/odot/dmv/pages/fees/vehicle.aspx) | Read | 2 yr +$240 (reg $328) | +$0 (reg $88) | EV no, PHEV yes |
| Oklahoma | $210 / $112 | Different (my reading) | 68 O.S. 6511 ($110 / $82, class 1) covers an "electric vehicle" that "has at least four wheels", so my reading is that motorcycles are out. 47 O.S. 1132.7 ($100 / $30) covers a "vehicle subject to a registration fee" under 1132(A), and 1132.6 says motorcycles register under 1132, so my reading is that they pay it. Result: $100 / $30. I did not read 1132(A) line by line. | [47 O.S. 1132.7 (Title 47 PDF)](https://www.oklegislature.gov/OK_Statutes/CompleteTitles/os47.pdf); [HB 2234 (2021) enrolled](https://www.oklegislature.gov/cf_pdf/2021-22%20ENR/hB/HB2234%20ENR.PDF); [Form 579](https://oklahoma.gov/content/dam/ok/en/tax/documents/forms/tax-credits/579.pdf) | Read. 6511 read as enacted in 2021 only. | +$210 (reg $299) | +$112 (reg $201) | No, no (on my reading) |
| Utah | $180 / $56.50 | Excluded | $0. The charge is "in addition to the fee described in Subsection (1)(b)", which is "excluding motorcycles"; motorcycles are (1)(a). Section version is superseded January 1, 2027, and the site notes $280 for cars then. | [Utah Code 41-1a-1206](https://le.utah.gov/xcode/Title41/Chapter1A/41-1a-S1206.html) | Read (browser) | +$180 (reg $303.25) | +$56.50 (reg $179.75) | No, no |
| Iowa | $130 / $65 | Different | $9 for both, "an annual electric motorcycle registration fee". The car fee is limited to vehicles under 321.109(1)(a). | [Iowa Code 321.116, 321.117(2)](https://www.legis.iowa.gov/docs/code/2026/321.pdf) | Read | +$130 (reg $150) | +$65 (reg $85) | No, no |
| Nevada | $125 / $75 | Unverified | No fee found. NRS 482 has no EV or plug-in hybrid registration fee, and the DMV schedule lists none. The rules file gives no source. | [NRS 482](https://www.leg.state.nv.us/nrs/nrs-482.html); [DMV](https://dmv.nv.gov/regfees.htm) | Read | +$125 (reg $158) | +$75 (reg $108) | Unverified |
| Arkansas | $200 / $100 | Source silent | Not stated. "Electric vehicle" means "a vehicle" propelled by an electric motor, and the DFA schedule lists motorcycles and these fees on separate lines. | [Act 416 of 2019, sec. 7 (27-14-614)](https://www.arkleg.state.ar.us/Acts/FTPDocument?path=%2FACTS%2F2019R%2FPublic%2F&file=416.pdf&ddBienniumSession=2019%2F2019R); [DFA schedule](https://www.dfa.arkansas.gov/wp-content/uploads/MyDMV_Fee_Schedule.pdf) | Read. Current code not read; the Act predates the separate PHEV line. | +$200 (reg $209.50) | +$100 (reg $109.50) | Unverified |
| Mississippi | $150 / $75 | Source silent | Not stated. "A vehicle... required to have a license tag". The Act indexes the tax to inflation from July 1, 2021. | [HB 1 (2018 1st Ex. Sess.), secs. 5 and 6](https://billstatus.ls.state.ms.us/documents/20181E/html/HB/0001-0099/HB0001SG.htm); [SB 2476 (2021), as introduced](https://billstatus.ls.state.ms.us/documents/2021/html/SB/2400-2499/SB2476IN.htm) | Read. Current code not read; [DOR page](https://www.dor.ms.gov/motor-vehicle) has no fee text. | +$150 (reg $165) | +$75 (reg $90) | Unverified |
| Kansas | $165 / $100 | Different (EV); not named (PHEV) | EV: "all-electric motorcycles, $30", replacing the $16 fee, so $14 more. PHEV: the $100 line sits under passenger vehicles "other than motorcycles". My reading: $16 total. | [K.S.A. 8-143(a)](https://ksrevisor.gov/statutes/chapters/ch08/008_001_0043.html) | Read | +$165 (reg $181) | +$100 (reg $116) | No, no (PHEV on my reading) |
| Nebraska | $150 / none | Different | $75 for "a motorcycle or plug-in hybrid electric vehicle", effective July 18, 2026 (LB 207). I could not find the definition of "alternative fuel". | [Neb. Rev. Stat. 60-3,191](https://nebraskalegislature.gov/laws/statutes.php?statute=60-3,191) | Read | +$150 (reg $164.20) | +$0 (reg $14.20) | No, no |
| Idaho | $140 / $75 | Source silent | Not stated. "A vehicle powered only by a form of electricity"; the exception is neighborhood EVs. | [Idaho Code 49-457](https://legislature.idaho.gov/statutesrules/idstat/title49/t49ch4/sect49-457/) | Read. ITD fee page not found (404). | +$140 (reg $159) | +$75 (reg $94) | Unverified |
| West Virginia | $200 / $100 | Source silent | Not stated. "A vehicle operating exclusively on electricity" or on "a combination". | [W. Va. Code 17A-10-3c](https://code.wvlegislature.gov/17A-10-3C/) | Read | +$200 (reg $225) | +$100 (reg $125) | Unverified |
| Hawaii | $50 / none | Source silent | Conflicting. Since July 1, 2025, "electric vehicle" means "three or more wheels" for the road usage charge and its $50 option, through June 30, 2028. Two-wheelers are outside that. The $50 "alternative fuel vehicle" surcharge excludes only that defined term, so a two-wheeler might fall under it. | [HRS 249-31](https://www.capitol.hawaii.gov/hrscurrent/Vol04_Ch0201-0257/HRS0249/HRS_0249-0031.htm); [HRS 249-36](https://www.capitol.hawaii.gov/hrscurrent/Vol04_Ch0201-0257/HRS0249/HRS_0249-0036.htm) | Read | +$50 (reg $85) | +$0 (reg $35) | EV unverified, PHEV yes |
| New Hampshire | $100 / $50 | Source silent | Not stated. "Any vehicle" operating by battery. From January 1, 2027, by GVWR: $0 to 1,000 lbs, $50 to 3,000 lbs; PHEV $50 at any weight. Cliff's GVWR ruling stands. | [RSA 261:141-c](https://gc.nh.gov/rsa/html/XXI/261/261-141-c.htm); [RSA 236:132](https://gc.nh.gov/rsa/html/XX/236/236-132.htm) | Read | +$100 (reg $124) | +$50 (reg $74) | Unverified |
| Montana | $130 / none | Excluded | $0. Both definitions require "at least four wheels". | [MCA 61-3-571](https://archive.legmt.gov/bills/MCA/title_0610/chapter_0030/part_0050/section_0710/0610-0030-0050-0710.html); [MCA 61-3-572](https://archive.legmt.gov/bills/MCA/title_0610/chapter_0030/part_0050/section_0720/0610-0030-0050-0720.html) | Read | +$130 (reg $183) | +$0 (reg $53) | EV no, PHEV yes |
| South Dakota | $50 / none | Excluded | No added fee if licensed under 32-5-9, whose fee for a rechargeable electric motorcycle is the top tier, $24. | [SDCL 32-5-188](https://sdlegislature.gov/Statutes/32-5-188); [SDCL 32-5-9](https://sdlegislature.gov/Statutes/32-5-9) | Read (browser) | +$50 (reg $68) | +$0 (reg $18) | EV no, PHEV yes |
| Vermont | $89 / none | Excluded | $0. Plug-in motorcycle fees are "determined pursuant to section 364", a flat $56. The infrastructure fees in 361 are for "a pleasure car". Subsection 361(b), the EV fee, is repealed January 1, 2027. | [23 V.S.A. 361](https://legislature.vermont.gov/statutes/section/23/007/00361); [362](https://legislature.vermont.gov/statutes/section/23/007/00362); [364](https://legislature.vermont.gov/statutes/section/23/007/00364) | Read | 1 yr +$89 (reg $147); 2 yr +$178 (reg $294) | +$0 (reg $58; 2 yr $116) | EV no, PHEV yes |
| Wyoming | $200 / none | Excluded | $0. Both definitions "shall not include" or do "not include" "a motorcycle as defined in W.S. 31-1-101(a)(xv)(E)". Effective July 1, 2026. | [W.S. 31-3-102 (Title 31 PDF)](https://www.wyoleg.gov/statutes/compress/title31.pdf); [W.S. 39-17-301 (Title 39 PDF)](https://www.wyoleg.gov/statutes/compress/title39.pdf); [2026 Enrolled Act 33](https://wyoleg.gov/2026/Enroll/HB0145.pdf) | Read | +$200 (reg $215) | +$0 (reg $15) | EV no, PHEV yes |

## Where today's estimate is wrong for a motorcycle

### Battery EV: 18 states, all too high

| State | Site adds | Correct | Too high by |
|---|---|---|---|
| Michigan | $267 | $0 | $267 |
| Oregon | $240 (2 yr) | $0 | $240 (2 yr) |
| North Carolina | $214.50 | $0 | $214.50 |
| Texas | $200 | $0 | $200 |
| Ohio | $200 | $0 | $200 |
| Wyoming | $200 | $0 | $200 |
| Utah | $180 | $0 | $180 |
| Wisconsin | $175 | $0 | $175 |
| Virginia | $135.63 (1 yr), $271.26 (2 yr) | $0 | $135.63, $271.26 |
| Montana | $130 | $0 | $130 |
| Vermont | $89 (1 yr), $178 (2 yr) | $0 | $89, $178 |
| Washington | $225 | $30, or $105 if the RCW 46.17.324 fee applies | $195 or $120 |
| Kansas | $165 on top of $16 ($181) | $30 total | $151 |
| Iowa | $130 | $9 | $121 |
| Oklahoma (my reading) | $210 | $100 | $110 |
| Nebraska | $150 | $75 | $75 |
| Kentucky | $120 | $60 base, adjusted figure not found | $60 at base |
| South Dakota | $50 on top of $18 ($68) | $24 total | $44 |

### Plug-in hybrid: 9 states

| State | Site adds | Correct | Off by |
|---|---|---|---|
| Ohio | $150 | $0 | $150 too high |
| Michigan | $113 | $0 | $113 too high |
| Kansas (my reading) | $100 | $0 | $100 too high |
| Oklahoma (my reading) | $112 | $30 | $82 too high |
| Wisconsin | $75 | $0 | $75 too high |
| Kentucky | $120 | $60 base | $60 too high at base |
| Utah | $56.50 | $0 | $56.50 too high |
| Iowa | $65 | $9 | $56 too high |
| Nebraska | $0 | $75 | $75 too low |

The motorcycle choice also affects two figures outside the EV fee. Oregon DMV applies its $192 all-electric title fee "regardless of vehicle type", and the site does not model that fee for anyone. South Dakota's base fee for a gas motorcycle depends on engine size ($18, $21 or $24), and the site always uses $18.

## States I could not resolve, and why

- **Source silent, 19 states:** Maryland, California, Illinois, Georgia, New Jersey, Tennessee, Indiana, Missouri, Colorado, Minnesota, South Carolina, Alabama, Louisiana, Arkansas, Mississippi, Idaho, West Virginia, Hawaii, New Hampshire. Their text and agency pages never say whether motorcycles pay. Only a written agency answer or a sample registration quote would settle them.
- **Statute not read, within those 19:** Georgia rests on DOR pages only: its LexisNexis code portal opened in the browser, but I could not operate its search while the pane was hidden. Arkansas, Mississippi and Tennessee rest on the enacting acts, and I did not try their current code sites, so current wording could differ. Colorado rests on the 2024 edition. Maryland's charging text in the 2024 BRFA was not read (404), so its amounts rest on MVA and the DLS note.
- **Nevada:** I found no EV or plug-in hybrid fee at all, so the question has no answer until the $125 and $75 are traced. A targeted search of Nevada's official sites also found none. This does not prove no such fee exists.
- **Partly open:**
  - Washington: whether the $75 in RCW 46.17.324 applies to an electric motorcycle, and what a plug-in hybrid motorcycle pays.
  - North Carolina: the plug-in hybrid fee.
  - Oklahoma: 1132(A) not read line by line, and 68 O.S. 6511 read only as enacted in 2021.
  - Kentucky: the adjusted 2026 motorcycle amount, which is unpublished, like the car amount the site already discloses.
  - Nebraska: the "alternative fuel" definition not located. The fee schedule itself names motorcycles.
- **Summary-only leads, not used as findings:** a WYDOT memo on the July 2026 decal change, South Dakota's bill number HB 1227, and a Louisiana State Police policy. For Wyoming and South Dakota I relied on the statute text instead.

## Car figures that look wrong

These are outside this ruling, but they affect cars as well as motorcycles. I changed nothing. Each one needs its own check before any change.

| State | Site | Source | Note |
|---|---|---|---|
| South Dakota | EV $50 | $100 in [SDCL 32-5-188](https://sdlegislature.gov/Statutes/32-5-188), source line SL 2026, ch 132 | Effective date not confirmed |
| Wyoming | EV $200, no PHEV | $100 and $50 in [Enrolled Act 33](https://wyoleg.gov/2026/Enroll/HB0145.pdf), effective July 1, 2026 | Site overcharges EVs and omits PHEVs |
| Nebraska | No PHEV fee | $75 in [60-3,191](https://nebraskalegislature.gov/laws/statutes.php?statute=60-3,191), effective July 18, 2026 | Omitted |
| Montana | No PHEV fee; EV flat $130 | PHEV $70 and EV $130 for class 1, higher by weight, in [61-3-572](https://archive.legmt.gov/bills/MCA/title_0610/chapter_0030/part_0050/section_0720/0610-0030-0050-0720.html) | PHEV omitted |
| Vermont | No PHEV fee; EV $89 | [23 V.S.A. 361(c)](https://legislature.vermont.gov/statutes/section/23/007/00361) sets a PHEV fee of half the annual fee; 361(b), the EV fee, is repealed January 1, 2027 | Half of $89 is $44.50 by my arithmetic. Site base fees are $2 above 361 ($91 vs. $89) and 364 ($58 vs. $56); I did not trace the $2 |
| Nevada | $125 / $75 | None found | See above |
| Mississippi | $150 / $75 | Base amounts, indexed yearly from July 1, 2021, in [HB 1 (2018)](https://billstatus.ls.state.ms.us/documents/20181E/html/HB/0001-0099/HB0001SG.htm) | Current indexed amounts not found |

## Options for Cliff

**Option A: charge the correct motorcycle amount in the 18 resolved states, leave the rest as they are.**
Most accurate where the law is clear, but silent states keep showing a car fee nobody has confirmed. Needs the engine change below.

**Option B: leave motorcycles uncharged with a disclaimer everywhere, as in North Dakota.**
Uses the existing `evSurchargePassengerOnly` flag, so it needs data and copy only, and no figure lacks a source. It does drop fees the law sets in Kentucky, Iowa, Kansas, Nebraska, Washington and Oklahoma, and probably Indiana and Alabama, so those estimates run low. The form's "Not in estimate" also misleads in the 12 excluded states, where the fee is simply not owed.

**Option C: leave the calculator alone and add a disclaimer only.**
No engine or data work, but 18 estimates stay wrong by up to $267. I do not recommend it.

**Option D (recommended): combine them.**
1. **Excluded (12):** charge $0 and say plainly that the state does not charge it. South Dakota also uses the $24 base fee for an electric motorcycle.
2. **Different (6):** charge the statute's amount and disclose the limits: Kentucky's base-only figure, Washington's $75 question, Oklahoma's and Kansas's readings.
3. **Silent (19):** do not charge. Disclose the fee as North Dakota does: the state's sources do not say whether it applies to motorcycles, so confirm with the agency.
4. **Nevada:** hold until the car figure is traced. If it cannot be, removing it is a separate ruling.

**Why D:** it follows your North Dakota ruling and the "say less" rule, shows no unsupported amount, and corrects every state the sources settle. Its risk is that silent-state estimates run low if those states do charge motorcycles, and the disclosure covers that risk.

**Questions for your ruling**
- **Indiana, Alabama and Maryland:** should these charge the car amount rather than sit with the silent group? The text points that way for all three, but it is my reading. I lean to charging Indiana, whose only listed vehicle exception is motor driven cycles, and leaving Alabama and Maryland silent.
- **Agency confirmation:** should someone ask the silent states in writing? It is the only way to settle them, and it can follow the release.
- **Car figures:** should the table above become its own pass? I recommend it, ahead of this motorcycle work, starting with Wyoming and South Dakota.

### What the engine change would involve (described, not built)

- **Types and data:** add optional `motorcycleEvSurchargeAnnual` and `motorcyclePhevSurchargeAnnual` to `registration` in `src/lib/types.ts`, where `0` means excluded and absent means fall back to a policy. Keep or fold in `evSurchargePassengerOnly`.
- **Calculator:** in `src/lib/calculator.ts:316`, pick the motorcycle amount first when the vehicle is a motorcycle, then multiply by term as today. Kansas fits as a $14 add-on, or as a total that replaces the base fee. South Dakota needs its base fee changed when the motorcycle is electric, so a fuel-specific base is cleaner for both.
- **Three display states:** `src/components/VehicleInputForm.tsx:60` and lines 690 to 699 show "Not in estimate" and the +$N labels. The form must distinguish "not charged by this state" from "not in estimate, source silent" and from a motorcycle dollar amount.
- **Copy:** user-facing text goes in `disclaimers` or `faqs`, because `rule.notes` is not rendered. Each changed state needs a rendered disclaimer and any FAQ correction.
- **Tests:** add a table test of all 39 fee states (with North Dakota) for Motorcycle plus each fuel type, and rendered-form tests. Add `src/config/datedFigures.json` entries for dated motorcycle figures (Kentucky's yearly adjustment; New Hampshire, Vermont and Utah on January 1, 2027; Minnesota and Oregon in July 2027).
- **Held branch:** `feat/december-recheck-2026` edits Tennessee and New Mexico. Avoid or plan around Tennessee's lines in the rules file, so the January merge stays clean.
- **Size:** mostly data, about 38 state entries, with one small calculator branch and one form change. Follow the usual path: branch, tests, real-browser check, preview, hold for your OK, then a live check by Nova.
