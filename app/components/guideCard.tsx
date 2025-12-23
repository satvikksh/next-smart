// components/GuideCard.tsx - Updated with Auth Check
import { MapPin, Star, Users, Globe, CheckCircle, Lock } from 'lucide-react';
import { Guide } from '../types/guide';
import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface GuideCardProps {
  guide: Guide;
  onBook: () => void;
}

export default function GuideCard({ guide, onBook }: GuideCardProps) {
  const { isLoggedIn} = useUser();
  const router = useRouter();
  const [showLoginTooltip, setShowLoginTooltip] = useState(false);

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      // Show login tooltip
      setShowLoginTooltip(true);
      setTimeout(() => setShowLoginTooltip(false), 3000);
      
      // Store guide info for after login
      const pendingAction = {
        action: 'book_guide',
        guideId: guide.id,
        guideName: guide.name,
      };
      localStorage.setItem('pending_action', JSON.stringify(pendingAction));
      
      // Redirect to login with return URL
      const returnUrl = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}&action=book_guide&guideId=${guide.id}`);
      return;
    }
    
    onBook();
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Login Tooltip */}
      {showLoginTooltip && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium animate-pulse">
            Please login to book
          </div>
        </div>
      )}

      {/* Guide Image */}
      <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500">
        <img
          src={guide.image}
          alt={guide.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="font-semibold">{guide.rating}</span>
        </div>
      </div>

      {/* Guide Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{guide.name}</h3>
            <p className="text-gray-600">{guide.experience} years experience</p>
          </div>
          <span className="text-2xl font-bold text-blue-600">
            ${guide.pricePerDay}<span className="text-sm text-gray-500">/day</span>
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4" />
          <span>{guide.location}, {guide.state}, {guide.country}</span>
        </div>

        {/* Specialty */}
        <div className="flex flex-wrap gap-2 mb-4">
          {guide.specialty.map((spec, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {guide.languages.join(', ')}
          </span>
        </div>

        {/* Verified Badge */}
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-600">Verified Guide</span>
          <span className="ml-auto flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            {guide.toursCompleted} tours completed
          </span>
        </div>

        {/* Book Button with Auth Check */}
        <button
          onClick={handleBookClick}
          className={`w-full py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
            isLoggedIn
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {!isLoggedIn && <Lock className="w-4 h-4" />}
          {isLoggedIn ? 'Book This Guide' : 'Login to Book'}
        </button>
        
        {/* Login Prompt */}
        {!isLoggedIn && (
          <p className="text-center text-xs text-gray-500 mt-3">
            Login required to book guides
          </p>
        )}
      </div>
    </div>
  );
}