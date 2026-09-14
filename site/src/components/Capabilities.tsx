import { Section } from './ui/Section';
import { FadeIn } from './ui/FadeIn';
import { capabilities } from '../content/data';

export function Capabilities() {
  return (
    <Section
      id="capabilities"
      eyebrow="What I do"
      title={
        <>
          Capabilities, refined over <br className="hidden md:block" />
          <span className="text-white/45">a decade of shipping.</span>
        </>
      }
      description="Four areas where I am strongest — the work that consistently moves the needle for production AI systems."
    >
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02] md:grid-cols-2">
        {capabilities.map((c, i) => (
          <FadeIn key={c.title} delay={i * 0.05}>
            <article className="group relative flex h-full flex-col gap-6 bg-ink-950 p-8 transition-colors duration-500 hover:bg-white/[0.025] md:p-12">
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-white transition-all duration-500 group-hover:border-accent-400/40 group-hover:bg-accent-500/10 group-hover:text-accent-200">
                  <c.icon className="h-5 w-5" />
                </span>
                <span className="font-mono text-xs text-white/30">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {c.title}
              </h3>
              <p className="max-w-md text-base leading-relaxed text-white/55">
                {c.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs font-medium text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </article>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}