import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { tarotCardDetails } from "../data/card-details/tarot.mjs";
import { getCardRoute } from "./card-page-helpers.mjs";

const topicSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const cardBySlug = new Map(tarotCardDetails.map((card) => [card.slug, card]));

export function getTopicRoute(topic) {
  return topicSlugPattern.test(String(topic?.slug || ""))
    ? `/tarot/topics/${topic.slug}/`
    : "";
}

export function getTopicOutputPath(rootDir, topic) {
  const route = getTopicRoute(topic);
  return route ? resolve(rootDir, route.replace(/^\/+|\/+$/g, ""), "index.html") : "";
}

export function resolveTopicCard(slug) {
  const card = cardBySlug.get(slug);
  if (!card) return null;

  return {
    slug: card.slug,
    title: card.title,
    route: getCardRoute(card),
    standardImage: card.variants.veilrise.image,
    standardImageAlt: card.variants.veilrise.imageAlt,
    bloodMoonImage: card.variants.veilfall?.image || card.variants.veilrise.image,
    bloodMoonImageAlt: card.variants.veilfall?.imageAlt || card.variants.veilrise.imageAlt
  };
}

export function resolveTopicCards(topic) {
  return (topic.featuredCards || []).map((featured) => {
    const card = resolveTopicCard(featured.slug);
    return card ? { ...card, summary: featured.summary } : null;
  }).filter(Boolean);
}

function hasText(value) {
  return typeof value === "string" && Boolean(value.trim());
}

function assetPath(rootDir, publicPath) {
  return resolve(rootDir, decodeURIComponent(String(publicPath || "")).replace(/^\/+/, ""));
}

export function validateTopicData(topics, { rootDir, checkGenerated = false } = {}) {
  const errors = [];
  const ids = new Set();
  const slugs = new Set();

  if (!Array.isArray(topics) || !topics.length) {
    return ["topics: no topic records were provided"];
  }

  topics.forEach((topic, index) => {
    const label = hasText(topic?.id) ? topic.id : `topic[${index}]`;
    const requireText = (field, value = topic?.[field]) => {
      if (!hasText(value)) errors.push(`${label}.${field}: required text is missing`);
    };

    requireText("id");
    requireText("slug");
    requireText("title");
    requireText("eyebrow");
    requireText("introduction");
    requireText("sectionKey");
    requireText("breadcrumbLabel");
    requireText("schemaAbout");
    requireText("questionsSection.heading", topic?.questionsSection?.heading);
    requireText("questionsSection.rowAriaLabel", topic?.questionsSection?.rowAriaLabel);
    requireText("questionsSection.viewportAriaLabel", topic?.questionsSection?.viewportAriaLabel);
    requireText("faqSection.eyebrow", topic?.faqSection?.eyebrow);
    requireText("faqSection.heading", topic?.faqSection?.heading);
    requireText("seo.title", topic?.seo?.title);
    requireText("seo.description", topic?.seo?.description);
    requireText("seo.lastModified", topic?.seo?.lastModified);

    if (ids.has(topic.id)) errors.push(`${label}.id: duplicate ID "${topic.id}"`);
    if (slugs.has(topic.slug)) errors.push(`${label}.slug: duplicate slug "${topic.slug}"`);
    ids.add(topic.id);
    slugs.add(topic.slug);

    if (!getTopicRoute(topic)) errors.push(`${label}.slug: invalid clean-route slug`);
    if (!Array.isArray(topic.benefits) || topic.benefits.length !== 4) errors.push(`${label}.benefits: expected four benefits`);
    if (!Array.isArray(topic.themes) || topic.themes.length < 1) errors.push(`${label}.themes: expected at least one theme`);
    if (!Array.isArray(topic.featuredCards) || topic.featuredCards.length < 3) errors.push(`${label}.featuredCards: expected at least three cards`);
    if (topic.signalSection) {
      requireText("signalSection.eyebrow", topic.signalSection.eyebrow);
      requireText("signalSection.heading", topic.signalSection.heading);
      requireText("signalSection.introduction", topic.signalSection.introduction);
      requireText("signalSection.closing", topic.signalSection.closing);
      if (!Array.isArray(topic.signalSection.items) || topic.signalSection.items.length !== 3) {
        errors.push(`${label}.signalSection.items: expected three signals`);
      } else {
        topic.signalSection.items.forEach((item, itemIndex) => {
          const itemLabel = `${label}.signalSection.items[${itemIndex}]`;
          ["id", "title", "definition", "icon"].forEach((field) => {
            if (!hasText(item?.[field])) errors.push(`${itemLabel}.${field}: required text is missing`);
          });
          if (!Array.isArray(item.examples) || item.examples.length !== 5) {
            errors.push(`${itemLabel}.examples: expected five examples`);
          }
        });
      }
    }
    if (topic.processSection) {
      requireText("processSection.eyebrow", topic.processSection.eyebrow);
      requireText("processSection.heading", topic.processSection.heading);
      requireText("processSection.introduction", topic.processSection.introduction);
      requireText("processSection.closing", topic.processSection.closing);
      if (!Array.isArray(topic.processSection.items) || topic.processSection.items.length !== 4) {
        errors.push(`${label}.processSection.items: expected four stages`);
      } else {
        topic.processSection.items.forEach((item, itemIndex) => {
          const itemLabel = `${label}.processSection.items[${itemIndex}]`;
          ["id", "number", "title", "definition", "prompt", "icon"].forEach((field) => {
            if (!hasText(item?.[field])) errors.push(`${itemLabel}.${field}: required text is missing`);
          });
        });
      }
    }
    requireText("chapterSection.eyebrow", topic?.chapterSection?.eyebrow);
    requireText("chapterSection.heading", topic?.chapterSection?.heading);
    requireText("chapterSection.introduction", topic?.chapterSection?.introduction);
    if (!Array.isArray(topic.chapters) || topic.chapters.length !== 4) {
      errors.push(`${label}.chapters: expected four chapters`);
    } else {
      const chapterIds = new Set();
      const chapterNumbers = new Set();
      const representedThemes = new Set(topic.chapters.flatMap((chapter) => chapter.themes || []));
      topic.chapters.forEach((chapter, chapterIndex) => {
        const chapterLabel = `${label}.chapters[${chapterIndex}]`;
        ["id", "number", "title", "subtitle", "description", "featuredCardSlug", "featuredCardTitle", "cardSummary", "linkLabel"].forEach((field) => {
          if (!hasText(chapter?.[field])) errors.push(`${chapterLabel}.${field}: required text is missing`);
        });
        if (chapterIds.has(chapter.id)) errors.push(`${chapterLabel}.id: duplicate chapter ID "${chapter.id}"`);
        if (chapterNumbers.has(chapter.number)) errors.push(`${chapterLabel}.number: duplicate chapter number "${chapter.number}"`);
        chapterIds.add(chapter.id);
        chapterNumbers.add(chapter.number);
        if (!Array.isArray(chapter.themes) || chapter.themes.length !== 3) {
          errors.push(`${chapterLabel}.themes: expected three themes`);
        }
        const resolvedCard = cardBySlug.get(chapter.featuredCardSlug);
        if (!resolvedCard) {
          errors.push(`${chapterLabel}.featuredCardSlug: unknown card slug "${chapter.featuredCardSlug || ""}"`);
        } else if (resolvedCard.title !== chapter.featuredCardTitle) {
          errors.push(`${chapterLabel}.featuredCardTitle: expected "${resolvedCard.title}"`);
        }
      });
      (topic.themes || []).forEach((theme) => {
        if (!representedThemes.has(theme)) errors.push(`${label}.chapters: original theme "${theme}" is not represented`);
      });
    }
    if (!Array.isArray(topic.suggestedQuestions) || topic.suggestedQuestions.length < 1) errors.push(`${label}.suggestedQuestions: expected at least one question`);
    if (!Array.isArray(topic.faq) || topic.faq.length !== 6) errors.push(`${label}.faq: expected six entries`);
    ["upright", "reversed"].forEach((expression) => {
      requireText(`orientation.${expression}.label`, topic.orientation?.[expression]?.label);
      requireText(`orientation.${expression}.copy`, topic.orientation?.[expression]?.copy);
      if (!Array.isArray(topic.orientation?.[expression]?.concepts) || topic.orientation[expression].concepts.length !== 3) {
        errors.push(`${label}.orientation.${expression}.concepts: expected three concepts`);
      }
    });
    if (!Array.isArray(topic.ethics?.principles) || topic.ethics.principles.length !== 5) {
      errors.push(`${label}.ethics.principles: expected five principles`);
    } else {
      topic.ethics.principles.forEach((principle, principleIndex) => {
        if (!hasText(principle?.title) || !hasText(principle?.copy)) {
          errors.push(`${label}.ethics.principles[${principleIndex}]: title and copy are required`);
        }
      });
    }
    const orientationExampleCard = cardBySlug.get(topic.orientation?.exampleCardSlug);
    if (!orientationExampleCard) {
      errors.push(`${label}.orientation.exampleCardSlug: unknown card slug "${topic.orientation?.exampleCardSlug || ""}"`);
    }

    [
      topic.hero?.standardImage,
      topic.hero?.bloodMoonImage,
      topic.readingCta?.image,
      ...(topic.benefits || []).map((benefit) => benefit.icon),
      ...(topic.signalSection?.items || []).map((item) => item.icon),
      ...(topic.processSection?.items || []).map((item) => item.icon),
      topic.orientation?.upright?.icon,
      topic.orientation?.reversed?.icon,
      orientationExampleCard?.variants?.veilrise?.image,
      orientationExampleCard?.variants?.veilfall?.image,
      ...(topic.chapters || []).flatMap((chapter) => {
        const card = cardBySlug.get(chapter.featuredCardSlug);
        return [card?.variants?.veilrise?.image, card?.variants?.veilfall?.image];
      }),
      ...(topic.ethics?.principles || []).map((principle) => principle.icon)
    ].filter(Boolean).forEach((publicPath) => {
      if (!existsSync(assetPath(rootDir, publicPath))) {
        errors.push(`${label}.asset: missing ${publicPath}`);
      }
    });

    (topic.featuredCards || []).forEach(({ slug }) => {
      if (!cardBySlug.has(slug)) errors.push(`${label}.featuredCards: unknown card slug "${slug}"`);
    });

    if (checkGenerated) {
      const outputPath = getTopicOutputPath(rootDir, topic);
      if (!outputPath || !existsSync(outputPath)) {
        errors.push(`${label}.route: generated page is missing`);
      } else {
        const html = readFileSync(outputPath, "utf8");
        const route = getTopicRoute(topic);
        if (!html.includes(`<link rel="canonical" href="https://astralveil.world${route}"`)) {
          errors.push(`${label}.canonical: generated page canonical is missing or incorrect`);
        }
        if (!html.includes(`id="tarot-topic-faq-schema"`)) {
          errors.push(`${label}.schema: FAQ schema is missing`);
        }
      }
    }
  });

  return errors;
}
