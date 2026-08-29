import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip, Bus, Seat } from '../../types';
import { Calendar, X, Clock, MapPin, Bus as BusIcon, Plus } from 'lucide-react';

interface AddTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTripModal: React.FC<AddTripModalProps> = ({ isOpen, onClose }) => {
  const { buses, addTrip } = useApp();

  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || '');
  const [fromCity, setFromCity] = useState('Kanpur');
  const [toCity, setToCity] = useState('Delhi');
  const [departureDate, setDepartureDate] = useState('2026-08-30');
  const [departureTime, setDepartureTime] = useState('21:00');
  const [arrivalTime, setArrivalTime] = useState('05:30');
  const [duration, setDuration] = useState('8h 30m');
  const [basePrice, setBasePrice] = useState(899);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

    // Generate fresh seats
    const generatedSeats: Seat[] = [];
    const total = assignedBus.totalSeats;
    for (let i = 1; i <= total; i++) {
      const isUpper = i > total / 2;
      const seatNum = isUpper ? `U${i - total / 2}` : `L${i}`;
      generatedSeats.push({
        id: `s-${seatNum}`,
        seatNumber: seatNum,
        deck: isUpper ? 'UPPER' : 'LOWER',
        row: Math.ceil(i / 3),
        column: (i % 3) + 1,
        type: assignedBus.isSleeper ? 'SLEEPER' : 'SEATER',
        status: 'AVAILABLE',
        basePrice: Number(basePrice),
        isWindow: i % 2 === 1,
      });
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      busId: assignedBus.id,
      operatorId: assignedBus.operatorId,
      routeId: `route-${Date.now()}`,
      bus: assignedBus,
      route: {
        id: `route-${Date.now()}`,
        fromCity: fromCity.trim(),
        toCity: toCity.trim(),
        distanceKm: 490,
        estimatedDuration: duration,
        boardingPoints: [
          { id: 'bp-1', name: `${fromCity} ISBT Bus Terminal`, time: departureTime, landmark: 'Main Entrance' },
          { id: 'bp-2', name: `${fromCity} Bypass Flyover`, time: `${departureTime} + 20m`, landmark: 'Toll Plaza' },
        ],
        droppingPoints: [
          { id: 'dp-1', name: `${toCity} Kashmiri Gate ISBT`, time: arrivalTime, landmark: 'Metro Gate 2' },
          { id: 'dp-2', name: `${toCity} Anand Vihar`, time: `${arrivalTime} + 25m`, landmark: 'Pillar 44' },
        ],
        restStops: [{ name: 'Highway Oasis Plaza', duration: '30 mins', location: 'Midway' }],
        isActive: true,
      },
      departureDate,
      departureTime,
      arrivalDate: departureDate,
      arrivalTime,
      duration,
      basePrice: Number(basePrice),
      dynamicSurgeMultiplier: 1.0,
      seats: generatedSeats,
      isCancelled: false,
    };

    addTrip(newTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 text-[#F58220] rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Create New Route Schedule</h3>
              <p className="text-xs text-slate-500">Publish departure for customer & agent bookings</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Bus */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assign Bus from Fleet *</label>
            <select
              value={selectedBusId}
              onChange={(e) => setSelectedBusId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
            >
              {buses.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.busNumber} - {b.busName} ({b.totalSeats} seats)
                </option>
              ))}
            </select>
          </div>

          {/* From & To City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">From City *</label>
              <input
                type="text"
                required
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">To City *</label>
              <input
                type="text"
                required
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {/* Departure Date & Timings */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Departure</label>
              <input
                type="text"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                placeholder="21:00"
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Arrival</label>
              <input
                type="text"
                required
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                placeholder="05:30"
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          {/* Base Fare & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Base Fare (₹ per seat) *</label>
              <input
                type="number"
                required
                min="100"
                step="50"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Journey Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 8h 30m"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0264A6] hover:bg-[#004d80] text-white font-extrabold text-xs rounded-xl shadow-xs"
            >
              Publish Trip Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
