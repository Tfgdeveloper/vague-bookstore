import { useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";
import { cn } from "../lib/cn";

// Colour pairs for the typographic placeholder, used until a real cover image exists
const PALETTES = [
  ["#5a1419", "#E7C98F"], // maroon / gold
  ["#1f3a2e", "#d8b56a"], // forest / brass
  ["#1d2a44", "#e9dcc3"], // navy / parchment
  ["#3b2a20", "#e8c79a"], // walnut / sand
  ["#2a1b1b", "#c9a46d"], // ink / gold
  ["#4a3b5c", "#efe3cf"], // plum / cream
];

const paletteFor = (id = "") => {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTES[h % PALETTES.length];
};

/**
 * Shows book.cover (an image path) when it loads.
 * Falls back to a typographic cover when there's no image or it fails to load.
 */
export function BookCover({ book, imageUrl, className, size = "md" }) {
  const src = imageUrl ?? (typeof book.cover === "string" ? book.cover : null);
  const [failed, setFailed] = useState(false);
  const [bg, fg] = Array.isArray(book.cover) ? book.cover : paletteFor(book.id);
  const author = book.authorName ?? book.author ?? "";

  return (
    <div className={cn("w-full", className)}>
      <AspectRatio ratio={2 / 3}>
        {src && !failed ? (
          <img
            src={src}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full rounded-[3px] object-contain"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col justify-between rounded-[3px] p-[10%]"
            style={{
              backgroundColor: bg,
              color: fg,
              boxShadow: "inset 6px 0 0 rgba(0,0,0,0.2), 0 10px 24px -12px rgba(42,27,27,0.55)",
            }}
          >
            <p
              className={cn("leading-[1.05]", size === "sm" ? "text-base" : "text-xl sm:text-2xl")}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {book.title || "Your title"}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] opacity-90">
              {author || "Author name"}
            </p>
          </div>
        )}
      </AspectRatio>
    </div>
  );
}