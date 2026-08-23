import { CareerLevel, CountryCode, CurrencyCode, Department, PayBand } from '../types/salary';

export interface CountryInfo {
  code: CountryCode;
  name: string;
  currency: CurrencyCode;
  symbol: string;
  fxRateToUSD: number; // local units per 1 USD
  geoCostFactor: number; // Relative to US = 1.0
  cities: string[];
}

export const COUNTRIES: Record<CountryCode, CountryInfo> = {
  US: {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    symbol: '$',
    fxRateToUSD: 1.0,
    geoCostFactor: 1.0,
    cities: ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston', 'Chicago'],
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    currency: 'GBP',
    symbol: '£',
    fxRateToUSD: 0.79,
    geoCostFactor: 0.85,
    cities: ['London', 'Manchester', 'Edinburgh', 'Cambridge', 'Bristol'],
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    symbol: '€',
    fxRateToUSD: 0.92,
    geoCostFactor: 0.82,
    cities: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne'],
  },
  FR: {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    symbol: '€',
    fxRateToUSD: 0.92,
    geoCostFactor: 0.80,
    cities: ['Paris', 'Lyon', 'Toulouse', 'Nantes', 'Marseille'],
  },
  IN: {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    symbol: '₹',
    fxRateToUSD: 86.5,
    geoCostFactor: 0.35,
    cities: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Mumbai', 'Chennai'],
  },
  SG: {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    symbol: 'S$',
    fxRateToUSD: 1.34,
    geoCostFactor: 0.82,
    cities: ['Singapore'],
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    symbol: '¥',
    fxRateToUSD: 152.0,
    geoCostFactor: 0.75,
    cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Fukuoka'],
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    symbol: 'A$',
    fxRateToUSD: 1.54,
    geoCostFactor: 0.82,
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth'],
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    symbol: 'C$',
    fxRateToUSD: 1.38,
    geoCostFactor: 0.80,
    cities: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary'],
  },
  BR: {
    code: 'BR',
    name: 'Brazil',
    currency: 'BRL',
    symbol: 'R$',
    fxRateToUSD: 5.65,
    geoCostFactor: 0.40,
    cities: ['São Paulo', 'Rio de Janeiro', 'Florianópolis', 'Belo Horizonte'],
  },
  NL: {
    code: 'NL',
    name: 'Netherlands',
    currency: 'EUR',
    symbol: '€',
    fxRateToUSD: 0.92,
    geoCostFactor: 0.82,
    cities: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Eindhoven'],
  },
  PL: {
    code: 'PL',
    name: 'Poland',
    currency: 'PLN',
    symbol: 'zł',
    fxRateToUSD: 4.05,
    geoCostFactor: 0.50,
    cities: ['Warsaw', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań'],
  },
};

export const DEPARTMENTS: Department[] = [
  'Engineering',
  'Product',
  'Design',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Operations',
];

export const CAREER_LEVELS: { level: CareerLevel; title: string; targetBonus: number; usBaseMidUSD: number; spreadPct: number }[] = [
  { level: 'L1', title: 'Associate / Junior', targetBonus: 8, usBaseMidUSD: 80000, spreadPct: 0.20 },
  { level: 'L2', title: 'Mid-Level Professional', targetBonus: 12, usBaseMidUSD: 110000, spreadPct: 0.20 },
  { level: 'L3', title: 'Senior Specialist / Lead', targetBonus: 15, usBaseMidUSD: 150000, spreadPct: 0.20 },
  { level: 'L4', title: 'Staff Specialist / Team Lead', targetBonus: 20, usBaseMidUSD: 195000, spreadPct: 0.20 },
  { level: 'L5', title: 'Principal / Engineering Manager', targetBonus: 25, usBaseMidUSD: 245000, spreadPct: 0.22 },
  { level: 'L6', title: 'Sr. Principal / Sr. Manager', targetBonus: 30, usBaseMidUSD: 310000, spreadPct: 0.25 },
  { level: 'L7', title: 'Director / VP / Executive', targetBonus: 40, usBaseMidUSD: 410000, spreadPct: 0.30 },
];

export const DEPARTMENT_MULTIPLIERS: Record<Department, number> = {
  Engineering: 1.15,
  Product: 1.10,
  Design: 1.02,
  Sales: 1.05,
  Marketing: 0.95,
  Finance: 1.00,
  HR: 0.92,
  Operations: 0.88,
};

export const DEPARTMENT_ROLES: Record<Department, Record<CareerLevel, string>> = {
  Engineering: {
    L1: 'Junior Software Engineer',
    L2: 'Software Engineer',
    L3: 'Senior Software Engineer',
    L4: 'Staff Software Engineer',
    L5: 'Principal Engineer / Eng Manager',
    L6: 'Senior Principal Engineer / Sr. EM',
    L7: 'VP of Engineering',
  },
  Product: {
    L1: 'Associate Product Manager',
    L2: 'Product Manager',
    L3: 'Senior Product Manager',
    L4: 'Staff Product Manager',
    L5: 'Principal Product Manager / Group PM',
    L6: 'Director of Product Management',
    L7: 'VP of Product',
  },
  Design: {
    L1: 'Junior Product Designer',
    L2: 'Product Designer',
    L3: 'Senior Product Designer',
    L4: 'Staff UX Designer / Design Lead',
    L5: 'Design Director / Principal Designer',
    L6: 'Senior Director of Product Design',
    L7: 'VP of Global Design',
  },
  Sales: {
    L1: 'Sales Development Representative',
    L2: 'Account Executive',
    L3: 'Senior Enterprise Account Executive',
    L4: 'Strategic Enterprise Sales Lead',
    L5: 'Regional Sales Director',
    L6: 'VP of Regional Sales',
    L7: 'Chief Commercial Officer',
  },
  Marketing: {
    L1: 'Marketing Coordinator',
    L2: 'Growth Marketing Specialist',
    L3: 'Senior Product Marketing Manager',
    L4: 'Head of Growth Marketing',
    L5: 'Director of Brand & Content',
    L6: 'Senior Director of Global Marketing',
    L7: 'Chief Marketing Officer',
  },
  HR: {
    L1: 'People Operations Coordinator',
    L2: 'HR Business Partner',
    L3: 'Senior Compensation & People Partner',
    L4: 'People Operations Lead',
    L5: 'Director of Total Rewards & People',
    L6: 'Senior Director of Talent & Culture',
    L7: 'Chief People Officer',
  },
  Finance: {
    L1: 'Financial Analyst',
    L2: 'Senior Financial Analyst',
    L3: 'Finance Manager / FP&A Lead',
    L4: 'Senior Manager of Financial Strategy',
    L5: 'Director of FP&A and Treasury',
    L6: 'Senior Director of Global Finance',
    L7: 'VP of Finance & Corporate Strategy',
  },
  Operations: {
    L1: 'Operations Specialist',
    L2: 'Operations Program Manager',
    L3: 'Senior Business Operations Manager',
    L4: 'Principal Operations Strategist',
    L5: 'Director of Business Operations',
    L6: 'Senior Director of Operations & Legal',
    L7: 'VP of Global Operations',
  },
};

/**
 * Calculates pre-computed Pay Bands for every Level, Department, and Country
 */
export function generatePayBand(level: CareerLevel, dept: Department, countryCode: CountryCode): PayBand {
  const levelMeta = CAREER_LEVELS.find((l) => l.level === level) || CAREER_LEVELS[0];
  const country = COUNTRIES[countryCode];
  const deptMult = DEPARTMENT_MULTIPLIERS[dept];
  
  // Base USD Midpoint tailored for level and dept, scaled by geographic cost factor
  const midUSD = Math.round(levelMeta.usBaseMidUSD * deptMult * country.geoCostFactor);
  const spread = levelMeta.spreadPct;
  const minUSD = Math.round(midUSD * (1 - spread));
  const maxUSD = Math.round(midUSD * (1 + spread));

  // Local currency conversions
  const fx = country.fxRateToUSD;
  const midLocal = Math.round(midUSD * fx);
  const minLocal = Math.round(minUSD * fx);
  const maxLocal = Math.round(maxUSD * fx);

  return {
    level,
    department: dept,
    country: countryCode,
    currency: country.currency,
    minUSD,
    midUSD,
    maxUSD,
    minLocal,
    midLocal,
    maxLocal,
    targetBonusPct: levelMeta.targetBonus,
  };
}
