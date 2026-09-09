import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, ArrowRight, Mail } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { GlassCard } from '../ui/GlassCard';
import { LeadStatusBadge } from '../Leads/LeadStatusBadge';

export const getLocalizedSource = (sourceKey, t) => {
  const map = {
    'connect-with-us': t('leads.sourceConnect'),
    contact: t('leads.sourceContact'),
    'get-started': t('leads.sourceGetStarted'),
    chat: t('leads.sourceChat'),
  };
  return map[sourceKey] || sourceKey;
};

export const RecentLeadsCard = () => {
  const { t } = useTranslation();
  const { stats, setSelectedLead, setActiveTab } = useAdmin();
  const recentLeads = stats?.recentLeads || [];

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-500" />
          <h3 className="font-headline font-bold text-sm text-slate-900 dark:text-white">
            {t('dashboard.recentTitle')}
          </h3>
        </div>
        <button
          onClick={() => setActiveTab('leads')}
          className="text-xs font-semibold text-sky-500 hover:text-sky-600 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <span>{t('common.viewAll')}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </button>
      </div>

      {recentLeads.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          {t('dashboard.noRecent')}
        </div>
      ) : (
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {recentLeads.map((lead) => (
            <div
              key={lead._id || lead.id}
              onClick={() => setSelectedLead({ ...lead, id: lead.id || lead._id })}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 p-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="min-w-0">
                <div className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors truncate">
                  {lead.name}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{lead.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] text-slate-400 hidden sm:inline">
                  {getLocalizedSource(lead.source, t)}
                </span>
                <LeadStatusBadge leadId={lead._id || lead.id} status={lead.status} editable={false} />
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};
