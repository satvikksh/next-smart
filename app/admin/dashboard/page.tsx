"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalGuides: number;
  pendingVerification: number;
  activeGuides: number;
  blockedGuides: number;
  totalUsers: number;
  activeUsers: number;
  todayRevenue: number;
  totalRevenue: number;
  totalBookings: number;
  pendingBookings: number;
}

interface RecentActivity {
  id: string;
  type: 'guide_registration' | 'guide_approval' | 'guide_block' | 'user_registration' | 'booking';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    fetchDashboardData();
    fetchRecentActivities();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/admin/dashboard?range=${timeRange}`);
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities');
      const data = await response.json();
      setRecentActivities(data.activities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'guide_registration': return '👨‍💼';
      case 'guide_approval': return '✅';
      case 'guide_block': return '🚫';
      case 'user_registration': return '👤';
      case 'booking': return '📅';
      default: return '📝';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'guide_approval': return 'text-green-600 bg-green-50';
      case 'guide_block': return 'text-red-600 bg-red-50';
      case 'guide_registration': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Guides Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Guides</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalGuides || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-blue-600 text-xl">👨‍💼</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/guides" className="text-sm text-blue-600 hover:text-blue-800">
              View all guides →
            </Link>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.pendingVerification || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
          </div>
          <div className="mt-4">
            {stats?.pendingVerification && stats.pendingVerification > 0 ? (
              <Link href="/admin/guides?filter=pending" className="text-sm text-yellow-600 hover:text-yellow-800">
                Review pending guides →
              </Link>
            ) : (
              <span className="text-sm text-gray-500">All guides verified</span>
            )}
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-green-600 text-xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/users" className="text-sm text-green-600 hover:text-green-800">
              Manage users →
            </Link>
          </div>
        </div>

        {/* Today's Revenue */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats?.todayRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-purple-600 text-xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/admin/payments" className="text-sm text-purple-600 hover:text-purple-800">
              View payments →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/guides?filter=pending"
            className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center"
          >
            <div className="text-blue-600 text-2xl mb-2">✅</div>
            <div className="font-medium text-blue-900">Approve Guides</div>
          </Link>
          
          <Link
            href="/admin/guides/create"
            className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center"
          >
            <div className="text-green-600 text-2xl mb-2">➕</div>
            <div className="font-medium text-green-900">Add New Guide</div>
          </Link>
          
          <Link
            href="/admin/users/create"
            className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center"
          >
            <div className="text-purple-600 text-2xl mb-2">👤</div>
            <div className="font-medium text-purple-900">Add User</div>
          </Link>
          
          <Link
            href="/admin/reports"
            className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg text-center"
          >
            <div className="text-yellow-600 text-2xl mb-2">📊</div>
            <div className="font-medium text-yellow-900">Generate Report</div>
          </Link>
        </div>
      </div>

      {/* Recent Activities & Stats Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-6">
              {recentActivities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activities</p>
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                        <span className="text-lg">{getActivityIcon(activity.type)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-900">{activity.title}</h4>
                          <span className="text-sm text-gray-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">By: {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 text-center">
                <Link href="/admin/logs" className="text-sm text-blue-600 hover:text-blue-800">
                  View all activities →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">System Status</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Database</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">API Services</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email Service</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Running
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Payment Gateway</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    Active
                  </span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Quick Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Sessions</span>
                    <span className="font-medium">142</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Response Time</span>
                    <span className="font-medium">128ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Error Rate</span>
                    <span className="font-medium">0.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Server Load</span>
                    <span className="font-medium">34%</span>
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