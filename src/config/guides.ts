import { FaqItem } from '@/lib/types';

/**
 * How-to guides. Every fee, deadline, exemption, and document below was checked against
 * MDOT MVA pages (listed in each guide's sources) on the lastVerified date. When MVA guidance
 * was silent or ambiguous on a point, the guide says less rather than guessing.
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
  }
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getGuidesForState(stateKey: string): Guide[] {
  return GUIDES.filter((g) => g.stateKey === stateKey);
}
