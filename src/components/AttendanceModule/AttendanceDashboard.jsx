import React, { useState, useMemo } from 'react';
import { ClipboardCheck, Plus, Calendar, Filter, ChevronRight, CheckCircle2, XCircle, Clock, Users, GraduationCap, ArrowLeft } from 'lucide-react';
import MarkAttendanceModal from './MarkAttendanceModal';
import AttendanceSessionDetailModal from './AttendanceSessionDetailModal';
import TeacherAttendanceDashboard from '../TeacherAttendanceModule/TeacherAttendanceDashboard';
import { CLASSES, ATTENDANCE_STATUS } from '../../constants/academicData';

export default function AttendanceDashboard({
  students,
  attendanceSessions,
  onSaveAttendance,
  onUpdateAttendanceSession,
  onDeleteAttendanceSession,
  teachers,
  teacherAttendanceSessions,
  onSaveTeacherAttendance,
  onUpdateTeacherAttendanceSession,
  onDeleteTeacherAttendanceSession,
  initialAttendanceType = 'students',
  studentOnly = false,
  onBack
}) {
  const [attendanceType, setAttendanceType] = useState(studentOnly ? 'students' : initialAttendanceType);
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [filterClass, setFilterClass] = useState('All');

  // Filter student sessions
  const filteredSessions = useMemo(() => {
    return attendanceSessions
      .filter((session) => filterClass === 'All' || session.studentClass === filterClass)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [attendanceSessions, filterClass]);

  const selectedSession = useMemo(() => {
    if (!selectedSessionId) return null;
    return attendanceSessions.find((s) => s.id === selectedSessionId) || null;
  }, [attendanceSessions, selectedSessionId]);

  return (
    <div className="flex flex-col flex-1">
      {/* Attendance Mode Switcher (Student vs Teacher) */}
      {!studentOnly && (
        <div className="bg-white px-4 pt-3 pb-2 border-b border-slate-100">
          <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setAttendanceType('students')}
              className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                attendanceType === 'students'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student Attendance</span>
            </button>

            <button
              type="button"
              onClick={() => setAttendanceType('teachers')}
              className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                attendanceType === 'teachers'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Teacher Attendance</span>
            </button>
          </div>
        </div>
      )}

      {attendanceType === 'teachers' ? (
        <TeacherAttendanceDashboard
          teachers={teachers}
          teacherAttendanceSessions={teacherAttendanceSessions}
          onSaveTeacherAttendance={onSaveTeacherAttendance}
          onUpdateTeacherAttendanceSession={onUpdateTeacherAttendanceSession}
          onDeleteTeacherAttendanceSession={onDeleteTeacherAttendanceSession}
        />
      ) : (
        <>
          {/* Top Banner & Main "Mark Attendance" Action - Edge-to-Edge Sticky Top-0 */}
          <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
            <div className="max-w-6xl mx-auto p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all tap-active cursor-pointer shrink-0"
                      title="Back"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                  )}
                  <div>
                    <h2 className="text-base font-black text-slate-800 flex items-center gap-1.5">
                      <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                      Student Attendance
                    </h2>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {attendanceSessions.length} recorded session(s)
                    </p>
                  </div>
                </div>

                {/* Prompt requested: "Show Mark Attendance Button" */}
                <button
                  onClick={() => setIsMarkModalOpen(true)}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all tap-active"
                >
                  <Plus className="w-4 h-4" />
                  <span>Mark Attendance</span>
                </button>
              </div>

              {/* Filter by class pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                <button
                  onClick={() => setFilterClass('All')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    filterClass === 'All'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Classes
                </button>
                {CLASSES.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setFilterClass(cls)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      filterClass === cls
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List of Marked Attendances */}
          <div className="max-w-6xl mx-auto w-full p-4 space-y-2.5 flex-1">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
              <span className="uppercase text-[10px] tracking-wider text-slate-400 font-bold">
                Marked Attendance History
              </span>
              <span className="text-[11px]">{filteredSessions.length} entries</span>
            </div>

            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => {
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
                            {session.studentClass}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                          {session.subject}
                        </h3>
                      </div>

                      {/* Percentage Rate */}
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
                <h3 className="font-bold text-slate-700 text-sm">No student attendance records</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
                  Tap "Mark Attendance" above to record student attendance for today.
                </p>
              </div>
            )}
          </div>

          {/* Mark Attendance Modal */}
          <MarkAttendanceModal
            isOpen={isMarkModalOpen}
            onClose={() => setIsMarkModalOpen(false)}
            students={students}
            onSaveAttendance={onSaveAttendance}
          />

          {/* Detail Modal with Edit and Delete capabilities */}
          <AttendanceSessionDetailModal
            session={selectedSession}
            isOpen={Boolean(selectedSession)}
            onClose={() => setSelectedSessionId(null)}
            onUpdateSession={onUpdateAttendanceSession}
            onDeleteSession={onDeleteAttendanceSession}
          />
        </>
      )}
    </div>
  );
}
