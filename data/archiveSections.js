// Noctis Archive sections. Static panel bodies still live in archive.html for now because
// moving the full manuscript layout would be higher risk; this metadata drives the index.
const archiveSections = [
  {
    id: "journal",
    index: "01",
    label: "Zephyra's Journal",
    target: "zephyra-journal",
    requiredEvent: "bloodMoon"
  },
  {
    id: "research",
    index: "04",
    label: "Veil Research",
    target: "veil-research",
    requiredEvent: "bloodMoon"
  },
  {
    id: "records",
    index: "09",
    label: "Visual Records",
    target: "visual-records",
    requiredEvent: "bloodMoon"
  },
  {
    id: "fragments",
    index: "13",
    label: "Restricted Fragments",
    target: "restricted-fragments",
    requiredEvent: "bloodMoon"
  }
];

// Future recovered images can be added here. Place files in
// assets/images/noctis/visual-records/ and use that relative path below.
const visualRecords = [
  {
    id: "veil-duality-study",
    title: "Veil Duality Study",
    image: "assets/images/noctis/visual-records/the-veil-trine.png",
    caption: "A recovered visual study of the Veil, where light and shadow reflect across the line between worlds.",
    status: "Recovered"
  },
  {
    id: "scorpio-aquarius-library-study",
    title: "Library Study",
    image: "assets/images/noctis/visual-records/bloodmoon-visual2.png",
    caption: "A recovered record of two Veilwalkers searching through forbidden shelves beneath the Blood Moon.",
    status: "Recovered"
  },
  {
    id: "eclipse-gate-study",
    title: "Eclipse Gate Study",
    image: "",
    caption: "Image pending recovery.",
    status: "Pending"
  },
  {
    id: "veil-fracture-map",
    title: "Veil Fracture Map",
    image: "",
    caption: "Image pending recovery.",
    status: "Pending"
  }
];
