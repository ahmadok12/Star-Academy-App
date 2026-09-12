import React from 'react';
import {
  Calendar,
  FileSpreadsheet,
  Award,
  BookOpen,
  GraduationCap,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Clock,
  Users
} from 'lucide-react';
import TimetableSection from '../TimetableModule/TimetableSection';
import DatesheetSection from '../DatesheetModule/DatesheetSection';
import MarksheetSection from '../MarksheetModule/MarksheetSection';
import SOSSection from '../SOSModule/SOSSection';
import TeacherAttendanceDashboard from '../TeacherAttendanceModule/TeacherAttendanceDashboard';
import TeacherList from '../TeacherModule/TeacherList';

export default function AdminTabHub({
  subPage,
  setSubPage,
  // Teacher props
  teachers = [],
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  // Timetables props
  timetables = [],
  onAddTimetable,
  onUpdateTimetable,
  onDeleteTimetable,
  // Datesheet props
  datesheets = [],
  tests = [],
  onAddTest,
  onUpdateTest,
  onDeleteTest,
  onAddDatesheet,
  onUpdateDatesheet,
  onDeleteDatesheet,
  // Marksheet props
  marksheets = [],
  students = [],
  onAddMarksheet,
  onUpdateMarksheet,
  onDeleteMarksheet,
  // Teacher Attendance props
  teacherAttendanceSessions = [],
  onSaveTeacherAttendance,
  onUpdateTeacherAttendanceSession,
  onDeleteTeacherAttendanceSession,
  // Scheme of Study (SOS) props
  schemes = [],
  onAddScheme,
  onUpdateScheme,
  onDeleteScheme,
  currentSession = '2026 - 27',
  batches = []
}) {
  const menuItems = [
    {
      id: 'teachers_list',
      title: 'List of Teachers',
      subtitle: `${teachers.length} Teachers`,
      description: 'Manage faculty, profiles, subjects & salaries',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100'
    },
    {
      id: 'timetable',
      title: 'Timetable',
      subtitle: `${timetables.length} Timetables`,
      description: 'Weekly class schedule & period slots',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      id: 'datesheet',
      title: 'Datesheet',
      subtitle: `${datesheets.length} Datesheets`,
      description: 'Exam dates, subject papers & timings',
      icon: FileSpreadsheet,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-100'
    },
    {
      id: 'marksheet',
      title: 'Marksheet',
      subtitle: `${marksheets.length} Marksheets`,
      description: 'Exam marks, grades & student ranking',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      id: 'sos',
      title: 'Scheme of Study (SOS)',
      subtitle: `${schemes.length} Schemes`,
      description: 'Curriculum distribution & syllabus guide',
      icon: BookOpen,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    {
      id: 'teacher_attendance',
      title: 'Teacher Attendance',
      subtitle: `${teacherAttendanceSessions.length} Sessions`,
      description: 'Mark & track daily faculty attendance',
      icon: GraduationCap,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-100'
    }
  ];

  // If a subpage is opened, render subpage with Back button
  if (subPage) {
    let pageTitle = '';
    if (subPage === 'teachers_list') pageTitle = 'List of Teachers';
    else if (subPage === 'timetable') pageTitle = 'Timetable';
    else if (subPage === 'datesheet') pageTitle = 'Datesheet';
    else if (subPage === 'marksheet') pageTitle = 'Marksheet';
    else if (subPage === 'sos') pageTitle = 'Scheme of Study (SOS)';
    else if (subPage === 'teacher_attendance') pageTitle = 'Teacher Attendance';

    return (
      <div className="flex flex-col flex-1 pb-16">
        {/* Subpage Header with Back Button */}
        {subPage !== 'teacher_attendance' && (
          <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
            <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-4 py-3">
              <button
                type="button"
                onClick={() => setSubPage(null)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-all tap-active cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Admin</span>
              </button>
              <span className="text-sm md:text-base font-bold text-slate-800 tracking-tight">
                {pageTitle}
              </span>
            </div>
          </div>
        )}

        {/* Subpage Content */}
        {subPage === 'teachers_list' && (
          <div className="max-w-6xl mx-auto w-full">
            <TeacherList
              teachers={teachers}
              onAddTeacher={onAddTeacher}
              onUpdateTeacher={onUpdateTeacher}
              onDeleteTeacher={onDeleteTeacher}
              onOpenTeacherAttendance={() => setSubPage('teacher_attendance')}
            />
          </div>
        )}

        {subPage === 'timetable' && (
          <div className="max-w-6xl mx-auto w-full p-4">
            <TimetableSection
              timetables={timetables}
              teachers={teachers}
              onAddTimetable={onAddTimetable}
              onUpdateTimetable={onUpdateTimetable}
              onDeleteTimetable={onDeleteTimetable}
              onNavigateDatesheets={() => setSubPage('datesheet')}
            />
          </div>
        )}

        {subPage === 'datesheet' && (
          <div className="max-w-6xl mx-auto w-full p-4">
            <DatesheetSection
              datesheets={datesheets}
              tests={tests}
              onAddTest={onAddTest}
              onUpdateTest={onUpdateTest}
              onDeleteTest={onDeleteTest}
              onAddDatesheet={onAddDatesheet}
              onUpdateDatesheet={onUpdateDatesheet}
              onDeleteDatesheet={onDeleteDatesheet}
              onNavigateMarksheets={() => setSubPage('marksheet')}
            />
          </div>
        )}

        {subPage === 'marksheet' && (
          <div className="max-w-6xl mx-auto w-full p-4">
            <MarksheetSection
              marksheets={marksheets}
              tests={tests}
              datesheets={datesheets}
              students={students}
              onAddMarksheet={onAddMarksheet}
              onUpdateMarksheet={onUpdateMarksheet}
              onDeleteMarksheet={onDeleteMarksheet}
            />
          </div>
        )}

        {subPage === 'sos' && (
          <div className="max-w-6xl mx-auto w-full p-4">
            <SOSSection
              schemes={schemes}
              onAddScheme={onAddScheme}
              onUpdateScheme={onUpdateScheme}
              onDeleteScheme={onDeleteScheme}
              currentSession={currentSession}
              batches={batches}
            />
          </div>
        )}

        {subPage === 'teacher_attendance' && (
          <TeacherAttendanceDashboard
            teachers={teachers}
            teacherAttendanceSessions={teacherAttendanceSessions}
            onSaveTeacherAttendance={onSaveTeacherAttendance}
            onUpdateTeacherAttendanceSession={onUpdateTeacherAttendanceSession}
            onDeleteTeacherAttendanceSession={onDeleteTeacherAttendanceSession}
            onBack={() => setSubPage(null)}
          />
        )}
      </div>
    );
  }

  // Main Admin Menu: 2 in a row / 3 in a row buttons
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
