import React from 'react';
import {
  Inbox,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Clock,
  TrendingUp,
  Mail,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { GlassCard } from '../ui/GlassCard';

export const StatsOverview = () => {
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
      title: 'Total Inquiries',
      value: isStatsLoading ? '...' : total,
      subtext: 'All time submissions',
      icon: Inbox,
      gradient: 'from-sky-500 to-blue-600',
      action: () => {
        setFilters((prev) => ({ ...prev, status: 'all', page: 1 }));
        setActiveTab('leads');
      },
    },
    {
      title: 'New Leads',
      value: isStatsLoading ? '...' : newLeads,
      subtext: 'Awaiting first contact',
      icon: Sparkles,
      gradient: 'from-sky-400 to-cyan-500',
      highlight: newLeads > 0,
      action: () => {
        setFilters((prev) => ({ ...prev, status: 'new', page: 1 }));
        setActiveTab('leads');
      },
    },
    {
      title: 'In Discussion',
      value: isStatsLoading ? '...' : inProgress + contacted,
      subtext: `${inProgress} in-progress, ${contacted} contacted`,
      icon: Clock,
      gradient: 'from-amber-400 to-orange-500',
      action: () => {
        setFilters((prev) => ({ ...prev, status: 'in-progress', page: 1 }));
        setActiveTab('leads');
      },
    },
    {
      title: 'Converted',
      value: isStatsLoading ? '...' : closed,
      subtext: `${conversionRate}% conversion rate`,
      icon: CheckCircle2,
      gradient: 'from-emerald-400 to-teal-500',
      action: () => {
        setFilters((prev) => ({ ...prev, status: 'closed', page: 1 }));
        setActiveTab('leads');
      },
    },
    {
      title: 'Subscribers',
      value: isSubscribersLoading ? '...' : activeSubs,
      subtext: `${subscribersStats?.total || 0} total registered`,
      icon: Mail,
      gradient: 'from-purple-500 to-indigo-600',
      highlight: activeSubs > 0,
      action: () => {
        setActiveTab('newsletter');
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <GlassCard
            key={idx}
            onClick={card.action}
            className="group relative cursor-pointer"
          >
            {/* Top Row: Title and Icon */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.gradient} flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-headline font-bold text-slate-900 dark:text-white">
                {isStatsLoading ? '...' : card.value}
              </span>
              {card.highlight && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
                  Active
                </span>
              )}
            </div>

            {/* Subtext */}
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>{card.subtext}</span>
              <TrendingUp className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
