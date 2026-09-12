import React, { useState, useEffect } from 'react';
import {
  X,
  Clock,
  Check,
  GraduationCap,
  Users,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Calendar
} from 'lucide-react';
import { CLASSES } from '../../constants/academicData';
import { DEFAULT_ATTENDANCE_TIMINGS } from '../../utils/storage';

export default function AttendanceTimingsModal({
  isOpen,
  onClose,
  attendanceTimings = DEFAULT_ATTENDANCE_TIMINGS,
  onSaveAttendanceTimings
}) {
  if (!isOpen) return null;

  const [timings, setTimings] = useState({
    recordStudentArrival: true,
    classStartTimes: {
      '9th': '08:00',
      '10th': '08:00',
      'FSc Part 1': '08:30',
      'FSc Part 2': '08:30'
    }
  });

  useEffect(() => {
    if (attendanceTimings) {
      setTimings({
        recordStudentArrival: attendanceTimings.recordStudentArrival ?? true,
        classStartTimes: {
          '9th': attendanceTimings.classStartTimes?.['9th'] || '08:00',
          '10th': attendanceTimings.classStartTimes?.['10th'] || '08:00',
          'FSc Part 1': attendanceTimings.classStartTimes?.['FSc Part 1'] || '08:30',
          'FSc Part 2': attendanceTimings.classStartTimes?.['FSc Part 2'] || '08:30'
        }
      });
    }
  }, [attendanceTimings, isOpen]);

  const handleClassTimeChange = (cls, timeVal) => {
    setTimings(prev => ({
      ...prev,
      classStartTimes: {
        ...prev.classStartTimes,
        [cls]: timeVal
      }
    }));
  };

  const handleResetDefaults = () => {
    setTimings({
      recordStudentArrival: true,
      classStartTimes: {
        '9th': '08:00',
        '10th': '08:00',
        'FSc Part 1': '08:30',
        'FSc Part 2': '08:30'
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSaveAttendanceTimings) {
      onSaveAttendanceTimings({
        ...attendanceTimings,
        ...timings
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-700 via-indigo-600 to-brand-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
                <span>Class Arrival Timings</span>
              </h2>
              <p className="text-xs text-indigo-100 font-medium">
                Configure class start & expected arrival times for students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto flex-1 bg-slate-50/50 text-xs">
          
          {/* Section: Student Arrival Timing Settings Per Class */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Student Arrival Time Per Class</h3>
                  <p className="text-[10px] text-slate-400">Class reporting schedules & late timers</p>
                </div>
              </div>

              {/* Toggle switch */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-[10.5px] font-semibold text-slate-600">
                  {timings.recordStudentArrival ? 'Enabled' : 'Disabled'}
                </span>
                <input
                  type="checkbox"
                  checked={timings.recordStudentArrival}
                  onChange={(e) => setTimings(prev => ({ ...prev, recordStudentArrival: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {timings.recordStudentArrival ? (
              <div className="space-y-3 pt-1">
                <p className="text-[10.5px] text-slate-500 leading-relaxed">
                  Specify the start / expected arrival time for each class. When opening the attendance register for any class, the system will automatically adapt to its scheduled start time:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CLASSES.map((cls) => (
                    <div
                      key={cls}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 text-xs block truncate">
                          Class {cls}
                        </span>
                        <span className="text-[9.5px] text-slate-400 font-medium">Expected Arrival</span>
                      </div>

                      <div className="relative shrink-0">
                        <input
                          type="time"
                          value={timings.classStartTimes?.[cls] || '08:00'}
                          onChange={(e) => handleClassTimeChange(cls, e.target.value)}
                          className="w-28 pl-7 pr-2 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-slate-900 text-xs focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500"
                          required
                        />
                        <Clock className="w-3 h-3 text-slate-400 absolute left-2 top-2 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic py-1">
                Student arrival time recording is currently disabled.
              </p>
            )}
          </div>

          {/* Reset to Defaults Helper */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Recommended Defaults</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors tap-active cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all tap-active cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Timing Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
