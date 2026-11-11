import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Feather, KeyRound, Library, Lightbulb, Sparkles } from "lucide-react";
import { Heading, Eyebrow, Description } from "./ui/typography";
import { BOOKS, GENRES } from "../data/books";

/* ------------------------------------------------------------------ */
/* Card settings per genre — label, icon and the word for the count.   */
/* Genres come from GENRES in books.js; anything not listed here still */
/* shows, with a book icon and "books".                                */
/* ------------------------------------------------------------------ */
const CARD_SETTINGS = {
  fiction: { label: "Fiction", icon: BookOpen, noun: ["story", "stories"] },
  novel: { label: "Novels", icon: Library, noun: ["novel", "novels"] },
  "non-fiction": { label: "Non-fiction", icon: Lightbulb, noun: ["true story", "true stories"] },
  children: { label: "Young Readers", icon: Sparkles, noun: ["young read", "young reads"] },
  "mystery-thriller": { label: "Mystery & Thriller", icon: KeyRound, noun: ["page-turner", "page-turners"] },
  poetry: { label: "Poetry", icon: Feather, noun: ["collection", "collections"] },
};

/* ------------------------------------------------------------------ */
/* Collections for "A shelf for every chapter."                        */
/*   genres : which genre slugs count towards this collection          */
/*   to     : where the card links                                     */
/*   image  : photo for the card (public/images/collections/...)       */
/* ------------------------------------------------------------------ */
const COLLECTIONS = [
  {
    key: "fiction-fantasy",
    title: "Fiction & Fantasy",
    subtitle: "Stories that take you somewhere extraordinary.",
    genres: ["fiction"],
    to: "/fiction",
    image: "/images/fiction-fantasy.png",
    fallback: "linear-gradient(135deg,#2c3e50,#4a6741)",
    noun: ["story to escape into", "stories to escape into"],
  },
  {
    key: "mystery-thriller",
    title: "Mystery & Thriller",
    subtitle: "Turn the page. Uncover the truth.",
    genres: ["mystery-thriller"],
    to: "/mystery-thriller",
    image: "/images/mystery-thriller.png",
    fallback: "linear-gradient(135deg,#14213D,#3a2a3f)",
    noun: ["page-turner", "page-turners"],
  },
  {
    key: "romance",
    title: "Romance & Relationships",
    subtitle: "Stories that stay with your heart.",
    genres: ["romance"],
    to: "/romance",
    image: "/images/romance.png",
    fallback: "linear-gradient(135deg,#7a2e3a,#c28a7a)",
    noun: ["love story", "love stories"],
  },
];

const countLabel = (count, [one, many]) =>
  count === 0 ? "Coming soon" : `${count.toLocaleString("en-US")} ${count === 1 ? one : many}`;

const countBooks = (slugs) => BOOKS.filter((b) => b.genres?.some((g) => slugs.includes(g))).length;

/* ------------------------------------------------------------------ */
/* Animation                                                           */
/* ------------------------------------------------------------------ */
function useFadeUp() {
  const reduce = useReducedMotion();
  return {
    container: { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } },
    item: {
      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
      show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    },
  };
}

const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.3 } };
const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";

/* ================================================================== */
/* 1. Genre cards — "Find your kind of story."                         */
/* ================================================================== */
function GenreCard({ slug, label, icon: Icon, count, noun, variants }) {
  const reduce = useReducedMotion();
  return (
    <motion.li variants={variants}>
      <Link
        to={`/${slug}`}
        className="group flex h-full flex-col items-center rounded-lg border border-transparent bg-[#FAF7F2] px-4 py-7 text-center shadow-[0_1px_2px_rgba(42,27,27,0.04)] outline-none transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-[#E4DDD3] hover:shadow-[0_16px_30px_-18px_rgba(42,27,27,0.35)] focus-visible:ring-2 focus-visible:ring-[#C9A36B] motion-reduce:hover:translate-y-0 sm:py-8"
      >
        <motion.span
          aria-hidden="true"
          whileHover={reduce ? undefined : { rotate: -8, scale: 1.1 }}
          className="grid h-12 w-12 place-items-center rounded-full text-[#D4A373] transition-colors duration-300 group-hover:bg-[#F3E4D6]"
        >
          <Icon className="h-7 w-7" strokeWidth={1.4} />
        </motion.span>

        <h3 className="font-button mt-4 text-[14px] font-semibold text-[#14213D] transition-colors group-">
          {label}
        </h3>
        <p className="mt-1.5 text-[11px] text-[#77736D]">{countLabel(count, noun)}</p>
      </Link>
    </motion.li>
  );
}

export default function TopGenres({
  eyebrow = "Follow your curiosity",
  title = "Find your kind of story.",
}) {
  const { container, item } = useFadeUp();

  const cards = GENRES.map((g) => {
    const settings = CARD_SETTINGS[g.slug] ?? {};
    return {
      slug: g.slug,
      label: settings.label ?? g.name.replace(/\s+Books$/i, ""),
      icon: settings.icon ?? BookOpen,
      noun: settings.noun ?? ["book", "books"],
      count: countBooks([g.slug]),
    };
  });

  return (
    <section className="bg-[#EFE7DB] py-16 sm:py-20">
      <div className={CONTAINER}>
        <motion.div variants={container} {...inView} className="mb-10 text-center md:text-left">
          <Eyebrow size="md" color="gold" variants={item} className="mb-3">
            {eyebrow}
          </Eyebrow>
          <Heading as="h2" size="h2" color="dark" variants={item}>
            {title}
          </Heading>
        </motion.div>

        <motion.ul variants={container} {...inView} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-5">
          {cards.map((card) => (
            <GenreCard key={card.slug} {...card} variants={item} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

/* ================================================================== */
/* 2. Collection cards — "A shelf for every chapter."                  */
/* ================================================================== */
function CollectionCard({ collection, variants }) {
  const [imageFailed, setImageFailed] = useState(false);
  const count = countBooks(collection.genres);

  return (
    <motion.li variants={variants}>
      <Link
        to={collection.to}
        className="group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#C9A36B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FAF7F2]"
      >
        <div
          className="relative aspect-[3/2] overflow-hidden rounded-lg"
          style={imageFailed || !collection.image ? { background: collection.fallback } : undefined}
        >
          {collection.image && !imageFailed && (
            <img
              src={collection.image}
              alt=""
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          )}

          {/* Dark fade at the bottom so the text is readable on any photo */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <h3 className="font-[family-name:var(--font-heading)] text-[22px] leading-tight text-white sm:text-[26px]">
              {collection.title}
            </h3>
            <p className="mt-1.5 flex items-center gap-2 text-[12px] text-white/85">
              {collection.subtitle}
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              />
            </p>
          </div>
        </div>
      </Link>
      <p className="mt-3 text-[12px] text-[#77736D]">{countLabel(count, collection.noun)}</p>
    </motion.li>
  );
}

export function CollectionShelves({
  eyebrow = "The bookseller’s edit",
  title = "A shelf for every chapter.",
  linkLabel = "Explore all collections",
  linkTo = "/new-books",
  collections = COLLECTIONS,
}) {
  const { container, item } = useFadeUp();

  return (
    <section className="bg-[#FAF7F2] py-16 sm:py-20">
      <div className={CONTAINER}>
        <motion.div variants={container} {...inView} className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="text-center md:text-left">
            <Eyebrow size="md" color="gold" variants={item} className="mb-3">
              {eyebrow}
            </Eyebrow>
            <Heading as="h2" size="h2" color="dark" variants={item}>
              {title}
            </Heading>
          </div>
          {linkTo && (
            <motion.div variants={item}>
              <Link
                to={linkTo}
                className="font-button group inline-flex items-center gap-2 rounded text-[13px] font-semibold text-[#14213D] outline-none transition-colors  focus-visible:ring-2 focus-visible:ring-[#C9A36B]"
              >
                {linkLabel}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </motion.div>

        <motion.ul variants={container} {...inView} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {collections.map((c) => (
            <CollectionCard key={c.key} collection={c} variants={item} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}