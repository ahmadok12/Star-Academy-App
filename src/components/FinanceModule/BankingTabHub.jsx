import React from 'react';
import {
  Landmark,
  ArrowRightLeft,
  Receipt,
  Banknote,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import BankList from './BankList';
import TransferList from './TransferList';
import ExpensesSection from './ExpensesSection';
import TeacherPayrollSection from './TeacherPayrollSection';

export default function BankingTabHub({
  subPage,
  setSubPage,
  // BankList props
  banks,
  onAddBank,
  onUpdateBank,
  onDeleteBank,
  liveBalances,
  // TransferList props
  transfers,
  onAddTransfer,
  onUpdateTransfer,
  onDeleteTransfer,
  // ExpensesSection props
  categories,
  chargedExpenses,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onChargeExpense,
  onUpdateChargedExpense,
  onDeleteChargedExpense,
  // TeacherPayrollSection props
  teacherSalaries,
  teachers,
  onPaySalary,
  onUpdateSalary,
  onDeleteSalary
}) {
  const menuItems = [
    {
      id: 'banks',
      title: 'List of Banks',
      subtitle: `${banks.length} Accounts`,
      description: 'Bank balances, accounts & cash counter',
      icon: Landmark,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      id: 'transfers',
      title: 'Bank to Bank Transfer',
      subtitle: `${transfers.length} Transfers`,
      description: 'Move funds between academy bank accounts',
      icon: ArrowRightLeft,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      id: 'expenses',
      title: 'Expenses',
      subtitle: `${chargedExpenses.length} Records`,
      description: 'Utilities, bills, maintenance & stationary',
      icon: Receipt,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-100'
    },
    {
      id: 'payroll',
      title: 'Teacher Payroll',
      subtitle: `${teacherSalaries.length} Records`,
      description: 'Pay faculty salaries & view payroll receipts',
      icon: Banknote,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    }
  ];

  // If a subpage is opened, render subpage with Back button
  if (subPage) {
    let pageTitle = '';
    if (subPage === 'banks') pageTitle = 'List of Banks';
    else if (subPage === 'transfers') pageTitle = 'Bank to Bank Transfer';
    else if (subPage === 'expenses') pageTitle = 'Expenses';
    else if (subPage === 'payroll') pageTitle = 'Teacher Payroll';

    return (
      <div className="flex flex-col flex-1 pb-16">
        {/* Subpage Header with Back Button */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-20">
          <button
            type="button"
            onClick={() => setSubPage(null)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all tap-active cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Banking</span>
          </button>
          <span className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
            {pageTitle}
          </span>
        </div>

        {/* Subpage Content */}
        {subPage === 'banks' && (
          <div className="p-4 md:p-6">
            <BankList
              banks={banks}
              onAddBank={onAddBank}
              onUpdateBank={onUpdateBank}
              onDeleteBank={onDeleteBank}
              liveBalances={liveBalances}
            />
          </div>
        )}

        {subPage === 'transfers' && (
          <div className="p-4 md:p-6">
            <TransferList
              transfers={transfers}
              banks={banks}
              liveBalances={liveBalances}
              onAddTransfer={onAddTransfer}
              onUpdateTransfer={onUpdateTransfer}
              onDeleteTransfer={onDeleteTransfer}
            />
          </div>
        )}

        {subPage === 'expenses' && (
          <div className="p-4 md:p-6">
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
          </div>
        )}

        {subPage === 'payroll' && (
          <div className="p-4 md:p-6">
            <TeacherPayrollSection
              salaries={teacherSalaries}
              teachers={teachers}
              banks={banks}
              onPaySalary={onPaySalary}
              onUpdateSalary={onUpdateSalary}
              onDeleteSalary={onDeleteSalary}
            />
          </div>
        )}
      </div>
    );
  }

  // Main Banking Menu: Responsive 1/2/4 columns
  return (
    <div className="p-4 md:p-6 space-y-4 pb-20 w-full min-w-0 overflow-x-hidden">
      {/* Grid: Responsive 1/2/4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSubPage(item.id)}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-300 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between group min-h-[145px] cursor-pointer"
            >
              <div className="flex items-start justify-between w-full">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                  {item.title}
                </h3>
                <span className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-xs font-semibold border ${item.badgeColor}`}>
                  {item.subtitle}
                </span>
                <p className="text-xs md:text-sm text-slate-500 font-normal mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
