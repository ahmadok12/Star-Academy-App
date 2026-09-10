import React from 'react';
import { Users, ClipboardCheck, CreditCard, ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import StudentList from './StudentList';
import AttendanceDashboard from '../AttendanceModule/AttendanceDashboard';
import ReceiveFeesSection from '../FinanceModule/ReceiveFeesSection';

export default function StudentTabHub({
  subPage,
  setSubPage,
  // StudentList props
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onToggleLeftStatus,
  // Student Attendance props
  attendanceSessions,
  onSaveAttendance,
  onUpdateAttendanceSession,
  onDeleteAttendanceSession,
  teachers,
  teacherAttendanceSessions,
  onSaveTeacherAttendance,
  onUpdateTeacherAttendanceSession,
  onDeleteTeacherAttendanceSession,
  // ReceiveFeesSection props
  feeVouchers,
  banks,
  onReceiveFee,
  onUpdateVoucher,
  onDeleteVoucher,
  onGenerateMonthlyVouchers
}) {
  const activeStudentCount = students.filter(s => !s.isLeft && s.isActive !== false).length;
  const pendingFeeCount = feeVouchers.filter(v => v.status === 'PENDING').length;

  const menuItems = [
    {
      id: 'list',
      title: 'List of Students',
      subtitle: `${activeStudentCount} Students`,
      description: 'View directory, student details & ID cards',
      icon: Users
    },
    {
      id: 'attendance',
      title: 'Student Attendance',
      subtitle: `${attendanceSessions.length} Sessions`,
      description: 'Mark daily attendance register of students',
      icon: ClipboardCheck
    },
    {
      id: 'receive_fees',
      title: 'Receive Fees',
      subtitle: `${pendingFeeCount} Pending`,
      description: 'Collect student fees & fee vouchers',
      icon: CreditCard
    }
  ];

  // If a subpage is opened, render subpage with Back button
  if (subPage) {
    let pageTitle = '';
    if (subPage === 'list') pageTitle = 'List of Students';
    else if (subPage === 'attendance') pageTitle = 'Student Attendance';
    else if (subPage === 'receive_fees') pageTitle = 'Receive Fees';

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
            <span>Back to Students</span>
          </button>
          <span className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
            {pageTitle}
          </span>
        </div>

        {/* Subpage Contents */}
        {subPage === 'list' && (
          <StudentList
            students={students}
            onAddStudent={handleAddStudentWrapper}
            onUpdateStudent={onUpdateStudent}
            onDeleteStudent={onDeleteStudent}
            onToggleLeftStatus={onToggleLeftStatus}
          />
        )}

        {subPage === 'attendance' && (
          <AttendanceDashboard
            studentOnly={true}
            students={students}
            attendanceSessions={attendanceSessions}
            onSaveAttendance={onSaveAttendance}
            onUpdateAttendanceSession={onUpdateAttendanceSession}
            onDeleteAttendanceSession={onDeleteAttendanceSession}
            teachers={teachers}
            teacherAttendanceSessions={teacherAttendanceSessions}
            onSaveTeacherAttendance={onSaveTeacherAttendance}
            onUpdateTeacherAttendanceSession={onUpdateTeacherAttendanceSession}
            onDeleteTeacherAttendanceSession={onDeleteTeacherAttendanceSession}
          />
        )}

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
      </div>
    );
  }

  function handleAddStudentWrapper(newStudent) {
    onAddStudent(newStudent);
  }

  // Main Students Menu: Responsive 1/2/3 columns
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
