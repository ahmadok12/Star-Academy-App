import React from 'react';
import { Zap, LayoutDashboard, Users, ShieldCheck, Landmark, BarChart3 } from 'lucide-react';

export default function BottomNav({
  activeTab,
  setActiveTab,
  studentCount,
  pendingFeeCount
}) {
  const navItems = [
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
      badge: studentCount,
      badgeColor: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: ShieldCheck,
      badge: null
    },
    {
      id: 'banking',
      label: 'Banking',
      icon: Landmark,
      badge: pendingFeeCount > 0 ? `${pendingFeeCount}` : null,
      badgeColor: 'bg-rose-100 text-rose-700'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-bottom-nav px-1 py-1.5">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-0.5 rounded-xl transition-all duration-150 tap-active min-w-[36px] ${
                isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${
                isActive ? 'bg-blue-50' : 'bg-transparent'
              }`}>
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 stroke-[2.25]' : 'stroke-2'}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`absolute -top-1 -right-2 text-[8px] font-bold px-1 py-0.2 rounded-full border border-white shadow-xs leading-none ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[8px] mt-0.5 tracking-tight truncate max-w-[54px] ${isActive ? 'font-bold text-blue-600' : 'font-medium'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
