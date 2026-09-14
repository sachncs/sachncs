import { Github, Linkedin, Mail } from 'lucide-react';
import { Monogram } from './Monogram';
import { profile } from '../content/data';

const cols = [
  {
    title: 'Site',
    links: [
      { label: 'Work', href: '#work' },
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Process', href: '#process' },
      { label: 'Engage', href: '#engage' },
    ],
  },
  {
    title: 'Code',
    links: [
      { label: 'GitHub', href: profile.links.github, external: true },
      { label: 'Repositories', href: profile.links.repositories, external: true },
      { label: 'LinkedIn', href: profile.links.linkedin, external: true },
    ],
  },
  {
    title: 'Stack',
    links: [
      { label: 'Daily — Python, TypeScript', href: '#' },
      { label: 'Weekly — Rust, Go, K8s', href: '#' },
      { label: 'Occasional — PyTorch, CUDA', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-16">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <Monogram size={32} />
              <span className="text-base font-medium tracking-tight text-white">
                {profile.name}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Applied AI Architect & Engineer. Available for fractional advisory and
              select paid pilots through next quarter.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={profile.links.github}
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={profile.links.linkedin}
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition-all hover:border-white/30 hover:text-white"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-xs font-medium uppercase tracking-[0.16em] text-white/40">
                {c.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={'external' in l && l.external ? '_blank' : undefined}
                      rel={'external' in l && l.external ? 'noreferrer noopener' : undefined}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/40 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} {profile.name}. Built and shipped with intent.</span>
          <span className="font-mono">
            <a
              href="https://github.com/sachncs/sachncs"
              target="_blank"
              rel="noreferrer noopener"
              className="hover:text-white/70"
            >
              github.com/sachncs/sachncs
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}