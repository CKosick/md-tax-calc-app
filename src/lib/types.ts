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
  registration: StateRegistrationRules;
  flatTaxTable?: FlatTaxTableConfig;
  veipFee?: number;
  localTaxNote?: string;
  notes: string[];
  disclaimers: string[];
  faqs: FaqItem[];
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
  vehicleAge: number;
  tradeInDeducted: number;
  tradeInIgnored: boolean;
  veipFee: number;
  taxBase: TaxBaseType;
  itemizedList: ItemizedCostItem[];
}

export interface PartnerSlotConfig {
  id: string;
  position: 'below-results' | 'sidebar';
  headline: string;
  description: string;
  ctaText: string;
  badge?: string;
  href: string;
  trackingParams?: Record<string, string>;
}
