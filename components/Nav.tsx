"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-ink-900/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between">
        <a
          href="#top"
          className="group flex items-center gap-2.5 font-mono text-sm text-bone"
          aria-label="Ali Haider — back to top"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-amber transition-transform duration-300 group-hover:scale-125" />
          <span className="tracking-wide">ali_haider</span>
        </a>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="link-underline font-mono text-xs uppercase tracking-[0.22em] text-bone-dim transition-colors hover:text-bone"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full border border-amber/40 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.22em] text-amber transition-colors hover:bg-amber hover:text-ink-900"
          >
            Get in touch
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-px w-6 bg-bone transition-transform duration-300 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-bone transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-bone transition-transform duration-300 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-line bg-ink-900/95 backdrop-blur-md transition-[max-height] duration-300 md:hidden ${
          open ? "max-h-80 border-t" : "max-h-0"
        }`}
      >
        <nav className="shell flex flex-col gap-1 py-4" aria-label="Mobile">
          {navLinks.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 py-3 font-mono text-sm uppercase tracking-[0.2em] text-bone-dim transition-colors hover:text-amber"
            >
              <span className="text-amber/60">→</span>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
