import React, { useState, useEffect } from 'react';
import { X, Landmark, CreditCard, ShieldCheck } from 'lucide-react';
import { generateNextBankId } from '../../utils/storage';

export default function AddBankModal({ isOpen, onClose, onAddBank, banks }) {
  const nextId = generateNextBankId(banks);

  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    openingBalance: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        bankName: '',
        accountName: '',
        accountNumber: '',
        openingBalance: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.bankName.trim()) errs.bankName = 'Bank name is required';
    if (!formData.accountName.trim()) errs.accountName = 'Account title is required';
    if (!formData.accountNumber.trim()) errs.accountNumber = 'Account number is required';
    if (!formData.openingBalance || isNaN(Number(formData.openingBalance))) {
      errs.openingBalance = 'Enter a valid opening balance';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddBank({
      id: nextId,
      bankName: formData.bankName.trim(),
      accountName: formData.accountName.trim(),
      accountNumber: formData.accountNumber.trim(),
      openingBalance: Number(formData.openingBalance) || 0,
      createdAt: new Date().toISOString().slice(0, 10)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#111827] p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Add Bank Account</h2>
              <p className="text-[11px] text-slate-400 font-medium">Auto ID: {nextId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Bank ID badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-700 text-xs">System Bank ID:</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-mono font-bold text-xs tracking-wider">
              {nextId}
            </span>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Bank Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Meezan Bank, HBL, ABL, Cash in Hand"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.bankName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-slate-400'
              } text-xs font-medium focus:ring-2 focus:ring-slate-100 outline-none transition-all`}
            />
            {errors.bankName && <p className="text-rose-500 text-[10px] mt-1">{errors.bankName}</p>}
          </div>

          {/* Account Title */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Account Title / Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Star Academy Main Operations"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.accountName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-slate-400'
              } text-xs font-medium focus:ring-2 focus:ring-slate-100 outline-none transition-all`}
            />
            {errors.accountName && <p className="text-rose-500 text-[10px] mt-1">{errors.accountName}</p>}
          </div>

          {/* Account Number */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Account Number / IBAN <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. 02010105849301 or CASH-01"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border ${
                  errors.accountNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-slate-400'
                } text-xs font-mono font-medium focus:ring-2 focus:ring-slate-100 outline-none transition-all`}
              />
            </div>
            {errors.accountNumber && <p className="text-rose-500 text-[10px] mt-1">{errors.accountNumber}</p>}
          </div>

          {/* Opening Balance */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Opening Balance (PKR) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              placeholder="e.g. 50000"
              value={formData.openingBalance}
              onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.openingBalance ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-slate-400'
              } text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-100 outline-none transition-all`}
            />
            {errors.openingBalance && <p className="text-rose-500 text-[10px] mt-1">{errors.openingBalance}</p>}
            <p className="text-[10px] text-slate-400 mt-1">
              Initial ledger balance at the time of account creation.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-black text-white font-bold shadow-xs transition-colors cursor-pointer"
            >
              Save Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
