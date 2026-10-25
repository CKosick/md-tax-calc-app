export type VehicleType = 'passenger' | 'motorcycle';
export type WeightClass =
  | 'under3500lbs'
  | '3501to3700lbs'
  | 'under3700lbs'
  | 'over3700lbs';
export type FuelType = 'gasoline' | 'ev' | 'phev';
export type RegistrationTerm = 1 | 2 | 3;
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
   * Passenger fee chart by vehicle weight (New York). When present it replaces the weight
   * classes: the form asks for the weight in lbs and the first tier whose maxLbs is at or above
   * it applies (a tier without maxLbs covers everything heavier). Fees are for termYears.
   */
  passengerWeightChart?: {
    termYears: number;
    defaultWeightLbs: number;
    tiers: { maxLbs?: number; fee: number }[];
  };
  /**
   * Registration fees that scale with the vehicle's value (California). On a private-party
   * transfer the value is the purchase price, so they are estimated from the price entered.
   */
  /**
   * Registration by the vehicle's original list price (MSRP), reduced with age (Michigan,
   * Minnesota). The form asks for the list price; a blank entry uses defaultListPrice.
   * The registration year is the vehicle's age plus one (model year = first year).
   */
  listPriceRegistration?: {
    defaultListPrice: number;
    /** Michigan: first-year fee by list price bracket (a bracket covers prices up to maxPrice). */
    brackets?: { maxPrice: number; fee: number }[];
    /** Michigan: above the top bracket, this much more for each $1,000 (or part) over it. */
    perThousandOverTop?: number;
    /** Minnesota: fixed amount plus rate x list price x the year's factor. */
    fixed?: number;
    rate?: number;
    /** Share applied by registration year (index 0 = first year); the last value repeats. */
    yearFactors: number[];
    /** A flat amount from this registration year on (Minnesota: $30 from the 11th year). */
    flatFromYear?: { year: number; fee: number };
  };
  /**
   * Passenger plate priced from the sale price (Louisiana): ratePerYear x the price rounded to the
   * nearest roundTo, but never less than minValue, for each year of the term.
   */
  salePricePlate?: { ratePerYear: number; minValue: number; roundTo: number };
  /**
   * Annual passenger and motorcycle fees by registration year (Oklahoma), replacing the weight
   * tiers. The registration year is the vehicle's age plus one.
   */
  feesByRegistrationYear?: {
    passenger: { maxYear?: number; fee: number }[];
    motorcycle: { maxYear?: number; fee: number }[];
  };
  /**
   * One-time fees when the buyer has no plate of their own to transfer (Florida: $225 initial
   * registration fee and $28 for a new plate). The form asks; the default answer is no plate.
   */
  newPlateFees?: {
    initialRegistrationFee: number;
    plateFee: number;
  };
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
  /** Flat tax for motorcycles, which skip Tables A and B (Illinois RUT-50: $25). */
  motorcycleFee?: number;
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
  /** Local tax applies only to this much of the taxable base (Florida surtax: first $5,000). */
  localTaxBaseCap?: number;
  /**
   * Places with a verified local rate (Pennsylvania: rest of state, Allegheny County, Philadelphia).
   * Choosing one fixes the local rate, so the result is one total instead of the min-max range.
   * localRate is the local component only; source is the page it was verified against.
   */
  localities?: { id: string; label: string; localRate: number; source: string }[];
  /** No local tax either when a price tier exempts the sale from state tax (Arkansas under $4,000). */
  noLocalTaxWhenStateExempt?: boolean;
  /**
   * Used vehicle excise floor (Oklahoma): a flat tax covers the first part of the value and the
   * excise rate applies only above it ($20 on the first $1,500, then 3.25%).
   */
  usedVehicleExcise?: { flatTax: number; flatTaxCovers: number };
  /** A second state tax on the same base, added to the excise tax (Oklahoma 1.25% sales tax). */
  additionalSalesTaxRate?: number;
  /** Flat tax in place of the rate for older, low-priced vehicles (Minnesota: $10). */
  olderVehicleFlatTax?: { minAge: number; maxPrice: number; tax: number };
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
  /** Chosen locality id, for states with localities (blank shows the range). */
  localityId?: string;
  /** Original list price (MSRP), for states with listPriceRegistration. */
  listPrice?: number;
  /** True when the buyer has a plate of their own to transfer (states with newPlateFees). */
  hasPlateToTransfer?: boolean;
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
  /** One-time initial registration fee when there is no plate to transfer (Florida $225). */
  initialRegistrationFee?: number;
  /** New plate fee when there is no plate to transfer (Florida $28). */
  newPlateFee?: number;
  /** The chosen locality and its local tax, included in exciseTax (states with localities). */
  localityLabel?: string;
  localityTax?: number;
  /** List price the registration was figured on (states with listPriceRegistration). */
  listPriceUsed?: number;
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
