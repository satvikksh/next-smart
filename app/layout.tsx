import "./globals.css";
import Header from "./components/header";
import { ReactNode } from "react";

export const metadata = {
  title: "S.M.A.R.T.",
  description: "Smart Monitoring and Response System for Tourist",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-linear-to-br from-slate-900 via-gray-900 to-slate-800 text-slate-100 overflow-x-hidden">
        {/* Background Decorative Blur */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/10 blur-3xl rounded-full animate-pulse" />
        </div>

        {/* Fixed Header */}
        <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-slate-900/40 border-b border-slate-700 shadow-md">
          <Header />
        </header>

        {/* Main Content */}
        <main className="pt-24 px-6 sm:px-10 md:px-20 lg:px-32 transition-all duration-300">
          <section className="animate-fadeIn container mx-auto">
            {children}
          </section>
        </main>

        {/* Footer */}
        <footer className="text-center mt-16 py-6 text-sm text-slate-400 border-t border-slate-700">
          <p>
            © {new Date().getFullYear()} <span className="text-blue-400 font-semibold">S.M.A.R.T.</span> — All Rights Reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
