(function () {
  let scrollReader = null;
  let scrollReaderPanel = null;
  let scrollReaderTitle = null;
  let scrollReaderMeta = null;
  let scrollReaderBody = null;
  let scrollReaderPageNumber = null;
  let scrollReaderPrev = null;
  let scrollReaderNext = null;
  let scrollReaderClose = null;
  let scrollReaderReturnTarget = null;
  let scrollReaderPageScrollX = 0;
  let scrollReaderPageScrollY = 0;
  let scrollReaderBackgroundElements = [];
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
    scrollReaderClose = scrollReader.querySelector(".scroll-reader__close");

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
      if (!scrollReader?.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Tab") {
        trapScrollReaderFocus(event);
      } else if (event.key === "Escape") {
        closeScrollReader();
      } else if (event.key === "ArrowRight") {
        turnScrollReaderPage("next");
      } else if (event.key === "ArrowLeft") {
        turnScrollReaderPage("prev");
      }
    });

    return scrollReader;
  }

  function getScrollReaderFocusableElements() {
    if (!scrollReaderPanel) {
      return [];
    }

    return [...scrollReaderPanel.querySelectorAll(
      "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )];
  }

  function trapScrollReaderFocus(event) {
    const focusableElements = getScrollReaderFocusableElements();

    if (!focusableElements.length) {
      event.preventDefault();
      scrollReaderPanel?.focus({ preventScroll: true });
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const focusIsInside = scrollReaderPanel?.contains(document.activeElement);

    if (event.shiftKey && (!focusIsInside || document.activeElement === firstElement)) {
      event.preventDefault();
      lastElement.focus({ preventScroll: true });
    } else if (!event.shiftKey && (!focusIsInside || document.activeElement === lastElement)) {
      event.preventDefault();
      firstElement.focus({ preventScroll: true });
    }
  }

  function resetScrollReaderPosition() {
    if (scrollReader) {
      scrollReader.scrollTop = 0;
      scrollReader.scrollLeft = 0;
    }

    if (scrollReaderPanel) {
      scrollReaderPanel.scrollTop = 0;
      scrollReaderPanel.scrollLeft = 0;
    }

    if (scrollReaderBody) {
      scrollReaderBody.scrollTop = 0;
      scrollReaderBody.scrollLeft = 0;
    }
  }

  function presentScrollReaderAtTop() {
    resetScrollReaderPosition();

    window.requestAnimationFrame(() => {
      resetScrollReaderPosition();
      scrollReaderClose?.focus({ preventScroll: true });

      window.requestAnimationFrame(() => {
        resetScrollReaderPosition();
      });
    });
  }

  function setScrollReaderBackgroundInert(shouldBeInert) {
    if (!shouldBeInert) {
      scrollReaderBackgroundElements.forEach(({ element, wasInert }) => {
        if (!wasInert) {
          element.removeAttribute("inert");
        }
      });
      scrollReaderBackgroundElements = [];
      return;
    }

    if (scrollReaderBackgroundElements.length) {
      return;
    }

    scrollReaderBackgroundElements = [...document.body.children]
      .filter((element) => element !== scrollReader && !element.hasAttribute("inert"))
      .map((element) => {
        const record = { element, wasInert: false };
        element.setAttribute("inert", "");
        return record;
      });
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
    scrollReaderPageScrollX = window.scrollX;
    scrollReaderPageScrollY = window.scrollY;
    scrollReaderPages = normalizePages({ pages, entries, body, label, title, author });
    scrollReaderPageIndex = 0;

    if (!scrollReaderPages.length) {
      scrollReaderPages = [{ label, title, author, body: [] }];
    }

    scrollReader.className = `scroll-reader scroll-reader--${normalizedVariant} is-open`;
    scrollReader.setAttribute("aria-hidden", "false");
    renderScrollReaderPage();

    document.body.classList.add("is-scroll-reader-open");
    setScrollReaderBackgroundInert(true);
    presentScrollReaderAtTop();
  }

  function closeScrollReader() {
    if (!scrollReader) {
      return;
    }

    scrollReader.classList.remove("is-open");
    scrollReader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-scroll-reader-open");
    setScrollReaderBackgroundInert(false);

    if (scrollReaderReturnTarget && typeof scrollReaderReturnTarget.focus === "function") {
      scrollReaderReturnTarget.focus({ preventScroll: true });
    }

    window.scrollTo(scrollReaderPageScrollX, scrollReaderPageScrollY);
    scrollReaderReturnTarget = null;
  }

  window.AstralVeilScrollReader = {
    open: openScrollReader,
    close: closeScrollReader
  };
})();
