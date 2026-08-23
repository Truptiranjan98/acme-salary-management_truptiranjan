export const PRD_DOCUMENT = `
# Product Requirements Document (PRD)
## ACME Global Employee Salary Management Platform

**Document Version:** 1.0.0  
**Author:** HR Tech & Total Rewards Engineering Team  
**Primary Persona:** Truptiranjan Biswal (HR Manager & Global Compensation Lead)  
**Target Organization:** ACME Corp (10,000 Employees across 12 Countries)

---

### 1. Executive Summary & Problem Context
ACME Corporation currently employs 10,000 staff members across 12 countries (US, UK, Germany, France, India, Singapore, Japan, Australia, Canada, Brazil, Netherlands, Poland). Compensation data was historically managed through fragmented, disconnected spreadsheets. This created critical operational challenges:
- High latency and human error when answering executive compensation questions.
- Lack of standardized pay bands and market midpoint benchmarking.
- Inability to quickly identify underpaid flight risks or overpaid compensation anomalies.
- Absence of an immutable audit trail when salary adjustments occur.
- No multi-currency normalization to compare departmental costs on an apples-to-apples USD baseline.

### 2. User Persona: HR Manager ("Truptiranjan")
- **Role:** Global HR Manager & Compensation Strategy Lead.
- **Core Needs:**
  1. Instant search & lookup for any employee among 10,000 staff with complete compensation breakdown (Base, Bonus, Total Comp in local and USD).
  2. Perform compliant salary adjustments with validation against pay bands, reason codes, and automatic audit logging.
  3. Pull aggregate department, regional, and currency cost analytics for CFO / Executive reviews.
  4. Inspect pay distribution per career level (L1–L7) with percentile metrics (P25, Median, P75) and compa-ratio health.
  5. Instantly isolate out-of-band employees (underpaid <0.80 compa-ratio, overpaid >1.20 compa-ratio) and model remedial adjustments.
  6. Simulate merit cycle budget scenarios before committing changes.

---

### 3. Goals & Success Metrics
| Objective | Success Metric | Target |
|---|---|---|
| **Query & Filter Latency** | P99 response time for multi-facet filter over 10,000 employees | < 30ms |
| **Data Integrity** | Mathematical consistency between department aggregates & total payroll | 100% exact match |
| **Audit Compliance** | Traceability of all compensation adjustments with reason codes | 100% immutable logs |
| **Pay Band Compliance** | Visibility into out-of-band staff and compa-ratio health | Instant 1-click anomaly radar |
| **Global Currency Normalization** | Dual local/USD view across 10 distinct currencies with live FX | Zero conversion drift |

---

### 4. Scope & Core Features (The 5 Core Jobs)
1. **Job 1: Global Employee Directory & Compensation Registry**
   - High-throughput virtualized/paginated data grid supporting 10,000 records.
   - Multi-facet filtering by Department, Country, Level, Band Status, Performance Rating, Compa-Ratio range.
   - Dual currency presentation (Local Currency + Normalized USD).
2. **Job 2: Salary Adjustment & Review Workflow**
   - Single & bulk compensation adjustments with live compa-ratio previews.
   - Required reason codes (*Merit Increase, Promotion, Market Correction, Cost of Living, Retention, Annual Review*).
   - Immutable audit logging with before/after snapshots and delta cost impact.
3. **Job 3: Department & Regional Cost Intelligence**
   - Aggregate payroll expenditure, headcount share, average/median compensation by department and country.
   - Budget percentage distribution across business units.
4. **Job 4: Career Level Pay Distribution & Equity Analytics**
   - Box-and-Whisker distribution analysis for career levels L1 through L7.
   - 25th percentile, Median (50th), 75th percentile, Min, and Max compensation whiskers.
   - Gender pay equity compa-ratio comparison.
5. **Job 5: Out-of-Band & Anomaly Radar**
   - Automated detection of employees paid below band minimum (flight risk) or above band maximum.
   - Identification of high-performer / low-compa-ratio disparities.
   - 1-click bulk compensation remediation.
6. **Compensation Planning & Budget Scenario Simulator**
   - Model org-wide or departmental merit pool percentages (e.g., 3.5% pool).
   - Performance-weighted allocation multipliers (1★ to 5★).
   - Live cost impact preview prior to application.

---

### 5. Explicit Non-Goals & Deliberate Trade-Offs

| Deliberate Non-Goal | Technical & Business Reasoning |
|---|---|
| **1. Self-Service Employee Portal** | **Reason:** Scope is strictly focused on the HR Manager persona managing compensation strategy and compliance. Employee self-service requires multi-tenant RBAC, personal tax withholding forms, and mobile employee experiences that detract from core compensation analytics. |
| **2. Live Banking / ACH Payroll Disbursement** | **Reason:** Direct deposit rails (NACHA, BACS, SEPA) involve regulatory banking gateways, escrow accounts, and settlement protocols. This platform acts as the *System of Record and Strategy* that outputs approved payroll to downstream disbursement providers. |
| **3. Complex 3rd-Party HRIS Bi-Directional Sync** | **Reason:** Full bi-directional sync with Workday/BambooHR introduces unpredictable webhook retry loops and rate limits during demo/evaluation. Instead, a clean REST API and CSV export/import architecture is provided. |
| **4. Strict Authentication Gate on Public Demo** | **Reason:** ADR-002/005 explicitly opens the public demo sandbox to eliminate reviewer friction while maintaining full client/server separation and synthetic data safety. |
`;
