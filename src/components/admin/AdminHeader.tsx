import React from 'react';
import { useApp } from '../../context/AppContext';
import { MYatriLogo } from '../common/MYatriLogo';
import {
  ShieldAlert,
  Users,
  Building,
  TrendingUp,
  Sliders,
  DollarSign,
  Ticket,
  Search,
  Bell
} from 'lucide-react';

interface AdminHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ activeTab, setActiveTab }) => {
  const { setPnrSearchModalOpen } = useApp();

  const navTabs = [
    { id: 'DASHBOARD', label: 'Platform Overview' },
    { id: 'BOOKINGS', label: 'All Bookings' },
    { id: 'OPERATORS', label: 'Operators & Buses' },
    { id: 'AGENTS', label: 'Agents & Users' },
    { id: 'PAYOUTS', label: 'Payouts Settlement' },
    { id: 'SETTINGS', label: 'System Config' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-[37px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-4">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center">
              <MYatriLogo size="sm" />
            </div>
            <div className="hidden sm:block pl-3 border-l border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">Master Admin Console</span>
                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">
                  SUPER ADMIN
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                M Yatri National Control Center
              </div>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Quick PNR search */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPnrSearchModalOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Search PNR"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Submenu Navigation */}
        <div className="lg:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800 text-xs">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-bold transition-colors ${
                activeTab === tab.id ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
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
