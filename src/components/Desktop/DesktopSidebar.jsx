import React, { useState } from 'react';
import {
  Zap,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Landmark,
  BarChart3,
  GraduationCap,
  Settings,
  Smartphone,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

export default function DesktopSidebar({
  activeTab,
  onNavigate,
  studentCount = 0,
  pendingFeeCount = 0,
  currentSession = '2026 - 27',
  onOpenSettings,
  isFrameMode,
  setIsFrameMode
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const mainTabs = [
    {
      id: 'quick_actions',
      label: 'Quick Actions',
      icon: Zap,
      badge: null
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'students',
      label: 'Students',
      icon: Users,
      badge: studentCount > 0 ? studentCount : null
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: ShieldCheck,
      badge: null
    },
    {
      id: 'banking',
      label: 'Banking & Finance',
      icon: Landmark,
      badge: pendingFeeCount > 0 ? `${pendingFeeCount} Due` : null
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      badge: '8 Reports'
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Header / Branding */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3">
        {!isCollapsed && (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight truncate">
                Star Academy
              </h1>
              <span className="text-xs font-medium text-slate-500 block">
                Session {currentSession}
              </span>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs mx-auto">
            <GraduationCap className="w-5 h-5" />
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Tab Navigation Buttons Only */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {!isCollapsed && (
          <div className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Navigation
          </div>
        )}

        {mainTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onNavigate(tab.id, null)}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer group ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
              title={tab.label}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200/80 group-hover:text-slate-900'
                  }`}
                >
                  <TabIcon className="w-5 h-5" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-semibold truncate tracking-tight">
                    {tab.label}
                  </span>
                )}
              </div>

              {!isCollapsed && tab.badge && (
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-medium shrink-0 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Sidebar Footer */}
      <div className="p-3 border-t border-slate-200 space-y-2 bg-slate-50/50">
        {/* View Mode Toggle: Desktop Workspace vs Mobile Phone Frame */}
        <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center justify-between gap-1 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsFrameMode(false)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              !isFrameMode
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Desktop Workspace Mode"
          >
            <Monitor className="w-4 h-4" />
            {!isCollapsed && <span>Desktop</span>}
          </button>
          <button
            type="button"
            onClick={() => setIsFrameMode(true)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              isFrameMode
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mobile Phone Frame Mode"
          >
            <Smartphone className="w-4 h-4" />
            {!isCollapsed && <span>Mobile</span>}
          </button>
        </div>

        {/* Academy Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
          title="Academy Settings & Curriculums"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          {!isCollapsed && <span>Academy Settings</span>}
        </button>
      </div>
    </aside>
  );
}
