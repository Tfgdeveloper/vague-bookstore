import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Heart, Star } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Heading, Eyebrow, Description } from "./ui/typography";
import { cn } from "../lib/cn";
import { AUTHORS, GENRES } from "../data/books";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const initials = (name = "") => {
  const words = name.replace(/^(Dr|Col|Capt|Mr|Mrs|Ms)\.?\s+/i, "").split(/\s+/).filter((w) => /^[A-Za-z]/.test(w) && !/^(and|&)$/i.test(w));
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
};

// "fiction" → "Fiction", "children" → "Children"
const genreLabel = (slug) =>
  (GENRES.find((g) => g.slug === slug)?.name ?? slug ?? "").replace(/\s+Books$/i, "");

export const bookPath = (book) => `/book/${book.id}`;

// "$4.00 (Kindle) / $12.00 (Paperback)" → { amount: "$4.00", format: "Kindle" }
function firstPrice(price) {
  if (price == null || price === "") return null;
  if (typeof price === "number") return { amount: `$${price.toFixed(2)}`, format: "" };
  const first = String(price).split(/\s*\/\s*/)[0];
  const m = first.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  return m ? { amount: m[1].trim(), format: m[2].trim() } : { amount: first.trim(), format: "" };
}

const focusRing = "rounded outline-none focus-visible:ring-2 focus-visible:ring-[#C5A46D]";

// Badge colours — set `badge: "Book club pick"` and optional `badgeTone` on a book
const BADGE_TONES = {
  terracotta: "bg-[#C8664A] text-white",
  light: "bg-white text-[#1F2A44] shadow-sm",
  maroon: "bg-[#611C24] text-white",
  gold: "bg-[#C9A36B] text-[#2B1E1B]",
};

/* ------------------------------------------------------------------ */
/* Saved books (heart) — remembered in this browser only               */
/* ------------------------------------------------------------------ */
const SAVED_KEY = "bns-saved-books";
const readSaved = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
};

function useSaved(id) {
  const [saved, setSaved] = useState(() => readSaved().has(id));

  // Keep every card for the same book in sync (and across tabs)
  useEffect(() => {
    const sync = () => setSaved(readSaved().has(id));
    window.addEventListener("bns-saved-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bns-saved-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, [id]);

  const toggle = () => {
    const all = readSaved();
    all.has(id) ? all.delete(id) : all.add(id);
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...all]));
    } catch {
      /* storage full or blocked — still update the screen */
    }
    setSaved(all.has(id));
    window.dispatchEvent(new Event("bns-saved-change"));
  };

  return [saved, toggle];
}

function SaveButton({ book }) {
  const [saved, toggle] = useSaved(book.id);
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={reduce ? undefined : { scale: 0.85 }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${book.title} from saved books` : `Save ${book.title}`}
      className="grid h-9 w-9 place-items-center rounded-full bg-white text-[#1F2A44] shadow-sm outline-none transition-colors hover:text-[#C8664A] focus-visible:ring-2 focus-visible:ring-[#C5A46D]"
    >
      <motion.span key={String(saved)} initial={reduce || !saved ? false : { scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
        <Heart className={cn("h-[18px] w-[18px]", saved && "fill-[#C8664A] text-[#C8664A]")} strokeWidth={1.75} />
      </motion.span>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Cover image with a fallback                                         */
/* ------------------------------------------------------------------ */
function CoverImage({ book, className }) {
  const [failed, setFailed] = useState(false);
  if (!book.cover || failed) {
    return (
      <div className={cn("flex aspect-[2/3] flex-col justify-between bg-[#1F2A44] p-[12%] text-white", className)}>
        <span className="font-[family-name:var(--font-heading)] text-[15px] leading-tight">{book.title}</span>
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
      className={cn("aspect-[2/3] object-cover", className)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Author name with hover card                                         */
/* ------------------------------------------------------------------ */
export function AuthorHoverCard({ book }) {
  const author = AUTHORS.find((a) => a.id === book.authorId);
  const name = author?.name ?? book.authorName ?? book.author ?? "";
  const bio = author?.bio ?? author?.shortBio ?? book.authorBio;
  const nameClasses = "text-[13px] text-[#63524E] transition-colors";

  if (!author && !bio) return <span className={nameClasses}>{name}</span>;

  return (
    <HoverCard openDelay={250}>
      <HoverCardTrigger asChild>
        {author ? (
          <Link to={`/authors/${author.id}`} className={cn(nameClasses, focusRing, "hover:text-[#D4A373]")}>
            {name}
          </Link>
        ) : (
          <span tabIndex={0} className={cn(nameClasses, focusRing, "cursor-default")}>
            {name}
          </span>
        )}
      </HoverCardTrigger>

      
    </HoverCard>
  );
}

/* ------------------------------------------------------------------ */
/* Book card                                                           */
/* ------------------------------------------------------------------ */
/**
 * layout:   "grid" (default) or "list"
 * showNote: shows the staff pick note under the details
 * showBuy:  shows the "Buy on Amazon" button (default true)
 * onOpen:   optional; if passed, clicks call onOpen(book) instead of routing
 *
 * Optional book fields it uses: badge, badgeTone, price, format, rating, ratingCount
 */
export function BookCard({ book, layout = "grid", showNote = false, showBuy = true, onOpen, className }) {
  const reduce = useReducedMotion();
  const list = layout === "list";
  const genre = genreLabel(book.genres?.[0] ?? book.genre);
  const note = book.staffNote ?? book.shortDescription ?? book.description;
  const price = firstPrice(book.price);
  const format = book.format ?? price?.format;
  const buy = book.buyLinks?.[0];
  const badge = book.badge ?? (book.featured ? "Staff pick" : null);
  const badgeTone = BADGE_TONES[book.badgeTone] ?? (book.badge ? BADGE_TONES.terracotta : BADGE_TONES.light);

  const handleOpen = (e) => {
    if (onOpen) {
      e.preventDefault();
      onOpen(book);
    }
  };

  /* ---------- List layout (compact row) ---------- */
  if (list) {
    return (
      <article className={cn("flex gap-5 border-b border-[#e4dacb] pb-5", className)}>
        <Link to={bookPath(book)} onClick={handleOpen} tabIndex={-1} aria-hidden="true" className="w-24 shrink-0">
          <CoverImage book={book} className="w-full rounded-[3px] shadow-md" />
        </Link>
        <div className="min-w-0 flex-1">
          {genre && <Eyebrow size="sm" color="gold" className="">{genre}</Eyebrow>}
          <Heading as="h3" size="h4" className="mt-1">
            <Link to={bookPath(book)} onClick={handleOpen} className={cn("hover:text-[#D4A373]", focusRing)}>{book.title}</Link>
          </Heading>
          <AuthorHoverCard book={book} />
          {book.description && <Description size="sm" className="mt-2 line-clamp-3 max-w-prose">{book.description}</Description>}
        </div>
      </article>
    );
  }

  /* ---------- Grid card ---------- */
  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-lg border border-[#ece4d8] bg-white shadow-[0_1px_2px_rgba(42,27,27,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_36px_-18px_rgba(42,27,27,0.35)]",
        className
      )}
    >
      {/* ----- Cover area ----- */}
      <div className="relative bg-[#F1EADF] px-[16%] pb-6 pt-8">
        <Link
          to={bookPath(book)}
          onClick={handleOpen}
          tabIndex={-1} // the title link is the keyboard stop
          aria-hidden="true"
          className="block"
        >
          <CoverImage
            book={book}
            className="mx-auto w-full rounded-[2px] shadow-[0_14px_24px_-10px_rgba(31,42,68,0.5),0_2px_4px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100"
          />
        </Link>

        {badge && (
          <span className={cn("absolute left-3 top-3 rounded px-2 py-1 text-[10px] font-semibold leading-none", badgeTone)}>
            {badge}
          </span>
        )}
        <div className="absolute right-3 top-3">
          <SaveButton book={book} />
        </div>
      </div>

      {/* ----- Details ----- */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {genre && (
          <Eyebrow size="sm" color="inherit" className="text-[#C8664A]">
            {genre}
          </Eyebrow>
        )}

        <Heading as="h3" size="h4" color="dark" className="mt-2 line-clamp-2 text-[#1F2A44]">
          <Link
            to={bookPath(book)}
            onClick={handleOpen}
            className={cn("transition-colors hover:text-[#D4A373]", focusRing)}
          >
            {book.title}
          </Link>
        </Heading>

        <div className="mt-auto pt-4">
          <AuthorHoverCard book={book} />

          {book.rating != null && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3 w-3", i < Math.round(book.rating) ? "fill-[#C9A36B] text-[#C9A36B]" : "text-[#d9cfbf]")}
                  />
                ))}
              </div>
              <span className="text-[12px] text-[#63524E]">
                <span className="sr-only">Rated </span>
                {Number(book.rating).toFixed(1)}
                {book.ratingCount != null && <span> ({book.ratingCount})</span>}
              </span>
            </div>
          )}

          {(price || format) && (
            <div className="mt-2 flex items-baseline justify-between gap-2">
              {price && <span className="montserrat font-button text-[15px] font-bold text-[#1F2A44]">{price.amount}</span>}
              {format && <span className="montserrat text-[10px] text-[#63524E]">{format}</span>}
            </div>
          )}

          {showBuy && buy && (
            <a
              href={buy.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="montserrat font-button mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-[#e0d6c8] bg-white text-[11px] font-semibold text-[#1F2A44] outline-none transition-colors hover:border-[#1F2A44] hover:bg-[#1F2A44] hover:text-white focus-visible:ring-2 focus-visible:ring-[#C5A46D]"
            >
              {/amazon/i.test(buy.label) ? "Buy on Amazon" : "Get the book"}
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default BookCard;