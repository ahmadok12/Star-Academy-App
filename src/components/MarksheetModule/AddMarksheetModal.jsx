import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Award,
  BookOpen,
  Users,
  GraduationCap,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import {
  generateNextMarksheetId,
  calculateGrade,
  getGradeBadgeStyle,
  getCurriculumSubjects
} from '../../utils/storage';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';

export default function AddMarksheetModal({
  isOpen,
  onClose,
  onAddMarksheet,
  tests = [],
  datesheets = [],
  students = [],
  marksheets = []
}) {
  const nextId = generateNextMarksheetId(marksheets);

  const [testId, setTestId] = useState('');
  const [customTestName, setCustomTestName] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [section, setSection] = useState('');
  const [marksheetDate, setMarksheetDate] = useState(new Date().toISOString().slice(0, 10));

  // Subject total marks at top (fills for all students)
  const [subjectTotalMarks, setSubjectTotalMarks] = useState({});

  // Individual student scores: { [studentId]: { [subject]: number | '' } }
  const [studentScores, setStudentScores] = useState({});
  const [errorNotice, setErrorNotice] = useState('');

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setTestId('');
      setCustomTestName('');
      setStudentClass('');
      setSection('');
      setMarksheetDate(new Date().toISOString().slice(0, 10));
      setSubjectTotalMarks({});
      setStudentScores({});
      setErrorNotice('');
    }
  }, [isOpen]);

  // When testId changes, if it matches a datesheet, autoload class & section
  const handleTestChange = (selectedId) => {
    setTestId(selectedId);
    setErrorNotice('');
    if (selectedId === 'CUSTOM') {
      return;
    }
    // Check if there is an existing datesheet for this test
    const matchedDatesheet = datesheets.find(d => d.testId === selectedId || d.id === selectedId);
    if (matchedDatesheet) {
      setStudentClass(matchedDatesheet.studentClass);
      setSection(matchedDatesheet.section);
    }
  };

  // Get active subjects for current class & section from storage
  const activeSubjects = useMemo(() => {
    const map = getCurriculumSubjects();
    const key = `${studentClass}_${section}`;
    const list = map[key] || [];
    if (list.length > 0) return list;
    // Fallback if not configured
    return ['Physics', 'Chemistry', 'Mathematics', 'English', 'Urdu', 'Islamiyat'];
  }, [studentClass, section]);

  // When subjects change, initialize subjectTotalMarks default (100 or preserve existing)
  useEffect(() => {
    setSubjectTotalMarks(prev => {
      const updated = { ...prev };
      activeSubjects.forEach(sub => {
        if (!updated[sub]) {
          updated[sub] = sub.toLowerCase() === 'islamiyat' || sub.toLowerCase() === 'pak studies' ? 50 : 100;
        }
      });
      return updated;
    });
  }, [activeSubjects]);

  const [selectedSubjectGroup, setSelectedSubjectGroup] = useState('All');

  const availableSubjectGroups = useMemo(() => {
    if (section !== 'Individual Subjects') return [];
    const set = new Set();
    students.forEach((s) => {
      const cls = s.studentClass || s.class;
      const sec = s.section || s.subject;
      if (cls === studentClass && sec === 'Individual Subjects') {
        const grp = s.subjectGroup || (s.enrolledSubjects && s.enrolledSubjects.length > 0 ? s.enrolledSubjects.join(' + ') : '');
        if (grp) set.add(grp);
      }
    });
    return Array.from(set).sort();
  }, [students, studentClass, section]);

  // Get active enrolled students for current class & section
  const enrolledStudents = useMemo(() => {
    return students.filter(s => {
      const matchClass = s.studentClass === studentClass;
      const matchSection = (s.section === section) || (s.subject === section);
      if (!matchClass || !matchSection || s.isLeft) return false;

      if (section === 'Individual Subjects' && selectedSubjectGroup !== 'All') {
        const grp = s.subjectGroup || (s.enrolledSubjects && s.enrolledSubjects.length > 0 ? s.enrolledSubjects.join(' + ') : '');
        return grp === selectedSubjectGroup;
      }
      return true;
    });
  }, [students, studentClass, section, selectedSubjectGroup]);

  // Update total marks for a specific subject at top (applies to all students)
  const handleTopTotalMarksChange = (subject, value) => {
    const num = Math.max(1, parseInt(value, 10) || 0);
    setSubjectTotalMarks(prev => ({
      ...prev,
      [subject]: num
    }));
  };

  // Update obtained marks for a specific student and subject
  const handleStudentScoreChange = (studentId, subject, value) => {
    const max = subjectTotalMarks[subject] || 100;
    let scoreNum = value === '' ? '' : parseInt(value, 10);
    if (typeof scoreNum === 'number' && !isNaN(scoreNum)) {
      if (scoreNum < 0) scoreNum = 0;
      if (scoreNum > max) scoreNum = max;
    }

    setStudentScores(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [subject]: scoreNum
      }
    }));
  };

  // Quick action: Fill sample marks for easy demonstration
  const handleFillSampleScores = () => {
    const sample = {};
    enrolledStudents.forEach((st, idx) => {
      sample[st.id] = {};
      activeSubjects.forEach((sub, subIdx) => {
        const max = subjectTotalMarks[sub] || 100;
        // Generate high/medium passing sample
        const basePct = 0.92 - (idx * 0.07) + ((subIdx % 3) * 0.03);
        const marks = Math.round(Math.min(max, Math.max(25, max * basePct)));
        sample[st.id][sub] = marks;
      });
    });
    setStudentScores(sample);
  };

  // Quick action: Clear all student marks
  const handleClearScores = () => {
    setStudentScores({});
  };

  if (!isOpen) return null;

  // Selected test display name
  const currentTestObj = tests.find(t => t.id === testId);
  const effectiveTestName = testId === 'CUSTOM'
    ? (customTestName.trim() || 'Custom Test')
    : (currentTestObj ? currentTestObj.name : 'Terminal Exam');

  // Compute live calculations per student
  const studentResults = enrolledStudents.map(st => {
    const scores = studentScores[st.id] || {};
    let totalObtained = 0;
    let totalMax = 0;

    activeSubjects.forEach(sub => {
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
      studentId: st.id,
      studentName: `${st.firstName} ${st.lastName}`,
      fatherName: st.fatherName || '',
      whatsappNumber: st.whatsappNumber || st.contactNumber || '',
      pic: st.pic || '',
      scores,
      totalObtained,
      totalMax,
      percentage,
      grade,
      isPassed
    };
  });

  // Class aggregate summary
  const totalStudentsCount = studentResults.length;
  const overallAvg = totalStudentsCount > 0
    ? Number((studentResults.reduce((acc, r) => acc + r.percentage, 0) / totalStudentsCount).toFixed(1))
    : 0;
  const passedCount = studentResults.filter(r => r.isPassed).length;
  const failedCount = totalStudentsCount - passedCount;

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!effectiveTestName) {
      setErrorNotice('Please select or specify a test name');
      return;
    }

    if (enrolledStudents.length === 0) {
      setErrorNotice(`No active students found in ${studentClass} ${section}. Enroll students first.`);
      return;
    }

    const marksheetTitle = `${studentClass} ${section} - ${effectiveTestName} Marksheet`;

    const newMarksheet = {
      id: nextId,
      testId: testId === 'CUSTOM' ? `CUSTOM-${Date.now()}` : testId,
      testName: effectiveTestName,
      studentClass,
      section,
      title: marksheetTitle,
      date: marksheetDate,
      subjects: activeSubjects,
      subjectTotalMarks,
      studentScores: studentResults,
      classAverage: overallAvg,
      totalStudents: totalStudentsCount,
      passedCount,
      failedCount,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onAddMarksheet(newMarksheet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[94vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-[#111827] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10 shadow-inner">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-display font-extrabold tracking-tight">Create Student Marksheet</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-bold">
                  {nextId}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Record exam scores, auto-calculate percentages & grades
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

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden bg-slate-50/50">
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            {errorNotice && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorNotice}</span>
              </div>
            )}

            {/* Test Selector & Metadata Box */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  Select Test / Examination
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Step 1</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Test Selector Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Exam / Test Series <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={testId}
                    onChange={(e) => handleTestChange(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                  >
                    <option value="" disabled>-- Select Defined Test / Exam --</option>
                    {tests.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.session || 'Active'})
                      </option>
                    ))}
                    <option value="CUSTOM">+ Enter Custom Test Name...</option>
                  </select>
                </div>

                {/* Exam Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={marksheetDate}
                    onChange={(e) => setMarksheetDate(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {testId === 'CUSTOM' && (
                <div className="pt-1">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Custom Test Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mid-Term Assessment 2026"
                    value={customTestName}
                    onChange={(e) => setCustomTestName(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 bg-white p-2.5 rounded-xl border border-amber-300 focus:ring-1 focus:ring-amber-400 outline-none"
                  />
                </div>
              )}
            </div>

            {/* Class & Section Autoload Box */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  Target Class & Section
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Step 2</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Class */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Class</label>
                  <select
                    value={studentClass}
                    onChange={(e) => {
                      const newCls = e.target.value;
                      setStudentClass(newCls);
                      setSection('');
                      setStudentScores({});
                    }}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="" disabled>-- Select Class --</option>
                    {CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Section */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Section</label>
                  <select
                    value={section}
                    onChange={(e) => {
                      setSection(e.target.value);
                      setStudentScores({});
                    }}
                    className="w-full text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none"
                  >
                    <option value="" disabled>-- Select Section --</option>
                    {(CLASS_SECTIONS[studentClass] || []).map((sec) => (
                      <option key={sec} value={sec}>
                        {sec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Enrolled Group Sub-Selector for Individual Subjects */}
              {section === 'Individual Subjects' && (
                <div className="p-2 rounded-xl bg-indigo-50/80 border border-indigo-200 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-indigo-900 shrink-0">
                    Enrolled Group:
                  </span>
                  <select
                    value={selectedSubjectGroup}
                    onChange={(e) => {
                      setSelectedSubjectGroup(e.target.value);
                      setStudentScores({});
                    }}
                    className="px-3 py-1.5 bg-white rounded-lg border border-indigo-200 text-xs font-bold text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value="All">All Groups (All Students)</option>
                    {availableSubjectGroups.map((grp) => (
                      <option key={grp} value={grp}>
                        {grp}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Autoloaded Status Bar */}
              <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold text-indigo-950">
                    {enrolledStudents.length} Active Students Loaded
                  </span>
                </div>
                <div className="text-[11px] font-bold text-indigo-700">
                  {activeSubjects.length} Curriculum Subjects
                </div>
              </div>
            </div>

            {/* Top Total Marks Field per Subject (FILLS FOR ALL STUDENTS) */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    Subject Total Marks (Master Header)
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Sets maximum marks for each subject across all students automatically
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                  Master Control
                </span>
              </div>

              {/* Horizontal scroll of subject total inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
                {activeSubjects.map((sub) => (
                  <div
                    key={sub}
                    className="bg-amber-50/50 p-2 rounded-xl border border-amber-200/80 text-center"
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
                        className="w-12 text-center text-xs font-black text-amber-950 bg-white py-0.5 rounded-lg border border-amber-300 focus:border-amber-600 outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Scores Entry Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <h3 className="text-xs font-extrabold text-slate-900">
                    Student Marks Entry ({enrolledStudents.length} Students)
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleFillSampleScores}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-colors"
                  >
                    Sample Scores
                  </button>
                  <button
                    type="button"
                    onClick={handleClearScores}
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {enrolledStudents.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                  <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No students enrolled</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    No active students found in {studentClass} {section}.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentResults.map((result, index) => {
                    const gradeStyle = getGradeBadgeStyle(result.grade);

                    return (
                      <div
                        key={result.studentId}
                        className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 space-y-3 hover:border-indigo-300 transition-all"
                      >
                        {/* Student Info & Live Grade Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-black flex items-center justify-center shrink-0">
                              #{index + 1}
                            </span>
                            {result.pic ? (
                              <img
                                src={result.pic}
                                alt={result.studentName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-bold shrink-0">
                                {result.studentName.slice(0, 1)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <h4 className="text-xs font-black text-slate-900 truncate">
                                {result.studentName}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-medium">
                                ID: {result.studentId}
                              </p>
                            </div>
                          </div>

                          {/* Live Calculated Stats Pill */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="text-right">
                              <span className="text-[11px] font-black text-slate-800 block leading-tight">
                                {result.totalObtained} / {result.totalMax}
                              </span>
                              <span className="text-[10px] text-slate-500 font-bold">
                                {result.percentage}%
                              </span>
                            </div>

                            <span
                              className={`px-2.5 py-1 rounded-xl text-xs font-black border flex items-center gap-1 ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${gradeStyle.dot}`}></span>
                              <span>Grade {result.grade}</span>
                            </span>
                          </div>
                        </div>

                        {/* Subject Marks Input Grid for this Student */}
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
              )}
            </div>

            {/* Grading Scale Guide */}
            <div className="bg-indigo-50/60 p-3 rounded-2xl border border-indigo-100 space-y-1.5">
              <span className="text-[10px] font-black text-indigo-900 uppercase tracking-wider block">
                Star Academy Official Grading Scale
              </span>
              <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold">
                <span className="bg-white py-1 rounded-lg border border-emerald-200 text-emerald-800">
                  ≥90% A+
                </span>
                <span className="bg-white py-1 rounded-lg border border-green-200 text-green-800">
                  ≥80% A
                </span>
                <span className="bg-white py-1 rounded-lg border border-blue-200 text-blue-800">
                  ≥70% B+
                </span>
                <span className="bg-white py-1 rounded-lg border border-teal-200 text-teal-800">
                  ≥60% B
                </span>
                <span className="bg-white py-1 rounded-lg border border-amber-200 text-amber-800">
                  ≥50% C
                </span>
                <span className="bg-white py-1 rounded-lg border border-orange-200 text-orange-800">
                  ≥40% D
                </span>
                <span className="bg-white py-1 rounded-lg border border-rose-200 text-rose-800">
                  &lt;40% Fail
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
            <div className="text-[11px] font-bold text-slate-600 hidden sm:block">
              Class Avg: <span className="text-[#111827] font-extrabold font-display">{overallAvg}%</span> | Passed:{' '}
              <span className="text-emerald-600 font-extrabold font-display">{passedCount}</span> | Failed:{' '}
              <span className="text-rose-500 font-extrabold font-display">{failedCount}</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={enrolledStudents.length === 0}
                className="px-5 py-2 rounded-full bg-[#111827] hover:bg-black disabled:opacity-40 text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Save Marksheet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
