import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Passenger } from '../../types';
import {
  User,
  Phone,
  Mail,
  Shield,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Info,
  Building,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const PassengerDetailsPage: React.FC = () => {
  const {
    selectedTrip,
    selectedSeats,
    passengers,
    setPassengers,
    contactMobile,
    setContactMobile,
    contactEmail,
    setContactEmail,
    emergencyContact,
    setEmergencyContact,
    selectedBoardingPoint,
    selectedDroppingPoint,
    settings,
    setCustomerView,
  } = useApp();

  const [optInInsurance, setOptInInsurance] = useState(true);
  const [gstInvoiceWanted, setGstInvoiceWanted] = useState(false);
  const [companyGst, setCompanyGst] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedTrip || selectedSeats.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-slate-600 mb-4">No seats selected.</p>
        <button
          onClick={() => setCustomerView('SEARCH_RESULTS')}
          className="px-6 py-2.5 bg-[#0264A6] text-white rounded-xl font-bold text-xs"
        >
          Return to Bus Search
        </button>
      </div>
    );
  }

  // Handle updates to individual passenger fields
  const handlePassengerChange = (index: number, field: keyof Passenger, value: any) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    for (let i = 0; i < passengers.length; i++) {
      const p = passengers[i];
      if (!p.fullName.trim()) {
        setErrorMsg(`Please enter Full Name for Passenger ${i + 1} (Seat ${p.seatNumber}).`);
        return;
      }
      if (!p.age || p.age < 1 || p.age > 110) {
        setErrorMsg(`Please enter a valid age for Passenger ${i + 1}.`);
        return;
      }
    }

    if (!contactMobile.trim() || contactMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number for ticket SMS/WhatsApp delivery.');
      return;
    }

    if (!contactEmail.trim() || !contactEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address to receive your e-ticket & tax invoice.');
      return;
    }

    setCustomerView('PAYMENT');
  };

  // Fare calculations
  const baseFare = passengers.reduce((sum, p) => sum + p.price, 0);
  const gstAmount = Math.round((baseFare * settings.gstPercentage) / 100);
  const convenienceFee = Math.round((baseFare * settings.convenienceFeePercentage) / 100) || 25;
  const insuranceAmount = optInInsurance ? 15 * passengers.length : 0;
  const totalAmount = baseFare + gstAmount + convenienceFee + insuranceAmount;

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setCustomerView('SEARCH_RESULTS')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0264A6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Seat Selection</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-[#0264A6]">1. Select Seats</span>
            <span className="text-slate-300">➔</span>
            <span className="text-[#0264A6] bg-blue-50 px-2 py-0.5 rounded">2. Passenger Details</span>
            <span className="text-slate-300">➔</span>
            <span className="text-slate-400">3. Payment</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form Column (Passenger details & Contact) */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleProceedToPayment} className="space-y-6">
              {/* Passenger Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#0264A6]" />
                    Passenger Information ({passengers.length} Traveler{passengers.length > 1 ? 's' : ''})
                  </h2>
                  <span className="text-xs text-slate-500">Government ID verified at boarding</span>
                </div>

                {passengers.map((pax, index) => (
                  <div
                    key={pax.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm">
                          Passenger {index + 1}
                        </span>
                      </div>
                      <div className="bg-[#F58220]/10 text-[#F58220] px-3 py-1 rounded-lg text-xs font-bold">
                        Allocated Seat: {pax.seatNumber}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Full Name */}
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name (as per Govt ID) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={pax.fullName}
                          onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        />
                      </div>

                      {/* Age */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Age <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          max="110"
                          value={pax.age}
                          onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value) || '')}
                          placeholder="28"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        />
                      </div>

                      {/* Gender */}
                      <div className="sm:col-span-4">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                          {(['MALE', 'FEMALE', 'OTHER'] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => handlePassengerChange(index, 'gender', g)}
                              className={`py-1.5 rounded-lg text-[11px] transition-all ${
                                pax.gender === g
                                  ? 'bg-[#0264A6] text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {g === 'MALE' ? 'Male' : g === 'FEMALE' ? 'Female' : 'Other'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ID Type & Number */}
                      <div className="sm:col-span-6">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ID Type (Optional)
                        </label>
                        <select
                          value={pax.idType || 'AADHAAR'}
                          onChange={(e) => handlePassengerChange(index, 'idType', e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        >
                          <option value="AADHAAR">Aadhaar Card</option>
                          <option value="PAN">PAN Card</option>
                          <option value="DRIVING_LICENSE">Driving License</option>
                          <option value="VOTER_ID">Voter ID</option>
                          <option value="PASSPORT">Passport</option>
                        </select>
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ID Number (Optional)
                        </label>
                        <input
                          type="text"
                          value={pax.idNumber || ''}
                          onChange={(e) => handlePassengerChange(index, 'idNumber', e.target.value)}
                          placeholder="e.g. XXXX-XXXX-4589"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Information Box */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0264A6]" />
                  Contact Information (For Ticket SMS & WhatsApp Alerts)
                </h3>
                <p className="text-xs text-slate-500">
                  Your ticket details, live tracking link, and driver contact will be sent here.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={contactMobile}
                        onChange={(e) => setContactMobile(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="passenger@example.com"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Emergency Contact Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Insurance & GST add-ons */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optInInsurance}
                    onChange={(e) => setOptInInsurance(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#0264A6] rounded focus:ring-[#0264A6]"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Add Comprehensive Travel Insurance (₹15/traveler)
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Covers up to ₹5,00,000 accidental hospitalization, trip delay & luggage loss.
                    </p>
                  </div>
                </label>

                <div className="pt-3 border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={gstInvoiceWanted}
                      onChange={(e) => setGstInvoiceWanted(e.target.checked)}
                      className="w-4 h-4 text-[#0264A6] rounded focus:ring-[#0264A6]"
                    />
                    <Building className="w-4 h-4 text-[#0264A6]" />
                    <span>I have a GST number for business tax credit</span>
                  </label>

                  {gstInvoiceWanted && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-2">
                      <input
                        type="text"
                        placeholder="Company GSTIN (e.g. 09AAECM8891P1ZV)"
                        value={companyGst}
                        onChange={(e) => setCompanyGst(e.target.value.toUpperCase())}
                        className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs uppercase font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Registered Business Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit to Payment Button */}
              <button
                type="submit"
                id="proceed-payment-btn"
                className="w-full py-4 bg-[#F58220] hover:bg-[#d96b0c] text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group text-base"
              >
                <span>Proceed to Payment (₹{totalAmount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs sticky top-28 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm pb-3 border-b border-slate-100">
                Journey Summary
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-extrabold text-slate-900 text-base">{selectedTrip.bus.operatorName}</span>
                  <div className="text-slate-500 font-medium">{selectedTrip.bus.busName}</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#0264A6]">{selectedTrip.route.fromCity}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="font-bold text-[#F58220]">{selectedTrip.route.toCity}</span>
                  </div>
                  <div className="text-slate-600">
                    Date: <strong>{selectedTrip.departureDate}</strong> ({selectedTrip.departureTime})
                  </div>
                  <div className="text-slate-600">
                    Boarding: <strong>{selectedBoardingPoint?.name}</strong>
                  </div>
                  <div className="text-slate-600">
                    Dropping: <strong>{selectedDroppingPoint?.name}</strong>
                  </div>
                  <div className="text-slate-600">
                    Seats: <strong>{(selectedSeats || []).join(', ')}</strong>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Ticket Fare ({passengers.length} pax):</span>
                    <span>₹{baseFare.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span>₹{gstAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Convenience Fee:</span>
                    <span>₹{convenienceFee}</span>
                  </div>
                  {optInInsurance && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Travel Insurance:</span>
                      <span>₹{insuranceAmount}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-extrabold text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-[#0264A6]">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
