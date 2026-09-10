import React, { useState, useEffect, useMemo } from 'react';
import MobileFrame from './components/MobileFrame';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import StudentTabHub from './components/StudentModule/StudentTabHub';
import AdminTabHub from './components/AdminModule/AdminTabHub';
import BankingTabHub from './components/FinanceModule/BankingTabHub';
import QuickActionsHub from './components/QuickActions/QuickActionsHub';
import DashboardPlaceholder from './components/Dashboard/DashboardPlaceholder';
import ReportsPlaceholder from './components/ReportsModule/ReportsPlaceholder';
import SettingsModal from './components/SettingsModule/SettingsModal';
import DesktopSidebar from './components/Desktop/DesktopSidebar';
import DesktopHeader from './components/Desktop/DesktopHeader';
import {
  getStudents,
  saveStudents,
  getAttendanceSessions,
  saveAttendanceSessions,
  getTeachers,
  saveTeachers,
  getTeacherAttendanceSessions,
  saveTeacherAttendanceSessions,
  getBanks,
  saveBanks,
  getTransfers,
  saveTransfers,
  getExpenseCategories,
  saveExpenseCategories,
  getChargedExpenses,
  saveChargedExpenses,
  getTeacherSalaries,
  saveTeacherSalaries,
  getFeeVouchers,
  saveFeeVouchers,
  generateMonthlyFeeVouchers,
  getTimetables,
  saveTimetables,
  calculateBankLiveBalances,
  getTestDefinitions,
  saveTestDefinitions,
  getDatesheets,
  saveDatesheets,
  getCurriculumSubjects,
  saveCurriculumSubjects,
  getMarksheets,
  saveMarksheets,
  getAcademicSession,
  saveAcademicSession,
  getAcademicSessionsList,
  saveAcademicSessionsList,
  DEFAULT_ACADEMIC_SESSION,
  getSchemesOfStudy,
  saveSchemesOfStudy
} from './utils/storage';
import { CheckCircle, Info, Trash2, AlertCircle } from 'lucide-react';

export default function App() {
  const [students, setStudents] = useState([]);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [teacherAttendanceSessions, setTeacherAttendanceSessions] = useState([]);

  // Banking & Finance Data
  const [banks, setBanks] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [chargedExpenses, setChargedExpenses] = useState([]);
  const [teacherSalaries, setTeacherSalaries] = useState([]);
  const [feeVouchers, setFeeVouchers] = useState([]);

  // Timetable Data
  const [timetables, setTimetables] = useState([]);

  // Datesheet & Tests Data
  const [tests, setTests] = useState([]);
  const [datesheets, setDatesheets] = useState([]);

  // Marksheet Data
  const [marksheets, setMarksheets] = useState([]);

  // Scheme of Study (SOS) Data
  const [schemesOfStudy, setSchemesOfStudy] = useState([]);

  // Settings & Curriculum Subjects Data
  const [curriculumSubjects, setCurriculumSubjects] = useState({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Academic Session Management (User Request: Default '2026 - 27')
  const [currentSession, setCurrentSession] = useState(getAcademicSession() || DEFAULT_ACADEMIC_SESSION);
  const [academicSessionsList, setAcademicSessionsList] = useState(getAcademicSessionsList());

  const [activeTab, setActiveTab] = useState('quick_actions');
  const [quickActionsSubPage, setQuickActionsSubPage] = useState(null);
  const [dashboardSubPage, setDashboardSubPage] = useState(null);
  const [studentSubPage, setStudentSubPage] = useState(null);
  const [adminSubPage, setAdminSubPage] = useState(null);
  const [bankingSubPage, setBankingSubPage] = useState(null);
  const [reportsSubPage, setReportsSubPage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleTabChange = (tab) => {
    // Tapping on any bottom tab always brings up the tab's main screen
    setQuickActionsSubPage(null);
    setDashboardSubPage(null);
    setStudentSubPage(null);
    setAdminSubPage(null);
    setBankingSubPage(null);
    setReportsSubPage(null);
    setActiveTab(tab);
  };

  // Desktop vs Mobile Frame view mode (defaults to Desktop on wide screens >= 1024px)
  const [isFrameMode, setIsFrameMode] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      return false;
    }
    return true;
  });

  const handleDesktopNavigate = (tab, subpage = null) => {
    setQuickActionsSubPage(null);
    setDashboardSubPage(null);
    setStudentSubPage(null);
    setAdminSubPage(null);
    setBankingSubPage(null);
    setReportsSubPage(null);
    setActiveTab(tab);
    if (subpage) {
      if (tab === 'quick_actions') setQuickActionsSubPage(subpage);
      else if (tab === 'dashboard') setDashboardSubPage(subpage);
      else if (tab === 'students') setStudentSubPage(subpage);
      else if (tab === 'admin') setAdminSubPage(subpage);
      else if (tab === 'banking') setBankingSubPage(subpage);
      else if (tab === 'reports') setReportsSubPage(subpage);
    }
  };

  const getActiveSubPageLabel = () => {
    const subPagesMap = {
      quick_actions: {
        receive_fee: 'Receive Fee',
        add_student: 'Add Student',
        student_attendance: 'Student Attendance',
        teacher_attendance: 'Teacher Attendance',
        add_expense: 'Add Expense'
      },
      dashboard: {
        active_students: 'Active Students Overview',
        sos: 'Scheme of Study (SOS)',
        timetable: 'Timetables',
        datesheet: 'Datesheets & Tests',
        reports: 'Exam & Performance Reports'
      },
      students: {
        list: 'Students Directory',
        student_attendance: 'Student Attendance Register',
        teacher_attendance: 'Teacher Attendance Register',
        fee_vouchers: 'Fee Vouchers & Invoicing'
      },
      admin: {
        sos: 'Curriculum Scheme of Study',
        timetable: 'Class Timetables',
        datesheet: 'Datesheets & Exams',
        marksheet: 'Marksheets & Grades',
        teacher_attendance: 'Faculty Attendance Log'
      },
      banking: {
        accounts: 'Bank Accounts & Balances',
        transfers: 'Fund Transfers',
        expenses: 'Expense Management',
        payroll: 'Teacher Payroll'
      },
      reports: {
        total_profit: 'Total Profit Report',
        fee_paid_pending: 'Fee Paid & Pending List',
        monthly_collection: 'Monthly Collection Report',
        expense_breakdown: 'Expense Breakdown Report',
        teacher_payroll: 'Teacher Payroll Register',
        exam_analysis: 'Pass / Fail Exam Analysis',
        student_attendance: 'Student Attendance Report',
        teacher_attendance: 'Teacher Attendance Report'
      }
    };

    const activeSub = {
      quick_actions: quickActionsSubPage,
      dashboard: dashboardSubPage,
      students: studentSubPage,
      admin: adminSubPage,
      banking: bankingSubPage,
      reports: reportsSubPage
    }[activeTab];

    return (activeSub && subPagesMap[activeTab]?.[activeSub]) || null;
  };

  // Initialize data on mount
  useEffect(() => {
    const loadedStudents = getStudents();
    setStudents(loadedStudents);
    setAttendanceSessions(getAttendanceSessions());
    setTeachers(getTeachers());
    setTeacherAttendanceSessions(getTeacherAttendanceSessions());
    setBanks(getBanks());
    setTransfers(getTransfers());
    setExpenseCategories(getExpenseCategories());
    setChargedExpenses(getChargedExpenses());
    setTeacherSalaries(getTeacherSalaries());
    setFeeVouchers(getFeeVouchers());
    setTimetables(getTimetables());
    setTests(getTestDefinitions());
    setDatesheets(getDatesheets());
    setCurriculumSubjects(getCurriculumSubjects());
    setMarksheets(getMarksheets(loadedStudents));
    setSchemesOfStudy(getSchemesOfStudy());
    setCurrentSession(getAcademicSession() || DEFAULT_ACADEMIC_SESSION);
    setAcademicSessionsList(getAcademicSessionsList());
  }, []);

  const handleSaveCurriculumSubjects = (updatedMap) => {
    setCurriculumSubjects(updatedMap);
    saveCurriculumSubjects(updatedMap);
    showToast('Subjects configuration saved successfully!');
  };

  const handleAddMarksheet = (newMarksheet) => {
    const updated = [newMarksheet, ...marksheets];
    setMarksheets(updated);
    saveMarksheets(updated);
    showToast(`Marksheet created for ${newMarksheet.studentClass} ${newMarksheet.section}!`);
  };

  const handleUpdateMarksheet = (updatedMarksheet) => {
    const updated = marksheets.map(m => m.id === updatedMarksheet.id ? updatedMarksheet : m);
    setMarksheets(updated);
    saveMarksheets(updated);
    showToast('Marksheet updated successfully!');
  };

  const handleDeleteMarksheet = (id) => {
    const updated = marksheets.filter(m => m.id !== id);
    setMarksheets(updated);
    saveMarksheets(updated);
    showToast('Marksheet deleted successfully!');
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Compute live balances across accounts
  const liveBalances = useMemo(() => {
    return calculateBankLiveBalances(banks, transfers, chargedExpenses, teacherSalaries, feeVouchers);
  }, [banks, transfers, chargedExpenses, teacherSalaries, feeVouchers]);

  // --- Student Handlers ---
  const handleAddStudent = (newStudent) => {
    const studentWithYear = {
      ...newStudent,
      academicYear: newStudent.academicYear || currentSession
    };
    const updated = [studentWithYear, ...students];
    setStudents(updated);
    saveStudents(updated);
    showToast(`Student ${studentWithYear.firstName} ${studentWithYear.lastName} (${studentWithYear.id}) registered in Academic Year ${currentSession}!`);
  };

  // --- Academic Year Transition & Student Promotion Handler (Requested by User) ---
  const handleStartNewAcademicYear = ({ newSessionYear, promoteActiveStudents }) => {
    // 1. Set & save new active session
    setCurrentSession(newSessionYear);
    saveAcademicSession(newSessionYear);

    // 2. Update academic sessions registry
    let updatedSessionsList = [...academicSessionsList];
    updatedSessionsList = updatedSessionsList.map(s => {
      if (s.year === currentSession) {
        return { ...s, status: 'ARCHIVED' };
      }
      return s;
    });

    if (!updatedSessionsList.find(s => s.year === newSessionYear)) {
      updatedSessionsList.unshift({
        id: `SES-${newSessionYear.replace(/\s+/g, '')}`,
        year: newSessionYear,
        label: `Academic Year ${newSessionYear}`,
        status: 'ACTIVE',
        matricStartMonth: 'May',
        fscStartMonth: 'July',
        startDate: `${newSessionYear.split('-')[0].trim()}-05-01`,
        description: `Active running session for Academic Year ${newSessionYear}`
      });
    } else {
      updatedSessionsList = updatedSessionsList.map(s => s.year === newSessionYear ? { ...s, status: 'ACTIVE' } : s);
    }
    setAcademicSessionsList(updatedSessionsList);
    saveAcademicSessionsList(updatedSessionsList);

    // 3. If promoteActiveStudents is selected, promote 9th -> 10th and FSc 1 -> FSc 2
    if (promoteActiveStudents) {
      const activeCurrentStudents = students.filter(
        s => (s.academicYear || DEFAULT_ACADEMIC_SESSION) === currentSession && !s.isLeft && s.isActive !== false
      );
      const promotedNewStudents = [];
      let serialCounter = 1;
      const yearPrefix = newSessionYear.split('-')[0].trim();

      activeCurrentStudents.forEach(st => {
        let promotedClass = null;
        if (st.studentClass === '9th') {
          promotedClass = '10th';
        } else if (st.studentClass === 'FSc Part 1') {
          promotedClass = 'FSc Part 2';
        }

        if (promotedClass) {
          const defaultSection = st.subject || st.section;
          promotedNewStudents.push({
            ...st,
            id: `SA-${yearPrefix}-${String(serialCounter++).padStart(3, '0')}`,
            studentClass: promotedClass,
            subject: defaultSection,
            section: defaultSection,
            academicYear: newSessionYear,
            isActive: true,
            isLeft: false,
            dateOfJoining: `${yearPrefix}-05-01`,
            registeredAt: `${yearPrefix}-05-01`
          });
        }
      });

      const updatedAllStudents = [...promotedNewStudents, ...students];
      setStudents(updatedAllStudents);
      saveStudents(updatedAllStudents);
      showToast(`Academic Year ${newSessionYear} activated! ${promotedNewStudents.length} students promoted.`);
    } else {
      showToast(`Academic Year ${newSessionYear} activated! Clean session ready for new admissions.`);
    }
  };

  const handleUpdateStudent = (updatedStudent) => {
    const updated = students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
    setStudents(updated);
    saveStudents(updated);
    showToast(`Student ${updatedStudent.firstName} ${updatedStudent.lastName} updated successfully!`);
  };

  const handleDeleteStudent = (studentId) => {
    const studentToDelete = students.find((s) => s.id === studentId);
    const name = studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : studentId;
    const updated = students.filter((s) => s.id !== studentId);
    setStudents(updated);
    saveStudents(updated);
    showToast(`Student ${name} deleted.`);
  };

  const handleToggleStudentStatus = (studentId, isLeft) => {
    const updated = students.map((s) => {
      if (s.id === studentId) {
        return {
          ...s,
          isLeft: isLeft,
          isActive: !isLeft
        };
      }
      return s;
    });
    setStudents(updated);
    saveStudents(updated);
    const target = updated.find((s) => s.id === studentId);
    if (isLeft) {
      showToast(`${target?.firstName} ${target?.lastName} marked as Left Academy (Inactive).`);
    } else {
      showToast(`${target?.firstName} ${target?.lastName} restored to Active status.`);
    }
  };

  // --- Attendance Handlers ---
  const handleSaveAttendance = (newSession) => {
    const updated = [newSession, ...attendanceSessions];
    setAttendanceSessions(updated);
    saveAttendanceSessions(updated);
    showToast(`Attendance marked for ${newSession.studentClass} (${newSession.subject})!`);
  };

  const handleUpdateAttendanceSession = (updatedSession) => {
    const updated = attendanceSessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    setAttendanceSessions(updated);
    saveAttendanceSessions(updated);
    showToast(`Attendance session for ${updatedSession.studentClass} updated!`);
  };

  const handleDeleteAttendanceSession = (sessionId) => {
    const updated = attendanceSessions.filter((s) => s.id !== sessionId);
    setAttendanceSessions(updated);
    saveAttendanceSessions(updated);
    showToast(`Attendance session record deleted.`);
  };

  // --- Teacher Handlers ---
  const handleAddTeacher = (newTeacher) => {
    const updated = [newTeacher, ...teachers];
    setTeachers(updated);
    saveTeachers(updated);
    showToast(`Faculty member ${newTeacher.name} (${newTeacher.id}) added!`);
  };

  const handleUpdateTeacher = (updatedTeacher) => {
    const updated = teachers.map((t) => (t.id === updatedTeacher.id ? updatedTeacher : t));
    setTeachers(updated);
    saveTeachers(updated);
    showToast(`Faculty member ${updatedTeacher.name} updated!`);
  };

  const handleDeleteTeacher = (teacherId) => {
    const teacherToDelete = teachers.find((t) => t.id === teacherId);
    const name = teacherToDelete ? teacherToDelete.name : teacherId;
    const updated = teachers.filter((t) => t.id !== teacherId);
    setTeachers(updated);
    saveTeachers(updated);
    showToast(`Faculty member ${name} deleted.`);
  };

  const handleSaveTeacherAttendance = (newSession) => {
    const updated = [newSession, ...teacherAttendanceSessions];
    setTeacherAttendanceSessions(updated);
    saveTeacherAttendanceSessions(updated);
    showToast(`Faculty attendance marked for ${newSession.date}!`);
  };

  const handleUpdateTeacherAttendanceSession = (updatedSession) => {
    const updated = teacherAttendanceSessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    setTeacherAttendanceSessions(updated);
    saveTeacherAttendanceSessions(updated);
    showToast(`Faculty attendance record updated!`);
  };

  const handleDeleteTeacherAttendanceSession = (sessionId) => {
    const updated = teacherAttendanceSessions.filter((s) => s.id !== sessionId);
    setTeacherAttendanceSessions(updated);
    saveTeacherAttendanceSessions(updated);
    showToast(`Faculty attendance record deleted.`);
  };

  // --- Bank Handlers ---
  const handleAddBank = (newBank) => {
    const updated = [...banks, newBank];
    setBanks(updated);
    saveBanks(updated);
    showToast(`Bank ${newBank.bankName} added successfully!`);
  };

  const handleUpdateBank = (updatedBank) => {
    const updated = banks.map(b => b.id === updatedBank.id ? updatedBank : b);
    setBanks(updated);
    saveBanks(updated);
    showToast(`Bank ${updatedBank.bankName} updated!`);
  };

  const handleDeleteBank = (bankId) => {
    const updated = banks.filter(b => b.id !== bankId);
    setBanks(updated);
    saveBanks(updated);
    showToast(`Bank account deleted.`);
  };

  // --- Transfer Handlers ---
  const handleAddTransfer = (newTransfer) => {
    const updated = [newTransfer, ...transfers];
    setTransfers(updated);
    saveTransfers(updated);
    showToast(`Transfer of Rs. ${Number(newTransfer.amount).toLocaleString()} recorded!`);
  };

  const handleUpdateTransfer = (updatedTransfer) => {
    const updated = transfers.map(t => t.id === updatedTransfer.id ? updatedTransfer : t);
    setTransfers(updated);
    saveTransfers(updated);
    showToast(`Transfer record updated!`);
  };

  const handleDeleteTransfer = (transferId) => {
    const updated = transfers.filter(t => t.id !== transferId);
    setTransfers(updated);
    saveTransfers(updated);
    showToast(`Transfer record deleted.`);
  };

  // --- Expense Categories Handlers ---
  const handleAddExpenseCategory = (newCategory) => {
    const updated = [...expenseCategories, newCategory];
    setExpenseCategories(updated);
    saveExpenseCategories(updated);
    showToast(`Expense head ${newCategory.name} created!`);
  };

  const handleUpdateExpenseCategory = (updatedCategory) => {
    const updated = expenseCategories.map(c => c.id === updatedCategory.id ? updatedCategory : c);
    setExpenseCategories(updated);
    saveExpenseCategories(updated);
    showToast(`Expense head updated!`);
  };

  const handleDeleteExpenseCategory = (categoryId) => {
    const updated = expenseCategories.filter(c => c.id !== categoryId);
    setExpenseCategories(updated);
    saveExpenseCategories(updated);
    showToast(`Expense head deleted.`);
  };

  // --- Charged Expenses Handlers ---
  const handleChargeExpense = (newCharged) => {
    const updated = [newCharged, ...chargedExpenses];
    setChargedExpenses(updated);
    saveChargedExpenses(updated);
    showToast(`Expense voucher of Rs. ${Number(newCharged.amount).toLocaleString()} charged!`);
  };

  const handleUpdateChargedExpense = (updatedCharged) => {
    const updated = chargedExpenses.map(c => c.id === updatedCharged.id ? updatedCharged : c);
    setChargedExpenses(updated);
    saveChargedExpenses(updated);
    showToast(`Charged expense voucher updated!`);
  };

  const handleDeleteChargedExpense = (chargedId) => {
    const updated = chargedExpenses.filter(c => c.id !== chargedId);
    setChargedExpenses(updated);
    saveChargedExpenses(updated);
    showToast(`Charged expense record deleted.`);
  };

  // --- Teacher Payroll Handlers ---
  const handlePaySalary = (newSalary) => {
    const updated = [newSalary, ...teacherSalaries];
    setTeacherSalaries(updated);
    saveTeacherSalaries(updated);
    showToast(`Salary of Rs. ${Number(newSalary.amount).toLocaleString()} disbursed to ${newSalary.teacherName}!`);
  };

  const handleUpdateSalary = (updatedSalary) => {
    const updated = teacherSalaries.map(s => s.id === updatedSalary.id ? updatedSalary : s);
    setTeacherSalaries(updated);
    saveTeacherSalaries(updated);
    showToast(`Salary voucher updated!`);
  };

  const handleDeleteSalary = (salaryId) => {
    const updated = teacherSalaries.filter(s => s.id !== salaryId);
    setTeacherSalaries(updated);
    saveTeacherSalaries(updated);
    showToast(`Salary record deleted.`);
  };

  // --- Fee Vouchers & Collections Handlers ---
  const handleReceiveFee = (updatedVoucher) => {
    // If voucher exists, update it to PAID; if not, add it
    const exists = feeVouchers.some(v => v.id === updatedVoucher.id);
    let updated;
    if (exists) {
      updated = feeVouchers.map(v => v.id === updatedVoucher.id ? updatedVoucher : v);
    } else {
      updated = [updatedVoucher, ...feeVouchers];
    }
    setFeeVouchers(updated);
    saveFeeVouchers(updated);
    showToast(`Fees of Rs. ${Number(updatedVoucher.amountPaid || updatedVoucher.feeAmount).toLocaleString()} received for ${updatedVoucher.studentName}!`);
  };

  const handleUpdateVoucher = (updatedVoucher) => {
    const updated = feeVouchers.map(v => v.id === updatedVoucher.id ? updatedVoucher : v);
    setFeeVouchers(updated);
    saveFeeVouchers(updated);
    showToast(`Fee voucher updated!`);
  };

  const handleDeleteVoucher = (voucherId) => {
    const updated = feeVouchers.filter(v => v.id !== voucherId);
    setFeeVouchers(updated);
    saveFeeVouchers(updated);
    showToast(`Fee voucher deleted.`);
  };

  const handleGenerateMonthlyVouchers = (monthStr) => {
    const { updatedVouchers, generatedCount } = generateMonthlyFeeVouchers(students, feeVouchers, monthStr);
    setFeeVouchers(updatedVouchers);
    saveFeeVouchers(updatedVouchers);
    if (generatedCount > 0) {
      showToast(`Generated ${generatedCount} pending fee vouchers for ${monthStr}!`);
    } else {
      showToast(`Fee vouchers for ${monthStr} are already up to date.`);
    }
  };

  // --- Timetable Handlers ---
  const handleAddTimetable = (newTimetable) => {
    const updated = [newTimetable, ...timetables];
    setTimetables(updated);
    saveTimetables(updated);
    showToast(`Timetable for ${newTimetable.studentClass} (${newTimetable.section}) created!`);
  };

  const handleUpdateTimetable = (updatedTimetable) => {
    const updated = timetables.map(t => t.id === updatedTimetable.id ? updatedTimetable : t);
    setTimetables(updated);
    saveTimetables(updated);
    showToast(`Timetable updated!`);
  };

  const handleDeleteTimetable = (timetableId) => {
    const updated = timetables.filter(t => t.id !== timetableId);
    setTimetables(updated);
    saveTimetables(updated);
    showToast(`Timetable deleted.`);
  };

  // --- Test Definition Handlers ---
  const handleAddTest = (newTest) => {
    const updated = [newTest, ...tests];
    setTests(updated);
    saveTestDefinitions(updated);
    showToast(`Test ${newTest.name} defined!`);
  };

  const handleUpdateTest = (updatedTest) => {
    const updated = tests.map(t => t.id === updatedTest.id ? updatedTest : t);
    setTests(updated);
    saveTestDefinitions(updated);
    showToast(`Test definition updated!`);
  };

  const handleDeleteTest = (testId) => {
    const updated = tests.filter(t => t.id !== testId);
    setTests(updated);
    saveTestDefinitions(updated);
    showToast(`Test definition deleted.`);
  };

  // --- Datesheet Handlers ---
  const handleAddDatesheet = (newDatesheet) => {
    const updated = [newDatesheet, ...datesheets];
    setDatesheets(updated);
    saveDatesheets(updated);
    showToast(`Datesheet for ${newDatesheet.studentClass} (${newDatesheet.section}) published!`);
  };

  const handleUpdateDatesheet = (updatedDatesheet) => {
    const updated = datesheets.map(d => d.id === updatedDatesheet.id ? updatedDatesheet : d);
    setDatesheets(updated);
    saveDatesheets(updated);
    showToast(`Datesheet updated!`);
  };

  const handleDeleteDatesheet = (datesheetId) => {
    const updated = datesheets.filter(d => d.id !== datesheetId);
    setDatesheets(updated);
    saveDatesheets(updated);
    showToast(`Datesheet deleted.`);
  };

  // --- Scheme of Study Handlers ---
  const handleAddSchemeOfStudy = (newScheme) => {
    const updated = [newScheme, ...schemesOfStudy];
    setSchemesOfStudy(updated);
    saveSchemesOfStudy(updated);
    showToast(`Scheme of Study "${newScheme.title}" created successfully!`);
  };

  const handleUpdateSchemeOfStudy = (updatedScheme) => {
    const updated = schemesOfStudy.map(s => s.id === updatedScheme.id ? updatedScheme : s);
    setSchemesOfStudy(updated);
    saveSchemesOfStudy(updated);
    showToast(`Scheme of Study updated successfully!`);
  };

  const handleDeleteSchemeOfStudy = (schemeId) => {
    const toDelete = schemesOfStudy.find(s => s.id === schemeId);
    const title = toDelete ? toDelete.title : schemeId;
    const updated = schemesOfStudy.filter(s => s.id !== schemeId);
    setSchemesOfStudy(updated);
    saveSchemesOfStudy(updated);
    showToast(`Scheme of Study "${title}" deleted.`);
  };

  // Only students enrolled in current active academic session are available across operational views
  const currentYearStudents = useMemo(() => {
    return students.filter(s => (s.academicYear || DEFAULT_ACADEMIC_SESSION) === currentSession);
  }, [students, currentSession]);

  const activeStudentCount = useMemo(() => {
    return currentYearStudents.filter((s) => !s.isLeft && s.isActive !== false).length;
  }, [currentYearStudents]);

  const pendingFeeCount = feeVouchers.filter(v => v.status === 'PENDING').length;

  const renderTabContent = () => (
    <>
      {activeTab === 'quick_actions' && (
        <QuickActionsHub
          subPage={quickActionsSubPage}
          setSubPage={setQuickActionsSubPage}
          students={currentYearStudents}
          onAddStudent={handleAddStudent}
          feeVouchers={feeVouchers}
          banks={banks}
          onReceiveFee={handleReceiveFee}
          onUpdateVoucher={handleUpdateVoucher}
          onDeleteVoucher={handleDeleteVoucher}
          onGenerateMonthlyVouchers={handleGenerateMonthlyVouchers}
          pendingFeeCount={pendingFeeCount}
          attendanceSessions={attendanceSessions}
          onSaveAttendance={handleSaveAttendance}
          onUpdateAttendanceSession={handleUpdateAttendanceSession}
          onDeleteAttendanceSession={handleDeleteAttendanceSession}
          teachers={teachers}
          teacherAttendanceSessions={teacherAttendanceSessions}
          onSaveTeacherAttendance={handleSaveTeacherAttendance}
          onUpdateTeacherAttendanceSession={handleUpdateTeacherAttendanceSession}
          onDeleteTeacherAttendanceSession={handleDeleteTeacherAttendanceSession}
          categories={expenseCategories}
          chargedExpenses={chargedExpenses}
          onChargeExpense={handleChargeExpense}
        />
      )}

      {activeTab === 'dashboard' && (
        <DashboardPlaceholder
          subPage={dashboardSubPage}
          setSubPage={setDashboardSubPage}
          students={students}
          currentYearStudents={currentYearStudents}
          attendanceSessions={attendanceSessions}
          marksheets={marksheets}
          feeVouchers={feeVouchers}
          banks={banks}
          currentSession={currentSession}
          timetables={timetables}
          teachers={teachers}
          datesheets={datesheets}
          tests={tests}
          schemes={schemesOfStudy}
        />
      )}

      {activeTab === 'students' && (
        <StudentTabHub
          subPage={studentSubPage}
          setSubPage={setStudentSubPage}
          students={currentYearStudents}
          onAddStudent={handleAddStudent}
          onUpdateStudent={handleUpdateStudent}
          onDeleteStudent={handleDeleteStudent}
          onToggleLeftStatus={handleToggleStudentStatus}
          attendanceSessions={attendanceSessions}
          onSaveAttendance={handleSaveAttendance}
          onUpdateAttendanceSession={handleUpdateAttendanceSession}
          onDeleteAttendanceSession={handleDeleteAttendanceSession}
          teachers={teachers}
          teacherAttendanceSessions={teacherAttendanceSessions}
          onSaveTeacherAttendance={handleSaveTeacherAttendance}
          onUpdateTeacherAttendanceSession={handleUpdateTeacherAttendanceSession}
          onDeleteTeacherAttendanceSession={handleDeleteTeacherAttendanceSession}
          feeVouchers={feeVouchers}
          banks={banks}
          onReceiveFee={handleReceiveFee}
          onUpdateVoucher={handleUpdateVoucher}
          onDeleteVoucher={handleDeleteVoucher}
          onGenerateMonthlyVouchers={handleGenerateMonthlyVouchers}
        />
      )}

      {activeTab === 'admin' && (
        <AdminTabHub
          subPage={adminSubPage}
          setSubPage={setAdminSubPage}
          timetables={timetables}
          teachers={teachers}
          onAddTimetable={handleAddTimetable}
          onUpdateTimetable={handleUpdateTimetable}
          onDeleteTimetable={handleDeleteTimetable}
          datesheets={datesheets}
          tests={tests}
          onAddTest={handleAddTest}
          onUpdateTest={handleUpdateTest}
          onDeleteTest={handleDeleteTest}
          onAddDatesheet={handleAddDatesheet}
          onUpdateDatesheet={handleUpdateDatesheet}
          onDeleteDatesheet={handleDeleteDatesheet}
          marksheets={marksheets}
          students={currentYearStudents}
          onAddMarksheet={handleAddMarksheet}
          onUpdateMarksheet={handleUpdateMarksheet}
          onDeleteMarksheet={handleDeleteMarksheet}
          teacherAttendanceSessions={teacherAttendanceSessions}
          onSaveTeacherAttendance={handleSaveTeacherAttendance}
          onUpdateTeacherAttendanceSession={handleUpdateTeacherAttendanceSession}
          onDeleteTeacherAttendanceSession={handleDeleteTeacherAttendanceSession}
          schemes={schemesOfStudy}
          onAddScheme={handleAddSchemeOfStudy}
          onUpdateScheme={handleUpdateSchemeOfStudy}
          onDeleteScheme={handleDeleteSchemeOfStudy}
          currentSession={currentSession}
        />
      )}

      {activeTab === 'banking' && (
        <BankingTabHub
          subPage={bankingSubPage}
          setSubPage={setBankingSubPage}
          banks={banks}
          onAddBank={handleAddBank}
          onUpdateBank={handleUpdateBank}
          onDeleteBank={handleDeleteBank}
          liveBalances={liveBalances}
          transfers={transfers}
          onAddTransfer={handleAddTransfer}
          onUpdateTransfer={handleUpdateTransfer}
          onDeleteTransfer={handleDeleteTransfer}
          categories={expenseCategories}
          chargedExpenses={chargedExpenses}
          onAddCategory={handleAddExpenseCategory}
          onUpdateCategory={handleUpdateExpenseCategory}
          onDeleteCategory={handleDeleteExpenseCategory}
          onChargeExpense={handleChargeExpense}
          onUpdateChargedExpense={handleUpdateChargedExpense}
          onDeleteChargedExpense={handleDeleteChargedExpense}
          teacherSalaries={teacherSalaries}
          teachers={teachers}
          onPaySalary={handlePaySalary}
          onUpdateSalary={handleUpdateSalary}
          onDeleteSalary={handleDeleteSalary}
        />
      )}

      {/* Reports Hub: View Past Year Student Details & Current Session Analytics */}
      {activeTab === 'reports' && (
        <ReportsPlaceholder
          subPage={reportsSubPage}
          setSubPage={setReportsSubPage}
          allStudents={students}
          currentSession={currentSession}
          sessionsList={academicSessionsList}
          feeVouchers={feeVouchers}
          banks={banks}
          chargedExpenses={chargedExpenses}
          expenseCategories={expenseCategories}
          teachers={teachers}
          teacherSalaries={teacherSalaries}
          attendanceSessions={attendanceSessions}
          teacherAttendanceSessions={teacherAttendanceSessions}
          marksheets={marksheets}
          datesheets={datesheets}
        />
      )}
    </>
  );

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700/80 text-xs font-semibold animate-in slide-in-from-top-4 duration-200 max-w-[90vw]">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {!isFrameMode ? (
        /* Desktop Mode: Left expandable & collapsible sidebar + desktop content workspace */
        <div className="flex h-screen w-screen bg-slate-100 overflow-hidden font-sans desktop-workspace">
          <DesktopSidebar
            activeTab={activeTab}
            activeSubPages={{
              quick_actions: quickActionsSubPage,
              dashboard: dashboardSubPage,
              students: studentSubPage,
              admin: adminSubPage,
              banking: bankingSubPage,
              reports: reportsSubPage
            }}
            onNavigate={handleDesktopNavigate}
            studentCount={activeStudentCount}
            pendingFeeCount={pendingFeeCount}
            currentSession={currentSession}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isFrameMode={isFrameMode}
            setIsFrameMode={setIsFrameMode}
          />

          <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
            <DesktopHeader
              activeTab={activeTab}
              activeSubPageLabel={getActiveSubPageLabel()}
              studentCount={activeStudentCount}
              attendanceCount={attendanceSessions.length + teacherAttendanceSessions.length}
              pendingFeeCount={pendingFeeCount}
              currentSession={currentSession}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onNavigate={handleDesktopNavigate}
            />

            <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
              <div className="max-w-6xl mx-auto w-full">
                {renderTabContent()}
              </div>
            </main>
          </div>
        </div>
      ) : (
        /* Mobile Phone Frame View */
        <MobileFrame isFrameMode={isFrameMode} setIsFrameMode={setIsFrameMode}>
          {/* Header with Star Academy Branding & Current Session */}
          <Header
            studentCount={activeStudentCount}
            attendanceCount={attendanceSessions.length + teacherAttendanceSessions.length}
            activeTab={activeTab}
            onNavigateTab={setActiveTab}
            onOpenSettings={() => setIsSettingsOpen(true)}
            currentSession={currentSession}
          />

          {/* Main Tab Screen */}
          <main className="flex-1 flex flex-col bg-slate-50 min-h-[500px] w-full min-w-0 overflow-x-hidden">
            {renderTabContent()}
          </main>

          {/* Mobile Bottom Navigation (6 Tabs) */}
          <BottomNav
            activeTab={activeTab}
            setActiveTab={handleTabChange}
            studentCount={activeStudentCount}
            pendingFeeCount={pendingFeeCount}
          />
        </MobileFrame>
      )}

      {/* Academy Settings & Curriculum Configuration Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        curriculumSubjects={curriculumSubjects}
        onSaveCurriculumSubjects={handleSaveCurriculumSubjects}
        studentCount={currentYearStudents.length}
        teacherCount={teachers.length}
        currentSession={currentSession}
        onStartNewYear={handleStartNewAcademicYear}
      />
    </>
  );
}
