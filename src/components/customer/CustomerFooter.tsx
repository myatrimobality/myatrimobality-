import React from 'react';
import { useApp } from '../../context/AppContext';
import { MYatriLogo } from '../common/MYatriLogo';
import {
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Heart,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export const CustomerFooter: React.FC = () => {
  const { setCurrentRole, setCustomerView, handleSearch } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white px-3.5 py-1.5 rounded-xl inline-block shadow-xs border border-slate-100">
              <MYatriLogo size="md" showTagline={true} />
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              M Yatri is India's premier intercity bus booking platform. Delivering safe, reliable, and comfortable travel with certified operators and transparent pricing.
            </p>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="flex items-center gap-1.5 text-green-400 bg-green-950/60 px-3 py-1 rounded-md border border-green-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="font-bold text-[11px]">Government Certified & Safe</span>
              </div>
            </div>
          </div>

          {/* Popular Routes */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Top Bus Routes</h4>
            <ul className="space-y-2 text-slate-400">
              {['Kanpur to Delhi', 'Lucknow to Delhi', 'Kanpur to Lucknow', 'Jaipur to Delhi', 'Kanpur to Jaipur'].map((r) => {
                const [from, to] = r.split(' to ');
                return (
                  <li key={r}>
                    <button
                      onClick={() => handleSearch(from, to, '2026-08-30')}
                      className="hover:text-orange-400 transition-colors text-left"
                    >
                      {r} Bus
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => setCustomerView('HOME')} className="hover:text-white transition-colors">
                  Bus Ticket Booking
                </button>
              </li>
              <li>
                <button onClick={() => setCustomerView('MY_BOOKINGS')} className="hover:text-white transition-colors">
                  My Bookings & PNR Status
                </button>
              </li>
              <li>
                <button onClick={() => setCustomerView('HELP')} className="hover:text-white transition-colors">
                  Cancellation & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => setCustomerView('HELP')} className="hover:text-white transition-colors">
                  24x7 Customer Support
                </button>
              </li>
            </ul>
          </div>

          {/* Partner & Staff Portals */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Partner Portals</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentRole('AGENT')}
                  className="hover:text-orange-400 transition-colors flex items-center gap-1 font-semibold text-orange-400"
                >
                  <span>Travel Agent Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRole('OPERATOR')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1 font-semibold text-blue-400"
                >
                  <span>Bus Operator Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentRole('ADMIN')}
                  className="hover:text-green-400 transition-colors flex items-center gap-1 font-semibold text-green-400"
                >
                  <span>Master Admin Console</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with System Operational Status */}
        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div className="flex items-center gap-4 flex-wrap">
            <span>© {new Date().getFullYear()} M Yatri Travels Private Limited.</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-green-400" /> 256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span>UPI • RuPay • Visa • MasterCard • NetBanking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
