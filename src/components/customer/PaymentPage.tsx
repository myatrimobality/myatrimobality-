import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';
import {
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  Tag,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  QrCode,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Loader2
} from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const {
    selectedTrip,
    selectedSeats,
    passengers,
    contactMobile,
    contactEmail,
    selectedBoardingPoint,
    selectedDroppingPoint,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    createBooking,
    setCustomerView,
    currentUser,
    settings,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiOption, setUpiOption] = useState<'GPAY' | 'PHONEPE' | 'PAYTM' | 'ID' | 'QR'>('QR');
  const [upiIdInput, setUpiIdInput] = useState('');
  
  // Card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  
  // Netbanking bank
  const [selectedBank, setSelectedBank] = useState('HDFC');
  
  // Coupon input
  const [couponInput, setCouponInput] = useState('');
  const [couponStatusMsg, setCouponStatusMsg] = useState<{ success?: boolean; text: string } | null>(null);

  // Wallet deduction option
  const [useWalletBalance, setUseWalletBalance] = useState(false);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!selectedTrip || selectedSeats.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-slate-600 mb-4">No active booking found.</p>
        <button
          onClick={() => setCustomerView('SEARCH_RESULTS')}
          className="px-6 py-2.5 bg-[#0264A6] text-white rounded-xl font-bold text-xs"
        >
          Return to Bus Search
        </button>
      </div>
    );
  }

  // Fare calculations
  const baseFare = passengers.reduce((sum, p) => sum + p.price, 0);
  const gstAmount = Math.round((baseFare * settings.gstPercentage) / 100);
  const convenienceFee = Math.round((baseFare * settings.convenienceFeePercentage) / 100) || 25;
  const insuranceAmount = 15 * passengers.length;
  
  let discountAmount = 0;
  if (activeCoupon) {
    const calculated = (baseFare * activeCoupon.discountPercent) / 100;
    discountAmount = Math.min(calculated, activeCoupon.maxDiscount);
  }

  const subTotal = baseFare + gstAmount + convenienceFee + insuranceAmount - discountAmount;
  
  // Wallet deduction calculation
  const walletAvailable = currentUser?.walletBalance || 0;
  const walletDeducted = useWalletBalance ? Math.min(walletAvailable, subTotal) : 0;
  const finalPayable = subTotal - walletDeducted;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    setCouponStatusMsg({ success: res.success, text: res.message });
  };

  const handlePayNow = async () => {
    setErrorMsg('');
    setIsProcessing(true);

    try {
      // Simulate realistic payment gateway authorization delay (1.5s)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const booking = await createBooking(paymentMethod, 'ONLINE');
      setIsProcessing(false);
      setCustomerView('CONFIRMATION');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setCustomerView('PASSENGER_DETAILS')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0264A6] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Passenger Details</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-[#0264A6]">1. Select Seats</span>
            <span className="text-slate-300">➔</span>
            <span className="text-[#0264A6]">2. Passenger Details</span>
            <span className="text-slate-300">➔</span>
            <span className="text-[#0264A6] bg-blue-50 px-2 py-0.5 rounded">3. Secure Payment</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Methods & Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-emerald-600" />
                    Select Payment Method
                  </h2>
                  <p className="text-xs text-slate-500">256-bit Encrypted SSL Gateway • Certified Indian Travel Payment</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Safe Checkout</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                  { id: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
                  { id: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
                  { id: 'NET_BANKING', label: 'Net Banking', icon: Building },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPaymentMethod(item.id as PaymentMethod)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#0264A6] bg-blue-50/80 text-[#0264A6] font-extrabold shadow-xs ring-2 ring-[#0264A6]/20'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 font-bold'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Method Detail Subpanels */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                {/* 1. UPI Payment */}
                {paymentMethod === 'UPI' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-slate-500">Instant UPI Payment</span>
                      <span className="text-[11px] text-emerald-600 font-bold">Zero Transaction Charges</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                      {[
                        { id: 'QR', label: 'Dynamic QR Code' },
                        { id: 'GPAY', label: 'Google Pay' },
                        { id: 'PHONEPE', label: 'PhonePe' },
                        { id: 'ID', label: 'Enter UPI ID' },
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => setUpiOption(sub.id as any)}
                          className={`p-2.5 rounded-xl border text-center transition-all ${
                            upiOption === sub.id
                              ? 'bg-white border-[#0264A6] text-[#0264A6] shadow-xs'
                              : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>

                    {upiOption === 'QR' && (
                      <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col items-center text-center space-y-3">
                        <div className="p-3 bg-slate-900 rounded-2xl shadow-inner">
                          <QrCode className="w-36 h-36 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Scan with Google Pay, PhonePe, Paytm, or BHIM
                          </p>
                          <p className="text-[11px] text-slate-500">Amount: ₹{finalPayable.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    )}

                    {upiOption === 'ID' && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <label className="block text-xs font-bold text-slate-700">Enter Virtual Payment Address (VPA)</label>
                        <input
                          type="text"
                          placeholder="e.g. mobileNumber@upi or yourname@okhdfcbank"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        />
                      </div>
                    )}

                    {(upiOption === 'GPAY' || upiOption === 'PHONEPE') && (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-600 text-center">
                        You will be redirected to approve the payment request of <strong>₹{finalPayable}</strong> on your {upiOption === 'GPAY' ? 'Google Pay' : 'PhonePe'} app.
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Card Payment */}
                {(paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD') && (
                  <div className="space-y-4">
                    <span className="text-xs font-extrabold uppercase text-slate-500 block">
                      Enter {paymentMethod === 'CREDIT_CARD' ? 'Credit' : 'Debit'} Card Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-12">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4532 •••• •••• 8890"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-6">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          placeholder="Rahul Sharma"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="08/29"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          placeholder="•••"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Net Banking */}
                {paymentMethod === 'NET_BANKING' && (
                  <div className="space-y-3">
                    <span className="text-xs font-extrabold uppercase text-slate-500 block">Select Popular Bank</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedBank === b
                              ? 'bg-white border-[#0264A6] text-[#0264A6] shadow-xs'
                              : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Wallet Balance Option */}
              {currentUser?.walletBalance && currentUser.walletBalance > 0 && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useWalletBalance}
                      onChange={(e) => setUseWalletBalance(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Wallet className="w-4 h-4 text-emerald-600" />
                        Use M Yatri Wallet Balance
                      </span>
                      <p className="text-[11px] text-emerald-700">Available: ₹{walletAvailable.toLocaleString('en-IN')}</p>
                    </div>
                  </label>
                  {useWalletBalance && (
                    <span className="text-xs font-extrabold text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                      - ₹{walletDeducted}
                    </span>
                  )}
                </div>
              )}

              {/* Pay Button */}
              <button
                type="button"
                id="final-pay-button"
                disabled={isProcessing}
                onClick={handlePayNow}
                className="w-full py-4 bg-[#F58220] hover:bg-[#d96b0c] text-white font-extrabold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group text-base disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Authorizing Payment with Bank...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{finalPayable.toLocaleString('en-IN')} & Confirm Ticket</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Coupon Apply & Detailed Fare Breakup */}
          <div className="lg:col-span-4 space-y-4">
            {/* Coupon Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#F58220]" />
                Have a Coupon or Promo Code?
              </h3>

              {activeCoupon ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {activeCoupon.code}
                    </div>
                    <div className="text-[11px] text-emerald-700">Saved ₹{discountAmount}!</div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 hover:text-red-800 font-bold text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. MYATRI100"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-[#0264A6] focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0264A6] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#004d80] transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponStatusMsg && !activeCoupon && (
                <p
                  className={`text-[11px] font-semibold ${
                    couponStatusMsg.success ? 'text-emerald-600' : 'text-red-600'
                  }`}
                >
                  {couponStatusMsg.text}
                </p>
              )}
            </div>

            {/* Fare Breakdown Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm pb-3 border-b border-slate-100">
                Detailed Fare Breakup
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Base Ticket Price ({passengers.length} seat{passengers.length > 1 ? 's' : ''}):</span>
                  <span className="font-semibold text-slate-900">₹{baseFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Goods & Services Tax (GST 5%):</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee:</span>
                  <span>₹{convenienceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Travel Insurance:</span>
                  <span>₹{insuranceAmount}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                    <span>Coupon Discount ({activeCoupon?.code}):</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}

                {walletDeducted > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 p-2 rounded-lg">
                    <span>M Yatri Wallet Deduction:</span>
                    <span>- ₹{walletDeducted}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-extrabold text-slate-900">
                  <span>Net Amount to Pay:</span>
                  <span className="text-xl text-[#0264A6]">₹{finalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
