import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Receipt,
  PieChart,
  Download,
  MessageCircle,
  Filter,
  Search,
  Calendar,
  Landmark,
  TrendingDown
} from 'lucide-react';
import { downloadHtmlAsPDF, shareHtmlAsPDFToWhatsApp } from '../../utils/exportShareUtils';

export default function ExpenseBreakdownReport({
  chargedExpenses = [],
  expenseCategories = [],
  banks = [],
  currentSession = '2026 - 27',
  onBack
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const bankMap = useMemo(() => {
    const map = {};
    banks.forEach(b => { map[b.id] = b.bankName; });
    return map;
  }, [banks]);

  // Aggregate Category Breakdown
  const { totalExpense, categoryBreakdown, channelBreakdown } = useMemo(() => {
    let total = 0;
    const catMap = {};
    const chanMap = {};

    chargedExpenses.forEach(e => {
      const amt = Number(e.amount || 0);
      total += amt;

      const cat = e.category || 'General';
      if (!catMap[cat]) catMap[cat] = { category: cat, total: 0, count: 0 };
      catMap[cat].total += amt;
      catMap[cat].count++;

      const chan = bankMap[e.bankId] || e.bankName || 'Cash / Petty Cash';
      if (!chanMap[chan]) chanMap[chan] = { channel: chan, total: 0, count: 0 };
      chanMap[chan].total += amt;
      chanMap[chan].count++;
    });

    const categoriesList = Object.values(catMap).map(c => ({
      ...c,
      percentage: total > 0 ? ((c.total / total) * 100).toFixed(1) : '0.0'
    })).sort((a, b) => b.total - a.total);

    const channelsList = Object.values(chanMap).map(c => ({
      ...c,
      percentage: total > 0 ? ((c.total / total) * 100).toFixed(1) : '0.0'
    })).sort((a, b) => b.total - a.total);

    return {
      totalExpense: total,
      categoryBreakdown: categoriesList,
      channelBreakdown: channelsList
    };
  }, [chargedExpenses, bankMap]);

  // Filtered List
  const filteredExpenses = useMemo(() => {
    return chargedExpenses.filter(e => {
      if (selectedCategory !== 'ALL' && e.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCat = (e.category || '').toLowerCase().includes(q);
        const matchDetails = (e.details || '').toLowerCase().includes(q);
        const matchId = (e.id || '').toLowerCase().includes(q);
        return matchCat || matchDetails || matchId;
      }
      return true;
    });
  }, [chargedExpenses, selectedCategory, searchQuery]);

  const categories = ['ALL', ...new Set(chargedExpenses.map(e => e.category).filter(Boolean))];

  const getReportHtml = () => {
    const catRowsHtml = categoryBreakdown.map((c, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td><strong>${c.category}</strong></td>
        <td style="text-align: center;">${c.count} Vouchers</td>
        <td style="text-align: right; font-weight: bold; color: #b91c1c;">Rs. ${c.total.toLocaleString()}</td>
        <td style="text-align: center;"><span class="badge badge-amber">${c.percentage}%</span></td>
      </tr>
    `).join('');

    const expenseRowsHtml = filteredExpenses.map((e, idx) => `
      <tr>
        <td style="text-align: center; font-weight: bold;">${idx + 1}</td>
        <td>${e.date || 'N/A'}</td>
        <td><strong>${e.category}</strong></td>
        <td>${e.details || '-'}</td>
        <td>${bankMap[e.bankId] || e.bankName || 'Cash'}</td>
        <td style="text-align: right; font-weight: bold; color: #b91c1c;">Rs. ${Number(e.amount || 0).toLocaleString()}</td>
      </tr>
    `).join('');

    return `
      <h2 class="section-title">Star Academy - Operational Expense Breakdown Statement</h2>
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
          <span class="info-label">Total Expenditure:</span>
          <span class="info-value" style="color: #b91c1c; font-size: 11pt;">Rs. ${totalExpense.toLocaleString()}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Vouchers Logged:</span>
          <span class="info-value">${chargedExpenses.length} Expense Transactions</span>
        </div>
      </div>

      <h3 style="font-size: 11pt; font-weight: 800; margin: 16px 0 8px 0; color: #1e293b;">Category-Wise Expenditure Summary</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Expense Category</th>
            <th style="text-align: center;">Transactions</th>
            <th style="text-align: right;">Total Spent</th>
            <th style="text-align: center;">Budget Share %</th>
          </tr>
        </thead>
        <tbody>
          ${catRowsHtml || '<tr><td colspan="5" style="text-align: center;">No category data recorded</td></tr>'}
        </tbody>
      </table>

      <h3 style="font-size: 11pt; font-weight: 800; margin: 18px 0 8px 0; color: #1e293b;">Detailed Itemized Expense Register</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">#</th>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Payment Channel</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${expenseRowsHtml || '<tr><td colspan="6" style="text-align: center;">No itemized vouchers recorded</td></tr>'}
        </tbody>
      </table>
    `;
  };

  const handleDownloadPDF = () => {
    const title = `Expense Breakdown Statement - ${currentSession}`;
    const filename = `Expense_Breakdown_${currentSession.replace(/\s+/g, '_')}`;
    downloadHtmlAsPDF(title, getReportHtml(), filename);
  };

  const handleShareWhatsApp = () => {
    const title = `Expense Breakdown Statement - ${currentSession}`;
    const filename = `Expense_Breakdown_${currentSession.replace(/\s+/g, '_')}`;
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

      {/* Category Progress Bars */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 space-y-4">
        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-rose-600" />
          <span>Category Share & Distribution</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categoryBreakdown.map((cat) => (
            <div key={cat.category} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{cat.category}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">{cat.count} Transactions</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">Rs. {cat.total.toLocaleString()}</span>
                  <span className="text-[10px] text-rose-600 font-bold block">{cat.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, Number(cat.percentage)))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter and Itemized Register */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-rose-600" />
            <span>Itemized Voucher Ledger ({filteredExpenses.length})</span>
          </h3>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search description, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {categories.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCategory(c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === c
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Expenses Table */}
        <div className="w-full min-w-0 overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[500px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Account</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500">{e.date}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-bold text-[10px]">
                        {e.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{e.details || '-'}</td>
                    <td className="py-2.5 px-3 text-slate-500">{bankMap[e.bankId] || e.bankName || 'Cash'}</td>
                    <td className="py-2.5 px-3 text-right font-black text-rose-700">
                      Rs. {Number(e.amount || 0).toLocaleString()}
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
