import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Headphones,
  PhoneCall,
  Mail,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send
} from 'lucide-react';

export const CustomerHelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [supportName, setSupportName] = useState('');
  const [supportPnr, setSupportPnr] = useState('');
  const [supportMsg, setSupportMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: 'How do I download or print my bus ticket?',
      a: 'After booking, your ticket is instantly generated with a unique PNR. You can view, download the PDF, or print your ticket anytime from the "My Bookings" page or using the "Check PNR" tool in the header.',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Cancellations made more than 24 hours prior to departure are eligible for up to 90% refund. Cancellations between 12-24 hours receive 75%, and between 2-12 hours receive 50%. Refunds are credited back to your original payment method / UPI within 2 to 4 hours.',
    },
    {
      q: 'Are female-only seats available?',
      a: 'Yes! M Yatri reserves dedicated single-lady berths and sleeper units. When booking, select the "Female Passenger" filter to ensure adjacent seats are strictly reserved for female co-passengers.',
    },
    {
      q: 'What if my bus is delayed or boarding point changes?',
      a: 'You will receive real-time SMS and WhatsApp alerts. You can also use the "Live Bus GPS" tracker embedded on your e-ticket to see live driver speed and estimated arrival time.',
    },
    {
      q: 'How much luggage can I carry?',
      a: 'Each passenger is allowed up to 15 kg of personal luggage free of charge. Heavy commercial luggage may incur nominal extra charges payable to the bus operator at the boarding counter.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSupportName('');
      setSupportPnr('');
      setSupportMsg('');
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Support Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0264A6] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-2">
            <Headphones className="w-3.5 h-3.5" />
            <span>24x7 Customer Care</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">How Can We Help You Today?</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Dedicated round-the-clock support for bus ticketing, live tracking, cancellations & UPI refunds.
          </p>
        </div>

        {/* 3 Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0264A6] flex items-center justify-center">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Toll-Free Helpline</h3>
              <p className="text-xs text-slate-500 mt-1">Instant voice assistance 24 hours</p>
            </div>
            <a
              href="tel:1800120692874"
              className="text-sm font-black text-[#0264A6] hover:underline"
            >
              1800-120-MYATRI
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">WhatsApp Assistance</h3>
              <p className="text-xs text-slate-500 mt-1">Get tickets, PNR status & receipts</p>
            </div>
            <span className="text-sm font-black text-emerald-700">+91 98765 00000</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F58220] flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Email Support</h3>
              <p className="text-xs text-slate-500 mt-1">Response within 2 hours</p>
            </div>
            <span className="text-sm font-black text-[#F58220]">support@myatri.in</span>
          </div>
        </div>

        {/* 2-Column FAQs & Query Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQs Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-[#0264A6]" />
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-[#0264A6]"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[#0264A6] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Query Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base">Send Support Request</h3>
            <p className="text-xs text-slate-500">Need urgent help with a booking? Our escalation team will call you.</p>

            {submitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs space-y-1 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <div className="font-bold">Request Received! Ticket #MY-SR-9412</div>
                <p>Our passenger executive will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={supportName}
                    onChange={(e) => setSupportName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">PNR Number (Optional)</label>
                  <input
                    type="text"
                    value={supportPnr}
                    onChange={(e) => setSupportPnr(e.target.value.toUpperCase())}
                    placeholder="e.g. MY-2026-88942"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold uppercase focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Message / Query</label>
                  <textarea
                    required
                    rows={4}
                    value={supportMsg}
                    onChange={(e) => setSupportMsg(e.target.value)}
                    placeholder="Please describe your issue (e.g. reschedule date, refund inquiry, driver contact)..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#0264A6] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#0264A6] hover:bg-[#004d80] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
