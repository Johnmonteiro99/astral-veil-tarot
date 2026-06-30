(function () {
  let scrollReader = null;
  let scrollReaderPanel = null;
  let scrollReaderTitle = null;
  let scrollReaderMeta = null;
  let scrollReaderBody = null;
  let scrollReaderPageNumber = null;
  let scrollReaderPrev = null;
  let scrollReaderNext = null;
  let scrollReaderReturnTarget = null;
  let scrollReaderPages = [];
  let scrollReaderPageIndex = 0;

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

  function normalizePages({ pages = null, entries = null, body = [], label = "", title = "", author = "" } = {}) {
    const sourcePages = Array.isArray(pages) ? pages : Array.isArray(entries) ? entries : null;

    if (!sourcePages) {
      return [{
        label,
        title,
        author,
        body
      }];
    }

    return sourcePages
      .map((page, index) => {
        if (page && typeof page === "object" && !Array.isArray(page)) {
          return {
            label: page.label ?? label,
            title: page.title ?? title,
            author: page.author ?? author,
            body: page.body ?? page.content ?? page.paragraphs ?? []
          };
        }

        return {
          label,
          title: index === 0 ? title : "",
          author,
          body: page
        };
      })
      .filter((page) => normalizeParagraphs(page.body).length || page.title);
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
        <nav class="scroll-reader__pager" aria-label="Scroll pages">
          <button class="scroll-reader__page-btn" type="button" data-scroll-reader-page="prev" aria-label="Previous scroll page">‹</button>
          <span class="scroll-reader__page-number" data-scroll-reader-page-number>Page 1 of 1</span>
          <button class="scroll-reader__page-btn" type="button" data-scroll-reader-page="next" aria-label="Next scroll page">›</button>
        </nav>
        <span class="scroll-reader__seal" aria-hidden="true"></span>
        <span class="scroll-reader__rod scroll-reader__rod--bottom" aria-hidden="true"></span>
      </article>
    `;

    document.body.appendChild(scrollReader);
    scrollReaderPanel = scrollReader.querySelector(".scroll-reader__panel");
    scrollReaderTitle = scrollReader.querySelector("[data-scroll-reader-title]");
    scrollReaderMeta = scrollReader.querySelector("[data-scroll-reader-meta]");
    scrollReaderBody = scrollReader.querySelector("[data-scroll-reader-body]");
    scrollReaderPageNumber = scrollReader.querySelector("[data-scroll-reader-page-number]");
    scrollReaderPrev = scrollReader.querySelector("[data-scroll-reader-page='prev']");
    scrollReaderNext = scrollReader.querySelector("[data-scroll-reader-page='next']");

    scrollReader.addEventListener("click", (event) => {
      if (event.target.closest("[data-scroll-reader-close]")) {
        closeScrollReader();
        return;
      }

      const pageButton = event.target.closest("[data-scroll-reader-page]");

      if (pageButton) {
        turnScrollReaderPage(pageButton.dataset.scrollReaderPage);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && scrollReader?.classList.contains("is-open")) {
        closeScrollReader();
      } else if (event.key === "ArrowRight" && scrollReader?.classList.contains("is-open")) {
        turnScrollReaderPage("next");
      } else if (event.key === "ArrowLeft" && scrollReader?.classList.contains("is-open")) {
        turnScrollReaderPage("prev");
      }
    });

    return scrollReader;
  }

  function renderScrollReaderPage() {
    const page = scrollReaderPages[scrollReaderPageIndex] || {};
    const metaItems = [page.label, page.author].filter(Boolean);
    const paragraphs = normalizeParagraphs(page.body);

    scrollReaderTitle.textContent = page.title || "Recovered Writing";
    scrollReaderMeta.textContent = metaItems.join(" / ");
    scrollReaderMeta.hidden = !metaItems.length;
    scrollReaderBody.innerHTML = paragraphs
      .map(renderScrollParagraph)
      .join("");

    if (scrollReaderPageNumber) {
      scrollReaderPageNumber.textContent = `Page ${scrollReaderPageIndex + 1} of ${scrollReaderPages.length}`;
    }

    if (scrollReaderPrev) {
      scrollReaderPrev.disabled = scrollReaderPageIndex <= 0;
    }

    if (scrollReaderNext) {
      scrollReaderNext.disabled = scrollReaderPageIndex >= scrollReaderPages.length - 1;
    }
  }

  function turnScrollReaderPage(direction) {
    if (!scrollReader?.classList.contains("is-open") || scrollReaderPages.length <= 1) {
      return;
    }

    const nextIndex = direction === "next"
      ? Math.min(scrollReaderPageIndex + 1, scrollReaderPages.length - 1)
      : Math.max(scrollReaderPageIndex - 1, 0);

    if (nextIndex === scrollReaderPageIndex) {
      return;
    }

    scrollReaderPageIndex = nextIndex;
    renderScrollReaderPage();
    scrollReaderBody?.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openScrollReader({ variant = "lumen", label = "", title = "", author = "", body = [], pages = null, entries = null, trigger = null } = {}) {
    createScrollReader();

    const normalizedVariant = variant === "noctis" ? "noctis" : "lumen";

    scrollReaderReturnTarget = trigger instanceof HTMLElement ? trigger : document.activeElement;
    scrollReaderPages = normalizePages({ pages, entries, body, label, title, author });
    scrollReaderPageIndex = 0;

    if (!scrollReaderPages.length) {
      scrollReaderPages = [{ label, title, author, body: [] }];
    }

    scrollReader.className = `scroll-reader scroll-reader--${normalizedVariant} is-open`;
    scrollReader.setAttribute("aria-hidden", "false");
    renderScrollReaderPage();

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
