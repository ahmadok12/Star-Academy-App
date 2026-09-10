import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  GraduationCap,
  Download,
  MessageCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { downloadHtmlAsPDF, shareHtmlAsPDFToWhatsApp } from '../../utils/exportShareUtils';

export default function TeacherPayrollReport({
  teachers = [],
  teacherSalaries = [],
  banks = [],
  currentSession = '2026 - 27',
  onBack
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const bankMap = useMemo(() => {
    const map = {};
    banks.forEach(b => { map[b.id] = b.bankName; });
    return map;
  }, [banks]);

  // Aggregate Payroll
  const payrollData = useMemo(() => {
    // Map of teacherId -> latest salary
    const salaryMap = {};
    teacherSalaries.forEach(s => {
      salaryMap[s.teacherId] = s;
    });

    let totalBaseSalary = 0;
    let totalDisbursed = 0;
    let totalPending = 0;
    let paidFacultyCount = 0;
    let pendingFacultyCount = 0;

    const list = teachers.map(t => {
      const sal = salaryMap[t.id] || {};
      const baseSalary = Number(t.salary || t.monthlySalary || 35000);
      const isPaid = (sal.status || 'PAID').toUpperCase() === 'PAID' && sal.amount;
      const disbursedAmt = isPaid ? Number(sal.amount || baseSalary) : 0;
      const pendingAmt = isPaid ? 0 : baseSalary;

      totalBaseSalary += baseSalary;
      totalDisbursed += disbursedAmt;
      totalPending += pendingAmt;

      if (isPaid) paidFacultyCount++;
      else pendingFacultyCount++;

      return {
        ...t,
        baseSalary,
        disbursedAmt,
        isPaid,
        salaryDate: sal.date || 'Current Session',
        bankName: bankMap[sal.bankId] || sal.bankName || 'Direct Transfer / Cash'
      };
    });

    return {
      list,
      totalBaseSalary,
      totalDisbursed,
      totalPending,
      paidFacultyCount,
      pendingFacultyCount,
      totalFaculty: teachers.length
    };
  }, [teachers, teacherSalaries, bankMap]);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return payrollData.list;
    const q = searchQuery.toLowerCase();
    return payrollData.list.filter(t =>
      (t.name || '').toLowerCase().includes(q) ||
      (t.subject || '').toLowerCase().includes(q) ||
      (t.id || '').toLowerCase().includes(q)
    );
  }, [payrollData.list, searchQuery]);

  const getReportHtml = () => {
    const rowsHtml = filteredList.map((t, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${t.name}</strong><br /><small style="color: #64748b;">ID: ${t.id} • ${t.phone || 'N/A'}</small></td>
        <td><strong>${t.subject || 'Faculty'}</strong></td>
        <td style="text-align: right;">Rs. ${t.baseSalary.toLocaleString()}</td>
        <td style="text-align: right; font-weight: bold; color: ${t.isPaid ? '#166534' : '#b91c1c'};">Rs. ${t.disbursedAmt.toLocaleString()}</td>
        <td style="text-align: center;"><span class="badge ${t.isPaid ? 'badge-green' : 'badge-amber'}">${t.isPaid ? 'PAID' : 'PENDING'}</span></td>
        <td>${t.salaryDate}</td>
        <td style="font-size: 8.5pt;">${t.bankName}</td>
      </tr>
    `).join('');

    return `
      <h2 class="section-title">Star Academy - Teacher Payroll & Faculty Salary Register</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Academic Session:</span>
          <span class="info-value">${currentSession}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Faculty Strength:</span>
          <span class="info-value">${payrollData.totalFaculty} Instructors</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Monthly Payroll:</span>
          <span class="info-value">Rs. ${payrollData.totalBaseSalary.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Disbursed Payroll:</span>
          <span class="info-value" style="color: #166534; font-weight: bold;">Rs. ${payrollData.totalDisbursed.toLocaleString()} (${payrollData.paidFacultyCount} Paid)</span>
        </div>
        <div class="info-item">
          <span class="info-label">Pending Payroll Dues:</span>
          <span class="info-value" style="color: #b91c1c; font-weight: bold;">Rs. ${payrollData.totalPending.toLocaleString()} (${payrollData.pendingFacultyCount} Pending)</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Teacher Name & ID</th>
            <th>Subject / Dept</th>
            <th style="text-align: right;">Base Salary</th>
            <th style="text-align: right;">Disbursed</th>
            <th style="text-align: center;">Status</th>
            <th>Payment Date</th>
            <th>Disbursement Channel</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="8" style="text-align: center;">No faculty members registered</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const handleDownloadPDF = () => {
    const title = `Teacher Payroll Statement - ${currentSession}`;
    const filename = `Teacher_Payroll_${currentSession.replace(/\s+/g, '_')}`;
    downloadHtmlAsPDF(title, getReportHtml(), filename);
  };

  const handleShareWhatsApp = () => {
    const title = `Teacher Payroll Statement - ${currentSession}`;
    const filename = `Teacher_Payroll_${currentSession.replace(/\s+/g, '_')}`;
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
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 text-white rounded-3xl p-5 shadow-md">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/30 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              <GraduationCap className="w-3 h-3" />
              <span>Human Resources & Compensation • {currentSession}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Teacher Payroll & Salary Register
            </h2>
            <p className="text-xs text-teal-100/90 font-medium">
              Comprehensive compensation ledger covering faculty remuneration, payment status, and disbursements.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-white/80 font-bold block">Disbursed Outflow</span>
            <span className="text-2xl font-black text-amber-300">
              Rs. {payrollData.totalDisbursed.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Monthly Budget</span>
          <p className="text-lg font-black text-slate-900 mt-1">
            Rs. {payrollData.totalBaseSalary.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            {payrollData.totalFaculty} Instructors on Payroll
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-teal-200/90 bg-teal-50/20 shadow-xs">
          <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider block">Disbursed Salaries</span>
          <p className="text-lg font-black text-teal-700 mt-1">
            Rs. {payrollData.totalDisbursed.toLocaleString()}
          </p>
          <span className="text-[11px] text-teal-600 font-bold mt-0.5 block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {payrollData.paidFacultyCount} Faculty Members Paid
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200/90 bg-amber-50/20 shadow-xs">
          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Pending Disbursement</span>
          <p className="text-lg font-black text-amber-700 mt-1">
            Rs. {payrollData.totalPending.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-700 font-bold mt-0.5 block flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {payrollData.pendingFacultyCount} Awaiting Payment
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
          Faculty Ledger ({filteredList.length} Members)
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
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Instructor</th>
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3 text-right">Base Salary</th>
                <th className="py-2.5 px-3 text-right">Disbursed</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Disbursement Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400">
                    No faculty found matching search.
                  </td>
                </tr>
              ) : (
                filteredList.map(t => (
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
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      Rs. {t.baseSalary.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900">
                      Rs. {t.disbursedAmt.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        t.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500">
                      {t.bankName}
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
