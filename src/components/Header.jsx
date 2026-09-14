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
    <header className="relative z-30 bg-[#111827] text-white border-b border-slate-800 shadow-xs">
      {/* Academy Brand Header */}
      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigateTab && onNavigateTab('dashboard')}
            className="flex items-center gap-2.5 text-left hover:opacity-95 transition-opacity cursor-pointer"
            title="View Academy Dashboard"
          >
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center overflow-hidden p-1 shadow-inner">
              <img src={STAR_ACADEMY_LOGO_URL} alt="Star Academy Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-base tracking-tight text-white leading-tight">
                  Star Academy
                </h1>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-bold bg-white/10 text-slate-300 border border-white/15 px-2.5 py-0.5 rounded-full tracking-wide">
                  Session {currentSession}
                </span>
              </div>
            </div>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onNavigateTab && onNavigateTab('dashboard')}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#111827] border-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-4 h-4" />
            </button>

            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs text-white">
              <Calendar className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-medium text-[11px]">{today}</span>
            </div>

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full border bg-white/10 hover:bg-white/20 active:scale-95 text-white border-white/15 transition-all shadow-xs flex items-center justify-center cursor-pointer"
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
