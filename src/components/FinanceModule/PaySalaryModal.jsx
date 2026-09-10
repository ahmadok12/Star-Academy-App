import React, { useState, useMemo, useEffect } from 'react';
import { X, UserCheck, Calendar, Landmark, FileText, Search, Check, ShieldCheck, Banknote } from 'lucide-react';
import { generateNextTeacherSalaryId } from '../../utils/storage';

export default function PaySalaryModal({
  isOpen,
  onClose,
  onPaySalary,
  salaries,
  teachers,
  banks
}) {
  const nextId = generateNextTeacherSalaryId(salaries);
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [salaryAmount, setSalaryAmount] = useState('');
  const [bankId, setBankId] = useState('');
  const [details, setDetails] = useState('');

  const [teacherSearch, setTeacherSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setDate(today);
      setSelectedTeacher(null);
      setSalaryAmount('');
      setBankId('');
      setDetails('');
      setTeacherSearch('');
      setIsDropdownOpen(false);
      setErrors({});
    }
  }, [isOpen]);

  const filteredTeachers = useMemo(() => {
    if (!teacherSearch.trim()) return teachers;
    const q = teacherSearch.toLowerCase();
    return teachers.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      (t.department && t.department.toLowerCase().includes(q))
    );
  }, [teachers, teacherSearch]);

  if (!isOpen) return null;

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setSalaryAmount(teacher.salary || '');
    setIsDropdownOpen(false);
    setTeacherSearch('');
  };

  const validate = () => {
    const errs = {};
    if (!date) errs.date = 'Date is required';
    if (!selectedTeacher) errs.teacher = 'Select a faculty teacher';
    if (!bankId) errs.bankId = 'Select a payment account';
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

    onPaySalary({
      id: nextId,
      date,
      teacherId: selectedTeacher.id,
      teacherName: selectedTeacher.name,
      amount: Number(salaryAmount),
      bankId,
      details: details.trim(),
      createdAt: new Date().toISOString()
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
              <h2 className="text-base font-black tracking-tight leading-tight">Pay Teacher Salary</h2>
              <p className="text-[11px] text-purple-100 font-medium">Payroll ID: {nextId}</p>
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
          {/* ID & Date Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100">
              <span className="text-[10px] text-purple-600 font-bold block uppercase">Salary Voucher</span>
              <span className="font-mono font-bold text-xs text-purple-950">{nextId}</span>
            </div>

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
            </div>
          </div>

          {/* Searchable Selectable Dropdown of Teacher Name */}
          <div className="relative">
            <label className="block font-bold text-slate-800 mb-1">
              Select Teacher <span className="text-rose-500">*</span>
            </label>

            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                isDropdownOpen ? 'border-purple-500 ring-2 ring-purple-100' : 'border-slate-200 hover:border-slate-300'
              } ${errors.teacher ? 'border-rose-400 bg-rose-50/50' : 'bg-white'}`}
            >
              {selectedTeacher ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                    {selectedTeacher.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">{selectedTeacher.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {selectedTeacher.id} • Base Salary: Rs. {Number(selectedTeacher.salary || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-slate-400">Search & select teacher...</span>
              )}
              <span className="text-[10px] font-bold text-purple-600 ml-2 shrink-0">
                {isDropdownOpen ? 'Close ▲' : 'Select ▼'}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="mt-1.5 p-2 bg-white rounded-2xl border border-slate-200 shadow-xl space-y-1.5 z-20 relative">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by teacher name, ID..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-purple-500"
                    autoFocus
                  />
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {filteredTeachers.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-2 text-center">No teacher found</p>
                  ) : (
                    filteredTeachers.map((t) => {
                      const isSelected = selectedTeacher?.id === t.id;
                      return (
                        <div
                          key={t.id}
                          onClick={() => handleSelectTeacher(t)}
                          className={`p-2 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-bold">{t.name}</p>
                            <p className="text-[9px] text-slate-400 font-mono">
                              {t.id} • Standard: Rs. {Number(t.salary || 0).toLocaleString()}
                            </p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-600 shrink-0" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            {errors.teacher && <p className="text-rose-500 text-[10px] mt-1">{errors.teacher}</p>}
          </div>

          {/* Salary Amount */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-800">
                Salary Amount (PKR) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-purple-600 font-semibold">Contract rate</span>
            </div>
            <input
              type="number"
              placeholder="Enter salary amount in PKR"
              value={salaryAmount}
              onChange={(e) => setSalaryAmount(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.salaryAmount ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-purple-500'
              } text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-100 outline-none`}
            />
            {errors.salaryAmount && <p className="text-rose-500 text-[10px] mt-1">{errors.salaryAmount}</p>}
          </div>

          {/* Bank Selector */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Paid From Bank / Account <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none"
              >
                <option value="" disabled>-- Select Payment Account / Cash --</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} ({b.accountName})
                  </option>
                ))}
              </select>
            </div>
            {errors.bankId && <p className="text-rose-500 text-[10px] mt-1">{errors.bankId}</p>}
          </div>

          {/* Details */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Salary Details / Month Notes <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-xl border ${
                  errors.details ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-purple-500'
                } text-xs font-medium focus:ring-2 focus:ring-purple-100 outline-none`}
              />
            </div>
            {errors.details && <p className="text-rose-500 text-[10px] mt-1">{errors.details}</p>}
          </div>

          {/* Buttons */}
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
              Disburse Salary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
