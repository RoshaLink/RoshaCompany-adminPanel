import React, { useState } from 'react';
import {
  Mail,
  Search,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Download,
  Trash2,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserX,
  Globe,
  Calendar,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export const NewsletterManagementPage = () => {
  const {
    subscribers,
    subscribersPagination,
    subscribersStats,
    isSubscribersLoading,
    subscribersFilters,
    setSubscribersFilters,
    fetchSubscribers,
    fetchNewsletterStats,
    deleteSubscriber,
    updateSubscriberStatus,
    showToast,
  } = useAdmin();

  const [copied, setCopied] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const total = subscribersStats?.total || 0;
  const active = subscribersStats?.active || 0;
  const unsubscribed = subscribersStats?.unsubscribed || 0;
  const last30Days = subscribersStats?.last30Days || 0;

  const handleSearchChange = (e) => {
    setSubscribersFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusFilterChange = (status) => {
    setSubscribersFilters((prev) => ({ ...prev, status, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= subscribersPagination.totalPages) {
      setSubscribersFilters((prev) => ({ ...prev, page: newPage }));
    }
  };

  // Copy all visible/active emails as comma-separated list
  const handleCopyEmails = () => {
    if (!subscribers || subscribers.length === 0) {
      showToast('No emails to copy', 'error');
      return;
    }
    const emailsList = subscribers
      .filter((s) => s.status === 'active')
      .map((s) => s.email)
      .join(', ');

    if (!emailsList) {
      showToast('No active emails to copy', 'error');
      return;
    }

    navigator.clipboard.writeText(emailsList).then(() => {
      setCopied(true);
      showToast('Active subscriber emails copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // Export subscribers to CSV file
  const handleExportCSV = () => {
    if (!subscribers || subscribers.length === 0) {
      showToast('No subscriber data to export', 'error');
      return;
    }

    const headers = ['Email', 'Status', 'Language', 'Subscribed At', 'IP Address'];
    const rows = subscribers.map((sub) => [
      `"${sub.email}"`,
      `"${sub.status}"`,
      `"${sub.lang || 'sv'}"`,
      `"${new Date(sub.createdAt).toISOString()}"`,
      `"${sub.ipAddress || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roshalink_newsletter_subscribers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Subscribers exported to CSV successfully', 'success');
  };

  const handleConfirmDelete = async (id) => {
    await deleteSubscriber(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 dark:text-white">
              Newsletter Subscribers
            </h1>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-sky-500 text-white">
              {active} Active
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your audience, newsletter subscribers captured from the website footer, and export lists.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              fetchSubscribers();
              fetchNewsletterStats();
              showToast('Subscribers refreshed', 'info');
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Refresh List"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isSubscribersLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleCopyEmails}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer"
            title="Copy all active subscriber emails"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Active Emails'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Audience</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-500">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-headline">
            {total}
          </div>
          <div className="text-[11px] text-slate-400">All registered email addresses</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Active Subscribers</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-500">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-headline">
            {active}
          </div>
          <div className="text-[11px] text-slate-400">Receiving regular updates</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Unsubscribed</span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500">
              <UserX className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300 font-headline">
            {unsubscribed}
          </div>
          <div className="text-[11px] text-slate-400">Opted out of marketing</div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Last 30 Days</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-headline">
            +{last30Days}
          </div>
          <div className="text-[11px] text-slate-400">New subscribers this month</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={subscribersFilters.search}
            onChange={handleSearchChange}
            placeholder="Search by email..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'active', 'unsubscribed'].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusFilterChange(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                subscribersFilters.status === st
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isSubscribersLoading && (!subscribers || subscribers.length === 0) ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-slate-500">Querying subscribers from database...</p>
        </div>
      ) : !subscribers || subscribers.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-3 border border-slate-200/80 dark:border-slate-800/80">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-500 flex items-center justify-center mx-auto">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-base font-headline font-bold text-slate-800 dark:text-slate-200">
            No Subscribers Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No newsletter subscribers match your search filter or have registered yet.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Subscriber Email</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Language</th>
                  <th className="py-3.5 px-4">Subscribed Date</th>
                  <th className="py-3.5 px-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {subscribers.map((sub) => {
                  const isActive = sub.status === 'active';
                  const isDeleting = deleteConfirmId === sub.id;

                  return (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Email */}
                      <td className="py-4 px-4 sm:px-6 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                            <Mail className="w-4 h-4" />
                          </div>
                          <span className="font-mono text-xs sm:text-sm font-semibold select-all">
                            {sub.email}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {sub.status}
                        </span>
                      </td>

                      {/* Language */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                          <Globe className="w-3 h-3 text-slate-400" />
                          {sub.lang || 'sv'}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* Toggle status */}
                          <button
                            onClick={() => updateSubscriberStatus(sub.id, isActive ? 'unsubscribed' : 'active')}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors"
                            title={isActive ? 'Mark as Unsubscribed' : 'Reactivate'}
                          >
                            {isActive ? 'Unsubscribe' : 'Activate'}
                          </button>

                          {/* Delete */}
                          {isDeleting ? (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleConfirmDelete(sub.id)}
                                className="text-xs px-2 py-1 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="text-xs px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(sub.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Delete Subscriber"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {subscribersPagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <div>
                Page {subscribersPagination.page} of {subscribersPagination.totalPages} (Total {subscribersPagination.total} subscribers)
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(subscribersPagination.page - 1)}
                  disabled={!subscribersPagination.hasPrev}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(subscribersPagination.page + 1)}
                  disabled={!subscribersPagination.hasNext}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
