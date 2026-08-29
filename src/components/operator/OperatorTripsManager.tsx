import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Bus,
  Plus,
  Users,
  Printer,
  Edit,
  Trash2,
  FileSpreadsheet,
  AlertTriangle,
  Search
} from 'lucide-react';

interface OperatorTripsManagerProps {
  onOpenAddTrip: () => void;
  onViewManifest: (trip: Trip) => void;
}

export const OperatorTripsManager: React.FC<OperatorTripsManagerProps> = ({
  onOpenAddTrip,
  onViewManifest,
}) => {
  const { trips } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredTrips = trips.filter((t) => {
    return (
      t.route.fromCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.route.toCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.bus.busName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#0264A6] uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Route Schedules</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Trip & Schedule Management</h1>
        </div>

        <button
          onClick={onOpenAddTrip}
          className="px-5 py-2.5 bg-[#F58220] hover:bg-[#d96b0c] text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Trip Schedule</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search Route, Bus Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0264A6] w-64"
          />
        </div>

        <div className="text-xs font-bold text-slate-500">
          Showing <strong className="text-slate-900">{filteredTrips.length}</strong> Scheduled Departures
        </div>
      </div>

      {/* Trips Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Departure Date & Time</th>
                <th className="py-3.5 px-4">Route</th>
                <th className="py-3.5 px-4">Bus Assigned</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Booked / Total</th>
                <th className="py-3.5 px-4">Base Fare</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrips.map((trip) => {
                const bookedCount = trip.seats.filter((s) => s.status === 'BOOKED').length;
                const totalCount = trip.seats.length;
                const occupancy = Math.round((bookedCount / totalCount) * 100);

                return (
                  <tr key={trip.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{trip.departureDate}</div>
                      <div className="text-xs font-mono font-black text-[#0264A6]">{trip.departureTime}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">
                        {trip.route.fromCity} ➔ {trip.route.toCity}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {trip.route.boardingPoints.length} Boarding • {trip.route.droppingPoints.length} Drops
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{trip.bus.busName}</div>
                      <div className="text-[10px] text-slate-400">{trip.bus.busNumber}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">{trip.duration}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{bookedCount} / {totalCount}</div>
                      <span className="text-[10px] text-emerald-600 font-bold">{occupancy}% Booked</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">₹{trip.basePrice}</td>
                    <td className="py-3.5 px-4">
                      <span className="bg-blue-100 text-[#0264A6] px-2 py-0.5 rounded text-[10px] font-black uppercase">
                        {trip.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => onViewManifest(trip)}
                        className="px-2.5 py-1.5 bg-[#0264A6] hover:bg-[#004d80] text-white font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Passenger Chart
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
