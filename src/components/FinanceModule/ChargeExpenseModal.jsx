import React, { useState, useMemo, useEffect } from 'react';
import { X, Receipt, Calendar, FileText, Landmark, Search, ShieldCheck, Check } from 'lucide-react';
import { generateNextChargedExpenseId } from '../../utils/storage';

export default function ChargeExpenseModal({
  isOpen,
  onClose,
  onChargeExpense,
  chargedExpenses,
  categories,
  banks
}) {
  const nextId = generateNextChargedExpenseId(chargedExpenses);
  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bankId, setBankId] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');

  const [categorySearch, setCategorySearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setDate(today);
      setSelectedCategory(null);
      setBankId('');
      setAmount('');
      setDetails('');
      setCategorySearch('');
      setIsDropdownOpen(false);
      setErrors({});
    }
  }, [isOpen]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return categories;
    return categories.filter(c =>
      c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
      c.id.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [categories, categorySearch]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!date) errs.date = 'Date is required';
    if (!selectedCategory) errs.category = 'Select an expense category';
    if (!bankId) errs.bankId = 'Select a payment bank/cash account';
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      errs.amount = 'Enter a valid amount';
    }
    if (!details.trim()) errs.details = 'Expense voucher details required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onChargeExpense({
      id: nextId,
      date,
      expenseCategoryId: selectedCategory.id,
      expenseCategoryName: selectedCategory.name,
      amount: Number(amount),
      bankId,
      details: details.trim(),
      createdAt: new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-[#E5E7EB] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#111827] px-6 py-4 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display tracking-tight leading-tight">Charge Expense Voucher</h2>
              <p className="text-[11px] text-slate-400 font-medium">Voucher ID: {nextId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {/* ID & Date Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-[#F4F5F7] border border-[#E5E7EB]">
              <span className="text-[10px] text-[#575E70] font-bold block uppercase">Voucher ID</span>
              <span className="font-mono font-bold text-xs text-[#111827]">{nextId}</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-full border border-[#E5E7EB] bg-[#F8F9FB] font-medium text-xs text-slate-800 focus:ring-2 focus:ring-[#111827] outline-none"
              />
            </div>
          </div>

          {/* Searchable Selectable Dropdown for Expense Name */}
          <div className="relative">
            <label className="block font-semibold text-slate-800 mb-1">
              Select Expense Category <span className="text-rose-500">*</span>
            </label>

            {/* Selected item display / trigger */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                isDropdownOpen ? 'border-[#111827] ring-2 ring-slate-200' : 'border-[#E5E7EB] hover:border-slate-300'
              } ${errors.category ? 'border-rose-400 bg-rose-50/50' : 'bg-[#F8F9FB]'}`}
            >
              {selectedCategory ? (
                <div>
                  <span className="font-bold text-slate-900 block">{selectedCategory.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">{selectedCategory.details}</span>
                </div>
              ) : (
                <span className="text-slate-400">Click to search & select expense head...</span>
              )}
              <span className="text-[10px] font-bold text-[#111827] ml-2 shrink-0">
                {isDropdownOpen ? 'Close ▲' : 'Select ▼'}
              </span>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="mt-1.5 p-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-xl space-y-1.5 z-20 relative">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search expense heads..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-full outline-none focus:ring-2 focus:ring-[#111827]"
                    autoFocus
                  />
                </div>

                <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                  {filteredCategories.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-2 text-center">No matching categories found</p>
                  ) : (
                    filteredCategories.map((c) => {
                      const isSelected = selectedCategory?.id === c.id;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedCategory(c);
                            setIsDropdownOpen(false);
                            setCategorySearch('');
                          }}
                          className={`p-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-[#F8F9FB] text-slate-700'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate text-xs">{c.name}</p>
                            <p className="text-[9px] text-slate-400 truncate">{c.details}</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#111827] shrink-0" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            {errors.category && <p className="text-rose-500 text-[10px] mt-1">{errors.category}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Amount to Charge (PKR) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-full border ${
                errors.amount ? 'border-rose-400 bg-rose-50/50' : 'border-[#E5E7EB] bg-[#F8F9FB] focus:ring-2 focus:ring-[#111827]'
              } text-xs font-bold text-slate-900 outline-none`}
            />
            {errors.amount && <p className="text-rose-500 text-[10px] mt-1">{errors.amount}</p>}
          </div>

          {/* Payment Account (Bank / Cash) */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Paid From (Account / Cash) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-full border border-[#E5E7EB] bg-[#F8F9FB] text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#111827] outline-none"
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

          {/* Details / Voucher notes */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Expense Details / Voucher Notes <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                placeholder="e.g. Bill # 49821 paid online, test series printing invoice..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded-2xl border ${
                  errors.details ? 'border-rose-400 bg-rose-50/50' : 'border-[#E5E7EB] bg-[#F8F9FB] focus:ring-2 focus:ring-[#111827]'
                } text-xs font-medium outline-none`}
              />
            </div>
            {errors.details && <p className="text-rose-500 text-[10px] mt-1">{errors.details}</p>}
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full border border-[#E5E7EB] text-slate-700 font-semibold hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-black text-white font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Post Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
