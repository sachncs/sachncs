import type { ReactNode } from 'react';

type SectionProps = {
  id?: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className = '',
}: SectionProps) {
  return (
    <section id={id} className={`relative py-24 md:py-32 ${className}`}>
      <div className="container-x">
        {(eyebrow || title || description) && (
          <div className="mb-14 max-w-3xl md:mb-20">
            {eyebrow && (
              <div className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                <span className="h-px w-6 bg-white/30" />
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 className="text-balance text-3xl font-semibold leading-[1.05] tracking-tightest text-white md:text-5xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/55 md:text-lg">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}