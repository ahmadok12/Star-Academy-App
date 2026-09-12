import React, { useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingUp,
  Download,
  MessageCircle,
  CreditCard,
  Percent
} from 'lucide-react';
import { downloadHtmlAsPDF, shareHtmlAsPDFToWhatsApp } from '../../utils/exportShareUtils';

export default function MonthlyFeeCollectionReport({
  feeVouchers = [],
  currentSession = '2026 - 27',
  onBack
}) {
  const monthlyData = useMemo(() => {
    const monthMap = {};

    feeVouchers.forEach(v => {
      const month = v.month || (v.issueDate ? new Date(v.issueDate).toLocaleString('en-US', { month: 'long', year: 'numeric' }) : 'September 2026');
      const amount = Number(v.feeAmount || 6000);
      const isPaid = (v.status || '').toUpperCase() === 'PAID';
      const paidAmt = Number(v.amountPaid || (isPaid ? amount : 0));

      if (!monthMap[month]) {
        monthMap[month] = {
          month,
          vouchersGenerated: 0,
          paidCount: 0,
          pendingCount: 0,
          totalBilled: 0,
          totalCollected: 0,
          totalPending: 0
        };
      }

      monthMap[month].vouchersGenerated++;
      monthMap[month].totalBilled += amount;
      if (isPaid) {
        monthMap[month].paidCount++;
        monthMap[month].totalCollected += paidAmt || amount;
      } else {
        monthMap[month].pendingCount++;
        monthMap[month].totalPending += amount;
      }
    });

    const list = Object.values(monthMap).map(m => {
      const rate = m.totalBilled > 0 ? ((m.totalCollected / m.totalBilled) * 100).toFixed(1) : '0.0';
      return { ...m, rate };
    });

    const overallBilled = list.reduce((a, b) => a + b.totalBilled, 0);
    const overallCollected = list.reduce((a, b) => a + b.totalCollected, 0);
    const overallPending = list.reduce((a, b) => a + b.totalPending, 0);
    const overallRate = overallBilled > 0 ? ((overallCollected / overallBilled) * 100).toFixed(1) : '0.0';

    return { list, overallBilled, overallCollected, overallPending, overallRate };
  }, [feeVouchers]);

  const getReportHtml = () => {
    const rowsHtml = monthlyData.list.map((m, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${m.month}</strong></td>
        <td style="text-align: center;">${m.vouchersGenerated}</td>
        <td style="text-align: center; color: #166534; font-weight: bold;">${m.paidCount}</td>
        <td style="text-align: center; color: #b91c1c;">${m.pendingCount}</td>
        <td style="text-align: right; font-weight: bold;">Rs. ${m.totalBilled.toLocaleString()}</td>
        <td style="text-align: right; color: #166534; font-weight: bold;">Rs. ${m.totalCollected.toLocaleString()}</td>
        <td style="text-align: right; color: #b91c1c;">Rs. ${m.totalPending.toLocaleString()}</td>
        <td style="text-align: center;"><span class="badge ${Number(m.rate) >= 80 ? 'badge-green' : 'badge-amber'}">${m.rate}%</span></td>
      </tr>
    `).join('');

    return `
      <h2 class="section-title">Star Academy - Monthly Fee Collection & Recovery Audit</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Academic Session:</span>
          <span class="info-value">${currentSession}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Report Date:</span>
          <span class="info-value">${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Cumulative Billed:</span>
          <span class="info-value">Rs. ${monthlyData.overallBilled.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Realized Collection:</span>
          <span class="info-value" style="color: #166534;">Rs. ${monthlyData.overallCollected.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Outstanding Arrears:</span>
          <span class="info-value" style="color: #b91c1c;">Rs. ${monthlyData.overallPending.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Overall Recovery Efficiency:</span>
          <span class="info-value">${monthlyData.overallRate}%</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Month</th>
            <th style="text-align: center;">Issued</th>
            <th style="text-align: center;">Paid</th>
            <th style="text-align: center;">Pending</th>
            <th style="text-align: right;">Billed</th>
            <th style="text-align: right;">Collected</th>
            <th style="text-align: right;">Pending</th>
            <th style="text-align: center;">Rate %</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="9" style="text-align: center;">No monthly records generated yet</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const handleDownloadPDF = () => {
    const title = `Monthly Fee Collection Report - ${currentSession}`;
    const filename = `Monthly_Fee_Collection_${currentSession.replace(/\s+/g, '_')}`;
    downloadHtmlAsPDF(title, getReportHtml(), filename);
  };

  const handleShareWhatsApp = () => {
    const title = `Monthly Fee Collection Report - ${currentSession}`;
    const filename = `Monthly_Fee_Collection_${currentSession.replace(/\s+/g, '_')}`;
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cumulative Billed</span>
          <p className="text-lg font-black text-slate-900 mt-1">
            Rs. {monthlyData.overallBilled.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
            Across {monthlyData.list.length} billing periods
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-emerald-200/90 bg-emerald-50/20 shadow-xs">
          <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Realized Inflow</span>
          <p className="text-lg font-black text-emerald-700 mt-1">
            Rs. {monthlyData.overallCollected.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-bold mt-0.5 block">
            Cleared to academy treasury
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200/90 bg-amber-50/20 shadow-xs">
          <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Uncollected Arrears</span>
          <p className="text-lg font-black text-amber-700 mt-1">
            Rs. {monthlyData.overallPending.toLocaleString()}
          </p>
          <span className="text-[11px] text-amber-700 font-bold mt-0.5 block">
            Awaiting student payments
          </span>
        </div>
      </div>

      {/* Month Breakdown Cards with Progress Bars */}
      <div className="space-y-3">
        {monthlyData.list.map(m => (
          <div key={m.month} className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">{m.month}</h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {m.vouchersGenerated} Vouchers Issued • {m.paidCount} Paid • {m.pendingCount} Pending
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-slate-900">
                  Rs. {m.totalCollected.toLocaleString()} <span className="text-xs text-slate-400 font-medium">/ Rs. {m.totalBilled.toLocaleString()}</span>
                </span>
                <span className={`text-[11px] font-black block ${Number(m.rate) >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {m.rate}% Collection Rate
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  Number(m.rate) >= 80 ? 'bg-emerald-500' : Number(m.rate) >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, Number(m.rate)))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
