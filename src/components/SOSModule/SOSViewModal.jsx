import React, { useState, useMemo } from 'react';
import {
  X,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  BookmarkCheck,
  FileText,
  Download,
  MessageCircle
} from 'lucide-react';
import { exportSOSPDF, shareSOSWhatsApp } from '../../utils/exportShareUtils';

export default function SOSViewModal({
  isOpen,
  onClose,
  scheme,
  onEdit
}) {
  const [filterActivity, setFilterActivity] = useState('ALL');
  const [filterMonth, setFilterMonth] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const rows = useMemo(() => {
    return Array.isArray(scheme?.rows) ? scheme.rows : [];
  }, [scheme]);

  const stats = useMemo(() => {
    const total = rows.length;
    const studyCount = rows.filter(r => (r?.activity || '').toLowerCase() === 'study').length;
    const testCount = rows.filter(r => (r?.activity || '').toLowerCase() === 'test').length;

    const uniqueMonths = Array.from(new Set(rows.map(r => r?.month).filter(Boolean)));
    const uniqueSubjects = Array.from(new Set(rows.map(r => r?.subject).filter(Boolean)));

    return { total, studyCount, testCount, uniqueMonths, uniqueSubjects };
  }, [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (!r) return false;
      if (filterActivity !== 'ALL' && (r.activity || '').toLowerCase() !== filterActivity.toLowerCase()) {
        return false;
      }
      if (filterMonth !== 'ALL' && r.month !== filterMonth) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const topic = (r.topic || '').toLowerCase();
        const chapter = (r.chapter || '').toLowerCase();
        const subject = (r.subject || '').toLowerCase();
        return topic.includes(q) || chapter.includes(q) || subject.includes(q);
      }
      return true;
    });
  }, [rows, filterActivity, filterMonth, searchQuery]);

  if (!isOpen || !scheme) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-700 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner shrink-0">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold tracking-tight truncate text-white">
                {scheme.title || 'Scheme of Study'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-rose-100 font-medium flex-wrap">
                <span className="font-bold">{scheme.studentClass} ({scheme.section})</span>
                {scheme.batch && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10.5px] font-bold">
                      {scheme.batch}
                    </span>
                  </>
                )}
                <span>•</span>
                <span>Session {scheme.academicYear || '2026 - 27'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 text-xs">
          {/* Overview Metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total Milestones
              </span>
              <span className="text-base font-black text-slate-900 mt-0.5 block">
                {stats.total}
              </span>
              <span className="text-[10px] text-slate-400">Rows in syllabus</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 block">
                Study Topics
              </span>
              <span className="text-base font-black text-indigo-700 mt-0.5 block">
                {stats.studyCount}
              </span>
              <span className="text-[10px] text-indigo-400">Teaching units</span>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                Tests & Exams
              </span>
              <span className="text-base font-black text-amber-700 mt-0.5 block">
                {stats.testCount}
              </span>
              <span className="text-[10px] text-amber-400">Evaluations</span>
            </div>
          </div>

          {/* Description if present */}
          {scheme.description && (
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs text-slate-600">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Scheme Guidelines & Scope
              </span>
              <p className="text-xs leading-relaxed">{scheme.description}</p>
            </div>
          )}

          {/* Filter Bar */}
          <div className="space-y-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search topic, chapter, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>

              {/* Activity Filter */}
              <select
                value={filterActivity}
                onChange={(e) => setFilterActivity(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 outline-none cursor-pointer"
              >
                <option value="ALL">All Activities</option>
                <option value="Study">Study Only</option>
                <option value="Test">Tests Only</option>
              </select>

              {/* Month Filter */}
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 outline-none cursor-pointer"
              >
                <option value="ALL">All Months</option>
                {stats.uniqueMonths.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Syllabus Roadmap Rows */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Detailed Curriculum Roadmap
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Showing {filteredRows.length} of {rows.length}
              </span>
            </div>

            {filteredRows.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-slate-200 space-y-1 text-slate-400">
                <p className="text-xs font-bold">No milestone rows match your search/filter.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredRows.map((r, i) => {
                  const isTest = (r.activity || '').toLowerCase() === 'test';
                  return (
                    <div
                      key={r.id || i}
                      className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-rose-300 shadow-xs transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                                isTest
                                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                  : 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                              }`}>
                                {r.activity || 'Study'}
                              </span>
                              <span className="font-extrabold text-slate-800 text-xs">
                                {r.subject}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10.5px] font-bold">
                                {r.chapter}
                              </span>
                            </div>

                            <h4 className="text-xs font-black text-slate-900 mt-1">
                              {r.topic}
                            </h4>
                          </div>
                        </div>

                        {/* Month Badge */}
                        <div className="text-right shrink-0">
                          <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 font-extrabold text-[11px] inline-block border border-rose-100">
                            {r.month}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Dates */}
                      {(r.fromDate || r.toDate) && (
                        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100 text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>Schedule:</span>
                            <span className="font-semibold text-slate-700">
                              {r.fromDate || 'N/A'}
                            </span>
                            <span>to</span>
                            <span className="font-semibold text-slate-700">
                              {r.toDate || 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <button
              type="button"
              onClick={() => exportSOSPDF(scheme)}
              className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-300/80 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => shareSOSWhatsApp(scheme)}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}