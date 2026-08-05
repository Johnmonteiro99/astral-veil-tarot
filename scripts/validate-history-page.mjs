import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotHistory } from "../data/tarot-history.mjs";
import {
  getHistoryOutputPath,
  getHistoryRoute,
  validateHistoryData
} from "./history-page-helpers.mjs";
import { validateRenderedTarotEducationNavigation } from "./tarot-education-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = getHistoryOutputPath(rootDir, tarotHistory);
const route = getHistoryRoute(tarotHistory);
const canonical = `https://astralveil.world${route}`;
const errors = validateHistoryData(tarotHistory, { rootDir, checkGenerated: true });

if (!existsSync(outputPath)) {
  errors.push(`route: generated page is missing at ${outputPath}`);
} else {
  const html = readFileSync(outputPath, "utf8");
  const css = readFileSync(resolve(rootDir, "css/tarot-history.css"), "utf8");
  const js = readFileSync(resolve(rootDir, "js/tarot-history.js"), "utf8");
  const educationCss = readFileSync(resolve(rootDir, "css/tarot-education-components.css"), "utf8");
  const educationJs = readFileSync(resolve(rootDir, "js/tarot-education.js"), "utf8");
  const sitemap = readFileSync(resolve(rootDir, "sitemap.xml"), "utf8");
  const hubScript = readFileSync(resolve(rootDir, "js/tarot.js"), "utf8");

  const countMatches = (pattern, value = html) => (value.match(pattern) || []).length;
  const findElementEnd = (startIndex, tagName) => {
    const tags = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
    tags.lastIndex = startIndex;
    let depth = 0;
    let match;
    while ((match = tags.exec(html))) {
      depth += match[0].startsWith(`</${tagName}`) ? -1 : 1;
      if (depth === 0) return tags.lastIndex;
    }
    return -1;
  };
  validateRenderedTarotEducationNavigation(html, { activeKey: "history", rootDir })
    .forEach((error) => errors.push(`education navigation: ${error}`));
  const parseSchema = (id) => {
    const match = html.match(new RegExp(`<script id="${id}" type="application/ld\\+json">([\\s\\S]*?)<\\/script>`));
    if (!match) return null;
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      errors.push(`${id}: invalid JSON-LD (${error.message})`);
      return null;
    }
  };

  if (countMatches(/<h1(?:\s|>)/g) !== 1) errors.push("headings: expected exactly one H1");
  if (!html.includes(`<link rel="canonical" href="${canonical}" />`)) errors.push("seo: self-referencing canonical is missing");
  const escapedTitle = tarotHistory.seo.title.replaceAll("&", "&amp;");
  if (!html.includes(`<title>${escapedTitle}</title>`)) errors.push("seo: title does not match data");
  if (!html.includes(`content="${tarotHistory.seo.description}"`)) errors.push("seo: meta description does not match data");
  if (html.includes('"@type":"Article"') || html.includes('"@type":"Product"')) errors.push("schema: Article and Product schema are not permitted");

  const breadcrumb = parseSchema("tarot-history-breadcrumb-schema");
  const webPage = parseSchema("tarot-history-webpage-schema");
  const faqPage = parseSchema("tarot-history-faq-schema");
  if (breadcrumb?.["@type"] !== "BreadcrumbList") errors.push("schema: BreadcrumbList is missing");
  if (breadcrumb?.itemListElement?.length !== 3) errors.push("schema: BreadcrumbList must contain Home, Tarot, and History");
  if (webPage?.["@type"] !== "WebPage" || webPage?.url !== canonical) errors.push("schema: WebPage URL is missing or incorrect");
  if (faqPage?.["@type"] !== "FAQPage") {
    errors.push("schema: FAQPage is missing");
  } else {
    const schemaFaq = faqPage.mainEntity || [];
    if (schemaFaq.length !== tarotHistory.faq.length) errors.push("schema: FAQ count does not match visible FAQ");
    tarotHistory.faq.forEach((item, index) => {
      if (schemaFaq[index]?.name !== item.question || schemaFaq[index]?.acceptedAnswer?.text !== item.answer) {
        errors.push(`schema: FAQ entry ${index + 1} does not match the visible data record`);
      }
    });
  }

  const faqMarkup = html.match(/<section class="[^"]*tarot-education-faq[^"]*"[\s\S]*?<\/section>/)?.[0] || "";
  const archiveStart = html.indexOf('<div class="tarot-history-archive">');
  const archiveEnd = findElementEnd(archiveStart, "div");
  const faqStart = html.indexOf('<section class="tarot-faq major-arcana-faq tarot-education-faq tarot-history-faq tarot-faq--stacked"');
  if (archiveStart < 0 || archiveEnd < 0 || faqStart < archiveEnd) {
    errors.push("faq: shared accordion must render outside the twelve-column History archive grid");
  }
  if (countMatches(/data-education-faq-button/g) !== tarotHistory.faq.length
    || countMatches(/data-education-faq-item/g) !== tarotHistory.faq.length
    || countMatches(/class="tarot-faq__answer"/g) !== tarotHistory.faq.length) {
    errors.push("faq: shared accordion record count is incorrect");
  }
  if (!html.includes(`>${tarotHistory.faqSection.introduction}</p>`)) {
    errors.push("faq: editorial introduction is missing");
  }
  if (!faqMarkup.includes("data-education-faq") || !faqMarkup.includes('class="tarot-shell tarot-faq__inner"')) {
    errors.push("faq: shared stacked education shell is missing");
  }
  tarotHistory.faq.forEach((item, index) => {
    const number = index + 1;
    const questionId = `tarot-history-faq-question-${number}`;
    const answerId = `tarot-history-faq-answer-${number}`;
    if (!html.includes(`id="${questionId}"`) || !html.includes(`aria-controls="${answerId}"`)) {
      errors.push(`faq: question ${number} is not connected to its answer`);
    }
    if (!html.includes(`id="${answerId}" role="region" aria-labelledby="${questionId}" aria-hidden="false"`)) {
      errors.push(`faq: answer ${number} is not present in the initial accessible HTML`);
    }
    if (!html.includes(item.question) || !html.includes(item.answer)) {
      errors.push(`faq: question or answer ${number} is missing from visible HTML`);
    }
  });
  [
    "data-history-faq-button",
    "data-history-faq-panel",
    'role="tablist"'
  ].forEach((token) => {
    if (faqMarkup.includes(token)) errors.push(`faq: obsolete History tab markup remains (${token})`);
  });
  [
    "body.tarot-meanings-page .tarot-education-faq .tarot-faq__inner",
    "grid-template-columns: minmax(0, 1fr)",
    "width: min(calc(100% - 48px), 960px)",
    ".tarot-faq__divider",
    "display: none",
    "@media (max-width: 820px)",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!educationCss.includes(token)) errors.push(`faq: shared education styling is missing (${token})`);
  });
  [
    "data-history-faq-button",
    "activateFaq",
    "faqTransitioning",
    "waitForFaqTransition"
  ].forEach((token) => {
    if (js.includes(token)) errors.push(`faq: obsolete History interaction remains (${token})`);
  });
  [
    "[data-education-faq]",
    "setItemState",
    'button.setAttribute("aria-expanded", String(isOpen))',
    'answer.setAttribute("aria-hidden", String(!isOpen))',
    "answer.inert = !isOpen",
    'icon.textContent = isOpen ? "−" : "+"'
  ].forEach((token) => {
    if (!educationJs.includes(token)) errors.push(`faq: required shared interaction is missing (${token})`);
  });

  if (countMatches(/class="tarot-history-closing-card"/g) !== tarotHistory.closingCta.actions.length
    || countMatches(/class="tarot-history-closing-card__image"/g) !== tarotHistory.closingCta.actions.length) {
    errors.push("closing CTA: four linked destination cards with images are required");
  }
  if (html.includes("tarot-history-action-symbol")) {
    errors.push("closing CTA: obsolete circular icon treatment remains");
  }
  tarotHistory.closingCta.actions.forEach((action, index) => {
    [action.label, action.description, action.image.src].forEach((value) => {
      if (!html.includes(value)) errors.push(`closing CTA: destination card ${index + 1} is incomplete`);
    });
    if (!html.includes(`class="tarot-history-closing-card" href="${action.route}"`)) {
      errors.push(`closing CTA: destination card ${index + 1} is not a semantic link`);
    }
  });
  [
    ".tarot-history-closing-card__media",
    ".tarot-history-closing-card__content",
    ".tarot-history-closing-card__description",
    ".tarot-history-closing-card__arrow",
    "grid-template-columns: repeat(4, minmax(0, 1fr))",
    "grid-template-columns: repeat(2, minmax(0, 1fr))",
    "transform: translateY(-4px)",
    "backdrop-filter: blur(8px)",
    ".tarot-history-closing-card:focus-visible",
    ".tarot-history-closing-card:hover .tarot-history-closing-card__image"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`closing CTA: refined destination-card styling is missing (${token})`);
  });
  if (css.includes(".tarot-history-action-symbol")) {
    errors.push("closing CTA: obsolete circular icon styling remains");
  }

  if (countMatches(/class="tarot-history-timeline-panel(?:\s|")/g) !== tarotHistory.timeline.milestones.length) {
    errors.push("timeline: panel count is incorrect");
  }
  if (countMatches(/class="tarot-history-timeline-panel__media-frame"/g) !== tarotHistory.timeline.milestones.length) {
    errors.push("timeline: inset archival image frame count is incorrect");
  }
  if (countMatches(/\sdata-history-timeline-tab(?:\s|>)/g) !== tarotHistory.timeline.milestones.length) {
    errors.push("timeline: semantic node count is incorrect");
  }
  if (html.includes("tarot-history-timeline-card") || html.includes("tarot-history-timeline__rail")) {
    errors.push("timeline: obsolete five-card layout remains");
  }
  if (!html.includes('class="tarot-history-timeline-tabs" role="tablist"')
    || countMatches(/\sdata-history-timeline-tab(?:\s|>)/g) !== tarotHistory.timeline.milestones.length
    || countMatches(/\sdata-history-timeline-panel(?:\s|>)/g) !== tarotHistory.timeline.milestones.length) {
    errors.push("timeline: accessible tab pattern is incomplete");
  }
  if (countMatches(/aria-hidden="false" data-history-timeline-panel/g) !== tarotHistory.timeline.milestones.length) {
    errors.push("timeline: no-JavaScript fallback must expose every milestone");
  }
  tarotHistory.timeline.milestones.forEach((item, index) => {
    const tabId = `history-timeline-tab-${item.id}`;
    const panelId = `history-timeline-panel-${item.id}`;
    if (!html.includes(`id="${tabId}"`) || !html.includes(`aria-controls="${panelId}"`)) {
      errors.push(`timeline: tab relationship is missing for milestone ${index + 1}`);
    }
    if (!html.includes(`id="${panelId}"`) || !html.includes(`aria-labelledby="${tabId}"`)) {
      errors.push(`timeline: panel relationship is missing for milestone ${index + 1}`);
    }
    [item.era, item.title, item.copy, item.whyItMatters, item.archiveDetail, item.relatedLink.label].forEach((copy) => {
      if (!html.includes(copy)) errors.push(`timeline: visible milestone copy is missing (${copy})`);
    });
    if (!html.includes(`href="${item.relatedLink.route}"`)) {
      errors.push(`timeline: related link is missing for milestone ${index + 1}`);
    }
  });
  if (countMatches(/<h4>Why This Era Matters<\/h4>/g) !== tarotHistory.timeline.milestones.length
    || countMatches(/<h4>From the Archive<\/h4>/g) !== tarotHistory.timeline.milestones.length
    || countMatches(/<h4>Related Link<\/h4>/g) !== tarotHistory.timeline.milestones.length) {
    errors.push("timeline: educational detail labels are incomplete");
  }
  if (!html.includes('aria-label="Previous Tarot era"')
    || !html.includes('aria-label="Next Tarot era"')
    || !html.includes('aria-current="step"')
    || !html.includes("data-history-timeline-status")) {
    errors.push("timeline: accessible navigation labels and live status are incomplete");
  }
  if (countMatches(/class="deck-tradition-slide tarot-history-tradition(?:\s|")/g) !== tarotHistory.traditions.items.length) {
    errors.push("traditions: item count is incorrect");
  }
  if (html.includes("tarot-history-paired--knowledge")) {
    errors.push("layout: sections 03 and 04 must not share the former paired row");
  }
  if (countMatches(/\sdata-history-tradition-tab(?:\s|>)/g) !== tarotHistory.traditions.items.length
    || countMatches(/\sdata-history-tradition-panel(?:\s|>)/g) !== tarotHistory.traditions.items.length
    || countMatches(/aria-hidden="false" data-history-tradition-panel/g) !== tarotHistory.traditions.items.length) {
    errors.push("traditions: accessible stage and no-JavaScript fallback are incomplete");
  }
  tarotHistory.traditions.items.forEach((item, index) => {
    const tabId = `history-tradition-tab-${item.id}`;
    const panelId = `history-tradition-panel-${item.id}`;
    if (!html.includes(`id="${tabId}"`) || !html.includes(`aria-controls="${panelId}"`)) {
      errors.push(`traditions: tab relationship is missing for item ${index + 1}`);
    }
    if (!html.includes(`aria-label="View ${item.title}"`)) {
      errors.push(`traditions: descriptive title-button label is missing for item ${index + 1}`);
    }
    if (!html.includes(`id="${panelId}"`) || !html.includes(`aria-labelledby="${tabId}"`)) {
      errors.push(`traditions: panel relationship is missing for item ${index + 1}`);
    }
    [item.era, item.title, item.copy, item.visualSignature, item.historicalInfluence, item.relatedLink.label, item.image.src].forEach((value) => {
      if (!html.includes(value)) errors.push(`traditions: expected data is missing for item ${index + 1}`);
    });
    if (!html.includes(`href="${item.relatedLink.route}"`)) {
      errors.push(`traditions: related link is missing for item ${index + 1}`);
    }
  });
  if (countMatches(/<h4>Visual Signature<\/h4>/g) !== tarotHistory.traditions.items.length
    || countMatches(/<h4>Historical Influence<\/h4>/g) !== tarotHistory.traditions.items.length) {
    errors.push("traditions: expanded editorial detail labels are incomplete");
  }
  if (!html.includes("deck-tradition-exhibit tarot-history-traditions__exhibit")
    || !html.includes("deck-tradition-viewport tarot-history-traditions__viewport")
    || !html.includes("data-history-tradition-status")
    || !html.includes('aria-current="true"')
    || !html.includes('aria-label="Previous deck tradition"')
    || !html.includes('aria-label="Next deck tradition"')) {
    errors.push("traditions: unified exhibit or accessible status markup is incomplete");
  }
  [
    "traditionTransitioning",
    'nextIndex > activeTraditionIndex ? "next" : "previous"',
    "is-entering-next",
    "is-entering-previous",
    "is-leaving-next",
    "is-leaving-previous",
    "transitionend",
    "measureTraditionViewport",
    "link.tabIndex",
    "reducedMotionQuery.matches"
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`traditions: vertical interaction contract is missing (${token})`);
  });
  [
    ".tarot-history-traditions__exhibit",
    "overflow: hidden",
    "--history-tradition-height: clamp(440px, 36vw, 490px)",
    "height: var(--history-tradition-height)",
    "transform: translateY(100%)",
    "transform: translateY(-100%)",
    "cubic-bezier(.76, 0, .24, 1)",
    "--tradition-mobile-height",
    "@media (min-width: 769px) and (max-width: 1050px)",
    "--history-tradition-height: 460px",
    "grid-template-columns: minmax(0, 42fr) minmax(380px, 58fr)",
    "font: clamp(.82rem, .91vw, .92rem)/1.54",
    "font: clamp(.72rem, .78vw, .8rem)/1.47",
    "--tradition-progress",
    "scroll-snap-type: x proximity"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`traditions: unified exhibit styling is missing (${token})`);
  });
  if (/tarot-history-traditions__exhibit[^{]*\{[^}]*\btransform\s*:/s.test(css)) {
    errors.push("traditions: the stationary outer exhibit must not be transformed");
  }
  if (!js.includes("ArrowLeft") || !js.includes("ArrowRight") || !js.includes("Home") || !js.includes("End")) {
    errors.push("accessibility: rail keyboard controls are incomplete");
  }
  [
    "activateTimeline",
    "syncTimelineFromSwipe",
    "decodeTimelineImage",
    "IntersectionObserver",
    "is-timeline-revealed",
    "aria-selected",
    "aria-current",
    "link.tabIndex",
    "data-history-timeline-previous",
    "data-history-timeline-next"
  ].forEach((token) => {
    if (!js.includes(token) && !html.includes(token)) errors.push(`timeline: interaction contract is missing (${token})`);
  });
  [
    ".tarot-history-timeline.is-timeline-enhanced",
    ".tarot-history-timeline-track__line",
    "overscroll-behavior-inline: contain",
    "scroll-snap-stop: always",
    ".tarot-history-timeline-panel__media-frame",
    ".tarot-history-timeline-panel__details",
    ".tarot-history-timeline-panel__detail--why",
    ".tarot-history-timeline-panel__detail--archive",
    ".tarot-history-timeline-panel__detail--link",
    "--history-timeline-height: clamp(430px, 42vw, 500px)",
    "height: var(--history-timeline-height)",
    "@media (min-width: 769px) and (max-width: 1100px)",
    "--history-timeline-height: clamp(440px, 50vw, 470px)",
    "grid-template-columns: minmax(0, 48fr) minmax(340px, 52fr)",
    "--history-panel-primary-text: rgba(242, 236, 221, .96)",
    "font-size: clamp(2.3rem, 3.2vw, 3.5rem)",
    "font: clamp(.84rem, .93vw, .95rem)/1.54",
    "font: clamp(.72rem, .78vw, .79rem)/1.46",
    "perspective: 1200px",
    "@media (hover: hover) and (pointer: fine)"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`timeline: responsive stage styling is missing (${token})`);
  });

  const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`accessibility: duplicate IDs found (${[...new Set(duplicateIds)].join(", ")})`);

  const images = Array.from(html.matchAll(/<img\b[^>]*>/g), (match) => match[0]);
  images.forEach((tag, index) => {
    if (!/\bsrc="[^"]+"/.test(tag)) errors.push(`images[${index}]: src is missing`);
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) errors.push(`images[${index}]: explicit dimensions are missing`);
    if (!/\balt="[^"]*"/.test(tag)) errors.push(`images[${index}]: alt attribute is missing`);
    if (/[?&](?:v|ver|cache|cb)=/.test(tag)) errors.push(`images[${index}]: cache-busting query string is not permitted`);
    if (/ChatGPT Image/.test(tag)) errors.push(`images[${index}]: non-descriptive export filename remains`);
  });

  if (!html.includes(tarotHistory.visualNote)) errors.push("images: global reconstruction disclosure is missing");
  const reconstructionCount = countMatches(/Historically inspired editorial reconstruction/g);
  if (reconstructionCount > 2) errors.push(`images: repeated reconstruction captions remain (${reconstructionCount})`);
  if (/tarot-history-contributor[\s\S]{0,300}<img/.test(html)) errors.push("contributors: generated portraits must not be rendered");

  if (!html.includes("tarot-history-paired--evolution")) errors.push("layout: sections 05 and 06 are not paired");
  if (!html.includes("history-deck-thoth-tradition.webp")) errors.push("sources: bookshelf image is missing");
  if (!html.includes("history-symbolic-correspondences.webp")) errors.push("traditions: esoteric study image is missing");
  if (!html.includes("history-tarot-practice.webp")) errors.push("today: landscape practice image is missing");
  if (!html.includes('role="dialog"') || !html.includes('aria-modal="true"')) errors.push("contributors: accessible detail dialog is missing");
  if (html.includes("tarot-history-symbol tarot-history-symbol--") || html.includes("tarot-history-contributors__grid")) {
    errors.push("contributors: legacy circular contributor emblems or card grid remains");
  }
  if (countMatches(/\sdata-history-contributor-index(?:\s|>)/g) !== tarotHistory.contributors.items.length
    || countMatches(/\sdata-history-contributor-panel(?:\s|>)/g) !== tarotHistory.contributors.items.length
    || countMatches(/aria-hidden="false" data-history-contributor-panel/g) !== tarotHistory.contributors.items.length) {
    errors.push("contributors: indexed archive and no-JavaScript fallback are incomplete");
  }
  tarotHistory.contributors.items.forEach((item, index) => {
    const tabId = `history-contributor-tab-${item.id}`;
    const panelId = `history-contributor-panel-${item.id}`;
    if (!html.includes(`id="${tabId}"`) || !html.includes(`aria-controls="${panelId}"`)) {
      errors.push(`contributors: index relationship is missing for item ${index + 1}`);
    }
    if (!html.includes(`id="${panelId}"`) || !html.includes(`aria-labelledby="${tabId}"`)) {
      errors.push(`contributors: panel relationship is missing for item ${index + 1}`);
    }
    [item.name, item.dates, item.role, item.copy].forEach((copy) => {
      if (!html.includes(copy)) errors.push(`contributors: visible contributor data is missing for item ${index + 1}`);
    });
  });
  if (countMatches(/data-history-contributor-open=/g) !== tarotHistory.contributors.items.length) {
    errors.push("contributors: detail trigger count is incorrect");
  }
  if (html.includes("tarot-history-contributor-panel__mark")) {
    errors.push("contributors: oversized symbolic card marks remain");
  }
  if (countMatches(/\sdata-history-contributor-view-tab(?:\s|>)/g) !== tarotHistory.contributors.items.length * 2
    || countMatches(/\sdata-history-contributor-view(?:\s|>)/g) !== tarotHistory.contributors.items.length * 2) {
    errors.push("contributors: each figure must provide overview and influence views");
  }
  tarotHistory.contributors.items.forEach((item, index) => {
    if (!html.includes(item.whyItMatters)) {
      errors.push(`contributors: internal influence view is missing for item ${index + 1}`);
    }
  });
  [
    "keydown",
    "Escape",
    "history-modal-open",
    "data-history-contributor-close",
    "data-history-contributor-view-tab",
    "data-history-contributor-view"
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`contributors: modal behavior is missing (${token})`);
  });
  [
    'const mobileContributorsQuery = window.matchMedia("(max-width: 768px)")',
    "setMobileContributorPanelState",
    "enableMobileContributorAccordion",
    "disableMobileContributorAccordion",
    'tab.setAttribute("aria-expanded", String(expanded))',
    "panel.hidden = !expanded",
    'panel.setAttribute("role", "region")',
    "tab.after(panel)",
    "contributorPanelsContainer.append(panel)"
  ].forEach((token) => {
    if (!js.includes(token)) errors.push(`contributors: mobile accordion behavior is missing (${token})`);
  });
  [
    ".tarot-history-contributors.is-contributors-mobile-accordion",
    '.tarot-history-contributors__index-item[aria-expanded="true"]',
    ".tarot-history-contributors__index-marker::after"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`contributors: mobile accordion styling is missing (${token})`);
  });

  const externalLinks = [
    ...tarotHistory.origins.sources,
    ...tarotHistory.resources.items
  ];
  externalLinks.forEach((item) => {
    if (!html.includes(`href="${item.url}" target="_blank" rel="noopener noreferrer"`)) {
      errors.push(`external link: missing secure semantic anchor for ${item.url}`);
    }
  });

  const routeTargets = [
    ["/", "index.html"],
    ["/tarot", "tarot.html"],
    ["/journal", "journal.html"],
    ["/tarot/the-fool/", "tarot/the-fool/index.html"],
    ["/tarot/the-magician/", "tarot/the-magician/index.html"],
    ["/tarot/the-star/", "tarot/the-star/index.html"],
    ["/tarot/compare/tarot-vs-oracle-cards/", "tarot/compare/tarot-vs-oracle-cards/index.html"],
    ["/tarot/compare/tarot-vs-lenormand/", "tarot/compare/tarot-vs-lenormand/index.html"]
  ];
  routeTargets.forEach(([href, file]) => {
    if (!existsSync(resolve(rootDir, file))) errors.push(`internal route: expected target file for ${href}`);
  });
  const timelineLinkTargets = [
    ["/tarot/history/#origins", "tarot/history/index.html", "origins"],
    ["/tarot/history/#occult-revival", "tarot/history/index.html", "occult-revival"],
    ["/tarot#tarot-arcana-groups-title", "tarot.html", "tarot-arcana-groups-title"],
    ["/tarot/history/#modern-illustrated-tarot", "tarot/history/index.html", "modern-illustrated-tarot"],
    ["/tarot#tarot-title", "tarot.html", "tarot-title"]
  ];
  timelineLinkTargets.forEach(([href, file, id]) => {
    const targetPath = resolve(rootDir, file);
    if (!existsSync(targetPath)) {
      errors.push(`timeline link: expected target file for ${href}`);
      return;
    }
    const targetHtml = readFileSync(targetPath, "utf8");
    if (!targetHtml.includes(`id="${id}"`)) errors.push(`timeline link: missing target #${id} for ${href}`);
  });

  const sitemapCount = sitemap.split(canonical).length - 1;
  if (sitemapCount !== 1) errors.push(`sitemap: expected one History route, found ${sitemapCount}`);

  const historyTile = hubScript.match(/\{ key: "history"[^]*?\},/);
  if (!historyTile) {
    errors.push("hub tile: History record is missing");
  } else {
    if (!historyTile[0].includes('route: "/tarot/history/"')) errors.push("hub tile: clean History route is incorrect");
    if (!historyTile[0].includes("available: true")) errors.push("hub tile: History remains unavailable");
    if (!historyTile[0].includes('ctaLabel: "Explore Tarot History"')) errors.push("hub tile: CTA label is incorrect");
    if (historyTile[0].includes("Coming Soon")) errors.push("hub tile: Coming Soon remains");
  }

  [
    "body.sun-mode.tarot-history-page",
    "body.moon-mode.tarot-history-page",
    "body.blood-moon-mode.tarot-history-page",
    "grid-template-columns: repeat(12, minmax(0, 1fr))",
    ".tarot-history-paired--evolution",
    ".tarot-history-paired--lower",
    "@media (max-width: 1199px)",
    "@media (max-width: 1100px)",
    "@media (max-width: 900px)",
    "@media (max-width: 768px)",
    "@media (max-width: 520px)",
    "@media (max-width: 390px)",
    "@media (prefers-reduced-motion: reduce)",
    ".tarot-history-traditions.is-traditions-enhanced",
    ".tarot-history-contributors.is-contributors-enhanced",
    ".tarot-history-contributor-panel__name",
    ".tarot-history-contributor-panel__view-tabs",
    ".tarot-history-tradition__media-frame"
  ].forEach((token) => {
    if (!css.includes(token)) errors.push(`styles: required token is missing (${token})`);
  });
}

if (errors.length) {
  console.error(`Tarot History validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log("Tarot History validation passed.");
