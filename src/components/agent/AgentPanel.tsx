import React, { useState } from 'react';
import { AgentHeader } from './AgentHeader';
import { AgentDashboard } from './AgentDashboard';
import { AgentQuickBooking } from './AgentQuickBooking';
import { AgentBookingsTable } from './AgentBookingsTable';
import { AgentWalletLedger } from './AgentWalletLedger';
import { AgentCommissionReports } from './AgentCommissionReports';
import { AgentRechargeModal } from './AgentRechargeModal';

export const AgentPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <AgentHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRecharge={() => setRechargeModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'DASHBOARD' && (
          <AgentDashboard
            onNavigateTab={setActiveTab}
            onOpenRecharge={() => setRechargeModalOpen(true)}
          />
        )}

        {activeTab === 'QUICK_BOOKING' && <AgentQuickBooking />}

        {activeTab === 'MY_BOOKINGS' && <AgentBookingsTable />}

        {activeTab === 'WALLET_LEDGER' && (
          <AgentWalletLedger onOpenRecharge={() => setRechargeModalOpen(true)} />
        )}

        {activeTab === 'COMMISSION' && <AgentCommissionReports />}
      </main>

      {/* Wallet Recharge Modal */}
      <AgentRechargeModal
        isOpen={rechargeModalOpen}
        onClose={() => setRechargeModalOpen(false)}
      />
    </div>
  );
};
