// Noctis Archive chamber registry.
// The renderer in js/archive.js reads these fields to build the selector rail, featured viewer,
// same-page chamber views, and future unlock-ready room metadata.
const archiveRooms = [
  {
    id: "entry-desk",
    title: "The Entry Desk",
    description: "The first threshold of the archive. Notes, loose files, and unfinished records wait beneath the candlelight.",
    status: "Open",
    image: "assets/images/noctis/entry-desk.png",
    type: "orientation",
    isLocked: false,
    intro: "A narrow desk waits beneath a low red flame. Loose evidence, partial notes, and early discoveries are gathered here before the archive decides where they belong.",
    items: []
  },
  {
    id: "shelves",
    title: "The Shelves",
    description: "Unbound writings gathered from places the archive refuses to name.",
    status: "Open",
    image: "assets/images/noctis/shelves.png",
    type: "manuscripts",
    isLocked: false,
    intro: "The shelves hold unbound journals, letters, and manuscripts recovered from places the archive refuses to name.",
    items: []
  },
  {
    id: "gallery",
    title: "The Gallery",
    description: "Recovered images, portraits, and visual records preserved behind dark glass.",
    status: "Open",
    image: "assets/images/noctis/gallery.png",
    type: "visual-records",
    isLocked: false,
    intro: "Images, portraits, diagrams, and visual records are preserved here behind dark glass.",
    items: []
  },
  {
    id: "restricted-wing",
    title: "The Restricted Wing",
    description: "Classified records and redacted studies remain sealed behind restricted access.",
    status: "Restricted",
    image: "assets/images/noctis/restricted-wing.png",
    type: "restricted-files",
    isLocked: true,
    requirement: "Clearance not recognized",
    lockedMessage: "The archive does not recognize your clearance.",
    items: []
  },
  {
    id: "memory-vault",
    title: "The Memory Vault",
    description: "Scattered memories are stored here, but the vault has not opened.",
    status: "Locked",
    image: "assets/images/noctis/memory-vault.png",
    type: "fragments",
    isLocked: true,
    requirement: "Recovery incomplete",
    lockedMessage: "The vault requires something not yet recovered.",
    items: []
  },
  {
    id: "inner-chamber",
    title: "The Inner Chamber",
    description: "A sealed chamber buried deeper within the archive.",
    status: "Sealed",
    image: "assets/images/noctis/inner-chamber.png",
    type: "deep-archive",
    isLocked: true,
    requirement: "Route unavailable",
    lockedMessage: "This room is indexed, but unreachable.",
    items: []
  },
  {
    id: "veiled-gate",
    title: "The Veiled Gate",
    description: "No destination is recorded. No entry path is visible.",
    status: "Locked",
    image: "assets/images/noctis/veiled-gate.png",
    type: "portal",
    isLocked: true,
    requirement: "Path sealed",
    lockedMessage: "This room does not open from this side.",
    items: []
  }
];
