import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Layers,
  Scale,
  DollarSign,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { LevelDistributionMetric } from '../types/salary';
import { apiService } from '../services/apiService';
import { formatUSD, getLevelBadge } from '../utils/formatters';

interface PayBandsDistributionProps {
  onFilterByLevel: (level: string) => void;
}

export const PayBandsDistribution: React.FC<PayBandsDistributionProps> = ({
  onFilterByLevel,
}) => {
  const [levels, setLevels] = useState<LevelDistributionMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await apiService.getLevelDistributionMetrics();
        setLevels(data);
      } catch (e) {
        console.error('Error fetching pay band metrics', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <TrendingUp className="w-8 h-8 animate-spin mx-auto mb-3 text-indigo-400" />
        <p className="text-sm">Generating career level boxplot distributions & percentiles...</p>
      </div>
    );
  }

  // Max salary for chart scaling
  const globalMaxSalary = Math.max(...levels.map((l) => Math.max(l.maxSalaryUSD, l.bandMaxUSD))) || 500000;

  return (
    <div className="space-y-6">
      {/* Bento Grid Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">Career Level Pay Distribution & Boxplot Analytics</h2>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Visualizing actual employee compensation spreads (Min, P25, Median, P75, Max) against official ACME Market Pay Bands across career tracks (L1 to L7).
        </p>
      </div>

      {/* Interactive Box-and-Whisker Distribution Chart */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Box-and-Whisker Salary Spreads by Level (Normalized USD)
          </h3>
          <div className="flex items-center space-x-4 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-500/30 border border-indigo-400 inline-block" />
              <span>Interquartile Range (P25 - P75)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 inline-block" />
              <span>Median (P50)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded border border-dashed border-amber-400/80 inline-block" />
              <span>Market Band Guideline</span>
            </span>
          </div>
        </div>

        {/* Chart Rows */}
        <div className="space-y-4">
          {levels.map((lvl) => {
            const minPct = (lvl.minSalaryUSD / globalMaxSalary) * 100;
            const p25Pct = (lvl.p25SalaryUSD / globalMaxSalary) * 100;
            const medPct = (lvl.medianSalaryUSD / globalMaxSalary) * 100;
            const p75Pct = (lvl.p75SalaryUSD / globalMaxSalary) * 100;
            const maxPct = (lvl.maxSalaryUSD / globalMaxSalary) * 100;

            const bandMinPct = (lvl.bandMinUSD / globalMaxSalary) * 100;
            const bandMaxPct = (lvl.bandMaxUSD / globalMaxSalary) * 100;

            return (
              <div
                key={lvl.level}
                onClick={() => onFilterByLevel(lvl.level)}
                className="group cursor-pointer p-3.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-950 border border-zinc-800/90 hover:border-indigo-500/40 transition space-y-2"
              >
                {/* Level Title & KPIs */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-bold border ${getLevelBadge(lvl.level)}`}>
                      {lvl.level}
                    </span>
                    <span className="font-bold text-white group-hover:text-indigo-400 transition">
                      {lvl.title}
                    </span>
                    <span className="text-zinc-500 font-mono">({lvl.headcount.toLocaleString()} staff)</span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="text-zinc-400">
                      Median: <strong className="text-emerald-400 font-mono">{formatUSD(lvl.medianSalaryUSD)}</strong>
                    </span>
                    <span className="text-zinc-500">
                      Band: <strong className="text-zinc-300 font-mono">{formatUSD(lvl.bandMinUSD, true)} - {formatUSD(lvl.bandMaxUSD, true)}</strong>
                    </span>
                    <span className="text-indigo-400 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-0.5">
                      Explore Staff <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

                {/* Visual Chart Track */}
                <div className="relative h-10 bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden flex items-center">
                  {/* Official Market Band Guideline (Dashed Box) */}
                  <div
                    className="absolute top-1 bottom-1 border border-dashed border-amber-400/50 bg-amber-400/5 rounded"
                    style={{
                      left: `${bandMinPct}%`,
                      width: `${Math.max(2, bandMaxPct - bandMinPct)}%`,
                    }}
                    title={`Market Band: ${formatUSD(lvl.bandMinUSD)} - ${formatUSD(lvl.bandMaxUSD)}`}
                  />

                  {/* Whiskers Line (Min to Max) */}
                  <div
                    className="absolute h-0.5 bg-zinc-700 top-1/2 -translate-y-1/2"
                    style={{
                      left: `${minPct}%`,
                      width: `${Math.max(2, maxPct - minPct)}%`,
                    }}
                  />
                  {/* Min Cap */}
                  <div
                    className="absolute h-4 w-1 bg-zinc-500 top-1/2 -translate-y-1/2 rounded"
                    style={{ left: `${minPct}%` }}
                    title={`Min Salary: ${formatUSD(lvl.minSalaryUSD)}`}
                  />
                  {/* Max Cap */}
                  <div
                    className="absolute h-4 w-1 bg-zinc-500 top-1/2 -translate-y-1/2 rounded"
                    style={{ left: `${maxPct}%` }}
                    title={`Max Salary: ${formatUSD(lvl.maxSalaryUSD)}`}
                  />

                  {/* IQR Box (P25 to P75) */}
                  <div
                    className="absolute top-2 bottom-2 bg-indigo-600/30 border border-indigo-400/60 rounded shadow-md"
                    style={{
                      left: `${p25Pct}%`,
                      width: `${Math.max(2, p75Pct - p25Pct)}%`,
                    }}
                    title={`IQR (P25 - P75): ${formatUSD(lvl.p25SalaryUSD)} - ${formatUSD(lvl.p75SalaryUSD)}`}
                  />

                  {/* Median Line */}
                  <div
                    className="absolute top-1 bottom-1 w-1 bg-emerald-400 z-10 shadow-sm shadow-emerald-400/60"
                    style={{ left: `${medPct}%` }}
                    title={`Median: ${formatUSD(lvl.medianSalaryUSD)}`}
                  />
                </div>

                {/* Level Anomaly Footprint */}
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5">
                  <span className="font-mono">
                    Min: {formatUSD(lvl.minSalaryUSD)} | P25: {formatUSD(lvl.p25SalaryUSD)} | P50: {formatUSD(lvl.medianSalaryUSD)} | P75: {formatUSD(lvl.p75SalaryUSD)} | Max: {formatUSD(lvl.maxSalaryUSD)}
                  </span>
                  <div className="flex items-center space-x-2">
                    {lvl.belowBandCount > 0 && (
                      <span className="text-rose-400 font-semibold font-mono">{lvl.belowBandCount} below band</span>
                    )}
                    {lvl.aboveBandCount > 0 && (
                      <span className="text-purple-400 font-semibold font-mono">{lvl.aboveBandCount} above band</span>
                    )}
                    <span className="text-emerald-400 font-semibold font-mono">{lvl.inBandCount} healthy</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-zinc-950 border-b border-zinc-800">
          <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
            Tabular Metrics by Career Level
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Level</th>
                <th className="py-3.5 px-4 text-right">Headcount</th>
                <th className="py-3.5 px-4 text-right">Min</th>
                <th className="py-3.5 px-4 text-right">25th %ile</th>
                <th className="py-3.5 px-4 text-right">Median (P50)</th>
                <th className="py-3.5 px-4 text-right">75th %ile</th>
                <th className="py-3.5 px-4 text-right">Max</th>
                <th className="py-3.5 px-4 text-right">Target Mid</th>
                <th className="py-3.5 px-4 text-right">Avg Compa</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-medium text-zinc-200">
              {levels.map((lvl) => (
                <tr
                  key={lvl.level}
                  onClick={() => onFilterByLevel(lvl.level)}
                  className="hover:bg-zinc-800/40 transition cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                    <span className={`px-1.5 py-0.2 rounded font-bold border ${getLevelBadge(lvl.level)}`}>
                      {lvl.level}
                    </span>
                    <span>{lvl.title}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">{lvl.headcount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-right text-zinc-500 font-mono">{formatUSD(lvl.minSalaryUSD)}</td>
                  <td className="py-3.5 px-4 text-right text-zinc-400 font-mono">{formatUSD(lvl.p25SalaryUSD)}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-emerald-400 font-mono">{formatUSD(lvl.medianSalaryUSD)}</td>
                  <td className="py-3.5 px-4 text-right text-zinc-400 font-mono">{formatUSD(lvl.p75SalaryUSD)}</td>
                  <td className="py-3.5 px-4 text-right text-zinc-500 font-mono">{formatUSD(lvl.maxSalaryUSD)}</td>
                  <td className="py-3.5 px-4 text-right font-semibold text-amber-300 font-mono">{formatUSD(lvl.bandMidUSD)}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-white font-mono">{lvl.avgCompaRatio.toFixed(2)}x</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-indigo-400 text-xs font-semibold hover:underline">Filter Staff →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
