import { Italic } from "lucide-react";

/* ---------- Colors (shared by all three components) ---------- */
export const TEXT_COLORS = {
  /* ---------- Heading ---------- */
  dark: "text-[#14213D]", 
  light: "text-[#FFFFFF]",
  /* ---------- Descriptions ---------- */
  "light-muted": "text-[#292929]", 
  muted: "text-[#77736D]",
  "dark-muted": "text-[#C9CED7]",
  /* ---------- Eyebrow ---------- */
  gold: "text-[#C76D4E]", 
  "gold-light": "text-[#D4A373]", // eyebrows on dark backgrounds
  inherit: "",
};

/* ---------- Heading sizes ---------- */
export const HEADING_SIZES = {
  h1: "text-[42px] leading-[1.15] tracking-[-0.015em] md:text-[70px] md:leading-[1.0] md:tracking-[-0.02em]",
  h2: "text-[32px] leading-[1.2] tracking-[-0.01em] md:text-[40px] md:leading-[1.2] md:tracking-normal",
  h3: "text-[20px] leading-[1.3] tracking-normal md:text-[24px] md:leading-[1.2] md:tracking-normal",
  "h3-italic": "text-[20px] leading-[1.3] tracking-normal italic md:text-[24px] md:leading-[1.2] md:tracking-normal",
  h4: "text-[18px] leading-[1.35] md:text-[20px] md:leading-[1.2]",
  h5: "text-[10px] md:text-[12px] md:leading-[1.2] font-semibold",
  none: "", // no size class — use className instead
};

export const HEADING_FONTS = {
  heading: "font-[family-name:var(--font-heading)] font-normal",
  sans: "font-sans font-bold",
};

/* ---------- Eyebrow sizes ---------- */
export const EYEBROW_SIZES = {
  sm: "montserrat text-[8px] font-medium leading-none md:text-[10px]",
  md: "montserrat text-[10px] font-semibold leading-none tracking-[0.1em] md:text-[12px] md:tracking-[0.1em]",
  none: "",
};

/* ---------- Description sizes ---------- */
export const DESCRIPTION_SIZES = {
  xsm: "text-[10px] leading-[1.7] tracking-normal md:text-[10px]",
  sm: "text-[10px] leading-[1.7] tracking-normal md:text-[12px]",
  md: "text-[11px] leading-[1.9] tracking-normal md:text-[14px]",
  none: "",
};

/* ---------- Default colors per component ---------- */
export const DEFAULTS = {
  headingColor: "dark",
  eyebrowColor: "gold",
  descriptionColor: "muted",
};