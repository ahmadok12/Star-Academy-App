import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ClipboardCheck,
  Download,
  MessageCircle,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { downloadHtmlAsPDF, shareHtmlAsPDFToWhatsApp } from '../../utils/exportShareUtils';
import { CLASS_SECTIONS } from '../../constants/academicData';

export default function StudentAttendanceReport({
  attendanceSessions = [],
  allStudents = [],
  currentSession = '2026 - 27',
  onBack
}) {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate Student Attendance Aggregates
  const attendanceData = useMemo(() => {
    let grandTotal = 0;
    let grandPresent = 0;
    let grandAbsent = 0;
    let grandLeave = 0;

    const studentStats = {};
    const classStats = {
      '9th': { total: 0, present: 0 },
      '10th': { total: 0, present: 0 },
      'FSc Part 1': { total: 0, present: 0 },
      'FSc Part 2': { total: 0, present: 0 }
    };

    // Initialize students
    allStudents.forEach(s => {
      studentStats[s.id] = {
        student: s,
        total: 0,
        present: 0,
        absent: 0,
        leave: 0
      };
    });

    attendanceSessions.forEach(sess => {
      const cls = sess.studentClass;
      (sess.records || []).forEach(r => {
        grandTotal++;
        const st = (r.status || 'Present').toLowerCase();
        if (classStats[cls]) classStats[cls].total++;

        if (st === 'present') {
          grandPresent++;
          if (classStats[cls]) classStats[cls].present++;
        } else if (st === 'absent') {
          grandAbsent++;
        } else {
          grandLeave++;
        }

        if (studentStats[r.studentId]) {
          studentStats[r.studentId].total++;
          if (st === 'present') studentStats[r.studentId].present++;
          else if (st === 'absent') studentStats[r.studentId].absent++;
          else studentStats[r.studentId].leave++;
        }
      });
    });

    const overallRate = grandTotal > 0 ? ((grandPresent / grandTotal) * 100).toFixed(1) : '0.0';

    const studentsList = Object.values(studentStats).map(item => {
      const rate = item.total > 0 ? ((item.present / item.total) * 100).toFixed(1) : '100.0';
      return {
        ...item,
        rate: Number(rate)
      };
    }).sort((a, b) => a.rate - b.rate); // Sort by lowest attendance first to highlight critical cases

    return {
      grandTotal,
      grandPresent,
      grandAbsent,
      grandLeave,
      overallRate,
      classStats,
      studentsList,
      totalSessions: attendanceSessions.length
    };
  }, [attendanceSessions, allStudents]);

  const allUniqueSections = useMemo(() => {
    const set = new Set();
    Object.values(CLASS_SECTIONS).forEach(arr => arr.forEach(s => set.add(s)));
    return Array.from(set);
  }, []);

  const availableSections = useMemo(() => {
    if (selectedClass === 'ALL') return allUniqueSections;
    return CLASS_SECTIONS[selectedClass] || [];
  }, [selectedClass, allUniqueSections]);

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    if (cls !== 'ALL') {
      const allowed = CLASS_SECTIONS[cls] || [];
      if (selectedSection !== 'ALL' && !allowed.includes(selectedSection)) {
        setSelectedSection('ALL');
      }
    }
  };

  const filteredStudents = useMemo(() => {
    return attendanceData.studentsList.filter(item => {
      const s = item.student;
      if (selectedClass !== 'ALL' && s.studentClass !== selectedClass) return false;
      if (selectedSection !== 'ALL') {
        const sec = s.section || s.subject;
        if (sec !== selectedSection) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
        const id = (s.id || '').toLowerCase();
        return fullName.includes(q) || id.includes(q);
      }
      return true;
    });
  }, [attendanceData.studentsList, selectedClass, selectedSection, searchQuery]);

  const classes = ['ALL', '9th', '10th', 'FSc Part 1', 'FSc Part 2'];

  const getReportHtml = () => {
    const rowsHtml = filteredStudents.map((item, idx) => {
      const s = item.student;
      const isCritical = item.rate < 75;
      return `
        <tr>
          <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
          <td><strong>${s.firstName} ${s.lastName}</strong><br /><small style="color: #64748b;">Roll: ${s.id} • ${s.studentClass} (${s.section || 'A'})</small></td>
          <td style="text-align: center;">${item.total}</td>
          <td style="text-align: center; color: #166534; font-weight: bold;">${item.present}</td>
          <td style="text-align: center; color: #b91c1c; font-weight: bold;">${item.absent}</td>
          <td style="text-align: center; color: #92400e;">${item.leave}</td>
          <td style="text-align: center;"><span class="badge ${item.rate >= 80 ? 'badge-green' : isCritical ? 'badge-amber' : 'badge-blue'}">${item.rate}%</span></td>
          <td style="text-align: center;">${isCritical ? '<strong style="color: #b91c1c;">ATTENTION REQUIRED</strong>' : 'Normal'}</td>
        </tr>
      `;
    }).join('');

    return `
      <h2 class="section-title">Star Academy - Student Attendance & Regularity Audit</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Academic Session:</span>
          <span class="info-value">${currentSession}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Sessions Marked:</span>
          <span class="info-value">${attendanceData.totalSessions} Daily Registers</span>
        </div>
        <div class="info-item">
          <span class="info-label">Overall Academy Regularity:</span>
          <span class="info-value" style="color: #166534; font-size: 11pt;">${attendanceData.overallRate}%</span>
        </div>
        <div class="info-item">
          <span class="info-label">Student-Day Attendances:</span>
          <span class="info-value">${attendanceData.grandTotal} Marked Records</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Student Name & ID</th>
            <th style="text-align: center;">Sessions</th>
            <th style="text-align: center;">Present</th>
            <th style="text-align: center;">Absent</th>
            <th style="text-align: center;">Leave</th>
            <th style="text-align: center;">Percentage</th>
            <th style="text-align: center;">Academic Status</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="8" style="text-align: center;">No student attendance data recorded</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const handleDownloadPDF = () => {
    const title = `Student Attendance Audit - ${currentSession}`;
    const filename = `Student_Attendance_Report_${currentSession.replace(/\s+/g, '_')}`;
    downloadHtmlAsPDF(title, getReportHtml(), filename);
  };

  const handleShareWhatsApp = () => {
    const title = `Student Attendance Audit - ${currentSession}`;
    const filename = `Student_Attendance_Report_${currentSession.replace(/\s+/g, '_')}`;
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

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registers Marked</span>
          <p className="text-lg font-black text-slate-900 mt-1">{attendanceData.totalSessions}</p>
          <span className="text-[10px] text-slate-500 font-bold">Recorded Sessions</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-200/90 bg-emerald-50/20 shadow-xs">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Total Present</span>
          <p className="text-lg font-black text-emerald-700 mt-1">{attendanceData.grandPresent}</p>
          <span className="text-[10px] text-emerald-600 font-bold">{attendanceData.overallRate}% Attendance</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-rose-200/90 bg-rose-50/20 shadow-xs">
          <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Total Absent</span>
          <p className="text-lg font-black text-rose-700 mt-1">{attendanceData.grandAbsent}</p>
          <span className="text-[10px] text-rose-600 font-bold">Unexcused Absences</span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200/90 bg-amber-50/20 shadow-xs">
          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Approved Leaves</span>
          <p className="text-lg font-black text-amber-700 mt-1">{attendanceData.grandLeave}</p>
          <span className="text-[10px] text-amber-700 font-bold">Documented Leaves</span>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Student Attendance Ledger ({filteredStudents.length})</span>
          </h3>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Class Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Class:
          </span>
          {classes.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => handleSelectClass(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedClass === c
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Section Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            Section:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSection('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedSection === 'ALL'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Sections
          </button>
          {availableSections.map(sec => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSection(sec)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedSection === sec
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[560px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3 text-center">Sessions</th>
                <th className="py-2.5 px-3 text-center">Present</th>
                <th className="py-2.5 px-3 text-center">Absent</th>
                <th className="py-2.5 px-3 text-center">Leave</th>
                <th className="py-2.5 px-3 text-center">Rate %</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-400">
                    No student attendance records found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(item => {
                  const s = item.student;
                  const isCritical = item.rate < 75;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{s.firstName} {s.lastName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.id}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                          {s.studentClass} ({s.section || 'A'})
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-700">{item.total}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{item.present}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-rose-600">{item.absent}</td>
                      <td className="py-2.5 px-3 text-center text-amber-700">{item.leave}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          item.rate >= 80 ? 'bg-emerald-100 text-emerald-800' : isCritical ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.rate}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {isCritical ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            <AlertTriangle className="w-3 h-3" /> Low Attendance
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-emerald-700">
                            Regular
                          </span>
                        )}
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
