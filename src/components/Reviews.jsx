import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Eyebrow } from "./ui/typography";
import { BOOKS } from "../data/books";
import { getReviews } from "../data/Reviews";


/**
 * Reviews — "Good books. Happy people."
 *
 * <Reviews />                       uses getReviews() from data/reviews.js
 * <Reviews reviews={myReviews} />   or pass your own list
 *
 * The section hides itself when there are no reviews to show.
 */

const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";
const AVATAR_COLORS = ["#E6D3B8", "#CFDCCF", "#EBCFC6", "#DCD6EA"];

const initials = (name = "") => {
  const words = name.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w));
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
};

function Stars({ rating, size = "h-3.5 w-3.5" }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={`${size} ${i < Math.round(rating) ? "fill-[#C9A36B] text-[#C9A36B]" : "fill-transparent text-[#d9cfbf]"}`}
        />
      ))}
    </div>
  );
}

function Avatar({ name, photo, index }) {
  const [failed, setFailed] = useState(false);
  if (photo && !failed) {
    return <img src={photo} alt="" onError={() => setFailed(true)} className="h-10 w-10 shrink-0 rounded-full object-cover" />;
  }
  return (
    <span
      aria-hidden="true"
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[12px] font-semibold text-[#14213D]"
      style={{ backgroundColor: AVATAR_COLORS[index % AVATAR_COLORS.length] }}
    >
      {initials(name)}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* One review card                                                     */
/* ------------------------------------------------------------------ */
function ReviewCard({ review, index, variants }) {
  const book = review.bookId ? BOOKS.find((b) => b.id === review.bookId) : null;
  const meta = [review.location, book && `Reader of ${book.title}`].filter(Boolean);

  return (
    <motion.li variants={variants} className="h-full">
      <figure className="flex h-full flex-col rounded-lg border border-[#ece4d8] bg-white p-6 shadow-[0_1px_2px_rgba(42,27,27,0.04)] transition-shadow duration-300 hover:shadow-[0_18px_36px_-22px_rgba(42,27,27,0.35)] sm:p-7">
        <Stars rating={review.rating} />

        <blockquote className="mt-5 flex-1">
          {review.title && (
            <p className="font-[family-name:var(--font-heading)] text-[22px] leading-snug text-[#14213D]">{review.title}</p>
          )}
          <p className="mt-3 text-[14px] leading-[1.8] text-[#5f5a54]">{review.text}</p>
        </blockquote>

        <figcaption className="mt-6 flex items-center gap-3 border-t border-[#ece4d8] pt-5">
          <Avatar name={review.name} photo={review.photo} index={index} />
          <div className="min-w-0 flex-1">
            <p className="font-button truncate text-[13px] font-semibold text-[#14213D]">{review.name}</p>
            {meta.length > 0 && (
              <p className="truncate text-[12px] text-[#77736D]">
                {review.location}
                {review.location && book && " · "}
                {book && (
                  <Link to={`/book/${book.id}`} className="underline-offset-2  hover:underline">
                    Reader of {book.title}
                  </Link>
                )}
              </p>
            )}
          </div>
          <Quote aria-hidden="true" className="h-6 w-6 shrink-0 rotate-180 fill-[#C9A36B]/15 text-[#C9A36B]/60" strokeWidth={1.25} />
        </figcaption>
      </figure>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Reviews({
  reviews = getReviews(),
  eyebrow = "Kind words from our readers",
  title = "Good books. Happy people.",
}) {
  const reduce = useReducedMotion();
  if (!reviews.length) return null;

  // Summary from the reviews actually shown — never a made-up number
  const average = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length;
  const count = reviews.length;

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };
  const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.25 } };

  return (
    <section className="bg-[#FAF7F2] py-14 sm:py-20">
      <div className={CONTAINER}>
        <motion.div variants={container} {...inView} className="mb-10 text-center md:text-left">
          <motion.div variants={item}>
            <Eyebrow size="md" color="inherit" className="mb-3 text-[#D9773B]">
              {eyebrow}
            </Eyebrow>
          </motion.div>
          <motion.h2
            variants={item}
            className="font-[family-name:var(--font-heading)] text-[32px] font-normal leading-[1.2] tracking-[-0.01em] text-[#14213D] md:text-[40px] md:tracking-normal"
          >
            {title}
          </motion.h2>
          <motion.div variants={item} className="mt-4 flex items-center justify-center gap-3 md:justify-start">
            <Stars rating={average} size="h-4 w-4" />
            <p className="text-[13px] text-[#63524E]">
              <span className="font-semibold text-[#14213D]">{average.toFixed(1)}</span> average from {count}{" "}
              {count === 1 ? "review" : "reviews"}
            </p>
          </motion.div>
        </motion.div>

        <motion.ul variants={container} {...inView} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} variants={item} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}