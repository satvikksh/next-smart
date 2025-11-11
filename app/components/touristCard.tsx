'use client';
import Link from 'next/link';


export default function TouristCard({ slug, title, img, intro }: { slug: string; title: string; img: string; intro: string }) {
return (
<Link href={`/tourist/${slug}`} className="block bg-slate-800 rounded-xl overflow-hidden">
<img src={img} alt={title} className="w-full h-48 object-cover"/>
<div className="p-6">
<h3 className="text-2xl font-bold">{title}</h3>
<p className="text-slate-400 mt-2">{intro}</p>
</div>
</Link>
);
}