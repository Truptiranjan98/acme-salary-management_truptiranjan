import React from 'react';
import {
  Users,
  Building2,
  DollarSign,
  FileText,
  TestTube2,
  RotateCcw,
  Sparkles,
  Layers,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Sliders,
  History,
  BookOpen,
} from 'lucide-react';
import { CurrencyCode } from '../types/salary';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currencyMode: 'USD' | 'LOCAL';
  setCurrencyMode: (mode: 'USD' | 'LOCAL') => void;
  onOpenGuidedDemo: () => void;
  onOpenDocs: () => void;
  onOpenTests: () => void;
  onResetData: () => void;
  outOfBandCount: number;
  testPassCount?: number;
  totalHeadcount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currencyMode,
  setCurrencyMode,
  onOpenGuidedDemo,
  onOpenDocs,
  onOpenTests,
  onResetData,
  outOfBandCount,
  testPassCount,
  totalHeadcount,
}) => {
  const tabs = [
    { id: 'directory', label: 'Employee Registry', icon: Users, count: totalHeadcount },
    { id: 'adjuster', label: 'Salary Review & Adjust', icon: Sliders },
    { id: 'departments', label: 'Dept & Regional Spend', icon: Building2 },
    { id: 'paybands', label: 'Pay Bands & Distribution', icon: TrendingUp },
    { id: 'anomalies', label: 'Anomaly Radar', icon: AlertTriangle, badge: outOfBandCount, badgeColor: 'bg-rose-500 text-white' },
    { id: 'simulator', label: 'Merit Planning & Modeler', icon: Sparkles },
    { id: 'audit', label: 'Audit Trail', icon: History },
    { id: 'artifacts', label: 'PRD & Architecture', icon: BookOpen },
  ];

  return (
    <header className="bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-40">
      {/* Top Bar: Brand, Persona & Utility Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Org Title (Bento Grid Header) */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]">
              A
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold tracking-tight text-white">
                  ACME Compensation <span className="text-zinc-500 font-normal text-sm hidden sm:inline">— HR Strategy & Intelligence</span>
                </h1>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">
                10,000 Global Employees • 12 Countries • 10 Currencies
              </p>
            </div>
          </div>

          {/* Right Action Tools & Persona */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Persona Badge */}
            <div className="hidden lg:flex items-center space-x-2 px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 text-indigo-400 font-bold flex items-center justify-center text-[10px]">
                TB
              </div>
              <div>
                <span className="font-semibold text-zinc-200">Truptiranjan Biswal</span>
                <span className="text-zinc-500 text-[10px] block">Global Comp Lead</span>
              </div>
            </div>

            {/* Currency Mode Switcher */}
            <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setCurrencyMode('USD')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currencyMode === 'USD'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Normalize all salaries to USD for unified global comparison"
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrencyMode('LOCAL')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currencyMode === 'LOCAL'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Display salaries in individual country local currencies"
              >
                Local FX
              </button>
            </div>

            {/* Guided Tour Button */}
            <button
              onClick={onOpenGuidedDemo}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold hover:bg-indigo-600/20 transition shadow-sm"
              title="Interactive walk-through of the 5 core jobs for Truptiranjan"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden md:inline">Demo Tour</span>
            </button>

            {/* Test Runner Button */}
            <button
              onClick={onOpenTests}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-800 hover:text-white transition"
              title="Run deterministic unit test suite"
            >
              <TestTube2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Tests</span>
              {testPassCount !== undefined && (
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/20">
                  {testPassCount}✓
                </span>
              )}
            </button>

            {/* PRD & ADR Document Button */}
            <button
              onClick={onOpenDocs}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-800 hover:text-white transition"
              title="View 1-Page PRD, ADRs and Trade-offs"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>PRD</span>
            </button>

            {/* Reset Seed Button */}
            <button
              onClick={onResetData}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition"
              title="Reset 10,000 employee dataset to initial deterministic state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1.5 overflow-x-auto scrollbar-none py-2 border-t border-zinc-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    {tab.count.toLocaleString()}
                  </span>
                )}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      tab.badgeColor || 'bg-rose-500 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
