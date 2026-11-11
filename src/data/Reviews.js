/* ==================================================================
   Reader reviews for the "Good books. Happy people." section.

   Only publish real reviews from real readers or authors, with their
   permission. Entries marked `sample: true` are placeholders: they show
   while you develop (npm run dev) and are hidden on the live site.

   Fields
     id        unique id
     rating    1–5
     title     short headline
     text      the review itself
     name      reviewer's name (first name + initial is fine)
     location  optional, e.g. "Lahore, Pakistan"
     photo     optional, e.g. "/images/reviews/sara.jpg"
     bookId    optional, links the review to a book in books.js
     date      optional, "YYYY-MM-DD"
   ================================================================== */

export const REVIEWS = [
  {
    id: "sample-1",
    sample: true,
    rating: 5,
    title: "A bookshop that just gets me.",
    text: "Every recommendation has felt like it was chosen by a friend who knows my taste. I’ve found three authors I’d never have discovered anywhere else.",
    name: "Sample Reader",
    location: "Karachi, Pakistan",
    bookId: "protege-of-the-sea-wolf",
  },
  {
    id: "sample-2",
    sample: true,
    rating: 5,
    title: "The discovering is half the joy.",
    text: "I love browsing by genre and reading the short descriptions. It feels like wandering a small independent shop, without leaving my sofa.",
    name: "Sample Reader",
    location: "London, UK",
    bookId: "but-god",
  },
  {
    id: "sample-3",
    sample: true,
    rating: 4,
    title: "I found my reading people.",
    text: "The monthly book club picks have opened up conversations I didn’t expect. It’s a lovely corner of the internet for people who read slowly.",
    name: "Sample Reader",
    location: "Toronto, Canada",
  },
];

// Reviews to show: samples only while developing
export const getReviews = (limit = 3) =>
  REVIEWS.filter((r) => !r.sample || import.meta.env.DEV).slice(0, limit);