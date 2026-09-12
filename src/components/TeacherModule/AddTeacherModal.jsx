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
  CheckSquare,
  Square,
  Clock
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
    arrivalTime: '07:45',
    assignedClasses: [],
    pic: ''
  });

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
        arrivalTime: '07:45',
        assignedClasses: [],
        pic: ''
      });
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

  // Toggle individual Class + Section checkbox
  const toggleClassSection = (cls, sec) => {
    const key = `${cls} (${sec})`;
    setFormData((prev) => {
      const current = prev.assignedClasses || [];
      const exists = current.includes(key);
      const updated = exists ? current.filter((k) => k !== key) : [...current, key];
      return { ...prev, assignedClasses: updated };
    });
  };

  // Toggle all sections for a class
  const toggleAllSectionsForClass = (cls) => {
    const sections = CLASS_SECTIONS[cls] || [];
    const keys = sections.map((sec) => `${cls} (${sec})`);
    setFormData((prev) => {
      const current = prev.assignedClasses || [];
      const allSelected = keys.every((k) => current.includes(k));
      let updated;
      if (allSelected) {
        updated = current.filter((k) => !keys.includes(k));
      } else {
        const toAdd = keys.filter((k) => !current.includes(k));
        updated = [...current, ...toAdd];
      }
      return { ...prev, assignedClasses: updated };
    });
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
    if (!formData.department) errs.department = 'Please select a subject';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalPic =
      formData.pic ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256';

    const newTeacher = {
      ...formData,
      pic: finalPic
    };

    onAddTeacher(newTeacher);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Add New Teacher</h2>
              <p className="text-xs text-slate-500">Register faculty member, subjects & teaching sections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-4 text-xs">
          
          {/* Top Row: Teacher ID & Date of Joining */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Autogenerated Teacher ID */}
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-indigo-700 uppercase tracking-wider block">
                  Teacher ID (Auto)
                </span>
                <span className="text-sm font-extrabold text-indigo-950 font-mono tracking-tight">
                  {formData.id}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md text-[10px] font-medium text-indigo-600 shadow-xs border border-indigo-100">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Serial
              </div>
            </div>

            {/* Date of Joining */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                <span>Date of Joining <span className="text-rose-500">*</span></span>
              </label>
              <input
                type="date"
                value={formData.joinedAt}
                onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-2 ${
                  errors.joinedAt ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-500'
                }`}
              />
              {errors.joinedAt && <p className="text-rose-500 text-[10px] mt-0.5">{errors.joinedAt}</p>}
            </div>
          </div>

          {/* Photo Attachment Placeholder */}
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-3.5 flex items-center gap-3.5">
            <div className="relative w-14 h-14 min-w-[56px] min-h-[56px] rounded-xl bg-white border border-indigo-100 overflow-hidden flex items-center justify-center shadow-xs shrink-0">
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
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors">
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

          {/* Subject Dropdown & Expected Arrival Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span>Teaching Subject <span className="text-rose-500">*</span></span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:ring-2 ${
                  errors.department ? 'border-rose-400 focus:ring-rose-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-500'
                } cursor-pointer`}
              >
                {TEACHER_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-rose-500 text-[10px] mt-0.5">{errors.department}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Expected Arrival Time <span className="text-rose-500">*</span></span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.arrivalTime || '07:45'}
                  onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  required
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Optional Class & Section Checkboxes (one teacher can teach multiple) */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                <span>Assigned Classes & Sections (Optional)</span>
              </label>
              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {formData.assignedClasses?.length || 0} selected
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500">
              One teacher can teach more than one class and section. Check all applicable:
            </p>

            <div className="space-y-2.5 pt-1">
              {CLASSES.map((cls) => {
                const sections = CLASS_SECTIONS[cls] || [];
                const allSelected = sections.every((sec) =>
                  formData.assignedClasses?.includes(`${cls} (${sec})`)
                );
                return (
                  <div key={cls} className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-xs">
                        Class {cls}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleAllSectionsForClass(cls)}
                        className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                      >
                        {allSelected ? 'Uncheck All' : 'Select All'}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-0.5">
                      {sections.map((sec) => {
                        const key = `${cls} (${sec})`;
                        const isChecked = formData.assignedClasses?.includes(key);
                        return (
                          <button
                            key={sec}
                            type="button"
                            onClick={() => toggleClassSection(cls, sec)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border cursor-pointer ${
                              isChecked
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-3.5 h-3.5 text-white" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span>{sec}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
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
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors tap-active cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all tap-active cursor-pointer"
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
