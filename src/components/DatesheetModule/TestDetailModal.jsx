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
        <div className="bg-[#111827] p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Award className="w-5 h-5 text-[#FF7A59]" />
            </div>
            <div>
              <h2 className="text-base font-display font-black tracking-tight leading-tight">Test Series Details</h2>
              <p className="text-[11px] text-slate-400 font-mono font-medium">{test.id}</p>
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF7A59] hover:bg-[#ff6942] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Test Card */}
          <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-slate-200/90 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#111827] text-white font-bold text-[10px]">
                {test.session || 'Session 2026-27'}
              </span>
              <span className="font-bold text-slate-700 text-xs">
                Marks: {test.totalMarks || '100'}
              </span>
            </div>
            <h3 className="text-base font-display font-black text-slate-900 leading-snug">
              {test.name}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Linked Datesheets: <strong className="text-slate-800">{linkedDatesheets.length} classes scheduled</strong>
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2 bg-[#F8F9FB] p-4 rounded-2xl border border-slate-200/80">
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
                  <div key={d.id} className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center justify-between text-xs shadow-2xs">
                    <span className="font-bold text-slate-800">Class {d.studentClass} ({d.section})</span>
                    <span className="text-slate-500 text-[11px] font-medium">{d.rows?.length || 0} Papers</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer with DELETE AT BOTTOM */}
        <div className="p-4 bg-white border-t border-slate-200">
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
                    className="flex-1 py-1.5 px-3 rounded-full border border-slate-200 bg-white text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(test.id);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-full bg-rose-600 text-white font-bold text-xs shadow-xs hover:bg-rose-700 cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full py-2.5 px-4 rounded-full border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Test Definition</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
