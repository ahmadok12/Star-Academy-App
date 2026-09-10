import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function SOSDeleteModal({
  isOpen,
  onClose,
  scheme,
  onConfirm
}) {
  if (!isOpen || !scheme) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-5 space-y-4 border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm font-black text-slate-900">
            Delete Scheme of Study?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Are you sure you want to delete <strong className="text-slate-800">{scheme.title}</strong> ({scheme.studentClass} {scheme.section}) with all its {scheme.rows?.length || 0} milestone curriculum rows?
          </p>
        </div>

        <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-100 text-[11px] text-rose-800">
          This action will permanently remove this syllabus scheme from Star Academy storage.
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(scheme.id);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Scheme</span>
          </button>
        </div>
      </div>
    </div>
  );
}
