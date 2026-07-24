import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotTopics } from "../data/tarot-topics.mjs";
import { escapeHtml } from "./card-page-helpers.mjs";
import { getTopicOutputPath, getTopicRoute, resolveTopicCard, validateTopicData } from "./topic-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const errors = validateTopicData(tarotTopics, { rootDir, checkGenerated: true });
const sitemap = readFileSync(resolve(rootDir, "sitemap.xml"), "utf8");
const tarotScript = readFileSync(resolve(rootDir, "js/tarot.js"), "utf8");

tarotTopics.forEach((topic) => {
  const route = getTopicRoute(topic);
  const sitemapCount = sitemap.split(`https://astralveil.world${route}`).length - 1;
  if (sitemapCount !== 1) errors.push(`${topic.id}.sitemap: expected one entry, found ${sitemapCount}`);
  if (!tarotScript.includes(`route: "${route}"`) || !tarotScript.includes(`key: "${topic.id.split("-")[0]}"`)) {
    errors.push(`${topic.id}.tile: Tarot page topic configuration is missing`);
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
