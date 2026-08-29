import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MYatriLogo } from '../common/MYatriLogo';
import {
  Menu,
  X,
  Ticket,
  Search,
  Headphones,
  User,
  LogOut,
  PhoneCall,
  Globe,
  Sparkles,
  Shield
} from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  const {
    customerView,
    setCustomerView,
    currentUser,
    setPnrSearchModalOpen,
    language,
    setLanguage,
    setCurrentRole,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'HOME', label: language === 'HI' ? 'होम' : 'Home' },
    { id: 'SEARCH_RESULTS', label: language === 'HI' ? 'बस बुकिंग' : 'Bus Booking' },
    { id: 'MY_BOOKINGS', label: language === 'HI' ? 'मेरी बुकिंग्स' : 'My Bookings' },
    { id: 'HELP', label: language === 'HI' ? 'सहायता' : 'Help & Support' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[37px] z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCustomerView('HOME')}
              className="flex items-center text-left focus:outline-none"
              title="M Yatri Bus Booking"
            >
              <MYatriLogo size="md" showTagline={true} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 pl-4 border-l border-slate-200">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCustomerView(item.id as any)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    customerView === item.id
                      ? 'text-blue-800 bg-blue-50 font-bold'
                      : 'text-slate-600 hover:text-blue-800 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick 24x7 Helpline */}
            <a
              href="tel:1800120692874"
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-800 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-orange-500" />
              <span className="font-semibold">24x7: 1800-120-MYATRI</span>
            </a>

            {/* PNR Status Button */}
            <button
              onClick={() => setPnrSearchModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-800 border border-slate-200 hover:border-blue-700 px-3.5 py-2 rounded-lg bg-white shadow-xs transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-blue-700" />
              <span>{language === 'HI' ? 'पीएनआर स्थिति' : 'Check PNR'}</span>
            </button>

            {/* User Profile / Login */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors"
              >
                <User className="w-4 h-4" />
                <span>{currentUser?.name || 'Rahul Sharma'}</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser?.mobile}</p>
                    <div className="mt-1.5 inline-block bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      M Yatri Customer
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCustomerView('MY_BOOKINGS');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Ticket className="w-4 h-4 text-blue-800" />
                    My Bookings & Tickets
                  </button>

                  <button
                    onClick={() => {
                      setCustomerView('HELP');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Headphones className="w-4 h-4 text-orange-500" />
                    Customer Support
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <div className="px-4 py-1.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Switch To Partner</span>
                    <button
                      onClick={() => {
                        setCurrentRole('AGENT');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left py-1 text-xs text-blue-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>➔ Agent Booking Portal</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentRole('OPERATOR');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left py-1 text-xs text-orange-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>➔ Bus Operator Portal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setPnrSearchModalOpen(true)}
              className="p-2 text-slate-600 hover:text-blue-800"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 space-y-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCustomerView(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                  customerView === item.id
                    ? 'bg-blue-50 text-blue-800 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  setPnrSearchModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-blue-800 font-semibold flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Check PNR Status
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
