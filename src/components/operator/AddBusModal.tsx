import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus as BusType } from '../../types';
import { Bus, X, CheckCircle, ShieldCheck, Zap } from 'lucide-react';

interface AddBusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddBusModal: React.FC<AddBusModalProps> = ({ isOpen, onClose }) => {
  const { addBus, currentUser } = useApp();

  const [busNumber, setBusNumber] = useState('');
  const [busName, setBusName] = useState('');
  const [isAC, setIsAC] = useState(true);
  const [isSleeper, setIsSleeper] = useState(true);
  const [totalSeats, setTotalSeats] = useState(36);
  const [amenities, setAmenities] = useState<string[]>([
    'WiFi',
    'Charging Point',
    'Live GPS Tracking',
    'Water Bottle',
    'Blanket',
  ]);

  if (!isOpen) return null;

  const availableAmenities = [
    'WiFi',
    'Charging Point',
    'Live GPS Tracking',
    'Water Bottle',
    'Blanket',
    'Reading Light',
    'CCTV Surveillance',
    'Emergency SOS Button',
    'Snacks',
  ];

  const toggleAmenity = (name: string) => {
    if (amenities.includes(name)) {
      setAmenities(amenities.filter((a) => a !== name));
    } else {
      setAmenities([...amenities, name]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busNumber.trim() || !busName.trim()) {
      alert('Please fill bus number and model name');
      return;
    }

    const newBus: BusType = {
      id: `bus-${Date.now()}`,
      operatorId: currentUser?.operatorId || 'op-1',
      operatorName: currentUser?.operatorCompanyName || 'Royal Travels Kanpur',
      operatorRating: 4.8,
      totalReviews: 142,
      busNumber: busNumber.toUpperCase().trim(),
      busName: busName.trim(),
      busType: isAC ? (isSleeper ? 'AC_SLEEPER' : 'AC_SEATER') : 'NON_AC_SEATER',
      totalSeats: Number(totalSeats),
      availableSeatsCount: Number(totalSeats),
      isAC,
      isSleeper,
      amenities,
      approvalStatus: 'APPROVED',
      status: 'ACTIVE',
      lowerDeckCols: 4,
      lowerDeckRows: Math.ceil(Number(totalSeats) / 4),
      seats: [],
    };

    addBus(newBus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-[#0264A6] rounded-2xl flex items-center justify-center">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Add Vehicle to Fleet</h3>
              <p className="text-xs text-slate-500">Register new luxury bus with live GPS & amenities</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Registration Number (e.g. UP 78 BX 9921) *</label>
            <input
              type="text"
              required
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              placeholder="UP 78 BX 9921"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold uppercase focus:ring-2 focus:ring-[#0264A6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bus Model / Category Name *</label>
            <input
              type="text"
              required
              value={busName}
              onChange={(e) => setBusName(e.target.value)}
              placeholder="e.g. BharatBenz Multi-Axle AC Sleeper (2+1)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-[#0264A6]"
            />
          </div>

          {/* AC & Sleeper Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Climate Control</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAC(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isAC ? 'bg-[#0264A6] text-white border-[#0264A6]' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  AC
                </button>
                <button
                  type="button"
                  onClick={() => setIsAC(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    !isAC ? 'bg-[#0264A6] text-white border-[#0264A6]' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Non-AC
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Seat Configuration</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSleeper(true)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isSleeper ? 'bg-[#0264A6] text-white border-[#0264A6]' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Sleeper
                </button>
                <button
                  type="button"
                  onClick={() => setIsSleeper(false)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    !isSleeper ? 'bg-[#0264A6] text-white border-[#0264A6]' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Seater
                </button>
              </div>
            </div>
          </div>

          {/* Seating Capacity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Total Seating Capacity</label>
            <select
              value={totalSeats}
              onChange={(e) => setTotalSeats(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
            >
              <option value={30}>30 Berths (2+1 Luxury Sleeper)</option>
              <option value={36}>36 Berths (2+1 Standard Sleeper)</option>
              <option value={44}>44 Seats (2+2 Pushback Seater)</option>
              <option value={50}>50 Seats (2+2 Standard Seater)</option>
            </select>
          </div>

          {/* Amenities checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Onboard Passenger Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`p-2 rounded-xl text-[11px] font-bold border text-left transition-all ${
                    amenities.includes(amenity)
                      ? 'bg-blue-50 border-[#0264A6] text-[#0264A6]'
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {amenities.includes(amenity) ? '✓' : '+'} {amenity}
                </button>
              ))}
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
              className="px-6 py-2.5 bg-[#F58220] hover:bg-[#d96b0c] text-white font-extrabold text-xs rounded-xl shadow-xs"
            >
              Save Bus to Fleet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
