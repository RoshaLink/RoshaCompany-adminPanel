import React, { useState, useEffect } from 'react';
import { Activity, Database, Server, Clock, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../config/api';
import { GlassCard } from '../components/ui/GlassCard';

export const SystemHealthPage = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(null);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    const start = performance.now();
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/health');
      const end = performance.now();
      setLatency(Math.round(end - start));
      setHealth(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const formatUptime = (seconds) => {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-bold text-slate-900 dark:text-white">
            System & Database Health
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time diagnostics for Node.js API server and MongoDB connection.
          </p>
        </div>

        <button
          onClick={checkHealth}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Ping API Server</span>
        </button>
      </div>

      {error ? (
        <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm">
          <div className="font-bold mb-1">Backend Connection Error</div>
          <p>{error}</p>
          <p className="text-xs mt-2 text-rose-500">
            Make sure the backend server is running on port 5000 (`npm run dev` in `OurOwnWebstieBackend`).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Server Status */}
          <GlassCard className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">API Server</span>
              <Server className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {health?.status === 'ok' ? 'Operational' : 'Checking...'}
            </div>
            <p className="text-xs text-slate-500">Express.js on Port 5000</p>
          </GlassCard>

          {/* Database Status */}
          <GlassCard className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">MongoDB Database</span>
              <Database className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  health?.database === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {health?.database === 'connected' ? 'Connected' : 'Connecting...'}
            </div>
            <p className="text-xs text-slate-500">Mongoose ODM Active</p>
          </GlassCard>

          {/* API Latency */}
          <GlassCard className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Response Latency</span>
              <Activity className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {latency !== null ? `${latency} ms` : '—'}
            </div>
            <p className="text-xs text-slate-500">Round-trip ping</p>
          </GlassCard>

          {/* Server Uptime */}
          <GlassCard className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">Server Uptime</span>
              <Clock className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
              {formatUptime(health?.uptime)}
            </div>
            <p className="text-xs text-slate-500">Environment: {health?.environment || 'development'}</p>
          </GlassCard>
        </div>
      )}

      {/* Architecture Specs */}
      <GlassCard className="space-y-4">
        <h3 className="font-headline font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-sky-500" />
          Backend Architecture & Security Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Rate Limiting
            </div>
            <div className="text-slate-500">10 requests / 15 min per IP on lead capture</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> CORS Security
            </div>
            <div className="text-slate-500">Strict origin whitelist for web & admin</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Data Sanitization
            </div>
            <div className="text-slate-500">Control character stripping & regex validation</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
