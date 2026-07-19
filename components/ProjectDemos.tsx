"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type Ref } from "react";

// Interactive, self-playing project demos. Each one loops through a short
// scripted timeline like a recorded screen capture of the live product:
//  01 Patho-Assist  — multimodal RAG chat (image query → cited answer)
//  02 3D AI Avatar  — real-time voice loop with a lip-synced face
//  03 DentAssist    — embeddable clinic widget answering + capturing a booking
//
// Timelines only run while the demo is on-screen (useInView) and collapse to a
// representative static frame when the user prefers reduced motion.

const EASE = [0.22, 1, 0.36, 1] as const;

const GRID = {
  backgroundImage:
    "linear-gradient(#22302b 1px, transparent 1px), linear-gradient(90deg, #22302b 1px, transparent 1px)",
  backgroundSize: "28px 28px",
} as const;

// Advance through a set of step durations, looping. `cycle` bumps every loop so
// callers can remount inner content with a key and replay entrance animations.
function useTimeline(durations: number[], active: boolean) {
  const [step, setStep] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setTimeout(() => {
      setStep((s) => {
        if (s + 1 >= durations.length) {
          setCycle((c) => c + 1);
          return 0;
        }
        return s + 1;
      });
    }, durations[step]);
    return () => clearTimeout(id);
  }, [step, cycle, active, durations]);

  return { step, cycle };
}

// Shared instrument-viewport frame: grid + corner registration marks.
function DemoShell({
  shellRef,
  children,
}: {
  shellRef: Ref<HTMLDivElement>;
  children: ReactNode;
}) {
  return (
    <div
      ref={shellRef}
      className="group relative aspect-[4/3] w-full select-none overflow-hidden rounded-lg border border-line bg-ink-800"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]" style={GRID} />
      <span className="pointer-events-none absolute left-3 top-3 z-30 h-3 w-3 border-l border-t border-amber/40" />
      <span className="pointer-events-none absolute right-3 top-3 z-30 h-3 w-3 border-r border-t border-amber/40" />
      <span className="pointer-events-none absolute bottom-3 left-3 z-30 h-3 w-3 border-b border-l border-amber/40" />
      <span className="pointer-events-none absolute bottom-3 right-3 z-30 h-3 w-3 border-b border-r border-amber/40" />
      {children}
    </div>
  );
}

// Entrance wrapper — rises into place unless reduced motion is on.
function Rise({
  show,
  reduce,
  y = 10,
  delay = 0,
  className,
  children,
}: {
  show: boolean;
  reduce: boolean;
  y?: number;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  if (!show) return null;
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// Types out `text` when `play` flips true; shows full text under reduced motion.
function Typewriter({
  text,
  play,
  reduce,
  cps = 42,
  className,
}: {
  text: string;
  play: boolean;
  reduce: boolean;
  cps?: number;
  className?: string;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) {
      setN(text.length);
      return;
    }
    if (!play) {
      setN(0);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, 1000 / cps);
    return () => clearInterval(id);
  }, [play, text, cps, reduce]);

  const done = n >= text.length;
  return (
    <span className={className}>
      {text.slice(0, n)}
      {play && !done && !reduce && (
        <span className="ml-[1px] inline-block h-[0.9em] w-[2px] translate-y-[2px] bg-amber align-middle animate-blink" />
      )}
    </span>
  );
}

function Dots() {
  return (
    <span className="inline-flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1 w-1 rounded-full bg-amber"
          animate={{ opacity: [0.25, 1, 0.25] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Patho-Assist: multimodal RAG medical chat                      */
/* ------------------------------------------------------------------ */

const CHAT_STEPS = [900, 1500, 1600, 3200, 2600];

// A stylised H&E-stained histology tile (deterministic scatter of nuclei).
const NUCLEI: [number, number, number, number][] = [
  [14, 18, 3.2, 0.7], [30, 40, 2.6, 0.6], [48, 14, 3.6, 0.8], [66, 34, 2.4, 0.6],
  [82, 20, 3, 0.7], [98, 42, 2.8, 0.6], [22, 48, 2.2, 0.5], [40, 26, 3.4, 0.75],
  [58, 46, 2.6, 0.6], [74, 12, 2.4, 0.55], [90, 50, 3.2, 0.7], [10, 44, 2, 0.5],
  [52, 32, 2.2, 0.55], [34, 12, 2.6, 0.6], [64, 52, 3, 0.65], [104, 26, 2.4, 0.6],
  [18, 32, 2.8, 0.65], [46, 50, 2.2, 0.5], [80, 40, 2.6, 0.6], [26, 22, 2, 0.5],
];

function HESlide() {
  return (
    <div className="relative h-14 w-full overflow-hidden rounded-md ring-1 ring-white/10">
      <svg viewBox="0 0 120 60" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <defs>
          <radialGradient id="heBg" cx="38%" cy="34%" r="85%">
            <stop offset="0%" stopColor="#f7dcea" />
            <stop offset="55%" stopColor="#dfa6c7" />
            <stop offset="100%" stopColor="#a85d92" />
          </radialGradient>
        </defs>
        <rect width="120" height="60" fill="url(#heBg)" />
        {NUCLEI.map(([x, y, r, o], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#5f2168" opacity={o} />
        ))}
        {NUCLEI.map(([x, y, r], i) => (
          <circle key={`h${i}`} cx={x - r * 0.4} cy={y - r * 0.4} r={r * 0.35} fill="#8e3f86" opacity={0.5} />
        ))}
      </svg>
      <span className="absolute left-1 top-1 rounded-sm bg-black/30 px-1 font-mono text-[7px] uppercase tracking-wider text-white/80">
        H&amp;E · 40×
      </span>
      <span className="absolute right-1 bottom-1 h-2 w-2 rounded-full border border-white/50" />
    </div>
  );
}

function Cite({ n }: { n: number }) {
  return (
    <span className="rounded border border-amber/30 bg-amber/10 px-1.5 py-[1px] font-mono text-[9px] leading-none text-amber">
      [{n}]
    </span>
  );
}

function ChatDemo() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const active = inView && !reduce;
  const { step, cycle } = useTimeline(CHAT_STEPS, active);
  const s = reduce ? CHAT_STEPS.length : step;

  return (
    <DemoShell shellRef={ref}>
      <div
        key={reduce ? "static" : cycle}
        className="relative z-10 flex h-full flex-col gap-2 p-4 sm:p-5"
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-dim">
              patho-assist
            </span>
          </div>
          <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-bone-faint">
            PaliGemma · multimodal
          </span>
        </div>

        {/* transcript */}
        <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden">
          {s === 0 && (
            <div className="flex flex-1 items-center justify-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-faint">
                multimodal query
                <span className="ml-1 inline-block h-3 w-[2px] translate-y-[2px] bg-amber animate-blink" />
              </span>
            </div>
          )}

          {/* user query with image */}
          <Rise show={s >= 1} reduce={reduce} className="flex justify-end">
            <div className="max-w-[82%] rounded-2xl rounded-br-sm border border-amber/25 bg-amber/10 p-2">
              <HESlide />
              <p className="mt-1.5 text-[11px] leading-snug text-bone">
                What abnormality is shown in this biopsy?
              </p>
            </div>
          </Rise>

          {/* retrieval indicator */}
          <Rise show={s >= 2} reduce={reduce} className="flex justify-start">
            <div className="rounded-xl rounded-bl-sm border border-line bg-ink-700 px-2.5 py-1.5">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone-dim">
                  retrieving · 1,240 tiles
                </span>
                <Dots />
              </div>
              <div className="relative mt-1.5 h-[3px] w-28 overflow-hidden rounded-full bg-ink-900">
                <motion.div
                  className="absolute inset-y-0 w-1/3 rounded-full bg-amber/80"
                  animate={active ? { x: ["-45%", "260%"] } : { x: "110%" }}
                  transition={active ? { duration: 1.1, repeat: Infinity, ease: "easeInOut" } : undefined}
                />
              </div>
            </div>
          </Rise>

          {/* cited answer */}
          <Rise show={s >= 3} reduce={reduce} className="flex justify-start">
            <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-line bg-ink-700 p-2.5">
              <Typewriter
                text="Findings are consistent with invasive ductal carcinoma — irregular glandular structures and marked nuclear pleomorphism."
                play={s >= 3}
                reduce={reduce}
                className="text-[11px] leading-snug text-bone"
              />
              <div className="mt-2 flex items-center gap-1.5">
                <Cite n={1} />
                <Cite n={2} />
                <span className="font-mono text-[9px] text-bone-faint">grounded</span>
              </div>
            </div>
          </Rise>
        </div>

        {/* source footer */}
        <Rise show={s >= 4} reduce={reduce}>
          <p className="border-t border-line pt-1.5 font-mono text-[9px] leading-relaxed text-bone-faint">
            [1] Rosai &amp; Ackerman · Surgical Pathology &nbsp; [2] WHO Classification of Tumours
          </p>
        </Rise>
      </div>
    </DemoShell>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — 3D AI Avatar: real-time voice loop                             */
/* ------------------------------------------------------------------ */

const VOICE_STEPS = [1000, 1700, 1400, 800, 3400];

function Avatar({
  speaking,
  listening,
  active,
  reduce,
}: {
  speaking: boolean;
  listening: boolean;
  active: boolean;
  reduce: boolean;
}) {
  const glowing = (speaking || listening) && active;
  return (
    <div className="relative">
      <motion.div
        className="absolute -inset-4 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(232,130,60,0.28) 0%, rgba(232,130,60,0) 68%)",
        }}
        animate={glowing ? { opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.06, 0.95] } : { opacity: 0.18, scale: 1 }}
        transition={glowing ? { duration: 1.7, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
      />
      <svg viewBox="0 0 100 100" className="relative h-24 w-24 sm:h-28 sm:w-28">
        <defs>
          <radialGradient id="face" cx="36%" cy="30%" r="78%">
            <stop offset="0%" stopColor="#33463f" />
            <stop offset="60%" stopColor="#182420" />
            <stop offset="100%" stopColor="#0d1310" />
          </radialGradient>
          <linearGradient id="rim" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5A65B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F5A65B" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* head */}
        <ellipse cx="50" cy="52" rx="33" ry="37" fill="url(#face)" stroke="#22302B" strokeWidth="1" />
        {/* amber rim light on the right edge */}
        <path
          d="M50 15 A33 37 0 0 1 50 89"
          fill="none"
          stroke="url(#rim)"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* eyes (blink via ry) */}
        {[38, 62].map((cx) => (
          <motion.ellipse
            key={cx}
            cx={cx}
            cy="45"
            rx="3"
            fill="#ECE7DB"
            initial={{ ry: 3 }}
            animate={reduce ? { ry: 3 } : { ry: [3, 3, 3, 0.4, 3, 3] }}
            transition={reduce ? undefined : { duration: 4.5, repeat: Infinity, times: [0, 0.85, 0.9, 0.93, 0.96, 1] }}
          />
        ))}
        {/* brows */}
        <path d="M33 38 q5 -2 10 0" fill="none" stroke="#5E6B64" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M57 38 q5 -2 10 0" fill="none" stroke="#5E6B64" strokeWidth="1.4" strokeLinecap="round" />

        {/* mouth — lip-sync while speaking */}
        <motion.ellipse
          cx="50"
          cy="66"
          fill="#160b08"
          stroke="#B85F27"
          strokeWidth="1"
          initial={{ rx: 9, ry: 1.6 }}
          animate={
            speaking
              ? { rx: [9, 7, 10, 7, 9, 8, 9], ry: [1.6, 5.5, 2.4, 6.5, 2, 4.5, 1.6] }
              : { rx: listening ? 5 : 9, ry: listening ? 3 : 1.6 }
          }
          transition={speaking ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        />
      </svg>
    </div>
  );
}

function Waveform({
  active,
  mode,
  reduce,
}: {
  active: boolean;
  mode: "in" | "out";
  reduce: boolean;
}) {
  const bars = 23;
  return (
    <div className="flex h-8 items-center justify-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => {
        const peak = 11 - Math.abs(11 - i); // taller toward the centre
        const hi = 4 + peak * 1.5 + (i % 3) * 3;
        return (
          <motion.span
            key={i}
            className={`inline-block w-[3px] rounded-full ${mode === "out" ? "bg-amber" : "bg-bone-dim"}`}
            style={{ height: 4 }}
            animate={active && !reduce ? { height: [4, hi, 6, hi * 0.7, 4] } : { height: reduce ? 6 : 3 }}
            transition={
              active && !reduce
                ? { duration: 0.7 + (i % 4) * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.03 }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
}

function VoiceDemo() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const active = inView && !reduce;
  const { step, cycle } = useTimeline(VOICE_STEPS, active);
  const s = reduce ? VOICE_STEPS.length : step;

  const listening = s === 1;
  const speaking = s >= 4;
  const showUser = s >= 2 && s < 4;

  const badge = speaking ? "312 ms" : listening ? "rec" : s === 3 ? "···" : "idle";

  return (
    <DemoShell shellRef={ref}>
      <div
        key={reduce ? "static" : cycle}
        className="relative z-10 flex h-full flex-col p-4 sm:p-5"
      >
        {/* header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bone-dim">
              voice-agent
            </span>
          </div>
          <span className="flex items-center gap-1 rounded border border-line px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-bone-faint">
            <span className="text-amber">◊</span> {badge}
          </span>
        </div>

        {/* avatar + waveform */}
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <Avatar speaking={speaking && !reduce} listening={listening} active={active} reduce={reduce} />
          <Waveform
            active={(listening || speaking) && active}
            mode={speaking ? "out" : "in"}
            reduce={reduce}
          />
        </div>

        {/* caption */}
        <div className="flex min-h-[34px] items-end justify-center text-center">
          {s === 0 && (
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-faint">
              press to talk
            </span>
          )}
          {listening && (
            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-amber">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-amber"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              listening
            </span>
          )}
          {showUser && (
            <Rise show reduce={reduce} className="max-w-[90%]">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-bone-faint">you</span>
              <p className="text-[12px] leading-snug text-bone-dim">
                How does retrieval grounding work?
              </p>
            </Rise>
          )}
          {speaking && (
            <div className="max-w-[92%]">
              <Typewriter
                text="It ties every answer back to source passages, so the model quotes evidence instead of inventing it."
                play={speaking}
                reduce={reduce}
                className="text-[12px] leading-snug text-bone"
              />
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — DentAssist: embeddable clinic widget                           */
/* ------------------------------------------------------------------ */

const WIDGET_STEPS = [1200, 1600, 1600, 3200, 2400];

function Tooth({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.2c-2.4 0-3.4 1.3-5.4 1.3S3.2 3 3.2 6.2c0 3.8 1.3 5.7 2.2 8.6.7 2.3.6 4.9 2 4.9 1.3 0 1.1-2.7 1.6-4.6.4-1.6.9-2.2 3-2.2s2.6.6 3 2.2c.5 1.9.3 4.6 1.6 4.6 1.4 0 1.3-2.6 2-4.9.9-2.9 2.2-4.8 2.2-8.6 0-3.2-1.4-2.7-3.4-2.7S14.4 2.2 12 2.2z" />
    </svg>
  );
}

function WidgetDemo() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const active = inView && !reduce;
  const { step, cycle } = useTimeline(WIDGET_STEPS, active);
  const s = reduce ? WIDGET_STEPS.length : step;
  const open = s >= 1;

  return (
    <DemoShell shellRef={ref}>
      <div
        key={reduce ? "static" : cycle}
        className="relative z-10 flex h-full flex-col p-3 sm:p-4"
      >
        {/* browser chrome */}
        <div className="flex items-center gap-2 rounded-t-md border border-line bg-ink-700 px-2.5 py-1.5">
          <span className="flex gap-1">
            <span className="h-2 w-2 rounded-full bg-bone-faint/60" />
            <span className="h-2 w-2 rounded-full bg-bone-faint/60" />
            <span className="h-2 w-2 rounded-full bg-bone-faint/60" />
          </span>
          <span className="ml-1 flex flex-1 items-center gap-1 truncate rounded bg-ink-900 px-2 py-0.5 font-mono text-[9px] text-bone-faint">
            <span className="text-emerald-400">▲</span> brightsmile-dental.com
          </span>
        </div>

        {/* site viewport */}
        <div className="relative flex-1 overflow-hidden rounded-b-md border border-t-0 border-line bg-gradient-to-b from-ink-900 to-ink-800">
          {/* faux clinic site */}
          <div className={`p-3 transition-opacity duration-500 ${open ? "opacity-40" : "opacity-90"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tooth className="h-3.5 w-3.5 text-amber" />
                <span className="font-display text-[11px] font-semibold text-bone">Bright Smile</span>
              </div>
              <div className="flex gap-2">
                {["Services", "Team", "Book"].map((t) => (
                  <span key={t} className="text-[8px] text-bone-faint">{t}</span>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="font-display text-[15px] font-semibold leading-tight text-bone">
                A brighter, healthier smile.
              </p>
              <p className="mt-1 text-[9px] text-bone-dim">Family &amp; emergency dentistry in your neighbourhood.</p>
              <span className="mt-2 inline-block rounded-full bg-amber px-2.5 py-1 text-[8px] font-medium text-ink-900">
                Book appointment
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {["Cleaning", "Whitening", "Implants"].map((t) => (
                <div key={t} className="rounded border border-line bg-ink-800/60 px-1.5 py-2 text-center text-[7px] text-bone-faint">
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* lead-captured toast */}
          <Rise show={s >= 4} reduce={reduce} className="absolute left-2.5 top-2.5 z-20">
            <div className="flex items-center gap-1 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2 py-1">
              <span className="text-[9px] text-emerald-400">✓</span>
              <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-emerald-300">
                lead captured → CRM
              </span>
            </div>
          </Rise>

          {/* chat widget */}
          <div className="absolute bottom-2.5 right-2.5 z-20 flex flex-col items-end gap-2">
            {open ? (
              <motion.div
                initial={reduce ? false : { opacity: 0, scale: 0.85, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                style={{ transformOrigin: "bottom right" }}
                className="w-[190px] overflow-hidden rounded-xl border border-line bg-ink-800 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.7)] sm:w-[212px]"
              >
                {/* widget header */}
                <div className="flex items-center gap-2 bg-ink-700 px-2.5 py-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber/15">
                    <Tooth className="h-3 w-3 text-amber" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[10px] font-medium text-bone">Bright Smile Assistant</p>
                    <p className="flex items-center gap-1 text-[8px] text-emerald-400">
                      <span className="h-1 w-1 rounded-full bg-emerald-400" /> online
                    </p>
                  </div>
                </div>

                {/* messages */}
                <div className="flex flex-col gap-1.5 p-2.5">
                  <Rise show={s >= 1} reduce={reduce} className="max-w-[85%] self-start rounded-lg rounded-bl-sm bg-ink-700 px-2 py-1.5">
                    <p className="text-[10px] leading-snug text-bone-dim">
                      Hi! Questions about our services or booking?
                    </p>
                  </Rise>

                  <Rise show={s >= 2} reduce={reduce} className="max-w-[85%] self-end rounded-lg rounded-br-sm border border-amber/25 bg-amber/10 px-2 py-1.5">
                    <p className="text-[10px] leading-snug text-bone">
                      Do you do same-day emergency visits?
                    </p>
                  </Rise>

                  <Rise show={s >= 3} reduce={reduce} className="max-w-[88%] self-start rounded-lg rounded-bl-sm bg-ink-700 px-2 py-1.5">
                    <Typewriter
                      text="Yes — we keep daily emergency slots. Want me to hold one?"
                      play={s >= 3}
                      reduce={reduce}
                      className="text-[10px] leading-snug text-bone-dim"
                    />
                  </Rise>

                  {/* booking card */}
                  <Rise show={s >= 3} reduce={reduce} delay={0.5} className="self-start">
                    <div className="w-full rounded-lg border border-line bg-ink-900/60 p-1.5">
                      <p className="mb-1 font-mono text-[8px] uppercase tracking-[0.12em] text-bone-faint">
                        Today · available
                      </p>
                      <div className="flex gap-1">
                        <span className="rounded border border-line px-1.5 py-0.5 text-[9px] text-bone-dim">4:30 PM</span>
                        <span className="rounded border border-amber/40 bg-amber/10 px-1.5 py-0.5 text-[9px] text-amber">6:00 PM</span>
                      </div>
                      <span className="mt-1.5 block rounded bg-amber px-2 py-1 text-center text-[9px] font-medium text-ink-900">
                        Book this slot
                      </span>
                    </div>
                  </Rise>
                </div>

                {/* input */}
                <div className="flex items-center gap-2 border-t border-line px-2.5 py-1.5">
                  <span className="flex-1 text-[9px] text-bone-faint">Type a message…</span>
                  <span className="text-amber">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 8h9M8 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="relative">
                {active && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-amber/40"
                    animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                  />
                )}
                <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-amber text-ink-900 shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M4 5h16v11H8l-4 4V5z" fill="currentColor" />
                  </svg>
                  <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 text-[8px] font-bold text-ink-900">
                    1
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

/* ------------------------------------------------------------------ */

// Picks the right interactive demo for a project by its index.
export function ProjectDemo({ index }: { index: string }) {
  if (index === "01") return <ChatDemo />;
  if (index === "02") return <VoiceDemo />;
  return <WidgetDemo />;
}
