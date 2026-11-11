
import fs from "node:fs/promises";
import path from "node:path";

const MAX_BODY = 12 * 1024 * 1024; // 12 MB (images are sent as base64)
const IMAGE_FOLDERS = ["covers", "authors"];

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error("Request too large"));
        req.destroy();
      } else chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function checkLibrary(data) {
  if (!data || typeof data !== "object") throw new Error("Body must be an object");
  for (const key of ["genres", "authors", "books"]) {
    if (!Array.isArray(data[key])) throw new Error(`"${key}" must be an array`);
  }
  const authorIds = new Set();
  for (const a of data.authors) {
    if (!a.id || !a.name) throw new Error("Every author needs an id and a name");
    if (authorIds.has(a.id)) throw new Error(`Duplicate author id "${a.id}"`);
    authorIds.add(a.id);
  }
  const bookIds = new Set();
  for (const b of data.books) {
    if (!b.id || !b.title) throw new Error("Every book needs an id and a title");
    if (bookIds.has(b.id)) throw new Error(`Duplicate book id "${b.id}"`);
    if (!authorIds.has(b.authorId)) throw new Error(`Book "${b.title}" has unknown author "${b.authorId}"`);
    bookIds.add(b.id);
  }
}

export default function libraryAdmin({ dataFile = "src/data/library.json" } = {}) {
  let root;
  let publicDir;

  return {
    name: "library-admin",
    apply: "serve",
    configResolved(config) {
      root = config.root;
      publicDir = config.publicDir;
    },
    configureServer(server) {
      server.middlewares.use("/__admin", async (req, res) => {
        const send = (status, body) => {
          res.statusCode = status;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(body));
        };

        try {
          if (req.method !== "POST") return send(405, { error: "Use POST" });
          const body = JSON.parse(await readBody(req));

          /* ---- Save the whole library ---- */
          if (req.url === "/library") {
            checkLibrary(body);
            const file = path.resolve(root, dataFile);
            await fs.copyFile(file, `${file}.bak`).catch(() => {}); // one-step undo
            await fs.writeFile(file, `${JSON.stringify(body, null, 2)}\n`, "utf8");
            return send(200, { ok: true });
          }

          /* ---- Upload a cover or author photo ---- */
          if (req.url === "/upload") {
            const { folder, name, dataUrl } = body;
            if (!IMAGE_FOLDERS.includes(folder)) throw new Error("Unknown image folder");
            const safeName = String(name ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "");
            if (!safeName) throw new Error("Image needs a name (fill in the id first)");
            const match = /^data:image\/(png|jpe?g|webp);base64,(.+)$/.exec(dataUrl ?? "");
            if (!match) throw new Error("Only PNG, JPG or WebP images are allowed");

            const ext = match[1] === "jpeg" ? "jpg" : match[1];
            const dir = path.join(publicDir, "images", folder);
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(path.join(dir, `${safeName}.${ext}`), Buffer.from(match[2], "base64"));
            return send(200, { path: `/images/${folder}/${safeName}.${ext}` });
          }

          return send(404, { error: "Unknown admin route" });
        } catch (err) {
          return send(400, { error: err.message });
        }
      });
    },
  };
}
