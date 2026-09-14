import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  GraduationCap,
  BookOpen,
  Layers,
  Search,
  Calendar,
  AlertTriangle,
  FileText,
  UserCheck,
  Sparkles,
  CheckCheck,
  User,
  Phone,
  Trash2,
  MessageCircle,
  RotateCcw
} from 'lucide-react';
import { ATTENDANCE_STATUS } from '../../constants/academicData';
import {
  getAttendanceTimings,
  getTeacherAttendanceSessions,
  saveTeacherAttendanceSessions,
  getTeachers,
  formatTimeTo12Hour
} from '../../utils/storage';

export default function MarkTeacherAttendanceModal({
  isOpen,
  onClose,
  teachers = [],
  session = null, // Optional existing session to view / edit
  onSaveTeacherAttendance,
  onUpdateSession,
  onDeleteSession,
  attendanceTimings
}) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [sessionDate, setSessionDate] = useState(session?.date || todayStr);
  const [expectedStartTime, setExpectedStartTime] = useState(session?.expectedStartTime || '15:00');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL' | 'PENDING' | 'MARKED'

  // Map of slotKey (`${teacherId}___${slotId}`) -> status ('PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE')
  const [attendanceMap, setAttendanceMap] = useState({});
  const [arrivalTimesMap, setArrivalTimesMap] = useState({});
  const [minutesLateMap, setMinutesLateMap] = useState({});
  const [notesMap, setNotesMap] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Helper to parse hours and minutes from any string (24h or 12h AM/PM)
  const parseHoursMinutes = (tStr) => {
    if (!tStr) return [NaN, NaN];
    const s = String(tStr).trim();
    const isPM = /pm/i.test(s);
    const isAM = /am/i.test(s);
    const clean = s.replace(/[^0-9:]/g, '');
    const [hStr, mStr] = clean.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr || '0', 10);
    if (isNaN(h) || isNaN(m)) return [NaN, NaN];
    if (isPM && h < 12) h += 12;
    if (isAM && h === 12) h = 0;
    return [h, m];
  };

  // Helper to compute minutes late (0 if arrival is on-time or early)
  const calculateMinutesLate = (arrivalTime, startTime) => {
    if (!arrivalTime || !startTime) return 0;
    const [arrH, arrM] = parseHoursMinutes(arrivalTime);
    const [startH, startM] = parseHoursMinutes(startTime);
    if (isNaN(arrH) || isNaN(arrM) || isNaN(startH) || isNaN(startM)) return 0;
    const diff = arrH * 60 + arrM - (startH * 60 + startM);
    return diff > 0 ? diff : 0;
  };

  // Teachers source with fallback to storage
  const allTeachersSource = useMemo(() => {
    if (teachers && teachers.length > 0) return teachers;
    return getTeachers() || [];
  }, [teachers]);

  // Active teachers (include historical teachers if viewing an existing session)
  const activeTeachers = useMemo(() => {
    if (session && Array.isArray(session.records) && session.records.length > 0) {
      const recordTeacherIds = new Set(session.records.map((r) => r.teacherId));
      return allTeachersSource.filter(
        (t) => (!t.isLeft && t.isActive !== false) || recordTeacherIds.has(t.id)
      );
    }
    return allTeachersSource.filter((t) => !t.isLeft && t.isActive !== false);
  }, [allTeachersSource, session]);

  // Helper to extract lecture slots for a teacher
  const getTeacherLectures = (t) => {
    if (t.teachingSlots && Array.isArray(t.teachingSlots) && t.teachingSlots.length > 0) {
      return t.teachingSlots.map((slot, sIdx) => {
        const slotId = slot.id || `slot-${sIdx + 1}`;
        return {
          slotId,
          assignedClass:
            slot.assignedClass ||
            (t.assignedClasses && t.assignedClasses[sIdx]) ||
            (t.assignedClasses && t.assignedClasses.length === 1 ? t.assignedClasses[0] : ''),
          subject: slot.subject || t.department || 'General Faculty',
          time: slot.time || t.arrivalTime || '15:00',
          slotKey: `${t.id}___${slotId}`
        };
      });
    }
    return [
      {
        slotId: 'slot-1',
        assignedClass: (t.assignedClasses && t.assignedClasses[0]) || '',
        subject: t.department || 'General Faculty',
        time: t.arrivalTime || '15:00',
        slotKey: `${t.id}___slot-1`
      }
    ];
  };

  // Flattened lecture slots for all active teachers
  const allLectureSlots = useMemo(() => {
    const list = [];
    activeTeachers.forEach((t) => {
      const lecs = getTeacherLectures(t);
      lecs.forEach((l) => {
        list.push({
          ...l,
          teacher: t
        });
      });
    });
    return list;
  }, [activeTeachers]);

  // Check how many lectures are marked for a teacher
  const getTeacherMarkedStats = (t) => {
    const lecs = getTeacherLectures(t);
    const markedCount = lecs.filter((l) => Boolean(attendanceMap[l.slotKey])).length;
    return {
      total: lecs.length,
      marked: markedCount,
      isFullyMarked: markedCount === lecs.length && lecs.length > 0,
      isPartiallyMarked: markedCount > 0 && markedCount < lecs.length,
      isUnmarked: markedCount === 0
    };
  };

  // Hydrate attendance state from storage whenever date or modal opens
  useEffect(() => {
    if (isOpen) {
      const targetDate = session?.date || sessionDate || todayStr;
      setSessionDate(targetDate);
      const defaultStart =
        session?.expectedStartTime ||
        (attendanceTimings || getAttendanceTimings())?.teacherExpectedStartTime ||
        '15:00';
      setExpectedStartTime(defaultStart);

      // Determine which session to load: passed session or saved session by date
      let currentSessionData = session;
      if (!currentSessionData) {
        const savedSessions = getTeacherAttendanceSessions() || [];
        currentSessionData = savedSessions.find((s) => s.date === targetDate);
      }

      const initialStatus = {};
      const initialArrivals = {};
      const initialLateMins = {};
      const initialNotes = {};

      if (currentSessionData && Array.isArray(currentSessionData.records)) {
        currentSessionData.records.forEach((rec) => {
          const key = `${rec.teacherId}___${rec.slotId || 'slot-1'}`;
          initialStatus[key] = rec.status;
          initialArrivals[key] = rec.arrivalTime || '';
          initialLateMins[key] = rec.minutesLate || 0;
          initialNotes[key] = rec.notes || '';
        });
      }

      setAttendanceMap(initialStatus);
      setArrivalTimesMap(initialArrivals);
      setMinutesLateMap(initialLateMins);
      setNotesMap(initialNotes);
      setSaveSuccess(false);
      setHasUnsavedChanges(false);
      setConfirmDelete(false);
    }
  }, [isOpen, session, sessionDate]);

  // Status Change for a single lecture slot
  const handleStatusChange = (slotKey, targetTime, status) => {
    setHasUnsavedChanges(true);
    setAttendanceMap((prev) => ({
      ...prev,
      [slotKey]: status
    }));

    const slotExpectedTime = targetTime || expectedStartTime || '15:00';

    if (status === ATTENDANCE_STATUS.LATE) {
      // Default arrival to scheduled lecture time if not already set
      const currentArrival = arrivalTimesMap[slotKey];
      const arrivalVal = currentArrival || slotExpectedTime;
      const lateMins = calculateMinutesLate(arrivalVal, slotExpectedTime);

      setArrivalTimesMap((prev) => ({
        ...prev,
        [slotKey]: arrivalVal
      }));
      setMinutesLateMap((prev) => ({
        ...prev,
        [slotKey]: lateMins
      }));
    } else if (status === ATTENDANCE_STATUS.PRESENT) {
      setArrivalTimesMap((prev) => ({
        ...prev,
        [slotKey]: slotExpectedTime
      }));
      setMinutesLateMap((prev) => ({
        ...prev,
        [slotKey]: 0
      }));
    } else {
      // ABSENT or LEAVE
      setArrivalTimesMap((prev) => ({
        ...prev,
        [slotKey]: ''
      }));
      setMinutesLateMap((prev) => ({
        ...prev,
        [slotKey]: 0
      }));
    }
  };

  const handleArrivalTimeChange = (slotKey, targetTime, arrivalVal) => {
    setHasUnsavedChanges(true);
    setArrivalTimesMap((prev) => ({ ...prev, [slotKey]: arrivalVal }));
    const slotExpectedTime = targetTime || expectedStartTime || '15:00';
    const lateMins = calculateMinutesLate(arrivalVal, slotExpectedTime);
    setMinutesLateMap((prev) => ({ ...prev, [slotKey]: lateMins }));
  };

  const handleNoteChange = (slotKey, noteVal) => {
    setHasUnsavedChanges(true);
    setNotesMap((prev) => ({ ...prev, [slotKey]: noteVal }));
  };

  // Mark all lectures of a specific teacher as a given status
  const handleMarkTeacherAll = (teacher, status) => {
    setHasUnsavedChanges(true);
    const lecs = getTeacherLectures(teacher);
    const updatedStatus = { ...attendanceMap };
    const updatedArrivals = { ...arrivalTimesMap };
    const updatedLateMins = { ...minutesLateMap };

    lecs.forEach((l) => {
      updatedStatus[l.slotKey] = status;
      const slotExpectedTime = l.time || expectedStartTime || '15:00';

      if (status === ATTENDANCE_STATUS.PRESENT) {
        updatedArrivals[l.slotKey] = slotExpectedTime;
        updatedLateMins[l.slotKey] = 0;
      } else if (status === ATTENDANCE_STATUS.LATE) {
        const arrivalVal = updatedArrivals[l.slotKey] || slotExpectedTime;
        updatedArrivals[l.slotKey] = arrivalVal;
        updatedLateMins[l.slotKey] = calculateMinutesLate(arrivalVal, slotExpectedTime);
      } else {
        updatedArrivals[l.slotKey] = '';
        updatedLateMins[l.slotKey] = 0;
      }
    });

    setAttendanceMap(updatedStatus);
    setArrivalTimesMap(updatedArrivals);
    setMinutesLateMap(updatedLateMins);
  };

  // Mark all remaining/unmarked teachers as Present
  const handleMarkAllRemainingAsPresent = () => {
    setHasUnsavedChanges(true);
    const updatedStatus = { ...attendanceMap };
    const updatedArrivals = { ...arrivalTimesMap };
    const updatedLateMins = { ...minutesLateMap };

    activeTeachers.forEach((t) => {
      const lecs = getTeacherLectures(t);
      lecs.forEach((l) => {
        if (!updatedStatus[l.slotKey]) {
          updatedStatus[l.slotKey] = ATTENDANCE_STATUS.PRESENT;
          updatedArrivals[l.slotKey] = l.time || expectedStartTime || '15:00';
          updatedLateMins[l.slotKey] = 0;
        }
      });
    });

    setAttendanceMap(updatedStatus);
    setArrivalTimesMap(updatedArrivals);
    setMinutesLateMap(updatedLateMins);
  };

  // Save or Update Session
  const handleSave = (shouldClose = true) => {
    if (activeTeachers.length === 0) return;

    const records = allLectureSlots.map((slotItem) => {
      const { slotKey, teacher, slotId, subject, time, assignedClass } = slotItem;
      const slotExpectedTime = time || expectedStartTime || '15:00';
      const status = attendanceMap[slotKey] || ATTENDANCE_STATUS.PRESENT;
      const arrival =
        arrivalTimesMap[slotKey] ||
        (status === ATTENDANCE_STATUS.LATE
          ? slotExpectedTime
          : status === ATTENDANCE_STATUS.PRESENT
          ? slotExpectedTime
          : '');
      const minsLate =
        status === ATTENDANCE_STATUS.LATE
          ? minutesLateMap[slotKey] !== undefined
            ? minutesLateMap[slotKey]
            : calculateMinutesLate(arrival || slotExpectedTime, slotExpectedTime)
          : 0;

      return {
        recordId: `${teacher.id}_${slotId}`,
        teacherId: teacher.id,
        teacherName: teacher.name,
        pic: teacher.pic,
        department: teacher.department,
        subject,
        assignedClass: assignedClass || '',
        slotId,
        slotTime: time,
        expectedStartTime: slotExpectedTime,
        phone: teacher.phone || teacher.contactNumber,
        status,
        isLate: status === ATTENDANCE_STATUS.LATE || minsLate > 0,
        arrivalTime:
          status === ATTENDANCE_STATUS.ABSENT || status === ATTENDANCE_STATUS.LEAVE ? '' : arrival,
        minutesLate: minsLate,
        notes: notesMap[slotKey] || ''
      };
    });

    const sessionId =
      session?.id || `TATT-${sessionDate.replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;

    const sessionPayload = {
      id: sessionId,
      date: sessionDate,
      expectedStartTime,
      createdAt: session?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      records
    };

    // Callback execution
    if (session && onUpdateSession) {
      onUpdateSession(sessionPayload);
    } else if (onSaveTeacherAttendance) {
      onSaveTeacherAttendance(sessionPayload);
    }

    // Direct localStorage safety sync
    try {
      const allSessions = getTeacherAttendanceSessions() || [];
      const exIndex = allSessions.findIndex(
        (s) => s.id === sessionId || s.date === sessionDate
      );
      let updatedSessions;
      if (exIndex >= 0) {
        updatedSessions = [...allSessions];
        updatedSessions[exIndex] = sessionPayload;
      } else {
        updatedSessions = [sessionPayload, ...allSessions];
      }
      saveTeacherAttendanceSessions(updatedSessions);
    } catch (err) {
      console.error('Error saving teacher attendance directly:', err);
    }

    setSaveSuccess(true);
    setHasUnsavedChanges(false);

    if (shouldClose) {
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 500);
    } else {
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2500);
    }
  };

  // Delete Session
  const handleDeleteSession = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3500);
      return;
    }

    const sessionId = session?.id;
    if (sessionId && onDeleteSession) {
      onDeleteSession(sessionId);
    } else {
      try {
        const allSessions = getTeacherAttendanceSessions() || [];
        const filtered = allSessions.filter((s) => s.id !== sessionId && s.date !== sessionDate);
        saveTeacherAttendanceSessions(filtered);
      } catch (err) {
        console.error('Failed to delete teacher attendance session:', err);
      }
    }
    setConfirmDelete(false);
    onClose();
  };

  // WhatsApp Alert Sender for Teachers
  const sendWhatsAppAlert = (teacher, lecture, status, arrivalTime, minutesLate) => {
    const phone = teacher.contactNumber || teacher.phone || '';
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('03')) {
      cleanPhone = '92' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('92') && cleanPhone.length === 10) {
      cleanPhone = '92' + cleanPhone;
    }

    const slotInfo = lecture?.time
      ? ` for ${lecture.subject || 'lecture'} at ${formatTimeTo12Hour(lecture.time)}`
      : '';
    let message = '';
    if (status === ATTENDANCE_STATUS.ABSENT) {
      message = `*Star Academy - Faculty Attendance Alert*\n\nRespected ${teacher.name},\nYou have been marked *ABSENT* on *${sessionDate}*${slotInfo}.\nPlease inform the administration if this is an error or submit a formal leave request.\n\nRegards,\n*Star Academy Administration*`;
    } else {
      const timeStr = arrivalTime ? `at ${formatTimeTo12Hour(arrivalTime)}` : '';
      const lateStr = minutesLate ? ` (${minutesLate} minutes late)` : '';
      message = `*Star Academy - Late Arrival Notice*\n\nRespected ${teacher.name},\nYour arrival was recorded as *LATE* ${timeStr}${lateStr} on *${sessionDate}*${slotInfo}.\nPlease ensure punctuality for scheduled classes.\n\nRegards,\n*Star Academy Administration*`;
    }

    if (!cleanPhone) {
      const promptPhone = window.prompt(`Enter WhatsApp number for ${teacher.name}:`);
      if (!promptPhone) return;
      cleanPhone = promptPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('03')) cleanPhone = '92' + cleanPhone.slice(1);
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // Metrics computation
  const metrics = useMemo(() => {
    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;
    let leaveCount = 0;
    let unmarkedCount = 0;

    allLectureSlots.forEach((slot) => {
      const st = attendanceMap[slot.slotKey];
      if (st === ATTENDANCE_STATUS.PRESENT) presentCount++;
      else if (st === ATTENDANCE_STATUS.LATE) lateCount++;
      else if (st === ATTENDANCE_STATUS.ABSENT) absentCount++;
      else if (st === ATTENDANCE_STATUS.LEAVE) leaveCount++;
      else unmarkedCount++;
    });

    const fullyMarkedTeachersCount = activeTeachers.filter(
      (t) => getTeacherMarkedStats(t).isFullyMarked
    ).length;
    const remainingTeachersCount = activeTeachers.length - fullyMarkedTeachersCount;

    return {
      presentCount,
      lateCount,
      absentCount,
      leaveCount,
      unmarkedCount,
      totalSlots: allLectureSlots.length,
      totalTeachers: activeTeachers.length,
      fullyMarkedTeachersCount,
      remainingTeachersCount,
      completionRate:
        allLectureSlots.length > 0
          ? Math.round(
              ((allLectureSlots.length - unmarkedCount) / allLectureSlots.length) * 100
            )
          : 100
    };
  }, [allLectureSlots, attendanceMap, activeTeachers]);

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return activeTeachers.filter((t) => {
      const stats = getTeacherMarkedStats(t);

      // Status tab filter
      if (filterTab === 'PENDING' && stats.isFullyMarked) return false;
      if (filterTab === 'MARKED' && !stats.isFullyMarked) return false;

      // Text search filter
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const lecs = getTeacherLectures(t);
        const matchName = t.name?.toLowerCase().includes(q);
        const matchId = t.id?.toLowerCase().includes(q);
        const matchDept = t.department?.toLowerCase().includes(q);
        const matchPhone = (t.phone || t.contactNumber)?.toLowerCase().includes(q);
        const matchClass =
          t.assignedClasses && t.assignedClasses.some((c) => c.toLowerCase().includes(q));
        const matchLecture = lecs.some(
          (l) => l.subject?.toLowerCase().includes(q) || l.assignedClass?.toLowerCase().includes(q)
        );

        return matchName || matchId || matchDept || matchPhone || matchClass || matchLecture;
      }

      return true;
    });
  }, [activeTeachers, filterTab, searchTerm, attendanceMap]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-stitch-lg flex flex-col max-h-[95vh] border border-[#E5E7EB] overflow-hidden">
        {/* Top Header */}
        <div className="bg-[#111827] text-white p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FF7A59]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display">
                  {session ? 'Faculty Attendance Record' : 'Faculty Attendance Register'}
                </h2>
                <span className="text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-[#FF7A59]/20 text-[#FF7A59] border border-[#FF7A59]/30">
                  {session ? 'Archived' : 'Live'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {session
                  ? `Viewing attendance session recorded for ${sessionDate}`
                  : 'Mark attendance for all faculty lectures simultaneously as teachers arrive'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Session Date Selector */}
            <div className="flex items-center gap-1.5 bg-[#1F2937] px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-slate-200 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#FF7A59]" />
              <input
                type="date"
                value={sessionDate}
                disabled={Boolean(session)}
                onChange={(e) => setSessionDate(e.target.value)}
                className={`bg-transparent text-white font-mono text-xs focus:outline-hidden ${
                  session ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'
                }`}
              />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close Dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Progress Bar & Quick Stats Strip */}
        <div className="bg-[#F8F9FB] border-b border-[#E5E7EB] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#111827]" />
                  Attendance Progress:
                  <span className="font-mono font-bold text-slate-900 ml-1">
                    {metrics.fullyMarkedTeachersCount} of {metrics.totalTeachers} Teachers Marked
                  </span>
                </span>
                <span className="font-mono font-bold text-[#111827]">
                  {metrics.completionRate}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#111827] transition-all duration-300 rounded-full"
                  style={{ width: `${metrics.completionRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" />
              {metrics.presentCount} Present
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
              <Clock className="w-3 h-3 text-amber-600" />
              {metrics.lateCount} Late
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
              <XCircle className="w-3 h-3 text-rose-600" />
              {metrics.absentCount} Absent
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-[#E5E7EB]">
              <FileText className="w-3 h-3 text-slate-600" />
              {metrics.leaveCount} Leave
            </span>
            {metrics.unmarkedCount > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#575E70] border border-[#E5E7EB]">
                ⏳ {metrics.unmarkedCount} Unmarked
              </span>
            )}
          </div>
        </div>

        {/* Toolbar: Search, Filter Tabs & Batch Helpers */}
        <div className="p-3 sm:px-4 bg-white border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search teacher by name, subject, class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-[#F8F9FB] hover:bg-slate-100/70 focus:bg-white border border-[#E5E7EB] rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-[#111827] transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-full border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setFilterTab('ALL')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'ALL'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'text-[#575E70] hover:text-[#111827]'
              }`}
            >
              All Teachers ({activeTeachers.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('PENDING')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'PENDING'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'text-[#575E70] hover:text-[#111827]'
              }`}
            >
              Pending ({metrics.remainingTeachersCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('MARKED')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'MARKED'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'text-[#575E70] hover:text-[#111827]'
              }`}
            >
              Marked ({metrics.fullyMarkedTeachersCount})
            </button>
          </div>

          {/* Batch Shortcut */}
          {metrics.unmarkedCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllRemainingAsPresent}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              title="Quickly mark all lectures without status as Present"
            >
              <CheckCheck className="w-3.5 h-3.5 text-slate-700" />
              Mark All Unmarked as Present
            </button>
          )}
        </div>

        {/* Scrollable Teacher Attendance Cards List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 bg-slate-100/60">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No faculty members found</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {searchTerm
                  ? `No faculty match "${searchTerm}". Try a different name or clear the search.`
                  : filterTab === 'PENDING'
                  ? 'All faculty members have been marked! Great job.'
                  : 'No active faculty records found in this category.'}
              </p>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            filteredTeachers.map((teacher) => {
              const lectures = getTeacherLectures(teacher);
              const stats = getTeacherMarkedStats(teacher);

              return (
                <div
                  key={teacher.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 shadow-2xs hover:shadow-md ${
                    stats.isFullyMarked
                      ? 'border-emerald-200 ring-1 ring-emerald-100'
                      : stats.isPartiallyMarked
                      ? 'border-amber-200 ring-1 ring-amber-100'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Teacher Header Bar */}
                  <div className="p-3 sm:px-4 sm:py-3 bg-slate-50/80 border-b border-slate-200/80 rounded-t-2xl flex flex-wrap items-center justify-between gap-2.5">
                    {/* Teacher Details */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      {teacher.pic ? (
                        <img
                          src={teacher.pic}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-2xl bg-slate-800 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {teacher.name?.charAt(0) || 'T'}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-slate-900 text-sm truncate">
                            {teacher.name}
                          </h3>
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {teacher.id}
                          </span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {teacher.department || 'Faculty'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          {teacher.contactNumber && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {teacher.contactNumber}
                            </span>
                          )}
                          <span>
                            {lectures.length} {lectures.length === 1 ? 'Lecture' : 'Lectures'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Status & Fast-Action */}
                    <div className="flex items-center gap-2 shrink-0">
                      {stats.isFullyMarked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Marked ({stats.marked}/{stats.total})
                        </span>
                      ) : stats.isPartiallyMarked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          In Progress ({stats.marked}/{stats.total})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          ⏳ Pending Arrival
                        </span>
                      )}

                      {/* 1-Tap "Mark All as Present" for this Teacher */}
                      <button
                        type="button"
                        onClick={() => handleMarkTeacherAll(teacher, ATTENDANCE_STATUS.PRESENT)}
                        className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                        title="Mark all lectures of this teacher as Present"
                      >
                        <Check className="w-3 h-3" />
                        Mark Present
                      </button>
                    </div>
                  </div>

                  {/* Respective Lectures & Timing with Present, Late, Absent, Leave */}
                  <div className="p-3 sm:p-4 divide-y divide-slate-100">
                    {lectures.map((lecture, lIdx) => {
                      const currentStatus = attendanceMap[lecture.slotKey];
                      const arrivalTime = arrivalTimesMap[lecture.slotKey] || '';
                      const minutesLate = minutesLateMap[lecture.slotKey] || 0;
                      const note = notesMap[lecture.slotKey] || '';

                      return (
                        <div
                          key={lecture.slotKey}
                          className={`py-3 first:pt-1 last:pb-1 flex flex-col gap-2.5 ${
                            lIdx > 0 ? 'mt-1' : ''
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            {/* Lecture Info: #, Class, Subject & Scheduled Time in AM/PM format */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[11px] flex items-center justify-center border border-slate-200 shrink-0">
                                #{lIdx + 1}
                              </span>

                              <div className="flex items-center gap-2 flex-wrap min-w-0">
                                {lecture.assignedClass && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                                    <Layers className="w-2.5 h-2.5" />
                                    {lecture.assignedClass}
                                  </span>
                                )}
                                <span className="font-bold text-slate-800 text-xs">
                                  {lecture.subject}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full shrink-0">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  {formatTimeTo12Hour(lecture.time)}
                                </span>
                              </div>
                            </div>

                            {/* 4 Attendance Action Buttons + WhatsApp Button */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* PRESENT */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    lecture.slotKey,
                                    lecture.time,
                                    ATTENDANCE_STATUS.PRESENT
                                  )
                                }
                                className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                                  currentStatus === ATTENDANCE_STATUS.PRESENT
                                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Present</span>
                              </button>

                              {/* LATE */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    lecture.slotKey,
                                    lecture.time,
                                    ATTENDANCE_STATUS.LATE
                                  )
                                }
                                className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                                  currentStatus === ATTENDANCE_STATUS.LATE
                                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <Clock className="w-3.5 h-3.5" />
                                <span>Late</span>
                              </button>

                              {/* ABSENT */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    lecture.slotKey,
                                    lecture.time,
                                    ATTENDANCE_STATUS.ABSENT
                                  )
                                }
                                className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                                  currentStatus === ATTENDANCE_STATUS.ABSENT
                                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Absent</span>
                              </button>

                              {/* LEAVE */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(
                                    lecture.slotKey,
                                    lecture.time,
                                    ATTENDANCE_STATUS.LEAVE
                                  )
                                }
                                className={`px-3 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                                  currentStatus === ATTENDANCE_STATUS.LEAVE
                                    ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Leave</span>
                              </button>

                              {/* Quick WhatsApp Alert button if Late or Absent */}
                              {(currentStatus === ATTENDANCE_STATUS.LATE ||
                                currentStatus === ATTENDANCE_STATUS.ABSENT) && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    sendWhatsAppAlert(
                                      teacher,
                                      lecture,
                                      currentStatus,
                                      arrivalTime,
                                      minutesLate
                                    )
                                  }
                                  className="p-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                                  title="Send WhatsApp Attendance Alert to Teacher"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Inline Late Arrival Picker if LATE is selected */}
                          {currentStatus === ATTENDANCE_STATUS.LATE && (
                            <div className="bg-[#F8F9FB] border border-slate-200 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
                              <div className="flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                                <span className="font-semibold text-slate-800">
                                  Actual Arrival Time:
                                </span>
                                <input
                                  type="time"
                                  value={arrivalTime || lecture.time || '15:00'}
                                  onChange={(e) =>
                                    handleArrivalTimeChange(
                                      lecture.slotKey,
                                      lecture.time,
                                      e.target.value
                                    )
                                  }
                                  className="bg-white border border-slate-300 rounded-full px-2.5 py-0.5 font-mono text-xs font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900 cursor-pointer"
                                />
                              </div>

                              <div className="flex items-center gap-2">
                                {minutesLate > 0 ? (
                                  <span className="font-bold text-rose-700 bg-rose-100/90 px-2 py-0.5 rounded-md font-mono text-[11px] border border-rose-200">
                                    +{minutesLate} min late
                                  </span>
                                ) : (
                                  <span className="font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md font-mono text-[11px] border border-emerald-200">
                                    0 min late (On Time)
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-500 font-medium">
                                  (Scheduled: {formatTimeTo12Hour(lecture.time)})
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Inline Reason Field if ABSENT or LEAVE is selected */}
                          {(currentStatus === ATTENDANCE_STATUS.LEAVE ||
                            currentStatus === ATTENDANCE_STATUS.ABSENT) && (
                            <div className="flex items-center gap-2 text-xs animate-fade-in">
                              <span className="text-slate-500 font-medium shrink-0">
                                Optional Note / Reason:
                              </span>
                              <input
                                type="text"
                                placeholder={
                                  currentStatus === ATTENDANCE_STATUS.LEAVE
                                    ? 'e.g. Approved medical leave, family emergency...'
                                    : 'e.g. Unannounced absence, unreachable...'
                                }
                                value={note}
                                onChange={(e) => handleNoteChange(lecture.slotKey, e.target.value)}
                                className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer with Actions, Delete Option & Save State */}
        <div className="p-4 sm:px-6 bg-white border-t border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#575E70]">
            {saveSuccess ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Attendance saved successfully!
              </span>
            ) : hasUnsavedChanges ? (
              <span className="text-amber-700 font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Unsaved changes pending save.
              </span>
            ) : (
              <span className="text-[#575E70]">
                All records synchronized for <b className="text-slate-800">{sessionDate}</b>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Delete Session Button (When viewing an existing session) */}
            {(session || onDeleteSession) && (
              <button
                type="button"
                onClick={handleDeleteSession}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  confirmDelete
                    ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-300'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
                title="Delete this entire faculty attendance session"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{confirmDelete ? 'Confirm Delete Session?' : 'Delete Session'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-slate-600 bg-[#F3F4F6] hover:bg-[#edeef0] transition-colors cursor-pointer"
            >
              Cancel / Close
            </button>

            {/* Save & Keep Open */}
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#F3F4F6] text-slate-800 border border-[#E5E7EB] transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Save changes and keep dialog open"
            >
              <Save className="w-3.5 h-3.5 text-slate-600" />
              Save Progress
            </button>

            {/* Save & Close */}
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-[#111827] hover:bg-[#1F2937] active:bg-black text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              {session ? 'Update & Close' : 'Save & Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
