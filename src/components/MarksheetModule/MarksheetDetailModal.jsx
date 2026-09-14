import React, { useState, useMemo } from 'react';
import {
  X,
  Award,
  Calendar,
  GraduationCap,
  Users,
  Pencil,
  Trash2,
  Share2,
  Copy,
  Check,
  MessageCircle,
  TrendingUp,
  Printer,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Download
} from 'lucide-react';
import { getGradeBadgeStyle } from '../../utils/storage';
import { exportMarksheetPDF, shareMarksheetWhatsApp, printMarksheet } from '../../utils/exportShareUtils';

export default function MarksheetDetailModal({
  isOpen,
  onClose,
  marksheet,
  students = [],
  onEdit,
  onDelete,
  readOnly = false
}) {
  const [copiedClassSummary, setCopiedClassSummary] = useState(false);
  const [copiedStudentId, setCopiedStudentId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const studentMap = useMemo(() => {
    const map = new Map();
    (students || []).forEach((s) => {
      map.set(s.id, s);
    });
    return map;
  }, [students]);

  // Rank students by percentage descending and sync live student profile details
  const sortedStudents = useMemo(() => {
    if (!marksheet) return [];
    return [...(marksheet.studentScores || [])]
      .map((st) => {
        const canonical = studentMap.get(st.studentId);
        if (canonical) {
          return {
            ...st,
            studentName: `${canonical.firstName} ${canonical.lastName}`.trim(),
            fatherName: canonical.fatherName || st.fatherName,
            pic: canonical.pic || st.pic,
            whatsappNumber: canonical.whatsappNumber || canonical.contactNumber || st.whatsappNumber
          };
        }
        return st;
      })
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  }, [marksheet, studentMap]);

  if (!isOpen || !marksheet) return null;

  const topper = sortedStudents[0];

  // Copy full class merit list for WhatsApp group
  const handleCopyClassSummary = () => {
    let text = `🎓 *STAR ACADEMY LAHORE - MERIT LIST*\n`;
    text += `📋 *${marksheet.title || marksheet.testName}*\n`;
    text += `Class: ${marksheet.studentClass} (${marksheet.section})\n`;
    text += `Date: ${marksheet.date}\n`;
    text += `Total Evaluated: ${marksheet.totalStudents || sortedStudents.length} Students\n`;
    text += `Class Average: ${marksheet.classAverage}%\n`;
    text += `----------------------------------------\n`;
    text += `🏅 *STUDENT MERIT STANDINGS*:\n\n`;

    sortedStudents.forEach((st, idx) => {
      const pos = idx === 0 ? '🥇 1st' : idx === 1 ? '🥈 2nd' : idx === 2 ? '🥉 3rd' : `#${idx + 1}`;
      text += `${pos} | ${st.studentName} (${st.studentId})\n`;
      text += `Marks: ${st.totalObtained}/${st.totalMax} (${st.percentage}%) - Grade: ${st.grade}\n\n`;
    });

    text += `----------------------------------------\n`;
    text += `Congratulations to all students!\nStar Academy Administration`;

    navigator.clipboard.writeText(text);
    setCopiedClassSummary(true);
    setTimeout(() => setCopiedClassSummary(false), 2500);
  };

  // Generate individual student WhatsApp message
  const handleStudentWhatsApp = (student, rankIndex) => {
    const pos = rankIndex === 0 ? '1st' : rankIndex === 1 ? '2nd' : rankIndex === 2 ? '3rd' : `${rankIndex + 1}th`;

    let text = `🎓 *STAR ACADEMY LAHORE*\n`;
    text += `📋 *EXAMINATION RESULT NOTIFICATION*\n`;
    text += `----------------------------------------\n`;
    text += `*Student:* ${student.studentName}\n`;
    text += `*Student ID:* ${student.studentId}\n`;
    if (student.fatherName) text += `*Father:* ${student.fatherName}\n`;
    text += `*Class:* ${marksheet.studentClass} (${marksheet.section})\n`;
    text += `*Exam:* ${marksheet.testName}\n`;
    text += `*Exam Date:* ${marksheet.date}\n`;
    text += `----------------------------------------\n`;
    text += `*SUBJECT SCORES*:\n`;

    (marksheet.subjects || []).forEach((sub) => {
      const max = (marksheet.subjectTotalMarks || {})[sub] || 100;
      const obt = (student.scores || {})[sub] ?? '-';
      text += `• ${sub}: ${obt} / ${max}\n`;
    });

    text += `----------------------------------------\n`;
    text += `*Total Marks:* ${student.totalObtained} / ${student.totalMax}\n`;
    text += `*Percentage:* ${student.percentage}%\n`;
    text += `*Grade:* ${student.grade}\n`;
    text += `*Class Standing:* ${pos} Position\n`;
    text += `*Result Status:* ${student.isPassed ? 'PASSED ✅' : 'FAILED ❌'}\n`;
    text += `----------------------------------------\n`;
    text += `For queries, please contact Star Academy administration.`;

    const rawNum = (student.whatsappNumber || '').replace(/[^0-9]/g, '');
    const cleanNum = rawNum.startsWith('0') ? `92${rawNum.slice(1)}` : rawNum;

    if (cleanNum && cleanNum.length >= 10) {
      window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      navigator.clipboard.writeText(text);
      setCopiedStudentId(student.studentId);
      setTimeout(() => setCopiedStudentId(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-100">
        {/* Header with EDIT AT TOP */}
        <div className="px-5 py-4 bg-[#111827] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner shrink-0">
              <Award className="w-5 h-5 text-[#FF7A59]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-black">
                  {marksheet.id}
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#FF7A59]" />
                  {marksheet.date}
                </span>
              </div>
              <h2 className="text-base font-display font-extrabold tracking-tight truncate text-white mt-0.5">
                {marksheet.title || marksheet.testName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* EDIT BUTTON AT TOP */}
            {!readOnly && onEdit && (
              <button
                onClick={() => {
                  onEdit(marksheet);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#FF7A59] hover:bg-[#ff6942] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Edit Marksheet"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-[#F8F9FB]">
          {/* Top Performance Analytics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Class & Section
              </span>
              <span className="text-xs font-display font-black text-slate-900 mt-0.5">
                {marksheet.studentClass} ({marksheet.section})
              </span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Class Average
              </span>
              <span className="text-sm font-display font-black text-slate-900 mt-0.5">
                {marksheet.classAverage || 0}%
              </span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Class Topper
              </span>
              <span className="text-xs font-display font-black text-emerald-700 truncate block mt-0.5" title={topper?.studentName}>
                {topper ? `${topper.studentName} (${topper.percentage}%)` : 'N/A'}
              </span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Passing Rate
              </span>
              <span className="text-xs font-display font-black text-slate-900 mt-0.5">
                {marksheet.passedCount || 0} / {marksheet.totalStudents || sortedStudents.length} Passed
              </span>
            </div>
          </div>

          {/* Quick Action Share Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Share2 className="w-4 h-4 text-[#FF7A59]" />
              <span>Broadcast & Share Results:</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopyClassSummary}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedClassSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Merit List</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => printMarksheet(marksheet, sortedStudents)}
                className="px-3.5 py-1.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title="Print Preview Marksheet"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Preview</span>
              </button>
            </div>
          </div>

          {/* Ranked Merit List of Students */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-display font-black text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#FF7A59]" />
                Ranked Student Merit Standings ({sortedStudents.length})
              </h3>
              <span className="text-[10px] font-bold text-slate-400">
                Sorted by Percentage
              </span>
            </div>

            {sortedStudents.map((st, index) => {
              const gradeStyle = getGradeBadgeStyle(st.grade);
              const isTop3 = index < 3;
              const rankBadge =
                index === 0
                  ? { label: '1st', bg: 'bg-amber-100 text-amber-900 border-amber-300' }
                  : index === 1
                  ? { label: '2nd', bg: 'bg-slate-200 text-slate-800 border-slate-300' }
                  : index === 2
                  ? { label: '3rd', bg: 'bg-orange-100 text-orange-900 border-orange-300' }
                  : { label: `#${index + 1}`, bg: 'bg-slate-100 text-slate-600 border-slate-200' };

              return (
                <div
                  key={st.studentId}
                  className={`bg-white rounded-2xl border p-3.5 shadow-2xs space-y-3 transition-all ${
                    isTop3 ? 'border-amber-200 shadow-xs' : 'border-slate-200/90'
                  }`}
                >
                  {/* Top Row: Rank, Student Info, Total Marks & Grade */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0 border ${rankBadge.bg}`}
                      >
                        {rankBadge.label}
                      </span>

                      {st.pic ? (
                        <img
                          src={st.pic}
                          alt={st.studentName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold shrink-0">
                          {st.studentName.slice(0, 1)}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {st.studentName}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          ID: {st.studentId} {st.fatherName && `• S/O ${st.fatherName}`}
                        </p>
                      </div>
                    </div>

                    {/* Score & Grade */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-display font-black text-slate-900 block leading-tight">
                          {st.totalObtained} / {st.totalMax}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {st.percentage}%
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-black border flex items-center gap-1 ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${gradeStyle.dot}`}></span>
                        <span>{st.grade}</span>
                      </span>

                      {/* WhatsApp Button */}
                      <button
                        type="button"
                        onClick={() => handleStudentWhatsApp(st, index)}
                        className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-200 shrink-0 cursor-pointer"
                        title="Send Result Slip on WhatsApp"
                      >
                        {copiedStudentId === st.studentId ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <MessageCircle className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Subject Scores Pill Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-1.5 text-center">
                    {(marksheet.subjects || []).map((sub) => {
                      const max = (marksheet.subjectTotalMarks || {})[sub] || 100;
                      const obt = (st.scores || {})[sub];
                      const hasScore = obt !== undefined && obt !== null && obt !== '';
                      const subPct = hasScore && max > 0 ? (obt / max) * 100 : 0;
                      const isSubFail = hasScore && subPct < 40;

                      return (
                        <div
                          key={sub}
                          className={`p-2 rounded-xl border text-center ${
                            isSubFail
                              ? 'bg-rose-50 border-rose-200 text-rose-800'
                              : 'bg-[#F8F9FB] border-slate-200/80 text-slate-700'
                          }`}
                        >
                          <span className="block text-[9px] font-bold text-slate-400 truncate" title={sub}>
                            {sub}
                          </span>
                          <span className="text-xs font-display font-black block mt-0.5">
                            {hasScore ? obt : '-'}{' '}
                            <span className="text-[9px] font-medium text-slate-400">/{max}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delete Confirmation Alert if open */}
          {showDeleteConfirm && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Are you sure you want to delete this marksheet?</span>
              </div>
              <p className="text-[11px] text-rose-600 leading-relaxed">
                This will permanently delete this examination result record for {marksheet.title}. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(marksheet.id);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportMarksheetPDF(marksheet, students)}
              className="flex-1 py-2 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => shareMarksheetWhatsApp(marksheet, students)}
              className="flex-1 py-2 px-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          <div className={`flex items-center ${!readOnly && onDelete ? 'justify-between' : 'justify-end'}`}>
            {/* DELETE BUTTON AT BOTTOM */}
            {!readOnly && onDelete && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3.5 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-rose-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete Marksheet</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
