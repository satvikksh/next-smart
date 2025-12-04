// types/guide.ts

// Guide Interface
export interface Guide {
  id: string;
  name: string;
  image: string;
  location: string;
  state: string;
  country: string;
  rating: number;
  pricePerDay: number;
  experience: number; // years of experience
  specialty: string[];
  languages: string[];
  toursCompleted: number;
  availability: {
    from: string; // ISO date string
    to: string;   // ISO date string
  };
  description: string;
  verified: boolean;
  contactInfo?: {
    email: string;
    phone: string;
    whatsapp?: string;
  };
  certifications?: string[];
  vehicleAvailable?: boolean;
  maxGroupSize?: number;
  responseTime?: string; // e.g., "within 1 hour"
  badges?: string[]; // e.g., ["Top Rated", "Fast Response", "Super Host"]
}

// Search Filters Interface
export interface SearchFilters {
  location: string;
  state: string;
  country: string;
  rating: number;
  priceRange: [number, number];
  languages: string[];
  availableFrom: string;
  availableTo: string;
  specialty: string[];
  vehicleRequired?: boolean;
  certificationRequired?: boolean;
  groupSize?: number;
  instantBooking?: boolean;
}

// Booking Interface
export interface Booking {
  id: string;
  guideId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string; // ISO date string
  travelDates: {
    start: string; // ISO date string
    end: string;   // ISO date string
  };
  numberOfTravelers: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'partially_refunded';
  specialRequests?: string;
  meetingPoint?: string;
  bookingType?: 'full_day' | 'half_day' | 'custom_hours';
  hoursBooked?: number;
  guideConfirmation?: {
    confirmed: boolean;
    confirmedAt?: string;
    message?: string;
  };
}

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  profileImage?: string;
  bookings: string[]; // array of booking IDs
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  createdAt: string;
  verified: boolean;
}

// Review Interface
export interface Review {
  id: string;
  guideId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  response?: {
    guideName: string;
    comment: string;
    date: string;
  };
  tourType?: string;
  travelerType?: 'solo' | 'couple' | 'family' | 'friends' | 'business';
}

// Notification Interface
export interface Notification {
  id: string;
  userId: string;
  type: 'booking_confirmation' | 'guide_response' | 'reminder' | 'promotion' | 'system';
  title: string;
  message: string;
  data?: {
    bookingId?: string;
    guideId?: string;
    guideName?: string;
  };
  read: boolean;
  createdAt: string;
  expiresAt?: string;
}

// Location Interface
export interface Location {
  id: string;
  name: string;
  type: 'city' | 'state' | 'country' | 'landmark';
  parentId?: string; // for hierarchical structure
  coordinates?: {
    lat: number;
    lng: number;
  };
  popularGuides: number;
  averagePrice: number;
  image?: string;
  description?: string;
}

// Certification Interface
export interface Certification {
  id: string;
  name: string;
  issuingAuthority: string;
  description: string;
  validityPeriod?: number; // in months
  icon?: string;
}

// Specialty Interface
export interface Specialty {
  id: string;
  name: string;
  icon: string;
  description: string;
  popularIn: string[]; // array of country codes or location IDs
}

// Language Interface
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
}

// Pricing Tier Interface
export interface PricingTier {
  id: string;
  name: string;
  duration: number; // in hours
  price: number;
  description: string;
  includes: string[];
  maxGroupSize: number;
}

// Guide Availability Interface
export interface GuideAvailability {
  guideId: string;
  days: {
    [key: string]: { // key is day of week: 'monday', 'tuesday', etc.
      available: boolean;
      slots: {
        start: string; // "09:00"
        end: string;   // "17:00"
      }[];
    };
  };
  blockedDates: string[]; // array of ISO date strings
  customAvailability?: {
    date: string;
    slots: {
      start: string;
      end: string;
    }[];
  }[];
}

// Emergency Contact Interface
export interface EmergencyContact {
  guideId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Payment Interface
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'paypal' | 'bank_transfer' | 'upi' | 'cash';
  transactionId?: string;
  paymentDate: string;
  refundAmount?: number;
  refundDate?: string;
}

// Commission Interface (for platform)
export interface Commission {
  bookingId: string;
  guideId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: string;
}

// Guide Statistics Interface
export interface GuideStatistics {
  guideId: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  responseRate: number; // percentage
  responseTime: number; // in minutes
  cancellationRate: number; // percentage
  repeatCustomers: number;
  countriesServed: string[];
  languagesUsed: string[];
  peakSeasons: string[];
}

// Enums
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded'
}

export enum GuideStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_VACATION = 'on_vacation',
  SUSPENDED = 'suspended'
}

export enum UserRole {
  TRAVELER = 'traveler',
  GUIDE = 'guide',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

// Response Types for API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search Results Type
export interface SearchResults {
  guides: Guide[];
  total: number;
  filters: {
    minPrice: number;
    maxPrice: number;
    availableCountries: string[];
    availableStates: string[];
    availableLanguages: string[];
    availableSpecialties: string[];
  };
}

// Dashboard Stats Type
export interface DashboardStats {
  totalGuides: number;
  totalBookings: number;
  totalRevenue: number;
  activeUsers: number;
  popularDestinations: {
    name: string;
    bookings: number;
  }[];
  recentBookings: Booking[];
}

// Type Guards
export function isGuide(obj: any): obj is Guide {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.rating === 'number'
  );
}

export function isBooking(obj: any): obj is Booking {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.guideId === 'string' &&
    typeof obj.userId === 'string' &&
    obj.travelDates &&
    typeof obj.travelDates.start === 'string'
  );
}

// Helper Functions
export function calculateTotalPrice(
  pricePerDay: number,
  startDate: string,
  endDate: string,
  travelers: number = 1
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return pricePerDay * days * travelers;
}

export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
}

export function getGuideLevel(experience: number): string {
  if (experience < 2) return 'Beginner';
  if (experience < 5) return 'Intermediate';
  if (experience < 10) return 'Expert';
  return 'Master';
}

// Default Values
export const DEFAULT_FILTERS: SearchFilters = {
  location: '',
  state: '',
  country: '',
  rating: 0,
  priceRange: [0, 1000],
  languages: [],
  availableFrom: '',
  availableTo: '',
  specialty: [],
  vehicleRequired: false,
  certificationRequired: false,
  groupSize: 1,
  instantBooking: false
};

export const GUIDE_SPECIALTIES = [
  'Historical',
  'Adventure',
  'Food',
  'Cultural',
  'Wildlife',
  'Photography',
  'Hiking',
  'Art',
  'Architecture',
  'Religious',
  'Shopping',
  'Nightlife',
  'Family',
  'Luxury',
  'Budget',
  'Local Experience',
  'Off-the-beaten-path',
  'City Tours',
  'Nature',
  'Beach'
] as const;

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' }
] as const;

// Type for Guide Search Query Parameters
export interface GuideSearchParams {
  location?: string;
  state?: string;
  country?: string;
  minRating?: number;
  maxPrice?: number;
  minPrice?: number;
  languages?: string;
  specialty?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'rating' | 'price_asc' | 'price_desc' | 'experience' | 'name';
  page?: number;
  limit?: number;
}