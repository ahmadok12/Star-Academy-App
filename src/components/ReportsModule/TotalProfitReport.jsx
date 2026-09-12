import React, { useMemo } from 'react';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  CreditCard,
  Receipt,
  GraduationCap,
  Download,
  MessageCircle,
  Landmark,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { downloadHtmlAsPDF, shareHtmlAsPDFToWhatsApp } from '../../utils/exportShareUtils';

export default function TotalProfitReport({
  feeVouchers = [],
  chargedExpenses = [],
  teacherSalaries = [],
  banks = [],
  currentSession = '2026 - 27',
  onBack
}) {
  const financialSummary = useMemo(() => {
    // Total Fee Inflow (Paid Vouchers)
    const paidVouchers = feeVouchers.filter(v => (v.status || '').toUpperCase() === 'PAID');
    const totalFeeRevenue = paidVouchers.reduce((acc, v) => acc + Number(v.amountPaid || v.feeAmount || 0), 0);

    // Pending Receivables
    const pendingVouchers = feeVouchers.filter(v => (v.status || '').toUpperCase() !== 'PAID');
    const totalPendingFee = pendingVouchers.reduce((acc, v) => acc + Number(v.feeAmount || 0), 0);

    // Total Operating Expenses
    const totalExpenses = chargedExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

    // Total Teacher Salaries Paid
    const totalSalaries = teacherSalaries.reduce((acc, s) => {
      const isPaid = (s.status || 'PAID').toUpperCase() === 'PAID';
      return isPaid ? acc + Number(s.amount || s.salaryAmount || 0) : acc;
    }, 0);

    // Net Profit & Margin
    const totalOutflow = totalExpenses + totalSalaries;
    const netProfit = totalFeeRevenue - totalOutflow;
    const profitMargin = totalFeeRevenue > 0 ? ((netProfit / totalFeeRevenue) * 100).toFixed(1) : '0.0';

    // Monthly breakdown
    const monthMap = {};
    const getMonthKey = (dateStr) => {
      if (!dateStr) return 'September 2026';
      try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      } catch {
        return 'September 2026';
      }
    };

    paidVouchers.forEach(v => {
      const m = v.month || getMonthKey(v.paidDate || v.issueDate);
      if (!monthMap[m]) monthMap[m] = { month: m, revenue: 0, expenses: 0, salaries: 0 };
      monthMap[m].revenue += Number(v.amountPaid || v.feeAmount || 0);
    });

    chargedExpenses.forEach(e => {
      const m = getMonthKey(e.date);
      if (!monthMap[m]) monthMap[m] = { month: m, revenue: 0, expenses: 0, salaries: 0 };
      monthMap[m].expenses += Number(e.amount || 0);
    });

    teacherSalaries.forEach(s => {
      const m = s.month || getMonthKey(s.date);
      if (!monthMap[m]) monthMap[m] = { month: m, revenue: 0, expenses: 0, salaries: 0 };
      monthMap[m].salaries += Number(s.amount || s.salaryAmount || 0);
    });

    const monthlyBreakdown = Object.values(monthMap).map(item => {
      const outflow = item.expenses + item.salaries;
      const profit = item.revenue - outflow;
      const margin = item.revenue > 0 ? ((profit / item.revenue) * 100).toFixed(1) : '0.0';
      return { ...item, outflow, profit, margin };
    });

    return {
      totalFeeRevenue,
      totalPendingFee,
      totalExpenses,
      totalSalaries,
      totalOutflow,
      netProfit,
      profitMargin,
      monthlyBreakdown,
      paidVouchersCount: paidVouchers.length,
      pendingVouchersCount: pendingVouchers.length
    };
  }, [feeVouchers, chargedExpenses, teacherSalaries]);

  // Generate Report HTML for PDF and WhatsApp export
  const getReportHtml = () => {
    const isProfit = financialSummary.netProfit >= 0;
    const rowsHtml = financialSummary.monthlyBreakdown.map((row, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${row.month}</strong></td>
        <td style="text-align: right; color: #166534; font-weight: bold;">Rs. ${Number(row.revenue).toLocaleString()}</td>
        <td style="text-align: right; color: #991b1b;">Rs. ${Number(row.expenses).toLocaleString()}</td>
        <td style="text-align: right; color: #0f766e;">Rs. ${Number(row.salaries).toLocaleString()}</td>
        <td style="text-align: right; font-weight: bold;">Rs. ${Number(row.outflow).toLocaleString()}</td>
        <td style="text-align: right; font-weight: 900; color: ${row.profit >= 0 ? '#166534' : '#b91c1c'};">Rs. ${Number(row.profit).toLocaleString()}</td>
        <td style="text-align: center;"><span class="badge ${Number(row.margin) >= 0 ? 'badge-green' : 'badge-amber'}">${row.margin}%</span></td>
      </tr>
    `).join('');

    return `
      <h2 class="section-title">Star Academy - Total Profit & Financial Performance Statement</h2>
      <div class="info-grid">
        <div class="info-item">
          <span class="info-label">Academic Session:</span>
          <span class="info-value">${currentSession}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Statement Date:</span>
          <span class="info-value">${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Fee Revenue Collected:</span>
          <span class="info-value" style="color: #166534;">Rs. ${financialSummary.totalFeeRevenue.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Operating Expenses:</span>
          <span class="info-value" style="color: #991b1b;">Rs. ${financialSummary.totalExpenses.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Teacher Salaries Paid:</span>
          <span class="info-value" style="color: #0f766e;">Rs. ${financialSummary.totalSalaries.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Expenditure Outflow:</span>
          <span class="info-value">Rs. ${financialSummary.totalOutflow.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Net Profit / Operating Surplus:</span>
          <span class="info-value" style="font-size: 11pt; color: ${isProfit ? '#166534' : '#b91c1c'};">Rs. ${financialSummary.netProfit.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Net Profit Margin:</span>
          <span class="info-value" style="font-size: 11pt; color: ${isProfit ? '#166534' : '#b91c1c'};">${financialSummary.profitMargin}%</span>
        </div>
      </div>

      <h3 style="font-size: 11pt; font-weight: 800; margin: 16px 0 8px 0; color: #1e293b;">Month-by-Month Cash Flow & Profit Register</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 35px; text-align: center;">#</th>
            <th>Billing Month</th>
            <th style="text-align: right;">Fee Inflow</th>
            <th style="text-align: right;">Expenses</th>
            <th style="text-align: right;">Salaries</th>
            <th style="text-align: right;">Total Outflow</th>
            <th style="text-align: right;">Net Profit</th>
            <th style="text-align: center;">Margin</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml || '<tr><td colspan="8" style="text-align: center;">No financial transactions logged</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const handleDownloadPDF = () => {
    const title = `Total Profit Statement - ${currentSession}`;
    const filename = `Total_Profit_Report_${currentSession.replace(/\s+/g, '_')}`;
    downloadHtmlAsPDF(title, getReportHtml(), filename);
  };

  const handleShareWhatsApp = () => {
    const title = `Total Profit Statement - ${currentSession}`;
    const filename = `Total_Profit_Report_${currentSession.replace(/\s+/g, '_')}`;
    shareHtmlAsPDFToWhatsApp(title, getReportHtml(), filename);
  };

  const isProfit = financialSummary.netProfit >= 0;

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

      {/* 3 Core Financial KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fee Inflow</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900 mt-2">
            Rs. {financialSummary.totalFeeRevenue.toLocaleString()}
          </p>
          <span className="text-[10.5px] text-emerald-600 font-bold block mt-0.5">
            {financialSummary.paidVouchersCount} Vouchers Cleared
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900 mt-2">
            Rs. {financialSummary.totalExpenses.toLocaleString()}
          </p>
          <span className="text-[10.5px] text-rose-600 font-bold block mt-0.5">
            {chargedExpenses.length} Vouchers Charged
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Faculty Payroll</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900 mt-2">
            Rs. {financialSummary.totalSalaries.toLocaleString()}
          </p>
          <span className="text-[10.5px] text-teal-600 font-bold block mt-0.5">
            {teacherSalaries.length} Salary Payments
          </span>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pending Fees</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg font-black text-slate-900 mt-2">
            Rs. {financialSummary.totalPendingFee.toLocaleString()}
          </p>
          <span className="text-[10.5px] text-amber-600 font-bold block mt-0.5">
            {financialSummary.pendingVouchersCount} Uncollected
          </span>
        </div>
      </div>

      {/* Month-by-Month Statement Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>Month-by-Month Profit Ledger</span>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Comparative breakdown of revenue inflow against total expenditures
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-extrabold">
            {financialSummary.monthlyBreakdown.length} Months
          </span>
        </div>

        <div className="w-full min-w-0 overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-xs text-left min-w-[520px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Billing Month</th>
                <th className="py-2.5 px-3 text-right">Fee Revenue</th>
                <th className="py-2.5 px-3 text-right">Expenses</th>
                <th className="py-2.5 px-3 text-right">Faculty Payroll</th>
                <th className="py-2.5 px-3 text-right">Total Outflow</th>
                <th className="py-2.5 px-3 text-right">Net Profit</th>
                <th className="py-2.5 px-3 text-center">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {financialSummary.monthlyBreakdown.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    No financial data found for this period.
                  </td>
                </tr>
              ) : (
                financialSummary.monthlyBreakdown.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{row.month}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      Rs. {Number(row.revenue).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-600">
                      Rs. {Number(row.expenses).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right text-teal-700">
                      Rs. {Number(row.salaries).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                      Rs. {Number(row.outflow).toLocaleString()}
                    </td>
                    <td className={`py-2.5 px-3 text-right font-black ${
                      row.profit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      Rs. {Number(row.profit).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        Number(row.margin) >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {row.margin}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash & Bank Balances Section */}
      {banks.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 space-y-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-600" />
            <span>Associated Bank Accounts & Liquidity</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {banks.map((b) => (
              <div key={b.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{b.bankName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{b.accountNumber || b.id}</p>
                </div>
                <span className="text-xs font-black text-indigo-700">
                  Rs. {Number(b.openingBalance || b.balance || 0).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
