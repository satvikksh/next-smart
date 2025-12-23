"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Guide {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  experience: string;
  languages: string[];
  specialties: string[];
  chargePerDay: number;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  isActive: boolean;
  isVerified: boolean;
  aadharVerified: boolean;
  panVerified: boolean;
  totalBookings: number;
  rating: number;
  createdAt: string;
  documents: {
    aadharNumber: string;
    panNumber: string;
  };
}

export default function GuideManagementPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [guides, searchTerm, statusFilter]);

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/admin/guides');
      const data = await response.json();
      setGuides(data.guides);
      setFilteredGuides(data.guides);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGuides = () => {
    let filtered = [...guides];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(guide =>
        guide.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.phone.includes(searchTerm) ||
        guide.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.documents.aadharNumber.includes(searchTerm) ||
        guide.documents.panNumber.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(guide => guide.status === statusFilter);
    }

    setFilteredGuides(filtered);
  };

  const handleStatusChange = async (guideId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/guides/${guideId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setGuides(prev =>
          prev.map(guide =>
            guide.id === guideId
              ? { ...guide, status: status as any, isActive: status === 'approved' }
              : guide
          )
        );
      }
    } catch (error) {
      console.error('Error updating guide status:', error);
    }
  };

  const handleVerificationToggle = async (guideId: string, document: 'aadhar' | 'pan') => {
    try {
      const response = await fetch(`/api/admin/guides/${guideId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ document }),
      });

      if (response.ok) {
        setGuides(prev =>
          prev.map(guide =>
            guide.id === guideId
              ? {
                  ...guide,
                  aadharVerified: document === 'aadhar' ? !guide.aadharVerified : guide.aadharVerified,
                  panVerified: document === 'pan' ? !guide.panVerified : guide.panVerified,
                }
              : guide
          )
        );
      }
    } catch (error) {
      console.error('Error toggling verification:', error);
    }
  };

  const handleDeleteGuide = async (guideId: string) => {
    if (!confirm('Are you sure you want to delete this guide? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/guides/${guideId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGuides(prev => prev.filter(guide => guide.id !== guideId));
      }
    } catch (error) {
      console.error('Error deleting guide:', error);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedGuides.length === 0) return;

    if (bulkAction === 'delete' && !confirm(`Delete ${selectedGuides.length} guides?`)) {
      return;
    }

    try {
      const response = await fetch('/api/admin/guides/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guideIds: selectedGuides,
          action: bulkAction,
        }),
      });

      if (response.ok) {
        if (bulkAction === 'delete') {
          setGuides(prev => prev.filter(guide => !selectedGuides.includes(guide.id)));
        } else {
          // Refresh for other actions
          fetchGuides();
        }
        setSelectedGuides([]);
        setBulkAction('');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedGuides.length === filteredGuides.length) {
      setSelectedGuides([]);
    } else {
      setSelectedGuides(filteredGuides.map(guide => guide.id));
    }
  };

  const handleSelectGuide = (guideId: string) => {
    setSelectedGuides(prev =>
      prev.includes(guideId)
        ? prev.filter(id => id !== guideId)
        : [...prev, guideId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'blocked': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
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
          <h1 className="text-2xl font-bold text-gray-900">Guide Management</h1>
          <p className="text-gray-600">Manage and verify tour guides on the platform</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/guides/create"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            + Add New Guide
          </Link>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Guides
              </label>
              <input
                type="text"
                placeholder="Search by name, email, phone, Aadhaar, PAN..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Status
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">All Verification</option>
                <option value="verified">Fully Verified</option>
                <option value="partial">Partially Verified</option>
                <option value="pending">Pending Verification</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">All Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Charge/Day
              </label>
              <input
                type="number"
                placeholder="₹"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Charge/Day
              </label>
              <input
                type="number"
                placeholder="₹"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedGuides.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-700">
                {selectedGuides.length} guide(s) selected
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-1 border border-blue-300 rounded"
              >
                <option value="">Bulk Actions</option>
                <option value="approve">Approve Selected</option>
                <option value="reject">Reject Selected</option>
                <option value="block">Block Selected</option>
                <option value="unblock">Unblock Selected</option>
                <option value="delete">Delete Selected</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            <button
              onClick={() => setSelectedGuides([])}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{guides.length}</div>
          <div className="text-sm text-gray-600">Total Guides</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {guides.filter(g => g.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">
            {guides.filter(g => g.status === 'approved').length}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-red-600">
            {guides.filter(g => g.status === 'blocked').length}
          </div>
          <div className="text-sm text-gray-600">Blocked</div>
        </div>
      </div>

      {/* Guides Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedGuides.length === filteredGuides.length && filteredGuides.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guide Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Professional Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuides.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No guides found. {searchTerm && 'Try adjusting your search filters.'}
                  </td>
                </tr>
              ) : (
                filteredGuides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedGuides.includes(guide.id)}
                        onChange={() => handleSelectGuide(guide.id)}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{guide.fullName}</div>
                        <div className="text-sm text-gray-500">{guide.email}</div>
                        <div className="text-sm text-gray-500">{guide.phone}</div>
                        <div className="text-sm text-gray-500">{guide.city}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Joined: {formatDate(guide.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">Aadhaar:</span>
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {guide.documents.aadharNumber}
                          </span>
                          <button
                            onClick={() => handleVerificationToggle(guide.id, 'aadhar')}
                            className={`text-xs px-2 py-1 rounded ${
                              guide.aadharVerified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {guide.aadharVerified ? 'Verified' : 'Not Verified'}
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">PAN:</span>
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {guide.documents.panNumber}
                          </span>
                          <button
                            onClick={() => handleVerificationToggle(guide.id, 'pan')}
                            className={`text-xs px-2 py-1 rounded ${
                              guide.panVerified
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {guide.panVerified ? 'Verified' : 'Not Verified'}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">Exp:</span> {guide.experience}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Charge:</span> ₹{guide.chargePerDay}/day
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Bookings:</span> {guide.totalBookings}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Rating:</span> {guide.rating}/5
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(guide.status)}`}>
                        {guide.status.toUpperCase()}
                      </span>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${guide.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs">{guide.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${guide.isVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs">{guide.isVerified ? 'Verified' : 'Unverified'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                          <Link
                            href={`/admin/guides/${guide.id}`}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/guides/${guide.id}/edit`}
                            className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                          >
                            Edit
                          </Link>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {guide.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(guide.id, 'approved')}
                                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusChange(guide.id, 'rejected')}
                                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {guide.status === 'approved' && (
                            <button
                              onClick={() => handleStatusChange(guide.id, 'blocked')}
                              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              Block
                            </button>
                          )}
                          {guide.status === 'blocked' && (
                            <button
                              onClick={() => handleStatusChange(guide.id, 'approved')}
                              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                            >
                              Unblock
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteGuide(guide.id)}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredGuides.length}</span> of{' '}
              <span className="font-medium">{guides.length}</span> guides
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}