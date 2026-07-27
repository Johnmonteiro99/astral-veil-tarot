import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotTopicNavigation } from "../data/tarot-topic-navigation.mjs";
import { tarotTopics } from "../data/tarot-topics.mjs";
import { escapeHtml } from "./card-page-helpers.mjs";
import { getTopicOutputPath, getTopicRoute, resolveTopicCard, validateTopicData } from "./topic-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const errors = validateTopicData(tarotTopics, { rootDir, checkGenerated: true });
const sitemap = readFileSync(resolve(rootDir, "sitemap.xml"), "utf8");
const tarotScript = readFileSync(resolve(rootDir, "js/tarot.js"), "utf8");
const tarotHub = readFileSync(resolve(rootDir, "tarot.html"), "utf8");

tarotTopics.forEach((topic) => {
  const route = getTopicRoute(topic);
  const sitemapCount = sitemap.split(`https://astralveil.world${route}`).length - 1;
  if (sitemapCount !== 1) errors.push(`${topic.id}.sitemap: expected one entry, found ${sitemapCount}`);
  if (!tarotScript.includes(`route: "${route}"`) || !tarotScript.includes(`key: "${topic.id.split("-")[0]}"`)) {
    errors.push(`${topic.id}.tile: Tarot page topic configuration is missing`);
  }
  const hubKey = topic.id.split("-")[0];
  const hubMarker = `<article class="tarot-question-card" data-tarot-question-path="${hubKey}" data-route="${route}" data-available="true">`;
  const hubItemStart = tarotHub.indexOf(hubMarker);
  const hubItemEnd = hubItemStart >= 0 ? tarotHub.indexOf("</article>", hubItemStart) : -1;
  const hubItem = hubItemStart >= 0 && hubItemEnd >= 0
    ? tarotHub.slice(hubItemStart, hubItemEnd + "</article>".length)
    : "";
  if (!hubItem || !hubItem.includes(`href="${route}"`)) {
    errors.push(`${topic.id}.tile: Tarot hub tile must be an enabled canonical link`);
  }
  if (hubItem.includes("Coming Soon")) {
    errors.push(`${topic.id}.tile: completed Tarot hub tile must not be labeled Coming Soon`);
  }

  const html = readFileSync(getTopicOutputPath(rootDir, topic), "utf8");
  const canonicalCount = html.split(`<link rel="canonical" href="https://astralveil.world${route}"`).length - 1;
  if (canonicalCount !== 1) errors.push(`${topic.id}.canonical: expected one canonical, found ${canonicalCount}`);
  if (html.includes("tarot-topic-breadcrumbs")) {
    errors.push(`${topic.id}.breadcrumbs: visible in-page breadcrumb navigation must not be rendered`);
  }
  if (html.includes("tarot-topic-showcase") || html.includes("data-topic-card-track")) {
    errors.push(`${topic.id}.chapters: legacy checklist/carousel markup must not be rendered`);
  }
  const completedTopicIds = new Set(tarotTopics.map((completedTopic) => completedTopic.id));
  const ribbonCount = html.split('<nav class="tarot-topic-ribbon" aria-label="Tarot topics">').length - 1;
  const currentTopicCount = html.split('aria-current="page"').length - 1;
  if (ribbonCount !== 1) {
    errors.push(`${topic.id}.topicNavigation: expected one shared ribbon, found ${ribbonCount}`);
  }
  if (currentTopicCount !== 1) {
    errors.push(`${topic.id}.topicNavigation: expected one aria-current value, found ${currentTopicCount}`);
  }
  tarotTopicNavigation.forEach((item) => {
    const marker = `data-topic-ribbon-item="${item.topicId}"`;
    if ((html.split(marker).length - 1) !== 1) {
      errors.push(`${topic.id}.topicNavigation.${item.topicId}: expected one navigation item`);
    }

    const itemStart = html.lastIndexOf("<", html.indexOf(marker));
    const itemEnd = html.indexOf(">", html.indexOf(marker));
    const itemOpeningTag = itemStart >= 0 && itemEnd >= 0 ? html.slice(itemStart, itemEnd + 1) : "";
    if (completedTopicIds.has(item.topicId)) {
      const completedTopic = tarotTopics.find((candidate) => candidate.id === item.topicId);
      if (!itemOpeningTag.startsWith("<a ") || !itemOpeningTag.includes(`href="${getTopicRoute(completedTopic)}"`)) {
        errors.push(`${topic.id}.topicNavigation.${item.topicId}: completed topic must be a real link`);
      }
      if (item.topicId === topic.id && !itemOpeningTag.includes('aria-current="page"')) {
        errors.push(`${topic.id}.topicNavigation.${item.topicId}: current topic must expose aria-current`);
      }
      if (item.topicId !== topic.id && itemOpeningTag.includes('aria-current="page"')) {
        errors.push(`${topic.id}.topicNavigation.${item.topicId}: non-current topic must not expose aria-current`);
      }
    } else if (!itemOpeningTag.startsWith("<span ")
      || !itemOpeningTag.includes('aria-disabled="true"')
      || itemOpeningTag.includes("href=")) {
      errors.push(`${topic.id}.topicNavigation.${item.topicId}: unfinished topic must be route-less and disabled`);
    }
  });
  if (topic.signalSection) {
    if (!html.includes(`<section class="tarot-topic-signals tarot-topic-section"`)
      || !html.includes(`<h2 id="${topic.sectionKey}-signals-heading">${escapeHtml(topic.signalSection.heading)}</h2>`)
      || !html.includes(`<p class="tarot-topic-signals__closing">${escapeHtml(topic.signalSection.closing)}</p>`)) {
      errors.push(`${topic.id}.signalSection: generated educational section is missing or incomplete`);
    }
    topic.signalSection.items.forEach((item) => {
      if (!html.includes(`<article class="tarot-topic-signal tarot-topic-signal--${item.id}">`)
        || !html.includes(`<h3>${escapeHtml(item.title)}</h3>`)) {
        errors.push(`${topic.id}.signalSection.${item.id}: generated signal is missing`);
      }
    });
  } else if (html.includes("tarot-topic-signals")) {
    errors.push(`${topic.id}.signalSection: topic-specific educational section rendered unexpectedly`);
  }
  if (topic.processSection) {
    if (!html.includes(`<section class="tarot-topic-process tarot-topic-section"`)
      || !html.includes(`<h2 id="${topic.sectionKey}-process-heading">${escapeHtml(topic.processSection.heading)}</h2>`)
      || !html.includes(`<p class="tarot-topic-process__closing">${escapeHtml(topic.processSection.closing)}</p>`)) {
      errors.push(`${topic.id}.processSection: generated growth process is missing or incomplete`);
    }
    topic.processSection.items.forEach((item) => {
      if (!html.includes(`<li class="tarot-topic-process__step tarot-topic-process__step--${item.id}">`)
        || !html.includes(`<h3>${escapeHtml(item.title)}</h3>`)
        || !html.includes(`<p class="tarot-topic-process__prompt">${escapeHtml(item.prompt)}</p>`)) {
        errors.push(`${topic.id}.processSection.${item.id}: generated stage is missing`);
      }
    });
  } else if (html.includes("tarot-topic-process")) {
    errors.push(`${topic.id}.processSection: topic-specific growth process rendered unexpectedly`);
  }

  const generatedChapterCount = html.split(`<article class="tarot-topic-chapter `).length - 1;
  if (generatedChapterCount !== topic.chapters.length) {
    errors.push(`${topic.id}.chapters: expected ${topic.chapters.length} generated chapters, found ${generatedChapterCount}`);
  }
  topic.chapters.forEach((chapter, index) => {
    const card = resolveTopicCard(chapter.featuredCardSlug);
    if (!html.includes(`<h3>${escapeHtml(chapter.title)}</h3>`)
      || !html.includes(`<p class="tarot-topic-chapter__subtitle">${escapeHtml(chapter.subtitle)}</p>`)
      || !html.includes(`<a class="tarot-topic-text-link" href="${card?.route || ""}">${escapeHtml(chapter.linkLabel)}`)) {
      errors.push(`${topic.id}.chapters[${index}]: generated content or resolved card route is missing`);
    }
  });

  const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), (match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) errors.push(`${topic.id}.ids: duplicate IDs ${[...new Set(duplicateIds)].join(", ")}`);

  const faqSchemaMatch = html.match(/<script id="tarot-topic-faq-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!faqSchemaMatch) {
    errors.push(`${topic.id}.faqSchema: missing FAQPage JSON-LD`);
  } else {
    const faqSchema = JSON.parse(faqSchemaMatch[1]);
    topic.faq.forEach(({ question, answer }, index) => {
      const schemaEntry = faqSchema.mainEntity?.[index];
      if (schemaEntry?.name !== question || schemaEntry?.acceptedAnswer?.text !== answer) {
        errors.push(`${topic.id}.faqSchema[${index}]: schema content does not match the topic record`);
      }
      if (!html.includes(`>${escapeHtml(question)}<`) || !html.includes(`<p>${escapeHtml(answer)}</p>`)) {
        errors.push(`${topic.id}.faq[${index}]: visible FAQ content does not match the topic record`);
      }
    });
  }
});

const generatedTopicSlugs = readdirSync(resolve(rootDir, "tarot/topics"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const expectedTopicSlugs = tarotTopics.map((topic) => topic.slug).sort();
if (JSON.stringify(generatedTopicSlugs) !== JSON.stringify(expectedTopicSlugs)) {
  errors.push(`topics: generated directories do not match the completed topic records`);
}

if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Tarot topic validation passed for ${tarotTopics.length} generated page.`);
}
