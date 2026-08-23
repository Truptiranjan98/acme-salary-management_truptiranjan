# ACME Corporation — Global Salary & Compensation Management System (10,000 Staff)

[![Author: Truptiranjan Biswal](https://img.shields.io/badge/Author-Truptiranjan%20Biswal-4f46e5)](https://github.com/Truptiranjan98)
[![GitHub Profile](https://img.shields.io/badge/GitHub-Truptiranjan98-181717?logo=github)](https://github.com/Truptiranjan98)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Tests Passing](https://img.shields.io/badge/Tests-8%2F8%20Passed-10b981)]()

A high-performance, enterprise-grade compensation management platform built for **10,000 employees** across **12 countries** and **8 business departments**. Designed to automate executive salary adjustments, departmental cost aggregation, level-based boxplot pay band governance, out-of-band anomaly detection, and merit planning.

Developed and submitted by **[Truptiranjan Biswal](https://github.com/Truptiranjan98)**.

---

## 🌟 Executive Overview & The 5 Core Jobs

This system fulfills the 5 primary compensation engineering responsibilities for **Truptiranjan Biswal (Global HR Manager & Compensation Strategy Lead)**:

1. **Job 1: Employee Directory & Compensation Profile Lookup**
   - Instant search across 10,000 records (<5ms query time).
   - Dual-currency normalization (Local FX vs. USD Baseline).
   - Real-time Compa-Ratio calculations and market band positioning.

2. **Job 2: Salary Review & Adjustment Workbench**
   - Interactive salary sliders with instant delta feedback.
   - Mandatory reason codes (`MERIT_INCREASE`, `PROMOTION`, `MARKET_CORRECTION`, etc.).
   - Comprehensive immutable audit trail logging with author tracking.

3. **Job 3: Department & Regional Payroll Intelligence**
   - Real-time aggregation of payroll expenditures across 8 departments and 12 countries.
   - Headcount metrics, average base salary, and median compensation reporting.

4. **Job 4: Career Level Pay Distributions (Box-and-Whisker)**
   - Statistical 5-point quantile metrics ($Min$, $Q1$, $Median$, $Q3$, $Max$).
   - Visual market pay band validation across career levels ($L1$ to $L7$).

5. **Job 5: Anomaly Radar & 1-Click Remediation**
   - Automated detection of flight risks (compa-ratio $<0.80$) and red-circled overpaid staff ($>1.20$).
   - 1-click batch remediation engine for instant band-minimum correction.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation & Launch
```bash
# Clone repository
git clone https://github.com/Truptiranjan98/acme-salary-management.git
cd acme-salary-management

# Install dependencies
npm install

# Start development server
npm run dev
```
Open `http://localhost:3000` in your browser.

### Running Test Suite
Run the 8-point deterministic test suite in your terminal or via the in-app Test Runner:
```bash
npm run test # or verify live inside the UI
```

---

## 📦 Deployment Options

### Recommended Deployment Names:
- **`acme-salary-management`**
- **`truptiranjan-salary-engine`**
- **`truptiranjan-comp-platform`**

### 1. Deploy on Vercel / Netlify
```bash
npm run build
# Deploy dist/ output directory
```

### 2. Full-Stack / Cloud Run / Railway / Render
```bash
# Build the production bundle
npm run build

# Start the Node.js Express server
npm start
```

---

## ☕ Java Spring Boot Backend (Complete Included)

The repository contains a full **Java 17 + Spring Boot 3** enterprise backend under `/backend-springboot`.

### Run the Spring Boot Server:
```bash
cd backend-springboot
mvn spring-boot:run
```
Server runs on `http://localhost:8080` exposing REST endpoints:
- `GET /api/employees` — Search & retrieve 10,000 employees
- `GET /api/employees/{id}` — Lookup specific employee comp profile
- `POST /api/employees/{id}/adjust-salary` — Adjust salary with audit logging
- `GET /api/audit-logs` — Retrieve compliance audit records
- `GET /api/analytics/departments` — Department aggregate costs
- `GET /api/analytics/level-distribution` — Boxplot statistical metrics

---

## 👨‍💻 Author & Contact
- **Developer:** Truptiranjan Biswal
- **GitHub:** [@Truptiranjan98](https://github.com/Truptiranjan98)
- **Role:** Full-Stack & Compensation Systems Engineer
