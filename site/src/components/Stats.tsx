import { Section } from './ui/Section';
import { FadeIn } from './ui/FadeIn';
import { stats } from '../content/data';

export function Stats() {
  return (
    <Section
      id="numbers"
      eyebrow="By the numbers"
      title={
        <>
          Production outcomes,{' '}
          <span className="text-white/45">not slide numbers.</span>
        </>
      }
      description="Selected metrics from systems currently in production — retrieval, eval, and agent reliability work."
    >
      <FadeIn>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative flex flex-col gap-2 bg-ink-950 p-8 transition-colors duration-500 hover:bg-white/[0.025] md:p-10"
            >
              <span className="text-4xl font-semibold tracking-tighter text-white md:text-5xl">
                {s.value}
              </span>
              <span className="text-sm font-medium text-white/70">{s.label}</span>
              {s.detail && (
                <span className="mt-1 text-xs uppercase tracking-[0.14em] text-white/35">
                  {s.detail}
                </span>
              )}
              <span className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </FadeIn>
    </Section>
  );
}