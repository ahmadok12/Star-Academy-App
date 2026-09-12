import React, { useState, useMemo } from 'react';
import {
  Award,
  Plus,
  Search,
  Calendar,
  GraduationCap,
  Users,
  Eye,
  Pencil,
  Trash2,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Filter,
  FileSpreadsheet,
  Download,
  MessageCircle
} from 'lucide-react';
import { exportMarksheetPDF, shareMarksheetWhatsApp } from '../../utils/exportShareUtils';
import AddMarksheetModal from './AddMarksheetModal';
import MarksheetDetailModal from './MarksheetDetailModal';
import EditMarksheetModal from './EditMarksheetModal';
import { CLASSES, CLASS_SECTIONS } from '../../constants/academicData';

export default function MarksheetSection({
  marksheets = [],
  tests = [],
  datesheets = [],
  students = [],
  onAddMarksheet,
  onUpdateMarksheet,
  onDeleteMarksheet,
  readOnly = false
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClass, setSelectedClass] = useState('ALL');
  const [selectedSection, setSelectedSection] = useState('ALL');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMarksheet, setSelectedMarksheet] = useState(null);
  const [editingMarksheet, setEditingMarksheet] = useState(null);

  // Filtered Marksheets
  const filteredMarksheets = useMemo(() => {
    return marksheets.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.testName && m.testName.toLowerCase().includes(q)) ||
        (m.id && m.id.toLowerCase().includes(q)) ||
        (m.studentClass && m.studentClass.toLowerCase().includes(q)) ||
        (m.section && m.section.toLowerCase().includes(q));

      const matchClass = selectedClass === 'ALL' || m.studentClass === selectedClass;
      const matchSection = selectedSection === 'ALL' || m.section === selectedSection;

      return matchQuery && matchClass && matchSection;
    });
  }, [marksheets, searchQuery, selectedClass, selectedSection]);

  // Overall Statistics
  const totalMarksheets = marksheets.length;
  const totalSubmissions = marksheets.reduce(
    (acc, m) => acc + (m.totalStudents || (m.studentScores?.length || 0)),
    0
  );
  const overallAvg =
    totalMarksheets > 0
      ? Number(
          (
            marksheets.reduce((acc, m) => acc + Number(m.classAverage || 0), 0) /
            totalMarksheets
          ).toFixed(1)
        )
      : 0;

  return (
    <div className="space-y-3 pb-20">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search marksheets by test, class, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-slate-800 placeholder-slate-400 shadow-2xs"
          />
        </div>

        {!readOnly && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Marksheet</span>
          </button>
        )}
      </div>

      {/* Class & Section Filter Bar */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
        {/* Class Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
          <button
            onClick={() => {
              setSelectedClass('ALL');
              setSelectedSection('ALL');
            }}
            className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              selectedClass === 'ALL'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Classes
          </button>
          {CLASSES.map((cls) => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setSelectedSection('ALL');
              }}
              className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
                selectedClass === cls
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Section Filter Pills (if specific class selected) */}
        {selectedClass !== 'ALL' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 border-t border-slate-100 text-[11px]">
            <span className="text-slate-400 font-bold shrink-0">Section:</span>
            <button
              onClick={() => setSelectedSection('ALL')}
              className={`px-2.5 py-0.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                selectedSection === 'ALL'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Sections
            </button>
            {(CLASS_SECTIONS[selectedClass] || []).map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-2.5 py-0.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                  selectedSection === sec
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sec}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Info Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Showing {filteredMarksheets.length} {filteredMarksheets.length === 1 ? 'marksheet' : 'marksheets'}</span>
        {overallAvg > 0 && (
          <span>Average: <strong className="text-amber-700 font-bold">{overallAvg}%</strong></span>
        )}
      </div>

      {/* Marksheets Cards List */}
      <div className="space-y-3">
        {filteredMarksheets.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">No Marksheets Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No marksheet records match your filter. Click "+ Add Marksheet" to create an exam marksheet.
              </p>
            </div>
            {!readOnly && (
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Marksheet</span>
              </button>
            )}
          </div>
        ) : (
          filteredMarksheets.map((m) => {
            const topper = [...(m.studentScores || [])].sort(
              (a, b) => (b.percentage || 0) - (a.percentage || 0)
            )[0];

            return (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition-all space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black">
                        {m.id}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {m.date}
                      </span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {m.title || m.testName}
                    </h3>
                  </div>

                  {/* Class and Section Badge */}
                  <div className="text-right shrink-0">
                    <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-extrabold inline-block">
                      {m.studentClass} ({m.section})
                    </span>
                  </div>
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Students</span>
                    <span className="font-extrabold text-slate-800 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-500" />
                      {m.totalStudents || (m.studentScores?.length || 0)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Class Average</span>
                    <span className="font-black text-indigo-600">
                      {m.classAverage || 0}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">1st Position</span>
                    {(() => {
                      const topperStudent = students?.find((s) => s.id === topper?.studentId);
                      const topperName = topperStudent
                        ? `${topperStudent.firstName} ${topperStudent.lastName}`.trim()
                        : topper?.studentName;
                      return (
                        <span className="font-bold text-emerald-700 truncate block" title={topperName}>
                          {topper ? `${topperName} (${topper.percentage}%)` : 'N/A'}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100 flex-wrap gap-2">
                  <div className="text-[11px] text-slate-500 font-medium">
                    {m.subjects?.length || 0} Subjects Evaluated
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => exportMarksheetPDF(m, students)}
                      title="Download Marksheet PDF"
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => shareMarksheetWhatsApp(m, students)}
                      title="Share Marksheet on WhatsApp"
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors border border-emerald-200 flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => setEditingMarksheet(m)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1"
                        title="Edit Marksheet"
                      >
                        <Pencil className="w-3.5 h-3.5 text-slate-500" />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setSelectedMarksheet(m)}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Results</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Marksheet Modal */}
      <AddMarksheetModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAddMarksheet={onAddMarksheet}
        tests={tests}
        datesheets={datesheets}
        students={students}
        marksheets={marksheets}
      />

      {/* View Marksheet Detail Modal */}
      <MarksheetDetailModal
        isOpen={!!selectedMarksheet}
        onClose={() => setSelectedMarksheet(null)}
        marksheet={selectedMarksheet}
        students={students}
        onEdit={readOnly ? null : (m) => setEditingMarksheet(m)}
        onDelete={readOnly ? null : (id) => {
          onDeleteMarksheet(id);
          setSelectedMarksheet(null);
        }}
        readOnly={readOnly}
      />

      {/* Edit Marksheet Modal */}
      <EditMarksheetModal
        isOpen={!!editingMarksheet}
        onClose={() => setEditingMarksheet(null)}
        marksheet={editingMarksheet}
        onUpdateMarksheet={(updated) => {
          onUpdateMarksheet(updated);
          // Also update selectedMarksheet if open
          if (selectedMarksheet?.id === updated.id) {
            setSelectedMarksheet(updated);
          }
        }}
      />
    </div>
  );
}
