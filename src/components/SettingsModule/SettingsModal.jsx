import React, { useState } from 'react';
import {
  X,
  Settings,
  BookOpen,
  ChevronRight,
  Sparkles,
  School,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Clock,
  RotateCcw,
  CheckCircle2,
  Layers
} from 'lucide-react';
import SubjectsManagerModal from './SubjectsManagerModal';
import StartAcademicYearModal from './StartAcademicYearModal';
import BatchesManagerModal from './BatchesManagerModal';
import AttendanceTimingsModal from './AttendanceTimingsModal';

export default function SettingsModal({
  isOpen,
  onClose,
  curriculumSubjects,
  onSaveCurriculumSubjects,
  studentCount,
  teacherCount,
  currentSession = '2026 - 27',
  onStartNewYear,
  batches = [],
  onSaveBatches,
  attendanceTimings,
  onSaveAttendanceTimings
}) {
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isBatchesOpen, setIsBatchesOpen] = useState(false);
  const [isStartYearOpen, setIsStartYearOpen] = useState(false);
  const [isTimingsOpen, setIsTimingsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleStartNewYearWrapper = (params) => {
    if (onStartNewYear) {
      onStartNewYear(params);
    }
    showToast(`Academic Year ${params.newSessionYear} activated successfully!`);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-100">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-brand-700 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                <Settings className="w-5 h-5 text-amber-300 animate-spin-slow" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
                  <span>Settings</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                </h2>
                <p className="text-xs text-indigo-100 font-medium">
                  Star Academy System & Curriculum Configuration
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-slate-50/50">
            {toastMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{toastMsg}</span>
              </div>
            )}

            {/* Academic Session Management Section (Requested by User) */}
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-1 mb-2">
                Academic Session & Year
              </p>

              <div className="bg-white p-4 rounded-2xl border border-amber-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-sm shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Current Active Session
                      </span>
                      <h3 className="text-sm font-black text-slate-900">
                        Academic Year {currentSession}
                      </h3>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-extrabold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Running
                  </span>
                </div>

                {/* Session Calendar Timing Callout */}
                <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Official Session Start Schedule:</span>
                  </div>
                  <ul className="text-[10.5px] text-amber-950/80 space-y-0.5 list-disc pl-4">
                    <li><strong>9th & 10th:</strong> Starts in <strong>May</strong> each year</li>
                    <li><strong>FSc Part 1 & 2:</strong> Starts in <strong>July</strong> each year</li>
                  </ul>
                </div>

                {/* Start New Academic Year Button */}
                <button
                  type="button"
                  onClick={() => setIsStartYearOpen(true)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-700 hover:from-indigo-700 hover:to-brand-800 text-white text-xs font-extrabold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 tap-active"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Start New Academic Year</span>
                </button>
              </div>
            </div>

            {/* Academic Curriculum Section */}
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-1 mb-2">
                Academics & Curriculum
              </p>

              {/* SUBJECTS BUTTON */}
              <button
                type="button"
                onClick={() => setIsSubjectsOpen(true)}
                className="w-full text-left bg-white p-4 rounded-2xl border border-indigo-200/80 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all group flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform shrink-0">
                    <BookOpen className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        Subjects Master
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                        Class & Groups
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      Define, edit, add, and delete curriculum subjects per class and group (9th, 10th, FSc Part 1, FSc Part 2).
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* BATCHES BUTTON */}
              <button
                type="button"
                onClick={() => setIsBatchesOpen(true)}
                className="w-full text-left bg-white p-4 rounded-2xl border border-purple-200/80 hover:border-purple-500 shadow-xs hover:shadow-md transition-all group flex items-center justify-between gap-3 mt-2.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-purple-200 group-hover:scale-105 transition-transform shrink-0">
                    <Layers className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-purple-600 transition-colors">
                        Batches Master
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-extrabold">
                        {batches.length} Batches
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      Add, edit, or remove academy batches (Morning, Evening, Weekend) for Schemes of Study and class cohorts.
                    </p>
                    {batches.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        {batches.slice(0, 4).map((b) => (
                          <span
                            key={b.id || b}
                            className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-100 text-purple-700 font-bold text-[10px]"
                          >
                            {b.name || b}
                          </span>
                        ))}
                        {batches.length > 4 && (
                          <span className="text-[10px] font-bold text-slate-400">
                            +{batches.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-purple-50 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Attendance & Arrival Timings Section */}
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-1 mb-2">
                Attendance & Timings
              </p>

              <button
                type="button"
                onClick={() => setIsTimingsOpen(true)}
                className="w-full text-left bg-white p-4 rounded-2xl border border-emerald-200/80 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all group flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform shrink-0">
                    <Clock className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                        Class Arrival Timings
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold">
                        Classes
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                      Set expected student arrival times and start schedules for 9th, 10th, FSc Part 1, and Part 2.
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-emerald-50 group-hover:bg-emerald-600 text-emerald-600 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>

            {/* Academy Profile Card */}
            <div>
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-1 mb-2">
                Academy Profile
              </p>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                    <School className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">Star Academy Lahore</h4>
                    <p className="text-[11px] text-slate-500">Academic Session {currentSession}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Students Enrolled</span>
                    <span className="text-xs font-extrabold text-slate-800">{studentCount || 0} Students</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-medium">Faculty Members</span>
                    <span className="text-xs font-extrabold text-slate-800">{teacherCount || 0} Teachers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-slate-100/70 p-3 rounded-2xl flex items-center gap-2.5 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All changes and subjects are persistently saved to local browser storage.</span>
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex justify-end shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Subjects Manager Modal Sub-Dialog */}
      <SubjectsManagerModal
        isOpen={isSubjectsOpen}
        onClose={() => setIsSubjectsOpen(false)}
        curriculumSubjects={curriculumSubjects}
        onSaveCurriculumSubjects={onSaveCurriculumSubjects}
      />

      {/* Batches Manager Modal Sub-Dialog */}
      <BatchesManagerModal
        isOpen={isBatchesOpen}
        onClose={() => setIsBatchesOpen(false)}
        batches={batches}
        onSaveBatches={onSaveBatches}
      />

      {/* Start Academic Year Modal Sub-Dialog */}
      <StartAcademicYearModal
        isOpen={isStartYearOpen}
        onClose={() => setIsStartYearOpen(false)}
        currentSession={currentSession}
        onStartNewYear={handleStartNewYearWrapper}
        activeStudentCount={studentCount}
      />

      {/* Attendance & Arrival Timings Modal Sub-Dialog */}
      <AttendanceTimingsModal
        isOpen={isTimingsOpen}
        onClose={() => setIsTimingsOpen(false)}
        attendanceTimings={attendanceTimings}
        onSaveAttendanceTimings={onSaveAttendanceTimings}
      />
    </>
  );
}
