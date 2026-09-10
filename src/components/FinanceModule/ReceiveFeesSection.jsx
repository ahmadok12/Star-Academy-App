import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  Eye,
  Calendar,
  Sparkles,
  Share2,
  Check,
  Printer,
  FileDown,
  QrCode
} from 'lucide-react';
import ReceiveFeesModal from './ReceiveFeesModal';
import FeeVoucherDetailModal from './FeeVoucherDetailModal';
import {
  printAllFeeVouchers,
  exportAllFeeVouchersPDF,
  printSingleFeeVoucher,
  shareFeeVoucherPDFToWhatsApp
} from '../../utils/exportShareUtils';

export default function ReceiveFeesSection({
  feeVouchers,
  students,
  banks,
  onReceiveFee,
  onUpdateVoucher,
  onDeleteVoucher,
  onGenerateMonthlyVouchers
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'paid'
  const [searchTerm, setSearchTerm] = useState('');
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [preselectedVoucher, setPreselectedVoucher] = useState(null);
  const [viewingVoucher, setViewingVoucher] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const bankMap = useMemo(() => {
    const map = {};
    banks.forEach(b => { map[b.id] = b; });
    return map;
  }, [banks]);

  // Separate pending and paid vouchers
  const pendingVouchers = useMemo(() => {
    return feeVouchers.filter(v => v.status === 'PENDING');
  }, [feeVouchers]);

  const paidVouchers = useMemo(() => {
    return feeVouchers.filter(v => v.status === 'PAID');
  }, [feeVouchers]);

  // Financial metrics
  const totalPendingAmount = useMemo(() => {
    return pendingVouchers.reduce((sum, v) => sum + (Number(v.feeAmount) || 0), 0);
  }, [pendingVouchers]);

  const totalCollectedAmount = useMemo(() => {
    return paidVouchers.reduce((sum, v) => sum + (Number(v.amountPaid || v.feeAmount) || 0), 0);
  }, [paidVouchers]);

  // Filter based on search query
  const filteredList = useMemo(() => {
    const targetList = activeTab === 'pending' ? pendingVouchers : paidVouchers;
    if (!searchTerm.trim()) return targetList;
    const q = searchTerm.toLowerCase();
    return targetList.filter(v =>
      v.studentName.toLowerCase().includes(q) ||
      v.studentId.toLowerCase().includes(q) ||
      v.studentClass.toLowerCase().includes(q) ||
      (v.section && v.section.toLowerCase().includes(q)) ||
      (v.fatherName && v.fatherName.toLowerCase().includes(q)) ||
      (v.whatsappNumber && v.whatsappNumber.includes(q)) ||
      v.id.toLowerCase().includes(q)
    );
  }, [activeTab, pendingVouchers, paidVouchers, searchTerm]);

  // Generate automated WhatsApp due message
  const handleSendWhatsApp = (voucher) => {
    const phoneRaw = voucher.whatsappNumber || voucher.fatherContact || '';
    // Format to international phone number: 0300-1234567 -> 923001234567
    let cleanPhone = phoneRaw.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '92' + cleanPhone.slice(1);
    }

    const message =
      `*STAR ACADEMY - FEE VOUCHER NOTICE*\n\n` +
      `Respected Parent/Guardian *${voucher.fatherName}*,\n` +
      `This is a reminder regarding tuition fees for your child *${voucher.studentName}* ` +
      `(ID: ${voucher.studentId}, Class: ${voucher.studentClass}, Section: ${voucher.section}).\n\n` +
      `• *Month*: ${voucher.month}\n` +
      `• *Voucher No*: ${voucher.id}\n` +
      `• *Amount Due*: Rs. ${Number(voucher.feeAmount).toLocaleString()}\n` +
      `• *Due Date*: ${voucher.dueDate || '10th of this month'}\n\n` +
      `Kindly submit the fee voucher at the academy accounts desk or deposit via online bank transfer.\n\n` +
      `Thank you for your cooperation.\n` +
      `*Star Academy Administration*`;

    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encoded}`;

    // Copy notice text to clipboard as convenient backup
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      setCopiedId(voucher.id);
      setTimeout(() => setCopiedId(null), 3000);
    }

    window.open(whatsappUrl, '_blank');
  };

  const handleOpenReceiveModal = (voucher = null) => {
    setPreselectedVoucher(voucher);
    setIsReceiveOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Overview Metric Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs text-emerald-100">
          <span className="font-semibold">September 2026 Collections</span>
          <button
            onClick={() => onGenerateMonthlyVouchers('September 2026')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[11px] font-bold transition-all shadow-xs active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gen 1st of Month</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/15">
          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3 h-3" /> Collected ({paidVouchers.length})
            </div>
            <div className="text-base font-black text-white mt-0.5">
              Rs. {totalCollectedAmount.toLocaleString()}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-xs">
            <div className="flex items-center gap-1.5 text-[10px] text-amber-200 font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3" /> Pending ({pendingVouchers.length})
            </div>
            <div className="text-base font-black text-amber-300 mt-0.5">
              Rs. {totalPendingAmount.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Generate All Vouchers with Attached QR Code */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/15">
          <button
            type="button"
            onClick={() => printAllFeeVouchers(feeVouchers, 'September 2026')}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-50 transition-all active:scale-98"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span>Generate All Vouchers (QR Code)</span>
          </button>
          <button
            type="button"
            onClick={() => exportAllFeeVouchersPDF(feeVouchers, 'September 2026')}
            title="Download PDF containing all vouchers"
            className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Segmented Dual Switcher: Pending Fees vs Paid Fees */}
      <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
              : 'bg-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Fees ({pendingVouchers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('paid')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'paid'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Paid Fees ({paidVouchers.length})</span>
        </button>
      </div>

      {/* Search & Receive Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              activeTab === 'pending'
                ? 'Search pending student, father, ID...'
                : 'Search paid receipt, student, ID...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
          />
        </div>

        <button
          onClick={() => handleOpenReceiveModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Receive Fee</span>
        </button>
      </div>

      {/* Student Fees Cards */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
            {activeTab === 'pending' ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Pending Fees!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All student vouchers are settled or match no filters.</p>
              </>
            ) : (
              <>
                <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Paid Fees Records</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Collected fees will show here.</p>
              </>
            )}
          </div>
        ) : (
          filteredList.map((voucher) => {
            const studentObj = students.find(s => s.id === voucher.studentId);
            const isPending = voucher.status === 'PENDING';
            const bank = bankMap[voucher.bankId];

            return (
              <div
                key={voucher.id}
                className={`p-3.5 bg-white rounded-2xl border shadow-xs transition-all space-y-2.5 ${
                  isPending ? 'border-amber-200/90 hover:border-amber-300' : 'border-slate-200 hover:border-emerald-200'
                }`}
              >
                {/* Header row with student info */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {studentObj?.pic ? (
                      <img
                        src={studentObj.pic}
                        alt=""
                        className="w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] object-cover rounded-xl border border-slate-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {voucher.studentName.charAt(0)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{voucher.studentName}</h4>
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded text-[9px] font-mono font-semibold shrink-0">
                          {voucher.studentId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate font-medium">
                        Class {voucher.studentClass} • <span className="text-indigo-600 font-semibold">{voucher.section}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        Father: {voucher.fatherName} ({voucher.whatsappNumber || voucher.fatherContact})
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                      {isPending ? 'Due Fee' : 'Paid Fee'}
                    </span>
                    <span className={`font-black text-xs ${isPending ? 'text-amber-700' : 'text-emerald-700'}`}>
                      Rs. {Number(isPending ? voucher.feeAmount : (voucher.amountPaid || voucher.feeAmount)).toLocaleString()}
                    </span>
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mt-0.5 ${
                      isPending ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {voucher.status}
                    </span>
                  </div>
                </div>

                {/* Sub-info if paid */}
                {!isPending && (
                  <div className="flex items-center justify-between text-[10px] bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-slate-600">
                    <span>Paid Date: <strong className="text-slate-800">{voucher.paidDate}</strong></span>
                    <span>Account: <strong className="text-slate-800">{bank ? bank.bankName : voucher.bankId}</strong></span>
                  </div>
                )}

                {/* Actions row */}
                <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <div className="flex items-center gap-1">
                    {/* Print Voucher with QR code */}
                    <button
                      type="button"
                      onClick={() => printSingleFeeVoucher(voucher)}
                      title="Print fee voucher with QR code"
                      className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Print QR</span>
                    </button>

                    {/* Share PDF to WhatsApp */}
                    <button
                      type="button"
                      onClick={() => shareFeeVoucherPDFToWhatsApp(voucher)}
                      title="Send fee voucher PDF via WhatsApp"
                      className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>PDF</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Automated WhatsApp Due Text Notice */}
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(voucher)}
                      title="Send due text reminder on WhatsApp"
                      className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 text-slate-500" />
                      <span>Text</span>
                      {copiedId === voucher.id && (
                        <span className="text-[9px] text-emerald-700 bg-white px-1 rounded ml-0.5">Copied!</span>
                      )}
                    </button>

                    {/* If pending, show quick Receive Fee button */}
                    {isPending && (
                      <button
                        type="button"
                        onClick={() => handleOpenReceiveModal(voucher)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>Receive</span>
                      </button>
                    )}

                    {/* View voucher details button */}
                    <button
                      type="button"
                      onClick={() => setViewingVoucher(voucher)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors"
                    >
                      <Eye className="w-3 h-3 text-slate-500" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <ReceiveFeesModal
        isOpen={isReceiveOpen}
        onClose={() => {
          setIsReceiveOpen(false);
          setPreselectedVoucher(null);
        }}
        onReceiveFee={onReceiveFee}
        feeVouchers={feeVouchers}
        students={students}
        banks={banks}
        preselectedVoucher={preselectedVoucher}
      />

      <FeeVoucherDetailModal
        isOpen={!!viewingVoucher}
        onClose={() => setViewingVoucher(null)}
        voucher={viewingVoucher}
        banks={banks}
        onEdit={(v) => {
          setViewingVoucher(null);
          handleOpenReceiveModal(v);
        }}
        onDelete={onDeleteVoucher}
        onSendWhatsApp={handleSendWhatsApp}
      />
    </div>
  );
}
