import React from 'react';
import { Layers, ArrowUpRight } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { GlassCard } from '../ui/GlassCard';
import { SOURCES_MAP } from '../Leads/LeadFilters';

export const SourceDistribution = () => {
  const { stats, setFilters, setActiveTab } = useAdmin();

  const sourceCounts = stats?.sourceCounts || {};
  const total = stats?.total || 1; // avoid divide by 0

  const sourceColors = {
    'connect-with-us': { bg: 'bg-sky-500', bar: 'bg-gradient-to-r from-sky-400 to-blue-500' },
    contact: { bg: 'bg-indigo-500', bar: 'bg-gradient-to-r from-indigo-400 to-purple-500' },
    'get-started': { bg: 'bg-teal-500', bar: 'bg-gradient-to-r from-teal-400 to-emerald-500' },
    chat: { bg: 'bg-pink-500', bar: 'bg-gradient-to-r from-pink-400 to-rose-500' },
  };

  const handleSourceClick = (srcKey) => {
    setFilters((p) => ({ ...p, source: srcKey, page: 1 }));
    setActiveTab('leads');
  };

  return (
    <GlassCard className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-500" />
          <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white">
            Inquiries by Component
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Conversion Funnels</span>
      </div>

      <div className="space-y-4">
        {Object.entries(SOURCES_MAP)
          .filter(([k]) => k !== 'all')
          .map(([key, label]) => {
            const count = sourceCounts[key] || 0;
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const colors = sourceColors[key] || { bg: 'bg-slate-500', bar: 'bg-slate-400' };

            return (
              <div
                key={key}
                onClick={() => handleSourceClick(key)}
                className="group cursor-pointer space-y-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-sky-500 transition-colors flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${colors.bg}`} />
                    {label}
                  </span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{count}</span>
                    <span className="text-slate-400">({percentage}%)</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-sky-500 transition-opacity" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colors.bar} transition-all duration-500`}
                    style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </GlassCard>
  );
};
