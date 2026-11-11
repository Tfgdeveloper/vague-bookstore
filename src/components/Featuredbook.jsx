import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarDays, ExternalLink } from "lucide-react";
import { buttonClasses } from "./ui/button";
import { Eyebrow, Description } from "./ui/typography";
import { BOOKS, GENRES, getAuthor } from "../data/books";

/**
 * FeaturedBook — dark "reading room" section with a book standing in a photo.
 *
 * Fills itself in from books.js when you give it a book id:
 *   <FeaturedBook
 *     bookId="looking-for-love-a-unique-literary-voyage"
 *     eyebrow="The Aurelia Reading Room"
 *     heading={"One book.\nA thousand conversations."}
 *     note="This month’s shared escape"
 *     background="/images/reading-room.jpg"
 *     primaryAction={{ label: "Join the reading room", to: "/book-club" }}
 *   />
 *
 * From books.js: the cover, the genre tags on the photo, the description,
 * the book title + author box, the published date, and a buy button
 * (if you don't pass primaryAction).
 * Use "\n" in `heading` to choose where the line breaks.
 */

const defaultTheme = {
  bg: "#14213D",
  "image-bg": "#E6DCCB",
};

const isExternal = (href = "") => /^https?:\/\//.test(href);

// "2022-09-01" → "September 1, 2022"; "October 31, 2026" stays as it is
function formatPublished(value) {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(`${value}T00:00:00`);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  return value;
}

// "fiction" → "Fiction", "children" → "Children"
const genreName = (slug) => (GENRES.find((g) => g.slug === slug)?.name ?? slug).replace(/\s+Books$/i, "");
const buyLabel = (label = "") => (/amazon/i.test(label) ? "Buy on Amazon" : `Buy from ${label}`);

function Action({ action, className, children }) {
  if (!action) return null;
  if (action.to) {
    return (
      <Link to={action.to} className={className} onClick={action.onClick}>
        {children}
      </Link>
    );
  }
  if (action.href) {
    const external = isExternal(action.href);
    return (
      <a
        href={action.href}
        className={className}
        onClick={action.onClick}
        {...(external && { target: "_blank", rel: "noopener noreferrer sponsored" })}
      >
        {children}
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={action.onClick}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Book standing in the photo, slightly tilted                         */
/* ------------------------------------------------------------------ */
function BookMockup({ cover, title, to, tilt = -5 }) {
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const showImage = cover && !failed;

  const book = (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 50, rotate: tilt - 8 }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      whileHover={reduce ? undefined : { rotate: tilt / 3, y: -8 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 80, damping: 16 }}
      className="relative aspect-[2/3] w-full"
    >
      {/* Page block peeking out on the right */}
      <div
        aria-hidden="true"
        className="absolute inset-y-[1.5%] -right-[3.5%] w-[5%] rounded-r-sm bg-[repeating-linear-gradient(to_right,#f7f2e8_0px,#f7f2e8_1px,#e2d8c8_1px,#e2d8c8_2px)]"
      />
      {/* Cover */}
      <div className="absolute inset-0 overflow-hidden rounded-[3px] bg-[#1F2A44] shadow-[22px_30px_45px_-16px_rgba(20,12,10,0.6),0_2px_6px_rgba(0,0,0,0.25)] ring-[6px] ring-[#F4EEE3]">
        {showImage ? (
          <img src={cover} alt="" loading="lazy" draggable="false" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col justify-between p-[12%] text-white">
            <span className="font-[family-name:var(--font-heading)] text-[clamp(1.1rem,2vw,1.8rem)] leading-tight">{title}</span>
            <span className="h-px w-1/2 bg-white/40" />
          </div>
        )}
        {/* Gloss */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.2)_0%,transparent_35%,transparent_70%,rgba(0,0,0,0.12)_100%)]" />
      </div>
    </motion.div>
  );

  return to ? (
    <Link to={to} aria-label={`View ${title}`} className="block w-[38%] max-w-[240px] rounded-md outline-none focus-visible:ring-4 focus-visible:ring-[#C9A36B]/60">
      {book}
    </Link>
  ) : (
    <div className="w-[38%] max-w-[240px]">{book}</div>
  );
}

/* ------------------------------------------------------------------ */
/* FeaturedBook                                                        */
/* ------------------------------------------------------------------ */
export default function FeaturedBook({
  bookId,
  eyebrow = "Featured book",
  heading = "One book.\nA thousand conversations.", // big headline (never the book title)
  description, // paragraph under the headline; defaults to the book description
  note, // small text after the author in the book box, e.g. "This month’s shared escape"
  event, // replaces the published date line, e.g. "November 28 · 7 pm EST · Online"
  label, // replaces the genre tags on the photo, e.g. "The November selection"
  title,
  author,
  cover,
  background,
  backgroundAlt = "",
  primaryAction,
  secondaryAction,
  imagePosition = "left",
  headingLevel = "h2",
  tilt = -5,
  theme = {},
  className = "",
}) {
  const reduce = useReducedMotion();

  // ---- Fill in from books.js ----
  const book = bookId ? BOOKS.find((b) => b.id === bookId) : null;
  if (bookId && !book && import.meta.env.DEV) {
    console.warn(`FeaturedBook: no book with id "${bookId}" in books.js`);
  }

  const data = {
    title: title ?? book?.title,
    author: author ?? (book && (getAuthor(book.authorId)?.name ?? book.author ?? book.authorName)),
    description: description ?? book?.description,
    cover: cover ?? book?.cover,
    primaryAction:
      primaryAction ??
      (book?.buyLinks?.[0] && { label: buyLabel(book.buyLinks[0].label), href: book.buyLinks[0].url }),
    secondaryAction:
      secondaryAction ?? (book && primaryAction && { label: "View book details", to: `/book/${book.id}` }),
  };

  if (!data.title) return null;

  const byline = [data.author, note].filter(Boolean).join(" · ");
  const published = formatPublished(book?.publicationDate ?? book?.publishedAt);
  const dateLine = event ?? (published && `Published ${published}`);
  const tags = label ? [label] : (book?.genres ?? []).map(genreName);

  const vars = Object.fromEntries(Object.entries({ ...defaultTheme, ...theme }).map(([k, v]) => [`--fb-${k}`, v]));

  const fade = (delay) =>
    reduce
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
        };

  const HeadingTag = headingLevel;

  return (
    <section style={vars} className={`bg-[var(--fb-bg)] py-14 sm:py-20 ${className}`}>
      <div className="mx-auto grid max-w-[1700px] grid-cols-1 items-center gap-10 px-5 sm:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16 lg:px-16 xl:gap-24">
        {/* ---------- Photo + book ---------- */}
        <motion.div
          {...fade(0)}
          className={`relative flex aspect-[4/3.6] items-center justify-center overflow-hidden rounded-xl bg-[var(--fb-image-bg)] ${imagePosition === "right" ? "lg:order-2" : ""}`}
        >
          {background ? (
            <img
              src={background}
              alt={backgroundAlt}
              aria-hidden={backgroundAlt ? undefined : "true"}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            // No photo: warm light falling on linen
            <div aria-hidden="true" className="absolute inset-0">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_15%,rgba(255,255,255,0.55),transparent_55%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[32%] bg-gradient-to-b from-[#d8ccb8] to-[#cbbda6]" />
            </div>
          )}

          <BookMockup cover={data.cover} title={data.title} to={book ? `/book/${book.id}` : undefined} tilt={tilt} />

          {tags.length > 0 && (
            <ul aria-label="Genres" className="absolute bottom-4 left-4 flex flex-wrap gap-2 sm:bottom-6 sm:left-6">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="font-button rounded-sm bg-white px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#14213D] shadow-sm"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {/* ---------- Text ---------- */}
        <div className="text-white">
          {eyebrow && (
            <motion.div {...fade(0.1)}>
              <Eyebrow size="md" color="gold-light" className="mb-5">
                {eyebrow}
              </Eyebrow>
            </motion.div>
          )}

          <motion.div {...fade(0.18)}>
            <HeadingTag className="whitespace-pre-line font-[family-name:var(--font-heading)] text-[38px] font-normal leading-[1.12] tracking-[-0.015em] text-white sm:text-[48px] lg:text-[56px] lg:tracking-[-0.02em]">
              {heading}
            </HeadingTag>
          </motion.div>

          {data.description && (
            <motion.div {...fade(0.26)}>
              <Description size="md" color="inherit" className="mt-6 max-w-xl line-clamp-4 text-white/75">
                {data.description}
              </Description>
            </motion.div>
          )}

          {/* Book title + author */}
          <motion.div {...fade(0.34)} className="mt-8 border-l-2 border-[#C9A36B] pl-5">
            <p className="font-[family-name:var(--font-heading)] text-[22px] leading-snug text-white">
              {book ? (
                <Link
                  to={`/book/${book.id}`}
                  className="rounded outline-none transition-colors hover:text-[#C9A36B] focus-visible:ring-2 focus-visible:ring-[#C9A36B]"
                >
                  {data.title}
                </Link>
              ) : (
                data.title
              )}
            </p>
            {byline && <p className="mt-1 text-[13px] text-white/65">{byline}</p>}
          </motion.div>

          {dateLine && (
            <motion.p {...fade(0.4)} className="mt-6 flex items-center gap-2.5 text-[13px] text-white/75">
              <CalendarDays aria-hidden="true" className="h-4 w-4 shrink-0 text-[#C9A36B]" />
              {dateLine}
            </motion.p>
          )}

          {(data.primaryAction || data.secondaryAction) && (
            <motion.div {...fade(0.48)} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Action action={data.primaryAction} className={buttonClasses("primary", "lg")}>
                {data.primaryAction?.label}
                {data.primaryAction?.href && isExternal(data.primaryAction.href) ? (
                  <ExternalLink aria-hidden="true" className="h-4 w-4" />
                ) : (
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                )}
              </Action>
              <Action
                action={data.secondaryAction}
                className="font-button inline-flex items-center gap-1.5 rounded text-[13px] font-semibold text-white/80 underline-offset-4 outline-none hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-[#C9A36B]"
              >
                {data.secondaryAction?.label}
              </Action>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}