import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotTopics } from "../data/tarot-topics.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const errors = [];

const pageRecords = [
  { label: "Tarot History", path: "tarot/history/index.html", layout: "stacked" },
  { label: "Major Arcana", path: "tarot/major-arcana/index.html", layout: "stacked" },
  { label: "Minor Arcana", path: "tarot/minor-arcana/index.html", layout: "stacked" },
  { label: "Tarot for Beginners", path: "tarot/for-beginners/index.html", layout: "stacked" },
  { label: "How to Read Tarot", path: "how-to-read-tarot-cards/index.html", layout: "stacked" },
  { label: "Tarot Spreads", path: "tarot-spreads/index.html", layout: "stacked" },
  { label: "Tarot vs. Oracle", path: "tarot/compare/tarot-vs-oracle-cards/index.html", layout: "stacked" },
  { label: "Tarot vs. Lenormand", path: "tarot/compare/tarot-vs-lenormand/index.html", layout: "stacked" },
  ...tarotTopics.map((topic) => ({
    label: topic.title,
    path: `tarot/topics/${topic.slug}/index.html`,
    layout: "stacked",
    topic
  }))
];

function read(relativePath) {
  return readFileSync(resolve(rootDir, relativePath), "utf8");
}

function decodeHtml(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .trim();
}

function parseAttributes(source) {
  const attributes = {};
  for (const match of source.matchAll(/([^\s=]+)(?:="([^"]*)")?/g)) {
    attributes[match[1]] = match[2] ?? "";
  }
  return attributes;
}

function parseFaqSchema(html, label) {
  const schemas = [];
  for (const match of html.matchAll(/<script(?:\s+id="[^"]+")?\s+type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1]);
      if (schema?.["@type"] === "FAQPage") schemas.push(schema);
    } catch (error) {
      errors.push(`${label}: invalid JSON-LD encountered while locating FAQPage`);
    }
  }
  if (schemas.length !== 1) {
    errors.push(`${label}: expected exactly one FAQPage schema, found ${schemas.length}`);
  }
  return schemas[0] || null;
}

function validateFaqPage(record) {
  const html = read(record.path);
  const sectionMatches = [...html.matchAll(/<section class="([^"]*\btarot-education-faq\b[^"]*)"[^>]*data-education-faq[^>]*>([\s\S]*?)<\/section>/g)];
  if (sectionMatches.length !== 1) {
    errors.push(`${record.label}: expected one shared Tarot FAQ section, found ${sectionMatches.length}`);
    return;
  }

  const [sectionMatch] = sectionMatches;
  const classNames = sectionMatch[1].split(/\s+/);
  const sectionHtml = sectionMatch[2];
  if (!classNames.includes(`tarot-faq--${record.layout}`)) {
    errors.push(`${record.label}: missing ${record.layout} FAQ layout modifier`);
  }
  if (record.layout === "stacked" && classNames.includes("tarot-faq--split")) {
    errors.push(`${record.label}: stacked FAQ also carries the split modifier`);
  }

  const schema = parseFaqSchema(html, record.label);
  const schemaItems = schema?.mainEntity || [];
  const itemMatches = [...sectionHtml.matchAll(/<article class="tarot-faq__item" data-education-faq-item>([\s\S]*?)<\/article>/g)];
  if (itemMatches.length !== schemaItems.length || itemMatches.length === 0) {
    errors.push(`${record.label}: visible FAQ count ${itemMatches.length} does not match schema count ${schemaItems.length}`);
  }

  const localIds = new Set();
  itemMatches.forEach((itemMatch, index) => {
    const itemHtml = itemMatch[1];
    const buttonMatch = itemHtml.match(/<button\b([^>]*)>([\s\S]*?)<\/button>/);
    const answerMatch = itemHtml.match(/<div class="tarot-faq__answer"([^>]*)>([\s\S]*?)<\/div>\s*<\/div>/);
    if (!buttonMatch || !answerMatch) {
      errors.push(`${record.label}: FAQ row ${index + 1} is missing its button or source-rendered answer`);
      return;
    }

    const buttonAttributes = parseAttributes(buttonMatch[1]);
    const answerAttributes = parseAttributes(answerMatch[1]);
    const questionMatch = buttonMatch[2].match(/<span>([\s\S]*?)<\/span>\s*<span class="tarot-faq__icon" aria-hidden="true">[−+]<\/span>/);
    const answerTextMatch = answerMatch[2].match(/<div class="tarot-faq__answer-inner"><p>([\s\S]*?)<\/p>/);
    const question = questionMatch ? decodeHtml(questionMatch[1]) : "";
    const answer = answerTextMatch ? decodeHtml(answerTextMatch[1]) : "";
    const questionId = buttonAttributes.id;
    const answerId = answerAttributes.id;

    if (buttonAttributes.type !== "button"
      || buttonAttributes["aria-expanded"] !== "true"
      || !Object.hasOwn(buttonAttributes, "data-education-faq-button")) {
      errors.push(`${record.label}: FAQ row ${index + 1} does not use the shared semantic button contract`);
    }
    if (!questionId || !answerId || localIds.has(questionId) || localIds.has(answerId)) {
      errors.push(`${record.label}: FAQ row ${index + 1} has missing or duplicate stable IDs`);
    }
    localIds.add(questionId);
    localIds.add(answerId);
    if (buttonAttributes["aria-controls"] !== answerId
      || answerAttributes.role !== "region"
      || answerAttributes["aria-labelledby"] !== questionId
      || answerAttributes["aria-hidden"] !== "false") {
      errors.push(`${record.label}: FAQ row ${index + 1} has a broken ARIA button/region relationship`);
    }
    if (!question || !answer) {
      errors.push(`${record.label}: FAQ row ${index + 1} is missing initial HTML question or answer copy`);
    }

    const schemaItem = schemaItems[index];
    if (schemaItem?.name !== question || schemaItem?.acceptedAnswer?.text !== answer) {
      errors.push(`${record.label}: FAQ row ${index + 1} visible copy and FAQPage schema are out of sync`);
    }
  });

  if (/data-(?:topic|major)-faq/.test(sectionHtml)) {
    errors.push(`${record.label}: legacy page-specific FAQ attributes remain`);
  }
  if (!html.includes('<script src="/js/tarot-education.js"></script>')) {
    errors.push(`${record.label}: shared FAQ controller is not loaded`);
  }

  if (record.topic) {
    const promptMatches = [...html.matchAll(/<article class="tarot-topic-question">([\s\S]*?)<\/article>/g)];
    if (promptMatches.length !== record.topic.suggestedQuestions.length) {
      errors.push(`${record.label}: reading prompt grid count changed during FAQ migration`);
    }
    record.topic.suggestedQuestions.forEach((question, index) => {
      const promptHtml = promptMatches[index]?.[1] || "";
      if (!promptHtml.includes(`<p>${question.replace(/&/g, "&amp;")}</p>`)
        || /tarot-faq|aria-expanded|data-education-faq/.test(promptHtml)) {
        errors.push(`${record.label}: prompt ${index + 1} was changed or converted into an accordion`);
      }
    });
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractRule(source, selector) {
  const match = new RegExp(`${escapeRegExp(selector)}\\s*\\{`, "g").exec(source);
  if (!match) return "";
  const openingBrace = source.indexOf("{", match.index);
  let depth = 1;
  let cursor = openingBrace + 1;
  while (cursor < source.length && depth > 0) {
    if (source[cursor] === "{") depth += 1;
    else if (source[cursor] === "}") depth -= 1;
    cursor += 1;
  }
  return source.slice(openingBrace + 1, cursor - 1);
}

function validateThemeArchitecture() {
  const tarotCss = read("css/tarot.css");
  const educationCss = read("css/tarot-education-components.css");
  const majorCss = read("css/tarot-major-arcana.css");
  const historyCss = read("css/tarot-history.css");
  const howToCss = read("css/how-to-read-tarot.css");
  const spreadsCss = read("css/tarot-spreads.css");
  const topicCss = read("css/tarot-topic.css");
  const educationJs = read("js/tarot-education.js");
  const topicJs = read("js/tarot-topic.js");
  const majorJs = read("js/tarot-major-arcana.js");

  const faqTokens = [
    "--tarot-faq-atmosphere",
    "--tarot-faq-card-bg",
    "--tarot-faq-card-hover-bg",
    "--tarot-faq-card-open-bg",
    "--tarot-faq-card-border",
    "--tarot-faq-card-border-hover",
    "--tarot-faq-card-shadow",
    "--tarot-faq-card-hover-shadow",
    "--tarot-faq-card-open-shadow",
    "--tarot-faq-heading",
    "--tarot-faq-question",
    "--tarot-faq-answer",
    "--tarot-faq-accent",
    "--tarot-faq-icon-bg",
    "--tarot-faq-icon-border",
    "--tarot-faq-icon-color",
    "--tarot-faq-icon-open-bg",
    "--tarot-faq-focus",
    "--tarot-faq-haze",
    "--tarot-faq-rule-color",
    "--tarot-faq-rule-glow"
  ];
  const semanticTokens = [
    "--tarot-education-surface-primary",
    "--tarot-education-surface-secondary",
    "--tarot-education-surface-subtle",
    "--tarot-education-surface-hover",
    "--tarot-education-surface-open",
    "--tarot-education-border",
    "--tarot-education-border-strong",
    "--tarot-education-divider",
    "--tarot-education-accent",
    "--tarot-education-accent-soft",
    "--tarot-education-glow",
    "--tarot-education-shadow",
    "--tarot-education-text-primary",
    "--tarot-education-text-secondary",
    "--tarot-education-text-muted",
    "--tarot-question-surface",
    "--tarot-question-surface-hover",
    "--tarot-question-surface-open",
    "--tarot-question-border",
    "--tarot-question-border-hover",
    "--tarot-question-text",
    "--tarot-question-answer",
    "--tarot-question-icon",
    "--tarot-question-focus",
    ...faqTokens
  ];

  [
    ".tarot-meanings-page.sun-mode",
    ".tarot-meanings-page.moon-mode",
    ".tarot-meanings-page.blood-moon-mode"
  ].forEach((selector) => {
    const rule = extractRule(tarotCss, selector);
    if (!rule) errors.push(`theme tokens: missing ${selector}`);
    semanticTokens.forEach((token) => {
      if (!rule.includes(`${token}:`)) errors.push(`theme tokens: ${selector} is missing ${token}`);
    });
  });

  const blueMoonRule = extractRule(tarotCss, "body.blue-moon-mode.tarot-meanings-page");
  if (!blueMoonRule) errors.push("theme tokens: missing Blue Moon FAQ selector");
  faqTokens.forEach((token) => {
    if (!blueMoonRule.includes(`${token}:`)) errors.push(`theme tokens: Blue Moon is missing ${token}`);
  });

  [
    "border: 1px solid transparent",
    "border-radius: 22px",
    "background: transparent",
    "box-shadow: none",
    "backdrop-filter: none",
    ".tarot-faq__item::after",
    "var(--tarot-faq-rule-color)",
    "var(--tarot-faq-rule-glow)",
    "background: var(--tarot-faq-icon-bg)",
    ".tarot-faq--stacked .tarot-faq__inner",
    "width: min(calc(100% - 48px),960px)",
    "max-width: 960px",
    "width: min(calc(100% - 64px),960px)",
    "width: min(calc(100% - 36px),960px)",
    "@media (prefers-reduced-motion: reduce)"
  ].forEach((token) => {
    if (!tarotCss.includes(token)) errors.push(`shared FAQ styles: missing ${token}`);
  });
  [
    "grid-template-columns: minmax(0, 1fr)",
    "width: min(calc(100% - 48px), 960px)",
    "max-width: 960px",
    "width: min(calc(100vw - 64px), 960px)",
    "width: min(calc(100vw - 36px), 960px)",
    "width: min(100%, 800px)",
    "max-width: 680px",
    "text-align: left",
    "all paint comes from the theme tokens"
  ].forEach((token) => {
    if (!educationCss.includes(token)) errors.push(`shared FAQ layout: missing ${token}`);
  });
  [
    "width: min(calc(100% - 56px), 1180px)",
    "body.how-to-read-page .htr-faq.tarot-faq .tarot-faq__inner",
    "body.how-to-read-page .htr-faq.tarot-faq .tarot-faq__header",
    "body.tarot-topic-page .tarot-topic-faq.tarot-faq .tarot-faq__inner"
  ].forEach((token) => {
    if (educationCss.includes(token)) errors.push(`shared FAQ layout: obsolete width or alignment exception remains (${token})`);
  });
  [
    "border-top: 1px solid var(--tarot-question-border)",
    "border-bottom: 1px solid var(--tarot-question-border)",
    "grid-template-columns: minmax(15rem, 32fr) minmax(0, 68fr)"
  ].forEach((token) => {
    if (educationCss.includes(token)) errors.push(`shared FAQ layout: obsolete line/split treatment remains (${token})`);
  });

  const majorMoonRule = extractRule(majorCss, "body.moon-mode.tarot-major-arcana-page .major-arcana-page");
  [
    "--major-surface: var(--tarot-education-surface-secondary)",
    "--major-surface-strong: var(--tarot-education-surface-primary)",
    "--major-line: var(--tarot-education-divider)",
    "--major-shadow: var(--tarot-education-shadow)"
  ].forEach((token) => {
    if (!majorMoonRule.includes(token)) errors.push(`Major/Minor/Spreads Moon palette: missing ${token}`);
  });
  ["rgba(9, 34, 40, .7)", "rgba(3, 20, 27, .95)"].forEach((token) => {
    if (majorMoonRule.includes(token)) errors.push(`Major/Minor/Spreads Moon palette: teal leak remains (${token})`);
  });

  const careerMoonRule = extractRule(topicCss, "body.moon-mode.tarot-topic-page .tarot-topic--career-purpose");
  const adviceMoonRule = extractRule(topicCss, "body.moon-mode.tarot-topic-page .tarot-topic--advice-personal-growth");
  [careerMoonRule, adviceMoonRule].forEach((rule, index) => {
    const label = index === 0 ? "Career" : "Advice";
    [
      "--topic-panel: var(--tarot-education-surface-subtle)",
      "--topic-panel-strong: var(--tarot-education-surface-primary)",
      "--topic-line: var(--tarot-education-divider)",
      "--topic-shadow: var(--tarot-education-shadow)"
    ].forEach((token) => {
      if (!rule.includes(token)) errors.push(`${label} Moon palette: missing ${token}`);
    });
  });
  ["rgba(109, 151, 143, .24)", "rgba(4, 23, 27, .63)"].forEach((token) => {
    if (adviceMoonRule.includes(token)) errors.push(`Advice Moon palette: teal leak remains (${token})`);
  });

  if (!howToCss.includes("--htr-bg: #060511") || !howToCss.includes("background: var(--htr-bg)")) {
    errors.push("How to Read Tarot: Moon-safe page background token is incomplete");
  }
  if (!historyCss.includes("background: var(--history-closing-overlay-compact)")
    || !historyCss.includes("--history-closing-overlay-compact:")) {
    errors.push("Tarot History: responsive closing blend is not theme-tokenized");
  }
  if (/body\.tarot-spreads-page #tarot-spreads-hero \.tarot-spreads-hero__overlay,\s*body\.moon-mode/.test(spreadsCss)
    || !spreadsCss.includes("body.moon-mode.tarot-spreads-page #tarot-spreads-hero .tarot-spreads-hero__overlay")) {
    errors.push("Tarot Spreads: mobile Moon hero still shares the Sun overlay");
  }

  const faqController = educationJs.slice(0, educationJs.indexOf("const educationHero"));
  [
    "setItemState",
    'button.setAttribute("aria-expanded", String(isOpen))',
    'answer.setAttribute("aria-hidden", String(!isOpen))',
    "answer.inert = !isOpen",
    'icon.textContent = isOpen ? "−" : "+"',
    "openDirectHashTarget"
  ].forEach((token) => {
    if (!faqController.includes(token)) errors.push(`shared FAQ controller: missing ${token}`);
  });
  if (/scrollIntoView|scrollTo\s*\(/.test(faqController)) {
    errors.push("shared FAQ controller: mount-time FAQ scrolling was introduced");
  }
  if (/data-topic-faq|setFaqState/.test(topicJs) || /data-major-faq|setFaqState/.test(majorJs)) {
    errors.push("shared FAQ controller: legacy topic or Major controller remains");
  }
}

function validateRelatedTarotFaqSurfaces() {
  const tarotHub = read("tarot.html");
  if (!tarotHub.includes('<section class="tarot-faq tarot-faq--stacked"')) {
    errors.push("Tarot hub: FAQ does not use the shared stacked layout");
  }

  const cardTemplate = read("templates/tarot-card-detail.html");
  const cardGenerator = read("scripts/generate-card-pages.mjs");
  const cardCss = read("css/tarot-card.css");
  const cardFaqCss = cardCss.slice(cardCss.indexOf(".tarot-card-faq {"), cardCss.indexOf(".tarot-card-reflection {"));
  const cardJs = read("js/tarot-card-page.js");
  const generatedCard = read("tarot/the-fool/index.html");
  [
    '<p class="tarot-card-section-heading__eyebrow">Learning the Card</p>',
    '<div class="tarot-card-faq__list" data-card-faq>'
  ].forEach((token) => {
    if (!cardTemplate.includes(token)) errors.push(`Tarot card FAQ template: missing ${token}`);
  });
  [
    "border: 1px solid transparent",
    "background: transparent",
    "box-shadow: none",
    "backdrop-filter: none",
    "border-radius: 22px",
    "gap: clamp(12px, 1.25vw, 18px)",
    ".tarot-card-faq__item::after",
    "var(--tarot-faq-rule-color)",
    "var(--tarot-faq-rule-glow)"
  ].forEach((token) => {
    if (!cardFaqCss.includes(token)) errors.push(`Tarot card FAQ styles: missing ${token}`);
  });
  ["border-top: 1px solid var(--tarot-card-edge)", "border-bottom: 1px solid var(--tarot-card-edge)"].forEach((token) => {
    if (cardFaqCss.includes(token)) errors.push(`Tarot card FAQ styles: obsolete divider treatment remains (${token})`);
  });
  if (!cardGenerator.includes('aria-hidden="true" hidden')) {
    errors.push("Tarot card FAQ generator: collapsed answers do not expose their hidden state");
  }
  [
    'panel.setAttribute("aria-hidden", String(!expand))',
    'classList.toggle("is-open", expand)'
  ].forEach((token) => {
    if (!cardJs.includes(token)) errors.push(`Tarot card FAQ controller: missing ${token}`);
  });
  if (!generatedCard.includes('class="tarot-card-faq__answer"') || !generatedCard.includes('aria-hidden="true" hidden')) {
    errors.push("Tarot card FAQ output: generated accessible card markup is stale");
  }

  const seoFaqPages = [
    "daily-tarot-reading.html",
    "free-daily-tarot-reading.html",
    "free-tarot-reading.html",
    "one-card-tarot-reading.html",
    "online-tarot-reading.html"
  ];
  seoFaqPages.forEach((path) => {
    const html = read(path);
    if (!html.includes('<p class="seo-landing-kicker">Tarot Questions</p>')
      || !html.includes('<div class="seo-landing-faq">')
      || !html.includes("<details>")) {
      errors.push(`${path}: Tarot landing FAQ is missing its stacked header/card contract`);
    }
  });
  const globalCss = read("css/style.css");
  const seoFaqRules = [...globalCss.matchAll(/\.seo-landing-faq\s*\{([^}]*)\}/g)]
    .map((match) => match[1])
    .join("\n");
  if (!seoFaqRules.includes("grid-template-columns: minmax(0, 1fr)")
    || !seoFaqRules.includes("width: min(100%, 980px)")) {
    errors.push("Tarot landing FAQ styles: FAQ grid is not a centered single column");
  }
  const landingTransparencyStart = globalCss.indexOf("/* Tarot landing FAQs keep their accordion structure without a visible card shell. */");
  const landingTransparencyRule = landingTransparencyStart >= 0
    ? globalCss.slice(landingTransparencyStart, landingTransparencyStart + 1200)
    : "";
  ["border-color: transparent", "background: transparent", "box-shadow: none", "backdrop-filter: none", "details::after", "var(--theme-accent-primary)", "var(--theme-glow-primary)"].forEach((token) => {
    if (!landingTransparencyRule.includes(token)) errors.push(`Tarot landing FAQ styles: transparent shell is missing ${token}`);
  });
}

pageRecords.forEach(validateFaqPage);
validateThemeArchitecture();
validateRelatedTarotFaqSurfaces();

if (errors.length) {
  console.error(`Tarot education theme/FAQ validation failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Tarot education theme/FAQ validation passed for ${pageRecords.length} scoped pages.`);
}
