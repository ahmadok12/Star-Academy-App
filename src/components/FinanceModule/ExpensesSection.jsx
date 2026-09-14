import React, { useState, useMemo } from 'react';
import { Plus, Search, Tag, Receipt, Eye, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import AddExpenseCategoryModal from './AddExpenseCategoryModal';
import EditExpenseCategoryModal from './EditExpenseCategoryModal';
import ExpenseCategoryDetailModal from './ExpenseCategoryDetailModal';
import ChargeExpenseModal from './ChargeExpenseModal';
import EditChargedExpenseModal from './EditChargedExpenseModal';
import ChargedExpenseDetailModal from './ChargedExpenseDetailModal';

export default function ExpensesSection({
  categories,
  chargedExpenses,
  banks,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onChargeExpense,
  onUpdateChargedExpense,
  onDeleteChargedExpense
}) {
  const [activeTab, setActiveTab] = useState('charged'); // 'heads' or 'charged'
  const [searchTerm, setSearchTerm] = useState('');

  // Modals for Category Heads
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [viewingCategory, setViewingCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Modals for Charged Vouchers
  const [isChargeOpen, setIsChargeOpen] = useState(false);
  const [viewingCharge, setViewingCharge] = useState(null);
  const [editingCharge, setEditingCharge] = useState(null);

  // Filtered Heads
  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const q = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.details.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    });
  }, [categories, searchTerm]);

  // Filtered Charged
  const filteredCharged = useMemo(() => {
    return chargedExpenses.filter(e => {
      const q = searchTerm.toLowerCase();
      return (
        e.id.toLowerCase().includes(q) ||
        e.expenseCategoryName.toLowerCase().includes(q) ||
        e.details.toLowerCase().includes(q) ||
        e.date.includes(q)
      );
    });
  }, [chargedExpenses, searchTerm]);

  const totalChargedAmount = useMemo(() => {
    return chargedExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [chargedExpenses]);

  return (
    <div className="space-y-3">
      {/* 2 Tabs: Charged Expenses vs List of Expenses (heads) */}
      <div className="flex p-1 bg-slate-100 rounded-full border border-slate-200/80">
        <button
          onClick={() => setActiveTab('charged')}
          className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'charged'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'bg-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Charge Expenses ({chargedExpenses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('heads')}
          className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'heads'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'bg-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>List of Expenses ({categories.length})</span>
        </button>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === 'charged' ? 'Search charged vouchers...' : 'Search expense heads...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-full border border-transparent focus:border-slate-300 focus:ring-2 focus:ring-slate-100 transition-all outline-none"
          />
        </div>

        {activeTab === 'charged' ? (
          <button
            onClick={() => setIsChargeOpen(true)}
            className="rounded-full bg-[#111827] hover:bg-black active:scale-98 text-white font-bold text-xs px-4 py-2 flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Charge Expense</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAddCatOpen(true)}
            className="rounded-full bg-[#111827] hover:bg-black active:scale-98 text-white font-bold text-xs px-4 py-2 flex items-center gap-1.5 shadow-xs transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        )}
      </div>

      {/* Summary line */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          {activeTab === 'charged'
            ? `${filteredCharged.length} ${filteredCharged.length === 1 ? 'voucher' : 'vouchers'}`
            : `${filteredCategories.length} ${filteredCategories.length === 1 ? 'head' : 'heads'}`}
        </span>
        {activeTab === 'charged' && (
          <span>Total Outflow: <strong className="text-slate-900 font-bold">Rs. {totalChargedAmount.toLocaleString()}</strong></span>
        )}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'charged' ? (
        <div className="space-y-2.5">
          {filteredCharged.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
              <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No charged expenses recorded</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Charge Expense" to record a voucher.</p>
            </div>
          ) : (
            filteredCharged.map((chg) => (
              <div
                key={chg.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-3"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-bold">
                  <Receipt className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-slate-900 truncate">{chg.expenseCategoryName}</h4>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px] font-semibold shrink-0">
                      {chg.id}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-medium">{chg.details}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{chg.date}</p>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
                  <span className="font-black text-xs text-slate-900">
                    Rs. {Number(chg.amount).toLocaleString()}
                  </span>

                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => setViewingCharge(chg)}
                    className="rounded-full bg-[#111827] hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <Eye className="w-3 h-3 text-slate-300" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
              <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No expense heads found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Expense" to create a new category.</p>
            </div>
          ) : (
            filteredCategories.map((cat) => {
              const count = chargedExpenses.filter(e => e.expenseCategoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex items-center justify-between gap-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{cat.name}</h4>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px] font-semibold shrink-0">
                        {cat.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-medium">{cat.details}</p>
                    <span className="text-[10px] text-slate-500 font-bold">{count} vouchers charged</span>
                  </div>

                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => setViewingCategory(cat)}
                    className="rounded-full bg-[#111827] hover:bg-black text-white text-xs font-semibold px-3.5 py-1.5 flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <Eye className="w-3 h-3 text-slate-300" />
                    <span>View</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Category Modals */}
      <AddExpenseCategoryModal
        isOpen={isAddCatOpen}
        onClose={() => setIsAddCatOpen(false)}
        onAddCategory={onAddCategory}
        categories={categories}
      />

      <EditExpenseCategoryModal
        isOpen={!!editingCategory}
        onClose={() => setEditingCategory(null)}
        onUpdateCategory={onUpdateCategory}
        category={editingCategory}
      />

      <ExpenseCategoryDetailModal
        isOpen={!!viewingCategory}
        onClose={() => setViewingCategory(null)}
        category={viewingCategory}
        chargedExpenses={chargedExpenses}
        onEdit={(cat) => setEditingCategory(cat)}
        onDelete={onDeleteCategory}
      />

      {/* Charged Expense Modals */}
      <ChargeExpenseModal
        isOpen={isChargeOpen}
        onClose={() => setIsChargeOpen(false)}
        onChargeExpense={onChargeExpense}
        chargedExpenses={chargedExpenses}
        categories={categories}
        banks={banks}
      />

      <EditChargedExpenseModal
        isOpen={!!editingCharge}
        onClose={() => setEditingCharge(null)}
        onUpdateChargedExpense={onUpdateChargedExpense}
        chargedExpense={editingCharge}
        categories={categories}
        banks={banks}
      />

      <ChargedExpenseDetailModal
        isOpen={!!viewingCharge}
        onClose={() => setViewingCharge(null)}
        chargedExpense={viewingCharge}
        banks={banks}
        onEdit={(chg) => setEditingCharge(chg)}
        onDelete={onDeleteChargedExpense}
      />
    </div>
  );
}
