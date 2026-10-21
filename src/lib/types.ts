export type VehicleType = 'passenger' | 'motorcycle';
export type WeightClass =
  | 'under3500lbs'
  | '3501to3700lbs'
  | 'under3700lbs'
  | 'over3700lbs';
export type FuelType = 'gasoline' | 'ev' | 'phev';
export type RegistrationTerm = 1 | 2;
export type TaxBaseType = 'price' | 'fairMarketValue' | 'bookValue';

export interface StateRegistrationRules {
  terms: number[];
  passenger: {
    under3500lbs?: number | Record<string, number>;
    '3501to3700lbs'?: number | Record<string, number>;
    under3700lbs?: number | Record<string, number>;
    over3700lbs: number | Record<string, number>;
    [key: string]: unknown;
  };
  motorcycle: number | Record<string, number>;
  evSurchargeAnnual?: number;
  phevSurchargeAnnual?: number;
  /**
   * Weight (lbs) separating the two passenger tiers for states priced as under3700lbs / over3700lbs.
   * Defaults to 3,700; Virginia splits at 4,000. Only the form labels use it.
   */
  passengerWeightSplitLbs?: number;
  /**
   * Registration fees that scale with the vehicle's value (California). On a private-party
   * transfer the value is the purchase price, so they are estimated from the price entered.
   */
  valueBasedFees?: {
    /** Annual license fee as a share of value (California VLF: 0.0065). */
    licenseFeeRate: number;
    /** Flat annual fee by value bracket: the highest minValue not above the value applies. */
    improvementFeeTiers: { minValue: number; fee: number }[];
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FlatTaxAgeBracket {
  maxAge?: number;
  fee: number;
}

export interface FlatTaxPriceBracket {
  minPrice: number;
  maxPrice?: number;
  fee: number;
}

export interface FlatTaxTableConfig {
  thresholdPrice: number;
  tableAByAge: FlatTaxAgeBracket[];
  tableBByPrice: FlatTaxPriceBracket[];
}

export interface PriceTier {
  maxPrice: number | null;
  rate: number;
}

export interface StateRule {
  label: string;
  slug: string;
  exciseTaxRate: number;
  minExciseTax?: number | null;
  maxExciseTax?: number | null;
  localTaxMinRate?: number;
  localTaxMaxRate?: number;
  luxuryTaxThreshold?: number | null;
  luxuryTaxRate?: number | null;
  priceTiers?: PriceTier[];
  taxBase: TaxBaseType;
  titleFee: number;
  lienFilingFee: number;
  tradeInDeductible: boolean;
  bookValueRule?: string;
  /**
   * Book value assessment: when the vehicle is younger than maxVehicleAge and the price is more
   * than priceBelowBookThreshold below the entered book value, tax is calculated on the book value.
   */
  bookValueAssessment?: {
    maxVehicleAge: number;
    priceBelowBookThreshold: number;
  };
  /**
   * State-specific book value warning (no effect on the tax): shown in the results when the
   * vehicle is younger than maxVehicleAge. States without it keep the general <= 7 year notice.
   */
  /**
   * Presumptive value rule (Texas SPV): a private sale is taxed on the greater of the price or
   * minShareOfValue x the entered presumptive value. A certified appraisal, if entered, replaces
   * the presumptive value test but cannot take the taxable value below the price.
   */
  presumptiveValueRule?: {
    minShareOfValue: number;
  };
  bookValueNotice?: {
    maxVehicleAge: number;
    heading: string;
    text: string;
  };
  registration: StateRegistrationRules;
  flatTaxTable?: FlatTaxTableConfig;
  veipFee?: number;
  localTaxNote?: string;
  notes: string[];
  disclaimers: string[];
  faqs: FaqItem[];
  /** Month and year this state's rates and fees were last checked against its sources. */
  lastVerified: string;
  sources: string[];
}

export type StateRulesConfig = Record<string, StateRule>;

export interface CalculatorInputs {
  state: string;
  vehicleType: VehicleType;
  purchasePrice: number;
  vehicleYear: number;
  weightClass: WeightClass;
  vehicleWeight?: number;
  vehicleWeightLbs?: number;
  weight?: number;
  fuelType: FuelType;
  registrationTerm: RegistrationTerm;
  isFinanced: boolean;
  tradeInValue: number;
  /** Optional NADA retail book value (states with a bookValueAssessment rule). */
  bookValue?: number;
  /** Optional Standard Presumptive Value (states with a presumptiveValueRule, e.g. Texas). */
  presumptiveValue?: number;
  /** Optional certified appraisal value that replaces the presumptive value test. */
  appraisedValue?: number;
}

export interface ItemizedCostItem {
  id: string;
  label: string;
  amount: number;
  amountMax?: number;
  amountRangeFormatted?: string;
  description?: string;
  isHero?: boolean;
}

export interface CostBreakdown {
  exciseTax: number;
  localTaxMin?: number;
  localTaxMax?: number;
  combinedTaxMin?: number;
  combinedTaxMax?: number;
  hasLocalTax?: boolean;
  titleFee: number;
  lienFilingFee: number;
  baseRegistrationFee: number;
  evSurcharge: number;
  /** Value-based license fee (California VLF), included in registrationTotal. */
  vehicleLicenseFee?: number;
  /** Value-tiered transportation improvement fee (California TIF), included in registrationTotal. */
  transportationImprovementFee?: number;
  registrationTotal: number;
  totalFirstYearCost: number;
  totalFirstYearCostMin?: number;
  totalFirstYearCostMax?: number;
  minTaxApplied: boolean;
  maxTaxApplied?: boolean;
  luxuryTaxApplied?: boolean;
  bookValueApplies: boolean;
  /** True when the excise tax was calculated on the entered book value instead of the price. */
  bookValueApplied?: boolean;
  /** 'presumptive' when taxed on the presumptive value share, 'appraisal' when on the appraisal. */
  presumptiveValueApplied?: 'presumptive' | 'appraisal';
  vehicleAge: number;
  tradeInDeducted: number;
  tradeInIgnored: boolean;
  veipFee: number;
  taxBase: TaxBaseType;
  itemizedList: ItemizedCostItem[];
}

/** Where a partner slot renders: above-results sits directly above the cost summary. */
export type PartnerSlotPosition = 'above-results' | 'below-results' | 'sidebar';

export interface PartnerSlotConfig {
  id: string;
  position: PartnerSlotPosition;
  headline: string;
  description: string;
  ctaText: string;
  badge?: string;
  href: string;
  /** Only show this slot once the user indicates the purchase is financed. */
  requiresFinancing?: boolean;
  trackingParams?: Record<string, string>;
}
