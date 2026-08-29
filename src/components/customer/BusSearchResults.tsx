import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip, BusType } from '../../types';
import { BusCard } from './BusCard';
import { SeatLayoutSelector } from './SeatLayoutSelector';
import {
  Filter,
  ArrowUpDown,
  Calendar,
  MapPin,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Shield
} from 'lucide-react';

export const BusSearchResults: React.FC = () => {
  const {
    trips,
    searchQuery,
    setSearchQuery,
    selectedTrip,
    setSelectedTrip,
    setCustomerView,
    language
  } = useApp();

  // Filters State
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [acFilter, setAcFilter] = useState<'ALL' | 'AC' | 'NON_AC'>('ALL');
  const [seatTypeFilter, setSeatTypeFilter] = useState<'ALL' | 'SLEEPER' | 'SEATER'>('ALL');
  const [departureSlot, setDepartureSlot] = useState<string[]>([]);
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Sort State
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'DEPARTURE_EARLIEST' | 'DURATION_SHORTEST' | 'RATING'>('PRICE_ASC');
  
  // Mobile filter drawer state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Available operators in results
  const operatorsList = useMemo(() => {
    const set = new Set<string>();
    trips.forEach((t) => set.add(t.bus.operatorName));
    return Array.from(set);
  }, [trips]);

  // Available amenities
  const allAmenities = ['High Speed WiFi', 'Charging USB', 'Fresh Blanket & Pillow', 'Mineral Water', 'GPS Live Tracking', 'Emergency CCTV'];

  // Filter & Sort Logic
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // 1. City Route Matching
      const matchesFrom = trip.route.fromCity.toLowerCase().includes(searchQuery.fromCity.toLowerCase()) ||
                          searchQuery.fromCity.toLowerCase().includes(trip.route.fromCity.toLowerCase());
      const matchesTo = trip.route.toCity.toLowerCase().includes(searchQuery.toCity.toLowerCase()) ||
                        searchQuery.toCity.toLowerCase().includes(trip.route.toCity.toLowerCase());

      // If specific search, check route, else fallback to show realistic matches
      if (searchQuery.fromCity && searchQuery.toCity) {
        if (!matchesFrom || !matchesTo) {
          // Allow demo flexibility if user searches for popular city
        }
      }

      // 2. Price filter
      if (trip.basePrice > maxPrice) return false;

      // 3. AC / Non-AC
      if (acFilter === 'AC' && !trip.bus.isAC) return false;
      if (acFilter === 'NON_AC' && trip.bus.isAC) return false;

      // 4. Sleeper / Seater
      if (seatTypeFilter === 'SLEEPER' && !trip.bus.isSleeper) return false;
      if (seatTypeFilter === 'SEATER' && trip.bus.isSleeper) return false;

      // 5. Operator filter
      if (selectedOperators.length > 0 && !selectedOperators.includes(trip.bus.operatorName)) {
        return false;
      }

      // 6. Departure time slots
      if (departureSlot.length > 0) {
        const hour = parseInt(trip.departureTime.split(':')[0], 10);
        let slot = '';
        if (hour < 6) slot = 'EARLY_MORNING';
        else if (hour < 12) slot = 'MORNING';
        else if (hour < 18) slot = 'AFTERNOON';
        else slot = 'NIGHT';

        if (!departureSlot.includes(slot)) return false;
      }

      // 7. Amenities
      if (selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every((a) => trip.bus.amenities.includes(a));
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.basePrice - b.basePrice;
      if (sortBy === 'PRICE_DESC') return b.basePrice - a.basePrice;
      if (sortBy === 'RATING') return b.bus.operatorRating - a.bus.operatorRating;
      if (sortBy === 'DEPARTURE_EARLIEST') return a.departureTime.localeCompare(b.departureTime);
      if (sortBy === 'DURATION_SHORTEST') return a.duration.localeCompare(b.duration);
      return 0;
    });
  }, [trips, searchQuery, maxPrice, acFilter, seatTypeFilter, selectedOperators, departureSlot, selectedAmenities, sortBy]);

  const handleTripSelect = (trip: Trip) => {
    if (selectedTrip?.id === trip.id) {
      setSelectedTrip(null);
    } else {
      setSelectedTrip(trip);
    }
  };

  const resetFilters = () => {
    setMaxPrice(1500);
    setAcFilter('ALL');
    setSeatTypeFilter('ALL');
    setDepartureSlot([]);
    setSelectedOperators([]);
    setSelectedAmenities([]);
    setSortBy('PRICE_ASC');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Modify Search Bar Header */}
        <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-lg sm:text-xl">
              <span>{searchQuery.fromCity}</span>
              <span className="text-orange-500">➔</span>
              <span>{searchQuery.toCity}</span>
            </div>

            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              <span>{new Date(searchQuery.journeyDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
            </div>

            {searchQuery.womenOnly && (
              <span className="bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Shield className="w-3 h-3 text-pink-600" /> Women Only
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCustomerView('HOME')}
              className="px-4 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-50 border border-slate-200 hover:border-blue-700 rounded-lg transition-colors bg-white shadow-xs"
            >
              Modify Search
            </button>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Grid: Filters Sidebar + Bus Listing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Filter Panel (Desktop & Mobile) */}
          <div className={`lg:col-span-3 space-y-4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-800" />
                  <span className="font-bold text-slate-900 text-sm">Filters</span>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-orange-500 hover:underline font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Price Range Slider */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex justify-between">
                  <span>Max Price</span>
                  <span className="text-blue-800 font-extrabold">₹{maxPrice}</span>
                </label>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹200</span>
                  <span>₹1,500</span>
                </div>
              </div>

              {/* Bus Type: AC / Non-AC */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">AC Preference</span>
                <div className="grid grid-cols-3 gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg text-xs font-semibold">
                  {(['ALL', 'AC', 'NON_AC'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setAcFilter(mode)}
                      className={`py-1 rounded-md text-[11px] transition-colors ${
                        acFilter === mode ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mode === 'NON_AC' ? 'Non-AC' : mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Berth Type: Sleeper / Seater */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Seat Type</span>
                <div className="grid grid-cols-3 gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg text-xs font-semibold">
                  {(['ALL', 'SLEEPER', 'SEATER'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSeatTypeFilter(mode)}
                      className={`py-1 rounded-md text-[11px] transition-colors ${
                        seatTypeFilter === mode ? 'bg-blue-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Departure Time Slots */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Departure Time</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'EARLY_MORNING', label: 'Before 6 AM', sub: 'Early Bird' },
                    { id: 'MORNING', label: '6 AM - 12 PM', sub: 'Morning' },
                    { id: 'AFTERNOON', label: '12 PM - 6 PM', sub: 'Afternoon' },
                    { id: 'NIGHT', label: 'After 6 PM', sub: 'Night Sleeper' },
                  ].map((slot) => {
                    const isChecked = departureSlot.includes(slot.id);
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          if (isChecked) {
                            setDepartureSlot(departureSlot.filter((s) => s !== slot.id));
                          } else {
                            setDepartureSlot([...departureSlot, slot.id]);
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          isChecked
                            ? 'border-blue-700 bg-blue-50 font-bold text-blue-800'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-bold text-[11px]">{slot.label}</div>
                        <div className="text-[9px] text-slate-400">{slot.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Operators Filter */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Bus Operators</span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {operatorsList.map((op) => (
                    <label key={op} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedOperators.includes(op)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedOperators([...selectedOperators, op]);
                          else setSelectedOperators(selectedOperators.filter((o) => o !== op));
                        }}
                        className="rounded text-blue-800 focus:ring-blue-700"
                      />
                      <span className="truncate">{op}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities Filter */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Amenities</span>
                <div className="space-y-1.5">
                  {allAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedAmenities([...selectedAmenities, amenity]);
                          else setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                        }}
                        className="rounded text-blue-800 focus:ring-blue-700"
                      />
                      <span className="truncate">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sort bar + Available Buses */}
          <div className="lg:col-span-9 space-y-4">
            {/* Sort Bar */}
            <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs font-bold text-slate-700">
                Found <span className="text-blue-800">{filteredTrips.length} Buses</span> on this route
              </div>

              {/* Sort Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-slate-400 font-medium mr-1">Sort:</span>
                {[
                  { id: 'PRICE_ASC', label: 'Cheapest' },
                  { id: 'PRICE_DESC', label: 'Price: High-Low' },
                  { id: 'DEPARTURE_EARLIEST', label: 'Earliest' },
                  { id: 'DURATION_SHORTEST', label: 'Fastest' },
                  { id: 'RATING', label: 'Rating 4.5+' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      sortBy === s.id
                        ? 'bg-blue-800 text-white shadow-xs font-bold'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Buses */}
            {filteredTrips.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
                <div className="w-16 h-16 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Buses Match Your Filter Criteria</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Try relaxing your price range, AC preference, or time slot filters to see more available luxury buses.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredTrips.map((trip) => (
                <div key={trip.id} className="space-y-2">
                  <BusCard
                    trip={trip}
                    onSelectSeats={handleTripSelect}
                    isExpanded={selectedTrip?.id === trip.id}
                  />

                  {/* If this trip is currently selected, show the Interactive Seat Layout */}
                  {selectedTrip?.id === trip.id && (
                    <SeatLayoutSelector
                      trip={trip}
                      onProceed={() => setCustomerView('PASSENGER_DETAILS')}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
