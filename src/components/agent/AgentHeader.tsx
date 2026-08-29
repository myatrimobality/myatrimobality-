import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MYatriLogo } from '../common/MYatriLogo';
import {
  Wallet,
  PlusCircle,
  Bell,
  User,
  ShieldCheck,
  Building2,
  Ticket,
  BarChart3,
  Search,
  LogOut,
  RefreshCw
} from 'lucide-react';

interface AgentHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRecharge: () => void;
}

export const AgentHeader: React.FC<AgentHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenRecharge,
}) => {
  const { currentUser, setPnrSearchModalOpen, setCurrentRole } = useApp();

  const navTabs = [
    { id: 'DASHBOARD', label: 'Dashboard' },
    { id: 'QUICK_BOOKING', label: '⚡ Counter Booking' },
    { id: 'MY_BOOKINGS', label: 'Issued Tickets' },
    { id: 'WALLET_LEDGER', label: 'Wallet & Ledger' },
    { id: 'COMMISSION', label: 'Commission Reports' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-[37px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Portal Badge */}
          <div className="flex items-center gap-4">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center">
              <MYatriLogo size="sm" />
            </div>
            <div className="hidden sm:block pl-3 border-l border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">Agent Portal</span>
                <span className="bg-orange-500/20 text-[#FF8C00] text-[10px] font-bold px-2 py-0.5 rounded border border-orange-500/30">
                  B2B Counter
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {currentUser?.agencyName || 'Shree Ganesh Tour & Travels'} ({currentUser?.agentCode || 'AG-KNP-8941'})
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-800 text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Right Controls: Agent Wallet & Recharge Button */}
          <div className="flex items-center gap-3">
            {/* Quick PNR Lookup */}
            <button
              onClick={() => setPnrSearchModalOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Search PNR"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wallet Balance Pill */}
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg pl-3.5 pr-1.5 py-1 gap-3">
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Agent Wallet</span>
                <div className="text-sm font-mono font-bold text-green-400">
                  ₹{(currentUser?.walletBalance || 45800).toLocaleString('en-IN')}
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenRecharge}
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-xs font-bold transition-colors shadow-xs flex items-center gap-1"
                title="Top up Agent Wallet"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px]">Topup</span>
              </button>
            </div>

            {/* Agent Profile info */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-blue-800 text-white flex items-center justify-center font-bold text-xs border border-blue-700">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Submenu Navigation */}
        <div className="lg:hidden flex overflow-x-auto py-2.5 space-x-2 border-t border-slate-800 text-xs">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-bold transition-colors ${
                activeTab === tab.id ? 'bg-blue-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
