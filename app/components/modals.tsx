'use client';
import React from 'react';


export function SimpleModal({ children, open, onClose }: { children: React.ReactNode; open: boolean; onClose: () => void }) {
if (!open) return null;
return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
<div className="bg-slate-800 p-6 rounded-lg w-full max-w-md border">
<button onClick={onClose} className="absolute top-4 right-4">✕</button>
{children}
</div>
</div>
);
}