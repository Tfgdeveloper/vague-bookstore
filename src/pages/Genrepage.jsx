import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import Hero from "../components/Hero";
import FeaturedBook from "../components/FeaturedBook";
import QuoteNewsletter from "../components/QuoteNewsletter";
import { BookCard } from "../components/BookCard";
import { SectionHeading, Description } from "../components/ui/typography";
import { buttonClasses } from "../components/ui/button";
import { genrePath, getBooksByGenre, getGenrePage, getSubgenresWithBooks } from "../data/books";
import { NotFound } from "../lib/pageHelpers";

/* ==================================================================
   One page for every genre and sub-genre:
     /fiction                     <GenrePage genreSlug="fiction" />
     /fiction/historical-fiction  same, with :subSlug from the route
     /new-books                   <GenrePage genreSlug="new-books" />
   All content comes from books.js (getGenrePage).
   ================================================================== */

const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";
const ROWS_PER_PAGE = 4;

/* ---------- How many grid columns fit right now (matches the grid classes) ---------- */
const BREAKPOINTS = [
  { query: "(min-width: 1536px)", cols: 6 },
  { query: "(min-width: 1280px)", cols: 5 },
  { query: "(min-width: 1024px)", cols: 4 },
  { query: "(min-width: 640px)", cols: 3 },
];

function useGridColumns() {
  const read = () =>
    typeof window === "undefined" ? 2 : BREAKPOINTS.find((b) => window.matchMedia(b.query).matches)?.cols ?? 2;
  const [cols, setCols] = useState(read);
  useEffect(() => {
    const lists = BREAKPOINTS.map((b) => window.matchMedia(b.query));
    const update = () => setCols(read());
    lists.forEach((l) => l.addEventListener("change", update));
    return () => lists.forEach((l) => l.removeEventListener("change", update));
  }, []);
  return cols;
}

/* ---------- Breadcrumb ---------- */
function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#63524E]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.to} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />}
              {last ? (
                <span aria-current="page" className="text-[#14213D]">{item.label}</span>
              ) : (
                <Link to={item.to} className="hover:text-[#611C24]">{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Sub-genre pills ---------- */
function SubgenreNav({ genre, genreName, activeSlug, total }) {
  const subs = getSubgenresWithBooks(genre.slug);
  if (!subs.length) return null;

  const pill = (active) =>
    `font-button inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#C5A46D] ${
      active ? "border-[#14213D] bg-[#14213D] text-white" : "border-[#E4DDD3] bg-white text-[#14213D] hover:border-[#14213D]/40"
    }`;

  return (
    <nav aria-label={`${genreName} sub-genres`} className="mb-10">
      <ul className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <li>
          <Link to={genrePath(genre.slug)} aria-current={!activeSlug ? "page" : undefined} className={pill(!activeSlug)}>
            All {genreName}
            <span className={!activeSlug ? "text-white/60" : "text-[#77736D]"}>{total}</span>
          </Link>
        </li>
        {subs.map((s) => {
          const active = s.slug === activeSlug;
          return (
            <li key={s.slug}>
              <Link to={s.path} aria-current={active ? "page" : undefined} className={pill(active)}>
                {s.name}
                <span className={active ? "text-white/60" : "text-[#77736D]"}>{s.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ================================================================== */
export default function GenrePage({ genreSlug }) {
  const { subSlug } = useParams();
  const page = getGenrePage(genreSlug, subSlug);
  const reduce = useReducedMotion();
  const cols = useGridColumns();
  const [rowsShown, setRowsShown] = useState(ROWS_PER_PAGE);
  const [newFrom, setNewFrom] = useState(0);
  const listRef = useRef(null);

  // New page → title, scroll to top, start again at 4 rows
  useEffect(() => {
    document.title = page ? `${page.hero.title} · Vague Book Store` : "Page not found · Vague Book Store";
    window.scrollTo(0, 0);
    setRowsShown(ROWS_PER_PAGE);
    setNewFrom(0);
  }, [page?.path]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!page) {
    return (
      <NotFound
        title="We couldn’t find that shelf"
        message="This genre doesn’t exist, or the link might be wrong."
        backTo="/new-books"
        backLabel="Browse new books"
      />
    );
  }

  const { type, genre, subgenre, hero, books, breadcrumb } = page;
  const genreName = genre ? (genre.hero?.title ?? genre.name.replace(/\s+Books$/i, "")) : "";

  // Always whole rows: 4 rows × the columns that fit
  const visibleCount = Math.min(books.length, rowsShown * cols);
  const visibleBooks = books.slice(0, visibleCount);
  const remaining = books.length - visibleCount;

  const loadMore = () => {
    const firstNew = visibleCount;
    setNewFrom(firstNew);
    setRowsShown((r) => r + ROWS_PER_PAGE);
    requestAnimationFrame(() => listRef.current?.children[firstNew]?.querySelector("a")?.focus({ preventScroll: true }));
  };

  // Featured section: from books.js, or on a sub-genre page its first featured / first book
  const featured =
    page.featured ??
    (type === "subgenre" && books.length > 0
      ? {
          bookId: (books.find((b) => b.featured) ?? books[0]).id,
          eyebrow: `${subgenre.name} pick`,
          heading: `A ${subgenre.name.toLowerCase()} story\nworth sharing.`,
        }
      : null);

  const listingTitle =
    type === "subgenre" ? `${subgenre.name} books` : type === "new-books" ? "Recently shelved" : `All ${genreName}`;
  const listingEyebrow = type === "subgenre" ? genreName : type === "new-books" ? "Just added" : "The collection";

  return (
    <>
      {/* 1. Hero */}
      <Hero
        variant="centered"
        eyebrow={hero.eyebrow}
        title={hero.title}
        description={hero.description}
        primaryAction={hero.primaryAction}
        secondaryAction={hero.secondaryAction}
      />

      {/* 2. Books */}
      <section className="bg-[#FAF7F2] py-14 sm:py-20">
        <div className={CONTAINER}>
          <Breadcrumb items={breadcrumb} />

          {genre && (
            <SubgenreNav
              genre={genre}
              genreName={genreName}
              activeSlug={subgenre?.slug}
              total={getBooksByGenre(genre.slug).length}
            />
          )}

          <SectionHeading
            eyebrow={listingEyebrow}
            title={listingTitle}
            action={
              books.length > 0 && (
                <Description size="sm">
                  {books.length} {books.length === 1 ? "book" : "books"}
                </Description>
              )
            }
          />

          {books.length > 0 ? (
            <>
              <ul
                ref={listRef}
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 xl:grid-cols-5 2xl:grid-cols-6"
              >
                {visibleBooks.map((book, i) => (
                  <motion.li
                    key={book.id}
                    initial={i >= newFrom && !reduce ? { opacity: 0, y: 14 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: i >= newFrom ? Math.min(i - newFrom, 12) * 0.035 : 0, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <BookCard book={book} />
                  </motion.li>
                ))}
              </ul>

              <div className="mt-14 flex flex-col items-center gap-3">
                <p aria-live="polite" className="text-[13px] text-[#63524E]">
                  Showing {visibleCount} of {books.length} books
                </p>
                {remaining > 0 && (
                  <>
                    <div aria-hidden="true" className="h-1 w-40 overflow-hidden rounded-full bg-[#e4dacb]">
                      <div
                        className="h-full rounded-full bg-[#B39262] transition-[width] duration-500"
                        style={{ width: `${(visibleCount / books.length) * 100}%` }}
                      />
                    </div>
                    <button type="button" onClick={loadMore} className={`${buttonClasses("primary", "md")} mt-2`}>
                      Load more
                      <ChevronDown aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="border border-dashed border-[#e4dacb] px-6 py-16 text-center">
              <Description size="md" color="dark">
                No books on this shelf yet.
              </Description>
              <Description size="sm" className="mt-1">
                Are you an author in this genre? Be the first to list your book.
              </Description>
              <Link to="/submit" className={`${buttonClasses("primary", "md")} mt-6`}>
                Submit your book
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. Featured book */}
      {featured?.bookId && (
        <FeaturedBook
          bookId={featured.bookId}
          eyebrow={featured.eyebrow}
          heading={featured.heading}
          note={featured.note}
          description={featured.description}
          label={featured.label}
          background="/images/featured-bg.png" //theme={{ "image-bg": "#1F2A44" }}
          primaryAction={featured.primaryAction}
        />
      )}

      <QuoteNewsletter />
    </>
  );
}