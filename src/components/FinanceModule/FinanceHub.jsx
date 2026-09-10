import React, { useState } from 'react';
import { CreditCard, Landmark, ArrowRightLeft, Receipt, DollarSign, Wallet } from 'lucide-react';
import ReceiveFeesSection from './ReceiveFeesSection';
import BankList from './BankList';
import TransferList from './TransferList';
import ExpensesSection from './ExpensesSection';
import TeacherPayrollSection from './TeacherPayrollSection';

export default function FinanceHub({
  banks,
  transfers,
  categories,
  chargedExpenses,
  teacherSalaries,
  feeVouchers,
  students,
  teachers,
  liveBalances,
  onAddBank,
  onUpdateBank,
  onDeleteBank,
  onAddTransfer,
  onUpdateTransfer,
  onDeleteTransfer,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onChargeExpense,
  onUpdateChargedExpense,
  onDeleteChargedExpense,
  onPaySalary,
  onUpdateSalary,
  onDeleteSalary,
  onReceiveFee,
  onUpdateVoucher,
  onDeleteVoucher,
  onGenerateMonthlyVouchers
}) {
  const [subTab, setSubTab] = useState('fees'); // 'fees', 'banks', 'transfers', 'expenses', 'payroll'

  return (
    <div className="space-y-4">
      {/* Finance Navigation Pills - ONLY current selection is colored! */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSubTab('fees')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all border ${
            subTab === 'fees'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Receive Fees</span>
        </button>

        <button
          onClick={() => setSubTab('banks')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all border ${
            subTab === 'banks'
              ? 'bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Banks ({banks.length})</span>
        </button>

        <button
          onClick={() => setSubTab('transfers')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all border ${
            subTab === 'transfers'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Transfers</span>
        </button>

        <button
          onClick={() => setSubTab('expenses')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all border ${
            subTab === 'expenses'
              ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Expenses</span>
        </button>

        <button
          onClick={() => setSubTab('payroll')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all border ${
            subTab === 'payroll'
              ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Teacher Payroll</span>
        </button>
      </div>

      {/* Sub-module View */}
      {subTab === 'fees' && (
        <ReceiveFeesSection
          feeVouchers={feeVouchers}
          students={students}
          banks={banks}
          onReceiveFee={onReceiveFee}
          onUpdateVoucher={onUpdateVoucher}
          onDeleteVoucher={onDeleteVoucher}
          onGenerateMonthlyVouchers={onGenerateMonthlyVouchers}
        />
      )}

      {subTab === 'banks' && (
        <BankList
          banks={banks}
          onAddBank={onAddBank}
          onUpdateBank={onUpdateBank}
          onDeleteBank={onDeleteBank}
          liveBalances={liveBalances}
        />
      )}

      {subTab === 'transfers' && (
        <TransferList
          transfers={transfers}
          banks={banks}
          liveBalances={liveBalances}
          onAddTransfer={onAddTransfer}
          onUpdateTransfer={onUpdateTransfer}
          onDeleteTransfer={onDeleteTransfer}
        />
      )}

      {subTab === 'expenses' && (
        <ExpensesSection
          categories={categories}
          chargedExpenses={chargedExpenses}
          banks={banks}
          onAddCategory={onAddCategory}
          onUpdateCategory={onUpdateCategory}
          onDeleteCategory={onDeleteCategory}
          onChargeExpense={onChargeExpense}
          onUpdateChargedExpense={onUpdateChargedExpense}
          onDeleteChargedExpense={onDeleteChargedExpense}
        />
      )}

      {subTab === 'payroll' && (
        <TeacherPayrollSection
          salaries={teacherSalaries}
          teachers={teachers}
          banks={banks}
          onPaySalary={onPaySalary}
          onUpdateSalary={onUpdateSalary}
          onDeleteSalary={onDeleteSalary}
        />
      )}
    </div>
  );
}
