import React from 'react';
import { Users, ClipboardCheck, GraduationCap, TrendingUp, Sparkles, BookOpen, CheckCircle, UserX, Coins, ArrowRight } from 'lucide-react';
import { CLASSES, CLASS_SUBJECTS } from '../../constants/academicData';

export default function OverviewTab({
  students,
  attendanceSessions,
  teachers = [],
  teacherAttendanceSessions = [],
  onNavigateTab
}) {
  // Only active students count towards active enrollment reports
  const activeStudents = students.filter((s) => !s.isLeft && s.isActive !== false);
  const inactiveStudents = students.filter((s) => s.isLeft || s.isActive === false);

  // Total faculty payroll
  const totalPayroll = teachers.reduce((sum, t) => sum + (Number(t.salary) || 0), 0);

  // Compute enrollment per class using active students
  const classCounts = CLASSES.map((cls) => {
    const count = activeStudents.filter((s) => s.studentClass === cls).length;
    return { name: cls, count, subjects: CLASS_SUBJECTS[cls] || [] };
  });

  return (
    <div className="p-4 space-y-4 text-xs">
      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Active Students */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Students</span>
            <span className="text-xl font-black text-indigo-600 leading-none">{activeStudents.length}</span>
            {inactiveStudents.length > 0 && (
              <span className="text-[9px] text-rose-500 font-semibold block mt-0.5">
                {inactiveStudents.length} left academy
              </span>
            )}
          </div>
        </div>

        {/* Faculty Teachers */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Faculty Count</span>
            <span className="text-xl font-black text-purple-600 leading-none">{teachers.length}</span>
            <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
              Active Teachers
            </span>
          </div>
        </div>

        {/* Monthly Faculty Payroll */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Payroll</span>
            <span className="text-sm font-black text-slate-800 leading-none">PKR {totalPayroll.toLocaleString()}</span>
            <span className="text-[9px] text-slate-400 font-medium block mt-0.5">
              Faculty Compensation
            </span>
          </div>
        </div>

        {/* Attendance Sessions Total */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Attendance Logs</span>
            <span className="text-xl font-black text-slate-800 leading-none">
              {attendanceSessions.length + teacherAttendanceSessions.length}
            </span>
            <span className="text-[9px] text-emerald-600 font-semibold block mt-0.5">
              Students + Teachers
            </span>
          </div>
        </div>
      </div>

      {/* Class Distribution Breakdown */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-slate-800 text-xs flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Active Enrollment Breakdown
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">Students</span>
        </div>

        <div className="space-y-2.5">
          {classCounts.map((cls) => {
            const pct = activeStudents.length > 0 ? Math.round((cls.count / activeStudents.length) * 100) : 0;
            return (
              <div key={cls.name} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">{cls.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-indigo-600">{cls.count} active</span>
                    <span className="text-[10px] text-slate-400">({pct}%)</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>Subjects:</span>
                  <span className="text-slate-600 font-medium">{cls.subjects.join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* System Policy */}
      <div className="bg-slate-100/80 rounded-2xl p-3.5 border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5">
        <span className="font-bold text-slate-800 flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          Academy Information
        </span>
        <p className="text-slate-500 leading-relaxed text-[11px]">
          • Star Academy operations management with active student directory, faculty ledger, ID card generator, and dual attendance modules.
        </p>
      </div>
    </div>
  );
}
