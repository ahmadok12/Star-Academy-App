import React from 'react';
import {
  Calendar,
  Settings,
  Users,
  ClipboardCheck,
  CreditCard,
  ChevronRight
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
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between gap-4 select-none sticky top-0 z-20">
      {/* Left: Breadcrumbs navigation */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-slate-400 uppercase tracking-wider text-xs">
          Star Academy
        </span>
        <ChevronRight className="w-4 h-4 text-slate-300" />
        <span className="font-bold text-slate-900 text-sm">
          {tabLabels[activeTab] || 'Dashboard'}
        </span>
        {activeSubPageLabel && (
          <>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md text-xs">
              {activeSubPageLabel}
            </span>
          </>
        )}
      </div>

      {/* Center / Right: Quick Metrics & System Information */}
      <div className="flex items-center gap-3">
        {/* KPI: Enrolled Students */}
        <button
          type="button"
          onClick={() => onNavigate('students', null)}
          className="hidden md:flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-700 transition-colors cursor-pointer"
          title="View Students"
        >
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-slate-500 font-medium text-xs">Students:</span>
          <span className="font-bold text-slate-900 text-sm">{studentCount}</span>
        </button>

        {/* KPI: Attendance */}
        <button
          type="button"
          onClick={() => onNavigate('students', 'attendance')}
          className="hidden lg:flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-sm text-slate-700 transition-colors cursor-pointer"
          title="View Attendance Sessions"
        >
          <ClipboardCheck className="w-4 h-4 text-slate-500" />
          <span className="text-slate-500 font-medium text-xs">Attendance:</span>
          <span className="font-bold text-slate-900 text-sm">{attendanceCount}</span>
        </button>

        {/* KPI: Pending Fees */}
        {pendingFeeCount > 0 && (
          <button
            type="button"
            onClick={() => onNavigate('reports', 'fee_paid_pending')}
            className="hidden sm:flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer"
            title="View Pending Dues"
          >
            <CreditCard className="w-4 h-4 text-slate-600" />
            <span className="text-slate-600 font-medium text-xs">Pending:</span>
            <span className="font-bold text-slate-900 text-xs bg-slate-200/80 px-1.5 py-0.5 rounded">
              {pendingFeeCount}
            </span>
          </button>
        )}

        <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>

        {/* Today Date */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>{today}</span>
        </div>

        {/* Session Badge */}
        <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
          <span>Session {currentSession}</span>
        </div>

        {/* Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
          title="Academy Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
