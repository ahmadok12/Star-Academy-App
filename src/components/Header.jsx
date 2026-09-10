import React from 'react';
import { Sparkles, GraduationCap, Calendar, LayoutDashboard, Settings } from 'lucide-react';
import { STAR_ACADEMY_LOGO_URL } from '../constants/logoData';

export default function Header({ studentCount, attendanceCount, activeTab, onNavigateTab, onOpenSettings, currentSession = '2026 - 27' }) {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white shadow-xs">
      {/* Academy Brand Header */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateTab && onNavigateTab('dashboard')}
            className="flex items-center gap-2.5 text-left hover:opacity-95 transition-opacity"
            title="View Academy Dashboard"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner overflow-hidden p-1">
              <img src={STAR_ACADEMY_LOGO_URL} alt="Star Academy Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-lg tracking-tight text-white leading-tight">
                  Star Academy
                </h1>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold bg-white/20 text-white border border-white/30 px-2 py-0.2 rounded-full tracking-wide">
                  Session {currentSession}
                </span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigateTab && onNavigateTab('dashboard')}
              className={`p-1.5 rounded-xl border transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-blue-600 border-white shadow-xs'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs text-white">
              <Calendar className="w-3.5 h-3.5 text-blue-200" />
              <span className="font-medium text-[11px]">{today}</span>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-1.5 rounded-xl border bg-white/15 hover:bg-white/25 active:scale-95 text-white border-white/20 transition-all shadow-xs flex items-center justify-center"
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
