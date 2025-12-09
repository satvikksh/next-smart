'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Check, X } from 'lucide-react';

type GuideInput = {
  name: string;
  email: string;
  phone: string;
  aadhaar: string;
  pan: string;
  city?: string;
  state?: string;
  country?: string;
  languages: string[];
  specialty: string[];
  pricePerDay: number;
  experienceYears?: number;
  bio?: string;
  verified?: boolean;
};

function generateId() {
  return 'g_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Utility: SHA-256 -> hex using Web Crypto; fallback to base64 if not available */
async function hashStringSHA256(input: string) {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const enc = new TextEncoder();
      const data = enc.encode(input);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    // fallthrough to fallback
  }
  // fallback (less secure) — base64 encode
  try {
    return btoa(unescape(encodeURIComponent(input)));
  } catch {
    return input; // last resort
  }
}

export default function GuideSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<GuideInput>({
    name: '',
    email: '',
    phone: '',
    aadhaar: '',
    pan: '',
    city: '',
    state: '',
    country: 'India',
    languages: [],
    specialty: [],
    pricePerDay: 500,
    experienceYears: 1,
    bio: '',
    verified: false,
  });

  // new password fields (kept outside GuideInput for clarity)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [langInput, setLangInput] = useState('');
  const [specInput, setSpecInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^\+?[0-9\s-]{7,20}$/)) e.phone = 'Valid phone required';
    if (!/^[0-9]{12}$/.test(form.aadhaar)) e.aadhaar = 'Aadhaar must be 12 digits';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan.toUpperCase())) e.pan = 'PAN format invalid (e.g. ABCDE1234F)';
    if (!Number.isFinite(form.pricePerDay) || form.pricePerDay <= 0) e.pricePerDay = 'Enter a valid daily charge';

    // password validation
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAddLanguage = () => {
    const v = langInput.trim();
    if (!v) return;
    setForm(prev => ({ ...prev, languages: Array.from(new Set([...prev.languages, v])) }));
    setLangInput('');
  };

  const handleAddSpecialty = () => {
    const v = specInput.trim();
    if (!v) return;
    setForm(prev => ({ ...prev, specialty: Array.from(new Set([...prev.specialty, v])) }));
    setSpecInput('');
  };

  const handleRemoveLang = (l: string) => {
    setForm(prev => ({ ...prev, languages: prev.languages.filter(x => x !== l) }));
  };
  const handleRemoveSpec = (s: string) => {
    setForm(prev => ({ ...prev, specialty: prev.specialty.filter(x => x !== s) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setErrors({});
    try {
      // Hash sensitive values client-side (SHA-256) before sending.
      // NOTE: server should STILL salt & bcrypt the password; for Aadhaar/PAN server should encrypt or store securely.
      const passwordHash = await hashStringSHA256(password);
      const aadhaarHash = await hashStringSHA256(form.aadhaar);
      const panHash = await hashStringSHA256(form.pan.toUpperCase());

      const payload = {
        id: generateId(),
        name: form.name,
        email: form.email,
        phone: form.phone,
        // DO NOT send raw aadhaar/pan; send hashes instead
       aadhaar: form.aadhaar,      // include raw for now if server expects it
  aadhaarHash,                // hashed copy for server to store/encrypt if you prefer
  pan: form.pan.toUpperCase(),// include raw for now if server expects it
  panHash,
        passwordHash, // server should bcrypt this or derive final hash
        city: form.city || '',
        state: form.state || '',
        country: form.country || 'India',
        languages: form.languages,
        specialty: form.specialty,
        pricePerDay: Number(form.pricePerDay) || 0,
        experienceYears: Number(form.experienceYears) || 0,
        bio: form.bio || '',
        rating: 0,
        verified: false,
      };

      const res = await fetch('/api/auth/guide-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        // handle validation errors returned from server
        const message = json?.error || (json?.errors ? json.errors.join('; ') : 'Signup failed');
        setErrors({ submit: message });
        setSubmitting(false);
        return;
      }

      // success: server returns token & sanitized user
      const { token, user } = json;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('auth_token', token);
          window.localStorage.setItem('auth_user', JSON.stringify(user));
        }
      } catch (err) { /* ignore storage error */ }

      setDone(true);
      // redirect to find-guide or dashboard
      setTimeout(() => router.push('/guide-login'), 900);
    } catch (err) {
      console.error(err);
      setErrors({ submit: 'Signup failed. Try again later.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#071025] to-[#04101a] text-slate-100 p-6">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* LEFT: Guide-focused detail panel (matches login left content) */}
        <aside className="hidden lg:flex flex-col justify-center rounded-2xl bg-gradient-to-br from-[#081825]/60 to-transparent p-12 border border-white/6 shadow-xl overflow-hidden">
          <div className="max-w-lg">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-900/40 text-emerald-300 text-xs font-medium">
              NEW GUIDE? START HERE
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white">
              Build Your <span className="text-emerald-400">Professional Guide Profile</span>
            </h1>

            <p className="mt-4 text-slate-300 leading-relaxed">
              Become a verified guide and get discovered by thousands of travellers searching for trusted,
              knowledgeable experts across India. Increase your visibility, manage your schedule, and unlock
              more earning opportunities — all in one place.
            </p>

            <ul className="mt-8 space-y-6 text-slate-300 text-[15px]">
              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">✓</span>
                <span>
                  <strong className="text-white">Get Verified & Build Trust</strong><br />
                  Submit your Aadhaar & PAN for secure identity verification — top-ranked guides receive more bookings.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">✓</span>
                <span>
                  <strong className="text-white">Set Your Own Daily Rates</strong><br />
                  Decide your charge-per-day, manage seasonal pricing, and offer special experience categories.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">✓</span>
                <span>
                  <strong className="text-white">Full Control Over Your Schedule</strong><br />
                  Manage availability, block dates, handle traveler requests, and receive booking alerts instantly.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">✓</span>
                <span>
                  <strong className="text-white">Grow Your Reputation</strong><br />
                  Earn ratings & reviews from travellers and climb the platform rankings to get more visibility.
                </span>
              </li>

              <li className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-900/40 flex items-center justify-center text-emerald-400">✓</span>
                <span>
                  <strong className="text-white">Showcase Your Expertise</strong><br />
                  Highlight your languages, specialties (Historical, Wildlife, Adventure, Food Tours, Temple Tours, etc.),
                  and years of experience — travellers love experts.
                </span>
              </li>
            </ul>

            <div className="mt-10 text-emerald-300 flex items-center gap-3">
              <Link href="/guide-login" className="font-medium underline">Already registered? Login here</Link>
              <span className="text-xs text-slate-400">or</span>
              <Link href="/" className="text-slate-400 underline">Back to home</Link>
            </div>

            <div className="mt-10 text-slate-400 text-sm leading-relaxed">
              Your data is safe with us. Aadhaar and PAN are used strictly for identity validation and fraud prevention.
              Sensitive information is never shown publicly and is stored securely.
            </div>
          </div>
        </aside>

        {/* RIGHT: Form */}
        <div className="rounded-2xl bg-[#071426]/60 border border-white/6 p-6 shadow-lg">
          <h1 className="text-2xl font-bold">Register as a Guide</h1>
          <p className="text-sm text-slate-300 mt-1">Create your guide profile. Add accurate information — it helps travellers trust you.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm">Full name</label>
              <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
              {errors.name && <div className="text-rose-400 text-sm mt-1">{errors.name}</div>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Email</label>
                <input value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.email && <div className="text-rose-400 text-sm mt-1">{errors.email}</div>}
              </div>
              <div>
                <label className="text-sm">Phone</label>
                <input value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.phone && <div className="text-rose-400 text-sm mt-1">{errors.phone}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Aadhaar number (12 digits)</label>
                <input value={form.aadhaar} onChange={(e) => setForm(prev => ({ ...prev, aadhaar: e.target.value.replace(/\\D/g,'') }))} maxLength={12} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.aadhaar && <div className="text-rose-400 text-sm mt-1">{errors.aadhaar}</div>}
              </div>
              <div>
                <label className="text-sm">PAN number (e.g. ABCDE1234F)</label>
                <input value={form.pan} onChange={(e) => setForm(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))} maxLength={10} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.pan && <div className="text-rose-400 text-sm mt-1">{errors.pan}</div>}
              </div>
            </div>

            {/* PASSWORD FIELDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.password && <div className="text-rose-400 text-sm mt-1">{errors.password}</div>}
              </div>
              <div>
                <label className="text-sm">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
                {errors.confirmPassword && <div className="text-rose-400 text-sm mt-1">{errors.confirmPassword}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input placeholder="City" value={form.city} onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))} className="mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
              <input placeholder="State" value={form.state} onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))} className="mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
              <input placeholder="Country" value={form.country} onChange={(e) => setForm(prev => ({ ...prev, country: e.target.value }))} className="mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
            </div>

            <div>
              <label className="text-sm">Charge per day (₹)</label>
              <input type="number" value={form.pricePerDay} onChange={(e) => setForm(prev => ({ ...prev, pricePerDay: Number(e.target.value) }))} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
              {errors.pricePerDay && <div className="text-rose-400 text-sm mt-1">{errors.pricePerDay}</div>}
            </div>

            <div>
              <label className="text-sm">Experience (years)</label>
              <input type="number" value={form.experienceYears} onChange={(e) => setForm(prev => ({ ...prev, experienceYears: Number(e.target.value) }))} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" />
            </div>

            <div>
              <label className="text-sm">Languages</label>
              <div className="flex gap-2 mt-2">
                <input value={langInput} onChange={(e) => setLangInput(e.target.value)} placeholder="e.g. Hindi" className="flex-1 p-3 rounded-lg bg-transparent border border-white/6" />
                <button type="button" onClick={handleAddLanguage} className="px-4 py-2 rounded-lg bg-sky-600 text-black">Add</button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.languages.map(l => (
                  <span key={l} className="px-3 py-1 bg-white/6 rounded-full inline-flex items-center gap-2">
                    <span className="text-sm">{l}</span>
                    <button type="button" onClick={() => handleRemoveLang(l)} className="text-rose-400"><X size={14} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm">Specialties</label>
              <div className="flex gap-2 mt-2">
                <input value={specInput} onChange={(e) => setSpecInput(e.target.value)} placeholder="e.g. Historical" className="flex-1 p-3 rounded-lg bg-transparent border border-white/6" />
                <button type="button" onClick={handleAddSpecialty} className="px-4 py-2 rounded-lg bg-emerald-400 text-black">Add</button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.specialty.map(s => (
                  <span key={s} className="px-3 py-1 bg-white/6 rounded-full inline-flex items-center gap-2">
                    <span className="text-sm">{s}</span>
                    <button type="button" onClick={() => handleRemoveSpec(s)} className="text-rose-400"><X size={14} /></button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm">Short bio (public)</label>
              <textarea value={form.bio} onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))} className="w-full mt-2 p-3 rounded-lg bg-transparent border border-white/6" rows={4} />
            </div>

            {errors.submit && <div className="text-rose-400 text-sm">{errors.submit}</div>}

            <div className="flex items-center gap-3">
              <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 text-black font-semibold inline-flex items-center gap-2">
                {submitting ? <Loader2 className="animate-spin" /> : <Check size={16} />}
                {submitting ? 'Registering...' : 'Register as Guide'}
              </button>

              <button type="button" onClick={() => router.push('/')} className="px-4 py-3 rounded-xl border border-white/6">
                Cancel
              </button>

              {done && <div className="ml-2 text-emerald-400">Registered — redirecting...</div>}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
