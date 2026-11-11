import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Book, Check, Gift, Shield, Star, Van } from "lucide-react";
import { buttonClasses } from "./ui/button";
import { Heading, Eyebrow, Description } from "./ui/typography";
import { AUTHORS, BOOKS } from "../data/books";

/* ------------------------------------------------------------------ */
/* Slides are built automatically from books.js:                       */
/* every author with 2 or more books gets a slide with two of them.    */
/* Featured books are picked first.                                    */
/* ------------------------------------------------------------------ */
const MAX_SLIDES = 6;
const FALLBACK_COLORS = ["#1f3a2e", "#7a3b2e", "#13294b", "#5c3a21", "#3d2b4f", "#611C24"];
const HERO_TRIM = { width: 6, height: 9 };

function readTrim(book) {
  const text = book.trim ?? book.trimSize ?? book.dimensions ?? "";
  const nums = String(text).match(/[\d.]+/g)?.map(Number);
  if (!nums || nums.length < 2) return null;
  // With 3 numbers (width x thickness x height), skip the thickness
  return nums.length >= 3 ? { width: nums[0], height: nums[2] } : { width: nums[0], height: nums[1] };
}

const hasHeroTrim = (book) => {
  const t = readTrim(book);
  return !!t && t.width === HERO_TRIM.width && t.height === HERO_TRIM.height;
};

function buildSlides(max = MAX_SLIDES) {
  const byAuthor = new Map();
  for (const book of BOOKS) {
    if (!book.authorId || !hasHeroTrim(book)) continue;
    if (!byAuthor.has(book.authorId)) byAuthor.set(book.authorId, []);
    byAuthor.get(book.authorId).push(book);
  }

  const slides = [];
  for (const [authorId, books] of byAuthor) {
    if (books.length < 2) continue;
    const picked = [...books].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 2);
    const n = slides.length;
    slides.push({
      authorId,
      authorName: AUTHORS.find((a) => a.id === authorId)?.name ?? picked[0].authorName ?? "",
      books: picked.map((b, i) => ({
        id: b.id,
        title: b.title,
        cover: b.cover,
        fallback: FALLBACK_COLORS[(n * 2 + i) % FALLBACK_COLORS.length],
      })),
    });
    if (slides.length >= max) break;
  }
  return slides;
}

const AUTO_SLIDES = buildSlides();

const DEFAULT_FEATURES = [
  { icon: Van, title: "Free shipping", description: "On orders over $50" },
  { icon: Book, title: "Thoughtfully chosen", description: "By real book lovers" },
  { icon: Gift, title: "Beautifully wrapped", description: "A joy to give & receive" },
  { icon: Shield, title: "Shop with confidence", description: "Secure, easy checkout" },
];

const DEFAULT_PROOF = { avatars: ["SQ", "OF", "HM"], text: "Loved by curious readers everywhere" };

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */
function useFadeUp() {
  const reduce = useReducedMotion();
  return {
    container: {
      hidden: {},
      show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
    },
    item: {
      hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
    },
  };
}

function HeroActions({ primaryAction, secondaryAction, align = "start", variants }) {
  if (!primaryAction && !secondaryAction) return null;
  return (
    <motion.div
      variants={variants}
      className={`mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap ${
        align === "center" ? "items-stretch sm:justify-center" : "items-stretch sm:items-center"
      }`}
    >
      {primaryAction && (
        <Link to={primaryAction.to} className={`group ${buttonClasses("primary", "md")}`}>
          {primaryAction.label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
      {secondaryAction && (
        <Link to={secondaryAction.to} className={buttonClasses("outline", "md")}>
          {secondaryAction.label}
        </Link>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Feature strip shown under the split hero                            */
/* ------------------------------------------------------------------ */
function FeatureStrip({ features, container, item }) {
  if (!features?.length) return null;
  return (
    <section className="relative overflow-hidden border-y border-[#E4DDD3] bg-white">
      <motion.ul
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto grid w-full max-w-[1700px] grid-cols-1 gap-6 px-5 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:gap-8 lg:px-16"
      >
        {features.map((feature) => {
          const Icon = feature.icon ?? Check;
          return (
            <motion.li key={feature.title} variants={item} className="flex min-w-0 items-start gap-3">
              <span aria-hidden="true" className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full text-[#D4A373]">
                <Icon className="h-full w-full" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <Heading as="h3" size="h5" font="sans" className="montserrat font-semibold">{feature.title}</Heading>
                <Description size="xsm" className="mt-1">{feature.description}</Description>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* One book cover (falls back to a coloured cover if the image fails)  */
/* ------------------------------------------------------------------ */
function BookCoverImage({ book }) {
  const [failed, setFailed] = useState(false);
  if (!book.cover || failed) {
    return (
      <div className="flex h-full w-full flex-col justify-between p-[10%] text-white" style={{ backgroundColor: book.fallback ?? "#1F2A44" }}>
        <span className="font-[family-name:var(--font-heading)] text-[clamp(0.9rem,1.6vw,1.6rem)] leading-tight">{book.title}</span>
        <span className="h-px w-1/2 bg-white/40" />
      </div>
    );
  }
  return <img src={book.cover} alt="" draggable="false" onError={() => setFailed(true)} className="h-full w-full object-contain" />;
}

/* ------------------------------------------------------------------ */
/* Book slider — changes on its own; pauses while hovered or focused   */
/* ------------------------------------------------------------------ */
const EASE = [0.22, 1, 0.36, 1];

function BookSlider({ slides, interval = 5000 }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const firstRender = useRef(true);
  const count = slides.length;
  const slide = slides[index] ?? slides[0];
  const [back, front] = slide.books;

  const go = useCallback(
    (next, direction) => {
      setDir(direction);
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  // Autoplay
  useEffect(() => {
    if (paused || count < 2) return;
    const t = setTimeout(() => go(index + 1, 1), interval);
    return () => clearTimeout(t);
  }, [index, paused, count, interval, go]);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  // On first load the books wait for the circle and shelf to appear
  const introDelay = firstRender.current ? 0.75 : 0;

  const bookMotion = (baseRotate, delay) => {
    if (reduce) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.35, delay } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      };
    }
    const swing = dir > 0 ? -100 : 100;
    return {
      initial: { opacity: 0, rotateY: swing, rotate: 0, y: -70, x: 40 * dir, scale: 0.92 },
      animate: {
        opacity: 1,
        rotateY: 0,
        rotate: baseRotate,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          delay: delay + introDelay,
          opacity: { duration: 0.25, delay: delay + introDelay },
          rotateY: { type: "spring", stiffness: 70, damping: 13, delay: delay + introDelay },
          y: { type: "spring", stiffness: 160, damping: 14, delay: delay + introDelay + 0.1 },
          default: { duration: 0.7, ease: EASE, delay: delay + introDelay },
        },
      },
      exit: {
        opacity: 0,
        rotateY: -swing * 0.9,
        y: 30,
        scale: 0.94,
        transition: { duration: 0.4, ease: "easeIn", delay: delay / 3 },
      },
    };
  };

  const renderBook = (book, key, className, baseRotate, delay, floatDelay) =>
    book && (
      <motion.div
        key={`${index}-${key}`}
        {...bookMotion(baseRotate, delay)}
        style={{ transformOrigin: "left bottom", transformStyle: "preserve-3d" }}
        className={`absolute bottom-[25.5%] ${className}`}
      >
        {/* Soft shadow on the shelf that grows as the book lands */}
        <motion.span
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0.2, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: delay + introDelay + 0.35, duration: 0.5, ease: EASE }}
          className="absolute -bottom-20 left-[8%] right-[8%] h-4 rounded-[50%] bg-[#2a1b1b]/25 blur-md"
        />
        <motion.div
          animate={reduce ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: floatDelay + 1.5 }}
        >
          <Link
            to={`/book/${book.id}`}
            draggable="false"
            aria-label={book.title}
            className="relative block aspect-[2/3] overflow-hidden rounded-l-sm rounded-r-md shadow-[0_24px_40px_-18px_rgba(31,42,68,0.55),inset_5px_0_0_rgba(0,0,0,0.14)] outline-none transition-transform duration-300 hover:-translate-y-1.5 focus-visible:ring-4 focus-visible:ring-[#C9A36B]/60"
          >
            <BookCoverImage book={book} />
            {/* Light sweeping across the cover once it has turned */}
            {!reduce && (
              <motion.span
                aria-hidden="true"
                initial={{ x: "-130%" }}
                animate={{ x: "130%" }}
                transition={{ delay: delay + introDelay + 0.75, duration: 1.1, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-y-50 -left-1/4 w-2/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent"
              />
            )}
          </Link>
        </motion.div>
      </motion.div>
    );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured books"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative mx-auto w-full max-w-[560px]"
    >
      {/* Stage */}
      <div className="relative aspect-[1/0.92] w-full select-none">
        {/* Circle */}
        <motion.div
          aria-hidden="true"
          initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="absolute left-[11%] top-[4%] aspect-square w-[78%] overflow-hidden rounded-full bg-gradient-to-b from-[#DDD0BB] to-[#F3EBDD]"
        />

        {/* Books (3D stage) */}
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}${slide.authorName ? `: books by ${slide.authorName}` : ""}`}
          className="absolute inset-0 z-10"
          style={{ perspective: "1400px" }}
        >
          <AnimatePresence mode="popLayout">
            {renderBook(back, "back", "left-[17%] w-[36%]", -3, 0, 0)}
            {renderBook(front, "front", "left-[47%] w-[31%] z-10", 4, 0.18, 1.5)}
          </AnimatePresence>
        </div>

        {/* Shelf slides in from the left on first load */}
        <motion.div
          aria-hidden="true"
          initial={reduce ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.7, ease: EASE }}
          style={{ transformOrigin: "left center" }}
          className="absolute inset-x-[2%] bottom-[20%] z-20 h-[5%] rounded-sm bg-gradient-to-b from-[#DDD0BB] to-[#F3EBDD] shadow-[0_14px_24px_-10px_rgba(42,27,27,0.35)]"
        />
      </div>

      {/* Slide dots + counter */}
      {count > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.4 }}
          className="relative flex items-center justify-center gap-4 -mt-5 z-50"
        >
          <div className="flex items-center gap-2">
            {slides.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.authorId ?? i}
                  type="button"
                  onClick={() => i !== index && go(i, i > index ? 1 : -1)}
                  aria-label={`Show slide ${i + 1}${s.authorName ? `: ${s.authorName}` : ""}`}
                  aria-current={active ? "true" : undefined}
                  className={`relative h-1.5 overflow-hidden rounded-full outline-none transition-[width,background-color] duration-300 focus-visible:ring-2 focus-visible:ring-[#C9A36B] ${
                    active ? "w-9 bg-[#1F2A44]/20" : "w-1.5 bg-[#1F2A44]/25 hover:bg-[#1F2A44]/50"
                  }`}
                >
                  {active && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#1F2A44]"
                      initial={{ scaleX: paused || reduce ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused || reduce ? 0 : interval / 1000, ease: "linear" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
          <span className="text-[11px] font-medium tabular-nums tracking-wider text-[#63524E]">
            {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Variant 1: split — text left, animated bookshelf right              */
/* ------------------------------------------------------------------ */
function SplitHero({
  eyebrow = "Independent spirit. Extraordinary stories.",
  title = "For the love of a good book.",
  description = "Beautiful books. Remarkable voices. A world of stories, thoughtfully chosen for the shelves, and the life, you’re building.",
  primaryAction = { label: "Explore Books", to: "/new-books" },
  secondaryAction = { label: "Discover our story", to: "/about" },
  slides = AUTO_SLIDES,
  interval = 5000,
  proof = DEFAULT_PROOF,
  features = DEFAULT_FEATURES,
}) {
  const { container, item } = useFadeUp();

  return (
    <>
      <section className="relative overflow-hidden bg-[#FAF7F2]">
        <div className="mx-auto grid w-full max-w-[1700px] grid-cols-1 items-center gap-12 px-5 py-1 sm:px-10 sm:py-1 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:px-16 lg:py-4 xl:min-h-[640px]">
          {/* ----- Text ----- */}
          <motion.div variants={container} initial="hidden" animate="show" className="text-center lg:text-left">
            {eyebrow && (
              <Eyebrow size="md" color="inherit" variants={item} className="mb-5 text-[#D9773B]">
                {eyebrow}
              </Eyebrow>
            )}

            <Heading as="h1" size="h1" color="inherit" variants={item} className="text-[#1F2A44] [text-wrap:balance]">
              {title}
            </Heading>

            {description && (
              <Description size="lg" color="light-muted" variants={item} className="mx-auto mt-6 max-w-xl lg:mx-0">
                {description}
              </Description>
            )}

            {(primaryAction || secondaryAction) && (
              <motion.div variants={item} className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                {primaryAction && (
                  <Link to={primaryAction.to} className={buttonClasses("primary", "md")}>
                    {primaryAction.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                )}
                {secondaryAction && (
                  <Link to={secondaryAction.to} className={buttonClasses("outline", "md")}>
                    {secondaryAction.label}
                  </Link>
                )}
              </motion.div>
            )}

            {proof && (
              <motion.div variants={item} className="mt-10 flex items-center justify-center gap-3 lg:justify-start">
                <div className="flex -space-x-2.5">
                  {proof.avatars.map((a, i) => (
                    <span
                      key={a}
                      aria-hidden="true"
                      className="grid h-9 w-9 place-items-center rounded-full border-2 border-[#FAF7F2] text-[11px] font-semibold text-[#1F2A44]"
                      style={{ backgroundColor: ["#E6D3B8", "#CFDCCF", "#EBCFC6"][i % 3] }}
                    >
                      {a}
                    </span>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex gap-0.5" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} aria-hidden="true" className="h-3.5 w-3.5 fill-[#C9A36B] text-[#C9A36B]" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-xs text-[#63524E]">{proof.text}</p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* ----- Animated bookshelf (hidden if no author has 2+ books yet) ----- */}
          {slides.length > 0 && <BookSlider slides={slides} interval={interval} />}
        </div>
      </section>

      <FeatureStrip features={features} container={container} item={item} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Variant 2: centered — page banner                                   */
/* ------------------------------------------------------------------ */
function CenteredHero({ eyebrow, title, description, primaryAction, secondaryAction }) {
  const { container, item } = useFadeUp();

  return (
    <section className="relative overflow-hidden bg-[#FAF7F2]">
      <motion.div variants={container} initial="hidden" animate="show" className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center py-20">
        {eyebrow && (
          <Eyebrow size="md" color="gold" variants={item} className="mb-3">
            {eyebrow}
          </Eyebrow>
        )}
        <Heading as="h1" size="h1" color="dark" variants={item}>
          {title}
        </Heading>
        {description && (
          <Description size="md" color="muted" variants={item} className="mt-4 max-w-xl">
            {description}
          </Description>
        )}
        <HeroActions primaryAction={primaryAction} secondaryAction={secondaryAction} align="center" variants={item} />
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Public component                                                    */
/* ------------------------------------------------------------------ */
export function Hero({ variant = "split", ...props }) {
  return variant === "centered" ? <CenteredHero {...props} /> : <SplitHero {...props} />;
}

export default Hero;