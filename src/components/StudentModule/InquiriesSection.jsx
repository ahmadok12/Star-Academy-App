import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Search,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Trash2,
  Sparkles,
  BookOpen,
  Filter
} from 'lucide-react';
import { INQUIRY_STATUS } from '../../constants/academicData';
import AddInquiryModal from './AddInquiryModal';

export default function InquiriesSection({
  inquiries = [],
  onAddInquiry,
  onUpdateInquiry,
  onDeleteInquiry,
  onOpenRegisterStudent
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [noteInputs, setNoteInputs] = useState({});
  const [activeNoteBoxId, setActiveNoteBoxId] = useState(null);

  // Status counts
  const counts = useMemo(() => {
    let pending = 0;
    let didNotShowUp = 0;
    let interested = 0;
    let registered = 0;

    inquiries.forEach((i) => {
      if (i.status === INQUIRY_STATUS.PENDING) pending++;
      else if (i.status === INQUIRY_STATUS.DID_NOT_SHOW_UP) didNotShowUp++;
      else if (i.status === INQUIRY_STATUS.INTERESTED) interested++;
      else if (i.status === INQUIRY_STATUS.REGISTERED) registered++;
    });

    return {
      total: inquiries.length,
      pending,
      didNotShowUp,
      interested,
      registered
    };
  }, [inquiries]);

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
        if (statusFilter !== 'ALL' && inq.status !== statusFilter) return false;
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          inq.studentName?.toLowerCase().includes(q) ||
          inq.contactNumber?.includes(q) ||
          inq.whatsappNumber?.includes(q) ||
          inq.fatherName?.toLowerCase().includes(q) ||
          inq.studentClass?.toLowerCase().includes(q) ||
          inq.subject?.toLowerCase().includes(q) ||
          inq.id?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.inquiryDate || b.createdAt) - new Date(a.inquiryDate || a.createdAt));
  }, [inquiries, statusFilter, searchTerm]);

  // Handle WhatsApp Follow-up click
  const handleSendWhatsApp = (inquiry) => {
    const rawNum = inquiry.whatsappNumber || inquiry.contactNumber || '';
    let cleanNum = rawNum.replace(/\D/g, '');
    if (cleanNum.startsWith('0')) cleanNum = '92' + cleanNum.slice(1);

    const message =
      `*STAR ACADEMY LAHORE - STUDENT INQUIRY FOLLOW-UP*\n\n` +
      `Respected Parent / Student *${inquiry.studentName}*,\n` +
      `Thank you for visiting Star Academy regarding admission in *${inquiry.studentClass} (${inquiry.subject})*.\n\n` +
      (inquiry.status === INQUIRY_STATUS.DID_NOT_SHOW_UP
        ? `We noticed you were unable to attend the scheduled demo lecture. We would love to reschedule your visit or demo class at your convenience.\n\n`
        : `We are following up to assist you with curriculum guidance, faculty schedules, and admission confirmation.\n\n`) +
      `Please feel free to reply here or visit our campus for any questions.\n\n` +
      `Warm regards,\n` +
      `*Star Academy Admission Desk*\n` +
      `Gulberg III / Lahore`;

    const encoded = encodeURIComponent(message);
    const url = cleanNum ? `https://wa.me/${cleanNum}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Quick Status change
  const handleStatusChange = (inquiry, newStatus) => {
    const updated = {
      ...inquiry,
      status: newStatus
    };
    onUpdateInquiry(updated);
  };

  // Add follow-up log note
  const handleAddNote = (inquiry) => {
    const text = (noteInputs[inquiry.id] || '').trim();
    if (!text) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newNote = {
      date: todayStr,
      note: text,
      by: 'Staff'
    };

    const updated = {
      ...inquiry,
      followUpNotes: [...(inquiry.followUpNotes || []), newNote]
    };

    onUpdateInquiry(updated);
    setNoteInputs(prev => ({ ...prev, [inquiry.id]: '' }));
    setActiveNoteBoxId(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto w-full">
      {/* Top Banner & Metric Summary */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-5 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
              <HelpCircle className="w-6 h-6 text-amber-200" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                <span>Student Inquiries & Follow-ups</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-xs text-amber-100 font-medium">
                Track walk-in visitors, no-shows & register active students
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-extrabold shadow-md transition-all active:scale-98"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            <span>New Inquiry</span>
          </button>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/15 text-center">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2">
            <span className="text-[10px] text-amber-200 font-bold block uppercase">Total</span>
            <span className="text-base font-black text-white">{counts.total}</span>
          </div>
          <div className="bg-amber-400/20 backdrop-blur-xs rounded-xl p-2 border border-amber-300/30">
            <span className="text-[10px] text-amber-200 font-bold block uppercase">Follow-up</span>
            <span className="text-base font-black text-amber-200">{counts.pending}</span>
          </div>
          <div className="bg-rose-500/20 backdrop-blur-xs rounded-xl p-2 border border-rose-300/30">
            <span className="text-[10px] text-rose-200 font-bold block uppercase">No-Shows</span>
            <span className="text-base font-black text-rose-200">{counts.didNotShowUp}</span>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-xs rounded-xl p-2 border border-emerald-300/30">
            <span className="text-[10px] text-emerald-200 font-bold block uppercase">Registered</span>
            <span className="text-base font-black text-emerald-200">{counts.registered}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2.5">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search inquiry by student name, phone, guardian, class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-white text-xs rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none shadow-2xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'ALL', label: 'All Inquiries', count: counts.total },
            { id: INQUIRY_STATUS.PENDING, label: 'Pending Follow-up', count: counts.pending },
            { id: INQUIRY_STATUS.DID_NOT_SHOW_UP, label: 'Did Not Show Up', count: counts.didNotShowUp },
            { id: INQUIRY_STATUS.INTERESTED, label: 'Interested', count: counts.interested },
            { id: INQUIRY_STATUS.REGISTERED, label: 'Registered Students', count: counts.registered }
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inquiry Cards List */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No inquiries match your criteria</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click "New Inquiry" above to record a student visit or inquiry.
            </p>
          </div>
        ) : (
          filteredInquiries.map((inq) => {
            const isRegistered = inq.status === INQUIRY_STATUS.REGISTERED;
            const isNoShow = inq.status === INQUIRY_STATUS.DID_NOT_SHOW_UP;
            const isPending = inq.status === INQUIRY_STATUS.PENDING;

            return (
              <div
                key={inq.id}
                className={`bg-white rounded-2xl border p-4 shadow-xs transition-all space-y-3 ${
                  isRegistered
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : isNoShow
                    ? 'border-rose-200/80 bg-rose-50/15'
                    : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                {/* Header: Name, Class, Section, Status */}
                <div className="flex items-start justify-between gap-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {inq.id}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500 font-medium">{inq.gender}</span>
                    </div>

                    <h3 className="font-black text-slate-900 text-sm mt-0.5">
                      {inq.studentName}
                    </h3>

                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md font-bold text-[10px]">
                        {inq.studentClass}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold text-[10px]">
                        {inq.subject}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border outline-none cursor-pointer ${
                        isRegistered
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isNoShow
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : isPending
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      {Object.values(INQUIRY_STATUS).map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>

                    <span className="text-[10px] text-slate-400">
                      Visited: {inq.inquiryDate}
                    </span>
                  </div>
                </div>

                {/* Contact & Parent Info Row */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Student Phone</span>
                    <span className="font-mono font-bold text-slate-800">{inq.contactNumber}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Father / Guardian</span>
                    <span className="font-bold text-slate-800 truncate block">
                      {inq.fatherName || 'Not recorded'} {inq.fatherContact ? `(${inq.fatherContact})` : ''}
                    </span>
                  </div>
                </div>

                {/* Remarks / Follow-up notes */}
                {inq.remarks && (
                  <div className="text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded-xl border border-amber-100/60 leading-relaxed">
                    <strong className="text-amber-900 font-bold">Notes: </strong>
                    <span>{inq.remarks}</span>
                  </div>
                )}

                {/* Follow-up Notes History (if any) */}
                {inq.followUpNotes && inq.followUpNotes.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">
                      Follow-up History:
                    </span>
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {inq.followUpNotes.map((n, nIdx) => (
                        <div key={nIdx} className="text-[10px] bg-slate-50 p-1.5 rounded-lg border border-slate-200/70 flex items-start justify-between gap-1 text-slate-700">
                          <span>{n.note}</span>
                          <span className="text-[9px] text-slate-400 shrink-0 font-mono">{n.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Follow-up Note Box */}
                {activeNoteBoxId === inq.id && (
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 animate-in fade-in">
                    <input
                      type="text"
                      placeholder="Type call / follow-up note (e.g. Student requested demo lecture on Saturday)..."
                      value={noteInputs[inq.id] || ''}
                      onChange={(e) => setNoteInputs({ ...noteInputs, [inq.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddNote(inq);
                      }}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-slate-300 outline-none focus:border-amber-500"
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveNoteBoxId(null)}
                        className="px-2.5 py-1 text-[10px] rounded-md bg-white border border-slate-200 text-slate-600 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddNote(inq)}
                        className="px-2.5 py-1 text-[10px] rounded-md bg-amber-600 text-white font-bold hover:bg-amber-700"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {/* WhatsApp Follow-up Button */}
                    <button
                      type="button"
                      onClick={() => handleSendWhatsApp(inq)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition-all tap-active cursor-pointer"
                      title="Open WhatsApp with follow-up message ready"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Follow-up</span>
                    </button>

                    {/* Quick Call Button */}
                    {inq.contactNumber && (
                      <a
                        href={`tel:${inq.contactNumber}`}
                        className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs transition-colors"
                        title="Call Student"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Add note toggle */}
                    <button
                      type="button"
                      onClick={() => setActiveNoteBoxId(activeNoteBoxId === inq.id ? null : inq.id)}
                      className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition-colors"
                    >
                      + Note
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Register as Active Student Button */}
                    {!isRegistered && (
                      <button
                        type="button"
                        onClick={() => onOpenRegisterStudent(inq)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                        title="Convert inquiry and register as active student"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Register Student</span>
                      </button>
                    )}

                    {isRegistered && (
                      <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Active Enrolled</span>
                      </span>
                    )}

                    {/* Delete inquiry */}
                    <button
                      type="button"
                      onClick={() => onDeleteInquiry(inq.id)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Inquiry Modal */}
      <AddInquiryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddInquiry={onAddInquiry}
        existingInquiries={inquiries}
      />
    </div>
  );
}
