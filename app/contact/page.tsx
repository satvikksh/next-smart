'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

// Dark, attractive SMART-themed contact page.
// - Drop into `app/contact/page.tsx` or `pages/contact.tsx` in Next.js
// - Requires Tailwind CSS and lucide-react (already used in other SMART pages)
// - Uses subtle animations, glassmorphism, and a two-column layout optimized for dark mode

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);

  function validate() {
    const e: any = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = 'Enter a valid email';
    if (form.phone && !form.phone.match(/^\+?[0-9\s-]{6,20}$/)) e.phone = 'Enter a valid phone';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'Message should be at least 10 characters';
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    setStatus(null);
    try {
      // Replace with your API endpoint
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Network error');
      setStatus('success');
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#071023] to-[#081022] text-slate-100 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* LEFT: Hero with neon accent */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            <div className="p-6 rounded-3xl backdrop-blur-md bg-gradient-to-br from-white/3 via-white/2 to-white/2 border border-white/6 shadow-lg">
              <h1 className="text-3xl font-extrabold tracking-tight">Get in touch</h1>
              <p className="mt-3 text-slate-300">Questions about SMART? Need a demo or bespoke integration? Send us a note — we love building helpful things.</p>

              <div className="mt-6 grid gap-3">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-[#0f1724]/40 to-transparent border border-white/6">
                  <div className="p-2 rounded-lg bg-white/6"><Mail size={18} /></div>
                  <div>
                    <div className="text-sm text-slate-300">Email</div>
                    <div className="font-medium">satvikksh@gmail.com</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-[#0f1724]/40 to-transparent border border-white/6">
                  <div className="p-2 rounded-lg bg-white/6"><Phone size={18} /></div>
                  <div>
                    <div className="text-sm text-slate-300">Call</div>
                    <div className="font-medium">+91 7580915543</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-[#0f1724]/40 to-transparent border border-white/6">
                  <div className="p-2 rounded-lg bg-white/6"><MapPin size={18} /></div>
                  <div>
                    <div className="text-sm text-slate-300">Office</div>
                    <div className="font-medium">Bhopal, India</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 animate-pulse" />
                <div>
                  <div className="text-xs text-slate-300">Online</div>
                  <div className="text-sm font-medium">Response within one business day</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-3xl border border-white/6 bg-gradient-to-b from-white/2 to-transparent">
              <h3 className="text-sm text-slate-300 uppercase tracking-wider">Quick actions</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a className="hover:underline" href="/support">Open a support ticket</a></li>
                <li><a className="hover:underline" href="/sales">Request a demo</a></li>
                <li><a className="hover:underline" href="mailto:satvikksh@gmail.com">Email sales</a></li>
              </ul>
            </div>
          </aside>

          {/* RIGHT: Form + Map (larger column) */}
          <section className="lg:col-span-2">
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#071028]/60 via-[#061523]/40 to-transparent border border-white/6 shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Contact form</h2>
                  <p className="text-sm text-slate-400">Tell us about your project and preferred contact method.</p>
                </div>
                <div className="text-sm text-slate-400">Prefer email? <a className="text-sky-400 underline" href="mailto:satvikksh@gmail.com">satvikksh@gmail.com</a></div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-300">Full name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`mt-2 w-full rounded-xl bg-transparent border p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.name ? 'border-rose-500' : 'border-white/6'}`}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="text-rose-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm text-slate-300">Email address</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`mt-2 w-full rounded-xl bg-transparent border p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.email ? 'border-rose-500' : 'border-white/6'}`}
                    placeholder="name@company.com"
                  />
                  {errors.email && <p className="text-rose-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div className="lg:col-span-2">
                  <label className="text-sm text-slate-300">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={6}
                    className={`mt-2 w-full rounded-xl bg-transparent border p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 ${errors.message ? 'border-rose-500' : 'border-white/6'}`}
                    placeholder="Tell us what you'd like help with..."
                  />
                  {errors.message && <p className="text-rose-400 text-sm mt-1">{errors.message}</p>}
                </div>

                <div className="flex items-center gap-4 lg:col-span-2">
                  <div className="flex-1 text-sm text-slate-400">We respect your privacy. We'll only use this info to reply.</div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-black shadow-lg transform transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    {submitting ? 'Sending...' : 'Send message'}
                  </button>
                </div>

                {status === 'success' && (
                  <div className="lg:col-span-2 mt-2 rounded-xl bg-emerald-800/40 border border-emerald-400 p-3 text-emerald-200">Thanks — we've got your message and will respond shortly.</div>
                )}

                {status === 'error' && (
                  <div className="lg:col-span-2 mt-2 rounded-xl bg-rose-900/40 border border-rose-400 p-3 text-rose-200">Something went wrong — please try again or email satvikksh@gmail.com.</div>
                )}

              </form>

              <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <div className="h-56 rounded-xl overflow-hidden border border-white/6">
                   <iframe
  title="Bhopal-location"
  className="w-full h-full"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14663.84553899184!2d77.3962676!3d23.2599332!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c426dd9cb91ab%3A0xf79c57e8da3d7c88!2sBhopal%2C%20Madhya%20Pradesh%2C%20India!5e0!3m2!1sen!2sus!4v1700846344866!5m2!1sen!2sus"
  loading="lazy"
></iframe>

                  </div>
                </div>

                <div className="rounded-xl border border-white/6 p-4">
                  <h4 className="text-sm text-slate-300">Office hours</h4>
                  <p className="mt-2 text-sm text-slate-400">Mon — Fri: 9:30 AM — 6:30 PM</p>
                  <p className="text-sm text-slate-400">Sat: 10:00 AM — 2:00 PM</p>

                  <div className="mt-4">
                    <h5 className="text-xs text-slate-300 uppercase">Follow us</h5>
                    <div className="mt-2 flex gap-2 text-slate-300 text-sm">
                      <a className="underline">Twitter</a>
                      <a className="underline">LinkedIn</a>
                      <a className="underline">GitHub</a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
