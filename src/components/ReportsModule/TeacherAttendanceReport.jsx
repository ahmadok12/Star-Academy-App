import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Download,
  MessageCircle,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Users
} from 'lucide-react';
import { downloadHtmlAsPDF, shareHtmlAsPDFToWhatsApp } from '../../utils/exportShareUtils';

export default function TeacherAttendanceReport({
  teacherAttendanceSessions = [],
  teachers = [],
  currentSession = '2026 - 27',
  onBack
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const attendanceData = useMemo(() => {
    let grandTotal = 0;
    let grandPresent = 0;
    let grandAbsent = 0;
    let grandLeave = 0;

    const teacherStats = {};

    teachers.forEach(t => {
      teacherStats[t.id] = {
        teacher: t,
        total: 0,
        present: 0,
        absent: 0,
        leave: 0
      };
    });

    teacherAttendanceSessions.forEach(sess => {
      (sess.records || []).forEach(r => {
        grandTotal++;
        const st = (r.status || 'Present').toLowerCase();

        if (st === 'present') grandPresent++;
        else if (st === 'absent') grandAbsent++;
        else grandLeave++;

        if (teacherStats[r.teacherId]) {
          teacherStats[r.teacherId].total++;
          if (st === 'present') teacherStats[r.teacherId].present++;
          else if (st === 'absent') teacherStats[r.teacherId].absent++;
          else teacherStats[r.teacherId].leave++;
        }
      });
    });

    const overallRate = grandTotal > 0 ? ((grandPresent / grandTotal) * 100).toFixed(1) : '100.0';

    const list = Object.values(teacherStats).map(item => {
      const rate = item.total > 0 ? ((item.present / item.total) * 100).toFixed(1) : '100.0';
      return {
        ...item,
        rate: Number(rate)
      };
    });

    return {
      grandTotal,
      grandPresent,
      grandAbsent,
      grandLeave,
      overallRate,
      list,
      totalSessions: teacherAttendanceSessions.length
    };
  }, [teacherAttendanceSessions, teachers]);

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return attendanceData.list;
    const q = searchQuery.toLowerCase();
    return attendanceData.list.filter(item => {
      const t = item.teacher;
      return (t.name || '').toLowerCase().includes(q) ||
        (t.subject || '').toLowerCase().includes(q) ||
        (t.id || '').toLowerCase().includes(q);
    });
  }, [attendanceData.list, searchQuery]);

  const getReportHtml = () => {
    const rowsHtml = filteredTeachers.map((item, idx) => {
      const t = item.teacher;
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
          <td><strong>${t.name}</strong><br /><small style="color: #64748b;">ID: ${t.id} • ${t.phone || 'N/A'}</small></td>
          <td><strong>${t.subject || 'Faculty'}</strong></td>
          <td style="text-align: center;">${item.total}</td>
          <td style="text-align: center; color: #166534; font-weight: bold;">${item.present}</td>
          <td style="text-align: center; color: #b91c1c; font-weight: bold;">${item.absent}</td>
          <td style="text-align: center; color: #92400e;">${item.leave}</td>
          <td style="text-align: center;"><span class="badge ${item.rate >= 90 ? 'badge-green' : 'badge-amber'}">${item.rate}%</span></td>
        </tr>
      `;
    }).join('');

    return `
      <h2 class="section-title">Star Academy - Faculty & Teacher Attendance Register</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Academic Session:</span>
          <span class="info-value">${currentSession}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Faculty Registers Marked:</span>
          <span class="info-value">${attendanceData.totalSessions} Working Days</span>
        </div>
        <div class="info-item">
          <span class="info-label">Faculty Attendance Compliance:</span>
          <span class="info-value" style="color: #166534; font-size: 11pt;">${attendanceData.overallRate}%</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Faculty Headcount:</span>
          <span class="info-value">${teachers.length} Instructors</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Teacher Name & ID</th>
            <th>Department / Subject</th>
            <th style="text-align: center;">Working Days</th>
            <th style="text-align: center;">Present</th>
            <th style="text-align: center;">Absent</th>
            <th style="text-align: center;">Leave</th>
            <th style="text-align: center;">Attendance %</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="8" style="text-align: center;">No faculty attendance marked yet</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const handleDownloadPDF = () => {
    const title = `Faculty Attendance Audit - ${currentSession}`;
    const filename = `Teacher_Attendance_Report_${currentSession.replace(/\s+/g, '_')}`;
    downloadHtmlAsPDF(title, getReportHtml(), filename);
  };

  const handleShareWhatsApp = () => {
    const title = `Faculty Attendance Audit - ${currentSession}`;
    const filename = `Teacher_Attendance_Report_${currentSession.replace(/\s+/g, '_')}`;
    shareHtmlAsPDFToWhatsApp(title, getReportHtml(), filename);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200 w-full min-w-0 overflow-x-hidden p-3.5">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-all tap-active cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-900 text-white rounded-3xl p-5 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/30 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              <GraduationCap className="w-3 h-3" />
              <span>Staff Regularity & Faculty Presence • {currentSession}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Teacher Attendance Report
            </h2>
            <p className="text-xs text-teal-100/90 font-medium">
              Faculty presence registry, approved leaves & punctuality tracking across academic departments.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-white/80 font-bold block">Faculty Regularity</span>
            <span className="text-2xl font-black text-amber-300">{attendanceData.overallRate}%</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Faculty Strength</span>
          <p className="text-lg font-black text-slate-900 mt-1">{teachers.length}</p>
          <span className="text-[10px] text-slate-500 font-bold">Active Instructors</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-200/90 bg-emerald-50/20 shadow-xs">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Present Total</span>
          <p className="text-lg font-black text-emerald-700 mt-1">{attendanceData.grandPresent}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{attendanceData.overallRate}% Attendance</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-rose-200/90 bg-rose-50/20 shadow-xs">
          <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Absences</span>
          <p className="text-lg font-black text-rose-700 mt-1">{attendanceData.grandAbsent}</p>
          <span className="text-[10px] text-rose-600 font-bold">Unexcused</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200/90 bg-amber-50/20 shadow-xs">
          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Leaves</span>
          <p className="text-lg font-black text-amber-700 mt-1">{attendanceData.grandLeave}</p>
          <span className="text-[10px] text-amber-700 font-bold">Approved Leaves</span>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-teal-600" />
            <span>Faculty Attendance Register ({filteredTeachers.length})</span>
          </h3>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search faculty name, subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Instructor</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3 text-center">Working Days</th>
                <th className="py-2.5 px-3 text-center">Present</th>
                <th className="py-2.5 px-3 text-center">Absent</th>
                <th className="py-2.5 px-3 text-center">Leave</th>
                <th className="py-2.5 px-3 text-center">Regularity %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    No faculty attendance records found.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map(item => {
                  const t = item.teacher;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{t.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{t.id}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-bold text-[10px]">
                          {t.subject || 'Faculty'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-700">{item.total}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{item.present}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-600">{item.absent}</td>
                      <td className="py-2.5 px-3 text-center text-amber-700">{item.leave}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          item.rate >= 90 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
