import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronRight, ExternalLink } from "lucide-react";
import { BookCard } from "../components/BookCard";
import { Eyebrow, Description, SectionHeading } from "../components/ui/typography";
import { buttonClasses } from "../components/ui/button";
import { AUTHORS, authorPath, getAuthor, getBooksByAuthor } from "../data/books";
import { CONTAINER, genreInfo, initials, subgenreInfo, usePageTitle, NotFound } from "../lib/pageHelpers";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const publishedTime = (b) => {
  const t = Date.parse(b.publicationDate ?? b.publishedAt ?? "");
  return Number.isNaN(t) ? 0 : t;
};

const monthYear = (time) =>
  time ? new Date(time).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";

/* ---------- Author photo, or initials on navy ---------- */
function Portrait({ author }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative mx-auto w-full max-w-[280px] md:mx-0">
      {/* Gold frame offset behind the photo */}
      <div aria-hidden="true" className="absolute inset-0 translate-x-3 translate-y-3 rounded-md border border-[#C9A36B]" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#14213D] shadow-[0_24px_40px_-24px_rgba(20,33,61,0.6)]">
        {author.photo && !failed ? (
          <img src={author.photo} alt={author.name} onError={() => setFailed(true)} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <span className="font-[family-name:var(--font-heading)] text-7xl text-[#C9A36B]">{initials(author.name)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Long bio folds after a few lines ---------- */
function Bio({ text }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [long, setLong] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !open) setLong(el.scrollHeight > el.clientHeight + 2);
  }, [text, open]);

  return (
    <div className="mt-5 max-w-2xl">
      <p ref={ref} className={`text-[15px] leading-[1.85] text-[#4a4440] ${open ? "" : "line-clamp-5"}`}>
        {text}
      </p>
      {(long || open) && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-2 text-[13px] font-semibold text-[#14213D] underline underline-offset-4 hover:text-[#B39262]"
        >
          {open ? "Show less" : "Read full bio"}
        </button>
      )}
    </div>
  );
}

/* ---------- Simple underline tabs to filter the books by genre ---------- */
function GenreFilter({ tabs, active, onChange }) {
  return (
    <div role="tablist" aria-label="Filter by genre" className="mb-8 flex gap-6 overflow-x-auto border-b border-[#E4DDD3] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((t) => {
        const selected = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(t.key)}
            className={`relative shrink-0 pb-3 text-[14px] outline-none transition-colors focus-visible:text-[#14213D] ${
              selected ? "font-semibold text-[#14213D]" : "text-[#77736D] hover:text-[#14213D]"
            }`}
          >
            {t.label}
            <span className="ml-1.5 text-[12px] font-normal text-[#a39a92]">{t.count}</span>
            {selected && (
              <motion.span layoutId="author-tab" className="absolute inset-x-0 -bottom-px h-[2px] bg-[#14213D]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/* Route: /authors/:authorId                                           */
/* ================================================================== */
export default function AuthorPage() {
  const { authorId } = useParams();
  const author = getAuthor(authorId);
  const reduce = useReducedMotion();
  const [tab, setTab] = useState("all");

  usePageTitle(author ? author.name : "Author not found");

  const books = useMemo(
    () => (author ? [...getBooksByAuthor(author.id)].sort((a, b) => publishedTime(b) - publishedTime(a)) : []),
    [author]
  );

  if (!author) {
    return (
      <NotFound
        title="We couldn’t find that author"
        message="The link might be wrong, or the author may no longer be listed."
        backTo="/authors"
        backLabel="See all authors"
      />
    );
  }

  const name = author.name.trim();
  const genres = [...new Set(books.flatMap((b) => b.genres ?? []))].map(genreInfo);
  const subgenres = [...new Set(books.flatMap((b) => b.subgenres ?? []))].map(subgenreInfo);
  const latest = books.length ? publishedTime(books[0]) : 0;

  const stats = [
    { label: books.length === 1 ? "Book" : "Books", value: books.length },
    genres.length > 0 && { label: genres.length === 1 ? "Genre" : "Genres", value: genres.length },
    latest > 0 && { label: "Latest release", value: monthYear(latest) },
  ].filter(Boolean);

  // Tabs only when the author writes in more than one genre
  const tabs = [
    { key: "all", label: "All books", count: books.length },
    ...genres.map((g) => ({ key: g.slug, label: g.name, count: books.filter((b) => b.genres?.includes(g.slug)).length })),
  ];
  const shown = tab === "all" ? books : books.filter((b) => b.genres?.includes(tab));

  // Other authors who have books, most books first
  const others = AUTHORS.filter((a) => a.id !== author.id)
    .map((a) => ({ ...a, count: getBooksByAuthor(a.id).length }))
    .filter((a) => a.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const fade = (delay = 0) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } };

  return (
    <>
      {/* ---------- Author ---------- */}
      <section className="bg-[#FAF7F2] pb-16 pt-8 sm:pb-20 sm:pt-10">
        <div className={CONTAINER}>
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#77736D]">
              <li><Link to="/" className="hover:text-[#14213D]">Home</Link></li>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              <li><Link to="/authors" className="hover:text-[#14213D]">Authors</Link></li>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              <li aria-current="page" className="text-[#14213D]">{name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-[280px_1fr] lg:gap-20">
            <motion.div {...fade(0)}>
              <Portrait author={author} />
            </motion.div>

            <motion.div {...fade(0.1)} className="min-w-0 text-center md:text-left">
              <Eyebrow size="md" color="inherit" className="text-[#D9773B]">Author</Eyebrow>
              <h1 className="mt-3 font-[family-name:var(--font-heading)] text-[40px] font-normal leading-[1.12] tracking-[-0.015em] text-[#14213D] md:text-[56px] md:tracking-[-0.02em]">
                {name}
              </h1>

              {author.bio ? (
                <Bio text={author.bio} />
              ) : (
                <p className="mt-5 text-[15px] text-[#77736D]">A biography is on its way.</p>
              )}

              {/* Stats */}
              {stats.length > 0 && (
                <dl className="mx-auto mt-8 grid max-w-xl grid-cols-3 border-y border-[#E4DDD3] md:mx-0">
                  {stats.map((s, i) => (
                    <div key={s.label} className={`py-4 ${i > 0 ? "border-l border-[#E4DDD3] pl-5" : ""}`}>
                      <dt className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#77736D]">{s.label}</dt>
                      <dd className="mt-1 font-[family-name:var(--font-heading)] text-[24px] leading-tight text-[#14213D]">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* Genres + sub-genres */}
              {(genres.length > 0 || subgenres.length > 0) && (
                <ul aria-label="Writes in" className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                  {genres.map((g) => (
                    <li key={g.slug}>
                      <Link to={g.path} className="inline-block rounded-md bg-[#14213D] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#B39262]">
                        {g.name}
                      </Link>
                    </li>
                  ))}
                  {subgenres.map((s) => (
                    <li key={s.slug}>
                      <Link to={s.path} className="inline-block rounded-md border border-[#E4DDD3] bg-white px-3 py-1.5 text-[12px] text-[#4a4440] transition-colors hover:border-[#14213D] hover:text-[#14213D]">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                {books.length > 0 && (
                  <a href="#books" className={buttonClasses("primary", "md")}>
                    See {books.length === 1 ? "the book" : `all ${books.length} books`}
                  </a>
                )}
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-[#14213D] px-5 text-[13px] font-semibold text-[#14213D] transition-colors hover:bg-[#14213D] hover:text-white"
                  >
                    Visit website
                    <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- Books ---------- */}
      <section id="books" className="scroll-mt-6 border-t border-[#E4DDD3] bg-white py-14 sm:py-20">
        <div className={CONTAINER}>
          <SectionHeading eyebrow="On the shelf" title={`Books by ${name}`} />
          {books.length > 0 ? (
            <>
              {genres.length > 1 && <GenreFilter tabs={tabs} active={tab} onChange={setTab} />}
              <motion.ul
                key={tab}
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6 xl:grid-cols-5"
              >
                {shown.map((b) => (
                  <motion.li
                    key={b.id}
                    variants={{
                      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <BookCard book={b} />
                  </motion.li>
                ))}
              </motion.ul>
            </>
          ) : (
            <Description size="md">No books listed yet.</Description>
          )}
        </div>
      </section>

      {/* ---------- Other authors ---------- */}
      {others.length > 0 && (
        <section className="bg-[#EFE7DB] py-14 sm:py-20">
          <div className={CONTAINER}>
            <SectionHeading
              eyebrow="Keep exploring"
              title="More authors on our shelves"
              action={
                <Link to="/authors" className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#14213D]">
                  All authors
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              }
            />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((a) => (
                <li key={a.id}>
                  <Link
                    to={authorPath(a)}
                    className="group flex h-full items-center gap-4 rounded-md border border-transparent bg-[#FAF7F2] p-4 outline-none transition-[border-color,box-shadow] hover:border-[#E4DDD3] hover:shadow-[0_12px_24px_-18px_rgba(20,33,61,0.45)] focus-visible:ring-2 focus-visible:ring-[#14213D]/40"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#14213D]">
                      {a.photo ? (
                        <img src={a.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <span className="grid h-full w-full place-items-center font-[family-name:var(--font-heading)] text-lg text-[#C9A36B]">
                          {initials(a.name)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-[family-name:var(--font-heading)] text-[17px] text-[#14213D] group-hover:underline">{a.name.trim()}</p>
                      <p className="text-[12px] text-[#77736D]">
                        {a.count} {a.count === 1 ? "book" : "books"}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}