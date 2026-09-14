import React, { useState } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Users,
  GraduationCap,
  Layers,
  Clock,
  ShieldAlert
} from 'lucide-react';

export default function StartAcademicYearModal({
  isOpen,
  onClose,
  currentSession,
  onStartNewYear,
  activeStudentCount
}) {
  // Compute default next year e.g. "2026 - 27" -> "2027 - 28"
  const getSuggestedNextYear = (curr) => {
    try {
      const parts = curr.split('-').map(p => p.trim());
      if (parts.length === 2) {
        const startYear = parseInt(parts[0], 10);
        const endYear = parseInt(parts[1], 10);
        if (!isNaN(startYear) && !isNaN(endYear)) {
          const nextStart = startYear + 1;
          const nextEnd = (endYear + 1) % 100;
          return `${nextStart} - ${String(nextEnd).padStart(2, '0')}`;
        }
      }
    } catch (e) {}
    return '2027 - 28';
  };

  const [newYearInput, setNewYearInput] = useState(getSuggestedNextYear(currentSession));
  const [transitionStrategy, setTransitionStrategy] = useState('promote'); // 'promote' or 'clean'
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorNotice, setErrorNotice] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = newYearInput.trim();
    if (!trimmed) {
      setErrorNotice('Please enter the new academic session name');
      return;
    }
    if (trimmed === currentSession) {
      setErrorNotice('The new session name must be different from current active session');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmActivation = () => {
    onStartNewYear({
      newSessionYear: newYearInput.trim(),
      promoteActiveStudents: transitionStrategy === 'promote'
    });
    setShowConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-[#111827] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
                <span>Start New Academic Year</span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Annual session transition & student promotion
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-slate-50/50">
          {errorNotice && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorNotice}</span>
            </div>
          )}

          {/* Current vs New Session Indicator */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Current Session (Finishing)
                </span>
                <span className="text-sm font-extrabold text-slate-800">
                  Academic Year {currentSession}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ArrowRight className="w-4 h-4" />
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  New Active Session
                </span>
                <span className="text-sm font-extrabold text-slate-900">
                  Academic Year {newYearInput || '...'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter New Session Name / Period:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={newYearInput}
                  onChange={(e) => {
                    setNewYearInput(e.target.value);
                    setErrorNotice('');
                  }}
                  placeholder="e.g. 2027 - 28"
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 px-3.5 py-2.5 rounded-full border border-slate-200 focus:border-slate-400 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Official Academic Calendar Rule Callout (Required by user) */}
          <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold">
              <Clock className="w-4 h-4 text-slate-700" />
              <span>Star Academy Official Session Calendar:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-700" />
                  9th & 10th Classes
                </span>
                <p className="text-[10.5px] text-slate-600">
                  New session starts in <span className="font-extrabold text-slate-900">May</span> each year.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-200 space-y-0.5">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-slate-700" />
                  FSc Part 1 & Part 2
                </span>
                <p className="text-[10.5px] text-slate-600">
                  New session starts in <span className="font-extrabold text-slate-900">July</span> each year.
                </p>
              </div>
            </div>
          </div>

          {/* Transition & Promotion Strategy */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              Student Promotion & Enrollment Strategy:
            </span>

            {/* Option 1: Promote active students */}
            <label className={`block p-3 rounded-2xl border transition-all cursor-pointer ${
              transitionStrategy === 'promote'
                ? 'border-slate-900 bg-slate-50/60 ring-1 ring-slate-900'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}>
              <div className="flex items-start gap-2.5">
                <input
                  type="radio"
                  name="transitionStrategy"
                  checked={transitionStrategy === 'promote'}
                  onChange={() => setTransitionStrategy('promote')}
                  className="mt-0.5 accent-slate-900"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Promote Active Students into New Session</span>
                    <span className="px-2 py-0.2 rounded-full bg-slate-100 text-slate-800 border border-slate-200 text-[9.5px] font-bold">Recommended</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    • <strong>9th</strong> promotes to <strong>10th</strong>.<br />
                    • <strong>FSc Part 1</strong> promotes to <strong>FSc Part 2</strong>.<br />
                    • <strong>10th</strong> & <strong>FSc Part 2</strong> graduate and are safely archived.<br />
                    • Historical records of {currentSession} remain viewable in <strong>Reports</strong>.
                  </p>
                </div>
              </div>
            </label>

            {/* Option 2: Clean start */}
            <label className={`block p-3 rounded-2xl border transition-all cursor-pointer ${
              transitionStrategy === 'clean'
                ? 'border-slate-900 bg-slate-50/60 ring-1 ring-slate-900'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}>
              <div className="flex items-start gap-2.5">
                <input
                  type="radio"
                  name="transitionStrategy"
                  checked={transitionStrategy === 'clean'}
                  onChange={() => setTransitionStrategy('clean')}
                  className="mt-0.5 accent-slate-900"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="font-extrabold text-slate-900">
                    Fresh Admissions Only (Archive All Current Students)
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    All currently enrolled students remain archived under {currentSession}. The new session starts with fresh admissions.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Historical Data Notice */}
          <div className="bg-slate-100/70 p-3 rounded-2xl flex items-start gap-2.5 text-slate-500 text-[11px] leading-relaxed">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              All past student records, fee logs, attendance history, and exam scores will remain accessible anytime in the <strong>Reports & Archive</strong> section.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-full bg-[#111827] hover:bg-black active:scale-98 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Start Academic Year</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-sm font-black text-slate-900">
                Confirm Academic Session Activation
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Activate <strong>Academic Year {newYearInput}</strong> and transition active academy operations? Past records will be archived to Reports.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmActivation}
                className="py-2.5 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Confirm & Start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
