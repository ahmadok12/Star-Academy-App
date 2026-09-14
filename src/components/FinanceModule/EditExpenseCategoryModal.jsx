import React, { useState, useEffect } from 'react';
import { X, Tag, FileText, ShieldCheck } from 'lucide-react';

export default function EditExpenseCategoryModal({ isOpen, onClose, onUpdateCategory, category }) {
  const [formData, setFormData] = useState({
    name: '',
    details: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        details: category.details || ''
      });
      setErrors({});
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Expense name is required';
    if (!formData.details.trim()) errs.details = 'Details/description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onUpdateCategory({
      ...category,
      name: formData.name.trim(),
      details: formData.details.trim()
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
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Edit Expense Head</h2>
              <p className="text-[11px] text-slate-400 font-mono font-medium">{category.id}</p>
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
          {/* ID Badge */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-700 text-xs">Expense Head ID:</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-mono font-bold text-xs tracking-wider">
              {category.id}
            </span>
          </div>

          {/* Expense Name */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Expense Name / Head <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-slate-400'
              } text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-slate-100 outline-none`}
            />
            {errors.name && <p className="text-rose-500 text-[10px] mt-1">{errors.name}</p>}
          </div>

          {/* Details */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Details / Scope <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              className={`w-full px-3.5 py-2 rounded-xl border ${
                errors.details ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-slate-400'
              } text-xs font-medium focus:ring-2 focus:ring-slate-100 outline-none`}
            />
            {errors.details && <p className="text-rose-500 text-[10px] mt-1">{errors.details}</p>}
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-2">
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
              Update Expense Head
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
