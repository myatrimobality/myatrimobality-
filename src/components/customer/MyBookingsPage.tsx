import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import {
  Ticket,
  Search,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  FileText,
  Printer,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const {
    bookings,
    currentUser,
    setConfirmedBooking,
    setCustomerView,
    cancelBooking,
  } = useApp();

  const [filterTab, setFilterTab] = useState<'ALL' | 'CONFIRMED' | 'CANCELLED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter bookings for current user
  const userBookings = bookings.filter((b) => {
    // In demo mode, show all relevant bookings or match user mobile
    const matchesTab = filterTab === 'ALL' || b.bookingStatus === filterTab;
    const matchesSearch =
      b.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trip.route.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trip.route.toCity.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleViewTicket = (booking: Booking) => {
    setConfirmedBooking(booking);
    setCustomerView('CONFIRMATION');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#0264A6] uppercase tracking-wider mb-1">
              <Ticket className="w-4 h-4" />
              <span>Customer Travel History</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">My Bus Bookings</h1>
          </div>

          <button
            onClick={() => setCustomerView('HOME')}
            className="px-5 py-2.5 bg-[#F58220] hover:bg-[#d96b0c] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>Book New Ticket</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'CONFIRMED', 'CANCELLED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  filterTab === tab
                    ? 'bg-[#0264A6] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' ? 'All Bookings' : tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by PNR or City..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0264A6] focus:bg-white"
            />
          </div>
        </div>

        {/* Bookings List */}
        {userBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-16 h-16 bg-blue-50 text-[#0264A6] rounded-full flex items-center justify-center mx-auto">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Bookings Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't have any bus tickets matching this filter. Book a luxury bus journey today across top Indian cities.
            </p>
            <button
              onClick={() => setCustomerView('HOME')}
              className="px-6 py-2.5 bg-[#0264A6] text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Search Buses Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-black text-[#0264A6] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      PNR: {b.pnr}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.bookingStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Booked on {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-slate-800">
                    <div className="text-base font-extrabold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#0264A6]" />
                      <span>{b.trip.route.fromCity}</span>
                      <span className="text-slate-400">➔</span>
                      <span>{b.trip.route.toCity}</span>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{b.journeyDate} ({b.departureTime})</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex flex-wrap gap-4">
                    <span>Operator: <strong className="text-slate-800">{b.trip.bus.operatorName}</strong></span>
                    <span>Seat(s): <strong className="text-[#F58220]">{(b.selectedSeats || []).join(', ')}</strong></span>
                    <span>Passengers: <strong className="text-slate-800">{b.passengers.length}</strong></span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-end justify-between w-full md:w-auto gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[11px] text-slate-400">Total Paid</span>
                    <div className="text-xl font-extrabold text-slate-900">
                      ₹{b.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewTicket(b)}
                    className="px-4 py-2 bg-[#0264A6] hover:bg-[#004d80] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Ticket</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
