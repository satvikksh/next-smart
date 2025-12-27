'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

type Status = 'success' | 'error' | null;

const initialForm: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  /* ----------------------------- Validation ----------------------------- */

  const validate = useCallback((): FormErrors => {
    const e: FormErrors = {};

    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.phone && !/^\+?[0-9\s-]{6,20}$/.test(form.phone)) {
      e.phone = 'Enter a valid phone number';
    }
    if (form.message.trim().length < 10) {
      e.message = 'Message should be at least 10 characters';
    }

    return e;
  }, [form]);

  /* ----------------------------- Handlers ----------------------------- */

  const update =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      setForm(initialForm);
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    'mt-2 w-full rounded-xl bg-transparent border p-3 focus:outline-none focus:ring-2 focus:ring-sky-500';

  /* ----------------------------- UI ----------------------------- */

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#05060b] via-[#071023] to-[#081022] text-slate-100 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT PANEL */}
          <aside className="space-y-6">
            <div className="p-6 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl">
              <h1 className="text-3xl font-extrabold">Get in touch</h1>
              <p className="mt-3 text-slate-300">
                Have questions about SMART or need a custom solution?
                We’re happy to help.
              </p>

              <div className="mt-6 space-y-3">
                <ContactItem icon={<Mail size={18} />} label="Email" value="satvikksh@gmail.com" />
                <ContactItem icon={<Phone size={18} />} label="Call" value="+91 7580915543" />
                <ContactItem icon={<MapPin size={18} />} label="Office" value="Bhopal, India" />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 animate-pulse" />
                <div>
                  <p className="text-xs text-slate-400">Availability</p>
                  <p className="text-sm font-medium">Replies within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/5">
              <h3 className="text-xs uppercase tracking-wider text-slate-400">Quick actions</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li><a href="/support" className="hover:underline">Open support ticket</a></li>
                <li><a href="/sales" className="hover:underline">Request demo</a></li>
                <li><a href="mailto:satvikksh@gmail.com" className="hover:underline">Email us</a></li>
              </ul>
            </div>
          </aside>

          {/* FORM SECTION */}
          <section className="lg:col-span-2">
            <div className="p-6 rounded-3xl border border-white/10 bg-white/5 shadow-2xl">
              <header className="flex flex-wrap gap-4 justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Contact form</h2>
                  <p className="text-sm text-slate-400">
                    Tell us what you need and how we can reach you.
                  </p>
                </div>
                <p className="text-sm text-slate-400">
                  Or email{' '}
                  <a href="mailto:satvikksh@gmail.com" className="underline text-sky-400">
                    satvikksh@gmail.com
                  </a>
                </p>
              </header>

              <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  label="Full name"
                  value={form.name}
                  onChange={update('name')}
                  error={errors.name}
                  placeholder="Your name"
                />

                <Input
                  label="Email address"
                  value={form.email}
                  onChange={update('email')}
                  error={errors.email}
                  placeholder="name@company.com"
                />

                <Input
                  label="Phone (optional)"
                  value={form.phone}
                  onChange={update('phone')}
                  error={errors.phone}
                  placeholder="+91 XXXXX XXXXX"
                />

                <div className="lg:col-span-2">
                  <label className="text-sm text-slate-300">Message</label>
                  <textarea
                    rows={6}
                    value={form.message}
                    onChange={update('message')}
                    className={`${inputBase} ${errors.message ? 'border-rose-500' : 'border-white/10'}`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && <ErrorText>{errors.message}</ErrorText>}
                </div>

                <div className="lg:col-span-2 flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-400">
                    We respect your privacy and never share your data.
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-3 font-semibold text-black shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    {submitting ? 'Sending...' : 'Send message'}
                  </button>
                </div>

                {status === 'success' && (
                  <StatusBox color="emerald">
                    Message sent successfully. We’ll get back to you soon.
                  </StatusBox>
                )}

                {status === 'error' && (
                  <StatusBox color="rose">
                    Something went wrong. Please try again or email us directly.
                  </StatusBox>
                )}
              </form>

              {/* MAP + INFO */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 h-56 rounded-xl overflow-hidden border border-white/10">
                  <iframe
                    title="Bhopal-location"
                    className="w-full h-full"
                    loading="lazy"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14663.84553899184!2d77.3962676!3d23.2599332!5e0!3m2!1sen!2sin!4v1700846344866"
                  />
                </div>

                <div className="rounded-xl border border-white/10 p-4 text-sm">
                  <p className="text-slate-400">Office hours</p>
                  <p className="mt-2 text-slate-500">Mon–Fri: 9:30 AM – 6:30 PM</p>
                  <p className="text-slate-500">Sat: 10:00 AM – 2:00 PM</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ----------------------------- Components ----------------------------- */

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
      <div className="p-2 rounded-lg bg-white/10">{icon}</div>
      <div>
        <p className="text-xs text-slate-400">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  error?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm text-slate-300">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-xl bg-transparent border p-3 focus:outline-none focus:ring-2 focus:ring-sky-500 ${
          error ? 'border-rose-500' : 'border-white/10'
        }`}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-sm text-rose-400">{children}</p>;
}

function StatusBox({
  color,
  children,
}: {
  color: 'emerald' | 'rose';
  children: React.ReactNode;
}) {
  return (
    <div
      className={`lg:col-span-2 mt-2 rounded-xl border p-3 text-sm ${
        color === 'emerald'
          ? 'bg-emerald-900/40 border-emerald-400 text-emerald-200'
          : 'bg-rose-900/40 border-rose-400 text-rose-200'
      }`}
    >
      {children}
    </div>
  );
}
