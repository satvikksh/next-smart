'use client';

import React from "react";
import {
  Compass,
  Users,
  ShieldCheck,
  Globe2,
//   Handshake,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Hero Section */}
      <section className="relative py-24 text-center overflow-hidden">
        {/* Background lights */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/2 translate-x-1/2 w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-3xl"></div>

        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          About{" "}
          <span className="bg-gradient-to-r from-green-400 to-cyan-300 bg-clip-text text-transparent">
            S.M.A.R.T.
          </span>
        </h1>
        <p className="text-slate-300 text-lg max-w-3xl mx-auto">
          Smart Monitoring and Response System for Travelers — India’s next-gen
          travel companion designed to connect tourists with verified guides,
          enhance safety, and elevate tourism experiences across the nation.
        </p>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="text-green-400" /> Our Mission
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Our mission is to revolutionize the Indian tourism ecosystem by
              bridging the gap between travelers and local, professional, and
              trustworthy guides. We aim to create a secure, easy-to-use, and
              efficient platform that boosts travel confidence and promotes
              India’s culture at both local and national levels.
            </p>
          </div>

          <img
            src="/about-hero.jpg"
            alt="Tourism"
            className="rounded-2xl shadow-xl border border-white/10"
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-slate-900/50 py-16 border-y border-white/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-12">
            Why Travelers Choose{" "}
            <span className="text-green-400">S.M.A.R.T.</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Card 1 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10 hover:border-green-400/40 transition">
              <Compass className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Guides</h3>
              <p className="text-slate-300 text-sm">
                Every guide on our platform is verified and trained to ensure a
                safe and high-quality travel experience.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10 hover:border-green-400/40 transition">
              <Globe2 className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Pan-India Coverage</h3>
              <p className="text-slate-300 text-sm">
                From Kashmir to Kanyakumari, find a guide anywhere across India
                for any travel plan.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10 hover:border-green-400/40 transition">
              <ShieldCheck className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Enhanced Safety</h3>
              <p className="text-slate-300 text-sm">
                With digital tourist ID, emergency triggers, and secure
                monitoring, your journey becomes safer.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10 hover:border-green-400/40 transition">
              <Users className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Guide-Tourist Matching
              </h3>
              <p className="text-slate-300 text-sm">
                AI-powered system matches you with the best guide for your
                travel needs, budget, and language.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10 hover:border-green-400/40 transition">
              {/* <Handshake className="w-10 h-10 text-green-400 mx-auto mb-4" /> */}
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-slate-300 text-sm">
                Book guides instantly, receive a unique booking ID, and download
                it anytime.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-slate-800/40 p-8 rounded-2xl border border-white/10 hover:border-green-400/40 transition">
              <MapPin className="w-10 h-10 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Local Expertise Anywhere
              </h3>
              <p className="text-slate-300 text-sm">
                Explore hidden gems, food spots, cultural secrets, and more
                with expert local guides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Sparkles className="w-12 h-12 text-green-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            To build the most trusted tourism ecosystem in India by empowering
            local guides, enhancing traveler safety, and providing a seamless
            digital tourism experience.  
            S.M.A.R.T. is not just a platform — it is the future of Indian
            tourism.
          </p>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-slate-900/70 py-16 border-t border-white/10 text-center">
        <h2 className="text-3xl font-semibold mb-3">
          Ready to explore India with confidence?
        </h2>
        <p className="text-slate-400 mb-6">
          Join thousands of tourists using S.M.A.R.T. for safe, smooth, and
          premium travel experiences.
        </p>
        <a
          href="/find-guide"
          className="inline-block bg-gradient-to-r from-green-500 to-cyan-400 text-slate-900 font-semibold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all"
        >
          Find a Guide Now
        </a>
      </section>
    </div>
  );
}
