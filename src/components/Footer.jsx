import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, ShieldCheck } from "lucide-react";
import { GENRES } from "../data/books";

/* ==================================================================
   Footer — only links to pages that exist:
   genre pages, authors, submit, contact and the legal pages.
   ================================================================== */

const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";

// "Fiction Books" → "Fiction"
const genreName = (g) => (g.name ?? g.slug ?? "").replace(/\s+Books$/i, "");

/* ---------- Link columns ---------- */
// A column with `genres: true` lists every genre from books.js after its links.
const DEFAULT_COLUMNS = [
  {
    title: "Browse",
    links: [{ label: "New books", to: "/new-books" }],
    genres: true,
  },
  {
    title: "Explore",
    links: [
      { label: "Our authors", to: "/authors" },
      { label: "Submit your book", to: "/submit" },
      { label: "Contact us", to: "/contact" },
    ],
  },
];

const DEFAULT_CONTACT = {
  title: "Let’s talk books",
  email: "hello@booknshelves.com",
  lines: ["Mon – Fri, 9 am – 6 pm EST", "We’d love to help you find your next read."],
};

const DEFAULT_LEGAL = [
  { label: "Privacy policy", to: "/privacy" },
  { label: "Terms of service", to: "/terms" },
  { label: "Affiliate disclosure", to: "/disclosure" },
  { label: "Accessibility", to: "/accessibility" },
];

const linkClass =
  "rounded text-[13px] text-white/65 outline-none transition-colors duration-200 hover:text-[#C9A36B] focus-visible:ring-2 focus-visible:ring-[#C9A36B]";
const headingClass = "font-button text-[13px] font-semibold text-white";

/* ------------------------------------------------------------------ */
export default function Footer({
  logo = "/images/logowhite.png", // set to null to show the text logo
  siteName = "Vague Book Store",
  tagline = "Thoughtfully chosen books from independent authors. Independent in spirit, connected by stories.",
  columns = DEFAULT_COLUMNS,
  genres = GENRES,
  genrePath = (g) => `/${g.slug}`,
  contact = DEFAULT_CONTACT,
  trustNote = "We link only to trusted sellers like Amazon and authors’ own sites.",
  legal = DEFAULT_LEGAL,
}) {
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  const fade = (i) =>
    reduce
      ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <footer className="bg-[#14213D] text-white">
      <div
        className={`${CONTAINER} grid grid-cols-2 gap-x-6 gap-y-10 py-14 sm:grid-cols-3 lg:grid-cols-[1.6fr_repeat(2,minmax(0,1fr))_1.2fr] lg:gap-12 lg:py-16`}
      >
        {/* ---------- Brand ---------- */}
        <motion.div {...fade(0)} className="col-span-2 sm:col-span-3 lg:col-span-1">
          <Link to="/" className="inline-block rounded outline-none focus-visible:ring-2 focus-visible:ring-[#C9A36B]">
            {logo ? (
              <img src={logo} alt={siteName} />
            ) : (
              <span className="font-[family-name:var(--font-heading)] text-2xl">{siteName}</span>
            )}
          </Link>
          {tagline && <p className="mt-5 max-w-xs text-[13px] leading-[1.8] text-white/65">{tagline}</p>}
        </motion.div>

        {/* ---------- Link columns ---------- */}
        {columns.map((col, i) => {
          const links = [
            ...col.links,
            ...(col.genres ? (genres ?? []).map((g) => ({ label: genreName(g), to: genrePath(g) })) : []),
          ];
          return (
            <motion.nav key={col.title} aria-label={col.title} {...fade(i + 1)}>
              <h2 className={headingClass}>{col.title}</h2>
              <ul className="mt-5 grid gap-3">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          );
        })}

        {/* ---------- Contact ---------- */}
        {contact && (
          <motion.div {...fade(columns.length + 1)} className="col-span-2 sm:col-span-1">
            <h2 className={headingClass}>{contact.title}</h2>
            <address className="mt-5 not-italic">
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 break-all rounded text-[13px] text-[#C9A36B] outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#C9A36B]"
                >
                  <Mail aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {contact.email}
                </a>
              )}
              {contact.lines?.length > 0 && (
                <div className="mt-5 grid gap-1 text-[13px] leading-relaxed text-white/65">
                  {contact.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              )}
            </address>
          </motion.div>
        )}
      </div>

      {/* ---------- Bottom ---------- */}
      <div className={CONTAINER}>
        <div className="border-t border-white/10 py-6">
          {trustNote && (
            <p className="flex items-center gap-2.5 text-[12px] text-white/65">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 shrink-0 text-[#C9A36B]" />
              {trustNote}
            </p>
          )}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-white/45">
              © {year} {siteName}. All rights reserved.
            </p>
            {legal.length > 0 && (
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {legal.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="rounded text-[11px] text-white/45 outline-none transition-colors hover:text-[#C9A36B] focus-visible:ring-2 focus-visible:ring-[#C9A36B]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}