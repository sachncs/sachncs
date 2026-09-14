import { Section } from './ui/Section';
import { FadeIn } from './ui/FadeIn';
import { processSteps } from '../content/data';

export function Process() {
  return (
    <Section
      id="process"
      eyebrow="How I work"
      title={
        <>
          From a clean question <br className="hidden md:block" />
          <span className="text-white/45">to a system that runs at 3am.</span>
        </>
      }
      description="A repeatable pattern that has held up across enterprise rollouts, internal tools, and open source."
    >
      <div className="relative">
        <div className="pointer-events-none absolute left-[28px] top-2 hidden h-[calc(100%-16px)] w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent md:block" />
        <div className="grid gap-4">
          {processSteps.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.06}>
              <div className="group relative grid grid-cols-[auto_1fr] items-start gap-6 rounded-3xl border border-white/[0.06] bg-white/[0.015] p-7 transition-all duration-500 hover:border-white/15 hover:bg-white/[0.03] md:grid-cols-[60px_1fr] md:p-9">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-ink-950 text-white">
                    <s.icon className="h-5 w-5" />
                    <span className="absolute -bottom-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full border border-white/15 bg-ink-950 font-mono text-[10px] text-white/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                    {s.title}
                  </h3>
                  <p className="max-w-3xl text-base leading-relaxed text-white/55">
                    {s.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}