import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Mail,
  Phone,
  Building2,
  Briefcase,
  DollarSign,
  Globe2,
  Calendar,
  Layers,
  Copy,
  Trash2,
  Check,
  Pencil,
  Save,
  RotateCcw,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { LeadStatusBadge, STATUS_CONFIG } from './LeadStatusBadge';
import { SOURCES_MAP } from './LeadFilters';

export const LeadDetailModal = () => {
  const {
    selectedLead,
    setSelectedLead,
    deleteLead,
    updateLead,
    updateLeadStatus,
    showToast,
  } = useAdmin();

  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    budget: '',
    message: '',
  });

  // Synchronize form data when a lead is opened or updated
  useEffect(() => {
    if (selectedLead) {
      setFormData({
        name: selectedLead.name || '',
        email: selectedLead.email || '',
        company: selectedLead.company || '',
        service: selectedLead.service || '',
        budget: selectedLead.budget || '',
        message: selectedLead.message || '',
      });
      setIsEditing(false);
    }
  }, [selectedLead]);

  if (!selectedLead) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    setFormData({
      name: selectedLead.name || '',
      email: selectedLead.email || '',
      company: selectedLead.company || '',
      service: selectedLead.service || '',
      budget: selectedLead.budget || '',
      message: selectedLead.message || '',
    });
    setIsEditing(false);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Client or lead name is required.', 'error');
      return;
    }

    if (!formData.email.trim()) {
      showToast('Contact channel (email or phone) is required.', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const res = await updateLead(selectedLead.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim(),
        service: formData.service.trim(),
        budget: formData.budget.trim(),
        message: formData.message.trim(),
      });

      if (res && res.success) {
        setIsEditing(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyAll = () => {
    const text = `Lead: ${selectedLead.name}
Contact: ${selectedLead.email}
Company: ${selectedLead.company || 'N/A'}
Service: ${selectedLead.service || 'N/A'}
Budget: ${selectedLead.budget || 'N/A'}
Source: ${selectedLead.source}
Language: ${selectedLead.lang}
Date: ${new Date(selectedLead.createdAt).toLocaleString()}
Message:
${selectedLead.message || '(No message)'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Lead details copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete inquiry from "${selectedLead.name}"?`)) {
      deleteLead(selectedLead.id);
    }
  };

  const isEmail = formData.email && formData.email.includes('@');

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setSelectedLead(null)}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 bg-gradient-to-b from-slate-50/50 dark:from-slate-800/20 to-transparent">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              {isEditing ? (
                <div className="flex-1 min-w-[200px] max-w-md">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Client or Lead Name"
                    className="w-full px-3 py-1.5 text-lg font-headline font-bold rounded-xl bg-white dark:bg-slate-800 border border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <h3 className="text-xl font-headline font-bold text-slate-900 dark:text-white truncate">
                  {selectedLead.name}
                </h3>
              )}

              <LeadStatusBadge leadId={selectedLead.id} status={selectedLead.status} />

              {isEditing && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  Editing Mode
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              Received on {new Date(selectedLead.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200/60 dark:border-slate-700/60 transition-colors"
                title="Edit Lead Details"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setSelectedLead(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Quick Status Workflow Ribbon */}
        <div className="px-6 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            Workflow Status:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => {
              const isActive = selectedLead.status === statusKey;
              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => updateLeadStatus(selectedLead.id, statusKey)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-400/40'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/60 cursor-pointer'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : cfg.dot}`} />
                  <span>{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Channel */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {isEmail ? <Mail className="w-3.5 h-3.5 text-sky-500" /> : <Phone className="w-3.5 h-3.5 text-sky-500" />}
                Contact Channel
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email or phone number"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              ) : (
                <div className="font-semibold text-slate-900 dark:text-white break-all select-all">
                  {selectedLead.email}
                </div>
              )}
            </div>

            {/* Company */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                Company / Organization
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Company name"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              ) : (
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedLead.company || 'Not Specified'}
                </div>
              )}
            </div>

            {/* Service */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-500" />
                Interested Service
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  placeholder="e.g. Web Development, AI Automation"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              ) : (
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedLead.service || 'General Inquiry'}
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                Budget Range
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="e.g. $5,000 - $10,000"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              ) : (
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedLead.budget || 'Flexible / Unspecified'}
                </div>
              )}
            </div>
          </div>

          {/* Source and Metadata Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Source: {SOURCES_MAP[selectedLead.source] || selectedLead.source}
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" /> Language: {selectedLead.lang?.toUpperCase() || 'SV'}
            </span>
            {selectedLead.ipAddress && (
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono text-[11px]">
                IP: {selectedLead.ipAddress}
              </span>
            )}
          </div>

          {/* Full Message Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Inquiry Message & Brief
              </h4>
              {isEditing && (
                <span className="text-[11px] text-slate-400">Editable brief</span>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                placeholder="Enter client message or brief..."
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white leading-relaxed text-sm resize-y"
              />
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedLead.message || (
                  <span className="italic text-slate-400">No written message provided with this submission.</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Lead</span>
          </button>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50 hover:scale-105 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving to DB...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-xs font-semibold transition-all"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>

                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy All'}</span>
                </button>

                {isEmail ? (
                  <a
                    href={`mailto:${selectedLead.email}?subject=Regarding your enquiry on RoshaLink`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reply via Email</span>
                  </a>
                ) : (
                  <a
                    href={`tel:${selectedLead.email}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Client</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
