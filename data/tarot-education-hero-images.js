const imageRoot = "/assets/images/background%20_images";

function heroImage(fileName, width = 1672, height = 941) {
  return Object.freeze({
    src: `${imageRoot}/${fileName}`,
    width,
    height
  });
}

export const tarotEducationHeroImages = Object.freeze({
  "minor-arcana": Object.freeze({
    regular: heroImage("minor_arcana_header.png"),
    bloodMoon: heroImage("bloodmooo_minor_arcana_header.png"),
    position: "50% center",
    bloodMoonPosition: "50% center"
  }),
  "major-arcana": Object.freeze({
    regular: heroImage("major_arcana_header.png"),
    bloodMoon: heroImage("bloodmoon_major_arcana_header.png"),
    position: "52% center",
    bloodMoonPosition: "52% center"
  }),
  "tarot-history": Object.freeze({
    regular: heroImage("tarot_history_header.png"),
    bloodMoon: heroImage("bloodmoon_tarot_history_header.png"),
    position: "50% center",
    bloodMoonPosition: "50% center"
  }),
  "tarot-for-beginners": Object.freeze({
    regular: heroImage("tarot_for_beginners_header.png"),
    bloodMoon: heroImage("bloodmoon_tarot_for_beginners_header.png"),
    position: "52% center",
    bloodMoonPosition: "52% center"
  }),
  "tarot-spreads": Object.freeze({
    regular: heroImage("tarot_spreads_header.png"),
    bloodMoon: heroImage("bloodmoon_tarot_spread_header.png"),
    position: "52% center",
    bloodMoonPosition: "52% center"
  }),
  "tarot-vs-oracle": Object.freeze({
    regular: heroImage("tarot_vs_oracle_header.png"),
    bloodMoon: heroImage("bloodmoon_tarot_vs_oracle_header.png"),
    position: "52% center",
    bloodMoonPosition: "52% center"
  }),
  "tarot-vs-lenormand": Object.freeze({
    regular: heroImage("tarot_vs_lenormand_header.png"),
    bloodMoon: heroImage("bloodmoon_tarot_vs_lenormand_header.png"),
    position: "52% center",
    bloodMoonPosition: "52% center"
  }),
  "how-to-read-tarot": Object.freeze({
    regular: heroImage("how-to-read-tarot.png", 1448, 1086),
    bloodMoon: heroImage("bloodmoon_read_tarot_header.png"),
    position: "center right",
    bloodMoonPosition: "center right"
  })
});

export function getTarotEducationHeroImages(pageKey) {
  const images = tarotEducationHeroImages[pageKey];
  if (!images) throw new Error(`Unknown Tarot education hero key: ${pageKey}`);
  return images;
}
