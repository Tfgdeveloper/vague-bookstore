import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";
import { Description } from "./Description";
import { cx } from "./utils";

/**
 * SectionHeading — Eyebrow + Heading + Description together, with an
 * optional action on the right (link, arrows…). Replaces ShelfHeading.
 *
 * tone  — "onLight" (default) | "onDark": picks matching colors for all three
 * align — "left" | "center"
 *
 * <SectionHeading
 *   eyebrow="Fresh off the press"
 *   title="Freshly Shelved Curation"
 *   action={<Arrows />}
 * />
 */
const TONES = {
  onLight: { eyebrow: "gold", heading: "dark", description: "muted"  },
  onDark: { eyebrow: "gold-light", heading: "light", description: "light-muted" },
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as = "h2",
  size,
  eyebrowSize = "md",
  tone = "onLight",
  align = "left",
  className,
}) {
  const colors = TONES[tone];
  const center = align === "center";

  return (
    <div
      className={cx(
        "mb-7 flex flex-wrap gap-x-6 gap-y-3 sm:mb-9",
        center ? "flex-col items-center text-center" : "items-end justify-between",
        className
      )}
    >
      <div className={center ? "max-w-2xl" : "max-w-3xl"}>
        {eyebrow && <Eyebrow color={colors.eyebrow} size={eyebrowSize}>{eyebrow}</Eyebrow>}
        <Heading as={as} size={size} color={colors.heading} className={eyebrow ? "mt-[12px] mb-5" : ""}>
          {title}
        </Heading>
        {description && (
          <Description color={colors.description} className="mt-3">
            {description}
          </Description>
        )}
      </div>
      {action}
    </div>
  );
}

export default SectionHeading;