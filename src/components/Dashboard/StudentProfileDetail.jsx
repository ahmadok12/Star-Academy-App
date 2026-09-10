import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  ClipboardCheck,
  Award,
  BookOpen,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  DollarSign,
  Layers,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  MessageCircle,
  Printer
} from 'lucide-react';
import { exportStudentProfilePDF, printStudentProfile, shareStudentProfileWhatsApp } from '../../utils/exportShareUtils';

export default function StudentProfileDetail({
  student,
  onBack,
  attendanceSessions = [],
  marksheets = [],
  feeVouchers = [],
  banks = [],
  currentSession = '2026 - 27'
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'academics', 'attendance', 'marksheets', 'fees'

  if (!student) return null;

  // --- 1. Attendance Calculations ---
  const studentAttendance = useMemo(() => {
    const records = [];
    let present = 0;
    let absent = 0;
    let leave = 0;

    attendanceSessions.forEach((session) => {
      const match = session.records?.find((r) => r.studentId === student.id);
      if (match) {
        records.push({
          id: session.id,
          date: session.date,
          studentClass: session.studentClass,
          subject: session.subject,
          status: match.status
        });
        if (match.status === 'Present') present++;
        else if (match.status === 'Absent') absent++;
        else if (match.status === 'Leave') leave++;
      }
    });

    records.sort((a, b) => new Date(b.date) - new Date(a.date));
    const total = present + absent + leave;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 100;

    return { records, present, absent, leave, total, percentage };
  }, [attendanceSessions, student.id]);

  // --- 2. Test Results from Marksheets ---
  const studentTestResults = useMemo(() => {
    const results = [];

    marksheets.forEach((ms) => {
      const list = ms.studentScores || ms.studentResults || [];
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim().toLowerCase();
      const found = list.find(
        (r) =>
          r.studentId === student.id ||
          (r.studentName && r.studentName.trim().toLowerCase() === fullName)
      );
      if (found) {
        results.push({
          marksheetId: ms.id,
          marksheetTitle: ms.title,
          testName: ms.testName || ms.title,
          studentClass: ms.studentClass,
          section: ms.section,
          createdAt: ms.createdAt || ms.date,
          totalObtained: found.totalObtained,
          totalMax: found.totalMax,
          percentage: found.percentage,
          grade: found.grade,
          isPassed: found.isPassed,
          scores: found.scores || {}
        });
      }
    });

    results.sort((a, b) => new Date(b.createdAt || '') - new Date(a.createdAt || ''));
    const totalTests = results.length;
    const passedTests = results.filter((r) => r.isPassed).length;
    const averagePercentage =
      totalTests > 0
        ? (results.reduce((acc, r) => acc + (Number(r.percentage) || 0), 0) / totalTests).toFixed(1)
        : 0;

    return { results, totalTests, passedTests, averagePercentage };
  }, [marksheets, student.id]);

  // --- 3. Fee Status & Previous Paid History ---
  const studentFeeData = useMemo(() => {
    const vouchers = feeVouchers.filter((v) => v.studentId === student.id);
    vouchers.sort((a, b) => new Date(b.createdAt || b.dueDate || '') - new Date(a.createdAt || a.dueDate || ''));

    const paidVouchers = vouchers.filter((v) => v.status === 'PAID');
    const pendingVouchers = vouchers.filter((v) => v.status === 'PENDING');

    const totalPaidAmount = paidVouchers.reduce(
      (sum, v) => sum + (Number(v.amountPaid) || Number(v.feeAmount) || 0),
      0
    );
    const totalPendingAmount = pendingVouchers.reduce(
      (sum, v) => sum + (Number(v.feeAmount) || 0),
      0
    );

    return {
      vouchers,
      paidVouchers,
      pendingVouchers,
      totalPaidAmount,
      totalPendingAmount,
      hasPending: pendingVouchers.length > 0
    };
  }, [feeVouchers, student.id]);

  const bankNameMap = useMemo(() => {
    const map = {};
    banks.forEach((b) => {
      map[b.id] = b.bankName;
    });
    return map;
  }, [banks]);

  const isActive = !student.isLeft && student.isActive !== false;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Navigation Bar with Back Button & Actions */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition-all tap-active"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => printStudentProfile(student, { attendanceSessions, marksheets, feeVouchers, banks })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title="Print Preview Complete Profile"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Preview</span>
          </button>
          <button
            type="button"
            onClick={() => exportStudentProfilePDF(student, { attendanceSessions, marksheets, feeVouchers, banks })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs transition-all cursor-pointer"
            title="Download Profile PDF"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>PDF</span>
          </button>
          <button
            type="button"
            onClick={() => shareStudentProfileWhatsApp(student, { attendanceSessions, marksheets, feeVouchers, banks })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title="Share Profile on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-extrabold border border-blue-100">
            {student.academicYear || currentSession}
          </span>
        </div>
      </div>

      {/* Profile Header Hero Card */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <img
            src={student.pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
            alt={student.firstName}
            className="w-20 h-20 rounded-3xl object-cover border-2 border-white/30 shadow-md shrink-0"
          />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/25 text-amber-300 border border-amber-300/40 text-[10px] font-black uppercase tracking-wider">
                {student.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                isActive
                  ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/30'
                  : 'bg-rose-500/25 text-rose-200 border border-rose-400/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
                {isActive ? 'Active Student' : 'Inactive / Left Academy'}
              </span>
            </div>

            <h2 className="text-xl font-black text-white leading-tight">
              {student.firstName} {student.lastName}
            </h2>

            <p className="text-xs text-indigo-100 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>Class {student.studentClass}</span>
              <span>•</span>
              <span>Section: {student.section || student.subject}</span>
            </p>

            <div className="pt-2 flex items-center justify-center sm:justify-start gap-2 text-[11px] text-indigo-200/90 flex-wrap">
              <span>Date of Joining: <strong className="text-white">{student.dateOfJoining || student.registeredAt || 'N/A'}</strong></span>
              <span>•</span>
              <span>Monthly Tuition: <strong className="text-amber-300">Rs. {Number(student.fees || 0).toLocaleString()}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'overview', label: 'Overview & Info', icon: User },
          { id: 'attendance', label: `Attendance (${studentAttendance.percentage}%)`, icon: ClipboardCheck },
          { id: 'marksheets', label: `Test Results (${studentTestResults.totalTests})`, icon: Award },
          { id: 'fees', label: `Fee History (${studentFeeData.vouchers.length})`, icon: CreditCard }
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & REGISTRATION INFORMATION */}
      {activeTab === 'overview' && (
        <div className="space-y-3">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Attendance</span>
              <span className="text-base font-black text-emerald-600 mt-0.5 block">
                {studentAttendance.percentage}%
              </span>
              <span className="text-[10px] text-slate-400">{studentAttendance.present}/{studentAttendance.total} Days</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Avg Exam Score</span>
              <span className="text-base font-black text-indigo-600 mt-0.5 block">
                {studentTestResults.totalTests > 0 ? `${studentTestResults.averagePercentage}%` : 'N/A'}
              </span>
              <span className="text-[10px] text-slate-400">{studentTestResults.passedTests}/{studentTestResults.totalTests} Passed</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Fee Status</span>
              <span className={`text-base font-black mt-0.5 block ${studentFeeData.hasPending ? 'text-amber-600' : 'text-emerald-600'}`}>
                {studentFeeData.hasPending ? 'Pending' : 'Cleared'}
              </span>
              <span className="text-[10px] text-slate-400">{studentFeeData.paidVouchers.length} Paid Vouchers</span>
            </div>
          </div>

          {/* Registration & Personal Information Card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Registration & Student Information</span>
              </h3>
              <span className="text-[10.5px] font-bold text-slate-400">
                Roll ID: <strong className="text-slate-700">{student.id}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Full Name</span>
                <span className="font-extrabold text-slate-900">{student.firstName} {student.lastName}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Gender</span>
                <span className="font-extrabold text-slate-900">{student.gender || 'Not specified'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Date of Joining</span>
                <span className="font-extrabold text-slate-900">{student.dateOfJoining || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Admission Registration Date</span>
                <span className="font-extrabold text-slate-900">{student.registeredAt || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Student Contact</span>
                <span className="font-extrabold text-slate-900 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {student.contactNumber || 'N/A'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">WhatsApp Number</span>
                <span className="font-extrabold text-slate-900">
                  {student.whatsappNumber || student.contactNumber || 'N/A'}
                </span>
              </div>

              {student.email && (
                <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Email Address</span>
                  <span className="font-semibold text-slate-800">{student.email}</span>
                </div>
              )}

              {student.address && (
                <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Residential Address</span>
                  <span className="font-medium text-slate-800 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    {student.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Guardian / Father Information Card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Father / Guardian Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Father / Guardian Name</span>
                <span className="font-black text-slate-900">{student.fatherName || 'N/A'}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Guardian Contact</span>
                <span className="font-black text-slate-900 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {student.fatherContact || student.contactNumber || 'N/A'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Guardian CNIC</span>
                <span className="font-mono font-black text-slate-900">{student.fatherCnic || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Academic Placement Card */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>Academic Placement & Class Enrollment</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Enrolled Class</span>
                <span className="font-black text-slate-900 text-sm mt-0.5 block">{student.studentClass}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Section / Group</span>
                <span className="font-black text-indigo-600 text-sm mt-0.5 block">{student.section || student.subject}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Academic Session</span>
                <span className="font-black text-amber-700 text-sm mt-0.5 block">{student.academicYear || currentSession}</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Fee</span>
                <span className="font-black text-slate-900 text-sm mt-0.5 block">Rs. {Number(student.fees || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE REPORT */}
      {activeTab === 'attendance' && (
        <div className="space-y-3">
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Days</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">
                {studentAttendance.total}
              </span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Present</span>
              <span className="text-base font-black text-emerald-700 mt-0.5 block">
                {studentAttendance.present}
              </span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-rose-500 font-bold uppercase block">Absent</span>
              <span className="text-base font-black text-rose-600 mt-0.5 block">
                {studentAttendance.absent}
              </span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-amber-500 font-bold uppercase block">Leave</span>
              <span className="text-base font-black text-amber-600 mt-0.5 block">
                {studentAttendance.leave}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Cumulative Attendance Rate</span>
              <span className="font-black text-emerald-600">{studentAttendance.percentage}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${studentAttendance.percentage}%` }}
              />
            </div>
          </div>

          {/* Attendance Records List */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                <span>Attendance Log History ({studentAttendance.records.length} Sessions)</span>
              </h3>
            </div>

            {studentAttendance.records.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-1">
                <p className="text-xs font-bold">No attendance sessions recorded yet for this student.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {studentAttendance.records.map((rec) => {
                  const isPresent = rec.status === 'Present';
                  const isAbsent = rec.status === 'Absent';
                  const isLeave = rec.status === 'Leave';

                  return (
                    <div
                      key={rec.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-800">{rec.date}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-semibold">{rec.studentClass} ({rec.subject})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">Log Ref: {rec.id}</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-xs font-extrabold ${
                        isPresent
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isAbsent
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: TEST RESULTS SAVED IN MARKSHEETS */}
      {activeTab === 'marksheets' && (
        <div className="space-y-3">
          {/* Exam Summary Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Tests Taken</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">
                {studentTestResults.totalTests}
              </span>
              <span className="text-[10px] text-slate-400">Exam records</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-indigo-500 font-bold uppercase block">Tests Passed</span>
              <span className="text-base font-black text-indigo-600 mt-0.5 block">
                {studentTestResults.passedTests}
              </span>
              <span className="text-[10px] text-indigo-400">Successful papers</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-center">
              <span className="text-[10px] text-purple-500 font-bold uppercase block">Average Score</span>
              <span className="text-base font-black text-purple-700 mt-0.5 block">
                {studentTestResults.averagePercentage}%
              </span>
              <span className="text-[10px] text-purple-400">Cumulative GPA</span>
            </div>
          </div>

          {/* Test Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Exam Marksheet Evaluations
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                {studentTestResults.results.length} Tests Recorded
              </span>
            </div>

            {studentTestResults.results.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200 shadow-xs space-y-2 text-slate-400">
                <Award className="w-10 h-10 mx-auto text-slate-300" />
                <h4 className="text-xs font-bold text-slate-700">No Marksheet Results Found</h4>
                <p className="text-[11px] max-w-xs mx-auto">
                  When examination marks are published in Marksheets in the Admin tab, this student's grades and subject scores will automatically populate here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentTestResults.results.map((res) => (
                  <div
                    key={res.marksheetId}
                    className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-mono text-[10.5px] font-bold">
                            {res.marksheetId}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {res.createdAt || 'N/A'}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-900 mt-0.5">
                          {res.testName}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {res.studentClass} ({res.section})
                        </span>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-1 rounded-xl text-xs font-black inline-block ${
                          res.isPassed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          Grade {res.grade} • {res.isPassed ? 'Passed' : 'Failed'}
                        </span>
                        <div className="text-xs font-black text-slate-800 mt-1">
                          {res.totalObtained} / {res.totalMax} ({res.percentage}%)
                        </div>
                      </div>
                    </div>

                    {/* Subject-wise Scores Breakdown */}
                    {res.scores && Object.keys(res.scores).length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Subject Score Breakdown:
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                          {Object.entries(res.scores).map(([sub, score]) => (
                            <div
                              key={sub}
                              className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                            >
                              <span className="font-semibold text-slate-600 truncate mr-1">{sub}</span>
                              <span className="font-black text-slate-900 shrink-0">{score}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CURRENT FEE STATUS & PREVIOUS PAID HISTORY */}
      {activeTab === 'fees' && (
        <div className="space-y-3">
          {/* Fee Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Tuition Fee</span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">
                Rs. {Number(student.fees || 0).toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400">Regular fee plan</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-emerald-600 font-bold uppercase block">Total Fees Paid</span>
              <span className="text-base font-black text-emerald-700 mt-0.5 block">
                Rs. {studentFeeData.totalPaidAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-600">{studentFeeData.paidVouchers.length} Paid Vouchers</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] text-amber-600 font-bold uppercase block">Pending Due Amount</span>
              <span className="text-base font-black text-amber-700 mt-0.5 block">
                Rs. {studentFeeData.totalPendingAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-600">{studentFeeData.pendingVouchers.length} Pending Vouchers</span>
            </div>
          </div>

          {/* Current Status Banner */}
          <div className={`p-3.5 rounded-2xl border text-xs flex items-center gap-2.5 ${
            studentFeeData.hasPending
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {studentFeeData.hasPending ? (
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
            )}
            <div>
              <span className="font-black block">
                {studentFeeData.hasPending ? 'Pending Fee Payment Due' : 'All Student Fee Dues Cleared'}
              </span>
              <p className="text-[11px] opacity-90 mt-0.5">
                {studentFeeData.hasPending
                  ? `Student has ${studentFeeData.pendingVouchers.length} unpaid fee voucher(s) totaling Rs. ${studentFeeData.totalPendingAmount.toLocaleString()}.`
                  : 'All issued monthly tuition fee vouchers have been verified and paid.'}
              </p>
            </div>
          </div>

          {/* Previous Fee Vouchers History */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Previous Fee Paid History & Vouchers ({studentFeeData.vouchers.length})</span>
              </h3>
            </div>

            {studentFeeData.vouchers.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-2xl text-slate-400 space-y-1">
                <p className="text-xs font-bold">No fee vouchers have been generated for this student yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {studentFeeData.vouchers.map((v) => {
                  const isPaid = v.status === 'PAID';
                  const bankName = bankNameMap[v.bankId] || v.bankId || 'Main Account';

                  return (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <span className="font-black text-slate-900 text-xs block">
                            {v.month}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Voucher #{v.id}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black inline-block ${
                            isPaid
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {isPaid ? 'PAID' : 'PENDING'}
                          </span>
                          <div className="text-xs font-black text-slate-800 mt-0.5">
                            Rs. {Number(v.feeAmount || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                        {isPaid ? (
                          <>
                            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle className="w-3 h-3 text-emerald-600" />
                              Paid on {v.paidDate || 'N/A'}
                            </span>
                            <span className="text-slate-600 font-medium">
                              Bank: <strong>{bankName}</strong>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-amber-700 font-semibold">
                              Due Date: {v.dueDate || 'N/A'}
                            </span>
                            <span className="text-slate-400">Awaiting collection</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Floating Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-3xl border border-slate-200 shadow-xl flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>{student.firstName} {student.lastName} ({student.id})</span>
        </div>
        <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
          <button
            type="button"
            onClick={() => printStudentProfile(student, { attendanceSessions, marksheets, feeVouchers, banks })}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Preview</span>
          </button>
          <button
            type="button"
            onClick={() => exportStudentProfilePDF(student, { attendanceSessions, marksheets, feeVouchers, banks })}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-300/80 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={() => shareStudentProfileWhatsApp(student, { attendanceSessions, marksheets, feeVouchers, banks })}
            className="flex-1 sm:flex-initial py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
