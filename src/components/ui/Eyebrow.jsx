import { EYEBROW_SIZES, TEXT_COLORS, DEFAULTS } from "./typography.config";
import { cx, getTag } from "./utils";

/**
 * Eyebrow — the small uppercase label above a heading.
 *
 * size  — "sm" | "md" | "lg"   (default "sm")
 * color — "gold" (light bg) | "gold-light" (dark bg) | any TEXT_COLORS key
 * as    — tag, default "p"
 * variants — optional framer-motion variants
 *
 * <Eyebrow>Cabinet of curation</Eyebrow>
 * <Eyebrow size="md" color="gold-light" variants={item}>Book of the month</Eyebrow>
 */
export function Eyebrow({
  as = "p",
  size = "sm",
  color = DEFAULTS.eyebrowColor,
  variants,
  className,
  children,
  ...props
}) {
  const Tag = getTag(as, variants);
  return (
    <Tag
      variants={variants}
      className={cx("font-medium uppercase", EYEBROW_SIZES[size], TEXT_COLORS[color], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Eyebrow;