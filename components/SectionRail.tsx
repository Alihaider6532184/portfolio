"use client";

import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";

// Persistent left rail showing the current section index + label as you scroll.
// This encodes real navigation (where am I in the document), not decoration.
// Hidden on small screens where it would crowd the content.
export default function SectionRail() {
  const [active, setActive] = useState(navLinks[0].id);

  useEffect(() => {
    const ids = navLinks.map((l) => l.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const activeIndex = Math.max(
    0,
    navLinks.findIndex((l) => l.id === active)
  );

  return (
    <aside
      aria-hidden="true"
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block xl:left-8"
    >
      <div className="flex flex-col gap-5">
        {navLinks.map((l, i) => {
          const isActive = i === activeIndex;
          return (
            <div key={l.id} className="flex items-center gap-3">
              <span
                className={`font-mono text-[10px] tabular-nums transition-colors duration-300 ${
                  isActive ? "text-amber" : "text-bone-faint"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`h-px transition-all duration-300 ${
                  isActive ? "w-8 bg-amber" : "w-4 bg-line"
                }`}
              />
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive
                    ? "translate-x-0 text-bone opacity-100"
                    : "-translate-x-1 text-bone-faint opacity-0"
                }`}
              >
                {l.label}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
