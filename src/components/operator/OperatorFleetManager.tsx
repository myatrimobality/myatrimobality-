import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bus as BusType } from '../../types';
import {
  Bus,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Wrench,
  ShieldCheck,
  Zap,
  Wifi,
  Sparkles,
  Search
} from 'lucide-react';

interface OperatorFleetManagerProps {
  onOpenAddBus: () => void;
}

export const OperatorFleetManager: React.FC<OperatorFleetManagerProps> = ({ onOpenAddBus }) => {
  const { buses, addBus } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'ACTIVE' | 'MAINTENANCE'>('ALL');

  const filteredBuses = buses.filter((b) => {
    const matchesSearch =
      b.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.busName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.operatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterType === 'ALL' || b.status === filterType;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#0264A6] uppercase tracking-wider mb-1">
            <Bus className="w-4 h-4" />
            <span>Fleet Inventory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Fleet & Vehicle Management</h1>
        </div>

        <button
          onClick={onOpenAddBus}
          className="px-5 py-2.5 bg-[#F58220] hover:bg-[#d96b0c] text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add New Vehicle</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Bus No (e.g. UP 78)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0264A6] w-64"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active in Service</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>

        <div className="text-xs font-bold text-slate-500">
          Total: <strong className="text-slate-900">{filteredBuses.length}</strong> Fleet Vehicles
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Top Row: Reg No & Status Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-sm font-black text-[#0264A6] bg-blue-50 px-3 py-1 rounded-xl border border-blue-100">
                  {bus.busNumber}
                </span>

                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    bus.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {bus.status === 'ACTIVE' ? 'Active' : 'Maintenance'}
                </span>
              </div>

              {/* Bus Details */}
              <div className="space-y-1.5 my-3">
                <h3 className="font-black text-slate-900 text-base">{bus.busName}</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {bus.isAC ? 'Air Conditioned' : 'Non-AC'} • {bus.isSleeper ? 'Sleeper (2+1 Berth)' : 'Seater (2+2 Pushback)'}
                </p>
                <p className="text-xs text-slate-700">
                  Total Seating Capacity: <strong>{bus.totalSeats} Passengers</strong>
                </p>
              </div>

              {/* Amenities */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Amenities Fitted</span>
                <div className="flex flex-wrap gap-1.5">
                  {bus.amenities.map((a, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">RC Fitness: Verified Valid</span>
              <button
                onClick={() => alert(`Editing configuration for ${bus.busNumber}`)}
                className="text-[#0264A6] font-bold hover:underline flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit Specs</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
