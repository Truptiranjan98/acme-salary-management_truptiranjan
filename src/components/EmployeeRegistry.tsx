import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckSquare,
  Square,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  UserCheck,
  Star,
  ExternalLink,
  Edit3,
  History,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  CareerLevel,
  CountryCode,
  Department,
  Employee,
  EmployeeQueryParams,
  PaginatedResult,
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
import { COUNTRIES, DEPARTMENTS, CAREER_LEVELS } from '../server/seedData';

interface EmployeeRegistryProps {
  currencyMode: 'USD' | 'LOCAL';
  onSelectEmployeeForAdjust: (employee: Employee) => void;
  onSelectEmployeeForHistory: (employee: Employee) => void;
  onBulkAdjustSelected: (selectedIds: string[]) => void;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const EmployeeRegistry: React.FC<EmployeeRegistryProps> = ({
  currencyMode,
  onSelectEmployeeForAdjust,
  onSelectEmployeeForHistory,
  onBulkAdjustSelected,
  selectedIds,
  setSelectedIds,
}) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [bandStatusFilter, setBandStatusFilter] = useState<string>('ALL');
  const [perfRatingFilter, setPerfRatingFilter] = useState<string>('ALL');
  const [anomalyFilter, setAnomalyFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<EmployeeQueryParams['sortBy']>('baseSalaryUSD');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res: PaginatedResult<Employee> = await apiService.getEmployees({
        page,
        pageSize,
        search: searchTerm,
        department: departmentFilter,
        country: countryFilter,
        level: levelFilter,
        bandStatus: bandStatusFilter,
        performanceRating: perfRatingFilter,
        anomalyType: (anomalyFilter as any) || undefined,
        sortBy,
        sortOrder,
      });
      setEmployees(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (e) {
      console.error('Error fetching employees', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [
    page,
    pageSize,
    searchTerm,
    departmentFilter,
    countryFilter,
    levelFilter,
    bandStatusFilter,
    perfRatingFilter,
    anomalyFilter,
    sortBy,
    sortOrder,
  ]);

  const handleSort = (field: EmployeeQueryParams['sortBy']) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAllOnPage = () => {
    const pageIds = employees.map((e) => e.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      const newSet = new Set([...selectedIds, ...pageIds]);
      setSelectedIds(Array.from(newSet));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setDepartmentFilter('ALL');
    setCountryFilter('ALL');
    setLevelFilter('ALL');
    setBandStatusFilter('ALL');
    setPerfRatingFilter('ALL');
    setAnomalyFilter('');
    setPage(1);
  };

  const exportToCSV = () => {
    if (employees.length === 0) return;
    const headers = [
      'Employee ID',
      'Full Name',
      'Email',
      'Department',
      'Role',
      'Level',
      'Country',
      'City',
      'Currency',
      'Base Salary (Local)',
      'Base Salary (USD)',
      'Bonus %',
      'Total Comp (USD)',
      'Compa Ratio',
      'Band Status',
      'Performance Rating',
      'Tenure (Years)',
    ];

    const rows = employees.map((e) => [
      e.id,
      `"${e.fullName}"`,
      e.email,
      e.department,
      `"${e.role}"`,
      e.level,
      e.country,
      `"${e.city}"`,
      e.currency,
      e.baseSalary,
      e.baseSalaryUSD,
      e.bonusPercentage,
      e.totalCompUSD,
      e.compaRatio,
      e.bandStatus,
      e.performanceRating,
      e.tenureYears,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ACME_Salaries_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAllPageSelected = employees.length > 0 && employees.every((e) => selectedIds.includes(e.id));

  return (
    <div className="space-y-4">
      {/* Bento Grid Top Filter Box */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
        {/* Search Bar + Actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              placeholder="Search 10,000+ employees by name, ID (ACM-00042), email, role, or city..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                showAdvancedFilters || departmentFilter !== 'ALL' || countryFilter !== 'ALL' || levelFilter !== 'ALL'
                  ? 'bg-indigo-600/10 text-indigo-300 border-indigo-500/40'
                  : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
              {(departmentFilter !== 'ALL' || countryFilter !== 'ALL' || levelFilter !== 'ALL' || bandStatusFilter !== 'ALL') && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </button>

            {/* CSV Export */}
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 text-xs font-semibold transition cursor-pointer"
              title="Export visible records to CSV"
            >
              <Download className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Presets (Bento Action Chips) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs pt-1">
          <span className="text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
            Presets:
          </span>
          <button
            onClick={resetAllFilters}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition whitespace-nowrap cursor-pointer ${
              departmentFilter === 'ALL' && countryFilter === 'ALL' && anomalyFilter === '' && levelFilter === 'ALL'
                ? 'bg-zinc-800 text-white border-zinc-700 font-semibold'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            All 10,000 Employees
          </button>
          <button
            onClick={() => {
              resetAllFilters();
              setAnomalyFilter('UNDERPAID');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition whitespace-nowrap cursor-pointer ${
              anomalyFilter === 'UNDERPAID'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 font-semibold'
                : 'bg-zinc-950 text-rose-400/80 border-zinc-800 hover:bg-rose-500/10'
            }`}
          >
            🚨 Underpaid (&lt;0.80 Compa)
          </button>
          <button
            onClick={() => {
              resetAllFilters();
              setAnomalyFilter('HIGH_PERF_UNDERPAID');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition whitespace-nowrap cursor-pointer ${
              anomalyFilter === 'HIGH_PERF_UNDERPAID'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                : 'bg-zinc-950 text-amber-400/80 border-zinc-800 hover:bg-amber-500/10'
            }`}
          >
            ⭐ Top Performers Low Compa
          </button>
          <button
            onClick={() => {
              resetAllFilters();
              setAnomalyFilter('OVERPAID');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition whitespace-nowrap cursor-pointer ${
              anomalyFilter === 'OVERPAID'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-semibold'
                : 'bg-zinc-950 text-purple-400/80 border-zinc-800 hover:bg-purple-500/10'
            }`}
          >
            👑 Above Band (&gt;1.20 Compa)
          </button>
          <button
            onClick={() => {
              resetAllFilters();
              setDepartmentFilter('Engineering');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition whitespace-nowrap cursor-pointer ${
              departmentFilter === 'Engineering'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 font-semibold'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            💻 Engineering
          </button>
        </div>

        {/* Expandable Advanced Multi-Facet Filter Bar */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            {/* Department */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Department</label>
              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Departments (8)</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Country / Region */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Country / Region</label>
              <select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Countries (12)</option>
                {Object.values(COUNTRIES).map((c) => (
                  <option key={c.code} value={c.code}>
                    {getCountryFlag(c.code)} {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>

            {/* Career Level */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Career Level</label>
              <select
                value={levelFilter}
                onChange={(e) => {
                  setLevelFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Levels (L1-L7)</option>
                {CAREER_LEVELS.map((lvl) => (
                  <option key={lvl.level} value={lvl.level}>
                    {lvl.level} - {lvl.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Band Status */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Band Compliance</label>
              <select
                value={bandStatusFilter}
                onChange={(e) => {
                  setBandStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Band Statuses</option>
                <option value="IN_BAND">In Band (Healthy)</option>
                <option value="BELOW_BAND">Below Band (Underpaid)</option>
                <option value="ABOVE_BAND">Above Band (Overpaid)</option>
              </select>
            </div>

            {/* Performance Rating */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">Performance Rating</label>
              <select
                value={perfRatingFilter}
                onChange={(e) => {
                  setPerfRatingFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-1.5 px-2.5 text-zinc-200 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ALL">All Ratings (1-5★)</option>
                <option value="5">5★ - Exceptional (Top 6%)</option>
                <option value="4">4★ - Exceeds (18%)</option>
                <option value="3">3★ - Strong Performer (60%)</option>
                <option value="2">2★ - Developing (12%)</option>
                <option value="1">1★ - Needs Improvement (4%)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Action Sticky Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-950/90 border border-indigo-500/50 rounded-2xl p-3 px-4 flex items-center justify-between shadow-2xl backdrop-blur">
          <div className="flex items-center space-x-3 text-xs text-indigo-200 font-medium">
            <span className="bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
              {selectedIds.length}
            </span>
            <span>Employees selected for compensation action</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onBulkAdjustSelected(selectedIds)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Bulk Adjust Salaries</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 cursor-pointer"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Main Employee Registry Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-3 w-10 text-center">
                  <button onClick={handleSelectAllOnPage} className="text-zinc-400 hover:text-white cursor-pointer">
                    {isAllPageSelected ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('fullName')}>
                  <div className="flex items-center space-x-1">
                    <span>Employee</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('department')}>
                  <div className="flex items-center space-x-1">
                    <span>Department & Role</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('country')}>
                  <div className="flex items-center space-x-1">
                    <span>Location</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('level')}>
                  <div className="flex items-center space-x-1">
                    <span>Level</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white" onClick={() => handleSort('performanceRating')}>
                  <div className="flex items-center space-x-1">
                    <span>Rating</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('baseSalaryUSD')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Base Salary</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 cursor-pointer hover:text-white text-right" onClick={() => handleSort('compaRatio')}>
                  <div className="flex items-center justify-end space-x-1">
                    <span>Compa-Ratio</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-3 text-center">Band Status</th>
                <th className="py-3.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80 font-medium text-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-zinc-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    Querying 10,000 employee registry...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-zinc-400">
                    No employees matching your criteria. Try adjusting your filters.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const isSelected = selectedIds.includes(emp.id);
                  const compaMeta = getCompaRatioColor(emp.compaRatio);
                  const bandMeta = getBandStatusBadge(emp.bandStatus);

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-zinc-800/40 transition-colors ${
                        isSelected ? 'bg-indigo-950/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => toggleSelectOne(emp.id)}
                          className="text-zinc-500 hover:text-indigo-400 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Employee Info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2.5">
                          <img
                            src={emp.avatar}
                            alt={emp.fullName}
                            className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex-shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{emp.fullName}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                                {emp.id}
                              </span>
                            </div>
                            <div className="text-[11px] text-zinc-500">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Department & Role */}
                      <td className="py-3 px-3">
                        <div className="font-semibold text-zinc-200">{emp.role}</div>
                        <div className="text-[11px] text-zinc-500">{emp.department}</div>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-sm">{getCountryFlag(emp.country)}</span>
                          <span className="text-zinc-200">{emp.city}</span>
                        </div>
                        <div className="text-[10px] text-zinc-500">{emp.countryName}</div>
                      </td>

                      {/* Level */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${getLevelBadge(emp.level)}`}>
                          {emp.level}
                        </span>
                      </td>

                      {/* Performance Rating */}
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= emp.performanceRating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                          {emp.tenureYears} yrs tenure
                        </div>
                      </td>

                      {/* Base Salary */}
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        {currencyMode === 'USD' ? (
                          <>
                            <div className="font-bold text-white text-sm font-mono">
                              {formatUSD(emp.baseSalaryUSD)}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              {formatCurrency(emp.baseSalary, emp.currency)} local
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="font-bold text-white text-sm font-mono">
                              {formatCurrency(emp.baseSalary, emp.currency)}
                            </div>
                            <div className="text-[10px] text-zinc-500 font-mono">
                              ≈ {formatUSD(emp.baseSalaryUSD)} USD
                            </div>
                          </>
                        )}
                      </td>

                      {/* Compa Ratio */}
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-xs font-mono border ${compaMeta.badgeBg} ${compaMeta.borderColor}`}
                          title={`Compa-Ratio = Base Salary / Band Midpoint (${(emp.compaRatio * 100).toFixed(0)}%)`}
                        >
                          {emp.compaRatio.toFixed(2)}x
                        </span>
                      </td>

                      {/* Band Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${bandMeta.bg} ${bandMeta.text} ${bandMeta.border}`}>
                          {bandMeta.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onSelectEmployeeForAdjust(emp)}
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-indigo-600 hover:text-white border border-zinc-700 transition cursor-pointer"
                            title="Adjust Base Salary & Reason Code"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectEmployeeForHistory(emp)}
                            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition cursor-pointer"
                            title="View Historical Compensation Timeline"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-zinc-950 px-4 py-3 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div className="flex items-center space-x-2">
            <span>
              Showing <span className="text-zinc-200 font-semibold">{total === 0 ? 0 : (page - 1) * pageSize + 1}</span> to{' '}
              <span className="text-zinc-200 font-semibold">{Math.min(total, page * pageSize)}</span> of{' '}
              <span className="text-zinc-200 font-semibold">{total.toLocaleString()}</span> employees
            </span>

            <div className="flex items-center space-x-1 pl-4 border-l border-zinc-800">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setPage(1);
                }}
                className="bg-zinc-900 border border-zinc-800 rounded px-2 py-0.5 text-zinc-300 focus:outline-none"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-zinc-300">
              Page {page} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
