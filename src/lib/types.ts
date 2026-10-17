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
