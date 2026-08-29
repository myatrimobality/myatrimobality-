import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip, Passenger } from '../../types';
import { SeatLayoutSelector } from '../customer/SeatLayoutSelector';
import {
  Zap,
  Search,
  MapPin,
  Calendar,
  User,
  Phone,
  Wallet,
  Printer,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export const AgentQuickBooking: React.FC = () => {
  const {
    trips,
    selectedTrip,
    setSelectedTrip,
    selectedSeats,
    passengers,
    setPassengers,
    contactMobile,
    setContactMobile,
    contactEmail,
    setContactEmail,
    selectedBoardingPoint,
    selectedDroppingPoint,
    currentUser,
    createBooking,
    settings,
    setConfirmedBooking,
    setCustomerView,
  } = useApp();

  const [fromCity, setFromCity] = useState('Kanpur');
  const [toCity, setToCity] = useState('Delhi');
  const [journeyDate, setJourneyDate] = useState('2026-08-30');
  const [isSearching, setIsSearching] = useState(false);
  const [issuedBooking, setIssuedBooking] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Find matching trips
  const availableBuses = trips.filter(
    (t) =>
      t.route.fromCity.toLowerCase().includes(fromCity.toLowerCase()) &&
      t.route.toCity.toLowerCase().includes(toCity.toLowerCase())
  );

  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Pricing & Commission
  const baseFare = passengers.reduce((sum, p) => sum + p.price, 0);
  const gstAmount = Math.round((baseFare * settings.gstPercentage) / 100);
  const grossFare = baseFare + gstAmount + 25; // with fee
  const agentCommissionPercent = currentUser?.commissionValue || 8;
  const agentCommissionAmount = Math.round((baseFare * agentCommissionPercent) / 100);
  const netWalletDebit = grossFare - agentCommissionAmount;

  const handleIssueTicketInstant = async () => {
    setErrorMsg('');

    if (selectedSeats.length === 0) {
      setErrorMsg('Please select at least 1 seat.');
      return;
    }

    for (let i = 0; i < passengers.length; i++) {
      if (!passengers[i].fullName.trim()) {
        setErrorMsg(`Enter passenger name for Seat ${passengers[i].seatNumber}`);
        return;
      }
    }

    if (!contactMobile.trim() || contactMobile.length < 10) {
      setErrorMsg('Enter valid 10-digit mobile number for customer ticket SMS.');
      return;
    }

    if ((currentUser?.walletBalance || 0) < netWalletDebit) {
      setErrorMsg(`Insufficient Agent Wallet balance! Net debit is ₹${netWalletDebit}, available is ₹${currentUser?.walletBalance}. Please recharge wallet.`);
      return;
    }

    setIsProcessing(true);
    try {
      // Direct fast wallet booking without OTP for counter efficiency
      const booking = await createBooking('AGENT_WALLET', 'AGENT');
      setIssuedBooking(booking);
      setIsProcessing(false);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Counter booking failed.');
    }
  };

  const handlePrintA4 = () => {
    if (issuedBooking) {
      setConfirmedBooking(issuedBooking);
      setCustomerView('CONFIRMATION');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#F58220] uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4" />
            <span>High Speed Counter Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Counter Fast Booking</h1>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl flex items-center gap-3 text-xs">
          <div>
            <span className="text-emerald-700 font-bold block">Agent Wallet Available</span>
            <span className="text-base font-black font-mono text-emerald-900">
              ₹{(currentUser?.walletBalance || 45800).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Success Modal / Banner when ticket issued */}
      {issuedBooking ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Ticket Issued Successfully!</h2>
            <div className="font-mono text-xl font-black text-[#0264A6] bg-blue-50 py-2 px-4 rounded-xl inline-block">
              PNR: {issuedBooking.pnr}
            </div>
            <p className="text-xs text-slate-500">
              SMS & WhatsApp alerts sent to customer: {issuedBooking.contactMobile}
            </p>
          </div>

          {/* Quick Counter Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 max-w-lg mx-auto text-xs space-y-2 text-left">
            <div className="flex justify-between">
              <span>Customer Gross Collected:</span>
              <strong className="text-slate-900 font-black">₹{issuedBooking.totalAmount}</strong>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Agent Commission ({agentCommissionPercent}%):</span>
              <span>+ ₹{agentCommissionAmount}</span>
            </div>
            <div className="flex justify-between text-[#0264A6] font-extrabold pt-2 border-t border-slate-200">
              <span>Net Wallet Deducted:</span>
              <span>₹{netWalletDebit}</span>
            </div>
          </div>

          {/* Print Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handlePrintA4}
              className="px-6 py-3 bg-[#0264A6] hover:bg-[#004d80] text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print A4 Ticket / Receipt</span>
            </button>

            <button
              onClick={() => {
                setIssuedBooking(null);
                setSelectedTrip(null);
              }}
              className="px-6 py-3 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Issue Next Counter Ticket</span>
            </button>
          </div>
        </div>
      ) : (
        /* Counter Workflow */
        <div className="space-y-6">
          {/* 1. Fast Route Search Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-4">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">From City</label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
                  <MapPin className="w-4 h-4 text-[#0264A6] mr-2" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">To City</label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
                  <MapPin className="w-4 h-4 text-[#F58220] mr-2" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Date</label>
                <div className="flex items-center bg-slate-50 border border-slate-300 rounded-xl px-3 py-2">
                  <Calendar className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. List of Matching Buses with 1-Click Select */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Available Buses ({availableBuses.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableBuses.map((trip) => {
                const isSelected = selectedTrip?.id === trip.id;
                const availableSeatsCount = trip.seats.filter((s) => s.status === 'AVAILABLE').length;

                return (
                  <div
                    key={trip.id}
                    onClick={() => handleSelectTrip(trip)}
                    className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all shadow-xs ${
                      isSelected
                        ? 'border-[#0264A6] ring-2 ring-[#0264A6]/20 bg-blue-50/40'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-extrabold text-slate-900 text-sm">{trip.bus.operatorName}</div>
                        <div className="text-[11px] text-slate-500">
                          {trip.bus.isAC ? 'AC' : 'Non-AC'} {trip.bus.isSleeper ? 'Sleeper' : 'Seater'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">₹{trip.basePrice}</div>
                        <span className="text-[10px] text-emerald-600 font-bold">{availableSeatsCount} left</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <span>Dep: <strong>{trip.departureTime}</strong></span>
                      <span>Arr: <strong>{trip.arrivalTime}</strong></span>
                      <span>{trip.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. If bus selected, render Interactive Seat Layout & Passenger Form */}
          {selectedTrip && (
            <div className="space-y-6">
              <SeatLayoutSelector
                trip={selectedTrip}
                isAgentFlow={true}
                onProceed={() => {}}
              />

              {/* Fast Passenger & Contact Entry */}
              {selectedSeats.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0264A6]" />
                    Counter Passenger Entry ({passengers.length} Passenger{passengers.length > 1 ? 's' : ''})
                  </h3>

                  <div className="space-y-4">
                    {passengers.map((p, idx) => (
                      <div key={p.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="sm:col-span-2 font-mono font-black text-xs text-[#0264A6]">
                          Seat {p.seatNumber}
                        </div>

                        <div className="sm:col-span-5">
                          <input
                            type="text"
                            required
                            placeholder="Passenger Full Name *"
                            value={p.fullName}
                            onChange={(e) => handlePassengerChange(idx, 'fullName', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0264A6]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <input
                            type="number"
                            min="1"
                            max="110"
                            placeholder="Age *"
                            value={p.age}
                            onChange={(e) => handlePassengerChange(idx, 'age', parseInt(e.target.value) || '')}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0264A6]"
                          />
                        </div>

                        <div className="sm:col-span-3 flex gap-1">
                          {(['MALE', 'FEMALE'] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => handlePassengerChange(idx, 'gender', g)}
                              className={`flex-1 py-2 text-[11px] font-bold rounded-xl border transition-all ${
                                p.gender === g
                                  ? 'bg-[#0264A6] text-white border-[#0264A6]'
                                  : 'bg-white text-slate-600 border-slate-300'
                              }`}
                            >
                              {g === 'MALE' ? 'Male' : 'Female'}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Customer Mobile Number (For SMS Ticket) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactMobile}
                        onChange={(e) => setContactMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Customer Email (Optional)
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="customer@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Instant Debit Calculation Bar */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-300">Gross Fare Collected from Customer: ₹{grossFare}</div>
                      <div className="text-xs text-emerald-400 font-bold">
                        Agent Commission Earned: + ₹{agentCommissionAmount} ({agentCommissionPercent}%)
                      </div>
                      <div className="text-lg font-black text-white mt-1">
                        Net Wallet Auto-Debit: <span className="text-amber-400">₹{netWalletDebit}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleIssueTicketInstant}
                      className="px-6 py-3.5 bg-[#F58220] hover:bg-[#d96b0c] text-white font-black text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4" />
                      <span>{isProcessing ? 'Issuing Ticket...' : 'Instant Issue Ticket'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
