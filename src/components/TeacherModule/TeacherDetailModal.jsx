import React, { useState } from 'react';
import {
  X,
  Phone,
  MapPin,
  ShieldCheck,
  User,
  Hash,
  Edit3,
  Trash2,
  Coins,
  GraduationCap,
  Calendar,
  Layers,
  BookOpen,
  Clock
} from 'lucide-react';
import { formatTimeTo12Hour } from '../../utils/storage';

export default function TeacherDetailModal({
  teacher,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleStatus
}) {
  if (!isOpen || !teacher) return null;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const isLeft = Boolean(teacher.isLeft || teacher.isActive === false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(teacher.id);
      setConfirmDelete(false);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };

  const formattedSalary = teacher.salary
    ? Number(teacher.salary).toLocaleString()
    : '60,000';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-stitch-lg overflow-hidden border border-[#E5E7EB]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with EDIT BUTTON AT THE TOP */}
        <div className="relative bg-[#111827] text-white p-5 pt-4 border-b border-[#1F2937]">
          
          {/* Top Action Bar with EDIT button at top and Close button */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Faculty Member Profile
            </span>

            <div className="flex items-center gap-2">
              {/* EDIT BUTTON AT TOP */}
              <button
                onClick={() => onEdit(teacher)}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/15 shadow-sm transition-all tap-active cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Teacher</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teacher Photo & Main Heading */}
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-2xl border-2 border-white/20 overflow-hidden shadow-lg bg-white/10 shrink-0 relative">
              <img
                src={teacher.pic}
                alt={teacher.name}
                className={`w-full h-full object-cover ${isLeft ? 'grayscale' : ''}`}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                }}
              />
              {isLeft && (
                <div className="absolute inset-0 bg-[#111827]/70 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-rose-600 px-1.5 py-0.5 rounded-full">
                    Left
                  </span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-white/10 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border border-white/15">
                  <Hash className="w-3 h-3 text-slate-400" />
                  {teacher.id}
                </span>
                {isLeft ? (
                  <span className="bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    Left Academy
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-semibold px-2.5 py-0.5 rounded-full">
                    Active Faculty
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-white leading-tight mt-1 truncate font-display">
                {teacher.name}
              </h2>

              <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-slate-400 shrink-0" />
                <span>{teacher.department || 'General Faculty'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Details Body */}
        <div className="overflow-y-auto p-4 space-y-3 text-xs flex-1">
          
          {/* Left Academy Status Checkbox Card */}
          <div className={`border rounded-2xl p-3.5 transition-all ${
            isLeft ? 'bg-rose-50/80 border-rose-300' : 'bg-slate-50 border-slate-200'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isLeft}
                onChange={(e) => onToggleStatus && onToggleStatus(teacher.id, e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 cursor-pointer accent-rose-600"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isLeft ? 'text-rose-900' : 'text-slate-800'}`}>
                    Mark as Left the Academy
                  </span>
                  {isLeft ? (
                    <span className="text-[10px] font-extrabold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
                      Inactive
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {isLeft
                    ? 'Teacher has left the academy and is marked inactive. Only active teachers are available for attendance marking, timetables, and salary payments.'
                    : 'Check this box when the teacher departs. This deactivates their account and removes them from selection dropdowns.'}
                </p>
              </div>
            </label>
          </div>

          {/* Salary Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide block">
                Monthly Compensation
              </span>
              <span className="text-base font-black text-emerald-950 font-mono">
                PKR {formattedSalary} <span className="text-xs font-semibold text-emerald-700">/ month</span>
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          {/* Joining Date & CNIC Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              Registration & Verification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Date of Joining</span>
                <span className="font-semibold text-slate-800 text-xs flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3 text-indigo-500" />
                  {teacher.joinedAt || 'N/A'}
                </span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">CNIC Number</span>
                <span className="font-mono font-bold text-slate-800 text-xs mt-0.5 block truncate">
                  {teacher.cnic || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Lecture Timing Schedule Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center justify-between text-indigo-600">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Lecture Timings & Subjects
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                {(teacher.teachingSlots?.length || 1)} {teacher.teachingSlots?.length === 1 ? 'Lecture' : 'Lectures'}
              </span>
            </h3>

            <div className="space-y-1.5">
              {(teacher.teachingSlots && teacher.teachingSlots.length > 0 ? teacher.teachingSlots : [
                {
                  id: '1',
                  subject: teacher.department || 'Faculty Subject',
                  time: teacher.arrivalTime || '15:00',
                  assignedClass: (teacher.assignedClasses && teacher.assignedClasses[0]) || ''
                }
              ]).map((slot, idx) => {
                const assignedClass =
                  slot.assignedClass ||
                  (teacher.assignedClasses && teacher.assignedClasses[idx]) ||
                  (teacher.assignedClasses && teacher.assignedClasses.length === 1 ? teacher.assignedClasses[0] : null);

                return (
                  <div
                    key={slot.id || idx}
                    className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between shadow-2xs gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-[10px] shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-800 text-xs">
                            {slot.subject || teacher.department || 'Faculty Subject'}
                          </span>
                          {assignedClass && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                              <Layers className="w-2.5 h-2.5" />
                              {assignedClass}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-mono font-extrabold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-lg shrink-0">
                      <Clock className="w-3 h-3 text-amber-600" />
                      {formatTimeTo12Hour(slot.time)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
              <User className="w-3.5 h-3.5" />
              Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium block">Primary Mobile</span>
                <a
                  href={`tel:${teacher.contactNumber}`}
                  className="font-mono font-bold text-indigo-600 flex items-center gap-1 hover:underline mt-0.5"
                >
                  <Phone className="w-3 h-3 text-indigo-500" />
                  {teacher.contactNumber || 'N/A'}
                </a>
              </div>

              {teacher.secondaryContactNumber && (
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-medium block">Secondary Mobile</span>
                  <a
                    href={`tel:${teacher.secondaryContactNumber}`}
                    className="font-mono font-bold text-slate-700 flex items-center gap-1 hover:underline mt-0.5"
                  >
                    <Phone className="w-3 h-3 text-slate-400" />
                    {teacher.secondaryContactNumber}
                  </a>
                </div>
              )}
            </div>

            {teacher.address && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Address</span>
                  <span className="text-slate-700 font-medium text-xs">{teacher.address}</span>
                </div>
              </div>
            )}
          </div>

          {/* Assigned Classes & Sections */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-700" />
              Assigned Classes & Sections
            </h3>

            {teacher.assignedClasses && teacher.assignedClasses.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {teacher.assignedClasses.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 font-semibold text-[11px] shadow-2xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                No specific classes or sections assigned.
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer with DELETE BUTTON AT THE BOTTOM */}
        <div className="p-4 border-t border-[#E5E7EB] bg-white flex items-center gap-2.5">
          {/* DELETE BUTTON AT BOTTOM */}
          <button
            type="button"
            onClick={handleDelete}
            className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition-all tap-active cursor-pointer ${
              confirmDelete
                ? 'bg-rose-700 text-white animate-pulse ring-2 ring-rose-300'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmDelete ? 'Confirm Delete?' : 'Delete Teacher'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-[#1F2937] text-white font-semibold text-xs transition-colors tap-active cursor-pointer shadow-sm"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
