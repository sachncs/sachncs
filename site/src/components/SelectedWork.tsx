import { ArrowUpRight, Github } from 'lucide-react';
import { Section } from './ui/Section';
import { FadeIn } from './ui/FadeIn';
import { projects, profile } from '../content/data';

export function SelectedWork() {
  return (
    <Section
      id="work"
      eyebrow="Selected work"
      title={
        <>
          Open source that proves the{' '}
          <span className="text-white/45">production point.</span>
        </>
      }
      description="Public repositories tied to real outcomes. Each one is in active use by at least one production team today."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <FadeIn key={p.name} delay={i * 0.04}>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.025] to-white/[0.01] p-7 transition-all duration-500 hover:border-white/15 hover:from-white/[0.045] hover:to-white/[0.015]"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent-500/0 blur-3xl transition-all duration-700 group-hover:bg-accent-500/20" />

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/80 transition-colors group-hover:text-white">
                    <Github className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
                    {p.stack}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-white/40 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
              </div>

              <div className="relative">
                <h3 className="text-xl font-semibold tracking-tight text-white">
                  {p.name}
                </h3>
                {p.highlight && (
                  <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-accent-400/20 bg-accent-500/10 px-2.5 py-0.5 text-[11px] font-medium text-accent-200">
                    <span className="h-1 w-1 rounded-full bg-accent-300" />
                    {p.highlight}
                  </span>
                )}
              </div>

              <p className="relative text-sm leading-relaxed text-white/55">
                {p.description}
              </p>

              <div className="relative mt-auto flex items-center gap-2 pt-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    p.status === 'active'
                      ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      : 'bg-white/40'
                  }`}
                />
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/45">
                  {p.status}
                </span>
              </div>
            </a>
          </FadeIn>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href={profile.links.repositories}
          target="_blank"
          rel="noreferrer noopener"
          className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 text-sm text-white/70 transition-all hover:border-white/25 hover:bg-white/[0.05] hover:text-white"
        >
          Browse all public repositories
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </Section>
  );
}