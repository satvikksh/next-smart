// components/NotificationToast.tsx
'use client';

import { Bell, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotificationToastProps {
  isVisible: boolean;
  bookingId: string;
  guideName: string;
}

export default function NotificationToast({ isVisible, bookingId, guideName }: NotificationToastProps) {
  const [visible, setVisible] = useState(isVisible);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-2xl border border-green-200 max-w-sm">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Bell className="text-green-600" size={20} />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={16} />
                    Booking Confirmed!
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    You've successfully booked <span className="font-semibold">{guideName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-mono font-bold text-blue-700">{bookingId}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Use this ID to communicate with your guide
                </p>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                <p>• Guide has been notified with the same ID</p>
                <p>• Check your email for confirmation</p>
                <p>• Download your booking ID for reference</p>
              </div>
              
              <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                View Booking Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}