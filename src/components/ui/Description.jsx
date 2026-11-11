import { DESCRIPTION_SIZES, TEXT_COLORS, DEFAULTS } from "./typography.config";
import { cx, getTag } from "./utils";

/**
 * Description — body / supporting paragraph text.
 *
 * size  — "xs" | "sm" | "md" | "lg"   (default "md")
 * color — "muted" (light bg) | "light-muted" (dark bg) | any TEXT_COLORS key
 * as    — tag, default "p"
 * variants — optional framer-motion variants
 *
 * <Description>Every title hand-reviewed by our literary council</Description>
 * <Description size="lg" color="light-muted" className="mt-5 max-w-lg" variants={item}>…</Description>
 */
export function Description({
  as = "p",
  size = "md",
  color = DEFAULTS.descriptionColor,
  variants,
  className,
  children,
  ...props
}) {
  const Tag = getTag(as, variants);
  return (
    <Tag
      variants={variants}
      className={cx("font-normal", DESCRIPTION_SIZES[size], TEXT_COLORS[color], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Description;