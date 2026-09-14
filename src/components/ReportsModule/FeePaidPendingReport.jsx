import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Filter,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Download,
  MessageCircle,
  Calendar,
  Users
} from 'lucide-react';
import { downloadHtmlAsPDF, shareHtmlAsPDFToWhatsApp } from '../../utils/exportShareUtils';

export default function FeePaidPendingReport({
  feeVouchers = [],
  allStudents = [],
  banks = [],
  currentSession = '2026 - 27',
  onBack
}) {
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'PAID' | 'PENDING'
  const [classFilter, setClassFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const bankMap = useMemo(() => {
    const map = {};
    banks.forEach(b => { map[b.id] = b.bankName; });
    return map;
  }, [banks]);

  const studentMap = useMemo(() => {
    const map = {};
    allStudents.forEach(s => { map[s.id] = s; });
    return map;
  }, [allStudents]);

  // Enriched Vouchers List
  const enrichedVouchers = useMemo(() => {
    return feeVouchers.map(v => {
      const student = studentMap[v.studentId] || {};
      const studentName = v.studentName || `${student.firstName || ''} ${student.lastName || ''}`.trim() || 'Student';
      const studentClass = v.studentClass || student.studentClass || student.class || 'N/A';
      const section = v.section || student.section || 'A';
      const isPaid = (v.status || '').toUpperCase() === 'PAID';
      const amount = Number(v.feeAmount || student.fees || 6000);
      const paidAmt = Number(v.amountPaid || (isPaid ? amount : 0));
      const bankName = bankMap[v.bankId] || v.bankName || 'Cash / Academy Counter';

      return {
        ...v,
        studentName,
        studentClass,
        section,
        isPaid,
        amount,
        paidAmt,
        bankName,
        phone: student.contactNumber || student.phone || ''
      };
    });
  }, [feeVouchers, studentMap, bankMap]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    let totalBilled = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let paidCount = 0;
    let pendingCount = 0;

    enrichedVouchers.forEach(v => {
      totalBilled += v.amount;
      if (v.isPaid) {
        totalCollected += v.paidAmt || v.amount;
        paidCount++;
      } else {
        totalPending += v.amount;
        pendingCount++;
      }
    });

    const recoveryRate = totalBilled > 0 ? ((totalCollected / totalBilled) * 100).toFixed(1) : '0.0';

    return {
      totalBilled,
      totalCollected,
      totalPending,
      paidCount,
      pendingCount,
      totalCount: enrichedVouchers.length,
      recoveryRate
    };
  }, [enrichedVouchers]);

  // Filtered List
  const filteredList = useMemo(() => {
    return enrichedVouchers.filter(v => {
      // Status Filter
      if (statusFilter === 'PAID' && !v.isPaid) return false;
      if (statusFilter === 'PENDING' && v.isPaid) return false;

      // Class Filter
      if (classFilter !== 'ALL' && v.studentClass !== classFilter) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = v.studentName.toLowerCase().includes(q);
        const matchId = (v.studentId || '').toLowerCase().includes(q);
        const matchVoucher = (v.id || '').toLowerCase().includes(q);
        const matchClass = v.studentClass.toLowerCase().includes(q);
        return matchName || matchId || matchVoucher || matchClass;
      }

      return true;
    });
  }, [enrichedVouchers, statusFilter, classFilter, searchQuery]);

  const classes = ['ALL', '9th', '10th', 'FSc Part 1', 'FSc Part 2'];

  // PDF / WhatsApp export generator
  const getReportHtml = () => {
    const rowsHtml = filteredList.map((v, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${v.studentName}</strong><br /><small style="color: #64748b;">ID: ${v.studentId} • ${v.studentClass} (${v.section})</small></td>
        <td style="font-family: monospace; font-size: 8.5pt;">${v.id}</td>
        <td style="text-align: right; font-weight: bold;">Rs. ${v.amount.toLocaleString()}</td>
        <td style="text-align: center;">
          <span class="badge ${v.isPaid ? 'badge-green' : 'badge-amber'}">${v.isPaid ? 'PAID' : 'PENDING'}</span>
        </td>
        <td>${v.dueDate || 'N/A'}</td>
        <td>${v.isPaid ? (v.paidDate || 'Paid') : 'Awaiting payment'}</td>
        <td style="font-size: 8.5pt;">${v.bankName}</td>
      </tr>
    `).join('');

    return `
      <h2 class="section-title">Star Academy - Student Fee Status Register (Paid & Pending)</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Academic Session:</span>
          <span class="info-value">${currentSession}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Active Filter:</span>
          <span class="info-value">${statusFilter} • Class: ${classFilter}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Fee Billed:</span>
          <span class="info-value">Rs. ${metrics.totalBilled.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Collected (Paid):</span>
          <span class="info-value" style="color: #166534;">Rs. ${metrics.totalCollected.toLocaleString()} (${metrics.paidCount} Vouchers)</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Outstanding (Pending):</span>
          <span class="info-value" style="color: #b91c1c;">Rs. ${metrics.totalPending.toLocaleString()} (${metrics.pendingCount} Vouchers)</span>
        </div>
        <div class="info-item">
          <span class="info-label">Recovery Efficiency:</span>
          <span class="info-value">${metrics.recoveryRate}%</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Student Name & Roll ID</th>
            <th>Voucher #</th>
            <th style="text-align: right;">Amount</th>
            <th style="text-align: center;">Status</th>
            <th>Due Date</th>
            <th>Payment Date</th>
            <th>Bank / Channel</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="8" style="text-align: center;">No fee records matched criteria</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const handleDownloadPDF = () => {
    const title = `Fee Status Register - ${currentSession}`;
    const filename = `Fee_Paid_Pending_Report_${currentSession.replace(/\s+/g, '_')}`;
    downloadHtmlAsPDF(title, getReportHtml(), filename);
  };

  const handleShareWhatsApp = () => {
    const title = `Fee Status Register - ${currentSession}`;
    const filename = `Fee_Paid_Pending_Report_${currentSession.replace(/\s+/g, '_')}`;
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
          <span className="text-[10px] text-[#575E70] font-bold uppercase tracking-wider block">Total Billed Fees</span>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 font-display">
            Rs. {metrics.totalBilled.toLocaleString()}
          </p>
          <span className="text-[11px] text-[#575E70] font-medium mt-0.5 block">
            {metrics.totalCount} Total Issued Vouchers
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-200/80 bg-emerald-50/20 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Cleared Fees (Paid)</span>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1 font-display">
            Rs. {metrics.totalCollected.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-0.5 block flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {metrics.paidCount} Vouchers Cleared
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200/80 bg-amber-50/20 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)]">
          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Outstanding Fees (Pending)</span>
          <p className="text-xl sm:text-2xl font-bold text-amber-700 mt-1 font-display">
            Rs. {metrics.totalPending.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-700 font-medium mt-0.5 block flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {metrics.pendingCount} Vouchers Awaiting Collection
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#F4F5F7] rounded-full border border-[#E5E7EB]">
            {[
              { id: 'ALL', label: `All (${metrics.totalCount})` },
              { id: 'PAID', label: `Paid (${metrics.paidCount})` },
              { id: 'PENDING', label: `Pending (${metrics.pendingCount})` }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'text-[#575E70] hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search student or ID..."
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
          {classes.map(cls => (
            <button
              key={cls}
              type="button"
              onClick={() => setClassFilter(cls)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                classFilter === cls
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-[#F3F4F6] border border-[#E5E7EB]'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] overflow-hidden">
        <div className="p-3.5 border-b border-[#F3F4F6] flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 font-display">
            Showing {filteredList.length} of {metrics.totalCount} Fee Vouchers
          </span>
        </div>

        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[520px]">
            <thead>
              <tr className="bg-[#F8F9FB] text-[#575E70] font-semibold border-b border-[#E5E7EB]">
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Class</th>
                <th className="py-2.5 px-3">Voucher #</th>
                <th className="py-2.5 px-3 text-right">Fee Amount</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3">Due / Paid Date</th>
                <th className="py-2.5 px-3">Account</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6] font-medium">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No fee records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredList.map((v) => (
                  <tr key={v.id} className="hover:bg-[#F8F9FB]/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{v.studentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{v.studentId}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F4F5F7] text-[#111827] font-bold text-[10px] border border-[#E5E7EB]">
                        {v.studentClass} ({v.section})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">
                      {v.id}
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-slate-900 font-display">
                      Rs. {v.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        v.isPaid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      {v.isPaid ? (
                        <span className="text-emerald-700 font-semibold">{v.paidDate || 'Paid'}</span>
                      ) : (
                        <span className="text-amber-700 font-semibold">Due: {v.dueDate || 'Pending'}</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-500">
                      {v.bankName}
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
