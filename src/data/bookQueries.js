import { BOOKS, AUTHORS, GENRES } from "./books";

// Top books in a genre, in the order you set with `rank` in books.js
export const getTopInGenre = (slug, limit = 8) =>
  BOOKS.filter((b) => b.genres?.includes(slug))
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
    .slice(0, limit);

  const toTime = (date) => {
  const t = new Date(date).getTime();
  return Number.isNaN(t) ? 0 : t; // missing or bad date → goes to the end
};

// Newest books first, by the date you added them
export const getNewBooks = (limit = 5) =>
  [...BOOKS].sort((a, b) => toTime(b.publicationDate) - toTime(a.publicationDate)).slice(0, limit);

// All books in a genre (for genre pages)
export const getBooksByGenre = (slug) => BOOKS.filter((b) => b.genres.includes(slug));

// All books by one author (for author pages)
export const getBooksByAuthor = (authorId) => BOOKS.filter((b) => b.authorId === authorId);

// Single lookups
export const getBook = (id) => BOOKS.find((b) => b.id === id);
export const getAuthor = (id) => AUTHORS.find((a) => a.id === id);
export const getGenre = (slug) => GENRES.find((g) => g.slug === slug);