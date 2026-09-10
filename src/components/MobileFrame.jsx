import React, { useState } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

export default function MobileFrame({
  children,
  isFrameMode: propIsFrameMode,
  setIsFrameMode: propSetIsFrameMode
}) {
  const [internalFrameMode, setInternalFrameMode] = useState(true);
  const isFrameMode = propIsFrameMode !== undefined ? propIsFrameMode : internalFrameMode;
  const setIsFrameMode = propSetIsFrameMode || setInternalFrameMode;
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 transition-colors duration-200">
      {/* Desktop Helper Toggle */}
      <div className="hidden sm:flex items-center gap-3 mb-3 bg-slate-800/90 text-slate-300 text-xs px-3.5 py-1.5 rounded-full shadow border border-slate-700/60 z-50">
        <span className="font-semibold text-slate-200">View Mode:</span>
        <button
          onClick={() => setIsFrameMode(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
            isFrameMode
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Mobile Phone Frame
        </button>
        <button
          onClick={() => setIsFrameMode(false)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
            !isFrameMode
              ? 'bg-blue-600 text-white shadow-sm font-semibold'
              : 'hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          Desktop Workspace
        </button>
      </div>

      {/* Main Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isFrameMode
            ? 'max-w-[420px] rounded-[38px] shadow-2xl ring-12 ring-slate-800/90 border border-slate-700/50 overflow-hidden bg-slate-50 relative'
            : 'max-w-md w-full bg-slate-50 min-h-screen relative shadow-lg'
        }`}
        style={{ minHeight: isFrameMode ? '840px' : '100vh' }}
      >
        {/* Phone Notch & Status Bar (in Frame mode or top of app) */}
        <div className="bg-blue-800 text-white px-6 pt-2 pb-1.5 flex items-center justify-between text-xs select-none">
          <span className="font-semibold text-[11px] tracking-tight">{currentTime}</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto -mt-1 hidden sm:block"></div>
          <div className="flex items-center gap-1.5 text-blue-100">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Content Body with bottom nav spacing */}
        <div className="flex flex-col h-full pb-20 w-full min-w-0 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
