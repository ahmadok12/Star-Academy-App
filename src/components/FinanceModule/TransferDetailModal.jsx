import React, { useState } from 'react';
import { X, ArrowRightLeft, Edit3, Trash2, Calendar, FileText, Landmark, AlertTriangle } from 'lucide-react';

export default function TransferDetailModal({ isOpen, onClose, transfer, banks, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen || !transfer) return null;

  const fromBank = banks.find(b => b.id === transfer.fromBankId);
  const toBank = banks.find(b => b.id === transfer.toBankId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header with EDIT AT TOP */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Transfer Details</h2>
              <p className="text-[11px] text-blue-100 font-mono font-medium">{transfer.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* EDIT BUTTON AT TOP */}
            <button
              onClick={() => {
                onClose();
                onEdit(transfer);
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
          {/* Amount Badge */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200/80 text-center space-y-1">
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              Transferred Amount
            </span>
            <div className="text-2xl font-black text-blue-900 tracking-tight">
              Rs. {Number(transfer.amount).toLocaleString()}
            </div>
            <span className="text-[10px] text-blue-500 font-medium block">
              Executed on {transfer.date}
            </span>
          </div>

          {/* Transfer Flow */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-rose-500 block uppercase">Debited From:</span>
              <p className="font-bold text-slate-800 mt-0.5 text-xs truncate">
                {fromBank ? fromBank.bankName : transfer.fromBankId}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{fromBank?.accountName}</p>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-emerald-600 block uppercase">Credited To:</span>
              <p className="font-bold text-slate-800 mt-0.5 text-xs truncate">
                {toBank ? toBank.bankName : transfer.toBankId}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{toBank?.accountName}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-medium block text-[10px] uppercase">Purpose / Remarks</span>
              <p className="font-medium text-slate-800 text-xs mt-0.5 whitespace-pre-wrap">
                {transfer.details || 'Internal fund transfer'}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Timestamp:</span>
              <span className="font-mono text-slate-600">{transfer.createdAt || transfer.date}</span>
            </div>
          </div>
        </div>

        {/* Footer with DELETE BUTTON AT BOTTOM */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          {confirmDelete ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Delete this transfer voucher?</span>
              </div>
              <p className="text-[11px] text-rose-600">
                Are you sure? This will delete transfer record {transfer.id}.
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
                    onDelete(transfer.id);
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
              <span>Delete Transfer Record</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
