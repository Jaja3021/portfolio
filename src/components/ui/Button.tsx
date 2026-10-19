import { ArrowRightIcon as ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { type ButtonHTMLAttributes, type ComponentProps } from "react";

type Variant = "primary" | "outline" | "ghost" | "text";
type Size = "sm" | "md" | "lg";

// One button language site-wide: pill shape, solid green or green outline,
// and an optional <ButtonArrow /> that nudges right on hover.
const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  outline: "border border-primary bg-transparent text-primary hover:bg-primary-soft",
  ghost: "bg-transparent text-foreground/80 hover:text-primary",
  text: "bg-transparent p-0 h-auto text-primary hover:text-primary-hover",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-6 text-sm",
  lg: "h-[52px] px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

function classesFor(variant: Variant, size: Size, className: string) {
  const sizeClass = variant === "text" ? "text-sm" : sizes[size];
  return `${base} ${variants[variant]} ${sizeClass} ${className}`;
}

type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return <button className={classesFor(variant, size, className)} {...props} />;
}

type LinkButtonProps = CommonProps & ComponentProps<typeof Link>;

export function LinkButton({ variant = "primary", size = "md", className = "", ...props }: LinkButtonProps) {
  return <Link className={classesFor(variant, size, className)} {...props} />;
}

export function ButtonArrow({ className = "" }: { className?: string }) {
  return (
    <ArrowRight
      className={`h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 ${className}`}
    />
  );
}
