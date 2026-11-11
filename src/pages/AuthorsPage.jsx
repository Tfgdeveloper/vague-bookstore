import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, UserRound, X } from "lucide-react";
import Hero from "../components/Hero";
import { AUTHORS, GENRES, authorPath, getBooksByAuthor, getGenreName } from "../data/books";
import { CONTAINER, usePageTitle } from "../lib/pageHelpers";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const sortName = (name = "") => name.trim().replace(/^(Dr|Col|Capt|Mr|Mrs|Ms)\.?\s+/i, "");

const publishedTime = (b) => {
  const t = Date.parse(b.publicationDate ?? b.publishedAt ?? "");
  return Number.isNaN(t) ? 0 : t;
};

const SORTS = [
  { key: "az", label: "A–Z" },
  { key: "books", label: "Most books" },
  { key: "recent", label: "Latest release" },
];

/* ---------- Small round photo, or a user avatar ---------- */
function AuthorAvatar({ author }) {
  const [failed, setFailed] = useState(false);
  const hasPhoto = author.photo && !failed;
  return (
    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#EFE7DB] ring-1 ring-[#E4DDD3]">
      {hasPhoto ? (
        <img src={author.photo} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <div className="grid h-full w-full place-items-center text-[#14213D]/45">
          <UserRound aria-hidden="true" className="h-8 w-8" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

/* ---------- One author card ---------- */
function AuthorCard({ author }) {
  const { books, genres } = author;
  return (
    <Link
      to={authorPath(author)}
      className="group flex h-full flex-col rounded-md border border-[#E4DDD3] bg-white p-5 outline-none transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-[#14213D]/25 hover:shadow-[0_18px_32px_-22px_rgba(20,33,61,0.5)] focus-visible:ring-2 focus-visible:ring-[#14213D]/40 motion-reduce:hover:translate-y-0"
    >
      <div className="flex items-center gap-4">
        <AuthorAvatar author={author} />
        <div className="min-w-0">
          <h2 className="font-[family-name:var(--font-heading)] text-[19px] leading-snug text-[#14213D] group-hover:underline group-hover:underline-offset-4">
            {author.name.trim()}
          </h2>
          {genres.length > 0 && (
            <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-[0.12em] text-[#D9773B]">
              {genres.slice(0, 2).map(getGenreName).join(" · ")}
            </p>
          )}
        </div>
      </div>

      {author.bio && <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-[#63524E]">{author.bio}</p>}

      {/* Small covers + count */}
      <div className="mt-auto pt-4">
      <div className="flex items-center justify-between gap-3 border-t border-[#EFE9E1] pt-3">
        {books.length > 0 ? (
          <>
            <div className="flex -space-x-3" aria-hidden="true">
              {books.slice(0, 4).map((b) => (
                <div key={b.id} className="aspect-[2/3] w-8 overflow-hidden rounded-[2px] bg-[#14213D] ring-2 ring-white">
                  {b.cover && <img src={b.cover} alt="" loading="lazy" className="h-full w-full object-cover" />}
                </div>
              ))}
            </div>
            <span className="text-[12px] text-[#77736D]">
              <span className="font-semibold text-[#14213D]">{books.length}</span> {books.length === 1 ? "book" : "books"}
            </span>
          </>
        ) : (
          <span className="text-[12px] text-[#77736D]">Books coming soon</span>
        )}
      </div>
      </div>
    </Link>
  );
}

/* ================================================================== */
/* Route: /authors                                                     */
/* ================================================================== */
export default function AuthorsPage() {
  usePageTitle("Authors");
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("az");

  // Each author with their books (newest first) and genres
  const authors = useMemo(
    () =>
      AUTHORS.map((a) => {
        const books = [...getBooksByAuthor(a.id)].sort((x, y) => publishedTime(y) - publishedTime(x));
        return {
          ...a,
          books,
          genres: [...new Set(books.flatMap((b) => b.genres ?? []))],
          latest: books.length ? publishedTime(books[0]) : 0,
        };
      }),
    []
  );

  // Genre tabs: only genres that at least one author writes in
  const genreTabs = useMemo(() => {
    const counts = new Map();
    authors.forEach((a) => a.genres.forEach((g) => counts.set(g, (counts.get(g) ?? 0) + 1)));
    // Same order as GENRES in books.js
    return GENRES.filter((g) => counts.has(g.slug)).map((g) => ({ slug: g.slug, label: getGenreName(g.slug), count: counts.get(g.slug) }));
  }, [authors]);

  const q = query.trim().toLowerCase();
  const shown = authors
    .filter((a) => genre === "all" || a.genres.includes(genre))
    .filter((a) => !q || a.name.toLowerCase().includes(q) || a.books.some((b) => b.title.toLowerCase().includes(q)))
    .sort((a, b) => {
      if (sort === "books") return b.books.length - a.books.length || sortName(a.name).localeCompare(sortName(b.name));
      if (sort === "recent") return b.latest - a.latest;
      return sortName(a.name).localeCompare(sortName(b.name));
    });

  const tabClass = (active) =>
    `relative shrink-0 pb-3 text-[14px] outline-none transition-colors focus-visible:text-[#14213D] ${
      active ? "font-semibold text-[#14213D]" : "text-[#77736D] hover:text-[#14213D]"
    }`;

  return (
    <>
      <Hero
        variant="centered"
        eyebrow="The people behind the pages"
        title="Our Authors"
        description="Independent writers sharing novels, memoirs, thrillers and true stories."
        primaryAction={{ label: "Join as an author", to: "/submit" }}
      />

      <section className="bg-[#FAF7F2] py-14 sm:py-20">
        <div className={CONTAINER}>
          {/* ----- Toolbar: search + sort ----- */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <label className="relative w-full sm:max-w-sm">
              <span className="sr-only">Search authors or books</span>
              <Search aria-hidden="true" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#77736D]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search authors or book titles…"
                className="h-11 w-full rounded-md border border-[#E4DDD3] bg-white pl-10 pr-10 text-sm text-[#14213D] outline-none placeholder:text-[#a39a92] focus:border-[#14213D]/50 focus:ring-4 focus:ring-[#14213D]/5 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-[#77736D] hover:bg-[#EFE7DB]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>

            <label className="flex items-center gap-2 text-[13px] text-[#77736D]">
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="h-11 rounded-md border border-[#E4DDD3] bg-white px-3 text-[13px] font-medium text-[#14213D] outline-none focus:border-[#14213D]/50"
              >
                {SORTS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </label>
          </div>

          {/* ----- Genre filter (underline tabs) ----- */}
          {genreTabs.length > 1 && (
            <div role="tablist" aria-label="Filter authors by genre" className="mt-8 flex gap-6 overflow-x-auto border-b border-[#E4DDD3] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[{ slug: "all", label: "All authors", count: authors.length }, ...genreTabs].map((t) => {
                const active = genre === t.slug;
                return (
                  <button key={t.slug} type="button" role="tab" aria-selected={active} onClick={() => setGenre(t.slug)} className={tabClass(active)}>
                    {t.label}
                    <span className="ml-1.5 text-[12px] font-normal text-[#a39a92]">{t.count}</span>
                    {active && (
                      <motion.span layoutId="authors-tab" className="absolute inset-x-0 -bottom-px h-[2px] bg-[#14213D]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <p aria-live="polite" className="mb-6 mt-6 text-[13px] text-[#77736D]">
            {shown.length} {shown.length === 1 ? "author" : "authors"}
            {q && <> matching “{query.trim()}”</>}
          </p>

          {/* ----- Grid ----- */}
          {shown.length > 0 ? (
            <motion.ul layout={!reduce} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false}>
                {shown.map((a) => (
                  <motion.li
                    key={a.id}
                    layout={!reduce}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AuthorCard author={a} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          ) : (
            <div className="rounded-md border border-dashed border-[#E4DDD3] bg-white px-6 py-14 text-center">
              <p className="font-[family-name:var(--font-heading)] text-xl text-[#14213D]">No authors found</p>
              <p className="mt-1 text-[13px] text-[#77736D]">Try another name, a book title, or a different genre.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setGenre("all");
                }}
                className="mt-5 text-[13px] font-semibold text-[#14213D] underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ----- Call to action ----- */}
      <section className="bg-[#14213D] py-14 text-white sm:py-16">
        <div className={`${CONTAINER} flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left`}>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9A36B]">For writers</p>
            <p className="mt-2 font-[family-name:var(--font-heading)] text-[28px] leading-tight sm:text-[34px]">Your book belongs on these shelves.</p>
            <p className="mt-2 text-[14px] text-white/70">Listing is free. Readers buy from Amazon or your own site.</p>
          </div>
          <Link
            to="/submit"
            className="inline-flex h-12 shrink-0 items-center rounded-md bg-[#C9A36B] px-6 text-[13px] font-semibold text-[#14213D] transition-colors hover:bg-[#d8b37c]"
          >
            Submit your book
          </Link>
        </div>
      </section>
    </>
  );
}