import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { escapeHtml } from "./card-page-helpers.mjs";

export const tarotEducationNavigation = Object.freeze([
  Object.freeze({ key: "history", label: "Tarot History", route: "/tarot/history/" }),
  Object.freeze({ key: "major-arcana", label: "Major Arcana", route: "/tarot/major-arcana/" }),
  Object.freeze({ key: "minor-arcana", label: "Minor Arcana", route: "/tarot/minor-arcana/" }),
  Object.freeze({ key: "beginners", label: "Tarot for Beginners", route: "/tarot/for-beginners/" }),
  Object.freeze({ key: "how-to-read", label: "How to Read Tarot", route: "/tarot/how-to-read/" }),
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
    const isAvailable = isTarotEducationRouteAvailable(rootDir, item.route);
    const isActive = item.key === activeKey;
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
