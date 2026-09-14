import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  GraduationCap,
  Eye,
  User,
  Phone,
  Calendar,
  Clock,
  Coins,
  ShieldCheck,
  Filter,
  X,
  Printer,
  MessageCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserX,
  Users
} from 'lucide-react';
import {
  exportTeacherProfilePDF,
  printTeacherProfile,
  shareTeacherProfileWhatsApp
} from '../../utils/exportShareUtils';

export default function TeacherProfileDirectory({
  teachers = [],
  teacherAttendanceSessions = [],
  onBack,
  onSelectTeacher
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All'); // 'All', 'Active', 'Left'
  const [selectedDept, setSelectedDept] = useState('All');

  // Compute attendance stats per teacher across all sessions
  const teacherStatsMap = useMemo(() => {
    const map = {};

    teachers.forEach((t) => {
      map[t.id] = {
        total: 0,
        present: 0,
        late: 0,
        absent: 0,
        leave: 0,
        totalMinutesLate: 0
      };
    });

    teacherAttendanceSessions.forEach((sess) => {
      (sess.records || []).forEach((r) => {
        if (!map[r.teacherId]) {
          map[r.teacherId] = {
            total: 0,
            present: 0,
            late: 0,
            absent: 0,
            leave: 0,
            totalMinutesLate: 0
          };
        }

        const st = r.status || 'Present';
        map[r.teacherId].total++;
        if (st === 'Present') map[r.teacherId].present++;
        else if (st === 'Late') {
          map[r.teacherId].late++;
          map[r.teacherId].totalMinutesLate += Number(r.minutesLate) || 0;
        } else if (st === 'Absent') map[r.teacherId].absent++;
        else if (st === 'Leave') map[r.teacherId].leave++;
      });
    });

    return map;
  }, [teachers, teacherAttendanceSessions]);

  // Distinct departments
  const departments = useMemo(() => {
    const depts = new Set();
    teachers.forEach((t) => {
      if (t.department) depts.add(t.department);
    });
    return ['All', ...Array.from(depts).sort()];
  }, [teachers]);

  // Overall statistics
  const summaryStats = useMemo(() => {
    const totalTeachers = teachers.length;
    const activeCount = teachers.filter((t) => !t.isLeft && t.isActive !== false).length;
    const leftCount = totalTeachers - activeCount;

    let grandTotal = 0;
    let grandAttended = 0;
    Object.values(teacherStatsMap).forEach((st) => {
      grandTotal += st.total;
      grandAttended += (st.present + st.late);
    });
    const avgAttendanceRate = grandTotal > 0 ? Math.round((grandAttended / grandTotal) * 100) : 100;

    return { totalTeachers, activeCount, leftCount, avgAttendanceRate };
  }, [teachers, teacherStatsMap]);

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const isLeft = Boolean(t.isLeft || t.isActive === false);

      // Status filter
      if (selectedStatus === 'Active' && isLeft) return false;
      if (selectedStatus === 'Left' && !isLeft) return false;

      // Department filter
      if (selectedDept !== 'All' && (t.department || '') !== selectedDept) return false;

      // Search term filter
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase().trim();
      const nameMatch = (t.name || '').toLowerCase().includes(q);
      const idMatch = (t.id || '').toLowerCase().includes(q);
      const cnicMatch = (t.cnic || '').includes(q);
      const phoneMatch = (t.contactNumber || '').includes(q) || (t.secondaryContactNumber || '').includes(q);
      const deptMatch = (t.department || '').toLowerCase().includes(q);
      const classesMatch = (t.assignedClasses || []).some((c) => c.toLowerCase().includes(q));
      const slotMatch = (t.teachingSlots || []).some(
        (s) => (s.subject || '').toLowerCase().includes(q) || (s.time || '').includes(q)
      );

      return nameMatch || idMatch || cnicMatch || phoneMatch || deptMatch || classesMatch || slotMatch;
    });
  }, [teachers, searchTerm, selectedStatus, selectedDept]);

  return (
    <div className="flex flex-col flex-1 max-w-6xl mx-auto w-full p-3 sm:p-4 md:p-6 space-y-4">
      {/* Top Header with Back Navigation */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#F3F4F6] text-slate-700 text-xs sm:text-sm font-semibold border border-[#E5E7EB] transition-all tap-active cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 font-display">
              <GraduationCap className="w-5 h-5 text-[#111827]" />
              Teacher Profiles & Analytics
            </h1>
            <p className="text-xs text-[#575E70] font-medium">
              Faculty profiles, lecture timings, attendance records & performance tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
          <span className="px-3.5 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-full border border-[#E5E7EB]">
            {teachers.length} Total Faculty
          </span>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-[#575E70] uppercase tracking-wider block font-sans">
            Total Registered
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {summaryStats.totalTeachers}
            </span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block font-sans">
            Active Faculty
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-bold text-emerald-700 font-display">
              {summaryStats.activeCount}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block font-sans">
            Left Academy
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-bold text-rose-700 font-display">
              {summaryStats.leftCount}
            </span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] font-bold text-[#111827] uppercase tracking-wider block font-sans">
            Faculty Attendance
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl sm:text-2xl font-bold text-[#111827] font-display">
              {summaryStats.avgAttendanceRate}%
            </span>
            <div className="w-10 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#111827] rounded-full"
                style={{ width: `${summaryStats.avgAttendanceRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-[#E5E7EB] space-y-3 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search faculty by name, ID, CNIC, phone, subject, classes..."
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

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-[#F3F4F6] p-1 rounded-full border border-[#E5E7EB]">
            {['All', 'Active', 'Left'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'text-[#575E70] hover:text-[#111827]'
                }`}
              >
                {st === 'All' ? 'All Faculty' : st === 'Active' ? 'Active' : 'Left Academy'}
              </button>
            ))}
          </div>
        </div>

        {/* Departments Filter Chips */}
        {departments.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar pt-2 border-t border-[#E5E7EB]">
            <span className="text-[10px] font-bold text-[#575E70] uppercase mr-1 shrink-0">
              Department:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDept === dept
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'bg-[#F3F4F6] hover:bg-[#edeef0] text-[#575E70]'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Teacher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => {
            const isLeft = Boolean(teacher.isLeft || teacher.isActive === false);
            const stats = teacherStatsMap[teacher.id] || {
              total: 0,
              present: 0,
              late: 0,
              absent: 0,
              leave: 0
            };
            const attendanceRate =
              stats.total > 0 ? Math.round(((stats.present + stats.late) / stats.total) * 100) : 100;
            const formattedSalary = teacher.salary
              ? Number(teacher.salary).toLocaleString()
              : '60,000';

            return (
              <div
                key={teacher.id}
                className={`bg-white rounded-3xl border transition-all flex flex-col justify-between overflow-hidden relative shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] hover:shadow-md ${
                  isLeft ? 'border-rose-200 bg-rose-50/15' : 'border-[#E5E7EB]'
                }`}
              >
                {/* Card Top Section */}
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-start gap-3.5">
                    {/* Fixed Photo */}
                    <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-2xl overflow-hidden bg-slate-100 border border-[#E5E7EB] shrink-0 shadow-2xs relative">
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
                        <div className="absolute inset-0 bg-[#111827]/60 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white uppercase tracking-wider bg-rose-600 px-1.5 py-0.5 rounded-full">
                            Left
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold text-[#111827] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                          {teacher.id}
                        </span>
                        {isLeft ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                            Left Academy
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm truncate mt-1 font-display">
                        {teacher.name}
                      </h3>

                      <p className="text-xs text-[#575E70] font-medium truncate">
                        {teacher.department || 'General Faculty'}
                      </p>
                    </div>
                  </div>

                  {/* Metadata Chips: Salary & Lecture Times */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Coins className="w-2.5 h-2.5 text-emerald-600" />
                      PKR {formattedSalary} / mo
                    </span>

                    {teacher.teachingSlots && teacher.teachingSlots.length > 0 ? (
                      teacher.teachingSlots.map((slot, sIdx) => (
                        <span
                          key={slot.id || sIdx}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200"
                          title={`${slot.subject} at ${slot.time}`}
                        >
                          <Clock className="w-2.5 h-2.5 text-amber-600" />
                          {slot.time}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-2.5 h-2.5 text-amber-600" />
                        {teacher.arrivalTime || '15:00'}
                      </span>
                    )}
                  </div>

                  {/* Attendance Analytics Snapshot Block */}
                  <div className="bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#575E70] uppercase tracking-wider">
                        Attendance Rate
                      </span>
                      <span
                        className={`text-xs font-bold font-mono ${
                          attendanceRate >= 85
                            ? 'text-emerald-700'
                            : attendanceRate >= 70
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {attendanceRate}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          attendanceRate >= 85
                            ? 'bg-emerald-500'
                            : attendanceRate >= 70
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                        style={{ width: `${attendanceRate}%` }}
                      />
                    </div>

                    {/* Small Breakdown counters */}
                    <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] pt-1">
                      <div className="bg-emerald-100/70 text-emerald-900 py-1 px-1 rounded-xl font-semibold">
                        <span className="block text-[8px] text-emerald-700 uppercase">Pres</span>
                        {stats.present}
                      </div>
                      <div className="bg-amber-100/70 text-amber-900 py-1 px-1 rounded-xl font-semibold">
                        <span className="block text-[8px] text-amber-700 uppercase">Late</span>
                        {stats.late}
                      </div>
                      <div className="bg-rose-100/70 text-rose-900 py-1 px-1 rounded-xl font-semibold">
                        <span className="block text-[8px] text-rose-700 uppercase">Abs</span>
                        {stats.absent}
                      </div>
                      <div className="bg-slate-200/70 text-slate-800 py-1 px-1 rounded-xl font-semibold">
                        <span className="block text-[8px] text-slate-600 uppercase">Leave</span>
                        {stats.leave}
                      </div>
                    </div>
                  </div>

                  {/* Contact Footer line */}
                  <div className="flex items-center justify-between text-[10px] text-[#575E70] pt-1">
                    <span className="font-mono truncate">
                      CNIC: <span className="font-semibold text-slate-700">{teacher.cnic || 'N/A'}</span>
                    </span>
                    <a
                      href={`tel:${teacher.contactNumber}`}
                      className="flex items-center gap-1 font-mono text-[#111827] hover:underline shrink-0 font-semibold"
                    >
                      <Phone className="w-3 h-3" />
                      {teacher.contactNumber}
                    </a>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-3 bg-[#F8F9FB] border-t border-[#E5E7EB] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectTeacher(teacher)}
                    className="flex-1 py-2 px-3 bg-[#111827] hover:bg-[#1F2937] text-white rounded-full text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-1.5 tap-active cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile & Analytics</span>
                  </button>

                  <button
                    type="button"
                    title="Print Profile & Attendance Report"
                    onClick={() => printTeacherProfile(teacher, { teacherAttendanceSessions })}
                    className="w-9 h-9 rounded-full bg-white hover:bg-[#F3F4F6] border border-[#E5E7EB] text-slate-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    title="Share via WhatsApp"
                    onClick={() => shareTeacherProfileWhatsApp(teacher, { teacherAttendanceSessions })}
                    className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 text-sm">No teacher profiles found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[260px] mx-auto">
              {searchTerm || selectedStatus !== 'All' || selectedDept !== 'All'
                ? 'No teachers match your search or filter criteria.'
                : 'No teachers registered in the academy yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
