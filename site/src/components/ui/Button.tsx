import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-tight transition-all duration-300 will-change-transform';

const variants: Record<Variant, string> = {
  primary:
    'bg-white text-ink-950 hover:bg-ink-100 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.4)] active:scale-[0.98]',
  secondary:
    'border border-white/15 text-white hover:border-white/30 hover:bg-white/[0.04] active:scale-[0.98]',
  ghost: 'text-white/80 hover:text-white',
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  children: ReactNode;
};

export function Button({ variant = 'primary', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  trailingIcon?: ReactNode;
  children: ReactNode;
};

export function LinkButton({
  variant = 'primary',
  className = '',
  trailingIcon,
  children,
  ...rest
}: LinkButtonProps) {
  const icon = trailingIcon ?? <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />;
  return (
    <a
      className={`group ${base} ${variants[variant]} ${className}`}
      target={rest.href?.startsWith('http') ? '_blank' : undefined}
      rel={rest.href?.startsWith('http') ? 'noreferrer noopener' : undefined}
      {...rest}
    >
      {children}
      {icon}
    </a>
  );
}