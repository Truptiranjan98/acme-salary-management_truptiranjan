import {
  AuditLog,
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
import { db } from '../server/db';
import { runAllUnitTests, TestSuiteReport } from '../server/tests';
import { PRD_DOCUMENT } from '../docs/prd';
import { ADR_LIST, ADRItem } from '../docs/adr';
import { PROMPTS_LOG, PromptArtifact } from '../docs/promptsLog';
import { COUNTRIES, DEPARTMENTS, CAREER_LEVELS } from '../server/seedData';

class ApiService {
  private useServerApi: boolean = true;

  constructor() {
    // If running in browser, we can query /api and fallback to in-memory db if server route is not ready
  }

  async getOverviewMetrics(): Promise<OverviewMetrics> {
    try {
      const res = await fetch('/api/analytics/overview');
      if (res.ok) return await res.json();
    } catch (e) {
      // fallback
    }
    return db.getOverviewMetrics();
  }

  async getDepartmentMetrics(): Promise<DepartmentMetric[]> {
    try {
      const res = await fetch('/api/analytics/departments');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.getDepartmentMetrics();
  }

  async getCountryMetrics(): Promise<CountryMetric[]> {
    try {
      const res = await fetch('/api/analytics/countries');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.getCountryMetrics();
  }

  async getLevelDistributionMetrics(): Promise<LevelDistributionMetric[]> {
    try {
      const res = await fetch('/api/analytics/pay-bands');
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.getLevelDistributionMetrics();
  }

  async getEmployees(params: EmployeeQueryParams): Promise<PaginatedResult<Employee>> {
    try {
      const urlParams = new URLSearchParams();
      if (params.page) urlParams.set('page', String(params.page));
      if (params.pageSize) urlParams.set('pageSize', String(params.pageSize));
      if (params.search) urlParams.set('search', params.search);
      if (params.department) urlParams.set('department', params.department);
      if (params.country) urlParams.set('country', params.country);
      if (params.level) urlParams.set('level', params.level);
      if (params.bandStatus) urlParams.set('bandStatus', params.bandStatus);
      if (params.performanceRating) urlParams.set('performanceRating', params.performanceRating);
      if (params.minCompaRatio !== undefined) urlParams.set('minCompaRatio', String(params.minCompaRatio));
      if (params.maxCompaRatio !== undefined) urlParams.set('maxCompaRatio', String(params.maxCompaRatio));
      if (params.minSalaryUSD !== undefined) urlParams.set('minSalaryUSD', String(params.minSalaryUSD));
      if (params.maxSalaryUSD !== undefined) urlParams.set('maxSalaryUSD', String(params.maxSalaryUSD));
      if (params.anomalyType) urlParams.set('anomalyType', params.anomalyType);
      if (params.sortBy) urlParams.set('sortBy', params.sortBy);
      if (params.sortOrder) urlParams.set('sortOrder', params.sortOrder);

      const res = await fetch(`/api/employees?${urlParams.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.queryEmployees(params);
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const res = await fetch(`/api/employees/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.getEmployeeById(id) || null;
  }

  async adjustSalary(
    employeeId: string,
    newSalaryLocal: number,
    reason: any,
    notes: string,
    actor: string = 'Truptiranjan Biswal (HR Lead)'
  ): Promise<{ success: boolean; employee: Employee; auditLog: AuditLog }> {
    try {
      const res = await fetch(`/api/employees/${employeeId}/adjust-salary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newSalaryLocal, reason, notes, actor }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const result = db.adjustSalary(employeeId, newSalaryLocal, reason, notes, actor);
    return { success: true, employee: result.employee, auditLog: result.auditLog };
  }

  async bulkAdjustSalary(
    employeeIds: string[],
    percentageIncrease: number,
    reason: any,
    notes: string,
    actor: string = 'Truptiranjan Biswal (HR Lead)'
  ): Promise<{ success: boolean; updatedCount: number; totalCostDeltaUSD: number }> {
    try {
      const res = await fetch('/api/employees/bulk-adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeIds, percentageIncrease, reason, notes, actor }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    const result = db.bulkAdjustSalary(employeeIds, percentageIncrease, reason, notes, actor);
    return { success: true, ...result };
  }

  async simulateIncrease(req: SimulationRequest): Promise<SimulationResult> {
    try {
      const res = await fetch('/api/analytics/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.simulateCompensationIncrease(req);
  }

  async getAuditLogs(limit: number = 100): Promise<AuditLog[]> {
    try {
      const res = await fetch(`/api/audit-logs?limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return db.getAuditLogs(limit);
  }

  async runTests(): Promise<TestSuiteReport> {
    try {
      const res = await fetch('/api/tests/run');
      if (res.ok) return await res.json();
    } catch (e) {}
    return runAllUnitTests();
  }

  async resetDatabase(count: number = 10000): Promise<{ success: boolean; message: string; headcount: number }> {
    try {
      const res = await fetch('/api/seed/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count }),
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    db.seedDatabase(count);
    return { success: true, message: `Database reset with ${count} employees`, headcount: count };
  }

  async getDocumentation(): Promise<{ prd: string; adrs: ADRItem[]; prompts: PromptArtifact[] }> {
    try {
      const res = await fetch('/api/documentation');
      if (res.ok) return await res.json();
    } catch (e) {}
    return {
      prd: PRD_DOCUMENT,
      adrs: ADR_LIST,
      prompts: PROMPTS_LOG,
    };
  }
}

export const apiService = new ApiService();
