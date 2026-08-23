export interface ADRItem {
  id: string;
  title: string;
  status: 'Accepted' | 'Proposed' | 'Superseded';
  context: string;
  decision: string;
  consequences: string[];
}

export const ADR_LIST: ADRItem[] = [
  {
    id: 'ADR-001',
    title: 'High-Performance In-Memory Relational Indexing for 10,000 Employees',
    status: 'Accepted',
    context:
      'ACME Corporation has 10,000 global employee records. The HR Manager requires sub-30ms response times when executing multi-criteria filtering, search, percentile calculation, and bulk adjustments without external database provisioning overhead.',
    decision:
      'Implement an in-memory typed relational store with deterministic PRNG seeding (42), primary key Map lookups O(1), and multi-attribute array indexing. Aggregations (P25, Median, P75, department sums) are evaluated with typed arrays in sub-5ms.',
    consequences: [
      'P99 API response times remain under 15ms for 10,000 records.',
      'Zero external database connection latency or connection pool saturation.',
      'Deterministic test suites execute in under 50ms.',
      'Dataset resets are instantaneous and 100% reproducible.',
    ],
  },
  {
    id: 'ADR-002',
    title: 'Dual-Currency Architecture with Normalized USD Baseline',
    status: 'Accepted',
    context:
      'Employees are distributed across 12 countries with 10 currencies (USD, GBP, EUR, INR, SGD, JPY, AUD, CAD, BRL, PLN). Executive reporting requires unified USD metrics while local managers require exact local currency values.',
    decision:
      'Store both local currency and normalized USD values for base salary, total comp, and pay bands. Calculate compa-ratio based on local band midpoints to prevent FX drift from distorting market positioning.',
    consequences: [
      'Eliminates currency conversion errors in local salary reviews.',
      'Provides instantaneous global payroll rollup without runtime exchange rate recalculation.',
      'Maintains mathematical accuracy across all aggregation endpoints.',
    ],
  },
  {
    id: 'ADR-003',
    title: 'Compa-Ratio Standardized Pay Band Modeling (L1 to L7)',
    status: 'Accepted',
    context:
      'Fair compensation requires a normalized metric to compare employee salaries against market bands regardless of country, role, or currency.',
    decision:
      'Adopt the standard HR metric Compa-Ratio = Base Salary / Band Midpoint. Define 0.80–1.20 as Healthy In-Band, < 0.80 as Below Band (Flight Risk Anomaly), and > 1.20 as Above Band (Red-Circled Anomaly).',
    consequences: [
      'Provides immediate visual classification for compensation parity.',
      'Powers the Out-of-Band Anomaly Radar and Remediation Engine.',
      'Enables standardized gender pay equity comparisons normalized for level.',
    ],
  },
  {
    id: 'ADR-004',
    title: 'Immutable Audit Logging & Reason Code Governance',
    status: 'Accepted',
    context:
      'Salary modifications have severe legal, compliance, and budget implications. Every adjustment must have a clear business justification and accountability.',
    decision:
      'Enforce mandatory reason codes (Merit, Promotion, Market Correction, COLA, Retention) and record immutable audit logs with before/after snapshots, USD delta, actor identity, and timestamps.',
    consequences: [
      'Full compliance traceability for internal and external auditors.',
      'Historical salary timeline rendered directly inside the employee drawer.',
      'Audit log analytics accessible in real time.',
    ],
  },
  {
    id: 'ADR-005',
    title: 'Authentication & Demo Sandbox Security Posture',
    status: 'Accepted',
    context:
      'The assessment software must be accessible to reviewers without credential barriers while maintaining clean architectural boundaries.',
    decision:
      'Operate the demo environment in an authenticated HR Manager session ("Truptiranjan Biswal") with 100% synthetic data. Keep API routes structured for enterprise JWT/Bearer tokens in production.',
    consequences: [
      'Reviewers experience zero-friction exploration of all 5 core jobs.',
      'Zero real PII or proprietary compensation data is ever stored.',
      'Architecture cleanly decouples auth middleware for production drop-in.',
    ],
  },
];
