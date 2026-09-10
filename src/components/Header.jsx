import React from 'react';
import { Sparkles, GraduationCap, Calendar, LayoutDashboard, Settings } from 'lucide-react';

export default function Header({ studentCount, attendanceCount, activeTab, onNavigateTab, onOpenSettings, currentSession = '2026 - 27' }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-indigo-700 via-indigo-600 to-brand-700 text-white shadow-md">
      {/* Academy Brand Header */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateTab && onNavigateTab('dashboard')}
            className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity"
            title="View Academy Dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <GraduationCap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-lg tracking-tight text-white leading-tight">
                  Star Academy
                </h1>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-black bg-amber-400/25 text-amber-300 border border-amber-300/40 px-2 py-0.2 rounded-full tracking-wide">
                  Session {currentSession}
                </span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigateTab && onNavigateTab('dashboard')}
              className={`p-1.5 rounded-full border transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-indigo-700 border-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-indigo-100 border-white/15'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-2.5 py-1 flex items-center gap-1.5 text-xs text-indigo-100">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-medium text-[11px]">{today}</span>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-full border bg-white/10 hover:bg-white/20 active:scale-95 text-indigo-100 hover:text-white border-white/15 transition-all shadow-xs flex items-center justify-center"
              title="Academy Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
