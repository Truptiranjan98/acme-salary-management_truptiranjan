import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Award,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Edit3,
  CheckCircle2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { Employee, PaginatedResult } from '../types/salary';
import { apiService } from '../services/apiService';
import {
  formatCurrency,
  formatUSD,
  getBandStatusBadge,
  getCompaRatioColor,
  getCountryFlag,
  getLevelBadge,
} from '../utils/formatters';

interface AnomalyRadarProps {
  onSelectEmployeeForAdjust: (emp: Employee) => void;
  currencyMode: 'USD' | 'LOCAL';
}

export const AnomalyRadar: React.FC<AnomalyRadarProps> = ({
  onSelectEmployeeForAdjust,
  currencyMode,
}) => {
  const [activeTab, setActiveTab] = useState<'UNDERPAID' | 'HIGH_PERF' | 'OVERPAID'>('UNDERPAID');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [remedying, setRemedying] = useState<boolean>(false);
  const [remedySuccess, setRemedySuccess] = useState<string | null>(null);

  const fetchAnomalies = async () => {
    setLoading(true);
    try {
      let anomalyType: any = 'UNDERPAID';
      if (activeTab === 'HIGH_PERF') anomalyType = 'HIGH_PERF_UNDERPAID';
      if (activeTab === 'OVERPAID') anomalyType = 'OVERPAID';

      const res: PaginatedResult<Employee> = await apiService.getEmployees({
        anomalyType,
        pageSize: 100,
        sortBy: 'compaRatio',
        sortOrder: activeTab === 'OVERPAID' ? 'desc' : 'asc',
      });
      setEmployees(res.data);
      setTotal(res.total);
    } catch (e) {
      console.error('Error fetching anomalies', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
  }, [activeTab]);

  // One-click remediation for underpaid staff
  const handleAutoRemedyUnderpaid = async () => {
    setRemedying(true);
    try {
      const underpaidIds = employees.filter((e) => e.bandStatus === 'BELOW_BAND').map((e) => e.id);
      if (underpaidIds.length > 0) {
        await apiService.bulkAdjustSalary(
          underpaidIds,
          10.0,
          'MARKET_CORRECTION',
          'Automated Band-Min Remediation via Anomaly Radar',
          'Truptiranjan Biswal (HR Lead)'
        );
      }

      setRemedySuccess(
        `Remediation executed! Adjusted ${underpaidIds.length} underpaid employees with market corrections.`
      );
      fetchAnomalies();
    } catch (e: any) {
      alert(`Remediation error: ${e?.message}`);
    } finally {
      setRemedying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bento Grid Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Out-of-Band & Anomaly Intelligence Radar</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Automated detection of pay disparities, underpaid retention flight risks (&lt;0.80 Compa), and overpaid red-circled staff (&gt;1.20 Compa).
          </p>
        </div>

        {/* 1-Click Remediation Button */}
        {activeTab === 'UNDERPAID' && (
          <button
            onClick={handleAutoRemedyUnderpaid}
            disabled={remedying || total === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition cursor-pointer"
          >
            <Zap className="w-4 h-4 text-emerald-200" />
            <span>{remedying ? 'Remediating...' : 'Batch Fix Underpaid Staff'}</span>
          </button>
        )}
      </div>

      {remedySuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{remedySuccess}</span>
        </div>
      )}

      {/* Radar Bento Tabs */}
      <div className="flex space-x-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('UNDERPAID')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'UNDERPAID'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Underpaid Flight Risks (&lt; 0.80 Compa)</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-rose-300 text-[10px] font-mono border border-zinc-800">
            {activeTab === 'UNDERPAID' ? total : ''}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('HIGH_PERF')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'HIGH_PERF'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Top Performers Underpaid (Rating 4-5★)</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-amber-300 text-[10px] font-mono border border-zinc-800">
            {activeTab === 'HIGH_PERF' ? total : ''}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('OVERPAID')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
            activeTab === 'OVERPAID'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span>Overpaid / Red-Circled (&gt; 1.20 Compa)</span>
          <span className="px-2 py-0.5 rounded-full bg-zinc-950 text-purple-300 text-[10px] font-mono border border-zinc-800">
            {activeTab === 'OVERPAID' ? total : ''}
          </span>
        </button>
      </div>

      {/* Anomaly Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Department & Role</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4 text-right">Current Salary</th>
                <th className="py-3.5 px-4 text-right">Target Midpoint</th>
                <th className="py-3.5 px-4 text-right">Compa Ratio</th>
                <th className="py-3.5 px-4 text-center">Disparity Gap</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-medium text-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    Scanning 10,000 records for compensation anomalies...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-emerald-400 font-semibold">
                    🎉 Zero anomalies in this category! All compensation is within healthy thresholds.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const compaMeta = getCompaRatioColor(emp.compaRatio);
                  const deltaToMidUSD = emp.baseSalaryUSD - emp.bandMidUSD;

                  return (
                    <tr key={emp.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.fullName}
                            className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{emp.fullName}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 font-mono text-zinc-400">
                                {emp.id}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-500">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-200">{emp.role}</div>
                        <div className="text-[11px] text-zinc-500">{emp.department}</div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span>{getCountryFlag(emp.country)}</span>
                          <span className="text-zinc-200">{emp.city}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getLevelBadge(emp.level)}`}>
                          {emp.level}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-amber-400 font-bold font-mono">{emp.performanceRating}★</span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-bold text-white font-mono">{formatUSD(emp.baseSalaryUSD)}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {formatCurrency(emp.baseSalary, emp.currency)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right text-zinc-400 font-mono">
                        {formatUSD(emp.bandMidUSD)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs font-mono border ${compaMeta.badgeBg} ${compaMeta.borderColor}`}>
                          {emp.compaRatio.toFixed(2)}x
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono text-xs">
                        <span className={deltaToMidUSD < 0 ? 'text-rose-400 font-bold' : 'text-purple-400 font-bold'}>
                          {deltaToMidUSD < 0 ? '-' : '+'}{formatUSD(Math.abs(deltaToMidUSD))}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onSelectEmployeeForAdjust(emp)}
                          className="flex items-center space-x-1 mx-auto px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-indigo-600 hover:text-white border border-zinc-700 transition text-xs font-semibold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
