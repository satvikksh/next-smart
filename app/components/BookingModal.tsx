// components/BookingModal.tsx - Updated with Auth Check
'use client';

import { X, Calendar, User, Phone, Mail, Download, Copy, QrCode, Shield, CheckCircle, Clock, Key, AlertCircle } from 'lucide-react';
import { Guide } from '../types/guide';
import { useState, useEffect } from 'react';
// import { generateBookingId, formatBookingId } from '../utils/idGenerator';
// import QRCode from 'react-qr-code';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  guide: Guide | null;
  onConfirm: (bookingData: any) => void;
}

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  travelers: number;
  specialRequests: string;
  agreeTerms: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  guide,
  onConfirm,
}: BookingModalProps) {
  const { user, isLoggedIn, requireAuth } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    specialRequests: '',
    agreeTerms: false,
  });

  const [bookingId, setBookingId] = useState<string>('');
  const [step, setStep] = useState<'form' | 'confirmation' | 'success'>('form');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [user, isOpen]);

  // Generate booking ID when modal opens
  useEffect(() => {
    if (isOpen && step === 'form' && isLoggedIn) {
      // const id = generateBookingId();
      // setBookingId(id);
      setGeneratedAt(new Date());
    }
  }, [isOpen, step, isLoggedIn]);

  // Check authentication when modal opens
  useEffect(() => {
    if (isOpen && !isLoggedIn) {
      setShowLoginPrompt(true);
    } else {
      setShowLoginPrompt(false);
    }
  }, [isOpen, isLoggedIn]);

  if (!isOpen || !guide) return null;

  const handleLoginRedirect = () => {
    // Store guide info for after login
    const pendingAction = {
      action: 'book_guide',
      guideId: guide.id,
      guideName: guide.name,
    };
    localStorage.setItem('pending_action', JSON.stringify(pendingAction));
    localStorage.setItem('return_url', window.location.pathname);
    
    // Close modal and redirect to login
    onClose();
    router.push(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}&action=book_guide`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }
    
    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }
    
    setStep('confirmation');
  };

  const handleFinalConfirm = () => {
    if (!isLoggedIn) {
      handleLoginRedirect();
      return;
    }

    const bookingData = {
      ...formData,
      guideId: guide.id,
      guideName: guide.name,
      guideImage: guide.image,
      guideLocation: guide.location,
      bookingId,
      userId: user?.id,
      userName: user?.name,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      totalPrice: guide.pricePerDay * calculateDays() * formData.travelers,
      days: calculateDays(),
    };

    // Save to localStorage
    localStorage.setItem(`booking_${bookingId}`, JSON.stringify(bookingData));
    
    // Add to bookings list
    const bookings = JSON.parse(localStorage.getItem('user_bookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('user_bookings', JSON.stringify(bookings));

    setStep('success');
    
    // Notify parent component
    setTimeout(() => {
      onConfirm(bookingData);
    }, 3000);
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 1;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24)) || 1;
  };

  const totalPrice = guide.pricePerDay * calculateDays() * formData.travelers;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadId = () => {
    const element = document.createElement('a');
    const content = `
GuideConnect Booking Confirmation
=================================
Booking ID: ${bookingId}
Generated: ${generatedAt?.toLocaleString()}

Guide Information:
-----------------
Name: ${guide.name}
Location: ${guide.location}, ${guide.country}
Specialty: ${guide.specialty.join(', ')}
Price per day: $${guide.pricePerDay}

Traveler Information:
-------------------
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Travel Dates: ${formData.startDate} to ${formData.endDate}
Number of Travelers: ${formData.travelers}

Total Amount: $${totalPrice}

Instructions:
------------
1. Keep this Booking ID for all communications
2. Share this ID with your guide when meeting
3. Present this ID if there are any issues
4. Contact support@guideconnect.com for help

Thank you for booking with GuideConnect!
    `;
    
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `booking-${bookingId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderLoginPrompt = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-amber-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        You need to be logged in to book a guide. Please login or create an account to continue with your booking.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={handleLoginRedirect}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg hover:shadow-lg transition-shadow font-semibold"
        >
          Login to Continue Booking
        </button>
        <button
          onClick={onClose}
          className="w-full border border-gray-300 text-gray-700 py-4 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
      
      <p className="mt-6 text-gray-500 text-sm">
        Don't have an account?{' '}
        <button
          onClick={() => {
            onClose();
            router.push('/register');
          }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Sign up for free
        </button>
      </p>
    </div>
  );

  const renderFormStep = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Status Badge */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {isLoggedIn ? `Logged in as ${user?.name}` : 'Not logged in'}
            </p>
            <p className="text-sm text-gray-600">
              {isLoggedIn ? user?.email : 'Please login to book'}
            </p>
          </div>
        </div>
        {!isLoggedIn && (
          <button
            type="button"
            onClick={handleLoginRedirect}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Login
          </button>
        )}
      </div>

      {/* Rest of the form remains the same */}
      {/* Guide Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center space-x-4">
          <img
            src={guide.image}
            alt={guide.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
          />
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">{guide.name}</h3>
            <p className="text-gray-600">{guide.location}, {guide.country}</p>
            <div className="flex items-center mt-2">
              {/* <StarRating rating={guide.rating} /> */}
              <span className="ml-2 text-gray-600">{guide.rating} · {guide.toursCompleted} tours</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">${guide.pricePerDay}</div>
            <div className="text-gray-500 text-sm">per day</div>
          </div>
        </div>
      </div>

      {/* Form Fields - Only show if logged in */}
      {isLoggedIn ? (
        <>
          {/* ... rest of the form fields ... */}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">Please login to see booking form</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-4 rounded-lg font-semibold transition-shadow ${
          isLoggedIn
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
        disabled={!isLoggedIn}
      >
        {isLoggedIn ? 'Continue to Confirm' : 'Please Login First'}
      </button>
    </form>
  );

  // Rest of the component remains the same...
  // Only show confirmation/success steps if logged in
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {showLoginPrompt ? 'Login Required' : 
               step === 'form' ? 'Book Your Guide' :
               step === 'confirmation' ? 'Confirm Booking' : 'Booking Complete'}
            </h2>
            <p className="text-gray-600">
              {showLoginPrompt ? 'Authentication required' : 
               step === 'form' ? 'Complete your booking details' :
               step === 'confirmation' ? 'Review and confirm your booking' :
               'Your guide is ready for your adventure'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showLoginPrompt ? renderLoginPrompt() :
           step === 'form' ? renderFormStep() :
           step === 'confirmation' ? <div>Confirmation step</div> :
           <div>Success step</div>}
        </div>
      </div>
    </div>
  );
}

// ... rest of the component remains the same