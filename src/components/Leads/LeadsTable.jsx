import React from 'react';
import {
  Inbox,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Calendar,
  Building,
  Mail,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { LeadStatusBadge } from './LeadStatusBadge';
import { SOURCES_MAP } from './LeadFilters';

export const LeadsTable = () => {
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
        <p className="text-sm font-medium text-slate-500">Querying inquiries from MongoDB...</p>
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-500 flex items-center justify-center mx-auto">
          <Inbox className="w-7 h-7" />
        </div>
        <h3 className="text-base font-headline font-bold text-slate-800 dark:text-slate-200">
          No Inquiries Found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          There are currently no customer inquiries matching your active filters or in MongoDB.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Client / Contact</th>
                <th className="py-3.5 px-4 font-semibold hidden md:table-cell">Company</th>
                <th className="py-3.5 px-4 font-semibold hidden lg:table-cell">Service</th>
                <th className="py-3.5 px-4 font-semibold">Source</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold hidden sm:table-cell">Date</th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
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
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[180px]">{lead.email}</span>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-4 px-4 hidden md:table-cell text-slate-700 dark:text-slate-300">
                    {lead.company ? (
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
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
                      {SOURCES_MAP[lead.source] || lead.source}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <LeadStatusBadge leadId={lead.id} status={lead.status} />
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 hidden sm:table-cell text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete inquiry from ${lead.name}?`)) {
                            deleteLead(lead.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                        title="Delete Inquiry"
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

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{leads.length}</span> of{' '}
            <span className="font-semibold text-slate-900 dark:text-white">{pagination.total}</span> inquiries
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-medium">
              Page {pagination.page} of {pagination.totalPages || 1}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
