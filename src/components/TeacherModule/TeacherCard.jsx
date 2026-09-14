import React from 'react';
import { Phone, Eye, Coins, ShieldCheck, MapPin, Layers, Clock, UserX } from 'lucide-react';
import { formatTimeTo12Hour } from '../../utils/storage';

export default function TeacherCard({ teacher, onView }) {
  const isLeft = Boolean(teacher.isLeft || teacher.isActive === false);
  const formattedSalary = teacher.salary
    ? Number(teacher.salary).toLocaleString()
    : '60,000';

  return (
    <div className={`rounded-3xl p-4 border transition-all duration-200 relative overflow-hidden shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(17,24,39,0.08)] ${
      isLeft
        ? 'bg-rose-50/30 border-rose-200/80 opacity-90'
        : 'bg-white border-[#E5E7EB] hover:border-slate-300'
    }`}>
      <div className="flex items-center gap-3">
        {/* Fixed Thumbnail (56x56px) */}
        <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-2xl overflow-hidden bg-slate-100 border border-[#E5E7EB] shrink-0 shadow-2xs relative">
          <img
            src={teacher.pic}
            alt={teacher.name}
            className={`w-full h-full object-cover ${isLeft ? 'grayscale' : ''}`}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
            }}
          />
          {isLeft && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-[9px] font-black text-white uppercase tracking-tighter bg-rose-600 px-1.5 py-0.5 rounded-full">
                Left
              </span>
            </div>
          )}
        </div>

        {/* Teacher Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                {teacher.id}
              </span>
              {isLeft ? (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full">
                  Left Academy
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
              {teacher.department && (
                <span className="text-[10px] font-semibold text-slate-500 truncate max-w-[140px]">
                  • {teacher.department}
                </span>
              )}
            </div>

            {/* View Button */}
            <button
              type="button"
              onClick={() => onView(teacher)}
              className="flex items-center gap-1 px-3 py-1 bg-[#111827] hover:bg-[#1F2937] text-white rounded-full text-[10px] font-bold transition-all tap-active shrink-0 shadow-2xs cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>View</span>
            </button>
          </div>

          <h3 className="font-bold text-slate-900 font-headline text-sm truncate mt-0.5">
            {teacher.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Coins className="w-3 h-3 text-emerald-600" />
              PKR {formattedSalary} / mo
            </span>
            {teacher.teachingSlots && teacher.teachingSlots.length > 0 ? (
              teacher.teachingSlots.map((slot, sIdx) => (
                <span
                  key={slot.id || sIdx}
                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200"
                  title={`${slot.subject} at ${formatTimeTo12Hour(slot.time)}`}
                >
                  <Clock className="w-2.5 h-2.5 text-amber-600" />
                  {formatTimeTo12Hour(slot.time)}
                </span>
              ))
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-2.5 h-2.5 text-amber-600" />
                {formatTimeTo12Hour(teacher.arrivalTime || '07:45')}
              </span>
            )}
            {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                <Layers className="w-2.5 h-2.5 text-indigo-600" />
                {teacher.assignedClasses.length} {teacher.assignedClasses.length === 1 ? 'Class/Sec' : 'Classes/Sec'}
              </span>
            )}
          </div>

          {/* CNIC and Phone Line */}
          <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="font-mono truncate">
              CNIC: <span className="font-semibold text-slate-700">{teacher.cnic}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-600 shrink-0">
              <Phone className="w-3 h-3 text-slate-400" />
              {teacher.contactNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
