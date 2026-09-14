import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  FileSpreadsheet,
  Award,
  BookOpen,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Users
} from 'lucide-react';
import StudentProfileDirectory from './StudentProfileDirectory';
import StudentProfileDetail from './StudentProfileDetail';
import TeacherProfileDirectory from './TeacherProfileDirectory';
import TeacherProfileDetail from './TeacherProfileDetail';
import TimetableSection from '../TimetableModule/TimetableSection';
import DatesheetSection from '../DatesheetModule/DatesheetSection';
import MarksheetSection from '../MarksheetModule/MarksheetSection';
import SOSSection from '../SOSModule/SOSSection';

export default function DashboardPlaceholder({
  subPage: propSubPage,
  setSubPage: propSetSubPage,
  students = [],
  currentYearStudents = [],
  attendanceSessions = [],
  marksheets = [],
  feeVouchers = [],
  banks = [],
  currentSession = '2026 - 27',
  timetables = [],
  teachers = [],
  teacherAttendanceSessions = [],
  onToggleTeacherStatus,
  datesheets = [],
  tests = [],
  schemes = []
}) {
  const [internalSubPage, setInternalSubPage] = useState(null);
  const subPage = propSubPage !== undefined ? propSubPage : internalSubPage;
  const setSubPage = propSetSubPage || setInternalSubPage;
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const displayStudents = currentYearStudents.length > 0 ? currentYearStudents : students;

  const menuItems = [
    {
      id: 'directory',
      title: 'Student Profile',
      subtitle: `${displayStudents.length} Students`,
      description: 'Registration, attendance, marks & fee history',
      icon: GraduationCap
    },
    {
      id: 'teacher_directory',
      title: 'Teacher Profile',
      subtitle: `${teachers.length} Teachers`,
      description: 'Faculty cards, info, attendance logs & analytics',
      icon: Users
    },
    {
      id: 'timetable',
      title: 'Timetable',
      subtitle: `${timetables.length} Timetables`,
      description: 'Weekly class schedules & lecture slots',
      icon: Calendar
    },
    {
      id: 'datesheet',
      title: 'Datesheets',
      subtitle: `${datesheets.length} Datesheets`,
      description: 'Exam papers, dates, timings & syllabus',
      icon: FileSpreadsheet
    },
    {
      id: 'marksheet',
      title: 'Marksheets',
      subtitle: `${marksheets.length} Marksheets`,
      description: 'Exam marks, percentages & student merit list',
      icon: Award
    },
    {
      id: 'sos',
      title: 'Scheme of Study (SOS)',
      subtitle: `${schemes.length} Schemes`,
      description: 'Curriculum syllabus & test milestones',
      icon: BookOpen
    }
  ];

  // Subpage: Student Profile Directory
  if (
    subPage === 'directory' ||
    subPage === 'student_profile' ||
    subPage === 'active_students' ||
    subPage === 'students_overview'
  ) {
    return (
      <div className="flex flex-col flex-1 pb-16">
        <StudentProfileDirectory
          students={displayStudents}
          onBack={() => setSubPage(null)}
          onSelectStudent={(student) => {
            setSelectedStudent(student);
            setSubPage('profile');
          }}
        />
      </div>
    );
  }

  // Subpage: Student Profile Detail View
  if (subPage === 'profile') {
    const studentToDisplay = selectedStudent || displayStudents[0];
    if (studentToDisplay) {
      return (
        <div className="flex flex-col flex-1 pb-16">
          <StudentProfileDetail
            student={studentToDisplay}
            onBack={() => setSubPage('directory')}
            attendanceSessions={attendanceSessions}
            marksheets={marksheets}
            feeVouchers={feeVouchers}
            banks={banks}
            currentSession={currentSession}
          />
        </div>
      );
    }
    return (
      <div className="flex flex-col flex-1 pb-16">
        <StudentProfileDirectory
          students={displayStudents}
          onBack={() => setSubPage(null)}
          onSelectStudent={(student) => {
            setSelectedStudent(student);
            setSubPage('profile');
          }}
        />
      </div>
    );
  }

  // Subpage: Teacher Profile Directory
  if (
    subPage === 'teacher_directory' ||
    subPage === 'teacher_profile' ||
    subPage === 'faculty_directory'
  ) {
    return (
      <div className="flex flex-col flex-1 pb-16">
        <TeacherProfileDirectory
          teachers={teachers}
          teacherAttendanceSessions={teacherAttendanceSessions}
          onBack={() => setSubPage(null)}
          onSelectTeacher={(teacher) => {
            setSelectedTeacher(teacher);
            setSubPage('teacher_detail');
          }}
        />
      </div>
    );
  }

  // Subpage: Teacher Profile Detail View
  if (subPage === 'teacher_detail') {
    const teacherToDisplay =
      (selectedTeacher && teachers.find((t) => t.id === selectedTeacher.id)) ||
      selectedTeacher ||
      teachers[0];

    if (teacherToDisplay) {
      return (
        <div className="flex flex-col flex-1 pb-16">
          <TeacherProfileDetail
            teacher={teacherToDisplay}
            onBack={() => setSubPage('teacher_directory')}
            teacherAttendanceSessions={teacherAttendanceSessions}
            onToggleTeacherStatus={onToggleTeacherStatus}
            timetables={timetables}
          />
        </div>
      );
    }
    return (
      <div className="flex flex-col flex-1 pb-16">
        <TeacherProfileDirectory
          teachers={teachers}
          teacherAttendanceSessions={teacherAttendanceSessions}
          onBack={() => setSubPage(null)}
          onSelectTeacher={(teacher) => {
            setSelectedTeacher(teacher);
            setSubPage('teacher_detail');
          }}
        />
      </div>
    );
  }

  // Subpages for View-Only Academic Modules
  if (subPage) {
    let pageTitle = '';
    if (subPage === 'timetable') pageTitle = 'Timetables (View Only)';
    else if (subPage === 'datesheet') pageTitle = 'Datesheets (View Only)';
    else if (subPage === 'marksheet') pageTitle = 'Marksheets (View Only)';
    else if (subPage === 'sos') pageTitle = 'Scheme of Study (View Only)';

    // If subPage is unrecognized, show StudentProfileDirectory instead of blank screen
    if (!pageTitle) {
      return (
        <div className="flex flex-col flex-1 pb-16">
          <StudentProfileDirectory
            students={displayStudents}
            onBack={() => setSubPage(null)}
            onSelectStudent={(student) => {
              setSelectedStudent(student);
              setSubPage('profile');
            }}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 pb-16">
        {/* Subpage Header with Back Button */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setSubPage(null)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all tap-active cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <span className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
              {pageTitle}
            </span>
          </div>
        </div>

        {/* View-Only Subpage Contents */}
        <div className="max-w-6xl mx-auto w-full p-4 md:p-6">
          {subPage === 'timetable' && (
            <TimetableSection
              timetables={timetables}
              teachers={teachers}
              readOnly={true}
            />
          )}

          {subPage === 'datesheet' && (
            <DatesheetSection
              datesheets={datesheets}
              tests={tests}
              readOnly={true}
            />
          )}

          {subPage === 'marksheet' && (
            <MarksheetSection
              marksheets={marksheets}
              tests={tests}
              datesheets={datesheets}
              students={displayStudents}
              readOnly={true}
            />
          )}

          {subPage === 'sos' && (
            <SOSSection
              schemes={schemes}
              currentSession={currentSession}
              readOnly={true}
            />
          )}
        </div>
      </div>
    );
  }

  // Dashboard Main Hub View
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
    </div>
  );
}
