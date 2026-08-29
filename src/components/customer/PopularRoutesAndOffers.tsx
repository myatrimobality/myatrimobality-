import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Tag,
  ShieldCheck,
  Zap,
  Headphones,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  Check
} from 'lucide-react';

export const PopularRoutesAndOffers: React.FC = () => {
  const { coupons, handleSearch, applyCoupon, setCustomerView } = useApp();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const featureCards = [
    {
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50',
      title: 'Women Safety & CCTV',
      desc: 'Dedicated female passenger berths, CCTV monitoring & emergency assistance.',
    },
    {
      icon: Zap,
      color: 'text-[#0264A6] bg-blue-50',
      title: 'Live GPS Bus Tracking',
      desc: 'Share live bus location with family & get real-time boarding stop alerts.',
    },
    {
      icon: Clock,
      color: 'text-[#F58220] bg-orange-50',
      title: 'On-Time Departure Guarantee',
      desc: '98.4% on-time performance across expressway routes & luxury fleets.',
    },
    {
      icon: Headphones,
      color: 'text-purple-600 bg-purple-50',
      title: '24x7 Customer Support',
      desc: 'Instant booking modifications, PNR assistance & seamless UPI refunds.',
    },
  ];

  const popularRouteList = [
    { from: 'Kanpur', to: 'Delhi', time: '6h 45m', price: 780, buses: 18, tag: 'High Frequency' },
    { from: 'Lucknow', to: 'Delhi', time: '7h 30m', price: 850, buses: 24, tag: 'Expressway Route' },
    { from: 'Kanpur', to: 'Lucknow', time: '1h 45m', price: 220, buses: 32, tag: 'Hourly Shuttles' },
    { from: 'Jaipur', to: 'Delhi', time: '5h 00m', price: 650, buses: 15, tag: 'Tourist Corridor' },
    { from: 'Kanpur', to: 'Jaipur', time: '8h 15m', price: 890, buses: 8, tag: 'Direct Sleeper' },
    { from: 'Delhi', to: 'Agra', time: '3h 45m', price: 450, buses: 20, tag: 'Yamuna Express' },
  ];

  return (
    <div className="py-12 bg-slate-50 space-y-16">
      {/* 1. Offers & Coupons Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#F58220] uppercase tracking-wider mb-1">
              <Percent className="w-3.5 h-3.5" />
              <span>Save on Every Journey</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Trending M Yatri Offers & Promo Codes</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon.code}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100/50 rounded-bl-full -z-0"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-[#0264A6] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {coupon.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">Valid till 2026</span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm mb-1">{coupon.description}</h3>
                <p className="text-xs text-slate-500 mb-4">Min. Booking: ₹{coupon.minBookingAmount}</p>
              </div>

              <div className="relative z-10 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between">
                <div className="font-mono text-xs font-extrabold text-[#F58220] bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
                  {coupon.code}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className="text-xs font-bold text-[#0264A6] hover:text-blue-800 flex items-center gap-1"
                >
                  {copiedCode === coupon.code ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Applied!
                    </span>
                  ) : (
                    <span>Copy Code</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Popular Routes Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0264A6] uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Frequent Intercity Corridors</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Popular Bus Routes from Kanpur & North India</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularRouteList.map((route, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#0264A6] shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {route.tag}
                </span>
                <span className="text-xs text-slate-500 font-medium">{route.buses} daily buses</span>
              </div>

              <div className="flex items-center justify-between my-2">
                <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>{route.from}</span>
                  <span className="text-slate-400 group-hover:text-[#F58220] transition-colors">➔</span>
                  <span>{route.to}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Duration: {route.time}</span>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500">
                    from <strong className="text-base font-extrabold text-slate-900">₹{route.price}</strong>
                  </span>
                  <button
                    onClick={() => handleSearch(route.from, route.to, '2026-08-30')}
                    className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-[#0264A6] text-[#0264A6] group-hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why Choose M Yatri Feature Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-[#002f52] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-extrabold text-[#F58220] uppercase tracking-wider">The M Yatri Advantage</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 mb-3">
              Why Millions of Travelers Trust M Yatri
            </h2>
            <p className="text-sm text-slate-300">
              India's modern bus ticketing standard — designed for safety, certified fleet comfort, transparent pricing, and instant refunds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {featureCards.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
