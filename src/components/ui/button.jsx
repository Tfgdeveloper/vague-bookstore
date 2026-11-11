import * as React from "react";
import { cn } from "../../lib/cn";

// Two variants, matching the hero designs:
//   primary → gold filled button
//   outline → light outline for dark/maroon backgrounds
const variants = {
  primary:
    "montserrat bg-[#D4A373] text-[#14213D] ",
  outline:
    "montserrat border border-[#E4DDD3] bg-transparent text-[#14213D] ",
  gradient:
    "montserrat border border-[#f8f4ed]/80 gradient-background text-[#f8f4ed]  hover:border-none hover:text-[#fff] focus-visible:ring-[#f8f4ed]",
};

const sizes = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-11 px-6 text-xs",
  lg: "h-12 px-7 text-[13px]",
  icon: "h-10 w-10",
};

export function buttonClasses(variant = "primary", size = "md") {
  return cn(
  "montserrat group inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap text-[14px] 2xl:text-[16px]",

  // Animation: lift + shadow on hover, press down on click
  "transition-[background-color,border-color,color,box-shadow,transform,translate,scale] duration-200 ease-out",
  "hover:-translate-y-0.5 hover:shadow-[0_8px_18px_-8px_rgba(58,13,18,0.55)]",
  "active:translate-y-0 active:scale-[0.98] active:shadow-none",

  // Icons inside the button (arrows, external-link) slide right on hover
  "[&>svg]:transition-transform [&>svg]:duration-200 hover:[&>svg]:translate-x-0.5",

  // Turn the motion off for people who prefer reduced motion
  "motion-reduce:transition-colors motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",

  "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#3a0d12]",
  "disabled:pointer-events-none disabled:opacity-50",
  variants[variant] ?? variants.primary,
  sizes[size] ?? sizes.md
);
}

export const Button = React.forwardRef(({ variant, size, className, type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={cn(buttonClasses(variant, size), className)} {...props} />
));
Button.displayName = "Button";