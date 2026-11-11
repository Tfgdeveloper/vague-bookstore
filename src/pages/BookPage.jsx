import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, Barcode, BookOpen, Building2, CalendarDays, Check, ChevronRight, ExternalLink, Heart, Info,
  Languages, Ruler, Share2, ShieldCheck, UserRound, Users,
} from "lucide-react";
import { BookCard } from "../components/BookCard";
import { BookCover } from "../components/BookCover";
import { SectionHeading } from "../components/ui/typography";
import { BOOKS, authorPath, getAuthor, getBooksByAuthor } from "../data/books";
import { CONTAINER, genreInfo, subgenreInfo, usePageTitle, NotFound } from "../lib/pageHelpers";

/* ------------------------------------------------------------------ */
/* Helpers for the book's fields                                       */
/* ------------------------------------------------------------------ */

// "$4.00 (Kindle) / $12.00 (Paperback)" → [{ amount: "$4.00", format: "Kindle" }, ...]
function parsePrices(price) {
  if (!price) return [];
  if (typeof price === "number") return [{ amount: `$${price.toFixed(2)}`, format: "" }];
  return String(price)
    .split(/\s*\/\s*/)
    .map((part) => {
      const m = part.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      return m ? { amount: m[1].trim(), format: m[2].trim() } : { amount: part.trim(), format: "" };
    })
    .filter((p) => p.amount);
}

// "B0HMHGHZ96 (ASIN) / 979-8182890632 (ISBN-13)" → [{ label: "ASIN", value }, { label: "ISBN-13", value }]
function parseIds(raw) {
  if (!raw) return [];
  return String(raw)
    .split(/\s*\/\s*/)
    .map((part) => {
      const m = part.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      const value = (m ? m[1] : part).trim();
      const digits = value.replace(/[^\dX]/gi, "");
      const label = m
        ? m[2].replace(/paperback\s+/i, "").trim()
        : /^B0[A-Z0-9]{8}$/i.test(value) ? "ASIN" : digits.length === 13 ? "ISBN-13" : digits.length === 10 ? "ISBN-10" : "ISBN";
      return { label: /^isbn$/i.test(label) && digits.length === 13 ? "ISBN-13" : label, value };
    })
    .filter((x) => x.value);
}

// "6 x 9 inches" → "6 × 9 in";  "8.5 x 0.14 x 11 inches" → "8.5 × 11 in"
function formatTrim(book) {
  const raw = book.trim ?? book.trimSize ?? book.dimensions;
  const nums = String(raw ?? "").match(/[\d.]+/g);
  if (!nums || nums.length < 2) return "";
  const unit = /cm/i.test(raw) ? "cm" : "in";
  return nums.length >= 3 ? `${nums[0]} × ${nums[2]} ${unit}` : `${nums[0]} × ${nums[1]} ${unit}`;
}

function bookFacts(book) {
  return [
    { key: "pages", label: "Print length", value: book.printLength ?? (book.pages && `${book.pages} pages`), icon: BookOpen },
    { key: "language", label: "Language", value: book.language, icon: Languages },
    { key: "published", label: "Publication date", value: book.publicationDate ?? book.publishedAt, icon: CalendarDays },
    { key: "trim", label: "Trim size", value: formatTrim(book), icon: Ruler },
    { key: "publisher", label: "Publisher", value: book.publisher, icon: Building2 },
    { key: "age", label: "Reading age", value: book.ageGroup && `${book.ageGroup} years`, icon: Users },
    ...parseIds(book.isbn ?? book.asin).map((id, i) => ({ key: `id-${i}`, label: id.label, value: id.value, icon: Barcode })),
  ].filter((f) => f.value);
}

const buyLabel = (label = "") => (/amazon/i.test(label) ? "Buy on Amazon" : `Buy from ${label}`);

/* ------------------------------------------------------------------ */
/* Saved books (heart) — kept in this browser                          */
/* ------------------------------------------------------------------ */
const SAVED_KEY = "bns-saved-books";
function useSaved(id) {
  const read = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]")).has(id);
    } catch {
      return false;
    }
  };
  const [saved, setSaved] = useState(read);
  useEffect(() => setSaved(read()), [id]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = () => {
    try {
      const all = new Set(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]"));
      all.has(id) ? all.delete(id) : all.add(id);
      localStorage.setItem(SAVED_KEY, JSON.stringify([...all]));
      setSaved(all.has(id));
      window.dispatchEvent(new Event("bns-saved-change"));
    } catch {
      setSaved((s) => !s);
    }
  };
  return [saved, toggle];
}

/* ------------------------------------------------------------------ */
/* Long description that folds after a few lines                       */
/* ------------------------------------------------------------------ */
function ReadMore({ text }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !open) setOverflows(el.scrollHeight > el.clientHeight + 2);
  }, [text, open]);

  return (
    <div>
      <div ref={ref} className={open ? "" : "line-clamp-[8]"}>
        {text
          .split(/\n{2,}|(?<=\.)\s+(?=NOTE\b)/)
          .map((para, i) => (
            <p key={i} className="mb-4 text-[15px] leading-[1.85] text-[#3f3a36] last:mb-0">
              {para.trim()}
            </p>
          ))}
      </div>
      {(overflows || open) && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-3 text-[13px] font-semibold text-[#14213D] underline underline-offset-4 hover:text-[#B39262]"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Buy box (right column)                                              */
/* ------------------------------------------------------------------ */
function BuyBox({ book, prices, buyRef }) {
  const [format, setFormat] = useState(0);
  const [saved, toggleSaved] = useSaved(book.id);
  const [copied, setCopied] = useState(false);
  const links = book.buyLinks ?? [];
  const selected = prices[format];

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: book.title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* closed the share sheet */
    }
  };

  return (
    <div ref={buyRef} className="rounded-md border border-[#E4DDD3] bg-white p-5">
      {/* Price */}
      {selected ? (
        <div>
          <p className="text-[12px] text-[#77736D]">{selected.format || "Price"}</p>
          <p className="font-[family-name:var(--font-heading)] text-[34px] leading-tight text-[#14213D]">{selected.amount}</p>
        </div>
      ) : (
        <p className="font-[family-name:var(--font-heading)] text-[22px] text-[#14213D]">Available now</p>
      )}

      {/* Formats */}
      {prices.length > 1 && (
        <fieldset className="mt-4">
          <legend className="mb-2 text-[12px] font-semibold text-[#14213D]">Format</legend>
          <div className="grid gap-2">
            {prices.map((p, i) => {
              const active = i === format;
              return (
                <button
                  key={`${p.format}-${p.amount}`}
                  type="button"
                  onClick={() => setFormat(i)}
                  aria-pressed={active}
                  className={`flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#14213D]/40 ${
                    active ? "border-[#14213D] bg-[#14213D]/[0.04]" : "border-[#E4DDD3] hover:border-[#14213D]/40"
                  }`}
                >
                  <span className="flex items-center gap-2 text-[#14213D]">
                    <span
                      aria-hidden="true"
                      className={`grid h-4 w-4 place-items-center rounded-full border ${active ? "border-[#14213D] bg-[#14213D]" : "border-[#c9c0b6]"}`}
                    >
                      {active && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                    </span>
                    {p.format || "Edition"}
                  </span>
                  <span className="font-semibold text-[#14213D]">{p.amount}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-[#77736D]">
            <Info aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0" />
            You’ll choose the format again on the seller’s page.
          </p>
        </fieldset>
      )}

      {/* Buy buttons */}
      {links.length > 0 && (
        <div className="mt-5 grid gap-2">
          {links.map((link, i) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className={`inline-flex h-11 items-center justify-center gap-2 rounded-md text-[13px] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#C9A36B] focus-visible:ring-offset-2 ${
                i === 0
                  ? "bg-[#14213D] text-white hover:bg-[#22325a]"
                  : "border border-[#14213D] text-[#14213D] hover:bg-[#14213D] hover:text-white"
              }`}
            >
              {buyLabel(link.label)}
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      )}

      {/* Save + share */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={toggleSaved}
          aria-pressed={saved}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#E4DDD3] text-[12px] font-semibold text-[#14213D] transition-colors hover:border-[#14213D]/40"
        >
          <Heart aria-hidden="true" className={`h-4 w-4 ${saved ? "fill-[#C8664A] text-[#C8664A]" : ""}`} />
          {saved ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={share}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#E4DDD3] text-[12px] font-semibold text-[#14213D] transition-colors hover:border-[#14213D]/40"
        >
          {copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Share2 aria-hidden="true" className="h-4 w-4" />}
          {copied ? "Link copied" : "Share"}
        </button>
      </div>

      {/* Trust notes */}
      <ul className="mt-5 grid gap-2 border-t border-[#EFE9E1] pt-4 text-[12px] leading-relaxed text-[#63524E]">
        <li className="flex gap-2">
          <ShieldCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B39262]" />
          You buy directly from the seller{links[0] && /amazon/i.test(links[0].label) ? " on Amazon" : ""}.
        </li>
        <li className="flex gap-2">
          <Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B39262]" />
          Prices may change. Some links are affiliate links, so we may earn a small commission at no extra cost to you.
        </li>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Author photo or user avatar                                         */
/* ------------------------------------------------------------------ */
function AuthorAvatar({ author, size = "h-11 w-11", icon = "h-5 w-5" }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`${size} shrink-0 overflow-hidden rounded-full bg-[#EFE7DB] ring-1 ring-[#E4DDD3]`}>
      {author?.photo && !failed ? (
        <img src={author.photo} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        <span className="grid h-full w-full place-items-center text-[#14213D]/45">
          <UserRound aria-hidden="true" className={icon} strokeWidth={1.5} />
        </span>
      )}
    </span>
  );
}

/* ================================================================== */
/* Page — Route: /book/:bookId                                         */
/* ================================================================== */
export default function BookPage() {
  const { bookId } = useParams();
  const reduce = useReducedMotion();
  const book = BOOKS.find((b) => b.id === bookId);
  const author = book ? getAuthor(book.authorId) : null;
  const authorName = (author?.name ?? book?.author ?? book?.authorName ?? "").trim();

  usePageTitle(book ? book.title : "Book not found");

  // Mobile buy bar appears once the buy box scrolls out of view
  const buyRef = useRef(null);
  const [showBar, setShowBar] = useState(false);
  useEffect(() => {
    const check = () => {
      const el = buyRef.current;
      setShowBar(!!el && el.getBoundingClientRect().bottom < 0);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [bookId]);

  if (!book) {
    return (
      <NotFound
        title="We couldn’t find that book"
        message="It may have been removed, or the link might be wrong."
        backTo="/new-books"
        backLabel="Browse new books"
      />
    );
  }

  const genres = (book.genres ?? []).map(genreInfo);
  const subgenres = (book.subgenres ?? []).map(subgenreInfo);
  const crumbGenre = subgenres[0] ? genreInfo(subgenres[0].genre) : genres[0];
  const prices = parsePrices(book.price);
  const facts = bookFacts(book);
  const firstLink = book.buyLinks?.[0];
  const lowest = prices.find((p) => p.amount !== "$0.00")?.amount ?? prices[0]?.amount;

  const [mainTitle, ...rest] = book.title.split(/:\s+/);
  const subtitle = book.subtitle || rest.join(": ");

  // Short line under the author: "Oct 31, 2026 · 87 pages · English"
  const meta = [book.publicationDate ?? book.publishedAt, book.printLength, book.language].filter(Boolean);

  const moreByAuthor = getBooksByAuthor(book.authorId).filter((b) => b.id !== book.id).slice(0, 6);
  const shareCount = (b) => (b.subgenres ?? []).filter((x) => book.subgenres?.includes(x)).length;
  const related = BOOKS.filter(
    (b) => b.id !== book.id && b.authorId !== book.authorId && b.genres?.some((g) => book.genres.includes(g))
  )
    .sort((a, b) => shareCount(b) - shareCount(a))
    .slice(0, 6);

  const fade = (delay = 0) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
      : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } };

  return (
    <>
      <section className="bg-[#FAF7F2] pb-16 pt-6 sm:pb-20 sm:pt-8">
        <div className={CONTAINER}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-[#77736D]">
              <li><Link to="/" className="hover:text-[#14213D]">Home</Link></li>
              {crumbGenre && (
                <>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                  <li><Link to={crumbGenre.path} className="hover:text-[#14213D]">{crumbGenre.name}</Link></li>
                </>
              )}
              {subgenres[0] && (
                <>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
                  <li><Link to={subgenres[0].path} className="hover:text-[#14213D]">{subgenres[0].name}</Link></li>
                </>
              )}
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              <li aria-current="page" className="max-w-[16rem] truncate text-[#14213D]">{mainTitle}</li>
            </ol>
          </nav>

          {/*
            Layout
            phone:   cover · title · buy box · description
            tablet:  cover | title, buy box, description
            desktop: cover | title + description | buy box
          */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_minmax(0,1fr)] md:gap-x-10 lg:grid-cols-[280px_minmax(0,1fr)_300px] lg:gap-x-12 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
            {/* ===== Left: cover ===== */}
            <motion.div {...fade(0)} className="mx-auto w-full max-w-[260px] md:row-span-3 md:mx-0 md:max-w-none lg:row-span-2">
              <div className="md:sticky md:top-6">
                <div className="rounded-md bg-[#EFE7DB] p-6 sm:p-8">
                  <div className="shadow-[0_22px_36px_-18px_rgba(20,33,61,0.55)]">
                    <BookCover book={book} />
                  </div>
                </div>
                {formatTrim(book) && (
                  <p className="mt-3 text-center text-[12px] text-[#77736D]">Trim size {formatTrim(book)}</p>
                )}
              </div>
            </motion.div>

            {/* ===== Center (top): title, author, tags ===== */}
            <motion.div {...fade(0.05)} className="min-w-0 md:col-start-2 md:row-start-1">
              <h1 className="font-[family-name:var(--font-heading)] text-[32px] font-normal leading-[1.15] tracking-[-0.01em] text-[#14213D] [text-wrap:balance] md:text-[40px]">
                {mainTitle}
              </h1>
              {subtitle && (
                <p className="mt-2 font-[family-name:var(--font-heading)] text-[19px] italic leading-snug text-[#63524E]">{subtitle}</p>
              )}

              {authorName && (
                <div className="mt-5 flex items-center gap-3">
                  <AuthorAvatar author={author} />
                  <p className="text-[14px] text-[#63524E]">
                    by{" "}
                    {author ? (
                      <Link to={authorPath(author)} className="font-semibold text-[#14213D] underline-offset-4 hover:underline">
                        {authorName}
                      </Link>
                    ) : (
                      <span className="font-semibold text-[#14213D]">{authorName}</span>
                    )}{" "}
                    <span className="text-[#a39a92]">(Author)</span>
                  </p>
                </div>
              )}

              {meta.length > 0 && <p className="mt-3 text-[13px] text-[#77736D]">{meta.join(" · ")}</p>}

              {(genres.length > 0 || subgenres.length > 0) && (
                <ul aria-label="Genres" className="mt-5 flex flex-wrap gap-2">
                  {genres.map((g) => (
                    <li key={g.slug}>
                      <Link to={g.path} className="inline-block rounded-md bg-[#14213D] px-2.5 py-1 text-[12px] font-medium text-white transition-colors hover:bg-[#22325a]">
                        {g.name}
                      </Link>
                    </li>
                  ))}
                  {subgenres.map((s) => (
                    <li key={s.slug}>
                      <Link to={s.path} className="inline-block rounded-md border border-[#E4DDD3] bg-white px-2.5 py-1 text-[12px] text-[#3f3a36] transition-colors hover:border-[#14213D]">
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            {/* ===== Right: buy box ===== */}
            <motion.aside
              {...fade(0.1)}
              aria-label="Buy this book"
              className="md:col-start-2 md:row-start-2 lg:col-start-3 lg:row-span-2 lg:row-start-1"
            >
              <div className="lg:sticky lg:top-6">
                <BuyBox book={book} prices={prices} buyRef={buyRef} />
              </div>
            </motion.aside>

            {/* ===== Center (bottom): description + details ===== */}
            <motion.div {...fade(0.15)} className="min-w-0 md:col-start-2 md:row-start-3 lg:row-start-2">
              {book.description && (
                <section aria-labelledby="about-book" className="border-t border-[#E4DDD3] pt-6">
                  <h2 id="about-book" className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#14213D]">
                    About this book
                  </h2>
                  <ReadMore text={book.description} />
                </section>
              )}

              {facts.length > 0 && (
                <section aria-labelledby="book-details" className="mt-8 border-t border-[#E4DDD3] pt-6">
                  <h2 id="book-details" className="mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-[#14213D]">
                    Book details
                  </h2>
                  <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-[#E4DDD3] bg-[#E4DDD3] sm:grid-cols-2">
                    {facts.map(({ key, label, value, icon: Icon }) => (
                      <div key={key} className="flex items-start gap-3 bg-white px-4 py-3">
                        <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#B39262]" />
                        <div className="min-w-0">
                          <dt className="text-[11px] uppercase tracking-[0.1em] text-[#77736D]">{label}</dt>
                          <dd className="mt-0.5 break-words text-[14px] font-medium text-[#14213D]">{value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------- About the author ---------- */}
      {author && (
        <section className="border-t border-[#E4DDD3] bg-white py-14 sm:py-16">
          <div className={`${CONTAINER} grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8`}>
            <AuthorAvatar author={author} size="h-24 w-24" icon="h-10 w-10" />
            <div className="min-w-0 max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#D9773B]">About the author</p>
              <h2 className="mt-2 font-[family-name:var(--font-heading)] text-[28px] leading-tight text-[#14213D]">{authorName}</h2>
              {author.bio ? (
                <p className="mt-3 line-clamp-4 text-[15px] leading-[1.8] text-[#3f3a36]">{author.bio}</p>
              ) : (
                <p className="mt-3 text-[14px] text-[#77736D]">A biography is on its way.</p>
              )}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                <Link to={authorPath(author)} className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#14213D]">
                  View author page
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                {author.website && (
                  <a href={author.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#14213D] hover:underline">
                    Author’s website
                    <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {moreByAuthor.length > 0 && <BookRow eyebrow="From the same pen" title={`More by ${authorName}`} books={moreByAuthor} />}

      {related.length > 0 && (
        <BookRow
          eyebrow="You may also like"
          title={`More ${subgenres[0]?.name ?? genres[0]?.name ?? "books"}`}
          books={related}
          link={
            subgenres[0]
              ? { label: `See all ${subgenres[0].name}`, to: subgenres[0].path }
              : genres[0] && { label: `See all ${genres[0].name}`, to: genres[0].path }
          }
        />
      )}

      {/* ---------- Mobile buy bar ---------- */}
      <AnimatePresence>
        {firstLink && showBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E4DDD3] bg-white/95 px-5 py-3 backdrop-blur md:hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#14213D]">{mainTitle}</p>
                {lowest && <p className="text-[12px] text-[#77736D]">from {lowest}</p>}
              </div>
              <a
                href={firstLink.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-md bg-[#14213D] px-4 text-[13px] font-semibold text-white"
              >
                {buyLabel(firstLink.label)}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function BookRow({ eyebrow, title, books, link }) {
  return (
    <section className="border-t border-[#E4DDD3] bg-[#FAF7F2] py-14 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          action={
            link && (
              <Link to={link.to} className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#14213D]">
                {link.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )
          }
        />
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-5 lg:gap-x-6 2xl:grid-cols-6">
          {books.map((b) => (
            <li key={b.id}>
              <BookCard book={b} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}