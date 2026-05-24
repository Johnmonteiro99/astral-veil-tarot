(function () {
  let scrollReader = null;
  let scrollReaderPanel = null;
  let scrollReaderTitle = null;
  let scrollReaderMeta = null;
  let scrollReaderBody = null;
  let scrollReaderReturnTarget = null;

  function escapeScrollHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalizeParagraphs(body) {
    if (Array.isArray(body)) {
      return body;
    }

    return String(body || "")
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  function renderScrollParagraph(paragraph) {
    // Trusted local archive entries may pass small inline spans for hidden marks;
    // ordinary strings are always escaped before they enter the scroll reader.
    if (paragraph && typeof paragraph === "object" && typeof paragraph.html === "string") {
      return `<p>${paragraph.html}</p>`;
    }

    return `<p>${escapeScrollHtml(paragraph)}</p>`;
  }

  function createScrollReader() {
    if (scrollReader) {
      return scrollReader;
    }

    scrollReader = document.createElement("div");
    scrollReader.className = "scroll-reader scroll-reader--lumen";
    scrollReader.setAttribute("aria-hidden", "true");
    scrollReader.innerHTML = `
      <button class="scroll-reader__overlay" type="button" data-scroll-reader-close aria-label="Close scroll reader"></button>
      <article class="scroll-reader__panel" role="dialog" aria-modal="true" aria-labelledby="scroll-reader-title" tabindex="-1">
        <span class="scroll-reader__rod scroll-reader__rod--top" aria-hidden="true"></span>
        <button class="scroll-reader__close" type="button" data-scroll-reader-close aria-label="Return from scroll">
          Return
        </button>
        <header class="scroll-reader__header">
          <p class="scroll-reader__meta" data-scroll-reader-meta></p>
          <h2 id="scroll-reader-title" data-scroll-reader-title></h2>
        </header>
        <div class="scroll-reader__body" data-scroll-reader-body></div>
        <span class="scroll-reader__seal" aria-hidden="true"></span>
        <span class="scroll-reader__rod scroll-reader__rod--bottom" aria-hidden="true"></span>
      </article>
    `;

    document.body.appendChild(scrollReader);
    scrollReaderPanel = scrollReader.querySelector(".scroll-reader__panel");
    scrollReaderTitle = scrollReader.querySelector("[data-scroll-reader-title]");
    scrollReaderMeta = scrollReader.querySelector("[data-scroll-reader-meta]");
    scrollReaderBody = scrollReader.querySelector("[data-scroll-reader-body]");

    scrollReader.addEventListener("click", (event) => {
      if (event.target.closest("[data-scroll-reader-close]")) {
        closeScrollReader();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && scrollReader?.classList.contains("is-open")) {
        closeScrollReader();
      }
    });

    return scrollReader;
  }

  function openScrollReader({ variant = "lumen", label = "", title = "", author = "", body = [], trigger = null } = {}) {
    createScrollReader();

    const normalizedVariant = variant === "noctis" ? "noctis" : "lumen";
    const metaItems = [label, author].filter(Boolean);
    const paragraphs = normalizeParagraphs(body);

    scrollReaderReturnTarget = trigger instanceof HTMLElement ? trigger : document.activeElement;
    scrollReader.className = `scroll-reader scroll-reader--${normalizedVariant} is-open`;
    scrollReader.setAttribute("aria-hidden", "false");
    scrollReaderTitle.textContent = title || "Recovered Writing";
    scrollReaderMeta.textContent = metaItems.join(" / ");
    scrollReaderMeta.hidden = !metaItems.length;
    scrollReaderBody.innerHTML = paragraphs
      .map(renderScrollParagraph)
      .join("");

    document.body.classList.add("is-scroll-reader-open");
    window.requestAnimationFrame(() => {
      scrollReaderPanel?.focus({ preventScroll: true });
    });
  }

  function closeScrollReader() {
    if (!scrollReader) {
      return;
    }

    scrollReader.classList.remove("is-open");
    scrollReader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-scroll-reader-open");

    if (scrollReaderReturnTarget && typeof scrollReaderReturnTarget.focus === "function") {
      scrollReaderReturnTarget.focus({ preventScroll: true });
    }

    scrollReaderReturnTarget = null;
  }

  window.AstralVeilScrollReader = {
    open: openScrollReader,
    close: closeScrollReader
  };
})();
