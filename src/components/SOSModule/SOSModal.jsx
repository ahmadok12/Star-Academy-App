import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';
import { INITIAL_CURRICULUM_SUBJECTS, generateNextSchemeOfStudyId, getBatches } from '../../utils/storage';

const MONTHS = [
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
  'January',
  'February',
  'March',
  'April'
];

const ACTIVITIES = ['Study', 'Test'];

export default function SOSModal({
  isOpen,
  onClose,
  initialData = null,
  onSave,
  existingSchemes = [],
  currentSession = '2026 - 27',
  batches = []
}) {
  const isEditing = Boolean(initialData);

  const availableBatches = React.useMemo(() => {
    if (Array.isArray(batches) && batches.length > 0) return batches;
    return getBatches();
  }, [batches]);

  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');
  const [batch, setBatch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-fill subjects based on class and section
  const getSubjectsForClassSection = (cls, sec) => {
    const key = `${cls}_${sec}`;
    if (INITIAL_CURRICULUM_SUBJECTS[key]) {
      return INITIAL_CURRICULUM_SUBJECTS[key];
    }
    // generic fallback
    return ['Physics', 'Chemistry', 'Math', 'Bio', 'Computer', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'];
  };

  const currentAvailableSubjects = getSubjectsForClassSection(studentClass, section);

  // Initialize or reset form
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setStudentClass(initialData.studentClass || '');
      setSection(initialData.section || '');
      setBatch(initialData.batch || '');
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setRows(
        Array.isArray(initialData.rows) && initialData.rows.length > 0
          ? initialData.rows.map(r => ({ ...r }))
          : []
      );
    } else {
      setStudentClass('');
      setSection('');
      setBatch('');
      setTitle('');
      setDescription('');
      setRows([]);
    }
    setErrorMsg('');
  }, [isOpen, initialData]);

  function createDefaultRow(cls, sec, month = 'May', activity = 'Study', chapter = 'Chapter 1', topic = '') {
    const subjects = getSubjectsForClassSection(cls, sec);
    const today = new Date().toISOString().split('T')[0];
    return {
      id: 'row_' + Math.random().toString(36).substr(2, 9),
      month: month || 'May',
      subject: subjects[0] || 'Physics',
      activity: activity || 'Study',
      topic: topic || '',
      chapter: chapter || 'Chapter 1',
      fromDate: today,
      toDate: today
    };
  }

  const handleClassChange = (newCls) => {
    setStudentClass(newCls);
    setSection('');
  };

  const handleSectionChange = (newSec) => {
    setSection(newSec);
  };

  const handleAddRow = () => {
    const lastRow = rows[rows.length - 1];
    const newRow = {
      id: 'row_' + Math.random().toString(36).substr(2, 9),
      month: lastRow ? lastRow.month : 'May',
      subject: lastRow ? lastRow.subject : (currentAvailableSubjects[0] || 'General'),
      activity: lastRow && lastRow.activity === 'Study' ? 'Test' : 'Study',
      topic: '',
      chapter: lastRow ? lastRow.chapter : 'Chapter 1',
      fromDate: lastRow ? lastRow.toDate : new Date().toISOString().split('T')[0],
      toDate: lastRow ? lastRow.toDate : new Date().toISOString().split('T')[0]
    };
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (idx) => {
    if (rows.length <= 1) {
      setErrorMsg('At least one curriculum item row is required.');
      return;
    }
    setRows(rows.filter((_, i) => i !== idx));
  };

  const handleRowChange = (idx, field, value) => {
    setRows(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMsg('Please enter a Title for this Scheme of Study.');
      return;
    }

    if (rows.length === 0) {
      setErrorMsg('Please add at least one curriculum item row.');
      return;
    }

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.topic || !r.topic.trim()) {
        setErrorMsg(`Please enter a Topic name in row #${i + 1}.`);
        return;
      }
      if (!r.chapter || !r.chapter.trim()) {
        setErrorMsg(`Please enter Chapter in row #${i + 1}.`);
        return;
      }
      if (r.fromDate && r.toDate && r.fromDate > r.toDate) {
        setErrorMsg(`Row #${i + 1}: 'From date' cannot be later than 'To date'.`);
        return;
      }
    }

    const payload = {
      id: initialData?.id || generateNextSchemeOfStudyId(existingSchemes),
      title: cleanTitle,
      studentClass,
      section,
      batch: batch.trim(),
      academicYear: initialData?.academicYear || currentSession,
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
      description: description.trim(),
      rows
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
                <span>{isEditing ? 'Edit Scheme of Study' : 'Add Scheme of Study'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              </h2>
              <p className="text-xs text-rose-100 font-medium">
                Academic syllabus distribution, topic roadmap and test schedule
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Scheme Master Info Card */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Scheme Configuration
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-[10.5px]">
                Session {currentSession}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Class Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Class:
                </label>
                <select
                  value={studentClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>-- Select Class --</option>
                  {CLASSES.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Section / Group Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section / Group:
                </label>
                <select
                  value={section}
                  onChange={(e) => handleSectionChange(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>-- Select Section / Group --</option>
                  {(CLASS_SECTIONS[studentClass] || []).map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Batch:
                </label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none transition-all cursor-pointer"
                >
                  <option value="">-- Select Batch --</option>
                  {availableBatches.map((b) => {
                    const bName = typeof b === 'string' ? b : b.name;
                    return (
                      <option key={b.id || bName} value={bName}>
                        {bName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Scheme Title:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="e.g. 9th Science - Scheme of Study (Annual 2026 - 27)"
                className="w-full text-xs font-bold text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Description / Guidelines (Optional):
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Complete syllabus division with weekly tests and send-up revision"
                className="w-full text-xs text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          {/* Curriculum Items / Rows Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Curriculum Milestones ({rows.length} Rows)
                </h3>
                <p className="text-[10.5px] text-slate-400">
                  Define month, subject, activity (study/test), chapter, topic and timeline dates.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold flex items-center gap-1.5 transition-all tap-active"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>

            {/* Rows List */}
            <div className="space-y-3">
              {rows.map((row, idx) => (
                <div
                  key={row.id || idx}
                  className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5 relative group hover:border-rose-300 transition-all"
                >
                  {/* Row Header Indicator */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-black text-[11px]">
                        {idx + 1}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10.5px] font-extrabold ${
                        row.activity === 'Test'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}>
                        {row.activity || 'Study'}
                      </span>
                      <span className="text-xs font-extrabold text-slate-700">
                        {row.subject} • {row.month}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveRow(idx)}
                      disabled={rows.length <= 1}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                      title="Delete row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Field Selectors: Month, Subject, Activity */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {/* Month Selector */}
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                        Month:
                      </label>
                      <select
                        value={row.month}
                        onChange={(e) => handleRowChange(idx, 'month', e.target.value)}
                        className="w-full text-xs font-extrabold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none cursor-pointer"
                      >
                        {MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Subject Selector */}
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                        Subject:
                      </label>
                      <select
                        value={row.subject}
                        onChange={(e) => handleRowChange(idx, 'subject', e.target.value)}
                        className="w-full text-xs font-extrabold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none cursor-pointer"
                      >
                        {currentAvailableSubjects.map((sb) => (
                          <option key={sb} value={sb}>
                            {sb}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Activity (Study / Test) Dropdown */}
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                        Activity:
                      </label>
                      <select
                        value={row.activity}
                        onChange={(e) => handleRowChange(idx, 'activity', e.target.value)}
                        className="w-full text-xs font-extrabold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none cursor-pointer"
                      >
                        {ACTIVITIES.map((act) => (
                          <option key={act} value={act}>
                            {act}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Chapter & Topic Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {/* Chapter Field */}
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                        Chapter:
                      </label>
                      <input
                        type="text"
                        value={row.chapter}
                        onChange={(e) => handleRowChange(idx, 'chapter', e.target.value)}
                        placeholder="e.g. Chapter 1"
                        className="w-full text-xs font-bold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none"
                      />
                    </div>

                    {/* Topic Name Field */}
                    <div className="sm:col-span-2">
                      <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                        Topic Name:
                      </label>
                      <input
                        type="text"
                        value={row.topic}
                        onChange={(e) => handleRowChange(idx, 'topic', e.target.value)}
                        placeholder="e.g. Matrices & Determinants / Cramers Rule"
                        className="w-full text-xs font-semibold text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  {/* From Date & To Date */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                        From Date:
                      </label>
                      <input
                        type="date"
                        value={row.fromDate || ''}
                        onChange={(e) => handleRowChange(idx, 'fromDate', e.target.value)}
                        className="w-full text-xs font-medium text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10.5px] font-bold text-slate-500 mb-0.5">
                        To Date:
                      </label>
                      <input
                        type="date"
                        value={row.toDate || ''}
                        onChange={(e) => handleRowChange(idx, 'toDate', e.target.value)}
                        className="w-full text-xs font-medium text-slate-800 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 focus:border-rose-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Add Row Helper */}
            <button
              type="button"
              onClick={handleAddRow}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-rose-400 text-slate-500 hover:text-rose-600 bg-white/70 hover:bg-rose-50/50 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another Milestone Row</span>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Update Scheme of Study' : 'Save Scheme of Study'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}