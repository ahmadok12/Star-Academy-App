import React, { useRef } from 'react';
import { X, Printer, GraduationCap, Sparkles, QrCode, ShieldCheck, Calendar, Phone, Hash, Award, CheckCircle2 } from 'lucide-react';

export default function StudentIDCardModal({ student, isOpen, onClose }) {
  if (!isOpen || !student) return null;

  const cardRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const joiningDateFormatted = student.dateOfJoining
    ? new Date(student.dateOfJoining).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '20-Aug-2026';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 text-slate-100 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-700/80 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">Student Identity Card</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable / Viewable ID Card Body */}
        <div className="p-4 flex flex-col items-center justify-center overflow-y-auto">
          
          {/* THE PHYSICAL ID CARD BADGE */}
          <div 
            ref={cardRef}
            className="w-full max-w-[320px] bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden border-2 border-indigo-200 relative select-none"
          >
            {/* Holographic Academy Header Banner */}
            <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-brand-900 text-white p-3.5 text-center relative overflow-hidden">
              {/* Background decorative glow */}
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-400/20 rounded-full blur-xl"></div>
              <div className="absolute -left-6 -top-6 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <GraduationCap className="w-5 h-5 text-amber-300" />
                  <h2 className="text-base font-black tracking-tight text-white uppercase">
                    Star Academy
                  </h2>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                </div>
                <div className="inline-block bg-amber-400 text-indigo-950 font-black text-[8px] tracking-widest uppercase px-2 py-0.5 rounded-full">
                  Student Identity Card • 2026-2027
                </div>
              </div>
            </div>

            {/* Photo & Identity Section */}
            <div className="p-4 pt-3 flex flex-col items-center text-center">
              
              {/* Photo Frame with Gold/Indigo border */}
              <div className="relative mb-3 shrink-0">
                <div className="w-24 h-24 min-w-[96px] min-h-[96px] max-w-[96px] max-h-[96px] rounded-2xl p-1 bg-gradient-to-tr from-amber-400 via-indigo-500 to-indigo-700 shadow-md overflow-hidden">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-100">
                    <img
                      src={student.pic}
                      alt={`${student.firstName} ${student.lastName}`}
                      className="w-full h-full object-cover block"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                  </div>
                </div>

                {/* Verified Chip */}
                <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border-2 border-white shadow-xs z-10">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Student Name */}
              <h3 className="font-black text-slate-900 text-base leading-tight mt-1">
                {student.firstName} {student.lastName}
              </h3>

              {/* Serial ID Pill */}
              <div className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono font-black text-xs px-2.5 py-0.5 rounded-full mt-1.5 shadow-xs">
                <Hash className="w-3 h-3 text-indigo-500" />
                <span>ID: {student.id}</span>
              </div>

              {/* Academic Badges */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap justify-center">
                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs">
                  Class {student.studentClass}
                </span>
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md">
                  {student.section || student.subject}
                </span>
              </div>

              {/* Details Key-Value Grid */}
              <div className="w-full mt-3 pt-2.5 border-t border-slate-100 text-[11px] space-y-1.5 text-left bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold text-[10px]">Guardian:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[150px]">{student.fatherName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold text-[10px]">Emergency Phone:</span>
                  <span className="font-mono font-bold text-slate-800 text-[10px]">{student.contactNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold text-[10px]">Date of Joining:</span>
                  <span className="font-bold text-slate-700 text-[10px]">{joiningDateFormatted}</span>
                </div>
                {student.fees && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-semibold text-[10px]">Monthly Tuition:</span>
                    <span className="font-bold text-emerald-700 text-[10px]">PKR {student.fees}</span>
                  </div>
                )}
              </div>

              {/* Barcode / QR Simulation & Official Stamp */}
              <div className="w-full mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between px-1">
                {/* Simulated Barcode */}
                <div className="text-left">
                  <div className="flex items-center gap-0.5 h-6">
                    <div className="w-1 h-full bg-slate-800"></div>
                    <div className="w-0.5 h-full bg-slate-800"></div>
                    <div className="w-1.5 h-full bg-slate-800"></div>
                    <div className="w-0.5 h-full bg-slate-800"></div>
                    <div className="w-1 h-full bg-slate-800"></div>
                    <div className="w-2 h-full bg-slate-800"></div>
                    <div className="w-0.5 h-full bg-slate-800"></div>
                    <div className="w-1 h-full bg-slate-800"></div>
                    <div className="w-1.5 h-full bg-slate-800"></div>
                    <div className="w-0.5 h-full bg-slate-800"></div>
                  </div>
                  <span className="font-mono text-[8px] text-slate-400 tracking-wider">
                    *{student.id}*
                  </span>
                </div>

                {/* Authorized Seal */}
                <div className="text-right">
                  <div className="inline-block border border-indigo-300 rounded px-1.5 py-0.5 bg-indigo-50/50">
                    <span className="block font-black text-[8px] text-indigo-900 uppercase leading-none">
                      Star Academy
                    </span>
                    <span className="block text-[7px] text-indigo-600 font-bold uppercase tracking-tight">
                      Authorized Seal
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Accent Strip */}
            <div className="bg-indigo-900 text-indigo-200 text-[8px] py-1 px-3 text-center tracking-wide font-medium flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Property of Star Academy • Non-Transferable</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors tap-active"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print ID Card</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors tap-active"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
