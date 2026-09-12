import React from 'react';
import {
  Calendar,
  Settings,
  Users,
  ClipboardCheck,
  CreditCard,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';

export default function DesktopHeader({
  activeTab,
  activeSubPageLabel,
  studentCount = 0,
  attendanceCount = 0,
  pendingFeeCount = 0,
  currentSession = '2026 - 27',
  onOpenSettings,
  onNavigate
}) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const tabLabels = {
    quick_actions: 'Quick Actions',
    dashboard: 'Dashboard',
    students: 'Students',
    admin: 'Admin',
    banking: 'Banking & Finance',
    reports: 'Reports'
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-5 py-1.5 flex items-center justify-between gap-3 select-none sticky top-0 z-20">
      {/* Left: Breadcrumbs navigation & quick search */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs shrink-0">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
            Star Academy
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-bold text-slate-900 text-xs sm:text-sm">
            {tabLabels[activeTab] || 'Dashboard'}
          </span>
          {activeSubPageLabel && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.2 rounded-full text-[11px]">
                {activeSubPageLabel}
              </span>
            </>
          )}
        </div>

        {/* Global Search Input (EduManage style) */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-100/80 border border-slate-200/60 rounded-lg px-2.5 py-1 w-56 text-slate-400 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 focus-within:bg-white transition-all">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search students, roll no..."
            className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Center / Right: Quick Metrics & System Information */}
      <div className="flex items-center gap-2">
        {/* KPI: Enrolled Students */}
        <button
          type="button"
          onClick={() => onNavigate('students', null)}
          className="hidden md:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs text-slate-700 transition-colors cursor-pointer shadow-2xs"
          title="View Students"
        >
          <div className="w-4.5 h-4.5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-3 h-3" />
          </div>
          <span className="text-slate-500 font-medium text-[11px]">Students:</span>
          <span className="font-bold text-slate-900 text-xs">{studentCount}</span>
        </button>

        {/* KPI: Attendance */}
        <button
          type="button"
          onClick={() => onNavigate('students', 'attendance')}
          className="hidden lg:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg text-xs text-slate-700 transition-colors cursor-pointer shadow-2xs"
          title="View Attendance Sessions"
        >
          <div className="w-4.5 h-4.5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ClipboardCheck className="w-3 h-3" />
          </div>
          <span className="text-slate-500 font-medium text-[11px]">Attendance:</span>
          <span className="font-bold text-slate-900 text-xs">{attendanceCount}</span>
        </button>

        {/* KPI: Pending Fees */}
        {pendingFeeCount > 0 && (
          <button
            type="button"
            onClick={() => onNavigate('reports', 'fee_paid_pending')}
            className="hidden sm:flex items-center gap-1.5 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer"
            title="View Pending Dues"
          >
            <CreditCard className="w-3 h-3 text-amber-700" />
            <span className="text-amber-700 font-medium text-[11px]">Pending:</span>
            <span className="font-bold text-amber-900 text-xs bg-amber-200/80 px-1.5 py-0.2 rounded-full">
              {pendingFeeCount}
            </span>
          </button>
        )}

        <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

        {/* Today Date */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{today}</span>
        </div>

        {/* Session Badge */}
        <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-md text-[11px] font-semibold">
          <span>Session {currentSession}</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => onNavigate('quick_actions', null)}
          className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>

        {/* Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80"
          title="Academy Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* User Profile Pill (EduManage style) */}
        <div className="hidden sm:flex items-center gap-2 pl-1.5 border-l border-slate-200/80">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shadow-2xs">
            SI
          </div>
          <div className="hidden md:block text-left leading-none">
            <span className="block text-xs font-bold text-slate-800">Salman Ijaz</span>
            <span className="block text-[9px] text-slate-400 font-medium mt-0.5">Principal Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
