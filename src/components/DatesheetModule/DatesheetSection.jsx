import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Award,
  Plus,
  Search,
  BookOpen,
  Clock,
  Eye,
  FileText,
  CheckCircle2,
  Share2,
  Download,
  MessageCircle
} from 'lucide-react';
import { exportDatesheetPDF, shareDatesheetWhatsApp } from '../../utils/exportShareUtils';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';
import AddTestModal from './AddTestModal';
import EditTestModal from './EditTestModal';
import TestDetailModal from './TestDetailModal';
import AddDatesheetModal from './AddDatesheetModal';
import EditDatesheetModal from './EditDatesheetModal';
import DatesheetDetailModal from './DatesheetDetailModal';

export default function DatesheetSection({
  tests,
  datesheets,
  onAddTest,
  onUpdateTest,
  onDeleteTest,
  onAddDatesheet,
  onUpdateDatesheet,
  onDeleteDatesheet,
  onNavigateMarksheets,
  readOnly = false
}) {
  const [activeTab, setActiveTab] = useState('datesheets'); // 'datesheets' or 'tests'
  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedSection, setSelectedSection] = useState('All');
  const [selectedTestFilter, setSelectedTestFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals for Tests
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [viewingTest, setViewingTest] = useState(null);
  const [editingTest, setEditingTest] = useState(null);

  // Modals for Datesheets
  const [isAddDatesheetOpen, setIsAddDatesheetOpen] = useState(false);
  const [viewingDatesheet, setViewingDatesheet] = useState(null);
  const [editingDatesheet, setEditingDatesheet] = useState(null);

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

  // Filtered Datesheets
  const filteredDatesheets = useMemo(() => {
    return datesheets.filter(d => {
      const matchClass = selectedClass === 'All' || d.studentClass === selectedClass;
      const matchSection = selectedSection === 'All' || d.section === selectedSection;
      const matchTest = selectedTestFilter === 'All' || d.testId === selectedTestFilter;
      const q = searchTerm.toLowerCase();
      const matchQuery =
        d.title?.toLowerCase().includes(q) ||
        d.testName?.toLowerCase().includes(q) ||
        d.studentClass?.toLowerCase().includes(q) ||
        d.section?.toLowerCase().includes(q) ||
        d.id?.toLowerCase().includes(q);
      return matchClass && matchSection && matchTest && matchQuery;
    });
  }, [datesheets, selectedClass, selectedSection, selectedTestFilter, searchTerm]);

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return tests.filter(t => {
      const q = searchTerm.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.session.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    });
  }, [tests, searchTerm]);

  return (
    <div className="space-y-3">
      {/* 2 Primary Tabs: Datesheets vs Tests + Open Marksheets */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 p-1 bg-slate-100 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('datesheets')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'datesheets'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Datesheets ({datesheets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'tests'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'bg-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Tests Defined ({tests.length})</span>
          </button>
        </div>

        {onNavigateMarksheets && (
          <button
            type="button"
            onClick={onNavigateMarksheets}
            className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
            title="Open Student Marksheets Module"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Marksheets</span>
          </button>
        )}
      </div>

      {/* Class Selector Filter Pills (Only visible when Datesheets tab is active) */}
      {activeTab === 'datesheets' && (
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {['All', ...CLASSES].map((cls) => {
              const isSelected = selectedClass === cls;
              return (
                <button
                  key={cls}
                  onClick={() => handleSelectClass(cls)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-200'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cls === 'All' ? 'All Classes' : cls}
                </button>
              );
            })}
          </div>

          {/* Section Selector Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 pl-1">
              Section:
            </span>
            <button
              type="button"
              onClick={() => setSelectedSection('All')}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border cursor-pointer ${
                selectedSection === 'All'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-200'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              All Sections
            </button>
            {availableSections.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSection(sec)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  selectedSection === sec
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-200'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={
              activeTab === 'datesheets'
                ? 'Search class, section, exam...'
                : 'Search test name (Mockup, Send up...)'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl border border-transparent focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all outline-none"
          />
        </div>

        {!readOnly && (
          activeTab === 'datesheets' ? (
            <button
              onClick={() => setIsAddDatesheetOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Datesheet</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddTestOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Test</span>
            </button>
          )
        )}
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'datesheets' ? (
        <div className="space-y-2.5">
          {filteredDatesheets.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No exam datesheets found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click "Add Datesheet" to publish an examination schedule.
              </p>
            </div>
          ) : (
            filteredDatesheets.map((ds) => {
              const papersCount = ds.rows?.length || 0;
              const firstDate = ds.rows?.[0]?.date || '';
              const lastDate = ds.rows?.[ds.rows.length - 1]?.date || '';

              return (
                <div
                  key={ds.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-200 transition-all space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold text-[10px] border border-amber-200">
                        {ds.testName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-100">
                        Class {ds.studentClass} ({ds.section})
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{ds.id}</span>
                  </div>

                  <div>
                    <h4 className="font-black text-xs text-slate-900 leading-snug">
                      {ds.title || `${ds.studentClass} ${ds.section} Datesheet`}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Exam span: {firstDate} to {lastDate}
                    </p>
                  </div>

                  {/* Summary row & Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-amber-800 font-semibold">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>{papersCount} Exam Papers Scheduled</span>
                    </span>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => exportDatesheetPDF(ds)}
                        title="Download Datesheet PDF"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors border border-slate-200"
                      >
                        <Download className="w-3 h-3 text-slate-600" />
                        <span>PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => shareDatesheetWhatsApp(ds)}
                        title="Share Datesheet on WhatsApp"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors border border-emerald-200"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      {/* VIEW BUTTON */}
                      <button
                        type="button"
                        onClick={() => setViewingDatesheet(ds)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold transition-colors"
                      >
                        <Eye className="w-3 h-3 text-amber-600" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* TESTS TAB */
        <div className="space-y-2.5">
          {filteredTests.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 p-6">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No test series defined</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click "Add Test" to define test series like Mockup exam 1 or Send up 2.
              </p>
            </div>
          ) : (
            filteredTests.map((t) => {
              const count = datesheets.filter(d => d.testId === t.id).length;

              return (
                <div
                  key={t.id}
                  className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-violet-200 transition-all flex items-center justify-between gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-700 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{t.name}</h4>
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px] font-semibold shrink-0">
                        {t.id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-medium">
                      {t.session} • Marks: {t.totalMarks || '100'}
                    </p>
                    <span className="text-[10px] text-violet-700 font-bold">
                      {count} class datesheet{count === 1 ? '' : 's'} assigned
                    </span>
                  </div>

                  {/* VIEW BUTTON */}
                  <button
                    onClick={() => setViewingTest(t)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-900 text-[11px] font-bold transition-colors shrink-0"
                  >
                    <Eye className="w-3 h-3 text-violet-600" />
                    <span>View</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Test Modals */}
      <AddTestModal
        isOpen={isAddTestOpen}
        onClose={() => setIsAddTestOpen(false)}
        onAddTest={onAddTest}
        tests={tests}
      />

      <EditTestModal
        isOpen={!!editingTest}
        onClose={() => setEditingTest(null)}
        onUpdateTest={onUpdateTest}
        test={editingTest}
      />

      <TestDetailModal
        isOpen={!!viewingTest}
        onClose={() => setViewingTest(null)}
        test={viewingTest}
        datesheets={datesheets}
        onEdit={readOnly ? null : (t) => setEditingTest(t)}
        onDelete={readOnly ? null : onDeleteTest}
        readOnly={readOnly}
      />

      {/* Datesheet Modals */}
      <AddDatesheetModal
        isOpen={isAddDatesheetOpen}
        onClose={() => setIsAddDatesheetOpen(false)}
        onAddDatesheet={onAddDatesheet}
        datesheets={datesheets}
        tests={tests}
      />

      <EditDatesheetModal
        isOpen={!!editingDatesheet}
        onClose={() => setEditingDatesheet(null)}
        onUpdateDatesheet={onUpdateDatesheet}
        datesheet={editingDatesheet}
        tests={tests}
      />

      <DatesheetDetailModal
        isOpen={!!viewingDatesheet}
        onClose={() => setViewingDatesheet(null)}
        datesheet={viewingDatesheet}
        onEdit={readOnly ? null : (d) => setEditingDatesheet(d)}
        onDelete={readOnly ? null : onDeleteDatesheet}
        readOnly={readOnly}
      />
    </div>
  );
}
