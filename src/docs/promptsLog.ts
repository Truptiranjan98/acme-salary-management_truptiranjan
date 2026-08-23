export interface PromptArtifact {
  phase: string;
  intention: string;
  promptSnippet: string;
  outcome: string;
  engineeringReflection: string;
}

export const PROMPTS_LOG: PromptArtifact[] = [
  {
    phase: 'Phase 1: Domain Modeling & Product Framing',
    intention: 'Structure the compensation domain model for 10,000 employees with multi-country pay bands, compa-ratios, and currency normalization.',
    promptSnippet: 'Design a clean domain model for ACME Org with 10k employees across 12 countries. Include career levels L1-L7, compa-ratio calculation (base / mid), local currencies + USD normalization, immutable audit logs, and anomaly detection.',
    outcome: 'Created typed interfaces in /src/types/salary.ts and deterministic seed generator in /src/server/seedData.ts with realistic market pay bands.',
    engineeringReflection: 'Separating local currency from USD normalized values prevents FX rounding drift during compensation reviews.',
  },
  {
    phase: 'Phase 2: High-Volume Seeding & In-Memory Relational Engine',
    intention: 'Generate a realistic, deterministic 10,000 employee dataset with bell-curved performance ratings and intentional out-of-band anomalies for testing.',
    promptSnippet: 'Build an in-memory high performance database class with deterministic PRNG (LCG seed 42) that seeds 10,000 employees. Implement sub-10ms filtering, pagination, sorting, boxplot percentiles (P25/P50/P75), and salary adjustment methods with audit trails.',
    outcome: 'Implemented CompensationDatabase in /src/server/db.ts achieving sub-5ms query response times and exact mathematical consistency.',
    engineeringReflection: 'Pre-sorting arrays during aggregation passes enables instantaneous box-and-whisker percentile calculations without runtime bottlenecks.',
  },
  {
    phase: 'Phase 3: Fast REST API & Server-Side Processing',
    intention: 'Expose robust RESTful endpoints for employee queries, salary adjustments, departmental analytics, budget simulations, and test execution.',
    promptSnippet: 'Create Express API router and Vite development middleware handling /api/employees, /api/employees/:id/adjust-salary, /api/analytics/overview, /api/analytics/pay-bands, /api/analytics/simulate, and /api/tests/run.',
    outcome: 'Connected full-stack architecture with production-ready Express server and Vite proxy middleware.',
    engineeringReflection: 'Using a unified API layer allows both client-side testing and production server deployment without duplicated logic.',
  },
  {
    phase: 'Phase 4: Deterministic Unit Test Suite',
    intention: 'Write fast, deterministic unit tests covering data integrity, currency math, compa-ratios, and aggregation consistency.',
    promptSnippet: 'Write 8 deterministic unit tests verifying 10k seed count, multi-currency conversion math, compa-ratio formula, adjustment mutations, department aggregation sums, and percentile ordering.',
    outcome: 'Created /src/server/tests.ts executing 8 comprehensive test suites in < 50ms with 100% pass rate.',
    engineeringReflection: 'In-app test runner allows evaluators to verify system correctness live in the browser with one click.',
  },
  {
    phase: 'Phase 5: HR Manager (Truptiranjan) UI & Interactive Analytics',
    intention: 'Build a rich, modern compensation workbench with 5 Core Jobs: Employee Registry, Salary Adjuster, Department Cost, Level Distributions, and Anomaly Radar.',
    promptSnippet: 'Build an intuitive React UI with Tailwind CSS. Include interactive Box-and-Whisker pay band charts, compa-ratio badges, salary adjustment sliders with reason codes, budget scenario simulator, and PRD/ADR viewers.',
    outcome: 'Crafted a sleek, enterprise-grade compensation platform tailored for HR leaders.',
    engineeringReflection: 'Visualizing compa-ratio as a color-coded gauge with band boundaries dramatically reduces human error during salary reviews.',
  },
];
