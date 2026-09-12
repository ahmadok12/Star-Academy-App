import React, { useState, useMemo } from 'react';
import { Plus, Search, DollarSign, Eye, Calendar, UserCheck, Landmark } from 'lucide-react';
import PaySalaryModal from './PaySalaryModal';
import EditSalaryModal from './EditSalaryModal';
import SalaryDetailModal from './SalaryDetailModal';

export default function TeacherPayrollSection({
  salaries,
  teachers,
  banks,
  onPaySalary,
  onUpdateSalary,
  onDeleteSalary
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [viewingSalary, setViewingSalary] = useState(null);
  const [editingSalary, setEditingSalary] = useState(null);

  const bankMap = useMemo(() => {
    const map = {};
    banks.forEach(b => { map[b.id] = b; });
    return map;
  }, [banks]);

  const filteredSalaries = useMemo(() => {
    return salaries.filter(s => {
      const q = searchTerm.toLowerCase();
      return (
        s.id.toLowerCase().includes(q) ||
        s.teacherName.toLowerCase().includes(q) ||
        s.teacherId.toLowerCase().includes(q) ||
        s.details.toLowerCase().includes(q) ||
        s.date.includes(q)
      );
    });
  }, [salaries, searchTerm]);

  const totalSalariesPaid = useMemo(() => {
    return salaries.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  }, [salaries]);

  return (
    <div className="space-y-3">
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search teacher, salary ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none"
          />
        </div>

        <button
          onClick={() => setIsPayOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Pay Salary</span>
        </button>
      </div>

      {/* Summary line */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>{filteredSalaries.length} {filteredSalaries.length === 1 ? 'disbursement' : 'disbursements'}</span>
        <span>Total Payroll: <strong className="text-purple-700 font-bold">Rs. {totalSalariesPaid.toLocaleString()}</strong></span>
      </div>

      {/* Salaries List */}
      <div className="space-y-2.5">
        {filteredSalaries.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
            <DollarSign className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No salary records found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Pay Salary" to disburse teaching remuneration.</p>
          </div>
        ) : (
          filteredSalaries.map((sal) => {
            const bank = bankMap[sal.bankId];

            return (
              <div
                key={sal.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all flex items-center justify-between gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{sal.teacherName}</h4>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px] font-semibold shrink-0">
                      {sal.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-medium">
                    {bank ? bank.bankName : sal.bankId}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {sal.date} • {sal.details}
                  </p>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <span className="font-black text-xs text-purple-700">
                    Rs. {Number(sal.amount).toLocaleString()}
                  </span>

                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => setViewingSalary(sal)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold transition-colors"
                  >
                    <Eye className="w-3 h-3 text-purple-600" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <PaySalaryModal
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        onPaySalary={onPaySalary}
        salaries={salaries}
        teachers={teachers}
        banks={banks}
      />

      <EditSalaryModal
        isOpen={!!editingSalary}
        onClose={() => setEditingSalary(null)}
        onUpdateSalary={onUpdateSalary}
        salary={editingSalary}
        teachers={teachers}
        banks={banks}
      />

      <SalaryDetailModal
        isOpen={!!viewingSalary}
        onClose={() => setViewingSalary(null)}
        salary={viewingSalary}
        banks={banks}
        teachers={teachers}
        onEdit={(sal) => setEditingSalary(sal)}
        onDelete={onDeleteSalary}
      />
    </div>
  );
}
