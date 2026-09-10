import React, { useState, useMemo } from 'react';
import { Plus, Search, Calendar, Clock, Coffee, Eye, BookOpen, Download, MessageCircle } from 'lucide-react';
import { CLASSES } from '../../constants/academicData';
import { exportTimetablePDF, shareTimetableWhatsApp } from '../../utils/exportShareUtils';
import AddTimetableModal from './AddTimetableModal';
import EditTimetableModal from './EditTimetableModal';
import TimetableDetailModal from './TimetableDetailModal';

export default function TimetableSection({
  timetables,
  teachers,
  onAddTimetable,
  onUpdateTimetable,
  onDeleteTimetable,
  onNavigateDatesheets,
  readOnly = false
}) {
  const [selectedClass, setSelectedClass] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [viewingTimetable, setViewingTimetable] = useState(null);
  const [editingTimetable, setEditingTimetable] = useState(null);

  const filteredTimetables = useMemo(() => {
    return timetables.filter(tt => {
      const matchClass = selectedClass === 'All' || tt.studentClass === selectedClass;
      const matchQuery =
        tt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tt.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tt.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tt.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchClass && matchQuery;
    });
  }, [timetables, selectedClass, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 text-white shadow-lg">
        <div className="flex items-center justify-between text-xs text-teal-100 mb-1">
          <span className="font-semibold">Class Schedules</span>
          <div className="flex items-center gap-1.5">
            {onNavigateDatesheets && (
              <button
                onClick={onNavigateDatesheets}
                className="px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[10px] font-bold transition-all shadow-xs"
              >
                Exam Datesheets →
              </button>
            )}
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
              {timetables.length} Timetables
            </span>
          </div>
        </div>
        <div className="text-2xl font-black tracking-tight text-white">
          Daily Routine & Timetables
        </div>
        <p className="text-[11px] text-teal-100/90 mt-1">
          Subject lectures, laboratory sessions, and interval breaks for all classes.
        </p>
      </div>

      {/* Class Selector Filter Pills - ONLY current selection colored */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {['All', ...CLASSES].map((cls) => {
          const isSelected = selectedClass === cls;
          return (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cls}
            </button>
          );
        })}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search class or section..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all outline-none"
          />
        </div>

        {!readOnly && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Timetable</span>
          </button>
        )}
      </div>

      {/* Timetables List */}
      <div className="space-y-2.5">
        {filteredTimetables.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-600">No timetables found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Add a new class timetable.</p>
          </div>
        ) : (
          filteredTimetables.map((tt) => {
            const periodsCount = tt.periods?.filter(p => p.type === 'lecture' || !p.isBreak).length || 0;
            const breaksCount = tt.periods?.filter(p => p.type === 'break' || p.isBreak).length || 0;

            return (
              <div
                key={tt.id}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-teal-200 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-100">
                      Class {tt.studentClass}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-100">
                      Section: {tt.section}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{tt.id}</span>
                </div>

                <div>
                  <h4 className="font-black text-xs text-slate-900 leading-snug">
                    {tt.title || `${tt.studentClass} ${tt.section} Timetable`}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">{tt.days || 'Monday - Saturday'}</p>
                </div>

                {/* Badges and Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-slate-600 font-semibold">
                      <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                      <span>{periodsCount} Periods</span>
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <Coffee className="w-3.5 h-3.5 text-amber-600" />
                      <span>{breaksCount} Breaks</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => exportTimetablePDF(tt)}
                      title="Download Timetable PDF"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors border border-slate-200"
                    >
                      <Download className="w-3 h-3 text-slate-600" />
                      <span>PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => shareTimetableWhatsApp(tt)}
                      title="Share Timetable on WhatsApp"
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors border border-emerald-200"
                    >
                      <MessageCircle className="w-3 h-3 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    {/* VIEW BUTTON */}
                    <button
                      type="button"
                      onClick={() => setViewingTimetable(tt)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-[11px] font-bold transition-colors"
                    >
                      <Eye className="w-3 h-3 text-teal-600" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <AddTimetableModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddTimetable={onAddTimetable}
        timetables={timetables}
        teachers={teachers}
      />

      <EditTimetableModal
        isOpen={!!editingTimetable}
        onClose={() => setEditingTimetable(null)}
        onUpdateTimetable={onUpdateTimetable}
        timetable={editingTimetable}
      />

      <TimetableDetailModal
        isOpen={!!viewingTimetable}
        onClose={() => setViewingTimetable(null)}
        timetable={viewingTimetable}
        onEdit={readOnly ? null : (tt) => setEditingTimetable(tt)}
        onDelete={readOnly ? null : onDeleteTimetable}
        readOnly={readOnly}
      />
    </div>
  );
}
