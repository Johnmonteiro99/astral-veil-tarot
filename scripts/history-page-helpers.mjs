import { existsSync } from "node:fs";
import { resolve } from "node:path";

const externalUrlPattern = /^https:\/\/[^/]+\/.+/;

function hasText(value) {
  return typeof value === "string" && Boolean(value.trim());
}

function publicPathToFile(rootDir, publicPath) {
  return resolve(rootDir, decodeURIComponent(String(publicPath || "")).replace(/^\/+/, ""));
}

function requireImage(errors, rootDir, label, image, { decorative = false } = {}) {
  if (!hasText(image?.src)) errors.push(`${label}.src: required image path is missing`);
  if (!Number.isInteger(image?.width) || image.width < 1) errors.push(`${label}.width: positive integer required`);
  if (!Number.isInteger(image?.height) || image.height < 1) errors.push(`${label}.height: positive integer required`);
  if (!decorative && !hasText(image?.alt)) errors.push(`${label}.alt: meaningful alt text is required`);
  if (image?.src && !existsSync(publicPathToFile(rootDir, image.src))) {
    errors.push(`${label}.src: asset does not exist at ${image.src}`);
  }
}

export function getHistoryRoute(history) {
  return history?.slug === "history" ? "/tarot/history/" : "";
}

export function getHistoryOutputPath(rootDir, history) {
  const route = getHistoryRoute(history);
  return route ? resolve(rootDir, route.replace(/^\/+|\/+$/g, ""), "index.html") : "";
}

export function validateHistoryData(history, { rootDir, checkGenerated = false } = {}) {
  const errors = [];
  const requireText = (label, value) => {
    if (!hasText(value)) errors.push(`${label}: required text is missing`);
  };
  const ids = new Set();
  const registerId = (label, value) => {
    requireText(label, value);
    if (!hasText(value)) return;
    if (ids.has(value)) errors.push(`${label}: duplicate section or item ID "${value}"`);
    ids.add(value);
  };

  requireText("history.id", history?.id);
  requireText("history.slug", history?.slug);
  requireText("history.route", history?.route);
  requireText("history.breadcrumbLabel", history?.breadcrumbLabel);
  requireText("history.visualNote", history?.visualNote);
  if (getHistoryRoute(history) !== history?.route) errors.push("history.route: expected canonical /tarot/history/");

  [
    ["hero.eyebrow", history?.hero?.eyebrow],
    ["hero.title", history?.hero?.title],
    ["hero.introduction", history?.hero?.introduction],
    ["hero.ctaLabel", history?.hero?.ctaLabel],
    ["hero.ctaTarget", history?.hero?.ctaTarget],
    ["seo.title", history?.seo?.title],
    ["seo.description", history?.seo?.description],
    ["seo.ogTitle", history?.seo?.ogTitle],
    ["seo.ogDescription", history?.seo?.ogDescription],
    ["seo.lastModified", history?.seo?.lastModified],
    ["hubTile.key", history?.hubTile?.key],
    ["hubTile.ctaLabel", history?.hubTile?.ctaLabel],
    ["hubTile.route", history?.hubTile?.route],
    ["faqSection.introduction", history?.faqSection?.introduction]
  ].forEach(([label, value]) => requireText(label, value));

  requireImage(errors, rootDir, "hero.image", history?.hero?.image);
  requireImage(errors, rootDir, "origins.image", history?.origins?.image);
  requireImage(errors, rootDir, "origins.factsImage", history?.origins?.factsImage);
  requireImage(errors, rootDir, "occultRevival.image", history?.occultRevival?.image);
  requireImage(errors, rootDir, "modernIllustratedTarot.image", history?.modernIllustratedTarot?.image);
  requireImage(errors, rootDir, "tarotToday.image", history?.tarotToday?.image);
  requireImage(errors, rootDir, "resources.image", history?.resources?.image);
  requireImage(errors, rootDir, "closingCta.image", history?.closingCta?.image);
  if (!Array.isArray(history?.closingCta?.actions) || history.closingCta.actions.length !== 4) {
    errors.push("closingCta.actions: expected four destination cards");
  } else {
    history.closingCta.actions.forEach((action, index) => {
      requireText(`closingCta.actions[${index}].description`, action?.description);
      requireImage(errors, rootDir, `closingCta.actions[${index}].image`, action?.image);
    });
  }

  [
    ["origins", history?.origins],
    ["timeline", history?.timeline],
    ["traditions", history?.traditions],
    ["contributors", history?.contributors],
    ["occultRevival", history?.occultRevival],
    ["modernIllustratedTarot", history?.modernIllustratedTarot],
    ["tarotToday", history?.tarotToday],
    ["resources", history?.resources],
    ["faqSection", history?.faqSection]
  ].forEach(([label, section]) => {
    registerId(`${label}.id`, section?.id);
    requireText(`${label}.number`, section?.number);
    requireText(`${label}.heading`, section?.heading);
  });

  if (!Array.isArray(history?.origins?.paragraphs) || history.origins.paragraphs.length !== 2) {
    errors.push("origins.paragraphs: expected two concise paragraphs");
  }
  requireText("origins.pullQuote", history?.origins?.pullQuote);
  if (!Array.isArray(history?.origins?.facts) || history.origins.facts.length !== 4) {
    errors.push("origins.facts: expected four facts");
  }
  if (!Array.isArray(history?.origins?.sources) || history.origins.sources.length < 2) {
    errors.push("origins.sources: expected at least two verified sources");
  }

  if (!Array.isArray(history?.timeline?.milestones) || history.timeline.milestones.length !== 5) {
    errors.push("timeline.milestones: expected five milestones");
  } else {
    history.timeline.milestones.forEach((item, index) => {
      registerId(`timeline.milestones[${index}].id`, item?.id);
      ["era", "title", "copy", "whyItMatters", "archiveDetail"].forEach((field) => {
        requireText(`timeline.milestones[${index}].${field}`, item?.[field]);
      });
      requireText(`timeline.milestones[${index}].relatedLink.label`, item?.relatedLink?.label);
      requireText(`timeline.milestones[${index}].relatedLink.route`, item?.relatedLink?.route);
      if (item?.relatedLink?.route && !item.relatedLink.route.startsWith("/")) {
        errors.push(`timeline.milestones[${index}].relatedLink.route: expected an internal route`);
      }
      requireImage(errors, rootDir, `timeline.milestones[${index}].image`, item?.image);
    });
  }

  if (!Array.isArray(history?.traditions?.items) || history.traditions.items.length !== 4) {
    errors.push("traditions.items: expected four traditions");
  } else {
    history.traditions.items.forEach((item, index) => {
      registerId(`traditions.items[${index}].id`, item?.id);
      ["era", "title", "copy", "visualSignature", "historicalInfluence"].forEach((field) => {
        requireText(`traditions.items[${index}].${field}`, item?.[field]);
      });
      requireText(`traditions.items[${index}].relatedLink.label`, item?.relatedLink?.label);
      requireText(`traditions.items[${index}].relatedLink.route`, item?.relatedLink?.route);
      if (item?.relatedLink?.route && !item.relatedLink.route.startsWith("/")) {
        errors.push(`traditions.items[${index}].relatedLink.route: expected an internal route`);
      }
      const overviewWordCount = String(item?.copy || "").trim().split(/\s+/).filter(Boolean).length;
      const visualWordCount = String(item?.visualSignature || "").trim().split(/\s+/).filter(Boolean).length;
      const influenceWordCount = String(item?.historicalInfluence || "").trim().split(/\s+/).filter(Boolean).length;
      if (overviewWordCount < 24 || overviewWordCount > 55) {
        errors.push(`traditions.items[${index}].copy: expected 24–55 words, found ${overviewWordCount}`);
      }
      if (visualWordCount < 10 || visualWordCount > 35) {
        errors.push(`traditions.items[${index}].visualSignature: expected 10–35 words, found ${visualWordCount}`);
      }
      if (influenceWordCount < 10 || influenceWordCount > 35) {
        errors.push(`traditions.items[${index}].historicalInfluence: expected 10–35 words, found ${influenceWordCount}`);
      }
      requireImage(errors, rootDir, `traditions.items[${index}].image`, item?.image);
    });
  }

  if (!Array.isArray(history?.contributors?.items) || history.contributors.items.length !== 6) {
    errors.push("contributors.items: expected six contributor entries");
  } else {
    history.contributors.items.forEach((item, index) => {
      registerId(`contributors.items[${index}].id`, item?.id);
      ["name", "dates", "role", "monogram", "symbol", "copy", "detail", "whyItMatters"].forEach((field) => requireText(`contributors.items[${index}].${field}`, item?.[field]));
      const detailWordCount = String(item?.detail || "").trim().split(/\s+/).filter(Boolean).length;
      if (detailWordCount < 120 || detailWordCount > 180) {
        errors.push(`contributors.items[${index}].detail: expected 120–180 words, found ${detailWordCount}`);
      }
      if (item?.image || item?.portrait) errors.push(`contributors.items[${index}]: generated portraits are not permitted`);
    });
  }

  if (!Array.isArray(history?.occultRevival?.categories) || history.occultRevival.categories.length !== 4) {
    errors.push("occultRevival.categories: expected four primary symbolic topics");
  }

  if (!Array.isArray(history?.resources?.items) || history.resources.items.length < 5) {
    errors.push("resources.items: expected the verified museum resource list");
  } else {
    history.resources.items.forEach((item, index) => {
      ["organization", "title", "type"].forEach((field) => requireText(`resources.items[${index}].${field}`, item?.[field]));
    });
  }

  if (!Array.isArray(history?.faq) || history.faq.length !== 6) {
    errors.push("faq: expected six entries");
  } else {
    history.faq.forEach((item, index) => {
      requireText(`faq[${index}].question`, item?.question);
      requireText(`faq[${index}].answer`, item?.answer);
    });
  }

  const externalLinks = [
    ...(history?.origins?.sources || []),
    ...(history?.resources?.items || [])
  ];
  externalLinks.forEach((item, index) => {
    const url = item?.url;
    if (!externalUrlPattern.test(String(url || ""))) {
      errors.push(`externalLinks[${index}].url: verified HTTPS URL required`);
    }
  });

  const internalLinks = [
    ...(history?.modernIllustratedTarot?.links || []),
    ...(history?.relatedLinks || []),
    ...(history?.closingCta?.actions || [])
  ];
  internalLinks.forEach((item, index) => {
    requireText(`internalLinks[${index}].label`, item?.label);
    if (!String(item?.route || "").startsWith("/")) {
      errors.push(`internalLinks[${index}].route: internal route must begin with /`);
    }
  });

  if (checkGenerated) {
    const outputPath = getHistoryOutputPath(rootDir, history);
    if (!existsSync(outputPath)) errors.push(`generated: output is missing at ${outputPath}`);
  }

  return errors;
}
