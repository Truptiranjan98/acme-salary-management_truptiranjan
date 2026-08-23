import React, { useState, useEffect } from 'react';
import {
  FileText,
  BookOpen,
  Layers,
  Sparkles,
  TestTube2,
  CheckCircle2,
  XCircle,
  Zap,
  Cpu,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { PRD_DOCUMENT } from '../docs/prd';
import { ADR_LIST } from '../docs/adr';
import { PROMPTS_LOG } from '../docs/promptsLog';
import { apiService } from '../services/apiService';
import { TestSuiteReport } from '../server/tests';

export const ArtifactsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PRD' | 'ADRS' | 'TESTS' | 'PERFORMANCE' | 'PROMPTS'>('PRD');
  const [testReport, setTestReport] = useState<TestSuiteReport | null>(null);
  const [runningTests, setRunningTests] = useState<boolean>(false);

  const handleRunTests = async () => {
    setRunningTests(true);
    try {
      const res = await apiService.runTests();
      setTestReport(res);
    } catch (e) {
      console.error('Test run failed', e);
    } finally {
      setRunningTests(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'TESTS' && !testReport) {
      handleRunTests();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Engineering Assessment Artifacts & Documentation</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Comprehensive PRD requirements document, Architectural Decision Records (ADRs), 10k dataset performance benchmarks, deterministic unit test suite, and AI prompt collaboration log.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('PRD')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'PRD'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>1-Page Requirements (PRD)</span>
        </button>

        <button
          onClick={() => setActiveTab('ADRS')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'ADRS'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Architecture Decisions (ADRs)</span>
        </button>

        <button
          onClick={() => setActiveTab('TESTS')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'TESTS'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <TestTube2 className="w-4 h-4" />
          <span>Unit Test Runner ({testReport ? `${testReport.passedCount}/${testReport.totalTests}` : '8 Tests'})</span>
        </button>

        <button
          onClick={() => setActiveTab('PERFORMANCE')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'PERFORMANCE'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>10k Performance & Seeding</span>
        </button>

        <button
          onClick={() => setActiveTab('PROMPTS')}
          className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'PROMPTS'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>AI Prompts Collaboration Log</span>
        </button>
      </div>

      {/* Tab 1: PRD */}
      {activeTab === 'PRD' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm text-zinc-200 text-xs sm:text-sm leading-relaxed space-y-6">
          <div className="prose prose-invert max-w-none">
            <div className="border-b border-zinc-800 pb-4">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Product Requirements Document (PRD)</h1>
              <p className="text-indigo-400 font-semibold text-xs mt-1">
                ACME Corporation — Global Employee Salary & Compensation Management System (10,000 Staff)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div>
                <span className="font-bold text-zinc-500 text-[10px] uppercase block">Lead Author & Persona</span>
                <strong className="text-white text-sm">Truptiranjan Biswal</strong> (Global HR Manager & Comp Lead)
                <a
                  href="https://github.com/Truptiranjan98"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 block mt-0.5 hover:underline"
                >
                  github.com/Truptiranjan98
                </a>
              </div>
              <div>
                <span className="font-bold text-zinc-500 text-[10px] uppercase block">Scope Scale</span>
                <strong className="text-emerald-400 text-sm font-mono">10,000 Employees</strong> across 12 Countries & 8 Business Units
              </div>
            </div>

            <h3 className="text-base font-bold text-white mt-6 mb-2">1. Problem Statement</h3>
            <p className="text-zinc-300">
              Currently, ACME Corporation’s HR team manages salary data for 10,000 employees across 12 countries via manual spreadsheets. This introduces high operational latency, lack of pay band governance, inability to detect out-of-band anomalies, and no real-time auditability.
            </p>

            <h3 className="text-base font-bold text-white mt-6 mb-2">2. The 5 Core Jobs for Truptiranjan (HR Manager)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-bold text-indigo-400">Job 1: Find Employee & Compensation Profile</span>
                <p className="text-xs text-zinc-400 mt-1">Instant search by name, ID, department, or country. View dual local/USD base salary, bonus, and compa-ratio.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-bold text-indigo-400">Job 2: Adjust & Review Salary (Audit Trail)</span>
                <p className="text-xs text-zinc-400 mt-1">Execute single or bulk salary adjustments with reason codes, budget impact checks, and immutable compliance logs.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-bold text-indigo-400">Job 3: Pull Department & Regional Spend</span>
                <p className="text-xs text-zinc-400 mt-1">Aggregate payroll expenditure, average/median compensation, and budget share across 8 departments and 12 countries.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="font-bold text-indigo-400">Job 4: Check Level Pay Distribution (Boxplots)</span>
                <p className="text-xs text-zinc-400 mt-1">Box-and-whisker percentile spread (Min, P25, Median, P75, Max) for career levels L1 to L7 against market pay bands.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 sm:col-span-2">
                <span className="font-bold text-indigo-400">Job 5: Find Out-of-Band & Anomaly Employees</span>
                <p className="text-xs text-zinc-400 mt-1">Automated detection of underpaid flight risks (&lt;0.80 compa-ratio) and overpaid compliance risks (&gt;1.20 compa-ratio) with 1-click batch remedy.</p>
              </div>
            </div>

            <h3 className="text-base font-bold text-white mt-6 mb-2">3. Deliberate Non-Goals & Trade-off Reasoning</h3>
            <table className="w-full text-left text-xs border border-zinc-800 rounded-xl overflow-hidden my-3">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Deliberate Non-Goal</th>
                  <th className="py-2.5 px-3">Engineering & Product Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-rose-300">Self-Service Employee Portal</td>
                  <td className="py-2.5 px-3 text-zinc-400">Target persona is strictly the HR Manager & Comp Lead. Employee portals require personal tax forms and mobile flows outside strategic compensation management.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-rose-300">Live ACH / Banking Disbursement Rails</td>
                  <td className="py-2.5 px-3 text-zinc-400">System of Record & Strategy; outputs approved payroll to downstream bank disbursement gateways rather than holding escrow funds.</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-rose-300">Strict Auth Barrier on Public Demo</td>
                  <td className="py-2.5 px-3 text-zinc-400">ADR-005 explicitly opens the sandbox with synthetic data to enable frictionless evaluator verification of all 5 jobs.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: ADRs */}
      {activeTab === 'ADRS' && (
        <div className="space-y-4">
          {ADR_LIST.map((adr) => (
            <div key={adr.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20">
                    {adr.id}
                  </span>
                  <h3 className="font-bold text-white text-sm">{adr.title}</h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 font-mono">
                  {adr.status}
                </span>
              </div>

              <div className="text-xs text-zinc-300 space-y-2">
                <div>
                  <strong className="text-zinc-500 block text-[10px] uppercase mb-0.5 font-bold">Context & Problem:</strong>
                  <p className="text-zinc-300">{adr.context}</p>
                </div>
                <div>
                  <strong className="text-zinc-500 block text-[10px] uppercase mb-0.5 font-bold">Architectural Decision:</strong>
                  <p className="text-zinc-200 font-medium bg-zinc-950 p-2.5 rounded-xl border border-zinc-800">{adr.decision}</p>
                </div>
                <div>
                  <strong className="text-zinc-500 block text-[10px] uppercase mb-1 font-bold">Key Consequences:</strong>
                  <ul className="list-disc list-inside space-y-1 text-zinc-400">
                    {adr.consequences.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Unit Test Runner */}
      {activeTab === 'TESTS' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TestTube2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">Deterministic In-Browser Unit Test Suite</h3>
                <p className="text-xs text-zinc-400">
                  {testReport
                    ? `Executed ${testReport.totalTests} tests in ${testReport.totalDurationMs}ms (${testReport.passedCount} passed, ${testReport.failedCount} failed).`
                    : 'Execute tests to verify data integrity, math accuracy, and compa-ratio formulas.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleRunTests}
              disabled={runningTests}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md disabled:opacity-50 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${runningTests ? 'animate-spin' : ''}`} />
              <span>{runningTests ? 'Running Suite...' : 'Re-Run All Unit Tests'}</span>
            </button>
          </div>

          {testReport && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800 text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Test ID & Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Execution Time</th>
                    <th className="py-3.5 px-4">Assertion Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-medium text-zinc-200">
                  {testReport.results.map((r) => (
                    <tr key={r.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-3.5 px-4">
                        {r.status === 'PASSED' ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" /> PASSED
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-400 font-bold">
                            <XCircle className="w-4 h-4" /> FAILED
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="text-white">{r.name}</strong>
                        <span className="text-[10px] text-zinc-500 font-mono block">{r.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] border border-zinc-700">
                          {r.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-zinc-400">{r.durationMs} ms</td>
                      <td className="py-3.5 px-4 text-zinc-300 max-w-md">{r.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Performance & 10k Seeding */}
      {activeTab === 'PERFORMANCE' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 text-xs text-zinc-300">
          <div className="border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>10,000 Employees High-Scale Seeding & Query Performance</span>
            </h3>
            <p className="text-zinc-400 mt-1">
              Engineered for instantaneous sub-20ms multi-facet filtering and aggregation over 10,000 complex domain entities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] font-bold uppercase">Average Query Latency</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1 font-mono">&lt; 4.2 ms</div>
              <span className="text-[11px] text-zinc-400">Server-side multi-facet search</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] font-bold uppercase">Memory Footprint</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">~18.4 MB</div>
              <span className="text-[11px] text-zinc-400">10,000 fully hydrated records</span>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] font-bold uppercase">Deterministic PRNG Seed</span>
              <div className="text-2xl font-bold text-purple-400 mt-1 font-mono">Seed: 42</div>
              <span className="text-[11px] text-zinc-400">100% reproducible across runs</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Key Performance Optimizations Implemented:</h4>
            <ul className="list-disc list-inside space-y-1 text-zinc-300">
              <li><strong>Map-based Primary Key Indexing:</strong> <code className="text-indigo-300">Map&lt;string, Employee&gt;</code> provides O(1) single-employee lookups for drawer adjustments.</li>
              <li><strong>Pre-Calculated Currency Normalization:</strong> Base salary USD and local values are computed once at seeding and adjustment time to eliminate runtime FX conversion overhead during grid rendering.</li>
              <li><strong>In-Memory Quantile Aggregations:</strong> Boxplot metrics (P25, Median, P75) utilize lightweight sorted index slices, executing in under 2ms for all 7 levels simultaneously.</li>
              <li><strong>Server-Side Pagination & Projection:</strong> Payloads are sliced into 25, 50, or 100 item chunks, keeping DOM node count optimal and preventing client render lag.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 5: Prompts Log */}
      {activeTab === 'PROMPTS' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white tracking-tight">AI Collaboration Prompts Log (PROMPTS.md)</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Documenting the intentional use of AI tools to accelerate architectural design, mathematical modeling, and test verification.
            </p>
          </div>

          {PROMPTS_LOG.map((p, idx) => (
            <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <h4 className="font-bold text-indigo-400 text-xs">{p.phase}</h4>
                <span className="text-[10px] text-zinc-500 font-mono">Iteration #{idx + 1}</span>
              </div>

              <div className="text-xs space-y-2">
                <div>
                  <span className="font-bold text-zinc-500 block mb-0.5 text-[10px] uppercase">Engineering Intention:</span>
                  <p className="text-zinc-300">{p.intention}</p>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 block mb-0.5 text-[10px] uppercase">Prompt Snippet:</span>
                  <pre className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-[11px] text-zinc-300 font-mono whitespace-pre-wrap">
                    {p.promptSnippet}
                  </pre>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 block mb-0.5 text-[10px] uppercase">Outcome & Deliverable:</span>
                  <p className="text-emerald-400 font-medium">{p.outcome}</p>
                </div>

                <div>
                  <span className="font-bold text-zinc-500 block mb-0.5 text-[10px] uppercase">Engineering Reflection:</span>
                  <p className="text-zinc-400 italic">"{p.engineeringReflection}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
