import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  index: string;
  title: string;
  className?: string;
};

// Shared section header: mono eyebrow + index on one line, display title below.
export default function SectionHeader({ eyebrow, index, title, className }: Props) {
  return (
    <div className={className}>
      <Reveal>
        <div className="flex items-center gap-4">
          <span className="eyebrow">{eyebrow}</span>
          <span className="h-px flex-1 bg-line" />
          <span className="font-mono text-xs text-bone-faint">{index}</span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tightest text-bone sm:text-5xl">
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
