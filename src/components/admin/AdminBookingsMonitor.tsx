import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  Ticket,
  Search,
  Printer,
  Download,
  Filter,
  RotateCcw,
  CheckCircle,
  FileSpreadsheet,
  Building
} from 'lucide-react';

export const AdminBookingsMonitor: React.FC = () => {
  const { bookings, cancelBooking, setConfirmedBooking, setCustomerView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'ONLINE' | 'AGENT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactMobile.includes(searchTerm) ||
      b.trip.route.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trip.route.toCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trip.bus.operatorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChannel = channelFilter === 'ALL' || b.bookingChannel === channelFilter;
    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  const handlePrint = (b: Booking) => {
    setConfirmedBooking(b);
    setCustomerView('CONFIRMATION');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#F58220] uppercase tracking-wider mb-1">
            <Ticket className="w-4 h-4" />
            <span>Master Transactions</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">National Passenger Bookings Audit</h1>
        </div>

        <button
          onClick={() => alert('Downloading National Bookings Master Ledger (CSV)...')}
          className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-black rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Master CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search PNR, Mobile, City, Operator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0264A6] w-72"
            />
          </div>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Channels</option>
            <option value="ONLINE">Customer Web</option>
            <option value="AGENT">Travel Agency Counter</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing <span className="text-[#0264A6] font-black">{filtered.length}</span> Bookings
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">PNR</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Route & Date</th>
                <th className="py-3.5 px-4">Operator</th>
                <th className="py-3.5 px-4">Passenger / Mobile</th>
                <th className="py-3.5 px-4">Seats</th>
                <th className="py-3.5 px-4">Gross Fare</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-[#0264A6]">{b.pnr}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        b.bookingChannel === 'AGENT'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-[#0264A6]'
                      }`}
                    >
                      {b.bookingChannel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">
                      {b.trip.route.fromCity} ➔ {b.trip.route.toCity}
                    </div>
                    <div className="text-[10px] text-slate-400">{b.journeyDate}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">{b.trip.bus.operatorName}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{b.passengers[0]?.fullName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{b.contactMobile}</div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#F58220]">{(b.selectedSeats || []).join(', ')}</td>
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">₹{b.totalAmount}</td>
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
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handlePrint(b)}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#0264A6] rounded-lg transition-colors inline-flex"
                      title="View / Print Ticket"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
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
