import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BookCard } from "./BookCard";
import { SectionHeading } from "./ui/typography";
import { BOOKS, GENRES } from "../data/books";

/* ------------------------------------------------------------------ */
/* Data for the two shelves                                            */
/* ------------------------------------------------------------------ */
// Featured books first, then the rest, in list order.
const featuredFirst = (list) => [...list.filter((b) => b.featured), ...list.filter((b) => !b.featured)];

// Books for one tab: up to `limit` books in that genre ("all" = any genre).
// Old calls like getStaffSelections(8) still work.
export const getStaffSelections = (genre = "all", limit = 4, source = BOOKS) => {
  if (typeof genre === "number") [genre, limit] = ["all", genre];
  const pool = genre === "all" ? source : source.filter((b) => b.genres?.includes(genre));
  return featuredFirst(pool).slice(0, limit);
};

// Newest first: by addedAt when books have it, otherwise the last books in the list.
export const getFreshlyShelved = (limit = 10) => {
  const time = (b) => {
    const t = new Date(b.addedAt).getTime();
    return Number.isNaN(t) ? null : t;
  };
  return BOOKS.map((book, index) => ({ book, index, t: time(book) }))
    .sort((a, b) => (b.t ?? -Infinity) - (a.t ?? -Infinity) || b.index - a.index)
    .map((x) => x.book)
    .slice(0, limit);
};

const genreName = (slug) => (GENRES.find((g) => g.slug === slug)?.name ?? slug).replace(/\s+Books$/i, "");

/* ------------------------------------------------------------------ */
/* Shared layout                                                       */
/* ------------------------------------------------------------------ */
const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";

function Reveal({ children, className }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const headerLink =
  "font-button group inline-flex items-center gap-2 rounded text-[13px] font-semibold text-[#14213D] outline-none transition-colors  focus-visible:ring-2 focus-visible:ring-[#C5A46D]";

/* ------------------------------------------------------------------ */
/* Genre tabs                                                          */
/* ------------------------------------------------------------------ */
function GenreTabs({ tabs, active, onChange, panelId }) {
  const refs = useRef([]);

  // Arrow keys move between tabs (standard tab behaviour)
  const onKeyDown = (e, i) => {
    let next = null;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].key);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Filter by genre"
      className="-mx-5 mb-8 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {tabs.map((tab, i) => {
        const selected = tab.key === active;
        return (
          <button
            key={tab.key}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            id={`${panelId}-tab-${tab.key}`}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`font-button relative shrink-0 rounded-full border px-4 py-2 text-[12px] font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#C5A46D] ${
              selected
                ? "border-[#14213D] text-white"
                : "border-[#E4DDD3] bg-white text-[#14213D] hover:border-[#14213D]/40"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={`${panelId}-pill`}
                className="absolute inset-0 rounded-full bg-[#14213D]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Section 1: Staff selections — genre tabs + card grid                */
/* ------------------------------------------------------------------ */
export function StaffSelections({
  books = BOOKS, // all books the tabs can pick from
  perTab = 4, // books shown in every tab
  minBooks = 1, // a genre needs at least this many books to get a tab
  eyebrow = "Well loved, well read",
  title = "The books everyone’s talking about.",
  description = "Hand-picked by our team: the books we keep recommending, from quiet page-turners to stories that stay with you long after the last page.",
  linkLabel = "See all books",
  linkTo = "/new-books",
}) {
  const reduce = useReducedMotion();
  const panelId = useId().replace(/:/g, "");
  const [active, setActive] = useState("all");

  // One tab per genre in GENRES that has books
  const tabs = useMemo(() => {
    const genreTabs = GENRES.filter(
      (g) => books.filter((b) => b.genres?.includes(g.slug)).length >= minBooks
    ).map((g) => ({ key: g.slug, label: genreName(g.slug), to: `/${g.slug}` }));
    return [{ key: "all", label: "All books", to: linkTo }, ...genreTabs];
  }, [books, minBooks, linkTo]);

  const shown = getStaffSelections(active, perTab, books);
  const activeTab = tabs.find((t) => t.key === active) ?? tabs[0];

  // The header link follows the tab: "See all Novels →" goes to /novel
  const headerLinkLabel = active === "all" ? linkLabel : `See all ${activeTab.label}`;
  const headerLinkTo = activeTab.to;

  if (!books.length) return null;

  return (
    <section className="bg-[#FAF7F2] py-14 sm:py-20">
      <Reveal className={CONTAINER}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title} 
          description={description}
          action={
            headerLinkTo && (
              <Link to={headerLinkTo} className={headerLink}>
                {headerLinkLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            )
          }
        />

        {tabs.length > 2 && <GenreTabs tabs={tabs} active={active} onChange={setActive} panelId={panelId} />}

        <div role="tabpanel" id={panelId} aria-labelledby={`${panelId}-tab-${active}`}>
          <motion.ul
            key={active}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6"
          >
            {shown.map((book) => (
              <motion.li
                key={book.id}
                variants={{
                  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                <BookCard book={book} />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Section 2: Freshly Shelved (carousel) — unchanged apart from the    */
/* description                                                         */
/* ------------------------------------------------------------------ */
const arrowBase =
  "grid h-9 w-9 place-items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2] disabled:cursor-not-allowed";

export function FreshlyShelved({
  books = getFreshlyShelved(),
  eyebrow = "Fresh off the press",
  title = "Freshly Shelved Curation",
  description = "The newest arrivals from independent authors, just added to our shelves. Be one of the first to discover them.",
}) {
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 4);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [books.length]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  };

  if (!books.length) return null;

  return (
    <section className="bg-[#FAF7F2] py-14 sm:py-20">
      <Reveal className={CONTAINER}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title} 
          description={description}
          action={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                disabled={!canPrev}
                aria-label="Previous books"
                className={`${arrowBase} border border-[#d9cfbf] text-[#2a1b1b] hover:border-[#14213D] hover:text-[#14213D] disabled:opacity-40 disabled:hover:border-[#d9cfbf] disabled:hover:text-[#2a1b1b]`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                disabled={!canNext}
                aria-label="Next books"
                className={`${arrowBase} bg-[#14213D] text-[#f8f4ed] hover:bg-[#14213D] disabled:bg-[#14213D]/40`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          }
        />

        <ul
          ref={trackRef}
          aria-label={title}
          className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 sm:-mx-10 sm:scroll-px-10 sm:gap-5 sm:px-10 lg:mx-0 lg:scroll-px-0 lg:gap-6 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {books.map((book) => (
            <li
              key={book.id}
              className="shrink-0 snap-start basis-[calc((100%-1rem)/2)] sm:basis-[calc((100%-2.5rem)/3)] lg:basis-[calc((100%-6rem)/4)]"
            >
              <BookCard book={book} showNote />
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}