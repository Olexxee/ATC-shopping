import type { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function Section({ children, className = "", ...props }: SectionProps) {
  return (
    <section className={`py-16 md:py-20 lg:py-24 ${className}`} {...props}>
      {children}
    </section>
  );
}
