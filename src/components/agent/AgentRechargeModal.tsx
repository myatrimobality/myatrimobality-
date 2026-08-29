import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  X,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle,
  PlusCircle,
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';

interface AgentRechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentRechargeModal: React.FC<AgentRechargeModalProps> = ({ isOpen, onClose }) => {
  const { topUpAgentWallet } = useApp();

  const [amount, setAmount] = useState<number>(10000);
  const [method, setMethod] = useState<'UPI' | 'NET_BANKING' | 'CARD' | 'NEFT'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [5000, 10000, 25000, 50000, 100000];

  const handleRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || amount < 500) {
      alert('Minimum wallet recharge amount is ₹500');
      return;
    }

    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    topUpAgentWallet(amount, `Instant Agent Top-up via ${method}`);
    setIsProcessing(false);
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Recharge Agent Wallet</h3>
              <p className="text-xs text-slate-500">Instant credit for uninterrupted counter bookings</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-black text-slate-900">₹{amount.toLocaleString('en-IN')} Credited!</h4>
            <p className="text-xs text-slate-500">
              Your Agent Wallet has been updated instantly. Ready for counter bookings.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRecharge} className="space-y-5">
            {/* Quick Amount Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Recharge Amount</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-black transition-all ${
                      amount === amt
                        ? 'bg-[#0264A6] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    ₹{amt >= 1000 ? `${amt / 1000}k` : amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Or Enter Custom Amount (INR)</label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-black text-slate-400">₹</span>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-black text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Payment Source</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                {[
                  { id: 'UPI', label: 'Instant UPI', icon: Smartphone },
                  { id: 'NET_BANKING', label: 'Net Banking', icon: Building },
                  { id: 'CARD', label: 'Corp Card', icon: CreditCard },
                  { id: 'NEFT', label: 'NEFT/RTGS', icon: Building },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        method === m.id
                          ? 'bg-blue-50 border-[#0264A6] text-[#0264A6] shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px]">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#F58220] hover:bg-[#d96b0c] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Gateway Credit...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Recharge ₹{amount.toLocaleString('en-IN')} Now</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
