"use client";

import React from "react";

export default function Footer() {
  return (
    <footer className="text-center mt-16 py-6 border-t border-slate-700 text-sm text-slate-400">
      <p>
        © {new Date().getFullYear()}{" "}
        <span className="text-blue-400 font-semibold">S.M.A.R.T.</span> — All
        Rights Reserved.
      </p>
      <div className="flex justify-center gap-6 mt-3 text-slate-500">
        <a
          href="https://github.com/"
          target="_blank"
          className="hover:text-blue-400 transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          className="hover:text-blue-400 transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="mailto:smart.team@example.com"
          className="hover:text-blue-400 transition-colors"
        >
          Contact
        </a>
      </div>
    </footer>
  );
}
