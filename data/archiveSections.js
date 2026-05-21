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
    title: "Duality Fragment",
    image: "assets/images/noctis/visual-records/the-veil-trine.png",
    caption: "Recovered from an unstable visual record. Two forms appear on opposite sides of an unnamed divide. The archive does not explain the boundary. It only confirms the image was not meant to remain visible.",
    status: "Recovered"
  },
  {
    id: "scorpio-aquarius-library-study",
    title: "Library Study",
    image: "assets/images/noctis/visual-records/bloodmoon-visual2.png",
    caption: "Recovered from a shelf record with missing origin marks. Two figures search where the catalogue thins, but the page refuses to identify what they were meant to find.",
    status: "Recovered"
  },
  {
    id: "eclipse-gate-study",
    title: "Eclipse Gate Study",
    image: "",
    caption: "Recovery incomplete. The image appears in the index, but collapses before it can be opened.",
    status: "Pending"
  },
  {
    id: "veil-fracture-map",
    title: "Veil Fracture Map",
    image: "",
    caption: "Reference found without a stable image. Fracture lines are mentioned, then redacted by an unknown hand.",
    status: "Pending"
  }
];
