'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  Download,
  Bell,
  Star,
  Clock,
  Globe,
  Users,
} from 'lucide-react';
import GuideCard from '../components/guideCard';
import BookingModal from '../components/BookingModal';
import SearchFilters from '../components/SearchFilters';
import NotificationToast from '../components/NotificationToast';
import { Guide, SearchFilters as FilterType } from '../types/guide';
import { mockGuides } from '../data/mockGuides';
import { generateUniqueId } from '../utils/idGenerator';

export default function FindGuidePage() {
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
    // INR price range
    priceRange: [0, 10000],
    languages: [],
    availableFrom: '',
    availableTo: '',
    specialty: [],
  });

  // Handle search
  const handleSearch = () => {
    const filtered = mockGuides.filter((guide) => {
      const query = searchQuery.toLowerCase();

      const matchesQuery =
        guide.name.toLowerCase().includes(query) ||
        guide.location.toLowerCase().includes(query) ||
        guide.state.toLowerCase().includes(query) ||
        guide.country.toLowerCase().includes(query) ||
        guide.specialty.some((s) => s.toLowerCase().includes(query));

      const matchesLocation =
        !filters.location || guide.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesState =
        !filters.state || guide.state.toLowerCase() === filters.state.toLowerCase();
      const matchesCountry =
        !filters.country || guide.country.toLowerCase() === filters.country.toLowerCase();
      const matchesRating = guide.rating >= filters.rating;
      const matchesPrice =
        guide.pricePerDay >= filters.priceRange[0] &&
        guide.pricePerDay <= filters.priceRange[1];

      return (
        matchesQuery &&
        matchesLocation &&
        matchesState &&
        matchesCountry &&
        matchesRating &&
        matchesPrice
      );
    });

    setGuides(filtered);
  };

  // Handle booking
  const handleBookGuide = (guide: Guide) => {
    setSelectedGuide(guide);
    const uniqueId = generateUniqueId(); // this becomes the unique user/booking ID
    setBookingId(uniqueId);
    setIsBookingModalOpen(true);
  };

  // Confirm booking
  const handleConfirmBooking = () => {
    const booking = {
      id: bookingId,
      guideId: selectedGuide?.id,
      guideName: selectedGuide?.name,
      date: new Date().toISOString(),
      status: 'confirmed',
    };

    // Save locally (you can swap this with API later)
    if (typeof window !== 'undefined') {
      localStorage.setItem(`booking_${bookingId}`, JSON.stringify(booking));
    }

    setShowNotification(true);
    setIsBookingModalOpen(false);

    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  // Download booking ID (user ID for this trip)
  const handleDownloadId = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        `S.M.A.R.T. Guide Booking (India)\n\nBooking ID: ${bookingId}\nGuide: ${
          selectedGuide?.name
        }\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nKeep this ID safe and share it with your guide.`,
      ],
      { type: 'text/plain' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `booking-${bookingId}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header / Hero */}
      <div className="border-b border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900">
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start lg:items-center">
            {/* Left: Title + search */}
            <div className="flex-1 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-slate-900/60 px-3 py-1 text-[11px] font-medium text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                India-first smart travel guide platform
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-blue-400">
                Find Trusted Guides Across <span className="text-emerald-400">India</span>
              </h1>

              <p className="text-sm md:text-base text-slate-300 max-w-xl">
                Search verified local guides by city, state, or region. Book your guide, get a
                unique booking ID (user ID for the trip), and explore India safely with S.M.A.R.T.
              </p>

              {/* Search Bar */}
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search by city, state or guide name (e.g. Bhopal, Jaipur, Goa)..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleSearch}
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 md:px-5 py-2.5 text-sm font-semibold text-slate-950 shadow hover:bg-emerald-400 transition-transform hover:-translate-y-0.5"
                    >
                      <Search size={18} className="mr-1.5" />
                      Search Guides
                    </button>

                    <button
                      onClick={() =>
                        document
                          .getElementById('filters')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                      className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-300 transition-transform hover:-translate-y-0.5"
                    >
                      <Filter size={18} className="mr-1.5" />
                      Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Indian stats */}
            <div className="w-full lg:w-[340px] space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-400" />
                    <span className="text-lg font-bold text-slate-50">500+</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Verified guides across India</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-400" />
                    <span className="text-lg font-bold text-slate-50">28</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">States & UTs covered</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400" />
                    <span className="text-lg font-bold text-slate-50">4.8</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Average rating</p>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-300" />
                    <span className="text-lg font-bold text-slate-50">₹</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    All prices shown in Indian Rupees (₹)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div id="filters" className="lg:w-1/4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-200">
                Filter guides (India)
              </h3>
              <SearchFilters filters={filters} onFilterChange={setFilters} />
            </div>
          </div>

          {/* Guides List */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-50">
                  Available Guides{' '}
                  <span className="text-emerald-400 text-base">({guides.length})</span>
                </h2>
                <p className="text-xs md:text-sm text-slate-400">
                  Showing guides for your selected locations. Prices are per day in Indian Rupees
                  (₹).
                </p>
              </div>

              <div className="flex gap-2">
                <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs md:text-sm text-slate-100 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                </select>
              </div>
            </div>

            {/* Guides Grid */}
            {guides.length === 0 ? (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 py-12 text-center">
                <MapPin className="mx-auto mb-4 h-12 w-12 text-slate-500" />
                <h3 className="mb-2 text-lg font-semibold text-slate-100">
                  No guides found in this area
                </h3>
                <p className="text-sm text-slate-400">
                  Try changing the city/state or widening your price range.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {guides.map((guide) => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    onBook={() => handleBookGuide(guide)}
                  />
                ))}
              </div>
            )}

            {/* How it works section */}
            <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/80 p-7 md:p-8">
              <h3 className="mb-6 text-center text-xl md:text-2xl font-bold text-slate-50">
                How It Works (India)
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                    <Search className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h4 className="mb-1 text-sm font-semibold text-slate-100">
                    1. Find Your Guide
                  </h4>
                  <p className="text-xs text-slate-400">
                    Search by Indian city, state, languages, and specialties.
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                    <Calendar className="h-6 w-6 text-blue-400" />
                  </div>
                  <h4 className="mb-1 text-sm font-semibold text-slate-100">
                    2. Book & Get ID
                  </h4>
                  <p className="text-xs text-slate-400">
                    Book instantly and receive a unique booking ID (your user ID for this trip).
                  </p>
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                    <Bell className="h-6 w-6 text-amber-300" />
                  </div>
                  <h4 className="mb-1 text-sm font-semibold text-slate-100">
                    3. Guide Notification
                  </h4>
                  <p className="text-xs text-slate-400">
                    Your guide receives the same booking ID and trip details, so both stay synced.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        guide={selectedGuide}
        bookingId={bookingId}
        onConfirm={handleConfirmBooking}
        onDownload={handleDownloadId}
      />

      {/* Notification Toast */}
      <NotificationToast
        isVisible={showNotification}
        bookingId={bookingId}
        guideName={selectedGuide?.name || ''}
      />
    </div>
  );
}
