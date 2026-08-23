import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Globe2,
  Users,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CountryCode,
  Department,
  SimulationRequest,
  SimulationResult,
} from '../types/salary';
import { apiService } from '../services/apiService';
import { formatUSD } from '../utils/formatters';
import { COUNTRIES, DEPARTMENTS } from '../server/seedData';

interface MeritSimulatorProps {
  onScenarioApplied: () => void;
}

export const MeritSimulator: React.FC<MeritSimulatorProps> = ({
  onScenarioApplied,
}) => {
  const [meritPoolPct, setMeritPoolPct] = useState<number>(3.5);
  const [selectedDept, setSelectedDept] = useState<Department | 'ALL'>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | 'ALL'>('ALL');
  const [remedyBelowBand, setRemedyBelowBand] = useState<boolean>(true);

  // Performance Multipliers
  const [multiplier5, setMultiplier5] = useState<number>(1.8);
  const [multiplier4, setMultiplier4] = useState<number>(1.3);
  const [multiplier3, setMultiplier3] = useState<number>(1.0);
  const [multiplier2, setMultiplier2] = useState<number>(0.4);
  const [multiplier1, setMultiplier1] = useState<number>(0.0);

  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [applying, setApplying] = useState<boolean>(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const params: SimulationRequest = {
        meritPoolPct,
        applyToDepartment: selectedDept,
        applyToCountry: selectedCountry,
        performanceMultipliers: {
          rating5: multiplier5,
          rating4: multiplier4,
          rating3: multiplier3,
          rating2: multiplier2,
          rating1: multiplier1,
        },
        remedyBelowBand,
      };
      const result = await apiService.simulateIncrease(params);
      setSimulation(result);
    } catch (e) {
      console.error('Simulation error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [
    meritPoolPct,
    selectedDept,
    selectedCountry,
    remedyBelowBand,
    multiplier5,
    multiplier4,
    multiplier3,
    multiplier2,
    multiplier1,
  ]);

  const handleApplyScenario = async () => {
    if (!simulation) return;
    setApplying(true);
    try {
      const res = await apiService.getEmployees({
        department: selectedDept === 'ALL' ? undefined : selectedDept,
        country: selectedCountry === 'ALL' ? undefined : selectedCountry,
        pageSize: 10000,
      });

      const ids = res.data.map((e) => e.id);
      await apiService.bulkAdjustSalary(
        ids,
        meritPoolPct,
        'MERIT_INCREASE',
        `Merit Cycle simulation commit: ${meritPoolPct}% pool weighted by performance`,
        'Truptiranjan Biswal (HR Lead)'
      );

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });

      setApplySuccess(`Applied merit cycle adjustments for ${ids.length} employees!`);
      onScenarioApplied();
    } catch (e: any) {
      alert(`Error applying scenario: ${e?.message}`);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bento Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Compensation Planning & Merit Scenario Modeler</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Simulate annual merit increases, performance rating multipliers, and below-band remediation to model total CFO budget impact before committing.
            </p>
          </div>
        </div>
      </div>

      {applySuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{applySuccess}</span>
        </div>
      )}

      {/* Grid: Controls on Left, Live Financials on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Parameter Sandbox */}
        <div className="lg:col-span-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <span>Scenario Parameters</span>
          </h3>

          {/* Merit Pool Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-semibold">Base Merit Pool:</span>
              <span className="text-base font-bold text-indigo-400 font-mono">{meritPoolPct}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8.0"
              step="0.1"
              value={meritPoolPct}
              onChange={(e) => setMeritPoolPct(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>0.5% (Conservative)</span>
              <span>3.5% (Benchmark)</span>
              <span>8.0% (Aggressive)</span>
            </div>
          </div>

          {/* Scope Filters */}
          <div className="space-y-3 pt-2 border-t border-zinc-800 text-xs">
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Target Department:</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Departments (10,000 Staff)</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 font-medium mb-1">Target Country:</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Countries (12)</option>
                {Object.values(COUNTRIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Performance Multipliers */}
          <div className="space-y-2.5 pt-3 border-t border-zinc-800">
            <span className="text-xs font-semibold text-zinc-300 block">
              Performance-Weighted Multipliers:
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-semibold">5★ Exceptional:</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[11px]">{(meritPoolPct * multiplier5).toFixed(1)}%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="4"
                    value={multiplier5}
                    onChange={(e) => setMultiplier5(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-right font-bold text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-semibold">4★ Exceeds:</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[11px]">{(meritPoolPct * multiplier4).toFixed(1)}%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="3"
                    value={multiplier4}
                    onChange={(e) => setMultiplier4(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-right font-bold text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-300">3★ Strong Performer:</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[11px]">{(meritPoolPct * multiplier3).toFixed(1)}%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={multiplier3}
                    onChange={(e) => setMultiplier3(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-right font-bold text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">2★ Developing:</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[11px]">{(meritPoolPct * multiplier2).toFixed(1)}%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={multiplier2}
                    onChange={(e) => setMultiplier2(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-right font-bold text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">1★ Needs Imp:</span>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 font-mono text-[11px]">{(meritPoolPct * multiplier1).toFixed(1)}%</span>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={multiplier1}
                    onChange={(e) => setMultiplier1(parseFloat(e.target.value) || 0)}
                    className="w-16 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-right font-bold text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Toggle Below Band Auto Remediation */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-zinc-200 block">Remedy Below-Band Staff</span>
              <span className="text-[10px] text-zinc-500">Auto-elevate below min to band boundary</span>
            </div>
            <input
              type="checkbox"
              checked={remedyBelowBand}
              onChange={(e) => setRemedyBelowBand(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500"
            />
          </div>
        </div>

        {/* Right Columns: Financial Outcomes & Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Simulation KPIs */}
          {simulation ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Eligible Scope
                </span>
                <div className="text-2xl font-bold text-white mt-1 font-mono">
                  {simulation.eligibleHeadcount.toLocaleString()} Staff
                </div>
                <span className="text-xs text-indigo-400 font-medium font-mono">
                  {simulation.employeesAdjustedCount.toLocaleString()} impacted
                </span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Total Budget Delta (USD)
                </span>
                <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
                  +{formatUSD(simulation.totalCostDeltaUSD, true)}
                </div>
                <span className="text-xs text-emerald-300 font-medium font-mono">
                  +{simulation.overallIncreasePct}% org growth
                </span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Average Increase
                </span>
                <div className="text-2xl font-bold text-white mt-1 font-mono">
                  +{formatUSD(simulation.avgIncreaseUSD)}
                </div>
                <span className="text-xs text-zinc-500 font-medium">
                  Per employee annual delta
                </span>
              </div>
            </div>
          ) : (
            <div className="h-28 bg-zinc-900 animate-pulse rounded-2xl border border-zinc-800" />
          )}

          {/* Sample Impact Preview Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                Simulated Impact Preview (Representative Sample)
              </h3>
              <span className="text-[11px] text-zinc-500">Showing top 10 calculated samples</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800 text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Employee</th>
                    <th className="py-3 px-3">Rating</th>
                    <th className="py-3 px-3 text-right">Current (USD)</th>
                    <th className="py-3 px-3 text-right">Simulated (USD)</th>
                    <th className="py-3 px-3 text-right">Delta</th>
                    <th className="py-3 px-3 text-right">Compa Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-medium text-zinc-200">
                  {simulation?.previewSamples.map((s) => (
                    <tr key={s.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white">{s.fullName}</span>
                        <span className="text-[10px] text-zinc-500 block">{s.department} • {s.level}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-amber-400 font-bold font-mono">{s.performanceRating}★</span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-zinc-400 font-mono">
                        {formatUSD(s.currentSalaryUSD)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-emerald-400 font-mono">
                        {formatUSD(s.simulatedSalaryUSD)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-indigo-400 font-mono">
                        +{formatUSD(s.deltaUSD)} (+{s.pctChange}%)
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        <span className="text-zinc-500">{s.currentCompaRatio.toFixed(2)}x</span>
                        <span className="text-zinc-600 mx-1">→</span>
                        <span className="font-bold text-emerald-400">{s.simulatedCompaRatio.toFixed(2)}x</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Apply Scenario Footer */}
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
              <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Simulations are read-only until explicitly applied.</span>
              </div>

              <button
                onClick={handleApplyScenario}
                disabled={applying}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{applying ? 'Applying Cycle...' : 'Apply Simulation to Compensation System'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
