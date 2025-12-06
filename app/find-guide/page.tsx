'use client';

import { useState, useEffect } from 'react';
import {
 Search, MapPin, Calendar, Filter, Download, Bell, Star, Clock, Globe, Users, ChevronDown, Sparkles, Target, Award, Shield, Heart, TrendingUp, Zap, Lock
} from 'lucide-react';
import GuideCard from '../components/guideCard';
import BookingModal from '../components/BookingModal';
import SearchFilters from '../components/SearchFilters';
import NotificationToast from '../components/NotificationToast';
import { Guide, SearchFilters as FilterType } from '../types/guide';
import { mockGuides } from '../data/mockGuides';
import { generateUniqueId } from '../utils/idGenerator';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

export default function FindGuidePage() {
  const { isLoggedIn } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [guides, setGuides] = useState<Guide[]>(mockGuides);
  const [filters, setFilters] = useState<FilterType>({
    location: '',
    state: '',
    country: '',
    rating: 0,
    priceRange: [0, 1000],
    languages: [],
    availableFrom: '',
    availableTo: '',
    specialty: []
  });
  const [activeTab, setActiveTab] = useState('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // ... rest of your existing state and functions ...

  const handleBookGuide = (guide: Guide) => {
    if (!isLoggedIn) {
      // Show login prompt
      setShowLoginPrompt(true);
      
      // Store guide info for after login
      const pendingAction = {
        action: 'book_guide',
        guideId: guide.id,
        guideName: guide.name,
      };
      localStorage.setItem('pending_action', JSON.stringify(pendingAction));
      
      // Redirect to login
      const returnUrl = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}&action=book_guide&guideId=${guide.id}`);
      return;
    }
    
    setSelectedGuide(guide);
    setIsBookingModalOpen(true);
  };

  // Check URL for booking action after login
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookGuideId = urlParams.get('book');
    
    if (bookGuideId && isLoggedIn) {
      const guide = mockGuides.find(g => g.id === bookGuideId);
      if (guide) {
        setSelectedGuide(guide);
        setIsBookingModalOpen(true);
        
        // Clear the query parameter
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [isLoggedIn]);

  function handleConfirmBooking(bookingData: any): void {
    throw new Error('Function not implemented.');
  }

  // ... rest of your existing code ...

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-blue-50/20 to-white">
      {/* Auth Status Banner */}
      {!isLoggedIn && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-3">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Login required to book guides. 
                <button 
                  onClick={() => router.push('/login')}
                  className="ml-2 underline hover:no-underline"
                >
                  Click here to login
                </button>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ... rest of your existing JSX ... */}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="w-10 h-10 text-amber-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h3>
                <p className="text-gray-600 mb-8">
                  You need to be logged in to book guides. Please login or create an account to continue.
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      router.push('/login');
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:shadow-lg transition-shadow font-semibold"
                  >
                    Login to Continue
                  </button>
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      router.push('/register');
                    }}
                    className="w-full border-2 border-blue-600 text-blue-600 py-4 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
                  >
                    Create Account
                  </button>
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="w-full border border-gray-300 text-gray-700 py-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Browse Guides First
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ... rest of your existing JSX ... */}

      {/* Update GuideCard usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <GuideCard
            key={guide.id}
            guide={guide}
            onBook={() => handleBookGuide(guide)}
          />
        ))}
      </div>

      {/* Update BookingModal usage */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        guide={selectedGuide}
        onConfirm={handleConfirmBooking}
      />

      {/* Update NotificationToast usage */}
      <NotificationToast
        isVisible={showNotification}
        bookingId={bookingId}
        guideName={selectedGuide?.name || ''}
      />
    </div>
  );
}