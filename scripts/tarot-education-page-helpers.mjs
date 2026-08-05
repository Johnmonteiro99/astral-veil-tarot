import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getTarotEducationHeroImages } from "../data/tarot-education-hero-images.js";
import { escapeHtml } from "./card-page-helpers.mjs";

export const tarotEducationNavigation = Object.freeze([
  Object.freeze({ key: "history", label: "Tarot History", route: "/tarot/history/" }),
  Object.freeze({ key: "major-arcana", label: "Major Arcana", route: "/tarot/major-arcana/" }),
  Object.freeze({ key: "minor-arcana", label: "Minor Arcana", route: "/tarot/minor-arcana/" }),
  Object.freeze({ key: "beginners", label: "Tarot for Beginners", route: "/tarot/for-beginners/" }),
  Object.freeze({ key: "how-to-read", label: "How to Read Tarot", route: "/how-to-read-tarot-cards/" }),
  Object.freeze({ key: "spreads", label: "Tarot Spreads", route: "/tarot-spreads/" }),
  Object.freeze({ key: "tarot-vs-oracle", label: "Tarot vs. Oracle", route: "/tarot/compare/tarot-vs-oracle-cards/" }),
  Object.freeze({ key: "tarot-vs-lenormand", label: "Tarot vs. Lenormand", route: "/tarot/compare/tarot-vs-lenormand/" })
]);

export function getTarotEducationItem(key) {
  const item = tarotEducationNavigation.find((candidate) => candidate.key === key);
  if (!item) throw new Error(`Unknown Tarot education navigation key: ${key}`);
  return item;
}

export function isTarotEducationRouteAvailable(rootDir, route) {
  return existsSync(resolve(rootDir, route.replace(/^\/+/, ""), "index.html"));
}

export function renderTarotEducationNavigation({ activeKey, rootDir }) {
  getTarotEducationItem(activeKey);

  const items = tarotEducationNavigation.map((item) => {
    const isActive = item.key === activeKey;
    const isAvailable = isActive || isTarotEducationRouteAvailable(rootDir, item.route);
    const className = `tarot-education-nav__item${isActive ? " is-active" : ""}${isAvailable ? "" : " is-disabled"}`;

    if (isAvailable) {
      return `<a class="${className}" href="${escapeHtml(item.route)}"${isActive ? ' aria-current="page" data-tarot-education-active' : ""} data-tarot-education-item="${escapeHtml(item.key)}">${escapeHtml(item.label)}</a>`;
    }

    return `<span class="${className}" role="link" aria-disabled="true" aria-label="${escapeHtml(item.label)} — Coming Soon" tabindex="0" data-tarot-education-item="${escapeHtml(item.key)}"><span>${escapeHtml(item.label)}</span><small>Coming Soon</small></span>`;
  }).join("");

  return `<nav class="tarot-education-nav" aria-label="Tarot education pages">
        <div class="tarot-education-nav__viewport" data-tarot-education-viewport>
          <div class="tarot-education-nav__track">${items}</div>
        </div>
      </nav>`;
}

export function renderTarotEducationHeroImage({
  pageKey,
  className = "",
  alt = "",
  loading = "eager",
  fetchpriority = "high",
  decorative = false,
  draggable = false
}) {
  const { regular } = getTarotEducationHeroImages(pageKey);
  const classAttribute = className ? ` class="${escapeHtml(className)}"` : "";
  const priorityAttribute = fetchpriority ? ` fetchpriority="${escapeHtml(fetchpriority)}"` : "";
  return `<img${classAttribute} src="${escapeHtml(regular.src)}" alt="${decorative ? "" : escapeHtml(alt)}" width="${regular.width}" height="${regular.height}" loading="${escapeHtml(loading)}" decoding="async"${priorityAttribute} draggable="${draggable}" data-education-hero-image />`;
}

export function renderTarotFaqSection({
  section,
  items,
  idPrefix,
  className = "",
  layout = "stacked",
  includeMajorClass = false,
  innerClassName = "tarot-shell",
  renderQuestion = (item) => escapeHtml(item.question),
  renderAnswer = (item) => escapeHtml(item.answer),
  showDivider = false
}) {
  if (layout !== "split" && layout !== "stacked") {
    throw new Error(`Unknown Tarot FAQ layout: ${layout}`);
  }

  const sectionId = section.id;
  const eyebrow = section.eyebrow || (section.number ? `Chapter ${section.number}` : "Common Questions");
  const classes = [
    "tarot-faq",
    includeMajorClass ? "major-arcana-faq" : "",
    "tarot-education-faq",
    className,
    `tarot-faq--${layout}`
  ]
    .filter(Boolean)
    .join(" ");
  const renderedItems = items.map((item, index) => {
    const number = index + 1;
    const questionId = `${idPrefix}-question-${number}`;
    const answerId = `${idPrefix}-answer-${number}`;

    return `<article class="tarot-faq__item" data-education-faq-item>
            <h3><button class="tarot-faq__trigger" id="${escapeHtml(questionId)}" type="button" aria-expanded="true" aria-controls="${escapeHtml(answerId)}" data-education-faq-button>
              <span>${renderQuestion(item, index)}</span><span class="tarot-faq__icon" aria-hidden="true">−</span>
            </button></h3>
            <div class="tarot-faq__answer" id="${escapeHtml(answerId)}" role="region" aria-labelledby="${escapeHtml(questionId)}" aria-hidden="false"><div class="tarot-faq__answer-inner"><p>${renderAnswer(item, index)}</p></div></div>
          </article>`;
  }).join("");
  const innerClasses = [innerClassName, "tarot-faq__inner"].filter(Boolean).join(" ");
  const introduction = section.introduction
    ? `<p class="tarot-faq__intro">${escapeHtml(section.introduction)}</p>`
    : "";
  const divider = showDivider
    ? '<div class="tarot-faq__divider" aria-hidden="true"><span></span><span class="tarot-faq__ornament">✦</span><span></span></div>'
    : "";
  const headerExtras = [introduction, divider]
    .filter(Boolean)
    .map((part) => `            ${part}`)
    .join("\n");

  return `<section class="${classes}" id="${escapeHtml(sectionId)}" aria-labelledby="${escapeHtml(sectionId)}-heading" data-education-faq>
        <div class="${innerClasses}">
          <header class="tarot-faq__header">
            <p class="tarot-faq__eyebrow">${escapeHtml(eyebrow)}</p>
            <h2 id="${escapeHtml(sectionId)}-heading">${escapeHtml(section.heading)}</h2>
${headerExtras ? `${headerExtras}\n` : ""}          </header>
          <div class="tarot-faq__list">${renderedItems}</div>
        </div>
      </section>`;
}

export function renderTarotEducationFaq({ section, items, idPrefix, className = "" }) {
  return renderTarotFaqSection({
    section,
    items,
    idPrefix,
    className,
    layout: "stacked",
    includeMajorClass: true
  });
}

export function validateRenderedTarotEducationNavigation(html, { activeKey, rootDir }) {
  const errors = [];
  const activeItem = getTarotEducationItem(activeKey);
  const start = html.indexOf('<nav class="tarot-education-nav"');
  const end = start >= 0 ? html.indexOf("</nav>", start) : -1;
  const navHtml = start >= 0 && end > start ? html.slice(start, end) : "";

  if (!navHtml.includes('aria-label="Tarot education pages"')) {
    errors.push("semantic Tarot education navigation is missing");
    return errors;
  }

  const availableItems = tarotEducationNavigation.filter((item) => isTarotEducationRouteAvailable(rootDir, item.route));
  const unavailableItems = tarotEducationNavigation.filter((item) => !isTarotEducationRouteAvailable(rootDir, item.route));
  if ((navHtml.match(/data-tarot-education-item="/g) || []).length !== tarotEducationNavigation.length
    || (navHtml.match(/<a class="tarot-education-nav__item/g) || []).length !== availableItems.length
    || (navHtml.match(/aria-disabled="true"/g) || []).length !== unavailableItems.length) {
    errors.push("live and Coming Soon route states do not match the shared registry");
  }

  if (!navHtml.includes(`href="${activeItem.route}" aria-current="page" data-tarot-education-active`)) {
    errors.push(`active state is missing for ${activeItem.label}`);
  }

  let previousIndex = -1;
  tarotEducationNavigation.forEach((item) => {
    const itemIndex = navHtml.indexOf(`data-tarot-education-item="${item.key}"`);
    if (itemIndex < 0 || itemIndex <= previousIndex) errors.push(`route order is incorrect at ${item.label}`);
    previousIndex = itemIndex;

    const isAvailable = availableItems.includes(item);
    if (isAvailable && !navHtml.includes(`href="${item.route}"`)) {
      errors.push(`live route is missing for ${item.label}`);
    }
    if (!isAvailable && navHtml.includes(`href="${item.route}"`)) {
      errors.push(`Coming Soon route is incorrectly linked for ${item.label}`);
    }
  });

  return errors;
}
