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
  Sparkles,
  HelpCircle
} from 'lucide-react';
import AddStudentModal from '../StudentModule/AddStudentModal';
import AddInquiryModal from '../StudentModule/AddInquiryModal';
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
  // Inquiry props
  inquiries = [],
  onAddInquiry,
  curriculumSubjects = {},
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
  onChargeExpense,
  attendanceTimings
}) {
  const [isAddInquiryOpen, setIsAddInquiryOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isReceiveFeeOpen, setIsReceiveFeeOpen] = useState(false);
  const [isMarkStudentAttendanceOpen, setIsMarkStudentAttendanceOpen] = useState(false);
  const [isMarkTeacherAttendanceOpen, setIsMarkTeacherAttendanceOpen] = useState(false);

  const pendingInquiriesCount = inquiries.filter(i => i.status !== 'Registered').length;

  const menuItems = [
    {
      id: 'add_inquiry',
      title: 'Student Inquiry',
      subtitle: `${pendingInquiriesCount} Active Follow-ups`,
      description: 'Record walk-in inquiry, visit & follow-up',
      icon: HelpCircle,
      actionType: 'modal'
    },
    {
      id: 'receive_fees',
      title: 'Receive Fees',
      subtitle: `${pendingFeeCount} Pending`,
      description: 'Collect student fees & record payment',
      icon: CreditCard,
      actionType: 'modal'
    },
    {
      id: 'add_student',
      title: 'Add Student',
      subtitle: 'New Admission',
      description: 'Register a new student into the academy',
      icon: UserPlus,
      actionType: 'modal'
    },
    {
      id: 'student_attendance',
      title: 'Mark Student Attendance',
      subtitle: 'Daily Register',
      description: 'Mark daily attendance register of students',
      icon: ClipboardCheck,
      actionType: 'modal'
    },
    {
      id: 'teacher_attendance',
      title: 'Mark Teacher Attendance',
      subtitle: `${teachers.length} Faculty`,
      description: 'Mark & track daily faculty attendance',
      icon: GraduationCap,
      actionType: 'modal'
    },
    {
      id: 'add_expenses',
      title: 'Add Expenses',
      subtitle: 'Log Expenditure',
      description: 'Record bills, utilities & academy expenses',
      icon: Receipt,
      actionType: 'modal'
    }
  ];

  const handleItemClick = (item) => {
    if (item.id === 'add_inquiry') {
      setIsAddInquiryOpen(true);
    } else if (item.id === 'receive_fees') {
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
        {subPage !== 'receive_fees' && subPage !== 'student_attendance' && subPage !== 'teacher_attendance' && (
          <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4 py-3">
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
          </div>
        )}

        {/* Subpage Contents */}
        {subPage === 'receive_fees' && (
          <div className="max-w-6xl mx-auto w-full p-4 md:p-6">
            <ReceiveFeesSection
              feeVouchers={feeVouchers}
              students={students}
              banks={banks}
              onReceiveFee={onReceiveFee}
              onUpdateVoucher={onUpdateVoucher}
              onDeleteVoucher={onDeleteVoucher}
              onGenerateMonthlyVouchers={onGenerateMonthlyVouchers}
              onBack={() => setSubPage(null)}
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
            onBack={() => setSubPage(null)}
          />
        )}

        {subPage === 'teacher_attendance' && (
          <TeacherAttendanceDashboard
            teachers={teachers}
            teacherAttendanceSessions={teacherAttendanceSessions}
            onSaveTeacherAttendance={onSaveTeacherAttendance}
            onUpdateTeacherAttendanceSession={onUpdateTeacherAttendanceSession}
            onDeleteTeacherAttendanceSession={onDeleteTeacherAttendanceSession}
            attendanceTimings={attendanceTimings}
            onBack={() => setSubPage(null)}
          />
        )}
      </div>
    );
  }

  // Main Quick Actions Menu
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4 pb-20 w-full min-w-0 overflow-x-hidden">
      {/* Grid: Responsive 1/2/3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleItemClick(item)}
              className="bg-white p-5 md:p-6 rounded-3xl border border-[#E5E7EB] hover:border-slate-300 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(17,24,39,0.08)] transition-all text-left flex flex-col justify-between group min-h-[150px] cursor-pointer"
            >
              <div className="flex items-start justify-between w-full">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 border border-slate-200/80 text-slate-800 flex items-center justify-center group-hover:bg-[#111827] group-hover:text-white transition-all shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#f8f9fb] group-hover:bg-[#111827] text-slate-400 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-900 font-headline leading-tight">
                  {item.title}
                </h3>
                <span className="inline-block px-2.5 py-0.5 mt-1.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                  {item.subtitle}
                </span>
                <p className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Direct Action Modals */}
      <AddInquiryModal
        isOpen={isAddInquiryOpen}
        onClose={() => setIsAddInquiryOpen(false)}
        onAddInquiry={onAddInquiry}
        existingInquiries={inquiries}
        curriculumSubjects={curriculumSubjects}
      />

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
        attendanceTimings={attendanceTimings}
      />

      <MarkTeacherAttendanceModal
        isOpen={isMarkTeacherAttendanceOpen}
        onClose={() => setIsMarkTeacherAttendanceOpen(false)}
        teachers={teachers}
        onSaveTeacherAttendance={onSaveTeacherAttendance}
        attendanceTimings={attendanceTimings}
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
