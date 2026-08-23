import React from 'react';
import { X, History, Calendar, DollarSign, UserCheck, ShieldCheck } from 'lucide-react';
import { Employee } from '../types/salary';
import { formatCurrency, formatUSD, getCountryFlag, getLevelBadge } from '../utils/formatters';

interface EmployeeHistoryModalProps {
  employee: Employee | null;
  onClose: () => void;
}

export const EmployeeHistoryModal: React.FC<EmployeeHistoryModalProps> = ({
  employee,
  onClose,
}) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={employee.avatar}
              alt={employee.fullName}
              className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base tracking-tight">{employee.fullName}</h3>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 font-mono">
                  {employee.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getLevelBadge(employee.level)}`}>
                  {employee.level}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {employee.role} • {employee.department} • {getCountryFlag(employee.country)} {employee.city}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Timeline */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-800 pb-2">
            <span className="font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <History className="w-4 h-4" /> Compensation Progression Timeline
            </span>
            <span className="font-mono">Current: <strong className="text-zinc-200">{formatCurrency(employee.baseSalary, employee.currency)}</strong> ({formatUSD(employee.baseSalaryUSD)})</span>
          </div>

          {employee.salaryHistory.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500">
              No historical salary adjustments recorded yet.
            </div>
          ) : (
            <div className="relative border-l-2 border-zinc-800 ml-4 space-y-6 py-2">
              {employee.salaryHistory.map((item, idx) => (
                <div key={item.id || idx} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-indigo-600 border-2 border-zinc-900 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>

                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">
                        {item.reason.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {item.date}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs bg-zinc-900 p-2 rounded-lg border border-zinc-800 font-mono">
                      <span className="text-zinc-400">
                        {formatCurrency(item.previousSalaryLocal, employee.currency)} → <strong className="text-emerald-400">{formatCurrency(item.newSalaryLocal, employee.currency)}</strong>
                      </span>
                      <span className="font-bold text-indigo-400">
                        +{item.percentageChange}%
                      </span>
                    </div>

                    <p className="text-zinc-300 text-[11px] leading-relaxed">{item.notes}</p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800">
                      <span>Approved by: <strong className="text-zinc-400">{item.approvedBy}</strong></span>
                      <span className="font-mono">USD: {formatUSD(item.newSalaryUSD)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
