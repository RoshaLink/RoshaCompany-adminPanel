import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Globe2, Target, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { GlassCard } from '../components/ui/GlassCard';
import { SourceDistribution } from '../components/Dashboard/SourceDistribution';
import { STATUS_CONFIG, getLocalizedStatus } from '../components/Leads/LeadStatusBadge';

export const AnalyticsPage = () => {
  const { t } = useTranslation();
  const { stats, leads } = useAdmin();

  const total = stats?.total || 0;
  const statusCounts = stats?.statusCounts || {};

  // Language count calculation from active leads
  const langCounts = (leads || []).reduce((acc, lead) => {
    const lang = (lead.lang || 'sv').toUpperCase();
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});

  const conversionPercentage = total > 0 ? Math.round(((statusCounts.closed || 0) / total) * 100) : 0;
  const activeDiscussionCount = (statusCounts['in-progress'] || 0) + (statusCounts.contacted || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold text-slate-900 dark:text-white">
          {t('analytics.pageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t('analytics.pageSubtitle')}
        </p>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
        <GlassCard className="space-y-2.5 sm:space-y-3 p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>{t('analytics.pipelineConversion')}</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-headline font-bold text-slate-900 dark:text-white">
            {conversionPercentage}%
          </div>
          <p className="text-xs text-slate-500">
            {t('analytics.closedOfTotal', { closed: statusCounts.closed || 0, total })}
          </p>
        </GlassCard>

        <GlassCard className="space-y-3 p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>{t('analytics.activeDiscussions')}</span>
            <TrendingUp className="w-4 h-4 text-sky-500 rtl:rotate-180" />
          </div>
          <div className="text-3xl font-headline font-bold text-slate-900 dark:text-white">
            {activeDiscussionCount}
          </div>
          <p className="text-xs text-slate-500">
            {t('analytics.leadsUnderReview')}
          </p>
        </GlassCard>

        <GlassCard className="space-y-3 p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>{t('analytics.unprocessed')}</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-headline font-bold text-slate-900 dark:text-white">
            {statusCounts.new || 0}
          </div>
          <p className="text-xs text-slate-500">
            {t('analytics.awaitingResponse')}
          </p>
        </GlassCard>
      </div>

      {/* Pipeline Status Breakdown & Source Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown Bar */}
        <GlassCard className="space-y-5 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              {t('analytics.leadStatusPipeline')}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {t('analytics.inquiriesCount', { count: total })}
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => {
              const count = statusCounts[key] || 0;
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              const label = getLocalizedStatus(key, t);
              return (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {label}
                      </span>
                    </div>
                    <span className="font-mono text-slate-500">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${config.dot} transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, count > 0 ? 4 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Source Distribution */}
        <SourceDistribution />
      </div>

      {/* Languages & Locales Breakdown */}
      <GlassCard className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-teal-500" />
          <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white">
            {t('analytics.languagesBreakdown')}
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-2">
          {[
            { code: 'SV', label: 'Svenska 🇸🇪' },
            { code: 'EN', label: 'English 🇬🇧' },
            { code: 'FA', label: 'فارسی 🇮🇷' },
            { code: 'AR', label: 'العربية 🇦🇪' },
          ].map((item) => {
            const count = langCounts[item.code] || 0;
            return (
              <div
                key={item.code}
                className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 text-center"
              >
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.label}</div>
                <div className="text-xl sm:text-2xl font-bold font-headline text-slate-900 dark:text-white mt-1">
                  {count}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                  {t('dashboard.overviewTitle').split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
