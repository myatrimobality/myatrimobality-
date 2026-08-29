import React, { useState } from 'react';
import { Trip, Seat, StopPoint } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  Shield,
  MapPin,
  CheckCircle,
  AlertCircle,
  User,
  ArrowRight,
  Info,
  Tag
} from 'lucide-react';

interface SeatLayoutSelectorProps {
  trip: Trip;
  onProceed: () => void;
  isAgentFlow?: boolean;
}

export const SeatLayoutSelector: React.FC<SeatLayoutSelectorProps> = ({
  trip,
  onProceed,
  isAgentFlow = false,
}) => {
  const {
    selectedSeats,
    lockSeat,
    unlockSeat,
    seatLockTimeRemaining,
    selectedBoardingPoint,
    setSelectedBoardingPoint,
    selectedDroppingPoint,
    setSelectedDroppingPoint,
    settings,
    currentUser,
    passengers
  } = useApp();

  const [activeDeck, setActiveDeck] = useState<'ALL' | 'LOWER' | 'UPPER'>('ALL');

  // Initialize default boarding/dropping points if not selected
  React.useEffect(() => {
    if (!selectedBoardingPoint && trip.route.boardingPoints.length > 0) {
      setSelectedBoardingPoint(trip.route.boardingPoints[0]);
    }
    if (!selectedDroppingPoint && trip.route.droppingPoints.length > 0) {
      setSelectedDroppingPoint(trip.route.droppingPoints[0]);
    }
  }, [trip, selectedBoardingPoint, selectedDroppingPoint]);

  const upperSeats = trip.seats.filter((s) => s.deck === 'UPPER');
  const lowerSeats = trip.seats.filter((s) => s.deck === 'LOWER');

  // Calculate pricing breakdown
  const selectedSeatObjects = trip.seats.filter((s) => selectedSeats.includes(s.seatNumber));
  const baseFare = selectedSeatObjects.reduce((sum, s) => sum + s.basePrice, 0);
  const gstAmount = Math.round((baseFare * settings.gstPercentage) / 100);
  const convenienceFee = selectedSeats.length > 0 ? (Math.round((baseFare * settings.convenienceFeePercentage) / 100) || 25) : 0;
  const insuranceAmount = selectedSeats.length * 15;
  const totalAmount = baseFare + gstAmount + convenienceFee + insuranceAmount;

  // Agent Commission calculation if in agent mode
  let agentCommission = 0;
  let netPayableByAgent = totalAmount;
  if (isAgentFlow && currentUser?.role === 'AGENT') {
    const commRate = currentUser.commissionValue || settings.defaultAgentCommissionPercent;
    if (currentUser.commissionType === 'FIXED') {
      agentCommission = commRate * selectedSeats.length;
    } else {
      agentCommission = Math.round((baseFare * commRate) / 100);
    }
    netPayableByAgent = totalAmount - agentCommission;
  }

  // Format lock countdown (MM:SS)
  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Render individual seat item
  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.includes(seat.seatNumber);
    const isBooked = seat.status === 'BOOKED';
    const isFemale = seat.status === 'FEMALE_RESERVED';
    const isSleeper = seat.type === 'SLEEPER';

    let bgClass = 'bg-white border-slate-300 text-slate-700 hover:border-[#0264A6] hover:shadow-xs';
    if (isBooked) {
      bgClass = 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed';
    } else if (isSelected) {
      bgClass = 'bg-[#F58220] border-[#F58220] text-white shadow-md font-bold scale-105';
    } else if (isFemale) {
      bgClass = 'bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100';
    }

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked}
        onClick={() => {
          if (!isBooked) {
            lockSeat(seat.seatNumber);
          }
        }}
        title={`Seat ${seat.seatNumber} - ₹${seat.basePrice} (${seat.type}) - ${seat.status}`}
        className={`relative flex flex-col items-center justify-between p-1.5 rounded-lg border text-center transition-all ${bgClass} ${
          isSleeper ? 'w-14 h-24' : 'w-12 h-14'
        }`}
      >
        {/* Top Pillow / Headrest indicator */}
        <div
          className={`w-full h-2 rounded-sm mb-1 ${
            isSelected ? 'bg-white/40' : isBooked ? 'bg-slate-300' : isFemale ? 'bg-pink-200' : 'bg-slate-200'
          }`}
        />

        {/* Seat Number & Icon */}
        <div className="flex flex-col items-center my-auto">
          <span className="font-extrabold text-xs">{seat.seatNumber}</span>
          <span className={`text-[9px] font-semibold ${isSelected ? 'text-white' : 'text-slate-500'}`}>
            ₹{seat.basePrice}
          </span>
        </div>

        {/* Female reserved indicator */}
        {isFemale && !isSelected && (
          <span className="text-[8px] bg-pink-600 text-white font-bold px-1 rounded-full">F</span>
        )}
      </button>
    );
  };

  return (
    <div className="bg-slate-100/80 rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-inner mt-4 animate-in fade-in">
      {/* Real-time Seat Lock Banner */}
      {selectedSeats.length > 0 && (
        <div className="mb-6 bg-amber-500/10 border border-amber-400/40 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Seats locked for you: {(selectedSeats || []).join(', ')}</span>
          </div>
          <div className="bg-amber-500 text-white font-mono font-bold px-2.5 py-1 rounded-md text-xs shadow-xs">
            Expires in: {formatTimer(seatLockTimeRemaining)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Bus Deck Seat Layout (Lower & Upper) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          {/* Deck selector if sleeper bus */}
          {upperSeats.length > 0 && (
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="text-xs font-extrabold uppercase text-slate-400">Select Berth Deck</span>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveDeck('ALL')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeDeck === 'ALL' ? 'bg-[#0264A6] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Both Decks
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeck('LOWER')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeDeck === 'LOWER' ? 'bg-[#0264A6] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lower Deck ({lowerSeats.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeck('UPPER')}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeDeck === 'UPPER' ? 'bg-[#0264A6] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upper Deck ({upperSeats.length})
                </button>
              </div>
            </div>
          )}

          {/* Seat Layout Graphics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
            {/* Lower Deck Container */}
            {(activeDeck === 'ALL' || activeDeck === 'LOWER') && (
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 relative">
                <div className="flex items-center justify-between mb-3 text-xs font-extrabold text-slate-700 pb-2 border-b border-slate-200">
                  <span>Lower Deck</span>
                  <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Front / Driver ➔
                  </span>
                </div>

                {/* Grid of seats */}
                <div className="flex flex-wrap gap-2.5 justify-center py-2">
                  {lowerSeats.map((seat) => renderSeat(seat))}
                </div>
              </div>
            )}

            {/* Upper Deck Container */}
            {upperSeats.length > 0 && (activeDeck === 'ALL' || activeDeck === 'UPPER') && (
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 relative">
                <div className="flex items-center justify-between mb-3 text-xs font-extrabold text-slate-700 pb-2 border-b border-slate-200">
                  <span>Upper Deck</span>
                  <span className="text-[10px] text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    Front / Window View ➔
                  </span>
                </div>

                {/* Grid of seats */}
                <div className="flex flex-wrap gap-2.5 justify-center py-2">
                  {upperSeats.map((seat) => renderSeat(seat))}
                </div>
              </div>
            )}
          </div>

          {/* Seat Legend Key */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded border border-slate-300 bg-white"></div>
              <span className="text-slate-600">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-[#F58220]"></div>
              <span className="font-bold text-slate-800">Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-pink-100 border border-pink-300"></div>
              <span className="text-pink-700 font-semibold">Female Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded bg-slate-300"></div>
              <span className="text-slate-400">Booked</span>
            </div>
          </div>
        </div>

        {/* Right Side: Boarding/Dropping Selector & Fare Calculation */}
        <div className="lg:col-span-5 space-y-4">
          {/* Boarding Point Selection */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0264A6]" />
              Select Boarding Point ({trip.route.fromCity})
            </label>
            <div className="space-y-1.5">
              {trip.route.boardingPoints.map((bp) => (
                <label
                  key={bp.id}
                  className={`flex items-start justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                    selectedBoardingPoint?.id === bp.id
                      ? 'border-[#0264A6] bg-blue-50/70 font-semibold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="boarding_point"
                      checked={selectedBoardingPoint?.id === bp.id}
                      onChange={() => setSelectedBoardingPoint(bp)}
                      className="mt-0.5 text-[#0264A6] focus:ring-[#0264A6]"
                    />
                    <div>
                      <div className="font-bold text-slate-800">{bp.name}</div>
                      <div className="text-[11px] text-slate-500">{bp.landmark}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#0264A6]">{bp.time}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Dropping Point Selection */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#F58220]" />
              Select Dropping Point ({trip.route.toCity})
            </label>
            <div className="space-y-1.5">
              {trip.route.droppingPoints.map((dp) => (
                <label
                  key={dp.id}
                  className={`flex items-start justify-between p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                    selectedDroppingPoint?.id === dp.id
                      ? 'border-[#F58220] bg-orange-50/70 font-semibold shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="dropping_point"
                      checked={selectedDroppingPoint?.id === dp.id}
                      onChange={() => setSelectedDroppingPoint(dp)}
                      className="mt-0.5 text-[#F58220] focus:ring-[#F58220]"
                    />
                    <div>
                      <div className="font-bold text-slate-800">{dp.name}</div>
                      <div className="text-[11px] text-slate-500">{dp.landmark}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-[#F58220]">{dp.time}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Fare Breakup Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h4 className="font-extrabold text-slate-900 text-sm mb-3 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Fare Breakup</span>
              <span className="text-xs font-semibold text-slate-500">
                {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
              </span>
            </h4>

            {selectedSeats.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">
                Click on any seat on the left to view fare summary
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Seats:</span>
                  <span className="font-bold text-slate-900">{(selectedSeats || []).join(', ')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Base Ticket Price:</span>
                  <span>₹{baseFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (5%):</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Convenience Fee:</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Travel Insurance (₹15/pax):</span>
                  <span>₹{insuranceAmount}</span>
                </div>

                {isAgentFlow && currentUser?.role === 'AGENT' && (
                  <div className="pt-2 border-t border-dashed border-slate-200">
                    <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg">
                      <span>Agent Commission ({currentUser.commissionValue}%):</span>
                      <span>- ₹{agentCommission.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-900">
                  <span>{isAgentFlow ? 'Net Payable by Agent:' : 'Total Amount:'}</span>
                  <span className="text-lg text-[#0264A6]">
                    ₹{(isAgentFlow ? netPayableByAgent : totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Continue button */}
                <button
                  type="button"
                  onClick={onProceed}
                  disabled={selectedSeats.length === 0}
                  className="w-full mt-4 py-3 bg-[#0264A6] hover:bg-[#004d80] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Continue to Passenger Details</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
