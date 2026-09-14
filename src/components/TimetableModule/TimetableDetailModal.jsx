import React, { useState } from 'react';
import { X, Calendar, Edit3, Trash2, Clock, Coffee, BookOpen, AlertTriangle, Download, MessageCircle, Printer } from 'lucide-react';
import { exportTimetablePDF, shareTimetableWhatsApp, printTimetable } from '../../utils/exportShareUtils';

export default function TimetableDetailModal({
  isOpen,
  onClose,
  timetable,
  onEdit,
  onDelete,
  readOnly = false
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !timetable) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with EDIT AT TOP */}
        <div className="bg-[#111827] p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight leading-tight font-display">Class Timetable</h2>
              <p className="text-[11px] text-slate-400 font-mono font-medium">{timetable.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EDIT BUTTON AT TOP */}
            {!readOnly && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(timetable);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-bold transition-colors cursor-pointer"
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
          {/* Summary Header */}
          <div className="p-4 rounded-2xl bg-[#F8F9FB] border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#111827] text-white font-bold text-[10px]">
                {timetable.studentClass}
              </span>
              <span className="text-[11px] font-semibold text-slate-600">
                {timetable.days || 'Monday - Saturday'}
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 leading-tight">
              {timetable.title || `${timetable.studentClass} ${timetable.section} Timetable`}
            </h3>
            <p className="text-[11px] text-slate-600 font-medium">
              Section: <strong className="text-slate-900">{timetable.section}</strong>
            </p>
          </div>

          {/* Timeline of Periods and Breaks */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 text-xs block">
              Daily Class Sequence ({timetable.periods?.length || 0} slots)
            </span>

            <div className="space-y-2">
              {timetable.periods?.map((item, idx) => {
                const isBreak = item.type === 'break' || item.isBreak;

                if (isBreak) {
                  return (
                    <div
                      key={item.id || idx}
                      className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2 shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold">
                          <Coffee className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-amber-950">{item.subject}</p>
                          <p className="text-[10px] text-amber-700 font-medium">Interval Break</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-900 bg-white/70 px-2 py-1 rounded-lg">
                        <Clock className="w-3 h-3 text-amber-600" />
                        <span>{item.fromTime} - {item.toTime}</span>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{item.subject}</p>
                        <p className="text-[10px] text-slate-400">
                          {item.teacherName ? `Faculty: ${item.teacherName}` : 'Academic Period'}
                          {item.room ? ` • ${item.room}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-700 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{item.fromTime} - {item.toTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 space-y-2">
          {/* Print Preview, Download PDF & Share on WhatsApp row */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => printTimetable(timetable)}
              className="flex-1 py-2 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              title="Print Preview Timetable"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => exportTimetablePDF(timetable)}
              className="flex-1 py-2 px-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={() => shareTimetableWhatsApp(timetable)}
              className="flex-1 py-2 px-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>

          {!readOnly && onDelete ? (
            confirmDelete ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Delete this timetable?</span>
                </div>
                <p className="text-[11px] text-rose-600">
                  Are you sure? This will delete the schedule for {timetable.studentClass} ({timetable.section}).
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
                      onDelete(timetable.id);
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
                className="w-full py-2.5 px-4 rounded-full border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Timetable</span>
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 px-4 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
