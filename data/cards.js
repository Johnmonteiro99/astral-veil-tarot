// Core tarot card data. Add Minor Arcana cards here later without changing renderers.
// Deck-specific art, event access, and future premium metadata belongs in data/decks.js.
const majorArcanaCards = [
  {
    id: "the-fool",
    number: 0,
    name: "The Fool",
    keywords: ["new beginnings", "risk", "freedom", "trust", "unknown"],
    shortMeaning: "A new path opens before you.",
    summary: "The Fool begins the journey with openness, curiosity, and the courage to move before every answer is known. This card invites trust in possibility while reminding you to stay awake to the consequences of your choices.",
    uprightMeaning: "New beginnings, optimism, innocence, freedom, exploration, and trust in the unfolding path.",
    shadowMeaning: "Recklessness, avoidance, immaturity, blind risk, or stepping forward without awareness.",
    reflectionQuestion: "Where are you being asked to begin again without knowing the full outcome?",
    themes: ["beginning", "risk", "freedom", "unknown"],
    archetype: "The Wanderer",
    energy: "positive",
    image: "assets/images/cards/original/the-fool.jpg",
    bloodMoon: {
      shortMeaning: "A step into the unknown becomes a step toward the Veil.",
      summary: "Beneath the Blood Moon, The Fool is the moment before the hidden world notices your movement. Every leap carries a shadow, and every doorway asks what part of you is willing to disappear.",
      shadowMessage: "You may be confusing freedom with escape. The path is open, but something unseen is walking near it.",
      veilHint: "Some thresholds do not open from the outside."
    }
  },
  {
    id: "the-magician",
    number: 1,
    name: "The Magician",
    keywords: ["will", "focus", "skill", "creation", "power"],
    shortMeaning: "Your intention is ready to become action.",
    summary: "The Magician gathers energy, tools, and attention into one clear act of creation. This card asks you to stop waiting for perfect conditions and begin shaping what is already within reach.",
    uprightMeaning: "Manifestation, confidence, resourcefulness, skill, focused action, and conscious creation.",
    shadowMeaning: "Manipulation, scattered effort, unused gifts, false confidence, or forcing an outcome.",
    reflectionQuestion: "What could change if you used the tools already in your hands?",
    themes: ["manifestation", "skill", "intention", "power"],
    archetype: "The Weaver",
    energy: "positive",
    image: "assets/images/cards/original/the-magician.jpg",
    bloodMoon: {
      shortMeaning: "Intention becomes ritual under crimson light.",
      summary: "Under the Blood Moon, The Magician works with forbidden fire, old symbols, and forces that answer only precise desire. Power is available, but it listens closely to motive.",
      shadowMessage: "A gift can become a spell cast against yourself when hunger outruns wisdom.",
      veilHint: "Every invocation leaves a fingerprint."
    }
  },
  {
    id: "the-high-priestess",
    number: 2,
    name: "The High Priestess",
    keywords: ["intuition", "mystery", "silence", "inner knowing", "secrets"],
    shortMeaning: "The quiet truth is asking to be heard.",
    summary: "The High Priestess points toward inner wisdom, hidden knowledge, and the sacred space between knowing and speaking. She asks you to trust subtle signals and let the unseen reveal itself in its own time.",
    uprightMeaning: "Intuition, mystery, spiritual insight, dreams, patience, and hidden knowledge.",
    shadowMeaning: "Ignored intuition, secrecy, emotional withdrawal, confusion, or being seduced by mystery alone.",
    reflectionQuestion: "What do you already know, but have not fully admitted to yourself?",
    themes: ["intuition", "mystery", "secrets", "wisdom"],
    archetype: "The Oracle",
    energy: "mysterious",
    image: "assets/images/cards/original/high-priestess.jpg",
    bloodMoon: {
      shortMeaning: "A secret behind the Veil begins breathing.",
      summary: "Beneath the Blood Moon, The High Priestess guards the door where old myths, spirits, and hidden entities whisper through symbols. The truth is present, but it may not arrive in a human shape.",
      shadowMessage: "Silence is not always wisdom. Some secrets grow teeth when they are never named.",
      veilHint: "The oldest archives answer only when no one is watching."
    }
  },
  {
    id: "the-empress",
    number: 3,
    name: "The Empress",
    keywords: ["nurture", "creation", "abundance", "beauty", "growth"],
    shortMeaning: "Something tender is ready to grow.",
    summary: "The Empress brings creativity, embodiment, care, and natural abundance. She reminds you that growth is not forced; it is cultivated through attention, patience, and a willingness to receive.",
    uprightMeaning: "Creativity, fertility, comfort, beauty, sensuality, nurturing, and generous growth.",
    shadowMeaning: "Overgiving, creative stagnation, dependency, neglect, smothering care, or disconnection from the body.",
    reflectionQuestion: "What in your life needs gentler care before it can fully bloom?",
    themes: ["creation", "nurture", "abundance", "body"],
    archetype: "The Garden",
    energy: "positive",
    image: "assets/images/cards/original/the-empress.jpg",
    bloodMoon: {
      shortMeaning: "The dark garden blooms with beautiful warnings.",
      summary: "Under the Blood Moon, The Empress is fertile shadow: folklore forests, hungry roots, and the strange life that grows where grief is buried. Creation asks to be fed with truth, not innocence.",
      shadowMessage: "What nurtures you may also bind you if care becomes possession or hunger.",
      veilHint: "Not every flower in the Veil opens for the living."
    }
  },
  {
    id: "the-emperor",
    number: 4,
    name: "The Emperor",
    keywords: ["structure", "authority", "discipline", "protection", "order"],
    shortMeaning: "Build the structure that can hold your life.",
    summary: "The Emperor represents stability, leadership, and the discipline needed to protect what matters. He asks for grounded decisions, clear boundaries, and a form strong enough to support growth.",
    uprightMeaning: "Authority, responsibility, structure, protection, leadership, and practical discipline.",
    shadowMeaning: "Control, rigidity, domination, emotional distance, fear of vulnerability, or brittle rules.",
    reflectionQuestion: "Where do you need stronger boundaries without becoming hardened?",
    themes: ["structure", "authority", "boundaries", "discipline"],
    archetype: "The Sovereign",
    energy: "balanced",
    image: "assets/images/cards/original/the-emperor.jpg",
    bloodMoon: {
      shortMeaning: "A throne of oath and bone demands honest rule.",
      summary: "Beneath the Blood Moon, The Emperor guards a haunted kingdom of laws, bloodlines, and old bargains. Order can protect you, but fear disguised as authority becomes a fortress with no door.",
      shadowMessage: "Control may be feeding the very instability you are trying to prevent.",
      veilHint: "A crown remembers every hand that reached for it."
    }
  },
  {
    id: "the-hierophant",
    number: 5,
    name: "The Hierophant",
    keywords: ["tradition", "teaching", "belief", "ritual", "guidance"],
    shortMeaning: "Wisdom arrives through lineage, learning, or sacred practice.",
    summary: "The Hierophant speaks of tradition, mentorship, belief systems, and the rituals that give life meaning. He invites you to learn from what came before while discerning which teachings still serve your spirit.",
    uprightMeaning: "Spiritual guidance, tradition, learning, shared values, ritual, and trusted mentorship.",
    shadowMeaning: "Dogma, conformity, false teachers, spiritual pressure, or inherited beliefs that limit growth.",
    reflectionQuestion: "Which belief supports your becoming, and which one keeps you small?",
    themes: ["tradition", "belief", "learning", "ritual"],
    archetype: "The Keeper",
    energy: "neutral",
    image: "assets/images/cards/original/the-hierophant.jpg",
    bloodMoon: {
      shortMeaning: "The old rites wake and ask who taught you fear.",
      summary: "Under the Blood Moon, The Hierophant becomes a keeper of forbidden scripture, village warnings, ancestral rites, and doors sealed for a reason. Sacred knowledge is powerful, but obedience is not the same as truth.",
      shadowMessage: "Beware a doctrine that demands your soul before it offers wisdom.",
      veilHint: "Some prayers were first written as locks."
    }
  },
  {
    id: "the-lovers",
    number: 6,
    name: "The Lovers",
    keywords: ["choice", "union", "alignment", "desire", "values"],
    shortMeaning: "A meaningful choice asks for honest alignment.",
    summary: "The Lovers is about connection, devotion, values, and the choices that reveal who you are. It may speak of relationship, but its deeper message is alignment between heart, desire, and truth.",
    uprightMeaning: "Love, harmony, shared values, conscious choice, vulnerability, and meaningful union.",
    shadowMeaning: "Misalignment, temptation, avoidance of choice, projection, dependency, or desire without honesty.",
    reflectionQuestion: "What choice would bring your heart and actions into clearer alignment?",
    themes: ["choice", "love", "alignment", "values"],
    archetype: "The Mirror",
    energy: "positive",
    image: "assets/images/cards/original/the-lovers.jpg",
    bloodMoon: {
      shortMeaning: "Desire becomes a mirror with something behind it.",
      summary: "Beneath the Blood Moon, The Lovers reveals devotion, temptation, vampire hunger, and the old folklore truth that not every beautiful invitation is safe. Love shows both the bond and the shadow it awakens.",
      shadowMessage: "A longing may be speaking in your voice while leading you away from yourself.",
      veilHint: "The Veil keeps a record of every vow made in the dark."
    }
  },
  {
    id: "the-chariot",
    number: 7,
    name: "The Chariot",
    keywords: ["willpower", "direction", "victory", "control", "momentum"],
    shortMeaning: "Move with purpose and command your direction.",
    summary: "The Chariot brings determination, discipline, and forward motion. It asks you to align competing forces within yourself so your energy moves as one clear, intentional current.",
    uprightMeaning: "Drive, confidence, victory, self-control, focus, and purposeful progress.",
    shadowMeaning: "Aggression, scattered direction, force without wisdom, burnout, or trying to outrun the inner conflict.",
    reflectionQuestion: "What part of you needs to be guided rather than forced?",
    themes: ["movement", "willpower", "direction", "control"],
    archetype: "The Victor",
    energy: "transformative",
    image: "assets/images/cards/original/the-chariot.jpg",
    bloodMoon: {
      shortMeaning: "The blood-lit road opens for the one who holds the reins.",
      summary: "Under the Blood Moon, The Chariot races through haunted roads, strange lights, and beasts of impulse pulling in opposite directions. Victory requires command of the inner creatures, not denial of them.",
      shadowMessage: "Ambition without self-mastery becomes a charge toward a trap.",
      veilHint: "The road moves differently when it knows you are afraid."
    }
  },
  {
    id: "strength",
    number: 8,
    name: "Strength",
    keywords: ["courage", "patience", "compassion", "inner power", "restraint"],
    shortMeaning: "Gentle courage is stronger than force.",
    summary: "Strength represents calm bravery, compassion, and the ability to meet instinct without being ruled by it. This card asks you to lead with steadiness, not domination.",
    uprightMeaning: "Inner courage, patience, compassion, resilience, self-trust, and graceful restraint.",
    shadowMeaning: "Self-doubt, raw impulse, suppressed anger, fear, shame, or mistaking force for power.",
    reflectionQuestion: "Where would gentleness give you more power than pressure?",
    themes: ["courage", "compassion", "instinct", "resilience"],
    archetype: "The Tamer",
    energy: "balanced",
    image: "assets/images/cards/original/strength.jpg",
    bloodMoon: {
      shortMeaning: "The beast within lowers its head, but remembers everything.",
      summary: "Beneath the Blood Moon, Strength meets the wolf, the monster, and the feared self from old stories. The task is not to kill the beast, but to understand the wound that made it snarl.",
      shadowMessage: "The creature inside you has mistaken fear for freedom.",
      veilHint: "Most monsters become less monstrous when called by their true name."
    }
  },
  {
    id: "the-hermit",
    number: 9,
    name: "The Hermit",
    keywords: ["solitude", "wisdom", "reflection", "guidance", "search"],
    shortMeaning: "Step inward to find the light you need.",
    summary: "The Hermit turns away from noise to seek wisdom, clarity, and inner guidance. This card suggests a pause for reflection, study, and honest listening to the soul.",
    uprightMeaning: "Solitude, introspection, spiritual study, patience, guidance, and inner illumination.",
    shadowMeaning: "Isolation, withdrawal, avoidance, loneliness, secrecy, or refusing help when it is needed.",
    reflectionQuestion: "What truth becomes clearer when you step away from the noise?",
    themes: ["solitude", "wisdom", "search", "guidance"],
    archetype: "The Seeker",
    energy: "mysterious",
    image: "assets/images/cards/original/the-hermit.jpg",
    bloodMoon: {
      shortMeaning: "A lone lantern burns where maps become unreliable.",
      summary: "Under the Blood Moon, The Hermit enters caves, abandoned towers, and places where folklore says not to look too long. Solitude can reveal hidden truth, but it can also become a locked room.",
      shadowMessage: "You may be calling it wisdom when it is really distance from being seen.",
      veilHint: "The lantern does not only show the path. It shows who has followed."
    }
  },
  {
    id: "wheel-of-fortune",
    number: 10,
    name: "Wheel of Fortune",
    keywords: ["cycles", "change", "fate", "turning point", "pattern"],
    shortMeaning: "The wheel is turning, and a pattern is changing.",
    summary: "Wheel of Fortune brings movement, cycles, timing, and the mystery of forces larger than personal control. It asks you to notice what is shifting and respond with flexibility.",
    uprightMeaning: "Change, opportunity, timing, destiny, cycles, luck, and a new turn in the story.",
    shadowMeaning: "Resistance, repeated patterns, instability, fatalism, or refusing to learn from cycles.",
    reflectionQuestion: "What repeating pattern is asking for a different response?",
    themes: ["change", "cycles", "fate", "pattern"],
    archetype: "The Turning Wheel",
    energy: "transformative",
    image: "assets/images/cards/original/wheel-of-fortune.jpg",
    bloodMoon: {
      shortMeaning: "The wheel turns through omen, eclipse, and old consequence.",
      summary: "Beneath the Blood Moon, fortune feels less random and more like an ancient mechanism beneath the world. Strange coincidences, watchers, and returning myths point toward a pattern asking to be named.",
      shadowMessage: "The same shadow will keep wearing new masks until you recognize its rhythm.",
      veilHint: "Fate is often a door disguised as repetition."
    }
  },
  {
    id: "justice",
    number: 11,
    name: "Justice",
    keywords: ["truth", "balance", "accountability", "fairness", "clarity"],
    shortMeaning: "Truth asks to be met without distortion.",
    summary: "Justice brings clarity, accountability, and the balancing of action with consequence. It asks for honesty, careful decisions, and the courage to see your part in the outcome.",
    uprightMeaning: "Fairness, truth, integrity, accountability, contracts, decisions, and moral clarity.",
    shadowMeaning: "Avoidance, dishonesty, imbalance, harsh judgment, denial, or consequences being ignored.",
    reflectionQuestion: "What would become possible if you stopped arguing with the truth?",
    themes: ["truth", "balance", "choice", "accountability"],
    archetype: "The Scales",
    energy: "balanced",
    image: "assets/images/cards/original/justice.jpg",
    bloodMoon: {
      shortMeaning: "The crimson scales weigh what was hidden.",
      summary: "Under the Blood Moon, Justice is the blade that cuts through glamour, false memory, secret pacts, and beautiful excuses. The Veil does not punish truth; it reveals what denial has cost.",
      shadowMessage: "A lie dressed as mercy still bends the scales.",
      veilHint: "The Veil keeps receipts in languages older than law."
    }
  },
  {
    id: "the-hanged-man",
    number: 12,
    name: "The Hanged Man",
    keywords: ["pause", "surrender", "perspective", "sacrifice", "waiting"],
    shortMeaning: "A pause may reveal what effort cannot.",
    summary: "The Hanged Man asks for surrender, patience, and a new way of seeing. Progress may come from releasing control long enough for a deeper perspective to arrive.",
    uprightMeaning: "Pause, surrender, acceptance, altered perspective, patience, and meaningful sacrifice.",
    shadowMeaning: "Stagnation, martyrdom, resistance, needless delay, or waiting to avoid a choice.",
    reflectionQuestion: "What might you understand differently if you stopped trying to force movement?",
    themes: ["pause", "surrender", "perspective", "release"],
    archetype: "The Suspended One",
    energy: "neutral",
    image: "assets/images/cards/original/the-hanged-man.jpg",
    bloodMoon: {
      shortMeaning: "Suspended beneath the red moon, the world finally turns honest.",
      summary: "Beneath the Blood Moon, The Hanged Man hangs between worlds, like a soul caught in a folk tale bargain. The inverted view reveals the door, but only if you stop bargaining with the sacrifice.",
      shadowMessage: "You may be hanging by threads of your own refusal.",
      veilHint: "In the Veil, upside down is sometimes the only truthful direction."
    }
  },
  {
    id: "death",
    number: 13,
    name: "Death",
    keywords: ["ending", "release", "transformation", "rebirth", "threshold"],
    shortMeaning: "An ending clears the way for transformation.",
    summary: "Death marks necessary endings, release, and the deep transformation that follows surrender. It does not speak of failure; it speaks of what cannot continue in its old form.",
    uprightMeaning: "Endings, transition, transformation, renewal, release, and the courage to let a cycle close.",
    shadowMeaning: "Resistance, decay, fear of change, clinging, unfinished grief, or refusing the next form.",
    reflectionQuestion: "What are you carrying that cannot cross into your next chapter?",
    themes: ["ending", "transformation", "release", "rebirth"],
    archetype: "The Threshold",
    energy: "transformative",
    image: "assets/images/cards/original/death.jpg",
    bloodMoon: {
      shortMeaning: "The black gate opens, and the old self cannot enter whole.",
      summary: "Under the Blood Moon, Death is a crossing of body, soul, and story. Folklore ferrymen, grave paths, and spirit doors gather around this card to ask what must be released before rebirth can begin.",
      shadowMessage: "The dead thing you keep carrying is shaping the future in its image.",
      veilHint: "Nothing buried in the Veil stays silent forever."
    }
  },
  {
    id: "temperance",
    number: 14,
    name: "Temperance",
    keywords: ["balance", "healing", "moderation", "integration", "alchemy"],
    shortMeaning: "Healing comes through balance and integration.",
    summary: "Temperance blends opposing forces into a wiser whole. It asks for patience, moderation, and the gentle alchemy of healing what has been separated within you.",
    uprightMeaning: "Balance, healing, patience, moderation, harmony, integration, and spiritual alignment.",
    shadowMeaning: "Excess, impatience, imbalance, avoidance of healing, extremes, or forced harmony.",
    reflectionQuestion: "What needs to be blended, softened, or brought back into balance?",
    themes: ["balance", "healing", "integration", "harmony"],
    archetype: "The Alchemist",
    energy: "balanced",
    image: "assets/images/cards/original/temperance.jpg",
    bloodMoon: {
      shortMeaning: "Crimson and silver are poured into one forbidden cup.",
      summary: "Beneath the Blood Moon, Temperance becomes shadow alchemy: venom into medicine, grief into wisdom, myth into warning. Healing begins where opposing forces are allowed to speak without devouring each other.",
      shadowMessage: "The mixture curdles when hunger tries to impersonate healing.",
      veilHint: "The oldest potions require exactly one honest wound."
    }
  },
  {
    id: "the-devil",
    number: 15,
    name: "The Devil",
    keywords: ["attachment", "temptation", "shadow", "obsession", "power"],
    shortMeaning: "Name the chain, and you begin to loosen it.",
    summary: "The Devil reveals attachment, temptation, shame, and the patterns that make you feel trapped. It asks for honest recognition of desire and the power to reclaim choice.",
    uprightMeaning: "Attachment, temptation, obsession, limitation, shadow work, desire, and confronting bondage.",
    shadowMeaning: "Denial, addiction, manipulation, self-sabotage, shame loops, or giving power away.",
    reflectionQuestion: "What has power over you because it has remained unnamed?",
    themes: ["attachment", "shadow", "desire", "limitation"],
    archetype: "The Chain",
    energy: "challenging",
    image: "assets/images/cards/original/the-devil.jpg",
    bloodMoon: {
      shortMeaning: "The chain glitters beautifully under the eclipse.",
      summary: "Under the Blood Moon, The Devil speaks through vampires, bargains, beautiful traps, and the monsters humans create from hunger. This card asks you to face the contract beneath the craving.",
      shadowMessage: "Something may be feeding on the part of you that still calls the hunger love.",
      veilHint: "Every chain has a maker, and every maker has a name."
    }
  },
  {
    id: "the-tower",
    number: 16,
    name: "The Tower",
    keywords: ["collapse", "revelation", "disruption", "truth", "awakening"],
    shortMeaning: "What cannot stand in truth begins to fall.",
    summary: "The Tower brings sudden change, revelation, and the collapse of structures built on denial. Though unsettling, it clears false stability so something more honest can be rebuilt.",
    uprightMeaning: "Upheaval, awakening, breakthrough, disruption, revelation, and the end of false security.",
    shadowMeaning: "Fear of change, delayed collapse, denial, chaos without learning, or clinging to a broken structure.",
    reflectionQuestion: "What truth is trying to break through the structure you have outgrown?",
    themes: ["collapse", "revelation", "awakening", "truth"],
    archetype: "The Lightning",
    energy: "challenging",
    image: "assets/images/cards/original/the-tower.jpg",
    bloodMoon: {
      shortMeaning: "The Veil cracks, and the false sky falls.",
      summary: "Beneath the Blood Moon, The Tower is the moment the world secret leaks through the wall. Lightning exposes hidden entities, false histories, and realities that were never as solid as they seemed.",
      shadowMessage: "Delay may not prevent the collapse; it may only teach it to arrive louder.",
      veilHint: "When a tower falls, listen for what was trapped underneath."
    }
  },
  {
    id: "the-star",
    number: 17,
    name: "The Star",
    keywords: ["hope", "renewal", "healing", "guidance", "faith"],
    shortMeaning: "Hope returns as a quiet form of guidance.",
    summary: "The Star offers renewal, inspiration, and healing after difficulty. It reminds you that hope is not denial; it is the steady light that helps the spirit remember its future.",
    uprightMeaning: "Hope, healing, inspiration, faith, renewal, openness, and gentle guidance.",
    shadowMeaning: "Despair, disconnection, cynicism, loss of faith, or refusing comfort after pain.",
    reflectionQuestion: "What small light is still available, even after everything you have endured?",
    themes: ["hope", "healing", "guidance", "renewal"],
    archetype: "The Beacon",
    energy: "positive",
    image: "assets/images/cards/original/the-star.jpg",
    bloodMoon: {
      shortMeaning: "A strange light survives above the crimson dark.",
      summary: "Under the Blood Moon, The Star becomes distant watchers, impossible lights in the sky, and guidance from beyond the known world. Hope is not soft tonight; it is a signal that something still sees you.",
      shadowMessage: "Do not mistake distance for abandonment. The light may be guiding from farther away than expected.",
      veilHint: "Some stars are not stars. Some are doors looking back."
    }
  },
  {
    id: "the-moon",
    number: 18,
    name: "The Moon",
    keywords: ["illusion", "dreams", "fear", "intuition", "unknown"],
    shortMeaning: "Not everything is visible yet.",
    summary: "The Moon leads you through uncertainty, dreams, intuition, and fear. It asks you to move carefully, trust inner signals, and wait for clarity before treating shadows as facts.",
    uprightMeaning: "Illusion, intuition, dreams, mystery, fear, uncertainty, and subconscious messages.",
    shadowMeaning: "Confusion, projection, deception, anxiety, hidden motives, or being ruled by fear.",
    reflectionQuestion: "What fear might be shaping the story before the truth has arrived?",
    themes: ["illusion", "fear", "intuition", "unknown"],
    archetype: "The Dream",
    energy: "mysterious",
    image: "assets/images/cards/original/the-moon.jpg",
    bloodMoon: {
      shortMeaning: "Every shadow learns your name beneath the bleeding moon.",
      summary: "Beneath the Blood Moon, The Moon is the dream-path where spirits, folklore beings, hidden watchers, and half-remembered fears move behind perception. Intuition matters, but every shape must be questioned.",
      shadowMessage: "A nightmare may be protecting a truth you are almost ready to see.",
      veilHint: "Moonlight reveals by refusing to explain."
    }
  },
  {
    id: "the-sun",
    number: 19,
    name: "The Sun",
    keywords: ["joy", "clarity", "vitality", "success", "warmth"],
    shortMeaning: "Clarity and vitality return.",
    summary: "The Sun brings warmth, truth, joy, and the relief of being able to see clearly. It suggests confidence, success, and the simple medicine of letting life become brighter.",
    uprightMeaning: "Joy, clarity, vitality, success, confidence, play, and life-giving warmth.",
    shadowMeaning: "False optimism, burnout, ego, overexposure, delayed joy, or hiding pain behind brightness.",
    reflectionQuestion: "Where are you ready to let life become simpler, warmer, and more honest?",
    themes: ["clarity", "joy", "vitality", "truth"],
    archetype: "The Radiance",
    energy: "positive",
    image: "assets/images/cards/original/the-sun.jpg",
    bloodMoon: {
      shortMeaning: "A fierce light pierces the red veil.",
      summary: "Under the Blood Moon, The Sun is truth returning through crimson atmosphere, exposing what fear made monstrous. Even strange worlds and hidden beings cannot remain distorted forever in this light.",
      shadowMessage: "Beware the smile that hides exhaustion or the victory that asks you to disappear.",
      veilHint: "The brightest revelations still cast shadows."
    }
  },
  {
    id: "judgement",
    number: 20,
    name: "Judgement",
    keywords: ["awakening", "calling", "renewal", "reckoning", "release"],
    shortMeaning: "A deeper calling asks you to rise.",
    summary: "Judgement is awakening, reflection, and the moment the soul hears its next call. It asks you to review the past without becoming trapped by it, then choose renewal.",
    uprightMeaning: "Awakening, calling, reckoning, forgiveness, renewal, and stepping into a truer self.",
    shadowMeaning: "Self-judgment, avoidance, shame, fear of change, refusing the call, or living by old verdicts.",
    reflectionQuestion: "What part of you is ready to answer a call you can no longer ignore?",
    themes: ["awakening", "reckoning", "calling", "renewal"],
    archetype: "The Summoning",
    energy: "transformative",
    image: "assets/images/cards/original/judgement.jpg",
    bloodMoon: {
      shortMeaning: "A red trumpet sounds from beyond the Veil.",
      summary: "Beneath the Blood Moon, Judgement is a summons from ancestors, spirits, buried selves, and forgotten promises. The soul is asked to answer for what it has become and what it still may choose.",
      shadowMessage: "Avoidance becomes its own verdict when the spirit refuses to rise.",
      veilHint: "The call is loudest when you pretend not to hear it."
    }
  },
  {
    id: "the-world",
    number: 21,
    name: "The World",
    keywords: ["completion", "wholeness", "integration", "fulfillment", "cycle"],
    shortMeaning: "A cycle completes and becomes part of you.",
    summary: "The World marks completion, integration, and the fulfillment that comes from reaching the end of a meaningful cycle. It asks you to honor how far you have traveled before beginning again.",
    uprightMeaning: "Completion, wholeness, achievement, integration, fulfillment, and readiness for a new cycle.",
    shadowMeaning: "Unfinished lessons, delayed closure, fragmentation, fear of completion, or refusing to receive success.",
    reflectionQuestion: "What lesson is ready to become part of your wholeness?",
    themes: ["completion", "integration", "wholeness", "cycle"],
    archetype: "The Circle",
    energy: "positive",
    image: "assets/images/cards/original/the-world.jpg",
    bloodMoon: {
      shortMeaning: "The circle closes, whole and haunted.",
      summary: "Under the Blood Moon, The World is the completed crossing: myth, shadow, strange knowledge, and every threshold carried as part of the crown. You do not return unchanged from the Veil.",
      shadowMessage: "One final hidden truth may need integration before the gate releases you.",
      veilHint: "Every ending in the Veil remembers its first doorway."
    }
  }
];

function sentenceCase(value) {
  const text = String(value || "").trim();

  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getBaseCardId(card) {
  return String(card?.originalCardId || card?.id || "").replace(/^blood-moon-/, "");
}

function getCardUprightMeaning(card) {
  const bloodMoon = card?.bloodMoon || {};
  const isBloodMoonCard = Boolean(card?.isBloodMoonCard || card?.originalCardId);

  if (isBloodMoonCard) {
    return {
      summary: bloodMoon.shortMeaning || card.shortMeaning || "",
      meaning: bloodMoon.summary || card.summary || "",
      reflection: bloodMoon.veilHint || card.reflectionQuestion || "",
      shadow: bloodMoon.shadowMessage || card.shadowMeaning || ""
    };
  }

  return {
    summary: card.shortMeaning || "",
    meaning: card.summary || "",
    reflection: card.reflectionQuestion || "",
    shadow: card.shadowMeaning || "",
    keywords: card.uprightMeaning || ""
  };
}

function createReversedMeaning(card) {
  const shadow = sentenceCase(card.shadowMeaning || "Blocked momentum, avoidance, or an inner pattern asking for attention.");
  const reflection = card.reflectionQuestion || "Where is this energy asking for a more honest response?";

  return {
    summary: `${card.name} reversed asks you to notice where this energy is blocked, delayed, or turned inward.`,
    meaning: `${card.name} reversed brings ${shadow.toLowerCase()} into focus. The message is not failure; it is an invitation to slow down, name the distortion, and choose with clearer awareness.`,
    reflection: reflection.replace(/\?$/, "") + "?",
    shadow
  };
}

function createBloodMoonReversedMeaning(card) {
  const bloodMoon = card.bloodMoon || {};
  const shadow = sentenceCase(bloodMoon.shadowMessage || card.shadowMeaning || "The avoided pattern is asking to be confronted.");

  return {
    summary: `${card.name} reversed does not whisper beneath the Blood Moon. It points at the pattern you have been circling.`,
    meaning: `${shadow} This reversal is blunt medicine: stop decorating the avoidance, look at the wound, and decide what no longer gets to steer you.`,
    reflection: bloodMoon.veilHint || card.reflectionQuestion || "What truth becomes unavoidable when the shadow stops being excused?",
    shadow
  };
}

function withOrientationMeanings(card) {
  const reversed = card.reversed || createReversedMeaning(card);
  const bloodMoonReversed = card.bloodMoon?.reversed || createBloodMoonReversedMeaning(card);

  return {
    ...card,
    upright: card.upright || {
      summary: card.shortMeaning,
      meaning: card.summary,
      reflection: card.reflectionQuestion,
      keywords: card.uprightMeaning
    },
    reversed,
    bloodMoon: {
      ...card.bloodMoon,
      upright: card.bloodMoon?.upright || {
        summary: card.bloodMoon?.shortMeaning || card.shortMeaning,
        meaning: card.bloodMoon?.summary || card.summary,
        reflection: card.bloodMoon?.veilHint || card.reflectionQuestion
      },
      reversed: bloodMoonReversed
    }
  };
}

function getCardReversedMeaning(card) {
  const baseCard = majorArcanaCards.find((item) => item.id === getBaseCardId(card));
  const sourceCard = card?.reversed ? card : baseCard || card;
  const isBloodMoonCard = Boolean(card?.isBloodMoonCard || card?.originalCardId);

  if (isBloodMoonCard) {
    return sourceCard?.bloodMoon?.reversed || createBloodMoonReversedMeaning(sourceCard || card);
  }

  return sourceCard?.reversed || createReversedMeaning(sourceCard || card);
}

function getCardOrientation(card) {
  return card?.orientation === "reversed" || card?.isReversed ? "reversed" : "upright";
}

function getCardOrientationName(card) {
  return getCardOrientation(card) === "reversed" ? "Reversed" : "Upright";
}

function getCardReadingMeaning(card) {
  return getCardOrientation(card) === "reversed"
    ? getCardReversedMeaning(card)
    : getCardUprightMeaning(card);
}

const orientedMajorArcanaCards = majorArcanaCards.map(withOrientationMeanings);

const tarotDeck = majorArcanaCards.map((card) => ({
  ...withOrientationMeanings(card),
  meaning: card.shortMeaning
}));

// Production Blood Moon deck art only. Keep draft images out of this mapping.
const bloodMoonCardImages = {
  "the-fool": "bloodmoon-fool.png",
  "the-magician": "bloodmoon-magician.png",
  "the-high-priestess": "bloodmoon-high-priestess.png",
  "the-empress": "bloodmoon-empress.png",
  "the-emperor": "bloodmoon-emperor.png",
  "the-hierophant": "bloodmoon-hierophant.png",
  "the-lovers": "bloodmoon-lovers.png",
  "the-chariot": "bloodmoon-chariot.png",
  strength: "bloodmoon-strength.png",
  "the-hermit": "bloodmoon-hermit.png",
  "wheel-of-fortune": "bloodmoon-wheel-fortune.png",
  justice: "bloodmoon-justice.png",
  "the-hanged-man": "bloodmoon-hanged-man.png",
  death: "bloodmoon-death.png",
  temperance: "bloodmoon-temperance.png",
  "the-devil": "bloodmoon-devil.png",
  "the-tower": "bloodmoon-tower.png",
  "the-star": "bloodmoon-star.png",
  "the-moon": "bloodmoon-moon.png",
  "the-sun": "bloodmoon-sun.png",
  judgement: "bloodmoon-judgement.png",
  "the-world": "loodmoon-world.png"
};

const bloodMoonDeck = {
  id: "bloodMoon",
  name: "Blood Moon Deck",
  cards: tarotDeck.map((card) => ({
    ...card,
    id: `blood-moon-${card.id}`,
    originalCardId: card.id,
    image: `assets/images/cards/blood-moon/${bloodMoonCardImages[card.id]}`,
    meaning: card.bloodMoon.shortMeaning,
    isBloodMoonCard: true
  }))
};
