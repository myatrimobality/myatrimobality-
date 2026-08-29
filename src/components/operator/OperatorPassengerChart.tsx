import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip } from '../../types';
import {
  Users,
  Printer,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Search,
  Check,
  X,
  FileSpreadsheet,
  Bus
} from 'lucide-react';

interface OperatorPassengerChartProps {
  initialTrip?: Trip | null;
}

export const OperatorPassengerChart: React.FC<OperatorPassengerChartProps> = ({ initialTrip }) => {
  const { trips, bookings } = useApp();

  const [selectedTripId, setSelectedTripId] = useState<string>(
    initialTrip?.id || trips[0]?.id || ''
  );
  const [boardedSeats, setBoardedSeats] = useState<string[]>(['L1', 'L2']);

  const currentTrip = trips.find((t) => t.id === selectedTripId) || trips[0];
  const tripBookings = bookings.filter((b) => b.tripId === currentTrip?.id || true);

  // Flatten all passengers from bookings for this trip
  const manifestRows: any[] = [];
  tripBookings.forEach((b) => {
    b.passengers.forEach((p) => {
      manifestRows.push({
        pnr: b.pnr,
        contactMobile: b.contactMobile,
        boardingPoint: b.boardingPoint.name,
        droppingPoint: b.droppingPoint.name,
        passengerName: p.fullName,
        age: p.age,
        gender: p.gender,
        seatNumber: p.seatNumber,
        fare: p.price,
        channel: b.bookingChannel,
      });
    });
  });

  const toggleBoarding = (seatNo: string) => {
    if (boardedSeats.includes(seatNo)) {
      setBoardedSeats(boardedSeats.filter((s) => s !== seatNo));
    } else {
      setBoardedSeats([...boardedSeats, seatNo]);
    }
  };

  const handlePrintManifest = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header (Hidden in Print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#0264A6] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Conductor & Driver Tools</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Passenger Boarding Chart</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Trip Selector */}
          <select
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 shadow-xs focus:ring-2 focus:ring-[#0264A6]"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.route.fromCity} ➔ {t.route.toCity} ({t.departureTime}) - {t.bus.busNumber}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrintManifest}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Manifest</span>
          </button>
        </div>
      </div>

      {/* Manifest Sheet (Print Friendly) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Trip Meta Banner */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400">Scheduled Departure Manifest</span>
            <div className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{currentTrip.route.fromCity}</span>
              <span className="text-[#F58220]">➔</span>
              <span>{currentTrip.route.toCity}</span>
            </div>
            <div className="text-xs text-slate-600">
              Bus: <strong>{currentTrip.bus.busName}</strong> ({currentTrip.bus.busNumber}) • Dep Time: <strong>{currentTrip.departureTime}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
              Boarded: <strong>{boardedSeats.length}</strong>
            </div>
            <div className="bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl border border-amber-200">
              Pending: <strong>{Math.max(0, manifestRows.length - boardedSeats.length)}</strong>
            </div>
          </div>
        </div>

        {/* Passenger List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-black border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Seat</th>
                <th className="py-3 px-4">Passenger Name</th>
                <th className="py-3 px-3">Age / Gender</th>
                <th className="py-3 px-3">PNR</th>
                <th className="py-3 px-4">Boarding Point</th>
                <th className="py-3 px-4">Dropping Point</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3 text-right print:hidden">Boarding Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {manifestRows.map((row, idx) => {
                const isBoarded = boardedSeats.includes(row.seatNumber);
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${isBoarded ? 'bg-emerald-50/40' : 'hover:bg-slate-50'}`}
                  >
                    <td className="py-3.5 px-3">
                      <span className="font-mono font-black text-xs text-[#0264A6] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {row.seatNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.passengerName}</td>
                    <td className="py-3.5 px-3 text-slate-600">{row.age} / {row.gender}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700">{row.pnr}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{row.boardingPoint}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.droppingPoint}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-600">{row.contactMobile}</td>
                    <td className="py-3.5 px-3 text-right print:hidden">
                      <button
                        type="button"
                        onClick={() => toggleBoarding(row.seatNumber)}
                        className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
                          isBoarded
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {isBoarded ? '✓ Boarded' : 'Mark Boarded'}
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
