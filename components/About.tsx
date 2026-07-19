import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { about } from "@/lib/content";

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-28 sm:py-36">
      <div className="shell">
        <SectionHeader eyebrow="About" index="/ 01" title={about.lead} />

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:col-start-1">
            <div className="space-y-6">
              {about.body.map((p, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <p className="text-lg leading-relaxed text-bone-dim">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Spec strip — quiet mono facts, like an instrument readout */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.1}>
              <dl className="divide-y divide-line border-y border-line">
                {about.facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-6 py-4"
                  >
                    <dt className="font-mono text-xs uppercase tracking-[0.2em] text-bone-faint">
                      {f.label}
                    </dt>
                    <dd className="text-right font-mono text-sm text-bone">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
