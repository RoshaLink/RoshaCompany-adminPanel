import React from 'react';
import { useTranslation } from 'react-i18next';
import { LeadFilters } from '../components/Leads/LeadFilters';
import { LeadsTable } from '../components/Leads/LeadsTable';
import { LeadDetailModal } from '../components/Leads/LeadDetailModal';
import { Database } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const LeadsManagementPage = () => {
  const { t } = useTranslation();
  const { pagination, stats } = useAdmin();

  const newCount = stats?.statusCounts?.new || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-slate-900 dark:text-white">
              {t('leads.pageTitle')}
            </h1>
            {newCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-500 text-white animate-pulse">
                {newCount} {t('leads.newTag')}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span>{t('leads.syncNotice', { total: pagination.total })}</span>
          </p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <LeadFilters />

      {/* Inquiries Data Table & Mobile Cards */}
      <LeadsTable />

      {/* Lead Detail Inspection Modal */}
      <LeadDetailModal />
    </div>
  );
};
