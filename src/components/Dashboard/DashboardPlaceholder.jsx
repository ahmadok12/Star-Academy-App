import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  FileSpreadsheet,
  Award,
  BookOpen,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import StudentProfileDirectory from './StudentProfileDirectory';
import StudentProfileDetail from './StudentProfileDetail';
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
  datesheets = [],
  tests = [],
  schemes = []
}) {
  const [internalSubPage, setInternalSubPage] = useState(null);
  const subPage = propSubPage !== undefined ? propSubPage : internalSubPage;
  const setSubPage = propSetSubPage || setInternalSubPage;
  const [selectedStudent, setSelectedStudent] = useState(null);

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
  if (subPage === 'directory') {
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
  if (subPage === 'profile' && selectedStudent) {
    return (
      <div className="flex flex-col flex-1 pb-16">
        <StudentProfileDetail
          student={selectedStudent}
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

  // Subpages for View-Only Academic Modules
  if (subPage) {
    let pageTitle = '';
    if (subPage === 'timetable') pageTitle = 'Timetables (View Only)';
    else if (subPage === 'datesheet') pageTitle = 'Datesheets (View Only)';
    else if (subPage === 'marksheet') pageTitle = 'Marksheets (View Only)';
    else if (subPage === 'sos') pageTitle = 'Scheme of Study (View Only)';

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
            <span>Back to Dashboard</span>
          </button>
          <span className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
            {pageTitle}
          </span>
        </div>

        {/* View-Only Subpage Contents */}
        <div className="p-4 md:p-6">
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
