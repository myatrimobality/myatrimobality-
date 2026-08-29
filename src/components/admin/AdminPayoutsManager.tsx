import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OperatorSettlement } from '../../types';
import {
  DollarSign,
  CheckCircle,
  Building,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Clock
} from 'lucide-react';

export const AdminPayoutsManager: React.FC = () => {
  const { settlements = [], setSettlements } = useApp();

  const [settlementToPay, setSettlementToPay] = useState<OperatorSettlement | null>(null);
  const [utrInput, setUtrInput] = useState('');

  const safeSettlements = settlements || [];

  const totalDisbursed = safeSettlements
    .filter((s) => s.status === 'PAID')
    .reduce((sum, s) => sum + (s.netPayable || (s as any).netAmount || 0), 0);

  const pendingDisbursement = safeSettlements
    .filter((s) => s.status === 'PENDING' || (s as any).status === 'PROCESSING')
    .reduce((sum, s) => sum + (s.netPayable || (s as any).netAmount || 0), 0);

  const handleDisburse = () => {
    if (!settlementToPay || !utrInput.trim()) {
      alert('Please enter bank UTR reference number');
      return;
    }

    setSettlements((prev) =>
      prev.map((s) => {
        if (s.id === settlementToPay.id) {
          return { ...s, status: 'PAID', utrNumber: utrInput.trim(), settledAt: new Date().toISOString() };
        }
        return s;
      })
    );

    const amount = settlementToPay.netPayable || (settlementToPay as any).netAmount || 0;
    alert(`Payout of ₹${amount.toLocaleString('en-IN')} successfully settled to ${settlementToPay.operatorName} with UTR: ${utrInput}`);
    setSettlementToPay(null);
    setUtrInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#0264A6] uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Financial Settlements</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Operator Payouts & Disbursal</h1>
        </div>

        <div className="text-xs text-slate-500 font-bold">
          Settlement Cycles: <strong className="text-slate-900">{safeSettlements.length}</strong>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Total Disbursed to Fleet Partners</span>
          <div className="text-3xl font-mono font-black text-emerald-600">
            ₹{totalDisbursed.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400">Transferred via Corporate NEFT/RTGS gateway</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Pending Operator Payout Approval</span>
          <div className="text-3xl font-mono font-black text-amber-600">
            ₹{pendingDisbursement.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400">Awaiting Super Admin UTR verification</p>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-black border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Settlement ID</th>
                <th className="py-3.5 px-4">Operator Partner</th>
                <th className="py-3.5 px-4">Period</th>
                <th className="py-3.5 px-4">Gross Sales</th>
                <th className="py-3.5 px-4">Platform Fee (10%)</th>
                <th className="py-3.5 px-4">Net Payout</th>
                <th className="py-3.5 px-4">Bank UTR Ref</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeSettlements.map((s) => {
                const net = s.netPayable || (s as any).netAmount || 0;
                const fee = s.commissionDeducted || (s as any).platformFee || 0;
                const isPending = s.status === 'PENDING' || (s as any).status === 'PROCESSING';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{s.id}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">{s.operatorName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{s.period}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">₹{s.grossAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-red-600">-₹{fee.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-emerald-600 text-sm">
                      ₹{net.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{s.utrNumber || 'PENDING'}</td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-right">
                      {isPending ? (
                        <button
                          onClick={() => {
                            setSettlementToPay(s);
                            setUtrInput(`HDFC${Math.floor(10000000 + Math.random() * 90000000)}`);
                          }}
                          className="px-3 py-1.5 bg-[#F58220] hover:bg-[#d96b0c] text-white font-extrabold text-xs rounded-xl shadow-xs"
                        >
                          Approve & Disburse
                        </button>
                      ) : (
                        <span className="text-slate-400 font-bold text-[11px]">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disburse Modal */}
      {settlementToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                Disburse Payout: {settlementToPay.operatorName}
              </h3>
              <button onClick={() => setSettlementToPay(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span>Gross Booking Collections:</span>
                <strong className="text-slate-900">₹{settlementToPay.grossAmount.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Platform Deductions (10%):</span>
                <span>- ₹{(settlementToPay.commissionDeducted || (settlementToPay as any).platformFee || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-emerald-700 text-sm">
                <span>Disbursal Net Amount:</span>
                <span>₹{(settlementToPay.netPayable || (settlementToPay as any).netAmount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Bank NEFT / RTGS Transaction Reference (UTR Number) *
              </label>
              <input
                type="text"
                required
                value={utrInput}
                onChange={(e) => setUtrInput(e.target.value)}
                placeholder="e.g. HDFC29183921"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase focus:bg-white focus:ring-2 focus:ring-[#0264A6]"
              />
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setSettlementToPay(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDisburse}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs"
              >
                Confirm Bank Disbursal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
