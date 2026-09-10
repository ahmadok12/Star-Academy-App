import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Calendar, FileText } from 'lucide-react';

export default function EditTransferModal({ isOpen, onClose, onUpdateTransfer, transfer, banks }) {
  const [formData, setFormData] = useState({
    date: '',
    fromBankId: '',
    toBankId: '',
    amount: '',
    details: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transfer) {
      setFormData({
        date: transfer.date || '',
        fromBankId: transfer.fromBankId || '',
        toBankId: transfer.toBankId || '',
        amount: String(transfer.amount ?? ''),
        details: transfer.details || ''
      });
      setErrors({});
    }
  }, [transfer]);

  if (!isOpen || !transfer) return null;

  const validate = () => {
    const errs = {};
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.fromBankId) errs.fromBankId = 'Select source bank';
    if (!formData.toBankId) errs.toBankId = 'Select destination bank';
    if (formData.fromBankId && formData.toBankId && formData.fromBankId === formData.toBankId) {
      errs.toBankId = 'Source and destination banks must be different';
    }
    const amt = Number(formData.amount);
    if (!formData.amount || isNaN(amt) || amt <= 0) {
      errs.amount = 'Enter a valid transfer amount';
    }
    if (!formData.details.trim()) errs.details = 'Details/purpose is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onUpdateTransfer({
      ...transfer,
      date: formData.date,
      fromBankId: formData.fromBankId,
      toBankId: formData.toBankId,
      amount: Number(formData.amount),
      details: formData.details.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Edit Bank Transfer</h2>
              <p className="text-[11px] text-blue-100 font-medium">Transfer ID: {transfer.id}</p>
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
          {/* Transfer Date */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Transfer Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-medium text-xs text-slate-800 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none"
              />
            </div>
            {errors.date && <p className="text-rose-500 text-[10px] mt-1">{errors.date}</p>}
          </div>

          {/* From Bank */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              From Bank (Source) <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.fromBankId}
              onChange={(e) => setFormData({ ...formData, fromBankId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bankName} ({b.accountName})
                </option>
              ))}
            </select>
            {errors.fromBankId && <p className="text-rose-500 text-[10px] mt-1">{errors.fromBankId}</p>}
          </div>

          {/* To Bank */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              To Bank (Destination) <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.toBankId}
              onChange={(e) => setFormData({ ...formData, toBankId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-100 outline-none"
            >
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.bankName} ({b.accountName})
                </option>
              ))}
            </select>
            {errors.toBankId && <p className="text-rose-500 text-[10px] mt-1">{errors.toBankId}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Transfer Amount (PKR) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-100 outline-none"
            />
            {errors.amount && <p className="text-rose-500 text-[10px] mt-1">{errors.amount}</p>}
          </div>

          {/* Details */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Transfer Details / Purpose <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none"
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
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-200 transition-colors"
            >
              Update Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
