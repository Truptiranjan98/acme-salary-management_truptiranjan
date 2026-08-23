import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Award,
  ShieldCheck,
  Scale,
  ArrowUpRight,
  Globe2,
  Sliders,
  Sparkles,
  Download,
  Building2,
} from 'lucide-react';
import { OverviewMetrics } from '../types/salary';
import { formatUSD } from '../utils/formatters';

interface OverviewCardsProps {
  metrics: OverviewMetrics | null;
  onNavigateToAnomalies: () => void;
  onNavigateToSimulator: () => void;
  onNavigateToPayBands: () => void;
  onNavigateToRegistry?: () => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  metrics,
  onNavigateToAnomalies,
  onNavigateToSimulator,
  onNavigateToPayBands,
  onNavigateToRegistry,
}) => {
  const [distributionView, setDistributionView] = useState<'GRADE' | 'DEPT'>('GRADE');

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-zinc-900/80 rounded-2xl border border-zinc-800" />
        ))}
      </div>
    );
  }

  const healthyPct = Math.round((metrics.healthyBandCount / (metrics.totalHeadcount || 1)) * 100);

  return (
    <div className="space-y-4">
      {/* Bento Grid Top Section: 4 Distinct Grid Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Module 1: Metric - Annual Payroll */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm font-medium">Total Annual Payroll</span>
            <div className="p-1.5 bg-green-500/10 rounded-lg text-green-500">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight text-white">
              {formatUSD(metrics.totalPayrollUSD, true)}
            </div>
            <div className="text-xs text-zinc-500 mt-1 flex items-center justify-between">
              <span>+4.2% from last fiscal year</span>
              <span className="text-zinc-400 font-mono text-[11px]">+${((metrics.totalBonusPoolUSD) / 1e6).toFixed(1)}M bonus</span>
            </div>
          </div>
        </div>

        {/* Module 2: Metric - Headcount */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm font-medium">Total Headcount</span>
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-500">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight text-white">
              {metrics.totalHeadcount.toLocaleString()}
            </div>
            <div className="text-xs text-zinc-500 mt-1 flex items-center justify-between">
              <span>98.2% retention rate</span>
              <span className="text-blue-400 font-medium">12 Countries</span>
            </div>
          </div>
        </div>

        {/* Module 3: Metric - Average Salary & Health */}
        <div 
          onClick={onNavigateToPayBands}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-sm font-medium">Average Base Salary</span>
            <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold tracking-tight text-white">
              {formatUSD(metrics.avgBaseSalaryUSD)}
            </div>
            <div className="text-xs text-zinc-500 mt-1 flex items-center justify-between">
              <span>Compa: <strong className="text-purple-400 font-semibold">{metrics.avgCompaRatio.toFixed(2)}x</strong></span>
              <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px] font-medium">
                {healthyPct}% In-Band
              </span>
            </div>
          </div>
        </div>

        {/* Module 4: Quick Tools / Admin Bento Module (Indigo Feature Card) */}
        <div className="bg-indigo-600 rounded-2xl p-5 border border-indigo-500 flex flex-col justify-between shadow-[0_0_30px_rgba(79,70,229,0.2)] text-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base leading-tight">Admin<br />Quick Actions</h3>
            <Sparkles className="w-5 h-5 text-indigo-200" />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={onNavigateToAnomalies}
              className="bg-white/10 hover:bg-white/20 p-2 rounded text-[10px] text-center font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Review Radar
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="bg-white/10 hover:bg-white/20 p-2 rounded text-[10px] text-center font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Merit Plan
            </button>
            <button
              onClick={onNavigateToPayBands}
              className="bg-white/10 hover:bg-white/20 p-2 rounded text-[10px] text-center font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Pay Bands
            </button>
            <button
              onClick={() => onNavigateToRegistry ? onNavigateToRegistry() : onNavigateToAnomalies()}
              className="bg-white/10 hover:bg-white/20 p-2 rounded text-[10px] text-center font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Registry
            </button>
          </div>
        </div>
      </div>

      {/* Bento Grid Middle Section: Interactive Bento Distribution & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Bento Cell 1: Salary Distribution Visualizer (Span 2) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Org-Wide Salary Distribution</h3>
              <p className="text-xs text-zinc-500">Distribution across 10,000 employees & 12 regions</p>
            </div>
            <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setDistributionView('GRADE')}
                className={`px-2 py-1 text-[10px] rounded uppercase font-bold tracking-wider transition ${
                  distributionView === 'GRADE' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                By Grade (L1-L7)
              </button>
              <button
                onClick={() => setDistributionView('DEPT')}
                className={`px-2 py-1 text-[10px] rounded uppercase font-bold tracking-wider transition ${
                  distributionView === 'DEPT' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                By Dept
              </button>
            </div>
          </div>

          {/* Dynamic Distribution Bar Visualization */}
          <div className="flex items-end justify-between h-[120px] gap-2 px-1 my-2">
            <div className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-t-sm h-[25%] transition-all group-hover:h-[30%]" title="L1 Associate: $35k - $55k" />
              <span className="text-[10px] text-zinc-500 font-mono">L1</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-t-sm h-[48%] transition-all" title="L2 Mid-Level: $55k - $80k" />
              <span className="text-[10px] text-zinc-500 font-mono">L2</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-t-sm h-[75%] transition-all" title="L3 Senior: $80k - $115k" />
              <span className="text-[10px] text-zinc-500 font-mono">L3</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full bg-indigo-500 hover:bg-indigo-400 rounded-t-sm h-[95%] shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all" title="L4 Staff / Lead: $115k - $160k (Modal Density Peak)" />
              <span className="text-[10px] text-indigo-400 font-mono font-bold">L4</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-t-sm h-[65%] transition-all" title="L5 Principal: $160k - $220k" />
              <span className="text-[10px] text-zinc-500 font-mono">L5</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-t-sm h-[40%] transition-all" title="L6 Director: $220k - $310k" />
              <span className="text-[10px] text-zinc-500 font-mono">L6</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full bg-zinc-800 hover:bg-zinc-700 rounded-t-sm h-[20%] transition-all" title="L7 Executive / VP: $310k - $460k" />
              <span className="text-[10px] text-zinc-500 font-mono">L7</span>
            </div>
          </div>

          <div className="flex justify-between mt-2 pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-mono">
            <span>$30K</span>
            <span>$65K</span>
            <span>$105K (Median)</span>
            <span>$160K</span>
            <span>$240K</span>
            <span>$400K+</span>
          </div>
        </div>

        {/* Bento Cell 2: Top Departments Spend Progress Breakdown */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Top Department Spend
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">8 Depts</span>
          </div>

          <div className="space-y-3 flex-1 justify-center flex flex-col">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">Engineering</span>
                <span className="text-zinc-400 font-mono">$224M (26%)</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[85%] rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">Sales & Marketing</span>
                <span className="text-zinc-400 font-mono">$178M (21%)</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full w-[70%] rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">Product & Design</span>
                <span className="text-zinc-400 font-mono">$118M (14%)</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="bg-indigo-400/80 h-full w-[50%] rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-200">Operations & CS</span>
                <span className="text-zinc-400 font-mono">$92M (11%)</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="bg-indigo-400/60 h-full w-[38%] rounded-full" />
              </div>
            </div>
          </div>

          <div 
            onClick={onNavigateToPayBands}
            className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 hover:text-indigo-400 text-center uppercase tracking-wider cursor-pointer transition font-medium"
          >
            View Department Cost Rollups →
          </div>
        </div>

        {/* Bento Cell 3 & 4 Stack: Global Regional Weight & Anomaly Watch */}
        <div className="flex flex-col gap-4">
          {/* Global Operations Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-xs font-semibold text-zinc-200">Global Operations</span>
              </div>
              <span className="text-[10px] text-orange-400 font-mono">12 Jurisdictions</span>
            </div>
            <div className="flex gap-1 my-2">
              <div className="h-1.5 w-full bg-orange-500 rounded-sm" title="US: 32%" />
              <div className="h-1.5 w-full bg-orange-500/80 rounded-sm" title="UK & EU: 30%" />
              <div className="h-1.5 w-full bg-orange-500/60 rounded-sm" title="APAC: 22%" />
              <div className="h-1.5 w-full bg-orange-500/40 rounded-sm" title="LATAM: 16%" />
              <div className="h-1.5 w-full bg-zinc-800 rounded-sm" />
            </div>
            <div className="text-[10px] text-zinc-500 leading-tight">
              Tier-1 hubs (US, UK, DE) comprise 62% of aggregate compensation.
            </div>
          </div>

          {/* Anomaly & Pay Equity Gap Card */}
          <div 
            onClick={onNavigateToAnomalies}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between flex-1 hover:border-rose-500/40 cursor-pointer transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-rose-500">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold text-rose-400">Pay Equity Radar</span>
              </div>
              <span className="text-[10px] text-rose-400/80 uppercase font-bold tracking-wider">Action Needed</span>
            </div>
            <div className="flex items-baseline justify-between my-1">
              <div className="text-2xl font-bold text-white">
                {metrics.outOfBandCount} <span className="text-xs font-normal text-zinc-500">cases</span>
              </div>
              <span className="text-[10px] text-zinc-400">
                {metrics.belowBandCount} under / {metrics.aboveBandCount} over
              </span>
            </div>
            <div className="text-[10px] text-zinc-500 leading-tight flex items-center justify-between">
              <span>{metrics.highPerformerUnderpaidCount} top performers at flight risk</span>
              <ArrowUpRight className="w-3 h-3 text-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
