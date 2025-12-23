"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'ongoing' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

interface GuideStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  totalEarnings: number;
  rating: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
}

export default function GuideDashboardPage() {
  const router = useRouter();
  const [guide, setGuide] = useState<any>(null);
  const [stats, setStats] = useState<GuideStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuideData();
    fetchStats();
    fetchRecentBookings();
  }, []);

  const fetchGuideData = async () => {
    try {
      const response = await fetch('/api/guide/profile');
      if (response.ok) {
        const data = await response.json();
        setGuide(data.guide);
      }
    } catch (error) {
      console.error('Error fetching guide data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/guide/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch('/api/guide/bookings?limit=5');
      if (response.ok) {
        const data = await response.json();
        setRecentBookings(data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'reject' | 'complete') => {
    try {
      const response = await fetch(`/api/guide/bookings/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Refresh bookings
        fetchRecentBookings();
        fetchStats();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {guide?.fullName}!</h1>
            <p className="text-blue-100 mt-2">
              {guide?.status === 'approved' 
                ? 'Your profile is live and visible to travelers.'
                : 'Your profile is under review. You will be visible to travelers after approval.'}
            </p>
            {guide?.status === 'pending' && (
              <div className="mt-3 inline-flex items-center px-4 py-2 bg-yellow-500 bg-opacity-20 rounded-lg">
                <span className="text-sm">⏳ Verification in progress</span>
              </div>
            )}
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/guide/profile"
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats?.totalEarnings?.toLocaleString() || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/guide/earnings" className="text-sm text-green-600 hover:text-green-800">
              View earnings →
            </Link>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">📅</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/guide/bookings" className="text-sm text-blue-600 hover:text-blue-800">
              View all bookings →
            </Link>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingBookings || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
          <div className="mt-4">
            {stats?.pendingBookings && stats.pendingBookings > 0 ? (
              <Link href="/guide/bookings?filter=pending" className="text-sm text-yellow-600 hover:text-yellow-800">
                Review requests →
              </Link>
            ) : (
              <span className="text-sm text-gray-500">No pending requests</span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Your Rating</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.rating?.toFixed(1) || 0}/5</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-xl">⭐</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/guide/reviews" className="text-sm text-purple-600 hover:text-purple-800">
              View reviews →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/guide/availability"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center"
          >
            <div className="text-blue-600 text-2xl mb-2">⏰</div>
            <div className="font-medium text-blue-900">Set Availability</div>
          </Link>
          
          <Link
            href="/guide/profile/edit"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center"
          >
            <div className="text-green-600 text-2xl mb-2">✏️</div>
            <div className="font-medium text-green-900">Update Profile</div>
          </Link>
          
          <Link
            href="/guide/documents"
            className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg text-center"
          >
            <div className="text-yellow-600 text-2xl mb-2">📄</div>
            <div className="font-medium text-yellow-900">Upload Documents</div>
          </Link>
          
          <Link
            href="/find-guides"
            target="_blank"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center"
          >
            <div className="text-purple-600 text-2xl mb-2">👁️</div>
            <div className="font-medium text-purple-900">View Public Profile</div>
          </Link>
        </div>
      </div>

      {/* Recent Bookings & Status Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Booking Requests */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Booking Requests</h2>
              <Link href="/guide/bookings" className="text-sm text-blue-600 hover:text-blue-800">
                View all →
              </Link>
            </div>
            <div className="p-6">
              {recentBookings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-4">📅</div>
                  <p className="text-gray-500">No booking requests yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {guide?.status === 'approved' 
                      ? 'Your profile is live. You will receive booking requests soon.'
                      : 'Complete your profile verification to receive booking requests.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{booking.user.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{booking.user.email}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600">
                              📅 {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                            </span>
                            <span className="text-sm text-gray-600">
                              ⏱️ {booking.totalDays} {booking.totalDays === 1 ? 'day' : 'days'}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              ₹{booking.totalAmount}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-500 mt-2">📝 {booking.notes}</p>
                          )}
                        </div>
                        
                        {booking.status === 'pending' && (
                          <div className="mt-4 md:mt-0 flex space-x-2">
                            <button
                              onClick={() => handleBookingAction(booking.id, 'accept')}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleBookingAction(booking.id, 'reject')}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        
                        {booking.status === 'confirmed' && (
                          <div className="mt-4 md:mt-0">
                            <button
                              onClick={() => handleBookingAction(booking.id, 'complete')}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                            >
                              Mark Complete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status & Profile Completion */}
        <div>
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Profile Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm font-medium text-gray-700">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-3 ${guide?.isVerified ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">Profile Verification</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-3 ${guide?.aadharVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">Aadhaar Verification</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-3 ${guide?.panVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm">PAN Verification</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-3 ${guide?.description ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm">Profile Description</span>
                  </div>
                  <div className="flex items-center">
                    <div className={`h-2 w-2 rounded-full mr-3 ${guide?.languages?.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="text-sm">Languages Added</span>
                  </div>
                </div>
                
                <Link
                  href="/guide/profile/edit"
                  className="block w-full text-center py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm"
                >
                  Complete Your Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Tips</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-blue-500 mr-3">💡</div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Increase Bookings</h4>
                    <p className="text-xs text-gray-600 mt-1">Complete your profile and add photos to get more visibility.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-green-500 mr-3">⭐</div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Get Better Reviews</h4>
                    <p className="text-xs text-gray-600 mt-1">Respond quickly to booking requests and provide excellent service.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 text-yellow-500 mr-3">💰</div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Maximize Earnings</h4>
                    <p className="text-xs text-gray-600 mt-1">Set competitive pricing and update your availability regularly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}