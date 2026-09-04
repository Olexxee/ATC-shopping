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
  primary: "bg-neutral-950 text-white hover:bg-neutral-800",

  secondary: "bg-neutral-100 text-neutral-950 hover:bg-neutral-200",

  outline:
    "border border-neutral-300 bg-transparent text-neutral-950 hover:bg-neutral-50",

  ghost: "bg-transparent text-neutral-800 hover:bg-neutral-100",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-11 w-11 p-0",
};


export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      rounded = "md",
      fullWidth = false,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium",
          "transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          rounded,
          fullWidth && "w-full",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
