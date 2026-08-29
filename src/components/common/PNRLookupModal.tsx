import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MYatriLogo } from './MYatriLogo';
import {
  Search,
  X,
  Printer,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

export const PNRLookupModal: React.FC = () => {
  const {
    pnrSearchModalOpen,
    setPnrSearchModalOpen,
    lookupPnr,
    searchedBookingForPnr,
    setConfirmedBooking,
    setCustomerView,
    cancelBooking,
  } = useApp();

  const [pnrInput, setPnrInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searched, setSearched] = useState(false);

  if (!pnrSearchModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) {
      setErrorMsg('Please enter a valid PNR number');
      return;
    }
    setErrorMsg('');
    setSearched(true);
    const result = lookupPnr(pnrInput.trim());
    if (!result) {
      setErrorMsg(`No booking found matching PNR "${pnrInput.trim().toUpperCase()}". Check sample PNR: MY-2026-88942`);
    }
  };

  const handleOpenTicket = () => {
    if (searchedBookingForPnr) {
      setConfirmedBooking(searchedBookingForPnr);
      setPnrSearchModalOpen(false);
      setCustomerView('CONFIRMATION');
    }
  };

  const handleCancelTicket = () => {
    if (!searchedBookingForPnr) return;
    if (window.confirm(`Are you sure you want to cancel PNR ${searchedBookingForPnr.pnr}?`)) {
      const res = cancelBooking(searchedBookingForPnr.id, 'Customer requested PNR cancellation');
      if (res.success) {
        alert(`PNR ${searchedBookingForPnr.pnr} has been cancelled. Refund of ₹${res.refundAmount} has been processed!`);
        lookupPnr(searchedBookingForPnr.pnr);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#005BA6] to-[#003B6B] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white px-2.5 py-1 rounded-lg shadow-xs border border-white/20 flex items-center">
              <MYatriLogo size="sm" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Check PNR / Ticket Status</h3>
              <p className="text-xs text-blue-100">Enter your 10-digit M Yatri PNR number to get live journey details</p>
            </div>
          </div>
          <button
            onClick={() => setPnrSearchModalOpen(false)}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. MY-2026-88942"
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-[#0264A6] focus:bg-white transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#F58220] hover:bg-[#d96b0c] text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>

          {/* Sample quick pills */}
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
            <span>Quick sample PNRs:</span>
            <button
              type="button"
              onClick={() => {
                setPnrInput('MY-2026-88942');
                lookupPnr('MY-2026-88942');
                setSearched(true);
                setErrorMsg('');
              }}
              className="text-[#0264A6] font-semibold underline hover:text-blue-800"
            >
              MY-2026-88942
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setPnrInput('MY-2026-90412');
                lookupPnr('MY-2026-90412');
                setSearched(true);
                setErrorMsg('');
              }}
              className="text-[#0264A6] font-semibold underline hover:text-blue-800"
            >
              MY-2026-90412
            </button>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Searched Booking Card */}
          {searchedBookingForPnr && (
            <div className="mt-6 border border-slate-200 rounded-xl p-5 bg-slate-50">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PNR NUMBER</span>
                  <div className="text-xl font-extrabold text-[#0264A6] flex items-center gap-2">
                    {searchedBookingForPnr.pnr}
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        searchedBookingForPnr.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-700'
                          : searchedBookingForPnr.bookingStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {searchedBookingForPnr.bookingStatus}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500">Amount Paid</span>
                  <div className="text-xl font-bold text-slate-900">
                    ₹{searchedBookingForPnr.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Journey details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 text-xs">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-[#0264A6]" />
                    <span className="font-bold text-slate-900">{searchedBookingForPnr.trip.route.fromCity}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="font-bold text-slate-900">{searchedBookingForPnr.trip.route.toCity}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Journey Date: <strong>{searchedBookingForPnr.journeyDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Departure: <strong>{searchedBookingForPnr.departureTime}</strong></span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Operator: <strong>{searchedBookingForPnr.trip.bus.operatorName}</strong> ({searchedBookingForPnr.trip.bus.busNumber})</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-[#F58220]" />
                    <span>Seat(s): <strong>{(searchedBookingForPnr.selectedSeats || []).join(', ')}</strong> ({searchedBookingForPnr.passengers.length} Passenger{searchedBookingForPnr.passengers.length > 1 ? 's' : ''})</span>
                  </div>
                  <div className="text-slate-500">
                    Boarding Point: <strong>{searchedBookingForPnr.boardingPoint.name}</strong> ({searchedBookingForPnr.boardingPoint.time})
                  </div>
                </div>
              </div>

              {/* Passengers preview */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs mb-4">
                <div className="font-bold text-slate-700 mb-1.5">Passengers:</div>
                <div className="divide-y divide-slate-100">
                  {searchedBookingForPnr.passengers.map((p) => (
                    <div key={p.id} className="py-1 flex items-center justify-between text-slate-600">
                      <span>{p.fullName} ({p.gender}, {p.age} yrs)</span>
                      <span className="font-bold text-[#0264A6]">Seat {p.seatNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 justify-end pt-2 border-t border-slate-200">
                <button
                  onClick={handleOpenTicket}
                  className="px-4 py-2 bg-[#0264A6] hover:bg-[#004d80] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" />
                  View Full E-Ticket
                </button>

                {searchedBookingForPnr.bookingStatus === 'CONFIRMED' && (
                  <button
                    onClick={handleCancelTicket}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    Cancel Booking & Refund
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
