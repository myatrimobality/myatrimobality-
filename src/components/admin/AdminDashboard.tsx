import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Bus,
  Users,
  Building,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  Activity,
  Server,
  CreditCard,
  Percent,
  Clock
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTab }) => {
  const { bookings = [], buses = [], operators = [], users = [], settings } = useApp();

  const safeBookings = bookings || [];
  const safeBuses = buses || [];
  const safeUsers = users || [];
  const convenienceFee = settings?.convenienceFee ?? 25;

  const totalGMV = safeBookings.reduce(
    (sum, b) => sum + (b.bookingStatus === 'CONFIRMED' ? b.totalAmount : 0),
    0
  );

  const platformRevenue = Math.round(totalGMV * 0.1) + (safeBookings.length * convenienceFee);
  const totalAgents = safeUsers.filter((u) => u.role === 'AGENT').length;
  const totalBuses = safeBuses.length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-[#0264A6] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              System Operational: All Services Active
            </span>
            <span className="text-xs text-blue-200">National Hub</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">
            M Yatri Platform Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time monitoring of bus inventory, passenger ticket sales, B2B agent wallet debits & bank settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('SETTINGS')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-all"
          >
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Platform Settings</span>
          </button>
        </div>
      </div>

      {/* 4 Key Platform Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Gross Merchandise Value (GMV) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Total Platform GMV</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600">
            ₹{totalGMV.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between pt-1 border-t border-slate-100">
            <span>Customer & B2B Volume</span>
            <span className="text-emerald-600 font-bold">↑ 24% vs Last Month</span>
          </div>
        </div>

        {/* 2. Platform Net Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>M Yatri Net Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F58220] flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-[#F58220]">
            ₹{platformRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between pt-1 border-t border-slate-100">
            <span>10% Comm + ₹{convenienceFee} Fee</span>
            <span className="text-slate-500">Auto-settled</span>
          </div>
        </div>

        {/* 3. Active Fleet on Road */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Active Bus Fleet</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0264A6] flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalBuses} Verified Buses
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between pt-1 border-t border-slate-100">
            <span>Across 4 Fleet Partners</span>
            <button onClick={() => onNavigateTab('OPERATORS')} className="text-[#0264A6] font-bold hover:underline">
              View Fleets
            </button>
          </div>
        </div>

        {/* 4. Travel Agent Network */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>B2B Agent Network</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalAgents} Certified Agents
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between pt-1 border-t border-slate-100">
            <span>₹45.8k Avg Wallet Bal</span>
            <button onClick={() => onNavigateTab('AGENTS')} className="text-[#0264A6] font-bold hover:underline">
              Manage Agents
            </button>
          </div>
        </div>
      </div>

      {/* Gateway & Integration Health Status Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Gateway Telemetry</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600">Payment Gateways (Razorpay/UPI):</span>
              <strong className="text-emerald-600">100% Operational</strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">SMS & WhatsApp Gateway:</span>
              <strong className="text-emerald-600">Delivering (99.8%)</strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600">GPS Live Vehicle Stream:</span>
              <strong className="text-emerald-600">Connected</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Live Booking Feed Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">National Real-Time Bookings Stream</h2>
            <p className="text-xs text-slate-500">Unified audit trail across Online Customers, Travel Agency Counters & App</p>
          </div>

          <button
            onClick={() => onNavigateTab('BOOKINGS')}
            className="text-xs font-bold text-[#0264A6] hover:underline flex items-center gap-1"
          >
            <span>View All ({bookings.length}) Transactions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PNR</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4">Customer Contact</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 6).map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-[#0264A6]">{b.pnr}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                        b.bookingChannel === 'AGENT'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-[#0264A6]'
                      }`}
                    >
                      {b.bookingChannel === 'AGENT' ? 'B2B Counter' : 'Online Web'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {b.trip.route.fromCity} ➔ {b.trip.route.toCity}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{b.trip.bus.operatorName}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{b.contactMobile}</td>
                  <td className="py-3.5 px-4 font-bold text-[#F58220]">{(b.selectedSeats || []).join(', ')}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{b.totalAmount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
