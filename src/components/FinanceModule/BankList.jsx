import React, { useState, useMemo } from 'react';
import { Plus, Search, Landmark, CreditCard, ChevronRight, Eye, DollarSign } from 'lucide-react';
import AddBankModal from './AddBankModal';
import EditBankModal from './EditBankModal';
import BankDetailModal from './BankDetailModal';

export default function BankList({ banks, onAddBank, onUpdateBank, onDeleteBank, liveBalances }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingBank, setViewingBank] = useState(null);
  const [editingBank, setEditingBank] = useState(null);

  const filteredBanks = useMemo(() => {
    return banks.filter(bank => {
      const q = searchTerm.toLowerCase();
      return (
        bank.bankName.toLowerCase().includes(q) ||
        bank.accountName.toLowerCase().includes(q) ||
        bank.accountNumber.toLowerCase().includes(q) ||
        bank.id.toLowerCase().includes(q)
      );
    });
  }, [banks, searchTerm]);

  const totalLiveLiquidity = useMemo(() => {
    return banks.reduce((sum, b) => {
      const bal = liveBalances?.[b.id] !== undefined ? liveBalances[b.id] : (Number(b.openingBalance) || 0);
      return sum + bal;
    }, 0);
  }, [banks, liveBalances]);

  return (
    <div className="space-y-4">
      {/* Top Liquidity Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg">
        <div className="flex items-center justify-between text-xs text-emerald-100 mb-1">
          <span className="font-semibold">Total Liquid Reserves</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
            {banks.length} Accounts
          </span>
        </div>
        <div className="text-2xl font-black tracking-tight text-white">
          Rs. {totalLiveLiquidity.toLocaleString()}
        </div>
        <p className="text-[11px] text-emerald-100/90 mt-1">
          Sum of active bank ledger balances & reception cash counter.
        </p>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search bank, account #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
          />
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Bank</span>
        </button>
      </div>

      {/* Bank Cards List */}
      <div className="space-y-2.5">
        {filteredBanks.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
            <Landmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No bank accounts found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Add a new bank or change your search.</p>
          </div>
        ) : (
          filteredBanks.map((bank) => {
            const currentBal = liveBalances?.[bank.id] !== undefined ? liveBalances[bank.id] : bank.openingBalance;
            const isCash = bank.id === 'BNK-0004' || bank.bankName.toLowerCase().includes('cash');

            return (
              <div
                key={bank.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-200 transition-all flex items-center justify-between gap-3"
              >
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  {isCash ? <DollarSign className="w-5 h-5" /> : <Landmark className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-xs text-slate-900 truncate">{bank.bankName}</h3>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-mono font-semibold shrink-0">
                      {bank.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-medium">{bank.accountName}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">A/C: {bank.accountNumber}</p>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase tracking-wider">Balance</span>
                    <span className="font-black text-xs text-emerald-700">
                      Rs. {Number(currentBal).toLocaleString()}
                    </span>
                  </div>

                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => setViewingBank(bank)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-colors"
                  >
                    <Eye className="w-3 h-3 text-emerald-600" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <AddBankModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddBank={onAddBank}
        banks={banks}
      />

      <EditBankModal
        isOpen={!!editingBank}
        onClose={() => setEditingBank(null)}
        onUpdateBank={onUpdateBank}
        bank={editingBank}
      />

      <BankDetailModal
        isOpen={!!viewingBank}
        onClose={() => setViewingBank(null)}
        bank={viewingBank}
        liveBalance={viewingBank ? liveBalances?.[viewingBank.id] : 0}
        onEdit={(bank) => setEditingBank(bank)}
        onDelete={onDeleteBank}
      />
    </div>
  );
}
