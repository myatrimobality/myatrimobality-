import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bus,
  Calendar,
  Users,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

interface OperatorDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenAddTrip: () => void;
  onOpenAddBus: () => void;
}

export const OperatorDashboard: React.FC<OperatorDashboardProps> = ({
  onNavigateTab,
  onOpenAddTrip,
  onOpenAddBus,
}) => {
  const { buses, trips, bookings, currentUser } = useApp();

  const totalBuses = buses.length;
  const activeBuses = buses.filter((b) => b.status === 'ACTIVE').length;
  const totalTrips = trips.length;

  // Calculate gross revenue
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.bookingStatus === 'CONFIRMED' ? b.totalAmount : 0), 0);
  const operatorNetPayout = Math.round(totalRevenue * 0.9); // 90% payout after 10% platform fee

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0264A6] rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Fleet Operations Hub
            </span>
            <span className="text-xs text-blue-200">ISO 9001:2026 Certified Operator</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black">
            {currentUser?.operatorCompanyName || 'Royal Travels Kanpur'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Operating luxury Volvo & AC Sleeper corridors across UP, NCR & Rajasthan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddTrip}
            className="px-5 py-3 bg-[#F58220] hover:bg-[#d96b0c] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-2 transition-all"
          >
            <Calendar className="w-4 h-4" />
            <span>+ Create Schedule</span>
          </button>

          <button
            onClick={onOpenAddBus}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 flex items-center gap-2 transition-all"
          >
            <Bus className="w-4 h-4 text-amber-300" />
            <span>+ Add Bus</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Fleet Strength */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Fleet Strength</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0264A6] flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalBuses} Buses <span className="text-xs text-emerald-600 font-bold">({activeBuses} Active)</span>
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between pt-1 border-t border-slate-100">
            <span>1 Under Scheduled Maintenance</span>
            <button onClick={() => onNavigateTab('FLEET')} className="text-[#0264A6] font-bold hover:underline">
              Manage Fleet
            </button>
          </div>
        </div>

        {/* 2. Today's Scheduled Trips */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Daily Schedules</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#F58220] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalTrips} Active Trips
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between pt-1 border-t border-slate-100">
            <span>Average Occupancy: <strong>86.4%</strong></span>
            <button onClick={() => onNavigateTab('TRIPS')} className="text-[#0264A6] font-bold hover:underline">
              View Trips
            </button>
          </div>
        </div>

        {/* 3. Gross Bookings Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Gross Revenue (Month)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between pt-1 border-t border-slate-100">
            <span>Net Payout: ₹{operatorNetPayout.toLocaleString('en-IN')}</span>
            <span className="text-emerald-600 font-bold">↑ 12% MoM</span>
          </div>
        </div>

        {/* 4. Total Passengers Carried */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
            <span>Passengers Carried</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            4,820 Yatri
          </div>
          <div className="text-[11px] text-slate-400 font-medium flex justify-between pt-1 border-t border-slate-100">
            <span>4.8 ★ Fleet Rating</span>
            <button onClick={() => onNavigateTab('PASSENGER_CHART')} className="text-[#0264A6] font-bold hover:underline">
              Manifest
            </button>
          </div>
        </div>
      </div>

      {/* Today's Active Departures Live List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">Today's Fleet Schedules & Occupancy</h2>
            <p className="text-xs text-slate-500">Live monitor of departure readiness, conductor manifests and seat status</p>
          </div>

          <button
            onClick={() => onNavigateTab('TRIPS')}
            className="text-xs font-bold text-[#0264A6] hover:underline flex items-center gap-1"
          >
            <span>View All Schedules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Trips Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Bus & Reg. No</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Departure Time</th>
                <th className="py-3 px-4">Booked / Total</th>
                <th className="py-3 px-4">Occupancy</th>
                <th className="py-3 px-4">Ticket Price</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((trip) => {
                const bookedCount = trip.seats.filter((s) => s.status === 'BOOKED').length;
                const totalCount = trip.seats.length;
                const occupancyRate = Math.round((bookedCount / totalCount) * 100);

                return (
                  <tr key={trip.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">{trip.bus.busName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{trip.bus.busNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {trip.route.fromCity} ➔ {trip.route.toCity}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {trip.route.viaCities && trip.route.viaCities.length > 0
                          ? trip.route.viaCities.join(', ')
                          : `${trip.route.estimatedDuration} • Direct Highway Route`}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {trip.departureTime}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700">
                      {bookedCount} / {totalCount} seats
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              occupancyRate > 75
                                ? 'bg-emerald-500'
                                : occupancyRate > 40
                                ? 'bg-[#0264A6]'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-[11px] text-slate-700">{occupancyRate}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                      ₹{trip.basePrice}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onNavigateTab('PASSENGER_CHART')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0264A6] font-bold rounded-lg transition-colors text-[11px]"
                      >
                        Conductor Chart
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
