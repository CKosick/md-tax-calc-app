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
  }
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuidesForState(stateKey: string): Guide[] {
  return GUIDES.filter((g) => g.stateKey === stateKey);
}
