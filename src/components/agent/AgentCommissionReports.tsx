import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Percent,
  TrendingUp,
  Award,
  Download,
  Calendar,
  Building,
  MapPin,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const AgentCommissionReports: React.FC = () => {
  const { currentUser } = useApp();

  const routeCommissionData = [
    { route: 'Kanpur ➔ Delhi', bookings: 42, grossSales: 48200, commRate: '8%', earned: 3856 },
    { route: 'Lucknow ➔ Delhi', bookings: 28, grossSales: 34500, commRate: '8%', earned: 2760 },
    { route: 'Kanpur ➔ Lucknow', bookings: 54, grossSales: 16200, commRate: '10%', earned: 1620 },
    { route: 'Jaipur ➔ Delhi', bookings: 19, grossSales: 22800, commRate: '8%', earned: 1824 },
    { route: 'Kanpur ➔ Jaipur', bookings: 12, grossSales: 15600, commRate: '9%', earned: 1404 },
  ];

  const operatorCommissionData = [
    { operator: 'M Yatri Flagship Express', buses: 8, bookings: 68, earned: 5440 },
    { operator: 'Royal Travels Kanpur', buses: 6, bookings: 44, earned: 3520 },
    { operator: 'City Connect AC Bus', buses: 4, bookings: 26, earned: 2080 },
    { operator: 'Shatabdi Bus Lines', buses: 3, bookings: 17, earned: 1360 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#F58220] uppercase tracking-wider mb-1">
            <Percent className="w-4 h-4" />
            <span>Earnings & Incentives</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Agent Commission Reports</h1>
        </div>

        <button
          onClick={() => alert('Downloading GST-compliant Commission Certificate & TDS Summary (PDF)...')}
          className="px-4 py-2 bg-[#0264A6] hover:bg-[#004d80] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Download Tax & Commission Invoice</span>
        </button>
      </div>

      {/* Commission Slabs Information Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
            Active Tier: Gold Agent
          </span>
          <h3 className="text-lg font-black text-amber-950">
            Current Commission Rate: {currentUser?.commissionValue || 8}% on all ticket bookings
          </h3>
          <p className="text-xs text-amber-800">
            Reach ₹2,50,000 monthly counter sales to unlock Platinum Tier (+2% extra commission).
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Estimated Month Commission</span>
          <div className="text-2xl font-mono font-black text-[#F58220] mt-1">₹12,450</div>
        </div>
      </div>

      {/* 2-Column Tables: Route Wise & Operator Wise */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Route-Wise Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#0264A6]" />
            Route-Wise Commission Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Tickets</th>
                  <th className="py-2.5 px-3">Gross Sales</th>
                  <th className="py-2.5 px-3 text-right">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {routeCommissionData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{row.route}</td>
                    <td className="py-3 px-3 text-slate-600">{row.bookings}</td>
                    <td className="py-3 px-3 text-slate-600">₹{row.grossSales.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-bold font-mono text-emerald-600">
                      ₹{row.earned.toLocaleString('en-IN')} ({row.commRate})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operator-Wise Breakdown */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Building className="w-4 h-4 text-[#F58220]" />
            Operator-Wise Commission Breakdown
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Bus Operator</th>
                  <th className="py-2.5 px-3">Buses</th>
                  <th className="py-2.5 px-3">Tickets</th>
                  <th className="py-2.5 px-3 text-right">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {operatorCommissionData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{row.operator}</td>
                    <td className="py-3 px-3 text-slate-600">{row.buses}</td>
                    <td className="py-3 px-3 text-slate-600">{row.bookings}</td>
                    <td className="py-3 px-3 text-right font-bold font-mono text-emerald-600">
                      ₹{row.earned.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
