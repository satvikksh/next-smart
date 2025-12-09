'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Search, MapPin, Calendar, Filter, Bell, Star, Clock, Globe, Users, ChevronDown, Sparkles, Lock
} from 'lucide-react';
import GuideCard from '../components/guideCard';
import BookingModal from '../components/BookingModal';
import NotificationToast from '../components/NotificationToast';
import { Guide, SearchFilters as FilterType } from '../types/guide';
import { mockGuides } from '../data/mockGuides';
import { useUser } from '../context/UserContext';
import { useRouter } from 'next/navigation';

export default function FindGuidePage() {
  const { isLoggedIn } = useUser();
  const router = useRouter();

  // page data
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');
  const [showNotification, setShowNotification] = useState(false);
  const [guides, setGuides] = useState<Guide[]>(mockGuides);

  // filters state (matches your type)
  const [filters, setFilters] = useState<FilterType>({
    location: '',
    state: '',
    country: '',
    rating: 0,
    priceRange: [0, 10000],
    languages: [],
    availableFrom: '',
    availableTo: '',
    specialty: []
  });

  const [activeTab, setActiveTab] = useState('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Booking flow
  const handleBookGuide = (guide: Guide) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      const pendingAction = { action: 'book_guide', guideId: guide.id, guideName: guide.name };
      localStorage.setItem('pending_action', JSON.stringify(pendingAction));
      const returnUrl = window.location.pathname;
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}&action=book_guide&guideId=${guide.id}`);
      return;
    }
    setSelectedGuide(guide);
    setIsBookingModalOpen(true);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const bookGuideId = urlParams.get('book');
    if (bookGuideId && isLoggedIn) {
      const guide = mockGuides.find(g => g.id === bookGuideId);
      if (guide) {
        setSelectedGuide(guide);
        setIsBookingModalOpen(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [isLoggedIn]);

  // Confirm booking handler (simple stub: generate id, close modal, show toast)
  function handleConfirmBooking(bookingData: any): void {
    // bookingData could include date, guests etc. We'll just simulate booking id and show toast
    const id = `BK-${Date.now().toString(36).slice(-8).toUpperCase()}`;
    setBookingId(id);
    setIsBookingModalOpen(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 5000);
  }

  // Filter application logic (pure)
  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return guides.filter((g) => {
      // search by name, state, country, specialty, languages
      if (q) {
        const inName = g.name.toLowerCase().includes(q);
        const inLocation = `${g.state || ''} ${g.country || ''}`.toLowerCase().includes(q);
        const inSpecialty = g.specialty?.some(s => s.toLowerCase().includes(q));
        const inLanguages = g.languages?.some(l => l.toLowerCase().includes(q));
        if (!(inName || inLocation || inSpecialty || inLanguages)) return false;
      }

      // location filter
      if (filters.location) {
        const loc = filters.location.toLowerCase();
        const matches = `${g.state || ''} ${g.country || ''}`.toLowerCase().includes(loc);
        if (!matches) return false;
      }

      if (filters.state) {
        if (!(g.state && g.state.toLowerCase().includes(filters.state.toLowerCase()))) return false;
      }

      if (filters.country) {
        if (!(g.country && g.country.toLowerCase().includes(filters.country.toLowerCase()))) return false;
      }

      // rating
      if (filters.rating && g.rating < filters.rating) return false;

      // price range (assumes guide.pricePerDay is a number)
      if (filters.priceRange && filters.priceRange.length === 2) {
        const [minP, maxP] = filters.priceRange;
        if (g.pricePerDay < minP || g.pricePerDay > maxP) return false;
      }

      // languages (all selected languages must be in guide.languages)
      if (filters.languages && filters.languages.length) {
        const langMatch = filters.languages.every(l => g.languages?.map(x => x.toLowerCase()).includes(l.toLowerCase()));
        if (!langMatch) return false;
      }

      // specialty (any selected specialty should be present)
      if (filters.specialty && filters.specialty.length) {
        const specMatch = filters.specialty.every(s => g.specialty?.map(x => x.toLowerCase()).includes(s.toLowerCase()));
        if (!specMatch) return false;
      }

      // availability filters (optional - basic check if guide has availableFrom/to strings)
    if (filters.availableFrom) {
  if (g.availableFrom && new Date(g.availableFrom) < new Date(filters.availableFrom)) {
    return false;
  }
}
if (filters.availableTo) {
  if (g.availableTo && new Date(g.availableTo) > new Date(filters.availableTo)) {
    return false;
  }
}
      return true;
    });
  }, [guides, searchQuery, filters]);

  // Stats for top area (derived)
  const stats = useMemo(() => {
    const verifiedCount = guides.filter(g => g.verified).length;
    const uniqueStates = new Set(guides.map(g => g.state).filter(Boolean)).size;
    const avgRating = (guides.reduce((s, g) => s + (g.rating || 0), 0) / Math.max(1, guides.length));
    const currency = '₹';
    return { verifiedCount, uniqueStates, avgRating: avgRating.toFixed(1), currency };
  }, [guides]);

  // Utility: toggle filter item in array
  const toggleArrayValue = (key: 'languages' | 'specialty', value: string) => {
    setFilters(prev => {
      const arr = prev[key] || [];
      const exists = arr.includes(value);
      const next = exists ? arr.filter((x) => x !== value) : [...arr, value];
      return ({ ...prev, [key]: next });
    });
  };

  // Example languages & specialties to display on sidebar — you can adjust to your data
  const allLanguages = Array.from(new Set(guides.flatMap(g => g.languages || []))).slice(0, 10);
  const allSpecialties = Array.from(new Set(guides.flatMap(g => g.specialty || []))).slice(0, 12);

  return (
    <div className="min-h-screen bg-[#071025] text-slate-100">
      {/* HERO / TOP BAR */}
      <header className="container mx-auto px-4 py-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#081226]/60 to-[#061423]/40 p-6 border border-white/6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs bg-emerald-900/40 text-emerald-300">India-first smart travel guide platform</span>
              <h1 className="mt-4 text-3xl lg:text-4xl font-extrabold leading-tight">Find Trusted Guides Across India</h1>
              <p className="mt-2 text-slate-300 max-w-2xl">
                Search verified local guides by city, state, or region. Book your guide, get a unique booking ID, and explore safely with S.M.A.R.T.
              </p>

              {/* SEARCH BAR */}
              <div className="mt-6 flex gap-3">
                <div className="flex items-center flex-1 bg-[#0b1626] border border-white/6 rounded-xl px-3 py-2">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by city, state or guide name (e.g. Bhopal, Jaipur, Goa)..."
                    className="bg-transparent flex-1 ml-3 outline-none text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                <button
                  onClick={() => setIsFilterExpanded(prev => !prev)}
                  className="flex items-center gap-2 bg-[#0f1a2b] border border-white/6 px-4 py-2 rounded-xl hover:brightness-110"
                >
                  <Filter className="w-4 h-4"/>
                  Filters
                </button>

                <button
                  onClick={() => {
                    // example: export currently filtered guides (CSV stub)
                    const csv = filteredGuides.map(g => [g.name, g.state, g.pricePerDay].join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'guides.csv';
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-2 bg-[#0f1a2b] border border-white/6 px-4 py-2 rounded-xl hover:brightness-110"
                >
                  <Bell className="w-4 h-4"/>
                  Export
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0f1a2b] to-transparent border border-white/6 text-center">
                <div className="text-sm text-slate-300">Verified guides</div>
                <div className="mt-1 text-2xl font-bold">{stats.verifiedCount}+</div>
                <div className="text-xs text-slate-400">across India</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0f1a2b] to-transparent border border-white/6 text-center">
                <div className="text-sm text-slate-300">States covered</div>
                <div className="mt-1 text-2xl font-bold">{stats.uniqueStates}</div>
                <div className="text-xs text-slate-400">&amp; UTs</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0f1a2b] to-transparent border border-white/6 text-center">
                <div className="text-sm text-slate-300">Average rating</div>
                <div className="mt-1 text-2xl font-bold">{stats.avgRating}</div>
                <div className="text-xs text-slate-400">based on guide reviews</div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-[#0f1a2b] to-transparent border border-white/6 text-center">
                <div className="text-sm text-slate-300">Currency</div>
                <div className="mt-1 text-2xl font-bold">₹</div>
                <div className="text-xs text-slate-400">Indian Rupees</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* FILTER SIDEBAR */}
          <aside className={`lg:col-span-3 ${isFilterExpanded ? 'block' : 'hidden lg:block'}`}>
            <div className="sticky top-24 p-4 rounded-2xl bg-[#081223] border border-white/6 shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button onClick={() => {
                  setFilters({
                    location: '',
                    state: '',
                    country: '',
                    rating: 0,
                    priceRange: [0, 10000],
                    languages: [],
                    availableFrom: '',
                    availableTo: '',
                    specialty: []
                  });
                }} className="text-slate-400 text-sm hover:underline">Clear</button>
              </div>

              <div className="space-y-4">
                {/* Location */}
                <div>
                  <label className="text-sm text-slate-300">Location</label>
                  <input
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City or area"
                    className="mt-2 w-full rounded-lg bg-[#071223] border border-white/6 px-3 py-2 outline-none text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="text-sm text-slate-300">State</label>
                  <input
                    value={filters.state}
                    onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State"
                    className="mt-2 w-full rounded-lg bg-[#071223] border border-white/6 px-3 py-2 outline-none text-slate-100 placeholder:text-slate-500"
                  />
                </div>

                {/* Price range (simple) */}
                <div>
                  <label className="text-sm text-slate-300">Price Range (₹)</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [Number(e.target.value || 0), prev.priceRange[1]] }))}
                      className="w-1/2 rounded-lg bg-[#071223] border border-white/6 px-3 py-2 outline-none text-slate-100"
                    />
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value || 10000)] }))}
                      className="w-1/2 rounded-lg bg-[#071223] border border-white/6 px-3 py-2 outline-none text-slate-100"
                    />
                  </div>
                </div>

                {/* Rating slider (basic) */}
                <div>
                  <label className="text-sm text-slate-300">Minimum Rating</label>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={0}
                      max={5}
                      step={0.5}
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="w-10 text-right text-sm text-slate-300">{filters.rating}</div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <label className="text-sm text-slate-300">Languages</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {allLanguages.length ? allLanguages.map(lang => (
                      <button
                        key={lang}
                        onClick={() => toggleArrayValue('languages', lang)}
                        className={`text-sm px-3 py-2 rounded-lg border ${filters.languages.includes(lang) ? 'bg-sky-600 text-black' : 'bg-transparent text-slate-300 border-white/6'}`}
                      >
                        {lang}
                      </button>
                    )) : <div className="text-sm text-slate-500">No languages</div>}
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <label className="text-sm text-slate-300">Specialty</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {allSpecialties.length ? allSpecialties.map(s => (
                      <button
                        key={s}
                        onClick={() => toggleArrayValue('specialty', s)}
                        className={`text-sm px-3 py-1 rounded-full border ${filters.specialty.includes(s) ? 'bg-emerald-400 text-black' : 'bg-transparent text-slate-300 border-white/6'}`}
                      >
                        {s}
                      </button>
                    )) : <div className="text-sm text-slate-500">No specialties</div>}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="text-sm text-slate-300">Available From</label>
                  <input
                    type="date"
                    value={filters.availableFrom}
                    onChange={(e) => setFilters(prev => ({ ...prev, availableFrom: e.target.value }))}
                    className="mt-2 w-full rounded-lg bg-[#071223] border border-white/6 px-3 py-2 outline-none text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-300">Available To</label>
                  <input
                    type="date"
                    value={filters.availableTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, availableTo: e.target.value }))}
                    className="mt-2 w-full rounded-lg bg-[#071223] border border-white/6 px-3 py-2 outline-none text-slate-100"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => setFilters(prev => ({ ...prev }))}
                    className="flex-1 px-4 py-2 rounded-xl bg-sky-600 text-black font-semibold"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setFilters({
                        location: '',
                        state: '',
                        country: '',
                        rating: 0,
                        priceRange: [0, 10000],
                        languages: [],
                        availableFrom: '',
                        availableTo: '',
                        specialty: []
                      });
                    }}
                    className="px-4 py-2 rounded-xl border border-white/6"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* GUIDES GRID */}
          <section className="lg:col-span-9">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Available Guides <span className="text-slate-400 text-sm">({filteredGuides.length})</span></h2>
                <div className="text-sm text-slate-400">Showing guides for your selected locations. Prices are per day in Indian Rupees (₹).</div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-slate-300">Sort by:</label>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    let sorted = [...guides];
                    if (val === 'price_asc') sorted.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
                    else if (val === 'price_desc') sorted.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
                    else if (val === 'rating') sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                    setGuides(sorted);
                  }}
                  className="rounded-lg bg-[#071223] border border-white/6 px-3 py-2 text-slate-200"
                >
                  <option value="recommended">Recommended</option>
                  <option value="rating">Top rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Grid of guide cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGuides.map(guide => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  onBook={() => handleBookGuide(guide)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#071226] rounded-2xl w-full max-w-md border border-white/6">
            <div className="p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-amber-600/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Login required</h3>
                <p className="text-slate-300 mb-6">You need to be logged in to book guides. Please login or create an account to continue.</p>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      router.push('/login');
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold"
                  >
                    Login to Continue
                  </button>
                  <button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      router.push('/register');
                    }}
                    className="w-full border border-white/6 text-slate-100 py-3 rounded-xl"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking modal + Notification */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        guide={selectedGuide}
        onConfirm={handleConfirmBooking}
      />

      <NotificationToast
        isVisible={showNotification}
        bookingId={bookingId}
        guideName={selectedGuide?.name || ''}
      />
    </div>
  );
}
