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
  QrCode,
  ArrowLeft,
  X
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
  onGenerateMonthlyVouchers,
  onBack
}) {
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'paid'
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
    <div className="space-y-3">
      {/* Top sticky bar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs -mx-4 md:-mx-6 px-4 md:px-6 py-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Back Button */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all tap-active cursor-pointer shrink-0"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}

          {/* Pending / Paid Switcher */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-full border border-slate-200/80 text-xs font-bold shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending ({pendingVouchers.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paid')}
              className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'paid'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Paid ({paidVouchers.length})</span>
            </button>
          </div>

          {/* Action Buttons: Receive Fee, Search, Print */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            <button
              type="button"
              onClick={() => handleOpenReceiveModal()}
              className="rounded-full bg-[#111827] hover:bg-black active:scale-98 text-white font-bold text-xs px-4 py-2 flex items-center gap-1.5 shadow-xs transition-all tap-active cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Receive Fee</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSearchOpen(prev => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all tap-active cursor-pointer ${
                isSearchOpen || searchTerm
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Search Fees"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              {searchTerm && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
            </button>

            <button
              type="button"
              onClick={() => printAllFeeVouchers(feeVouchers, 'September 2026')}
              title="Print All Vouchers (QR Code)"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Vouchers</span>
            </button>

            <button
              type="button"
              onClick={() => exportAllFeeVouchersPDF(feeVouchers, 'September 2026')}
              title="Download PDF containing all vouchers"
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Search Drawer */}
        {isSearchOpen && (
          <div className="max-w-6xl mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder={
                  activeTab === 'pending'
                    ? 'Search pending student, father, ID, voucher #...'
                    : 'Search paid receipt, student, ID...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
                className="w-full pl-9 pr-9 py-2 bg-slate-50 focus:bg-white text-xs rounded-full border border-slate-200 focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Concise Summary Bar */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1 font-medium">
        <span>
          Showing {filteredList.length} {activeTab} {filteredList.length === 1 ? 'record' : 'records'}
        </span>
        <div className="flex items-center gap-3">
          <span>
            Total {activeTab === 'pending' ? 'Pending' : 'Collected'}:{' '}
            <strong className="text-slate-900 font-bold">
              Rs. {(activeTab === 'pending' ? totalPendingAmount : totalCollectedAmount).toLocaleString()}
            </strong>
          </span>
          {activeTab === 'pending' && onGenerateMonthlyVouchers && (
            <button
              type="button"
              onClick={() => onGenerateMonthlyVouchers('September 2026')}
              className="text-[11px] text-slate-700 hover:text-slate-900 font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Generate vouchers for 1st of month"
            >
              <Sparkles className="w-3 h-3" />
              <span className="hidden sm:inline">Gen 1st of Month</span>
            </button>
          )}
        </div>
      </div>

      {/* Student Fees Cards */}
      <div className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
            {activeTab === 'pending' ? (
              <>
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
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
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2.5"
              >
                {/* Header row with student info */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {studentObj?.pic ? (
                      <img
                        src={studentObj.pic}
                        alt=""
                        className="w-11 h-11 min-w-[44px] min-h-[44px] max-w-[44px] max-h-[44px] object-cover rounded-2xl border border-slate-200"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
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
                        Class {voucher.studentClass} • <span className="text-slate-700 font-semibold">{voucher.section}</span>
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
                    <span className="font-black text-xs text-slate-900">
                      Rs. {Number(isPending ? voucher.feeAmount : (voucher.amountPaid || voucher.feeAmount)).toLocaleString()}
                    </span>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-0.5 ${
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
                  <div className="flex items-center gap-1.5">
                    {/* Print Voucher with QR code */}
                    <button
                      type="button"
                      onClick={() => printSingleFeeVoucher(voucher)}
                      title="Print fee voucher with QR code"
                      className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 border border-slate-200 cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Print QR</span>
                    </button>

                    {/* Share PDF to WhatsApp */}
                    <button
                      type="button"
                      onClick={() => shareFeeVoucherPDFToWhatsApp(voucher)}
                      title="Send fee voucher PDF via WhatsApp"
                      className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 border border-slate-200 cursor-pointer shadow-2xs flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-600" />
                      <span>PDF</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Automated WhatsApp Due Text Notice */}
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(voucher)}
                      title="Send due text reminder on WhatsApp"
                      className="rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1.5 border border-emerald-200 shadow-2xs cursor-pointer flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
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
                        className="rounded-full bg-[#111827] hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                      >
                        <CreditCard className="w-3 h-3" />
                        <span>Receive</span>
                      </button>
                    )}

                    {/* View voucher details button */}
                    <button
                      type="button"
                      onClick={() => setViewingVoucher(voucher)}
                      className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-1.5 border border-slate-200 cursor-pointer shadow-2xs flex items-center gap-1"
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
