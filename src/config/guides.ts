import { FaqItem } from '@/lib/types';

/**
 * How-to guides. Every fee, deadline, exemption, and document below was checked against the
 * state agency's pages (listed in each guide's sources) on the lastVerified date. When agency
 * guidance was silent or ambiguous on a point, the guide says less rather than guessing.
 */
export interface GuideStep {
  title: string;
  body: string[];
}

export interface GuideSection {
  heading: string;
  intro?: string;
  items: string[];
}

export interface Guide {
  slug: string;
  /** Key into stateRules.json for the embedded calculator. */
  stateKey: string;
  /** H1, written as the search question. */
  title: string;
  /** Short title for cards and the <title> tag (the layout appends "| CarTaxHub"). */
  shortTitle: string;
  metaTitle: string;
  metaDescription: string;
  /** One-line summary for guide cards. */
  cardDescription: string;
  intro: string[];
  lastVerified: string;
  /** Agency the facts were checked against, e.g. "Maryland MVA". */
  agency: string;
  steps: GuideStep[];
  sections?: GuideSection[];
  checklist: string[];
  calculatorNote: string;
  faqs: FaqItem[];
  sources: { label: string; url: string }[];
}

const MVA = 'https://mva.maryland.gov';

const SOURCES = {
  privateParty: { label: 'MVA: Titling a Vehicle Bought from a Private Party', url: `${MVA}/title-registration/title-vehicle/private-party-purchase` },
  buying: { label: 'MVA: Buying a Vehicle', url: `${MVA}/title-registration/buying-selling-or-gifting-vehicle/buying-vehicle` },
  selling: { label: 'MVA: Selling a Vehicle', url: `${MVA}/title-registration/buying-selling-or-gifting-vehicle/selling-vehicle` },
  exciseTax: { label: 'MVA: Excise Tax', url: `${MVA}/title-registration/fees-payment-options/excise-tax` },
  fees: { label: 'MVA: Fees & Payment Options', url: `${MVA}/title-registration/fees-payment-options` },
  inspection: { label: 'MVA: Maryland Safety Inspections', url: `${MVA}/title-registration/vehicle-emissions-safety-inspections/safety-inspections` },
  billOfSale: { label: 'MVA bulletin: Repeal of Notarized Bill of Sale Requirement (SB125 / HB251)', url: `${MVA}/your-mva-guide/businesses/bulletins-businesses/sb125-hb251-repeal-notarized-bill-sale-requirement` },
  gift: { label: 'MVA: Giving a Vehicle as a Gift', url: `${MVA}/about-mva/Pages/info/27300/27300-38T.aspx` },
  giftForm: { label: 'MVA Form VR-103: Gift Certification', url: `${MVA}/Documents/VR-103.pdf` },
  auntUncleForm: { label: 'MVA Form VR-299: Gift Title Transfer from Aunt/Uncle to Niece and/or Nephew', url: `${MVA}/Documents/VR-299.pdf` },
  newResident: { label: 'MVA: Title & Register Your Vehicle in Maryland (new residents)', url: `${MVA}/your-mva-guide/new-maryland-residents/title-register-your-vehicle` },
  oct2026: { label: 'MVA bulletin: Legislative update, effective October 1, 2026', url: `${MVA}/your-mva-guide/businesses/bulletins-businesses/legislative-update-effective-october-1-2026` }
};

const VA_DMV = 'https://www.dmv.virginia.gov';
const PA = 'https://www.pa.gov';
const PENNDOT_DOCS = `${PA}/content/dam/copapwp-pagov/en/penndot/documents/public/dvspubsforms/bmv`;

const VA_SOURCES = {
  sut: { label: 'Virginia DMV: Motor Vehicle Sales and Use Tax', url: `${VA_DMV}/vehicles/taxes-fees/sut` },
  buySell: { label: 'Virginia DMV: Buying/Selling a Vehicle', url: `${VA_DMV}/vehicles/buy-sell` },
  title: { label: 'Virginia DMV: Title Your Vehicle or Trailer', url: `${VA_DMV}/vehicles/title` },
  registration: { label: 'Virginia DMV: Register Your Vehicle', url: `${VA_DMV}/vehicles/registration` },
  fees: { label: 'Virginia DMV: DMV Fees (Form DMV 201)', url: `${VA_DMV}/sites/default/files/forms/dmv201.pdf` },
  newResident: { label: 'Virginia DMV: New to Virginia', url: `${VA_DMV}/moving/new-virginia` },
  giftForm: { label: 'Virginia DMV Form SUT 3: Purchaser’s Statement of Tax Exemption', url: `${VA_DMV}/sites/default/files/forms/sut3.pdf` },
  code630: { label: 'Code of Virginia § 46.2-630', url: 'https://law.lis.virginia.gov/vacode/title46.2/chapter6/section46.2-630/' }
};

const PA_SOURCES = {
  buySell: { label: 'PennDOT: Buying or Selling a Vehicle', url: `${PA}/agencies/dmv/vehicle-services/title-and-registration/buying-or-selling-a-vehicle` },
  buySellFactSheet: { label: 'PennDOT fact sheet: Buying or Selling Your Vehicle in Pennsylvania', url: `${PENNDOT_DOCS}/bmv-fact-sheets/fs-buysell.pdf` },
  fees: { label: 'PennDOT Form MV-70S: Schedule of Fees', url: `${PENNDOT_DOCS}/bmv-forms/mv-70s.pdf` },
  agentHandbook: { label: 'PennDOT Publication 457B: Agent Services Handbook', url: `${PENNDOT_DOCS}/bmv-publications/pub457b.pdf` },
  giftForm: { label: 'PennDOT Form MV-13ST: Affidavit of Gift', url: `${PENNDOT_DOCS}/bmv-forms/mv-13st.pdf` },
  newResident: { label: 'PennDOT: Transfer Vehicle Registration from Another State', url: `${PA}/services/dmv/transfer-vehicle-registration-from-another-state` },
  outOfState: { label: 'PennDOT fact sheet: How to Title and Register Your Out-of-State Vehicle', url: `${PENNDOT_DOCS}/bmv-fact-sheets/fs-toos.pdf` }
};

const TX_SOURCES = {
  buySell: { label: 'TxDMV: Buying or Selling a Vehicle', url: 'https://www.txdmv.gov/motorists/buying-or-selling-a-vehicle' },
  register: { label: 'TxDMV: Register Your Vehicle', url: 'https://www.txdmv.gov/motorists/register-your-vehicle' },
  newResident: { label: 'TxDMV: New to Texas', url: 'https://www.txdmv.gov/motorists/new-to-texas' },
  spv: { label: 'Texas Comptroller: Private-Party Purchases and Standard Presumptive Values', url: 'https://comptroller.texas.gov/taxes/motor-vehicle/private-party-spv.php' },
  gift: { label: 'Texas Comptroller: Motor Vehicle Tax Guide, Gift Tax', url: 'https://comptroller.texas.gov/taxes/publications/96-254/gift.php' },
  family: { label: 'Texas Comptroller: Motor Vehicle Tax Guide, Family Transfers', url: 'https://comptroller.texas.gov/taxes/publications/96-254/family-transfers.php' },
  penalties: { label: 'TxDMV: Title penalties notice', url: 'https://www.txdmv.gov/sites/default/files/body-files/titlepenaltiespressrelease_4.pdf' }
};

const CA_SOURCES = {
  privateParty: { label: 'California DMV: Registering a Vehicle Purchased From a Private Party', url: 'https://www.dmv.ca.gov/portal/vehicle-registration/new-registration/registering-a-vehicle-purchased-from-a-private-party/' },
  fees: { label: 'California DMV: Registration Fees', url: 'https://www.dmv.ca.gov/portal/vehicle-registration/registration-fees/' },
  smog: { label: 'Bureau of Automotive Repair: Smog Check', url: 'https://www.bar.ca.gov/smog-check' },
  cdtfa: { label: 'CDTFA: Tax Guide for Purchasers of Vehicles', url: 'https://cdtfa.ca.gov/industry/vehicles-vessels-aircraft/vehicles.htm' },
  newResident: { label: 'California DMV: New California Resident', url: 'https://www.dmv.ca.gov/portal/driver-education-and-safety/special-interest-driver-guides/new-to-california/' },
  outOfState: { label: 'California DMV: Register a Vehicle From Out of State (HTVR 9)', url: 'https://www.dmv.ca.gov/portal/file/how-to-register-an-out-of-state-vehicle-htvr9/' }
};

const FL_SOURCES = {
  privateSale: { label: 'FLHSMV: Buying from a Private Sale', url: 'https://www.flhsmv.gov/safety-center/consumer-education/buying-vehicle-florida/buying-private-sale/' },
  fees: { label: 'FLHSMV: Fees', url: 'https://www.flhsmv.gov/fees/' },
  registrations: { label: 'FLHSMV: Motor Vehicle Registrations', url: 'https://www.flhsmv.gov/motor-vehicles-tags-titles/license-plates-registration/motor-vehicle-registrations/' },
  newResident: { label: 'FLHSMV: New Resident', url: 'https://www.flhsmv.gov/new-resident/' },
  giftFaq: { label: 'Florida DOR: Sales tax on a vehicle given as a gift', url: 'https://floridarevenue.com/faq/Pages/FAQDetails.aspx?FAQID=1297' },
  salesTax: { label: 'Florida DOR: Sales and Use Tax on Motor Vehicles (GT-800030)', url: 'https://floridarevenue.com/Forms_library/gt800030.pdf' },
  newResidentTax: { label: 'Florida DOR: Tax Information for New Residents (GT-800025)', url: 'https://floridarevenue.com/Forms_library/current/brochure/gt800025.pdf' }
};

const NY_SOURCES = {
  transfer: { label: 'NYS DMV: Buy, Sell, or Transfer Vehicle Ownership', url: 'https://dmv.ny.gov/titles/buy-sell-or-transfer-vehicle-ownership' },
  register: { label: 'NYS DMV: Register and Title a Vehicle', url: 'https://dmv.ny.gov/registration/register-and-title-a-vehicle' },
  fees: { label: 'NYS DMV: Passenger Vehicle Registration Fees, Use Taxes and Supplemental Fees', url: 'https://dmv.ny.gov/registration/passenger-vehicle-registration-fees-use-taxes-and-supplemental-fees' },
  salesTax: { label: 'NYS DMV: Sales Tax Information', url: 'https://dmv.ny.gov/registration/sales-tax-information' },
  outOfState: { label: 'NYS DMV: Register an Out-of-State Vehicle', url: 'https://dmv.ny.gov/registration/register-an-out-of-state-vehicle' },
  rates: { label: 'NYS Tax Department: Publication 718, Sales and Use Tax Rates by Jurisdiction', url: 'https://www.tax.ny.gov/pdf/publications/sales/pub718.pdf' }
};

const IL_SOURCES = {
  rut50: { label: 'Illinois Department of Revenue: Form RUT-50 Instructions', url: 'https://tax.illinois.gov/forms/sales/vehicleusetax/rut-50-instructions.html' },
  rut5: { label: 'Illinois Department of Revenue: Private Party Vehicle Tax Chart (RUT-5)', url: 'https://tax.illinois.gov/content/dam/soi/en/web/tax/forms/sales/documents/vehicleusetax/rut-5.pdf' },
  fees: { label: 'Illinois SOS: Fees', url: 'https://www.ilsos.gov/departments/vehicles/basicfees.html' },
  newResident: { label: 'Illinois SOS: Vehicle Titles and License Plates for New Illinois Residents', url: 'https://www.ilsos.gov/services/newresidents/vehicle-titles-and-license-plates-for-new-illinois-residents.html' }
};

const OH_SOURCES = {
  salesTax: { label: 'Ohio Department of Taxation: Sales Tax for Motor Vehicles', url: 'https://tax.ohio.gov/business/sales-and-use-tax/motor-vehicles' },
  rates: { label: 'Ohio Department of Taxation: Sales and Use Tax Rates by County, October to December 2026', url: 'https://tax.ohio.gov/business/sales-and-use-tax/rate-tables/by-county-q4-2026' },
  fees: { label: 'Ohio BMV: Documents and Fees', url: 'https://bmv.ohio.gov/doc-fees.aspx' },
  titles: { label: 'Ohio BMV: Vehicle Titles', url: 'https://bmv.ohio.gov/titles-new.aspx' },
  newResident: { label: 'Ohio BMV: New Ohio Residents', url: 'https://www.bmv.ohio.gov/new-to-ohio.aspx' },
  titleFee: { label: 'Ohio Revised Code 4505.09: Title fees', url: 'https://codes.ohio.gov/ohio-revised-code/section-4505.09' },
  exemption: { label: 'Ohio Administrative Code 5703-9-10: Exemption certificates at title', url: 'https://codes.ohio.gov/ohio-administrative-code/rule-5703-9-10' }
};

export const GUIDES: Guide[] = [
  {
    slug: 'how-to-title-a-private-car-sale-in-maryland',
    stateKey: 'maryland',
    title: 'How to Title a Private Car Sale in Maryland',
    shortTitle: 'Title a private car sale',
    metaTitle: 'How to Title a Private Car Sale in Maryland',
    metaDescription:
      'Step-by-step guide to titling a car bought from a private seller in Maryland: the title, bill of sale, safety inspection, 6.5% excise tax, $200 title fee, and what to bring to the MVA.',
    cardDescription: 'Title, bill of sale, inspection, excise tax, and what to bring to the MVA.',
    intro: [
      'When you buy a car from a private seller in Maryland, the seller does not file any paperwork for you. You handle the inspection, titling, and registration yourself.',
      'Here is the order to do it in, what each step costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'Maryland MVA',
    steps: [
      {
        title: 'Check the title before you pay',
        body: [
          'Ask to see the seller’s original Maryland Certificate of Title, in the seller’s name. Any lien shown on the title must be released before the sale.',
          'If the title is missing, altered, or incomplete, the MVA may not be able to process your application.'
        ]
      },
      {
        title: 'Have the seller complete the back of the title',
        body: [
          'The seller fills in your name and address, the sale price, the date of sale, and the odometer reading (required by federal law), then signs and dates the title.',
          'If more than one owner is listed, all owners must sign unless the names are joined by “OR.” Do not cross out or alter anything; errors can get the title rejected.'
        ]
      },
      {
        title: 'Get a bill of sale',
        body: [
          'A bill of sale is not always required, but the MVA strongly recommends one. List both names, the vehicle information, the sale price, the date, and both signatures.',
          'Since October 1, 2026, a notarized bill of sale is no longer required for a private sale of a vehicle under 7 years old.'
        ]
      },
      {
        title: 'Let the seller keep the plates',
        body: [
          'In Maryland, license plates stay with the seller, not the car. Do not drive on the seller’s plates.',
          'If the car still needs its inspection, you may qualify for a 30-day temporary registration ($50) so you can legally drive it to an inspection station.'
        ]
      },
      {
        title: 'Get a Maryland safety inspection',
        body: [
          'Most used vehicles must pass a Maryland safety inspection before they can be titled and registered. Inspections are done at stations licensed by the Maryland State Police, not at every repair shop.',
          'The inspection certificate is valid for 90 days from the date it is issued.'
        ]
      },
      {
        title: 'Insure the car',
        body: ['You must have Maryland auto insurance before you can register the vehicle. Add it to your policy through your insurer.']
      },
      {
        title: 'Title and register at the MVA',
        body: [
          'Apply in person at an MVA branch (schedule an appointment) or by mail. By mail, every form, document, and fee must be included, and processing can take longer.',
          'In many cases you can title and register at the same time. You pay the excise tax, the $200 title fee, and the registration fee, plus a $40 lien fee if the purchase is financed. Your new title is mailed to you.'
        ]
      }
    ],
    sections: [
      {
        heading: 'How the 6.5% excise tax is calculated',
        intro: 'Maryland charges a 6.5% excise tax when you title the car. What it is charged on depends on the car’s age:',
        items: [
          'Vehicles 7 or more years old: 6.5% of the purchase price or a minimum value of $640, whichever is greater. The minimum tax is $41.60.',
          'Vehicles under 7 years old: 6.5% of the purchase price, as long as the price is within $500 of the NADA value the MVA uses. If the price is more than $500 below that value, the MVA may tax the NADA value instead.',
          'You can support a lower price with documents such as a bill of sale, records of the car’s condition, canceled checks or bank statements, or the ad or messages showing the agreed price.'
        ]
      }
    ],
    checklist: [
      'Certificate of Title Application (Form VR-005)',
      'The original title, signed over to you by the seller',
      'Proof of the purchase price, such as a bill of sale',
      'Odometer disclosure, if applicable',
      'Maryland Safety Inspection Certificate (issued within the last 90 days)',
      'Valid identification',
      'Lien release, if a lien was listed on the title',
      'Proof of Maryland auto insurance',
      'Payment for the excise tax, title fee, and registration fee'
    ],
    calculatorNote:
      'Enter the price you paid and the model year. If the car is under 7 years old and you paid well below book value, add the book value to see whether Maryland may tax it instead.',
    faqs: [
      {
        question: 'Do I need a notarized bill of sale to title a car in Maryland?',
        answer:
          'No. Since October 1, 2026, a notarized bill of sale is no longer required for a private sale of a vehicle under 7 years old. A bill of sale is still strongly recommended, and it can help support the price you paid.'
      },
      {
        question: 'What if I paid much less than book value?',
        answer:
          'For a vehicle under 7 years old, the MVA taxes the price you report if it is within $500 of the NADA value. If your price is more than $500 below it, the MVA may tax the NADA value instead, unless you provide documentation that supports the lower price.'
      },
      {
        question: 'Can I drive the car home on the seller’s plates?',
        answer:
          'No. Maryland plates stay with the seller, who returns them to the MVA. If the car needs its safety inspection first, you may qualify for a 30-day temporary registration so you can drive it to the inspection station.'
      },
      {
        question: 'How long is a Maryland safety inspection certificate good for?',
        answer: 'The certificate is valid for 90 days from the date it is issued.'
      }
    ],
    sources: [SOURCES.privateParty, SOURCES.buying, SOURCES.selling, SOURCES.exciseTax, SOURCES.billOfSale, SOURCES.inspection, SOURCES.fees]
  },
  {
    slug: 'how-to-gift-a-car-in-maryland',
    stateKey: 'maryland',
    title: 'How to Gift a Car in Maryland',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in Maryland',
    metaDescription:
      'How to give or receive a car as a gift in Maryland: which family members qualify for the excise tax exemption, the VR-103 gift certification, inspection rules, and titling steps.',
    cardDescription: 'Which family gifts skip the excise tax, Form VR-103, and inspection rules.',
    intro: [
      'Maryland does not charge the 6.5% excise tax on many gifts between family members, but the exemption is not automatic. The relationship has to qualify, no money can change hands, and you have to document it on the MVA’s gift certification form.',
      'Here is who qualifies and how to transfer the title.'
    ],
    lastVerified: 'October 2026',
    agency: 'Maryland MVA',
    steps: [
      {
        title: 'Check that the relationship qualifies',
        body: [
          'The gift certification (Form VR-103) lists these relationships: spouse; mother or father; stepmother or stepfather; son or daughter, including adopted children and stepchildren; brother or sister, including half-siblings; grandmother, grandfather, or grandchild; and mother-in-law, father-in-law, son-in-law, or daughter-in-law.',
          'An aunt or uncle can also gift a car tax-free to a niece or nephew if the aunt or uncle is at least 65 years old.'
        ]
      },
      {
        title: 'Make sure the car is titled in Maryland',
        body: [
          'The gift certification can be used only for vehicles titled in Maryland. The title must show no liens, or come with a lien release.'
        ]
      },
      {
        title: 'Sign the title over as a gift',
        body: [
          'The person giving the car enters the recipient as the buyer, writes “GIFT” where the sale price goes, records the odometer reading, and signs and dates the title.',
          'The giver keeps the license plates and returns them to the MVA. The recipient registers the car with new plates.'
        ]
      },
      {
        title: 'Complete the Gift Certification (Form VR-103)',
        body: [
          'Both the giver and the recipient complete their sections and certify that no money or other valuable consideration is involved.',
          'If your last names are not the same, include proof of the relationship, such as a birth or marriage certificate. For an aunt or uncle gift where proof is not available, also complete Form VR-299.'
        ]
      },
      {
        title: 'Get a safety inspection if one is required',
        body: [
          'Transfers between spouses or between a parent and child are generally exempt from inspection. All other transfers require a Maryland safety inspection at a station licensed by the Maryland State Police.'
        ]
      },
      {
        title: 'Insure, title, and register',
        body: [
          'Get Maryland auto insurance, then title and register the car in the recipient’s name at the MVA. A qualifying gift skips the excise tax, but title and registration fees still apply.'
        ]
      }
    ],
    sections: [
      {
        heading: 'When excise tax is still owed',
        items: [
          'The relationship is not on the list (for example, a cousin or a friend).',
          'Money or anything else of value is exchanged for the car.',
          'The vehicle is not titled in Maryland.',
          'The paperwork is incomplete. The MVA says gift exemptions must be documented and are not automatic.',
          'If a transfer does not qualify, the recipient may need to pay excise tax. Contact the MVA (410-768-7000) to confirm how the vehicle will be valued.'
        ]
      }
    ],
    checklist: [
      'The original Maryland title, signed by the giver, with “GIFT” as the sale price',
      'Gift Certification (Form VR-103), completed by the giver and the recipient',
      'Proof of relationship if your last names differ (or Form VR-299 for an aunt or uncle gift)',
      'Lien release, if a lien was listed on the title',
      'Maryland Safety Inspection Certificate, unless the transfer is between spouses or a parent and child',
      'Certificate of Title Application (Form VR-005)',
      'Valid identification and proof of Maryland auto insurance',
      'Payment for the title and registration fees'
    ],
    calculatorNote:
      'For a qualifying family gift, enter $0 as the price. The calculator then shows only the title and registration costs.',
    faqs: [
      {
        question: 'Do I pay excise tax on a car gifted by my parent in Maryland?',
        answer:
          'Not if the car is titled in Maryland, no money changes hands, and you file the Gift Certification (Form VR-103). Parents, stepparents, and children are all on the list of qualifying relationships.'
      },
      {
        question: 'Can a brother or sister gift me a car tax-free?',
        answer:
          'Yes. Brothers, sisters, and half-siblings are qualifying relationships on Form VR-103. Unlike spouse and parent-child transfers, a sibling gift still needs a Maryland safety inspection.'
      },
      {
        question: 'Does a gifted car need a safety inspection?',
        answer:
          'Transfers between spouses or between a parent and child are generally exempt. All other gift transfers require a Maryland safety inspection.'
      },
      {
        question: 'What if the car is from a cousin or a friend?',
        answer:
          'Those relationships are not on the MVA’s list, so the excise tax exemption does not apply and the recipient may need to pay excise tax. Contact the MVA to confirm how the vehicle will be valued.'
      }
    ],
    sources: [SOURCES.gift, SOURCES.giftForm, SOURCES.auntUncleForm, SOURCES.inspection, SOURCES.privateParty, SOURCES.exciseTax, SOURCES.fees]
  },
  {
    slug: 'titling-a-car-in-maryland-after-moving-from-another-state',
    stateKey: 'maryland',
    title: 'Titling a Car in Maryland After Moving From Another State',
    shortTitle: 'Title a car after moving to Maryland',
    metaTitle: 'Titling Your Car After Moving to Maryland',
    metaDescription:
      'New to Maryland? Title and register your car within 60 days of moving. Covers the excise tax credit for tax paid to your old state, the safety inspection, and the documents to bring.',
    cardDescription: 'The 60-day deadline, the excise tax credit, inspection, and documents.',
    intro: [
      'If you move to Maryland with a car titled in another state, you have 60 days to title and register it here. Doing it on time also keeps the credit for the titling tax you already paid to your old state.',
      'Here is what to do, what you will pay, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'Maryland MVA',
    steps: [
      {
        title: 'Mark the 60-day deadline',
        body: [
          'You must update the vehicle’s title and registration within 60 days of moving to Maryland. Missing the deadline disqualifies you from the credit for titling tax paid in another state, and you may be cited for an out-of-state registration.',
          'Under a law that took effect October 1, 2026, the MVA can also charge Maryland residents whose vehicles are still registered in another state $7 per day, up to $420, if the vehicle is not titled in Maryland within the 60-day compliance period.'
        ]
      },
      {
        title: 'Get Maryland auto insurance',
        body: ['Bring your Maryland insurance company name, policy or binder number, and agent’s name (if you have one) to your appointment.']
      },
      {
        title: 'Get a Maryland safety inspection',
        body: [
          'You need a valid Maryland Safety Inspection Certificate to title and register the car. Inspections are done at stations licensed by the Maryland State Police, and the certificate is valid for 90 days.',
          'The inspection is not required if the car was previously titled in Maryland in your name and you are returning with it.'
        ]
      },
      {
        title: 'Book an MVA appointment',
        body: [
          'You need an appointment to title and register a vehicle as a new resident. If you did not complete the MVA’s pre-application, bring a completed Form VR-005.'
        ]
      },
      {
        title: 'Pay the excise tax, with credit for tax paid to your old state',
        body: [
          'How much you pay depends on how long ago you moved, the car’s model year, and your old state’s tax rate. See the breakdown below.'
        ]
      },
      {
        title: 'Watch for your emissions notice',
        body: [
          'Emissions (VEIP) testing is not done at the safety inspection. You will receive a VEIP notice about three months after registering the car.'
        ]
      }
    ],
    sections: [
      {
        heading: 'How the excise tax credit works',
        intro: 'If you moved within the last 60 days:',
        items: [
          'Vehicle 6 model years old or newer, old state’s rate 6.5% or higher: you pay $100.',
          'Vehicle 6 model years old or newer, old state’s rate below 6.5%: you pay the difference between that rate and Maryland’s 6.5%. For example, coming from a 4% state you pay 2.5% of the car’s retail value.',
          'Old state had no tax (0%): you pay 6.5% of the retail value for a vehicle 6 model years old or newer.',
          'Vehicle 7 model years old or older: you pay $41.60.',
          'If you moved more than 60 days ago, the credit is gone: 6.5% of the retail value for a vehicle 6 model years old or newer, or $41.60 for one 7 model years or older.',
          'Retail value is the NADA clean retail value. Active-duty service members are exempt from the excise tax on a vehicle titled in their name, with proof of active-duty status.'
        ]
      }
    ],
    checklist: [
      'A valid Maryland driver’s license, or proof of a valid Maryland residential address',
      'Your out-of-state title and registration card',
      'Certificate of Title Application (Form VR-005), unless you completed the pre-application',
      'Maryland Safety Inspection Certificate',
      'Maryland insurance company name, policy or binder number, and agent’s name',
      'If the car is leased or has a lien: the lienholder’s fax number, account number, and mailing information',
      'If the car is leased: a copy of the lease or a letter from the leasing company showing taxes paid to your old state',
      'A check or money order for taxes and fees'
    ],
    calculatorNote:
      'The calculator is built for a purchase, so it charges 6.5% of the price you enter. To see just your title and registration costs, enter $0 as the price, then add the excise tax from the credit rules above.',
    faqs: [
      {
        question: 'How long do I have to title my car after moving to Maryland?',
        answer:
          '60 days from moving to Maryland. Missing the deadline costs you the credit for titling tax paid to your old state, and you may be cited for an out-of-state registration.'
      },
      {
        question: 'Do I have to pay Maryland excise tax again?',
        answer:
          'If you title within 60 days, you get credit for tax paid to your old state. For a vehicle 6 model years old or newer, you pay $100 if your old state’s rate was 6.5% or higher, or the difference if it was lower. Vehicles 7 model years or older pay $41.60.'
      },
      {
        question: 'Do I need an emissions test before I register?',
        answer:
          'No. Emissions (VEIP) testing is not part of the safety inspection. You will receive a VEIP notice about three months after you register.'
      },
      {
        question: 'Are military members exempt from the excise tax?',
        answer:
          'Active-duty service members are exempt from the Maryland excise tax on a vehicle titled in their name. Bring proof of active-duty status, such as official orders in the owner’s name or a DD-214.'
      }
    ],
    sources: [SOURCES.newResident, SOURCES.exciseTax, SOURCES.oct2026, SOURCES.inspection, SOURCES.fees]
  },
  {
    slug: 'how-to-title-a-private-car-sale-in-virginia',
    stateKey: 'virginia',
    title: 'How to Title a Private Car Sale in Virginia',
    shortTitle: 'Title a private car sale',
    metaTitle: 'How to Title a Private Car Sale in Virginia',
    metaDescription:
      'Step-by-step guide to titling a car bought from a private seller in Virginia: the title, the 4.15% sales and use tax, the $15 title fee, the 30-day deadline, inspection, and registration.',
    cardDescription: 'Title, the 4.15% sales and use tax, the 30-day deadline, and inspection.',
    intro: [
      'When you buy a car from a private seller in Virginia, the seller signs the title over to you and you title and register the car with the DMV.',
      'Here is the order to do it in, what it costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'Virginia DMV',
    steps: [
      {
        title: 'Check the title before you pay',
        body: [
          'Make sure the title is complete and accurate, including the seller’s odometer reading and signature. The DMV suggests checking the vehicle’s history through the National Motor Vehicle Title Information System (NMVTIS) first.'
        ]
      },
      {
        title: 'Have the seller complete Section A of the title',
        body: [
          'The seller enters your name and address, the odometer reading from the vehicle (not an estimate), the date of sale, and the sale price, then prints and signs. All owners listed on the title must sign.',
          'The sale price on the title serves as the bill of sale.'
        ]
      },
      {
        title: 'Let the seller keep the plates',
        body: [
          'The seller removes the license plates before you take the car. You can buy new plates or transfer plates from another of your vehicles.'
        ]
      },
      {
        title: 'Insure the car',
        body: ['Get liability insurance on the car before you register it. You certify the coverage on the registration section of the title.']
      },
      {
        title: 'Complete your sections of the title',
        body: [
          'Sign and print your name as buyer in Section A, then complete the remaining buyer sections on the back, including the lien section if the car is financed and the registration section if you are registering at the same time.'
        ]
      },
      {
        title: 'Title and register within 30 days',
        body: [
          'Virginia law requires you to send the title to the DMV with your application within 30 days. You can drop it off or make an appointment at a DMV customer service center, go to a DMV Select, or mail it.',
          'If the car already has a Virginia title and no lien, you and the seller can transfer it completely online, as long as both of you have myDMV accounts.',
          'You pay the 4.15% sales and use tax, the $15 title fee, and the registration fee ($30.75 a year for a passenger vehicle of 4,000 lbs or less, $35.75 up to 6,500 lbs). Recording a lien adds $15.'
        ]
      },
      {
        title: 'Check the inspection sticker',
        body: [
          'A vehicle must pass an annual safety inspection and display a valid inspection sticker to be driven in Virginia. If the car is kept in Arlington, Fairfax, Loudoun, Prince William, or Stafford County, or the cities of Alexandria, Fairfax, Falls Church, Manassas, or Manassas Park, it also needs an emissions inspection to register.',
          'Some localities also require their own vehicle registration or decal. Check with your city or county.'
        ]
      }
    ],
    sections: [
      {
        heading: 'How the 4.15% sales and use tax is calculated',
        intro: 'Virginia charges a 4.15% Sales and Use Tax (SUT) when you title the car:',
        items: [
          'The tax is 4.15% of the gross sales price or $75, whichever is greater.',
          'Trade-in credits do not reduce the taxable price.',
          'Vehicles under 5 model years old: if the sale price is not within $1,500 of the NADA trade-in value, you must submit an Affidavit for Procurement of Title (Form SUT-1A).',
          'Vehicles over 5 years old: if the price on the title is blank or incorrect, submit a Vehicle Price Certification (SUT 1) or a handwritten bill of sale signed by both of you with the price, year, make, model, VIN, and date of sale.'
        ]
      }
    ],
    checklist: [
      'The Virginia title, signed over to you, with your buyer sections completed',
      'Proof of the price if needed (bill of sale or Vehicle Price Certification, Form SUT 1)',
      'Form SUT-1A, if the car is under 5 model years old and the price is not within $1,500 of NADA trade-in value',
      'Proof of liability insurance (certified on the title’s registration section)',
      'Emissions inspection, if the car is kept in a Northern Virginia emissions locality',
      'Payment for the sales and use tax, title fee, and registration fee'
    ],
    calculatorNote:
      'Enter the price you paid and choose the weight class. The calculator applies the $75 minimum tax automatically.',
    faqs: [
      {
        question: 'How long do I have to title a car I bought privately in Virginia?',
        answer:
          '30 days. Virginia law (Code of Virginia § 46.2-630) requires the buyer to send the signed title to the DMV with an application for title and registration within 30 days.'
      },
      {
        question: 'Do I need a separate bill of sale in Virginia?',
        answer:
          'Usually not. The sale price the seller writes on the title serves as the bill of sale. If it is blank or incorrect, you can submit a Vehicle Price Certification (SUT 1) or a handwritten bill of sale signed by both of you.'
      },
      {
        question: 'Can I transfer a Virginia title online?',
        answer:
          'Yes, if the car already has a Virginia title and no lien, and both you and the seller have myDMV accounts.'
      },
      {
        question: 'What if I paid much less than book value?',
        answer:
          'For a vehicle under 5 model years old, you need an Affidavit for Procurement of Title (Form SUT-1A) if the sale price is not within $1,500 of the NADA trade-in value.'
      }
    ],
    sources: [VA_SOURCES.buySell, VA_SOURCES.title, VA_SOURCES.sut, VA_SOURCES.fees, VA_SOURCES.registration, VA_SOURCES.newResident, VA_SOURCES.code630]
  },
  {
    slug: 'how-to-gift-a-car-in-virginia',
    stateKey: 'virginia',
    title: 'How to Gift a Car in Virginia',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in Virginia',
    metaDescription:
      'How to give or receive a car as a gift in Virginia: who qualifies for the sales and use tax exemption, Form SUT 3, what non-qualifying relatives pay, and titling steps.',
    cardDescription: 'Who skips the sales and use tax, Form SUT 3, and what others pay.',
    intro: [
      'Virginia exempts a gift from its 4.15% Sales and Use Tax only for a few close relationships. Everyone else pays tax based on the car’s value, even when no money changes hands.',
      'Here is who qualifies and how to transfer the title.'
    ],
    lastVerified: 'October 2026',
    agency: 'Virginia DMV',
    steps: [
      {
        title: 'Check that the relationship qualifies',
        body: [
          'The exemption covers a gift to a spouse, or to a son, daughter, or parent of the owner. For this exemption, “child” and “parent” include only biological and adopted relationships.',
          'Stepchildren, stepparents, brothers and sisters, grandparents, and friends do not qualify.'
        ]
      },
      {
        title: 'Sign the title over as a gift',
        body: [
          'The giver completes Section A of the title with the recipient’s name and address, the odometer reading, and the date, and writes “gift” where the sale price goes. All owners listed on the title must sign.'
        ]
      },
      {
        title: 'Complete the Purchaser’s Statement of Tax Exemption (Form SUT 3)',
        body: [
          'The form certifies that the car was received as a gift and states the recipient’s relationship to the giver.',
          'Except for a gift to a spouse, the exemption does not cover any loan or other obligation the recipient takes over.'
        ]
      },
      {
        title: 'Keep or replace the plates',
        body: ['The giver removes the license plates. The recipient buys new plates or transfers plates from another of their vehicles.']
      },
      {
        title: 'Insure, title, and register within 30 days',
        body: [
          'Get liability insurance, then title and register the car with the DMV within 30 days. The $15 title fee and the registration fee still apply. The car must display a valid safety inspection sticker to be driven.'
        ]
      }
    ],
    sections: [
      {
        heading: 'When a gift is still taxed',
        items: [
          'The recipient is not a spouse or a biological or adopted child or parent (for example, a stepchild, sibling, grandchild, or friend).',
          'Without a sale price, the tax is based on the NADA trade-in value, or the $75 minimum, whichever is greater.',
          'The recipient takes over a loan on the car, unless the gift is to a spouse.'
        ]
      }
    ],
    checklist: [
      'The Virginia title, signed by the giver, with “gift” as the sale price',
      'Purchaser’s Statement of Tax Exemption (Form SUT 3), for a spouse, child, or parent',
      'Proof of liability insurance',
      'Emissions inspection, if the car is kept in a Northern Virginia emissions locality',
      'Payment for the title and registration fees (and the sales and use tax if the gift does not qualify)'
    ],
    calculatorNote:
      'For a qualifying gift, enter $0 as the price to see only the title and registration costs. If the gift does not qualify, enter the car’s NADA trade-in value as the price.',
    faqs: [
      {
        question: 'Do I pay sales tax on a car my parent gives me in Virginia?',
        answer:
          'No, if you are the parent’s biological or adopted child, no money changes hands, and you file the Purchaser’s Statement of Tax Exemption (Form SUT 3).'
      },
      {
        question: 'Is a gift from a stepparent or sibling tax-free in Virginia?',
        answer:
          'No. Only spouses and biological or adopted children and parents qualify. Other gifts are taxed on the NADA trade-in value or the $75 minimum, whichever is greater.'
      },
      {
        question: 'What do I write as the sale price for a gift?',
        answer: 'The giver writes “gift” where the sale price goes on the title.'
      },
      {
        question: 'How long do I have to title a gifted car?',
        answer: '30 days. Virginia law requires the new owner to send the title to the DMV with an application within 30 days.'
      }
    ],
    sources: [VA_SOURCES.giftForm, VA_SOURCES.buySell, VA_SOURCES.sut, VA_SOURCES.title, VA_SOURCES.fees, VA_SOURCES.code630]
  },
  {
    slug: 'titling-a-car-in-virginia-after-moving-from-another-state',
    stateKey: 'virginia',
    title: 'Titling a Car in Virginia After Moving From Another State',
    shortTitle: 'Title a car after moving to Virginia',
    metaTitle: 'Titling Your Car After Moving to Virginia',
    metaDescription:
      'New to Virginia? Title and register your car within 30 days of moving. Covers the sales and use tax exemption for cars titled in your name, inspections, insurance, and documents.',
    cardDescription: 'The 30-day deadline, the tax exemption, inspections, and documents.',
    intro: [
      'If you move to Virginia with a car titled in another state, you have 30 days to title it here, then register it.',
      'Here is what to do and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'Virginia DMV',
    steps: [
      {
        title: 'Mark the 30-day deadline',
        body: ['You must title your vehicle within 30 days of moving to Virginia. Titling comes first, then registration.']
      },
      {
        title: 'Get Virginia liability insurance',
        body: [
          'You must keep at least Virginia’s minimum liability coverage from the time you register. Registering without insurance carries a $600 noncompliance fee, and your license and registration are suspended until you pay a $145 reinstatement fee.'
        ]
      },
      {
        title: 'Title the car',
        body: [
          'Apply online or with the paper Application for Title and Registration (Form VSA 17A). Bring proof of address and your previous state’s title or registration card. If you bought the car within the last 12 months, also bring proof of the purchase price.'
        ]
      },
      {
        title: 'Check whether you owe sales and use tax',
        body: [
          'If you hold a valid title or registration in your name from another state or a U.S. Armed Forces branch, you are generally exempt from Virginia’s Sales and Use Tax.',
          'If you bought the car within the last 12 months, you must show that sales and use tax was paid elsewhere to qualify.'
        ]
      },
      {
        title: 'Register and get inspected',
        body: [
          'Register at a DMV customer service center within 30 days of moving. The car must pass an annual safety inspection and display a valid sticker.',
          'If the car is kept in Arlington, Fairfax, Loudoun, Prince William, or Stafford County, or the cities of Alexandria, Fairfax, Falls Church, Manassas, or Manassas Park, it must also pass an emissions inspection before it can be registered, unless it has a valid emissions certificate from the last 12 months.'
        ]
      },
      {
        title: 'Buy a local decal if your locality requires one',
        body: ['Some localities require new residents to buy a local sticker or decal within 30 days of moving. These come from your local Commissioner of the Revenue, Treasurer, or Director of Finance, not the DMV.']
      }
    ],
    checklist: [
      'Application for Title and Registration (Form VSA 17A), or the online application',
      'Proof of your Virginia address',
      'Your previous state’s title or registration card in your name',
      'Proof of the purchase price, and of sales tax paid elsewhere, if you bought the car within the last 12 months',
      'Proof of Virginia liability insurance',
      'Emissions inspection, if required in your locality',
      'Payment for the $15 title fee and the registration fee'
    ],
    calculatorNote:
      'If you are exempt from the sales and use tax, enter $0 as the price to see only the title and registration costs.',
    faqs: [
      {
        question: 'How long do I have to title my car after moving to Virginia?',
        answer: '30 days. You must title the vehicle within 30 days of moving to Virginia, then register it.'
      },
      {
        question: 'Do I pay Virginia sales tax on a car I already own?',
        answer:
          'Generally no, if you hold a valid title or registration in your name from another state. If you bought the car within the last 12 months, you must show that sales and use tax was paid elsewhere.'
      },
      {
        question: 'Do I need an emissions inspection?',
        answer:
          'Only if the car is kept in one of the Northern Virginia emissions localities: Arlington, Fairfax, Loudoun, Prince William, or Stafford County, or the cities of Alexandria, Fairfax, Falls Church, Manassas, or Manassas Park. A valid emissions certificate from the last 12 months can count for a first-time registration.'
      },
      {
        question: 'What if I register without insurance?',
        answer:
          'You pay a $600 noncompliance fee, and your license and registration are suspended until you pay a $145 reinstatement fee.'
      }
    ],
    sources: [VA_SOURCES.newResident, VA_SOURCES.title, VA_SOURCES.sut, VA_SOURCES.registration, VA_SOURCES.fees]
  },
  {
    slug: 'how-to-title-a-private-car-sale-in-pennsylvania',
    stateKey: 'pennsylvania',
    title: 'How to Title a Private Car Sale in Pennsylvania',
    shortTitle: 'Title a private car sale',
    metaTitle: 'How to Title a Private Car Sale in Pennsylvania',
    metaDescription:
      'Step-by-step guide to a private car sale in Pennsylvania: meeting at a PennDOT agent, the notarized title, 6% sales tax (7% Allegheny, 8% Philadelphia), fees, plates, and inspection.',
    cardDescription: 'The agent visit, notarized title, sales tax, fees, and inspection.',
    intro: [
      'In Pennsylvania, the buyer and seller complete a private sale together at an authorized PennDOT agent, who files the title and registration for you.',
      'Here is how it works, what it costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'PennDOT',
    steps: [
      {
        title: 'Meet the seller at an authorized PennDOT agent',
        body: [
          'Most notaries, tag services, and dealers are authorized agents. The seller’s signature on a Pennsylvania title must be notarized or verified, so the seller signs in front of the agent.'
        ]
      },
      {
        title: 'Complete the title together',
        body: [
          'The seller lists your name and address, discloses the odometer reading, and signs and prints their name. You sign and print your name and complete Section D on the front of the title, including the lien information if the car is financed.'
        ]
      },
      {
        title: 'Pay the sales tax and fees',
        body: [
          'Sales tax is 6% of the purchase price or the car’s current market value (7% for Allegheny County residents, 8% for City of Philadelphia residents). The agent collects it with the title fee ($72), any lien fee ($36 per lien), and registration ($48 a year for a passenger car).',
          'Agents may add their own service fee, which varies by agent.'
        ]
      },
      {
        title: 'Get a plate',
        body: [
          'The seller removes their plate and keeps it. The agent can transfer a plate from another of your vehicles, or issue a temporary registration valid for 90 days if you have no plate to transfer.',
          'You need proof of Pennsylvania insurance, such as an insurance ID card or declaration page, before a temporary plate or plate transfer.'
        ]
      },
      {
        title: 'Let the agent file within 20 days',
        body: ['The agent must submit the completed application and documents to PennDOT within 20 days of the sale.']
      },
      {
        title: 'Inspect within 10 days',
        body: [
          'A used vehicle must be inspected within 10 days of the sale unless it already displays a valid inspection sticker. Some counties also require an annual emissions inspection.'
        ]
      }
    ],
    sections: [
      {
        heading: 'How Pennsylvania sales tax is calculated',
        items: [
          '6% statewide, 7% for Allegheny County residents, and 8% for City of Philadelphia residents.',
          'The tax is on the purchase price or the current market value of the vehicle.',
          'If the car sells far below its fair market value, the agent completes Form MV-3 (Verification of Fair Market Value), and the Department of Revenue may review sales between family members priced well below fair market value.',
          'Trade-in credits apply only when a dealer takes a trade-in, not in a private sale.'
        ]
      }
    ],
    checklist: [
      'The seller, in person, to sign the Pennsylvania title in front of the agent',
      'Proof of Pennsylvania insurance (insurance ID card, declaration page, or signed binder)',
      'Lien information, if the car is financed',
      'For a car titled in another state: the seller’s signed title (some require notarization) and a tracing of the VIN plate',
      'Payment for the sales tax, title, lien, and registration fees, plus the agent’s service fee'
    ],
    calculatorNote:
      'The calculator shows a 6% to 8% range for the sales tax. Allegheny County residents pay 7% and City of Philadelphia residents pay 8%.',
    faqs: [
      {
        question: 'Does the seller’s signature have to be notarized in Pennsylvania?',
        answer:
          'Yes. The seller’s signature on a Pennsylvania title must be notarized or verified, which is why buyer and seller meet at an authorized PennDOT agent such as a notary, tag service, or dealer.'
      },
      {
        question: 'How long do I have to title a car I bought privately in Pennsylvania?',
        answer: 'You complete the transfer at the agent, and the agent must submit the application to PennDOT within 20 days of the sale.'
      },
      {
        question: 'What is the sales tax in Philadelphia?',
        answer: '8% for City of Philadelphia residents, compared with 7% in Allegheny County and 6% in the rest of Pennsylvania.'
      },
      {
        question: 'Can I drive the car home on the seller’s plate?',
        answer:
          'No. The plate stays with the seller. The agent can transfer a plate from another of your vehicles or issue a temporary registration valid for 90 days.'
      }
    ],
    sources: [PA_SOURCES.buySell, PA_SOURCES.buySellFactSheet, PA_SOURCES.fees, PA_SOURCES.agentHandbook]
  },
  {
    slug: 'how-to-gift-a-car-in-pennsylvania',
    stateKey: 'pennsylvania',
    title: 'How to Gift a Car in Pennsylvania',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in Pennsylvania',
    metaDescription:
      'How to give or receive a car as a gift in Pennsylvania: the Affidavit of Gift (MV-13ST), when sales tax does not apply, gifts of out-of-state cars, and titling at a PennDOT agent.',
    cardDescription: 'The Affidavit of Gift, when no sales tax applies, and titling.',
    intro: [
      'Pennsylvania does not charge sales tax on a true gift, whoever the recipient is, when both sides sign the Affidavit of Gift. A sale between family members is still taxed.',
      'Here is how to transfer a gifted car.'
    ],
    lastVerified: 'October 2026',
    agency: 'PennDOT',
    steps: [
      {
        title: 'Make sure it is a true gift',
        body: [
          'A gift is a vehicle transferred without consideration or compensation: no money, property, or service in exchange, and no forgiveness or waiver of a debt or obligation.'
        ]
      },
      {
        title: 'Meet at an authorized PennDOT agent',
        body: [
          'The giver signs the title in front of a notary, tag service, or dealer, because the seller’s signature on a Pennsylvania title must be notarized or verified.'
        ]
      },
      {
        title: 'Complete the Affidavit of Gift (Form MV-13ST)',
        body: [
          'All givers and all recipients complete the affidavit, which is attached to the title application to claim the gift exemption from sales tax. It asks whether you are related and how.'
        ]
      },
      {
        title: 'Check the out-of-state rule',
        body: [
          'A car with an out-of-state title can also be gifted. The giver must show that sales tax was paid on it in a state that is reciprocal with Pennsylvania; otherwise tax is due on its current fair market value.'
        ]
      },
      {
        title: 'Insure, pay fees, and inspect',
        body: [
          'Bring proof of Pennsylvania insurance. The $72 title fee and registration still apply, and the agent may add a service fee. The car must be inspected within 10 days unless it has a valid inspection sticker.'
        ]
      }
    ],
    sections: [
      {
        heading: 'When tax is still owed',
        items: [
          'Anything of value changes hands, including taking over or forgiving a debt.',
          'A family sale at a low price: the Department of Revenue may review sales between family members priced well below fair market value.',
          'An out-of-state car without proof that sales tax was paid in a reciprocal state.'
        ]
      }
    ],
    checklist: [
      'The title, signed by the giver in front of the agent',
      'Affidavit of Gift (Form MV-13ST), completed by every giver and recipient',
      'For an out-of-state title: proof that sales tax was paid in a reciprocal state',
      'Proof of Pennsylvania insurance',
      'Payment for the title and registration fees and the agent’s service fee'
    ],
    calculatorNote: 'For a gift that qualifies, enter $0 as the price. The calculator then shows only the title and registration costs.',
    faqs: [
      {
        question: 'Who can I gift a car to tax-free in Pennsylvania?',
        answer:
          'Anyone, as long as it is a true gift with nothing of value in exchange and both of you complete the Affidavit of Gift (Form MV-13ST). The form asks about your relationship but does not limit the exemption to relatives.'
      },
      {
        question: 'Can I sell a car to a relative for $1 to avoid tax?',
        answer:
          'A sale is not a gift, and the Department of Revenue may review sales between family members priced well below fair market value. Sales tax applies to the purchase price or current market value.'
      },
      {
        question: 'Does a gifted car need an inspection?',
        answer: 'Yes. A used vehicle must be inspected within 10 days of the transfer unless it already displays a valid inspection sticker.'
      },
      {
        question: 'Can I gift a car that has an out-of-state title?',
        answer:
          'Yes. The giver must show that sales tax was paid in a state reciprocal with Pennsylvania; otherwise tax is due on the car’s current fair market value.'
      }
    ],
    sources: [PA_SOURCES.giftForm, PA_SOURCES.buySell, PA_SOURCES.buySellFactSheet, PA_SOURCES.fees]
  },
  {
    slug: 'titling-a-car-in-pennsylvania-after-moving-from-another-state',
    stateKey: 'pennsylvania',
    title: 'Titling a Car in Pennsylvania After Moving From Another State',
    shortTitle: 'Title a car after moving to Pennsylvania',
    metaTitle: 'Titling Your Car After Moving to Pennsylvania',
    metaDescription:
      'New to Pennsylvania? Title and register your car within 20 days of moving. Covers the sales tax exemption for cars you have owned six months, inspection within 10 days, and documents.',
    cardDescription: 'The 20-day deadline, the six-month tax rule, and inspection.',
    intro: [
      'If you move to Pennsylvania with a car from another state, you have 20 days to title and register it here.',
      'Here is what to do and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'PennDOT',
    steps: [
      {
        title: 'Mark the 20-day deadline',
        body: ['Apply for a Pennsylvania title and registration within 20 days of moving to Pennsylvania.']
      },
      {
        title: 'Get Pennsylvania insurance',
        body: ['You need proof of Pennsylvania insurance, such as an insurance ID card or declaration page.']
      },
      {
        title: 'Apply through an authorized agent',
        body: [
          'Use an authorized agent such as a notary, dealer, or messenger service, or visit the PennDOT Riverfront Office Center in Harrisburg. You complete Form MV-1 (Application for Certificate of Title) and surrender your out-of-state title.',
          'A tracing of the vehicle identification number (VIN) is attached to the application.'
        ]
      },
      {
        title: 'Handle a lien, if you have one',
        body: [
          'If your lienholder holds the out-of-state title, contact PennDOT’s Call Center to request a letter asking the lienholder to send the title to PennDOT. A temporary plate can be issued only when the out-of-state title is submitted with Form MV-1.'
        ]
      },
      {
        title: 'Check whether you owe sales tax',
        body: [
          'You generally do not owe sales tax if you have a valid out-of-state title and owned the vehicle for at least six months before moving. If you owned it for less than six months, you must prove you paid sales tax or pay Pennsylvania’s tax.'
        ]
      },
      {
        title: 'Inspect within 10 days',
        body: [
          'A newly registered vehicle must pass a Pennsylvania safety inspection within 10 days. Check Drive Clean PA to see whether your county also requires an emissions inspection.'
        ]
      }
    ],
    checklist: [
      'Form MV-1, Application for Certificate of Title (the agent completes it)',
      'Your out-of-state title, issued in your name',
      'A tracing of the vehicle identification number (VIN)',
      'Proof of Pennsylvania insurance',
      'A valid Pennsylvania photo driver’s license or photo ID card',
      'Proof of sales tax paid, if you owned the car less than six months',
      'Payment for the title and registration fees, plus the agent’s service fee'
    ],
    calculatorNote:
      'If you owned the car at least six months before moving, enter $0 as the price to see only the title and registration costs.',
    faqs: [
      {
        question: 'How long do I have to title my car after moving to Pennsylvania?',
        answer: '20 days from moving to Pennsylvania.'
      },
      {
        question: 'Do I pay Pennsylvania sales tax on a car I already own?',
        answer:
          'Generally not, if you have a valid out-of-state title and owned the car for at least six months before moving. Otherwise you must prove you paid sales tax or pay Pennsylvania’s tax.'
      },
      {
        question: 'When do I need a Pennsylvania inspection?',
        answer: 'Within 10 days of registering. Some counties also require an annual emissions inspection.'
      },
      {
        question: 'What if my lender has my title?',
        answer:
          'Contact PennDOT’s Call Center to request a letter asking your lienholder to send the out-of-state title to PennDOT. A temporary plate can be issued only when the title is submitted with Form MV-1.'
      }
    ],
    sources: [PA_SOURCES.newResident, PA_SOURCES.outOfState, PA_SOURCES.fees]
  },
  {
    slug: 'how-to-title-a-private-car-sale-in-texas',
    stateKey: 'texas',
    title: 'How to Title a Private Car Sale in Texas',
    shortTitle: 'Title a private car sale',
    metaTitle: 'How to Title a Private Car Sale in Texas',
    metaDescription:
      'Step-by-step guide to titling a car bought from a private seller in Texas: Form 130-U, the 6.25% tax on the price or SPV, the 30-day deadline and penalties, and county tax office fees.',
    cardDescription: 'Form 130-U, the 6.25% tax and SPV rule, and the 30-day deadline.',
    intro: [
      'When you buy a car from a private seller in Texas, you title it in your name at your county tax assessor-collector’s office.',
      'Here is the order to do it in, what it costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'TxDMV and Texas Comptroller',
    steps: [
      {
        title: 'Check the title and the vehicle',
        body: [
          'Make sure the title and registration match the seller’s name and address and that the VIN is intact. TxDMV’s Title Check shows whether the title has issues that affect value. If there is a lien, the lienholder must release it.'
        ]
      },
      {
        title: 'Get the signed title and Form 130-U',
        body: [
          'The seller gives you a properly signed title with the date of sale and odometer reading, plus a signed Application for Texas Title and/or Registration (Form 130-U) showing the sales price.'
        ]
      },
      {
        title: 'Sort out the plates and insurance',
        body: [
          'The seller may remove the license plates and registration sticker. You need liability insurance to register the car (you can apply for a title only without it).'
        ]
      },
      {
        title: 'Go to the county tax office within 30 days',
        body: [
          'Title the car in your name within 30 days of the sale. It helps to bring the seller along, because tax office staff can check the title before you submit it.',
          'Late filing costs $25, plus another $25 for each additional month late, with no waivers. Active-duty military get 60 days.'
        ]
      },
      {
        title: 'Pay the motor vehicle tax and fees',
        body: [
          'You pay 6.25% motor vehicle tax on the greater of the price or 80% of the vehicle’s Standard Presumptive Value (SPV), a title fee of $33 (nonattainment counties) or $28, and registration ($50.75 plus $1 TexasSure for a car or light truck of 6,000 lbs or less, plus a $7.50 inspection program replacement fee, a processing fee, and county fees).'
        ]
      },
      {
        title: 'Know the inspection rules',
        body: [
          'Since January 1, 2025, non-commercial vehicles no longer need a safety inspection to register. In Brazoria, Collin, Dallas, Denton, El Paso, Ellis, Fort Bend, Galveston, Harris, Johnson, Kaufman, Montgomery, Parker, Rockwall, Tarrant, Travis, and Williamson counties, the car still needs an emissions inspection.'
        ]
      }
    ],
    sections: [
      {
        heading: 'How the SPV rule works',
        intro: 'Texas does not just tax the price you write down:',
        items: [
          'The tax is 6.25% of the greater of the price you paid or 80% of the SPV on the day you title the car. Look up SPV with TxDMV’s calculator.',
          'If you paid less than 80% of SPV, a certified appraisal on Form 14-128 (Texas Used Motor Vehicle Certified Appraisal), obtained within 30 days of the purchase, can lower the taxable value, but not below the price.',
          'Trade-in credit does not apply to private-party sales.'
        ]
      }
    ],
    checklist: [
      'The title, signed by the seller with the date of sale and odometer reading',
      'Form 130-U, signed by the seller and showing the sales price',
      'Release of lien, if there was a lien',
      'Proof of liability insurance',
      'Form 14-128 certified appraisal, if you paid below 80% of SPV',
      'Emissions inspection, if you live in one of the 17 emissions counties',
      'Payment for the motor vehicle tax, title fee, and registration fees'
    ],
    calculatorNote:
      'Enter the price you paid and the car’s Standard Presumptive Value (from TxDMV’s SPV calculator). The calculator taxes the greater of the price or 80% of SPV, or your certified appraisal if you enter one.',
    faqs: [
      {
        question: 'How long do I have to title a car I bought privately in Texas?',
        answer: '30 days from the date of sale. After that, a $25 penalty applies, plus $25 for each additional month late. Active-duty military get 60 days.'
      },
      {
        question: 'What is the Standard Presumptive Value (SPV)?',
        answer:
          'A value TxDMV assigns to used vehicles. Private-party sales are taxed on the greater of the price or 80% of SPV. A certified appraisal (Form 14-128) within 30 days can lower it.'
      },
      {
        question: 'Do I need a safety inspection in Texas?',
        answer:
          'Not for a non-commercial vehicle since January 1, 2025. A $7.50 inspection program replacement fee is charged at registration instead, and 17 counties still require an emissions inspection.'
      },
      {
        question: 'Does the seller have to file anything?',
        answer:
          'The seller should file a Vehicle Transfer Notification within 30 days of the sale, which protects them from tickets and tolls you incur afterward.'
      }
    ],
    sources: [TX_SOURCES.buySell, TX_SOURCES.spv, TX_SOURCES.register, TX_SOURCES.penalties]
  },
  {
    slug: 'how-to-gift-a-car-in-texas',
    stateKey: 'texas',
    title: 'How to Gift a Car in Texas',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in Texas',
    metaDescription:
      'How to give or receive a car as a gift in Texas: who qualifies for the $10 gift tax, the notarized Form 14-317 affidavit, what other relatives pay, and titling within 30 days.',
    cardDescription: 'Who pays only the $10 gift tax, Form 14-317, and what others pay.',
    intro: [
      'Texas taxes a gift between close family members only $10, instead of the 6.25% motor vehicle tax, when both sides sign a gift affidavit.',
      'Here is who qualifies and how to transfer the title.'
    ],
    lastVerified: 'October 2026',
    agency: 'TxDMV and Texas Comptroller',
    steps: [
      {
        title: 'Check that the giver qualifies',
        body: [
          'The $10 gift tax applies when the car comes from a spouse (separate property only), parent or stepparent, child or stepchild, sibling or sibling-in-law, parent-in-law or child-in-law, grandparent or grandchild (including in-laws and great-grand relationships), or guardian.',
          'Aunts, uncles, nieces, nephews, and cousins do not qualify.'
        ]
      },
      {
        title: 'Make sure nothing is given in return',
        body: [
          'A gift has no payment of any kind. If the recipient takes over a loan, the payoff amount is taxable as a sale.'
        ]
      },
      {
        title: 'Sign the Affidavit of Motor Vehicle Gift Transfer (Form 14-317)',
        body: [
          'The giver and the recipient sign one joint, notarized affidavit. The county tax office can witness a signature instead of a notary if the person signs in front of staff.'
        ]
      },
      {
        title: 'Complete the title and Form 130-U',
        body: ['The giver signs the title over with the odometer reading, and you complete the Application for Texas Title and/or Registration (Form 130-U).']
      },
      {
        title: 'Title it within 30 days',
        body: [
          'Take the title, Form 130-U, and Form 14-317 to your county tax assessor-collector within 30 days. You pay the $10 gift tax, the title fee ($33 or $28 by county), and registration fees.'
        ]
      }
    ],
    sections: [
      {
        heading: 'When a family transfer is taxed',
        items: [
          'The giver is not on the list (for example, an aunt, uncle, niece, nephew, or cousin): the transfer is treated as a sale and the 6.25% motor vehicle tax applies, possibly on Standard Presumptive Value.',
          'Money changes hands: a sale between family members is taxed like any private sale.',
          'The recipient takes over a loan: the loan payoff (plus anything else paid) is taxable.'
        ]
      }
    ],
    checklist: [
      'The title, signed over by the giver with the odometer reading',
      'Affidavit of Motor Vehicle Gift Transfer (Form 14-317), signed by both and notarized',
      'Form 130-U, Application for Texas Title and/or Registration',
      'Proof of liability insurance',
      'Payment for the $10 gift tax, title fee, and registration fees'
    ],
    calculatorNote:
      'For a qualifying gift, enter $0 as the price to see the title and registration costs, then add the $10 gift tax.',
    faqs: [
      {
        question: 'How much is the gift tax on a car in Texas?',
        answer: '$10, when the car comes from a qualifying relative or guardian and both of you sign Form 14-317.'
      },
      {
        question: 'Can my aunt or uncle gift me a car for the $10 tax?',
        answer: 'No. Aunts, uncles, nieces, nephews, and cousins are not eligible, so the transfer is taxed as a sale.'
      },
      {
        question: 'Does the gift affidavit have to be notarized?',
        answer:
          'Yes, unless the signer signs in front of county tax office staff, who can acknowledge the signature instead.'
      },
      {
        question: 'What if I take over the car loan?',
        answer: 'Then it is not a gift. The loan payoff amount, plus anything else you give, is taxed like a sale.'
      }
    ],
    sources: [TX_SOURCES.gift, TX_SOURCES.family, TX_SOURCES.buySell, TX_SOURCES.register]
  },
  {
    slug: 'titling-a-car-in-texas-after-moving-from-another-state',
    stateKey: 'texas',
    title: 'Registering a Car in Texas After Moving From Another State',
    shortTitle: 'Register a car after moving to Texas',
    metaTitle: 'Registering Your Car After Moving to Texas',
    metaDescription:
      'New to Texas? Register your car within 30 days of moving. Covers the $90 new resident tax, insurance minimums, emissions inspection counties, and what to bring to the county tax office.',
    cardDescription: 'The 30-day deadline, the $90 new resident tax, and emissions counties.',
    intro: [
      'If you move to Texas with a car, you have 30 days to register it at your county tax assessor-collector’s office.',
      'Here is what to do and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'TxDMV and Texas Comptroller',
    steps: [
      {
        title: 'Mark the 30-day deadline',
        body: ['You have 30 days from the time you move to Texas to register your vehicle.']
      },
      {
        title: 'Get Texas liability insurance',
        body: ['Texas requires at least $30,000 per injured person, up to $60,000 per accident, and $25,000 for property damage.']
      },
      {
        title: 'Get an emissions inspection if your county requires one',
        body: [
          'In Brazoria, Collin, Dallas, Denton, El Paso, Ellis, Fort Bend, Galveston, Harris, Johnson, Kaufman, Montgomery, Parker, Rockwall, Tarrant, Travis, and Williamson counties, pass an emissions inspection before you register. Non-commercial vehicles no longer need a safety inspection.'
        ]
      },
      {
        title: 'Register at the county tax office',
        body: [
          'Bring your insurance card, proof that you own the car (your previous state’s title or registration), and a completed Form 130-U. TxDMV notes that you are not required to title the vehicle in Texas to register it.'
        ]
      },
      {
        title: 'Pay the new resident tax and fees',
        body: [
          'If the car was registered in your name in another state, you pay a $90 new resident tax instead of the 6.25% motor vehicle tax. It does not give credit for tax paid elsewhere. If the car was never registered in your name in another state, motor vehicle use tax applies instead.',
          'Registration is $50.75 plus $1 TexasSure for a car or light truck of 6,000 lbs or less, plus the inspection program replacement fee and any county fees.'
        ]
      }
    ],
    checklist: [
      'Proof of Texas liability insurance',
      'Your previous state’s title or registration in your name',
      'Form 130-U, Application for Texas Title and/or Registration',
      'Passing emissions inspection, if you live in one of the 17 emissions counties',
      'Payment for the $90 new resident tax and registration fees'
    ],
    calculatorNote:
      'The calculator is built for a purchase. To see registration costs, enter $0 as the price, then add the $90 new resident tax if it applies.',
    faqs: [
      {
        question: 'How long do I have to register my car after moving to Texas?',
        answer: '30 days from the time you move to Texas.'
      },
      {
        question: 'Do I pay Texas sales tax on a car I already own?',
        answer:
          'If the car was registered in your name in another state, you pay a $90 new resident tax instead. If it was never registered in your name elsewhere, motor vehicle use tax applies.'
      },
      {
        question: 'Do I need a vehicle inspection?',
        answer:
          'Only an emissions inspection, and only in 17 counties including Dallas, Harris, Tarrant, Travis, and El Paso. Safety inspections ended for non-commercial vehicles on January 1, 2025.'
      },
      {
        question: 'Do I have to get a Texas title?',
        answer: 'TxDMV says you are not required to title the vehicle in Texas; you must register it within 30 days.'
      }
    ],
    sources: [TX_SOURCES.newResident, TX_SOURCES.register, TX_SOURCES.spv]
  },
  {
    slug: 'how-to-title-a-private-car-sale-in-california',
    stateKey: 'california',
    title: 'How to Transfer a Private Car Sale in California',
    shortTitle: 'Transfer a private car sale',
    metaTitle: 'How to Transfer a Private Car Sale in California',
    metaDescription:
      'Step-by-step guide to a private car sale in California: the signed title, smog certification, the 10-day transfer deadline, the $15 transfer fee, and use tax at your local rate.',
    cardDescription: 'The title, smog certificate, 10-day deadline, and use tax.',
    intro: [
      'In a California private sale, the seller signs the title and provides a smog certificate, and you transfer ownership with the DMV within 10 days.',
      'Here is the order to do it in, what it costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'California DMV and CDTFA',
    steps: [
      {
        title: 'Get the signed title',
        body: [
          'The seller signs Line 1 of the title. If the vehicle is less than 10 years old, record the mileage; if the title has no mileage line, use a Vehicle/Vessel Transfer and Reassignment form (REG 262) signed by both of you.',
          'If the seller is not the owner named on the title, get a bill of sale signed by both the seller and the titled owner.'
        ]
      },
      {
        title: 'Get the smog certification',
        body: [
          'The seller gives you a valid smog certification for a gas vehicle more than four model years old. For a vehicle four model years old or newer, no smog check is needed; you pay a smog transfer fee to the DMV instead. Diesel vehicles have no model-year exemption.'
        ]
      },
      {
        title: 'Transfer ownership within 10 days',
        body: [
          'You have 10 days after the purchase to transfer ownership with the DMV. The seller has 5 days to file a Notice of Transfer and Release of Liability.'
        ]
      },
      {
        title: 'Pay the transfer fee and use tax',
        body: [
          'The transfer fee is $15. Use tax is charged on the purchase price at the sales tax rate where you register the car: 7.25% statewide, up to 11.75% with local district taxes.'
        ]
      },
      {
        title: 'Plan for registration fees',
        body: [
          'Registration is $76 plus a $34 CHP fee, plus a vehicle license fee of 0.65% of the car’s value, a transportation improvement fee from $33 to $231 depending on value, and county fees. Zero-emission vehicles from model year 2020 on add a $121 road improvement fee.'
        ]
      }
    ],
    sections: [
      {
        heading: 'How California use tax works on a private sale',
        items: [
          'You generally pay use tax at the DMV when you register, at the rate for the address where you register the car.',
          'Trade-in credit does not apply to a private sale.',
          'Purchases from close family members, and true gifts, can be exempt. See the gift guide.'
        ]
      }
    ],
    checklist: [
      'The title, signed by the seller on Line 1',
      'Odometer reading for a vehicle less than 10 years old (REG 262 if the title has no mileage line)',
      'Smog certification from the seller (or the smog transfer fee for a vehicle four model years old or newer)',
      'Bill of sale, if the seller is not the owner named on the title',
      'Payment for the $15 transfer fee, use tax, and any registration fees due'
    ],
    calculatorNote:
      'The calculator shows the use tax as a range from 7.25% to 11.75%. Registration includes the $76 fee, the $34 CHP fee, and estimates of the vehicle license fee (0.65% of the price) and the transportation improvement fee.',
    faqs: [
      {
        question: 'How long do I have to transfer a car I bought privately in California?',
        answer: '10 days after the purchase. The seller has 5 days to report the sale to the DMV.'
      },
      {
        question: 'Who provides the smog certificate?',
        answer:
          'The seller, for a gas vehicle more than four model years old. For a vehicle four model years old or newer, the buyer pays a smog transfer fee instead.'
      },
      {
        question: 'How much is the California title transfer fee?',
        answer: 'The DMV transfer fee is $15, plus use tax on the purchase price.'
      },
      {
        question: 'What use tax rate do I pay?',
        answer: 'The sales tax rate where you register the car: 7.25% statewide, up to 11.75% in Lancaster and Palmdale.'
      }
    ],
    sources: [CA_SOURCES.privateParty, CA_SOURCES.fees, CA_SOURCES.smog, CA_SOURCES.cdtfa]
  },
  {
    slug: 'how-to-gift-a-car-in-california',
    stateKey: 'california',
    title: 'How to Gift a Car in California',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in California',
    metaDescription:
      'How to give or receive a car as a gift in California: the use tax gift exemption, family members who qualify, smog exemptions for family transfers, and the 10-day transfer deadline.',
    cardDescription: 'The use tax gift and family exemptions, and smog rules.',
    intro: [
      'California does not charge use tax on a true gift, and purchases from close family members are exempt too. Family transfers can also skip the smog certificate.',
      'Here is who qualifies and how to transfer the title.'
    ],
    lastVerified: 'October 2026',
    agency: 'California DMV and CDTFA',
    steps: [
      {
        title: 'Make sure it is a true gift',
        body: [
          'The owner must give the car freely, with no payment from the person receiving it. Paying cash, trading property, providing services, or taking over a loan makes it a purchase, not a gift.'
        ]
      },
      {
        title: 'Know the family exemption',
        body: [
          'Even a purchase is exempt from use tax when the seller is your parent, grandparent, child, grandchild, spouse, or registered domestic partner, or your brother or sister when both of you are minors (related by blood or adoption). Stepparents and stepchildren qualify only through legal adoption, and ex-spouses after a divorce decree do not qualify.'
        ]
      },
      {
        title: 'Check whether a smog certificate is needed',
        body: [
          'Transfers between parent, grandparent, child, grandchild, brother, sister, spouse, or domestic partner are exempt from the smog certification requirement, as are vehicles smog certified in the last 90 days.'
        ]
      },
      {
        title: 'Sign the title and transfer within 10 days',
        body: [
          'The giver signs the title, and you transfer ownership with the DMV within 10 days. You pay the $15 transfer fee.'
        ]
      },
      {
        title: 'Keep proof of the gift or relationship',
        body: [
          'Keep a signed statement from the former owner and a copy of the title, plus proof of the relationship for a family exemption. The DMV may ask for a use tax clearance (Form CDTFA-106), and CDTFA may contact you later for documents.'
        ]
      }
    ],
    sections: [
      {
        heading: 'When use tax is still owed',
        items: [
          'Anything is given in return, including taking over a loan, and the seller is not a qualifying family member.',
          'The family member who sells you the car is in the business of selling that type of vehicle.',
          'A sale between stepfamily without legal adoption, or between ex-spouses after a divorce decree.'
        ]
      }
    ],
    checklist: [
      'The title, signed by the giver',
      'A signed statement from the giver that the car is a gift, with a copy of the title',
      'Proof of relationship for a family exemption (for example, a birth or marriage certificate)',
      'Smog certification, unless the family or 90-day exemption applies',
      'Payment for the $15 transfer fee'
    ],
    calculatorNote:
      'For a gift or exempt family transfer, enter $0 as the price to see the transfer fee and the $76 registration and $34 CHP fees. The vehicle license fee (0.65% of the car’s value) and transportation improvement fee are extra.',
    faqs: [
      {
        question: 'Do I pay use tax on a car gifted to me in California?',
        answer: 'No, if it is a true gift with nothing given in return, including no loan takeover.'
      },
      {
        question: 'Can I buy a car from my parent without paying use tax?',
        answer:
          'Yes. Purchases from a parent, grandparent, child, grandchild, spouse, or registered domestic partner are exempt, as long as they are not in the business of selling vehicles.'
      },
      {
        question: 'Is a car from my brother or sister exempt?',
        answer: 'Only if both of you are minors. Otherwise a purchase from a sibling is taxable, though a true gift is not.'
      },
      {
        question: 'Does a family transfer need a smog check?',
        answer:
          'No. Transfers between parent, grandparent, child, grandchild, brother, sister, spouse, or domestic partner are exempt from the smog certification requirement.'
      }
    ],
    sources: [CA_SOURCES.cdtfa, CA_SOURCES.smog, CA_SOURCES.privateParty, CA_SOURCES.fees]
  },
  {
    slug: 'titling-a-car-in-california-after-moving-from-another-state',
    stateKey: 'california',
    title: 'Registering a Car in California After Moving From Another State',
    shortTitle: 'Register a car after moving to California',
    metaTitle: 'Registering Your Car After Moving to California',
    metaDescription:
      'New to California? Register your car within 20 days of becoming a resident. Covers VIN verification, the smog certificate, use tax on recent purchases, and documents to bring.',
    cardDescription: 'The 20-day deadline, VIN verification, smog, and use tax.',
    intro: [
      'If you move to California with a car registered in another state, you must register it within 20 days of becoming a resident or taking a job here.',
      'Here is what to do and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'California DMV and CDTFA',
    steps: [
      {
        title: 'Mark the 20-day deadline',
        body: [
          'Register the vehicle within 20 days of becoming a resident or getting a job in California. To avoid penalties, submit the application and fees on time even if you do not yet have every document.'
        ]
      },
      {
        title: 'Get the VIN verified',
        body: [
          'A DMV employee, law enforcement officer, or California-licensed vehicle verifier completes a Verification of Vehicle (REG 31). You can bring the car to a DMV office for this.'
        ]
      },
      {
        title: 'Get a California smog certification',
        body: [
          'Gas vehicles from model year 1976 and newer need a smog certification from a California station (motorcycles are exempt). The newer-vehicle smog exemption does not apply to vehicles coming from out of state.'
        ]
      },
      {
        title: 'Bring your title or registration',
        body: [
          'Bring the out-of-state title, or proof of the last registration, such as the last registration certificate or renewal notice.'
        ]
      },
      {
        title: 'Check whether use tax applies',
        body: [
          'A vehicle bought within 12 months before you bring it into California is presumed bought for use here, so use tax may be due, with credit for sales tax paid to another state. Evidence such as tax paid elsewhere can rebut the presumption.'
        ]
      }
    ],
    checklist: [
      'Out-of-state title, or your last registration certificate or renewal notice',
      'Verification of Vehicle (REG 31)',
      'California smog certification (gas vehicles 1976 and newer)',
      'Proof of sales tax paid in another state, if you bought the car within 12 months',
      'Payment for registration fees and any use tax'
    ],
    calculatorNote:
      'If no use tax applies, enter $0 as the price. At $0 the calculator shows the $76 registration and $34 CHP fees only; the vehicle license fee (0.65% of the car’s value) and transportation improvement fee are extra.',
    faqs: [
      {
        question: 'How long do I have to register my car after moving to California?',
        answer: '20 days after becoming a resident or getting a job in California.'
      },
      {
        question: 'Do I need a smog check for a car from another state?',
        answer:
          'Yes, for gas vehicles from model year 1976 and newer (motorcycles are exempt). The newer-vehicle exemption does not apply to out-of-state vehicles.'
      },
      {
        question: 'Do I pay California use tax on a car I already own?',
        answer:
          'Only if you bought it within 12 months before bringing it in and cannot show it was bought for use elsewhere. Sales tax paid to another state is credited.'
      },
      {
        question: 'Who can verify my VIN?',
        answer: 'A DMV employee, a law enforcement officer, or a California-licensed vehicle verifier, on form REG 31.'
      }
    ],
    sources: [CA_SOURCES.newResident, CA_SOURCES.outOfState, CA_SOURCES.cdtfa, CA_SOURCES.fees]
  },
  {
    slug: 'how-to-title-a-private-car-sale-in-florida',
    stateKey: 'florida',
    title: 'How to Title a Private Car Sale in Florida',
    shortTitle: 'Title a private car sale',
    metaTitle: 'How to Title a Private Car Sale in Florida',
    metaDescription:
      'Step-by-step guide to titling a car bought from a private seller in Florida: the title transfer, HSMV 82040, the 30-day deadline, 6% sales tax plus county surtax, and the $225 fee.',
    cardDescription: 'The title transfer, 30-day deadline, sales tax, and the $225 fee.',
    intro: [
      'When you buy a car from a private seller in Florida, you title and register it at a motor vehicle service center within 30 days.',
      'Here is the order to do it in, what it costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'FLHSMV and Florida DOR',
    steps: [
      {
        title: 'Complete the title transfer',
        body: [
          'For a paper title, the seller completes the Transfer of Title by Seller section, including the odometer reading, which both of you acknowledge.',
          'For an electronic title, you and the seller visit a motor vehicle service center together with photo ID to complete a secure title reassignment.'
        ]
      },
      {
        title: 'Let the seller keep the plate',
        body: ['License plates stay with the seller, not the vehicle. You use your own plate or get a new one.']
      },
      {
        title: 'Get Florida insurance',
        body: ['You need proof of Florida personal injury protection (PIP) and property damage liability (PDL) insurance from a Florida insurance company to register.']
      },
      {
        title: 'Apply within 30 days',
        body: [
          'Complete the Application for Certificate of Title With/Without Registration (HSMV 82040) and submit it with the title at a motor vehicle service center within 30 calendar days, starting the day after the sale, to avoid a late transfer penalty.',
          'If the car was not previously titled in Florida, a VIN and odometer verification (HSMV 82042) is also needed.'
        ]
      },
      {
        title: 'Pay the tax and fees',
        body: [
          'You pay 6% sales tax plus any county surtax, a $75.25 title fee (add $2.50 for a paper title), and registration by weight ($35.60 for 2,500 to 3,499 lbs, $45.60 for 3,500 lbs and up, $27.60 under 2,500 lbs).',
          'If you have no Florida plate registered in your name to transfer, add the $225 initial registration fee and $28 for a new metal plate.'
        ]
      }
    ],
    sections: [
      {
        heading: 'How Florida sales tax works on a private sale',
        items: [
          '6% state sales tax on the price.',
          'Most counties add a discretionary surtax of 0.5% to 2%, based on your county of residence, applied only to the first $5,000 of the price.',
          'A trade-in lowers the taxable price only when two individuals trade vehicles in a single transaction. Selling one car and using the money for another is not a trade-in.'
        ]
      }
    ],
    checklist: [
      'The title, with the seller’s transfer section and odometer reading completed',
      'Application for Certificate of Title With/Without Registration (HSMV 82040)',
      'Proof of Florida PIP and PDL insurance',
      'VIN and odometer verification (HSMV 82042), if the car was not previously titled in Florida',
      'Photo ID',
      'Payment for sales tax, title, and registration fees (plus $225 and $28 if you have no plate to transfer)'
    ],
    calculatorNote:
      'The calculator includes the 6% state tax but not the county surtax (at most 2% of the first $5,000) or the $225 initial registration fee.',
    faqs: [
      {
        question: 'How long do I have to title a car I bought privately in Florida?',
        answer: '30 calendar days, starting the day after the seller completes the title transfer and delivers the vehicle.'
      },
      {
        question: 'What is the $225 initial registration fee?',
        answer:
          'A one-time fee charged when you do not have a Florida license plate, registered in your name from a previously owned vehicle, to transfer to the new car.'
      },
      {
        question: 'Does the county surtax apply to the whole price?',
        answer: 'No. It applies only to the first $5,000 of the price, at your county of residence’s rate.'
      },
      {
        question: 'Do I keep the seller’s plate?',
        answer: 'No. Florida plates stay with the seller. You transfer your own plate or buy a new one.'
      }
    ],
    sources: [FL_SOURCES.privateSale, FL_SOURCES.fees, FL_SOURCES.registrations, FL_SOURCES.salesTax]
  },
  {
    slug: 'how-to-gift-a-car-in-florida',
    stateKey: 'florida',
    title: 'How to Gift a Car in Florida',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in Florida',
    metaDescription:
      'How to give or receive a car as a gift in Florida: when a gift is not taxed, the sworn statement on the title application, loans and lienholders, and titling within 30 days.',
    cardDescription: 'When a gift is tax-free, the sworn statement, and titling.',
    intro: [
      'Florida does not charge sales tax on a car given as a gift between individuals, whoever the recipient is, as long as nothing is paid and no loan is taken over.',
      'Here is how to transfer a gifted car.'
    ],
    lastVerified: 'October 2026',
    agency: 'FLHSMV and Florida DOR',
    steps: [
      {
        title: 'Make sure it is a gift',
        body: [
          'No payment of any kind is made, in money or otherwise, and the recipient does not take over an outstanding lien. If the giver is also the lienholder, the transfer is treated as a sale.'
        ]
      },
      {
        title: 'Transfer the title',
        body: [
          'The giver completes the title transfer section with the odometer reading. For an electronic title, both of you visit a motor vehicle service center with photo ID.'
        ]
      },
      {
        title: 'Claim the exemption on the title application',
        body: [
          'On the Application for Certificate of Title (HSMV 82040), declare the gift exemption and include a sworn statement with a description of the vehicle, the giver’s name and address, and statements that nothing was paid and no lien is being taken over.'
        ]
      },
      {
        title: 'Insure and title within 30 days',
        body: [
          'Get Florida PIP and PDL insurance and apply at a motor vehicle service center within 30 days. Title and registration fees still apply, plus the $225 initial registration fee if you have no Florida plate to transfer.'
        ]
      },
      {
        title: 'Keep the plate rules in mind',
        body: ['The giver keeps their plate. You transfer your own plate or get a new one.']
      }
    ],
    sections: [
      {
        heading: 'When tax is still owed',
        items: [
          'Any payment is made, in money or otherwise.',
          'The recipient takes over an outstanding loan on the car.',
          'The giver is also the lender (lienholder).',
          'A sale between relatives is taxed like any other sale.'
        ]
      }
    ],
    checklist: [
      'The title, transferred by the giver with the odometer reading',
      'HSMV 82040 with the gift exemption declared and a sworn statement',
      'Proof of Florida PIP and PDL insurance',
      'Photo ID',
      'Payment for title and registration fees'
    ],
    calculatorNote: 'For a gift, enter $0 as the price. The calculator then shows only the title and registration costs.',
    faqs: [
      {
        question: 'Who can I gift a car to tax-free in Florida?',
        answer:
          'Anyone. A gift between individuals is not taxed when nothing is paid and no outstanding lien is taken over.'
      },
      {
        question: 'What if the car still has a loan?',
        answer:
          'If the recipient takes over the loan, it is not a gift and sales tax applies. If the giver is also the lender, the transfer is treated as a sale.'
      },
      {
        question: 'How do I claim the gift exemption?',
        answer:
          'Declare it on the title application (HSMV 82040) and include a sworn statement that nothing was paid and no lien is being taken over.'
      },
      {
        question: 'Do I still pay the $225 fee for a gifted car?',
        answer: 'Yes, if you do not have a Florida license plate registered in your name to transfer.'
      }
    ],
    sources: [FL_SOURCES.giftFaq, FL_SOURCES.privateSale, FL_SOURCES.fees, FL_SOURCES.registrations]
  },
  {
    slug: 'titling-a-car-in-florida-after-moving-from-another-state',
    stateKey: 'florida',
    title: 'Titling a Car in Florida After Moving From Another State',
    shortTitle: 'Title a car after moving to Florida',
    metaTitle: 'Titling Your Car After Moving to Florida',
    metaDescription:
      'New to Florida? Title and register your car within 10 days of starting work, enrolling kids in school, or establishing residency. Covers VIN verification, the $225 fee, and use tax.',
    cardDescription: 'The 10-day deadline, VIN verification, the $225 fee, and use tax.',
    intro: [
      'If you move to Florida with a car from another state, Florida law requires you to title it here, not just register it, and the deadline is short.',
      'Here is what to do and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'FLHSMV and Florida DOR',
    steps: [
      {
        title: 'Mark the 10-day deadline',
        body: [
          'Register an out-of-state vehicle within 10 days of becoming employed, placing children in public school, or establishing residency in Florida.'
        ]
      },
      {
        title: 'Get Florida insurance',
        body: ['You need proof of Florida PIP and PDL insurance from a Florida insurance company.']
      },
      {
        title: 'Get the VIN verified',
        body: [
          'A vehicle not previously titled in Florida needs a VIN and odometer verification (HSMV 82042), done by an FLHSMV compliance examiner or officer, a licensed Florida dealer, a Florida notary public, or a police officer.'
        ]
      },
      {
        title: 'Title and register in person',
        body: [
          'At a motor vehicle service center, bring proof of identity for all owners, Florida insurance, your original out-of-state title, and HSMV 82040 signed by all owners. If a lienholder holds your title, the lienholder must send it.',
          'Fees include the $85.25 title fee for a used vehicle titled in Florida for the first time, registration by weight, the $225 initial registration fee if you have no Florida plate to transfer, and $28 for a new plate.'
        ]
      },
      {
        title: 'Check whether use tax applies',
        body: [
          'Florida’s 6% use tax applies to a vehicle brought in within six months of purchase, with credit for sales tax paid to another state (you pay any difference). A vehicle used in another state for six months or longer is presumed not bought for use in Florida.'
        ]
      }
    ],
    checklist: [
      'Proof of identity for all owners',
      'Proof of Florida PIP and PDL insurance',
      'Your original out-of-state title (or the lienholder sends it)',
      'HSMV 82040, signed by all owners',
      'VIN and odometer verification (HSMV 82042)',
      'Payment for title and registration fees, the $225 initial registration fee if it applies, and any use tax'
    ],
    calculatorNote:
      'If no use tax applies, enter $0 as the price. The calculator shows the $75.25 transfer title fee; a first-time Florida title is $85.25, and the $225 initial registration fee is extra.',
    faqs: [
      {
        question: 'How long do I have to register my car after moving to Florida?',
        answer: '10 days after you become employed, place children in public school, or establish residency in Florida.'
      },
      {
        question: 'Do I pay Florida sales tax on a car I already own?',
        answer:
          'Not if you used it in another state for six months or longer before bringing it to Florida. If you bought it within six months, 6% use tax applies, with credit for sales tax paid to another state.'
      },
      {
        question: 'Do new residents pay the $225 fee?',
        answer: 'Yes, unless you already have a Florida license plate registered in your name to transfer.'
      },
      {
        question: 'Who can verify my VIN?',
        answer: 'An FLHSMV compliance examiner or officer, a licensed Florida dealer, a Florida notary public, or a police officer, on form HSMV 82042.'
      }
    ],
    sources: [FL_SOURCES.newResident, FL_SOURCES.registrations, FL_SOURCES.fees, FL_SOURCES.newResidentTax]
  },
  {
    slug: 'how-to-title-a-private-car-sale-in-new-york',
    stateKey: 'new-york',
    title: 'How to Title a Private Car Sale in New York',
    shortTitle: 'Title a private car sale',
    metaTitle: 'How to Title a Private Car Sale in New York',
    metaDescription:
      'Step-by-step guide to titling a car bought from a private seller in New York: the bill of sale, Form DTF-802, sales tax of 7% to 8.875%, registration by weight, and inspection.',
    cardDescription: 'The paperwork, sales tax, registration by weight, and inspection.',
    intro: [
      'When you buy a car from a private seller in New York, you register and title it at a DMV office and pay the sales tax there.',
      'Here is the order to do it in, what it costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'NYS DMV and NYS Tax Department',
    steps: [
      {
        title: 'Get the title and a bill of sale',
        body: [
          'The seller completes and signs the transfer section on the back of the title. If the vehicle has a transferable registration instead of a title, the seller signs that over to you.',
          'Sign a bill of sale (MV-912 works) showing the year and make, the VIN, the sale date, the price, and both names and signatures. The original goes to the DMV.'
        ]
      },
      {
        title: 'Get New York insurance',
        body: ['You need proof of New York auto liability insurance. Register within 180 days of the effective date on your insurance ID card.']
      },
      {
        title: 'Complete the forms',
        body: [
          'Fill out the Vehicle Registration/Title Application (MV-82) and the Statement of Transaction (DTF-802), which reports the price for sales tax.'
        ]
      },
      {
        title: 'Register at a DMV office and pay',
        body: [
          'Sales tax is 4% state tax plus local tax, 7% to 8.875% in total at the rate where you live (8.875% in New York City).',
          'The title certificate is $50. Registration is a 2-year fee by the vehicle’s weight (for example, $56.50 for 3,451 to 3,550 lbs), plus $25 for plates, any county or New York City vehicle use tax, and a $50 supplemental fee in the 12 commuter district counties.'
        ]
      },
      {
        title: 'Get it inspected within 10 days',
        body: [
          'You receive an inspection extension that lasts 10 days from the registration date. An inspection issued to the previous owner is not valid.'
        ]
      }
    ],
    sections: [
      {
        heading: 'What New York registration costs',
        intro: 'The registration fee covers 2 years and is set by the vehicle’s weight on the DMV chart:',
        items: [
          '$26 for 1,650 lbs or less, rising in steps of about $1.50 to $2.50 per 100 lbs.',
          '$56.50 for 3,451 to 3,550 lbs, and $69 for 3,951 to 4,050 lbs.',
          '$140 for 6,951 lbs or more.',
          'A $32.50 minimum for vehicles with 6 or more cylinders and electric vehicles.'
        ]
      }
    ],
    checklist: [
      'The title (or transferable registration) signed over to you',
      'A bill of sale signed by you and the seller',
      'Vehicle Registration/Title Application (MV-82)',
      'Statement of Transaction (DTF-802)',
      'Proof of New York insurance',
      'Proof of identity',
      'Payment for sales tax, the $50 title fee, registration, and plates'
    ],
    calculatorNote:
      'Enter the vehicle’s weight for the exact registration fee. The calculator shows sales tax as a range from 7% to 8.875% and does not include the $25 plates, county use tax, or the commuter district fee.',
    faqs: [
      {
        question: 'How much is sales tax on a private car sale in New York?',
        answer: 'The 4% state rate plus local tax, 7% to 8.875% in total, at the rate where you live. You pay it to the DMV when you register, using Form DTF-802.'
      },
      {
        question: 'Do I need an inspection?',
        answer: 'Yes. Get the vehicle inspected within 10 days of registering. The previous owner’s inspection does not carry over.'
      },
      {
        question: 'How is the registration fee set?',
        answer: 'By the vehicle’s weight. The fee covers 2 years, for example $56.50 for 3,451 to 3,550 lbs and $140 for 6,951 lbs or more.'
      }
    ],
    sources: [NY_SOURCES.transfer, NY_SOURCES.register, NY_SOURCES.fees, NY_SOURCES.salesTax, NY_SOURCES.rates]
  },
  {
    slug: 'how-to-gift-a-car-in-new-york',
    stateKey: 'new-york',
    title: 'How to Gift a Car in New York',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in New York',
    metaDescription:
      'How to give or receive a car as a gift in New York: the sales tax exemption on Form DTF-802, family purchases, the $0 bill of sale, and registering at the DMV.',
    cardDescription: 'The DTF-802 exemption, family purchases, and registering.',
    intro: [
      'New York does not charge sales tax on a vehicle given as a gift, or bought from your spouse, parent, child, stepparent, or stepchild. You claim the exemption on Form DTF-802.',
      'Here is how to transfer a gifted car.'
    ],
    lastVerified: 'October 2026',
    agency: 'NYS DMV and NYS Tax Department',
    steps: [
      {
        title: 'Sign over the title',
        body: ['The person giving the car completes and signs the transfer section on the title.']
      },
      {
        title: 'Write a $0 bill of sale',
        body: ['A bill of sale is still needed for a gift. List the price as $0 and note that the vehicle is a gift. Both of you sign it.']
      },
      {
        title: 'Claim the exemption on Form DTF-802',
        body: [
          'On the Statement of Transaction (DTF-802), note the vehicle as a gift. For a gift from anyone other than a spouse, parent, child, stepparent, or stepchild, the person giving the car completes section 6 of the form.'
        ]
      },
      {
        title: 'Get New York insurance',
        body: ['You need proof of New York auto liability insurance to register.']
      },
      {
        title: 'Register at a DMV office',
        body: [
          'Bring the forms and pay the $50 title fee and registration. Registration is a 2-year fee by weight, plus $25 for plates and any county use tax. Get an inspection within 10 days.'
        ]
      }
    ],
    sections: [
      {
        heading: 'Purchases from family',
        items: [
          'No sales tax is due on a purchase from your spouse, parent, child, stepparent, or stepchild, even if you pay for it.',
          'Purchases from other relatives are taxed like any other sale, unless the vehicle is a gift.'
        ]
      }
    ],
    checklist: [
      'The title, signed over by the person giving the car',
      'A bill of sale showing $0 and noting the gift',
      'Statement of Transaction (DTF-802), with section 6 completed if the giver is not a close family member',
      'Vehicle Registration/Title Application (MV-82)',
      'Proof of New York insurance and proof of identity',
      'Payment for the title fee, registration, and plates'
    ],
    calculatorNote: 'For a gift, enter $0 as the price. The calculator then shows only the title and registration costs.',
    faqs: [
      {
        question: 'Do I pay sales tax on a gifted car in New York?',
        answer: 'No. Claim the gift exemption on Form DTF-802. If the giver is not your spouse, parent, child, stepparent, or stepchild, they complete section 6 of the form.'
      },
      {
        question: 'Do I need a bill of sale for a gift?',
        answer: 'Yes. Show the price as $0 and note that the vehicle is a gift.'
      },
      {
        question: 'Is a sale between family members taxed?',
        answer: 'Not if you buy from your spouse, parent, child, stepparent, or stepchild. Other family sales are taxed on the price.'
      }
    ],
    sources: [NY_SOURCES.salesTax, NY_SOURCES.transfer, NY_SOURCES.register, NY_SOURCES.fees]
  },
  {
    slug: 'titling-a-car-in-new-york-after-moving-from-another-state',
    stateKey: 'new-york',
    title: 'Titling a Car in New York After Moving From Another State',
    shortTitle: 'Title a car after moving to New York',
    metaTitle: 'Titling Your Car After Moving to New York',
    metaDescription:
      'New to New York? Register your car within 30 days of moving. Covers the MV-82, proof of ownership, New York insurance, sales tax forms DTF-803 and DTF-804, and the 10-day inspection.',
    cardDescription: 'The 30-day deadline, the forms, sales tax, and inspection.',
    intro: [
      'If you move to New York with a car from another state, you must register it here within 30 days of becoming a resident.',
      'Here is what to do and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'NYS DMV and NYS Tax Department',
    steps: [
      {
        title: 'Mark the 30-day deadline',
        body: ['Register within 30 days of becoming a New York resident. Non-residents can keep driving on their home state’s registration.']
      },
      {
        title: 'Get New York insurance',
        body: ['You need proof of New York auto liability insurance.']
      },
      {
        title: 'Gather proof of ownership',
        body: [
          'Bring your original out-of-state title or other original proof of ownership. Photocopies are not accepted.'
        ]
      },
      {
        title: 'Settle the sales tax question',
        body: [
          'If you were not a New York resident when you bought the vehicle, claim the non-resident exemption on Form DTF-803.',
          'If you bought it as a New York resident in another state, Form DTF-804 gives credit for the other state’s tax only if that state gives the same credit for New York tax.'
        ]
      },
      {
        title: 'Register and get inspected',
        body: [
          'Submit the Vehicle Registration/Title Application (MV-82) with your documents and pay the title fee and registration. Registration is a 2-year fee by weight, plus $25 for plates and any county use tax.',
          'You receive a 10-day inspection extension. Get the vehicle inspected before it runs out.'
        ]
      }
    ],
    checklist: [
      'Original out-of-state title or other original proof of ownership',
      'Vehicle Registration/Title Application (MV-82)',
      'Proof of New York insurance',
      'Proof of identity and age',
      'Sales tax form DTF-803 or DTF-804, if it applies',
      'Payment for the title fee, registration, and plates'
    ],
    calculatorNote:
      'If no sales tax is due, enter $0 as the price and the vehicle’s weight. The calculator shows the title and 2-year registration costs.',
    faqs: [
      {
        question: 'How long do I have to register my car after moving to New York?',
        answer: '30 days after you become a New York resident.'
      },
      {
        question: 'Do I pay New York sales tax on a car I already own?',
        answer:
          'Not if you were a non-resident when you bought it; claim the exemption on Form DTF-803. If you bought it out of state while living in New York, you owe New York tax, with credit on Form DTF-804 only for states that offer the same credit.'
      },
      {
        question: 'When do I need an inspection?',
        answer: 'Within the 10-day inspection extension you receive when you register.'
      }
    ],
    sources: [NY_SOURCES.outOfState, NY_SOURCES.salesTax, NY_SOURCES.register, NY_SOURCES.fees]
  },
  {
    slug: 'how-to-title-a-private-car-sale-in-illinois',
    stateKey: 'illinois',
    title: 'How to Title a Private Car Sale in Illinois',
    shortTitle: 'Title a private car sale',
    metaTitle: 'How to Title a Private Car Sale in Illinois',
    metaDescription:
      'Step-by-step guide to titling a car bought from a private seller in Illinois: Form RUT-50 and its flat tax tables, the 30-day deadline, the $165 title, and $151 plates.',
    cardDescription: 'Form RUT-50, the flat tax tables, the 30-day deadline, and fees.',
    intro: [
      'Illinois taxes a car bought from a private seller with flat amounts on Form RUT-50, not a percentage of the price.',
      'Here is the order to do it in, what it costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'Illinois SOS and IDOR',
    steps: [
      {
        title: 'Get the signed-over title',
        body: ['The seller signs the title over to you. Note the odometer reading and the purchase date.']
      },
      {
        title: 'Work out the tax on Form RUT-50',
        body: [
          'Under $15,000, the tax depends on the vehicle’s age (Table A): $465 for a vehicle up to 1 year old, down to $100 for one over 10 years old. Age is the year you apply for the title minus the model year.',
          'At $15,000 and up, the tax depends on the price (Table B): $850 for $15,000 to $19,999.99, rising to $10,100 at $1,000,000 or more. Motorcycles pay a flat $25.'
        ]
      },
      {
        title: 'File within 30 days',
        body: ['File Form RUT-50 and pay the tax within 30 days of buying the vehicle.']
      },
      {
        title: 'Apply for the title and plates',
        body: [
          'Complete the Application for Vehicle Transaction(s) (VSD-190) and apply at a Secretary of State facility with the title and Form RUT-50.',
          'The title is $165. Passenger plates are $151 a year ($41 for motorcycles), and electric vehicles pay $100 more.'
        ]
      },
      {
        title: 'Check for local taxes',
        body: [
          'Chicago residents owe $50 to $80 more by vehicle age (none at 15 years or older), and Cook County residents $90 to $225. For motorcycles, Chicago charges $15 and Cook County $90.'
        ]
      }
    ],
    sections: [
      {
        heading: 'Form RUT-50 Table A (under $15,000)',
        items: [
          '1 year old or newer: $465',
          '2 years: $365; 3 years: $290; 4 years: $240; 5 years: $190',
          '6 years: $165; 7 years: $155; 8 years: $140; 9 years: $125; 10 years: $115',
          'Over 10 years: $100'
        ]
      }
    ],
    checklist: [
      'The title, signed over by the seller',
      'Form RUT-50 with the tax payment',
      'Application for Vehicle Transaction(s) (VSD-190)',
      'Proof of liability insurance',
      'Payment for the $165 title fee and plates'
    ],
    calculatorNote:
      'The calculator applies the RUT-50 tables, including the $25 flat tax for motorcycles. It does not add the Chicago or Cook County taxes.',
    faqs: [
      {
        question: 'How is tax figured on a private car sale in Illinois?',
        answer:
          'With flat amounts on Form RUT-50: by vehicle age under $15,000 (Table A) and by price at $15,000 and up (Table B). Motorcycles pay $25.'
      },
      {
        question: 'How long do I have to file Form RUT-50?',
        answer: '30 days after buying the vehicle.'
      },
      {
        question: 'Do Chicago and Cook County charge extra?',
        answer: 'Yes. Chicago adds $50 to $80 by vehicle age (none at 15 years or older), and Cook County adds $90 to $225.'
      }
    ],
    sources: [IL_SOURCES.rut50, IL_SOURCES.rut5, IL_SOURCES.fees]
  },
  {
    slug: 'how-to-gift-a-car-in-illinois',
    stateKey: 'illinois',
    title: 'How to Gift a Car in Illinois',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in Illinois',
    metaDescription:
      'How to give or receive a car as a gift in Illinois: the $15 family rate on Form RUT-50, how gifts to others are taxed on fair market value, and titling within 30 days.',
    cardDescription: 'The $15 family rate, gifts to others, and titling.',
    intro: [
      'Illinois still requires Form RUT-50 for a gifted car. Close family members pay $15; other gifts are taxed on the vehicle’s fair market value using the regular tables.',
      'Here is how to transfer a gifted car.'
    ],
    lastVerified: 'October 2026',
    agency: 'Illinois SOS and IDOR',
    steps: [
      {
        title: 'Sign over the title',
        body: ['The person giving the car signs the title over to you.']
      },
      {
        title: 'Check whether the $15 family rate applies',
        body: [
          'A transfer from your spouse or civil union partner, parent, brother, sister, or child (including adopted children) is taxed $15 on Form RUT-50.'
        ]
      },
      {
        title: 'Otherwise, use fair market value',
        body: [
          'A gift or transfer with no price from anyone else is taxed on the vehicle’s fair market value, using Table A (under $15,000) or Table B ($15,000 and up).'
        ]
      },
      {
        title: 'File Form RUT-50 within 30 days',
        body: ['File the form and pay the tax within 30 days of receiving the vehicle.']
      },
      {
        title: 'Apply for the title and plates',
        body: [
          'Apply at a Secretary of State facility with the title, Form RUT-50, and the Application for Vehicle Transaction(s) (VSD-190). The title is $165 and passenger plates are $151 a year.'
        ]
      }
    ],
    checklist: [
      'The title, signed over by the giver',
      'Form RUT-50 with the $15 family rate or the table amount',
      'Application for Vehicle Transaction(s) (VSD-190)',
      'Proof of liability insurance',
      'Payment for the title fee and plates'
    ],
    calculatorNote:
      'For a family transfer, the tax is $15 rather than the table amount. For other gifts, enter the vehicle’s fair market value as the price.',
    faqs: [
      {
        question: 'Is a gifted car taxed in Illinois?',
        answer:
          'Yes, but between close family it is only $15: spouse or civil union partner, parent, brother, sister, or child. Other gifts are taxed on fair market value using the RUT-50 tables.'
      },
      {
        question: 'Which form do I file for a gift?',
        answer: 'Form RUT-50, the Private Party Vehicle Use Tax return, within 30 days.'
      },
      {
        question: 'Do grandparents qualify for the $15 rate?',
        answer: 'No. The $15 rate covers a spouse or civil union partner, parent, brother, sister, or child.'
      }
    ],
    sources: [IL_SOURCES.rut50, IL_SOURCES.rut5, IL_SOURCES.fees]
  },
  {
    slug: 'titling-a-car-in-illinois-after-moving-from-another-state',
    stateKey: 'illinois',
    title: 'Titling a Car in Illinois After Moving From Another State',
    shortTitle: 'Title a car after moving to Illinois',
    metaTitle: 'Titling Your Car After Moving to Illinois',
    metaDescription:
      'New to Illinois? Title and register your car within 30 days. Covers the VSD-190, your out-of-state title, when Illinois tax applies, the $165 title, and $151 plates.',
    cardDescription: 'The 30-day deadline, the VSD-190, tax, and fees.',
    intro: [
      'If you move to Illinois with a car registered in another state, you have 30 days to apply for an Illinois title and registration.',
      'Here is what to do and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'Illinois SOS and IDOR',
    steps: [
      {
        title: 'Mark the 30-day deadline',
        body: ['Apply within 30 days of establishing residence in Illinois.']
      },
      {
        title: 'Complete the VSD-190',
        body: [
          'Fill out the Application for Vehicle Transaction(s) (VSD-190) with your Illinois address, the odometer reading, the vehicle description and VIN, and any lienholders.'
        ]
      },
      {
        title: 'Bring your out-of-state title',
        body: [
          'Submit the out-of-state title. If a lienholder holds it, submit a copy of the title, registration, or bill of sale and a copy of the loan agreement instead.'
        ]
      },
      {
        title: 'Check whether tax applies',
        body: [
          'A vehicle titled and registered in another state 3 months or more before you moved is exempt. You still submit Form RUT-50 or RUT-25 showing the exempt status.',
          'A recent purchase from an individual is taxed on Form RUT-50.'
        ]
      },
      {
        title: 'Apply and pay the fees',
        body: [
          'Apply at a Secretary of State facility. The title is $165, passenger plates are $151 a year, and motorcycle plates are $41. You need liability insurance.'
        ]
      }
    ],
    checklist: [
      'Application for Vehicle Transaction(s) (VSD-190)',
      'Out-of-state title (or copies and the loan agreement if a lienholder holds it)',
      'Form RUT-50 or RUT-25',
      'Proof of liability insurance',
      'Payment for the $165 title fee and plates'
    ],
    calculatorNote:
      'If the vehicle is exempt from tax, enter $0 as the price. The calculator then shows only the title and registration costs.',
    faqs: [
      {
        question: 'How long do I have to title my car after moving to Illinois?',
        answer: '30 days after establishing residence.'
      },
      {
        question: 'Do I pay Illinois tax on a car I already own?',
        answer:
          'Not if it was titled and registered in another state at least 3 months before you moved. Submit Form RUT-50 or RUT-25 showing the exempt status.'
      },
      {
        question: 'How much are the title and plates?',
        answer: 'The title is $165, and passenger plates are $151 a year. Electric vehicles pay $100 more.'
      }
    ],
    sources: [IL_SOURCES.newResident, IL_SOURCES.fees, IL_SOURCES.rut50]
  },
  {
    slug: 'how-to-title-a-private-car-sale-in-ohio',
    stateKey: 'ohio',
    title: 'How to Title a Private Car Sale in Ohio',
    shortTitle: 'Title a private car sale',
    metaTitle: 'How to Title a Private Car Sale in Ohio',
    metaDescription:
      'Step-by-step guide to titling a car bought from a private seller in Ohio: the notarized title, the 30-day deadline, county sales tax of 6.50% to 8.25%, the $18 title, and registration.',
    cardDescription: 'The notarized title, 30-day deadline, county tax, and fees.',
    intro: [
      'In Ohio, titles are issued by county clerk of courts title offices, not the BMV. You pay the sales tax there when the title is transferred, then register at a deputy registrar.',
      'Here is the order to do it in, what it costs, and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'Ohio BMV and Ohio Department of Taxation',
    steps: [
      {
        title: 'Get the title with a notarized signature',
        body: ['The seller signs the title over to you, and the seller’s signature must be notarized.']
      },
      {
        title: 'Transfer the title within 30 days',
        body: [
          'Take the title to a county clerk of courts title office within 30 days of the sale. A late application costs $5 more.'
        ]
      },
      {
        title: 'Pay the sales tax at the title office',
        body: [
          'A private sale is taxed on the price paid, at the rate for the county where you live: 5.75% state tax plus county tax, 6.50% to 8.25% in total.',
          'The title fee is $18 ($23 in counties that add $5), and it includes noting a lien.'
        ]
      },
      {
        title: 'Register at a deputy registrar',
        body: [
          'With your Ohio title, register at a deputy registrar license agency. Registration is $36 a year ($30 for motorcycles), plus an $8 deputy registrar fee and any local permissive tax of up to $30.',
          'Electric vehicles pay $200 a year more, plug-in hybrids $150, and hybrids $100.'
        ]
      },
      {
        title: 'Check for E-Check',
        body: ['Some counties require an E-Check emissions certificate before you can register.']
      }
    ],
    sections: [
      {
        heading: 'How Ohio sales tax works on a private sale',
        items: [
          'Private (casual) sales of motor vehicles are taxable in Ohio.',
          'The tax is on the full amount paid, including between family members.',
          'An even trade of vehicles is taxed on each vehicle’s fair market value.',
          'If you take over the seller’s loan, the tax is on the loan balance you assume.'
        ]
      }
    ],
    checklist: [
      'The title, signed by the seller with the signature notarized',
      'Payment for sales tax at your county’s rate',
      'Payment for the $18 title fee (or $23)',
      'Proof of identity',
      'An E-Check certificate, if your county requires one',
      'Payment for registration and the deputy registrar fee'
    ],
    calculatorNote:
      'The calculator shows sales tax as a range from 6.50% to 8.25% and includes the $18 title and $36 registration. It does not add the $8 deputy registrar fee or local permissive tax.',
    faqs: [
      {
        question: 'Where do I title a car in Ohio?',
        answer: 'At a county clerk of courts title office. The BMV does not issue titles.'
      },
      {
        question: 'How long do I have to transfer the title?',
        answer: '30 days from the date of sale. After that, a $5 late fee applies.'
      },
      {
        question: 'What sales tax rate do I pay?',
        answer: 'The rate for the county where you live: 5.75% state tax plus county tax, 6.50% to 8.25% in total.'
      }
    ],
    sources: [OH_SOURCES.titles, OH_SOURCES.salesTax, OH_SOURCES.rates, OH_SOURCES.fees, OH_SOURCES.titleFee]
  },
  {
    slug: 'how-to-gift-a-car-in-ohio',
    stateKey: 'ohio',
    title: 'How to Gift a Car in Ohio',
    shortTitle: 'Gift a car',
    metaTitle: 'How to Gift a Car in Ohio',
    metaDescription:
      'How to give or receive a car in Ohio without a sale: when tax is due between family members, the exemption certificate at the title office, and the 30-day title transfer.',
    cardDescription: 'When tax is due, the exemption certificate, and the title transfer.',
    intro: [
      'In Ohio, any payment for a vehicle is taxed, even between family members. A transfer with no tax due needs an exemption certificate at the title office.',
      'Here is how to transfer a car you are giving or receiving.'
    ],
    lastVerified: 'October 2026',
    agency: 'Ohio BMV and Ohio Department of Taxation',
    steps: [
      {
        title: 'Know when tax is due',
        body: [
          'If any money or other payment changes hands, the full amount paid is taxed, even between family members. Taking over a loan counts as payment.'
        ]
      },
      {
        title: 'Sign over the title',
        body: ['The person giving the car signs the title over, and the signature must be notarized.']
      },
      {
        title: 'Bring an exemption certificate if no tax is paid',
        body: [
          'The clerk will not issue a title without tax unless you, as the person receiving the car, sign an exemption certificate giving the reason the transfer is not taxable. Ask the title office which reason applies to your transfer.'
        ]
      },
      {
        title: 'Transfer the title within 30 days',
        body: ['Apply at a county clerk of courts title office within 30 days. The title fee is $18 ($23 in some counties).']
      },
      {
        title: 'Register the car',
        body: ['Register at a deputy registrar: $36 a year, plus an $8 deputy registrar fee and any local permissive tax.']
      }
    ],
    sections: [
      {
        heading: 'Transfers Ohio lists as not taxed',
        items: [
          'Inheritance through probate court where there is no clear payment.',
          'A transfer to the beneficiary named on a transfer-on-death title.',
          'A transfer under a divorce decree.'
        ]
      }
    ],
    checklist: [
      'The title, signed over with the signature notarized',
      'An exemption certificate signed by the person receiving the car, if no tax is paid',
      'Payment for any tax due on an amount paid',
      'Payment for the $18 title fee (or $23)',
      'Payment for registration and the deputy registrar fee'
    ],
    calculatorNote:
      'If no tax is due, enter $0 as the price. If anything was paid, enter that amount; Ohio taxes it at your county’s rate.',
    faqs: [
      {
        question: 'Is a family car sale taxed in Ohio?',
        answer: 'Yes, if any payment changes hands. The full amount paid is taxed.'
      },
      {
        question: 'What do I need at the title office if no tax is paid?',
        answer: 'An exemption certificate, signed by you as the person receiving the car, giving the reason the transfer is not taxable.'
      },
      {
        question: 'Is an inherited car taxed?',
        answer:
          'Not when it passes through probate court with no clear payment, or to the beneficiary named on a transfer-on-death title.'
      }
    ],
    sources: [OH_SOURCES.salesTax, OH_SOURCES.exemption, OH_SOURCES.titles, OH_SOURCES.fees]
  },
  {
    slug: 'titling-a-car-in-ohio-after-moving-from-another-state',
    stateKey: 'ohio',
    title: 'Titling a Car in Ohio After Moving From Another State',
    shortTitle: 'Title a car after moving to Ohio',
    metaTitle: 'Titling Your Car After Moving to Ohio',
    metaDescription:
      'New to Ohio? Transfer your title and registration within 30 days. Covers the clerk of courts title office, the VIN inspection, when sales tax applies, and E-Check.',
    cardDescription: 'The 30-day deadline, VIN inspection, tax, and E-Check.',
    intro: [
      'If you move to Ohio with a car from another state, you have 30 days after establishing residency to transfer your title and registration.',
      'Here is what to do and what to bring.'
    ],
    lastVerified: 'October 2026',
    agency: 'Ohio BMV and Ohio Department of Taxation',
    steps: [
      {
        title: 'Mark the 30-day deadline',
        body: [
          'Transfer your out-of-state title and registration to Ohio within 30 days of establishing residency.'
        ]
      },
      {
        title: 'Get a VIN inspection',
        body: [
          'An out-of-state vehicle needs a VIN inspection, done at a deputy registrar license agency, a participating clerk of courts title office, or a participating Ohio dealer.'
        ]
      },
      {
        title: 'Convert your title at the clerk of courts',
        body: [
          'Take your out-of-state title to a county clerk of courts title office to get an Ohio title. The title fee is $18 ($23 in some counties).'
        ]
      },
      {
        title: 'Check whether sales tax applies',
        body: [
          'If you bought the vehicle at least six months before moving to Ohio, no Ohio tax is due. If you bought it more recently, Ohio tax is due with credit for sales tax paid to the other state.'
        ]
      },
      {
        title: 'Register at a deputy registrar',
        body: [
          'Bring your Ohio title and proof of identity. Registration is $36 a year plus an $8 deputy registrar fee and any local permissive tax. If your county requires E-Check, bring the certificate.'
        ]
      }
    ],
    checklist: [
      'Your out-of-state title',
      'A completed VIN inspection',
      'Proof of identity',
      'Proof of sales tax paid to another state, if you bought within six months',
      'An E-Check certificate, if your county requires one',
      'Payment for the title fee and registration'
    ],
    calculatorNote:
      'If no tax is due, enter $0 as the price. The calculator then shows the $18 title and $36 registration.',
    faqs: [
      {
        question: 'How long do I have to title my car after moving to Ohio?',
        answer: '30 days after establishing residency.'
      },
      {
        question: 'Do I pay Ohio sales tax on a car I already own?',
        answer:
          'Not if you bought it at least six months before moving. Otherwise Ohio tax is due, with credit for sales tax paid to another state.'
      },
      {
        question: 'Where do I get the VIN inspected?',
        answer: 'At a deputy registrar license agency, a participating clerk of courts title office, or a participating Ohio dealer.'
      }
    ],
    sources: [OH_SOURCES.newResident, OH_SOURCES.titles, OH_SOURCES.salesTax, OH_SOURCES.fees]
  }
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuidesForState(stateKey: string): Guide[] {
  return GUIDES.filter((g) => g.stateKey === stateKey);
}
