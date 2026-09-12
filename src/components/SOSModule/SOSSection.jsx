import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Sparkles,
  Layers,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  MessageCircle
} from 'lucide-react';
import { exportSOSPDF, shareSOSWhatsApp } from '../../utils/exportShareUtils';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';
import SOSModal from './SOSModal';
import SOSViewModal from './SOSViewModal';
import SOSDeleteModal from './SOSDeleteModal';

export default function SOSSection({
  schemes = [],
  onAddScheme,
  onUpdateScheme,
  onDeleteScheme,
  currentSession = '2026 - 27',
  readOnly = false,
  batches = []
}) {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [schemeToEdit, setSchemeToEdit] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [schemeToView, setSchemeToView] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState(null);

  const allUniqueSections = useMemo(() => {
    const set = new Set();
    Object.values(CLASS_SECTIONS).forEach(arr => arr.forEach(s => set.add(s)));
    return Array.from(set);
  }, []);

  const availableSections = useMemo(() => {
    if (selectedClass === 'ALL') return allUniqueSections;
    return CLASS_SECTIONS[selectedClass] || [];
  }, [selectedClass, allUniqueSections]);

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    if (cls !== 'ALL') {
      const allowed = CLASS_SECTIONS[cls] || [];
      if (selectedSection !== 'ALL' && !allowed.includes(selectedSection)) {
        setSelectedSection('ALL');
      }
    }
  };

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      if (selectedClass !== 'ALL' && s.studentClass !== selectedClass) {
        return false;
      }
      if (selectedSection !== 'ALL' && s.section !== selectedSection) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (s.title || '').toLowerCase();
        const cls = (s.studentClass || '').toLowerCase();
        const sec = (s.section || '').toLowerCase();
        const batch = (s.batch || '').toLowerCase();
        const desc = (s.description || '').toLowerCase();
        return title.includes(q) || cls.includes(q) || sec.includes(q) || batch.includes(q) || desc.includes(q);
      }
      return true;
    });
  }, [schemes, selectedClass, selectedSection, searchQuery]);

  // High-level statistics
  const stats = useMemo(() => {
    const totalSchemes = schemes.length;
    let totalMilestones = 0;
    let totalStudy = 0;
    let totalTests = 0;

    schemes.forEach((s) => {
      const rows = s.rows || [];
      totalMilestones += rows.length;
      totalStudy += rows.filter(r => (r.activity || '').toLowerCase() === 'study').length;
      totalTests += rows.filter(r => (r.activity || '').toLowerCase() === 'test').length;
    });

    return { totalSchemes, totalMilestones, totalStudy, totalTests };
  }, [schemes]);

  const handleOpenAdd = () => {
    setSchemeToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (sch) => {
    setSchemeToEdit(sch);
    setIsFormModalOpen(true);
  };

  const handleOpenView = (sch) => {
    setSchemeToView(sch);
    setIsViewModalOpen(true);
  };

  const handleOpenDelete = (sch) => {
    setSchemeToDelete(sch);
    setIsDeleteModalOpen(true);
  };

  const handleSaveScheme = (payload) => {
    if (schemeToEdit) {
      if (onUpdateScheme) onUpdateScheme(payload);
    } else {
      if (onAddScheme) onAddScheme(payload);
    }
  };

  return (
    <div className="space-y-3 pb-20 w-full min-w-0 overflow-x-hidden">
      {/* Search & Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes by title, class, batch or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-2xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!readOnly && (
          <button
            type="button"
            onClick={handleOpenAdd}
            className="py-2 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-all tap-active cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Scheme</span>
          </button>
        )}
      </div>

      {/* Class Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => handleSelectClass('ALL')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedClass === 'ALL'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Classes ({schemes.length})
        </button>
        {CLASSES.map((cls) => {
          const count = schemes.filter(s => s.studentClass === cls).length;
          return (
            <button
              key={cls}
              onClick={() => handleSelectClass(cls)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedClass === cls
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cls} ({count})
            </button>
          );
        })}
      </div>

      {/* Section Filter Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 pl-1">
          Section:
        </span>
        <button
          onClick={() => setSelectedSection('ALL')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedSection === 'ALL'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Sections
        </button>
        {availableSections.map((sec) => {
          const count = schemes.filter(s => {
            const matchClass = selectedClass === 'ALL' || s.studentClass === selectedClass;
            return matchClass && s.section === sec;
          }).length;
          return (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSection === sec
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sec} ({count})
            </button>
          );
        })}
      </div>

      {/* List of Schemes Added */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Schemes of Study Added ({filteredSchemes.length})
          </span>
          {!readOnly && (
            <button
              type="button"
              onClick={handleOpenAdd}
              className="text-xs font-extrabold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Scheme</span>
            </button>
          )}
        </div>

        {filteredSchemes.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200 shadow-xs space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800">
                No Schemes of Study Found
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Add curriculum schemes to divide and track monthly syllabus topics and test milestones for Star Academy classes.
              </p>
            </div>
            {!readOnly && (
              <button
                type="button"
                onClick={handleOpenAdd}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm inline-flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Scheme of Study</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSchemes.map((sch) => {
              const rows = sch.rows || [];
              const studyRows = rows.filter(r => (r.activity || '').toLowerCase() === 'study');
              const testRows = rows.filter(r => (r.activity || '').toLowerCase() === 'test');
              const coveredMonths = Array.from(new Set(rows.map(r => r.month).filter(Boolean)));

              return (
                <div
                  key={sch.id}
                  className="bg-white p-4 rounded-3xl border border-slate-200 hover:border-rose-300 shadow-xs hover:shadow-md transition-all space-y-3 group"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 text-rose-800 font-extrabold text-[11px]">
                          {sch.studentClass}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-extrabold text-[11px]">
                          {sch.section}
                        </span>
                        {sch.batch && (
                          <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 text-purple-800 font-extrabold text-[11px] border border-purple-200/60 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-purple-600" />
                            {sch.batch}
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-400">
                          {sch.id}
                        </span>
                      </div>

                      <h3
                        onClick={() => handleOpenView(sch)}
                        className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors cursor-pointer truncate"
                      >
                        {sch.title}
                      </h3>

                      {sch.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                          {sch.description}
                        </p>
                      )}
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold shrink-0">
                      {sch.academicYear || currentSession}
                    </span>
                  </div>

                  {/* Milestones & Months Badges */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 block font-medium">Milestones</span>
                      <span className="text-xs font-black text-slate-800">{rows.length} Rows</span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 block font-medium">Study Topics</span>
                      <span className="text-xs font-black text-indigo-700">{studyRows.length} Topics</span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 block font-medium">Tests</span>
                      <span className="text-xs font-black text-amber-700">{testRows.length} Tests</span>
                    </div>
                  </div>

                  {coveredMonths.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap text-[10.5px] text-slate-500">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-600">Months:</span>
                      {coveredMonths.map(m => (
                        <span key={m} className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 font-bold text-[10px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons: View, PDF, WhatsApp, Edit, Delete */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleOpenView(sch)}
                      className={`${readOnly ? 'flex-1' : 'flex-1'} py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-all min-w-[65px]`}
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => exportSOSPDF(sch)}
                      title="Download Scheme of Study PDF"
                      className="py-1.5 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-all border border-slate-200 shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-600" />
                      <span>PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => shareSOSWhatsApp(sch)}
                      title="Share Scheme of Study on WhatsApp"
                      className="py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1 transition-all border border-emerald-200 shadow-2xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    {!readOnly && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(sch)}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center gap-1 transition-all min-w-[65px]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenDelete(sch)}
                          className="py-1.5 px-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1 transition-all"
                          title="Delete scheme"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <SOSModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        initialData={schemeToEdit}
        onSave={handleSaveScheme}
        existingSchemes={schemes}
        currentSession={currentSession}
        batches={batches}
      />

      {/* View Modal */}
      <SOSViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        scheme={schemeToView}
        onEdit={handleOpenEdit}
      />

      {/* Delete Confirmation Modal */}
      <SOSDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        scheme={schemeToDelete}
        onConfirm={onDeleteScheme}
      />
    </div>
  );
}