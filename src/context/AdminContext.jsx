import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../config/api';
import { useAuth } from './AuthContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 15, totalPages: 1 });
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [toast, setToast] = useState(null);

  // Newsletter Subscribers State
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersPagination, setSubscribersPagination] = useState({ total: 0, page: 1, limit: 20, totalPages: 1 });
  const [subscribersStats, setSubscribersStats] = useState(null);
  const [isSubscribersLoading, setIsSubscribersLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    source: 'all',
    page: 1,
    limit: 15,
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [subscribersFilters, setSubscribersFilters] = useState({
    search: '',
    status: 'all',
    page: 1,
    limit: 20,
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsStatsLoading(true);
      const res = await api.get('/leads/stats');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setIsStatsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchLeads = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      const res = await api.get('/leads', filters);
      if (res.success) {
        setLeads(res.data.leads || []);
        setPagination(res.data.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 });
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch inquiries', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [filters, isAuthenticated]);

  const fetchNewsletterStats = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/newsletter/stats');
      if (res.success) {
        setSubscribersStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch newsletter stats:', err);
    }
  }, [isAuthenticated]);

  const fetchSubscribers = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setIsSubscribersLoading(true);
      const res = await api.get('/newsletter', subscribersFilters);
      if (res.success) {
        setSubscribers(res.data.subscribers || []);
        setSubscribersPagination(res.data.pagination || { total: 0, page: 1, limit: 20, totalPages: 1 });
      }
    } catch (err) {
      showToast(err.message || 'Failed to fetch newsletter subscribers', 'error');
    } finally {
      setIsSubscribersLoading(false);
    }
  }, [subscribersFilters, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
      fetchNewsletterStats();
    } else {
      setStats(null);
      setSubscribersStats(null);
    }
  }, [isAuthenticated, fetchStats, fetchNewsletterStats]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    } else {
      setLeads([]);
    }
  }, [isAuthenticated, fetchLeads]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscribers();
    } else {
      setSubscribers([]);
    }
  }, [isAuthenticated, fetchSubscribers]);

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/leads/${id}/status`, { status: newStatus });
      if (res.success) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead((prev) => ({ ...prev, status: newStatus }));
        }
        showToast(`Inquiry status updated to "${newStatus}"`, 'success');
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const updateLead = async (id, updatedFields) => {
    try {
      const res = await api.put(`/leads/${id}`, updatedFields);
      if (res.success && res.data) {
        const saved = res.data;
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? saved : lead))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(saved);
        }
        showToast('Lead details updated and saved to DB', 'success');
        fetchStats();
        return { success: true, data: saved };
      } else {
        throw new Error(res.message || 'Failed to update lead');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update lead', 'error');
      return { success: false, error: err.message };
    }
  };

  const deleteLead = async (id) => {
    try {
      const res = await api.delete(`/leads/${id}`);
      if (res.success) {
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead(null);
        }
        showToast('Inquiry removed from database', 'info');
        fetchStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete inquiry', 'error');
    }
  };

  const updateSubscriberStatus = async (id, newStatus) => {
    try {
      const res = await api.patch(`/newsletter/${id}/status`, { status: newStatus });
      if (res.success) {
        setSubscribers((prev) =>
          prev.map((sub) => (sub.id === id ? { ...sub, status: newStatus } : sub))
        );
        showToast(`Subscriber status updated to "${newStatus}"`, 'success');
        fetchNewsletterStats();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update subscriber status', 'error');
    }
  };

  const deleteSubscriber = async (id) => {
    try {
      const res = await api.delete(`/newsletter/${id}`);
      if (res.success) {
        setSubscribers((prev) => prev.filter((sub) => sub.id !== id));
        showToast('Subscriber removed from database', 'info');
        fetchNewsletterStats();
        fetchSubscribers();
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete subscriber', 'error');
    }
  };

  const refreshAll = () => {
    fetchStats();
    fetchLeads();
    fetchNewsletterStats();
    fetchSubscribers();
    showToast('Data refreshed from MongoDB', 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        leads,
        pagination,
        stats,
        isLoading,
        isStatsLoading,
        selectedLead,
        setSelectedLead,
        filters,
        setFilters,
        fetchLeads,
        fetchStats,
        updateLead,
        updateLeadStatus,
        deleteLead,
        // Newsletter
        subscribers,
        subscribersPagination,
        subscribersStats,
        isSubscribersLoading,
        subscribersFilters,
        setSubscribersFilters,
        fetchSubscribers,
        fetchNewsletterStats,
        updateSubscriberStatus,
        deleteSubscriber,
        // Utils
        refreshAll,
        toast,
        showToast,
        isPasswordModalOpen,
        setIsPasswordModalOpen,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
