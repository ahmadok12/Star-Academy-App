import React, { useState } from 'react';
import { Users, ClipboardCheck, CreditCard, ArrowLeft, ChevronRight, Sparkles, HelpCircle } from 'lucide-react';
import StudentList from './StudentList';
import AttendanceDashboard from '../AttendanceModule/AttendanceDashboard';
import ReceiveFeesSection from '../FinanceModule/ReceiveFeesSection';
import InquiriesSection from './InquiriesSection';
import AddStudentModal from './AddStudentModal';
import { INQUIRY_STATUS } from '../../constants/academicData';

export default function StudentTabHub({
  subPage,
  setSubPage,
  initialSearchTerm = '',
  // StudentList props
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onToggleLeftStatus,
  // Inquiries props
  inquiries = [],
  onAddInquiry,
  onUpdateInquiry,
  onDeleteInquiry,
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
  onGenerateMonthlyVouchers,
  curriculumSubjects
}) {
  const [registeringInquiry, setRegisteringInquiry] = useState(null);

  const activeStudentCount = students.filter(s => !s.isLeft && s.isActive !== false).length;
  const pendingFeeCount = feeVouchers.filter(v => v.status === 'PENDING').length;
  const pendingInquiriesCount = inquiries.filter(i => i.status !== INQUIRY_STATUS.REGISTERED).length;

  const menuItems = [
    {
      id: 'inquiries',
      title: 'Student Inquiries & Follow-ups',
      subtitle: `${pendingInquiriesCount} Active Follow-ups`,
      description: 'Track walk-in visitors, no-shows & follow-ups',
      icon: HelpCircle,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      id: 'list',
      title: 'List of Students',
      subtitle: `${activeStudentCount} Students`,
      description: 'View directory, student details & ID cards',
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      id: 'attendance',
      title: 'Student Attendance',
      subtitle: `${attendanceSessions.length} Sessions`,
      description: 'Mark daily attendance register of students',
      icon: ClipboardCheck,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      id: 'receive_fees',
      title: 'Receive Fees',
      subtitle: `${pendingFeeCount} Pending`,
      description: 'Collect student fees & fee vouchers',
      icon: CreditCard,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100'
    }
  ];

  // If a subpage is opened, render subpage with Back button
  if (subPage) {
    let pageTitle = '';
    if (subPage === 'list') pageTitle = 'List of Students';
    else if (subPage === 'inquiries') pageTitle = 'Student Inquiries & Follow-ups';
    else if (subPage === 'attendance') pageTitle = 'Student Attendance';
    else if (subPage === 'receive_fees') pageTitle = 'Receive Fees';

    return (
      <div className="flex flex-col flex-1 pb-16">
        {/* Subpage Header with Back Button (only for subpages without an integrated header) */}
        {subPage !== 'list' && subPage !== 'inquiries' && subPage !== 'receive_fees' && subPage !== 'attendance' && (
          <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4 py-3">
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
          </div>
        )}

        {/* Subpage Contents */}
        {subPage === 'list' && (
          <StudentList
            students={students}
            onAddStudent={handleAddStudentWrapper}
            onUpdateStudent={onUpdateStudent}
            onDeleteStudent={onDeleteStudent}
            onToggleLeftStatus={onToggleLeftStatus}
            onBack={() => setSubPage(null)}
            initialSearchTerm={initialSearchTerm}
          />
        )}

        {subPage === 'inquiries' && (
          <InquiriesSection
            inquiries={inquiries}
            onAddInquiry={onAddInquiry}
            onUpdateInquiry={onUpdateInquiry}
            onDeleteInquiry={onDeleteInquiry}
            onOpenRegisterStudent={(inq) => setRegisteringInquiry(inq)}
            curriculumSubjects={curriculumSubjects}
            onBack={() => setSubPage(null)}
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
            onBack={() => setSubPage(null)}
          />
        )}

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

        {/* Modal to Register Inquiry as an Active Student */}
        {registeringInquiry && (
          <AddStudentModal
            isOpen={!!registeringInquiry}
            onClose={() => setRegisteringInquiry(null)}
            onAddStudent={(newStudent) => {
              onAddStudent(newStudent);
              onUpdateInquiry({
                ...registeringInquiry,
                status: INQUIRY_STATUS.REGISTERED
              });
              setRegisteringInquiry(null);
            }}
            existingStudents={students}
            initialValues={registeringInquiry}
          />
        )}
      </div>
    );
  }

  function handleAddStudentWrapper(newStudent) {
    onAddStudent(newStudent);
  }

  // Main Students Menu: Responsive 1/2/3 columns
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
