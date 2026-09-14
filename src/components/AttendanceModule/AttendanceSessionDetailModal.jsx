import React, { useState, useEffect, useMemo } from 'react';
import { X, Calendar, CheckCircle2, XCircle, Clock, Trash2, Edit3, Save, RotateCcw, AlertCircle, MessageCircle, Filter } from 'lucide-react';
import { ATTENDANCE_STATUS } from '../../constants/academicData';

export default function AttendanceSessionDetailModal({
  session,
  isOpen,
  onClose,
  onUpdateSession,
  onDeleteSession
}) {
  if (!isOpen || !session) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [recordsMap, setRecordsMap] = useState({});
  const [arrivalMap, setArrivalMap] = useState({});
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE'
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Initialize status map
  useEffect(() => {
    if (session?.records) {
      const map = {};
      const arr = {};
      session.records.forEach((r) => {
        map[r.studentId] = r.status;
        arr[r.studentId] = r.arrivalTime || '';
      });
      setRecordsMap(map);
      setArrivalMap(arr);
      setIsEditing(false);
      setConfirmDelete(false);
      setActiveFilter('ALL');
    }
  }, [session]);

  const handleStatusChange = (studentId, newStatus) => {
    setRecordsMap((prev) => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const handleSaveEdit = () => {
    const updatedRecords = (session.records || []).map((r) => {
      const st = recordsMap[r.studentId] || r.status;
      const arr = arrivalMap[r.studentId] || r.arrivalTime || '';
      const isLate = st === ATTENDANCE_STATUS.LATE;
      return {
        ...r,
        status: st,
        arrivalTime: st === ATTENDANCE_STATUS.ABSENT ? '' : arr,
        isLate,
        minutesLate: isLate ? (r.minutesLate || 15) : 0,
      };
    });

    const updatedSession = {
      ...session,
      records: updatedRecords,
      updatedAt: new Date().toISOString()
    };

    onUpdateSession(updatedSession);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDeleteSession(session.id);
      setConfirmDelete(false);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };

  // Compute live counts
  const total = session.records?.length || 0;
  let presentCount = 0, lateCount = 0, absentCount = 0, leaveCount = 0;
  (session.records || []).forEach((r) => {
    const st = isEditing ? recordsMap[r.studentId] : r.status;
    if (st === ATTENDANCE_STATUS.PRESENT) presentCount++;
    else if (st === ATTENDANCE_STATUS.LATE) lateCount++;
    else if (st === ATTENDANCE_STATUS.ABSENT) absentCount++;
    else if (st === ATTENDANCE_STATUS.LEAVE) leaveCount++;
  });
  const attendedCount = presentCount + lateCount;
  const attendanceRate = total > 0 ? Math.round((attendedCount / total) * 100) : 0;

  // Filtered records
  const filteredRecords = useMemo(() => {
    const list = session.records || [];
    if (activeFilter === 'ALL') return list;
    if (activeFilter === 'PRESENT') return list.filter((r) => (isEditing ? recordsMap[r.studentId] : r.status) === ATTENDANCE_STATUS.PRESENT);
    if (activeFilter === 'LATE') return list.filter((r) => (isEditing ? recordsMap[r.studentId] : r.status) === ATTENDANCE_STATUS.LATE || r.isLate);
    if (activeFilter === 'ABSENT') return list.filter((r) => (isEditing ? recordsMap[r.studentId] : r.status) === ATTENDANCE_STATUS.ABSENT);
    if (activeFilter === 'LEAVE') return list.filter((r) => (isEditing ? recordsMap[r.studentId] : r.status) === ATTENDANCE_STATUS.LEAVE);
    return list;
  }, [session.records, activeFilter, isEditing, recordsMap]);

  // WhatsApp Alert Sender
  const sendWhatsAppAlert = (student, type) => {
    const guardianPhone = student.whatsappNumber || student.fatherContact || student.contactNumber || '';
    let cleanPhone = guardianPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('03')) {
      cleanPhone = '92' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('92') && cleanPhone.length === 10) {
      cleanPhone = '92' + cleanPhone;
    }

    let message = '';
    if (type === 'absent') {
      message = `*Star Academy - Attendance Notice*\n\nRespected Parent / Guardian,\nThis is to notify you that your child *${student.studentName || student.firstName}* (Roll No: ${student.studentId || student.id}) was marked *ABSENT* on *${session.date}* for Class *${session.studentClass} (${session.subject})*.\n\nPlease contact the academy administration or reply to this message with the reason.\n\nRegards,\n*Star Academy Administration*`;
    } else {
      const timeStr = student.arrivalTime ? `at ${student.arrivalTime}` : '';
      const lateStr = student.minutesLate ? ` (${student.minutesLate} minutes late)` : '';
      message = `*Star Academy - Late Arrival Notice*\n\nRespected Parent / Guardian,\nThis is to inform you that your child *${student.studentName || student.firstName}* (Roll No: ${student.studentId || student.id}) arrived *LATE* ${timeStr}${lateStr} on *${session.date}* for Class *${session.studentClass} (${session.subject})*.\n\nPunctuality is critical for learning and discipline. Please ensure timely arrival.\n\nRegards,\n*Star Academy Administration*`;
    }

    if (!cleanPhone) {
      const promptPhone = window.prompt(`Enter guardian WhatsApp number for ${student.studentName || student.firstName} (e.g. 03001234567):`);
      if (!promptPhone) return;
      cleanPhone = promptPhone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('03')) cleanPhone = '92' + cleanPhone.slice(1);
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Top Edit & Close Action Buttons */}
        <div className="px-5 py-4 border-b border-slate-800 bg-[#111827] text-white shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-slate-300 text-[11px] font-semibold">
              <Calendar className="w-3.5 h-3.5 text-[#FF7A59]" />
              <span>{session.date}</span>
              {session.expectedStartTime && (
                <span className="bg-white/10 px-2 py-0.5 rounded-full text-[10px] text-slate-200">
                  Start: {session.expectedStartTime}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* EDIT ATTENDANCE BUTTON */}
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 bg-[#FF7A59] hover:bg-[#ff6942] text-white px-3 py-1 rounded-full text-xs font-bold shadow-xs transition-all tap-active cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm transition-all tap-active cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-base font-display font-black text-white leading-tight">
            Class {session.studentClass} • {session.subject}
          </h2>
          {isEditing && (
            <p className="text-[11px] text-[#FF7A59] font-semibold mt-0.5">
              Editing Attendance Mode: Tap status buttons to modify
            </p>
          )}
        </div>

        {/* Stats Pill Row (5 Metrics) */}
        <div className="p-3 bg-[#F8F9FB] border-b border-slate-200 grid grid-cols-5 gap-1.5 text-center text-xs shrink-0">
          <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-[9px] text-slate-400 block font-bold uppercase">Total</span>
            <span className="font-display font-extrabold text-slate-900 text-xs">{total}</span>
          </div>
          <div className="bg-emerald-50/80 p-2 rounded-2xl border border-emerald-200/70 shadow-2xs">
            <span className="text-[9px] text-emerald-700 block font-bold uppercase">Present</span>
            <span className="font-display font-extrabold text-emerald-800 text-xs">{presentCount}</span>
          </div>
          <div className="bg-amber-50/80 p-2 rounded-2xl border border-amber-200/70 shadow-2xs">
            <span className="text-[9px] text-amber-700 block font-bold uppercase">Late</span>
            <span className="font-display font-extrabold text-amber-800 text-xs">{lateCount}</span>
          </div>
          <div className="bg-rose-50/80 p-2 rounded-2xl border border-rose-200/70 shadow-2xs">
            <span className="text-[9px] text-rose-700 block font-bold uppercase">Absent</span>
            <span className="font-display font-extrabold text-rose-800 text-xs">{absentCount}</span>
          </div>
          <div className="bg-blue-50/80 p-2 rounded-2xl border border-blue-200/70 shadow-2xs">
            <span className="text-[9px] text-blue-700 block font-bold uppercase">Leave</span>
            <span className="font-display font-extrabold text-blue-800 text-xs">{leaveCount}</span>
          </div>
        </div>

        {/* Filter Tabs Row: All, Present, Latecomers, Absent, Leave */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All', count: total },
            { id: 'PRESENT', label: 'Present', count: presentCount },
            { id: 'LATE', label: 'Latecomers', count: lateCount },
            { id: 'ABSENT', label: 'Absent', count: absentCount },
            { id: 'LEAVE', label: 'Leave', count: leaveCount },
          ].map((tab) => {
            const isSelected = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 tap-active cursor-pointer ${
                  isSelected
                    ? tab.id === 'ABSENT'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : tab.id === 'LATE'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : tab.id === 'PRESENT'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#111827] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700 font-bold'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Attendance Rate Banner */}
        <div className="px-4 py-2 bg-[#F8F9FB] border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="font-semibold text-slate-700">Attendance Percentage:</span>
          <span className="font-display font-extrabold text-[#111827] text-xs bg-white px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
            {attendanceRate}%
          </span>
        </div>

        {/* Student Records List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2.5 text-xs">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((rec, index) => {
              const currentStatus = isEditing ? (recordsMap[rec.studentId] || rec.status) : rec.status;
              const isPresent = currentStatus === ATTENDANCE_STATUS.PRESENT;
              const isLate = currentStatus === ATTENDANCE_STATUS.LATE || rec.isLate;
              const isAbsent = currentStatus === ATTENDANCE_STATUS.ABSENT;
              const isLeave = currentStatus === ATTENDANCE_STATUS.LEAVE;

              return (
                <div
                  key={rec.studentId || index}
                  className="bg-white p-3 rounded-2xl border border-slate-200/90 flex flex-col gap-2 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-slate-400 font-mono font-bold text-[11px] w-4 text-center">
                        {index + 1}
                      </span>
                      <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={rec.pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-full border border-slate-200/60">
                            {rec.studentId}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 text-xs truncate mt-0.5">
                          {rec.studentName}
                        </p>
                      </div>
                    </div>

                    {/* Non-editing badge & Actions */}
                    {!isEditing && (
                      <div className="flex items-center gap-1.5">
                        {isPresent && !isLate && (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Present
                          </span>
                        )}
                        {isLate && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Late
                          </span>
                        )}
                        {isAbsent && (
                          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Absent
                          </span>
                        )}
                        {isLeave && (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold text-[11px]">
                            <AlertCircle className="w-3 h-3 text-blue-600" />
                            Leave
                          </span>
                        )}

                        {/* WhatsApp Alert Button for Absent or Latecomers */}
                        {(isAbsent || isLate) && (
                          <button
                            type="button"
                            onClick={() => sendWhatsAppAlert(rec, isAbsent ? 'absent' : 'late')}
                            title={`Send WhatsApp ${isAbsent ? 'Absentee' : 'Latecomer'} Alert to Guardian`}
                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs transition-all tap-active ml-1 shrink-0 cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3 fill-current" />
                            <span>WhatsApp</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Arrival Time & Late Minutes Details */}
                  {(rec.arrivalTime || isLate) && !isAbsent && (
                    <div className="flex items-center justify-between px-3 py-1 bg-[#F8F9FB] rounded-xl text-[11px] border border-slate-100">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span className="font-medium">Arrival Time:</span>
                        <span className="font-bold text-slate-800">{rec.arrivalTime || 'Marked Late'}</span>
                      </div>
                      {(isLate || (rec.minutesLate && rec.minutesLate > 0)) && (
                        <span className="font-extrabold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full text-[10px]">
                          {rec.minutesLate ? `${rec.minutesLate} mins late` : 'Late'}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Editing Status Controls (4 Buttons: Present, Late, Absent, Leave) */}
                  {isEditing && (
                    <div className="grid grid-cols-4 gap-1 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.studentId, ATTENDANCE_STATUS.PRESENT)}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-full font-bold text-[11px] transition-all tap-active cursor-pointer ${
                          currentStatus === ATTENDANCE_STATUS.PRESENT
                            ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-600 border border-emerald-600'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <CheckCircle2 className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.PRESENT ? 'text-white' : 'text-slate-400'}`} />
                        <span>Present</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.studentId, ATTENDANCE_STATUS.LATE)}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-full font-bold text-[11px] transition-all tap-active cursor-pointer ${
                          currentStatus === ATTENDANCE_STATUS.LATE
                            ? 'bg-amber-500 text-white shadow-xs ring-1 ring-amber-500 border border-amber-500'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <Clock className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.LATE ? 'text-white' : 'text-slate-400'}`} />
                        <span>Late</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.studentId, ATTENDANCE_STATUS.ABSENT)}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-full font-bold text-[11px] transition-all tap-active cursor-pointer ${
                          currentStatus === ATTENDANCE_STATUS.ABSENT
                            ? 'bg-rose-600 text-white shadow-xs ring-1 ring-rose-600 border border-rose-600'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <XCircle className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.ABSENT ? 'text-white' : 'text-slate-400'}`} />
                        <span>Absent</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.studentId, ATTENDANCE_STATUS.LEAVE)}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-full font-bold text-[11px] transition-all tap-active cursor-pointer ${
                          currentStatus === ATTENDANCE_STATUS.LEAVE
                            ? 'bg-[#111827] text-white shadow-xs ring-1 ring-[#111827] border border-[#111827]'
                            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                        }`}
                      >
                        <AlertCircle className={`w-3 h-3 ${currentStatus === ATTENDANCE_STATUS.LEAVE ? 'text-white' : 'text-slate-400'}`} />
                        <span>Leave</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center text-slate-400 py-8 bg-[#F8F9FB] rounded-3xl border border-dashed border-slate-200">
              <p className="font-bold text-slate-600 text-xs">No records matching filter "{activeFilter}"</p>
              <button
                onClick={() => setActiveFilter('ALL')}
                className="mt-2 text-[#111827] text-xs font-bold hover:underline cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer with DELETE ATTENDANCE BUTTON */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2.5 shrink-0">
          {/* DELETE BUTTON */}
          <button
            type="button"
            onClick={handleDelete}
            className={`flex-1 py-2.5 px-3 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-active cursor-pointer ${
              confirmDelete
                ? 'bg-rose-700 text-white animate-pulse'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmDelete ? 'Confirm Delete Session?' : 'Delete Session'}</span>
          </button>

          {isEditing ? (
            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex-1 py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5 transition-all tap-active cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-black text-white font-bold text-xs transition-colors tap-active cursor-pointer"
            >
              Close Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

