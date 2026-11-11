import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight, Menu, PenLine, Search, UserRound, X } from "lucide-react";
import * as booksData from "../data/books";
import { BOOKS as DATA_BOOKS, getMegaMenu, getSubgenre } from "../data/books";
import { buttonClasses } from "./ui/button";

/* ------------------------------------------------------------------ */
/* Config — edit links and text here                                   */
/* ------------------------------------------------------------------ */
const ANNOUNCEMENTS = [
  "Independent books from authors around the world.",
  "Discover your next chapter →",
];

// Genres (with their mega menus) are filled in from books.js, between these:
const NAV_START = [
  { key: "home", label: "Home", to: "/" },
  { key: "new-books", label: "New Books", to: "/new-books" },
];
const NAV_END = [{ key: "contact", label: "Contact Us", to: "/contact" }];

const MEGA_MENU = getMegaMenu(); // only genres and sub-genres that have books
const MEGA_SUB_LIMIT = 8; // sub-genres shown per menu before "+ more"
const PANEL_WIDTH = 640; // mega menu width in px

// Best 2 books of a genre: featured first, then the most recently published
const publishedTime = (b) => {
  const t = Date.parse(b.publicationDate ?? b.publishedAt ?? "");
  return Number.isNaN(t) ? 0 : t;
};
const bestBooks = (genreSlug, limit = 2) =>
  DATA_BOOKS.filter((b) => b.genres?.includes(genreSlug))
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || publishedTime(b) - publishedTime(a))
    .slice(0, limit);

const NAV_LINKS = [
  ...NAV_START,
  ...MEGA_MENU.map((g) => ({ key: g.slug, label: g.name, to: g.path, mega: g })),
  ...NAV_END,
];

// Icons on the right of the top row
const ICON_LINKS = [
  { label: "Our authors", to: "/authors", icon: UserRound },
  { label: "Submit your book", to: "/submit", icon: PenLine },
];

const CTA = { label: "Explore Books", to: "/new-books" };

const SEARCH_PLACEHOLDER = "Search by title, author, or a little curiosity…";

const headingFont = { fontFamily: "var(--font-heading)" };
const ROW = "mx-auto flex max-w-[1700px] items-center px-5 sm:px-10 lg:px-16";

/* ------------------------------------------------------------------ */
/* Data helpers                                                        */
/* ------------------------------------------------------------------ */
const ALL_BOOKS = (() => {
  const src = booksData.BOOKS ?? booksData.books ?? booksData.default ?? [];
  return Array.isArray(src) ? src : Object.values(src);
})();

const pick = (b, ...keys) => keys.map((k) => b?.[k]).find((v) => v != null && v !== "");
const asText = (v) => (Array.isArray(v) ? v.join(", ") : v ?? "");
const getTitle = (b) => asText(pick(b, "title", "name")) || "Untitled";
const getAuthor = (b) => asText(pick(b, "authorName", "author", "authors", "writer"));
const getGenre = (b) => asText(pick(b, "genre", "genres", "category"));
const getCover = (b) => pick(b, "cover", "coverUrl", "coverImage", "image", "img", "thumbnail");
const getId = (b, i) => pick(b, "id", "slug", "isbn") ?? `book-${i}`;

function searchBooks(query, limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return { results: [], total: 0 };
  const scored = [];
  ALL_BOOKS.forEach((book, i) => {
    const title = getTitle(book).toLowerCase();
    const author = getAuthor(book).toLowerCase();
    const genre = getGenre(book).toLowerCase();
    let score = 0;
    if (title.startsWith(q)) score = 4;
    else if (title.includes(q)) score = 3;
    else if (author.includes(q)) score = 2;
    else if (genre.includes(q)) score = 1;
    if (score) scored.push({ book, id: getId(book, i), score });
  });
  scored.sort((a, b) => b.score - a.score || getTitle(a.book).localeCompare(getTitle(b.book)));
  return { results: scored.slice(0, limit), total: scored.length };
}

function Highlight({ text, query }) {
  const q = query.trim();
  const idx = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-sm bg-[#ead9b9] px-0.5 text-inherit">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function useActiveKey() {
  const { pathname } = useLocation();
  return NAV_LINKS.find((l) =>
    l.to === "/" ? pathname === "/" : pathname === l.to || pathname.startsWith(`${l.to}/`)
  )?.key;
}

/* ------------------------------------------------------------------ */
/* Shared animation                                                    */
/* ------------------------------------------------------------------ */
function useEntrance() {
  const reduce = useReducedMotion();
  return {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } },
    item: {
      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: -8 },
      show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    },
  };
}

const iconBtn =
  "relative grid h-10 w-10 place-items-center rounded-full text-[#2a1b1b] outline-none transition-[background-color,color,scale] duration-200 hover:scale-105 hover:bg-[#efe7da] focus-visible:ring-2 focus-visible:ring-[#14213D]/40 motion-reduce:hover:scale-100";

const ctaClass =
  "group inline-flex h-10 items-center gap-2 rounded-md bg-[#C9A36B] px-5 text-[13px] font-semibold text-[#2a1b1b] shadow-sm outline-none transition-[background-color,translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#bd9558] hover:shadow-[0_8px_18px_-8px_rgba(97,28,36,0.45)] active:translate-y-0 focus-visible:ring-2 focus-visible:ring-[#14213D]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2] motion-reduce:transition-colors motion-reduce:hover:translate-y-0";

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */
function Logo() {
  return (
    <Link
      to="/"
      aria-label="Vague Book Store home"
      className="flex shrink-0 items-center rounded outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[#14213D]/50"
    >
      <img src="/images/logo.png" alt="Vague Book Store" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Announcement bar                                                    */
/* ------------------------------------------------------------------ */
function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % ANNOUNCEMENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-[#14213D] text-white">
      <div className="mx-auto flex h-9 max-w-[1600px] items-center justify-center overflow-hidden px-4 text-[11px] font-medium sm:text-[13px]">
        <p className="hidden sm:block">
          {ANNOUNCEMENTS[0]}
          <Link to={CTA.to} className="ml-2 text-[#D4A373] transition-colors hover:text-white">
            {ANNOUNCEMENTS[1]}
          </Link>
        </p>
        <div className="relative h-full w-full sm:hidden" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={index}
              initial={reduce ? { opacity: 0 } : { y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: -14, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center text-center"
            >
              {ANNOUNCEMENTS[index]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Search box with live results                                        */
/* ------------------------------------------------------------------ */
function SearchBox({ variant = "desktop", onSelectBook, onSearch, autoFocus = false, onDone }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const deferred = useDeferredValue(query);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();
  const isMobile = variant === "mobile";

  const { results, total } = useMemo(() => searchBooks(deferred), [deferred]);
  const showPanel = open && query.trim().length > 0;

  useEffect(() => setActive(-1), [deferred]);
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const onDown = (e) => wrapRef.current && !wrapRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Press "/" anywhere to jump to the search box
  useEffect(() => {
    if (isMobile) return;
    const onKey = (e) => {
      const tag = document.activeElement?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile]);

  const choose = (book) => {
    onSelectBook(book);
    setQuery("");
    setOpen(false);
    inputRef.current?.blur();
    onDone?.();
  };

  const submitAll = () => {
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query.trim());
      setOpen(false);
      onDone?.();
    } else if (results[0]) {
      choose(results[0].book); // no search page: open the best match
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) choose(results[active].book);
      else submitAll();
    } else if (e.key === "Escape") {
      if (query) setQuery("");
      else {
        setOpen(false);
        inputRef.current?.blur();
        onDone?.();
      }
    }
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className={[
          "flex w-full items-center gap-2.5 rounded-md border border-[#E4DDD3] bg-white/70 px-4 transition-[border-color,box-shadow,background-color] duration-300",
          "hover:border-[#cbbfae] focus-within:border-[#14213D]/50 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(97,28,36,0.08)]",
          isMobile ? "h-10" : "h-10",
        ].join(" ")}
      >
        <Search aria-hidden className="h-4 w-4 shrink-0 text-[#6b5e55]" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={SEARCH_PLACEHOLDER}
          aria-label="Search books"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          className="w-full min-w-0 bg-transparent text-sm text-[#2a1b1b] outline-none placeholder:text-[#9a8e84] [&::-webkit-search-cancel-button]:hidden"
        />
        <AnimatePresence>
          {query ? (
            <motion.button
              key="clear"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#6b5e55] hover:bg-[#efe7da]"
            >
              <X className="h-3.5 w-3.5" />
            </motion.button>
          ) : (
            !isMobile && (
              <motion.kbd
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden="true"
                className="hidden shrink-0 rounded border border-[#ddd3c4] px-1.5 py-0.5 font-sans text-[11px] text-[#9a8e84] lg:block"
              >
                /
              </motion.kbd>
            )
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-[#e4dacb] bg-[#fffdf9] shadow-[0_18px_40px_-12px_rgba(42,27,27,0.25)]"
          >
            {results.length > 0 ? (
              <>
                <ul id={listId} role="listbox" className="max-h-[60vh] overflow-y-auto p-1.5">
                  {results.map(({ book, id }, i) => {
                    const cover = getCover(book);
                    return (
                      <motion.li
                        key={id}
                        id={`${listId}-${i}`}
                        role="option"
                        aria-selected={active === i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.18 }}
                        onMouseEnter={() => setActive(i)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => choose(book)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors ${
                          active === i ? "bg-[#f3ece1]" : "hover:bg-[#f7f2ea]"
                        }`}
                      >
                        <div className="h-14 w-10 shrink-0 overflow-hidden rounded-[3px] bg-[#e9e0d2] shadow-sm">
                          {cover ? (
                            <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover" />
                          ) : (
                            <div className="grid h-full w-full place-items-center text-[#a3968a]">
                              <BookOpen className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] leading-snug text-[#2a1b1b]" style={headingFont}>
                            <Highlight text={getTitle(book)} query={deferred} />
                          </p>
                          {getAuthor(book) && (
                            <p className="truncate text-xs text-[#6b5e55]">
                              <Highlight text={getAuthor(book)} query={deferred} />
                            </p>
                          )}
                        </div>
                        <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-[#c0b4a6]" />
                      </motion.li>
                    );
                  })}
                </ul>
                {onSearch && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={submitAll}
                    className="flex w-full items-center justify-between border-t border-[#ece3d6] px-4 py-2.5 text-xs font-medium text-[#14213D] hover:bg-[#f7f2ea]"
                  >
                    See all {total} {total === 1 ? "result" : "results"} for “{query.trim()}”
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-[#2a1b1b]">No books match “{query.trim()}”.</p>
                <p className="mt-1 text-xs text-[#6b5e55]">Try a title, an author’s name or a genre.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Icon link with tooltip                                              */
/* ------------------------------------------------------------------ */
function IconLink({ label, to, icon: Icon }) {
  return (
    <Link to={to} aria-label={label} className={`group ${iconBtn}`}>
      <Icon className="h-[19px] w-[19px]" strokeWidth={1.6} />
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full z-50 mt-2 whitespace-nowrap rounded bg-[#2a1b1b] px-2 py-1 text-[11px] font-medium text-white opacity-0 shadow transition-[opacity,translate] duration-150 group-hover:translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {label}
      </span>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Mega menu: a compact dropdown under the hovered genre               */
/*   left: sub-genres · right: the 2 best books                        */
/* ------------------------------------------------------------------ */
function MegaBookCard({ book, onNavigate }) {
  return (
    <li>
      <Link
        to={`/book/${book.id}`}
        onClick={onNavigate}
        className="group flex gap-3 rounded-md p-2 outline-none transition-colors hover:bg-[#FAF7F2] focus-visible:ring-2 focus-visible:ring-[#14213D]/40"
      >
        <div className="aspect-[2/3] w-12 shrink-0 overflow-hidden rounded-[2px] bg-[#14213D] shadow-sm">
          {book.cover && <img src={book.cover} alt="" loading="lazy" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 py-0.5">
          <p className="line-clamp-2 text-[14px] leading-snug text-[#14213D] group-hover:underline" style={headingFont}>
            {book.title}
          </p>
          {book.authorName && <p className="mt-0.5 truncate text-[12px] text-[#77736D]">{book.authorName}</p>}
        </div>
      </Link>
    </li>
  );
}

function MegaPanel({ genre, id, left, onNavigate, onMouseEnter, onMouseLeave }) {
  const reduce = useReducedMotion();
  const subs = genre.subgenres.slice(0, MEGA_SUB_LIMIT);
  const more = genre.subgenres.length - subs.length;
  const books = bestBooks(genre.slug, 2);

  return (
    <motion.div
      id={id}
      role="region"
      aria-label={`${genre.name} menu`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ left, width: PANEL_WIDTH }}
      className="absolute top-full z-50 mt-px overflow-hidden rounded-b-md border border-t-0 border-[#E4DDD3] bg-white shadow-[0_16px_32px_-18px_rgba(20,33,61,0.35)]"
    >
      <div className="flex">
        {/* Sub-genres */}
        <div className="min-w-0 flex-1 p-5">
          <div className="mb-3 flex items-baseline justify-between gap-4">
            <p className="text-[13px] font-semibold text-[#14213D]">{genre.name}</p>
            <Link
              to={genre.path}
              onClick={onNavigate}
              className="text-[12px] font-medium text-[#77736D] underline-offset-4 outline-none hover:text-[#14213D] hover:underline focus-visible:ring-2 focus-visible:ring-[#14213D]/40"
            >
              View all {genre.count}
            </Link>
          </div>
          {subs.length > 0 ? (
            <ul className="grid grid-cols-2 gap-x-4">
              {subs.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={s.path}
                    onClick={onNavigate}
                    className="flex items-baseline justify-between gap-2 rounded px-1 py-1.5 text-[13px] text-[#4a4440] outline-none transition-colors hover:text-[#14213D] hover:underline focus-visible:ring-2 focus-visible:ring-[#14213D]/40"
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[11px] text-[#a39a92]">{s.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-[#77736D]">Sub-genres will appear as books are added.</p>
          )}
          {more > 0 && (
            <Link to={genre.path} onClick={onNavigate} className="mt-1 inline-block px-1 text-[12px] text-[#77736D] hover:text-[#14213D] hover:underline">
              + {more} more
            </Link>
          )}
        </div>

        {/* Best 2 books */}
        {books.length > 0 && (
          <div className="w-[240px] shrink-0 border-l border-[#EFE9E1] bg-[#FCFAF7] p-3">
            <p className="px-2 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.12em] text-[#a39a92]">Readers’ picks</p>
            <ul>
              {books.map((book) => (
                <MegaBookCard key={book.id} book={book} onNavigate={onNavigate} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: one genre with its sub-genres folded underneath             */
/* ------------------------------------------------------------------ */
function MobileGenre({ link, active, onClose }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  return (
    <div>
      <div className={`flex items-center rounded-lg ${active ? "bg-[#efe4d3]" : ""}`}>
        <Link
          to={link.to}
          onClick={onClose}
          aria-current={active ? "page" : undefined}
          className={`flex-1 px-3 py-3 text-[17px] ${active ? "text-[#14213D]" : "text-[#2a1b1b]"}`}
          style={headingFont}
        >
          {link.label}
        </Link>
        {link.mega.subgenres.length > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={`${open ? "Hide" : "Show"} ${link.label} sub-genres`}
            className="grid h-11 w-11 place-items-center rounded-lg text-[#63524E] hover:bg-[#f0e8dc]"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-4"
          >
            {link.mega.subgenres.map((s) => (
              <li key={s.slug}>
                <Link
                  to={s.path}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[14px] text-[#63524E] hover:bg-[#f0e8dc] hover:text-[#14213D]"
                >
                  {s.name}
                  <span className="text-[11px] text-[#9a8e84]">{s.count}</span>
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile drawer                                                       */
/* ------------------------------------------------------------------ */
function MobileDrawer({ open, onClose, activeKey }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[#2a1b1b]/40 backdrop-blur-[2px]"
          />
          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
            className="fixed bottom-0 right-0 top-0 z-[70] flex w-[86vw] max-w-sm flex-col bg-[#f8f4ed] shadow-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-[#e4dacb] px-5">
              <span className="text-xl text-[#2a1b1b]" style={headingFont}>Menu</span>
              <button type="button" onClick={onClose} aria-label="Close menu" className={iconBtn}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <motion.nav
              className="flex-1 overflow-y-auto px-3 py-4"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.04, delayChildren: 0.08 } } }}
            >
              {NAV_LINKS.map((link) => (
                <motion.div key={link.key} variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}>
                  {link.mega ? (
                    <MobileGenre link={link} active={activeKey === link.key} onClose={onClose} />
                  ) : (
                    <Link
                      to={link.to}
                      onClick={onClose}
                      aria-current={activeKey === link.key ? "page" : undefined}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-[17px] transition-colors ${
                        activeKey === link.key ? "bg-[#efe4d3] text-[#14213D]" : "text-[#2a1b1b] hover:bg-[#f0e8dc]"
                      }`}
                      style={headingFont}
                    >
                      {link.label}
                      <ChevronRight className="h-4 w-4 opacity-40" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.nav>

            <div className="grid gap-3 border-t border-[#e4dacb] p-5">
              <Link to={CTA.to} onClick={onClose} className={`${ctaClass} justify-center`}>
                {CTA.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="flex justify-center gap-6">
                {ICON_LINKS.map(({ label, to, icon: Icon }) => (
                  <Link key={to} to={to} onClick={onClose} className="inline-flex items-center gap-2 text-[13px] text-[#63524E]">
                    <Icon className="h-4 w-4" strokeWidth={1.6} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */
export function Header({
  onSelectBook, // optional (book) => void; default opens the book page
  onSearch, // optional (query) => void; shows "See all results" when provided
}) {
  const navigate = useNavigate();
  const { container, item } = useEntrance();
  const activeKey = useActiveKey();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [megaKey, setMegaKey] = useState(null); // which genre's mega menu is open
  const [panelLeft, setPanelLeft] = useState(0);
  const closeTimer = useRef(null);
  const rowRef = useRef(null); // the row the panel is positioned in
  const itemRefs = useRef({}); // each nav item, to line the panel up under it
  const location = useLocation();

  const openMega = (key) => {
    clearTimeout(closeTimer.current);
    // Line the panel up under the genre, but keep it inside the row
    const row = rowRef.current;
    const li = itemRefs.current[key];
    if (row && li) {
      const rowBox = row.getBoundingClientRect();
      const liBox = li.getBoundingClientRect();
      const styles = getComputedStyle(row);
      const minLeft = parseFloat(styles.paddingLeft) || 0;
      const maxLeft = rowBox.width - (parseFloat(styles.paddingRight) || 0) - PANEL_WIDTH;
      setPanelLeft(Math.max(minLeft, Math.min(liBox.left - rowBox.left, maxLeft)));
    }
    setMegaKey(key);
  };
  // Small delay so moving the mouse from the link down into the panel doesn't close it
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMegaKey(null), 140);
  };
  const closeMega = () => {
    clearTimeout(closeTimer.current);
    setMegaKey(null);
  };

  // Close on page change and on Escape
  useEffect(() => closeMega(), [location.pathname]);
  useEffect(() => {
    if (!megaKey) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        document.getElementById(`mega-btn-${megaKey}`)?.focus();
        closeMega();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [megaKey]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const openGenre = MEGA_MENU.find((g) => g.slug === megaKey);

  const selectBook = onSelectBook ?? ((book) => navigate(`/book/${getId(book)}`));
  const barKey = hovered ?? activeKey;

  return (
    <>
      <AnnouncementBar />

      <header className="relative z-50 border-b border-[#E4DDD3] bg-[#FAF7F2]">
        {/* ---------- Row 1: logo · search · icons ---------- */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={`${ROW} h-[68px] gap-4 sm:h-[76px] lg:gap-10`}
        >
          <motion.div variants={item}>
            <Logo />
          </motion.div>

          <motion.div variants={item} className="mx-auto hidden w-full max-w-2xl flex-1 md:block">
            <SearchBox onSelectBook={selectBook} onSearch={onSearch} />
          </motion.div>

          <motion.div variants={item} className="ml-auto flex shrink-0 items-center gap-1 md:ml-0">
            <div className="hidden items-center gap-1 sm:flex z-50">
              {ICON_LINKS.map((l) => (
                <IconLink key={l.to} {...l} />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileSearch((s) => !s)}
              aria-label={mobileSearch ? "Close search" : "Open search"}
              aria-expanded={mobileSearch}
              className={`${iconBtn} md:hidden`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={mobileSearch ? "x" : "search"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" strokeWidth={1.75} />}
                </motion.span>
              </AnimatePresence>
            </button>

            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className={`${iconBtn} xl:hidden`}>
              <Menu className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>

        {/* ---------- Mobile search row ---------- */}
        <AnimatePresence initial={false}>
          {mobileSearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden"
              style={{ overflow: "visible" }}
            >
              <div className="px-4 pb-3">
                <SearchBox variant="mobile" autoFocus onSelectBook={selectBook} onSearch={onSearch} onDone={() => setMobileSearch(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- Row 2: links · Explore Books · mega menus (desktop) ---------- */}
        <div className="relative hidden border-t border-[#E4DDD3] xl:block" onMouseLeave={scheduleClose}>
          <div ref={rowRef} className={`${ROW} relative h-14 justify-between gap-6`}>
            <nav aria-label="Main" onMouseLeave={() => setHovered(null)}>
              <motion.ul variants={container} initial="hidden" animate="show" className="-ml-3 flex items-center 2xl:gap-1">
                {NAV_LINKS.map((link) => {
                  const isActive = activeKey === link.key;
                  const isLit = (megaKey ?? hovered ?? activeKey) === link.key;
                  const isOpen = megaKey === link.key;
                  return (
                    <motion.li
                      key={link.key}
                      ref={(el) => (itemRefs.current[link.key] = el)}
                      variants={item}
                      className="relative flex items-center"
                      onMouseEnter={() => (link.mega ? openMega(link.key) : closeMega())}
                    >
                      <Link
                        to={link.to}
                        onMouseEnter={() => setHovered(link.key)}
                        onFocus={() => setHovered(link.key)}
                        onBlur={() => setHovered(null)}
                        aria-current={isActive ? "page" : undefined}
                        className={`relative block whitespace-nowrap rounded py-2 text-[14px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#14213D]/40 2xl:text-[15px] ${
                          link.mega ? "pl-3 pr-1" : "px-3"
                        } ${isLit ? "text-[#14213D]" : "text-[#63524E]"}`}
                      >
                        {link.label}
                      </Link>
                      {link.mega && (
                        <button
                          id={`mega-btn-${link.key}`}
                          type="button"
                          onClick={() => (isOpen ? closeMega() : openMega(link.key))}
                          aria-expanded={isOpen}
                          aria-controls={`mega-${link.key}`}
                          aria-label={`${isOpen ? "Close" : "Open"} ${link.label} menu`}
                          className={`mr-1 grid h-6 w-5 place-items-center rounded outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#14213D]/40 ${
                            isLit ? "text-[#14213D]" : "text-[#9a8e84]"
                          }`}
                        >
                          <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                      {isLit && (
                        <motion.span
                          layoutId="nav-underline"
                          className="pointer-events-none absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#14213D]"
                          transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        />
                      )}
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              onMouseEnter={closeMega}
            >
              <Link to={CTA.to} className={buttonClasses("primary", "md")}>
                {CTA.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </motion.div>

            <AnimatePresence>
              {openGenre && (
                <MegaPanel
                  key={openGenre.slug}
                  id={`mega-${openGenre.slug}`}
                  left={panelLeft}
                  genre={openGenre}
                  onNavigate={closeMega}
                  onMouseEnter={() => openMega(openGenre.slug)}
                  onMouseLeave={scheduleClose}
                />
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} activeKey={activeKey} />
    </>
  );
}

export default Header;