/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CustomerPanel } from './components/customer/CustomerPanel';
import { AgentPanel } from './components/agent/AgentPanel';
import { OperatorPanel } from './components/operator/OperatorPanel';
import { AdminPanel } from './components/admin/AdminPanel';
import { PNRLookupModal } from './components/common/PNRLookupModal';
import { UserRole } from './types';
import {
  Users,
  Briefcase,
  Bus,
  ShieldAlert,
  Bell,
  Sparkles,
  ExternalLink,
  Lock,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

const RoleSwitcherBar: React.FC = () => {
  const { currentRole, setCurrentRole, setCustomerView, setPnrSearchModalOpen } = useApp();

  const roles: { role: UserRole; label: string; icon: any; color: string; desc: string }[] = [
    {
      role: 'CUSTOMER',
      label: 'Customer Online',
      icon: Users,
      color: 'bg-blue-800',
      desc: 'Book tickets, seat selector, payment, e-tickets',
    },
    {
      role: 'AGENT',
      label: 'Agent Portal (B2B)',
      icon: Briefcase,
      color: 'bg-blue-800',
      desc: 'Counter booking, wallet balance, commission',
    },
    {
      role: 'OPERATOR',
      label: 'Bus Operator',
      icon: Bus,
      color: 'bg-blue-800',
      desc: 'Fleet, routes, schedules, conductor manifest',
    },
    {
      role: 'ADMIN',
      label: 'Master Admin',
      icon: ShieldAlert,
      color: 'bg-blue-800',
      desc: 'National GMV, audits, user RBAC, payouts',
    },
  ];

  return (
    <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 sticky top-0 z-50 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left Role Switcher */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            Portal:
          </span>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {roles.map((r) => {
              const Icon = r.icon;
              const isActive = currentRole === r.role;
              return (
                <button
                  key={r.role}
                  onClick={() => {
                    setCurrentRole(r.role);
                    if (r.role === 'CUSTOMER') setCustomerView('HOME');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                  title={r.desc}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{r.label}</span>
                  <span className="sm:hidden">{r.role}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPnrSearchModalOpen(true)}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
          >
            <Search className="w-3 h-3" />
            <span>Search PNR Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationToasts: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full print:hidden">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="bg-white text-slate-900 p-4 rounded-xl shadow-lg border border-slate-200 flex items-start gap-3 animate-in slide-in-from-bottom-5"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-slate-900">{n.title}</h4>
            <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
            <span className="text-[10px] text-slate-400 mt-1 block font-mono">{n.timestamp}</span>
          </div>
          <button
            onClick={() => dismissNotification(n.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentRole } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-slate-900 bg-white">
      <RoleSwitcherBar />

      <div className="flex-1">
        {currentRole === 'CUSTOMER' && <CustomerPanel />}
        {currentRole === 'AGENT' && <AgentPanel />}
        {currentRole === 'OPERATOR' && <OperatorPanel />}
        {currentRole === 'ADMIN' && <AdminPanel />}
      </div>

      {/* Global PNR Status Search Modal */}
      <PNRLookupModal />

      {/* Global Notification Alerts (SMS/WhatsApp simulations) */}
      <NotificationToasts />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
