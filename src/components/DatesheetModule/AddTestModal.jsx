import React, { useState } from 'react';
import { X, Award, FileText, ShieldCheck, Calendar } from 'lucide-react';
import { generateNextTestDefinitionId } from '../../utils/storage';

export default function AddTestModal({ isOpen, onClose, onAddTest, tests }) {
  const nextId = generateNextTestDefinitionId(tests);

  const [formData, setFormData] = useState({
    name: '',
    session: '',
    description: '',
    totalMarks: ''
  });

  const [errors, setErrors] = useState({});

  React.useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        session: '',
        description: '',
        totalMarks: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Test name is required (e.g. Mockup exam 1, Send up 2)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onAddTest({
      id: nextId,
      name: formData.name.trim(),
      session: formData.session.trim() || 'Session 2026-27',
      description: formData.description.trim() || 'Official academy assessment series',
      totalMarks: formData.totalMarks.trim() || '100',
      createdAt: new Date().toISOString().slice(0, 10)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight leading-tight">Define Exam / Test</h2>
              <p className="text-[11px] text-violet-100 font-medium">Auto ID: {nextId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* System ID */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-violet-50/70 border border-violet-200/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-600" />
              <span className="font-bold text-slate-700 text-xs">Test Identifier:</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-violet-700 text-white font-mono font-bold text-xs tracking-wider">
              {nextId}
            </span>
          </div>

          {/* Test Name */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Test / Exam Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Mockup exam 1, Send up 2, Midterm 2026"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.name ? 'border-rose-400 bg-rose-50/50' : 'border-slate-200 focus:border-violet-500'
              } text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-violet-100 outline-none`}
            />
            {errors.name && <p className="text-rose-500 text-[10px] mt-1">{errors.name}</p>}
          </div>

          {/* Academic Session & Total Marks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Academic Session</label>
              <input
                type="text"
                placeholder="Session 2026-27"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-violet-100 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Standard Marks</label>
              <input
                type="text"
                placeholder="100"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-violet-100 outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Scope & Description</label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={3}
                placeholder="e.g. Full book board preparation mockup test series covering subjective and objective questions..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-violet-100 outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-md shadow-violet-200 transition-colors"
            >
              Save Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
