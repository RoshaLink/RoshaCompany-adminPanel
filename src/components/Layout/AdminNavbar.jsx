import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { ThemeSwitch } from '../ui/ThemeSwitch';
import { LanguageSwitch } from '../ui/LanguageSwitch';
import roshaLogo from '../../assets/Logo/RoshaLink_logo.webp';

export const AdminNavbar = () => {
  const { t } = useTranslation();
  const {
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    refreshAll,
    isLoading,
    isStatsLoading,
    stats,
    subscribersStats,
    setIsPasswordModalOpen,
  } = useAdmin();

  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const total = stats?.total || 0;
  const newCount = stats?.statusCounts?.new || 0;
  const activeSubsCount = subscribersStats?.active || 0;

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const menuItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'leads', label: t('nav.leads'), icon: Inbox, badge: newCount > 0 ? newCount : null },
    { id: 'newsletter', label: t('nav.newsletter'), icon: Mail, badge: activeSubsCount > 0 ? activeSubsCount : null },
    { id: 'analytics', label: t('nav.analytics'), icon: BarChart3, badge: null },
    { id: 'health', label: t('nav.health'), icon: Activity, badge: null },
  ];

  const userInitials = (user?.displayName || user?.username || 'Admin')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-xl px-3 sm:px-6 lg:px-8 py-3 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        {/* Mobile Menu Button & Brand */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <img src={roshaLogo} alt="RoshaLink Logo" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
            <span className="font-headline font-bold text-xs xs:text-sm sm:text-base text-slate-900 dark:text-white truncate">
              Rosha<span className="text-sky-500">Admin</span>
            </span>
          </div>
        </div>

        {/* Global Inquiries Quick Search Bar (Desktop / Tablet) */}
        <div className="flex-1 max-w-xs md:max-w-sm lg:max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder={t('leads.globalSearchPlaceholder')}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all shadow-inner"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((p) => ({ ...p, search: '', page: 1 }))}
                className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Controls Area */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500"
            title={t('common.search')}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Stats Pill (Desktop) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 text-xs text-sky-700 dark:text-sky-300">
            <span className="font-semibold">{total}</span> {t('dashboard.cardTotalTitle')}
            <span className="w-1 h-1 rounded-full bg-sky-400" />
            <span className="font-bold text-sky-600 dark:text-sky-400">{newCount} {t('nav.newBadge')}</span>
          </div>

          {/* Live Refresh Button */}
          <button
            onClick={refreshAll}
            disabled={isLoading || isStatsLoading}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-all hover:scale-105 cursor-pointer disabled:opacity-50"
            title={t('common.refresh')}
          >
            <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading || isStatsLoading ? 'animate-spin text-sky-500' : ''}`} />
          </button>

          {/* Multi-language Switcher */}
          <LanguageSwitch />

          {/* Theme Toggle */}
          <ThemeSwitch />

          {/* User Profile & Actions */}
          <div className="flex items-center gap-1 sm:gap-2 pl-1.5 sm:pl-2 rtl:pl-0 rtl:pr-1.5 sm:rtl:pr-2 border-l rtl:border-l-0 rtl:border-r border-slate-200 dark:border-slate-800">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-[11px] sm:text-xs font-bold shadow-md shadow-sky-500/20 shrink-0">
              {userInitials}
            </div>
            <div className="hidden md:block text-left rtl:text-right">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 capitalize truncate max-w-[100px]">
                {user?.displayName || user?.username || 'Admin'}
              </div>
              <div className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3 h-3" /> {t('nav.roleAdmin')}
              </div>
            </div>

            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
              title={t('nav.changePassword')}
            >
              <KeyRound className="w-4 h-4" />
            </button>

            <button
              onClick={logout}
              className="hidden sm:flex p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title={t('nav.logout')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Expandable Search Bar */}
      {mobileSearchOpen && (
        <div className="sm:hidden pt-2 border-t border-slate-200 dark:border-slate-800 animate-fadeIn">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={handleSearchChange}
              placeholder={t('leads.globalSearchPlaceholder')}
              autoFocus
              className="w-full pl-9 rtl:pl-4 rtl:pr-9 pr-8 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
            {filters.search && (
              <button
                onClick={() => setFilters((p) => ({ ...p, search: '', page: 1 }))}
                className="absolute right-2.5 rtl:right-auto rtl:left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[57px] bottom-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-full max-w-xs bg-white dark:bg-slate-900 border-r rtl:border-r-0 rtl:border-l border-slate-200 dark:border-slate-800 p-5 space-y-3 h-full overflow-y-auto shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <img src={roshaLogo} alt="RoshaLink Logo" className="w-8 h-8 object-contain" />
                <div>
                  <div className="font-headline font-bold text-sm text-slate-900 dark:text-white">
                    Rosha<span className="text-sky-500">Admin</span>
                  </div>
                  <div className="text-[10px] text-slate-400">{t('nav.adminConsole')}</div>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="space-y-1 py-2">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                {t('nav.mainMenu')}
              </div>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-sky-500 text-white font-semibold shadow-lg shadow-sky-500/25'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== null && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/25 text-white' : 'bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* User & Links Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setIsPasswordModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <KeyRound className="w-4 h-4 text-slate-400" />
                <span>{t('nav.changePassword')}</span>
              </button>

              <a
                href="http://localhost:3000"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <span>{t('nav.openWebsite')}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
