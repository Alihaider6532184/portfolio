import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { ProjectDemo } from "./ProjectDemos";
import { projects, type Project } from "@/lib/content";

// Reusable spec field: mono label above a value.
function SpecField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-amber">
        {label}
      </div>
      <p className="mt-2 leading-relaxed text-bone-dim">{children}</p>
    </div>
  );
}

function CaseStudy({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <article className="relative pt-14 first:pt-0">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Media column — alternates side on large screens */}
        <Reveal
          className={`lg:col-span-5 ${
            flip ? "lg:order-2 lg:col-start-8" : "lg:order-1"
          }`}
        >
          <ProjectDemo index={project.index} />
        </Reveal>

        {/* Content column */}
        <div
          className={`lg:col-span-6 ${
            flip ? "lg:order-1 lg:col-start-1" : "lg:order-2 lg:col-start-7"
          }`}
        >
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm text-amber">{project.index}</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <h3 className="mt-4 font-display text-3xl font-semibold tracking-tightest text-bone sm:text-4xl">
              {project.name}
            </h3>
            <p className="mt-2 text-lg text-bone-dim">{project.tagline}</p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <SpecField label="Problem">{project.problem}</SpecField>
              <SpecField label="My role">{project.role}</SpecField>
              <SpecField label="Outcome">{project.outcome}</SpecField>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-amber">
                  Stack
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li
                      key={s}
                      className="rounded-full border border-line bg-ink-800 px-3 py-1 font-mono text-xs text-bone-dim transition-colors hover:border-amber/50 hover:text-bone"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="work" className="scroll-mt-24 py-28 sm:py-36">
      <div className="shell">
        <SectionHeader
          eyebrow="Selected work"
          index="/ 02"
          title="Three systems, shipped end to end."
        />

        <div className="mt-16 divide-y divide-line">
          {projects.map((p, i) => (
            <CaseStudy key={p.name} project={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
