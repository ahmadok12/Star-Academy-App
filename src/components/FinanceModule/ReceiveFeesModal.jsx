import React, { useState, useMemo, useEffect } from 'react';
import { X, CreditCard, Calendar, Landmark, User, FileText, Search, Check, ShieldCheck } from 'lucide-react';
import { generateNextFeeVoucherId } from '../../utils/storage';

export default function ReceiveFeesModal({
  isOpen,
  onClose,
  onReceiveFee,
  feeVouchers,
  students,
  banks,
  preselectedVoucher = null
}) {
  const activeStudents = useMemo(() => {
    return students.filter(s => !s.isLeft && s.isActive !== false);
  }, [students]);

  const today = new Date().toISOString().slice(0, 10);
  const currentMonthStr = 'September 2026';

  const [date, setDate] = useState(today);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feeAmount, setFeeAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [bankId, setBankId] = useState('');
  const [details, setDetails] = useState('');

  const [studentSearch, setStudentSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset or initialize fields whenever modal opens or preselected voucher changes
  useEffect(() => {
    if (isOpen) {
      setDate(today);
      if (preselectedVoucher) {
        const found = activeStudents.find(s => s.id === preselectedVoucher.studentId) || null;
        setSelectedStudent(found);
        setFeeAmount(preselectedVoucher.feeAmount ? String(preselectedVoucher.feeAmount) : (found?.fees ? String(found.fees) : ''));
        setAmountPaid(preselectedVoucher.amountPaid ? String(preselectedVoucher.amountPaid) : (preselectedVoucher.feeAmount ? String(preselectedVoucher.feeAmount) : (found?.fees ? String(found.fees) : '')));
        setBankId(preselectedVoucher.bankId || '');
        setDetails(preselectedVoucher.details || `Tuition fee received for ${currentMonthStr}`);
      } else {
        // Do NOT select anything by default
        setSelectedStudent(null);
        setFeeAmount('');
        setAmountPaid('');
        setBankId('');
        setDetails('');
      }
      setErrors({});
      setIsDropdownOpen(false);
      setStudentSearch('');
    }
  }, [isOpen, preselectedVoucher, activeStudents]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return activeStudents;
    const q = studentSearch.toLowerCase();
    return activeStudents.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      s.studentClass.toLowerCase().includes(q) ||
      (s.section && s.section.toLowerCase().includes(q))
    );
  }, [activeStudents, studentSearch]);

  if (!isOpen) return null;

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    const amt = student.fees ? String(student.fees) : '';
    setFeeAmount(amt);
    setAmountPaid(amt);
    if (!details) {
      setDetails(`Tuition fee received for ${currentMonthStr}`);
    }
    setIsDropdownOpen(false);
    setStudentSearch('');
    if (errors.student) {
      setErrors(prev => ({ ...prev, student: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!date) errs.date = 'Receipt date is required';
    if (!selectedStudent) errs.student = 'Please select a student';
    if (!bankId) errs.bankId = 'Please select a deposit bank / cash counter';
    const amt = Number(amountPaid);
    if (!amountPaid || isNaN(amt) || amt <= 0) {
      errs.amountPaid = 'Please enter a valid amount received';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const voucherId = preselectedVoucher?.id || generateNextFeeVoucherId(feeVouchers);

    onReceiveFee({
      id: voucherId,
      studentId: selectedStudent.id,
      studentName: `${selectedStudent.firstName} ${selectedStudent.lastName}`,
      studentClass: selectedStudent.studentClass,
      section: selectedStudent.section || selectedStudent.subject,
      fatherName: selectedStudent.fatherName,
      fatherContact: selectedStudent.fatherContact,
      whatsappNumber: selectedStudent.whatsappNumber || selectedStudent.contactNumber,
      month: currentMonthStr,
      dueDate: `${today.slice(0, 8)}10`,
      feeAmount: Number(feeAmount) || Number(amountPaid),
      amountPaid: Number(amountPaid),
      status: 'PAID',
      paidDate: date,
      bankId,
      details: details.trim() || `Tuition fee received for ${currentMonthStr}`,
      createdAt: preselectedVoucher?.createdAt || new Date().toISOString()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-[#E5E7EB] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#111827] px-6 py-4 text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display tracking-tight leading-tight">Receive Student Fees</h2>
              <p className="text-[11px] text-slate-400 font-medium">Payment Receipt Voucher</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {/* Student Selector */}
          <div className="relative">
            <label className="block font-semibold text-slate-800 mb-1">
              Select Student <span className="text-rose-500">*</span>
            </label>

            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                isDropdownOpen ? 'border-[#111827] ring-2 ring-slate-200' : 'border-[#E5E7EB] hover:border-slate-300'
              } ${errors.student ? 'border-rose-400 bg-rose-50/50' : 'bg-[#F8F9FB]'}`}
            >
              {selectedStudent ? (
                <div className="flex items-center gap-2">
                  <img
                    src={selectedStudent.pic}
                    alt=""
                    className="w-8 h-8 rounded-xl object-cover border border-[#E5E7EB] shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 block truncate">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </span>
                    <span className="text-[10px] text-[#575E70] block">
                      {selectedStudent.id} • Class {selectedStudent.studentClass} ({selectedStudent.section || selectedStudent.subject})
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-slate-400">Search & select student...</span>
              )}
              <span className="text-[10px] font-bold text-[#111827] ml-2 shrink-0">
                {isDropdownOpen ? 'Close ▲' : 'Select ▼'}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="mt-1.5 p-2 bg-white rounded-2xl border border-[#E5E7EB] shadow-xl space-y-1.5 z-20 relative">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by student name, ID, class..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F4F5F7] border border-[#E5E7EB] rounded-full outline-none focus:ring-2 focus:ring-[#111827]"
                    autoFocus
                  />
                </div>

                <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
                  {filteredStudents.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-2 text-center">No matching student found</p>
                  ) : (
                    filteredStudents.map((s) => {
                      const isSelected = selectedStudent?.id === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => handleSelectStudent(s)}
                          className={`p-2 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-slate-100 text-slate-900 font-bold' : 'hover:bg-[#F8F9FB] text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 pr-2">
                            <img src={s.pic} alt="" className="w-6 h-6 rounded-lg object-cover" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold truncate">{s.firstName} {s.lastName}</p>
                              <p className="text-[9px] text-slate-400 truncate">
                                {s.id} • {s.studentClass} ({s.section || s.subject}) • Fee: Rs. {Number(s.fees || 6000).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#111827] shrink-0" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            {errors.student && <p className="text-rose-500 text-[10px] mt-1">{errors.student}</p>}
          </div>

          {/* Date & Standard Fee Row */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Receipt Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-full border border-[#E5E7EB] bg-[#F8F9FB] text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#111827] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Total Fees (Auto)
              </label>
              <input
                type="number"
                readOnly
                placeholder="Auto calculated"
                value={feeAmount}
                className="w-full px-3.5 py-2 rounded-full border border-[#E5E7EB] bg-[#F4F5F7] text-xs font-bold text-slate-700 outline-none"
              />
            </div>
          </div>

          {/* Amount Received */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-800">
                Amount Received (PKR) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-semibold">Credited to ledger</span>
            </div>
            <input
              type="number"
              placeholder="Enter fee amount in PKR"
              value={amountPaid}
              onChange={(e) => {
                setAmountPaid(e.target.value);
                if (errors.amountPaid) setErrors(prev => ({ ...prev, amountPaid: null }));
              }}
              className={`w-full px-3.5 py-2 rounded-full border ${
                errors.amountPaid ? 'border-rose-400 bg-rose-50/50' : 'border-[#E5E7EB] bg-[#F8F9FB] focus:ring-2 focus:ring-[#111827]'
              } text-xs font-bold text-slate-900 outline-none`}
            />
            {errors.amountPaid && <p className="text-rose-500 text-[10px] mt-1">{errors.amountPaid}</p>}
          </div>

          {/* Bank Selector */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Deposit Bank / Cash Counter <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              <select
                value={bankId}
                onChange={(e) => {
                  setBankId(e.target.value);
                  if (errors.bankId) setErrors(prev => ({ ...prev, bankId: null }));
                }}
                className={`w-full pl-9 pr-3.5 py-2 rounded-full border ${
                  errors.bankId ? 'border-rose-400 bg-rose-50/50' : 'border-[#E5E7EB] bg-[#F8F9FB]'
                } text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#111827] outline-none`}
              >
                <option value="" disabled>-- Select Deposit Bank / Cash Counter --</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bankName} ({b.accountName})
                  </option>
                ))}
              </select>
            </div>
            {errors.bankId && <p className="text-rose-500 text-[10px] mt-1">{errors.bankId}</p>}
          </div>

          {/* Details */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Receipt Details / Remarks
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <textarea
                rows={2}
                placeholder="e.g. Tuition fee received for September 2026"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-2xl border border-[#E5E7EB] bg-[#F8F9FB] text-xs font-medium focus:ring-2 focus:ring-[#111827] outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-full border border-[#E5E7EB] text-slate-700 font-semibold hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-full bg-[#111827] hover:bg-black text-white font-semibold shadow-sm transition-colors cursor-pointer"
            >
              Confirm Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
