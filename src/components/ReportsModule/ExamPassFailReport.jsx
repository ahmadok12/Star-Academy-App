import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Award,
  Download,
  MessageCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Users
} from 'lucide-react';
import { downloadHtmlAsPDF, shareHtmlAsPDFToWhatsApp } from '../../utils/exportShareUtils';
import { CLASS_SECTIONS } from '../../constants/academicData';

export default function ExamPassFailReport({
  marksheets = [],
  allStudents = [],
  currentSession = '2026 - 27',
  onBack
}) {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const studentMap = useMemo(() => {
    const map = {};
    allStudents.forEach(s => { map[s.id] = s; });
    return map;
  }, [allStudents]);

  // Aggregate Exam Analysis
  const analysis = useMemo(() => {
    let totalCandidates = 0;
    let totalPassed = 0;
    let totalFailed = 0;

    const grades = { 'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'F': 0 };

    const examList = marksheets.map(m => {
      const scores = m.studentScores || [];
      const total = scores.length;
      let passed = 0;
      let failed = 0;

      scores.forEach(s => {
        totalCandidates++;
        const g = s.grade || (s.percentage >= 80 ? 'A+' : s.percentage >= 70 ? 'A' : s.percentage >= 60 ? 'B' : s.percentage >= 50 ? 'C' : 'F');
        if (grades[g] !== undefined) grades[g]++;
        else grades['F']++;

        if (s.isPassed || s.percentage >= 50) {
          passed++;
          totalPassed++;
        } else {
          failed++;
          totalFailed++;
        }
      });

      const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
      const topper = [...scores].sort((a, b) => (b.percentage || 0) - (a.percentage || 0))[0];
      const topperStudent = studentMap[topper?.studentId];
      const topperName = topperStudent ? `${topperStudent.firstName} ${topperStudent.lastName}` : topper?.studentName || 'N/A';

      return {
        ...m,
        total,
        passed,
        failed,
        passRate,
        topperName,
        topperPercentage: topper?.percentage || 0
      };
    });

    const overallPassRate = totalCandidates > 0 ? ((totalPassed / totalCandidates) * 100).toFixed(1) : '0.0';
    const overallFailRate = totalCandidates > 0 ? ((totalFailed / totalCandidates) * 100).toFixed(1) : '0.0';

    return {
      examList,
      totalExams: marksheets.length,
      totalCandidates,
      totalPassed,
      totalFailed,
      overallPassRate,
      overallFailRate,
      grades
    };
  }, [marksheets, studentMap]);

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

  const filteredExams = useMemo(() => {
    return analysis.examList.filter(m => {
      if (selectedClass !== 'ALL' && m.studentClass !== selectedClass) return false;
      if (selectedSection !== 'ALL' && m.section !== selectedSection) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (m.title || m.testName || '').toLowerCase().includes(q);
        const matchClass = (m.studentClass || '').toLowerCase().includes(q);
        const matchSection = (m.section || '').toLowerCase().includes(q);
        return matchTitle || matchClass || matchSection;
      }
      return true;
    });
  }, [analysis.examList, selectedClass, selectedSection, searchQuery]);

  const classes = ['ALL', '9th', '10th', 'FSc Part 1', 'FSc Part 2'];

  const getReportHtml = () => {
    const examRowsHtml = filteredExams.map((m, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${m.title || m.testName}</strong></td>
        <td>${m.studentClass} (${m.section})</td>
        <td style="text-align: center;">${m.total}</td>
        <td style="text-align: center; color: #166534; font-weight: bold;">${m.passed}</td>
        <td style="text-align: center; color: #b91c1c; font-weight: bold;">${m.failed}</td>
        <td style="text-align: center;"><span class="badge ${Number(m.passRate) >= 70 ? 'badge-green' : 'badge-amber'}">${m.passRate}%</span></td>
        <td style="text-align: center;">${m.classAverage || 0}%</td>
        <td>${m.topperName} (${m.topperPercentage}%)</td>
      </tr>
    `).join('');

    return `
      <h2 class="section-title">Star Academy - Academic Exam Performance & Pass/Fail Analysis</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Academic Session:</span>
          <span class="info-value">${currentSession}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Examinations Conducted:</span>
          <span class="info-value">${analysis.totalExams} Exam Series</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Candidates Evaluated:</span>
          <span class="info-value">${analysis.totalCandidates} Evaluations</span>
        </div>
        <div class="info-item">
          <span class="info-label">Overall Academy Passing Rate:</span>
          <span class="info-value" style="color: #166534; font-size: 11pt;">${analysis.overallPassRate}% (${analysis.totalPassed} Passed)</span>
        </div>
        <div class="info-item">
          <span class="info-label">Overall Academy Failure Rate:</span>
          <span class="info-value" style="color: #b91c1c; font-size: 11pt;">${analysis.overallFailRate}% (${analysis.totalFailed} Failed)</span>
        </div>
      </div>

      <h3 style="font-size: 11pt; font-weight: 800; margin: 16px 0 8px 0; color: #1e293b;">Exam-by-Exam Performance Audit</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Exam Title</th>
            <th>Class</th>
            <th style="text-align: center;">Appeared</th>
            <th style="text-align: center;">Passed</th>
            <th style="text-align: center;">Failed</th>
            <th style="text-align: center;">Pass %</th>
            <th style="text-align: center;">Average %</th>
            <th>1st Position Topper</th>
          </tr>
        </thead>
        <tbody>
          ${examRowsHtml || '<tr><td colspan="9" style="text-align: center;">No examination marksheets found</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const handleDownloadPDF = () => {
    const title = `Academic Result & Pass Fail Report - ${currentSession}`;
    const filename = `Exam_Pass_Fail_Analysis_${currentSession.replace(/\s+/g, '_')}`;
    downloadHtmlAsPDF(title, getReportHtml(), filename);
  };

  const handleShareWhatsApp = () => {
    const title = `Academic Result & Pass Fail Report - ${currentSession}`;
    const filename = `Exam_Pass_Fail_Analysis_${currentSession.replace(/\s+/g, '_')}`;
    shareHtmlAsPDFToWhatsApp(title, getReportHtml(), filename);
  };

  return (
    <div className="space-y-4 pb-24 animate-in fade-in duration-200 w-full min-w-0 overflow-x-hidden p-3.5">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F3F4F6] text-slate-700 text-xs font-semibold border border-[#E5E7EB] shadow-2xs transition-all tap-active cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Reports</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F3F4F6] text-slate-800 text-xs font-semibold border border-[#E5E7EB] transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] text-[#575E70] font-bold uppercase tracking-wider block">Total Candidates</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-display">
            {analysis.totalCandidates}
          </p>
          <span className="text-[11px] text-[#575E70] font-medium mt-0.5 block">
            Across {analysis.totalExams} Exam Series
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-200/80 bg-emerald-50/20 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Total Passed</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 font-display">
            {analysis.totalPassed} ({analysis.overallPassRate}%)
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Qualified Examination Threshold
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-rose-200/80 bg-rose-50/20 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] text-rose-700 font-bold uppercase tracking-wider block">Total Failed</span>
          <p className="text-xl sm:text-2xl font-bold text-rose-700 mt-1 font-display">
            {analysis.totalFailed} ({analysis.overallFailRate}%)
          </p>
          <span className="text-[11px] text-rose-600 font-medium mt-0.5 block flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Requiring Academic Remediation
          </span>
        </div>
      </div>

      {/* Grade Distribution Bar */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
          Academy Grade Spectrum Distribution
        </h3>
        <div className="grid grid-cols-5 gap-2 text-center">
          {Object.entries(analysis.grades).map(([grade, count]) => {
            const pct = analysis.totalCandidates > 0 ? ((count / analysis.totalCandidates) * 100).toFixed(0) : 0;
            return (
              <div key={grade} className="p-3 bg-[#F8F9FB] rounded-2xl border border-[#E5E7EB]">
                <span className={`text-base font-black font-display ${grade === 'F' ? 'text-rose-600' : 'text-[#111827]'}`}>
                  {grade}
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5 font-display">{count}</p>
                <span className="text-[10px] text-[#575E70] font-medium">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
            Exam-by-Exam Scorecard ({filteredExams.length})
          </h3>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search exam title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-[#F4F5F7] border border-[#E5E7EB] rounded-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111827]"
            />
          </div>
        </div>

        {/* Class Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-[#575E70] shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Class:
          </span>
          {classes.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => handleSelectClass(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedClass === c
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-[#F3F4F6] border border-[#E5E7EB]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Section Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs pt-1 border-t border-[#F3F4F6]">
          <span className="text-[11px] font-bold text-[#575E70] shrink-0 flex items-center gap-1">
            Section:
          </span>
          <button
            type="button"
            onClick={() => setSelectedSection('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
              selectedSection === 'ALL'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-[#F3F4F6] border border-[#E5E7EB]'
            }`}
          >
            All Sections
          </button>
          {availableSections.map(sec => (
            <button
              key={sec}
              type="button"
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedSection === sec
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-[#F3F4F6] border border-[#E5E7EB]'
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
              <tr className="bg-[#F8F9FB] text-[#575E70] font-semibold border-b border-[#E5E7EB]">
                <th className="py-2.5 px-3">Exam Series</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3 text-center">Appeared</th>
                <th className="py-2.5 px-3 text-center">Passed</th>
                <th className="py-2.5 px-3 text-center">Failed</th>
                <th className="py-2.5 px-3 text-center">Pass %</th>
                <th className="py-2.5 px-3 text-center">Avg %</th>
                <th className="py-2.5 px-3">1st Position Topper</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] font-medium">
              {filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-400">
                    No examination records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredExams.map(m => (
                  <tr key={m.id} className="hover:bg-[#F8F9FB]/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.title || m.testName}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F4F5F7] text-[#111827] font-bold text-[10px] border border-[#E5E7EB]">
                        {m.studentClass} ({m.section})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-700">{m.total}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{m.passed}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-rose-600">{m.failed}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        Number(m.passRate) >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {m.passRate}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900 font-display">{m.classAverage || 0}%</td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      <strong>{m.topperName}</strong> ({m.topperPercentage}%)
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
