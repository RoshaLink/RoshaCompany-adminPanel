import React from 'react';
import { useTranslation } from 'react-i18next';
import { StatsOverview } from '../components/Dashboard/StatsOverview';
import { SourceDistribution } from '../components/Dashboard/SourceDistribution';
import { RecentLeadsCard } from '../components/Dashboard/RecentLeadsCard';
import { Sparkles, ArrowRight, Inbox, Mail } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { setActiveTab } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-5 sm:p-7 lg:p-8 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-200/50 dark:border-sky-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>{t('dashboard.livePortal')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-slate-900 dark:text-white leading-snug">
            {t('dashboard.overviewTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            {t('dashboard.overviewSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('newsletter')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-sky-500" />
            <span>{t('dashboard.btnSubscribers')}</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-105 cursor-pointer"
          >
            <Inbox className="w-4 h-4" />
            <span>{t('dashboard.btnManageInquiries')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* KPI Metrics */}
      <StatsOverview />

      {/* Grid: Source Distribution & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SourceDistribution />
        <RecentLeadsCard />
      </div>
    </div>
  );
};
