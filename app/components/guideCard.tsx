// components/GuideCard.tsx
import { MapPin, Star, Users, Globe, CheckCircle } from 'lucide-react';
import { Guide } from '../types/guide';

interface GuideCardProps {
  guide: Guide;
  onBook: () => void;
}

export default function GuideCard({ guide, onBook }: GuideCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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

        {/* Book Button */}
        <button
          onClick={onBook}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Book This Guide
        </button>
      </div>
    </div>
  );
}