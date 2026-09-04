import React from 'react';
import { StatsOverview } from '../components/Dashboard/StatsOverview';
import { SourceDistribution } from '../components/Dashboard/SourceDistribution';
import { RecentLeadsCard } from '../components/Dashboard/RecentLeadsCard';
import { Sparkles, ArrowRight, Inbox, Mail } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const DashboardPage = () => {
  const { setActiveTab } = useAdmin();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-200/50 dark:border-sky-800/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>RoshaLink Agency Live Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 dark:text-white">
            Inquiries & Business Leads Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
            Real-time control center for incoming client requests, contact submissions, and Rosha AI chats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('newsletter')}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all hover:scale-105 cursor-pointer"
          >
            <Mail className="w-4 h-4 text-sky-500" />
            <span>Subscribers</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-105 cursor-pointer"
          >
            <Inbox className="w-4 h-4" />
            <span>Manage Inquiries</span>
            <ArrowRight className="w-4 h-4" />
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
