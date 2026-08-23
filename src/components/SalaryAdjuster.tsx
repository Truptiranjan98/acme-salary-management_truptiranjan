import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Award,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users,
  Building2,
  Calendar,
  Layers,
  History,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  AdjustmentReason,
  Employee,
  CareerLevel,
  Department,
  CountryCode,
} from '../types/salary';
import { apiService } from '../services/apiService';
import {
  formatCurrency,
  formatUSD,
  getBandStatusBadge,
  getCompaRatioColor,
  getCountryFlag,
  getLevelBadge,
} from '../utils/formatters';

interface SalaryAdjusterProps {
  selectedEmployee: Employee | null;
  onEmployeeUpdated: (updatedEmp: Employee) => void;
  bulkSelectedIds: string[];
  onClearBulk: () => void;
  currencyMode: 'USD' | 'LOCAL';
}

export const SalaryAdjuster: React.FC<SalaryAdjusterProps> = ({
  selectedEmployee,
  onEmployeeUpdated,
  bulkSelectedIds,
  onClearBulk,
  currencyMode,
}) => {
  const [employee, setEmployee] = useState<Employee | null>(selectedEmployee);
  const [newSalaryLocal, setNewSalaryLocal] = useState<number>(0);
  const [reason, setReason] = useState<AdjustmentReason>('MERIT_INCREASE');
  const [notes, setNotes] = useState<string>('');
  const [actor, setActor] = useState<string>('Truptiranjan Biswal (HR Lead)');
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Bulk Mode state
  const isBulkMode = bulkSelectedIds && bulkSelectedIds.length > 0 && !selectedEmployee;
  const [bulkPct, setBulkPct] = useState<number>(4.0);
  const [bulkReason, setBulkReason] = useState<AdjustmentReason>('MERIT_INCREASE');
  const [bulkNotes, setBulkNotes] = useState<string>('Annual compensation cycle adjustment');

  useEffect(() => {
    if (selectedEmployee) {
      setEmployee(selectedEmployee);
      setNewSalaryLocal(selectedEmployee.baseSalary);
      setSuccessMessage(null);
    }
  }, [selectedEmployee]);

  if (!employee && !isBulkMode) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center shadow-sm space-y-4 max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <Sliders className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">No Employee Selected for Review</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mt-1">
            Select any employee from the Employee Registry or Anomaly Radar to review their pay band positioning, simulate adjustments, and record audit-governed salary changes.
          </p>
        </div>
      </div>
    );
  }

  // Handle Bulk Adjustments
  const handleExecuteBulk = async () => {
    setSaving(true);
    try {
      const res = await apiService.bulkAdjustSalary(
        bulkSelectedIds,
        bulkPct,
        bulkReason,
        bulkNotes,
        actor
      );

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSuccessMessage(
        `Successfully updated salaries for ${res.updatedCount} employees with a +${bulkPct}% increase (Total Annual Budget Delta: +$${res.totalCostDeltaUSD.toLocaleString()} USD).`
      );
      onClearBulk();
    } catch (e: any) {
      alert(`Bulk adjustment error: ${e?.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (isBulkMode) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Bulk Compensation Adjustment Workspace
              </h2>
              <p className="text-xs text-zinc-400">
                Applying batch salary progression for <span className="text-indigo-400 font-bold">{bulkSelectedIds.length} selected employees</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClearBulk}
            className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              Percentage Increase (%):
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={bulkPct}
                onChange={(e) => setBulkPct(parseFloat(e.target.value))}
                className="flex-1 accent-indigo-500"
              />
              <span className="text-lg font-bold text-indigo-400 w-16 text-right font-mono">
                +{bulkPct}%
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              {[2.5, 3.5, 5.0, 7.5, 10.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setBulkPct(pct)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    bulkPct === pct
                      ? 'bg-zinc-800 text-white border-zinc-700'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  +{pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Mandatory Reason Code:
              </label>
              <select
                value={bulkReason}
                onChange={(e) => setBulkReason(e.target.value as AdjustmentReason)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="MERIT_INCREASE">Merit Increase (Annual Performance Cycle)</option>
                <option value="MARKET_CORRECTION">Market Benchmark Correction</option>
                <option value="COST_OF_LIVING">Cost of Living Adjustment (COLA)</option>
                <option value="PROMOTION">Career Track Promotion</option>
                <option value="RETENTION_EQUITY">Retention & Pay Equity Alignment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Authorized HR Approver:
              </label>
              <input
                type="text"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Audit Notes / Business Justification:
            </label>
            <textarea
              rows={3}
              value={bulkNotes}
              onChange={(e) => setBulkNotes(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleExecuteBulk}
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{saving ? 'Applying Adjustments...' : `Execute Bulk Adjustment (${bulkSelectedIds.length} Staff)`}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Single Employee Adjustment calculations
  const emp = employee!;
  const currentSalaryLocal = emp.baseSalary;
  const currentSalaryUSD = emp.baseSalaryUSD;
  const fxRate = currentSalaryLocal / (currentSalaryUSD || 1);

  const proposedSalaryUSD = Math.round(newSalaryLocal / (fxRate || 1));
  const deltaLocal = newSalaryLocal - currentSalaryLocal;
  const deltaUSD = proposedSalaryUSD - currentSalaryUSD;
  const pctChange = currentSalaryLocal ? Math.round((deltaLocal / currentSalaryLocal) * 1000) / 10 : 0;

  const proposedCompa = Math.round((newSalaryLocal / (emp.bandMidLocal || 1)) * 100) / 100;
  let proposedBandStatus: 'IN_BAND' | 'BELOW_BAND' | 'ABOVE_BAND' = 'IN_BAND';
  if (newSalaryLocal < emp.bandMinLocal) proposedBandStatus = 'BELOW_BAND';
  else if (newSalaryLocal > emp.bandMaxLocal) proposedBandStatus = 'ABOVE_BAND';

  const proposedCompaMeta = getCompaRatioColor(proposedCompa);
  const proposedBandBadge = getBandStatusBadge(proposedBandStatus);

  // Quick adjustment presets
  const applyPct = (pct: number) => {
    setNewSalaryLocal(Math.round(currentSalaryLocal * (1 + pct / 100)));
  };

  const applyMidpoint = () => {
    setNewSalaryLocal(emp.bandMidLocal);
  };

  const applyMinBand = () => {
    setNewSalaryLocal(emp.bandMinLocal);
  };

  const handleSaveAdjustment = async () => {
    if (newSalaryLocal <= 0) {
      alert('Salary must be greater than zero.');
      return;
    }
    setSaving(true);
    try {
      const res = await apiService.adjustSalary(
        emp.id,
        newSalaryLocal,
        reason,
        notes,
        actor
      );

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
      });

      setEmployee(res.employee);
      onEmployeeUpdated(res.employee);
      setSuccessMessage(
        `Successfully updated ${emp.fullName}'s salary to ${formatCurrency(newSalaryLocal, emp.currency)} (${pctChange >= 0 ? '+' : ''}${pctChange}%). Audit record created.`
      );
    } catch (e: any) {
      alert(`Adjustment error: ${e?.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header Bento Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="flex items-center space-x-4">
            <img
              src={emp.avatar}
              alt={emp.fullName}
              className="w-16 h-16 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-sm"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{emp.fullName}</h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {emp.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getLevelBadge(emp.level)}`}>
                  {emp.level}
                </span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5">
                {emp.role} • <span className="text-indigo-400 font-semibold">{emp.department}</span>
              </p>
              <div className="flex items-center space-x-3 text-xs text-zinc-500 mt-1">
                <span>{getCountryFlag(emp.country)} {emp.city}, {emp.countryName}</span>
                <span>•</span>
                <span className="font-mono">Tenure: {emp.tenureYears} yrs</span>
                <span>•</span>
                <span>Rating: <strong className="text-amber-400 font-mono">{emp.performanceRating}★</strong></span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-right min-w-[200px]">
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Current Base Salary</div>
            <div className="text-lg font-bold text-white font-mono">
              {formatCurrency(emp.baseSalary, emp.currency)}
            </div>
            <div className="text-xs text-indigo-400 font-medium font-mono">
              ≈ {formatUSD(emp.baseSalaryUSD)} USD
            </div>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Visual Pay Band Positioning Gauge */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400 font-semibold">Official Level Pay Band ({emp.level} - {emp.department} - {emp.country}):</span>
            <div className="flex items-center space-x-2">
              <span className="text-zinc-500">Target Midpoint: <strong className="text-zinc-300 font-mono">{formatCurrency(emp.bandMidLocal, emp.currency)}</strong></span>
            </div>
          </div>

          {/* Pay Band Graphic Bar */}
          <div className="relative h-9 bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden flex items-center px-4">
            {/* Band Range shaded bar */}
            <div className="absolute left-[15%] right-[15%] top-2 bottom-2 bg-indigo-600/20 border-x-2 border-indigo-500/60 rounded" />
            {/* Midpoint Marker */}
            <div className="absolute left-[50%] top-0 bottom-0 w-0.5 bg-emerald-400 z-10">
              <span className="absolute -top-1 -left-4 text-[9px] font-bold text-emerald-400 bg-zinc-900 px-1 rounded">
                MID
              </span>
            </div>

            {/* Current Position Marker */}
            <div
              className="absolute top-1 bottom-1 w-3 rounded-full bg-amber-400 shadow-md shadow-amber-400/50 z-20 transition-all duration-300 flex items-center justify-center -translate-x-1/2"
              style={{
                left: `${Math.min(95, Math.max(5, (currentSalaryLocal / (emp.bandMidLocal * 1.5)) * 50 + 25))}%`,
              }}
              title={`Current Position: ${formatCurrency(currentSalaryLocal, emp.currency)}`}
            />

            <div className="w-full flex justify-between text-[11px] text-zinc-500 font-mono z-10 pointer-events-none">
              <span>Min: {formatCurrency(emp.bandMinLocal, emp.currency)}</span>
              <span className="font-semibold text-emerald-400">1.00x Midpoint</span>
              <span>Max: {formatCurrency(emp.bandMaxLocal, emp.currency)}</span>
            </div>
          </div>
        </div>

        {/* Live Adjustment Sandbox */}
        <div className="mt-6 pt-6 border-t border-zinc-800 space-y-5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Configure Compensation Adjustment</span>
          </h3>

          {/* Quick Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs text-zinc-400 font-medium">Quick Benchmarks & Progression:</span>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => applyPct(3)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-indigo-500 hover:text-white transition cursor-pointer"
              >
                +3% Standard Merit
              </button>
              <button
                onClick={() => applyPct(5)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-indigo-500 hover:text-white transition cursor-pointer"
              >
                +5% Strong Merit
              </button>
              <button
                onClick={() => applyPct(10)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-indigo-500 hover:text-white transition cursor-pointer"
              >
                +10% Promotion Step
              </button>
              <button
                onClick={() => applyPct(15)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 hover:border-indigo-500 hover:text-white transition cursor-pointer"
              >
                +15% Critical Retention
              </button>
              <button
                onClick={applyMidpoint}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60 transition cursor-pointer"
              >
                🎯 Target Band Midpoint
              </button>
              {emp.bandStatus === 'BELOW_BAND' && (
                <button
                  onClick={applyMinBand}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60 transition animate-pulse cursor-pointer"
                >
                  🛡️ Bring to Band Minimum
                </button>
              )}
            </div>
          </div>

          {/* New Salary Numeric Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Proposed New Base Salary ({emp.currency}):
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={newSalaryLocal}
                  onChange={(e) => setNewSalaryLocal(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 px-3 text-base font-bold text-white focus:border-indigo-500 focus:outline-none font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400 font-mono">
                  {emp.currency}
                </span>
              </div>
            </div>

            {/* Impact Metric Card */}
            <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Proposed Compa-Ratio:</span>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded font-bold text-xs font-mono border ${proposedCompaMeta.badgeBg} ${proposedCompaMeta.borderColor}`}>
                  {proposedCompa.toFixed(2)}x
                </span>
              </div>
              <div className="text-right">
                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Annual Delta (USD):</span>
                <span className={`font-bold text-sm font-mono ${deltaUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {deltaUSD >= 0 ? '+' : ''}{formatUSD(deltaUSD)} ({pctChange >= 0 ? '+' : ''}{pctChange}%)
                </span>
              </div>
            </div>
          </div>

          {/* Reason Code & Approver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Mandatory Reason Code <span className="text-rose-400">*</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as AdjustmentReason)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="MERIT_INCREASE">Merit Increase (Performance Cycle)</option>
                <option value="PROMOTION">Career Track Promotion</option>
                <option value="MARKET_CORRECTION">Market Benchmark Correction</option>
                <option value="COST_OF_LIVING">Cost of Living Adjustment (COLA)</option>
                <option value="RETENTION_EQUITY">Retention & Pay Equity Alignment</option>
                <option value="ANNUAL_REVIEW">Annual Compensation Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                Authorized HR Approver
              </label>
              <input
                type="text"
                value={actor}
                onChange={(e) => setActor(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
              Business Justification Notes & Performance Context:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Q3 Merit progression for high project impact and cross-regional leadership."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-between">
            <div className="text-xs text-zinc-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Creates immutable compliance audit trail</span>
            </div>

            <button
              onClick={handleSaveAdjustment}
              disabled={saving || newSalaryLocal === currentSalaryLocal}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-40 transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Recording Adjustment...' : 'Commit Salary Adjustment'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Salary History Timeline */}
      {emp.salaryHistory && emp.salaryHistory.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <span>Compensation Progression History ({emp.salaryHistory.length} Events)</span>
          </h3>

          <div className="space-y-3">
            {emp.salaryHistory.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{item.reason.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{item.date}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-bold font-mono">
                      +{item.percentageChange}%
                    </span>
                  </div>
                  <p className="text-zinc-400">{item.notes}</p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <div className="font-bold text-zinc-200 font-mono">
                    {formatCurrency(item.previousSalaryLocal, emp.currency)} → {formatCurrency(item.newSalaryLocal, emp.currency)}
                  </div>
                  <div className="text-[10px] text-zinc-500">Approved by {item.approvedBy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
