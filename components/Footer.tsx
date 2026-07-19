import { profile } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line py-10">
      <div className="shell flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5 font-mono text-sm text-bone-dim">
          <span className="inline-block h-2 w-2 rounded-full bg-amber" />
          {profile.name}
        </div>
        <p className="font-mono text-xs text-bone-faint">
          © {year} · Built with Next.js + Tailwind · Deployed on Vercel
        </p>
      </div>
    </footer>
  );
}
