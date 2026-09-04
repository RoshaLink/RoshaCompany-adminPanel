import React from 'react';
import {
  RotateCw,
  Search,
  Inbox,
  ShieldCheck,
  Menu,
  X,
  LayoutDashboard,
  BarChart3,
  Activity,
  LogOut,
  Mail,
  KeyRound,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeSwitch } from '../ui/ThemeSwitch';
import roshaLogo from '../../assets/Logo/RoshaLink_logo.webp';

export const AdminNavbar = () => {
  const {
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    refreshAll,
    isLoading,
    isStatsLoading,
    stats,
    setIsPasswordModalOpen,
  } = useAdmin();

  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const total = stats?.total || 0;
  const newCount = stats?.statusCounts?.new || 0;

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Inquiries', icon: Inbox },
    { id: 'newsletter', label: 'Newsletter', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'health', label: 'System Health', icon: Activity },
  ];

  const userInitials = (user?.displayName || user?.username || 'Admin')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#0b1120]/70 backdrop-blur-xl px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Menu Button & Brand */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <img src={roshaLogo} alt="RoshaLink Logo" className="w-7 h-7 object-contain" />
          <span className="font-headline font-bold text-base text-slate-900 dark:text-white">
            Rosha<span className="text-sky-500">Admin</span>
          </span>
        </div>
      </div>

      {/* Global Inquiries Quick Search Bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search leads by name, email, company, message..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Quick Action Badges & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Stats Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 text-xs text-sky-700 dark:text-sky-300">
          <span className="font-semibold">{total}</span> total leads
          <span className="w-1 h-1 rounded-full bg-sky-400" />
          <span className="font-bold text-sky-600 dark:text-sky-400">{newCount} new</span>
        </div>

        {/* Live Refresh Button */}
        <button
          onClick={refreshAll}
          disabled={isLoading || isStatsLoading}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-all hover:scale-105"
          title="Refresh Data from MongoDB"
        >
          <RotateCw className={`w-4 h-4 ${isLoading || isStatsLoading ? 'animate-spin text-sky-500' : ''}`} />
        </button>

        {/* Theme Toggle */}
        <ThemeSwitch />

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-sky-500/20">
            {userInitials}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 capitalize">
              {user?.displayName || user?.username || 'Admin'}
            </div>
            <div className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3 h-3" /> {user?.role || 'Admin'}
            </div>
          </div>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="p-2 ml-1 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
            title="Change Password"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          <button
            onClick={logout}
            className="p-2 ml-1 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2 md:hidden shadow-2xl z-50">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-sky-500 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => {
              setIsPasswordModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};
