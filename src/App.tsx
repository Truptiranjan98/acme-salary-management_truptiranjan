import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewCards } from './components/OverviewCards';
import { EmployeeRegistry } from './components/EmployeeRegistry';
import { SalaryAdjuster } from './components/SalaryAdjuster';
import { DepartmentAnalytics } from './components/DepartmentAnalytics';
import { PayBandsDistribution } from './components/PayBandsDistribution';
import { AnomalyRadar } from './components/AnomalyRadar';
import { MeritSimulator } from './components/MeritSimulator';
import { AuditLogsView } from './components/AuditLogsView';
import { ArtifactsView } from './components/ArtifactsView';
import { GuidedDemoModal } from './components/GuidedDemoModal';
import { EmployeeHistoryModal } from './components/EmployeeHistoryModal';
import { apiService } from './services/apiService';
import { Employee, OverviewMetrics } from './types/salary';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('directory');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'LOCAL'>('USD');
  const [overviewMetrics, setOverviewMetrics] = useState<OverviewMetrics | null>(null);
  
  // Selection & Modal States
  const [selectedEmployeeForAdjust, setSelectedEmployeeForAdjust] = useState<Employee | null>(null);
  const [selectedEmployeeForHistory, setSelectedEmployeeForHistory] = useState<Employee | null>(null);
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);
  const [isGuidedDemoOpen, setIsGuidedDemoOpen] = useState<boolean>(false);
  const [testPassCount, setTestPassCount] = useState<number | undefined>(undefined);

  // Fetch overview metrics
  const refreshMetrics = async () => {
    try {
      const data = await apiService.getOverviewMetrics();
      setOverviewMetrics(data);
    } catch (e) {
      console.error('Error loading metrics', e);
    }
  };

  // Run initial test count check
  useEffect(() => {
    refreshMetrics();
    apiService.runTests().then((report) => {
      setTestPassCount(report.passedCount);
    });
  }, []);

  const handleSelectEmployeeForAdjust = (emp: Employee) => {
    setSelectedEmployeeForAdjust(emp);
    setSelectedBulkIds([]);
    setActiveTab('adjuster');
  };

  const handleBulkAdjustSelected = (ids: string[]) => {
    setSelectedBulkIds(ids);
    setSelectedEmployeeForAdjust(null);
    setActiveTab('adjuster');
  };

  const handleEmployeeUpdated = (updatedEmp: Employee) => {
    refreshMetrics();
  };

  const handleScenarioApplied = () => {
    refreshMetrics();
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all 10,000 employee records to original baseline seed?')) {
      await apiService.resetDatabase(10000);
      refreshMetrics();
      setActiveTab('directory');
    }
  };

  const handleNavigateFromDemo = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Bento-styled Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currencyMode={currencyMode}
        setCurrencyMode={setCurrencyMode}
        onOpenGuidedDemo={() => setIsGuidedDemoOpen(true)}
        onOpenDocs={() => setActiveTab('artifacts')}
        onOpenTests={() => setActiveTab('artifacts')}
        onResetData={handleResetData}
        outOfBandCount={overviewMetrics?.outOfBandCount || 0}
        testPassCount={testPassCount}
        totalHeadcount={overviewMetrics?.totalHeadcount || 10000}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Executive Bento KPI Overview (Visible across analytical views) */}
        {activeTab !== 'artifacts' && (
          <OverviewCards
            metrics={overviewMetrics}
            onNavigateToAnomalies={() => setActiveTab('anomalies')}
            onNavigateToSimulator={() => setActiveTab('simulator')}
            onNavigateToPayBands={() => setActiveTab('paybands')}
            onNavigateToRegistry={() => setActiveTab('directory')}
          />
        )}

        {/* View Routing */}
        <div className="pt-1">
          {/* Tab 1: Employee Registry */}
          {activeTab === 'directory' && (
            <EmployeeRegistry
              currencyMode={currencyMode}
              onSelectEmployeeForAdjust={handleSelectEmployeeForAdjust}
              onSelectEmployeeForHistory={(emp) => setSelectedEmployeeForHistory(emp)}
              onBulkAdjustSelected={handleBulkAdjustSelected}
              selectedIds={selectedBulkIds}
              setSelectedIds={setSelectedBulkIds}
            />
          )}

          {/* Tab 2: Salary Review & Adjuster */}
          {activeTab === 'adjuster' && (
            <SalaryAdjuster
              selectedEmployee={selectedEmployeeForAdjust}
              onEmployeeUpdated={handleEmployeeUpdated}
              bulkSelectedIds={selectedBulkIds}
              onClearBulk={() => setSelectedBulkIds([])}
              currencyMode={currencyMode}
            />
          )}

          {/* Tab 3: Department & Regional Spend Intelligence */}
          {activeTab === 'departments' && (
            <DepartmentAnalytics
              onFilterByDepartment={(dept) => {
                setActiveTab('directory');
              }}
              onFilterByCountry={(country) => {
                setActiveTab('directory');
              }}
            />
          )}

          {/* Tab 4: Pay Bands & Level Distributions */}
          {activeTab === 'paybands' && (
            <PayBandsDistribution
              onFilterByLevel={(lvl) => {
                setActiveTab('directory');
              }}
            />
          )}

          {/* Tab 5: Anomaly Radar */}
          {activeTab === 'anomalies' && (
            <AnomalyRadar
              onSelectEmployeeForAdjust={handleSelectEmployeeForAdjust}
              currencyMode={currencyMode}
            />
          )}

          {/* Tab 6: Merit Simulator & Modeler */}
          {activeTab === 'simulator' && (
            <MeritSimulator onScenarioApplied={handleScenarioApplied} />
          )}

          {/* Tab 7: Audit Trail */}
          {activeTab === 'audit' && <AuditLogsView />}

          {/* Tab 8: PRD, ADRs, Tests, & Artifacts */}
          {activeTab === 'artifacts' && <ArtifactsView />}
        </div>
      </main>

      {/* Bento-styled Minimal Footer */}
      <footer className="mt-8 border-t border-zinc-800 bg-[#09090b] py-4 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-widest font-medium">
          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-semibold">System Status: All Nodes Operational</span>
            <span>•</span>
            <span>Refreshed: Real-time Live Sync</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>Compliance: SOC2 / GDPR / CCPA</span>
            <span>•</span>
            <button onClick={() => setIsGuidedDemoOpen(true)} className="text-indigo-400 hover:text-indigo-300 transition uppercase font-bold">
              Demo Tour
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('artifacts')} className="text-indigo-400 hover:text-indigo-300 transition uppercase font-bold">
              PRD & ADRs
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Guided Walkthrough Modal */}
      <GuidedDemoModal
        isOpen={isGuidedDemoOpen}
        onClose={() => setIsGuidedDemoOpen(false)}
        onNavigateToJob={handleNavigateFromDemo}
      />

      {/* Historical Salary Modal */}
      <EmployeeHistoryModal
        employee={selectedEmployeeForHistory}
        onClose={() => setSelectedEmployeeForHistory(null)}
      />
    </div>
  );
}
