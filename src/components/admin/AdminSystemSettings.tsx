import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  Save,
  ShieldCheck,
  Percent,
  DollarSign,
  Phone,
  Mail,
  Clock,
  AlertTriangle,
  Server,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const AdminSystemSettings: React.FC = () => {
  const { settings, updateSettings } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black text-[#F58220] uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Platform Variables</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">System Configuration & Policies</h1>
        </div>

        {savedMessage && (
          <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved & Applied Live across All 4 Panels!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Commercial & Tax Rates */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Percent className="w-4 h-4 text-[#0264A6]" />
            Commercial & Tax Rates
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Government GST Rate on Bus Tickets (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                step="1"
                value={formData.gstPercentage}
                onChange={(e) => setFormData({ ...formData, gstPercentage: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black"
              />
              <span className="text-[10px] text-slate-400">Current standard GST rate for AC buses is 5%</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Platform Convenience Fee per Booking (INR)
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={formData.convenienceFee}
                onChange={(e) => setFormData({ ...formData, convenienceFee: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black"
              />
              <span className="text-[10px] text-slate-400">Charged directly to online customer checkout</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Travel Agent Default Base Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={formData.agentDefaultCommission}
                onChange={(e) => setFormData({ ...formData, agentDefaultCommission: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black"
              />
              <span className="text-[10px] text-slate-400">Default rate assigned to newly onboarded travel agencies</span>
            </div>
          </div>
        </div>

        {/* Operational Policies & Seat Locks */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-[#F58220]" />
            Operational & Lock Timers
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Seat Temporary Lock Hold Duration (Minutes)
              </label>
              <input
                type="number"
                min="3"
                max="30"
                value={formData.seatLockDurationMinutes}
                onChange={(e) => setFormData({ ...formData, seatLockDurationMinutes: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-black"
              />
              <span className="text-[10px] text-slate-400">Seats auto-release if payment is not completed within this time</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                24x7 Customer Helpline Number
              </label>
              <input
                type="text"
                value={formData.helplinePhone}
                onChange={(e) => setFormData({ ...formData, helplinePhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Support Escalation Email
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="md:col-span-2 pt-2 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#0264A6] hover:bg-[#004d80] text-white font-black text-sm rounded-2xl shadow-lg flex items-center gap-2 transition-all transform active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply System Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
