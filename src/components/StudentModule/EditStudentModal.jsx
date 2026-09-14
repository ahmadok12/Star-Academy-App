import React, { useState, useMemo } from 'react';
import { X, Upload, Check, Camera, User, Phone, Mail, MapPin, ShieldCheck, Edit3, MessageSquare, Coins, Calendar, BookOpen } from 'lucide-react';
import { CLASSES, CLASS_SUBJECTS, GENDERS } from '../../constants/academicData';
import { getCurriculumSubjects } from '../../utils/storage';

export default function EditStudentModal({ student, isOpen, onClose, onUpdateStudent }) {
  if (!isOpen || !student) return null;

  const curriculumMap = getCurriculumSubjects();

  const [formData, setFormData] = useState({
    id: student.id,
    firstName: student.firstName || '',
    lastName: student.lastName || '',
    pic: student.pic || '',
    gender: student.gender || 'Male',
    contactNumber: student.contactNumber || '',
    whatsappNumber: student.whatsappNumber || '',
    email: student.email || '',
    address: student.address || '',
    fatherName: student.fatherName || '',
    fatherContact: student.fatherContact || '',
    fatherCnic: student.fatherCnic || '',
    studentClass: student.studentClass || '9th',
    subject: student.subject === 'Med' ? 'Pre- Medical' : student.subject === 'Eng' ? 'Pre-Engineering' : (student.subject || 'Science'),
    fees: student.fees || '6500',
    dateOfJoining: student.dateOfJoining || student.registeredAt || new Date().toISOString().split('T')[0],
    isActive: student.isActive !== false,
    isLeft: Boolean(student.isLeft),
    registeredAt: student.registeredAt || new Date().toISOString().split('T')[0]
  });

  const availableCurriculumSubjects = useMemo(() => {
    if (!formData.studentClass || !formData.subject) return [];
    const key = `${formData.studentClass}_${formData.subject}`;
    return curriculumMap[key] || [];
  }, [formData.studentClass, formData.subject, curriculumMap]);

  const [selectedSubjects, setSelectedSubjects] = useState(() => {
    if (student.enrolledSubjects && Array.isArray(student.enrolledSubjects) && student.enrolledSubjects.length > 0) {
      return student.enrolledSubjects;
    }
    if (student.selectedSubjects && Array.isArray(student.selectedSubjects) && student.selectedSubjects.length > 0) {
      return student.selectedSubjects;
    }
    const key = `${student.studentClass || '9th'}_${student.subject || 'Science'}`;
    return curriculumMap[key] || [];
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(student.pic || null);

  const handleClassChange = (newClass) => {
    const availableSubjects = CLASS_SUBJECTS[newClass] || [];
    const newSec = availableSubjects[0] || '';
    setFormData(prev => ({
      ...prev,
      studentClass: newClass,
      subject: newSec
    }));
    const key = `${newClass}_${newSec}`;
    setSelectedSubjects([...(curriculumMap[key] || [])]);
  };

  const handleSectionChange = (newSec) => {
    setFormData(prev => ({
      ...prev,
      subject: newSec
    }));
    const key = `${formData.studentClass}_${newSec}`;
    if (newSec === 'Individual Subjects') {
      if (student.subject !== 'Individual Subjects') {
        setSelectedSubjects([]);
      }
    } else {
      setSelectedSubjects([...(curriculumMap[key] || [])]);
    }
  };

  const isAllSubjectsSelected =
    availableCurriculumSubjects.length > 0 &&
    selectedSubjects.length === availableCurriculumSubjects.length;

  const handleToggleAllSubjects = (e) => {
    if (e.target.checked) {
      setSelectedSubjects([...availableCurriculumSubjects]);
    } else {
      setSelectedSubjects([]);
    }
  };

  const handleToggleSingleSubject = (subName) => {
    setSelectedSubjects(prev => {
      if (prev.includes(subName)) {
        return prev.filter(s => s !== subName);
      } else {
        return [...prev, subName];
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({ ...prev, pic: reader.result }));
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

    setFormData(prev => ({ ...prev, fatherCnic: formatted }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.contactNumber.trim()) errs.contactNumber = 'Contact number is required';
    if (!formData.fatherName.trim()) errs.fatherName = 'Guardian name is required';
    if (!formData.fatherContact.trim()) errs.fatherContact = 'Guardian contact is required';
    if (!formData.fatherCnic.trim()) errs.fatherCnic = 'Guardian CNIC is required';
    if (!formData.subject) errs.subject = 'Please select a subject';
    if (availableCurriculumSubjects.length > 0 && selectedSubjects.length === 0) {
      errs.selectedSubjects = 'Please select at least 1 subject';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const isIndividual = formData.subject === 'Individual Subjects';
    const enrolled = selectedSubjects.length > 0 ? selectedSubjects : availableCurriculumSubjects;
    const computedGroup = isIndividual
      ? (selectedSubjects.length > 0 ? selectedSubjects.join(' + ') : 'Individual Subjects')
      : formData.subject;

    onUpdateStudent({
      ...formData,
      section: formData.subject,
      subjectGroup: computedGroup,
      enrolledSubjects: enrolled,
      selectedSubjects: enrolled
    });
    onClose();
  };

  const currentAvailableSubjects = CLASS_SUBJECTS[formData.studentClass] || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#111827] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white border border-white/10 shadow-inner">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-display font-black text-white">Edit Student Details</h2>
              <p className="text-xs text-slate-400 font-mono">ID: {student.id}</p>
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
          
          {/* Picture preview & upload */}
          <div className="bg-[#F8F9FB] border border-dashed border-slate-300 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <span className="block font-semibold text-slate-700 text-xs mb-1">
                Update Student Photo
              </span>
              <label className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111827] hover:bg-black text-white rounded-full text-xs font-semibold cursor-pointer shadow-2xs transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New Pic</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-slate-400 focus:border-slate-800"
              />
              {errors.firstName && <p className="text-rose-500 text-[10px] mt-0.5">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-slate-400 focus:border-slate-800"
              />
              {errors.lastName && <p className="text-rose-500 text-[10px] mt-0.5">{errors.lastName}</p>}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Gender</label>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map((gender) => (
                <label
                  key={gender}
                  className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-full border cursor-pointer font-semibold text-xs transition-all ${
                    formData.gender === gender
                      ? 'bg-[#111827] text-white border-[#111827] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="edit-gender"
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

          {/* Contact & WhatsApp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Contact Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">
                  WhatsApp Number
                </label>
                {formData.contactNumber && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, whatsappNumber: formData.contactNumber })}
                    className="text-[9px] text-emerald-600 hover:text-emerald-700 font-bold"
                  >
                    Same as contact
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="0300-1234567"
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
                <MessageSquare className="w-3.5 h-3.5 text-emerald-500 absolute left-2 top-2.5" />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
            />
          </div>

          {/* Father / Guardian Section */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Guardian Details
            </span>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Guardian Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Guardian Contact <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.fatherContact}
                  onChange={(e) => setFormData({ ...formData, fatherContact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Guardian CNIC <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fatherCnic}
                  onChange={handleCnicChange}
                  maxLength={15}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Class & Subject */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block font-bold text-slate-800 mb-1.5">Enrolled Class</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {CLASSES.map((cls) => (
                <label
                  key={cls}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full border cursor-pointer transition-all ${
                    formData.studentClass === cls
                      ? 'border-[#111827] bg-[#111827] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="edit-class"
                    value={cls}
                    checked={formData.studentClass === cls}
                    onChange={() => handleClassChange(cls)}
                    className="sr-only"
                  />
                  <span className="font-bold text-xs">{cls}</span>
                </label>
              ))}
            </div>

            <label className="block font-bold text-slate-800 mb-1.5">
              Section for <span className="text-slate-900 font-black">{formData.studentClass}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currentAvailableSubjects.map((sub) => (
                <label
                  key={sub}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full border cursor-pointer transition-all ${
                    formData.subject === sub
                      ? 'border-[#111827] bg-[#111827] text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="edit-subject"
                    value={sub}
                    checked={formData.subject === sub}
                    onChange={() => handleSectionChange(sub)}
                    className="sr-only"
                  />
                  <span className="leading-tight font-semibold text-xs">{sub}</span>
                </label>
              ))}
            </div>

            {/* Subject-Wise Enrollment Checkboxes */}
            {formData.subject && availableCurriculumSubjects.length > 0 && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-700" />
                    <label className="font-bold text-slate-800 text-xs">
                      Enrolled Subjects
                    </label>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {selectedSubjects.length} of {availableCurriculumSubjects.length} {isAllSubjectsSelected ? 'All Selected' : 'Custom'}
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 leading-tight">
                  Student may study all subjects or specific individual subjects:
                </p>

                {formData.subject === 'Individual Subjects' && (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0">
                      Enrolled Combination:
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {selectedSubjects.length > 0 ? selectedSubjects.join(' + ') : 'None selected yet'}
                    </span>
                  </div>
                )}

                {/* Master "All Subjects" Checkbox */}
                <label className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 cursor-pointer transition-all hover:bg-slate-50 shadow-2xs">
                  <input
                    type="checkbox"
                    checked={isAllSubjectsSelected}
                    onChange={handleToggleAllSubjects}
                    className="w-4 h-4 text-slate-900 rounded border-slate-300 focus:ring-slate-800"
                  />
                  <span className="font-bold text-xs text-slate-800">
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
                            ? 'bg-white border-slate-800 text-slate-900 font-semibold shadow-2xs'
                            : 'bg-white/60 border-slate-200 text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSingleSubject(subName)}
                          className="w-3.5 h-3.5 text-slate-900 rounded border-slate-300 focus:ring-slate-800"
                        />
                        <span className="truncate">{subName}</span>
                      </label>
                    );
                  })}
                </div>
                {errors.selectedSubjects && (
                  <p className="text-rose-500 text-[10px] mt-1 font-semibold">{errors.selectedSubjects}</p>
                )}
              </div>
            )}
          </div>

          {/* Fees & Date of Joining */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Fees & Admission
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Monthly Fees (PKR) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.fees}
                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                    placeholder="e.g. 6500"
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                  />
                  <Coins className="w-3.5 h-3.5 text-amber-500 absolute left-2 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Date of Joining <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                    className="w-full pl-7 pr-2 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700"
                  />
                  <Calendar className="w-3.5 h-3.5 text-indigo-500 absolute left-2 top-2.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors tap-active cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-black text-white font-bold text-xs shadow-2xs flex items-center justify-center gap-1.5 transition-all tap-active cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
