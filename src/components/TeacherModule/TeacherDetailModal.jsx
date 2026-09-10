import React, { useState } from 'react';
import { X, Phone, MapPin, ShieldCheck, User, Hash, Edit3, Trash2, Coins, GraduationCap, Calendar, Award } from 'lucide-react';

export default function TeacherDetailModal({
  teacher,
  isOpen,
  onClose,
  onEdit,
  onDelete
}) {
  if (!isOpen || !teacher) return null;

  const [confirmDelete, setConfirmDelete] = useState(false);

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
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with EDIT BUTTON AT THE TOP */}
        <div className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-brand-800 text-white p-5 pt-4">
          
          {/* Top Action Bar with EDIT button at top and Close button */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Faculty Member Profile
            </span>

            <div className="flex items-center gap-2">
              {/* EDIT BUTTON AT TOP */}
              <button
                onClick={() => onEdit(teacher)}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all tap-active"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Teacher</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teacher Photo & Main Heading */}
          <div className="flex items-center gap-3.5">
            <div className="w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-2xl border-2 border-white/50 overflow-hidden shadow-lg bg-white/10 shrink-0">
              <img
                src={teacher.pic}
                alt={teacher.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-400 text-indigo-950 px-2 py-0.5 rounded-full text-[10px] font-black font-mono">
                  <Hash className="w-3 h-3" />
                  {teacher.id}
                </span>
                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Active Faculty
                </span>
              </div>

              <h2 className="text-base font-extrabold text-white leading-tight mt-1 truncate">
                {teacher.name}
              </h2>

              <p className="text-xs text-indigo-100 font-medium mt-0.5">
                {teacher.department || 'Faculty Member'}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Details Body */}
        <div className="overflow-y-auto p-4 space-y-3 text-xs flex-1">
          
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

          {/* CNIC and Identity Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              National Identity & Verification
            </h3>

            <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">CNIC Number</span>
              <span className="font-mono font-bold text-slate-800 text-xs">{teacher.cnic}</span>
            </div>
          </div>

          {/* Contact Details Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
              <User className="w-3.5 h-3.5" />
              Contact Information
            </h3>

            <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">Contact Number</span>
              <a
                href={`tel:${teacher.contactNumber}`}
                className="font-mono font-bold text-indigo-600 flex items-center gap-1 hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                {teacher.contactNumber}
              </a>
            </div>

            {teacher.address && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-slate-700 font-medium">{teacher.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer with DELETE BUTTON AT THE BOTTOM */}
        <div className="p-3.5 border-t border-slate-200 bg-white flex items-center gap-2">
          {/* DELETE BUTTON AT BOTTOM */}
          <button
            type="button"
            onClick={handleDelete}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-active ${
              confirmDelete
                ? 'bg-rose-700 text-white animate-pulse ring-2 ring-rose-300'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{confirmDelete ? 'Confirm Delete Teacher?' : 'Delete Teacher'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors tap-active"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}
