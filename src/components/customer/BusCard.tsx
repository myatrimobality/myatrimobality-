import React, { useState } from 'react';
import { Trip, Amenity } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Star,
  Clock,
  MapPin,
  Wifi,
  Zap,
  ShieldCheck,
  Tv,
  Coffee,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Users
} from 'lucide-react';

interface BusCardProps {
  trip: Trip;
  onSelectSeats: (trip: Trip) => void;
  isExpanded?: boolean;
}

export const BusCard: React.FC<BusCardProps> = ({ trip, onSelectSeats, isExpanded = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { bus, route } = trip;

  // Amenity icon mapping
  const renderAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="w-3.5 h-3.5 text-blue-700" />;
    if (lower.includes('charg') || lower.includes('usb')) return <Zap className="w-3.5 h-3.5 text-orange-500" />;
    if (lower.includes('cctv') || lower.includes('gps') || lower.includes('safe')) return <ShieldCheck className="w-3.5 h-3.5 text-green-600" />;
    return <Sparkles className="w-3.5 h-3.5 text-slate-400" />;
  };

  const availableCount = trip.seats.filter((s) => s.status === 'AVAILABLE' || s.status === 'FEMALE_RESERVED').length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Top Row: Operator Info, Rating & Price */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">{bus.operatorName}</h3>
              {bus.operatorName.includes('M Yatri') && (
                <span className="bg-blue-800 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  M Yatri Flagship
                </span>
              )}
              <div className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-xs font-bold">
                <Star className="w-3 h-3 fill-green-600 text-green-600" />
                <span>{bus.operatorRating.toFixed(1)}</span>
                <span className="text-[10px] text-green-600 font-normal">({bus.totalReviews.toLocaleString()})</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              {bus.busName} • {bus.isAC ? 'AC' : 'Non-AC'} {bus.isSleeper ? 'Sleeper (2+1)' : 'Seater'} • {bus.busNumber}
            </p>
          </div>

          {/* Pricing & Seat count */}
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-medium">Starting from</span>
            <div className="text-2xl font-bold text-slate-900">
              ₹{trip.basePrice.toLocaleString('en-IN')}
            </div>
            <span className="text-xs font-semibold text-green-600">
              {availableCount} seats left
            </span>
          </div>
        </div>

        {/* Middle Row: Schedule Timings & Duration */}
        <div className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          {/* Departure */}
          <div className="sm:col-span-4">
            <div className="text-xl font-extrabold text-slate-900">{trip.departureTime}</div>
            <div className="text-xs font-bold text-slate-800">{route.fromCity}</div>
            <div className="text-[11px] text-slate-500 truncate" title={route.boardingPoints[0]?.name}>
              {route.boardingPoints[0]?.name}
            </div>
          </div>

          {/* Duration Graphic */}
          <div className="sm:col-span-4 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-slate-500 mb-1">{trip.duration}</span>
            <div className="w-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-800"></div>
              <div className="flex-1 h-0.5 bg-slate-200 border-t border-dashed border-slate-300"></div>
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              {route.restStops.length > 0 ? `${route.restStops.length} Rest Stop` : 'Express Non-Stop'}
            </span>
          </div>

          {/* Arrival */}
          <div className="sm:col-span-4 sm:text-right">
            <div className="text-xl font-extrabold text-slate-900">{trip.arrivalTime}</div>
            <div className="text-xs font-bold text-slate-800">{route.toCity}</div>
            <div className="text-[11px] text-slate-500 truncate" title={route.droppingPoints[0]?.name}>
              {route.droppingPoints[0]?.name}
            </div>
          </div>
        </div>

        {/* Bottom Row: Amenities & Action button */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Amenities Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {bus.amenities.slice(0, 4).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 bg-slate-50 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-md border border-slate-200"
              >
                {renderAmenityIcon(amenity)}
                <span>{amenity}</span>
              </span>
            ))}
            {bus.amenities.length > 4 && (
              <span className="text-[11px] text-slate-400 font-bold">+{bus.amenities.length - 4} more</span>
            )}
          </div>

          {/* Buttons: Details toggle & View Seats */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-bold text-slate-600 hover:text-blue-800 px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-1 transition-colors"
            >
              <span>Boarding & Amenities</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => onSelectSeats(trip)}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow transition-colors active:scale-98"
            >
              {isExpanded ? 'Hide Seats' : 'View Seats'}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Boarding/Dropping & Amenities Drawer */}
      {showDetails && (
        <div className="bg-slate-50 p-5 border-t border-slate-200 text-xs animate-in slide-in-from-top-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Boarding Points */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-blue-700" />
                Boarding Points ({route.fromCity})
              </h4>
              <ul className="space-y-2">
                {route.boardingPoints.map((bp) => (
                  <li key={bp.id} className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between font-bold">
                      <span>{bp.name}</span>
                      <span className="text-blue-700">{bp.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{bp.landmark}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dropping Points */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                Dropping Points ({route.toCity})
              </h4>
              <ul className="space-y-2">
                {route.droppingPoints.map((dp) => (
                  <li key={dp.id} className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between font-bold">
                      <span>{dp.name}</span>
                      <span className="text-orange-600">{dp.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{dp.landmark}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Complete Amenities & Cancellation info */}
            <div>
              <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase tracking-wider">
                Amenities & Cancellation
              </h4>
              <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {bus.amenities.map((a, i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                      ✓ {a}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <p className="font-bold text-slate-800">Cancellation Slab:</p>
                  <p>• &gt;24 hrs before: 90% refund</p>
                  <p>• 12-24 hrs: 75% refund</p>
                  <p>• 2-12 hrs: 50% refund</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
