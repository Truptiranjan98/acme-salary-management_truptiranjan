import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Users,
  Sliders,
  Building2,
  TrendingUp,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Play,
  ArrowRight,
} from 'lucide-react';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToJob: (tabId: string, extraParams?: any) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToJob,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to Truptiranjan's Assessment Demo Walkthrough",
      job: 'Overview',
      icon: Sparkles,
      color: 'from-indigo-600 to-zinc-900',
      description:
        'This guided walkthrough demonstrates how Truptiranjan (HR Manager) uses the platform across 10,000 employees to answer executive questions, adjust salaries, analyze department budgets, and detect pay anomalies.',
      actionLabel: 'Begin 5-Job Tour',
      tabTarget: 'directory',
      talkingPoints: [
        'Built for an organization with 10,000 staff across 12 countries & 10 currencies.',
        'Sub-20ms query performance with instant multi-facet filtering.',
        'Dual-currency engine (Normalized USD vs Local Currency).',
      ],
    },
    {
      title: 'Job 1: Find an Employee & Compensation Profile',
      job: 'Job 1: Employee Directory & Registry',
      icon: Users,
      color: 'from-blue-600 to-zinc-900',
      description:
        'Truptiranjan searches for any employee (e.g. ACM-00042) to inspect their complete compensation structure: Base Salary, Target Bonus %, Total Comp, Tenure, Performance Rating, and Compa-Ratio positioning.',
      actionLabel: 'Jump to Employee Registry (Job 1)',
      tabTarget: 'directory',
      talkingPoints: [
        'Live search across 10,000 records with sub-5ms latency.',
        'Color-coded compa-ratio badges (Red <0.80, Green 0.90-1.10, Purple >1.20).',
        'One-click CSV export and multi-facet filtering.',
      ],
    },
    {
      title: 'Job 2: Adjust & Review Salary (with Audit Governance)',
      job: 'Job 2: Salary Review & Adjuster',
      icon: Sliders,
      color: 'from-emerald-600 to-zinc-900',
      description:
        'Truptiranjan adjusts base salary, tests quick benchmarks (+3%, +5%, +10%, match midpoint), selects mandatory reason codes (Merit, Promotion, Market Correction), and commits changes with an immutable audit log.',
      actionLabel: 'Open Salary Adjuster Workspace (Job 2)',
      tabTarget: 'adjuster',
      talkingPoints: [
        'Visual pay band slider with band min, midpoint, and max guidelines.',
        'Real-time recalculation of proposed compa-ratio and USD budget delta.',
        'Mandatory reason code selection creates an immutable compliance audit record.',
      ],
    },
    {
      title: 'Job 3: Pull Department & Regional Spend Intelligence',
      job: 'Job 3: Department & Regional Spend',
      icon: Building2,
      color: 'from-amber-600 to-zinc-900',
      description:
        'Truptiranjan pulls aggregate annual payroll costs across 8 departments and 12 countries to answer CFO queries on budget distribution, average base salary, median compensation, and regional spend.',
      actionLabel: 'View Department & Regional Intelligence (Job 3)',
      tabTarget: 'departments',
      talkingPoints: [
        'Detailed spend breakdown by department and country.',
        '100% mathematical consistency with total global payroll.',
        'Currency normalization across USD, GBP, EUR, INR, SGD, JPY, AUD, CAD, BRL, PLN.',
      ],
    },
    {
      title: 'Job 4: Check Career Level Pay Distribution (Boxplots)',
      job: 'Job 4: Level Pay Distribution',
      icon: TrendingUp,
      color: 'from-purple-600 to-zinc-900',
      description:
        'Truptiranjan reviews career levels L1 to L7 using interactive Box-and-Whisker distribution plots showing Min, 25th percentile (Q1), Median (Q2), 75th percentile (Q3), and Max whiskers against official market pay bands.',
      actionLabel: 'View Level Boxplot Analytics (Job 4)',
      tabTarget: 'paybands',
      talkingPoints: [
        'Visual boxplot representation of actual salary distribution vs market bands.',
        'Gender pay equity compa-ratio indices across levels.',
        'Click any career level to filter matching employees instantly.',
      ],
    },
    {
      title: 'Job 5: Find Out-of-Band & Anomaly Employees',
      job: 'Job 5: Anomaly Radar',
      icon: AlertTriangle,
      color: 'from-rose-600 to-zinc-900',
      description:
        'Truptiranjan isolates underpaid flight risks (<0.80 compa-ratio), overpaid red-circled staff (>1.20 compa-ratio), and top performers with low pay, and executes 1-click batch remedies.',
      actionLabel: 'Open Anomaly Radar (Job 5)',
      tabTarget: 'anomalies',
      talkingPoints: [
        'Dedicated anomaly radar isolates compensation outliers.',
        'One-click batch remediation automatically elevates underpaid staff to band min.',
        'Direct link to single-employee adjustment drawer.',
      ],
    },
    {
      title: 'Architecture, PRD & Engineering Trade-Offs',
      job: 'Artifacts & PRD',
      icon: Layers,
      color: 'from-zinc-700 to-zinc-900',
      description:
        'Explore the full 1-page Product Requirements Document (PRD), Architecture Decision Records (ADR-001 to ADR-005), 10,000 seeding performance benchmarks, and live deterministic unit test runner.',
      actionLabel: 'View PRD & Architecture Documentation',
      tabTarget: 'artifacts',
      talkingPoints: [
        'ADR-001 to ADR-005 documenting all major architectural decisions.',
        '8 deterministic unit tests executing in < 50ms with 100% pass rate.',
        'Clear documentation of deliberate non-goals and trade-offs.',
      ],
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleJump = () => {
    onNavigateToJob(step.tabTarget);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header Bar */}
        <div className={`p-5 bg-gradient-to-r ${step.color} text-white flex items-center justify-between border-b border-zinc-800`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-black/30 backdrop-blur border border-white/10">
              <StepIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                Step {currentStep + 1} of {steps.length} • {step.job}
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">{step.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-zinc-200">
          <p className="text-sm text-zinc-300 leading-relaxed">{step.description}</p>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Key Demonstration Highlights:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-300">
              {step.talkingPoints.map((tp, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{tp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  i === currentStep
                    ? 'bg-indigo-500 w-6'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleJump}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold hover:bg-zinc-700 transition cursor-pointer"
            >
              <span>{step.actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1 px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-sm transition cursor-pointer"
            >
              <span>{currentStep === steps.length - 1 ? 'Finish Tour' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
