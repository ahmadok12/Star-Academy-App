import React, { useState, useMemo } from 'react';
import { Plus, Search, Users, X, UserCheck, UserX, ArrowLeft, ChevronDown, ChevronUp, SlidersHorizontal, Filter } from 'lucide-react';
import StudentCard from './StudentCard';
import AddStudentModal from './AddStudentModal';
import StudentDetailModal from './StudentDetailModal';
import EditStudentModal from './EditStudentModal';
import StudentIDCardModal from './StudentIDCardModal';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';

export default function StudentList({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onToggleLeftStatus,
  onBack,
  initialSearchTerm = ''
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'all' | 'left'
  const [isSearchOpen, setIsSearchOpen] = useState(Boolean(initialSearchTerm));
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [idCardStudent, setIdCardStudent] = useState(null);

  React.useEffect(() => {
    if (initialSearchTerm !== undefined && initialSearchTerm !== null) {
      setSearchTerm(initialSearchTerm);
      if (initialSearchTerm.trim()) {
        setIsSearchOpen(true);
      }
    }
  }, [initialSearchTerm]);

  // Keep viewingStudent updated if its data changes in students array
  const currentViewingStudent = useMemo(() => {
    if (!viewingStudent) return null;
    return students.find((s) => s.id === viewingStudent.id) || null;
  }, [students, viewingStudent]);

  const allUniqueSections = useMemo(() => {
    const set = new Set();
    Object.values(CLASS_SECTIONS).forEach(arr => arr.forEach(s => set.add(s)));
    return Array.from(set);
  }, []);

  const [selectedSubjectGroup, setSelectedSubjectGroup] = useState('All');

  const availableSections = useMemo(() => {
    if (selectedClass === 'All') return allUniqueSections;
    return CLASS_SECTIONS[selectedClass] || [];
  }, [selectedClass, allUniqueSections]);

  const availableSubjectGroups = useMemo(() => {
    if (selectedSection !== 'Individual Subjects') return [];
    const groupSet = new Set();
    students.forEach((s) => {
      const cls = s.studentClass || s.class;
      const sec = s.section || s.subject;
      if (sec === 'Individual Subjects' && (selectedClass === 'All' || cls === selectedClass)) {
        const group = s.subjectGroup || (s.enrolledSubjects && s.enrolledSubjects.length > 0 ? s.enrolledSubjects.join(' + ') : '');
        if (group) groupSet.add(group);
      }
    });
    return Array.from(groupSet).sort();
  }, [students, selectedClass, selectedSection]);

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    setSelectedSubjectGroup('All');
    if (cls !== 'All') {
      const allowed = CLASS_SECTIONS[cls] || [];
      if (selectedSection !== 'All' && !allowed.includes(selectedSection)) {
        setSelectedSection('All');
      }
    }
  };

  const handleSelectSection = (sec) => {
    setSelectedSection(sec);
    setSelectedSubjectGroup('All');
  };

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const isLeft = Boolean(student.isLeft || student.isActive === false);

      // Status filter
      if (statusFilter === 'active' && isLeft) return false;
      if (statusFilter === 'left' && !isLeft) return false;

      // Class filter
      const cls = student.studentClass || student.class;
      if (selectedClass !== 'All' && cls !== selectedClass) {
        return false;
      }

      // Section filter
      if (selectedSection !== 'All') {
        const sec = student.section || student.subject;
        if (sec !== selectedSection) {
          return false;
        }

        // Sub-filter for Individual Subjects combinations
        if (selectedSection === 'Individual Subjects' && selectedSubjectGroup !== 'All') {
          const group = student.subjectGroup || (student.enrolledSubjects && student.enrolledSubjects.length > 0 ? student.enrolledSubjects.join(' + ') : '');
          if (group !== selectedSubjectGroup) {
            return false;
          }
        }
      }

      // Search term filter
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      const fullName = student.studentName || `${student.firstName || ''} ${student.lastName || ''}`.trim() || student.name || '';
      return (
        fullName.toLowerCase().includes(q) ||
        student.id?.toLowerCase().includes(q) ||
        student.phone?.toLowerCase().includes(q) ||
        student.contactNumber?.includes(q) ||
        student.section?.toLowerCase().includes(q) ||
        student.subject?.toLowerCase().includes(q) ||
        student.subjectGroup?.toLowerCase().includes(q) ||
        student.fatherName?.toLowerCase().includes(q)
      );
    });
  }, [students, statusFilter, selectedClass, selectedSection, selectedSubjectGroup, searchTerm]);

  const activeCount = useMemo(
    () => students.filter((s) => !s.isLeft && s.isActive !== false).length,
    [students]
  );
  const leftCount = students.length - activeCount;

  const handleStartEdit = (student) => {
    setViewingStudent(null);
    setEditingStudent(student);
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Small Compact Bar: Back, Add Student, Search, Filter buttons (No other text) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Back Button */}
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all tap-active cursor-pointer shrink-0"
                title="Back"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {/* Action Buttons: Add Student, Search, Filter */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-bold shadow-xs transition-all tap-active cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen((prev) => !prev);
                  if (!isSearchOpen) setIsFilterOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all tap-active cursor-pointer ${
                  isSearchOpen || searchTerm
                    ? 'bg-[#111827] text-white border-[#111827] shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Search Students"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
                {searchTerm && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsFilterOpen((prev) => !prev);
                  if (!isFilterOpen) setIsSearchOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all tap-active cursor-pointer ${
                  isFilterOpen || statusFilter !== 'active' || selectedClass !== 'All' || selectedSection !== 'All'
                    ? 'bg-[#111827] text-white border-[#111827] shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Filter Students"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filter</span>
                {(statusFilter !== 'active' || selectedClass !== 'All' || selectedSection !== 'All') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                )}
              </button>
            </div>
          </div>

          {/* Search Drawer */}
          {isSearchOpen && (
            <div className="mt-2 relative animate-in fade-in slide-in-from-top-1 duration-150">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name, ID, phone, section..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 focus:bg-white text-xs rounded-full border border-slate-200 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none"
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Filter Drawer */}
          {isFilterOpen && (
            <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
              {/* Status Filter Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-full text-[11px] font-semibold">
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`py-1.5 rounded-full text-center transition-all cursor-pointer ${
                    statusFilter === 'active'
                      ? 'bg-[#111827] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`py-1.5 rounded-full text-center transition-all cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-[#111827] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  All ({students.length})
                </button>
                <button
                  onClick={() => setStatusFilter('left')}
                  className={`py-1.5 rounded-full text-center transition-all cursor-pointer ${
                    statusFilter === 'left'
                      ? 'bg-[#111827] text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Left ({leftCount})
                </button>
              </div>

              {/* Class Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
                <button
                  onClick={() => handleSelectClass('All')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedClass === 'All'
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  All Classes
                </button>
                {CLASSES.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => handleSelectClass(cls)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedClass === cls
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>

              {/* Section Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs pt-1.5 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 pl-1">
                  Section:
                </span>
                <button
                  type="button"
                  onClick={() => handleSelectSection('All')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedSection === 'All'
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  All Sections
                </button>
                {availableSections.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => handleSelectSection(sec)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedSection === sec
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {sec}
                  </button>
                ))}
              </div>

              {/* Dynamic Individual Subjects Combination Filter */}
              {selectedSection === 'Individual Subjects' && (
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs pt-1.5 border-t border-slate-200 bg-slate-50 p-2 rounded-2xl">
                  <span className="text-[11px] font-bold text-slate-700 shrink-0 flex items-center gap-1 pl-1">
                    Enrolled Group:
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedSubjectGroup('All')}
                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedSubjectGroup === 'All'
                        ? 'bg-[#111827] text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    All Groups
                  </button>

                  {availableSubjectGroups.map((grp) => {
                    const count = students.filter((s) => {
                      const cls = s.studentClass || s.class;
                      const sec = s.section || s.subject;
                      const g = s.subjectGroup || (s.enrolledSubjects && s.enrolledSubjects.length > 0 ? s.enrolledSubjects.join(' + ') : '');
                      return sec === 'Individual Subjects' && (selectedClass === 'All' || cls === selectedClass) && g === grp;
                    }).length;

                    return (
                      <button
                        key={grp}
                        type="button"
                        onClick={() => setSelectedSubjectGroup(grp)}
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedSubjectGroup === grp
                            ? 'bg-[#111827] text-white shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {grp} ({count})
                      </button>
                    );
                  })}

                  {availableSubjectGroups.length === 0 && (
                    <span className="text-[11px] text-slate-400 italic pl-1">
                      No individual subject students found in this class yet.
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Student List Content */}
      <div className="max-w-6xl mx-auto w-full p-4 space-y-2.5 flex-1">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onView={(s) => setViewingStudent(s)}
              onShowIdCard={(s) => setIdCardStudent(s)}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 text-sm">No students found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
              Try adjusting your search query, class filter, or status selection.
            </p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStudent={onAddStudent}
        existingStudents={students}
      />

      {/* Student Detail Modal (With Edit at Top, Delete & ID Card at Bottom, and Left Academy Checkbox) */}
      <StudentDetailModal
        student={currentViewingStudent}
        isOpen={Boolean(currentViewingStudent)}
        onClose={() => setViewingStudent(null)}
        onEdit={handleStartEdit}
        onDelete={onDeleteStudent}
        onToggleLeftStatus={onToggleLeftStatus}
        onShowIdCard={(s) => setIdCardStudent(s)}
      />

      {/* Edit Student Modal */}
      <EditStudentModal
        student={editingStudent}
        isOpen={Boolean(editingStudent)}
        onClose={() => setEditingStudent(null)}
        onUpdateStudent={onUpdateStudent}
      />

      {/* Student ID Card Modal */}
      <StudentIDCardModal
        student={idCardStudent}
        isOpen={Boolean(idCardStudent)}
        onClose={() => setIdCardStudent(null)}
      />
    </div>
  );
}
