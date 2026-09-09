import React from 'react';
import { StatsOverview } from '../components/Dashboard/StatsOverview';
import { SourceDistribution } from '../components/Dashboard/SourceDistribution';
import { RecentLeadsCard } from '../components/Dashboard/RecentLeadsCard';

export const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* KPI Metrics */}
      <StatsOverview />

      {/* Grid: Source Distribution & Recent Leads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SourceDistribution />
        <RecentLeadsCard />
      </div>
    </div>
  );
};
