import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const rootDir = process.cwd();
const port = Number(process.env.PORT || 4173);

const cleanRoutes = new Map([
  ["/free-daily-tarot-reading", "free-daily-tarot-reading.html"],
  ["/daily-tarot-reading", "daily-tarot-reading.html"],
  ["/free-tarot-reading", "free-tarot-reading.html"],
  ["/one-card-tarot-reading", "one-card-tarot-reading.html"],
  ["/online-tarot-reading", "online-tarot-reading.html"],
  ["/choose-reader", "index.html"],
  ["/veilwalkers", "readers.html"],
  ["/decks", "deck.html"],
  ["/tarot", "tarot.html"],
  ["/tarot/cards/the-fool", "tarot/the-fool/index.html"],
  ["/about", "about.html"],
  ["/lumen-archive", "lumen-archive.html"],
  ["/noctis-archive", "archive.html"],
  ["/login", "auth.html"],
  ["/signup", "auth.html"],
  ["/account", "account.html"],
  ["/journal", "journal.html"],
  ["/terms", "terms.html"],
  ["/privacy", "privacy.html"]
]);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

function getRouteFile(pathname) {
  if (pathname === "/") {
    return "index.html";
  }

  if (cleanRoutes.has(pathname)) {
    return cleanRoutes.get(pathname);
  }

  return decodeURIComponent(pathname).replace(/^\/+/, "");
}

function resolveSafeFile(pathname) {
  const routeFile = getRouteFile(pathname);
  const filePath = resolve(rootDir, normalize(routeFile));

  if (!filePath.startsWith(rootDir)) {
    return null;
  }

  if (!existsSync(filePath)) {
    return null;
  }

  const stats = statSync(filePath);

  if (stats.isDirectory()) {
    const indexPath = join(filePath, "index.html");
    return existsSync(indexPath) ? indexPath : null;
  }

  return stats.isFile() ? filePath : null;
}

const server = createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const filePath = resolveSafeFile(url.pathname);

  if (!filePath) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Cannot GET ${url.pathname}`);
    return;
  }

  response.writeHead(200, {
    "content-type": mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream"
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, () => {
  console.log(`Astral Veil dev server running at http://localhost:${port}`);
});
