import React from 'react';
import { Phone, Eye, UserX, UserCheck, CreditCard } from 'lucide-react';

export default function StudentCard({ student, onView, onShowIdCard }) {
  // Class tag color mapping
  const getClassBadgeStyle = (cls) => {
    switch (cls) {
      case '9th':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '10th':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'FSc Part 1':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FSc Part 2':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const isInactive = student.isLeft || student.isActive === false;

  return (
    <div 
      className={`bg-white rounded-2xl p-3.5 border transition-all duration-200 shadow-xs hover:shadow-md relative overflow-hidden ${
        isInactive ? 'border-rose-200 bg-rose-50/20 opacity-80' : 'border-slate-200/90'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Compact, fixed-size thumbnail (never expands or stretches) */}
        <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs relative">
          <img
            src={student.pic}
            alt={student.firstName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
            }}
          />
          {isInactive && (
            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
              <UserX className="w-4 h-4 text-rose-400" />
            </div>
          )}
        </div>

        {/* Student Details Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">
                {student.id}
              </span>
              <span className="text-[10px] text-slate-400">•</span>
              <span className="text-[10px] font-medium text-slate-500">{student.gender}</span>
              {isInactive && (
                <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                  <UserX className="w-2.5 h-2.5" />
                  Left Academy
                </span>
              )}
            </div>

            {/* Actions: ID Card + View Button */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => onShowIdCard(student)}
                className="flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[10px] font-bold border border-amber-200 transition-all tap-active shadow-2xs"
                title="Generate Student ID Card"
              >
                <CreditCard className="w-3 h-3 text-amber-600" />
                <span>ID Card</span>
              </button>

              <button
                type="button"
                onClick={() => onView(student)}
                className="flex items-center gap-1 px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold border border-indigo-200 transition-all tap-active shadow-2xs"
              >
                <Eye className="w-3 h-3" />
                <span>View</span>
              </button>
            </div>
          </div>

          <h3 className="font-bold text-slate-900 text-sm truncate mt-0.5">
            {student.firstName} {student.lastName}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getClassBadgeStyle(student.studentClass)}`}>
              {student.studentClass}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              {student.subject}
            </span>
            {student.subjectGroup && student.subjectGroup !== student.subject && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {student.subjectGroup}
              </span>
            )}
          </div>

          {/* Guardian line */}
          <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span className="truncate">
              Guardian: <span className="font-medium text-slate-700">{student.fatherName}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-600 shrink-0">
              <Phone className="w-3 h-3 text-slate-400" />
              {student.contactNumber}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
