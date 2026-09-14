import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { Monogram } from './Monogram';
import { profile } from '../content/data';

const navItems = [
  { href: '#work', label: 'Work' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#process', label: 'Process' },
  { href: '#engage', label: 'Engage' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'pt-3' : 'pt-6'
      }`}
    >
      <div className="container-x">
        <div
          className={`flex items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 ${
            scrolled
              ? 'border-white/10 bg-ink-950/70 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]'
              : 'border-transparent bg-transparent'
          }`}
        >
          <a href="#top" className="flex items-center gap-3 pl-2 pr-4 py-1">
            <Monogram size={28} />
            <span className="hidden text-sm font-medium tracking-tight text-white sm:inline">
              {profile.name}
            </span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 pr-1">
            <a
              href={profile.links.github}
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer noopener"
              className="grid h-9 w-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={profile.links.linkedin}
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer noopener"
              className="hidden h-9 w-9 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white sm:grid"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="ml-1 inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-ink-950 transition-all hover:bg-ink-100"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Get in touch</span>
            </a>
          </div>
        </div>
      </div>
    </motion.header>
  );
}