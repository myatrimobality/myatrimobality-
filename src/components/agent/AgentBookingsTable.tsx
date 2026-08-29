import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  Phone,
  MessageSquare,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  RotateCcw
} from 'lucide-react';

export const AgentBookingsTable: React.FC = () => {
  const { bookings, cancelBooking, setConfirmedBooking, setCustomerView } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contactMobile.includes(searchTerm) ||
      b.passengers.some((p) => p.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      b.trip.route.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trip.route.toCity.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || b.bookingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrint = (booking: Booking) => {
    setConfirmedBooking(booking);
    setCustomerView('CONFIRMATION');
  };

  const handleConfirmCancel = () => {
    if (!selectedBookingForCancel) return;
    const res = cancelBooking(selectedBookingForCancel.id, cancelReason || 'Counter customer cancellation');
    if (res.success) {
      alert(`Booking ${selectedBookingForCancel.pnr} has been cancelled. Refund of ₹${res.refundAmount} credited back to your Agent Wallet.`);
      setSelectedBookingForCancel(null);
      setCancelReason('');
    }
  };

  const handleExportCSV = () => {
    alert('Exporting agent sales statement for the selected period (CSV/Excel format). Download starting...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Counter Issued Tickets</h1>
          <p className="text-xs text-slate-500">Manage, reprint, or cancel tickets issued by your travel agency</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export Sales CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search PNR, Mobile, Pax..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0264A6] w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Status</option>
            <option value="CONFIRMED">Confirmed Only</option>
            <option value="CANCELLED">Cancelled Only</option>
          </select>
        </div>

        <div className="text-xs font-extrabold text-slate-500">
          Showing <span className="text-[#0264A6]">{filteredBookings.length}</span> bookings
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">PNR</th>
                <th className="py-3.5 px-4">Booking Date</th>
                <th className="py-3.5 px-4">Route & Travel Date</th>
                <th className="py-3.5 px-4">Passenger Details</th>
                <th className="py-3.5 px-4">Seats</th>
                <th className="py-3.5 px-4">Gross Collected</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-black text-[#0264A6]">{b.pnr}</td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">
                      {b.trip.route.fromCity} ➔ {b.trip.route.toCity}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {b.journeyDate} • {b.departureTime}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-800">{b.passengers[0]?.fullName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{b.contactMobile}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#F58220]">
                    {(b.selectedSeats || []).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{b.totalAmount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.bookingStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => handlePrint(b)}
                      className="p-1.5 bg-blue-50 hover:bg-blue-100 text-[#0264A6] rounded-lg transition-colors inline-flex"
                      title="Print / View"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    {b.bookingStatus === 'CONFIRMED' && (
                      <button
                        onClick={() => setSelectedBookingForCancel(b)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors inline-flex"
                        title="Cancel Ticket & Refund to Wallet"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancellation Modal */}
      {selectedBookingForCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Cancel Ticket ({selectedBookingForCancel.pnr})
              </h3>
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Refund will be instantly re-credited to your <strong>Agent Wallet</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span>Original Fare:</span>
                <span className="font-bold">₹{selectedBookingForCancel.totalAmount}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Cancellation Charges:</span>
                <span>- ₹{Math.round(selectedBookingForCancel.totalAmount * 0.1)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-emerald-700 text-sm">
                <span>Refund to Agent Wallet:</span>
                <span>₹{Math.round(selectedBookingForCancel.totalAmount * 0.9)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
              <input
                type="text"
                placeholder="e.g. Passenger requested counter cancellation"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setSelectedBookingForCancel(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Keep Ticket
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Confirm Cancel & Recredit Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
