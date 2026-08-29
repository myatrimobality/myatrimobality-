import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Globe,
  Briefcase,
  Bus,
  ShieldCheck,
  Bell,
  Search,
  CheckCircle2,
  X,
  UserCheck
} from 'lucide-react';

export const RoleSwitcherBar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    notifications = [],
    markNotificationAsRead,
    setPnrSearchModalOpen,
    language,
    setLanguage
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);

  const safeNotifications = notifications || [];

  const unreadCount = safeNotifications.filter(
    (n) => (n.recipientRole === currentRole || n.recipientRole === 'ADMIN') && !n.read
  ).length;

  const filteredNotifs = safeNotifications.filter(
    (n) => n.recipientRole === currentRole || n.recipientRole === 'ADMIN'
  );

  const roles: { role: UserRole; label: string; icon: any; color: string; desc: string }[] = [
    {
      role: 'CUSTOMER',
      label: 'Customer Portal',
      icon: Globe,
      color: 'bg-emerald-600',
      desc: 'Online bus booking, seat selection, tickets & PNR',
    },
    {
      role: 'AGENT',
      label: 'Agent Terminal',
      icon: Briefcase,
      color: 'bg-indigo-600',
      desc: 'Offline ticketing counter, wallet & commissions',
    },
    {
      role: 'OPERATOR',
      label: 'Bus Operator',
      icon: Bus,
      color: 'bg-amber-600',
      desc: 'Fleet management, trips, pricing & passenger chart',
    },
    {
      role: 'ADMIN',
      label: 'Master Admin',
      icon: ShieldCheck,
      color: 'bg-red-600',
      desc: 'Control center, approvals, revenue & settings',
    },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs select-none sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left Side: Role Selector Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Switch Panel:
          </span>

          <div className="inline-flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            {roles.map((item) => {
              const Icon = item.icon;
              const isActive = currentRole === item.role || (item.role === 'ADMIN' && currentRole === 'SUPER_ADMIN');
              return (
                <button
                  key={item.role}
                  id={`role-btn-${item.role.toLowerCase()}`}
                  onClick={() => setCurrentRole(item.role)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
                    isActive
                      ? `${item.color} text-white shadow-sm`
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                  title={item.desc}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Quick Tools, PNR Lookup, Language, Notifications */}
        <div className="flex items-center gap-3">
          {/* Quick PNR button */}
          <button
            id="quick-pnr-search-btn"
            onClick={() => setPnrSearchModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1 rounded border border-slate-700 font-medium transition-colors"
          >
            <Search className="w-3 h-3 text-amber-400" />
            <span>PNR Status</span>
          </button>

          {/* Language toggle */}
          <div className="flex items-center bg-slate-800 rounded border border-slate-700 overflow-hidden">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 font-bold text-[11px] ${
                language === 'EN' ? 'bg-[#0264A6] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('HI')}
              className={`px-2 py-0.5 font-bold text-[11px] ${
                language === 'HI' ? 'bg-[#F58220] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              id="notif-toggle-btn"
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Notifications & Simulated SMS/WhatsApp alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F58220] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popup */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm">Notifications & Alerts</span>
                    <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">
                      {filteredNotifs.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {filteredNotifs.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 text-xs">
                      No notifications for {currentRole}
                    </div>
                  ) : (
                    filteredNotifs.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-blue-50/70 font-medium' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400">
                            {n.channel} • {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-2 bg-slate-100 text-center border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Simulated SMS, WhatsApp & In-App notification feed
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Active User pill */}
          <div className="hidden md:flex items-center gap-1.5 text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-slate-200">
              {currentUser?.agencyName || currentUser?.operatorName || currentUser?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
