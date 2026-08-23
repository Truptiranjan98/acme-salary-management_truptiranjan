import express, { Request, Response, Router } from 'express';
import { db } from './db';
import { runAllUnitTests } from './tests';
import { PRD_DOCUMENT } from '../docs/prd';
import { ADR_LIST } from '../docs/adr';
import { PROMPTS_LOG } from '../docs/promptsLog';
import { COUNTRIES, DEPARTMENTS, CAREER_LEVELS } from './seedData';

export const apiRouter = Router();

apiRouter.use(express.json());

// Health Check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    recordsCount: db.getOverviewMetrics().totalHeadcount,
    uptimeSeconds: process.uptime ? Math.floor(process.uptime()) : 0,
  });
});

// Overview Metrics
apiRouter.get('/analytics/overview', (req: Request, res: Response) => {
  const metrics = db.getOverviewMetrics();
  res.json(metrics);
});

// Department Metrics
apiRouter.get('/analytics/departments', (req: Request, res: Response) => {
  const depts = db.getDepartmentMetrics();
  res.json(depts);
});

// Country Metrics
apiRouter.get('/analytics/countries', (req: Request, res: Response) => {
  const countries = db.getCountryMetrics();
  res.json(countries);
});

// Pay Band & Level Distributions
apiRouter.get('/analytics/pay-bands', (req: Request, res: Response) => {
  const levels = db.getLevelDistributionMetrics();
  res.json(levels);
});

// Metadata constants
apiRouter.get('/metadata/constants', (req: Request, res: Response) => {
  res.json({
    countries: COUNTRIES,
    departments: DEPARTMENTS,
    careerLevels: CAREER_LEVELS,
  });
});

// Query Employees (Search, filter, paginate, sort)
apiRouter.get('/employees', (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 25;
    const search = req.query.search as string;
    const department = req.query.department as string;
    const country = req.query.country as string;
    const level = req.query.level as string;
    const bandStatus = req.query.bandStatus as string;
    const performanceRating = req.query.performanceRating as string;
    const minCompaRatio = req.query.minCompaRatio ? parseFloat(req.query.minCompaRatio as string) : undefined;
    const maxCompaRatio = req.query.maxCompaRatio ? parseFloat(req.query.maxCompaRatio as string) : undefined;
    const minSalaryUSD = req.query.minSalaryUSD ? parseInt(req.query.minSalaryUSD as string) : undefined;
    const maxSalaryUSD = req.query.maxSalaryUSD ? parseInt(req.query.maxSalaryUSD as string) : undefined;
    const anomalyType = req.query.anomalyType as any;
    const sortBy = req.query.sortBy as any;
    const sortOrder = req.query.sortOrder as any;

    const result = db.queryEmployees({
      page,
      pageSize,
      search,
      department,
      country,
      level,
      bandStatus,
      performanceRating,
      minCompaRatio,
      maxCompaRatio,
      minSalaryUSD,
      maxSalaryUSD,
      anomalyType,
      sortBy,
      sortOrder,
    });

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Employee
apiRouter.get('/employees/:id', (req: Request, res: Response) => {
  const emp = db.getEmployeeById(req.params.id);
  if (!emp) {
    return res.status(404).json({ error: 'Employee not found' });
  }
  res.json(emp);
});

// Adjust Employee Salary
apiRouter.post('/employees/:id/adjust-salary', (req: Request, res: Response) => {
  try {
    const { newSalaryLocal, reason, notes, actor } = req.body;
    if (!newSalaryLocal || !reason) {
      return res.status(400).json({ error: 'Missing required parameters: newSalaryLocal and reason' });
    }

    const result = db.adjustSalary(
      req.params.id,
      parseFloat(newSalaryLocal),
      reason,
      notes || '',
      actor || 'Truptiranjan Biswal (HR Lead)'
    );

    res.json({
      success: true,
      employee: result.employee,
      auditLog: result.auditLog,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Bulk Adjust Salary
apiRouter.post('/employees/bulk-adjust', (req: Request, res: Response) => {
  try {
    const { employeeIds, percentageIncrease, reason, notes, actor } = req.body;
    if (!employeeIds || !Array.isArray(employeeIds) || percentageIncrease === undefined || !reason) {
      return res.status(400).json({ error: 'Missing required parameters for bulk adjustment' });
    }

    const result = db.bulkAdjustSalary(
      employeeIds,
      parseFloat(percentageIncrease),
      reason,
      notes || '',
      actor || 'Truptiranjan Biswal (HR Lead)'
    );

    res.json({
      success: true,
      updatedCount: result.updatedCount,
      totalCostDeltaUSD: result.totalCostDeltaUSD,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Compensation Simulation
apiRouter.post('/analytics/simulate', (req: Request, res: Response) => {
  try {
    const simReq = req.body;
    const result = db.simulateCompensationIncrease(simReq);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Audit Logs
apiRouter.get('/audit-logs', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100;
  const logs = db.getAuditLogs(limit);
  res.json(logs);
});

// Run Tests
apiRouter.get('/tests/run', (req: Request, res: Response) => {
  const testReport = runAllUnitTests();
  res.json(testReport);
});

// Reset / Reseed Database
apiRouter.post('/seed/reset', (req: Request, res: Response) => {
  const count = parseInt(req.body.count) || 10000;
  db.seedDatabase(count);
  res.json({
    success: true,
    message: `Database re-seeded with ${count} employees.`,
    headcount: count,
  });
});

// Documentation Artifacts
apiRouter.get('/documentation', (req: Request, res: Response) => {
  res.json({
    prd: PRD_DOCUMENT,
    adrs: ADR_LIST,
    prompts: PROMPTS_LOG,
  });
});
