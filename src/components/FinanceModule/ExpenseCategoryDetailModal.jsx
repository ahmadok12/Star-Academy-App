import React, { useState } from 'react';
import { X, Tag, Edit3, Trash2, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

export default function ExpenseCategoryDetailModal({
  isOpen,
  onClose,
  category,
  chargedExpenses = [],
  onEdit,
  onDelete
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !category) return null;

  const relevantExpenses = chargedExpenses.filter(e => e.expenseCategoryId === category.id);
  const totalSpent = relevantExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with EDIT AT TOP */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Expense Head Details</h2>
              <p className="text-[11px] text-amber-100 font-mono font-medium">{category.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EDIT BUTTON AT TOP */}
            <button
              onClick={() => {
                onClose();
                onEdit(category);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Head Summary Card */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/70 space-y-1">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
              Expense Head Title
            </span>
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {category.name}
            </h3>
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Cumulative Vouchers:</span>
              <span className="font-bold text-amber-800">{relevantExpenses.length} charged (Rs. {totalSpent.toLocaleString()})</span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Scope / Description
            </span>
            <p className="font-medium text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
              {category.details}
            </p>
          </div>
        </div>

        {/* Footer with DELETE BUTTON AT BOTTOM */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          {confirmDelete ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Delete this expense head?</span>
              </div>
              <p className="text-[11px] text-rose-600">
                Are you sure? This will delete "{category.name}".
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(category.id);
                    onClose();
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Expense Head</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
