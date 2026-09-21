import { useEffect, useRef, useState } from 'react';
import { navigation, profile } from '../../data/profile';
export function Navigation({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); button.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  return <header className="site-header" ref={header}>
    <div className="shell nav-inner">
      <a className="wordmark" href="/" aria-label={`${profile.name}, home`}><span className="brand-mark" aria-hidden="true">s.</span>{profile.name}<span className="wordmark-dot">/</span></a>
      <button ref={button} className="menu-button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
      <nav id="primary-navigation" className={open ? 'primary-nav is-open' : 'primary-nav'} aria-label="Primary">
        {navigation.map(([href, label]) => <a key={href} href={href} aria-current={(path === href || (href === '/writing' && path.startsWith('/writing/'))) ? 'page' : undefined} onClick={() => setOpen(false)}>{label}{href === '/connect' && <span aria-hidden="true"> ↗</span>}</a>)}
      </nav>
    </div>
  </header>;
}
