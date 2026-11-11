import { HEADING_SIZES, HEADING_FONTS, TEXT_COLORS, DEFAULTS } from "./typography.config";
import { cx, getTag } from "./utils";

/**
 * Heading
 *
 * as     — the HTML tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" (default "h2")
 * size   — visual size from HEADING_SIZES. Defaults to the same as `as`,
 *          so <Heading as="h2"> looks like an h2. Override when SEO needs
 *          a different tag: <Heading as="h1" size="display">
 * color  — key from TEXT_COLORS: "dark" | "light" | "maroon" | ...
 * font   — "heading" (serif, default) | "sans"
 * variants — optional framer-motion variants; makes it animate.
 *
 * <Heading as="h1" size="display" color="light" variants={item}>Title</Heading>
 * <Heading as="h2">The Autumn Staff Selections</Heading>
 * <Heading as="h5" font="sans">EXPERTLY CURATED</Heading>
 */
export function Heading({
  as = "h2",
  size,
  color = DEFAULTS.headingColor,
  font = "heading",
  variants,
  className,
  children,
  ...props
}) {
  const Tag = getTag(as, variants);
  const sizeKey = size ?? (HEADING_SIZES[as] !== undefined ? as : "h2");

  return (
    <Tag
      variants={variants}
      className={cx(HEADING_FONTS[font], HEADING_SIZES[sizeKey], TEXT_COLORS[color], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default Heading;