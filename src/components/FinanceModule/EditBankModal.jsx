import React, { useState, useEffect } from 'react';
import { X, Landmark, CreditCard, ShieldCheck } from 'lucide-react';

export default function EditBankModal({ isOpen, onClose, onUpdateBank, bank }) {
  const [formData, setFormData] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    openingBalance: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (bank) {
      setFormData({
        bankName: bank.bankName || '',
        accountName: bank.accountName || '',
        accountNumber: bank.accountNumber || '',
        openingBalance: String(bank.openingBalance ?? '')
      });
      setErrors({});
    }
  }, [bank]);

  if (!isOpen || !bank) return null;

  const validate = () => {
    const errs = {};
    if (!formData.bankName.trim()) errs.bankName = 'Bank name is required';
    if (!formData.accountName.trim()) errs.accountName = 'Account title is required';
    if (!formData.accountNumber.trim()) errs.accountNumber = 'Account number is required';
    if (formData.openingBalance === '' || isNaN(Number(formData.openingBalance))) {
      errs.openingBalance = 'Enter a valid opening balance';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onUpdateBank({
      ...bank,
      bankName: formData.bankName.trim(),
      accountName: formData.accountName.trim(),
      accountNumber: formData.accountNumber.trim(),
      openingBalance: Number(formData.openingBalance) || 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Landmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Edit Bank Account</h2>
              <p className="text-[11px] text-emerald-100 font-medium">Bank ID: {bank.id}</p>
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
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Bank ID badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-700 text-xs">System Bank ID:</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-mono font-bold text-xs tracking-wider">
              {bank.id}
            </span>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Bank Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.bankName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-emerald-500'
              } text-xs font-medium focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
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
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.accountName ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-emerald-500'
              } text-xs font-medium focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
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
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border ${
                  errors.accountNumber ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-emerald-500'
                } text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
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
              value={formData.openingBalance}
              onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.openingBalance ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-emerald-500'
              } text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-100 outline-none transition-all`}
            />
            {errors.openingBalance && <p className="text-rose-500 text-[10px] mt-1">{errors.openingBalance}</p>}
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md shadow-emerald-200 transition-colors"
            >
              Update Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
