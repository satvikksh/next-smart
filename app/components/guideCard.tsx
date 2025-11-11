'use client';
import React from 'react';
import { Guide } from '../data/guides';


export default function GuideCard({ guide, onBook, onChat }: { guide: Guide; onBook?: (name: string) => void; onChat?: (name: string, specialty: string) => void }) {
return (
<div className="bg-slate-800 rounded-xl overflow-hidden border p-0">
<img src={guide.img} alt={guide.name} className="w-full h-48 object-cover" />
<div className="p-6">
<span className="inline-block bg-blue-900 text-blue-400 text-xs px-2 py-1 rounded-full uppercase">{guide.level}</span>
<h3 className="text-2xl font-bold mt-3">{guide.name}</h3>
<p className="text-slate-400">{guide.location}</p>
<p className="text-slate-300 mt-2">&ldquo;{guide.specialty}&rdquo;</p>
<div className="flex justify-between items-center mt-4">
<div className="text-yellow-500 font-bold">{guide.rating} ★</div>
<div className="flex gap-2">
<button onClick={() => onChat?.(guide.name, guide.specialty)} className="px-4 py-2 rounded bg-slate-700">Chat</button>
<button onClick={() => onBook?.(guide.name)} className="px-4 py-2 rounded bg-blue-500 text-white">Book</button>
</div>
</div>
</div>
</div>
);
}