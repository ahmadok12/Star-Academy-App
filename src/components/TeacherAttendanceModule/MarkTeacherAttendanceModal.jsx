import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, CheckCircle2, XCircle, Clock, Save, GraduationCap } from 'lucide-react';
import { ATTENDANCE_STATUS } from '../../constants/academicData';

export default function MarkTeacherAttendanceModal({
  isOpen,
  onClose,
  teachers,
  onSaveTeacherAttendance
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [sessionDate, setSessionDate] = useState(todayStr);
  const [expectedStartTime, setExpectedStartTime] = useState('08:00');

  // Map of teacherId -> status
  const [attendanceMap, setAttendanceMap] = useState({});
  const [arrivalTimesMap, setArrivalTimesMap] = useState({});
  const [minutesLateMap, setMinutesLateMap] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Helper to compute minutes late
  const calculateMinutesLate = (arrivalTime, startTime) => {
    if (!arrivalTime || !startTime) return 0;
    const [arrH, arrM] = arrivalTime.split(':').map(Number);
    const [startH, startM] = startTime.split(':').map(Number);
    const diff = arrH * 60 + arrM - (startH * 60 + startM);
    return diff > 0 ? diff : 0;
  };

  // Reset attendance map when opening dialog
  useEffect(() => {
    if (isOpen) {
      setSessionDate(todayStr);
      setExpectedStartTime('08:00');
      setAttendanceMap({});
      setArrivalTimesMap({});
      setMinutesLateMap({});
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const handleStatusChange = (teacherId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [teacherId]: status,
    }));

    if (status === ATTENDANCE_STATUS.LATE) {
      const defaultLateArrival = '08:20';
      setArrivalTimesMap(prev => ({
        ...prev,
        [teacherId]: defaultLateArrival
      }));
      setMinutesLateMap(prev => ({
        ...prev,
        [teacherId]: calculateMinutesLate(defaultLateArrival, expectedStartTime) || 20
      }));
    } else if (status === ATTENDANCE_STATUS.PRESENT) {
      setArrivalTimesMap(prev => ({
        ...prev,
        [teacherId]: expectedStartTime
      }));
      setMinutesLateMap(prev => ({
        ...prev,
        [teacherId]: 0
      }));
    }
  };

  const handleArrivalTimeChange = (teacherId, arrivalVal) => {
    setArrivalTimesMap(prev => ({ ...prev, [teacherId]: arrivalVal }));
    const lateMins = calculateMinutesLate(arrivalVal, expectedStartTime);
    setMinutesLateMap(prev => ({ ...prev, [teacherId]: lateMins }));
    if (lateMins > 0) {
      setAttendanceMap(prev => ({ ...prev, [teacherId]: ATTENDANCE_STATUS.LATE }));
    }
  };

  const handleMarkAll = (status) => {
    const updated = {};
    teachers.forEach((t) => {
      updated[t.id] = status;
    });
    setAttendanceMap(updated);
  };

  // Summary counts
  const counts = useMemo(() => {
    let present = 0, late = 0, absent = 0, leave = 0;
    teachers.forEach((t) => {
      const st = attendanceMap[t.id];
      if (st === ATTENDANCE_STATUS.PRESENT) present++;
      else if (st === ATTENDANCE_STATUS.LATE) late++;
      else if (st === ATTENDANCE_STATUS.ABSENT) absent++;
      else if (st === ATTENDANCE_STATUS.LEAVE) leave++;
    });
    return { present, late, absent, leave, total: teachers.length };
  }, [teachers, attendanceMap]);

  const handleSave = () => {
    if (teachers.length === 0) return;

    const records = teachers.map((t) => {
      const status = attendanceMap[t.id] || ATTENDANCE_STATUS.PRESENT;
      const arrival = arrivalTimesMap[t.id] || (status === ATTENDANCE_STATUS.LATE ? '08:20' : expectedStartTime);
      const minsLate = status === ATTENDANCE_STATUS.LATE
        ? (minutesLateMap[t.id] !== undefined ? minutesLateMap[t.id] : (calculateMinutesLate(arrival, expectedStartTime) || 20))
        : 0;

      return {
        teacherId: t.id,
        teacherName: t.name,
        pic: t.pic,
        department: t.department,
        phone: t.phone || t.contactNumber,
        status,
        isLate: status === ATTENDANCE_STATUS.LATE || minsLate > 0,
        arrivalTime: status === ATTENDANCE_STATUS.ABSENT ? '' : arrival,
        minutesLate: minsLate,
      };
    });

    const newSession = {
      id: `TATT-${sessionDate.replace(/-/g, '')}-${Date.now().toString().slice(-4)}`,
      date: sessionDate,
      expectedStartTime,
      createdAt: new Date().toISOString(),
      records,
    };

    onSaveTeacherAttendance(newSession);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-700 via-indigo-600 to-brand-700 text-white">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300">
              Star Academy Faculty
            </span>
            <h2 className="text-base font-bold text-white leading-tight">
              Mark Teacher Attendance
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date & Helper Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Date:</span>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  className="text-xs font-bold text-slate-700 outline-none bg-transparent"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl shadow-xs">
                <Clock className="w-3 h-3 text-indigo-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase">Start:</span>
                <input
                  type="time"
                  value={expectedStartTime}
                  onChange={(e) => setExpectedStartTime(e.target.value)}
                  className="text-xs font-bold text-slate-700 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Quick Actions */}
            {teachers.length > 0 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleMarkAll(ATTENDANCE_STATUS.PRESENT)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold shadow-2xs transition-all tap-active"
                >
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll(ATTENDANCE_STATUS.ABSENT)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold shadow-2xs transition-all tap-active"
                >
                  All Absent
                </button>
              </div>
            )}
          </div>

          {/* Live Summary Pills (5 Metrics) */}
          <div className="grid grid-cols-5 gap-1 text-center text-[11px]">
            <div className="bg-white rounded-lg p-1.5 border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Faculty</span>
              <span className="font-extrabold text-slate-800">{counts.total}</span>
            </div>
            <div className="bg-emerald-50 rounded-lg p-1.5 border border-emerald-200">
              <span className="text-emerald-600 block text-[9px] uppercase font-bold">Present</span>
              <span className="font-extrabold text-emerald-700">{counts.present}</span>
            </div>
            <div className="bg-amber-50 rounded-lg p-1.5 border border-amber-200">
              <span className="text-amber-600 block text-[9px] uppercase font-bold">Late</span>
              <span className="font-extrabold text-amber-700">{counts.late}</span>
            </div>
            <div className="bg-rose-50 rounded-lg p-1.5 border border-rose-200">
              <span className="text-rose-600 block text-[9px] uppercase font-bold">Absent</span>
              <span className="font-extrabold text-rose-700">{counts.absent}</span>
            </div>
            <div className="bg-indigo-50 rounded-lg p-1.5 border border-indigo-200">
              <span className="text-indigo-600 block text-[9px] uppercase font-bold">Leave</span>
              <span className="font-extrabold text-indigo-700">{counts.leave}</span>
            </div>
          </div>
        </div>

        {/* Teachers List Body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2.5">
          {teachers.length > 0 ? (
            teachers.map((teacher, idx) => {
              const currentStatus = attendanceMap[teacher.id] || ATTENDANCE_STATUS.PRESENT;
              return (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col gap-2.5 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-400 w-4 text-center">
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={teacher.pic}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                          {teacher.id}
                        </span>
                        {teacher.department && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                            • {teacher.department}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs truncate">
                        {teacher.name}
                      </h4>
                    </div>
                  </div>

                  {/* 4 Visually Distinct Buttons: Present, Late, Absent, Leave */}
                  <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100">
                    {/* Present */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(teacher.id, ATTENDANCE_STATUS.PRESENT)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold text-[11px] transition-all tap-active ${
                        currentStatus === ATTENDANCE_STATUS.PRESENT
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500 ring-offset-1 border border-emerald-600'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <CheckCircle2 className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.PRESENT ? 'text-white stroke-[2.5]' : 'text-slate-400'}`} />
                      <span>Present</span>
                    </button>

                    {/* Late */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(teacher.id, ATTENDANCE_STATUS.LATE)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold text-[11px] transition-all tap-active ${
                        currentStatus === ATTENDANCE_STATUS.LATE
                          ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400 ring-offset-1 border border-amber-500'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <Clock className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.LATE ? 'text-white stroke-[2.5]' : 'text-slate-400'}`} />
                      <span>Late</span>
                    </button>

                    {/* Absent */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(teacher.id, ATTENDANCE_STATUS.ABSENT)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold text-[11px] transition-all tap-active ${
                        currentStatus === ATTENDANCE_STATUS.ABSENT
                          ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500 ring-offset-1 border border-rose-600'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <XCircle className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.ABSENT ? 'text-white stroke-[2.5]' : 'text-slate-400'}`} />
                      <span>Absent</span>
                    </button>

                    {/* Leave */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(teacher.id, ATTENDANCE_STATUS.LEAVE)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold text-[11px] transition-all tap-active ${
                        currentStatus === ATTENDANCE_STATUS.LEAVE
                          ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500 ring-offset-1 border border-indigo-600'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <Clock className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.LEAVE ? 'text-white stroke-[2.5]' : 'text-slate-400'}`} />
                      <span>Leave</span>
                    </button>
                  </div>

                  {/* Arrival Time Input & Late Badge */}
                  {(currentStatus === ATTENDANCE_STATUS.PRESENT || currentStatus === ATTENDANCE_STATUS.LATE) && (
                    <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Arrival:</span>
                        <input
                          type="time"
                          value={arrivalTimesMap[teacher.id] || (currentStatus === ATTENDANCE_STATUS.LATE ? '08:20' : expectedStartTime)}
                          onChange={(e) => handleArrivalTimeChange(teacher.id, e.target.value)}
                          className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-semibold text-xs text-slate-700 outline-none focus:ring-1 focus:ring-indigo-400"
                        />
                      </div>
                      {(currentStatus === ATTENDANCE_STATUS.LATE || (minutesLateMap[teacher.id] || 0) > 0) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                          {minutesLateMap[teacher.id] !== undefined && minutesLateMap[teacher.id] > 0
                            ? `${minutesLateMap[teacher.id]} min late`
                            : 'Late Arrival'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <GraduationCap className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
              <p className="text-slate-600 font-bold text-xs">No faculty members registered.</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors tap-active"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={teachers.length === 0}
            onClick={handleSave}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-active ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : teachers.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                Attendance Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Attendance ({teachers.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
