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
        <div className="bg-[#111827] p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Award className="w-5 h-5 text-[#FF7A59]" />
            </div>
            <div>
              <h2 className="text-base font-display font-black tracking-tight leading-tight">Define Exam / Test</h2>
              <p className="text-[11px] text-slate-400 font-medium font-mono">Auto ID: {nextId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Test Name */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Test / Exam Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Monthly Test, Send-up Exam, Board Mockups"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-slate-200 outline-none"
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 font-medium mt-1">{errors.name}</p>}
          </div>

          {/* Academic Session & Total Marks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Academic Session</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="2026-27"
                  value={formData.session}
                  onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">Standard Max Marks</label>
              <input
                type="number"
                placeholder="100"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-slate-200 outline-none"
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
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-slate-200 outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-black text-white font-bold shadow-2xs transition-colors cursor-pointer"
            >
              Save Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
