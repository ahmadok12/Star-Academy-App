import React, { useState } from 'react';
import { X, CreditCard, Edit3, Trash2, Calendar, Landmark, MessageSquare, AlertTriangle, CheckCircle, Clock, Printer, FileDown, Share2 } from 'lucide-react';
import { printSingleFeeVoucher, exportSingleFeeVoucherPDF, shareFeeVoucherPDFToWhatsApp } from '../../utils/exportShareUtils';
import { OFFICIAL_BANK_DETAILS, FAYSAL_BANK_QR_BASE64 } from '../../constants/bankQrCode';

export default function FeeVoucherDetailModal({
  isOpen,
  onClose,
  voucher,
  banks,
  onEdit,
  onDelete,
  onSendWhatsApp
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !voucher) return null;

  const paidBank = banks.find(b => b.id === voucher.bankId);
  const isPaid = voucher.status === 'PAID';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with EDIT AT TOP */}
        <div className={`p-5 text-white flex items-center justify-between shadow-md ${
          isPaid ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-amber-600 to-orange-600'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Fee Voucher Details</h2>
              <p className="text-[11px] text-white/90 font-mono font-medium">{voucher.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EDIT BUTTON AT TOP */}
            <button
              onClick={() => {
                onClose();
                onEdit(voucher);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Status & Amount Card */}
          <div className={`p-4 rounded-2xl border text-center space-y-1 ${
            isPaid ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center justify-center gap-1.5">
              {isPaid ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                  <CheckCircle className="w-3 h-3" /> PAID
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[10px]">
                  <Clock className="w-3 h-3" /> PAYMENT PENDING
                </span>
              )}
            </div>

            <div className={`text-2xl font-black tracking-tight ${isPaid ? 'text-emerald-950' : 'text-amber-950'}`}>
              Rs. {Number(isPaid ? (voucher.amountPaid || voucher.feeAmount) : voucher.feeAmount).toLocaleString()}
            </div>

            <span className="text-[11px] text-slate-500 font-medium block">
              {voucher.month} • Due Date: {voucher.dueDate || '10th of month'}
            </span>
          </div>

          {/* Student & Guardian Details */}
          <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Student Name</span>
              <span className="font-bold text-slate-800 text-right">{voucher.studentName}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Student ID</span>
              <span className="font-mono font-bold text-indigo-700 text-right">{voucher.studentId}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Class & Section</span>
              <span className="font-bold text-slate-800 text-right">
                {voucher.studentClass} ({voucher.section})
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">Father's Name</span>
              <span className="font-medium text-slate-700 text-right">{voucher.fatherName}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500 font-medium">WhatsApp Number</span>
              <span className="font-mono font-bold text-emerald-700 text-right">
                {voucher.whatsappNumber || voucher.fatherContact}
              </span>
            </div>

            {isPaid && (
              <>
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Paid Date</span>
                  <span className="font-medium text-slate-800 text-right">{voucher.paidDate}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">Deposited Into</span>
                  <span className="font-bold text-slate-800 text-right">
                    {paidBank ? paidBank.bankName : voucher.bankId}
                  </span>
                </div>
              </>
            )}

            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase mb-1">
                Voucher Remarks
              </span>
              <p className="font-medium text-slate-800 text-xs bg-white p-2.5 rounded-xl border border-slate-200 whitespace-pre-wrap">
                {voucher.details || 'Standard monthly tuition fee'}
              </p>
            </div>
          </div>

          {/* Official Bank Deposit & QR Code Card */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Landmark className="w-4 h-4 text-indigo-600" />
                Official Bank Details
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-md">
                Attached QR Code
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Bank:</span>
                <span className="font-bold text-slate-800">{OFFICIAL_BANK_DETAILS.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Title:</span>
                <span className="font-bold text-slate-800">{OFFICIAL_BANK_DETAILS.accountTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Account:</span>
                <span className="font-mono font-bold text-indigo-600">{OFFICIAL_BANK_DETAILS.accountNumber}</span>
              </div>
            </div>

            {/* Attached QR Code Preview */}
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200">
              <div className="w-16 h-16 shrink-0 bg-slate-100 border border-slate-200 rounded-lg p-1 flex items-center justify-center">
                <img src={FAYSAL_BANK_QR_BASE64} alt="Faysal Bank QR" className="w-full h-full object-contain" />
              </div>
              <div className="text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 block">Scan & Pay via Raast</span>
                QR code is attached on all student vouchers below banking details.
              </div>
            </div>
          </div>

          {/* Action Buttons: Print Voucher / QR, Send PDF to WhatsApp, Text Notice */}
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => printSingleFeeVoucher(voucher)}
                className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all tap-active"
              >
                <Printer className="w-4 h-4" />
                <span>Print Voucher & QR</span>
              </button>

              <button
                type="button"
                onClick={() => exportSingleFeeVoucherPDF(voucher)}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all tap-active"
              >
                <FileDown className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => shareFeeVoucherPDFToWhatsApp(voucher)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-200 transition-all tap-active"
            >
              <Share2 className="w-4 h-4" />
              <span>Send Fee Voucher PDF to Guardian WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => onSendWhatsApp(voucher)}
              className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors tap-active"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Send Text Notice Reminder</span>
            </button>
          </div>
        </div>

        {/* Footer with DELETE BUTTON AT BOTTOM */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          {confirmDelete ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Delete this fee voucher?</span>
              </div>
              <p className="text-[11px] text-rose-600">
                Are you sure? This will delete voucher {voucher.id}.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 py-1.5 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(voucher.id);
                    onClose();
                  }}
                  className="flex-1 py-1.5 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-xs hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/60 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Fee Voucher</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
