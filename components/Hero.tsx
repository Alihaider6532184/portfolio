"use client";

import { motion, useReducedMotion } from "framer-motion";
import EmbeddingField from "./EmbeddingField";
import { profile } from "@/lib/content";

export default function Hero() {
  const reduce = useReducedMotion();

  // Orchestrated page-load reveal for the hero copy.
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.15 },
    },
  };
  const item = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
        },
      };

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-20"
    >
      {/* Signature: live embedding-space retrieval canvas */}
      <div className="absolute inset-0">
        <EmbeddingField />
        {/* Vignette so text stays readable over the field */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/10 to-ink-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/70 via-transparent to-transparent" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="shell relative z-10 py-20"
      >
        <motion.p
          variants={item}
          className="eyebrow flex items-center gap-3"
        >
          <span className="inline-block h-1.5 w-1.5 animate-blink rounded-full bg-amber" />
          {profile.location}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[0.95] tracking-tightest text-bone"
        >
          {profile.name}
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <span className="font-display text-xl text-amber sm:text-2xl">
            {profile.role}
          </span>
        </motion.div>

        <motion.p
          variants={item}
          className="mt-8 max-w-xl text-lg leading-relaxed text-bone-dim sm:text-xl"
        >
          {profile.value}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 font-mono text-sm uppercase tracking-[0.16em] text-ink-900 transition-colors hover:bg-amber-bright"
          >
            View work
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="link-underline font-mono text-sm uppercase tracking-[0.16em] text-bone-dim transition-colors hover:text-bone"
          >
            Start a conversation
          </a>
        </motion.div>
      </motion.div>

      {/* Legend for the signature element — labels what the canvas is doing */}
      <div className="absolute bottom-8 right-5 z-10 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bone-faint sm:right-8 sm:flex">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" />
        nearest-neighbor retrieval · live
      </div>
    </section>
  );
}
