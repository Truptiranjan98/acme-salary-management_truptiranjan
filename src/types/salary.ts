export type CountryCode = 
  | 'US' 
  | 'GB' 
  | 'DE' 
  | 'FR' 
  | 'IN' 
  | 'SG' 
  | 'JP' 
  | 'AU' 
  | 'CA' 
  | 'BR' 
  | 'NL' 
  | 'PL';

export type CurrencyCode = 
  | 'USD' 
  | 'GBP' 
  | 'EUR' 
  | 'INR' 
  | 'SGD' 
  | 'JPY' 
  | 'AUD' 
  | 'CAD' 
  | 'BRL' 
  | 'PLN';

export type Department = 
  | 'Engineering' 
  | 'Product' 
  | 'Design' 
  | 'Sales' 
  | 'Marketing' 
  | 'HR' 
  | 'Finance' 
  | 'Operations';

export type CareerLevel = 
  | 'L1' // Associate / Entry Level
  | 'L2' // Mid-Level
  | 'L3' // Senior
  | 'L4' // Staff / Lead
  | 'L5' // Principal / Manager
  | 'L6' // Sr. Principal / Sr. Manager
  | 'L7'; // Director / VP

export type BandStatus = 'BELOW_BAND' | 'IN_BAND' | 'ABOVE_BAND';

export type AdjustmentReason = 
  | 'MERIT_INCREASE' 
  | 'PROMOTION' 
  | 'MARKET_CORRECTION' 
  | 'COST_OF_LIVING' 
  | 'RETENTION_EQUITY' 
  | 'ANNUAL_REVIEW';

export interface SalaryHistoryEntry {
  id: string;
  date: string;
  previousSalaryLocal: number;
  newSalaryLocal: number;
  previousSalaryUSD: number;
  newSalaryUSD: number;
  percentageChange: number;
  reason: AdjustmentReason;
  notes: string;
  approvedBy: string;
}

export interface PayBand {
  level: CareerLevel;
  department: Department;
  country: CountryCode;
  currency: CurrencyCode;
  minLocal: number;
  midLocal: number;
  maxLocal: number;
  minUSD: number;
  midUSD: number;
  maxUSD: number;
  targetBonusPct: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar: string;
  gender: 'Female' | 'Male' | 'Non-Binary';
  department: Department;
  role: string;
  level: CareerLevel;
  country: CountryCode;
  countryName: string;
  city: string;
  currency: CurrencyCode;
  baseSalary: number; // in local currency
  bonusPercentage: number;
  totalCompLocal: number;
  baseSalaryUSD: number;
  totalCompUSD: number;
  bandMinUSD: number;
  bandMidUSD: number;
  bandMaxUSD: number;
  bandMinLocal: number;
  bandMidLocal: number;
  bandMaxLocal: number;
  compaRatio: number; // baseSalary / bandMidpoint (0.80 - 1.20 is standard band)
  bandStatus: BandStatus;
  tenureYears: number;
  hireDate: string;
  performanceRating: 1 | 2 | 3 | 4 | 5; // 1: Needs Imp, 2: Developing, 3: Strong, 4: Exceeds, 5: Exceptional
  employmentType: 'Full-Time' | 'Contract';
  salaryHistory: SalaryHistoryEntry[];
  lastUpdated: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  employeeId: string;
  employeeName: string;
  department: Department;
  level: CareerLevel;
  country: CountryCode;
  currency: CurrencyCode;
  previousSalaryLocal: number;
  newSalaryLocal: number;
  previousSalaryUSD: number;
  newSalaryUSD: number;
  deltaUSD: number;
  percentageChange: number;
  reason: AdjustmentReason;
  notes: string;
  actor: string;
}

export interface EmployeeQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  department?: string;
  country?: string;
  level?: string;
  bandStatus?: string;
  performanceRating?: string;
  minCompaRatio?: number;
  maxCompaRatio?: number;
  minSalaryUSD?: number;
  maxSalaryUSD?: number;
  anomalyType?: 'UNDERPAID' | 'OVERPAID' | 'HIGH_PERF_UNDERPAID' | 'ALL_ANOMALIES';
  sortBy?: 'fullName' | 'baseSalaryUSD' | 'totalCompUSD' | 'compaRatio' | 'tenureYears' | 'performanceRating' | 'level' | 'department' | 'country';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OverviewMetrics {
  totalHeadcount: number;
  totalPayrollUSD: number;
  avgBaseSalaryUSD: number;
  medianBaseSalaryUSD: number;
  avgTotalCompUSD: number;
  medianTotalCompUSD: number;
  avgCompaRatio: number;
  totalBonusPoolUSD: number;
  outOfBandCount: number;
  belowBandCount: number;
  aboveBandCount: number;
  healthyBandCount: number;
  highPerformerUnderpaidCount: number;
  genderPayEquity: {
    femaleAvgUSD: number;
    maleAvgUSD: number;
    nonBinaryAvgUSD: number;
    femaleCompaRatio: number;
    maleCompaRatio: number;
    payGapPct: number; // (male - female) / male
  };
}

export interface DepartmentMetric {
  department: Department;
  headcount: number;
  totalCostUSD: number;
  avgBaseSalaryUSD: number;
  medianBaseSalaryUSD: number;
  minSalaryUSD: number;
  maxSalaryUSD: number;
  avgCompaRatio: number;
  outOfBandCount: number;
  pctOfTotalBudget: number;
}

export interface CountryMetric {
  country: CountryCode;
  countryName: string;
  currency: CurrencyCode;
  exchangeRateToUSD: number;
  headcount: number;
  totalCostUSD: number;
  totalCostLocal: number;
  avgSalaryUSD: number;
  medianSalaryUSD: number;
  avgCompaRatio: number;
}

export interface LevelDistributionMetric {
  level: CareerLevel;
  title: string;
  headcount: number;
  minSalaryUSD: number;
  p25SalaryUSD: number;
  medianSalaryUSD: number;
  p75SalaryUSD: number;
  maxSalaryUSD: number;
  bandMinUSD: number;
  bandMidUSD: number;
  bandMaxUSD: number;
  avgCompaRatio: number;
  belowBandCount: number;
  aboveBandCount: number;
  inBandCount: number;
}

export interface SimulationRequest {
  meritPoolPct: number; // e.g. 3.5%
  applyToDepartment?: Department | 'ALL';
  applyToCountry?: CountryCode | 'ALL';
  performanceMultipliers: {
    rating1: number; // e.g. 0x
    rating2: number; // e.g. 0.5x
    rating3: number; // e.g. 1.0x
    rating4: number; // e.g. 1.3x
    rating5: number; // e.g. 1.8x
  };
  remedyBelowBand: boolean; // Auto-bring below-min employees to band min
}

export interface SimulationResult {
  eligibleHeadcount: number;
  currentPayrollUSD: number;
  simulatedPayrollUSD: number;
  totalCostDeltaUSD: number;
  overallIncreasePct: number;
  avgIncreaseUSD: number;
  employeesAdjustedCount: number;
  remediedBelowBandCount: number;
  previewSamples: {
    id: string;
    fullName: string;
    department: Department;
    level: CareerLevel;
    country: CountryCode;
    currentSalaryUSD: number;
    simulatedSalaryUSD: number;
    deltaUSD: number;
    pctChange: number;
    currentCompaRatio: number;
    simulatedCompaRatio: number;
    performanceRating: number;
  }[];
}
