import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Building,
  Bus,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Search,
  Star,
  MapPin
} from 'lucide-react';

export const AdminOperatorsAndBuses: React.FC = () => {
  const { operators = [], buses = [], setOperators } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  const safeOperators = operators || [];
  const safeBuses = buses || [];

  const toggleOperatorStatus = (opId: string) => {
    setOperators((prev) =>
      prev.map((op) => {
        if (op.id === opId) {
          const next = op.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          return { ...op, status: next };
        }
        return op;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#0264A6] uppercase tracking-wider mb-1">
            <Building className="w-4 h-4" />
            <span>Transport Partners</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Fleet Operators & Bus Approvals</h1>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Active Fleet Companies: <strong className="text-slate-900">{safeOperators.length}</strong>
        </div>
      </div>

      {/* Operator Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {safeOperators.map((op) => {
          const firstWord = (op.companyName || '').split(' ')[0] || '';
          const opBuses = safeBuses.filter((b) => b.operatorId === op.id || (firstWord && b.operatorName?.includes(firstWord)));

          return (
            <div
              key={op.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{op.companyName}</h3>
                    <p className="text-xs text-slate-500 font-medium">Headquarters: {op.city}</p>
                  </div>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      op.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {op.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 my-4 text-center">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Fleet Size</span>
                    <span className="text-base font-black text-slate-900">{opBuses.length || op.fleetSize} Buses</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Rating</span>
                    <span className="text-base font-black text-amber-600 flex items-center justify-center gap-1">
                      {op.rating} <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold block">Commission</span>
                    <span className="text-base font-black text-[#0264A6]">{op.commissionPercentage}%</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <p>
                    Primary Contact: <strong>{op.contactPerson}</strong> ({op.phone})
                  </p>
                  <p className="text-emerald-700 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> All RTO fitness & All India Tourist Permits verified
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">KYC Status: Verified</span>
                <button
                  onClick={() => toggleOperatorStatus(op.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    op.status === 'ACTIVE'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  {op.status === 'ACTIVE' ? 'Suspend Operator' : 'Reactivate Operator'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
