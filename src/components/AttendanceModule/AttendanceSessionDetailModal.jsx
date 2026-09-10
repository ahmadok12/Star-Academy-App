import React, { useState, useEffect } from 'react';
import { X, Calendar, CheckCircle2, XCircle, Clock, Trash2, Edit3, Save, RotateCcw, AlertTriangle } from 'lucide-react';
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
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Initialize status map
  useEffect(() => {
    if (session?.records) {
      const map = {};
      session.records.forEach((r) => {
        map[r.studentId] = r.status;
      });
      setRecordsMap(map);
      setIsEditing(false);
      setConfirmDelete(false);
    }
  }, [session]);

  const handleStatusChange = (studentId, newStatus) => {
    setRecordsMap((prev) => ({
      ...prev,
      [studentId]: newStatus
    }));
  };

  const handleSaveEdit = () => {
    const updatedRecords = (session.records || []).map((r) => ({
      ...r,
      status: recordsMap[r.studentId] || r.status
    }));

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

  // Compute live counts based on current state
  const total = session.records?.length || 0;
  let presentCount = 0, absentCount = 0, leaveCount = 0;
  (session.records || []).forEach((r) => {
    const st = isEditing ? recordsMap[r.studentId] : r.status;
    if (st === ATTENDANCE_STATUS.PRESENT) presentCount++;
    else if (st === ATTENDANCE_STATUS.ABSENT) absentCount++;
    else if (st === ATTENDANCE_STATUS.LEAVE) leaveCount++;
  });
  const attendanceRate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Top Edit & Close Action Buttons */}
        <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-indigo-700 via-indigo-600 to-brand-700 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-indigo-200 text-[11px] font-semibold">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{session.date}</span>
            </div>

            <div className="flex items-center gap-2">
              {/* EDIT ATTENDANCE BUTTON */}
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 bg-amber-400 hover:bg-amber-300 text-slate-900 px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs transition-all tap-active"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-xl text-xs font-semibold backdrop-blur-sm transition-all tap-active"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h2 className="text-base font-black text-white leading-tight">
            Class {session.studentClass} • {session.subject}
          </h2>
          {isEditing && (
            <p className="text-[11px] text-amber-300 font-semibold mt-0.5">
              Editing Attendance Mode: Tap status buttons to modify
            </p>
          )}
        </div>

        {/* Stats Pill Row */}
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 grid grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white p-2 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-bold uppercase">Total</span>
            <span className="font-extrabold text-slate-800 text-sm">{total}</span>
          </div>
          <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
            <span className="text-[10px] text-emerald-600 block font-bold uppercase">Present</span>
            <span className="font-extrabold text-emerald-700 text-sm">{presentCount}</span>
          </div>
          <div className="bg-rose-50 p-2 rounded-xl border border-rose-200">
            <span className="text-[10px] text-rose-600 block font-bold uppercase">Absent</span>
            <span className="font-extrabold text-rose-700 text-sm">{absentCount}</span>
          </div>
          <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
            <span className="text-[10px] text-amber-600 block font-bold uppercase">Leave</span>
            <span className="font-extrabold text-amber-700 text-sm">{leaveCount}</span>
          </div>
        </div>

        {/* Attendance Rate Banner */}
        <div className="px-4 py-2 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-indigo-900">Attendance Percentage:</span>
          <span className="font-extrabold text-indigo-700 font-mono text-xs bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
            {attendanceRate}%
          </span>
        </div>

        {/* Student Records List */}
        <div className="overflow-y-auto flex-1 p-4 space-y-2.5 text-xs">
          {session.records && session.records.length > 0 ? (
            session.records.map((rec, index) => {
              const currentStatus = isEditing ? (recordsMap[rec.studentId] || rec.status) : rec.status;
              const isPresent = currentStatus === ATTENDANCE_STATUS.PRESENT;
              const isAbsent = currentStatus === ATTENDANCE_STATUS.ABSENT;
              const isLeave = currentStatus === ATTENDANCE_STATUS.LEAVE;

              return (
                <div
                  key={rec.studentId || index}
                  className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col gap-2 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-slate-400 font-mono font-bold text-[11px] w-4 text-center">
                        {index + 1}
                      </span>
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <img
                          src={rec.pic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded">
                            {rec.studentId}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 text-xs truncate">
                          {rec.studentName}
                        </p>
                      </div>
                    </div>

                    {/* Non-editing badge */}
                    {!isEditing && (
                      <div>
                        {isPresent && (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg font-bold text-[11px]">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Present
                          </span>
                        )}
                        {isAbsent && (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-lg font-bold text-[11px]">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Absent
                          </span>
                        )}
                        {isLeave && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg font-bold text-[11px]">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Leave
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Editing Status Controls (Only Selected is Colored) */}
                  {isEditing && (
                    <div className="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.studentId, ATTENDANCE_STATUS.PRESENT)}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold text-[11px] transition-all tap-active ${
                          isPresent
                            ? 'bg-emerald-600 text-white shadow-xs ring-1 ring-emerald-600 border border-emerald-600'
                            : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        <CheckCircle2 className={`w-3 h-3 ${isPresent ? 'text-white' : 'text-slate-400'}`} />
                        <span>Present</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.studentId, ATTENDANCE_STATUS.ABSENT)}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold text-[11px] transition-all tap-active ${
                          isAbsent
                            ? 'bg-rose-600 text-white shadow-xs ring-1 ring-rose-600 border border-rose-600'
                            : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        <XCircle className={`w-3 h-3 ${isAbsent ? 'text-white' : 'text-slate-400'}`} />
                        <span>Absent</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.studentId, ATTENDANCE_STATUS.LEAVE)}
                        className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl font-bold text-[11px] transition-all tap-active ${
                          isLeave
                            ? 'bg-amber-500 text-white shadow-xs ring-1 ring-amber-500 border border-amber-500'
                            : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                        }`}
                      >
                        <Clock className={`w-3 h-3 ${isLeave ? 'text-white' : 'text-slate-400'}`} />
                        <span>Leave</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-slate-400 py-6">No individual records found.</p>
          )}
        </div>

        {/* Modal Footer with DELETE ATTENDANCE BUTTON */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-2.5">
          {/* DELETE BUTTON */}
          <button
            type="button"
            onClick={handleDelete}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-active ${
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
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-200 flex items-center justify-center gap-1.5 transition-all tap-active"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors tap-active"
            >
              Close Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
