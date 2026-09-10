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
      icon: Landmark
    },
    {
      id: 'transfers',
      title: 'Bank to Bank Transfer',
      subtitle: `${transfers.length} Transfers`,
      description: 'Move funds between academy bank accounts',
      icon: ArrowRightLeft
    },
    {
      id: 'expenses',
      title: 'Expenses',
      subtitle: `${chargedExpenses.length} Records`,
      description: 'Utilities, bills, maintenance & stationary',
      icon: Receipt
    },
    {
      id: 'payroll',
      title: 'Teacher Payroll',
      subtitle: `${teacherSalaries.length} Records`,
      description: 'Pay faculty salaries & view payroll receipts',
      icon: Banknote
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
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all text-left flex flex-col justify-between group min-h-[145px] cursor-pointer"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-slate-200/70 text-slate-400 group-hover:text-slate-800 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                  {item.title}
                </h3>
                <span className="inline-block px-2.5 py-0.5 mt-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
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
