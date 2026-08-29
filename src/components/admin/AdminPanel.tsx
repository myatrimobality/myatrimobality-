import React, { useState } from 'react';
import { AdminHeader } from './AdminHeader';
import { AdminDashboard } from './AdminDashboard';
import { AdminBookingsMonitor } from './AdminBookingsMonitor';
import { AdminOperatorsAndBuses } from './AdminOperatorsAndBuses';
import { AdminUsersAndAgents } from './AdminUsersAndAgents';
import { AdminPayoutsManager } from './AdminPayoutsManager';
import { AdminSystemSettings } from './AdminSystemSettings';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'DASHBOARD' && (
          <AdminDashboard onNavigateTab={setActiveTab} />
        )}

        {activeTab === 'BOOKINGS' && <AdminBookingsMonitor />}

        {activeTab === 'OPERATORS' && <AdminOperatorsAndBuses />}

        {activeTab === 'AGENTS' && <AdminUsersAndAgents />}

        {activeTab === 'PAYOUTS' && <AdminPayoutsManager />}

        {activeTab === 'SETTINGS' && <AdminSystemSettings />}
      </main>
    </div>
  );
};
