import React, { useState, useMemo } from 'react';
import { Plus, Search, Users, X, UserCheck, UserX, ArrowLeft } from 'lucide-react';
import StudentCard from './StudentCard';
import AddStudentModal from './AddStudentModal';
import StudentDetailModal from './StudentDetailModal';
import EditStudentModal from './EditStudentModal';
import StudentIDCardModal from './StudentIDCardModal';
import { CLASSES } from '../../constants/academicData';

export default function StudentList({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onToggleLeftStatus,
  onBack
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [statusFilter, setStatusFilter] = useState('active'); // 'active' | 'all' | 'left'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [idCardStudent, setIdCardStudent] = useState(null);

  // Keep viewingStudent updated if its data changes in students array
  const currentViewingStudent = useMemo(() => {
    if (!viewingStudent) return null;
    return students.find((s) => s.id === viewingStudent.id) || null;
  }, [students, viewingStudent]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const isLeft = Boolean(student.isLeft || student.isActive === false);

      // Status filter
      if (statusFilter === 'active' && isLeft) return false;
      if (statusFilter === 'left' && !isLeft) return false;

      // Class filter
      if (selectedClass !== 'All' && student.studentClass !== selectedClass) return false;

      // Search query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matches =
          `${student.firstName} ${student.lastName}`.toLowerCase().includes(query) ||
          student.id.toLowerCase().includes(query) ||
          student.fatherName.toLowerCase().includes(query) ||
          student.contactNumber.includes(query) ||
          student.subject.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [students, searchTerm, selectedClass, statusFilter]);

  const activeCount = students.filter(s => !s.isLeft && s.isActive !== false).length;
  const leftCount = students.filter(s => s.isLeft || s.isActive === false).length;

  const handleStartEdit = (student) => {
    setViewingStudent(null);
    setEditingStudent(student);
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      {/* Top Action & Search Bar - Clean Edge-to-Edge Sticky Top-0 */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto p-4 space-y-2.5">
          {/* Header Title & Add Student Button */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all tap-active cursor-pointer shrink-0"
                  title="Back to Students Hub"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              )}
              <div className="min-w-0">
                <h2 className="text-base font-black text-slate-800 flex items-center gap-1.5 truncate">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Student Directory</span>
                </h2>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  Showing {filteredStudents.length} of {students.length} students ({activeCount} active)
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all tap-active cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>

          {/* Search Input Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by name, ID, phone, section..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter Tabs (Active vs All vs Left Academy) */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-semibold">
            <button
              onClick={() => setStatusFilter('active')}
              className={`py-1 rounded-lg text-center transition-all ${
                statusFilter === 'active'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('all')}
              className={`py-1 rounded-lg text-center transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              All ({students.length})
            </button>
            <button
              onClick={() => setStatusFilter('left')}
              className={`py-1 rounded-lg text-center transition-all ${
                statusFilter === 'left'
                  ? 'bg-white text-rose-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Left Academy ({leftCount})
            </button>
          </div>

          {/* Horizontal Class Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedClass('All')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedClass === 'All'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Classes
            </button>
            {CLASSES.map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedClass === cls
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
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
