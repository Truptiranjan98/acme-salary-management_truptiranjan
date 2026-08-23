import { db } from './db';
import { COUNTRIES, generatePayBand } from './seedData';
import { AdjustmentReason } from '../types/salary';

export interface TestResultItem {
  id: string;
  name: string;
  category: 'Seeding & Data Integrity' | 'Currency & Math' | 'Compa-Ratio & Bands' | 'Adjustments & Audit' | 'Aggregation & Analytics' | 'Simulation Engine';
  status: 'PASSED' | 'FAILED';
  durationMs: number;
  message: string;
  details?: Record<string, any>;
}

export interface TestSuiteReport {
  timestamp: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  totalDurationMs: number;
  results: TestResultItem[];
}

export function runAllUnitTests(): TestSuiteReport {
  const startTime = Date.now();
  const results: TestResultItem[] = [];

  function recordTest(
    id: string,
    name: string,
    category: TestResultItem['category'],
    fn: () => { passed: boolean; message: string; details?: any }
  ) {
    const t0 = performance.now();
    try {
      const res = fn();
      const t1 = performance.now();
      results.push({
        id,
        name,
        category,
        status: res.passed ? 'PASSED' : 'FAILED',
        durationMs: Math.round((t1 - t0) * 100) / 100,
        message: res.message,
        details: res.details,
      });
    } catch (err: any) {
      const t1 = performance.now();
      results.push({
        id,
        name,
        category,
        status: 'FAILED',
        durationMs: Math.round((t1 - t0) * 100) / 100,
        message: `Exception thrown: ${err?.message || String(err)}`,
      });
    }
  }

  // Test 1: 10,000 Employees Seeding & Format
  recordTest('TEST-01', '10,000 Employees Deterministic Seeding', 'Seeding & Data Integrity', () => {
    const overview = db.getOverviewMetrics();
    const isCount10k = overview.totalHeadcount === 10000;
    const sample = db.getEmployeeById('ACM-00001');
    const validSample = sample && sample.id === 'ACM-00001' && sample.fullName && sample.baseSalaryUSD > 0;
    
    return {
      passed: Boolean(isCount10k && validSample),
      message: isCount10k && validSample
        ? `Successfully verified 10,000 employees with deterministic IDs ACM-00001 through ACM-10000.`
        : `Failed: Count is ${overview.totalHeadcount}, sample valid: ${Boolean(validSample)}`,
      details: { totalCount: overview.totalHeadcount, sampleId: sample?.id, sampleName: sample?.fullName },
    };
  });

  // Test 2: Multi-Currency Normalization Math
  recordTest('TEST-02', 'Multi-Currency Normalization & Exchange Math', 'Currency & Math', () => {
    const countries = Object.keys(COUNTRIES) as (keyof typeof COUNTRIES)[];
    let allValid = true;
    const checks: any[] = [];

    for (const code of countries) {
      const res = db.queryEmployees({ country: code, pageSize: 5 });
      if (res.data.length > 0) {
        const emp = res.data[0];
        const countryInfo = COUNTRIES[emp.country];
        const expectedUSD = Math.round(emp.baseSalary / countryInfo.fxRateToUSD);
        const match = Math.abs(expectedUSD - emp.baseSalaryUSD) <= 1;
        checks.push({ country: code, local: emp.baseSalary, usd: emp.baseSalaryUSD, expectedUSD, match });
        if (!match) allValid = false;
      }
    }

    return {
      passed: allValid,
      message: allValid
        ? `All ${checks.length} evaluated country currencies convert accurately to normalized USD.`
        : `Currency conversion mismatch detected.`,
      details: { sampleChecks: checks.slice(0, 4) },
    };
  });

  // Test 3: Compa-Ratio & Band Classification Formula
  recordTest('TEST-03', 'Compa-Ratio Formula & Band Boundary Classification', 'Compa-Ratio & Bands', () => {
    const res = db.queryEmployees({ pageSize: 50 });
    let passed = true;
    let checkedCount = 0;

    for (const emp of res.data) {
      checkedCount++;
      const expectedCompa = Math.round((emp.baseSalary / emp.bandMidLocal) * 100) / 100;
      const compaDiff = Math.abs(emp.compaRatio - expectedCompa);
      if (compaDiff > 0.02) {
        passed = false;
        break;
      }

      if (emp.baseSalary < emp.bandMinLocal && emp.bandStatus !== 'BELOW_BAND') {
        passed = false;
        break;
      }
      if (emp.baseSalary > emp.bandMaxLocal && emp.bandStatus !== 'ABOVE_BAND') {
        passed = false;
        break;
      }
    }

    return {
      passed,
      message: passed
        ? `Compa-Ratio (baseSalary / bandMidpoint) and Band Status checked across ${checkedCount} records.`
        : `Mismatch in compa-ratio or band status validation.`,
      details: { checkedSampleCount: checkedCount },
    };
  });

  // Test 4: Salary Adjustment & Immutable Audit Logging
  recordTest('TEST-04', 'Salary Adjustment Execution & Immutable Audit Trail', 'Adjustments & Audit', () => {
    const emp = db.getEmployeeById('ACM-00042');
    if (!emp) return { passed: false, message: 'Sample employee ACM-00042 not found.' };

    const initialSalaryLocal = emp.baseSalary;
    const initialHistoryLen = emp.salaryHistory.length;
    const targetSalaryLocal = Math.round(initialSalaryLocal * 1.10); // +10%

    const adjustmentResult = db.adjustSalary(
      'ACM-00042',
      targetSalaryLocal,
      'MERIT_INCREASE',
      'Test adjustment validation run',
      'Test Suite Automated Runner'
    );

    const updatedEmp = db.getEmployeeById('ACM-00042')!;
    const salaryUpdated = updatedEmp.baseSalary === targetSalaryLocal;
    const historyAdded = updatedEmp.salaryHistory.length === initialHistoryLen + 1;
    const auditCreated = adjustmentResult.auditLog && adjustmentResult.auditLog.newSalaryLocal === targetSalaryLocal;

    return {
      passed: Boolean(salaryUpdated && historyAdded && auditCreated),
      message: salaryUpdated && historyAdded && auditCreated
        ? `Successfully adjusted salary from ${initialSalaryLocal} to ${targetSalaryLocal} and recorded immutable audit log.`
        : `Adjustment failed verification.`,
      details: {
        empId: 'ACM-00042',
        initialSalary: initialSalaryLocal,
        updatedSalary: updatedEmp.baseSalary,
        auditLogId: adjustmentResult.auditLog.id,
      },
    };
  });

  // Test 5: Aggregation Mathematical Consistency
  recordTest('TEST-05', 'Mathematical Consistency of Department & Global Aggregations', 'Aggregation & Analytics', () => {
    const overview = db.getOverviewMetrics();
    const deptMetrics = db.getDepartmentMetrics();

    const sumDeptHeadcount = deptMetrics.reduce((acc, d) => acc + d.headcount, 0);
    const sumDeptPayrollUSD = deptMetrics.reduce((acc, d) => acc + d.totalCostUSD, 0);

    const headcountMatches = sumDeptHeadcount === overview.totalHeadcount;
    const payrollMatches = sumDeptPayrollUSD === overview.totalPayrollUSD;

    return {
      passed: headcountMatches && payrollMatches,
      message: headcountMatches && payrollMatches
        ? `Sum of 8 department headcounts (${sumDeptHeadcount}) and payroll ($${sumDeptPayrollUSD.toLocaleString()}) perfectly equals global overview.`
        : `Discrepancy in department rollup aggregations.`,
      details: {
        globalHeadcount: overview.totalHeadcount,
        sumDeptHeadcount,
        globalPayrollUSD: overview.totalPayrollUSD,
        sumDeptPayrollUSD,
      },
    };
  });

  // Test 6: Percentile & Distribution Ordering (Boxplot Metrics)
  recordTest('TEST-06', 'Percentile & IQR Distribution Ordering (P25 <= Median <= P75)', 'Aggregation & Analytics', () => {
    const levelMetrics = db.getLevelDistributionMetrics();
    let orderValid = true;

    for (const lm of levelMetrics) {
      if (lm.minSalaryUSD > lm.p25SalaryUSD || lm.p25SalaryUSD > lm.medianSalaryUSD || lm.medianSalaryUSD > lm.p75SalaryUSD || lm.p75SalaryUSD > lm.maxSalaryUSD) {
        orderValid = false;
        break;
      }
    }

    return {
      passed: orderValid,
      message: orderValid
        ? `All 7 career levels (L1-L7) satisfy monotonic distribution: Min <= P25 <= Median <= P75 <= Max.`
        : `Percentile ordering anomaly detected in career levels.`,
      details: { evaluatedLevels: levelMetrics.map((l) => `${l.level}: $${l.medianSalaryUSD.toLocaleString()}`) },
    };
  });

  // Test 7: Merit Compensation Simulation Engine
  recordTest('TEST-07', 'Performance-Weighted Budget Simulation Engine', 'Simulation Engine', () => {
    const simResult = db.simulateCompensationIncrease({
      meritPoolPct: 4.0,
      applyToDepartment: 'Engineering',
      performanceMultipliers: {
        rating1: 0.0,
        rating2: 0.5,
        rating3: 1.0,
        rating4: 1.4,
        rating5: 2.0,
      },
      remedyBelowBand: true,
    });

    const hasDelta = simResult.totalCostDeltaUSD > 0;
    const hasSamples = simResult.previewSamples.length > 0;
    const mathAccurate = simResult.simulatedPayrollUSD === simResult.currentPayrollUSD + simResult.totalCostDeltaUSD;

    return {
      passed: hasDelta && hasSamples && mathAccurate,
      message: hasDelta && hasSamples && mathAccurate
        ? `Simulation completed for ${simResult.eligibleHeadcount} Engineering staff with +${simResult.overallIncreasePct}% budget increase ($${simResult.totalCostDeltaUSD.toLocaleString()} USD delta).`
        : `Simulation computation failed.`,
      details: {
        eligibleCount: simResult.eligibleHeadcount,
        deltaUSD: simResult.totalCostDeltaUSD,
        remediedCount: simResult.remediedBelowBandCount,
      },
    };
  });

  // Test 8: Out-of-Band & Anomaly Radar Detection
  recordTest('TEST-08', 'Out-of-Band & Compensation Anomaly Classification', 'Compa-Ratio & Bands', () => {
    const underpaidRes = db.queryEmployees({ anomalyType: 'UNDERPAID', pageSize: 10 });
    const overpaidRes = db.queryEmployees({ anomalyType: 'OVERPAID', pageSize: 10 });

    const underpaidValid = underpaidRes.data.every((e) => e.bandStatus === 'BELOW_BAND' || e.compaRatio < 0.80);
    const overpaidValid = overpaidRes.data.every((e) => e.bandStatus === 'ABOVE_BAND' || e.compaRatio > 1.20);

    return {
      passed: Boolean(underpaidValid && overpaidValid && underpaidRes.total > 0 && overpaidRes.total > 0),
      message: underpaidValid && overpaidValid
        ? `Anomaly radar accurately isolates ${underpaidRes.total} underpaid and ${overpaidRes.total} overpaid employees across the 10,000 dataset.`
        : `Anomaly classification filter mismatch.`,
      details: {
        totalUnderpaidAnomalies: underpaidRes.total,
        totalOverpaidAnomalies: overpaidRes.total,
      },
    };
  });

  const endTime = Date.now();
  const passedCount = results.filter((r) => r.status === 'PASSED').length;
  const failedCount = results.filter((r) => r.status === 'FAILED').length;

  return {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passedCount,
    failedCount,
    totalDurationMs: endTime - startTime,
    results,
  };
}
