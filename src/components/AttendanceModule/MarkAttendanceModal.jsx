import React, { useState, useMemo, useEffect } from 'react';
import { X, Check, CheckCircle2, XCircle, Clock, Save, AlertCircle, Users, UserCheck } from 'lucide-react';
import { CLASSES, CLASS_SUBJECTS, ATTENDANCE_STATUS } from '../../constants/academicData';
import { getAttendanceTimings } from '../../utils/storage';

export default function MarkAttendanceModal({
  isOpen,
  onClose,
  students,
  onSaveAttendance,
  attendanceTimings = getAttendanceTimings()
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [sessionDate, setSessionDate] = useState(todayStr);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSubjectGroup, setSelectedSubjectGroup] = useState('All');

  // Map of studentId -> status ('Present' | 'Absent' | 'Leave')
  const [attendanceMap, setAttendanceMap] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expectedStartTime, setExpectedStartTime] = useState('08:00');
  const [arrivalTimesMap, setArrivalTimesMap] = useState({});
  const [minutesLateMap, setMinutesLateMap] = useState({});

  const calculateMinutesLate = (arrival, start) => {
    if (!arrival || !start) return 0;
    const [aH, aM] = arrival.split(':').map(Number);
    const [sH, sM] = start.split(':').map(Number);
    if (isNaN(aH) || isNaN(aM) || isNaN(sH) || isNaN(sM)) return 0;
    const aTotal = aH * 60 + aM;
    const sTotal = sH * 60 + sM;
    return Math.max(0, aTotal - sTotal);
  };

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSessionDate(todayStr);
      setSelectedClass('');
      setSelectedSubject('');
      setSelectedSubjectGroup('All');
      setAttendanceMap({});
      setArrivalTimesMap({});
      setMinutesLateMap({});
      setSaveSuccess(false);
    }
  }, [isOpen]);

  // When class changes, reset subject and set start time according to settings
  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    setSelectedSubject('');
    setSelectedSubjectGroup('All');
    setAttendanceMap({});
    setArrivalTimesMap({});
    setMinutesLateMap({});
    const classStartTime = attendanceTimings?.classStartTimes?.[newClass] || '08:00';
    setExpectedStartTime(classStartTime);
  };

  const availableSubjectGroups = useMemo(() => {
    if (selectedSubject !== 'Individual Subjects') return [];
    const set = new Set();
    students.forEach((s) => {
      const cls = s.studentClass || s.class;
      const sec = s.section || s.subject;
      if (cls === selectedClass && sec === 'Individual Subjects') {
        const grp = s.subjectGroup || (s.enrolledSubjects && s.enrolledSubjects.length > 0 ? s.enrolledSubjects.join(' + ') : '');
        if (grp) set.add(grp);
      }
    });
    return Array.from(set).sort();
  }, [students, selectedClass, selectedSubject]);

  // ONLY ACTIVE STUDENTS are available for selection and attendance marking
  const respectiveStudents = useMemo(() => {
    if (!selectedClass || !selectedSubject) return [];
    return students.filter((s) => {
      const cls = s.studentClass || s.class;
      const sec = s.section || s.subject;
      const matchClass = cls === selectedClass;
      const matchSec = sec === selectedSubject;
      if (!matchClass || !matchSec || s.isLeft || s.isActive === false) return false;

      if (selectedSubject === 'Individual Subjects' && selectedSubjectGroup !== 'All') {
        const grp = s.subjectGroup || (s.enrolledSubjects && s.enrolledSubjects.length > 0 ? s.enrolledSubjects.join(' + ') : '');
        return grp === selectedSubjectGroup;
      }
      return true;
    });
  }, [students, selectedClass, selectedSubject, selectedSubjectGroup]);

  const inactiveCount = useMemo(() => {
    if (!selectedClass || !selectedSubject) return 0;
    return students.filter(
      (s) =>
        s.studentClass === selectedClass &&
        s.subject === selectedSubject &&
        (s.isLeft || s.isActive === false)
    ).length;
  }, [students, selectedClass, selectedSubject]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));

    if (status === ATTENDANCE_STATUS.LATE) {
      // Default to 25 mins late if no arrival time entered
      const defaultArrival = '08:25';
      setArrivalTimesMap(prev => ({
        ...prev,
        [studentId]: prev[studentId] || defaultArrival
      }));
      setMinutesLateMap(prev => ({
        ...prev,
        [studentId]: prev[studentId] || calculateMinutesLate(defaultArrival, expectedStartTime) || 25
      }));
    } else if (status === ATTENDANCE_STATUS.PRESENT) {
      setArrivalTimesMap(prev => ({
        ...prev,
        [studentId]: expectedStartTime
      }));
      setMinutesLateMap(prev => ({
        ...prev,
        [studentId]: 0
      }));
    }
  };

  const handleArrivalTimeChange = (studentId, arrivalVal) => {
    setArrivalTimesMap(prev => ({ ...prev, [studentId]: arrivalVal }));
    const lateMins = calculateMinutesLate(arrivalVal, expectedStartTime);
    setMinutesLateMap(prev => ({ ...prev, [studentId]: lateMins }));
    if (lateMins > 0) {
      setAttendanceMap(prev => ({ ...prev, [studentId]: ATTENDANCE_STATUS.LATE }));
    }
  };

  const handleMarkAll = (status) => {
    const updated = {};
    respectiveStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  // Summary counts
  const counts = useMemo(() => {
    let present = 0,
      late = 0,
      absent = 0,
      leave = 0;
    respectiveStudents.forEach((s) => {
      const st = attendanceMap[s.id];
      if (st === ATTENDANCE_STATUS.PRESENT) present++;
      else if (st === ATTENDANCE_STATUS.LATE) late++;
      else if (st === ATTENDANCE_STATUS.ABSENT) absent++;
      else if (st === ATTENDANCE_STATUS.LEAVE) leave++;
    });
    return { present, late, absent, leave, total: respectiveStudents.length };
  }, [respectiveStudents, attendanceMap]);

  const handleSave = () => {
    if (respectiveStudents.length === 0) return;

    const records = respectiveStudents.map((s) => {
      const status = attendanceMap[s.id] || ATTENDANCE_STATUS.PRESENT;
      const arrival = arrivalTimesMap[s.id] || (status === ATTENDANCE_STATUS.LATE ? '08:25' : expectedStartTime);
      const minsLate = status === ATTENDANCE_STATUS.LATE
        ? (minutesLateMap[s.id] !== undefined ? minutesLateMap[s.id] : (calculateMinutesLate(arrival, expectedStartTime) || 25))
        : 0;

      return {
        studentId: s.id,
        studentName: `${s.firstName} ${s.lastName}`,
        gender: s.gender,
        pic: s.pic,
        fatherName: s.fatherName,
        fatherContact: s.fatherContact,
        whatsappNumber: s.whatsappNumber || s.contactNumber,
        status,
        isLate: status === ATTENDANCE_STATUS.LATE || minsLate > 0,
        arrivalTime: status === ATTENDANCE_STATUS.ABSENT ? '' : arrival,
        minutesLate: minsLate,
      };
    });

    const newSession = {
      id: `ATT-${sessionDate.replace(/-/g, '')}-${Date.now().toString().slice(-4)}`,
      date: sessionDate,
      expectedStartTime,
      studentClass: selectedClass,
      subject: selectedSubject,
      subjectGroup: selectedSubject === 'Individual Subjects' && selectedSubjectGroup !== 'All' ? selectedSubjectGroup : null,
      createdAt: new Date().toISOString(),
      records,
    };

    onSaveAttendance(newSession);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  const currentAvailableSubjects = CLASS_SUBJECTS[selectedClass] || [];

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
              Star Academy Attendance
            </span>
            <h2 className="text-base font-bold text-white leading-tight">
              Mark Student Attendance
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdowns & Filters Section */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-2.5">
            {/* Class Dropdown */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Class <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-xs"
              >
                <option value="" disabled>-- Select Class --</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Dropdown */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Section <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 shadow-xs"
              >
                <option value="" disabled>-- Select Section --</option>
                {currentAvailableSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Enrolled Group Sub-Selector for Individual Subjects */}
          {selectedSubject === 'Individual Subjects' && (
            <div className="p-2.5 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-indigo-900 shrink-0">
                Filter by Enrolled Group:
              </span>
              <select
                value={selectedSubjectGroup}
                onChange={(e) => setSelectedSubjectGroup(e.target.value)}
                className="px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-xs font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                <option value="All">All Groups (All {respectiveStudents.length} Students)</option>
                {availableSubjectGroups.map((grp) => (
                  <option key={grp} value={grp}>
                    {grp}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Selector & Session Start Time */}
          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
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

            {/* Fast Quick Mark Buttons */}
            {respectiveStudents.length > 0 && (
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

          {/* Active students note */}
          {inactiveCount > 0 && (
            <div className="text-[10px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
              <span>{inactiveCount} student(s) excluded because they marked Left Academy.</span>
            </div>
          )}

          {/* Live Attendance Stats Counter Pills (5 Metrics) */}
          <div className="grid grid-cols-5 gap-1 text-center text-[11px] pt-1">
            <div className="bg-white rounded-lg p-1.5 border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Active</span>
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

        {/* Respective Students List Body */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2.5">
          {respectiveStudents.length > 0 ? (
            respectiveStudents.map((student, idx) => {
              const currentStatus = attendanceMap[student.id] || ATTENDANCE_STATUS.PRESENT;
              return (
                <div
                  key={student.id}
                  className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col gap-2.5 transition-all"
                >
                  {/* Student basic row */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-400 w-4 text-center">
                      {idx + 1}
                    </span>
                    <div className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <img
                        src={student.pic}
                        alt={student.firstName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                          {student.id}
                        </span>
                        <span className="text-[10px] text-slate-400">•</span>
                        <span className="text-[10px] text-slate-500 font-medium">{student.gender}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-xs truncate">
                        {student.firstName} {student.lastName}
                      </h4>
                    </div>
                  </div>

                  {/* 4 Visually Distinct Buttons: Present, Late, Absent, Leave */}
                  <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-100">
                    {/* 1. Present Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, ATTENDANCE_STATUS.PRESENT)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold text-[11px] transition-all tap-active ${
                        currentStatus === ATTENDANCE_STATUS.PRESENT
                          ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-500 ring-offset-1 border border-emerald-600'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <CheckCircle2 className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.PRESENT ? 'text-white stroke-[2.5]' : 'text-slate-400'}`} />
                      <span>Present</span>
                    </button>

                    {/* 2. Late Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, ATTENDANCE_STATUS.LATE)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold text-[11px] transition-all tap-active ${
                        currentStatus === ATTENDANCE_STATUS.LATE
                          ? 'bg-amber-500 text-white shadow-xs ring-2 ring-amber-400 ring-offset-1 border border-amber-500'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <Clock className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.LATE ? 'text-white stroke-[2.5]' : 'text-slate-400'}`} />
                      <span>Late</span>
                    </button>

                    {/* 3. Absent Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, ATTENDANCE_STATUS.ABSENT)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold text-[11px] transition-all tap-active ${
                        currentStatus === ATTENDANCE_STATUS.ABSENT
                          ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-500 ring-offset-1 border border-rose-600'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <XCircle className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.ABSENT ? 'text-white stroke-[2.5]' : 'text-slate-400'}`} />
                      <span>Absent</span>
                    </button>

                    {/* 4. Leave Button */}
                    <button
                      type="button"
                      onClick={() => handleStatusChange(student.id, ATTENDANCE_STATUS.LEAVE)}
                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-xl font-bold text-[11px] transition-all tap-active ${
                        currentStatus === ATTENDANCE_STATUS.LEAVE
                          ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-500 ring-offset-1 border border-indigo-600'
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      <AlertCircle className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.LEAVE ? 'text-white stroke-[2.5]' : 'text-slate-400'}`} />
                      <span>Leave</span>
                    </button>
                  </div>

                  {/* Arrival Time & Minutes Late (for Present or Late) */}
                  {(currentStatus === ATTENDANCE_STATUS.PRESENT || currentStatus === ATTENDANCE_STATUS.LATE) && (
                    <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">Arrival:</span>
                        <input
                          type="time"
                          value={arrivalTimesMap[student.id] || (currentStatus === ATTENDANCE_STATUS.LATE ? '08:25' : expectedStartTime)}
                          onChange={(e) => handleArrivalTimeChange(student.id, e.target.value)}
                          className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-semibold text-xs text-slate-700 outline-none focus:ring-1 focus:ring-indigo-400"
                        />
                      </div>
                      {(currentStatus === ATTENDANCE_STATUS.LATE || (minutesLateMap[student.id] || 0) > 0) && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                          {minutesLateMap[student.id] !== undefined && minutesLateMap[student.id] > 0
                            ? `${minutesLateMap[student.id]} min late`
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
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-2.5">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-700 text-xs">
                No active students enrolled in {selectedClass} - {selectedSubject}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">
                Only active students can be marked for attendance.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer / Save Action */}
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
            disabled={respectiveStudents.length === 0}
            onClick={handleSave}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-active ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : respectiveStudents.length === 0
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
                Save Attendance ({respectiveStudents.length})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
