// app/layout.tsx
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import ClientProviders from "./providers/ClientProviders";
import { ReactNode } from "react";

export const metadata = {
  title: "S.M.A.R.T.",
  description: "Smart Monitoring and Response System for Tourists",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0b1220] text-slate-100 antialiased selection:bg-cyan-400/30 selection:text-white">
        {/* ================= BACKGROUND EFFECTS ================= */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          {/* Gradient mesh */}
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 blur-[140px] rounded-full" />

          {/* Noise overlay */}
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03]" />
        </div>

        <ClientProviders>
          {/* ================= HEADER ================= */}
          <header className="fixed top-0 inset-x-0 z-50">
            <div className="backdrop-blur-xl bg-slate-900/50 border-b border-white/10 shadow-lg">
              <Header />
            </div>
          </header>

          {/* ================= MAIN ================= */}
          <main className="relative pt-24">
            <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
              <div className="animate-fadeIn">
                {children}
              </div>
            </div>
          </main>

          {/* ================= FOOTER ================= */}
          <footer className="mt-24 border-t border-white/10 bg-slate-900/40 backdrop-blur-lg">
            <Footer />
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
