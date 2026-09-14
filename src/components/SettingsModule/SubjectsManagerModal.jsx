import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
  GraduationCap,
  AlertCircle
} from 'lucide-react';
import { INITIAL_CURRICULUM_SUBJECTS } from '../../utils/storage';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';

export default function SubjectsManagerModal({
  isOpen,
  onClose,
  curriculumSubjects,
  onSaveCurriculumSubjects
}) {
  const [selectedClass, setSelectedClass] = useState('9th');
  const [selectedSection, setSelectedSection] = useState('Science');
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  if (!isOpen) return null;

  const currentKey = `${selectedClass}_${selectedSection}`;
  const currentSubjects = curriculumSubjects[currentKey] || [];

  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    const available = CLASS_SECTIONS[cls] || [];
    if (!available.includes(selectedSection)) {
      setSelectedSection(available[0] || '');
    }
    setEditingIndex(null);
    setErrorNotice('');
  };

  const handleSectionChange = (sec) => {
    setSelectedSection(sec);
    setEditingIndex(null);
    setErrorNotice('');
  };

  const showTemporaryNotice = (msg, isError = false) => {
    if (isError) {
      setErrorNotice(msg);
      setTimeout(() => setErrorNotice(''), 3000);
    } else {
      setSuccessNotice(msg);
      setTimeout(() => setSuccessNotice(''), 2500);
    }
  };

  // Add Subject
  const handleAddSubject = (e) => {
    if (e) e.preventDefault();
    const trimmed = newSubjectInput.trim();
    if (!trimmed) {
      showTemporaryNotice('Please enter a subject name', true);
      return;
    }

    // Check duplicate case-insensitively
    const exists = currentSubjects.some(
      s => s.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showTemporaryNotice(`"${trimmed}" is already added to ${selectedClass} ${selectedSection}`, true);
      return;
    }

    const updatedList = [...currentSubjects, trimmed];
    const updatedMap = {
      ...curriculumSubjects,
      [currentKey]: updatedList
    };

    onSaveCurriculumSubjects(updatedMap);
    setNewSubjectInput('');
    showTemporaryNotice(`Added "${trimmed}" to ${selectedClass} ${selectedSection}`);
  };

  // Start Inline Edit
  const handleStartEdit = (index, currentName) => {
    setEditingIndex(index);
    setEditValue(currentName);
    setErrorNotice('');
  };

  // Save Inline Edit
  const handleSaveEdit = (index) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      showTemporaryNotice('Subject name cannot be empty', true);
      return;
    }

    // Check duplicate with other subjects in this group
    const exists = currentSubjects.some(
      (s, i) => i !== index && s.toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showTemporaryNotice(`"${trimmed}" already exists in ${selectedClass} ${selectedSection}`, true);
      return;
    }

    const updatedList = [...currentSubjects];
    updatedList[index] = trimmed;

    const updatedMap = {
      ...curriculumSubjects,
      [currentKey]: updatedList
    };

    onSaveCurriculumSubjects(updatedMap);
    setEditingIndex(null);
    setEditValue('');
    showTemporaryNotice(`Updated subject to "${trimmed}"`);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  // Delete Subject
  const handleDeleteSubject = (index, subjectName) => {
    const updatedList = currentSubjects.filter((_, i) => i !== index);
    const updatedMap = {
      ...curriculumSubjects,
      [currentKey]: updatedList
    };

    onSaveCurriculumSubjects(updatedMap);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
    showTemporaryNotice(`Deleted "${subjectName}"`);
  };

  // Reset current section to default subjects
  const handleResetSection = () => {
    const defaultList = INITIAL_CURRICULUM_SUBJECTS[currentKey] || [];
    const updatedMap = {
      ...curriculumSubjects,
      [currentKey]: [...defaultList]
    };
    onSaveCurriculumSubjects(updatedMap);
    setEditingIndex(null);
    showTemporaryNotice(`Restored default subjects for ${selectedClass} ${selectedSection}`);
  };

  // Reset all classes & sections to Star Academy master defaults
  const handleResetAll = () => {
    onSaveCurriculumSubjects({ ...INITIAL_CURRICULUM_SUBJECTS });
    setEditingIndex(null);
    showTemporaryNotice('All classes & sections restored to Star Academy master defaults');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-[#111827] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
                <span>Subjects Master</span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Curriculum & subjects per class & group
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-slate-50/50">
          {/* Notifications */}
          {errorNotice && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorNotice}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Class Selector Tabs */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-700" />
                Select Class
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Step 1</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200/80">
              {CLASSES.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => handleClassChange(cls)}
                  className={`py-1.5 text-xs font-bold rounded-full transition-all text-center cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* Section Selector Pills */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-slate-700" />
                Select Section / Group
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Step 2</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(CLASS_SECTIONS[selectedClass] || []).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleSectionChange(sec)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedSection === sec
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>{sec}</span>
                  {selectedSection === sec && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Current Selection Header & Subject Count */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111827]"></div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                {selectedClass} ({selectedSection})
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
                {currentSubjects.length} {currentSubjects.length === 1 ? 'Subject' : 'Subjects'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSection}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset this class and section to Star Academy default subjects"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Defaults</span>
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleResetAll}
                className="text-[11px] font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset ALL classes and sections to Star Academy master defaults"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            </div>
          </div>

          {/* Add Subject Input Bar */}
          <form
            onSubmit={handleAddSubject}
            className="flex items-center gap-2 bg-white p-1.5 pl-3 rounded-full border border-slate-200 shadow-xs focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-100 transition-all"
          >
            <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Plus className="w-4 h-4 text-slate-600" />
            </div>
            <input
              type="text"
              placeholder={`Add subject to ${selectedClass} ${selectedSection}...`}
              value={newSubjectInput}
              onChange={(e) => setNewSubjectInput(e.target.value)}
              className="flex-1 text-xs font-semibold text-slate-800 placeholder-slate-400 bg-transparent outline-none"
            />
            <button
              type="submit"
              disabled={!newSubjectInput.trim()}
              className="px-4 py-1.5 rounded-full bg-[#111827] hover:bg-black active:scale-98 disabled:opacity-40 disabled:hover:bg-[#111827] text-white text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <span>Add</span>
            </button>
          </form>

          {/* Subjects List */}
          <div className="space-y-2">
            {currentSubjects.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No subjects defined yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Type a subject name above to add it to {selectedClass} {selectedSection}
                </p>
              </div>
            ) : (
              currentSubjects.map((subject, index) => {
                const isEditing = editingIndex === index;

                return (
                  <div
                    key={`${subject}-${index}`}
                    className={`group bg-white rounded-2xl border transition-all duration-150 p-2.5 flex items-center justify-between gap-2 shadow-xs ${
                      isEditing
                        ? 'border-slate-400 ring-2 ring-slate-100 bg-slate-50/50'
                        : 'border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>

                      {isEditing ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(index);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="w-full text-xs font-bold text-slate-900 bg-white px-3 py-1 rounded-full border border-slate-300 outline-none focus:ring-1 focus:ring-slate-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(index)}
                            className="w-7 h-7 rounded-full bg-[#111827] hover:bg-black text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                            title="Save changes"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer border border-slate-200"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-slate-800 text-xs truncate">
                            {subject}
                          </span>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(index, subject)}
                          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
                          title="Edit subject name"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubject(index, subject)}
                          className="w-7 h-7 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors border border-slate-200 cursor-pointer"
                          title="Delete subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 font-medium">
            Changes are saved automatically to Star Academy database.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
