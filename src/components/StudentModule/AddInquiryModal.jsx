import React, { useState, useEffect } from 'react';
import { X, User, Phone, MessageSquare, ShieldCheck, Sparkles, Calendar, FileText, Check, HelpCircle } from 'lucide-react';
import { CLASSES, CLASS_SECTIONS, GENDERS, INQUIRY_STATUS } from '../../constants/academicData';
import { generateNextInquiryId } from '../../utils/storage';

export default function AddInquiryModal({ isOpen, onClose, onAddInquiry, existingInquiries }) {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeekStr = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    id: generateNextInquiryId(existingInquiries),
    studentName: '',
    gender: 'Male',
    contactNumber: '',
    whatsappNumber: '',
    fatherName: '',
    fatherContact: '',
    studentClass: 'FSc Part 1',
    subject: 'Pre- Medical',
    inquiryDate: todayStr,
    followUpDate: nextWeekStr,
    status: INQUIRY_STATUS.PENDING,
    remarks: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: generateNextInquiryId(existingInquiries),
        studentName: '',
        gender: 'Male',
        contactNumber: '',
        whatsappNumber: '',
        fatherName: '',
        fatherContact: '',
        studentClass: 'FSc Part 1',
        subject: 'Pre- Medical',
        inquiryDate: todayStr,
        followUpDate: nextWeekStr,
        status: INQUIRY_STATUS.PENDING,
        remarks: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleClassChange = (newClass) => {
    const available = CLASS_SECTIONS[newClass] || [];
    setFormData(prev => ({
      ...prev,
      studentClass: newClass,
      subject: available[0] || ''
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.studentName.trim()) errs.studentName = 'Student name is required';
    if (!formData.contactNumber.trim()) errs.contactNumber = 'Contact number is required';
    if (!formData.studentClass) errs.studentClass = 'Class is required';
    if (!formData.subject) errs.subject = 'Section is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newInquiry = {
      ...formData,
      createdAt: new Date().toISOString(),
      followUpNotes: formData.remarks.trim() ? [
        {
          date: todayStr,
          note: formData.remarks.trim(),
          by: 'Front Desk'
        }
      ] : []
    };

    onAddInquiry(newInquiry);
    onClose();
  };

  const currentAvailableSections = CLASS_SECTIONS[formData.studentClass] || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-sm">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Record Student Inquiry</h2>
              <p className="text-xs text-amber-100">Walk-in visitor contact & follow-up tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-3.5 text-xs">
          {/* Inquiry ID Badge */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Inquiry Tracking ID
              </span>
              <span className="text-sm font-extrabold text-amber-950 font-mono">
                {formData.id}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-extrabold">
              Walk-in Lead
            </span>
          </div>

          {/* Student Name & Gender */}
          <div className="space-y-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Zain Ul Abideen"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className={`w-full pl-8 pr-3 py-2 rounded-xl border bg-white text-xs outline-none focus:ring-2 ${
                    errors.studentName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-amber-200 focus:border-amber-500'
                  }`}
                />
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              {errors.studentName && <p className="text-rose-500 text-[10px] mt-0.5">{errors.studentName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {['Male', 'Female'].map((gender) => (
                <label
                  key={gender}
                  className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl border cursor-pointer font-bold text-xs transition-all ${
                    formData.gender === gender
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="inq-gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={() => setFormData({ ...formData, gender })}
                    className="sr-only"
                  />
                  <span>{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Numbers */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Student Contact <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className={`w-full pl-7 pr-2 py-2 rounded-xl border bg-white text-xs outline-none ${
                    errors.contactNumber ? 'border-rose-400' : 'border-slate-200 focus:border-amber-500'
                  }`}
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">WhatsApp</label>
                {formData.contactNumber && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, whatsappNumber: formData.contactNumber })}
                    className="text-[9px] text-emerald-600 font-bold"
                  >
                    Same
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  className="w-full pl-7 pr-2 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-emerald-500"
                />
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500 absolute left-2 top-2.5" />
              </div>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Father / Guardian</label>
              <input
                type="text"
                placeholder="Guardian name"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Guardian Phone</label>
              <input
                type="tel"
                placeholder="0321-7654321"
                value={formData.fatherContact}
                onChange={(e) => setFormData({ ...formData, fatherContact: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Class & Section of Interest */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="block font-bold text-slate-800 text-xs">
              Academic Class & Section of Interest <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-1">
              {CLASSES.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => handleClassChange(cls)}
                  className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                    formData.studentClass === cls
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentAvailableSections.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setFormData({ ...formData, subject: sec })}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    formData.subject === sec
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Dates: Visit Date & Follow-Up Target Date */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Visit / Inquiry Date</label>
              <input
                type="date"
                value={formData.inquiryDate}
                onChange={(e) => setFormData({ ...formData, inquiryDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Follow-Up Date</label>
              <input
                type="date"
                value={formData.followUpDate}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-amber-800"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-800 outline-none"
            >
              {Object.values(INQUIRY_STATUS).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Remarks & Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Inquiry Remarks / Follow-up Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Student visited with father, interested in evening coaching, asked for syllabus details..."
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-500 resize-none"
            />
          </div>

          {/* Footer Action Bar */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-200 flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              Save Inquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
