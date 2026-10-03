import { forwardRef, type ButtonHTMLAttributes, type ElementType } from "react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonSize = "sm" | "md" | "lg" | "icon";

type ButtonRounded = "none" | "sm" | "md" | "full";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: ButtonRounded;
  fullWidth?: boolean;
  as?: ElementType;
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--brand)]
    text-white
    hover:bg-[var(--brand-hover)]
    active:bg-[var(--brand-800)]
  `,

  secondary: `
    bg-[var(--surface)]
    text-[var(--text-primary)]
    hover:bg-[var(--border)]
    active:bg-[var(--border-strong)]
  `,

  outline: `
    border
    border-[var(--border)]
    bg-white
    text-[var(--text-primary)]
    hover:border-[var(--border-strong)]
    hover:bg-[var(--surface)]
    active:bg-[var(--border)]
  `,

  ghost: `
    bg-transparent
    text-[var(--text-primary)]
    hover:bg-[var(--surface)]
    hover:text-[var(--brand)]
    active:bg-[var(--brand-soft)]
  `,
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-sm",
  icon: "h-10 w-10 p-0",
};

const roundedStyles: Record<ButtonRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  full: "rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      rounded = "md",
      fullWidth = false,
      className,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium",
          "transition-colors duration-200",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-[var(--brand)]",
          "focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
