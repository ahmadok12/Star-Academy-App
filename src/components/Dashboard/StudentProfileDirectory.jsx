import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  GraduationCap,
  Eye,
  User,
  Phone,
  Calendar,
  DollarSign,
  UserX,
  Sparkles,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Download,
  Printer,
  MessageCircle
} from 'lucide-react';
import {
  exportStudentProfilePDF,
  printStudentProfile,
  shareStudentProfileWhatsApp
} from '../../utils/exportShareUtils';
import { CLASS_SECTIONS } from '../../constants/academicData';

export default function StudentProfileDirectory({
  students = [],
  onBack,
  onSelectStudent
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  const classes = ['All', '9th', '10th', 'FSc Part 1', 'FSc Part 2'];

  const allUniqueSections = useMemo(() => {
    const set = new Set();
    Object.values(CLASS_SECTIONS).forEach(arr => arr.forEach(s => set.add(s)));
    return Array.from(set);
  }, []);

  const availableSections = useMemo(() => {
    if (selectedClass === 'All') return allUniqueSections;
    return CLASS_SECTIONS[selectedClass] || [];
  }, [selectedClass, allUniqueSections]);

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    if (cls !== 'All') {
      const allowed = CLASS_SECTIONS[cls] || [];
      if (selectedSection !== 'All' && !allowed.includes(selectedSection)) {
        setSelectedSection('All');
      }
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const sClass = s.studentClass || s.class || '';
      const sSection = s.section || s.subject || '';

      // Class filter
      if (selectedClass !== 'All' && sClass !== selectedClass) {
        return false;
      }

      // Section filter
      if (selectedSection !== 'All') {
        if (sSection !== selectedSection) {
          return false;
        }
      }

      // Search term filter
      if (!searchTerm.trim()) return true;

      const term = searchTerm.toLowerCase().trim();
      const fullName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
      const id = (s.id || '').toLowerCase();
      const fatherName = (s.fatherName || '').toLowerCase();
      const phone = (s.contactNumber || s.whatsappNumber || s.phone || '').toLowerCase();
      const rollNo = (s.rollNo || s.id || '').toLowerCase();
      const cnic = (s.cnic || s.fatherCnic || '').toLowerCase();
      const clsLower = sClass.toLowerCase();
      const secLower = sSection.toLowerCase();

      return (
        fullName.includes(term) ||
        id.includes(term) ||
        fatherName.includes(term) ||
        phone.includes(term) ||
        rollNo.includes(term) ||
        cnic.includes(term) ||
        clsLower.includes(term) ||
        secLower.includes(term)
      );
    });
  }, [students, searchTerm, selectedClass, selectedSection]);

  const getClassBadgeStyle = (cls) => {
    switch (cls) {
      case '9th':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case '10th':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'FSc Part 1':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FSc Part 2':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto pb-12">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-xs font-semibold text-slate-700 hover:bg-[#F3F4F6] transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>
        <span className="text-[11px] font-semibold text-[#575E70]">
          Total Enrolled: {students.length}
        </span>
      </div>

      {/* Collapsible Search & Filter Bar Toggle */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => setIsFiltersExpanded(prev => !prev)}
            className="flex-1 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F8F9FB] border border-[#E5E7EB] text-slate-700 text-xs font-semibold transition-all cursor-pointer select-none shadow-[0_4px_20px_-2px_rgba(17,24,39,0.04)]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Filter className="w-3.5 h-3.5 text-[#111827] shrink-0" />
              <span className="font-bold text-slate-900">Search & Filters</span>
              <span className="text-[10px] bg-[#F3F4F6] border border-[#E5E7EB] px-2.5 py-0.5 rounded-full font-bold text-[#575E70] truncate">
                Class: {selectedClass}{searchTerm ? ` • "${searchTerm}"` : ''}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400 shrink-0 ml-2">
              <span className="text-[11px] font-medium text-slate-500">
                {isFiltersExpanded ? 'Collapse' : 'Expand'}
              </span>
              {isFiltersExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {(searchTerm || selectedClass !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedClass('All');
              }}
              className="px-3 py-2 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-[11px] font-bold transition-all cursor-pointer shrink-0 border border-rose-100"
              title="Reset all filters"
            >
              Reset
            </button>
          )}
        </div>

        {/* Expandable Content */}
        {isFiltersExpanded && (
          <div className="bg-white rounded-3xl p-4 border border-[#E5E7EB] shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] space-y-3 animate-in fade-in duration-150">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, ID, father's name, phone, CNIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-[#F8F9FB] border border-[#E5E7EB] rounded-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#111827] focus:bg-white transition-all"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Class Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-semibold text-[#575E70] shrink-0 flex items-center gap-1 pl-1 pr-1">
                <Filter className="w-3 h-3 text-[#111827]" />
                Class:
              </span>
              {classes.map((cls) => (
                <button
                  key={cls}
                  onClick={() => handleSelectClass(cls)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedClass === cls
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-[#F3F4F6] text-[#575E70] hover:bg-[#edeef0]'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            {/* Section Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-[#E5E7EB]">
              <span className="text-[11px] font-semibold text-[#575E70] shrink-0 flex items-center gap-1 pl-1 pr-1">
                Section:
              </span>
              <button
                type="button"
                onClick={() => setSelectedSection('All')}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  selectedSection === 'All'
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'bg-[#F3F4F6] text-[#575E70] hover:bg-[#edeef0]'
                }`}
              >
                All Sections
              </button>
              {availableSections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSelectedSection(sec)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedSection === sec
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-[#F3F4F6] text-[#575E70] hover:bg-[#edeef0]'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-slate-700 font-display">
          Showing {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'}
        </h3>
        {selectedClass !== 'All' && (
          <span className="text-[11px] font-semibold text-[#111827] bg-slate-100 px-3 py-0.5 rounded-full border border-[#E5E7EB]">
            Filtered by: {selectedClass}
          </span>
        )}
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200 space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-700">No students found</p>
          <p className="text-[11px] text-slate-400">
            Try adjusting your search keywords or class filter.
          </p>
          {(searchTerm || selectedClass !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedClass('All');
              }}
              className="mt-2 text-xs font-semibold text-indigo-600 hover:underline inline-block"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredStudents.map((student) => {
            const isInactive = student.isLeft || student.isActive === false;
            return (
              <div
                key={student.id}
                className={`bg-white rounded-3xl p-4 border transition-all duration-200 shadow-[0_4px_24px_-2px_rgba(17,24,39,0.04)] hover:shadow-md flex flex-col justify-between ${
                  isInactive
                    ? 'border-rose-200 bg-rose-50/20 opacity-85'
                    : 'border-[#E5E7EB] hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Photo / Avatar */}
                  <div className="w-14 h-14 min-w-[56px] min-h-[56px] max-w-[56px] max-h-[56px] rounded-2xl overflow-hidden bg-slate-100 border border-[#E5E7EB] shrink-0 shadow-2xs relative">
                    <img
                      src={student.pic}
                      alt={student.firstName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256';
                      }}
                    />
                    {isInactive && (
                      <div className="absolute inset-0 bg-[#111827]/70 flex items-center justify-center">
                        <UserX className="w-4 h-4 text-rose-400" />
                      </div>
                    )}
                  </div>

                  {/* Student Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold text-[#111827] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded-full">
                        {student.id}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getClassBadgeStyle(
                          student.studentClass || student.class
                        )}`}
                      >
                        {student.studentClass || student.class || 'N/A'} - {student.section || student.subject || 'All'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#111827] truncate font-display">
                      {student.firstName} {student.lastName}
                    </h4>

                    <div className="text-[11px] text-[#575E70] truncate">
                      <span className="font-medium text-slate-400">S/D/O:</span> {student.fatherName || 'N/A'}
                    </div>

                    <div className="flex items-center gap-2.5 text-[10px] text-[#575E70] pt-0.5 flex-wrap">
                      {(student.contactNumber || student.whatsappNumber || student.phone) && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-slate-400" />
                          <span>{student.contactNumber || student.whatsappNumber || student.phone}</span>
                        </div>
                      )}
                      {(student.dateOfJoining || student.registeredAt || student.dateOfAdmission) && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-2.5 h-2.5 text-slate-400" />
                          <span>Joined: {student.dateOfJoining || student.registeredAt || student.dateOfAdmission}</span>
                        </div>
                      )}
                      {(student.fees || student.monthlyFee) && (
                        <div className="flex items-center gap-0.5 font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <DollarSign className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Rs. {Number(student.fees || student.monthlyFee).toLocaleString()}/mo</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer / Actions */}
                <div className="mt-3.5 pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] text-[#575E70]">
                    Session: <strong className="text-[#111827]">{student.session || '2026 - 27'}</strong>
                  </span>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => printStudentProfile(student)}
                      title="Print Preview Student Profile"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#F3F4F6] text-slate-700 text-xs font-semibold border border-[#E5E7EB] transition-all cursor-pointer shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-600" />
                      <span>Print</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => exportStudentProfilePDF(student)}
                      title="Download Student Profile PDF"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white hover:bg-[#F3F4F6] text-slate-700 text-xs font-semibold border border-[#E5E7EB] transition-all cursor-pointer shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => shareStudentProfileWhatsApp(student)}
                      title="Share Student Profile on WhatsApp"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-all cursor-pointer shadow-2xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectStudent(student)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#111827] hover:bg-[#1F2937] active:bg-black text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
