import React from 'react';
import { useApp } from '../../context/AppContext';
import { MYatriLogo } from '../common/MYatriLogo';
import {
  Bus,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ShieldCheck,
  Search
} from 'lucide-react';

interface OperatorHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddBus: () => void;
  onOpenAddTrip: () => void;
}

export const OperatorHeader: React.FC<OperatorHeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddBus,
  onOpenAddTrip,
}) => {
  const { currentUser, setPnrSearchModalOpen } = useApp();

  const navTabs = [
    { id: 'DASHBOARD', label: 'Dashboard' },
    { id: 'FLEET', label: 'Fleet Management' },
    { id: 'TRIPS', label: 'Trips & Schedules' },
    { id: 'PASSENGER_CHART', label: 'Passenger Manifest' },
    { id: 'SETTLEMENTS', label: 'Payouts & Accounts' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-[37px] z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand & Operator Info */}
          <div className="flex items-center gap-4">
            <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center">
              <MYatriLogo size="sm" />
            </div>
            <div className="hidden sm:block pl-3 border-l border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white">Operator Console</span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/30">
                  Fleet Partner
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                {currentUser?.operatorCompanyName || 'Royal Travels Kanpur'} (Rating: 4.8 ★)
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
                    ? 'bg-blue-800 text-white shadow-xs font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Fast Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPnrSearchModalOpen(true)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Search PNR"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenAddTrip}
              className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Schedule</span>
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex overflow-x-auto py-2 space-x-2 border-t border-slate-800 text-xs">
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
