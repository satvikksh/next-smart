"use client";

import { useState, useEffect } from 'react';

interface Guide {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: string;
  isActive: boolean;
  isVerified: boolean;
  chargePerDay: number;
  city: string;
  experience: string;
}

export default function ManageGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/admin/guides');
      const data = await response.json();
      setGuides(data);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/guides/${id}/approve`, {
        method: 'PUT',
      });
      if (response.ok) {
        setGuides((prev) =>
          prev.map((guide) =>
            guide.id === id
              ? { ...guide, isVerified: true, status: 'approved' }
              : guide
          )
        );
      }
    } catch (error) {
      console.error('Error approving guide:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/guides/${id}/reject`, {
        method: 'PUT',
      });
      if (response.ok) {
        setGuides((prev) =>
          prev.map((guide) =>
            guide.id === id ? { ...guide, status: 'rejected' } : guide
          )
        );
      }
    } catch (error) {
      console.error('Error rejecting guide:', error);
    }
  };

  const handleBlock = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/guides/${id}/block`, {
        method: 'PUT',
      });
      if (response.ok) {
        setGuides((prev) =>
          prev.map((guide) =>
            guide.id === id ? { ...guide, isActive: false } : guide
          )
        );
      }
    } catch (error) {
      console.error('Error blocking guide:', error);
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/guides/${id}/unblock`, {
        method: 'PUT',
      });
      if (response.ok) {
        setGuides((prev) =>
          prev.map((guide) =>
            guide.id === id ? { ...guide, isActive: true } : guide
          )
        );
      }
    } catch (error) {
      console.error('Error unblocking guide:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guide?')) return;
    try {
      const response = await fetch(`/api/admin/guides/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setGuides((prev) => prev.filter((guide) => guide.id !== id));
      }
    } catch (error) {
      console.error('Error deleting guide:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Guides</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Experience
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charge/Day
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
            {guides.map((guide) => (
              <tr key={guide.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {guide.fullName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{guide.email}</div>
                  <div className="text-sm text-gray-500">{guide.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {guide.city}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {guide.experience}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ₹{guide.chargePerDay}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      guide.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : guide.status === 'pending_verification'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {guide.status}
                  </span>
                  <span
                    className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      guide.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {guide.isActive ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {!guide.isVerified && (
                    <>
                      <button
                        onClick={() => handleApprove(guide.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(guide.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {guide.isActive ? (
                    <button
                      onClick={() => handleBlock(guide.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(guide.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Unblock
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(guide.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}