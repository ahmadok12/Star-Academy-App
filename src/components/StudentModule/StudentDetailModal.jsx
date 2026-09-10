import React, { useState } from 'react';
import { X, Phone, Mail, MapPin, ShieldCheck, BookOpen, User, Hash, Edit3, Trash2, AlertTriangle, UserX, CheckSquare, Square, MessageSquare, Coins, CreditCard, Download, MessageCircle } from 'lucide-react';
import { exportStudentProfilePDF, shareStudentProfileWhatsApp } from '../../utils/exportShareUtils';

export default function StudentDetailModal({
  student,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleLeftStatus,
  onShowIdCard
}) {
  if (!isOpen || !student) return null;

  const [confirmDelete, setConfirmDelete] = useState(false);
  const isLeft = Boolean(student.isLeft || student.isActive === false);

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete(student.id);
      setConfirmDelete(false);
      onClose();
    } else {
      setConfirmDelete(true);
    }
  };

  const handleCheckboxToggle = () => {
    onToggleLeftStatus(student.id, !isLeft);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Edit Button at the TOP */}
        <div className="relative bg-gradient-to-br from-indigo-700 via-indigo-600 to-brand-800 text-white p-5 pt-4">
          
          {/* Top Action Bar with EDIT button at top and Close button */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
              Student Profile Details
            </span>

            <div className="flex items-center gap-2">
              {/* EDIT BUTTON AT TOP */}
              <button
                onClick={() => onEdit(student)}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all tap-active"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Student</span>
              </button>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            {/* Student Image Thumbnail - Fixed concise sizing */}
            <div className="w-16 h-16 min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-2xl border-2 border-white/50 overflow-hidden shadow-lg bg-white/10 shrink-0">
              <img
                src={student.pic}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-amber-400 text-indigo-950 px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide font-mono">
                  <Hash className="w-3 h-3" />
                  {student.id}
                </span>

                {isLeft ? (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <UserX className="w-3 h-3" />
                    Left Academy (Inactive)
                  </span>
                ) : (
                  <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active Student
                  </span>
                )}
              </div>

              <h2 className="text-base font-extrabold text-white leading-tight mt-1 truncate">
                {student.firstName} {student.lastName}
              </h2>

              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                  {student.studentClass}
                </span>
                <span className="bg-emerald-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {student.subject}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Details Body */}
        <div className="overflow-y-auto p-4 space-y-3.5 text-xs flex-1">
          
          {/* VISUALLY DIFFERENT CHECKBOX: Mark Student as Left Academy */}
          <div
            onClick={handleCheckboxToggle}
            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer select-none tap-active flex items-start gap-3 shadow-xs ${
              isLeft
                ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-200'
                : 'bg-amber-50/70 border-amber-300 hover:border-amber-400 text-amber-950'
            }`}
          >
            <div className="pt-0.5 shrink-0">
              {isLeft ? (
                <CheckSquare className="w-5 h-5 text-rose-600 stroke-[2.5]" />
              ) : (
                <Square className="w-5 h-5 text-amber-600 stroke-[2]" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs tracking-tight">
                  Mark Student as Left Academy
                </span>
                {isLeft && (
                  <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                    INACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] mt-0.5 leading-snug opacity-90">
                {isLeft
                  ? 'This student has left the academy and is now inactive. They will NOT appear in attendance marking sheets or academic operations.'
                  : 'Click this checkbox if the student has left or withdrawn from Star Academy to make them inactive.'}
              </p>
            </div>
          </div>

          {/* Basic Student Contact Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
              <User className="w-3.5 h-3.5" />
              Student Contact Information
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Gender</span>
                <span className="font-semibold text-slate-700">{student.gender}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Contact Number</span>
                <a href={`tel:${student.contactNumber}`} className="font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3" />
                  {student.contactNumber}
                </a>
              </div>
            </div>

            {student.whatsappNumber && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 p-2.5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <div>
                    <span className="text-[10px] text-emerald-700 block font-bold">WhatsApp Number</span>
                    <span className="font-mono font-semibold text-slate-800 text-xs">{student.whatsappNumber}</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${student.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-xs transition-colors"
                >
                  Chat
                </a>
              </div>
            )}

            {student.email && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-700 font-medium">{student.email}</span>
              </div>
            )}

            {student.address && (
              <div className="bg-white p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span className="text-slate-700 font-medium">{student.address}</span>
              </div>
            )}
          </div>

          {/* Guardian Information */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
              <ShieldCheck className="w-3.5 h-3.5" />
              Father / Guardian Details
            </h3>

            <div className="bg-white p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-medium">Guardian Name</span>
              <span className="font-bold text-slate-800 text-xs">{student.fatherName}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Guardian Contact</span>
                <a href={`tel:${student.fatherContact}`} className="font-semibold text-indigo-600 flex items-center gap-1 hover:underline">
                  <Phone className="w-3 h-3" />
                  {student.fatherContact}
                </a>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Guardian CNIC</span>
                <span className="font-mono font-bold text-slate-700">{student.fatherCnic}</span>
              </div>
            </div>
          </div>

          {/* Fees & Date of Joining */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-indigo-600">
              <Coins className="w-3.5 h-3.5" />
              Fees & Admission Details
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Monthly Fees</span>
                <span className="font-bold text-emerald-700">PKR {student.fees || '6,500'}</span>
              </div>

              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Date of Joining</span>
                <span className="font-semibold text-slate-700 font-mono text-[11px]">
                  {student.dateOfJoining || student.registeredAt || '20-Aug-2026'}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Class & Subject */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-semibold text-indigo-700 uppercase">Enrolled Class & Subject</span>
              <p className="text-xs font-bold text-slate-800 mt-0.5">
                Class {student.studentClass} • {student.subject}
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="p-3.5 border-t border-slate-200 bg-white space-y-2">
          {/* Download PDF & WhatsApp Row */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportStudentProfilePDF(student)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-300/80 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => shareStudentProfileWhatsApp(student)}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* GENERATE ID CARD BUTTON AT BOTTOM */}
            <button
              type="button"
              onClick={() => onShowIdCard(student)}
              className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all tap-active"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>ID Card</span>
            </button>

            {/* DELETE BUTTON AT BOTTOM */}
            <button
              type="button"
              onClick={handleDelete}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all tap-active ${
                confirmDelete
                  ? 'bg-rose-700 text-white animate-pulse ring-2 ring-rose-300'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{confirmDelete ? 'Confirm?' : 'Delete'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors tap-active"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
