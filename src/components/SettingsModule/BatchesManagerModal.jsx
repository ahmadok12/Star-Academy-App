import React, { useState } from 'react';
import {
  X,
  Layers,
  Plus,
  Pencil,
  Trash2,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Clock
} from 'lucide-react';
import { INITIAL_BATCHES, generateNextBatchId } from '../../utils/storage';

export default function BatchesManagerModal({
  isOpen,
  onClose,
  batches = [],
  onSaveBatches
}) {
  const [newBatchName, setNewBatchName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  if (!isOpen) return null;

  const showNotice = (msg, isError = false) => {
    if (isError) {
      setErrorNotice(msg);
      setTimeout(() => setErrorNotice(''), 3000);
    } else {
      setSuccessNotice(msg);
      setTimeout(() => setSuccessNotice(''), 2500);
    }
  };

  // Add Batch
  const handleAddBatch = (e) => {
    if (e) e.preventDefault();
    const trimmed = newBatchName.trim();
    if (!trimmed) {
      showNotice('Please enter a batch name', true);
      return;
    }

    // Check duplicate
    const exists = batches.some(
      (b) => (b.name || b).toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showNotice(`"${trimmed}" batch already exists!`, true);
      return;
    }

    const newBatch = {
      id: generateNextBatchId(batches),
      name: trimmed,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const updated = [...batches, newBatch];
    onSaveBatches(updated);
    setNewBatchName('');
    showNotice(`Batch "${trimmed}" added successfully!`);
  };

  // Start Edit
  const handleStartEdit = (batch) => {
    setEditingId(batch.id);
    setEditValue(batch.name || '');
    setDeleteConfirmId(null);
    setErrorNotice('');
  };

  // Save Edit
  const handleSaveEdit = (batchId) => {
    const trimmed = editValue.trim();
    if (!trimmed) {
      showNotice('Batch name cannot be empty', true);
      return;
    }

    const exists = batches.some(
      (b) => b.id !== batchId && (b.name || b).toLowerCase() === trimmed.toLowerCase()
    );
    if (exists) {
      showNotice(`Batch "${trimmed}" already exists!`, true);
      return;
    }

    const updated = batches.map((b) =>
      b.id === batchId ? { ...b, name: trimmed } : b
    );
    onSaveBatches(updated);
    setEditingId(null);
    setEditValue('');
    showNotice(`Batch updated to "${trimmed}"!`);
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // Delete Batch
  const handleDeleteBatch = (batchId, batchName) => {
    if (batches.length <= 1) {
      showNotice('At least one batch should be maintained.', true);
      setDeleteConfirmId(null);
      return;
    }

    const updated = batches.filter((b) => b.id !== batchId);
    onSaveBatches(updated);
    setDeleteConfirmId(null);
    if (editingId === batchId) setEditingId(null);
    showNotice(`Batch "${batchName}" removed.`);
  };

  // Reset to default batches
  const handleResetDefaults = () => {
    onSaveBatches(INITIAL_BATCHES);
    setEditingId(null);
    setDeleteConfirmId(null);
    showNotice('Default batches restored!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-5 py-4 bg-[#111827] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold tracking-tight flex items-center gap-1.5">
                <span>Batches Master</span>
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                Add, edit, or remove academy batch timings and cohorts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/15 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1 bg-slate-50/50">
          {/* Notifications */}
          {errorNotice && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorNotice}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Quick Info Box */}
          <div className="bg-slate-100 p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Clock className="w-3.5 h-3.5 text-slate-700" />
              <span>Academy Cohorts & Schemes of Study:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Batches configured here appear in the Scheme of Study selector dropdown, allowing curriculum timelines to be targeted per batch (e.g., Morning, Evening, Weekend).
            </p>
          </div>

          {/* Add Batch Input Card */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Add New Batch:
            </label>
            <form onSubmit={handleAddBatch} className="flex gap-2">
              <input
                type="text"
                value={newBatchName}
                onChange={(e) => setNewBatchName(e.target.value)}
                placeholder="e.g. Morning Batch, Evening Batch, Weekend Batch"
                className="flex-1 text-xs font-medium bg-slate-50 px-3.5 py-2.5 rounded-full border border-slate-200 focus:border-slate-400 focus:bg-white outline-none transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-full bg-[#111827] hover:bg-black active:scale-98 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Batch</span>
              </button>
            </form>
          </div>

          {/* Batches List Card */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Configured Batches
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10.5px] font-bold">
                  {batches.length}
                </span>
              </div>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Restore default batches"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Defaults</span>
              </button>
            </div>

            {batches.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No batches configured yet. Add your first batch above!
              </div>
            ) : (
              <div className="space-y-2">
                {batches.map((batch) => {
                  const bId = batch.id;
                  const bName = batch.name || batch;
                  const isEditingThis = editingId === bId;
                  const isConfirmingDelete = deleteConfirmId === bId;

                  return (
                    <div
                      key={bId}
                      className="p-2.5 rounded-2xl border border-slate-100 hover:border-slate-300 bg-slate-50/70 flex items-center justify-between gap-2 transition-all"
                    >
                      {isEditingThis ? (
                        <div className="flex items-center gap-1.5 flex-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit(bId);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            autoFocus
                            className="flex-1 text-xs font-bold bg-white px-3 py-1.5 rounded-full border border-slate-300 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(bId)}
                            className="w-7 h-7 rounded-full bg-[#111827] hover:bg-black text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer border border-slate-200"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : isConfirmingDelete ? (
                        <div className="flex items-center justify-between w-full bg-rose-50 p-2.5 rounded-2xl border border-rose-200 animate-in fade-in">
                          <span className="text-[11px] font-bold text-rose-800">
                            Delete "{bName}"?
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeleteBatch(bId, bName)}
                              className="px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10.5px] font-bold transition-all cursor-pointer"
                            >
                              Yes, Delete
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-3 py-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10.5px] font-bold transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
                              <Layers className="w-3.5 h-3.5" />
                            </span>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-800 truncate">
                                {bName}
                              </h4>
                              {batch.createdAt && (
                                <span className="text-[10px] text-slate-400 font-medium">
                                  Created: {batch.createdAt}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(batch)}
                              className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white flex items-center justify-center transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                              title="Edit batch name"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(bId)}
                              className="w-7 h-7 rounded-full text-slate-400 hover:text-rose-600 hover:bg-white flex items-center justify-center transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                              title="Remove batch"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
