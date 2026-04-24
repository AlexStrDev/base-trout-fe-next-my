import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary: [
    'bg-lake-600 text-white',
    'shadow-[0_1px_2px_rgba(0,0,0,0.25),0_1px_6px_rgba(29,116,82,0.2)]',
    'hover:bg-lake-500 hover:shadow-[0_2px_10px_rgba(29,116,82,0.3)]',
    'active:scale-[0.97] active:bg-lake-700',
  ].join(' '),
  secondary: [
    'bg-surface-overlay text-text-secondary border border-border',
    'hover:border-border-light hover:text-text-primary hover:bg-surface-card',
    'active:scale-[0.97]',
  ].join(' '),
  ghost: [
    'text-text-muted',
    'hover:text-text-secondary hover:bg-surface-overlay',
    'active:scale-[0.97]',
  ].join(' '),
  danger: [
    'bg-danger-600/8 text-danger-500 border border-danger-600/25',
    'hover:bg-danger-600/15 hover:border-danger-600/40',
    'active:scale-[0.97]',
  ].join(' '),
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-9 px-4 text-sm gap-2 rounded-lg',
  lg: 'h-10 px-5 text-sm gap-2 rounded-xl',
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', icon, children, className, ...rest } = props;

  const classes = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
    'disabled:pointer-events-none disabled:opacity-45',
    variants[variant],
    sizes[size],
    className,
  );

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  const { href: _, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button className={classes} {...buttonRest}>
      {icon}
      {children}
    </button>
  );
}
