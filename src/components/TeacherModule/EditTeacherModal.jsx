import React, { useState } from 'react';
import { X, Upload, Check, Camera, User, Phone, MapPin, ShieldCheck, Coins, GraduationCap, Edit3 } from 'lucide-react';

export default function EditTeacherModal({ teacher, isOpen, onClose, onUpdateTeacher }) {
  if (!isOpen || !teacher) return null;

  const [formData, setFormData] = useState({
    id: teacher.id,
    name: teacher.name || '',
    salary: teacher.salary || '70000',
    cnic: teacher.cnic || '',
    contactNumber: teacher.contactNumber || '',
    address: teacher.address || '',
    pic: teacher.pic || '',
    department: teacher.department || 'Science & Academics',
    joinedAt: teacher.joinedAt || '2025-01-10'
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(teacher.pic || null);

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

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Teacher name is required';
    if (!formData.salary) errs.salary = 'Monthly salary is required';
    if (!formData.cnic.trim()) errs.cnic = 'CNIC number is required';
    if (!formData.contactNumber.trim()) errs.contactNumber = 'Contact number is required';

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
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-indigo-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Edit Teacher Details</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {teacher.id}</p>
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
            <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-xl bg-white border border-indigo-100 overflow-hidden flex items-center justify-center shrink-0">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <span className="block font-semibold text-slate-700 text-xs mb-1">
                Update Teacher Photo
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

          {/* Teacher Name */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Teacher Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
            />
            {errors.name && <p className="text-rose-500 text-[10px] mt-0.5">{errors.name}</p>}
          </div>

          {/* Salary & CNIC No */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Salary (PKR / mo) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                />
                <Coins className="w-3.5 h-3.5 text-emerald-600 absolute left-2 top-2.5" />
              </div>
              {errors.salary && <p className="text-rose-500 text-[10px] mt-0.5">{errors.salary}</p>}
            </div>

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
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-mono"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
              {errors.cnic && <p className="text-rose-500 text-[10px] mt-0.5">{errors.cnic}</p>}
            </div>
          </div>

          {/* Contact Number */}
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

          {/* Address */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Address</label>
            <div className="relative">
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
              />
              <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
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
