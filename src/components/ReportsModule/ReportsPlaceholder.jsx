import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Sparkles,
  DollarSign,
  CreditCard,
  Calendar,
  Receipt,
  GraduationCap,
  Award,
  ClipboardCheck,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Archive,
  Users,
  Search,
  Filter,
  Layers,
  Clock,
  ArrowLeft
} from 'lucide-react';
import TotalProfitReport from './TotalProfitReport';
import FeePaidPendingReport from './FeePaidPendingReport';
import MonthlyFeeCollectionReport from './MonthlyFeeCollectionReport';
import ExpenseBreakdownReport from './ExpenseBreakdownReport';
import TeacherPayrollReport from './TeacherPayrollReport';
import ExamPassFailReport from './ExamPassFailReport';
import StudentAttendanceReport from './StudentAttendanceReport';
import TeacherAttendanceReport from './TeacherAttendanceReport';

export default function ReportsPlaceholder({
  subPage,
  setSubPage,
  allStudents = [],
  currentSession = '2026 - 27',
  sessionsList = [],
  feeVouchers = [],
  banks = [],
  chargedExpenses = [],
  expenseCategories = [],
  teachers = [],
  teacherSalaries = [],
  attendanceSessions = [],
  teacherAttendanceSessions = [],
  marksheets = [],
  datesheets = []
}) {
  // Local state if subPage / setSubPage not provided
  const [localReport, setLocalReport] = useState(null);
  const activeReport = subPage !== undefined ? subPage : localReport;
  const setActiveReport = (val) => {
    if (setSubPage) setSubPage(val);
    else setLocalReport(val);
  };

  // State for Academic Year Student Archive
  const [selectedSession, setSelectedSession] = useState(currentSession);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');

  // Fast KPI metrics for the 8 cards
  const kpis = useMemo(() => {
    // 1. Profit
    const paidVouchers = feeVouchers.filter(v => (v.status || '').toUpperCase() === 'PAID');
    const totalFeeRevenue = paidVouchers.reduce((acc, v) => acc + Number(v.amountPaid || v.feeAmount || 0), 0);
    const totalExpenses = chargedExpenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);
    const totalSalaries = teacherSalaries.reduce((acc, s) => {
      const isPaid = (s.status || 'PAID').toUpperCase() === 'PAID';
      return isPaid ? acc + Number(s.amount || s.salaryAmount || 0) : acc;
    }, 0);
    const netProfit = totalFeeRevenue - (totalExpenses + totalSalaries);

    // 2. Fee Paid vs Pending
    const pendingVouchers = feeVouchers.filter(v => (v.status || '').toUpperCase() !== 'PAID');
    const paidCount = paidVouchers.length;
    const pendingCount = pendingVouchers.length;

    // 3. Exam Analysis
    let totalExamCandidates = 0;
    let totalExamPassed = 0;
    marksheets.forEach(m => {
      (m.studentScores || []).forEach(s => {
        totalExamCandidates++;
        if (s.isPassed || s.percentage >= 50) totalExamPassed++;
      });
    });
    const examPassRate = totalExamCandidates > 0 ? ((totalExamPassed / totalExamCandidates) * 100).toFixed(0) : '0';

    // 4. Student Attendance
    let stuTotal = 0, stuPres = 0;
    attendanceSessions.forEach(s => {
      (s.records || []).forEach(r => {
        stuTotal++;
        if ((r.status || '').toLowerCase() === 'present') stuPres++;
      });
    });
    const stuAttRate = stuTotal > 0 ? ((stuPres / stuTotal) * 100).toFixed(0) : '100';

    // 5. Teacher Attendance
    let teachTotal = 0, teachPres = 0;
    teacherAttendanceSessions.forEach(s => {
      (s.records || []).forEach(r => {
        teachTotal++;
        if ((r.status || '').toLowerCase() === 'present') teachPres++;
      });
    });
    const teachAttRate = teachTotal > 0 ? ((teachPres / teachTotal) * 100).toFixed(0) : '100';

    return {
      netProfit,
      totalFeeRevenue,
      paidCount,
      pendingCount,
      totalExpenses,
      facultyPayroll: totalSalaries,
      examPassRate,
      stuAttRate,
      teachAttRate
    };
  }, [feeVouchers, chargedExpenses, teacherSalaries, marksheets, attendanceSessions, teacherAttendanceSessions]);

  // 8 Report Card Definitions
  const reportCards = [
    {
      id: 'total_profit',
      title: 'Total Profit',
      subtitle: `Rs. ${kpis.netProfit.toLocaleString()}`,
      badge: kpis.netProfit >= 0 ? 'Surplus' : 'Deficit',
      description: 'Executive revenue, expense, payroll & net operating profit statement',
      icon: TrendingUp
    },
    {
      id: 'fee_paid_pending',
      title: 'Fee Paid and Pending List',
      subtitle: `${kpis.paidCount} Paid • ${kpis.pendingCount} Pending`,
      badge: 'Reconciliation',
      description: 'Student-by-student ledger of paid tuition vs outstanding dues',
      icon: CreditCard
    },
    {
      id: 'monthly_fee_collection',
      title: 'Monthly Fee Collection',
      subtitle: `Rs. ${kpis.totalFeeRevenue.toLocaleString()} Total Inflow`,
      badge: 'Cash Flow',
      description: 'Month-by-month voucher generation, receipts & recovery analysis',
      icon: Calendar
    },
    {
      id: 'expense_breakdown',
      title: 'Expense Breakdown',
      subtitle: `Rs. ${kpis.totalExpenses.toLocaleString()} Outflow`,
      badge: 'Audit',
      description: 'Category-wise operational expenditures, rent, utilities & supplies',
      icon: Receipt
    },
    {
      id: 'teacher_payroll',
      title: 'Teacher Payroll & Salary Register',
      subtitle: `${teachers.length} Faculty Members`,
      badge: 'Compensation',
      description: 'Faculty compensation ledger, disbursement status & payment banks',
      icon: GraduationCap
    },
    {
      id: 'student_result_analysis',
      title: 'Student Result & Exam Pass/Fail Analysis',
      subtitle: `${kpis.examPassRate}% Overall Pass Rate`,
      badge: 'Academics',
      description: 'Exam scorecards, merit positions, grade distribution & failure analysis',
      icon: Award
    },
    {
      id: 'student_attendance',
      title: 'Student Attendance',
      subtitle: `${kpis.stuAttRate}% Regularity`,
      badge: 'Compliance',
      description: 'Daily student attendance register, presence % & absenteeism flags',
      icon: ClipboardCheck
    },
    {
      id: 'teacher_attendance',
      title: 'Teacher Attendance',
      subtitle: `${kpis.teachAttRate}% Presence`,
      badge: 'Faculty',
      description: 'Faculty working days compliance, leave tracking & punctuality',
      icon: UserCheck
    }
  ];

  // SUBPAGE RENDER ROUTING
  if (activeReport) {
    let reportComponent = null;

    if (activeReport === 'total_profit') {
      reportComponent = (
        <TotalProfitReport
          feeVouchers={feeVouchers}
          chargedExpenses={chargedExpenses}
          teacherSalaries={teacherSalaries}
          banks={banks}
          currentSession={currentSession}
          onBack={() => setActiveReport(null)}
        />
      );
    } else if (activeReport === 'fee_paid_pending') {
      reportComponent = (
        <FeePaidPendingReport
          feeVouchers={feeVouchers}
          allStudents={allStudents}
          banks={banks}
          currentSession={currentSession}
          onBack={() => setActiveReport(null)}
        />
      );
    } else if (activeReport === 'monthly_fee_collection') {
      reportComponent = (
        <MonthlyFeeCollectionReport
          feeVouchers={feeVouchers}
          currentSession={currentSession}
          onBack={() => setActiveReport(null)}
        />
      );
    } else if (activeReport === 'expense_breakdown') {
      reportComponent = (
        <ExpenseBreakdownReport
          chargedExpenses={chargedExpenses}
          expenseCategories={expenseCategories}
          banks={banks}
          currentSession={currentSession}
          onBack={() => setActiveReport(null)}
        />
      );
    } else if (activeReport === 'teacher_payroll') {
      reportComponent = (
        <TeacherPayrollReport
          teachers={teachers}
          teacherSalaries={teacherSalaries}
          banks={banks}
          currentSession={currentSession}
          onBack={() => setActiveReport(null)}
        />
      );
    } else if (activeReport === 'student_result_analysis') {
      reportComponent = (
        <ExamPassFailReport
          marksheets={marksheets}
          allStudents={allStudents}
          currentSession={currentSession}
          onBack={() => setActiveReport(null)}
        />
      );
    } else if (activeReport === 'student_attendance') {
      reportComponent = (
        <StudentAttendanceReport
          attendanceSessions={attendanceSessions}
          allStudents={allStudents}
          currentSession={currentSession}
          onBack={() => setActiveReport(null)}
        />
      );
    } else if (activeReport === 'teacher_attendance') {
      reportComponent = (
        <TeacherAttendanceReport
          teacherAttendanceSessions={teacherAttendanceSessions}
          teachers={teachers}
          currentSession={currentSession}
          onBack={() => setActiveReport(null)}
        />
      );
    }

    if (reportComponent) {
      return (
        <div className="max-w-6xl mx-auto w-full">
          {reportComponent}
        </div>
      );
    }
  }

  // Session archive students calculation
  const sessionStudents = allStudents.filter(s => (s.academicYear || '2026 - 27') === selectedSession);
  const filteredArchiveStudents = sessionStudents.filter(s => {
    if (selectedClass !== 'ALL' && s.studentClass !== selectedClass) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
      const id = (s.id || '').toLowerCase();
      return name.includes(q) || id.includes(q);
    }
    return true;
  });

  // MAIN REPORTS HUB SCREEN
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-4 pb-24 w-full min-w-0 overflow-x-hidden">
      {/* List of 8 Report Cards */}
      <div className="w-full min-w-0">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm md:text-base font-bold text-slate-800 uppercase tracking-wider">
            Reports Directory (8 Statements)
          </h3>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
            {currentSession}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full min-w-0">
          {reportCards.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                type="button"
                onClick={() => setActiveReport(report.id)}
                className="w-full bg-white p-4 md:p-5 rounded-2xl border border-slate-200 hover:border-slate-400 shadow-2xs hover:shadow-xs transition-all text-left flex items-center justify-between gap-3 group cursor-pointer min-w-0"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                        {report.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold uppercase shrink-0">
                        {report.badge}
                      </span>
                    </div>
                    <p className="text-xs md:text-sm font-semibold text-slate-700 mt-1">
                      {report.subtitle}
                    </p>
                    <p className="text-xs md:text-sm text-slate-500 font-normal leading-relaxed mt-0.5">
                      {report.description}
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-slate-200/70 text-slate-400 group-hover:text-slate-800 flex items-center justify-center transition-colors shrink-0">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Historical Student Archives Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4 w-full min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
              <Archive className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm md:text-base font-bold text-slate-900 leading-tight">
                Academic Session Archives & Enrolled Rosters
              </h3>
              <p className="text-xs text-slate-500">
                Browse student records categorized by academic sessions
              </p>
            </div>
          </div>

          {/* Session Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Session:</span>
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs md:text-sm font-semibold py-1.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
            >
              {(sessionsList.length > 0 ? sessionsList : [{ year: '2026 - 27' }, { year: '2025 - 26' }]).map(s => (
                <option key={s.year || s} value={s.year || s}>
                  {s.label || `Session ${s.year || s}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search archive students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', '9th', '10th', 'FSc Part 1', 'FSc Part 2'].map(cls => (
              <button
                key={cls}
                type="button"
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-lg text-xs md:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedClass === cls
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Mini Archive Table */}
        <div className="w-full min-w-0 overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-xs text-left min-w-[460px]">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-2 px-3">Roll ID</th>
                <th className="py-2 px-3">Student Name</th>
                <th className="py-2 px-3">Class</th>
                <th className="py-2 px-3">Guardian</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3 text-right">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredArchiveStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-slate-400">
                    No students found for this session.
                  </td>
                </tr>
              ) : (
                filteredArchiveStudents.slice(0, 8).map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 font-mono text-indigo-700 font-bold">{s.id}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{s.firstName} {s.lastName}</td>
                    <td className="py-2 px-3">{s.studentClass} ({s.section || 'A'})</td>
                    <td className="py-2 px-3 text-slate-600">{s.fatherName || '-'}</td>
                    <td className="py-2 px-3 text-slate-500">{s.contactNumber || s.phone || '-'}</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-800">
                      Rs. {Number(s.fees || s.monthlyFee || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filteredArchiveStudents.length > 8 && (
            <p className="text-[11px] text-center text-slate-400 py-2 bg-slate-50/60 border-t border-slate-100">
              Showing 8 of {filteredArchiveStudents.length} archive students. Use search to filter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
