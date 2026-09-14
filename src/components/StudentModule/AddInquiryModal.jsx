import React, { useState, useEffect, useMemo } from 'react';
import { X, User, Phone, MessageSquare, ShieldCheck, Sparkles, Calendar, FileText, Check, HelpCircle, BookOpen } from 'lucide-react';
import { CLASSES, CLASS_SECTIONS, GENDERS, INQUIRY_STATUS } from '../../constants/academicData';
import { generateNextInquiryId, getCurriculumSubjects, INITIAL_CURRICULUM_SUBJECTS } from '../../utils/storage';

export default function AddInquiryModal({ isOpen, onClose, onAddInquiry, existingInquiries, curriculumSubjects }) {
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

  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const availableCurriculumSubjects = useMemo(() => {
    if (!formData.studentClass || !formData.subject) return [];
    const key = `${formData.studentClass}_${formData.subject}`;
    if (curriculumSubjects && curriculumSubjects[key] && curriculumSubjects[key].length > 0) {
      return curriculumSubjects[key];
    }
    if (INITIAL_CURRICULUM_SUBJECTS && INITIAL_CURRICULUM_SUBJECTS[key] && INITIAL_CURRICULUM_SUBJECTS[key].length > 0) {
      return INITIAL_CURRICULUM_SUBJECTS[key];
    }
    const defaultSubs = getCurriculumSubjects();
    if (defaultSubs && defaultSubs[key] && defaultSubs[key].length > 0) {
      return defaultSubs[key];
    }
    return ['Physics', 'Chemistry', 'Math', 'Bio', 'Computer', 'Eng', 'Urdu', 'Islamiyat', 'Tarjama tul Quran'];
  }, [formData.studentClass, formData.subject, curriculumSubjects]);

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

  // Sync selected subjects with available subjects
  useEffect(() => {
    if (availableCurriculumSubjects.length > 0) {
      setSelectedSubjects([...availableCurriculumSubjects]);
    } else {
      setSelectedSubjects([]);
    }
  }, [formData.studentClass, formData.subject, availableCurriculumSubjects]);

  const isAllSubjectsSelected =
    availableCurriculumSubjects.length > 0 &&
    selectedSubjects.length === availableCurriculumSubjects.length;

  const handleToggleAllSubjects = () => {
    if (isAllSubjectsSelected) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects([...availableCurriculumSubjects]);
    }
  };

  const handleToggleSingleSubject = (subjectName) => {
    if (selectedSubjects.includes(subjectName)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectName));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

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
      selectedSubjects: selectedSubjects.length > 0 ? selectedSubjects : availableCurriculumSubjects,
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
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111827] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Record Student Inquiry</h2>
              <p className="text-xs text-slate-400">Walk-in visitor contact & follow-up tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-3.5 text-xs">
          {/* Inquiry ID Badge */}
          <div className="bg-[#F8F9FB] border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Inquiry Tracking ID
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-mono">
                {formData.id}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-bold">
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
                    errors.studentName ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-slate-200 focus:border-[#111827]'
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
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-full border cursor-pointer font-bold text-xs transition-all ${
                    formData.gender === gender
                      ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
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
            <div className="grid grid-cols-4 gap-1.5">
              {CLASSES.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => handleClassChange(cls)}
                  className={`py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                    formData.studentClass === cls
                      ? 'bg-[#111827] text-white shadow-xs'
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
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    formData.subject === sec
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Enrolled Subjects Option (Attachment 3) */}
            {formData.subject && availableCurriculumSubjects.length > 0 && (
              <div className="mt-3 p-3 bg-white border border-slate-200 rounded-2xl space-y-2 animate-in fade-in duration-150 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-700" />
                    <label className="font-bold text-slate-800 text-xs">
                      Enrolled Subjects
                    </label>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedSubjects.length} of {availableCurriculumSubjects.length} {isAllSubjectsSelected ? 'All Selected' : 'Custom'}
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 leading-tight">
                  Student may study all subjects or specific individual subjects:
                </p>

                {/* Master "All Subjects" Checkbox */}
                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer transition-all hover:bg-slate-100 shadow-2xs">
                  <input
                    type="checkbox"
                    checked={isAllSubjectsSelected}
                    onChange={handleToggleAllSubjects}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer"
                  />
                  <span className="font-bold text-xs text-slate-900">
                    All Subjects ({availableCurriculumSubjects.length})
                  </span>
                </label>

                {/* Individual Subject Checkboxes */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {availableCurriculumSubjects.map((subName) => {
                    const isChecked = selectedSubjects.includes(subName);
                    return (
                      <label
                        key={subName}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all select-none ${
                          isChecked
                            ? 'bg-white border-slate-300 text-slate-900 font-semibold shadow-2xs'
                            : 'bg-slate-50/60 border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSingleSubject(subName)}
                          className="w-3.5 h-3.5 text-slate-900 rounded border-slate-300 focus:ring-slate-900 cursor-pointer"
                        />
                        <span className="truncate">{subName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
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
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
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
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:ring-2 focus:ring-slate-200 focus:border-[#111827] resize-none"
            />
          </div>

          {/* Footer Action Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-[#111827] hover:bg-black text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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
