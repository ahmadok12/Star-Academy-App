import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Check,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Coins,
  GraduationCap,
  Calendar,
  BookOpen,
  Layers,
  CheckSquare,
  Square,
  Edit3
} from 'lucide-react';
import { CLASSES, CLASS_SECTIONS, TEACHER_SUBJECTS } from '../../constants/academicData';

export default function EditTeacherModal({ teacher, isOpen, onClose, onUpdateTeacher }) {
  if (!isOpen || !teacher) return null;

  const [formData, setFormData] = useState({
    id: teacher.id || '',
    joinedAt: teacher.joinedAt || new Date().toISOString().slice(0, 10),
    name: teacher.name || '',
    salary: teacher.salary || '',
    cnic: teacher.cnic || '',
    contactNumber: teacher.contactNumber || '',
    secondaryContactNumber: teacher.secondaryContactNumber || '',
    address: teacher.address || '',
    department: teacher.department || 'Mathematics',
    assignedClasses: teacher.assignedClasses || [],
    pic: teacher.pic || ''
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(teacher.pic || null);

  useEffect(() => {
    if (teacher) {
      setFormData({
        id: teacher.id || '',
        joinedAt: teacher.joinedAt || new Date().toISOString().slice(0, 10),
        name: teacher.name || '',
        salary: teacher.salary || '',
        cnic: teacher.cnic || '',
        contactNumber: teacher.contactNumber || '',
        secondaryContactNumber: teacher.secondaryContactNumber || '',
        address: teacher.address || '',
        department: teacher.department || 'Mathematics',
        assignedClasses: teacher.assignedClasses || [],
        pic: teacher.pic || ''
      });
      setPhotoPreview(teacher.pic || null);
      setErrors({});
    }
  }, [teacher, isOpen]);

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

    onUpdateTeacher(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Edit Teacher Details</h2>
              <p className="text-xs text-slate-500 font-mono">Teacher ID: {formData.id}</p>
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
          
          {/* Photo attachment placeholder */}
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-xl bg-white border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <span className="block font-semibold text-slate-700 text-xs mb-1">
                Teacher Photo (Optional)
              </span>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors">
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

          {/* Row: Teacher ID & Date of Joining */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teacher ID <span className="text-slate-400 font-normal">(System)</span>
              </label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date of Joining <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.joinedAt}
                  onChange={(e) => setFormData({ ...formData, joinedAt: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-800"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
              {errors.joinedAt && <p className="text-rose-500 text-[10px] mt-0.5">{errors.joinedAt}</p>}
            </div>
          </div>

          {/* Teacher Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Teacher Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Prof. Tariq Mehmood"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
            {errors.name && <p className="text-rose-500 text-[10px] mt-0.5">{errors.name}</p>}
          </div>

          {/* Row: Mobile Number & Secondary Mobile Number */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Mobile Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="0300-1234567"
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
              {errors.contactNumber && <p className="text-rose-500 text-[10px] mt-0.5">{errors.contactNumber}</p>}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Secondary Mobile <span className="text-slate-400 font-normal">(Opt)</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="0321-7654321"
                  value={formData.secondaryContactNumber}
                  onChange={(e) => setFormData({ ...formData, secondaryContactNumber: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Row: CNIC & Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                CNIC Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="35201-1234567-1"
                  value={formData.cnic}
                  onChange={handleCnicChange}
                  maxLength={15}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-mono"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
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
                  placeholder="e.g. 60000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-800"
                />
                <Coins className="w-3.5 h-3.5 text-emerald-600 absolute left-2.5 top-2.5" />
              </div>
              {errors.salary && <p className="text-rose-500 text-[10px] mt-0.5">{errors.salary}</p>}
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
                placeholder="House #, Street, City"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Subject Dropdown */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Teaching Subject <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
              >
                {TEACHER_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
              <BookOpen className="w-3.5 h-3.5 text-indigo-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>
            {errors.department && <p className="text-rose-500 text-[10px] mt-0.5">{errors.department}</p>}
          </div>

          {/* Optional Class & Section Checkboxes */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  Assigned Classes & Sections
                  <span className="text-slate-400 font-normal text-[10px]">(Optional)</span>
                </label>
                <p className="text-[10px] text-slate-500">
                  Select one or multiple classes/sections taught by this teacher.
                </p>
              </div>
              {formData.assignedClasses && formData.assignedClasses.length > 0 && (
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {formData.assignedClasses.length} selected
                </span>
              )}
            </div>

            {/* Classes Grid with Sections */}
            <div className="space-y-2.5">
              {CLASSES.map((cls) => {
                const sections = CLASS_SECTIONS[cls] || [];
                const keys = sections.map((sec) => `${cls} (${sec})`);
                const allSelected = keys.length > 0 && keys.every((k) => (formData.assignedClasses || []).includes(k));
                const someSelected = keys.some((k) => (formData.assignedClasses || []).includes(k));

                return (
                  <div key={cls} className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-bold text-slate-800 text-xs">
                        {cls}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleAllSectionsForClass(cls)}
                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                      >
                        {allSelected ? 'Uncheck All' : 'Select All'}
                      </button>
                    </div>

                    {/* Section Checkboxes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {sections.map((sec) => {
                        const key = `${cls} (${sec})`;
                        const isChecked = (formData.assignedClasses || []).includes(key);

                        return (
                          <label
                            key={sec}
                            className={`flex items-center gap-2 p-1.5 rounded-lg border text-[11px] font-medium cursor-pointer transition-all ${
                              isChecked
                                ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 font-semibold'
                                : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleClassSection(cls, sec)}
                              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                            />
                            <span className="truncate">{sec}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-50 transition-colors tap-active"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5 transition-all tap-active"
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
