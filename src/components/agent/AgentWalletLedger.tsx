import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  Building
} from 'lucide-react';

interface AgentWalletLedgerProps {
  onOpenRecharge: () => void;
}

export const AgentWalletLedger: React.FC<AgentWalletLedgerProps> = ({ onOpenRecharge }) => {
  const { currentUser, walletTransactions = [] } = useApp();

  const [filterType, setFilterType] = useState<'ALL' | 'CREDIT' | 'DEBIT'>('ALL');

  const safeTxns = walletTransactions || [];

  const filteredTxns = safeTxns.filter((tx) => {
    if (filterType === 'ALL') return true;
    return tx.type === filterType;
  });

  const totalCredits = safeTxns
    .filter((t) => t.type === 'CREDIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = safeTxns
    .filter((t) => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header & Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Wallet Balance */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0264A6] rounded-3xl p-6 text-white shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-blue-200">Current Agent Wallet Balance</span>
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-mono font-black text-white mt-2">
              ₹{(currentUser?.walletBalance || 45800).toLocaleString('en-IN')}
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenRecharge}
            className="w-full py-3 bg-[#F58220] hover:bg-[#d96b0c] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Top-up / Recharge Wallet</span>
          </button>
        </div>

        {/* Total Monthly Credits */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Total Credits (Recharge + Comm)</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-600 mt-2">
              + ₹{totalCredits.toLocaleString('en-IN')}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Includes top-ups and cancellation refund credits</p>
        </div>

        {/* Total Monthly Debits */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase">
              <span>Total Debits (Ticket Issuance)</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black font-mono text-red-600 mt-2">
              - ₹{totalDebits.toLocaleString('en-IN')}
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Net fares deducted for issued passenger tickets</p>
        </div>
      </div>

      {/* Transactions Statement Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Wallet Transaction Ledger</h2>
            <p className="text-xs text-slate-500">Chronological statement of all credits, debits & commission settlements</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'CREDIT', 'DEBIT'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterType(mode)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === mode
                    ? 'bg-[#0264A6] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode === 'ALL' ? 'All Entries' : mode === 'CREDIT' ? 'Credits Only' : 'Debits Only'}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description / Reference</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Closing Balance</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTxns.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{tx.id}</td>
                  <td className="py-3.5 px-4 text-slate-500">{tx.timestamp}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-extrabold px-2 py-0.5 rounded text-[10px] uppercase ${
                        tx.type === 'CREDIT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{tx.description}</div>
                    {tx.referenceId && (
                      <div className="text-[10px] font-mono text-[#0264A6]">{tx.referenceId}</div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-black text-sm">
                    <span className={tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-red-600'}>
                      {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    ₹{tx.balanceAfter.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                      SUCCESS
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
