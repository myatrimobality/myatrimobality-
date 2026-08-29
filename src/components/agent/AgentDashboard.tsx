import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  TrendingUp,
  Ticket,
  Percent,
  PlusCircle,
  Clock,
  Printer,
  FileText,
  Search,
  CheckCircle,
  Building,
  Award,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface AgentDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenRecharge: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  onNavigateTab,
  onOpenRecharge,
}) => {
  const { currentUser, bookings, setConfirmedBooking, setCustomerView } = useApp();

  const agentBookings = bookings.filter((b) => b.bookingChannel === 'AGENT' || true);
  const todayBookings = agentBookings.slice(0, 5);

  const totalSales = agentBookings.reduce((sum, b) => sum + (b.bookingStatus === 'CONFIRMED' ? b.totalAmount : 0), 0);
  const totalCommission = Math.round(totalSales * 0.08); // 8% avg commission

  const monthlyTarget = 250000;
  const currentMonthSales = 184500;
  const progressPercent = Math.min(100, Math.round((currentMonthSales / monthlyTarget) * 100));

  const handleOpenTicket = (booking: any) => {
    setConfirmedBooking(booking);
    setCustomerView('CONFIRMATION');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Agency Welcome & Quick Actions */}
      <div className="bg-slate-900 rounded-xl p-6 sm:p-7 text-white border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Verified Gold Partner
            </span>
            <span className="text-xs text-slate-400">Kanpur Central Booking Branch</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {currentUser?.agencyName || 'Shree Ganesh Tour & Travels'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Agent Code: <strong className="font-mono text-orange-400">{currentUser?.agentCode || 'AG-KNP-8941'}</strong> • Counter Staff: {currentUser?.name || 'Vikas Sharma'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('QUICK_BOOKING')}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm flex items-center gap-2 transition-colors active:scale-98"
          >
            <Ticket className="w-4 h-4" />
            <span>Counter Fast Booking</span>
          </button>

          <button
            onClick={onOpenRecharge}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs sm:text-sm rounded-lg border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-green-400" />
            <span>Top-up Wallet</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Wallet Balance */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Agent Wallet Balance</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 border border-green-200 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-green-700">
            ₹{(currentUser?.walletBalance || 45800).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between items-center pt-2 border-t border-slate-100">
            <span>Auto-Debit Active</span>
            <button onClick={onOpenRecharge} className="text-blue-800 font-semibold hover:underline">
              Add Funds
            </button>
          </div>
        </div>

        {/* 2. Today's Bookings */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Today's Counter Tickets</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            14 Tickets <span className="text-xs text-slate-400 font-normal">(28 seats)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between items-center pt-2 border-t border-slate-100">
            <span>Daily Vol: ₹24,850</span>
            <span className="text-green-700 font-semibold">↑ 18% vs Y'day</span>
          </div>
        </div>

        {/* 3. Total Commission Earned */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Commission (Month)</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-orange-600">
            ₹{totalCommission.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between items-center pt-2 border-t border-slate-100">
            <span>8% Avg Commission</span>
            <button onClick={() => onNavigateTab('COMMISSION')} className="text-blue-800 font-semibold hover:underline">
              View Slab
            </button>
          </div>
        </div>

        {/* 4. Monthly Target Progress */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Target ({progressPercent}%)</span>
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-bold text-slate-900">
            ₹{currentMonthSales.toLocaleString('en-IN')} / ₹{monthlyTarget.toLocaleString('en-IN')}
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-800 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="text-[10px] text-slate-400 font-medium flex justify-between pt-0.5">
            <span>₹65.5k to Tier 1 Bonus (+2%)</span>
          </div>
        </div>
      </div>

      {/* Quick Fast Actions & Recent Issued Tickets Table */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Counter Bookings</h2>
            <p className="text-xs text-slate-500">Live stream of tickets issued by this agency counter</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('MY_BOOKINGS')}
              className="text-xs font-semibold text-blue-800 hover:underline flex items-center gap-1"
            >
              <span>View All Counter Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table of bookings */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PNR</th>
                <th className="py-3 px-4">Route & Date</th>
                <th className="py-3 px-4">Operator & Bus</th>
                <th className="py-3 px-4">Lead Passenger</th>
                <th className="py-3 px-4">Seats</th>
                <th className="py-3 px-4">Gross Fare</th>
                <th className="py-3 px-4">Commission</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {todayBookings.map((b) => {
                const comm = Math.round(b.totalAmount * 0.08);
                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-800">{b.pnr}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {b.trip.route.fromCity} ➔ {b.trip.route.toCity}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.journeyDate} ({b.departureTime})
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{b.trip.bus.operatorName}</div>
                      <div className="text-[10px] text-slate-400">{b.trip.bus.busNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{b.passengers[0]?.fullName}</div>
                      <div className="text-[11px] text-slate-400">{b.contactMobile}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-orange-50 text-orange-700 font-bold px-2 py-0.5 rounded border border-orange-200">
                        {(b.selectedSeats || []).join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{b.totalAmount}</td>
                    <td className="py-3.5 px-4 font-bold text-green-700">+₹{comm}</td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenTicket(b)}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold rounded-md transition-colors inline-flex items-center gap-1"
                        title="Print / View Ticket"
                      >
                        <Printer className="w-3 h-3 text-slate-500" />
                        <span>Print</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
