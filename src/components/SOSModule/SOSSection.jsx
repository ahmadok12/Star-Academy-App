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
import { CLASSES } from '../../constants/academicData';
import SOSModal from './SOSModal';
import SOSViewModal from './SOSViewModal';
import SOSDeleteModal from './SOSDeleteModal';

export default function SOSSection({
  schemes = [],
  onAddScheme,
  onUpdateScheme,
  onDeleteScheme,
  currentSession = '2026 - 27',
  readOnly = false
}) {
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [schemeToEdit, setSchemeToEdit] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [schemeToView, setSchemeToView] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState(null);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      if (selectedClass !== 'ALL' && s.studentClass !== selectedClass) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (s.title || '').toLowerCase();
        const cls = (s.studentClass || '').toLowerCase();
        const sec = (s.section || '').toLowerCase();
        const desc = (s.description || '').toLowerCase();
        return title.includes(q) || cls.includes(q) || sec.includes(q) || desc.includes(q);
      }
      return true;
    });
  }, [schemes, selectedClass, searchQuery]);

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
    <div className="space-y-4 pb-20 w-full min-w-0 overflow-x-hidden">
      {!readOnly && (
        <button
          type="button"
          onClick={handleOpenAdd}
          className="w-full py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all tap-active cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Scheme of Study</span>
        </button>
      )}

      {/* Official Academic Calendar Rule Callout */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50/70 p-3.5 rounded-2xl border border-amber-200/90 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-xs">
          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Star Academy Academic Calendar Schedule:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1 text-[11px]">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              9th & 10th Classes
            </span>
            <p className="text-[10.5px] text-amber-950 mt-0.5">
              New session starts in <strong className="text-amber-800">May</strong> each year.
            </p>
          </div>
          <div className="bg-white/90 p-2.5 rounded-xl border border-amber-200/60">
            <span className="font-extrabold text-slate-900 block flex items-center gap-1 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              FSc Part 1 & 2
            </span>
            <p className="text-[10.5px] text-amber-950 mt-0.5">
              New session starts in <strong className="text-amber-800">July</strong> each year.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Schemes
          </span>
          <span className="text-base font-black text-slate-900 mt-0.5 block">
            {stats.totalSchemes}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Curriculums</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
            Study Items
          </span>
          <span className="text-base font-black text-indigo-700 mt-0.5 block">
            {stats.totalStudy}
          </span>
          <span className="text-[10px] text-indigo-400 font-medium">Topic lectures</span>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
            Tests Planned
          </span>
          <span className="text-base font-black text-amber-700 mt-0.5 block">
            {stats.totalTests}
          </span>
          <span className="text-[10px] text-amber-400 font-medium">Evaluations</span>
        </div>
      </div>

      {/* Search & Class Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search schemes by title, class or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-rose-500 shadow-xs font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Class Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedClass('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
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
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
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