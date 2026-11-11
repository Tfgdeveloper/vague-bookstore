/* ==================================================================
   Content for each genre page.

   path      — the URL of the page
   hero      — text for the centered hero at the top
   listing   — heading above the book grid
   featured  — everything shown in the FeaturedBook section.
               Set featured: null to hide the section on that page.

   featured fields:
     eyebrow, title, author, quote, description
     image, imageAlt
     imageFit        : "contain" for book covers, "cover" for wide photos
     primaryAction   : { label, href }  external link (Amazon, author site)
                       { label, to }    page on your site
     secondaryAction : same as primaryAction
   ================================================================== */

export const GENRE_PAGES = {
  "new-books": {
    path: "/new-books",
    hero: {
      eyebrow: "Fresh off the press",
      title: "New Books",
      description: "The latest titles added to our shelves by independent authors, newest first.",
      primaryAction: { label: "Submit your book", to: "/submit" },
      secondaryAction: { label: "See new books", to: "/new-books" },
    },
    listing: { eyebrow: "Just added", title: "Recently Shelved" },
    featured: {
      bookId:"protege-of-the-sea-wolf",
      eyebrow:"Book of the month",
      color:"#e9b18f",
      background:"/images/featured-bg.png"
    },
  },

  fiction: {
    path: "/fiction",
    hero: {
      eyebrow: "Browse by genre",
      title: "Fiction",
      description: "Imagined worlds and invented lives that still tell the truth about people.",
      primaryAction: { label: "Submit your book", to: "/submit" },
      secondaryAction: { label: "See new books", to: "/new-books" },
    },
    listing: { eyebrow: "The collection", title: "All Fiction" },
    featured: {
      eyebrow: "Fiction pick of the month",
      bookId:"renaissance-mann",
      color:"#000E19"
      
    },
  },

  novel: {
    path: "/novel",
    hero: {
      eyebrow: "Browse by genre",
      title: "Novels",
      description: "Long-form stories to sink into, from sweeping historical sagas to quiet modern lives.",
      primaryAction: { label: "Submit your book", to: "/submit" },
      secondaryAction: { label: "See new books", to: "/new-books" },
    },
    listing: { eyebrow: "The collection", title: "All Novels" },
    featured: {
      eyebrow: "Novel of the month",
      bookId:"protege-of-the-sea-wolf",
      color:"#e9b18f"
    },
  },

  "non-fiction": {
    path: "/non-fiction",
    hero: {
      eyebrow: "Browse by genre",
      title: "Non Fiction",
      description: "Memoir, reflection and true stories, written by the people who lived them.",
      primaryAction: { label: "Submit your book", to: "/submit" },
      secondaryAction: { label: "See new books", to: "/new-books" },
    },
    listing: { eyebrow: "The collection", title: "All Non Fiction" },
    featured: {
      eyebrow: "True story of the month",
      bookId:"mama-said-thered-be-stories-like-this",
      color:"#E1E4ED"
    },
  },

  children: {
    path: "/children",
    hero: {
      eyebrow: "Browse by genre",
      title: "Children’s Books",
      description: "Picture books and first chapter books for young readers and the grown-ups who read with them.",
      primaryAction: { label: "Submit your book", to: "/submit" },
      secondaryAction: { label: "See new books", to: "/new-books" },
    },
    listing: { eyebrow: "The collection", title: "All Children’s Books" },
    // No children's books yet, so this invites authors instead.
    featured: {
      eyebrow: "For children’s authors",
      bookId:"kason-the-kind-lion-prince",
      color:"#A0993D"
    },
  },

  "mystery-thriller": {
    path: "/mystery-thriller",
    hero: {
      eyebrow: "Browse by genre",
      title: "Mystery & Thriller",
      description: "Secrets, courtrooms and late-night page-turners you won’t want to put down.",
      primaryAction: { label: "Submit your book", to: "/submit" },
      secondaryAction: { label: "See new books", to: "/new-books" },
    },
    listing: { eyebrow: "The collection", title: "All Mystery & Thriller" },
    featured: {
      eyebrow: "Page-turner of the month",
      bookId:"mr-territaff-dark-matters",
      color:"#4E1E14"
    },
  },

  poetry: {
    path: "/poetry",
    hero: {
      eyebrow: "Browse by genre",
      title: "Poetry",
      description: "Collections to read slowly, aloud, and more than once.",
      primaryAction: { label: "Submit your book", to: "/submit" },
      secondaryAction: { label: "See new books", to: "/new-books" },
    },
    listing: { eyebrow: "The collection", title: "All Poetry" },
    // No poetry yet, so this invites poets instead.
    featured: {
      eyebrow: "For poets",
      bookId:"my-sister-number-eight",
      color:"#3B1313"
    },
  },
};

export const GENRE_PAGE_SLUGS = Object.keys(GENRE_PAGES);