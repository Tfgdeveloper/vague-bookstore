import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ContactSection from "./components/ContactSection";


import BookPage from "./pages/BookPage";
import AuthorPage from "./pages/AuthorPage";
import AuthorsPage from "./pages/AuthorsPage";
import SubmitPage from "./pages/SubmitPage";
import { NotFound } from "./lib/pageHelpers";
import { GENRES } from "./data/books";
import GenrePage from "./pages/Genrepage";
import Home from "./pages/Home";

// Header + page + footer on every page
function Layout() {
  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
   
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home/> } />

          {/* Genres from books.js: /fiction and /fiction/historical-fiction */}
          {GENRES.map((g) => (
            <Route key={g.slug} path={`/${g.slug}`}>
              <Route index element={<GenrePage key={g.slug} genreSlug={g.slug} />} />
              <Route path=":subSlug" element={<GenrePage key={`${g.slug}-sub`} genreSlug={g.slug} />} />
            </Route>
          ))}
          <Route path="/new-books" element={<GenrePage key="new-books" genreSlug="new-books" />} />

          <Route path="/book/:bookId" element={<BookPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/authors/:authorId" element={<AuthorPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/contact" element={<ContactSection />} />

          <Route
            path="*"
            element={<NotFound title="Page not found" message="The page you’re looking for doesn’t exist or has moved." />}
          />
        </Route>
      </Routes>

  );
}