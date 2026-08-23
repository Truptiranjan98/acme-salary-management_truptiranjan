import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  UserCheck,
  Calendar,
} from 'lucide-react';
import { AuditLog } from '../types/salary';
import { apiService } from '../services/apiService';
import { formatCurrency, formatUSD, getCountryFlag, getLevelBadge } from '../utils/formatters';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const data = await apiService.getAuditLogs(200);
        setLogs(data);
      } catch (e) {
        console.error('Error fetching audit logs', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Immutable Compensation Audit Trail & Governance</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Complete compliance event log tracking every base salary modification, reason code, financial delta, and approving authority.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit logs by name, ID..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider font-semibold border-b border-zinc-800 text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Dept & Level</th>
                <th className="py-3.5 px-4">Reason Code</th>
                <th className="py-3.5 px-4 text-right">Previous Salary</th>
                <th className="py-3.5 px-4 text-right">New Salary</th>
                <th className="py-3.5 px-4 text-right">Delta (USD)</th>
                <th className="py-3.5 px-4">Approver</th>
                <th className="py-3.5 px-4">Justification Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 font-medium text-zinc-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-zinc-500">
                    No audit records recorded yet in this session. Perform a salary adjustment to generate an immutable entry.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-800/40 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-zinc-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-white block">{log.employeeName}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">{log.employeeId}</span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-zinc-300">{log.department}</span>
                      <span className={`ml-2 px-1.5 py-0.2 rounded text-[10px] font-bold border ${getLevelBadge(log.level)}`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20 text-[10px]">
                        {log.reason.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap text-zinc-400 font-mono">
                      {formatCurrency(log.previousSalaryLocal, log.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-white font-mono">
                      {formatCurrency(log.newSalaryLocal, log.currency)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold font-mono">
                      <span className={log.deltaUSD >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {log.deltaUSD >= 0 ? '+' : ''}{formatUSD(log.deltaUSD)} (+{log.percentageChange}%)
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-zinc-300">
                      {log.actor}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400 max-w-xs truncate" title={log.notes}>
                      {log.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
