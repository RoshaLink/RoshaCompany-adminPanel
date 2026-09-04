import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeSwitch } from '../components/ui/ThemeSwitch';
import { GlassCard } from '../components/ui/GlassCard';
import roshaLogo from '../assets/Logo/RoshaLink_logo.webp';

export const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setErrorMessage('');
    const res = await login(username.trim(), password);
    if (!res.success) {
      const err = res.error || '';
      if (err.includes('Too many login attempts') || err.includes('429')) {
        setErrorMessage('Too many failed login attempts. Access is temporarily locked for 15 minutes.');
      } else {
        setErrorMessage(err || 'Authentication failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#f8fafc] dark:bg-[#0b1120] text-[#0f172a] dark:text-[#f1f5f9] selection:bg-sky-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="ambient-glow-cyan" />
      <div className="ambient-glow-purple" />

      {/* Top Right Theme Toggle */}
      <div className="fixed top-6 right-6 z-20">
        <ThemeSwitch />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md relative z-10 animate-scaleUp">
        <GlassCard className="p-6 sm:p-8 space-y-6 shadow-2xl border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <img
                src={roshaLogo}
                alt="RoshaLink Logo"
                className="w-16 h-16 object-contain drop-shadow-md hover:scale-105 transition-transform"
              />
            </div>

            <h1 className="text-2xl font-headline font-bold text-slate-900 dark:text-white">
              Rosha<span className="text-sky-500">Link</span> Admin
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to manage inquiries, leads, and platform diagnostics.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security & Access Notice */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Restricted Access &bull; Authorized Personnel Only</span>
            </div>
            <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 leading-relaxed">
              All login attempts and IP activities are audited. Multiple failed attempts trigger automated IP lockout.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
