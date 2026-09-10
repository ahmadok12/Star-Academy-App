import React, { useState, useEffect } from 'react';
import { X, Calendar, Landmark, FileText, Banknote } from 'lucide-react';

export default function EditSalaryModal({
  isOpen,
  onClose,
  onUpdateSalary,
  salary,
  teachers,
  banks
}) {
  const [date, setDate] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('');
  const [bankId, setBankId] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (salary) {
      setDate(salary.date || '');
      setSalaryAmount(String(salary.amount ?? ''));
      setBankId(salary.bankId || banks[0]?.id || '');
      setDetails(salary.details || '');
      setErrors({});
    }
  }, [salary, banks]);

  if (!isOpen || !salary) return null;

  const validate = () => {
    const errs = {};
    if (!date) errs.date = 'Date is required';
    const amt = Number(salaryAmount);
    if (!salaryAmount || isNaN(amt) || amt <= 0) {
      errs.salaryAmount = 'Enter a valid salary amount';
    }
    if (!details.trim()) errs.details = 'Payment details required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onUpdateSalary({
      ...salary,
      date,
      amount: Number(salaryAmount),
      bankId,
      details: details.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Edit Salary Record</h2>
              <p className="text-[11px] text-purple-100 font-mono font-medium">{salary.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {/* Teacher Readonly Banner */}
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-purple-600 font-bold block uppercase">Faculty Member</span>
              <span className="font-bold text-xs text-purple-950">{salary.teacherName}</span>
            </div>
            <span className="font-mono text-[10px] text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">
              {salary.teacherId}
            </span>
          </div>

          {/* Date */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Disbursement Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl border border-slate-200 font-medium text-xs text-slate-800 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none"
            />
            {errors.date && <p className="text-rose-500 text-[10px] mt-1">{errors.date}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Salary Amount (PKR) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-100 outline-none"
            />
            {errors.salaryAmount && <p className="text-rose-500 text-[10px] mt-1">{errors.salaryAmount}</p>}
          </div>

          {/* Bank */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Paid From Bank <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-100 outline-none"
              >
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} ({b.accountName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Salary Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-purple-100 outline-none"
            />
            {errors.details && <p className="text-rose-500 text-[10px] mt-1">{errors.details}</p>}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md shadow-purple-200 transition-colors"
            >
              Update Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
