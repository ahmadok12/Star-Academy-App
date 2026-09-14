import React, { useState } from 'react';
import { X, Calendar, Plus, Trash2, Clock, BookOpen, Coffee, ShieldCheck } from 'lucide-react';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';
import { generateNextTimetableId, getCurriculumSubjects } from '../../utils/storage';

export default function AddTimetableModal({ isOpen, onClose, onAddTimetable, timetables, teachers }) {
  const nextId = generateNextTimetableId(timetables);

  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');
  const [title, setTitle] = useState('');
  const [days, setDays] = useState('');

  // Dynamic rows of periods & breaks
  const [rows, setRows] = useState([]);

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setStudentClass('');
      setSection('');
      setTitle('');
      setDays('');
      setRows([]);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const curriculumMap = getCurriculumSubjects();
  const availableCurriculumSubjects = curriculumMap[`${studentClass}_${section}`] || [];

  const handleClassChange = (newCls) => {
    setStudentClass(newCls);
    setSection('');
  };

  const handleAddPeriod = () => {
    const newId = String(Date.now());
    setRows(prev => [
      ...prev,
      {
        id: newId,
        type: 'lecture',
        subject: '',
        fromTime: '10:45 AM',
        toTime: '11:30 AM',
        teacherName: '',
        room: 'Room 101'
      }
    ]);
  };

  const handleAddBreak = () => {
    const newId = String(Date.now());
    setRows(prev => [
      ...prev,
      {
        id: newId,
        type: 'break',
        subject: 'Zuhr Prayer & Lunch Break',
        fromTime: '12:30 PM',
        toTime: '01:15 PM',
        isBreak: true
      }
    ]);
  };

  const handleRowChange = (id, field, value) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleDeleteRow = (id) => {
    setRows(prev => prev.filter(row => row.id !== id));
  };

  const validate = () => {
    const errs = {};
    if (!studentClass) errs.studentClass = 'Select class';
    if (!section) errs.section = 'Select section';
    if (rows.length === 0) errs.rows = 'Add at least one class period';

    // Check that every lecture row has a subject name
    const missingSubject = rows.some(r => r.type === 'lecture' && !r.subject.trim());
    if (missingSubject) {
      errs.rows = 'Please enter Subject name for all lecture periods';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const defaultTitle = title.trim() || `${studentClass} ${section} Timetable`;

    onAddTimetable({
      id: nextId,
      studentClass,
      section,
      title: defaultTitle,
      days,
      periods: rows,
      createdAt: new Date().toISOString()
    });

    onClose();
  };

  const availableSections = CLASS_SECTIONS[studentClass] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#111827] p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight leading-tight font-display">Add Class Timetable</h2>
              <p className="text-[11px] text-slate-400 font-mono font-medium">Auto ID: {nextId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Class & Section Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Class <span className="text-rose-500">*</span>
              </label>
              <select
                value={studentClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-100 outline-none"
              >
                <option value="" disabled>-- Select Class --</option>
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Section <span className="text-rose-500">*</span>
              </label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-100 outline-none"
              >
                <option value="" disabled>-- Select Section --</option>
                {availableSections.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Schedule Title & Days */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Timetable Title</label>
              <input
                type="text"
                placeholder={studentClass && section ? `${studentClass} ${section} Schedule` : 'e.g. 9th Science Timetable'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-100 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Days Active</label>
              <input
                type="text"
                placeholder="e.g. Monday - Saturday"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-100 outline-none"
              />
            </div>
          </div>

          {/* Dynamic Period & Break Rows Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs block">Periods & Breaks Schedule</span>
                <span className="text-[10px] text-slate-400">Add subject lecture rows and break intervals</span>
              </div>

              {/* Action Buttons for Period and Break */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleAddPeriod}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#111827] hover:bg-black text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-white" />
                  <span>+ Period</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddBreak}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-[11px] font-bold transition-colors cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5 text-slate-600" />
                  <span>+ Break</span>
                </button>
              </div>
            </div>

            {errors.rows && <p className="text-rose-500 text-[10px]">{errors.rows}</p>}

            {/* List of Rows */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {rows.map((row, index) => {
                const isBreak = row.type === 'break';

                return (
                  <div
                    key={row.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-slate-50/60 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
                          {isBreak ? '☕ Break' : `Period ${index + 1}`}
                        </span>

                        {isBreak ? (
                          <input
                            type="text"
                            placeholder="Break Name (Recess / Lunch / Prayer)"
                            value={row.subject}
                            onChange={(e) => handleRowChange(row.id, 'subject', e.target.value)}
                            className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded-xl border border-slate-300 outline-none w-48"
                          />
                        ) : (
                          <input
                            type="text"
                            list="timetable-curriculum-subjects"
                            placeholder="Subject name (e.g. Physics, Math)"
                            value={row.subject}
                            onChange={(e) => handleRowChange(row.id, 'subject', e.target.value)}
                            className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-slate-300 focus:border-[#111827] outline-none w-48"
                          />
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete this row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* From & To Time */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-slate-400 text-[10px]">From:</span>
                        <input
                          type="text"
                          value={row.fromTime}
                          onChange={(e) => handleRowChange(row.id, 'fromTime', e.target.value)}
                          className="w-full text-xs font-semibold outline-none"
                          placeholder="08:00 AM"
                        />
                      </div>

                      <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="text-slate-400 text-[10px]">To:</span>
                        <input
                          type="text"
                          value={row.toTime}
                          onChange={(e) => handleRowChange(row.id, 'toTime', e.target.value)}
                          className="w-full text-xs font-semibold outline-none"
                          placeholder="08:45 AM"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-black text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Save Timetable
            </button>
          </div>

          <datalist id="timetable-curriculum-subjects">
            {availableCurriculumSubjects.map(sub => (
              <option key={sub} value={sub} />
            ))}
          </datalist>
        </form>
      </div>
    </div>
  );
}
