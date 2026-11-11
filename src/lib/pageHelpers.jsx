import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heading, Description } from "../components/ui/typography";
import { buttonClasses } from "../components/ui/button";
import { genrePath, getGenre, getGenreName, getSubgenre, subgenrePath } from "../data/books";

// Same side padding as every other section
export const CONTAINER = "mx-auto max-w-[1700px] px-5 sm:px-10 lg:px-16";

// "fiction" → { slug, name: "Fiction", path: "/fiction" }
export function genreInfo(slug) {
  return { slug, name: getGenreName(slug), path: getGenre(slug) ? genrePath(slug) : `/${slug}` };
}

// "fantasy" → { slug, name: "Fantasy", path: "/fiction/fantasy", genre: "fiction" }
export function subgenreInfo(slug) {
  const sub = getSubgenre(slug);
  return sub
    ? { slug, name: sub.name, path: subgenrePath(sub.genre, slug), genre: sub.genre }
    : { slug, name: slug, path: `/${slug}`, genre: null };
}

// First and last initials: "Donald G. Newman" → "DN", "Col. Fred Van Horn" → "FH"
export function initials(name = "") {
  const words = name
    .replace(/^(Dr|Col|Capt|Mr|Mrs|Ms)\.?\s+/i, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !/^(and|&)$/i.test(w));
  if (!words.length) return "";
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

// Sets the browser tab title and scrolls to the top when the page changes
export function usePageTitle(title) {
  useEffect(() => {
    document.title = `${title} · Vague Book Store`;
    window.scrollTo(0, 0);
  }, [title]);
}

export function NotFound({ title, message, backTo = "/", backLabel = "Back to home" }) {
  return (
    <section className="bg-[#FAF7F2] py-24">
      <div className={`${CONTAINER} text-center`}>
        <Heading as="h1" size="h2">{title}</Heading>
        <Description size="md" className="mx-auto mt-3 max-w-md">{message}</Description>
        <Link to={backTo} className={`${buttonClasses("primary", "md")} mt-8`}>
          {backLabel}
        </Link>
      </div>
    </section>
  );
}