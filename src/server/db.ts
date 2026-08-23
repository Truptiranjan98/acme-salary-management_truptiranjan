import {
  AdjustmentReason,
  AuditLog,
  BandStatus,
  CareerLevel,
  CountryCode,
  Department,
  Employee,
  EmployeeQueryParams,
  OverviewMetrics,
  DepartmentMetric,
  CountryMetric,
  LevelDistributionMetric,
  PaginatedResult,
  SimulationRequest,
  SimulationResult,
} from '../types/salary';
import {
  CAREER_LEVELS,
  COUNTRIES,
  CountryInfo,
  DEPARTMENT_ROLES,
  DEPARTMENTS,
  generatePayBand,
} from './seedData';

// Deterministic PRNG (LCG)
class DeterministicPRNG {
  private seed: number;

  constructor(seed: number = 123456789) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  choice<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }

  normal(mean: number = 0, stdev: number = 1): number {
    // Box-Muller transform
    const u1 = Math.max(1e-10, this.next());
    const u2 = this.next();
    const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z * stdev;
  }
}

const FIRST_NAMES_FEMALE = [
  'Emma', 'Sophia', 'Olivia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Priya', 'Ananya', 'Aarohi', 'Diya', 'Fatima', 'Aisha', 'Zara', 'Mei', 'Yuki', 'Sakura',
  'Elena', 'Camille', 'Clara', 'Sophie', 'Hannah', 'Mia', 'Lucia', 'Chiara', 'Maria', 'Beatriz',
  'Chloe', 'Zoe', 'Leila', 'Noor', 'Kavita', 'Sunita', 'Jing', 'Hui', 'Aoi', 'Natsuki'
];

const FIRST_NAMES_MALE = [
  'Liam', 'Noah', 'Oliver', 'James', 'William', 'Benjamin', 'Lucas', 'Henry', 'Alexander', 'Sebastian',
  'Aarav', 'Vihaan', 'Aditya', 'Rohan', 'Arjun', 'Kabir', 'Zayd', 'Tariq', 'Omar', 'Kenji',
  'Hiroshi', 'Ren', 'Daiki', 'Lucas', 'Mateo', 'Gabriel', 'Leonardo', 'Thiago', 'Arthur', 'Louis',
  'Felix', 'Max', 'Lukas', 'Julian', 'David', 'Daniel', 'Samuel', 'Wei', 'Chen', 'Jun'
];

const FIRST_NAMES_NON_BINARY = [
  'Alex', 'Jordan', 'Taylor', 'Morgan', 'Sam', 'Riley', 'Casey', 'Avery', 'Rowan', 'Quinn',
  'Kai', 'River', 'Sage', 'Skyler', 'Eden', 'Reese', 'Finley', 'Hayden', 'Dakota', 'Emerson'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Wilson', 'Anderson', 'Taylor',
  'Sharma', 'Patel', 'Verma', 'Gupta', 'Singh', 'Rao', 'Reddy', 'Mehta', 'Nair', 'Deshmukh',
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Hoffmann', 'Schulz',
  'Dubois', 'Laurent', 'Moreau', 'Fournier', 'Girard', 'Bonnet', 'Rousseau', 'Blanc', 'Guerin', 'Muller',
  'Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato',
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
  'Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak',
  'Tan', 'Lim', 'Lee', 'Ng', 'Wong', 'Chan', 'Zhang', 'Wang', 'Li', 'Liu'
];

export class CompensationDatabase {
  private employees: Employee[] = [];
  private employeeMap: Map<string, Employee> = new Map();
  private auditLogs: AuditLog[] = [];
  private totalCount: number = 10000;
  private initialized: boolean = false;

  constructor() {
    this.seedDatabase(10000);
  }

  public seedDatabase(count: number = 10000) {
    const prng = new DeterministicPRNG(42); // Deterministic seed for repeatable 10,000 dataset
    this.employees = [];
    this.employeeMap.clear();
    this.auditLogs = [];
    this.totalCount = count;

    const countryKeys = Object.keys(COUNTRIES) as CountryCode[];
    const countryWeights: Record<CountryCode, number> = {
      US: 0.35, // 35% US
      IN: 0.20, // 20% India
      GB: 0.10, // 10% UK
      DE: 0.08, // 8% Germany
      FR: 0.05, // 5% France
      CA: 0.05, // 5% Canada
      SG: 0.04, // 4% Singapore
      AU: 0.04, // 4% Australia
      JP: 0.03, // 3% Japan
      BR: 0.03, // 3% Brazil
      NL: 0.02, // 2% Netherlands
      PL: 0.01, // 1% Poland
    };

    // Level distribution
    const levelDistribution: { level: CareerLevel; weight: number }[] = [
      { level: 'L1', weight: 0.18 },
      { level: 'L2', weight: 0.28 },
      { level: 'L3', weight: 0.26 },
      { level: 'L4', weight: 0.15 },
      { level: 'L5', weight: 0.08 },
      { level: 'L6', weight: 0.04 },
      { level: 'L7', weight: 0.01 },
    ];

    for (let i = 1; i <= count; i++) {
      const id = `ACM-${String(i).padStart(5, '0')}`;
      
      // Gender
      const genderRoll = prng.next();
      let gender: 'Female' | 'Male' | 'Non-Binary' = 'Female';
      let firstName = '';
      if (genderRoll < 0.46) {
        gender = 'Female';
        firstName = prng.choice(FIRST_NAMES_FEMALE);
      } else if (genderRoll < 0.94) {
        gender = 'Male';
        firstName = prng.choice(FIRST_NAMES_MALE);
      } else {
        gender = 'Non-Binary';
        firstName = prng.choice(FIRST_NAMES_NON_BINARY);
      }
      const lastName = prng.choice(LAST_NAMES);
      const fullName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i % 100 === 0 ? i : ''}@acme-corp.com`;
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`;

      // Country selection
      const countryRoll = prng.next();
      let cumCountry = 0;
      let countryCode: CountryCode = 'US';
      for (const [code, weight] of Object.entries(countryWeights) as [CountryCode, number][]) {
        cumCountry += weight;
        if (countryRoll <= cumCountry) {
          countryCode = code;
          break;
        }
      }
      const countryInfo: CountryInfo = COUNTRIES[countryCode];
      const city = prng.choice(countryInfo.cities);

      // Department selection
      const department = prng.choice(DEPARTMENTS);

      // Level selection
      const levelRoll = prng.next();
      let cumLevel = 0;
      let level: CareerLevel = 'L2';
      for (const item of levelDistribution) {
        cumLevel += item.weight;
        if (levelRoll <= cumLevel) {
          level = item.level;
          break;
        }
      }

      const role = DEPARTMENT_ROLES[department][level];
      const payBand = generatePayBand(level, department, countryCode);

      // Performance Rating (1 to 5, bell curved)
      const perfRoll = prng.next();
      let performanceRating: 1 | 2 | 3 | 4 | 5 = 3;
      if (perfRoll < 0.04) performanceRating = 1;
      else if (perfRoll < 0.16) performanceRating = 2;
      else if (perfRoll < 0.76) performanceRating = 3;
      else if (perfRoll < 0.94) performanceRating = 4;
      else performanceRating = 5;

      // Tenure (0.2 to 10 years)
      const tenureYears = Math.round(prng.range(0.2, 9.5) * 10) / 10;
      const hireDateYear = 2026 - Math.floor(tenureYears);
      const hireDateMonth = Math.floor(prng.range(1, 12.99));
      const hireDateDay = Math.floor(prng.range(1, 28.99));
      const hireDate = `${hireDateYear}-${String(hireDateMonth).padStart(2, '0')}-${String(hireDateDay).padStart(2, '0')}`;

      // Salary generation with intentional Anomaly distribution:
      // 88% In-Band, 6% Underpaid (<0.80 compa), 6% Overpaid (>1.20 compa)
      const anomalyRoll = prng.next();
      let compaRatio = 1.0;

      if (anomalyRoll < 0.06) {
        // Underpaid Anomaly (0.65 - 0.79 compa)
        compaRatio = Math.round(prng.range(0.66, 0.79) * 100) / 100;
      } else if (anomalyRoll > 0.94) {
        // Overpaid Anomaly (1.21 - 1.38 compa)
        compaRatio = Math.round(prng.range(1.21, 1.36) * 100) / 100;
      } else {
        // Standard In-Band (0.82 - 1.18 compa, centered around 1.00 + small performance correlation)
        const perfBonusShift = (performanceRating - 3) * 0.03; // +- 0.06
        const tenureShift = Math.min(0.08, tenureYears * 0.015);
        const randomVariation = prng.normal(0, 0.06);
        compaRatio = Math.round(Math.max(0.82, Math.min(1.18, 1.0 + perfBonusShift + tenureShift + randomVariation)) * 100) / 100;
      }

      const baseSalaryLocal = Math.round(payBand.midLocal * compaRatio);
      const fxRate = countryInfo.fxRateToUSD;
      const baseSalaryUSD = Math.round(baseSalaryLocal / fxRate);

      // Target bonus based on level + performance multiplier
      const bonusPct = Math.round((payBand.targetBonusPct * (0.7 + (performanceRating / 5) * 0.6)) * 10) / 10;
      const totalCompLocal = Math.round(baseSalaryLocal * (1 + bonusPct / 100));
      const totalCompUSD = Math.round(baseSalaryUSD * (1 + bonusPct / 100));

      let bandStatus: BandStatus = 'IN_BAND';
      if (baseSalaryLocal < payBand.minLocal) {
        bandStatus = 'BELOW_BAND';
      } else if (baseSalaryLocal > payBand.maxLocal) {
        bandStatus = 'ABOVE_BAND';
      }

      // Pre-seed salary history for tenured employees
      const salaryHistory = [];
      if (tenureYears >= 1.5) {
        const prevSalary = Math.round(baseSalaryLocal * 0.92);
        salaryHistory.push({
          id: `HIST-${id}-1`,
          date: `${hireDateYear + 1}-03-15`,
          previousSalaryLocal: Math.round(prevSalary * 0.94),
          newSalaryLocal: prevSalary,
          previousSalaryUSD: Math.round(prevSalary * 0.94 / fxRate),
          newSalaryUSD: Math.round(prevSalary / fxRate),
          percentageChange: 6.4,
          reason: 'ANNUAL_REVIEW' as AdjustmentReason,
          notes: 'Annual performance merit increase based on solid project deliverables.',
          approvedBy: 'Truptiranjan Biswal (HR Lead)',
        });
      }
      if (tenureYears >= 3.0) {
        const prevSalary = Math.round(baseSalaryLocal * 0.92);
        salaryHistory.push({
          id: `HIST-${id}-2`,
          date: `2025-04-01`,
          previousSalaryLocal: prevSalary,
          newSalaryLocal: baseSalaryLocal,
          previousSalaryUSD: Math.round(prevSalary / fxRate),
          newSalaryUSD: baseSalaryUSD,
          percentageChange: Math.round(((baseSalaryLocal - prevSalary) / prevSalary) * 1000) / 10,
          reason: 'MERIT_INCREASE' as AdjustmentReason,
          notes: 'Merit progression adjustment for leadership & cross-functional impact.',
          approvedBy: 'Truptiranjan Biswal (HR Lead)',
        });
      }

      const employee: Employee = {
        id,
        firstName,
        lastName,
        fullName,
        email,
        avatar,
        gender,
        department,
        role,
        level,
        country: countryCode,
        countryName: countryInfo.name,
        city,
        currency: countryInfo.currency,
        baseSalary: baseSalaryLocal,
        bonusPercentage: bonusPct,
        totalCompLocal,
        baseSalaryUSD,
        totalCompUSD,
        bandMinUSD: payBand.minUSD,
        bandMidUSD: payBand.midUSD,
        bandMaxUSD: payBand.maxUSD,
        bandMinLocal: payBand.minLocal,
        bandMidLocal: payBand.midLocal,
        bandMaxLocal: payBand.maxLocal,
        compaRatio,
        bandStatus,
        tenureYears,
        hireDate,
        performanceRating,
        employmentType: prng.next() > 0.05 ? 'Full-Time' : 'Contract',
        salaryHistory,
        lastUpdated: '2026-08-01',
      };

      this.employees.push(employee);
      this.employeeMap.set(id, employee);
    }

    this.initialized = true;
    console.log(`[CompensationDB] Successfully seeded ${this.employees.length} employees across 12 countries.`);
  }

  public getEmployeeById(id: string): Employee | undefined {
    return this.employeeMap.get(id);
  }

  public adjustSalary(
    employeeId: string,
    newSalaryLocal: number,
    reason: AdjustmentReason,
    notes: string,
    actor: string = 'Truptiranjan Biswal (HR Lead)'
  ): { employee: Employee; auditLog: AuditLog } {
    const emp = this.employeeMap.get(employeeId);
    if (!emp) {
      throw new Error(`Employee with ID ${employeeId} not found.`);
    }

    if (newSalaryLocal <= 0) {
      throw new Error('Salary must be greater than zero.');
    }

    const countryInfo = COUNTRIES[emp.country];
    const previousSalaryLocal = emp.baseSalary;
    const previousSalaryUSD = emp.baseSalaryUSD;

    const newSalaryUSD = Math.round(newSalaryLocal / countryInfo.fxRateToUSD);
    const deltaUSD = newSalaryUSD - previousSalaryUSD;
    const percentageChange = Math.round(((newSalaryLocal - previousSalaryLocal) / previousSalaryLocal) * 1000) / 10;

    const payBand = generatePayBand(emp.level, emp.department, emp.country);
    const compaRatio = Math.round((newSalaryLocal / payBand.midLocal) * 100) / 100;

    let bandStatus: BandStatus = 'IN_BAND';
    if (newSalaryLocal < payBand.minLocal) {
      bandStatus = 'BELOW_BAND';
    } else if (newSalaryLocal > payBand.maxLocal) {
      bandStatus = 'ABOVE_BAND';
    }

    const totalCompLocal = Math.round(newSalaryLocal * (1 + emp.bonusPercentage / 100));
    const totalCompUSD = Math.round(newSalaryUSD * (1 + emp.bonusPercentage / 100));

    const historyEntry = {
      id: `HIST-${emp.id}-${emp.salaryHistory.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      previousSalaryLocal,
      newSalaryLocal,
      previousSalaryUSD,
      newSalaryUSD,
      percentageChange,
      reason,
      notes: notes || `Salary adjusted by ${actor}`,
      approvedBy: actor,
    };

    emp.baseSalary = newSalaryLocal;
    emp.baseSalaryUSD = newSalaryUSD;
    emp.totalCompLocal = totalCompLocal;
    emp.totalCompUSD = totalCompUSD;
    emp.compaRatio = compaRatio;
    emp.bandStatus = bandStatus;
    emp.salaryHistory.unshift(historyEntry);
    emp.lastUpdated = new Date().toISOString().split('T')[0];

    const auditLog: AuditLog = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      employeeId: emp.id,
      employeeName: emp.fullName,
      department: emp.department,
      level: emp.level,
      country: emp.country,
      currency: emp.currency,
      previousSalaryLocal,
      newSalaryLocal,
      previousSalaryUSD,
      newSalaryUSD,
      deltaUSD,
      percentageChange,
      reason,
      notes: notes || 'Compensation adjustment executed.',
      actor,
    };

    this.auditLogs.unshift(auditLog);

    return { employee: emp, auditLog };
  }

  public bulkAdjustSalary(
    employeeIds: string[],
    percentageIncrease: number,
    reason: AdjustmentReason,
    notes: string,
    actor: string = 'Truptiranjan Biswal (HR Lead)'
  ): { updatedCount: number; totalCostDeltaUSD: number } {
    let totalCostDeltaUSD = 0;
    let updatedCount = 0;

    for (const id of employeeIds) {
      const emp = this.employeeMap.get(id);
      if (emp) {
        const newSalaryLocal = Math.round(emp.baseSalary * (1 + percentageIncrease / 100));
        const res = this.adjustSalary(id, newSalaryLocal, reason, notes, actor);
        totalCostDeltaUSD += res.auditLog.deltaUSD;
        updatedCount++;
      }
    }

    return { updatedCount, totalCostDeltaUSD };
  }

  public queryEmployees(params: EmployeeQueryParams): PaginatedResult<Employee> {
    let filtered = this.employees;

    // Search filter (Case insensitive multi-field match)
    if (params.search && params.search.trim()) {
      const q = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q)
      );
    }

    // Facet filters
    if (params.department && params.department !== 'ALL') {
      filtered = filtered.filter((e) => e.department === params.department);
    }

    if (params.country && params.country !== 'ALL') {
      filtered = filtered.filter((e) => e.country === params.country);
    }

    if (params.level && params.level !== 'ALL') {
      filtered = filtered.filter((e) => e.level === params.level);
    }

    if (params.bandStatus && params.bandStatus !== 'ALL') {
      filtered = filtered.filter((e) => e.bandStatus === params.bandStatus);
    }

    if (params.performanceRating && params.performanceRating !== 'ALL') {
      filtered = filtered.filter((e) => String(e.performanceRating) === params.performanceRating);
    }

    // Compa-ratio bounds
    if (params.minCompaRatio !== undefined) {
      filtered = filtered.filter((e) => e.compaRatio >= (params.minCompaRatio || 0));
    }
    if (params.maxCompaRatio !== undefined) {
      filtered = filtered.filter((e) => e.compaRatio <= (params.maxCompaRatio || 99));
    }

    // Salary USD bounds
    if (params.minSalaryUSD !== undefined) {
      filtered = filtered.filter((e) => e.baseSalaryUSD >= (params.minSalaryUSD || 0));
    }
    if (params.maxSalaryUSD !== undefined) {
      filtered = filtered.filter((e) => e.baseSalaryUSD <= (params.maxSalaryUSD || 99999999));
    }

    // Anomaly specific shortcuts
    if (params.anomalyType) {
      if (params.anomalyType === 'UNDERPAID') {
        filtered = filtered.filter((e) => e.bandStatus === 'BELOW_BAND' || e.compaRatio < 0.80);
      } else if (params.anomalyType === 'OVERPAID') {
        filtered = filtered.filter((e) => e.bandStatus === 'ABOVE_BAND' || e.compaRatio > 1.20);
      } else if (params.anomalyType === 'HIGH_PERF_UNDERPAID') {
        filtered = filtered.filter((e) => e.performanceRating >= 4 && e.compaRatio < 0.90);
      } else if (params.anomalyType === 'ALL_ANOMALIES') {
        filtered = filtered.filter(
          (e) =>
            e.bandStatus !== 'IN_BAND' ||
            e.compaRatio < 0.80 ||
            e.compaRatio > 1.20 ||
            (e.performanceRating >= 4 && e.compaRatio < 0.90)
        );
      }
    }

    // Sorting
    const sortBy = params.sortBy || 'baseSalaryUSD';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

    filtered.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (typeof valA === 'string') {
        return sortOrder * valA.localeCompare(valB);
      }
      return sortOrder * ((valA || 0) - (valB || 0));
    });

    // Pagination
    const page = Math.max(1, params.page || 1);
    const pageSize = Math.max(1, Math.min(500, params.pageSize || 25));
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const data = filtered.slice(startIndex, startIndex + pageSize);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  public getOverviewMetrics(): OverviewMetrics {
    const totalHeadcount = this.employees.length;
    if (totalHeadcount === 0) {
      return {
        totalHeadcount: 0,
        totalPayrollUSD: 0,
        avgBaseSalaryUSD: 0,
        medianBaseSalaryUSD: 0,
        avgTotalCompUSD: 0,
        medianTotalCompUSD: 0,
        avgCompaRatio: 1,
        totalBonusPoolUSD: 0,
        outOfBandCount: 0,
        belowBandCount: 0,
        aboveBandCount: 0,
        healthyBandCount: 0,
        highPerformerUnderpaidCount: 0,
        genderPayEquity: {
          femaleAvgUSD: 0,
          maleAvgUSD: 0,
          nonBinaryAvgUSD: 0,
          femaleCompaRatio: 1,
          maleCompaRatio: 1,
          payGapPct: 0,
        },
      };
    }

    let totalPayrollUSD = 0;
    let totalTotalCompUSD = 0;
    let totalCompaRatio = 0;
    let belowBandCount = 0;
    let aboveBandCount = 0;
    let healthyBandCount = 0;
    let highPerformerUnderpaidCount = 0;

    let femaleTotalUSD = 0;
    let femaleCount = 0;
    let femaleCompaSum = 0;

    let maleTotalUSD = 0;
    let maleCount = 0;
    let maleCompaSum = 0;

    let nonBinaryTotalUSD = 0;
    let nonBinaryCount = 0;

    const baseSalariesUSD: number[] = new Array(totalHeadcount);
    const totalCompsUSD: number[] = new Array(totalHeadcount);

    for (let i = 0; i < totalHeadcount; i++) {
      const e = this.employees[i];
      totalPayrollUSD += e.baseSalaryUSD;
      totalTotalCompUSD += e.totalCompUSD;
      totalCompaRatio += e.compaRatio;
      baseSalariesUSD[i] = e.baseSalaryUSD;
      totalCompsUSD[i] = e.totalCompUSD;

      if (e.bandStatus === 'BELOW_BAND' || e.compaRatio < 0.80) {
        belowBandCount++;
      } else if (e.bandStatus === 'ABOVE_BAND' || e.compaRatio > 1.20) {
        aboveBandCount++;
      } else {
        healthyBandCount++;
      }

      if (e.performanceRating >= 4 && e.compaRatio < 0.90) {
        highPerformerUnderpaidCount++;
      }

      if (e.gender === 'Female') {
        femaleTotalUSD += e.baseSalaryUSD;
        femaleCompaSum += e.compaRatio;
        femaleCount++;
      } else if (e.gender === 'Male') {
        maleTotalUSD += e.baseSalaryUSD;
        maleCompaSum += e.compaRatio;
        maleCount++;
      } else {
        nonBinaryTotalUSD += e.baseSalaryUSD;
        nonBinaryCount++;
      }
    }

    baseSalariesUSD.sort((a, b) => a - b);
    totalCompsUSD.sort((a, b) => a - b);

    const medianBaseSalaryUSD = baseSalariesUSD[Math.floor(totalHeadcount / 2)];
    const medianTotalCompUSD = totalCompsUSD[Math.floor(totalHeadcount / 2)];
    const avgBaseSalaryUSD = Math.round(totalPayrollUSD / totalHeadcount);
    const avgTotalCompUSD = Math.round(totalTotalCompUSD / totalHeadcount);
    const totalBonusPoolUSD = totalTotalCompUSD - totalPayrollUSD;
    const avgCompaRatio = Math.round((totalCompaRatio / totalHeadcount) * 100) / 100;

    const femaleAvgUSD = femaleCount ? Math.round(femaleTotalUSD / femaleCount) : 0;
    const maleAvgUSD = maleCount ? Math.round(maleTotalUSD / maleCount) : 0;
    const nonBinaryAvgUSD = nonBinaryCount ? Math.round(nonBinaryTotalUSD / nonBinaryCount) : 0;
    const femaleCompaRatio = femaleCount ? Math.round((femaleCompaSum / femaleCount) * 100) / 100 : 1;
    const maleCompaRatio = maleCount ? Math.round((maleCompaSum / maleCount) * 100) / 100 : 1;
    const payGapPct = maleAvgUSD ? Math.round(((maleAvgUSD - femaleAvgUSD) / maleAvgUSD) * 1000) / 10 : 0;

    return {
      totalHeadcount,
      totalPayrollUSD,
      avgBaseSalaryUSD,
      medianBaseSalaryUSD,
      avgTotalCompUSD,
      medianTotalCompUSD,
      avgCompaRatio,
      totalBonusPoolUSD,
      outOfBandCount: belowBandCount + aboveBandCount,
      belowBandCount,
      aboveBandCount,
      healthyBandCount,
      highPerformerUnderpaidCount,
      genderPayEquity: {
        femaleAvgUSD,
        maleAvgUSD,
        nonBinaryAvgUSD,
        femaleCompaRatio,
        maleCompaRatio,
        payGapPct,
      },
    };
  }

  public getDepartmentMetrics(): DepartmentMetric[] {
    const totalBudget = this.employees.reduce((sum, e) => sum + e.baseSalaryUSD, 0);
    const deptMap: Record<Department, { count: number; totalCost: number; salaries: number[]; compaSum: number; outOfBand: number }> = {} as any;

    for (const d of DEPARTMENTS) {
      deptMap[d] = { count: 0, totalCost: 0, salaries: [], compaSum: 0, outOfBand: 0 };
    }

    for (const e of this.employees) {
      const d = deptMap[e.department];
      d.count++;
      d.totalCost += e.baseSalaryUSD;
      d.salaries.push(e.baseSalaryUSD);
      d.compaSum += e.compaRatio;
      if (e.bandStatus !== 'IN_BAND' || e.compaRatio < 0.80 || e.compaRatio > 1.20) {
        d.outOfBand++;
      }
    }

    return DEPARTMENTS.map((dept) => {
      const data = deptMap[dept];
      data.salaries.sort((a, b) => a - b);
      const count = data.count || 1;
      const median = data.salaries[Math.floor(data.salaries.length / 2)] || 0;
      const min = data.salaries[0] || 0;
      const max = data.salaries[data.salaries.length - 1] || 0;

      return {
        department: dept,
        headcount: data.count,
        totalCostUSD: data.totalCost,
        avgBaseSalaryUSD: Math.round(data.totalCost / count),
        medianBaseSalaryUSD: median,
        minSalaryUSD: min,
        maxSalaryUSD: max,
        avgCompaRatio: Math.round((data.compaSum / count) * 100) / 100,
        outOfBandCount: data.outOfBand,
        pctOfTotalBudget: totalBudget ? Math.round((data.totalCost / totalBudget) * 1000) / 10 : 0,
      };
    });
  }

  public getCountryMetrics(): CountryMetric[] {
    const countryMap: Record<CountryCode, { count: number; totalUSD: number; totalLocal: number; compaSum: number; salariesUSD: number[] }> = {} as any;

    for (const code of Object.keys(COUNTRIES) as CountryCode[]) {
      countryMap[code] = { count: 0, totalUSD: 0, totalLocal: 0, compaSum: 0, salariesUSD: [] };
    }

    for (const e of this.employees) {
      const c = countryMap[e.country];
      c.count++;
      c.totalUSD += e.baseSalaryUSD;
      c.totalLocal += e.baseSalary;
      c.compaSum += e.compaRatio;
      c.salariesUSD.push(e.baseSalaryUSD);
    }

    return (Object.keys(COUNTRIES) as CountryCode[]).map((code) => {
      const info = COUNTRIES[code];
      const data = countryMap[code];
      data.salariesUSD.sort((a, b) => a - b);
      const count = data.count || 1;
      const median = data.salariesUSD[Math.floor(data.salariesUSD.length / 2)] || 0;

      return {
        country: code,
        countryName: info.name,
        currency: info.currency,
        exchangeRateToUSD: info.fxRateToUSD,
        headcount: data.count,
        totalCostUSD: data.totalUSD,
        totalCostLocal: data.totalLocal,
        avgSalaryUSD: Math.round(data.totalUSD / count),
        medianSalaryUSD: median,
        avgCompaRatio: Math.round((data.compaSum / count) * 100) / 100,
      };
    });
  }

  public getLevelDistributionMetrics(): LevelDistributionMetric[] {
    const levelMap: Record<CareerLevel, { count: number; salaries: number[]; compaSum: number; below: number; above: number; inBand: number }> = {
      L1: { count: 0, salaries: [], compaSum: 0, below: 0, above: 0, inBand: 0 },
      L2: { count: 0, salaries: [], compaSum: 0, below: 0, above: 0, inBand: 0 },
      L3: { count: 0, salaries: [], compaSum: 0, below: 0, above: 0, inBand: 0 },
      L4: { count: 0, salaries: [], compaSum: 0, below: 0, above: 0, inBand: 0 },
      L5: { count: 0, salaries: [], compaSum: 0, below: 0, above: 0, inBand: 0 },
      L6: { count: 0, salaries: [], compaSum: 0, below: 0, above: 0, inBand: 0 },
      L7: { count: 0, salaries: [], compaSum: 0, below: 0, above: 0, inBand: 0 },
    };

    for (const e of this.employees) {
      const l = levelMap[e.level];
      l.count++;
      l.salaries.push(e.baseSalaryUSD);
      l.compaSum += e.compaRatio;

      if (e.bandStatus === 'BELOW_BAND' || e.compaRatio < 0.80) {
        l.below++;
      } else if (e.bandStatus === 'ABOVE_BAND' || e.compaRatio > 1.20) {
        l.above++;
      } else {
        l.inBand++;
      }
    }

    return CAREER_LEVELS.map((levelMeta) => {
      const data = levelMap[levelMeta.level];
      data.salaries.sort((a, b) => a - b);
      const count = data.count || 1;
      const len = data.salaries.length;

      const min = data.salaries[0] || 0;
      const max = data.salaries[len - 1] || 0;
      const p25 = data.salaries[Math.floor(len * 0.25)] || min;
      const median = data.salaries[Math.floor(len * 0.50)] || min;
      const p75 = data.salaries[Math.floor(len * 0.75)] || max;

      const midUSD = levelMeta.usBaseMidUSD;
      const spread = levelMeta.spreadPct;
      const bandMinUSD = Math.round(midUSD * (1 - spread));
      const bandMaxUSD = Math.round(midUSD * (1 + spread));

      return {
        level: levelMeta.level,
        title: levelMeta.title,
        headcount: data.count,
        minSalaryUSD: min,
        p25SalaryUSD: p25,
        medianSalaryUSD: median,
        p75SalaryUSD: p75,
        maxSalaryUSD: max,
        bandMinUSD,
        bandMidUSD: midUSD,
        bandMaxUSD,
        avgCompaRatio: Math.round((data.compaSum / count) * 100) / 100,
        belowBandCount: data.below,
        aboveBandCount: data.above,
        inBandCount: data.inBand,
      };
    });
  }

  public simulateCompensationIncrease(req: SimulationRequest): SimulationResult {
    let eligible = this.employees;
    if (req.applyToDepartment && req.applyToDepartment !== 'ALL') {
      eligible = eligible.filter((e) => e.department === req.applyToDepartment);
    }
    if (req.applyToCountry && req.applyToCountry !== 'ALL') {
      eligible = eligible.filter((e) => e.country === req.applyToCountry);
    }

    let currentPayrollUSD = 0;
    let simulatedPayrollUSD = 0;
    let employeesAdjustedCount = 0;
    let remediedBelowBandCount = 0;

    const previewSamples: SimulationResult['previewSamples'] = [];

    for (let i = 0; i < eligible.length; i++) {
      const e = eligible[i];
      currentPayrollUSD += e.baseSalaryUSD;

      const ratingKey = `rating${e.performanceRating}` as keyof typeof req.performanceMultipliers;
      const multiplier = req.performanceMultipliers[ratingKey] ?? 1.0;
      const meritPct = req.meritPoolPct * multiplier;

      let simulatedLocal = Math.round(e.baseSalary * (1 + meritPct / 100));

      // Auto remedy if requested
      if (req.remedyBelowBand && simulatedLocal < e.bandMinLocal) {
        simulatedLocal = e.bandMinLocal;
        remediedBelowBandCount++;
      }

      const countryInfo = COUNTRIES[e.country];
      const simulatedUSD = Math.round(simulatedLocal / countryInfo.fxRateToUSD);
      simulatedPayrollUSD += simulatedUSD;

      if (simulatedLocal !== e.baseSalary) {
        employeesAdjustedCount++;
      }

      // Collect sample for preview (first 10)
      if (i < 10) {
        const simulatedCompaRatio = Math.round((simulatedLocal / e.bandMidLocal) * 100) / 100;
        previewSamples.push({
          id: e.id,
          fullName: e.fullName,
          department: e.department,
          level: e.level,
          country: e.country,
          currentSalaryUSD: e.baseSalaryUSD,
          simulatedSalaryUSD: simulatedUSD,
          deltaUSD: simulatedUSD - e.baseSalaryUSD,
          pctChange: Math.round(((simulatedUSD - e.baseSalaryUSD) / e.baseSalaryUSD) * 1000) / 10,
          currentCompaRatio: e.compaRatio,
          simulatedCompaRatio,
          performanceRating: e.performanceRating,
        });
      }
    }

    const totalCostDeltaUSD = simulatedPayrollUSD - currentPayrollUSD;
    const overallIncreasePct = currentPayrollUSD ? Math.round((totalCostDeltaUSD / currentPayrollUSD) * 1000) / 10 : 0;
    const avgIncreaseUSD = eligible.length ? Math.round(totalCostDeltaUSD / eligible.length) : 0;

    return {
      eligibleHeadcount: eligible.length,
      currentPayrollUSD,
      simulatedPayrollUSD,
      totalCostDeltaUSD,
      overallIncreasePct,
      avgIncreaseUSD,
      employeesAdjustedCount,
      remediedBelowBandCount,
      previewSamples,
    };
  }

  public getAuditLogs(limit: number = 100): AuditLog[] {
    return this.auditLogs.slice(0, limit);
  }
}

// Global Singleton instance
export const db = new CompensationDatabase();
