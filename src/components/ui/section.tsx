import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h2 className="text-lg font-semibold font-display text-text-primary mb-4">{title}</h2>
      {children}
    </section>
  );
}
