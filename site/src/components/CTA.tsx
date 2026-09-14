import { LinkButton } from './ui/Button';
import { profile } from '../content/data';
import { motion } from 'framer-motion';

export function CTA() {
  return (
    <section className="relative isolate overflow-hidden py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-1/2 top-1/2 h-[680px] w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-[40%] bg-gradient-to-br from-accent-500/25 via-accent-700/15 to-transparent blur-3xl"
        />
        <div className="absolute inset-0 grid-bg mask-radial-fade opacity-40" />
        <div className="absolute inset-0 noise opacity-[0.04] mix-blend-overlay" />
      </div>

      <div className="container-x">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Currently accepting new engagements
          </span>

          <h2 className="text-balance text-4xl font-semibold leading-[1.04] tracking-tightest text-white md:text-6xl">
            Let&apos;s build something{' '}
            <span className="gradient-accent">worth shipping.</span>
          </h2>

          <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/55 md:text-lg">
            Send a paragraph of context, the question, and a proposed next step. The clearer
            the brief, the faster the reply.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href={`mailto:${profile.email}`} variant="primary">
              Start a conversation
            </LinkButton>
            <LinkButton href={profile.links.linkedin} variant="secondary">
              Connect on LinkedIn
            </LinkButton>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] text-center">
            <Cell label="Reply" value="2–3 days" />
            <Cell label="Best email" value="Context + ask + next step" />
            <Cell label="Time zone" value="UTC" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-ink-950 px-5 py-4 md:px-8">
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40 md:text-xs">
        {label}
      </span>
      <span className="text-sm font-medium text-white md:text-base">{value}</span>
    </div>
  );
}