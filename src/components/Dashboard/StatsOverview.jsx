import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Inbox,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  Mail,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { GlassCard } from '../ui/GlassCard';

export const StatsOverview = () => {
  const { t } = useTranslation();
  const {
    stats,
    subscribersStats,
    isStatsLoading,
    isSubscribersLoading,
    setActiveTab,
    setFilters,
  } = useAdmin();

  const total = stats?.total || 0;
  const statusCounts = stats?.statusCounts || {};
  const newLeads = statusCounts.new || 0;
  const inProgress = statusCounts['in-progress'] || 0;
  const contacted = statusCounts.contacted || 0;
  const closed = statusCounts.closed || 0;
  const activeSubs = subscribersStats?.active || 0;

  const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

  const cards = [
    {
      title: t('dashboard.cardTotalTitle'),
      titleShort: t('dashboard.cardTotalTitleShort'),
      value: isStatsLoading ? '...' : total,
      subtext: t('dashboard.cardTotalSubtext'),
      subtextShort: t('dashboard.cardTotalSubtextShort'),
      icon: Inbox,
      gradient: 'from-sky-500 to-blue-600',
      action: () => {
        setFilters((prev) => ({ ...prev, status: 'all', page: 1 }));
        setActiveTab('leads');
      },
    },
    {
      title: t('dashboard.cardNewTitle'),
      titleShort: t('dashboard.cardNewTitleShort'),
      value: isStatsLoading ? '...' : newLeads,
      subtext: t('dashboard.cardNewSubtext'),
      subtextShort: t('dashboard.cardNewSubtextShort'),
      icon: Sparkles,
      gradient: 'from-sky-400 to-cyan-500',
      highlight: newLeads > 0,
      action: () => {
        setFilters((prev) => ({ ...prev, status: 'new', page: 1 }));
        setActiveTab('leads');
      },
    },
    {
      title: t('dashboard.cardDiscussionTitle'),
      titleShort: t('dashboard.cardDiscussionTitleShort'),
      value: isStatsLoading ? '...' : inProgress + contacted,
      subtext: `${inProgress + contacted} ${t('dashboard.cardDiscussionSubtext')}`,
      subtextShort: `${inProgress + contacted} ${t('dashboard.cardDiscussionSubtextShort')}`,
      icon: Clock,
      gradient: 'from-amber-400 to-orange-500',
      action: () => {
        setFilters((prev) => ({ ...prev, status: 'in-progress', page: 1 }));
        setActiveTab('leads');
      },
    },
    {
      title: t('dashboard.cardConvertedTitle'),
      titleShort: t('dashboard.cardConvertedTitleShort'),
      value: isStatsLoading ? '...' : closed,
      subtext: `${conversionRate}% ${t('dashboard.cardConvertedSubtext')}`,
      subtextShort: `${conversionRate}% ${t('dashboard.cardConvertedSubtextShort')}`,
      icon: CheckCircle2,
      gradient: 'from-emerald-400 to-teal-500',
      action: () => {
        setFilters((prev) => ({ ...prev, status: 'closed', page: 1 }));
        setActiveTab('leads');
      },
    },
    {
      title: t('dashboard.cardSubsTitle'),
      titleShort: t('dashboard.cardSubsTitleShort'),
      value: isSubscribersLoading ? '...' : activeSubs,
      subtext: `${subscribersStats?.total || 0} ${t('dashboard.cardSubsSubtext')}`,
      subtextShort: `${subscribersStats?.total || 0} ${t('dashboard.cardSubsSubtextShort')}`,
      icon: Mail,
      gradient: 'from-purple-500 to-indigo-600',
      highlight: activeSubs > 0,
      action: () => {
        setActiveTab('newsletter');
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 xs:gap-2.5 sm:gap-4 mb-4 sm:mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <GlassCard
            key={idx}
            onClick={card.action}
            className="group relative cursor-pointer hover:border-sky-400 transition-all p-2.5 xs:p-3 sm:p-5 rounded-xl sm:rounded-2xl"
          >
            {/* Top Row: Title and Icon */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-1.5 xs:mb-2 sm:mb-4">
              <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate">
                <span className="sm:hidden">{card.titleShort || card.title}</span>
                <span className="hidden sm:inline">{card.title}</span>
              </span>
              <div
                className={`w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform shrink-0`}
              >
                <Icon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1 xs:gap-1.5 sm:gap-2 mb-0.5 xs:mb-1">
              <span className="text-base xs:text-lg sm:text-2xl lg:text-3xl font-headline font-bold text-slate-900 dark:text-white leading-tight">
                {card.value}
              </span>
              {card.highlight && (
                <span className="inline-flex items-center px-1 xs:px-1.5 py-0.5 rounded text-[8px] xs:text-[9px] sm:text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                  {t('common.active')}
                </span>
              )}
            </div>

            {/* Subtext */}
            <div className="text-[9px] xs:text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 flex items-center justify-between">
              <span className="truncate">
                <span className="sm:hidden">{card.subtextShort || card.subtext}</span>
                <span className="hidden sm:inline">{card.subtext}</span>
              </span>
              <TrendingUp className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 rtl:rotate-180 hidden sm:block" />
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
