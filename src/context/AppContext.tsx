import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  Bus,
  Route,
  Trip,
  Booking,
  Coupon,
  Operator,
  OperatorSettlement,
  NotificationItem,
  WalletTransaction,
  SystemSettings,
  StopPoint,
  Passenger,
  PaymentMethod,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_ROUTES,
  INITIAL_BUSES,
  INITIAL_TRIPS,
  INITIAL_BOOKINGS,
  INITIAL_COUPONS,
  INITIAL_OPERATORS,
  INITIAL_SETTLEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_WALLET_TRANSACTIONS,
  INITIAL_SETTINGS,
  generateBusSeats,
} from '../data/mockData';

interface SearchQuery {
  fromCity: string;
  toCity: string;
  journeyDate: string;
  returnDate?: string;
  isRoundTrip: boolean;
  womenOnly: boolean;
}

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  
  // Active Panels navigation views
  customerView: 'HOME' | 'SEARCH_RESULTS' | 'SEAT_SELECT' | 'PASSENGER_DETAILS' | 'PAYMENT' | 'CONFIRMATION' | 'MY_BOOKINGS' | 'HELP' | 'PROFILE';
  setCustomerView: (view: any) => void;
  agentView: 'DASHBOARD' | 'BOOKING_TERMINAL' | 'BOOKINGS_LIST' | 'WALLET' | 'COMMISSIONS' | 'CUSTOMERS' | 'REPORTS' | 'PROFILE';
  setAgentView: (view: any) => void;
  operatorView: 'DASHBOARD' | 'FLEET' | 'ROUTES' | 'TRIPS' | 'MANIFEST' | 'CANCELLATIONS' | 'SETTLEMENTS' | 'PROFILE';
  setOperatorView: (view: any) => void;
  adminView: 'DASHBOARD' | 'USERS' | 'BUS_APPROVALS' | 'ROUTES' | 'PRICING' | 'BOOKINGS' | 'SETTLEMENTS' | 'REPORTS' | 'SETTINGS';
  setAdminView: (view: any) => void;

  // Search & Booking Flow
  searchQuery: SearchQuery;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
  selectedTrip: Trip | null;
  setSelectedTrip: (trip: Trip | null) => void;
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  seatLockTimeRemaining: number;
  
  selectedBoardingPoint: StopPoint | null;
  setSelectedBoardingPoint: (point: StopPoint | null) => void;
  selectedDroppingPoint: StopPoint | null;
  setSelectedDroppingPoint: (point: StopPoint | null) => void;
  
  passengers: Passenger[];
  setPassengers: React.Dispatch<React.SetStateAction<Passenger[]>>;
  contactMobile: string;
  setContactMobile: (mobile: string) => void;
  contactEmail: string;
  setContactEmail: (email: string) => void;
  emergencyContact: string;
  setEmergencyContact: (contact: string) => void;
  
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  confirmedBooking: Booking | null;
  setConfirmedBooking: (booking: Booking | null) => void;
  
  // Data Collections
  trips: Trip[];
  buses: Bus[];
  routes: Route[];
  bookings: Booking[];
  coupons: Coupon[];
  operators: Operator[];
  setOperators: React.Dispatch<React.SetStateAction<Operator[]>>;
  settlements: OperatorSettlement[];
  setSettlements: React.Dispatch<React.SetStateAction<OperatorSettlement[]>>;
  walletTransactions: WalletTransaction[];
  setWalletTransactions: React.Dispatch<React.SetStateAction<WalletTransaction[]>>;
  notifications: NotificationItem[];
  settings: SystemSettings;
  
  // Operations & Mutators
  handleSearch: (from: string, to: string, date: string, womenOnly?: boolean) => void;
  lockSeat: (seatNumber: string) => boolean;
  unlockSeat: (seatNumber: string) => void;
  clearSeatSelection: () => void;
  createBooking: (paymentMethod: PaymentMethod, channel?: 'ONLINE' | 'AGENT') => Promise<Booking>;
  cancelBooking: (bookingId: string, reason: string) => { success: boolean; refundAmount: number };
  
  // Operator Actions
  addBus: (busData: Partial<Bus>) => void;
  updateBus: (busId: string, updates: Partial<Bus>) => void;
  addRoute: (routeData: Partial<Route>) => void;
  addTrip: (tripData: Partial<Trip>) => void;
  requestTripCancellation: (tripId: string, reason: string) => void;
  
  // Admin Actions
  approveBus: (busId: string) => void;
  rejectBus: (busId: string) => void;
  approveTripCancellation: (tripId: string) => void;
  updateUserStatus: (userId: string, status: 'ACTIVE' | 'SUSPENDED') => void;
  updateAgentCommission: (agentId: string, type: 'PERCENTAGE' | 'FIXED', value: number) => void;
  topupAgentWallet: (agentId: string, amount: number, utr: string) => void;
  topUpAgentWallet: (amount: number, note?: string) => void;
  settleOperatorPayment: (settlementId: string, utr: string) => void;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  
  // Notifications
  dispatchNotification: (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
  
  // Quick PNR tracker modal
  pnrSearchModalOpen: boolean;
  setPnrSearchModalOpen: (open: boolean) => void;
  searchedBookingForPnr: Booking | null;
  lookupPnr: (pnr: string) => Booking | null;

  // Language
  language: 'EN' | 'HI';
  setLanguage: (lang: 'EN' | 'HI') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage init or fallback with safe JSON parse
  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('myatri_role') as UserRole) || 'CUSTOMER';
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return (users || []).find((u) => u.role === currentRole) || users[0] || null;
  });

  // Views for sub-portals
  const [customerView, setCustomerView] = useState<'HOME' | 'SEARCH_RESULTS' | 'SEAT_SELECT' | 'PASSENGER_DETAILS' | 'PAYMENT' | 'CONFIRMATION' | 'MY_BOOKINGS' | 'HELP' | 'PROFILE'>('HOME');
  const [agentView, setAgentView] = useState<'DASHBOARD' | 'BOOKING_TERMINAL' | 'BOOKINGS_LIST' | 'WALLET' | 'COMMISSIONS' | 'CUSTOMERS' | 'REPORTS' | 'PROFILE'>('DASHBOARD');
  const [operatorView, setOperatorView] = useState<'DASHBOARD' | 'FLEET' | 'ROUTES' | 'TRIPS' | 'MANIFEST' | 'CANCELLATIONS' | 'SETTLEMENTS' | 'PROFILE'>('DASHBOARD');
  const [adminView, setAdminView] = useState<'DASHBOARD' | 'USERS' | 'BUS_APPROVALS' | 'ROUTES' | 'PRICING' | 'BOOKINGS' | 'SETTLEMENTS' | 'REPORTS' | 'SETTINGS'>('DASHBOARD');

  // Search & Booking State
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    fromCity: 'Kanpur',
    toCity: 'Delhi',
    journeyDate: '2026-08-30',
    isRoundTrip: false,
    womenOnly: false,
  });

  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [seatLockTimeRemaining, setSeatLockTimeRemaining] = useState<number>(600); // 10 minutes in seconds

  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<StopPoint | null>(null);
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<StopPoint | null>(null);

  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [contactMobile, setContactMobile] = useState<string>('+91 98765 43210');
  const [contactEmail, setContactEmail] = useState<string>('passenger@example.com');
  const [emergencyContact, setEmergencyContact] = useState<string>('+91 98765 00000');

  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Data Stores
  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_trips');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_TRIPS;
  });

  const [buses, setBuses] = useState<Bus[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_buses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_BUSES;
  });

  const [routes, setRoutes] = useState<Route[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_routes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ROUTES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_bookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_BOOKINGS;
  });

  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);

  const [operators, setOperators] = useState<Operator[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_operators');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_OPERATORS;
  });

  const [settlements, setSettlements] = useState<OperatorSettlement[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_settlements');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_SETTLEMENTS;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_wallet_txns');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_WALLET_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('myatri_notifications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('myatri_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  });

  const [pnrSearchModalOpen, setPnrSearchModalOpen] = useState<boolean>(false);
  const [searchedBookingForPnr, setSearchedBookingForPnr] = useState<Booking | null>(null);
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('myatri_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('myatri_buses', JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem('myatri_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('myatri_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('myatri_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('myatri_operators', JSON.stringify(operators));
  }, [operators]);

  useEffect(() => {
    localStorage.setItem('myatri_settlements', JSON.stringify(settlements));
  }, [settlements]);

  useEffect(() => {
    localStorage.setItem('myatri_wallet_txns', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  useEffect(() => {
    localStorage.setItem('myatri_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('myatri_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle Role Switching
  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem('myatri_role', role);
    const matchedUser = (users || []).find((u) => u.role === role) || users[0] || null;
    setCurrentUser(matchedUser);
  };

  // Seat Lock Timer countdown
  useEffect(() => {
    if (selectedSeats.length === 0) {
      setSeatLockTimeRemaining(600);
      return;
    }

    const timer = setInterval(() => {
      setSeatLockTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time expired, auto release
          clearSeatSelection();
          dispatchNotification({
            recipientRole: currentRole,
            title: 'Seat Lock Expired',
            message: 'Your 10-minute temporary seat reservation has expired. Please select your seats again.',
            type: 'ALERT',
            channel: 'IN_APP',
          });
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedSeats.length, currentRole]);

  // Search Buses
  const handleSearch = (from: string, to: string, date: string, womenOnly = false) => {
    setSearchQuery({
      fromCity: from,
      toCity: to,
      journeyDate: date,
      isRoundTrip: false,
      womenOnly,
    });
    setCustomerView('SEARCH_RESULTS');
  };

  // Seat Operations
  const lockSeat = (seatNumber: string): boolean => {
    if (!selectedTrip) return false;
    
    // Check if max 6 seats reached
    if (selectedSeats.length >= 6 && !selectedSeats.includes(seatNumber)) {
      alert('You can select a maximum of 6 seats in a single booking.');
      return false;
    }

    const seat = selectedTrip.seats.find((s) => s.seatNumber === seatNumber);
    if (!seat || seat.status === 'BOOKED') return false;

    if (selectedSeats.includes(seatNumber)) {
      unlockSeat(seatNumber);
      return true;
    }

    setSelectedSeats((prev) => [...prev, seatNumber]);

    // Initialize or update passenger placeholder
    setPassengers((prev) => {
      if (prev.some((p) => p.seatNumber === seatNumber)) return prev;
      return [
        ...prev,
        {
          id: `pax_${Date.now()}_${seatNumber}`,
          seatNumber,
          fullName: prev.length === 0 && currentUser?.name ? currentUser.name : '',
          age: 25,
          gender: seat.status === 'FEMALE_RESERVED' ? 'FEMALE' : 'MALE',
          idType: 'AADHAAR',
          price: seat.basePrice,
        },
      ];
    });

    return true;
  };

  const unlockSeat = (seatNumber: string) => {
    setSelectedSeats((prev) => prev.filter((s) => s !== seatNumber));
    setPassengers((prev) => prev.filter((p) => p.seatNumber !== seatNumber));
  };

  const clearSeatSelection = () => {
    setSelectedSeats([]);
    setPassengers([]);
    setSeatLockTimeRemaining(600);
  };

  // Apply Coupon
  const applyCoupon = (code: string) => {
    const found = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    // Calculate base total
    const baseTotal = passengers.reduce((sum, p) => sum + p.price, 0);
    if (baseTotal < found.minBookingAmount) {
      return {
        success: false,
        message: `Coupon applicable on minimum booking value of ₹${found.minBookingAmount}. Current: ₹${baseTotal}.`,
      };
    }

    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied! Enjoy your discount.` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  // Create Booking
  const createBooking = async (paymentMethod: PaymentMethod, channel: 'ONLINE' | 'AGENT' = 'ONLINE'): Promise<Booking> => {
    if (!selectedTrip || selectedSeats.length === 0 || !selectedBoardingPoint || !selectedDroppingPoint) {
      throw new Error('Incomplete booking information');
    }

    const baseFare = passengers.reduce((sum, p) => sum + p.price, 0);
    const gstAmount = Math.round((baseFare * settings.gstPercentage) / 100);
    const convenienceFee = Math.round((baseFare * settings.convenienceFeePercentage) / 100) || 20;
    const insuranceAmount = 15 * passengers.length;
    
    let discountAmount = 0;
    if (activeCoupon) {
      const calculated = (baseFare * activeCoupon.discountPercent) / 100;
      discountAmount = Math.min(calculated, activeCoupon.maxDiscount);
    }

    const totalAmount = baseFare + gstAmount + convenienceFee + insuranceAmount - discountAmount;
    
    // Agent Commission logic
    let agentCommission = 0;
    let netPayableByAgent = totalAmount;
    if (channel === 'AGENT') {
      const commRate = currentUser?.commissionValue || settings.defaultAgentCommissionPercent;
      if (currentUser?.commissionType === 'FIXED') {
        agentCommission = commRate * passengers.length;
      } else {
        agentCommission = Math.round((baseFare * commRate) / 100);
      }
      netPayableByAgent = totalAmount - agentCommission;
    }

    const pnr = `MY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newBooking: Booking = {
      id: `bkg_${Date.now()}`,
      pnr,
      bookingChannel: channel,
      customerId: channel === 'ONLINE' ? (currentUser?.id || 'guest_user') : undefined,
      agentId: channel === 'AGENT' ? currentUser?.id : undefined,
      agentName: channel === 'AGENT' ? (currentUser?.agencyName || currentUser?.name) : undefined,
      operatorId: selectedTrip.operatorId,
      tripId: selectedTrip.id,
      trip: selectedTrip,
      passengers: [...passengers],
      selectedSeats: [...selectedSeats],
      contactMobile,
      contactEmail,
      emergencyContact,
      boardingPoint: selectedBoardingPoint,
      droppingPoint: selectedDroppingPoint,
      journeyDate: selectedTrip.departureDate,
      departureTime: selectedTrip.departureTime,
      arrivalTime: selectedTrip.arrivalTime,
      baseFare,
      gstAmount,
      convenienceFee,
      discountAmount,
      insuranceAmount,
      totalAmount,
      agentCommission: channel === 'AGENT' ? agentCommission : undefined,
      netPayableByAgent: channel === 'AGENT' ? netPayableByAgent : undefined,
      couponCode: activeCoupon?.code,
      paymentMethod,
      paymentTransactionId: `TXN-${paymentMethod}-${Date.now().toString().slice(-8)}`,
      paymentStatus: 'PAID',
      bookingStatus: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    // Update Seat Status in Trip to BOOKED
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== selectedTrip.id) return t;
        return {
          ...t,
          seats: t.seats.map((s) =>
            selectedSeats.includes(s.seatNumber) ? { ...s, status: 'BOOKED' } : s
          ),
        };
      })
    );

    // If agent booked, deduct from agent wallet balance
    if (channel === 'AGENT' && currentUser && currentUser.walletBalance !== undefined) {
      const updatedBalance = currentUser.walletBalance - netPayableByAgent;
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === currentUser.id ? { ...u, walletBalance: Math.max(0, updatedBalance) } : u
        )
      );
    }

    // Save booking
    setBookings((prev) => [newBooking, ...prev]);
    setConfirmedBooking(newBooking);

    // Send notifications to Customer, Operator, Agent, Admin
    dispatchNotification({
      recipientRole: 'CUSTOMER',
      recipientId: newBooking.customerId,
      title: `Booking Confirmed: PNR ${newBooking.pnr}`,
      message: `Your booking for ${selectedTrip.route.fromCity} to ${selectedTrip.route.toCity} on ${selectedTrip.departureDate} is confirmed! Seat(s): ${(selectedSeats || []).join(', ')}.`,
      type: 'BOOKING',
      channel: 'WHATSAPP',
    });

    dispatchNotification({
      recipientRole: 'OPERATOR',
      recipientId: selectedTrip.operatorId,
      title: `New ${channel} Booking: ${newBooking.pnr}`,
      message: `${passengers.length} passenger(s) booked on Trip ${selectedTrip.bus.busNumber} (${selectedTrip.route.fromCity} → ${selectedTrip.route.toCity}).`,
      type: 'BOOKING',
      channel: 'SMS',
    });

    if (channel === 'AGENT') {
      dispatchNotification({
        recipientRole: 'AGENT',
        recipientId: currentUser?.id,
        title: `Commission Earned: ₹${agentCommission}`,
        message: `Booking ${newBooking.pnr} completed. Commission of ₹${agentCommission} credited to statement.`,
        type: 'WALLET',
        channel: 'IN_APP',
      });
    }

    dispatchNotification({
      recipientRole: 'ADMIN',
      title: `Platform Booking: PNR ${newBooking.pnr}`,
      message: `New booking of ₹${totalAmount} via ${channel} channel on ${selectedTrip.bus.operatorName}.`,
      type: 'BOOKING',
      channel: 'IN_APP',
    });

    // Clear active selection
    clearSeatSelection();

    return newBooking;
  };

  // Cancel Booking with policy calculation
  const cancelBooking = (bookingId: string, reason: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, refundAmount: 0 };

    // Calculate refund based on journey date and policy
    const refundPercentage = settings.cancellationPolicy.moreThan24HoursRefundPercent;
    const refundAmount = Math.round((booking.baseFare * refundPercentage) / 100);

    const updatedBookings = bookings.map((b) => {
      if (b.id !== bookingId) return b;
      return {
        ...b,
        bookingStatus: 'CANCELLED' as const,
        cancellationReason: reason,
        cancelledAt: new Date().toISOString(),
        refundAmount,
        refundStatus: 'REFUNDED' as const,
        refundTransactionId: `REF-${Date.now().toString().slice(-8)}`,
      };
    });

    setBookings(updatedBookings);

    // Release seats in trip
    setTrips((prevTrips) =>
      prevTrips.map((t) => {
        if (t.id !== booking.tripId) return t;
        return {
          ...t,
          seats: t.seats.map((s) =>
            booking.selectedSeats.includes(s.seatNumber) ? { ...s, status: 'AVAILABLE' } : s
          ),
        };
      })
    );

    // Notification
    dispatchNotification({
      recipientRole: 'CUSTOMER',
      recipientId: booking.customerId,
      title: `Booking Cancelled: PNR ${booking.pnr}`,
      message: `Your booking has been cancelled. Refund of ₹${refundAmount} has been processed to your original payment source.`,
      type: 'CANCELLATION',
      channel: 'SMS',
    });

    return { success: true, refundAmount };
  };

  // Operator Add/Update Bus
  const addBus = (busData: Partial<Bus>) => {
    const newBus: Bus = {
      id: `bus_${Date.now()}`,
      operatorId: currentUser?.id || 'usr_op_1',
      operatorName: currentUser?.operatorName || 'M Yatri Travels',
      operatorRating: 4.8,
      totalReviews: 1,
      busNumber: busData.busNumber || 'UP 78 XY 0000',
      busName: busData.busName || 'Premium Luxury Bus',
      busType: busData.busType || 'AC_SLEEPER',
      isAC: busData.isAC ?? true,
      isSleeper: busData.isSleeper ?? true,
      totalSeats: busData.totalSeats || 30,
      availableSeatsCount: busData.totalSeats || 30,
      amenities: busData.amenities || ['WiFi', 'Blanket', 'Charging Point', 'Water Bottle'],
      approvalStatus: 'PENDING_APPROVAL', // Operator added bus starts in PENDING ADMIN APPROVAL
      status: 'INACTIVE',
      lowerDeckCols: 4,
      lowerDeckRows: 5,
      upperDeckCols: 4,
      upperDeckRows: 5,
      seats: generateBusSeats(busData.busType || 'AC_SLEEPER', 800),
      driverName: busData.driverName || 'Rajendra Singh',
      driverPhone: busData.driverPhone || '+91 98765 99887',
      gpsTrackingId: `GPS-MY-${Math.floor(1000 + Math.random() * 9000)}`,
      ...busData,
    };

    setBuses((prev) => [newBus, ...prev]);

    dispatchNotification({
      recipientRole: 'ADMIN',
      title: 'New Bus Added - Needs Approval',
      message: `${newBus.operatorName} submitted new bus ${newBus.busNumber} for inspection and approval.`,
      type: 'APPROVAL',
      channel: 'IN_APP',
    });
  };

  const updateBus = (busId: string, updates: Partial<Bus>) => {
    setBuses((prev) => prev.map((b) => (b.id === busId ? { ...b, ...updates } : b)));
  };

  const addRoute = (routeData: Partial<Route>) => {
    const newRoute: Route = {
      id: `route_${Date.now()}`,
      fromCity: routeData.fromCity || 'Kanpur',
      toCity: routeData.toCity || 'Varanasi',
      distanceKm: routeData.distanceKm || 320,
      estimatedDuration: routeData.estimatedDuration || '5h 30m',
      boardingPoints: routeData.boardingPoints || [
        { id: `bp_${Date.now()}_1`, name: 'Central Bus Stand', landmark: 'Main Gate', time: '20:00' },
      ],
      droppingPoints: routeData.droppingPoints || [
        { id: `dp_${Date.now()}_1`, name: 'City Center Terminal', landmark: 'Platform 1', time: '01:30' },
      ],
      restStops: routeData.restStops || [],
      isActive: true,
    };
    setRoutes((prev) => [newRoute, ...prev]);
  };

  const addTrip = (tripData: Partial<Trip>) => {
    const matchedBus = buses.find((b) => b.id === tripData.busId) || buses[0];
    const matchedRoute = routes.find((r) => r.id === tripData.routeId) || routes[0];

    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      busId: matchedBus.id,
      operatorId: matchedBus.operatorId,
      routeId: matchedRoute.id,
      bus: matchedBus,
      route: matchedRoute,
      departureDate: tripData.departureDate || '2026-08-30',
      departureTime: tripData.departureTime || '21:00',
      arrivalDate: tripData.arrivalDate || '2026-08-31',
      arrivalTime: tripData.arrivalTime || '05:00',
      duration: matchedRoute.estimatedDuration,
      basePrice: tripData.basePrice || 800,
      sleeperPrice: (tripData.basePrice || 800) + 120,
      seaterPrice: tripData.basePrice || 800,
      dynamicSurgeMultiplier: 1.0,
      seats: matchedBus.seats,
      isCancelled: false,
    };

    setTrips((prev) => [newTrip, ...prev]);
  };

  const requestTripCancellation = (tripId: string, reason: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              cancellationReason: reason,
              cancellationApprovalStatus: 'PENDING_APPROVAL',
            }
          : t
      )
    );

    dispatchNotification({
      recipientRole: 'ADMIN',
      title: 'Trip Cancellation Request Submitted',
      message: `Trip #${tripId} has a cancellation request pending approval. Reason: ${reason}`,
      type: 'CANCELLATION',
      channel: 'IN_APP',
    });
  };

  // Admin approvals
  const approveBus = (busId: string) => {
    setBuses((prev) =>
      prev.map((b) =>
        b.id === busId ? { ...b, approvalStatus: 'APPROVED', status: 'ACTIVE' } : b
      )
    );

    const bus = buses.find((b) => b.id === busId);
    if (bus) {
      dispatchNotification({
        recipientRole: 'OPERATOR',
        recipientId: bus.operatorId,
        title: `Bus Approved: ${bus.busNumber}`,
        message: `Your bus ${bus.busNumber} has been verified and is now ACTIVE for trip scheduling.`,
        type: 'APPROVAL',
        channel: 'WHATSAPP',
      });
    }
  };

  const rejectBus = (busId: string) => {
    setBuses((prev) =>
      prev.map((b) =>
        b.id === busId ? { ...b, approvalStatus: 'REJECTED', status: 'INACTIVE' } : b
      )
    );
  };

  const approveTripCancellation = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? {
              ...t,
              isCancelled: true,
              cancellationApprovalStatus: 'APPROVED',
            }
          : t
      )
    );

    // Cancel all associated bookings and trigger refunds
    const tripBookings = bookings.filter((b) => b.tripId === tripId && b.bookingStatus === 'CONFIRMED');
    tripBookings.forEach((b) => {
      cancelBooking(b.id, 'Trip cancelled by operator (Admin Approved)');
    });
  };

  const updateUserStatus = (userId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status } : u)));
  };

  const updateAgentCommission = (agentId: string, type: 'PERCENTAGE' | 'FIXED', value: number) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === agentId ? { ...u, commissionType: type, commissionValue: value } : u
      )
    );
  };

  const topupAgentWallet = (agentId: string, amount: number, utr: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === agentId ? { ...u, walletBalance: (u.walletBalance || 0) + amount } : u
      )
    );

    const newTxn: WalletTransaction = {
      id: `tx_${Date.now()}`,
      userId: agentId,
      type: 'CREDIT',
      amount,
      balanceAfter: ((currentUser?.walletBalance || 0) + amount),
      description: `Wallet Top-up: ${utr}`,
      referenceId: utr,
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
    };
    setWalletTransactions((prev) => [newTxn, ...prev]);

    dispatchNotification({
      recipientRole: 'AGENT',
      recipientId: agentId,
      title: `Wallet Recharged: ₹${amount.toLocaleString('en-IN')}`,
      message: `Your wallet top-up against Bank UTR ${utr} has been approved and credited.`,
      type: 'WALLET',
      channel: 'SMS',
    });
  };

  const topUpAgentWallet = (amount: number, note?: string) => {
    const agentId = currentUser?.id || 'usr_agent_1';
    const utr = note || `TOPUP-${Date.now().toString().slice(-6)}`;
    topupAgentWallet(agentId, amount, utr);
  };

  const settleOperatorPayment = (settlementId: string, utr: string) => {
    setSettlements((prev) =>
      prev.map((s) =>
        s.id === settlementId
          ? {
              ...s,
              status: 'PAID',
              utrNumber: utr,
              settledAt: new Date().toISOString(),
            }
          : s
      )
    );
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Notification helper
  const dispatchNotification = (notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Lookup PNR helper
  const lookupPnr = (pnr: string): Booking | null => {
    const found = bookings.find((b) => b.pnr.trim().toUpperCase() === pnr.trim().toUpperCase());
    setSearchedBookingForPnr(found || null);
    return found || null;
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        users,
        setUsers,
        customerView,
        setCustomerView,
        agentView,
        setAgentView,
        operatorView,
        setOperatorView,
        adminView,
        setAdminView,
        searchQuery,
        setSearchQuery,
        selectedTrip,
        setSelectedTrip,
        selectedSeats,
        setSelectedSeats,
        seatLockTimeRemaining,
        selectedBoardingPoint,
        setSelectedBoardingPoint,
        selectedDroppingPoint,
        setSelectedDroppingPoint,
        passengers,
        setPassengers,
        contactMobile,
        setContactMobile,
        contactEmail,
        setContactEmail,
        emergencyContact,
        setEmergencyContact,
        activeCoupon,
        applyCoupon,
        removeCoupon,
        confirmedBooking,
        setConfirmedBooking,
        trips,
        buses,
        routes,
        bookings,
        coupons,
        operators,
        setOperators,
        settlements,
        setSettlements,
        walletTransactions,
        setWalletTransactions,
        notifications,
        settings,
        handleSearch,
        lockSeat,
        unlockSeat,
        clearSeatSelection,
        createBooking,
        cancelBooking,
        addBus,
        updateBus,
        addRoute,
        addTrip,
        requestTripCancellation,
        approveBus,
        rejectBus,
        approveTripCancellation,
        updateUserStatus,
        updateAgentCommission,
        topupAgentWallet,
        topUpAgentWallet,
        settleOperatorPayment,
        updateSettings,
        dispatchNotification,
        markNotificationAsRead,
        dismissNotification,
        pnrSearchModalOpen,
        setPnrSearchModalOpen,
        searchedBookingForPnr,
        lookupPnr,
        language,
        setLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
