import React, { useState, useMemo } from 'react';
import { Plus, Search, ArrowRightLeft, Calendar, ArrowRight, Eye } from 'lucide-react';
import AddTransferModal from './AddTransferModal';
import EditTransferModal from './EditTransferModal';
import TransferDetailModal from './TransferDetailModal';

export default function TransferList({
  transfers,
  banks,
  liveBalances,
  onAddTransfer,
  onUpdateTransfer,
  onDeleteTransfer
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingTransfer, setViewingTransfer] = useState(null);
  const [editingTransfer, setEditingTransfer] = useState(null);

  const bankMap = useMemo(() => {
    const map = {};
    banks.forEach(b => { map[b.id] = b; });
    return map;
  }, [banks]);

  const filteredTransfers = useMemo(() => {
    return transfers.filter(t => {
      const q = searchTerm.toLowerCase();
      const fromName = bankMap[t.fromBankId]?.bankName || '';
      const toName = bankMap[t.toBankId]?.bankName || '';
      return (
        t.id.toLowerCase().includes(q) ||
        t.details.toLowerCase().includes(q) ||
        fromName.toLowerCase().includes(q) ||
        toName.toLowerCase().includes(q) ||
        t.date.includes(q)
      );
    });
  }, [transfers, searchTerm, bankMap]);

  const totalTransferred = useMemo(() => {
    return transfers.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transfers]);

  return (
    <div className="space-y-3">
      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search transfer, bank name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Transfer</span>
        </button>
      </div>

      {/* Summary line */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>{filteredTransfers.length} {filteredTransfers.length === 1 ? 'transfer' : 'transfers'}</span>
        <span>Total Rebalanced: <strong className="text-blue-700 font-bold">Rs. {totalTransferred.toLocaleString()}</strong></span>
      </div>

      {/* Transfers List */}
      <div className="space-y-2.5">
        {filteredTransfers.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
            <ArrowRightLeft className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No bank transfers found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Record a transfer between accounts.</p>
          </div>
        ) : (
          filteredTransfers.map((trf) => {
            const fromBank = bankMap[trf.fromBankId];
            const toBank = bankMap[trf.toBankId];

            return (
              <div
                key={trf.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-200 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-bold text-[10px]">
                      {trf.id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{trf.date}</span>
                  </div>
                  <span className="font-black text-xs text-blue-700">
                    Rs. {Number(trf.amount).toLocaleString()}
                  </span>
                </div>

                {/* Transfer route */}
                <div className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded-xl text-[11px]">
                  <div className="truncate flex-1">
                    <span className="text-[9px] text-rose-500 font-bold block">FROM</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {fromBank ? fromBank.bankName : trf.fromBankId}
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 mx-1" />

                  <div className="truncate flex-1 text-right">
                    <span className="text-[9px] text-emerald-600 font-bold block">TO</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {toBank ? toBank.bankName : trf.toBankId}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-[11px] text-slate-500 truncate flex-1 pr-2 font-medium">
                    {trf.details}
                  </p>
                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => setViewingTransfer(trf)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold transition-colors shrink-0"
                  >
                    <Eye className="w-3 h-3 text-blue-600" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <AddTransferModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddTransfer={onAddTransfer}
        transfers={transfers}
        banks={banks}
        liveBalances={liveBalances}
      />

      <EditTransferModal
        isOpen={!!editingTransfer}
        onClose={() => setEditingTransfer(null)}
        onUpdateTransfer={onUpdateTransfer}
        transfer={editingTransfer}
        banks={banks}
      />

      <TransferDetailModal
        isOpen={!!viewingTransfer}
        onClose={() => setViewingTransfer(null)}
        transfer={viewingTransfer}
        banks={banks}
        onEdit={(trf) => setEditingTransfer(trf)}
        onDelete={onDeleteTransfer}
      />
    </div>
  );
}
