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
    image: "assets/images/cards/original/the-fool.webp",
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
    image: "assets/images/cards/original/the-magician.webp",
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
    image: "assets/images/cards/original/high-priestess.webp",
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
    image: "assets/images/cards/original/the-empress.webp",
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
    image: "assets/images/cards/original/the-emperor.webp",
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
    image: "assets/images/cards/original/the-hierophant.webp",
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
    image: "assets/images/cards/original/the-lovers.webp",
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
    image: "assets/images/cards/original/the-chariot.webp",
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
    image: "assets/images/cards/original/strength.webp",
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
    image: "assets/images/cards/original/the-hermit.webp",
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
    image: "assets/images/cards/original/wheel-of-fortune.webp",
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
    image: "assets/images/cards/original/justice.webp",
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
    image: "assets/images/cards/original/the-hanged-man.webp",
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
    image: "assets/images/cards/original/death.webp",
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
    image: "assets/images/cards/original/temperance.webp",
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
    image: "assets/images/cards/original/the-devil.webp",
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
    image: "assets/images/cards/original/the-tower.webp",
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
    image: "assets/images/cards/original/the-star.webp",
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
    image: "assets/images/cards/original/the-moon.webp",
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
    image: "assets/images/cards/original/the-sun.webp",
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
    image: "assets/images/cards/original/judgement.webp",
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
    image: "assets/images/cards/original/the-world.webp",
    bloodMoon: {
      shortMeaning: "The circle closes, whole and haunted.",
      summary: "Under the Blood Moon, The World is the completed crossing: myth, shadow, strange knowledge, and every threshold carried as part of the crown. You do not return unchanged from the Veil.",
      shadowMessage: "One final hidden truth may need integration before the gate releases you.",
      veilHint: "Every ending in the Veil remembers its first doorway."
    }
  }
];

const bloodMoonMajorArcanaMeanings = {
  "the-fool": {
    upright: {
      summary: "A threshold opens before the shadow has finished speaking.",
      meaning: "The Fool beneath the Blood Moon steps toward a beginning that is not innocent, but necessary. This card asks whether you are answering a true call, or running toward the unknown because the familiar has become too painful to face.",
      shadow: "The hidden pattern is escape disguised as freedom.",
      reflection: "What are you trying to outrun, and what would change if you crossed the threshold awake?",
      thread: "The Fool shows where a new beginning may also be an old escape wearing brighter clothes."
    },
    reversed: {
      summary: "The leap stalls where fear and impulse wrestle in the dark.",
      meaning: "The Fool reversed beneath the Blood Moon reveals reckless escape, frozen courage, or innocence that no longer wants to see its own shadow. This card asks where the part of you that learned to survive by fleeing is now asking to choose with open eyes.",
      shadow: "A doorway can become a hiding place when the old fear chooses the direction.",
      reflection: "Where are you mistaking motion for liberation?",
      thread: "The Fool reversed points to a beginning delayed by fear, impulse, or the old urge to disappear."
    }
  },
  "the-magician": {
    upright: {
      summary: "Power gathers where intention stops pretending.",
      meaning: "The Magician beneath the Blood Moon reveals the spell beneath the action: motive, hunger, focus, and hidden will. This card asks whether your power is being used to create honestly, or to control what you are afraid to lose.",
      shadow: "The shadow is not power itself, but the secret bargain behind its use.",
      reflection: "What intention would remain if every performance fell away?",
      thread: "The Magician shows where hidden intention is shaping the ritual more than the visible act."
    },
    reversed: {
      summary: "The spell bends when the will refuses truth.",
      meaning: "The Magician reversed beneath the Blood Moon reveals manipulation, scattered force, or a gift turned sideways by fear. This card asks where you are using skill to avoid honesty, or letting another person's illusion overwrite your own knowing.",
      shadow: "A false spell feeds on the part of you that wants an outcome more than truth.",
      reflection: "Where has cleverness become a mask for avoidance?",
      thread: "The Magician reversed exposes power used without clean intention."
    }
  },
  "the-high-priestess": {
    upright: {
      summary: "The buried knowing waits behind the veil.",
      meaning: "The High Priestess beneath the Blood Moon guards the truth that has been felt before it can be proven. This card asks you to listen for the secret beneath the secret, especially where silence has become heavy with meaning.",
      shadow: "The shadow is the knowing you keep treating as a rumor.",
      reflection: "What have you already sensed, but refused to name?",
      thread: "The High Priestess reveals the quiet truth that has been waiting beneath silence."
    },
    reversed: {
      summary: "The inner oracle is muffled by fear, secrecy, or denial.",
      meaning: "The High Priestess reversed beneath the Blood Moon reveals ignored intuition, hidden motives, or a secret kept so long it has begun to shape the room. This card asks where you have silenced your own knowing to keep an old arrangement intact.",
      shadow: "A buried truth does not vanish; it learns to speak through unease.",
      reflection: "Where are you choosing not to know what you already know?",
      thread: "The High Priestess reversed points to intuition muted by fear or secrecy."
    }
  },
  "the-empress": {
    upright: {
      summary: "The dark garden asks what your hunger has been feeding.",
      meaning: "The Empress beneath the Blood Moon reveals comfort, creation, and longing with roots deep in the unseen. This card asks whether what you nurture is alive, or whether care has become a way to keep grief from touching the light.",
      shadow: "The hidden hunger may be asking for tenderness through the language of possession.",
      reflection: "What are you feeding because you are afraid to let it wither?",
      thread: "The Empress shows where care, comfort, and longing have grown around a buried wound."
    },
    reversed: {
      summary: "The garden withers where receiving has become unsafe.",
      meaning: "The Empress reversed beneath the Blood Moon reveals blocked nourishment, smothering care, or a refusal to receive what the spirit still craves. This card asks where tenderness became tangled with debt, guilt, or the fear of needing too much.",
      shadow: "The wound may be guarding the gate where softness should enter.",
      reflection: "Where do you deny yourself care before anyone else can withhold it?",
      thread: "The Empress reversed reveals a hunger for care twisted by fear, guilt, or refusal."
    }
  },
  "the-emperor": {
    upright: {
      summary: "The throne asks whether protection has become a wall.",
      meaning: "The Emperor rises beneath the Blood Moon as the part of you that wants order because chaos once cost too much. His shadow asks whether your structure protects your life, or only guards the old wound from being touched.",
      shadow: "Control may be wearing the mask of safety.",
      reflection: "Where does structure protect you, and where does it keep the wound untouched?",
      thread: "The Emperor shows where order may be protecting life or guarding an old wound."
    },
    reversed: {
      summary: "The throne cracks where fear has hardened into rule.",
      meaning: "The Emperor reversed reveals control that has begun to rot from the inside. This card asks where fear is disguising itself as authority, and where rigidity has become a throne built around pain.",
      shadow: "The hidden wound has turned command into armor.",
      reflection: "Where has rigidity become a throne built around pain?",
      thread: "The Emperor reversed shows where control has become armor around an old fear."
    }
  },
  "the-hierophant": {
    upright: {
      summary: "The old rite asks which belief still owns your voice.",
      meaning: "The Hierophant beneath the Blood Moon reveals inherited vows, sacred masks, and teachings that may have outlived their truth. This card asks whether your devotion is chosen, or whether obedience is still speaking through you.",
      shadow: "The old rule may be calling itself wisdom to avoid being questioned.",
      reflection: "Which belief frees your spirit, and which one only preserves the old fear?",
      thread: "The Hierophant reveals inherited vows and beliefs asking to be tested against truth."
    },
    reversed: {
      summary: "The sacred mask slips from the face of control.",
      meaning: "The Hierophant reversed beneath the Blood Moon exposes false authority, spiritual performance, or rebellion that still revolves around the old altar. This card asks where you are ready to leave a teaching that demanded your silence as proof of devotion.",
      shadow: "A broken doctrine can still rule if your choices are shaped around it.",
      reflection: "Where are you still bowing to a rule you no longer believe?",
      thread: "The Hierophant reversed exposes the old doctrine losing power over the self."
    }
  },
  "the-lovers": {
    upright: {
      summary: "Desire and truth stand together beneath the red moon.",
      meaning: "The Lovers beneath the Blood Moon expose the bond between desire and truth. This card asks whether your choices come from devotion, longing, fear of loss, or the hunger to be chosen.",
      shadow: "Longing can speak in the voice of destiny when it fears being alone.",
      reflection: "What choice would still feel true if the hunger to be chosen went quiet?",
      thread: "The Lovers reveal where desire, devotion, and truth must answer to one another."
    },
    reversed: {
      summary: "The mirror darkens where attachment has replaced alignment.",
      meaning: "The Lovers reversed reveal attachment where alignment has gone silent. This card asks where you keep reaching for connection that requires you to abandon a piece of yourself.",
      shadow: "The ache to be held may be bargaining with self-betrayal.",
      reflection: "Where does connection ask too high a price from your own spirit?",
      thread: "The Lovers reversed reveals the ache of choosing connection at the cost of self-betrayal."
    }
  },
  "the-chariot": {
    upright: {
      summary: "The reins tighten around desire, fear, and momentum.",
      meaning: "The Chariot beneath the Blood Moon moves through survival fire, ambition, and the need to outrun what waits in stillness. This card asks whether you are directing your force, or letting urgency choose the road.",
      shadow: "The hidden pattern is motion used to avoid being caught by feeling.",
      reflection: "What are you trying to conquer because sitting still would reveal too much?",
      thread: "The Chariot shows where momentum may be command or flight from stillness."
    },
    reversed: {
      summary: "The wheels drag where control has lost its center.",
      meaning: "The Chariot reversed beneath the Blood Moon reveals scattered force, burnout, or a battle with yourself disguised as a destination. This card asks where pushing harder has become a way to avoid asking why the road feels haunted.",
      shadow: "Force without direction becomes another form of surrender.",
      reflection: "Where has urgency taken the reins from your deeper will?",
      thread: "The Chariot reversed points to force, burnout, or motion without inner command."
    }
  },
  strength: {
    upright: {
      summary: "The beast bows when met without shame.",
      meaning: "Strength beneath the Blood Moon reveals the instinct you have feared, hidden, or tried to master by force. This card asks for power that does not dominate the beast, but understands the wound that taught it to bare its teeth.",
      shadow: "The untamed part may be protecting something tender.",
      reflection: "What instinct needs a name instead of a cage?",
      thread: "Strength shows where the feared instinct may become power when met without shame."
    },
    reversed: {
      summary: "The beast breaks loose where gentleness was denied.",
      meaning: "Strength reversed beneath the Blood Moon reveals suppressed anger, self-doubt, or force turned inward until it becomes a private war. This card asks where the mask of control has kept your true power starving.",
      shadow: "The old wound snarls when it is treated as an enemy.",
      reflection: "Where have you confused containment with healing?",
      thread: "Strength reversed reveals suppressed instinct asking for truth instead of domination."
    }
  },
  "the-hermit": {
    upright: {
      summary: "The lantern enters the room you avoided.",
      meaning: "The Hermit beneath the Blood Moon is sacred solitude with a blade of truth inside it. This card asks whether you are withdrawing to hear the soul, or disappearing so no one can touch the hidden place.",
      shadow: "Solitude becomes shadow when it protects the wound from all witness.",
      reflection: "Where does your silence bring wisdom, and where does it keep you unreachable?",
      thread: "The Hermit reveals solitude as either sacred guidance or a hiding place."
    },
    reversed: {
      summary: "The lantern dims behind a locked inner door.",
      meaning: "The Hermit reversed beneath the Blood Moon reveals isolation, avoidance, or wisdom hoarded until it becomes loneliness. This card asks where you have mistaken being unseen for being safe.",
      shadow: "The hidden self may be starving behind the door it built.",
      reflection: "Who might you become if you let the lantern be seen?",
      thread: "The Hermit reversed points to isolation that has begun to imitate protection."
    }
  },
  "wheel-of-fortune": {
    upright: {
      summary: "The cycle returns with a name carved into it.",
      meaning: "The Wheel of Fortune beneath the Blood Moon reveals a pattern returning until it is understood. This card asks you to stop calling the repetition random and look for the old vow turning beneath it.",
      shadow: "Fate may be the name you give a pattern you have not yet claimed.",
      reflection: "What keeps returning because it has not been witnessed clearly?",
      thread: "The Wheel of Fortune shows the repeating cycle asking to be recognized."
    },
    reversed: {
      summary: "The wheel catches on the same hidden wound.",
      meaning: "The Wheel of Fortune reversed beneath the Blood Moon reveals resistance, fatalism, or a cycle that keeps finding the same door back into your life. This card asks where the old pattern is being fed by the belief that nothing can change.",
      shadow: "The loop survives when resignation feels easier than choice.",
      reflection: "Where have you mistaken repetition for destiny?",
      thread: "The Wheel of Fortune reversed reveals a cycle sustained by resignation or avoidance."
    }
  },
  justice: {
    upright: {
      summary: "The crimson scales weigh the truth you cannot unsee.",
      meaning: "Justice beneath the Blood Moon cuts through glamour, excuse, and half-truth. This card asks for clear accountability: not punishment, but the power that returns when the pattern is named without distortion.",
      shadow: "The hidden cost of denial has reached the scales.",
      reflection: "What truth would restore balance if you stopped bargaining with it?",
      thread: "Justice reveals the truth, consequence, and accountability beneath the pattern."
    },
    reversed: {
      summary: "The scales tilt where denial has been protected.",
      meaning: "Justice reversed beneath the Blood Moon reveals evasion, unfairness, or a truth bent to preserve an old comfort. This card asks where you are avoiding consequence, or accepting a false verdict because it feels familiar.",
      shadow: "A distorted truth can become a cage if it is repeated long enough.",
      reflection: "Where are the scales asking you to stop protecting the lie?",
      thread: "Justice reversed exposes denial, imbalance, or a truth bent out of shape."
    }
  },
  "the-hanged-man": {
    upright: {
      summary: "The suspended soul sees what motion concealed.",
      meaning: "The Hanged Man beneath the Blood Moon asks for surrender without self-erasure. This card reveals the place where release has been delayed because letting go would expose what the sacrifice has cost.",
      shadow: "The pause may be holy, or it may be fear dressed as patience.",
      reflection: "What would you see if you stopped bargaining with the release?",
      thread: "The Hanged Man reveals the truth that appears only when control is suspended."
    },
    reversed: {
      summary: "The rope tightens where surrender has become refusal.",
      meaning: "The Hanged Man reversed beneath the Blood Moon reveals paralysis, martyrdom, or a sacrifice that no longer carries meaning. This card asks where waiting has become a way to avoid choosing what must be released.",
      shadow: "The old vow keeps you hanging because it fears the ground.",
      reflection: "Where has patience become another name for avoidance?",
      thread: "The Hanged Man reversed points to surrender delayed until it becomes a cage."
    }
  },
  death: {
    upright: {
      summary: "The old self reaches the gate and cannot pass unchanged.",
      meaning: "Death beneath the Blood Moon is the ending that reveals what has been kept alive past its season. This card asks you to release the identity, attachment, or grief that cannot cross into the next form.",
      shadow: "The dead thing may still be steering because it has not been buried with truth.",
      reflection: "What are you carrying that belongs to a version of you already gone?",
      thread: "Death shows the ending that must be honored before transformation can begin."
    },
    reversed: {
      summary: "The gate will not open while the old skin is clutched.",
      meaning: "Death reversed beneath the Blood Moon reveals resisted endings, unfinished grief, or a fear of becoming unrecognizable to yourself. This card asks where clinging to the old form has begun to cost more than the change.",
      shadow: "The cycle decays when it is kept alive by fear.",
      reflection: "What ending are you refusing because it would ask you to become new?",
      thread: "Death reversed reveals transformation resisted by attachment to the old self."
    }
  },
  temperance: {
    upright: {
      summary: "The shadow and the medicine pour into one cup.",
      meaning: "Temperance beneath the Blood Moon is inner alchemy: grief with wisdom, anger with restraint, desire with truth. This card asks where the divided parts of you are ready to stop fighting and begin transforming each other.",
      shadow: "The wound may need integration, not exile.",
      reflection: "Which opposing forces inside you are asking to be mixed with honesty?",
      thread: "Temperance reveals the alchemy of bringing divided inner forces into truth."
    },
    reversed: {
      summary: "The cup spills where imbalance has been disguised as peace.",
      meaning: "Temperance reversed beneath the Blood Moon reveals excess, avoidance, or forced harmony that keeps the real wound unnamed. This card asks where you are calling something balanced only because the conflict has been buried.",
      shadow: "Peace becomes false when one part of the self is silenced.",
      reflection: "Where has moderation become a mask for not feeling fully?",
      thread: "Temperance reversed exposes imbalance hidden beneath forced calm."
    }
  },
  "the-devil": {
    upright: {
      summary: "The chain shines where the hidden hunger has been fed.",
      meaning: "The Devil beneath the Blood Moon reveals craving, shame, obsession, and the contracts made in the dark. This card asks you to name the chain without flinching, because what is named can no longer rule from behind the mask.",
      shadow: "The hidden hunger calls the chain comfort because freedom feels unfamiliar.",
      reflection: "What has power over you because part of you still calls it protection?",
      thread: "The Devil reveals the chain, craving, or shame-pattern asking to be named."
    },
    reversed: {
      summary: "The chain loosens, but the old hunger still knows your name.",
      meaning: "The Devil reversed beneath the Blood Moon reveals the moment a bond can be broken, if you stop romanticizing the cage. This card asks where liberation is possible, and where the old craving still bargains for one more night.",
      shadow: "Freedom may feel frightening when bondage has become familiar.",
      reflection: "What chain is ready to break, and what part of you still reaches for it?",
      thread: "The Devil reversed points to a chain loosening while the old craving asks to return."
    }
  },
  "the-tower": {
    upright: {
      summary: "The false shelter breaks and the buried truth enters.",
      meaning: "The Tower beneath the Blood Moon is collapse as revelation. This card asks where the structure was never safe, only familiar, and what truth is breaking through because the old walls refused to open.",
      shadow: "False safety can become more dangerous than the storm.",
      reflection: "What is falling because it could no longer hold the truth?",
      thread: "The Tower shows the collapse that exposes what false safety concealed."
    },
    reversed: {
      summary: "The lightning waits where collapse has been delayed.",
      meaning: "The Tower reversed beneath the Blood Moon reveals a truth held back, a breakdown postponed, or a warning ignored until it grows louder. This card asks where you are patching the wall instead of leaving the burning room.",
      shadow: "Avoided collapse gathers force in silence.",
      reflection: "What warning keeps returning because you have not acted on it?",
      thread: "The Tower reversed reveals a delayed collapse pressing against the walls."
    }
  },
  "the-star": {
    upright: {
      summary: "A guarded light survives after the ruin.",
      meaning: "The Star beneath the Blood Moon is hope after the place where hope felt dangerous. This card asks you to trust the small signal without demanding it become daylight all at once.",
      shadow: "The wound may distrust hope because it remembers disappointment.",
      reflection: "What light are you afraid to believe in again?",
      thread: "The Star reveals the guarded hope that survives after ruin."
    },
    reversed: {
      summary: "The light is present, but the wound refuses to look up.",
      meaning: "The Star reversed beneath the Blood Moon reveals guarded healing, despair, or the fear of trusting beauty after loss. This card asks where you have mistaken protection for refusing every sign of renewal.",
      shadow: "The old hurt may call hope foolish to keep itself safe.",
      reflection: "Where are you denying the light before it can disappoint you?",
      thread: "The Star reversed points to hope withheld because believing again feels dangerous."
    }
  },
  "the-moon": {
    upright: {
      summary: "The dream-path opens where fear learned to wear faces.",
      meaning: "The Moon beneath the Blood Moon reveals illusion, projection, hidden memory, and the stories fear tells in the dark. This card asks you to move slowly, question every shape, and listen for the truth beneath the image.",
      shadow: "The shadow may be a fear wearing the mask of intuition.",
      reflection: "What story might be fear speaking before truth has arrived?",
      thread: "The Moon reveals illusion, fear, and hidden memory shaping the path."
    },
    reversed: {
      summary: "The fog thins, and the old fear loses its costume.",
      meaning: "The Moon reversed beneath the Blood Moon reveals distortion beginning to clear, or a hidden truth rising from beneath projection. This card asks where you are ready to stop believing the nightmare simply because it has been familiar.",
      shadow: "The fear loses power when its mask is named.",
      reflection: "What becomes visible when the old illusion stops being fed?",
      thread: "The Moon reversed points to fear and projection beginning to lose their disguise."
    }
  },
  "the-sun": {
    upright: {
      summary: "The red light exposes what the shadow made monstrous.",
      meaning: "The Sun beneath the Blood Moon is not simple joy; it is exposure, truth, and the courage to be seen without the old mask. This card asks where the light is revealing strength in what you once hid.",
      shadow: "Being seen may frighten the part of you that survived by staying dim.",
      reflection: "What truth is ready for daylight, even if your old self trembles?",
      thread: "The Sun reveals the truth that becomes power when brought into light."
    },
    reversed: {
      summary: "The light is blocked by the fear of being witnessed.",
      meaning: "The Sun reversed beneath the Blood Moon reveals false brightness, hidden exhaustion, or the fear that truth will expose too much. This card asks where you are performing radiance while a quieter part of you asks to be seen honestly.",
      shadow: "The mask of brightness can hide a deeper hunger for truth.",
      reflection: "Where are you smiling over something that needs light, not performance?",
      thread: "The Sun reversed exposes false brightness and the fear of being truly seen."
    }
  },
  judgement: {
    upright: {
      summary: "The grave of the old self begins to speak.",
      meaning: "Judgement beneath the Blood Moon is not gentle awakening. It is the voice that calls from the grave of an old self, asking what truth you already know but keep postponing.",
      shadow: "The call becomes heavier each time it is refused.",
      reflection: "What truth have you already heard, but not yet answered?",
      thread: "Judgement points to the truth calling from the old self's grave."
    },
    reversed: {
      summary: "The call echoes behind a sealed door.",
      meaning: "Judgement reversed reveals the refusal to answer what your spirit has already heard. This card asks where guilt, shame, or fear of becoming someone new keeps you sealed inside an older version of yourself.",
      shadow: "The old self survives by convincing you the call can wait forever.",
      reflection: "What are you avoiding because answering it would require becoming someone new?",
      thread: "Judgement reversed points to the truth that keeps calling, even when the old self refuses to answer."
    }
  },
  "the-world": {
    upright: {
      summary: "The gate closes only after the lesson is claimed.",
      meaning: "The World beneath the Blood Moon reveals completion with every shadow included. This card asks whether you are ready to leave the cycle with its wisdom, rather than circling back for the familiar ache.",
      shadow: "The final threshold may require accepting the self you became in the dark.",
      reflection: "What cycle is complete, and what part of you is afraid to live beyond it?",
      thread: "The World reveals the cycle ready to close with its shadow integrated."
    },
    reversed: {
      summary: "The circle stays open where closure is feared.",
      meaning: "The World reversed beneath the Blood Moon reveals unfinished integration, delayed closure, or the fear of leaving a familiar cycle behind. This card asks where you keep returning to the threshold because completion would require a new identity.",
      shadow: "The old cycle tempts you back by promising a different ending without a different choice.",
      reflection: "Where are you refusing completion because the next self is still unknown?",
      thread: "The World reversed points to closure delayed by fear of leaving the cycle."
    }
  }
};

const bloodMoonExposureOverrides = {
  "the-moon": {
    upright: {
      headline: "The dream-path opens where fear learned to wear faces.",
      meaning: "The Moon beneath the Blood Moon reveals the mist between intuition and terror. It asks where old fear is shaping what you see before truth has had a chance to speak.",
      shadow: "Fear has learned to wear faces.",
      mask: "Confusion pretends to be intuition.",
      wound: "The old self may have learned to survive by reading danger into every shadow.",
      work: "Separate the vision from the fear. Not every dark shape is an omen.",
      veilHint: "Where are you mistaking fear for knowing?",
      thread: "The Moon reveals the places where fear has learned to speak in symbols."
    }
  },
  "the-devil": {
    upright: {
      headline: "The chain shines where the hidden hunger has been fed.",
      meaning: "The Devil beneath the Blood Moon reveals the bond between craving and captivity. It asks where comfort has become a collar, and where desire is being mistaken for devotion.",
      shadow: "Desire has become a chain.",
      mask: "The craving calls itself comfort.",
      wound: "A hidden hunger may have formed where something once felt missing, forbidden, or unsafe to need.",
      work: "Look at the chain without worshiping it. What can be named can begin to loosen.",
      veilHint: "What hunger has been guiding you from beneath the surface?",
      thread: "The Devil reveals where hunger has been dressed as devotion."
    }
  },
  "the-emperor": {
    reversed: {
      headline: "The throne has become a wall around the wound.",
      meaning: "The Emperor reversed reveals control that has begun to rot from the inside. This card asks where fear is disguising itself as authority, and where rigidity has become a throne built around pain.",
      shadow: "Control has hardened into protection.",
      mask: "Authority disguises fear.",
      wound: "Some part of the self may have learned that safety requires never bending.",
      work: "Loosen the hand around the crown. Power does not need to become a prison.",
      veilHint: "Where has control become louder than truth?",
      thread: "The Emperor reversed shows where fear has hardened into authority."
    }
  },
  "the-lovers": {
    reversed: {
      headline: "The bond remains, but the self has gone missing.",
      meaning: "The Lovers reversed reveal attachment where alignment has gone silent. This card asks where connection requires self-abandonment, and where longing has been mistaken for love.",
      shadow: "Connection has begun to cost the self.",
      mask: "Longing disguises itself as devotion.",
      wound: "Some part of the self may have learned that being chosen matters more than being whole.",
      work: "Ask what part of yourself has been left outside the door to keep the bond alive.",
      veilHint: "Where are you choosing connection at the cost of yourself?",
      thread: "The Lovers reversed reveals the ache of choosing connection at the cost of self-betrayal."
    }
  },
  judgement: {
    upright: {
      headline: "The grave of the old self begins to speak.",
      meaning: "Judgement beneath the Blood Moon is not gentle awakening. It is the voice that calls from the grave of an old self, asking what truth you already know but keep postponing.",
      shadow: "A truth has been heard, but not answered.",
      mask: "Delay disguises itself as waiting for the right time.",
      wound: "Some part of the self may have learned that becoming new means betraying who it once had to be.",
      work: "Name the calling. Stop negotiating with the version of yourself that only knows how to survive.",
      veilHint: "What truth have you already heard, but not yet answered?",
      thread: "Judgement shows where the old self still delays the call to become something truer."
    },
    reversed: {
      headline: "The call echoes, but the old self refuses to rise.",
      meaning: "Judgement reversed reveals the refusal to answer what the spirit has already heard. This card asks where guilt, shame, or fear of becoming someone new keeps the self sealed inside an older shape.",
      shadow: "The truth is known, but unanswered.",
      mask: "Avoidance disguises itself as not being ready.",
      wound: "Some part of the self may have learned that change means exile from who it used to be.",
      work: "Answer one truth without demanding the whole future reveal itself.",
      veilHint: "What calling keeps returning, even after you bury it?",
      thread: "Judgement reversed points to the truth that keeps calling, even when the old self refuses to answer."
    }
  }
};

function createBloodMoonExposureFallback(card, orientationKey, meaning) {
  const isReversed = orientationKey === "reversed";
  const cardName = `${card.name}${isReversed ? " reversed" : ""}`;
  const theme = card.themes?.[0] || "pattern";
  const secondTheme = card.themes?.[1] || "shadow";
  const archetype = String(card.archetype || card.name).replace(/^The\s+/i, "").toLowerCase();

  return {
    headline: meaning.summary || `${cardName} opens a Blood Moon threshold.`,
    shadow: meaning.shadow || `${cardName} exposes the ${theme} that has been moving beneath the surface.`,
    mask: `${cardName} disguises the pattern as ${isReversed ? "delay, refusal, or familiar unrest" : `necessary ${theme}`}.`,
    wound: `Some part of the self may have learned to survive by binding ${theme} to ${secondTheme}.`,
    work: `${cardName} asks you to face the old ${archetype} pattern without letting it choose the next step.`,
    veilHint: meaning.reflection || "What truth becomes visible under the Blood Moon?",
    thread: meaning.thread || `${cardName} reveals where ${theme} and ${secondTheme} meet the shadow.`
  };
}

function completeBloodMoonExposure(card, orientationKey) {
  const meaning = card.bloodMoon?.[orientationKey] || {};
  const fallback = createBloodMoonExposureFallback(card, orientationKey, meaning);
  const override = bloodMoonExposureOverrides[card.id]?.[orientationKey] || {};

  return {
    ...meaning,
    ...fallback,
    ...override,
    summary: override.headline || meaning.headline || meaning.summary || fallback.headline,
    headline: override.headline || meaning.headline || meaning.summary || fallback.headline,
    meaning: override.meaning || meaning.meaning || card.bloodMoon?.summary || card.summary || "",
    shadow: override.shadow || meaning.shadow || card.bloodMoon?.shadowMessage || card.shadowMeaning || fallback.shadow,
    veilHint: override.veilHint || meaning.veilHint || meaning.reflection || card.bloodMoon?.veilHint || fallback.veilHint,
    reflection: override.veilHint || meaning.reflection || meaning.veilHint || card.bloodMoon?.veilHint || fallback.veilHint,
    thread: override.thread || meaning.thread || fallback.thread
  };
}

majorArcanaCards.forEach((card) => {
  card.bloodMoon = {
    ...(card.bloodMoon || {}),
    ...(bloodMoonMajorArcanaMeanings[card.id] || {})
  };
  card.bloodMoon.upright = completeBloodMoonExposure(card, "upright");
  card.bloodMoon.reversed = completeBloodMoonExposure(card, "reversed");
});

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
    const upright = bloodMoon.upright || {};

    return {
      headline: upright.headline || upright.summary || bloodMoon.shortMeaning || card.shortMeaning || "",
      summary: upright.summary || bloodMoon.shortMeaning || card.shortMeaning || "",
      meaning: upright.meaning || bloodMoon.summary || card.summary || "",
      reflection: upright.reflection || upright.veilHint || bloodMoon.veilHint || card.reflectionQuestion || "",
      shadow: upright.shadow || bloodMoon.shadowMessage || card.shadowMeaning || "",
      mask: upright.mask || "",
      wound: upright.wound || "",
      work: upright.work || "",
      veilHint: upright.veilHint || upright.reflection || bloodMoon.veilHint || card.reflectionQuestion || "",
      thread: upright.thread || upright.summary || bloodMoon.shortMeaning || card.shortMeaning || ""
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
    summary: `${card.name} reversed turns the Blood Moon toward a hidden pattern asking for a name.`,
    meaning: `${shadow} This reversal asks you to look at the wound without ornament and decide what no longer gets to steer you.`,
    reflection: bloodMoon.veilHint || card.reflectionQuestion || "What truth becomes unavoidable when the shadow stops being excused?",
    shadow,
    mask: `${card.name} reversed disguises the pattern as delay, refusal, or familiar unrest.`,
    wound: "Some part of the self may have learned to survive by keeping the old pattern intact.",
    work: "Name the avoidance without ornament. The Blood Moon asks what no longer gets to steer you.",
    veilHint: bloodMoon.veilHint || card.reflectionQuestion || "What truth becomes unavoidable when the shadow stops being excused?",
    thread: `${card.name} reversed reveals the old pattern asking to be confronted.`
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
        headline: card.bloodMoon?.shortMeaning || card.shortMeaning,
        summary: card.bloodMoon?.shortMeaning || card.shortMeaning,
        meaning: card.bloodMoon?.summary || card.summary,
        reflection: card.bloodMoon?.veilHint || card.reflectionQuestion,
        shadow: card.bloodMoon?.shadowMessage || card.shadowMeaning,
        mask: `${card.name} disguises its shadow as a familiar pattern.`,
        wound: "Some part of the self may have learned to survive by keeping this pattern close.",
        work: "Let the Blood Moon show what is ready to be named.",
        veilHint: card.bloodMoon?.veilHint || card.reflectionQuestion,
        thread: card.bloodMoon?.shortMeaning || card.shortMeaning
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
  "the-fool": "bloodmoon-fool.webp",
  "the-magician": "bloodmoon-magician.webp",
  "the-high-priestess": "bloodmoon-high-priestess.webp",
  "the-empress": "bloodmoon-empress.webp",
  "the-emperor": "bloodmoon-emperor.webp",
  "the-hierophant": "bloodmoon-hierophant.webp",
  "the-lovers": "bloodmoon-lovers.webp",
  "the-chariot": "bloodmoon-chariot.webp",
  strength: "bloodmoon-strength.webp",
  "the-hermit": "bloodmoon-hermit.webp",
  "wheel-of-fortune": "bloodmoon-wheel-fortune.webp",
  justice: "bloodmoon-justice.webp",
  "the-hanged-man": "bloodmoon-hanged-man.webp",
  death: "bloodmoon-death.webp",
  temperance: "bloodmoon-temperance.webp",
  "the-devil": "bloodmoon-devil.webp",
  "the-tower": "bloodmoon-tower.webp",
  "the-star": "bloodmoon-star.webp",
  "the-moon": "bloodmoon-moon.webp",
  "the-sun": "bloodmoon-sun.webp",
  judgement: "bloodmoon-judgement.webp",
  "the-world": "loodmoon-world.webp"
};

const moonveilCardImages = {
  "the-fool": "moonveil_fool.png",
  "the-magician": "moonveil_magician.png",
  "the-high-priestess": "moonveil_high_priestess.png",
  "the-empress": "moonveil_empress.png",
  "the-emperor": "moonveil_emperor.png",
  "the-hierophant": "moonveil_hierophant.png",
  "the-lovers": "moonveil_lovers.png",
  "the-chariot": "moonveil_chariot.png",
  strength: "moonveil_strength.png",
  "the-hermit": "moonveil_hermit.png",
  "wheel-of-fortune": "moonveil_wheel_of_fortune.png",
  justice: "moonveil_justice.png",
  "the-hanged-man": "moonveil_hanged_man.png",
  death: "moonveil_death.png",
  temperance: "moonveil_temperance.png",
  "the-devil": "moonveil_devil.png",
  "the-tower": "moonveil_tower.png",
  "the-star": "moonveil_star.png",
  "the-moon": "moonveil_moon.png",
  "the-sun": "moonveil_sun.png",
  judgement: "moonveil_judgement.png",
  "the-world": "moonveil_world.png"
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

const moonveilDeck = {
  id: "moonveil",
  name: "Moonveil Deck",
  cards: tarotDeck.map((card) => ({
    ...card,
    id: `moonveil-${card.id}`,
    originalCardId: card.id,
    image: `assets/images/cards/moonveil/${moonveilCardImages[card.id] || card.image?.split("/").pop()}`,
    meaning: card.shortMeaning
  }))
};

if (typeof window !== "undefined") {
  window.majorArcanaCards = majorArcanaCards;
  window.tarotDeck = tarotDeck;
  window.bloodMoonDeck = bloodMoonDeck;
  window.moonveilDeck = moonveilDeck;
}
