import { motion } from 'framer-motion';
import { LinkButton } from './ui/Button';
import { profile } from '../content/data';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-36 md:pt-44">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 grid-bg mask-radial-fade opacity-60" />
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-[-20%] h-[720px] w-[1100px] -translate-x-1/2 rounded-[40%] bg-gradient-to-br from-accent-500/20 via-accent-700/10 to-transparent blur-3xl animate-aurora"
        />
        <div className="absolute inset-0 noise opacity-[0.04] mix-blend-overlay" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-x">
        <motion.div
          {...fade(0)}
          className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {profile.status}
        </motion.div>

        <motion.h1
          {...fade(0.05)}
          className="max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-tightest text-white md:text-7xl lg:text-[88px]"
        >
          {profile.name}
          <span className="block text-white/55">— {profile.role}.</span>
        </motion.h1>

        <motion.p
          {...fade(0.15)}
          className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/55 md:mt-8 md:text-xl"
        >
          {profile.tagline} <span className="text-white/70">{profile.summary}</span>
        </motion.p>

        <motion.div {...fade(0.25)} className="mt-10 flex flex-wrap items-center gap-3">
          <LinkButton href={`mailto:${profile.email}`} variant="primary">
            Start a conversation
          </LinkButton>
          <LinkButton href="#work" variant="secondary">
            See selected work
          </LinkButton>
        </motion.div>

        <motion.div
          {...fade(0.35)}
          className="mt-20 grid grid-cols-2 gap-6 border-t border-white/[0.06] pt-8 md:mt-28 md:grid-cols-4"
        >
          <HeroStat value="50k QPS" label="Retrieval index" />
          <HeroStat value="< 800ms" label="p99 latency" />
          <HeroStat value="~70%" label="Incident reduction" />
          <HeroStat value="< 1 day" label="Eval cycles" />
        </motion.div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-2xl font-semibold tracking-tighter text-white md:text-3xl">{value}</span>
      <span className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</span>
    </div>
  );
}