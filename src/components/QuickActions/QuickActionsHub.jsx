import React, { useState } from 'react';
import {
  Zap,
  CreditCard,
  UserPlus,
  ClipboardCheck,
  GraduationCap,
  Receipt,
  ChevronRight,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import AddStudentModal from '../StudentModule/AddStudentModal';
import ChargeExpenseModal from '../FinanceModule/ChargeExpenseModal';
import ReceiveFeesModal from '../FinanceModule/ReceiveFeesModal';
import ReceiveFeesSection from '../FinanceModule/ReceiveFeesSection';
import MarkAttendanceModal from '../AttendanceModule/MarkAttendanceModal';
import AttendanceDashboard from '../AttendanceModule/AttendanceDashboard';
import MarkTeacherAttendanceModal from '../TeacherAttendanceModule/MarkTeacherAttendanceModal';
import TeacherAttendanceDashboard from '../TeacherAttendanceModule/TeacherAttendanceDashboard';

export default function QuickActionsHub({
  subPage,
  setSubPage,
  // Students props
  students = [],
  onAddStudent,
  // Fee props
  feeVouchers = [],
  banks = [],
  onReceiveFee,
  onUpdateVoucher,
  onDeleteVoucher,
  onGenerateMonthlyVouchers,
  pendingFeeCount = 0,
  // Student Attendance props
  attendanceSessions = [],
  onSaveAttendance,
  onUpdateAttendanceSession,
  onDeleteAttendanceSession,
  // Teacher Attendance props
  teachers = [],
  teacherAttendanceSessions = [],
  onSaveTeacherAttendance,
  onUpdateTeacherAttendanceSession,
  onDeleteTeacherAttendanceSession,
  // Expenses props
  categories = [],
  chargedExpenses = [],
  onChargeExpense
}) {
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isReceiveFeeOpen, setIsReceiveFeeOpen] = useState(false);
  const [isMarkStudentAttendanceOpen, setIsMarkStudentAttendanceOpen] = useState(false);
  const [isMarkTeacherAttendanceOpen, setIsMarkTeacherAttendanceOpen] = useState(false);

  const menuItems = [
    {
      id: 'receive_fees',
      title: 'Receive Fees',
      subtitle: `${pendingFeeCount} Pending`,
      description: 'Collect student fees & record payment',
      icon: CreditCard,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100',
      actionType: 'modal'
    },
    {
      id: 'add_student',
      title: 'Add Student',
      subtitle: 'New Admission',
      description: 'Register a new student into the academy',
      icon: UserPlus,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      actionType: 'modal'
    },
    {
      id: 'student_attendance',
      title: 'Mark Student Attendance',
      subtitle: 'Daily Register',
      description: 'Mark daily attendance register of students',
      icon: ClipboardCheck,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100',
      actionType: 'modal'
    },
    {
      id: 'teacher_attendance',
      title: 'Mark Teacher Attendance',
      subtitle: `${teachers.length} Faculty`,
      description: 'Mark & track daily faculty attendance',
      icon: GraduationCap,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
      actionType: 'modal'
    },
    {
      id: 'add_expenses',
      title: 'Add Expenses',
      subtitle: 'Log Expenditure',
      description: 'Record bills, utilities & academy expenses',
      icon: Receipt,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-100',
      actionType: 'modal'
    }
  ];

  const handleItemClick = (item) => {
    if (item.id === 'receive_fees') {
      setIsReceiveFeeOpen(true);
    } else if (item.id === 'add_student') {
      setIsAddStudentOpen(true);
    } else if (item.id === 'student_attendance') {
      setIsMarkStudentAttendanceOpen(true);
    } else if (item.id === 'teacher_attendance') {
      setIsMarkTeacherAttendanceOpen(true);
    } else if (item.id === 'add_expenses') {
      setIsAddExpenseOpen(true);
    } else if (setSubPage) {
      setSubPage(item.id);
    }
  };

  // If a subpage is opened, render subpage with Back button
  if (subPage) {
    let pageTitle = '';
    if (subPage === 'receive_fees') pageTitle = 'Receive Fees';
    else if (subPage === 'student_attendance') pageTitle = 'Student Attendance';
    else if (subPage === 'teacher_attendance') pageTitle = 'Teacher Attendance';

    return (
      <div className="flex flex-col flex-1 pb-16">
        {/* Subpage Header with Back Button */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <button
            type="button"
            onClick={() => setSubPage(null)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all tap-active cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Quick Actions</span>
          </button>
          <span className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
            {pageTitle}
          </span>
        </div>

        {/* Subpage Contents */}
        {subPage === 'receive_fees' && (
          <div className="p-4 md:p-6">
            <ReceiveFeesSection
              feeVouchers={feeVouchers}
              students={students}
              banks={banks}
              onReceiveFee={onReceiveFee}
              onUpdateVoucher={onUpdateVoucher}
              onDeleteVoucher={onDeleteVoucher}
              onGenerateMonthlyVouchers={onGenerateMonthlyVouchers}
            />
          </div>
        )}

        {subPage === 'student_attendance' && (
          <AttendanceDashboard
            studentOnly={true}
            students={students}
            attendanceSessions={attendanceSessions}
            onSaveAttendance={onSaveAttendance}
            onUpdateAttendanceSession={onUpdateAttendanceSession}
            onDeleteAttendanceSession={onDeleteAttendanceSession}
          />
        )}

        {subPage === 'teacher_attendance' && (
          <TeacherAttendanceDashboard
            teachers={teachers}
            teacherAttendanceSessions={teacherAttendanceSessions}
            onSaveTeacherAttendance={onSaveTeacherAttendance}
            onUpdateTeacherAttendanceSession={onUpdateTeacherAttendanceSession}
            onDeleteTeacherAttendanceSession={onDeleteTeacherAttendanceSession}
          />
        )}
      </div>
    );
  }

  // Main Quick Actions Menu
  return (
    <div className="p-4 md:p-6 space-y-4 pb-20 w-full min-w-0 overflow-x-hidden">
      {/* Grid: Responsive 1/2/3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
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

      {/* Direct Action Modals */}
      <ReceiveFeesModal
        isOpen={isReceiveFeeOpen}
        onClose={() => setIsReceiveFeeOpen(false)}
        onReceiveFee={onReceiveFee}
        feeVouchers={feeVouchers}
        students={students}
        banks={banks}
      />

      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        onAddStudent={onAddStudent}
        students={students}
      />

      <MarkAttendanceModal
        isOpen={isMarkStudentAttendanceOpen}
        onClose={() => setIsMarkStudentAttendanceOpen(false)}
        students={students}
        onSaveAttendance={onSaveAttendance}
      />

      <MarkTeacherAttendanceModal
        isOpen={isMarkTeacherAttendanceOpen}
        onClose={() => setIsMarkTeacherAttendanceOpen(false)}
        teachers={teachers}
        onSaveTeacherAttendance={onSaveTeacherAttendance}
      />

      <ChargeExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onChargeExpense={onChargeExpense}
        chargedExpenses={chargedExpenses}
        categories={categories}
        banks={banks}
      />
    </div>
  );
}
