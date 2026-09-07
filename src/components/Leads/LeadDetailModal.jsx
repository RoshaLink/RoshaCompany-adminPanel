import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
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
import { LeadStatusBadge, STATUS_CONFIG, getLocalizedStatus } from './LeadStatusBadge';
import { getLocalizedSource } from '../Dashboard/RecentLeadsCard';

export const LeadDetailModal = () => {
  const { t } = useTranslation();
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
      showToast(t('auth.errRequired'), 'error');
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
        showToast(t('leadDetail.saveSuccess'), 'success');
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
    showToast(t('leadDetail.copiedSuccess'), 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDelete = () => {
    if (window.confirm(t('leads.deleteConfirm', { name: selectedLead.name }))) {
      deleteLead(selectedLead.id);
    }
  };

  const isEmail = formData.email && formData.email.includes('@');

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={() => setSelectedLead(null)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh] animate-scaleUp my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-2.5 sm:gap-3 bg-gradient-to-b from-slate-50/50 dark:from-slate-800/20 to-transparent">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {isEditing ? (
                <div className="flex-1 min-w-[180px] max-w-md">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={t('common.name')}
                    className="w-full px-3 py-1.5 text-base sm:text-lg font-headline font-bold rounded-xl bg-white dark:bg-slate-800 border border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                  />
                </div>
              ) : (
                <h3 className="text-lg sm:text-xl font-headline font-bold text-slate-900 dark:text-white truncate">
                  {selectedLead.name}
                </h3>
              )}

              <LeadStatusBadge leadId={selectedLead.id} status={selectedLead.status} />

              {isEditing && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {t('leadDetail.editModeTitle')}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{t('leadDetail.createdDate')}: {new Date(selectedLead.createdAt).toLocaleString()}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200/60 dark:border-slate-700/60 transition-colors cursor-pointer"
                title={t('common.edit')}
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setSelectedLead(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Interactive Quick Status Workflow Ribbon */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 overflow-x-auto">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
            {t('leadDetail.statusSelector')}:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {Object.keys(STATUS_CONFIG).map((statusKey) => {
              const cfg = STATUS_CONFIG[statusKey];
              const isActive = selectedLead.status === statusKey;
              const label = getLocalizedStatus(statusKey, t);
              return (
                <button
                  key={statusKey}
                  type="button"
                  onClick={() => updateLeadStatus(selectedLead.id, statusKey)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-400/40'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : cfg.dot}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-sm">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Contact Channel */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                {isEmail ? <Mail className="w-3.5 h-3.5 text-sky-500" /> : <Phone className="w-3.5 h-3.5 text-sky-500" />}
                {t('leadDetail.emailOrPhone')}
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
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                {t('common.company')}
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
                  {selectedLead.company || t('common.notSpecified')}
                </div>
              )}
            </div>

            {/* Service */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-500" />
                {t('leadDetail.requestedService')}
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.service}
                  onChange={(e) => handleInputChange('service', e.target.value)}
                  placeholder="Service requested"
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
                />
              ) : (
                <div className="font-semibold text-slate-900 dark:text-white">
                  {selectedLead.service || t('common.notSpecified')}
                </div>
              )}
            </div>

            {/* Budget */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 space-y-1.5">
              <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                {t('leadDetail.estimatedBudget')}
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
                  {selectedLead.budget || t('common.notSpecified')}
                </div>
              )}
            </div>
          </div>

          {/* Source and Metadata Pill Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="px-3 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> {t('common.source')}: {getLocalizedSource(selectedLead.source, t)}
            </span>
            <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" /> {t('common.language')}: {selectedLead.lang?.toUpperCase() || 'SV'}
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
                {t('leadDetail.inquiryMessage')}
              </h4>
            </div>

            {isEditing ? (
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows={4}
                placeholder="Enter client message..."
                className="w-full p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white leading-relaxed text-sm resize-y"
              />
            ) : (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedLead.message || (
                  <span className="italic text-slate-400">{t('leadDetail.noMessage')}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t('common.delete')}</span>
          </button>

          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t('common.cancel')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{t('common.saving')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{t('common.save')}</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/80 hover:bg-sky-100 dark:hover:bg-sky-900/40 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{t('common.edit')}</span>
                </button>

                <button
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t('common.copied') : t('common.copy')}</span>
                </button>

                {isEmail ? (
                  <a
                    href={`mailto:${selectedLead.email}?subject=Regarding your enquiry on RoshaLink`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{t('common.email')}</span>
                  </a>
                ) : (
                  <a
                    href={`tel:${selectedLead.email}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('common.phone')}</span>
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
