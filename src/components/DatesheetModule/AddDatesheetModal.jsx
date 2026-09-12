import React, { useState } from 'react';
import { X, Calendar, Plus, Trash2, Clock, BookOpen, FileText, ShieldCheck, Award } from 'lucide-react';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';
import { generateNextDatesheetId, getCurriculumSubjects } from '../../utils/storage';
import { getDayNameFromDate } from '../../utils/exportShareUtils';

export default function AddDatesheetModal({
  isOpen,
  onClose,
  onAddDatesheet,
  datesheets,
  tests
}) {
  const nextId = generateNextDatesheetId(datesheets);

  const [testId, setTestId] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');

  const curriculumMap = getCurriculumSubjects();
  const availableCurriculumSubjects = curriculumMap[`${studentClass}_${section}`] || [];

  const [rows, setRows] = useState([]);

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setTestId('');
      setStudentClass('');
      setSection('');
      setTitle('');
      setInstructions('');
      setRows([]);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClassChange = (newCls) => {
    setStudentClass(newCls);
    setSection('');
  };

  const handleAddRow = () => {
    const newId = String(Date.now());
    setRows(prev => [
      ...prev,
      {
        id: newId,
        subject: '',
        date: new Date().toISOString().slice(0, 10),
        time: '09:00 AM - 12:00 PM',
        syllabus: ''
      }
    ]);
  };

  const handleRowChange = (id, field, value) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleDeleteRow = (id) => {
    setRows(prev => prev.filter(r => r.id !== id));
  };

  const validate = () => {
    const errs = {};
    if (!studentClass) errs.studentClass = 'Select class';
    if (!section) errs.section = 'Select section';
    if (rows.length === 0) errs.rows = 'Add at least one exam paper';

    const missingSubject = rows.some(r => !r.subject.trim());
    if (missingSubject) {
      errs.rows = 'Please enter Subject name for all exam paper rows';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedTestObj = tests.find(t => t.id === testId);
    const testName = selectedTestObj ? selectedTestObj.name : 'Exam Series';
    const defaultTitle = title.trim() || `${studentClass} ${section} - ${testName} Datesheet`;

    onAddDatesheet({
      id: nextId,
      testId,
      testName,
      studentClass,
      section,
      title: defaultTitle,
      instructions: instructions.trim(),
      rows: rows.map(r => ({
        ...r,
        day: getDayNameFromDate(r.date, r.day)
      })),
      createdAt: new Date().toISOString().slice(0, 10)
    });

    onClose();
  };

  const availableSections = CLASS_SECTIONS[studentClass] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Add Exam Datesheet</h2>
              <p className="text-[11px] text-amber-100 font-medium">Auto ID: {nextId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Select Test / Exam Series */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Select Defined Test / Exam <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-100 outline-none"
              >
                <option value="" disabled>-- Select Defined Test / Exam --</option>
                {tests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.session})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class & Section Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Class <span className="text-rose-500">*</span>
              </label>
              <select
                value={studentClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-100 outline-none"
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-100 outline-none"
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

          {/* Title & Instructions */}
          <div className="space-y-2">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Datesheet Title (Optional)</label>
              <input
                type="text"
                placeholder={studentClass && section ? `${studentClass} ${section} Exam Datesheet` : 'e.g. 9th Science Midterm Datesheet'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Instructions / Student Guidelines</label>
              <input
                type="text"
                placeholder="e.g. Reporting time 08:30 AM. Bring official roll number slip."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>
          </div>

          {/* Dynamic Exam Paper Rows */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs block">Exam Papers Schedule</span>
                <span className="text-[10px] text-slate-400">Specify Subject, Date, and Time for each exam</span>
              </div>

              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Paper</span>
              </button>
            </div>

            {errors.rows && <p className="text-rose-500 text-[10px]">{errors.rows}</p>}

            {/* List of Paper Rows */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-amber-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold shrink-0">
                        Paper {index + 1}
                      </span>
                      <input
                        type="text"
                        list="datesheet-curriculum-subjects"
                        placeholder="Subject Name (e.g. Physics, Chemistry)"
                        value={row.subject}
                        onChange={(e) => handleRowChange(row.id, 'subject', e.target.value)}
                        className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 focus:border-amber-500 outline-none w-full"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition-colors shrink-0"
                      title="Delete paper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Date & Time Row */}
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                        className="w-full text-xs font-semibold outline-none text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={row.time}
                        onChange={(e) => handleRowChange(row.id, 'time', e.target.value)}
                        placeholder="09:00 AM - 12:00 PM"
                        className="w-full text-xs font-semibold outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Syllabus / Chapters */}
                  <input
                    type="text"
                    placeholder="Syllabus / Topics covered (e.g. Chapters 1-4)"
                    value={row.syllabus}
                    onChange={(e) => handleRowChange(row.id, 'syllabus', e.target.value)}
                    className="w-full text-[11px] bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-200 transition-colors"
            >
              Save Datesheet
            </button>
          </div>

          <datalist id="datesheet-curriculum-subjects">
            {availableCurriculumSubjects.map(sub => (
              <option key={sub} value={sub} />
            ))}
          </datalist>
        </form>
      </div>
    </div>
  );
}
