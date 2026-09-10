import React, { useState } from 'react';
import {
  X,
  Calendar,
  Edit3,
  Trash2,
  Clock,
  BookOpen,
  Award,
  AlertTriangle,
  Share2,
  Check,
  FileText,
  Download,
  MessageCircle
} from 'lucide-react';
import { exportDatesheetPDF, shareDatesheetWhatsApp } from '../../utils/exportShareUtils';

export default function DatesheetDetailModal({
  isOpen,
  onClose,
  datesheet,
  onEdit,
  onDelete,
  readOnly = false
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !datesheet) return null;

  const handleCopyShare = () => {
    let text = `*STAR ACADEMY - OFFICIAL DATESHEET*\n`;
    text += `*${datesheet.testName}*\n`;
    text += `Class: ${datesheet.studentClass} • Section: ${datesheet.section}\n`;
    text += `------------------------------------\n`;
    datesheet.rows?.forEach((r, idx) => {
      text += `${idx + 1}. *${r.subject}*\n   📅 Date: ${r.date}\n   ⏰ Time: ${r.time}\n`;
      if (r.syllabus) text += `   📖 Syllabus: ${r.syllabus}\n`;
    });
    if (datesheet.instructions) {
      text += `\n*Note*: ${datesheet.instructions}\n`;
    }
    text += `\n*Star Academy Controller of Examinations*`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with EDIT AT TOP */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Exam Datesheet</h2>
              <p className="text-[11px] text-amber-100 font-mono font-medium">{datesheet.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EDIT BUTTON AT TOP */}
            {!readOnly && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(datesheet);
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
          {/* Header Card */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-amber-700 text-white font-bold text-[10px]">
                {datesheet.testName}
              </span>
              <span className="text-[11px] font-bold text-amber-900">
                Class {datesheet.studentClass} ({datesheet.section})
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900 leading-snug">
              {datesheet.title || `${datesheet.studentClass} ${datesheet.section} Datesheet`}
            </h3>

            {datesheet.instructions && (
              <p className="text-[11px] text-amber-950/80 bg-white/70 p-2 rounded-xl border border-amber-200/60 mt-1">
                📌 {datesheet.instructions}
              </p>
            )}
          </div>

          {/* Papers Timeline / Schedule */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">
                Scheduled Papers ({datesheet.rows?.length || 0})
              </span>
              <button
                onClick={handleCopyShare}
                className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 hover:bg-amber-100 px-2 py-1 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3 text-amber-700" />}
                <span>{copied ? 'Copied Notice!' : 'Copy Datesheet'}</span>
              </button>
            </div>

            <div className="space-y-2">
              {datesheet.rows?.map((paper, idx) => (
                <div
                  key={paper.id || idx}
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">{paper.subject}</h4>
                    </div>

                    <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                      {paper.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{paper.time}</span>
                    </span>
                  </div>

                  {paper.syllabus && (
                    <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 flex items-start gap-1 mt-1">
                      <BookOpen className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                      <span className="leading-tight">{paper.syllabus}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 space-y-2">
          {/* Download PDF & Share on WhatsApp row */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportDatesheetPDF(datesheet)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-300/80 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => shareDatesheetWhatsApp(datesheet)}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          {!readOnly && onDelete ? (
            confirmDelete ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Delete this exam datesheet?</span>
                </div>
                <p className="text-[11px] text-rose-600">
                  Are you sure? This will delete the datesheet for {datesheet.studentClass} ({datesheet.section}).
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
                      onDelete(datesheet.id);
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
                <span>Delete Datesheet</span>
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
