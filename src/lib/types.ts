export type VehicleType = 'passenger' | 'motorcycle';
export type WeightClass = 'under3700lbs' | 'over3700lbs';
export type FuelType = 'gasoline' | 'ev' | 'phev';
export type RegistrationTerm = 1 | 2;
export type TaxBaseType = 'price' | 'fairMarketValue' | 'bookValue';

export interface StateRegistrationRules {
  terms: number[];
  passenger: {
    under3700lbs: number | Record<string, number>;
    over3700lbs: number | Record<string, number>;
  };
  motorcycle: number | Record<string, number>;
  evSurchargeAnnual?: number;
  phevSurchargeAnnual?: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface StateRule {
  label: string;
  slug: string;
  exciseTaxRate: number;
  minExciseTax: number | null;
  taxBase: TaxBaseType;
  titleFee: number;
  lienFilingFee: number;
  tradeInDeductible: boolean;
  bookValueRule?: string;
  registration: StateRegistrationRules;
  veipFee?: number;
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
  fuelType: FuelType;
  registrationTerm: RegistrationTerm;
  isFinanced: boolean;
  tradeInValue: number;
}

export interface ItemizedCostItem {
  id: string;
  label: string;
  amount: number;
  description?: string;
  isHero?: boolean;
}

export interface CostBreakdown {
  exciseTax: number;
  titleFee: number;
  lienFilingFee: number;
  baseRegistrationFee: number;
  evSurcharge: number;
  registrationTotal: number;
  totalFirstYearCost: number;
  minTaxApplied: boolean;
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
