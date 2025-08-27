import React from "react";

export type Severity = "primary" | "secondary" | "danger" | "neutral";
export type Variant = "solid" | "outline" | "ghost";
export type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  severity?: Severity;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  active?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const palette: Record<Severity, { solid: string; outline: string; ghost: string; ring: string; textOnSolid: string }> = {
  primary: {
    solid: "bg-primary-600 hover:bg-primary-700 text-white",
    outline: "border border-primary-300 text-primary-700 hover:bg-primary-50",
    ghost: "text-primary-700 hover:bg-primary-50",
    ring: "focus:ring-primary-400",
    textOnSolid: "text-white",
  },
  secondary: {
    solid: "bg-secondary-300 hover:bg-secondary-200 text-primary-950",
    outline: "border border-secondary-300 text-primary-900 hover:bg-secondary-50",
    ghost: "text-primary-900 hover:bg-secondary-50",
    ring: "focus:ring-secondary-400",
    textOnSolid: "text-primary-950",
  },
  danger: {
    solid: "bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-red-300 text-red-700 hover:bg-red-50",
    ghost: "text-red-700 hover:bg-red-50",
    ring: "focus:ring-red-400",
    textOnSolid: "text-white",
  },
  neutral: {
    solid: "bg-gray-800 hover:bg-gray-900 text-white",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-50",
    ghost: "text-gray-800 hover:bg-gray-100",
    ring: "focus:ring-gray-400",
    textOnSolid: "text-white",
  },
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-2",
  md: "h-10 px-4 text-sm gap-2.5",
  lg: "h-11 px-5 text-base gap-3",
};

export default function Button({
  children,
  severity = "primary",
  variant = "solid",
  size = "md",
  fullWidth = false,
  loading = false,
  active = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  type = "button",
  ...props
}: Readonly<ButtonProps>) {
  const paletteSet = palette[severity];
  const base =
    "inline-flex items-center justify-center rounded-xl font-medium transition select-none focus:outline-none focus:ring-2 disabled:opacity-60 disabled:cursor-not-allowed";
  const variantCls =
    variant === "solid"
      ? paletteSet.solid
      : variant === "outline"
      ? paletteSet.outline
      : paletteSet.ghost;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        base,
        sizes[size],
        variantCls,
        paletteSet.ring,
        fullWidth && "w-full",
        active && variant === "ghost" && "bg-black/5",
        active && variant === "outline" && "bg-black/5",
        className
      )}
      {...props}
    >
      {/* Spinner */}
      {loading && (
        <svg
          className={cx("animate-spin h-4 w-4", variant === "solid" ? paletteSet.textOnSolid : "")}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
        </svg>
      )}

      {/* Left icon */}
      {!loading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}

      {/* Label */}
      <span className="truncate">{children}</span>

      {/* Right icon */}
      {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
}
