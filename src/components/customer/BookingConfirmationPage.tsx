import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MYatriLogo } from '../common/MYatriLogo';
import {
  Printer,
  Download,
  Share2,
  PhoneCall,
  CheckCircle,
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  QrCode,
  AlertTriangle,
  ArrowRight,
  Info,
  Navigation,
  MessageSquare
} from 'lucide-react';

export const BookingConfirmationPage: React.FC = () => {
  const {
    confirmedBooking,
    setCustomerView,
    cancelBooking,
    lookupPnr,
  } = useApp();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [gpsModalOpen, setGpsModalOpen] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!confirmedBooking) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <p className="text-slate-600 mb-4">No active booking details found.</p>
        <button
          onClick={() => setCustomerView('HOME')}
          className="px-6 py-2.5 bg-[#0264A6] text-white rounded-xl font-bold text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const { pnr, trip, passengers, boardingPoint, droppingPoint, totalAmount, fareBreakup, bookingStatus } = confirmedBooking;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 4000);
  };

  const handleCancelBooking = () => {
    if (!cancelReason.trim()) {
      alert('Please select or provide a reason for cancellation.');
      return;
    }
    const res = cancelBooking(confirmedBooking.id, cancelReason);
    if (res.success) {
      alert(`Booking ${pnr} has been cancelled. Refund amount of ₹${res.refundAmount} initiated.`);
      setCancelModalOpen(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen py-8 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Confirmation Banner (Hidden in Print) */}
        <div className="print:hidden bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold">Booking Confirmed!</h1>
              <p className="text-xs text-emerald-100 font-medium">
                E-Ticket and live GPS tracking link have been sent via SMS & WhatsApp to {confirmedBooking.contactMobile}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setGpsModalOpen(true)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              Live Bus GPS
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Ticket
            </button>
          </div>
        </div>

        {/* Action Buttons Toolbar (Hidden in Print) */}
        <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>{shareSuccess ? 'Ticket Sent to WhatsApp!' : 'Send to WhatsApp'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#0264A6]" />
              <span>Download PDF Ticket</span>
            </button>
          </div>

          {bookingStatus === 'CONFIRMED' && (
            <button
              onClick={() => setCancelModalOpen(true)}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Cancel Ticket & Claim Refund</span>
            </button>
          )}
        </div>

        {/* OFFICIAL M YATRI E-TICKET DOCUMENT (Print-friendly) */}
        <div className="bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden print:border-none print:shadow-none">
          {/* Ticket Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-950 via-[#005BA6] to-[#004175] text-white flex flex-wrap items-center justify-between gap-4 border-b-4 border-[#FF8C00]">
            <div className="flex items-center gap-3">
              <div className="bg-white px-3 py-1.5 rounded-xl shadow-xs border border-slate-100 flex items-center">
                <MYatriLogo size="md" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-blue-200 block">
                  Official Electronic Travel Ticket
                </span>
                <h2 className="text-xl font-extrabold text-white">M Yatri Intercity Passenger Pass</h2>
              </div>
            </div>

            {/* PNR & Status */}
            <div className="text-right bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-200">PNR NUMBER</span>
              <div className="text-xl font-mono font-black text-amber-300">{pnr}</div>
              <span
                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                  bookingStatus === 'CONFIRMED'
                    ? 'bg-emerald-500 text-white'
                    : bookingStatus === 'CANCELLED'
                    ? 'bg-red-500 text-white'
                    : 'bg-blue-400 text-white'
                }`}
              >
                {bookingStatus}
              </span>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Journey Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              {/* Pickup info */}
              <div className="md:col-span-5 space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Boarding From</span>
                <h3 className="text-lg font-black text-slate-900">{trip.route.fromCity}</h3>
                <p className="text-xs font-bold text-[#0264A6]">{boardingPoint.name}</p>
                <p className="text-[11px] text-slate-500">{boardingPoint.landmark}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#0264A6]" />
                  <span>Departure Time: {trip.departureTime} ({boardingPoint.time})</span>
                </div>
                <div className="text-[11px] text-amber-700 font-semibold">
                  *Reporting Time: 15 minutes before departure
                </div>
              </div>

              {/* Journey graphics */}
              <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-slate-500">{trip.duration}</span>
                <div className="w-full flex items-center my-2">
                  <div className="w-2 h-2 rounded-full bg-[#0264A6]"></div>
                  <div className="flex-1 border-t-2 border-dashed border-slate-300"></div>
                  <div className="w-2 h-2 rounded-full bg-[#F58220]"></div>
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  {confirmedBooking.journeyDate}
                </span>
              </div>

              {/* Drop info */}
              <div className="md:col-span-5 md:text-right space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Destination Drop</span>
                <h3 className="text-lg font-black text-slate-900">{trip.route.toCity}</h3>
                <p className="text-xs font-bold text-[#F58220]">{droppingPoint.name}</p>
                <p className="text-[11px] text-slate-500">{droppingPoint.landmark}</p>
                <div className="flex items-center md:justify-end gap-1.5 text-xs text-slate-700 font-bold pt-1">
                  <Clock className="w-3.5 h-3.5 text-[#F58220]" />
                  <span>Arrival Time: {trip.arrivalTime} ({droppingPoint.time})</span>
                </div>
              </div>
            </div>

            {/* Operator & Bus Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-200 pb-5 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Bus Operator</span>
                <div className="font-extrabold text-slate-900 text-sm">{trip.bus.operatorName}</div>
                <div className="text-slate-500">{trip.bus.busNumber}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Bus Category</span>
                <div className="font-bold text-slate-800">
                  {trip.bus.isAC ? 'Air Conditioned' : 'Non-AC'} • {trip.bus.isSleeper ? 'Sleeper 2+1' : 'Seater'}
                </div>
                <div className="text-slate-500">{trip.bus.busName}</div>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px]">Contact & Support</span>
                <div className="font-bold text-[#0264A6]">1800-120-MYATRI (24x7)</div>
                <div className="text-slate-500">support@myatri.in</div>
              </div>
            </div>

            {/* Passenger List Table */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                Passenger Details & Seat Allocation
              </h4>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Passenger Name</th>
                      <th className="py-3 px-4">Age / Gender</th>
                      <th className="py-3 px-4">Seat Number</th>
                      <th className="py-3 px-4 text-right">Fare (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {passengers.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{p.fullName}</td>
                        <td className="py-3 px-4 text-slate-600">{p.age} yrs / {p.gender}</td>
                        <td className="py-3 px-4">
                          <span className="bg-[#F58220]/10 text-[#F58220] font-extrabold px-2.5 py-1 rounded-lg">
                            Seat {p.seatNumber}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-slate-900">₹{p.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Row: QR Code + Fare Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-200 items-center">
              {/* QR Verification */}
              <div className="md:col-span-5 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <QrCode className="w-16 h-16 text-slate-900" />
                </div>
                <div className="text-[11px] text-slate-600 space-y-1">
                  <div className="font-bold text-slate-900">Fast Boarding QR Pass</div>
                  <p>Scan this QR code with the bus conductor during boarding.</p>
                  <p className="text-slate-400 font-mono text-[9px]">HASH: MY-{pnr.replace(/[^0-9]/g, '')}-SEC</p>
                </div>
              </div>

              {/* Fare Summary */}
              <div className="md:col-span-7 space-y-1.5 text-xs text-slate-600 md:pl-6">
                <div className="flex justify-between">
                  <span>Base Ticket Fare:</span>
                  <span>₹{fareBreakup.baseFare.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span>₹{fareBreakup.gst}</span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee:</span>
                  <span>₹{fareBreakup.convenienceFee}</span>
                </div>
                {fareBreakup.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Applied:</span>
                    <span>- ₹{fareBreakup.discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-300 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Amount Paid:</span>
                  <span className="text-[#0264A6]">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Terms & Important Instructions */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-950">
                <Info className="w-3.5 h-3.5 text-amber-700" />
                <span>Important Travel Guidelines:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                <li>Please carry a valid government photo ID (Aadhaar, PAN, Voter ID) matching the ticket name.</li>
                <li>Free luggage allowance: Up to 15kg per passenger. Hazardous materials strictly prohibited.</li>
                <li>M Yatri helpline: Toll-free 1800-120-MYATRI (Available 24 hours).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Live GPS Tracker Modal */}
      {gpsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 font-extrabold text-slate-900">
                <Navigation className="w-5 h-5 text-[#0264A6]" />
                <span>Live Bus GPS Tracker • {trip.bus.busNumber}</span>
              </div>
              <button
                onClick={() => setGpsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Interactive GPS map simulation */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white text-center space-y-3 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-ping">
                  <Navigation className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-emerald-400 text-sm">GPS Status: LIVE ON ROUTE</div>
                <div className="text-xs text-slate-300 mt-1">
                  Speed: 72 km/h • Current Location: Agra-Lucknow Expressway Toll Plaza
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Estimated Arrival at {droppingPoint.name}: {droppingPoint.time}
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setGpsModalOpen(false)}
                className="px-6 py-2.5 bg-[#0264A6] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Close Live Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Ticket Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Confirm Ticket Cancellation
              </h3>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to cancel booking for <strong>PNR {pnr}</strong>?
            </p>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span>Original Booking Amount:</span>
                <span className="font-bold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Cancellation Charges (10%):</span>
                <span>- ₹{Math.round(totalAmount * 0.1)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-emerald-700 text-sm">
                <span>Refund Amount to Source:</span>
                <span>₹{Math.round(totalAmount * 0.9)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                <option value="">-- Choose Reason --</option>
                <option value="Plan Changed / Trip Rescheduled">Plan Changed / Trip Rescheduled</option>
                <option value="Booked Alternate Transport">Booked Alternate Transport</option>
                <option value="Incorrect Date Selected">Incorrect Date Selected</option>
                <option value="Personal Emergency">Personal Emergency</option>
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Keep Ticket
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Confirm Cancellation & Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
