import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  ArrowRightLeft,
  Calendar,
  Search,
  Users,
  Shield,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    handleSearch,
    setCustomerView,
    language
  } = useApp();

  const [fromCity, setFromCity] = useState(searchQuery.fromCity || 'Kanpur');
  const [toCity, setToCity] = useState(searchQuery.toCity || 'Delhi');
  const [journeyDate, setJourneyDate] = useState(searchQuery.journeyDate || '2026-08-30');
  const [returnDate, setReturnDate] = useState(searchQuery.returnDate || '');
  const [isRoundTrip, setIsRoundTrip] = useState(searchQuery.isRoundTrip || false);
  const [womenOnly, setWomenOnly] = useState(searchQuery.womenOnly || false);

  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  const POPULAR_CITIES = [
    'Kanpur',
    'Delhi',
    'Lucknow',
    'Jaipur',
    'Agra',
    'Varanasi',
    'Noida',
    'Gurugram',
    'Chandigarh',
    'Dehradun',
    'Prayagraj',
    'Gorakhpur',
  ];

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCity || !toCity) {
      alert('Please enter both pickup and destination cities.');
      return;
    }
    if (fromCity.toLowerCase() === toCity.toLowerCase()) {
      alert('Pickup and drop cities cannot be the same.');
      return;
    }

    setSearchQuery({
      fromCity,
      toCity,
      journeyDate,
      returnDate: isRoundTrip ? returnDate : undefined,
      isRoundTrip,
      womenOnly,
    });

    handleSearch(fromCity, toCity, journeyDate, womenOnly);
  };

  return (
    <div className="relative bg-slate-100 text-slate-900 py-10 md:py-14 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title & Indian Bus Badge */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200 text-xs font-semibold text-blue-800 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Fast & Reliable Intercity Bus Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
            {language === 'HI' ? 'बस टिकट बुक करें' : 'Book Your Bus Ticket'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium">
            Over 2,500+ Daily Routes • Luxury AC Sleepers & Volvos • Live GPS Tracking
          </p>
        </div>

        {/* Search Box Container */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm text-slate-800 border border-slate-200">
          {/* Trip Type & Women Only Preference Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRoundTrip(false)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  !isRoundTrip
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                One Way
              </button>
              <button
                type="button"
                onClick={() => setIsRoundTrip(true)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  isRoundTrip
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Round Trip
              </button>
            </div>

            {/* Women Passenger Preference */}
            <label className="flex items-center gap-2 cursor-pointer bg-pink-50 hover:bg-pink-100/80 px-3 py-1.5 rounded-lg border border-pink-200 transition-colors">
              <input
                type="checkbox"
                checked={womenOnly}
                onChange={(e) => setWomenOnly(e.target.checked)}
                className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
              />
              <span className="text-xs font-bold text-pink-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-pink-600" />
                Female Passenger / Women-Reserved Seats
              </span>
            </label>
          </div>

          {/* Main Search Input Grid */}
          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* From City */}
              <div className="relative md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  From / Pickup City
                </label>
                <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-lg p-3 transition-colors focus-within:ring-2 focus-within:ring-blue-700 focus-within:bg-white focus-within:border-transparent">
                  <MapPin className="w-5 h-5 text-blue-700 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => {
                      setFromCity(e.target.value);
                      setShowFromSuggestions(true);
                    }}
                    onFocus={() => setShowFromSuggestions(true)}
                    placeholder="Enter Pickup City"
                    className="w-full bg-transparent font-semibold text-slate-900 text-sm focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Suggestions dropdown */}
                {showFromSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto py-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">Popular Cities</div>
                    {POPULAR_CITIES.filter((c) => c.toLowerCase().includes(fromCity.toLowerCase())).map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setFromCity(city);
                          setShowFromSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 flex items-center justify-between"
                      >
                        <span>{city}</span>
                        <span className="text-[10px] text-slate-400">UP/NCR/RJ</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="md:col-span-1 flex justify-center -my-2 md:my-0">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-2.5 rounded-lg bg-slate-100 hover:bg-orange-500 text-slate-700 hover:text-white border border-slate-200 shadow-xs transition-colors"
                  title="Swap Pickup and Drop Cities"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* To City */}
              <div className="relative md:col-span-3">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  To / Destination City
                </label>
                <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-lg p-3 transition-colors focus-within:ring-2 focus-within:ring-blue-700 focus-within:bg-white focus-within:border-transparent">
                  <MapPin className="w-5 h-5 text-orange-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => {
                      setToCity(e.target.value);
                      setShowToSuggestions(true);
                    }}
                    onFocus={() => setShowToSuggestions(true)}
                    placeholder="Enter Drop City"
                    className="w-full bg-transparent font-semibold text-slate-900 text-sm focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Suggestions dropdown */}
                {showToSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-30 max-h-48 overflow-y-auto py-1">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400">Popular Destinations</div>
                    {POPULAR_CITIES.filter((c) => c.toLowerCase().includes(toCity.toLowerCase())).map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setToCity(city);
                          setShowToSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-800 flex items-center justify-between"
                      >
                        <span>{city}</span>
                        <span className="text-[10px] text-slate-400">Express Corridor</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Journey Date */}
              <div className={`relative ${isRoundTrip ? 'md:col-span-2' : 'md:col-span-3'}`}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Journey Date
                </label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-700 focus-within:bg-white focus-within:border-transparent">
                  <Calendar className="w-5 h-5 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="date"
                    value={journeyDate}
                    onChange={(e) => setJourneyDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-transparent font-semibold text-slate-900 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Return Date (Optional/Conditional) */}
              {isRoundTrip && (
                <div className="relative md:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Return Date
                  </label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-700 focus-within:bg-white focus-within:border-transparent">
                    <Calendar className="w-5 h-5 text-slate-500 mr-2 shrink-0" />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={journeyDate}
                      className="w-full bg-transparent font-semibold text-slate-900 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Search Button */}
              <div className={`${isRoundTrip ? 'md:col-span-1' : 'md:col-span-2'} flex flex-col justify-end pt-1 md:pt-5`}>
                <button
                  type="submit"
                  id="search-buses-btn"
                  className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm hover:shadow transition-colors flex items-center justify-center gap-2 group active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span className="text-sm">Search Buses</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick popular Indian route chips */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="font-bold text-slate-700">Top Routes:</span>
            {[
              { from: 'Kanpur', to: 'Delhi' },
              { from: 'Lucknow', to: 'Delhi' },
              { from: 'Kanpur', to: 'Lucknow' },
              { from: 'Jaipur', to: 'Delhi' },
              { from: 'Kanpur', to: 'Jaipur' },
            ].map((r) => (
              <button
                key={`${r.from}-${r.to}`}
                type="button"
                onClick={() => {
                  setFromCity(r.from);
                  setToCity(r.to);
                  handleSearch(r.from, r.to, journeyDate, womenOnly);
                }}
                className="bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-800 px-3 py-1 rounded-md font-medium border border-slate-200 transition-colors"
              >
                {r.from} ➔ {r.to}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
