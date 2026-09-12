import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calendar,
  Settings,
  Users,
  ClipboardCheck,
  CreditCard,
  ChevronRight,
  Search,
  Bell,
  X
} from 'lucide-react';

export default function DesktopHeader({
  activeTab,
  activeSubPageLabel,
  studentCount = 0,
  attendanceCount = 0,
  pendingFeeCount = 0,
  currentSession = '2026 - 27',
  onOpenSettings,
  onNavigate,
  students = [],
  onSearchSubmit
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter matching students for quick dropdown
  const matchingStudents = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return students
      .filter((s) => {
        const name = (s.studentName || s.name || `${s.firstName || ''} ${s.lastName || ''}`).toLowerCase();
        const id = (s.id || '').toLowerCase();
        const rollNo = (s.rollNo || s.studentId || '').toLowerCase();
        const cls = (s.studentClass || s.class || '').toLowerCase();
        const father = (s.fatherName || '').toLowerCase();
        return name.includes(q) || id.includes(q) || rollNo.includes(q) || cls.includes(q) || father.includes(q);
      })
      .slice(0, 6);
  }, [students, searchQuery]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsDropdownOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(searchQuery.trim());
    } else if (onNavigate) {
      onNavigate('students', 'list');
    }
  };

  const handleSelectStudent = (student) => {
    setIsDropdownOpen(false);
    const query = student.studentName || student.name || student.id;
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else if (onNavigate) {
      onNavigate('students', 'list');
    }
  };

  const tabLabels = {
    quick_actions: 'Quick Actions',
    dashboard: 'Dashboard',
    students: 'Students',
    admin: 'Admin',
    banking: 'Banking & Finance',
    reports: 'Reports'
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-4 py-2 flex items-center justify-between gap-2.5 select-none sticky top-0 z-30 flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar">
      {/* Left: Breadcrumbs navigation & quick search */}
      <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap min-w-0">
        <div className="flex items-center gap-1.5 text-xs shrink-0 whitespace-nowrap">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] whitespace-nowrap">
            Star Academy
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
            {tabLabels[activeTab] || 'Dashboard'}
          </span>
          {activeSubPageLabel && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <span className="font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.2 rounded-full text-[11px] whitespace-nowrap">
                {activeSubPageLabel}
              </span>
            </>
          )}
        </div>

        {/* Global Search Input with instant results & clickable submit */}
        <div ref={searchContainerRef} className="relative shrink-0">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-1.5 bg-slate-100/90 hover:bg-slate-100 border border-slate-200/80 rounded-xl px-2.5 py-1 w-44 sm:w-56 lg:w-64 text-slate-400 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 focus-within:bg-white transition-all whitespace-nowrap"
          >
            <button
              type="submit"
              title="Search students"
              className="text-slate-400 hover:text-blue-600 transition-colors shrink-0 cursor-pointer p-0.5"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <input
              type="text"
              placeholder="Search students, roll no..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              className="w-full bg-transparent text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden whitespace-nowrap"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer p-0.5"
                title="Clear"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              type="submit"
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold shrink-0 cursor-pointer transition-colors shadow-2xs"
            >
              Search
            </button>
          </form>

          {/* Instant live dropdown */}
          {isDropdownOpen && searchQuery.trim() && (
            <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Matching Students</span>
                <span>{matchingStudents.length} found</span>
              </div>
              {matchingStudents.length === 0 ? (
                <div className="px-3 py-3 text-center text-xs text-slate-500">
                  No students found matching "{searchQuery}"
                </div>
              ) : (
                matchingStudents.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectStudent(s)}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center justify-between gap-2 border-b border-slate-50 last:border-0 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {s.pic ? (
                        <img src={s.pic} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {(s.studentName || s.name || 'S').charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{s.studentName || s.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">ID: {s.id} • Class {s.studentClass || s.class}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-600 font-bold shrink-0">View →</span>
                  </button>
                ))
              )}
              <button
                type="button"
                onClick={handleSearch}
                className="w-full px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-center text-[11px] font-bold text-blue-600 border-t border-slate-100 block transition-colors cursor-pointer"
              >
                Press Enter or click to view all in Students Directory →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center / Right: Quick Metrics & System Information */}
      <div className="flex items-center gap-2 shrink-0 whitespace-nowrap">
        {/* KPI: Enrolled Students */}
        <button
          type="button"
          onClick={() => onNavigate('students', null)}
          className="hidden md:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-xs text-slate-700 transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
          title="View Students"
        >
          <div className="w-4.5 h-4.5 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-3 h-3" />
          </div>
          <span className="text-slate-500 font-medium text-[11px] whitespace-nowrap">Students:</span>
          <span className="font-bold text-slate-900 text-xs whitespace-nowrap">{studentCount}</span>
        </button>

        {/* KPI: Attendance */}
        <button
          type="button"
          onClick={() => onNavigate('students', 'attendance')}
          className="hidden lg:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-xl text-xs text-slate-700 transition-colors cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
          title="View Attendance Sessions"
        >
          <div className="w-4.5 h-4.5 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ClipboardCheck className="w-3 h-3" />
          </div>
          <span className="text-slate-500 font-medium text-[11px] whitespace-nowrap">Attendance:</span>
          <span className="font-bold text-slate-900 text-xs whitespace-nowrap">{attendanceCount}</span>
        </button>

        {/* KPI: Pending Fees */}
        {pendingFeeCount > 0 && (
          <button
            type="button"
            onClick={() => onNavigate('reports', 'fee_paid_pending')}
            className="hidden sm:flex items-center gap-1.5 bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/60 px-2.5 py-1 rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
            title="View Pending Dues"
          >
            <CreditCard className="w-3 h-3 text-amber-700 shrink-0" />
            <span className="text-amber-700 font-medium text-[11px] whitespace-nowrap">Pending:</span>
            <span className="font-bold text-amber-900 text-xs bg-amber-200/80 px-1.5 py-0.2 rounded-full whitespace-nowrap">
              {pendingFeeCount}
            </span>
          </button>
        )}

        <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0"></div>

        {/* Today Date */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 font-medium whitespace-nowrap shrink-0">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="whitespace-nowrap">{today}</span>
        </div>

        {/* Session Badge */}
        <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap shrink-0">
          <span className="whitespace-nowrap">Session {currentSession}</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          onClick={() => onNavigate('quick_actions', null)}
          className="relative p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80 shrink-0"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>

        {/* Settings button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80 shrink-0"
          title="Academy Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* User Profile Pill */}
        <div className="hidden sm:flex items-center gap-2 pl-1.5 border-l border-slate-200/80 shrink-0 whitespace-nowrap">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shadow-2xs shrink-0">
            SI
          </div>
          <div className="hidden md:block text-left leading-tight shrink-0 whitespace-nowrap">
            <span className="block text-xs font-bold text-slate-800 whitespace-nowrap">Salman Ijaz</span>
            <span className="block text-[9px] text-slate-400 font-medium whitespace-nowrap">Principal Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
