import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';

export const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { changePassword } = useAuth();
  const { showToast } = useAdmin();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const isMinLength = newPassword.length >= 8;
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isDifferentFromCurrent = currentPassword.length > 0 && newPassword !== currentPassword;
  const canSubmit = isMinLength && isMatch && currentPassword.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword) {
      setErrorMessage(t('auth.errRequired'));
      return;
    }

    if (!isMinLength) {
      setErrorMessage(t('changePassword.reqLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(t('changePassword.reqMatch'));
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage(t('changePassword.reqDifferent'));
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await changePassword(currentPassword, newPassword);

      if (res.success) {
        setSuccessMessage(t('changePassword.successAlert'));
        showToast(t('toast.passwordChanged'), 'success');
        setTimeout(() => {
          handleClose();
        }, 1800);
      } else {
        setErrorMessage(res.error || t('toast.errorOccurred'));
      }
    } catch (err) {
      setErrorMessage(err.message || t('toast.errorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrorMessage('');
    setSuccessMessage('');
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 bg-gradient-to-b from-slate-50/50 dark:from-slate-800/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-500 border border-sky-200 dark:border-sky-800 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-headline font-bold text-slate-900 dark:text-white">
                {t('changePassword.modalTitle')}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                {t('changePassword.modalSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-sm">
          {/* Status Banners */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Current Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
              {t('changePassword.currentPassword')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t('changePassword.currentPlaceholder')}
                required
                className="w-full pl-9 rtl:pl-10 rtl:pr-9 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="p-1.5 absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
              {t('changePassword.newPassword')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t('changePassword.newPlaceholder')}
                required
                className="w-full pl-9 rtl:pl-10 rtl:pr-9 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="p-1.5 absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
              {t('changePassword.confirmPassword')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t('changePassword.confirmPlaceholder')}
                required
                className="w-full pl-9 rtl:pl-10 rtl:pr-9 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="p-1.5 absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5 text-xs">
            <div className="text-[11px] font-bold uppercase text-slate-400">
              {t('changePassword.reqTitle')}
            </div>
            <div className={`flex items-center gap-2 ${isMinLength ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('changePassword.reqLength')}</span>
            </div>
            <div className={`flex items-center gap-2 ${isMatch ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('changePassword.reqMatch')}</span>
            </div>
            <div className={`flex items-center gap-2 ${isDifferentFromCurrent ? 'text-emerald-500 font-medium' : 'text-slate-400'}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('changePassword.reqDifferent')}</span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {t('common.cancel')}
            </button>

            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 disabled:opacity-40 transition-all cursor-pointer"
            >
              {isSubmitting ? t('changePassword.updating') : t('changePassword.submitButton')}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
