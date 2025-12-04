// components/SearchFilters.tsx
'use client';

import { Filter, X } from 'lucide-react';
import { SearchFilters as FilterType } from '../types/guide';

interface SearchFiltersProps {
  filters: FilterType;
  onFilterChange: (filters: FilterType) => void;
}

const countries = ['USA', 'India', 'France', 'Italy', 'Japan', 'Thailand', 'Spain', 'Australia'];
const states = ['California', 'New York', 'Texas', 'Florida', 'Rajasthan', 'Goa', 'Kerala'];
const languages = ['English', 'Hindi', 'Spanish', 'French', 'Japanese', 'Italian', 'German'];
const specialties = ['Historical', 'Adventure', 'Food', 'Cultural', 'Wildlife', 'Photography', 'Hiking'];

export default function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
  const updateFilter = (key: keyof FilterType, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
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
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Filter size={20} />
          Filters
        </h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <X size={16} />
          Clear all
        </button>
      </div>

      {/* Location Filters */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City or area"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={filters.location}
            onChange={(e) => updateFilter('location', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={filters.state}
            onChange={(e) => updateFilter('state', e.target.value)}
          >
            <option value="">All States</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            value={filters.country}
            onChange={(e) => updateFilter('country', e.target.value)}
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Rating: {filters.rating}+
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            className="w-full"
            value={filters.rating}
            onChange={(e) => updateFilter('rating', parseFloat(e.target.value))}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={filters.priceRange[0]}
              onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
            />
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={filters.priceRange[1]}
              onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
            />
          </div>
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Languages
          </label>
          <div className="space-y-2">
            {languages.map(lang => (
              <label key={lang} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(lang)}
                  onChange={(e) => {
                    const newLangs = e.target.checked
                      ? [...filters.languages, lang]
                      : filters.languages.filter(l => l !== lang);
                    updateFilter('languages', newLangs);
                  }}
                  className="rounded"
                />
                <span className="text-sm">{lang}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Specialty */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Specialty
          </label>
          <div className="flex flex-wrap gap-2">
            {specialties.map(spec => (
              <button
                key={spec}
                type="button"
                onClick={() => {
                  const newSpec = filters.specialty.includes(spec)
                    ? filters.specialty.filter(s => s !== spec)
                    : [...filters.specialty, spec];
                  updateFilter('specialty', newSpec);
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.specialty.includes(spec)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}