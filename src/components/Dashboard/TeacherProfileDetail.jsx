import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Calendar,
  Clock,
  Coins,
  ShieldCheck,
  User,
  Phone,
  MapPin,
  BookOpen,
  Layers,
  Printer,
  Download,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock3,
  UserX,
  Filter,
  Search,
  X
} from 'lucide-react';
import {
  exportTeacherProfilePDF,
  printTeacherProfile,
  shareTeacherProfileWhatsApp
} from '../../utils/exportShareUtils';
import { formatTimeTo12Hour } from '../../utils/storage';

export default function TeacherProfileDetail({
  teacher,
  onBack,
  teacherAttendanceSessions = [],
  onToggleTeacherStatus,
  timetables = []
}) {
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance', 'overview', 'schedule'
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  if (!teacher) return null;

  const isLeft = Boolean(teacher.isLeft || teacher.isActive === false);
  const formattedSalary = teacher.salary
    ? Number(teacher.salary).toLocaleString()
    : '60,000';

  // 1. Compute Full Attendance Logs and Analytics for this teacher
  const attendanceData = useMemo(() => {
    const logs = [];
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let totalLateMinutes = 0;

    teacherAttendanceSessions.forEach((session) => {
      (session.records || []).forEach((r) => {
        if (r.teacherId === teacher.id) {
          const st = r.status || 'Present';
          const minsLate = Number(r.minutesLate) || 0;

          if (st === 'Present') presentCount++;
          else if (st === 'Late') {
            lateCount++;
            totalLateMinutes += minsLate;
          } else if (st === 'Absent') absentCount++;
          else if (st === 'Leave') leaveCount++;

          logs.push({
            sessionId: session.id,
            date: session.date,
            slotId: r.slotId || 'slot-1',
            time: r.slotTime || session.expectedStartTime || '15:00',
            subject: r.subject || teacher.department || 'General Faculty',
            status: st,
            arrivalTime: r.arrivalTime || (st === 'Late' ? 'Late' : (st === 'Present' ? 'On Time' : '-')),
            minutesLate: minsLate,
            isLate: st === 'Late' || minsLate > 0
          });
        }
      });
    });

    logs.sort((a, b) => new Date(b.date) - new Date(a.date));

    const totalMarked = presentCount + lateCount + absentCount + leaveCount;
    const presenceRate =
      totalMarked > 0 ? Math.round(((presentCount + lateCount) / totalMarked) * 100) : 100;
    const punctualityRate =
      totalMarked > 0 ? Math.round((presentCount / totalMarked) * 100) : 100;
    const avgLateMinutes =
      lateCount > 0 ? Math.round(totalLateMinutes / lateCount) : 0;

    return {
      logs,
      presentCount,
      lateCount,
      absentCount,
      leaveCount,
      totalMarked,
      totalLateMinutes,
      avgLateMinutes,
      presenceRate,
      punctualityRate
    };
  }, [teacher.id, teacher.department, teacherAttendanceSessions]);

  // 2. Filter attendance logs by status and search term
  const filteredLogs = useMemo(() => {
    return attendanceData.logs.filter((log) => {
      if (statusFilter !== 'All' && log.status !== statusFilter) return false;
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      return (
        log.date.includes(q) ||
        (log.subject || '').toLowerCase().includes(q) ||
        (log.time || '').includes(q)
      );
    });
  }, [attendanceData.logs, statusFilter, searchTerm]);

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full p-3 sm:p-4 md:p-6 space-y-4 pb-20">
      {/* Top Header with Back Button and Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F3F4F6] text-slate-700 text-xs sm:text-sm font-semibold border border-[#E5E7EB] transition-all tap-active cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Teachers</span>
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#111827] bg-[#F3F4F6] border border-[#E5E7EB] px-2.5 py-0.5 rounded-full">
                {teacher.id}
              </span>
              {isLeft ? (
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                  Left Academy (Inactive)
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  Active Faculty
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-display">
              {teacher.name}
            </h1>
          </div>
        </div>

        {/* Action Buttons: Print, PDF, WhatsApp */}
        <div className="flex items-center gap-2 flex-wrap self-stretch md:self-auto justify-end">
          <button
            type="button"
            onClick={() => printTeacherProfile(teacher, { teacherAttendanceSessions })}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F3F4F6] text-slate-700 text-xs font-semibold border border-[#E5E7EB] transition-all tap-active cursor-pointer shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={() => exportTeacherProfilePDF(teacher, { teacherAttendanceSessions })}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#111827] hover:bg-[#1F2937] text-white text-xs font-semibold transition-all tap-active cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save PDF</span>
          </button>

          <button
            type="button"
            onClick={() => shareTeacherProfileWhatsApp(teacher, { teacherAttendanceSessions })}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm tap-active cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-[#111827] rounded-3xl p-5 sm:p-6 text-white shadow-stitch-lg relative overflow-hidden border border-[#1F2937]">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 min-w-[80px] min-h-[80px] rounded-2xl border-2 border-white/20 overflow-hidden shadow-xl bg-white/10 relative">
              <img
                src={teacher.pic}
                alt={teacher.name}
                className={`w-full h-full object-cover ${isLeft ? 'grayscale' : ''}`}
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                }}
              />
              {isLeft && (
                <div className="absolute inset-0 bg-[#111827]/70 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider bg-rose-600 px-2 py-0.5 rounded-full">
                    Left
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#FF7A59] uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#FF7A59]" />
                {teacher.department || 'General Faculty'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight font-display">
                {teacher.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {teacher.contactNumber || 'N/A'}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-300">CNIC: {teacher.cnic || 'N/A'}</span>
                <span>•</span>
                <span className="text-slate-300">Joined: {teacher.joinedAt || '2026-01-10'}</span>
              </div>
            </div>
          </div>

          {/* Left Academy Status Checkbox inside Hero */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 sm:max-w-xs self-stretch sm:self-auto">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isLeft}
                onChange={(e) =>
                  onToggleTeacherStatus && onToggleTeacherStatus(teacher.id, e.target.checked)
                }
                className="mt-0.5 w-4 h-4 rounded text-rose-500 focus:ring-rose-400 border-white/40 cursor-pointer accent-rose-500"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Left the Academy</span>
                  {isLeft ? (
                    <span className="text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full">
                      INACTIVE
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                  {isLeft
                    ? 'Marked inactive. Hidden from attendance marking & salary.'
                    : 'Check to deactivate teacher when leaving academy.'}
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Attendance Compliance Rate */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-[#575E70] uppercase tracking-wider block">
            Presence Rate
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span
              className={`text-xl sm:text-2xl font-bold font-display ${
                attendanceData.presenceRate >= 85
                  ? 'text-emerald-700'
                  : attendanceData.presenceRate >= 70
                  ? 'text-amber-700'
                  : 'text-rose-700'
              }`}
            >
              {attendanceData.presenceRate}%
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-[#575E70] block mt-0.5">
            {attendanceData.presentCount + attendanceData.lateCount} of {attendanceData.totalMarked} marked
          </span>
        </div>

        {/* Total Lectures Recorded */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-[#575E70] uppercase tracking-wider block">
            Total Lectures
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {attendanceData.totalMarked}
            </span>
            <Clock3 className="w-4 h-4 text-[#111827]" />
          </div>
          <span className="text-[10px] text-[#575E70] block mt-0.5">Sessions logged</span>
        </div>

        {/* On Time Days */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
            On-Time Present
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-bold text-emerald-700 font-display">
              {attendanceData.presentCount}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-[#575E70] block mt-0.5">Punctual arrival</span>
        </div>

        {/* Late Days */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
            Late Days
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-bold text-amber-700 font-display">
              {attendanceData.lateCount}
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-[10px] text-[#575E70] block mt-0.5">
            {attendanceData.totalLateMinutes > 0 ? `+${attendanceData.totalLateMinutes}m total late` : 'No delays'}
          </span>
        </div>

        {/* Absent Days */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
            Absences
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-bold text-rose-700 font-display">
              {attendanceData.absentCount}
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-[10px] text-[#575E70] block mt-0.5">Unexcused</span>
        </div>

        {/* Compensation */}
        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-[#575E70] uppercase tracking-wider block">
            Monthly Salary
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-lg sm:text-xl font-bold text-emerald-800 font-display">
              {formattedSalary}
            </span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-[#575E70] block mt-0.5">PKR / month</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-full border border-[#E5E7EB] p-1.5 flex items-center gap-1.5 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
        <button
          type="button"
          onClick={() => setActiveTab('attendance')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-[#111827] text-white shadow-sm'
              : 'text-[#575E70] hover:text-[#111827]'
          }`}
        >
          Complete Attendance Record ({attendanceData.logs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#111827] text-white shadow-sm'
              : 'text-[#575E70] hover:text-[#111827]'
          }`}
        >
          Teacher Information & Contact
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'schedule'
              ? 'bg-[#111827] text-white shadow-sm'
              : 'text-[#575E70] hover:text-[#111827]'
          }`}
        >
          Assigned Lectures & Timings ({teacher.teachingSlots?.length || 1})
        </button>
      </div>

      {/* TAB 1: COMPLETE ATTENDANCE RECORD & LOGS */}
      {activeTab === 'attendance' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-4 sm:p-5 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5E7EB] pb-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 font-display">
                <Clock className="w-4 h-4 text-[#111827]" />
                Complete Attendance History & Punctuality
              </h3>
              <p className="text-xs text-[#575E70]">
                Detailed record of every lecture slot marked for this faculty member
              </p>
            </div>

            {/* Attendance Filter Buttons */}
            <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-full border border-[#E5E7EB] flex-wrap">
              {['All', 'Present', 'Late', 'Absent', 'Leave'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'text-[#575E70] hover:text-[#111827]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search within logs */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by date (YYYY-MM-DD), subject, or lecture time..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 bg-[#F8F9FB] hover:bg-slate-100/70 focus:bg-white text-xs rounded-full border border-[#E5E7EB] focus:border-[#111827] focus:ring-1 focus:ring-[#111827] transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Table of Records */}
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">#</th>
                  <th className="py-3 px-3.5">Date</th>
                  <th className="py-3 px-3.5">Lecture Time</th>
                  <th className="py-3 px-3.5">Subject</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5">Arrival Time</th>
                  <th className="py-3 px-3.5 text-center">Punctuality / Delay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, idx) => {
                    const statusClass =
                      log.status === 'Present'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : log.status === 'Late'
                        ? 'bg-amber-100 text-amber-900 border-amber-200'
                        : log.status === 'Absent'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-indigo-100 text-indigo-800 border-indigo-200';

                    return (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3.5 text-center font-mono text-slate-400 font-semibold text-[11px]">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3.5 font-bold text-slate-800 whitespace-nowrap">
                          {log.date}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-600 font-mono font-semibold whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {log.time}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-semibold text-slate-700">
                          {log.subject}
                        </td>
                        <td className="py-2.5 px-3.5 text-center whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusClass}`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 font-mono text-slate-600 text-[11px]">
                          {log.arrivalTime || '-'}
                        </td>
                        <td className="py-2.5 px-3.5 text-center font-mono text-[11px]">
                          {log.minutesLate > 0 ? (
                            <span className="text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                              +{log.minutesLate} min late
                            </span>
                          ) : log.status === 'Present' ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                              On Time
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-xs text-slate-600">No attendance logs found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {statusFilter !== 'All' || searchTerm
                          ? 'No attendance records match your filter criteria.'
                          : 'Attendance has not yet been recorded for this teacher.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW & TEACHER INFORMATION */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Faculty Personal & Official Details
            </h3>
            <p className="text-xs text-slate-500">
              Verified identity, contact information and employment terms
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Primary Phone
              </span>
              <a
                href={`tel:${teacher.contactNumber}`}
                className="font-mono font-bold text-indigo-600 text-sm flex items-center gap-1.5 hover:underline mt-1"
              >
                <Phone className="w-3.5 h-3.5 text-indigo-500" />
                {teacher.contactNumber || 'N/A'}
              </a>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Secondary Phone
              </span>
              <span className="font-mono font-bold text-slate-700 text-sm flex items-center gap-1.5 mt-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {teacher.secondaryContactNumber || 'None provided'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                National ID / CNIC
              </span>
              <span className="font-mono font-bold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {teacher.cnic || 'N/A'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Date of Joining
              </span>
              <span className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {teacher.joinedAt || '2026-01-10'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Department
              </span>
              <span className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mt-1">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                {teacher.department || 'General Faculty'}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Monthly Salary
              </span>
              <span className="font-mono font-extrabold text-emerald-700 text-sm flex items-center gap-1.5 mt-1">
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
                PKR {formattedSalary}
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 sm:col-span-2 md:col-span-3">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Residential Address
              </span>
              <span className="font-medium text-slate-700 text-xs flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {teacher.address || 'Address not specified on profile.'}
              </span>
            </div>
          </div>

          {/* Assigned Classes */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Assigned Classes & Sections
            </span>
            {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacher.assignedClasses.map((cls, cIdx) => (
                  <span
                    key={cIdx}
                    className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No specific classes assigned.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULE & TIMETABLE SLOTS */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Configured Teaching Slots & Lecture Timetable
            </h3>
            <p className="text-xs text-slate-500">
              Each lecture slot is tracked independently for daily attendance marking
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {teacher.teachingSlots && teacher.teachingSlots.length > 0 ? (
              teacher.teachingSlots.map((slot, sIdx) => {
                const assignedClass =
                  slot.assignedClass ||
                  (teacher.assignedClasses && teacher.assignedClasses[sIdx]) ||
                  (teacher.assignedClasses && teacher.assignedClasses.length === 1 ? teacher.assignedClasses[0] : null);

                return (
                  <div
                    key={slot.id || sIdx}
                    className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                        Slot #{sIdx + 1}
                      </span>
                      <span className="font-mono text-xs font-bold text-amber-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        {formatTimeTo12Hour(slot.time)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {slot.subject || teacher.department || 'General Faculty'}
                      </h4>
                      {assignedClass && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {assignedClass}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500">
                      Daily scheduled lecture time for separate attendance logging.
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Default Slot
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {formatTimeTo12Hour(teacher.arrivalTime || '15:00')}
                  </span>
                </div>

                <h4 className="font-extrabold text-slate-900 text-sm">
                  {teacher.department || 'General Faculty'}
                </h4>

                <p className="text-[11px] text-slate-500">
                  Standard expected lecture time. Edit teacher to add multiple lecture timings.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
