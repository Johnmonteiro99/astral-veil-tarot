import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tarotTopicNavigation } from "../data/tarot-topic-navigation.mjs";
import { tarotTopics } from "../data/tarot-topics.mjs";
import { escapeHtml, serializeForInlineScript, SITE_ORIGIN } from "./card-page-helpers.mjs";
import { renderTarotFaqSection } from "./tarot-education-page-helpers.mjs";
import {
  getTopicOutputPath,
  getTopicRoute,
  resolveTopicCard,
  validateTopicData
} from "./topic-page-helpers.mjs";

const rootDir = resolve(fileURLToPath(new URL("..", import.meta.url)));
const templatePath = resolve(rootDir, "templates/tarot-topic-page.html");
const sitemapPath = resolve(rootDir, "sitemap.xml");

function renderSchema(topic) {
  const route = getTopicRoute(topic);
  const canonicalUrl = `${SITE_ORIGIN}${route}`;

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Tarot", item: `${SITE_ORIGIN}/tarot` },
      { "@type": "ListItem", position: 3, name: topic.breadcrumbLabel, item: canonicalUrl }
    ]
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: topic.title,
    description: topic.seo.description,
    url: canonicalUrl,
    image: `${SITE_ORIGIN}${topic.hero.standardImage}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Astral Veil",
      url: `${SITE_ORIGIN}/`
    },
    about: {
      "@type": "Thing",
      name: topic.schemaAbout
    }
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: topic.faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer }
    }))
  };

  return { breadcrumb, webPage, faqPage };
}

function renderMeta(topic) {
  const route = getTopicRoute(topic);
  const canonicalUrl = `${SITE_ORIGIN}${route}`;
  const heroUrl = `${SITE_ORIGIN}${topic.hero.standardImage}`;
  const schema = renderSchema(topic);

  return [
    `<title>${escapeHtml(topic.seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(topic.seo.description)}" />`,
    `<link rel="canonical" href="${canonicalUrl}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(topic.seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(topic.seo.ogDescription)}" />`,
    `<meta property="og:url" content="${canonicalUrl}" />`,
    `<meta property="og:image" content="${heroUrl}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(topic.hero.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(topic.seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(topic.seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${heroUrl}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(topic.hero.alt)}" />`,
    `<link rel="preload" as="image" href="${escapeHtml(topic.hero.standardImage)}" />`,
    `<script type="application/ld+json">${serializeForInlineScript(schema.breadcrumb)}</script>`,
    `<script id="tarot-topic-webpage-schema" type="application/ld+json">${serializeForInlineScript(schema.webPage)}</script>`,
    `<script id="tarot-topic-faq-schema" type="application/ld+json">${serializeForInlineScript(schema.faqPage)}</script>`
  ].join("\n    ");
}

function renderThemeImage({
  className,
  standardImage,
  bloodMoonImage,
  standardAlt,
  bloodMoonAlt = standardAlt,
  width = 1024,
  height = 1536,
  bloodMoonWidth = width,
  bloodMoonHeight = height,
  loading = "lazy",
  fetchpriority = "",
  draggable
}) {
  const fetchPriorityAttribute = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  const draggableAttribute = typeof draggable === "boolean" ? ` draggable="${draggable}"` : "";
  return `<img class="${className}" src="${escapeHtml(standardImage)}" alt="${escapeHtml(standardAlt)}" width="${width}" height="${height}" ${loading ? `loading="${loading}" ` : ""}decoding="async"${fetchPriorityAttribute}${draggableAttribute} data-topic-theme-image data-standard-src="${escapeHtml(standardImage)}" data-standard-alt="${escapeHtml(standardAlt)}" data-standard-width="${width}" data-standard-height="${height}" data-blood-src="${escapeHtml(bloodMoonImage)}" data-blood-alt="${escapeHtml(bloodMoonAlt)}" data-blood-width="${bloodMoonWidth}" data-blood-height="${bloodMoonHeight}" />`;
}

function renderBenefits(topic) {
  return topic.benefits.map((benefit) => `
          <article class="tarot-topic-benefit">
            <img class="tarot-topic-benefit__icon" src="${escapeHtml(benefit.icon)}" alt="" width="${benefit.iconWidth}" height="${benefit.iconHeight}" loading="lazy" decoding="async" />
            <h3>${escapeHtml(benefit.title)}</h3>
            <p>${escapeHtml(benefit.copy)}</p>
          </article>`).join("");
}

function renderSignalSection(topic) {
  const section = topic.signalSection;
  const items = section.items.map((item) => {
    const examples = item.examples.map((example) => `<li><span aria-hidden="true">✦</span>${escapeHtml(example)}</li>`).join("");
    return `<article class="tarot-topic-signal tarot-topic-signal--${escapeHtml(item.id)}">
            ${renderCelestialIcon(item.icon, "tarot-topic-signal__icon")}
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.definition)}</p>
            <ul>${examples}</ul>
          </article>`;
  }).join("");

  return `<section class="tarot-topic-signals tarot-topic-section" aria-labelledby="${escapeHtml(topic.sectionKey)}-signals-heading">
        <header class="tarot-topic-signals__introduction tarot-topic-section-heading">
          <p class="tarot-topic-kicker">${escapeHtml(section.eyebrow)}</p>
          <h2 id="${escapeHtml(topic.sectionKey)}-signals-heading">${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.introduction)}</p>
        </header>
        <div class="tarot-topic-signals__grid">${items}</div>
        <p class="tarot-topic-signals__closing">${escapeHtml(section.closing)}</p>
      </section>`;
}

function renderProcessSection(topic) {
  const section = topic.processSection;
  const items = section.items.map((item) => `<li class="tarot-topic-process__step tarot-topic-process__step--${escapeHtml(item.id)}">
          <div class="tarot-topic-process__marker">
            <span>${escapeHtml(item.number)}</span>
            ${renderCelestialIcon(item.icon, "tarot-topic-process__icon")}
          </div>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.definition)}</p>
          <p class="tarot-topic-process__prompt">${escapeHtml(item.prompt)}</p>
        </li>`).join("");

  return `<section class="tarot-topic-process tarot-topic-section" aria-labelledby="${escapeHtml(topic.sectionKey)}-process-heading">
        <header class="tarot-topic-process__introduction tarot-topic-section-heading">
          <p class="tarot-topic-kicker">${escapeHtml(section.eyebrow)}</p>
          <h2 id="${escapeHtml(topic.sectionKey)}-process-heading">${escapeHtml(section.heading)}</h2>
          <p>${escapeHtml(section.introduction)}</p>
        </header>
        <ol class="tarot-topic-process__steps">${items}</ol>
        <p class="tarot-topic-process__closing">${escapeHtml(section.closing)}</p>
      </section>`;
}

function renderChapters(topic) {
  const sectionKey = topic.sectionKey;
  const chapters = topic.chapters.map((chapter, index) => {
    const card = resolveTopicCard(chapter.featuredCardSlug);
    if (!card) throw new Error(`Missing chapter card: ${chapter.featuredCardSlug}`);
    const themes = chapter.themes.map((theme) => `<li><span aria-hidden="true">✦</span>${escapeHtml(theme)}</li>`).join("");

    return `
          <article class="tarot-topic-chapter tarot-topic-chapter--${escapeHtml(chapter.id)}${index % 2 ? " tarot-topic-chapter--reverse" : ""}">
            <div class="tarot-topic-chapter__copy">
              <div class="tarot-topic-chapter__number" aria-label="Chapter ${escapeHtml(chapter.number)}"><span>${escapeHtml(chapter.number)}</span><i aria-hidden="true">✦</i></div>
              <h3>${escapeHtml(chapter.title)}</h3>
              <p class="tarot-topic-chapter__subtitle">${escapeHtml(chapter.subtitle)}</p>
              <p class="tarot-topic-chapter__description">${escapeHtml(chapter.description)}</p>
              <ul class="tarot-topic-chapter__themes">${themes}</ul>
            </div>
            <figure class="tarot-topic-chapter__visual">
              <div class="tarot-topic-chapter__exhibit">
                <button class="tarot-topic-chapter__card" type="button" aria-label="Drag to tilt ${escapeHtml(card.title)}" data-astral-card-tilt>
                  <span class="tarot-topic-chapter__card-frame">
                    ${renderThemeImage({
                      className: "tarot-topic-chapter__card-image",
                      standardImage: card.standardImage,
                      bloodMoonImage: card.bloodMoonImage,
                      standardAlt: card.standardImageAlt,
                      bloodMoonAlt: card.bloodMoonImageAlt,
                      draggable: false
                    })}
                    <span class="tarot-topic-chapter__card-shine" aria-hidden="true"></span>
                  </span>
                </button>
                <p class="tarot-topic-chapter__tilt-hint" data-astral-card-tilt-hint><span aria-hidden="true">↻</span> Drag to tilt</p>
              </div>
              <figcaption class="tarot-topic-chapter__card-copy">
                <p class="tarot-topic-kicker">Guiding Archetype</p>
                <h4>${escapeHtml(chapter.featuredCardTitle)}</h4>
                <p>${escapeHtml(chapter.cardSummary)}</p>
                <a class="tarot-topic-text-link" href="${escapeHtml(card.route)}">${escapeHtml(chapter.linkLabel)} <span aria-hidden="true">→</span></a>
              </figcaption>
            </figure>
          </article>`;
  }).join("");

  return `<section class="tarot-topic-chapters tarot-topic-section" id="important-${escapeHtml(sectionKey)}-cards" aria-labelledby="${escapeHtml(sectionKey)}-chapters-heading">
        <header class="tarot-topic-chapters__introduction tarot-topic-section-heading">
          <p class="tarot-topic-kicker">${escapeHtml(topic.chapterSection.eyebrow)}</p>
          <h2 id="${escapeHtml(sectionKey)}-chapters-heading">${escapeHtml(topic.chapterSection.heading)}</h2>
          <p>${escapeHtml(topic.chapterSection.introduction)}</p>
        </header>
        <div class="tarot-topic-chapters__sequence">${chapters}
        </div>
      </section>`;
}

function renderQuestions(topic) {
  return topic.suggestedQuestions.map((question, index) => `
          <article class="tarot-topic-question">
            <span class="tarot-topic-question__number" aria-hidden="true">${String(index + 1).padStart(2, "0")}</span>
            <p>${escapeHtml(question)}</p>
          </article>`).join("");
}

function renderCelestialIcon(icon, className) {
  return `<span class="${className}" style="--topic-icon: url('${escapeHtml(icon)}')" aria-hidden="true"></span>`;
}

function renderOrientation(topic) {
  const sectionKey = topic.sectionKey;
  const exampleCard = resolveTopicCard(topic.orientation.exampleCardSlug);
  if (!exampleCard) {
    throw new Error(`Missing orientation example card: ${topic.orientation.exampleCardSlug}`);
  }
  const orientationStates = {
    upright: topic.orientation.upright,
    reversed: topic.orientation.reversed
  };
  const initialState = orientationStates.upright;
  const concepts = initialState.concepts.map((concept) => `<li><span aria-hidden="true">✦</span>${escapeHtml(concept)}</li>`).join("");
  const orientationData = serializeForInlineScript(orientationStates);
  const guide = topic.orientation.guideAvailable
    ? `<a class="tarot-topic-text-link" href="${escapeHtml(topic.orientation.guideRoute)}">Explore upright and reversed meanings <span aria-hidden="true">→</span></a>`
    : `<p class="tarot-topic-availability">${escapeHtml(topic.orientation.archiveNote)}</p>`;

  return `<section class="tarot-topic-orientation tarot-topic-section" aria-labelledby="upright-reversed-${escapeHtml(sectionKey)}" data-topic-orientation="upright">
          <header class="tarot-topic-section-heading">
            <p class="tarot-topic-kicker">Reading the Cards</p>
            <h2 id="upright-reversed-${escapeHtml(sectionKey)}">${escapeHtml(topic.orientation.heading)}</h2>
            <p>${escapeHtml(topic.orientation.introduction)}</p>
          </header>
          <div class="tarot-topic-orientation-toggle" role="group" aria-label="Choose card orientation">
            <button class="tarot-topic-orientation-toggle__option is-active" type="button" aria-pressed="true" aria-controls="tarot-topic-orientation-module" data-topic-orientation-option="upright">Upright</button>
            <button class="tarot-topic-orientation-toggle__option" type="button" aria-pressed="false" aria-controls="tarot-topic-orientation-module" data-topic-orientation-option="reversed">Reversed</button>
          </div>
          <div class="tarot-topic-orientation-module" id="tarot-topic-orientation-module" data-topic-orientation-module>
            <figure class="tarot-topic-orientation__visual">
              <button class="tarot-topic-orientation-card" type="button" aria-label="Drag to tilt ${escapeHtml(exampleCard.title)} upright example" data-astral-card-tilt data-topic-orientation-card>
                <span class="tarot-topic-orientation-card__frame tarot-topic-orientation-card__frame--upright" data-topic-orientation-frame>
                  ${renderThemeImage({
                    className: "tarot-topic-orientation-card__image",
                    standardImage: exampleCard.standardImage,
                    bloodMoonImage: exampleCard.bloodMoonImage,
                    standardAlt: `${exampleCard.standardImageAlt}, used as an orientation example`,
                    bloodMoonAlt: `${exampleCard.bloodMoonImageAlt}, used as an orientation example`,
                    draggable: false
                  })}
                  <span class="tarot-topic-orientation-card__shine" aria-hidden="true"></span>
                </span>
              </button>
              <figcaption class="tarot-topic-orientation-card__hint" data-astral-card-tilt-hint><span aria-hidden="true">↻</span> Drag to tilt</figcaption>
            </figure>
            <div class="tarot-topic-orientation__content" id="tarot-topic-orientation-content" aria-live="polite" aria-atomic="true">
              <p class="tarot-topic-orientation__state-label" data-topic-orientation-state-label>Upright</p>
              <h3 data-topic-orientation-title>${escapeHtml(initialState.label)}</h3>
              <p data-topic-orientation-copy>${escapeHtml(initialState.copy)}</p>
              <ul data-topic-orientation-concepts>${concepts}</ul>
            </div>
          </div>
          <p class="tarot-topic-orientation__clarification">${escapeHtml(topic.orientation.clarification)}</p>
          ${guide}
          <script id="tarot-topic-orientation-data" type="application/json">${orientationData}</script>
        </section>`;
}

function renderEthics(topic) {
  const sectionKey = topic.sectionKey;
  const principles = topic.ethics.principles.map((principle, index) => `
            <li class="tarot-topic-principle${index === topic.ethics.principles.length - 1 ? " tarot-topic-principle--wide" : ""}">
              ${renderCelestialIcon(principle.icon, "tarot-topic-principle__icon")}
              <span>
                <strong>${escapeHtml(principle.title)}</strong>
                <span>${escapeHtml(principle.copy)}</span>
              </span>
            </li>`).join("");
  return `<section class="tarot-topic-responsible tarot-topic-section" aria-labelledby="responsible-${escapeHtml(sectionKey)}-tarot">
          <div class="tarot-topic-chapter-divider" aria-hidden="true"><span>✦</span></div>
          <div class="tarot-topic-responsible__layout">
            <div class="tarot-topic-responsible__introduction">
              <p class="tarot-topic-kicker">Reflection with Agency</p>
              <h2 id="responsible-${escapeHtml(sectionKey)}-tarot">${escapeHtml(topic.ethics.heading)}</h2>
              <p>${escapeHtml(topic.ethics.introduction)}</p>
              <blockquote>${escapeHtml(topic.ethics.pullQuote)}</blockquote>
            </div>
            <ul class="tarot-topic-principles">${principles}</ul>
          </div>
        </section>`;
}

function renderFaq(topic) {
  const sectionId = `${topic.sectionKey}-tarot-faq`;
  return renderTarotFaqSection({
    section: {
      id: sectionId,
      eyebrow: topic.faqSection.eyebrow,
      heading: topic.faqSection.heading
    },
    items: topic.faq,
    idPrefix: `${topic.sectionKey}-tarot-faq`,
    className: "tarot-topic-faq tarot-topic-section",
    layout: "stacked",
    innerClassName: "",
    showDivider: false
  });
}

function renderRelatedLinks(topic) {
  return topic.relatedLinks.map((link) => `<a class="tarot-topic-related__link" href="${escapeHtml(link.route)}"><strong>${escapeHtml(link.label)}</strong><span>${escapeHtml(link.copy)}</span><span aria-hidden="true">→</span></a>`).join("");
}

function renderTopicNavigation(topic) {
  const completedTopics = new Map(tarotTopics.map((completedTopic) => [completedTopic.id, completedTopic]));
  const items = tarotTopicNavigation.map((item) => {
    const completedTopic = completedTopics.get(item.topicId);
    const isActive = item.topicId === topic.id;
    const className = `tarot-topic-ribbon__item${isActive ? " is-active" : ""}${completedTopic ? "" : " is-disabled"}`;
    const icon = `<span class="tarot-topic-ribbon__icon" style="--topic-ribbon-icon: url('${escapeHtml(item.icon)}')" aria-hidden="true"></span>`;
    const labels = `<span class="tarot-topic-ribbon__label tarot-topic-ribbon__label--full">${escapeHtml(item.label)}</span><span class="tarot-topic-ribbon__label tarot-topic-ribbon__label--short" aria-hidden="true">${escapeHtml(item.shortLabel)}</span>`;

    if (completedTopic) {
      return `<a class="${className}" href="${getTopicRoute(completedTopic)}" aria-label="${escapeHtml(item.label)}"${isActive ? ' aria-current="page"' : ""} data-topic-ribbon-item="${escapeHtml(item.topicId)}">${icon}${labels}</a>`;
    }

    return `<span class="${className}" role="link" aria-disabled="true" aria-label="${escapeHtml(item.label)} — Coming Soon" tabindex="0" data-topic-ribbon-item="${escapeHtml(item.topicId)}">${icon}${labels}</span>`;
  }).join("");

  return `<nav class="tarot-topic-ribbon" aria-label="Tarot topics">
        <span class="tarot-topic-ribbon__heading">Tarot Topics</span>
        <div class="tarot-topic-ribbon__viewport">
          <div class="tarot-topic-ribbon__track">${items}</div>
        </div>
      </nav>`;
}

function renderMain(topic) {
  const hero = topic.hero;
  const cta = topic.readingCta;
  const sectionKey = topic.sectionKey;
  const visualClass = topic.visualClass ? ` ${escapeHtml(topic.visualClass)}` : "";

  return `<main id="main-content" class="tarot-topic${visualClass}">
      ${renderTopicNavigation(topic)}

      <section class="tarot-topic-hero" aria-labelledby="tarot-topic-title">
        <div class="tarot-topic-hero__copy">
          <p class="tarot-topic-eyebrow">${escapeHtml(topic.eyebrow)}</p>
          <h1 id="tarot-topic-title">${escapeHtml(topic.title)}</h1>
          <span class="tarot-topic-rule" aria-hidden="true"><span>✦</span></span>
          <p class="tarot-topic-hero__introduction">${escapeHtml(topic.introduction)}</p>
        </div>
        <figure class="tarot-topic-hero__art">
          ${renderThemeImage({
            className: "tarot-topic-hero__image",
            standardImage: hero.standardImage,
            bloodMoonImage: hero.bloodMoonImage,
            standardAlt: hero.alt,
            bloodMoonAlt: hero.bloodMoonAlt || hero.alt,
            width: hero.width,
            height: hero.height,
            bloodMoonWidth: hero.bloodMoonWidth,
            bloodMoonHeight: hero.bloodMoonHeight,
            loading: "eager",
            fetchpriority: "high"
          })}
        </figure>
      </section>

      <section class="tarot-topic-overview tarot-topic-section" aria-labelledby="${escapeHtml(sectionKey)}-questions-heading">
        <figure class="tarot-topic-overview__art" aria-hidden="true">
          ${renderThemeImage({
            className: "tarot-topic-overview__image",
            standardImage: hero.standardImage,
            bloodMoonImage: hero.bloodMoonImage,
            standardAlt: "",
            width: hero.width,
            height: hero.height,
            bloodMoonWidth: hero.bloodMoonWidth,
            bloodMoonHeight: hero.bloodMoonHeight
          })}
        </figure>
        <div class="tarot-topic-section-heading tarot-topic-overview__copy">
          <p class="tarot-topic-kicker">A Reflective Language</p>
          <h2 id="${escapeHtml(sectionKey)}-questions-heading">${escapeHtml(topic.overview.heading)}</h2>
          <p>${escapeHtml(topic.overview.copy)}</p>
        </div>
        <div class="tarot-topic-benefits">${renderBenefits(topic)}
        </div>
      </section>${topic.signalSection ? `

      ${renderSignalSection(topic)}` : ""}${topic.processSection ? `

      ${renderProcessSection(topic)}` : ""}

      ${renderChapters(topic)}

      <section class="tarot-topic-reading-row tarot-topic-section" aria-label="${escapeHtml(topic.questionsSection.rowAriaLabel)}">
        <section class="tarot-topic-questions" aria-labelledby="${escapeHtml(sectionKey)}-reading-questions-heading">
          <div class="tarot-topic-section-heading tarot-topic-section-heading--compact">
            <p class="tarot-topic-kicker">Ask with Awareness</p>
            <h2 id="${escapeHtml(sectionKey)}-reading-questions-heading">${escapeHtml(topic.questionsSection.heading)}</h2>
          </div>
          <div class="tarot-topic-question-viewport" aria-label="${escapeHtml(topic.questionsSection.viewportAriaLabel)}">
            <div class="tarot-topic-question-track">${renderQuestions(topic)}
            </div>
          </div>
          <p class="tarot-topic-swipe-hint" aria-hidden="true">Scroll for more questions <span>→</span></p>
        </section>

        <section class="tarot-topic-cta" aria-labelledby="${escapeHtml(sectionKey)}-reading-cta-heading">
          <div class="tarot-topic-cta__copy">
            <p class="tarot-topic-kicker">Step Through the Veil</p>
            <h2 id="${escapeHtml(sectionKey)}-reading-cta-heading">${escapeHtml(cta.heading)}</h2>
            <p>${escapeHtml(cta.copy)}</p>
            <div class="tarot-topic-cta__actions">
              <a class="tarot-topic-button tarot-topic-button--primary" href="${escapeHtml(cta.primaryRoute)}">${escapeHtml(cta.primaryLabel)} <span aria-hidden="true">→</span></a>
              <a class="tarot-topic-button tarot-topic-button--secondary" href="${escapeHtml(cta.secondaryRoute)}">${escapeHtml(cta.secondaryLabel)}</a>
            </div>
          </div>
          <figure class="tarot-topic-cta__art">
            <img src="${escapeHtml(cta.image)}" alt="${escapeHtml(cta.imageAlt)}" width="${cta.imageWidth}" height="${cta.imageHeight}" loading="lazy" decoding="async" />
          </figure>
        </section>
      </section>

      ${renderOrientation(topic)}

      ${renderEthics(topic)}

      ${renderFaq(topic)}

      <section class="tarot-topic-related tarot-topic-section" aria-labelledby="continue-exploring-heading">
        <div class="tarot-topic-section-heading tarot-topic-section-heading--compact">
          <p class="tarot-topic-kicker">Continue Through the Archive</p>
          <h2 id="continue-exploring-heading">Explore More Tarot Guidance</h2>
        </div>
        <div class="tarot-topic-related__links">${renderRelatedLinks(topic)}</div>
      </section>
    </main>`;
}

function renderPage(template, topic) {
  if (!template.includes("{{TOPIC_META}}") || !template.includes("{{TOPIC_MAIN}}")) {
    throw new Error("Topic template markers are missing");
  }

  return `${template
    .replace("{{TOPIC_META}}", renderMeta(topic))
    .replace("{{TOPIC_MAIN}}", renderMain(topic))
    .trim()}\n`;
}

function updateSitemap(topics) {
  const startMarker = "  <!-- GENERATED:TAROT_TOPIC_PAGES:START -->";
  const endMarker = "  <!-- GENERATED:TAROT_TOPIC_PAGES:END -->";
  const generatedBlock = [
    startMarker,
    ...topics.flatMap((topic) => [
      "  <url>",
      `    <loc>${SITE_ORIGIN}${getTopicRoute(topic)}</loc>`,
      `    <lastmod>${topic.seo.lastModified}</lastmod>`,
      "    <changefreq>monthly</changefreq>",
      "    <priority>0.85</priority>",
      "  </url>"
    ]),
    endMarker
  ].join("\n");
  let sitemap = readFileSync(sitemapPath, "utf8");
  const currentBlock = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}\\n?`);
  sitemap = sitemap.replace(currentBlock, "");
  topics.forEach((topic) => {
    const canonical = `${SITE_ORIGIN}${getTopicRoute(topic)}`.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    sitemap = sitemap.replace(new RegExp(`\\s*<url>\\s*<loc>${canonical}</loc>[\\s\\S]*?</url>`, "g"), "");
  });

  const cardMarker = "  <!-- GENERATED:TAROT_CARD_PAGES:START -->";
  sitemap = sitemap.includes(cardMarker)
    ? sitemap.replace(cardMarker, `${generatedBlock}\n${cardMarker}`)
    : sitemap.replace(/\s*<\/urlset>\s*$/, `\n${generatedBlock}\n</urlset>\n`);
  writeFileSync(sitemapPath, sitemap);
}

const errors = validateTopicData(tarotTopics, { rootDir, checkGenerated: false });
if (errors.length) {
  errors.forEach((error) => console.error(`ERROR ${error}`));
  process.exitCode = 1;
} else {
  const template = readFileSync(templatePath, "utf8");
  tarotTopics.forEach((topic) => {
    const outputPath = getTopicOutputPath(rootDir, topic);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, renderPage(template, topic));
    console.log(`Generated ${getTopicRoute(topic)} -> ${outputPath.replace(`${rootDir}/`, "")}`);
  });
  updateSitemap(tarotTopics);
  console.log(`Updated sitemap.xml with ${tarotTopics.length} Tarot topic route`);
}
