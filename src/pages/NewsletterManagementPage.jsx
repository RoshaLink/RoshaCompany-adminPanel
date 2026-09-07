import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  Search,
  Copy,
  Check,
  Download,
  Trash2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserX,
  Globe,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const NewsletterManagementPage = () => {
  const { t } = useTranslation();
  const {
    subscribers,
    subscribersPagination,
    subscribersStats,
    isSubscribersLoading,
    subscribersFilters,
    setSubscribersFilters,
    fetchSubscribers,
    fetchNewsletterStats,
    deleteSubscriber,
    updateSubscriberStatus,
    showToast,
  } = useAdmin();

  const [copied, setCopied] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const total = subscribersStats?.total || 0;
  const active = subscribersStats?.active || 0;
  const unsubscribed = subscribersStats?.unsubscribed || 0;
  const last30Days = subscribersStats?.last30Days || 0;

  const handleSearchChange = (e) => {
    setSubscribersFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusFilterChange = (status) => {
    setSubscribersFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= subscribersPagination.totalPages) {
      setSubscribersFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Copy all visible/active emails as comma-separated list
  const handleCopyEmails = () => {
    if (!subscribers || subscribers.length === 0) {
      showToast(t('newsletter.noEmailsToCopy'), 'error');
      return;
    }
    const emailsList = subscribers
      .filter((s) => s.status === 'active')
      .map((s) => s.email)
      .join(', ');

    if (!emailsList) {
      showToast(t('newsletter.noEmailsToCopy'), 'error');
      return;
    }

    navigator.clipboard.writeText(emailsList).then(() => {
      setCopied(true);
      showToast(t('newsletter.copySuccess'), 'success');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Export subscribers to CSV file
  const handleExportCSV = () => {
    if (!subscribers || subscribers.length === 0) {
      showToast('No subscriber data to export', 'error');
      return;
    }

    const headers = ['Email', 'Status', 'Language', 'Subscribed At', 'IP Address'];
    const rows = subscribers.map((sub) => [
      `"${sub.email}"`,
      `"${sub.status}"`,
      `"${sub.lang || 'sv'}"`,
      `"${new Date(sub.createdAt).toISOString()}"`,
      `"${sub.ipAddress || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roshalink_newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(t('common.copied'), 'success');
  };

  const handleConfirmDelete = async (id) => {
    await deleteSubscriber(id);
    setDeleteConfirmId(null);
  };

  const filterLabels = {
    all: t('newsletter.filterAll'),
    active: t('newsletter.filterActive'),
    unsubscribed: t('newsletter.filterUnsubscribed'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-slate-900 dark:text-white">
              {t('newsletter.pageTitle')}
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-500 text-white">
              {active} {t('common.active')}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('newsletter.pageSubtitle')}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button
            onClick={() => {
              fetchSubscribers();
              fetchNewsletterStats();
              showToast(t('common.refresh'), 'info');
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            title={t('common.refresh')}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSubscribersLoading ? 'animate-spin' : ''}`} />
            <span>{t('common.refresh')}</span>
          </button>

          <button
            onClick={handleCopyEmails}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer"
            title={t('newsletter.copyActiveEmails')}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t('common.copied') : t('newsletter.copyActiveEmails')}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            title={t('common.exportCsv')}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('common.exportCsv')}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{t('newsletter.totalSubs')}</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-500">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-headline">
            {total}
          </div>
          <div className="text-[11px] text-slate-400">{t('dashboard.cardSubsSubtext')}</div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{t('newsletter.activeSubs')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-headline">
            {active}
          </div>
          <div className="text-[11px] text-slate-400">{t('common.active')}</div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{t('newsletter.unsubscribedSubs')}</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-700 dark:text-slate-300 font-headline">
            {unsubscribed}
          </div>
          <div className="text-[11px] text-slate-400">{t('newsletter.unsubscribedSubs')}</div>
        </div>

        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>{t('newsletter.last30Days')}</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500">
              <TrendingUp className="w-4 h-4 rtl:rotate-180" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 font-headline">
            +{last30Days}
          </div>
          <div className="text-[11px] text-slate-400">{t('newsletter.last30Days')}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={subscribersFilters.search}
            onChange={handleSearchChange}
            placeholder={t('newsletter.searchPlaceholder')}
            className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'active', 'unsubscribed'].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusFilterChange(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                subscribersFilters.status === st
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {filterLabels[st] || st}
            </button>
          ))}
        </div>
      </div>

      {/* Table / Mobile Cards */}
      {isSubscribersLoading && (!subscribers || subscribers.length === 0) ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">{t('common.loading')}</p>
        </div>
      ) : !subscribers || subscribers.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 sm:p-12 text-center space-y-3 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-500 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-base font-headline font-bold text-slate-800 dark:text-slate-200">
            {t('newsletter.noSubsTitle')}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('newsletter.noSubsDesc')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Mobile Card View (shown on screens < md) */}
          <div className="md:hidden space-y-3">
            {subscribers.map((sub) => {
              const isActive = sub.status === 'active';
              const isDeleting = deleteConfirmId === sub.id;
              return (
                <div
                  key={sub.id}
                  className="glass-card rounded-2xl p-4 space-y-3 border border-slate-200/80 dark:border-slate-800/80 shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate select-all">
                        {sub.email}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {isActive ? t('common.active') : t('newsletter.unsubscribedSubs')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                      <Globe className="w-3 h-3 text-slate-400" />
                      {sub.lang || 'sv'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateSubscriberStatus(sub.id, isActive ? 'unsubscribed' : 'active')}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {isActive ? t('newsletter.unsubscribeBtn') : t('newsletter.reactivateBtn')}
                      </button>

                      {isDeleting ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleConfirmDelete(sub.id)}
                            className="text-xs px-2 py-1 rounded-lg bg-rose-500 text-white font-bold"
                          >
                            {t('common.confirm')}
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-xs px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                          >
                            {t('common.cancel')}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(sub.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (md and larger) */}
          <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 shadow-xl hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">{t('newsletter.colEmail')}</th>
                    <th className="py-3.5 px-4">{t('newsletter.colStatus')}</th>
                    <th className="py-3.5 px-4">{t('newsletter.colLang')}</th>
                    <th className="py-3.5 px-4">{t('newsletter.colDate')}</th>
                    <th className="py-3.5 px-4 text-right rtl:text-left pr-6 rtl:pr-4 rtl:pl-6">{t('newsletter.colActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {subscribers.map((sub) => {
                    const isActive = sub.status === 'active';
                    const isDeleting = deleteConfirmId === sub.id;

                    return (
                      <tr
                        key={sub.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Email */}
                        <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                              <Mail className="w-4 h-4" />
                            </div>
                            <span className="font-mono text-xs sm:text-sm font-semibold select-all">
                              {sub.email}
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {isActive ? t('common.active') : t('newsletter.unsubscribedSubs')}
                          </span>
                        </td>

                        {/* Language */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                            <Globe className="w-3 h-3 text-slate-400 shrink-0" />
                            {sub.lang || 'sv'}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right rtl:text-left pr-6 rtl:pr-4 rtl:pl-6">
                          <div className="flex items-center justify-end rtl:justify-start gap-2">
                            <button
                              onClick={() => updateSubscriberStatus(sub.id, isActive ? 'unsubscribed' : 'active')}
                              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                              title={isActive ? t('newsletter.unsubscribeBtn') : t('newsletter.reactivateBtn')}
                            >
                              {isActive ? t('newsletter.unsubscribeBtn') : t('newsletter.reactivateBtn')}
                            </button>

                            {isDeleting ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleConfirmDelete(sub.id)}
                                  className="text-xs px-2 py-1 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors cursor-pointer"
                                >
                                  {t('common.confirm')}
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="text-xs px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                >
                                  {t('common.cancel')}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(sub.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title={t('common.delete')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {subscribersPagination.totalPages > 1 && (
            <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
              <div>
                {t('leads.pageText', { page: subscribersPagination.page, totalPages: subscribersPagination.totalPages })} ({t('common.total')}: {subscribersPagination.total})
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(subscribersPagination.page - 1)}
                  disabled={!subscribersPagination.hasPrev}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer rtl:rotate-180"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(subscribersPagination.page + 1)}
                  disabled={!subscribersPagination.hasNext}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer rtl:rotate-180"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
