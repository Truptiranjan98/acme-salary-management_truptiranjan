import React, { useState, useEffect } from 'react';
import {
  Building2,
  Globe2,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowRight,
  PieChart,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DepartmentMetric, CountryMetric } from '../types/salary';
import { apiService } from '../services/apiService';
import { formatCurrency, formatUSD, getCountryFlag } from '../utils/formatters';

interface DepartmentAnalyticsProps {
  onFilterByDepartment: (dept: string) => void;
  onFilterByCountry: (country: string) => void;
}

export const DepartmentAnalytics: React.FC<DepartmentAnalyticsProps> = ({
  onFilterByDepartment,
  onFilterByCountry,
}) => {
  const [departments, setDepartments] = useState<DepartmentMetric[]>([]);
  const [countries, setCountries] = useState<CountryMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'DEPARTMENTS' | 'COUNTRIES'>('DEPARTMENTS');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [deptData, countryData] = await Promise.all([
          apiService.getDepartmentMetrics(),
          apiService.getCountryMetrics(),
        ]);
        setDepartments(deptData);
        setCountries(countryData);
      } catch (e) {
        console.error('Error fetching department metrics', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <Building2 className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-400" />
        <p className="text-sm">Calculating department and regional payroll aggregations...</p>
      </div>
    );
  }

  const totalOrgBudgetUSD = departments.reduce((sum, d) => sum + d.totalCostUSD, 0);

  return (
    <div className="space-y-6">
      {/* Bento Grid Header & View Switcher */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Department & Regional Spend Intelligence</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Total Annual Payroll Spend: <span className="text-emerald-400 font-bold font-mono">{formatUSD(totalOrgBudgetUSD)}</span> across 8 strategic departments & 12 countries.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveView('DEPARTMENTS')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeView === 'DEPARTMENTS'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🏢 By Department (8)
          </button>
          <button
            onClick={() => setActiveView('COUNTRIES')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              activeView === 'COUNTRIES'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🌐 By Country & Currency (12)
          </button>
        </div>
      </div>

      {activeView === 'DEPARTMENTS' ? (
        /* Department Bento Grid & Cards */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.department}
                onClick={() => onFilterByDepartment(dept.department)}
                className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 shadow-sm cursor-pointer group transition duration-200 space-y-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm group-hover:text-indigo-400 transition">
                      {dept.department}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
                      {dept.pctOfTotalBudget}% budget
                    </span>
                  </div>

                  {/* Progress bar of budget */}
                  <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden my-3 border border-zinc-800/80">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, dept.pctOfTotalBudget * 2.5)}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-zinc-800">
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Headcount</span>
                      <span className="font-semibold text-zinc-200 font-mono">{dept.headcount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Total Cost</span>
                      <span className="font-bold text-white font-mono">{formatUSD(dept.totalCostUSD, true)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Avg Base</span>
                      <span className="font-semibold text-zinc-200 font-mono">{formatUSD(dept.avgBaseSalaryUSD)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Compa</span>
                      <span className="font-bold text-emerald-400 font-mono">{dept.avgCompaRatio.toFixed(2)}x</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-800">
                  <span className="flex items-center gap-1 text-rose-400">
                    <AlertTriangle className="w-3 h-3" /> {dept.outOfBandCount} anomalies
                  </span>
                  <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                    Explore <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Department Detailed Breakdown Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                Full Departmental Compensation Breakdown
              </h3>
              <span className="text-[11px] text-zinc-500">Click any row to filter directory</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800 text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4 text-right">Headcount</th>
                    <th className="py-3.5 px-4 text-right">% Org Spend</th>
                    <th className="py-3.5 px-4 text-right">Total Annual Cost (USD)</th>
                    <th className="py-3.5 px-4 text-right">Average Base</th>
                    <th className="py-3.5 px-4 text-right">Median Base</th>
                    <th className="py-3.5 px-4 text-right">Range (Min - Max)</th>
                    <th className="py-3.5 px-4 text-right">Compa Ratio</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-medium text-zinc-200">
                  {departments.map((dept) => (
                    <tr
                      key={dept.department}
                      onClick={() => onFilterByDepartment(dept.department)}
                      className="hover:bg-zinc-800/40 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <span>{dept.department}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">{dept.headcount.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-indigo-400">{dept.pctOfTotalBudget}%</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white font-mono">
                        {formatUSD(dept.totalCostUSD)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">{formatUSD(dept.avgBaseSalaryUSD)}</td>
                      <td className="py-3.5 px-4 text-right text-zinc-400 font-mono">{formatUSD(dept.medianBaseSalaryUSD)}</td>
                      <td className="py-3.5 px-4 text-right text-zinc-500 font-mono text-[11px]">
                        {formatUSD(dept.minSalaryUSD, true)} - {formatUSD(dept.maxSalaryUSD, true)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-bold text-emerald-400">{dept.avgCompaRatio.toFixed(2)}x</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-indigo-400 text-xs font-semibold hover:underline">
                          View Staff →
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Country / Regional Bento Table */
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
              12 Global Jurisdictions & Currency Normalization
            </h3>
            <span className="text-[11px] text-zinc-500">Click any country to filter employee registry</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Country / Region</th>
                  <th className="py-3.5 px-4">Currency & FX</th>
                  <th className="py-3.5 px-4 text-right">Headcount</th>
                  <th className="py-3.5 px-4 text-right">Total Payroll (Local Currency)</th>
                  <th className="py-3.5 px-4 text-right">Normalized Total (USD)</th>
                  <th className="py-3.5 px-4 text-right">Avg Salary (USD)</th>
                  <th className="py-3.5 px-4 text-right">Median Salary (USD)</th>
                  <th className="py-3.5 px-4 text-right">Avg Compa</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 font-medium text-zinc-200">
                {countries.map((c) => (
                  <tr
                    key={c.country}
                    onClick={() => onFilterByCountry(c.country)}
                    className="hover:bg-zinc-800/40 transition cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getCountryFlag(c.country)}</span>
                        <span>{c.countryName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-zinc-200 font-bold">{c.currency}</span>
                      <span className="text-zinc-500 text-[10px] block font-mono">
                        (1 USD = {c.exchangeRateToUSD} {c.currency})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">{c.headcount.toLocaleString()}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-zinc-300">
                      {formatCurrency(c.totalCostLocal, c.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-400 font-mono">
                      {formatUSD(c.totalCostUSD)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono">{formatUSD(c.avgSalaryUSD)}</td>
                    <td className="py-3.5 px-4 text-right text-zinc-400 font-mono">{formatUSD(c.medianSalaryUSD)}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-zinc-200 font-mono">
                      {c.avgCompaRatio.toFixed(2)}x
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-indigo-400 text-xs font-semibold hover:underline">
                        Filter →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
