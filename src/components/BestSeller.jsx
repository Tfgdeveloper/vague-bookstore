import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "./ui/button";
import { Eyebrow, Description } from "./ui/typography";
import { GENRES, getAuthor, getBooksByAuthor } from "../data/books";

/**
 * BestSeller — author spotlight.
 *
 *   <BestSeller authorId="donald-g-newman" />
 *
 * From books.js: name, photo, bio, their books, and the stats
 * (number of books, number of genres). Any prop overrides the data:
 *   eyebrow, heading, bio, quote, photo, books, stats, badge, caption, actionLabel
 *
 * Only pass a `quote` the author really said (with their permission).
 */

const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";
const EASE = [0.22, 1, 0.36, 1];

const initials = (name = "") => {
  const words = name
    .replace(/^(Dr|Col|Capt|Mr|Mrs|Ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !/^(and|&)$/i.test(w));
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
};

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/* ------------------------------------------------------------------ */
/* Small cover with a fallback                                         */
/* ------------------------------------------------------------------ */
function Cover({ book }) {
  const [failed, setFailed] = useState(false);
  if (!book.cover || failed) {
    return (
      <div className="flex aspect-[2/3] w-full flex-col justify-between bg-[#14213D] p-[12%] text-white">
        <span className="font-[family-name:var(--font-heading)] text-[9px] leading-tight sm:text-[10px]">{book.title}</span>
        <span className="h-px w-1/2 bg-white/40" />
      </div>
    );
  }
  return (
    <img
      src={book.cover}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="aspect-[2/3] w-full object-cover"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Fanned stack of books — spreads out on hover                         */
/* ------------------------------------------------------------------ */
function BookFan({ books, authorName }) {
  const reduce = useReducedMotion();
  const n = books.length;
  const mid = (n - 1) / 2;

  return (
    <motion.ul
      aria-label={`Books by ${authorName}`}
      initial="rest"
      whileHover={reduce ? undefined : "spread"}
      animate="rest"
      className="relative flex h-[92px] w-full items-end sm:h-[104px]"
    >
      {books.map((book, i) => {
        const offset = i - mid;
        return (
          <motion.li
            key={book.id}
            variants={{
              rest: { x: i * 34, rotate: offset * 5, y: Math.abs(offset) * 3 },
              spread: { x: i * 58, rotate: offset * 2, y: 0 },
            }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="absolute bottom-0 left-0 w-[58px] origin-bottom sm:w-[66px]"
            style={{ zIndex: i + 1 }}
          >
            <Link
              to={`/book/${book.id}`}
              aria-label={book.title}
              title={book.title}
              className="block overflow-hidden rounded-[2px] shadow-[0_8px_16px_-6px_rgba(20,33,61,0.5)] outline-none transition-transform duration-200 hover:-translate-y-2 focus-visible:ring-2 focus-visible:ring-[#C9A36B] focus-visible:ring-offset-2"
            >
              <Cover book={book} />
            </Link>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}

/* ------------------------------------------------------------------ */
/* Big photo with a fallback                                           */
/* ------------------------------------------------------------------ */
function Photo({ src, name }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_30%_20%,#3a4a6b,#14213D_70%)] font-[family-name:var(--font-heading)] text-[96px] text-white/25">
        {initials(name)}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
    />
  );
}

/* ------------------------------------------------------------------ */
/* BestSeller                                                          */
/* ------------------------------------------------------------------ */
export default function BestSeller({
  authorId,
  eyebrow = "Author of the month",
  heading, // defaults to the author's name
  bio,
  quote, // optional, only a real quote from the author
  photo,
  books,
  stats, // [{ value: "4", label: "books on our shelves" }, ...]
  badge = "Author of the month",
  caption, // line on the photo card; defaults to "Meet <first name>."
  actionLabel = "Explore author",
}) {
  const reduce = useReducedMotion();

  // ---- Fill in from books.js ----
  const author = authorId ? getAuthor(authorId) : null;
  if (authorId && !author && import.meta.env.DEV) {
    console.warn(`BestSeller: no author with id "${authorId}" in books.js`);
  }

  const name = author?.name;
  const authorBooks = books ?? (author ? getBooksByAuthor(author.id) : []);
  if (!name && !heading) return null;

  const genreCount = new Set(authorBooks.flatMap((b) => b.genres ?? [])).size;
  const genreNames = [...new Set(authorBooks.flatMap((b) => b.genres ?? []))]
    .map((s) => (GENRES.find((g) => g.slug === s)?.name ?? s).replace(/\s+Books$/i, ""))
    .slice(0, 2)
    .join(" & ");

  // Stats come from your real data unless you pass your own
  const shownStats =
    stats ??
    [
      { value: String(authorBooks.length), label: authorBooks.length === 1 ? "book on our shelves" : "books on our shelves" },
      genreCount > 0 && { value: String(genreCount), label: genreCount === 1 ? "genre" : "genres" },
      genreNames && { value: genreNames, label: "what they write", small: true },
    ].filter(Boolean);

  const firstName = name?.replace(/^(Dr|Col|Capt|Mr|Mrs|Ms)\.?\s+/i, "").split(/\s+/)[0];
  const cardLine = caption ?? (firstName ? `Meet ${firstName}.` : "");
  const shownBooks = authorBooks.slice(0, 5);

  const fade = (delay) =>
    reduce
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.35 },
          transition: { duration: 0.6, delay, ease: EASE },
        };

  return (
    <section className="bg-[#FAF7F2] py-16 sm:py-20 lg:py-24">
      <div className={`${CONTAINER} grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-24`}>
        {/* ---------- Text ---------- */}
        <div className="text-center lg:text-left">
          <motion.div {...fade(0)}>
            <Eyebrow size="md" color="inherit" className="mb-4 text-[#D9773B]">
              {eyebrow}
            </Eyebrow>
          </motion.div>

          <motion.h2
            {...fade(0.08)}
            className="font-[family-name:var(--font-heading)] text-[38px] font-normal leading-[1.12] tracking-[-0.015em] text-[#14213D] [text-wrap:balance] md:text-[56px] md:tracking-[-0.02em]"
          >
            {heading ?? name}
          </motion.h2>

          {(bio ?? author?.bio) && (
            <motion.div {...fade(0.16)}>
              <Description size="md" color="muted" className="mx-auto mt-6 max-w-xl lg:mx-0">
                {bio ?? author.bio}
              </Description>
            </motion.div>
          )}

          {quote && (
            <motion.blockquote
              {...fade(0.22)}
              className="mx-auto mt-7 max-w-lg font-[family-name:var(--font-heading)] text-[22px] italic leading-snug text-[#14213D] lg:mx-0"
            >
              “{quote}”
            </motion.blockquote>
          )}

          {shownStats.length > 0 && (
            <motion.dl
              {...fade(0.28)}
              className="mx-auto mt-9 grid max-w-xl grid-cols-3 gap-4 border-t border-[#E4DDD3] pt-7 text-left lg:mx-0"
            >
              {shownStats.map((s) => (
                <div key={s.label} className="min-w-0">
                  <dt className="sr-only">{s.label}</dt>
                  <dd
                    className={`font-[family-name:var(--font-heading)] leading-tight text-[#14213D] ${
                      s.small ? "text-[18px] sm:text-[20px]" : "text-[30px] sm:text-[34px]"
                    }`}
                  >
                    {s.value}
                  </dd>
                  <dd aria-hidden="true" className="mt-1 text-[12px] text-[#77736D]">
                    {s.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}

          {author && (
            <motion.div {...fade(0.34)} className="mt-9 flex justify-center lg:justify-start">
              <Link to={`/authors/${author.id}`} className={buttonClasses("outline", "md")}>
                {actionLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* ---------- Photo + caption card with books ---------- */}
        <motion.figure
          {...fade(0.1)}
          className="group relative aspect-[4/4.4] w-full overflow-hidden rounded-xl bg-[#14213D] sm:aspect-[4/3.6] lg:aspect-[4/4.2]"
        >
          <Photo src={photo ?? author?.photo} name={name ?? heading} />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

          <motion.figcaption
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="absolute inset-x-4 bottom-4 rounded-lg bg-[#FAF7F2]/95 p-5 shadow-xl backdrop-blur-sm sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[min(360px,calc(100%-3rem))] sm:p-6"
          >
            {badge && (
              <p className="font-button text-[10px] font-semibold uppercase tracking-[0.16em] text-[#D9773B]">{badge}</p>
            )}
            {cardLine && (
              <p className="mt-2 font-[family-name:var(--font-heading)] text-[22px] leading-snug text-[#14213D]">{cardLine}</p>
            )}
            {shownBooks.length > 0 && (
              <div className="mt-4">
                <BookFan books={shownBooks} authorName={name ?? heading} />
                <p className="mt-3 text-[11px] text-[#77736D]">
                  {plural(authorBooks.length, "book", "books")} · hover to browse
                </p>
              </div>
            )}
          </motion.figcaption>
        </motion.figure>
      </div>
    </section>
  );
}