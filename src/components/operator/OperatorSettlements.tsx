import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  DollarSign,
  ArrowDownLeft,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText
} from 'lucide-react';

export const OperatorSettlements: React.FC = () => {
  const { settlements = [] } = useApp();
  const [requested, setRequested] = useState(false);

  const safeSettlements = settlements || [];

  const totalSettled = safeSettlements
    .filter((s) => s.status === 'PAID')
    .reduce((sum, s) => sum + (s.netPayable || (s as any).netAmount || 0), 0);

  const pendingSettlement = safeSettlements
    .filter((s) => s.status === 'PENDING' || (s as any).status === 'PROCESSING')
    .reduce((sum, s) => sum + (s.netPayable || (s as any).netAmount || 0), 0) || 48500;

  const handleRequestEarlyPayout = () => {
    setRequested(true);
    alert('Instant Payout Request submitted! The net balance of ₹48,500 will be credited via NEFT/IMPS to your registered HDFC Current Account within 4 hours.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#0264A6] uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Commercial Accounts</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Operator Payouts & Settlements</h1>
        </div>

        <button
          onClick={handleRequestEarlyPayout}
          disabled={requested}
          className="px-5 py-2.5 bg-[#F58220] hover:bg-[#d96b0c] text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <DollarSign className="w-4 h-4" />
          <span>{requested ? 'Payout Processing...' : 'Request Instant Payout (₹48,500)'}</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Settled */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Total Net Payouts (Year to Date)</span>
          <div className="text-3xl font-mono font-black text-emerald-600">
            ₹{totalSettled.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400">Directly transferred to HDFC Bank (A/C: •••• 9812)</p>
        </div>

        {/* Pending Payout */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Current Unsettled Cycle</span>
          <div className="text-3xl font-mono font-black text-[#0264A6]">
            ₹{pendingSettlement.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400">Scheduled for automated Friday cycle settlement</p>
        </div>

        {/* Platform Fee Rate */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Contract Platform Fee</span>
          <div className="text-3xl font-mono font-black text-slate-900">
            10.0% <span className="text-xs text-slate-400 font-normal">(Gross)</span>
          </div>
          <p className="text-[11px] text-slate-400">Includes payment gateway fee & M Yatri passenger booking technology</p>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">Past Settlement Cycles</h2>
            <p className="text-xs text-slate-500">Automated NEFT/IMPS payout statements and bank reference UTRs</p>
          </div>

          <button
            onClick={() => alert('Downloading Annual Settlement Summary CSV...')}
            className="text-xs font-bold text-[#0264A6] hover:underline flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Annual Statement</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Settlement ID</th>
                <th className="py-3 px-4">Cycle Period</th>
                <th className="py-3 px-4">Gross Collected</th>
                <th className="py-3 px-4">Platform Fee (10%)</th>
                <th className="py-3 px-4">TDS (1%)</th>
                <th className="py-3 px-4">Net Settled</th>
                <th className="py-3 px-4">Bank UTR Ref</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeSettlements.map((s) => {
                const fee = s.commissionDeducted || (s as any).platformFee || 0;
                const tds = s.tdsDeducted || (s as any).tdsAmount || Math.round(s.grossAmount * 0.01);
                const net = s.netPayable || (s as any).netAmount || (s.grossAmount - fee - tds);

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{s.id}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-semibold">{s.period}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{s.grossAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-red-600">- ₹{fee.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-slate-500">- ₹{tds.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600 text-sm">
                      ₹{net.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{s.utrNumber || 'PENDING'}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          s.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {s.status}
                      </span>
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
