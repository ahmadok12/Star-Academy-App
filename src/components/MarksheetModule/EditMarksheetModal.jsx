import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Save,
  Check
} from 'lucide-react';
import { calculateGrade, getGradeBadgeStyle } from '../../utils/storage';

export default function EditMarksheetModal({
  isOpen,
  onClose,
  marksheet,
  onUpdateMarksheet
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [subjectTotalMarks, setSubjectTotalMarks] = useState({});
  const [studentScores, setStudentScores] = useState({});
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    if (marksheet && isOpen) {
      setTitle(marksheet.title || `${marksheet.studentClass} ${marksheet.section} - ${marksheet.testName} Marksheet`);
      setDate(marksheet.date || new Date().toISOString().slice(0, 10));
      setSubjectTotalMarks(marksheet.subjectTotalMarks || {});

      // Build initial student scores map
      const initialMap = {};
      (marksheet.studentScores || []).forEach((st) => {
        initialMap[st.studentId] = { ...(st.scores || {}) };
      });
      setStudentScores(initialMap);
      setErrorNotice('');
    }
  }, [marksheet, isOpen]);

  if (!isOpen || !marksheet) return null;

  const activeSubjects = marksheet.subjects || [];

  const handleTopTotalMarksChange = (subject, value) => {
    const num = Math.max(1, parseInt(value, 10) || 0);
    setSubjectTotalMarks((prev) => ({
      ...prev,
      [subject]: num
    }));
  };

  const handleStudentScoreChange = (studentId, subject, value) => {
    const max = subjectTotalMarks[subject] || 100;
    let scoreNum = value === '' ? '' : parseInt(value, 10);
    if (typeof scoreNum === 'number' && !isNaN(scoreNum)) {
      if (scoreNum < 0) scoreNum = 0;
      if (scoreNum > max) scoreNum = max;
    }

    setStudentScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subject]: scoreNum
      }
    }));
  };

  // Re-calculate results for all students
  const recalculatedStudents = (marksheet.studentScores || []).map((st) => {
    const scores = studentScores[st.studentId] || {};
    let totalObtained = 0;
    let totalMax = 0;

    activeSubjects.forEach((sub) => {
      const max = Number(subjectTotalMarks[sub]) || 100;
      totalMax += max;
      const obt = Number(scores[sub]);
      if (!isNaN(obt) && scores[sub] !== '' && scores[sub] !== undefined) {
        totalObtained += obt;
      }
    });

    const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(1)) : 0;
    const grade = calculateGrade(percentage);
    const isPassed = grade !== 'F';

    return {
      ...st,
      scores,
      totalObtained,
      totalMax,
      percentage,
      grade,
      isPassed
    };
  });

  const totalStudentsCount = recalculatedStudents.length;
  const overallAvg =
    totalStudentsCount > 0
      ? Number(
          (
            recalculatedStudents.reduce((acc, r) => acc + r.percentage, 0) /
            totalStudentsCount
          ).toFixed(1)
        )
      : 0;
  const passedCount = recalculatedStudents.filter((r) => r.isPassed).length;
  const failedCount = totalStudentsCount - passedCount;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorNotice('Marksheet title cannot be empty');
      return;
    }

    const updatedMarksheet = {
      ...marksheet,
      title: title.trim(),
      date,
      subjectTotalMarks,
      studentScores: recalculatedStudents,
      classAverage: overallAvg,
      totalStudents: totalStudentsCount,
      passedCount,
      failedCount,
      updatedAt: new Date().toISOString().slice(0, 10)
    };

    onUpdateMarksheet(updatedMarksheet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-[#111827] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-inner">
              <Award className="w-5 h-5 text-[#FF7A59]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-display font-extrabold tracking-tight">Edit Marksheet</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-bold">
                  {marksheet.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {marksheet.studentClass} ({marksheet.section}) • {marksheet.testName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden bg-slate-50/50">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {errorNotice && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* Metadata Fields */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Marksheet Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Examination Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Top Subject Total Marks (Master Header) */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-indigo-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    Subject Total Marks (Master Control)
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Modifying total marks updates maximum score for all students
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
                {activeSubjects.map((sub) => (
                  <div
                    key={sub}
                    className="bg-indigo-50/50 p-2 rounded-xl border border-indigo-100 text-center"
                  >
                    <span className="block text-[10px] font-black text-slate-700 truncate" title={sub}>
                      {sub}
                    </span>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <span className="text-[9px] font-bold text-slate-400">Max:</span>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={subjectTotalMarks[sub] || 100}
                        onChange={(e) => handleTopTotalMarksChange(sub, e.target.value)}
                        className="w-12 text-center text-xs font-black text-indigo-950 bg-white py-0.5 rounded-lg border border-indigo-300 focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Students Score Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  Student Scores ({recalculatedStudents.length})
                </h3>
              </div>

              {recalculatedStudents.map((result, index) => {
                const gradeStyle = getGradeBadgeStyle(result.grade);

                return (
                  <div
                    key={result.studentId}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 space-y-3"
                  >
                    {/* Student Info Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0">
                          #{index + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-slate-900 truncate">
                            {result.studentName}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium">
                            ID: {result.studentId}
                          </p>
                        </div>
                      </div>

                      {/* Live Calculated Stats */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block leading-tight">
                            {result.totalObtained} / {result.totalMax}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {result.percentage}%
                          </span>
                        </div>

                        <span
                          className={`px-2.5 py-1 rounded-xl text-xs font-black border flex items-center gap-1 ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${gradeStyle.dot}`}></span>
                          <span>{result.grade}</span>
                        </span>
                      </div>
                    </div>

                    {/* Subject Score Inputs */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                      {activeSubjects.map((sub) => {
                        const max = subjectTotalMarks[sub] || 100;
                        const currentScore = (studentScores[result.studentId] || {})[sub];

                        return (
                          <div
                            key={sub}
                            className="bg-slate-50 p-2 rounded-xl border border-slate-200/80 focus-within:border-indigo-500 focus-within:bg-white transition-all"
                          >
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 mb-1">
                              <span className="truncate" title={sub}>
                                {sub}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium">
                                /{max}
                              </span>
                            </div>
                            <input
                              type="number"
                              min="0"
                              max={max}
                              placeholder="0"
                              value={currentScore === undefined ? '' : currentScore}
                              onChange={(e) =>
                                handleStudentScoreChange(result.studentId, sub, e.target.value)
                              }
                              className="w-full text-xs font-black text-slate-900 bg-transparent outline-none text-center"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="text-[11px] font-bold text-slate-600">
              Class Avg: <span className="text-[#111827] font-extrabold font-display">{overallAvg}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
