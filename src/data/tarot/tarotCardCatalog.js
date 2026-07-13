const MAJOR_ARCANA = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Hierophant",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Hanged Man",
  "Death",
  "Temperance",
  "The Devil",
  "The Tower",
  "The Star",
  "The Moon",
  "The Sun",
  "Judgement",
  "The World"
];

const MINOR_SUITS = ["wands", "cups", "swords", "pentacles"];

const MINOR_RANKS = [
  { rank: "ace", title: "Ace" },
  { rank: "two", title: "Two" },
  { rank: "three", title: "Three" },
  { rank: "four", title: "Four" },
  { rank: "five", title: "Five" },
  { rank: "six", title: "Six" },
  { rank: "seven", title: "Seven" },
  { rank: "eight", title: "Eight" },
  { rank: "nine", title: "Nine" },
  { rank: "ten", title: "Ten" },
  { rank: "page", title: "Page" },
  { rank: "knight", title: "Knight" },
  { rank: "queen", title: "Queen" },
  { rank: "king", title: "King" }
];

export const slugifyTarotTitle = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const TAROT_CARD_CATALOG = [
  ...MAJOR_ARCANA.map((title, number) => {
    const slug = slugifyTarotTitle(title);
    const paddedNumber = String(number).padStart(2, "0");

    return {
      id: `major-${paddedNumber}-${slug}`,
      slug,
      title,
      arcana: "major",
      suit: null,
      rank: null,
      number,
      order: number
    };
  }),
  ...MINOR_SUITS.flatMap((suit, suitIndex) =>
    MINOR_RANKS.map(({ rank, title }, rankIndex) => {
      const number = rankIndex + 1;
      const paddedNumber = String(number).padStart(2, "0");
      const cardTitle = `${title} of ${suit[0].toUpperCase()}${suit.slice(1)}`;
      const slug = slugifyTarotTitle(cardTitle);

      return {
        id: `${suit}-${paddedNumber}-${slug}`,
        slug,
        title: cardTitle,
        arcana: "minor",
        suit,
        rank,
        number,
        order: MAJOR_ARCANA.length + suitIndex * MINOR_RANKS.length + rankIndex
      };
    })
  )
];

