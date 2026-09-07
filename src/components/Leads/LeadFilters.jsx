import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Download, X } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { getLocalizedStatus } from './LeadStatusBadge';
import { getLocalizedSource } from '../Dashboard/RecentLeadsCard';

export const LeadFilters = () => {
  const { t } = useTranslation();
  const { filters, setFilters, leads } = useAdmin();

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
  };

  const handleSourceChange = (e) => {
    setFilters((prev) => ({ ...prev, source: e.target.value, page: 1 }));
  };

  const resetFilters = () => {
    setFilters({ search: '', status: 'all', source: 'all', page: 1, limit: 15 });
  };

  const exportToCSV = () => {
    if (!leads || leads.length === 0) return;

    const headers = ['ID', 'Name', 'Email/Phone', 'Company', 'Service', 'Budget', 'Source', 'Language', 'Status', 'CreatedAt', 'Message'];
    const rows = leads.map((l) => [
      l.id,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.service || '').replace(/"/g, '""')}"`,
      `"${(l.budget || '').replace(/"/g, '""')}"`,
      l.source,
      l.lang,
      l.status,
      new Date(l.createdAt).toLocaleString(),
      `"${(l.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `roshalink_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.source !== 'all';

  const statusOptions = [
    { key: 'all', label: t('leads.allStatuses') },
    { key: 'new', label: t('leads.statusNew') },
    { key: 'in-progress', label: t('leads.statusInProgress') },
    { key: 'contacted', label: t('leads.statusContacted') },
    { key: 'closed', label: t('leads.statusClosed') },
    { key: 'archived', label: t('leads.statusArchived') },
  ];

  const sourceOptions = [
    { key: 'all', label: t('leads.allSources') },
    { key: 'connect-with-us', label: t('leads.sourceConnect') },
    { key: 'contact', label: t('leads.sourceContact') },
    { key: 'get-started', label: t('leads.sourceGetStarted') },
    { key: 'chat', label: t('leads.sourceChat') },
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={handleSearch}
          placeholder={t('leads.searchPlaceholder')}
          className="w-full pl-10 rtl:pl-10 rtl:pr-10 pr-10 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm placeholder-slate-400 transition-all shadow-sm"
        />
        {filters.search && (
          <button
            onClick={() => setFilters((p) => ({ ...p, search: '', page: 1 }))}
            className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Select Dropdowns & Export */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Status Filter */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="w-full pl-3 rtl:pl-8 rtl:pr-3 pr-8 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 dark:text-slate-200 shadow-sm appearance-none cursor-pointer"
          >
            {statusOptions.map((opt) => (
              <option key={opt.key} value={opt.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Source Filter */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filters.source}
            onChange={handleSourceChange}
            className="w-full pl-3 rtl:pl-8 rtl:pr-3 pr-8 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-700 dark:text-slate-200 shadow-sm appearance-none cursor-pointer"
          >
            {sourceOptions.map((opt) => (
              <option key={opt.key} value={opt.key} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {opt.label}
              </option>
            ))}
          </select>
          <Filter className="w-3.5 h-3.5 absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            {t('common.reset')}
          </button>
        )}

        {/* CSV Export Button */}
        <button
          onClick={exportToCSV}
          disabled={!leads || leads.length === 0}
          className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-sky-600 dark:hover:bg-sky-400 text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          <span>{t('common.exportCsv')}</span>
        </button>
      </div>
    </div>
  );
};
