'use client';
import Link from 'next/link';


export default function Header() {
return (
<header className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-40">
<nav className="container mx-auto px-6 py-4 flex justify-between items-center">
<Link href="/" className="flex items-center space-x-2">
<img src="/logo.png" alt="logo" width={90} height={60} />
<span className="text-2xl font-bold text-blue-400">S.M.A.R.T.</span>
</Link>
<div className="hidden md:flex items-center space-x-6">
<Link href="/" className="text-slate-400 hover:text-blue-400">Home</Link>
<Link href="/guides" className="text-slate-400 hover:text-blue-400">Find a Guide</Link>
<Link href="/about" className="text-slate-400 hover:text-blue-400">About</Link>
<Link href="/contact" className="text-slate-400 hover:text-blue-400">Contact</Link>
</div>
<div className="flex items-center space-x-2">
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Login / Register</button>
</div>
</nav>
</header>
);
}