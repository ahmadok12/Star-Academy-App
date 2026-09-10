import React, { useState, useEffect } from 'react';
import { X, Calendar, Plus, Trash2, Clock, Award } from 'lucide-react';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';

export default function EditDatesheetModal({
  isOpen,
  onClose,
  onUpdateDatesheet,
  datesheet,
  tests
}) {
  const [testId, setTestId] = useState('');
  const [studentClass, setStudentClass] = useState('9th');
  const [section, setSection] = useState('Science');
  const [title, setTitle] = useState('');
  const [instructions, setInstructions] = useState('');
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (datesheet) {
      setTestId(datesheet.testId || tests[0]?.id || '');
      setStudentClass(datesheet.studentClass || '9th');
      setSection(datesheet.section || 'Science');
      setTitle(datesheet.title || '');
      setInstructions(datesheet.instructions || '');
      setRows(datesheet.rows ? JSON.parse(JSON.stringify(datesheet.rows)) : []);
      setErrors({});
    }
  }, [datesheet, tests]);

  if (!isOpen || !datesheet) return null;

  const handleClassChange = (newCls) => {
    setStudentClass(newCls);
    const validSections = CLASS_SECTIONS[newCls] || [];
    setSection(validSections[0] || '');
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
    if (rows.length === 0) errs.rows = 'Add at least one paper row';

    const missingSubject = rows.some(r => !r.subject.trim());
    if (missingSubject) {
      errs.rows = 'Please enter Subject name for all papers';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedTestObj = tests.find(t => t.id === testId);
    const testName = selectedTestObj ? selectedTestObj.name : datesheet.testName;

    onUpdateDatesheet({
      ...datesheet,
      testId,
      testName,
      studentClass,
      section,
      title: title.trim() || `${studentClass} ${section} - ${testName} Datesheet`,
      instructions: instructions.trim(),
      rows
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
              <h2 className="text-base font-black tracking-tight leading-tight">Edit Exam Datesheet</h2>
              <p className="text-[11px] text-amber-100 font-mono font-medium">{datesheet.id}</p>
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
          {/* Select Test */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Select Defined Test</label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <select
                value={testId}
                onChange={(e) => setTestId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-100 outline-none"
              >
                {tests.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.session})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class & Section */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Class</label>
              <select
                value={studentClass}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-100 outline-none"
              >
                {CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-100 outline-none"
              >
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
              <label className="block font-bold text-slate-800 mb-1">Datesheet Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Exam Instructions</label>
              <input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">Exam Papers</span>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>+ Paper</span>
              </button>
            </div>

            {errors.rows && <p className="text-rose-500 text-[10px]">{errors.rows}</p>}

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {rows.map((row, index) => (
                <div
                  key={row.id}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold shrink-0">
                        Paper {index + 1}
                      </span>
                      <input
                        type="text"
                        value={row.subject}
                        onChange={(e) => handleRowChange(row.id, 'subject', e.target.value)}
                        className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 outline-none w-full"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteRow(row.id)}
                      className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) => handleRowChange(row.id, 'date', e.target.value)}
                        className="w-full text-xs font-semibold outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={row.time}
                        onChange={(e) => handleRowChange(row.id, 'time', e.target.value)}
                        className="w-full text-xs font-semibold outline-none"
                      />
                    </div>
                  </div>

                  <input
                    type="text"
                    value={row.syllabus || ''}
                    onChange={(e) => handleRowChange(row.id, 'syllabus', e.target.value)}
                    placeholder="Syllabus / Topics"
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
              Update Datesheet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
