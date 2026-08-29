export type UserRole = 'CUSTOMER' | 'AGENT' | 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN';

export type SeatStatus = 'AVAILABLE' | 'LOCKED' | 'PAYMENT_PENDING' | 'BOOKED' | 'FEMALE_RESERVED' | 'MALE_RESERVED';

export type SeatDeck = 'LOWER' | 'UPPER';

export type SeatType = 'SLEEPER' | 'SEATER' | 'SEMI_SLEEPER';

export type BusType = 'AC_SLEEPER' | 'AC_SEATER' | 'NON_AC_SLEEPER' | 'NON_AC_SEATER' | 'MULTI_AXLE_VOLVO' | 'BHARAT_BENZ';

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'REFUNDED' | 'COMPLETED';

export type PaymentMethod = 'UPI' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'NET_BANKING' | 'WALLET' | 'CASH_AGENT';

export type ApprovalStatus = 'APPROVED' | 'PENDING_APPROVAL' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  agencyName?: string;
  operatorName?: string;
  walletBalance?: number;
  commissionType?: 'PERCENTAGE' | 'FIXED';
  commissionValue?: number;
  creditLimit?: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
  avatar?: string;
  createdAt: string;
}

export interface Seat {
  id: string;
  seatNumber: string;
  deck: SeatDeck;
  row: number;
  column: number;
  type: SeatType;
  basePrice: number;
  status: SeatStatus;
  genderRestriction?: 'FEMALE' | 'MALE' | 'NONE';
  isWindow?: boolean;
  lockedAt?: number;
  lockedBy?: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon: string;
}

export interface StopPoint {
  id: string;
  name: string;
  landmark: string;
  time: string; // e.g. "21:30"
  contactNumber?: string;
}

export interface Bus {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorRating: number;
  totalReviews: number;
  busNumber: string;
  busName: string;
  busType: BusType;
  isAC: boolean;
  isSleeper: boolean;
  totalSeats: number;
  availableSeatsCount: number;
  amenities: string[];
  approvalStatus: ApprovalStatus;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  registrationCertificate?: string;
  driverName?: string;
  driverPhone?: string;
  gpsTrackingId?: string;
  lowerDeckCols: number;
  lowerDeckRows: number;
  upperDeckCols?: number;
  upperDeckRows?: number;
  seats: Seat[];
}

export interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  viaCities?: string[];
  distanceKm: number;
  estimatedDuration: string; // e.g. "6h 30m"
  boardingPoints: StopPoint[];
  droppingPoints: StopPoint[];
  restStops: { name: string; duration: string; location: string }[];
  isActive: boolean;
}

export interface Trip {
  id: string;
  busId: string;
  operatorId: string;
  routeId: string;
  bus: Bus;
  route: Route;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  basePrice: number;
  sleeperPrice?: number;
  seaterPrice?: number;
  dynamicSurgeMultiplier: number;
  seats: Seat[];
  isCancelled: boolean;
  cancellationReason?: string;
  cancellationApprovalStatus?: ApprovalStatus;
}

export interface Passenger {
  id: string;
  seatNumber: string;
  fullName: string;
  age: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  idType?: 'AADHAAR' | 'PAN' | 'DRIVING_LICENSE' | 'VOTER_ID' | 'PASSPORT';
  idNumber?: string;
  price: number;
}

export interface Booking {
  id: string;
  pnr: string;
  bookingChannel: 'ONLINE' | 'AGENT';
  customerId?: string;
  agentId?: string;
  agentName?: string;
  operatorId: string;
  tripId: string;
  trip: Trip;
  passengers: Passenger[];
  selectedSeats: string[];
  contactMobile: string;
  contactEmail: string;
  emergencyContact?: string;
  boardingPoint: StopPoint;
  droppingPoint: StopPoint;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  
  // Financial Breakup
  baseFare: number;
  gstAmount: number;
  convenienceFee: number;
  discountAmount: number;
  insuranceAmount: number;
  totalAmount: number;
  agentCommission?: number;
  netPayableByAgent?: number;
  
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentTransactionId: string;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  bookingStatus: BookingStatus;
  createdAt: string;
  
  // Cancellation & Refund
  cancellationReason?: string;
  cancelledAt?: string;
  refundAmount?: number;
  refundStatus?: 'NONE' | 'REQUESTED' | 'PROCESSING' | 'REFUNDED';
  refundTransactionId?: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minBookingAmount: number;
  expiresAt: string;
  applicableRoles: ('CUSTOMER' | 'AGENT')[];
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  balanceAfter: number;
  description: string;
  referenceId?: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export interface Operator {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  fleetSize: number;
  rating: number;
  commissionPercentage: number;
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface OperatorSettlement {
  id: string;
  operatorId: string;
  operatorName: string;
  period: string; // e.g. "Aug 15 - Aug 22, 2026"
  totalBookings: number;
  grossAmount: number;
  commissionDeducted: number; // M Yatri platform fee (e.g. 10%)
  tdsDeducted: number;
  netPayable: number;
  status: 'PAID' | 'PENDING';
  utrNumber?: string;
  settledAt?: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: UserRole;
  recipientId?: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'CANCELLATION' | 'WALLET' | 'APPROVAL' | 'PAYMENT' | 'ALERT';
  channel: 'SMS' | 'WHATSAPP' | 'EMAIL' | 'IN_APP';
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface SystemSettings {
  companyName: string;
  brandTagline: string;
  supportPhone: string;
  supportEmail: string;
  gstin: string;
  companyAddress: string;
  convenienceFeePercentage: number;
  convenienceFee?: number;
  gstPercentage: number;
  defaultAgentCommissionPercent: number;
  defaultOperatorCommissionPercent: number;
  seatLockDurationMinutes: number;
  cancellationPolicy: {
    moreThan24HoursRefundPercent: number;
    between12And24HoursRefundPercent: number;
    between2And12HoursRefundPercent: number;
    lessThan2HoursRefundPercent: number;
  };
  smsGatewayEnabled: boolean;
  whatsappGatewayEnabled: boolean;
  emailGatewayEnabled: boolean;
  paymentGateways: {
    razorpay: boolean;
    phonepe: boolean;
    paytm: boolean;
  };
}
