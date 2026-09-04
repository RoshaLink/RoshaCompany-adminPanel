import React, { useState } from 'react';
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  Activity,
  Sparkles,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Mail,
  KeyRound,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import roshaLogo from '../../assets/Logo/RoshaLink_logo.webp';

export const AdminSidebar = () => {
  const {
    activeTab,
    setActiveTab,
    stats,
    subscribersStats,
    setIsPasswordModalOpen,
  } = useAdmin();
  const { user, logout } = useAuth();

  const newCount = stats?.statusCounts?.new || 0;
  const activeSubscribersCount = subscribersStats?.active || 0;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'leads',
      label: 'Inquiries & Leads',
      icon: Inbox,
      badge: newCount > 0 ? newCount : null,
    },
    {
      id: 'newsletter',
      label: 'Newsletter Subscribers',
      icon: Mail,
      badge: activeSubscribersCount > 0 ? activeSubscribersCount : null,
    },
    {
      id: 'analytics',
      label: 'Analytics & Sources',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'health',
      label: 'System & DB Health',
      icon: Activity,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-[#0f172a]/70 backdrop-blur-2xl p-5 min-h-screen sticky top-0 z-30">
      {/* Brand Logo & Tag */}
      <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-100 dark:border-slate-800/60">
        <img
          src={roshaLogo}
          alt="RoshaLink Logo"
          className="w-10 h-10 object-contain drop-shadow-sm hover:scale-105 transition-transform"
        />
        <div>
          <h2 className="font-headline font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
            Rosha<span className="text-sky-500">Link</span>
          </h2>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Admin Console
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="space-y-1.5 flex-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Main Menu
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info & Sign Out Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
        {/* User Card */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate capitalize">
              {user?.displayName || user?.username || 'Admin'}
            </div>
            <div className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium mt-0.5">
              <ShieldCheck className="w-3 h-3" /> {user?.role || 'Admin'}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
              title="Change Password"
            >
              <KeyRound className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Website Preview Link */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-sky-500 transition-colors"
        >
          <span>Open Main Website</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
