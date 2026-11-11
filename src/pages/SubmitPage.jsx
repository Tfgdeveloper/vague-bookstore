import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ChevronDown, Plus, Trash2 } from "lucide-react";
import Hero from "../components/Hero";
import { Heading, Eyebrow, Description } from "../components/ui/typography";
import {
  TextField,
  TextAreaField,
  SelectField,
  ImageField,
  CheckboxField,
  goldButton,
  isEmail,
  isUrl,
  focusFirstError,
} from "../components/ui/form-fields";
import { GENRES } from "../data/books";

/* ==================================================================
   /submit — an author sends their details and one or more books.
   UI only: nothing is sent anywhere yet. Replace the fake delay in
   handleSubmit with your API call when the backend is ready.
   ================================================================== */

const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";
const BIO_MAX = 400;
const DESC_MAX = 600;
const MAX_BOOKS = 10;
const MAX_LINKS = 5;

let nextKey = 1;
const emptyBook = () => ({
  key: nextKey++, // only used by React to keep each book's fields separate
  title: "",
  subtitle: "",
  genre: "",
  subgenres: [], // optional, from the chosen genre
  publishedAt: "",
  language: "English",
  isbn: "",
  description: "",
  cover: null,
  buyLinks: [{ label: "Amazon", url: "" }],
});

const emptyForm = () => ({
  authorName: "",
  email: "",
  phone: "",
  location: "",
  bio: "",
  website: "",
  instagram: "",
  photo: null,
  books: [emptyBook()],
  agree: false,
});

const genreOptions = GENRES.map((g) => ({ value: g.slug, label: g.name.replace(/\s+Books$/i, "") }));
const genreLabel = (slug) => genreOptions.find((g) => g.value === slug)?.label;
const subgenresOf = (slug) => GENRES.find((g) => g.slug === slug)?.subgenres ?? [];
const MAX_SUBGENRES = 3;

// The book's "genres" in the same format as books.js: ["fiction", "fantasy", ...]
export const toBooksGenres = (book) => [book.genre, ...book.subgenres].filter(Boolean);

const STEPS = [
  { title: "Tell us about you", text: "Your name, a short bio and a photo for your author page." },
  { title: "Add your books", text: "One or more. Each gets a title, genre, cover and description." },
  { title: "Where to buy", text: "Links to Amazon, your website or anywhere readers can buy each book." },
  { title: "We review them", text: "We check every submission and email you once your books are live, usually within 3 days." },
];

/* ---------- Validation ---------- */
function validateAuthor(f) {
  const e = {};
  if (!f.authorName.trim()) e.authorName = "Enter your name as readers will see it.";
  if (!f.email.trim()) e.email = "Enter your email so we can contact you.";
  else if (!isEmail(f.email)) e.email = "Enter a valid email, like name@example.com.";
  if (!f.bio.trim()) e.bio = "Add a short bio for your author page.";
  if (f.website && !isUrl(f.website)) e.website = "Enter a full link starting with https://";
  if (f.instagram && !isUrl(f.instagram)) e.instagram = "Enter a full link starting with https://";
  if (!f.agree) e.agree = "Please confirm before submitting.";
  return e;
}

function validateBook(b) {
  const e = {};
  if (!b.title.trim()) e.title = "Enter the book’s title.";
  if (!b.genre) e.genre = "Choose a genre.";
  if (!b.description.trim()) e.description = "Add a description.";
  else if (b.description.trim().length < 40) e.description = "Write at least 40 characters.";
  if (!b.cover) e.cover = "Upload the book cover.";
  const links = b.buyLinks.filter((l) => l.label.trim() || l.url.trim());
  if (!links.length) e.buyLinks = "Add at least one place where readers can buy this book.";
  else if (links.some((l) => !l.label.trim() || !isUrl(l.url))) e.buyLinks = "Each link needs a store name and a full URL starting with https://";
  return e;
}

const countErrors = (errors) =>
  Object.entries(errors).reduce(
    (n, [key, value]) =>
      key === "books" ? n + value.reduce((m, be) => m + Object.keys(be ?? {}).length, 0) : n + (value ? 1 : 0),
    0
  );

/* ================================================================== */
export default function SubmitPage() {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({ books: [] });
  const [openKeys, setOpenKeys] = useState(() => new Set([form.books[0].key]));
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const submitted = useRef([]);

  useEffect(() => {
    document.title = "Submit your books · Vague Book Store";
  }, []);

  /* ---------- Author fields ---------- */
  const set = (key) => (e) => setValue(key, e.target.value);
  const setValue = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  /* ---------- Book fields ---------- */
  const updateBook = (i, changes) =>
    setForm((f) => ({ ...f, books: f.books.map((b, j) => (j === i ? { ...b, ...changes } : b)) }));

  const clearBookError = (i, key) => {
    if (!errors.books[i]?.[key]) return;
    setErrors((er) => ({
      ...er,
      books: er.books.map((be, j) => (j === i ? { ...be, [key]: undefined } : be)),
    }));
  };

  const setBookValue = (i, key, value) => {
    updateBook(i, { [key]: value });
    clearBookError(i, key);
  };

  const addBook = () => {
    const book = emptyBook();
    setForm((f) => ({ ...f, books: [...f.books, book] }));
    setOpenKeys(new Set([book.key])); // open the new one, close the rest
    requestAnimationFrame(() => document.getElementById(`book-${book.key}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const removeBook = (i) => {
    const book = form.books[i];
    const name = book.title.trim() ? `“${book.title.trim()}”` : `Book ${i + 1}`;
    if ((book.title || book.description || book.cover) && !window.confirm(`Remove ${name} from this submission?`)) return;
    setForm((f) => ({ ...f, books: f.books.filter((_, j) => j !== i) }));
    setErrors((er) => ({ ...er, books: er.books.filter((_, j) => j !== i) }));
  };

  const toggleBook = (key) =>
    setOpenKeys((keys) => {
      const next = new Set(keys);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookErrors = form.books.map(validateBook);
    const found = { ...validateAuthor(form), books: bookErrors };
    setErrors(found);

    if (countErrors(found)) {
      // Open every book that has a problem so its errors are visible.
      setOpenKeys((keys) => new Set([...keys, ...form.books.filter((_, i) => Object.keys(bookErrors[i]).length).map((b) => b.key)]));
      return focusFirstError();
    }

    setStatus("sending");
    // ← replace with your API call later. Each book's genres in books.js format:
    //    form.books.map((b) => ({ ...b, genres: toBooksGenres(b) }))
    await new Promise((r) => setTimeout(r, 1000));
    submitted.current = form.books.map((b) => b.title.trim());
    setStatus("sent");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    const fresh = emptyForm();
    setForm(fresh);
    setErrors({ books: [] });
    setOpenKeys(new Set([fresh.books[0].key]));
    setStatus("idle");
  };

  const errorCount = countErrors(errors);
  const bookCount = form.books.length;

  return (
    <>
      <Hero
        variant="centered"
        eyebrow="For authors"
        title="Submit Your Books"
        description="Listing is free. Add one book or your whole collection. Readers discover them here and buy from Amazon or your own website."
      />

      <section className="bg-[#FAF7F2] py-14 sm:py-20">
        <div className={CONTAINER}>
          {status === "sent" ? (
            <SuccessMessage titles={submitted.current} email={form.email} onReset={reset} />
          ) : (
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_360px]">
              {/* ---------- Form ---------- */}
              <form onSubmit={handleSubmit} noValidate className="grid gap-8">
                {errorCount > 0 && (
                  <div role="alert" className="rounded-md border-l-4 border-red-700 bg-red-50 px-4 py-3 text-sm text-red-900">
                    Please fix {errorCount} {errorCount === 1 ? "field" : "fields"} below before submitting.
                  </div>
                )}

                {/* 01 About you */}
                <FormCard number="01" title="About you" text="This appears on your author page.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Full name" required placeholder="As it appears on your books" autoComplete="name" value={form.authorName} onChange={set("authorName")} error={errors.authorName} />
                    <TextField label="Email" required type="email" placeholder="name@example.com" autoComplete="email" value={form.email} onChange={set("email")} error={errors.email} hint="Only used to contact you. Never shown publicly." />
                    <TextField label="Phone" type="tel" placeholder="Optional" autoComplete="tel" value={form.phone} onChange={set("phone")} />
                    <TextField label="City and country" placeholder="Karachi, Pakistan" value={form.location} onChange={set("location")} />
                  </div>
                  <TextAreaField label="Short bio" required rows={4} maxLength={BIO_MAX} placeholder="Two or three sentences about you and your writing" value={form.bio} onChange={set("bio")} error={errors.bio} hint={`${form.bio.length}/${BIO_MAX}`} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <TextField label="Website" type="url" placeholder="https://yourname.com" value={form.website} onChange={set("website")} error={errors.website} />
                    <TextField label="Instagram" type="url" placeholder="https://instagram.com/…" value={form.instagram} onChange={set("instagram")} error={errors.instagram} />
                  </div>
                  <ImageField label="Author photo" hint="Square photo works best. PNG, JPG or WebP, under 5 MB." shape="round" file={form.photo} onChange={(f) => setValue("photo", f)} />
                </FormCard>

                {/* 02 Your books */}
                <section aria-labelledby="books-heading" className="grid gap-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex items-baseline gap-4">
                      <span aria-hidden="true" className="font-[family-name:var(--font-heading)] text-2xl text-[#C9A36B]">02</span>
                      <div>
                        <Heading as="h2" size="h4" color="inherit" id="books-heading" className="text-[#14213D]">Your books</Heading>
                        <Description size="sm" className="mt-0.5">
                          {bookCount} {bookCount === 1 ? "book" : "books"} in this submission
                        </Description>
                      </div>
                    </div>
                  </div>

                  {form.books.map((book, i) => (
                    <BookCard
                      key={book.key}
                      book={book}
                      index={i}
                      errors={errors.books[i] ?? {}}
                      open={openKeys.has(book.key)}
                      canRemove={bookCount > 1}
                      onToggle={() => toggleBook(book.key)}
                      onRemove={() => removeBook(i)}
                      onChange={(key, value) => setBookValue(i, key, value)}
                    />
                  ))}

                  {bookCount < MAX_BOOKS ? (
                    <button
                      type="button"
                      onClick={addBook}
                      className="flex items-center justify-center gap-2 rounded-md border-2 border-dashed border-[#E4DDD3] bg-white/60 px-6 py-5 text-sm font-semibold text-[#14213D] transition-colors hover:border-[#14213D]/40 hover:bg-white focus-visible:outline-2 focus-visible:outline-[#14213D]"
                    >
                      <Plus aria-hidden="true" className="h-4 w-4" />
                      Add another book
                    </button>
                  ) : (
                    <p className="text-center text-xs text-[#63524E]">
                      You can add up to {MAX_BOOKS} books at a time. Send the rest in another submission.
                    </p>
                  )}
                </section>

                {/* Agreement + submit */}
                <div className="grid gap-6 rounded-md border border-[#E4DDD3] bg-white p-6 sm:p-8">
                  <CheckboxField
                    label={`I am the author or have the rights to list ${bookCount === 1 ? "this book" : "these books"}, and I agree that Vague Book Store can show these details and images on its website.`}
                    checked={form.agree}
                    onChange={(v) => setValue("agree", v)}
                    error={errors.agree}
                  />
                  <div className="flex flex-wrap items-center gap-4">
                    <button type="submit" disabled={status === "sending"} className={goldButton}>
                      {status === "sending" ? "Submitting…" : bookCount === 1 ? "Submit my book" : `Submit ${bookCount} books`}
                    </button>
                    <p className="text-xs text-[#63524E]">Free to list · Reviewed within 3 working days</p>
                  </div>
                </div>
              </form>

              <HowItWorks />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* One book (collapsible)                                              */
/* ------------------------------------------------------------------ */
function BookCard({ book, index, errors, open, canRemove, onToggle, onRemove, onChange }) {
  const panelId = `book-panel-${book.key}`;
  const errorCount = Object.values(errors).filter(Boolean).length;
  const subNames = book.subgenres.map((slug) => subgenresOf(book.genre).find((s) => s.slug === slug)?.name).filter(Boolean);
  const summary = [
    [genreLabel(book.genre), ...subNames].filter(Boolean).join(", "),
    book.buyLinks.filter((l) => l.url).length && `${book.buyLinks.filter((l) => l.url).length} buy link(s)`,
  ]
    .filter(Boolean)
    .join(" · ");

  const set = (key) => (e) => onChange(key, e.target.value);

  // A new genre clears sub-genres from the old one
  const setGenre = (e) => {
    onChange("genre", e.target.value);
    onChange("subgenres", []);
  };
  const toggleSub = (slug) =>
    onChange(
      "subgenres",
      book.subgenres.includes(slug)
        ? book.subgenres.filter((x) => x !== slug)
        : book.subgenres.length < MAX_SUBGENRES
          ? [...book.subgenres, slug]
          : book.subgenres
    );
  const subs = subgenresOf(book.genre);

  const setLink = (i, key, value) =>
    onChange("buyLinks", book.buyLinks.map((l, j) => (j === i ? { ...l, [key]: value } : l)));
  const addLink = () => onChange("buyLinks", [...book.buyLinks, { label: "", url: "" }]);
  const removeLink = (i) => onChange("buyLinks", book.buyLinks.filter((_, j) => j !== i));

  return (
    <div id={`book-${book.key}`} className={`scroll-mt-6 rounded-md border bg-white ${errorCount ? "border-red-300" : "border-[#E4DDD3]"}`}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 sm:px-6">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-4 rounded text-left outline-none focus-visible:ring-2 focus-visible:ring-[#14213D]/40"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-[#14213D] text-sm font-semibold text-[#C9A36B]">
            {index + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-semibold text-[#14213D]">
              {book.title.trim() || `Book ${index + 1}`}
            </span>
            <span className="block truncate text-xs text-[#63524E]">
              {errorCount > 0 ? (
                <span className="text-red-700">{errorCount} {errorCount === 1 ? "field needs" : "fields need"} attention</span>
              ) : (
                summary || "Not filled in yet"
              )}
            </span>
          </span>
          <ChevronDown aria-hidden="true" className={`h-5 w-5 shrink-0 text-[#63524E] transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${book.title.trim() || `book ${index + 1}`}`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-[#63524E] transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Fields — kept mounted when closed so uploads and typing aren't lost */}
      <div id={panelId} hidden={!open} className="grid gap-5 border-t border-[#E4DDD3] p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Book title" required value={book.title} onChange={set("title")} error={errors.title} />
          <TextField label="Subtitle" placeholder="Optional" value={book.subtitle} onChange={set("subtitle")} />
          <SelectField label="Genre" required placeholder="Choose a genre" options={genreOptions} value={book.genre} onChange={setGenre} error={errors.genre} />
          <TextField label="Language" value={book.language} onChange={set("language")} />
          <TextField label="Publish date" type="date" value={book.publishedAt} onChange={set("publishedAt")} hint="Optional" />
          <TextField label="ISBN" placeholder="Optional" value={book.isbn} onChange={set("isbn")} />
        </div>

        {/* Sub-genres for the chosen genre */}
        {subs.length > 0 && (
          <fieldset>
            <legend className="text-[13px] font-medium text-[#14213D]">
              Sub-genres <span className="font-normal text-[#77736D]">(optional, up to {MAX_SUBGENRES})</span>
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {subs.map((s) => {
                const on = book.subgenres.includes(s.slug);
                const full = !on && book.subgenres.length >= MAX_SUBGENRES;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => toggleSub(s.slug)}
                    aria-pressed={on}
                    disabled={full}
                    title={s.description}
                    className={`rounded-md border px-3 py-1.5 text-[13px] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#14213D]/40 disabled:cursor-not-allowed disabled:opacity-40 ${
                      on ? "border-[#14213D] bg-[#14213D] text-white" : "border-[#E4DDD3] bg-white text-[#3f3a36] hover:border-[#14213D]/50"
                    }`}
                  >
                    {s.name}
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <TextAreaField
          label="Description"
          required
          rows={5}
          maxLength={DESC_MAX}
          placeholder="What is this book about? Write it the way you’d describe it to a reader."
          value={book.description}
          onChange={set("description")}
          error={errors.description}
          hint={`${book.description.length}/${DESC_MAX}`}
        />

        <ImageField
          label="Book cover"
          required
          hint="Front cover, ideally 2:3 (for example 1000 × 1500 px). Under 5 MB."
          file={book.cover}
          onChange={(f) => onChange("cover", f)}
          error={errors.cover}
        />

        {/* Where to buy */}
        <fieldset className="grid gap-3 border-t border-[#E4DDD3] pt-5">
          <legend className="sr-only">Where to buy {book.title || `book ${index + 1}`}</legend>
          <div>
            <p className="text-[13px] font-medium text-[#14213D]">
              Where to buy <span className="text-[#14213D]">*</span>
            </p>
            <p className="text-xs text-[#63524E]">Readers click these to buy this book.</p>
          </div>
          <ul className="grid gap-3">
            {book.buyLinks.map((link, i) => (
              <li key={i} className="grid gap-3 sm:grid-cols-[11rem_1fr_auto] sm:items-start">
                <TextField label={`Store name ${i + 1}`} hideLabel placeholder="Amazon" value={link.label} onChange={(e) => setLink(i, "label", e.target.value)} />
                <TextField
                  label={`Link ${i + 1}`}
                  hideLabel
                  type="url"
                  placeholder="https://www.amazon.com/dp/…"
                  value={link.url}
                  onChange={(e) => setLink(i, "url", e.target.value)}
                  aria-invalid={errors.buyLinks && link.url && !isUrl(link.url) ? true : undefined}
                />
                {book.buyLinks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLink(i)}
                    aria-label={`Remove link ${i + 1}`}
                    className="grid h-12 w-12 place-items-center rounded-md border border-[#E4DDD3] bg-white text-[#63524E] transition-colors hover:border-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {errors.buyLinks && <p className="text-xs text-red-700">{errors.buyLinks}</p>}
          {book.buyLinks.length < MAX_LINKS && (
            <button type="button" onClick={addLink} className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-[#14213D] hover:underline">
              <Plus aria-hidden="true" className="h-4 w-4" /> Add another store
            </button>
          )}
        </fieldset>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function SuccessMessage({ titles, email, onReset }) {
  const many = titles.length > 1;
  return (
    <div role="status" className="mx-auto flex max-w-xl flex-col items-center rounded-md border border-[#E4DDD3] bg-white px-6 py-14 text-center">
      <CheckCircle2 aria-hidden="true" className="h-12 w-12 text-[#B39262]" />
      <Heading as="h2" size="h3" color="inherit" className="mt-5 text-[#14213D]">
        Thank you, {many ? `your ${titles.length} books are` : "your book is"} in!
      </Heading>
      <Description size="md" className="mt-3">
        We’ll review {many ? "them" : `“${titles[0]}”`} and email you at {email} once {many ? "they’re" : "it’s"} live,
        usually within 3 working days.
      </Description>
      {many && (
        <ul className="mt-5 grid gap-1 text-sm text-[#14213D]">
          {titles.map((t, i) => (
            <li key={i}>“{t}”</li>
          ))}
        </ul>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={onReset} className={goldButton}>Submit more books</button>
        <Link to="/" className="inline-flex h-11 items-center px-4 text-[13px] font-medium text-[#14213D] hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function HowItWorks() {
  return (
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <div className="rounded-md bg-[#14213D] p-6 text-white sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9A36B]">How it works</p>
        <ol className="mt-5 grid gap-5">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-[#C9A36B]/60 text-xs font-semibold text-[#C9A36B]">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-white/70">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 border-t border-white/10 pt-5 text-[13px] leading-relaxed text-white/70">
          Questions first?{" "}
          <Link to="/contact" className="font-medium text-[#C9A36B] hover:underline">Contact us</Link>
        </p>
      </div>
    </aside>
  );
}

function FormCard({ number, title, text, children }) {
  return (
    <fieldset className="grid gap-5 rounded-md border border-[#E4DDD3] bg-white p-6 sm:p-8">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-baseline gap-4 border-b border-[#E4DDD3] pb-4">
        <span aria-hidden="true" className="font-[family-name:var(--font-heading)] text-2xl text-[#C9A36B]">{number}</span>
        <div>
          <Heading as="h2" size="h4" color="inherit" className="text-[#14213D]">{title}</Heading>
          {text && <Description size="sm" className="mt-0.5">{text}</Description>}
        </div>
      </div>
      {children}
    </fieldset>
  );
}