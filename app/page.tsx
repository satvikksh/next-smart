import Link from "next/link";
import TouristCard from "./components/touristCard";
import { places } from "./data/places";

export default function HomePage() {
  const placeList = Object.values(places);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="container mx-auto px-4 md:px-6 py-10 space-y-16">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-8 md:p-12 shadow-xl">
          {/* glow background */}
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-10">
            {/* Left: main text */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-slate-900/60 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Smart Safety for Modern Travelers
              </span>

              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-blue-400">
                Welcome to <span className="text-emerald-400">S.M.A.R.T.</span>
              </h1>

              <p className="text-base md:text-lg text-slate-300 max-w-xl mx-auto md:mx-0">
                <span className="font-semibold">
                  Smart Monitoring and Response System for Tourist
                </span>{" "}
                — find trusted local guides, generate digital tourist IDs, and
                explore India with confidence.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <Link
                  href="/find-guide"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow hover:bg-emerald-400 transition-transform hover:-translate-y-0.5"
                >
                  Find a Guide
                  <span className="ml-2 text-lg">🧭</span>
                </Link>

                <Link
                  href="/digital-id"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-600 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-emerald-400 hover:text-emerald-300 transition-transform hover:-translate-y-0.5"
                >
                  Get Digital Tourist ID
                </Link>
              </div>

              {/* Small trust row */}
              <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-300">★ ★ ★ ★ ★</span>
                  <span>Trusted by 2K+ travellers</span>
                </div>
                <span className="hidden md:inline text-slate-600">•</span>
                <span>Real-time monitoring & verified local guides</span>
              </div>
            </div>

            {/* Right: stats / visual */}
            <div className="flex-1 flex flex-col items-center md:items-end gap-4">
              <div className="w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
                <h3 className="text-sm font-semibold text-slate-200 mb-3">
                  Live Snapshot
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="rounded-xl bg-slate-800/80 px-2 py-3">
                    <div className="text-emerald-400 font-bold text-sm">
                      120+
                    </div>
                    <div className="text-slate-400 mt-1">Active Guides</div>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 px-2 py-3">
                    <div className="text-blue-400 font-bold text-sm">
                      45
                    </div>
                    <div className="text-slate-400 mt-1">Cities</div>
                  </div>
                  <div className="rounded-xl bg-slate-800/80 px-2 py-3">
                    <div className="text-amber-400 font-bold text-sm">
                      98%
                    </div>
                    <div className="text-slate-400 mt-1">Safe Trips</div>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-xs rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-300">
                <p className="mb-2 font-semibold text-slate-100">
                  How it works:
                </p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Choose your destination or use current location</li>
                  <li>Pick a verified guide with local expertise</li>
                  <li>Book & get a unique trip ID shared with your guide</li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURE STRIP */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="group bg-slate-900/70 border border-slate-800 hover:border-emerald-400/70 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-50">
                Verified Guides
              </h3>
              <span className="text-2xl">🛡️</span>
            </div>
            <p className="text-sm text-slate-300">
              Every guide is identity-verified and rated by travellers, so you
              always get a safe and reliable experience.
            </p>
            <p className="mt-3 text-xs text-emerald-300">
              Background checks • Ratings • Local expertise
            </p>
          </div>

          <div className="group bg-slate-900/70 border border-slate-800 hover:border-blue-400/70 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-50">
                Multi-Level Expertise
              </h3>
              <span className="text-2xl">🎓</span>
            </div>
            <p className="text-sm text-slate-300">
              Choose from city experts, state-level specialists, or guides who
              cover entire regions and circuits.
            </p>
            <p className="mt-3 text-xs text-blue-300">
              City tours • State circuits • Pan-India routes
            </p>
          </div>

          <div className="group bg-slate-900/70 border border-slate-700 hover:border-amber-400/70 rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-50">
                Digital Tourist ID
              </h3>
              <span className="text-2xl">🪪</span>
            </div>
            <p className="text-sm text-slate-300">
              Generate a secure digital ID for every trip and share it with your
              guide and emergency contacts in one tap.
            </p>
            <p className="mt-3 text-xs text-amber-300">
              Unique trip ID • Downloadable • Share with guide
            </p>
          </div>
        </section>

        {/* DISCOVER PLACES */}
        <section className="space-y-6" id="places">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-50">
              Discover India&apos;s Wonders
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
              From the Himalayas to coastal escapes—explore handpicked
              destinations and instantly connect with local guides who know
              every hidden corner.
            </p>
          </div>

          {/* Small filter / info row (static for now; can wire filters later) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-full border border-slate-700 bg-slate-900/70 px-3">
                {placeList.length} curated places
              </span>
              <span>Tap a place to see details & nearby guides.</span>
            </div>
            <Link
              href="/find-guide"
              className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200"
            >
              Find guides for these places →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeList.map((p) => (
              <TouristCard
                key={p.key}
                slug={p.key}
                title={p.title}
                img={p.img}
                intro={p.intro}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
