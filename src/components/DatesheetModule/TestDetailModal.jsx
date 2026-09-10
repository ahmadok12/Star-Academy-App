import React, { useState } from 'react';
import { X, Award, Edit3, Trash2, Calendar, FileText, AlertTriangle } from 'lucide-react';

export default function TestDetailModal({
  isOpen,
  onClose,
  test,
  datesheets = [],
  onEdit,
  onDelete,
  readOnly = false
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !test) return null;

  const linkedDatesheets = datesheets.filter(d => d.testId === test.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with EDIT AT TOP */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Test Series Details</h2>
              <p className="text-[11px] text-violet-100 font-mono font-medium">{test.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EDIT BUTTON AT TOP */}
            {!readOnly && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(test);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}

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
          {/* Test Card */}
          <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-violet-700 text-white font-bold text-[10px]">
                {test.session || 'Session 2026-27'}
              </span>
              <span className="font-bold text-violet-900 text-xs">
                Marks: {test.totalMarks || '100'}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {test.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Linked Datesheets: <strong className="text-violet-800">{linkedDatesheets.length} classes scheduled</strong>
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Test Description & Objective
            </span>
            <p className="font-medium text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
              {test.description || 'Official academy assessment series.'}
            </p>
          </div>

          {/* Linked Datesheets list */}
          {linkedDatesheets.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-slate-700 text-xs block">
                Scheduled Classes for {test.name}:
              </span>
              <div className="space-y-1.5">
                {linkedDatesheets.map(d => (
                  <div key={d.id} className="p-2.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">Class {d.studentClass} ({d.section})</span>
                    <span className="text-slate-500 text-[11px] font-medium">{d.rows?.length || 0} Papers</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with DELETE AT BOTTOM */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          {!readOnly && onDelete ? (
            confirmDelete ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Delete this test definition?</span>
                </div>
                <p className="text-[11px] text-rose-600">
                  Are you sure? This will remove "{test.name}".
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
                      onDelete(test.id);
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
                <span>Delete Test Definition</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
