import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variants: Record<Variant, string> = {
  primary:
    'bg-lake-600 text-white hover:bg-lake-500 shadow-sm shadow-lake-900/30 active:bg-lake-700',
  secondary:
    'bg-surface-overlay text-text-secondary border border-border hover:border-border-light hover:text-text-primary',
  ghost:
    'text-text-muted hover:text-text-secondary hover:bg-surface-overlay',
  danger:
    'bg-danger-600/10 text-danger-500 border border-danger-600/20 hover:bg-danger-600/20',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
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
  const {
    variant = 'primary',
    size = 'md',
    icon,
    children,
    className,
    ...rest
  } = props;

  const classes = cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lake-500/50',
    'disabled:pointer-events-none disabled:opacity-50',
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
