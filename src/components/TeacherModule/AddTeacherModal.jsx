import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Check,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
  Coins,
  GraduationCap,
  Calendar,
  BookOpen,
  Layers,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckCircle2
} from 'lucide-react';
import { generateNextTeacherId } from '../../utils/storage';
import { CLASSES, CLASS_SECTIONS, TEACHER_SUBJECTS } from '../../constants/academicData';

export default function AddTeacherModal({ isOpen, onClose, onAddTeacher, existingTeachers }) {
  if (!isOpen) return null;

  const getTodayDate = () => new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    id: generateNextTeacherId(existingTeachers),
    joinedAt: getTodayDate(),
    name: '',
    salary: '',
    cnic: '',
    contactNumber: '',
    secondaryContactNumber: '',
    address: '',
    department: 'Mathematics',
    arrivalTime: '15:00',
    pic: ''
  });

  const [lectures, setLectures] = useState([
    {
      id: 'lec-1',
      assignedClass: '',
      subject: 'Mathematics',
      time: '15:00',
      isClassesExpanded: true
    }
  ]);

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  // Reset fields when opening dialog
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: generateNextTeacherId(existingTeachers),
        joinedAt: getTodayDate(),
        name: '',
        salary: '',
        cnic: '',
        contactNumber: '',
        secondaryContactNumber: '',
        address: '',
        department: 'Mathematics',
        arrivalTime: '15:00',
        pic: ''
      });
      setLectures([
        {
          id: 'lec-1',
          assignedClass: '',
          subject: 'Mathematics',
          time: '15:00',
          isClassesExpanded: true
        }
      ]);
      setPhotoPreview(null);
      setErrors({});
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData((prev) => ({ ...prev, pic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCnicChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 13) val = val.slice(0, 13);

    let formatted = val;
    if (val.length > 5 && val.length <= 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5)}`;
    } else if (val.length > 12) {
      formatted = `${val.slice(0, 5)}-${val.slice(5, 12)}-${val.slice(12, 13)}`;
    }

    setFormData((prev) => ({ ...prev, cnic: formatted }));
  };

  // Manage Unified Lectures
  const handleAddLecture = () => {
    setLectures((prev) => [
      ...prev,
      {
        id: `lec-${Date.now()}`,
        assignedClass: '',
        subject: formData.department || TEACHER_SUBJECTS[0] || 'Mathematics',
        time: prev.length === 1 ? '18:00' : '16:00',
        isClassesExpanded: true
      }
    ]);
  };

  const handleRemoveLecture = (lecId) => {
    setLectures((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((l) => l.id !== lecId);
    });
  };

  const handleUpdateLecture = (lecId, field, value) => {
    setLectures((prev) =>
      prev.map((l) => (l.id === lecId ? { ...l, [field]: value } : l))
    );
  };

  const handleSelectClassForLecture = (lecId, classKey) => {
    setLectures((prev) =>
      prev.map((l) => {
        if (l.id === lecId) {
          return {
            ...l,
            assignedClass: classKey,
            isClassesExpanded: false // auto collapse to reveal lecture time cleanly!
          };
        }
        return l;
      })
    );
  };

  const handleToggleExpandClasses = (lecId) => {
    setLectures((prev) =>
      prev.map((l) =>
        l.id === lecId ? { ...l, isClassesExpanded: !l.isClassesExpanded } : l
      )
    );
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Teacher name is required';
    if (!formData.salary) errs.salary = 'Monthly salary is required';
    if (!formData.cnic.trim()) {
      errs.cnic = 'CNIC number is required';
    } else if (formData.cnic.length < 15) {
      errs.cnic = 'CNIC format must be XXXXX-XXXXXXX-X';
    }
    if (!formData.contactNumber.trim()) errs.contactNumber = 'Mobile number is required';
    if (!formData.joinedAt) errs.joinedAt = 'Date of joining is required';

    // Check lectures: each must have an assigned class and time
    const invalidLec = lectures.find((l) => !l.assignedClass || !l.time);
    if (invalidLec) {
      errs.lectures = 'Please select an assigned class and enter lecture time for all lectures.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalPic =
      formData.pic ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';

    const finalTeachingSlots = lectures.map((l, idx) => ({
      id: l.id || `slot-${idx + 1}`,
      assignedClass: l.assignedClass,
      subject: l.subject || formData.department || 'Mathematics',
      time: l.time || '15:00'
    }));

    const finalAssignedClasses = Array.from(
      new Set(lectures.map((l) => l.assignedClass).filter(Boolean))
    );

    const subjects = [...new Set(finalTeachingSlots.map((s) => s.subject))].join(', ');
    const sortedTimes = [...finalTeachingSlots.map((s) => s.time)].sort();
    const earliestTime = sortedTimes[0] || '15:00';

    const newTeacher = {
      ...formData,
      department: subjects || formData.department || 'Mathematics',
      arrivalTime: earliestTime,
      teachingSlots: finalTeachingSlots,
      assignedClasses: finalAssignedClasses,
      pic: finalPic
    };

    onAddTeacher(newTeacher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-stitch-lg overflow-hidden border border-[#E5E7EB]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1F2937] flex items-center justify-between bg-[#111827] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-[#FF7A59]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">Add New Teacher</h2>
              <p className="text-xs text-slate-400">Register faculty member, subjects & teaching sections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-4 text-xs">
          
          {/* Top Row: Teacher ID & Date of Joining */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Autogenerated Teacher ID */}
            <div className="bg-[#F8F9FB] border border-slate-200 rounded-2xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Teacher ID (Auto)
                </span>
                <span className="text-sm font-extrabold text-slate-900 font-mono tracking-tight">
                  {formData.id}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-700 shadow-2xs border border-slate-200">
                <Sparkles className="w-3 h-3 text-slate-500" />
                Serial
              </div>
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                <span>Date of Joining <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                value={formData.joinedAt}
                onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-2 ${
                  errors.joinedAt ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-slate-200 focus:border-[#111827]'
                }`}
              />
              {errors.joinedAt && <p className="text-rose-500 text-[10px] mt-0.5">{errors.joinedAt}</p>}
            </div>
          </div>

          {/* Photo Attachment Placeholder */}
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-3.5 flex items-center gap-3.5">
            <div className="relative w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-xs shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-slate-300" />
              )}
            </div>

            <div className="flex-1">
              <span className="block font-semibold text-slate-700 text-xs mb-0.5">
                Teacher Photo (Attachment)
              </span>
              <p className="text-[10px] text-slate-400 mb-2">
                Upload passport photo or select image file
              </p>
              <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Pic</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Teacher Full Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Teacher Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Prof. Muhammad Tariq"
              className={`w-full px-3 py-2 rounded-xl border bg-white text-xs focus:outline-none focus:ring-2 ${
                errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-500'
              }`}
            />
            {errors.name && <p className="text-rose-500 text-[10px] mt-0.5">{errors.name}</p>}
          </div>

          {/* Mobile number & Secondary mob number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  placeholder="0300-1234567"
                  className={`w-full pl-7 pr-3 py-2 rounded-xl border bg-white text-xs font-mono focus:outline-none focus:ring-2 ${
                    errors.contactNumber ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-500'
                  }`}
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
              {errors.contactNumber && <p className="text-rose-500 text-[10px] mt-0.5">{errors.contactNumber}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Secondary Mob Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.secondaryContactNumber}
                  onChange={(e) => setFormData({ ...formData, secondaryContactNumber: e.target.value })}
                  placeholder="0321-7654321"
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
            </div>
          </div>

          {/* CNIC & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                CNIC No <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.cnic}
                  onChange={handleCnicChange}
                  maxLength={15}
                  placeholder="35202-1234567-1"
                  className={`w-full pl-7 pr-3 py-2 rounded-xl border bg-white text-xs font-mono focus:outline-none focus:ring-2 ${
                    errors.cnic ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-500'
                  }`}
                />
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
              {errors.cnic && <p className="text-rose-500 text-[10px] mt-0.5">{errors.cnic}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Monthly Salary (PKR) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g. 75000"
                  className={`w-full pl-7 pr-3 py-2 rounded-xl border bg-white text-xs font-bold focus:outline-none focus:ring-2 ${
                    errors.salary ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-500'
                  }`}
                />
                <Coins className="w-3.5 h-3.5 text-emerald-600 absolute left-2 top-2.5" />
              </div>
              {errors.salary && <p className="text-rose-500 text-[10px] mt-0.5">{errors.salary}</p>}
            </div>
          </div>

          {/* Unified Lectures & Class Assignments Section */}
          <div className="space-y-3 p-4 rounded-2xl bg-indigo-50/40 border border-indigo-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Lectures & Assigned Classes <span className="text-rose-500">*</span></span>
                </label>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Add each lecture, select its assigned class, and set its scheduled timing.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddLecture}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-bold shadow-xs transition-all tap-active cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Lecture</span>
              </button>
            </div>

            {errors.lectures && (
              <p className="text-rose-500 text-[10.5px] font-semibold bg-rose-50 border border-rose-200 p-2 rounded-xl">
                {errors.lectures}
              </p>
            )}

            <div className="space-y-3 pt-1">
              {lectures.map((lec, lIdx) => (
                <div
                  key={lec.id || lIdx}
                  className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-2xs space-y-3 transition-all"
                >
                  {/* Lecture Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                        Lecture #{lIdx + 1}
                      </span>
                      {lec.assignedClass ? (
                        <span className="text-[11px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {lec.assignedClass}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          No class selected
                        </span>
                      )}
                      {lec.assignedClass && lec.time && (
                        <span className="text-[11px] font-mono font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {lec.time}
                        </span>
                      )}
                    </div>

                    {lectures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLecture(lec.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Remove Lecture"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Lecture Subject selector */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <select
                      value={lec.subject}
                      onChange={(e) => handleUpdateLecture(lec.id, 'subject', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                    >
                      {TEACHER_SUBJECTS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Expandable Assigned Classes Section (User makes ONE selection) */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleToggleExpandClasses(lec.id)}
                      className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Assigned Class (Click to {lec.isClassesExpanded ? 'Collapse' : 'Select'})</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-semibold ${lec.assignedClass ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {lec.assignedClass || 'Choose one class'}
                        </span>
                        {lec.isClassesExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </button>

                    {lec.isClassesExpanded && (
                      <div className="p-3 bg-white space-y-2.5 border-t border-slate-100 max-h-56 overflow-y-auto">
                        <p className="text-[10px] text-slate-400 italic">
                          Select one class & section for this lecture:
                        </p>
                        {CLASSES.map((cls) => {
                          const sections = CLASS_SECTIONS[cls] || [];
                          return (
                            <div key={cls} className="space-y-1">
                              <span className="text-[11px] font-extrabold text-slate-700 block">
                                Class {cls}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {sections.map((sec) => {
                                  const classKey = `${cls} (${sec})`;
                                  const isSelected = lec.assignedClass === classKey;
                                  return (
                                    <button
                                      key={sec}
                                      type="button"
                                      onClick={() => handleSelectClassForLecture(lec.id, classKey)}
                                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all border cursor-pointer flex items-center gap-1 ${
                                        isSelected
                                          ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                      }`}
                                    >
                                      {isSelected && <Check className="w-3 h-3 text-white" />}
                                      <span>{sec}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Lecture Time Field: SHOWN ONCE ASSIGNED CLASS IS SELECTED */}
                  {lec.assignedClass ? (
                    <div className="p-3 bg-[#F8F9FB] border border-slate-200 rounded-2xl space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-700" />
                          <span>Lecture Time for {lec.assignedClass} <span className="text-rose-500">*</span></span>
                        </label>
                        <span className="text-[10px] font-bold text-slate-700 bg-slate-200/80 px-2.5 py-0.5 rounded-full">
                          Scheduled Slot
                        </span>
                      </div>
                      <input
                        type="time"
                        value={lec.time}
                        onChange={(e) => handleUpdateLecture(lec.id, 'time', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-[#111827]"
                        required
                      />
                      <p className="text-[10px] text-slate-500">
                        e.g. 15:00 for 3:00 PM or 18:00 for 6:00 PM.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
                      <p className="text-[10.5px] text-slate-400 font-medium">
                        👉 Please select an assigned class above to set this lecture's scheduled timing.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Residential Address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Residential Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House #, Street, Area, City"
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
            </div>
          </div>

          {/* Sticky Actions */}
          <div className="pt-3 border-t border-[#E5E7EB] flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#F3F4F6] text-slate-700 font-semibold text-xs hover:bg-[#edeef0] transition-colors tap-active cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-[#1F2937] text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all tap-active cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
