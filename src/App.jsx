import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminLayout } from './components/Layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsManagementPage } from './pages/LeadsManagementPage';
import { NewsletterManagementPage } from './pages/NewsletterManagementPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SystemHealthPage } from './pages/SystemHealthPage';

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { activeTab } = useAdmin();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b1120]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-400">Loading RoshaLink Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <AdminLayout>
      {activeTab === 'dashboard' && <DashboardPage />}
      {activeTab === 'leads' && <LeadsManagementPage />}
      {activeTab === 'newsletter' && <NewsletterManagementPage />}
      {activeTab === 'analytics' && <AnalyticsPage />}
      {activeTab === 'health' && <SystemHealthPage />}
    </AdminLayout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <AppContent />
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
