import React, { useState, useMemo } from 'react';
import { ClipboardCheck, Plus, Calendar, ChevronRight, CheckCircle2, XCircle, Clock, GraduationCap } from 'lucide-react';
import MarkTeacherAttendanceModal from './MarkTeacherAttendanceModal';
import TeacherAttendanceSessionDetailModal from './TeacherAttendanceSessionDetailModal';
import { ATTENDANCE_STATUS } from '../../constants/academicData';

export default function TeacherAttendanceDashboard({
  teachers,
  teacherAttendanceSessions,
  onSaveTeacherAttendance,
  onUpdateTeacherAttendanceSession,
  onDeleteTeacherAttendanceSession
}) {
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const sortedSessions = useMemo(() => {
    return [...teacherAttendanceSessions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [teacherAttendanceSessions]);

  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return teacherAttendanceSessions.find((s) => s.id === selectedSessionId) || null;
  }, [teacherAttendanceSessions, selectedSessionId]);

  return (
    <div className="flex flex-col flex-1">
      {/* Top Banner & Mark Action */}
      <div className="p-4 bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-800 flex items-center gap-1.5">
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              Faculty Attendance
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {teacherAttendanceSessions.length} recorded faculty sessions
            </p>
          </div>

          <button
            onClick={() => setIsMarkModalOpen(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm shadow-emerald-200 transition-all tap-active"
          >
            <Plus className="w-4 h-4" />
            <span>Mark Attendance</span>
          </button>
        </div>
      </div>

      {/* List of Marked Attendances */}
      <div className="p-4 space-y-2.5 flex-1">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span className="uppercase text-[10px] tracking-wider text-slate-400 font-bold">
            Teacher Attendance History
          </span>
          <span className="text-[11px]">{sortedSessions.length} entries</span>
        </div>

        {sortedSessions.length > 0 ? (
          sortedSessions.map((session) => {
            const records = session.records || [];
            const total = records.length;
            const present = records.filter((r) => r.status === ATTENDANCE_STATUS.PRESENT).length;
            const absent = records.filter((r) => r.status === ATTENDANCE_STATUS.ABSENT).length;
            const leave = records.filter((r) => r.status === ATTENDANCE_STATUS.LEAVE).length;
            const rate = total > 0 ? Math.round((present / total) * 100) : 0;

            return (
              <div
                key={session.id}
                onClick={() => setSelectedSessionId(session.id)}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer tap-active relative overflow-hidden group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Calendar className="w-3 h-3 text-indigo-600" />
                        {session.date}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {total} Faculty
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-slate-600" />
                      Faculty Daily Attendance
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black font-mono text-emerald-600">
                      {rate}%
                    </span>
                    <span className="block text-[9px] text-slate-400 uppercase font-semibold">
                      Present Rate
                    </span>
                  </div>
                </div>

                {/* Badges Breakdown */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      {present} Present
                    </span>

                    {absent > 0 && (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <XCircle className="w-3 h-3" />
                        {absent} Absent
                      </span>
                    )}

                    {leave > 0 && (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <Clock className="w-3 h-3" />
                        {leave} Leave
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
                    <span>View / Edit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 text-sm">No teacher attendance records</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
              Tap "Mark Attendance" above to log faculty attendance.
            </p>
          </div>
        )}
      </div>

      {/* Mark Teacher Attendance Modal */}
      <MarkTeacherAttendanceModal
        isOpen={isMarkModalOpen}
        onClose={() => setIsMarkModalOpen(false)}
        teachers={teachers}
        onSaveTeacherAttendance={onSaveTeacherAttendance}
      />

      {/* Session Detail Modal (Edit at top, Delete at bottom) */}
      <TeacherAttendanceSessionDetailModal
        session={selectedSession}
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSessionId(null)}
        onUpdateSession={onUpdateTeacherAttendanceSession}
        onDeleteSession={onDeleteTeacherAttendanceSession}
      />
    </div>
  );
}
