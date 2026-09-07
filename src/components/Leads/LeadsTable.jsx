import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import {
  Inbox,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Calendar,
  Building,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { LeadStatusBadge } from './LeadStatusBadge';
import { getLocalizedSource } from '../Dashboard/RecentLeadsCard';

export const LeadsTable = () => {
  const { t } = useTranslation();
  const {
    leads,
    pagination,
    isLoading,
    setSelectedLead,
    deleteLead,
    setFilters,
  } = useAdmin();

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  if (isLoading && (!leads || leads.length === 0)) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm font-medium text-slate-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 sm:p-12 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-500 flex items-center justify-center mx-auto">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-base font-headline font-bold text-slate-800 dark:text-slate-200">
          {t('leads.noInquiriesTitle')}
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          {t('leads.noInquiriesDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View (shown only on small screens < md) */}
      <div className="md:hidden space-y-3">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => setSelectedLead(lead)}
            className="glass-card rounded-2xl p-4 space-y-3 hover:border-sky-400 transition-all cursor-pointer shadow-md"
          >
            {/* Top row: Name & Status Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {lead.name}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </div>
              </div>
              <LeadStatusBadge leadId={lead.id} status={lead.status} />
            </div>

            {/* Middle Row: Company, Service & Source */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {lead.company && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <Building className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[120px]">{lead.company}</span>
                </span>
              )}
              {lead.service && (
                <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-medium">
                  {lead.service}
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-mono">
                {getLocalizedSource(lead.source, t)}
              </span>
            </div>

            {/* Bottom Row: Date & Action Buttons */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-medium text-xs hover:bg-sky-100 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t('common.viewDetails')}</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(t('leads.deleteConfirm', { name: lead.name }))) {
                      deleteLead(lead.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                  title={t('common.delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View (shown on md and larger) */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 font-semibold">{t('leads.colClient')}</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">{t('leads.colCompany')}</th>
                <th className="py-3.5 px-4 font-semibold hidden lg:table-cell">{t('leads.colService')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('leads.colSource')}</th>
                <th className="py-3.5 px-4 font-semibold">{t('leads.colStatus')}</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">{t('leads.colDate')}</th>
                <th className="py-3.5 px-4 text-right rtl:text-left font-semibold">{t('leads.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-colors cursor-pointer group"
                >
                  {/* Name & Email */}
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                      {lead.name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{lead.email}</span>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-4 px-4 hidden md:table-cell text-slate-700 dark:text-slate-300">
                    {lead.company ? (
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[140px]">{lead.company}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Service */}
                  <td className="py-4 px-4 hidden lg:table-cell text-slate-700 dark:text-slate-300 text-xs">
                    {lead.service ? (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                        {lead.service}
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Source */}
                  <td className="py-4 px-4">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 px-2.5 py-1 rounded-lg">
                      {getLocalizedSource(lead.source, t)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <LeadStatusBadge leadId={lead.id} status={lead.status} />
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 hidden sm:table-cell text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right rtl:text-left">
                    <div className="flex items-center justify-end rtl:justify-start gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title={t('common.viewDetails')}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(t('leads.deleteConfirm', { name: lead.name }))) {
                            deleteLead(lead.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title={t('common.delete')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer (shared for both desktop and mobile) */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          <Trans
            i18nKey="leads.showingText"
            values={{ count: leads.length, total: pagination.total }}
            components={{
              1: <span className="font-semibold text-slate-900 dark:text-white" />,
              3: <span className="font-semibold text-slate-900 dark:text-white" />,
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer rtl:rotate-180"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-medium">
            {t('leads.pageText', { page: pagination.page, totalPages: pagination.totalPages || 1 })}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer rtl:rotate-180"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
