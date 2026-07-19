import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { skillGroups } from "@/lib/content";

// Capability ledger: category name large on the left, skills flowing as
// tagged text on the right, separated by hairlines. No bars, no icon grid.
export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-28 sm:py-36">
      <div className="shell">
        <SectionHeader
          eyebrow="Capabilities"
          index="/ 03"
          title="What I reach for, by discipline."
        />

        <div className="mt-16 border-t border-line">
          {skillGroups.map((group, i) => (
            <Reveal key={group.category} delay={i * 0.05}>
              <div className="group grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-8">
                {/* Left: index letter + category */}
                <div className="md:col-span-4">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-sm text-amber">
                      {group.index}
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-tightest text-bone transition-colors group-hover:text-amber-bright sm:text-3xl">
                        {group.category}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-bone-faint">
                        {group.note}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: skills as flowing tagged text */}
                <div className="md:col-span-8">
                  <ul className="flex flex-wrap gap-x-2 gap-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="text-lg text-bone-dim transition-colors hover:text-bone after:mx-2 after:text-bone-faint after:content-['·'] last:after:content-['']"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
