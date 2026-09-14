import { Check } from 'lucide-react';
import { Section } from './ui/Section';
import { FadeIn } from './ui/FadeIn';
import { engagements } from '../content/data';

const inclusions = [
  'Architecture review & diagrams',
  'Working code, not decks',
  'Eval harness shipped',
  'Observability & rollback plan',
  'Governance & security review',
];

export function Engagement() {
  return (
    <Section
      id="engage"
      eyebrow="Engagement"
      title={
        <>
          Ways to work{' '}
          <span className="text-white/45">together.</span>
        </>
      }
      description="Three engagement shapes. Pick the one closest to where your team is today."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {engagements.map((e, i) => (
          <FadeIn key={e.name} delay={i * 0.05}>
            <article
              className={`relative flex h-full flex-col gap-5 overflow-hidden rounded-3xl border p-8 transition-all duration-500 md:p-9 ${
                e.featured
                  ? 'border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.015]'
                  : 'border-white/[0.07] bg-white/[0.015] hover:border-white/15 hover:bg-white/[0.03]'
              }`}
            >
              {e.featured && (
                <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full border border-accent-400/30 bg-accent-500/15 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent-200">
                  <span className="h-1 w-1 rounded-full bg-accent-300" />
                  Most chosen
                </span>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                  {e.cadence}
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-white">
                  {e.name}
                </h3>
              </div>

              <p className="text-base leading-relaxed text-white/55">{e.description}</p>

              <div className="mt-2 flex flex-col gap-2 border-t border-white/[0.06] pt-5">
                {inclusions.map((line) => (
                  <div key={line} className="flex items-center gap-3 text-sm text-white/70">
                    <Check className="h-4 w-4 text-accent-300" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-2 text-xs uppercase tracking-[0.14em] text-white/35">
                {e.bestFor}
              </div>
            </article>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <div className="mt-10 flex flex-col items-start justify-between rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 md:flex-row md:items-center md:p-9">
          <div>
            <h4 className="text-lg font-medium text-white">
              Not the right fit?
            </h4>
            <p className="mt-1 max-w-xl text-sm text-white/55">
              Cold 0→1 MVPs without budget, or intros without context — please don&apos;t.
              Everything else is fair game. Typical reply: 2–3 working days.
            </p>
          </div>
          <a
            href={`mailto:${'sachncs@gmail.com'}`}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-white transition-all hover:border-white/30 hover:bg-white/5 md:mt-0"
          >
            sachncs@gmail.com
          </a>
        </div>
      </FadeIn>
    </Section>
  );
}