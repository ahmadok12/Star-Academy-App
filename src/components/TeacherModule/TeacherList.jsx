import React, { useState, useMemo } from 'react';
import { Plus, Search, GraduationCap, X, Coins, Users } from 'lucide-react';
import TeacherCard from './TeacherCard';
import AddTeacherModal from './AddTeacherModal';
import TeacherDetailModal from './TeacherDetailModal';
import EditTeacherModal from './EditTeacherModal';

export default function TeacherList({
  teachers,
  onAddTeacher,
  onUpdateTeacher,
  onDeleteTeacher,
  onToggleTeacherStatus,
  onOpenTeacherAttendance
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Keep viewingTeacher updated if its record changes
  const currentViewingTeacher = useMemo(() => {
    if (!viewingTeacher) return null;
    return teachers.find((t) => t.id === viewingTeacher.id) || null;
  }, [teachers, viewingTeacher]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      if (!searchTerm.trim()) return true;
      const query = searchTerm.toLowerCase();
      const nameMatch = (teacher.name || '').toLowerCase().includes(query);
      const idMatch = (teacher.id || '').toLowerCase().includes(query);
      const cnicMatch = (teacher.cnic || '').includes(query);
      const phoneMatch = (teacher.contactNumber || '').includes(query);
      const secPhoneMatch = (teacher.secondaryContactNumber || '').includes(query);
      const deptMatch = (teacher.department || '').toLowerCase().includes(query);
      const classMatch = (teacher.assignedClasses || []).some((cls) =>
        cls.toLowerCase().includes(query)
      );

      return nameMatch || idMatch || cnicMatch || phoneMatch || secPhoneMatch || deptMatch || classMatch;
    });
  }, [teachers, searchTerm]);

  // Compute total monthly payroll
  const totalPayroll = useMemo(() => {
    return teachers.reduce((sum, t) => sum + (Number(t.salary) || 0), 0);
  }, [teachers]);

  const handleStartEdit = (teacher) => {
    setViewingTeacher(null);
    setEditingTeacher(teacher);
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Top Action & Search Bar */}
      <div className="p-4 bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-800 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              List of Teachers
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              {teachers.length} registered teachers • Monthly Payroll: PKR {totalPayroll.toLocaleString()}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#111827] hover:bg-black text-white px-4 py-2 rounded-full text-xs font-bold shadow-xs transition-all tap-active cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Teacher</span>
          </button>
        </div>

        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by teacher name, ID, CNIC, phone, subject, class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-full border border-transparent focus:border-slate-800 focus:ring-1 focus:ring-slate-800 transition-all outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Teachers Cards List */}
      <div className="p-4 space-y-2.5 flex-1">
        {filteredTeachers.length > 0 ? (
          filteredTeachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onView={(t) => setViewingTeacher(t)}
            />
          ))
        ) : (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-3">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 text-sm">No teachers found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-[220px] mx-auto">
              {searchTerm ? 'No teacher matches your search criteria.' : 'Click "Add Teacher" above to register your first teacher.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      <AddTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTeacher={onAddTeacher}
        existingTeachers={teachers}
      />

      {/* View Teacher Detail Modal (Edit at top, Delete at bottom, Left checkbox) */}
      <TeacherDetailModal
        teacher={currentViewingTeacher}
        isOpen={Boolean(currentViewingTeacher)}
        onClose={() => setViewingTeacher(null)}
        onEdit={handleStartEdit}
        onDelete={onDeleteTeacher}
        onToggleStatus={onToggleTeacherStatus}
      />

      {/* Edit Teacher Modal */}
      <EditTeacherModal
        teacher={editingTeacher}
        isOpen={Boolean(editingTeacher)}
        onClose={() => setEditingTeacher(null)}
        onUpdateTeacher={onUpdateTeacher}
      />
    </div>
  );
}
