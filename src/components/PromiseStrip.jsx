import { Eyebrow, Description } from "./ui/typography";

const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";

const DEFAULT_ITEMS = [
  {
    title: "Our curation",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard since the 1500s.",
  },
  {
    title: "Our authors",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard since the 1500s.",
  },
  {
    title: "Our readers",
    text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard since the 1500s.",
  },
];

/**
 * Three-column maroon band with a small label and an italic line under each.
 * <PromiseStrip items={[{ title: "...", text: "..." }]} />
 */
export default function PromiseStrip({ items = DEFAULT_ITEMS }) {
  if (!items.length) return null;

  return (
    <section className="gradient-background">
      <ul className={`${CONTAINER} grid grid-cols-1 gap-8 py-12 sm:grid-cols-3 sm:gap-10 sm:py-14`}>
        {items.map((item) => (
          <li key={item.title} className=" border border-white/10 p-4">
            <Eyebrow size="md" color="gold">
              {item.title}
            </Eyebrow>
            <Description
              size="md"
              color="light-muted"
              className="mt-3 max-w-sm font-[family-name:var(--font-heading)] italic"
            >
              {item.text}
            </Description>
          </li>
        ))}
      </ul>
    </section>
  );
}