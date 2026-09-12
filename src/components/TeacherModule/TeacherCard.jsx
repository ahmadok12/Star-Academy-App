import React from 'react';
import { Phone, Eye, Coins, ShieldCheck, MapPin, Layers } from 'lucide-react';

export default function TeacherCard({ teacher, onView }) {
  const formattedSalary = teacher.salary
    ? Number(teacher.salary).toLocaleString()
    : '60,000';

  return (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
      <div className="flex items-center gap-3">
        {/* Fixed Thumbnail (56x56px) */}
        <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
          <img
            src={teacher.pic}
            alt={teacher.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';
            }}
          />
        </div>

        {/* Teacher Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">
                {teacher.id}
              </span>
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
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold border border-indigo-200 transition-all tap-active shrink-0 shadow-2xs cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>View</span>
            </button>
          </div>

          <h3 className="font-bold text-slate-900 text-sm truncate mt-0.5">
            {teacher.name}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Coins className="w-3 h-3 text-emerald-600" />
              PKR {formattedSalary} / mo
            </span>
            {teacher.assignedClasses && teacher.assignedClasses.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Layers className="w-2.5 h-2.5 text-indigo-600" />
                {teacher.assignedClasses.length} {teacher.assignedClasses.length === 1 ? 'Class/Sec' : 'Classes/Sec'}
              </span>
            )}
          </div>

          {/* CNIC and Phone Line */}
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
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
