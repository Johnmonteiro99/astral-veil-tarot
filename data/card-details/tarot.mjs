import { majorBatchTwo } from "./major-batch-two.mjs";
import { majorBatchThree } from "./major-batch-three.mjs";
import { wandsBatchOne } from "./wands-batch-one.mjs";
import { wandsBatchTwo } from "./wands-batch-two.mjs";
import { cupsBatchOne } from "./cups-batch-one.mjs";
import { cupsBatchTwo } from "./cups-batch-two.mjs";
import { swordsBatchOne } from "./swords-batch-one.mjs";
import { swordsBatchTwo } from "./swords-batch-two.mjs";
import { pentaclesBatchOne } from "./pentacles-batch-one.mjs";
import { pentaclesBatchTwo } from "./pentacles-batch-two.mjs";

export const tarotCardDetails = [
  {
    id: "the-fool",
    system: "tarot",
    slug: "the-fool",
    title: "The Fool",
    displayNumber: "0",
    sortOrder: 0,
    arcana: "Major Arcana",
    suit: null,
    rank: null,
    contentStatus: "approved",
    description: "The Fool embodies the unformed moment before the journey begins.",
    archetypalMessage: "The Fool represents the threshold of possibility: the moment before experience becomes identity and the journey has fully taken shape.",
    uprightMeaning: "New beginnings, openness, curiosity, optimism, freedom, experimentation, and trust in the unfolding path.",
    reversedMeaning: "Fear of beginning, poor preparation, impulsive decisions, resisting change, or stepping forward without considering the consequences.",
    shadowMeaning: "Freedom becomes escape. The Fool may chase novelty to avoid commitment, ignore necessary warnings, or mistake denial for faith.",
    reflection: "Where am I being invited to begin, and what responsibility must I carry with me?",
    keywords: ["New Beginnings", "Freedom", "Trust", "Innocence", "Adventure", "Optimism", "Potential", "Leap of Faith"],
    correspondences: [
      { label: "Number", value: "0" },
      { label: "Element", value: "Air" },
      { label: "Archetype", value: "The Wanderer" },
      { label: "Energy", value: "Beginning" },
      { label: "Lesson", value: "Trust with awareness" }
    ],
    identity: [
      { label: "Arcana", value: "Major Arcana" },
      { label: "Deck", value: "Veilrise Arcana" },
      { label: "Card", value: "0 · The Fool" },
      { label: "Position", value: "Before The Magician" }
    ],
    traditionalMeaning: "In traditional tarot, The Fool represents beginnings, innocence, possibility, spontaneity, and the willingness to enter unfamiliar territory. As card zero, The Fool exists before the established sequence of the Major Arcana and carries the potential of every path that may follow.",
    categories: {
      love: {
        upright: "A new emotional chapter may be beginning. Remain open to unexpected connections, fresh experiences, and allowing affection to unfold without forcing its destination.",
        reversed: "Excitement may be overshadowing emotional responsibility. A relationship could feel uncertain, impulsive, or difficult to define. Look carefully before taking a leap with someone who is not ready to meet you."
      },
      career: {
        upright: "A new opportunity, direction, or creative risk may be calling. You may not know where it leads yet, but curiosity and courage can reveal possibilities that certainty cannot.",
        reversed: "You may be delaying a necessary beginning or moving too quickly without preparation. Separate genuine opportunity from the desire to escape your current situation."
      },
      feelings: {
        upright: "You or another person may feel curious, hopeful, and drawn toward something new. The feelings are sincere, though they may still be unformed or difficult to predict.",
        reversed: "Feelings may be inconsistent, avoidant, or driven by impulse. Someone may enjoy the possibility of connection without being prepared for its emotional consequences."
      },
      advice: {
        upright: "Take the first step. You do not need to understand the entire journey before beginning, but you must remain awake to what the path teaches you.",
        reversed: "Pause before acting. Courage does not require recklessness. Gather what you need, examine the risks, and make sure fear or impatience is not choosing for you."
      },
      spiritual: {
        upright: "Release the belief that every step must be proven before it is taken. Your path may begin as a quiet pull toward something you cannot yet explain.",
        reversed: "Faith may have become avoidance, or fear may be disguising itself as caution. Return to stillness and determine whether you are resisting guidance or following an illusion."
      }
    },
    journey: {
      currentCard: "0 · The Fool",
      details: [
        { label: "Stage", value: "The Threshold" },
        { label: "Gift", value: "Openness" },
        { label: "Lesson", value: "Begin without certainty" },
        { label: "Risk", value: "Naivety" }
      ],
      nextCard: "I · The Magician",
      nextMessage: "Potential begins to take form.",
      summary: "The Fool carries every possibility but has not yet chosen what to become. The Magician is the first moment that possibility becomes intention."
    },
    commonQuestions: [
      { question: "Is The Fool a yes or no card?", answer: "The Fool generally leans toward yes, especially when the question concerns a beginning, exploration, or taking a thoughtful risk. It also asks whether you are prepared to accept uncertainty." },
      { question: "Is The Fool a positive card?", answer: "The Fool is usually hopeful and expansive, but it is not a promise that every leap is wise. Its optimism works best when openness is paired with awareness." },
      { question: "What does The Fool mean as a person?", answer: "It may describe someone adventurous, curious, unconventional, inexperienced, spontaneous, or unwilling to be confined by expectations." },
      { question: "What does The Fool mean as advice?", answer: "Begin. Stay curious, release the need for perfect certainty, and remain conscious of the responsibility that accompanies freedom." },
      { question: "What does The Fool reversed warn about?", answer: "It may warn against impulsiveness, avoidance, poor preparation, fear of starting, or confusing wishful thinking with trust." },
      { question: "What does it mean when The Fool appears repeatedly?", answer: "A repeated Fool may suggest that a new chapter is continuing to call you, or that an unresolved lesson around trust, risk, and responsibility needs your attention." }
    ],
    seo: {
      title: "The Fool Tarot Card Meaning: Love, Career & Advice | Astral Veil",
      description: "Explore The Fool tarot card meaning, including upright and reversed interpretations for love, career, feelings, spiritual guidance, advice, and personal growth.",
      twitterDescription: "Explore upright and reversed interpretations for The Fool tarot card through Astral Veil.",
      lastModified: "2026-07-21"
    },
    variants: {
      veilrise: {
        deckId: "astralVeilTarot",
        deckName: "Veilrise Arcana",
        cardId: "the-fool",
        image: "/assets/images/cards/astral-veil-tarot/major/00-the-fool.png",
        subtitle: "A new path opens before you.",
        astralVeilMeaning: "The Fool stands where the known world begins to dissolve. The path ahead cannot be proven, only entered. The card asks whether uncertainty is truly emptiness, or simply a reality not yet perceived.",
        reflectionPrompts: [
          "What new beginning is calling me forward right now?",
          "What would I do if I trusted myself completely?"
        ]
      },
      veilfall: {
        deckId: "astralVeilCrimson",
        deckName: "Veilfall Arcana",
        cardId: "astral-veil-crimson-the-fool",
        image: "/assets/images/cards/astral-veil-crimson/major/00-the-fool.png",
        subtitle: "Not every open path deserves your trust.",
        astralVeilMeaning: "The Fool approaches the edge believing freedom has no cost. Veilfall asks whether this leap is courage, or merely escape dressed in possibility. The unknown may liberate you, but it will not excuse what you refuse to see.",
        reflectionPrompts: [
          "Where am I mistaking impulse for freedom?",
          "What warning have I dismissed because it interfered with the story I wanted to believe?"
        ]
      }
    }
  },
  {
    id: "the-magician",
    system: "tarot",
    slug: "the-magician",
    title: "The Magician",
    displayNumber: "I",
    sortOrder: 1,
    arcana: "Major Arcana",
    suit: null,
    rank: null,
    contentStatus: "approved",
    description: "The Magician turns possibility into intention and intention into form.",
    archetypalMessage: "The Magician represents the moment potential becomes deliberate action. Knowledge, attention, and available resources are gathered and directed toward a chosen result.",
    uprightMeaning: "Manifestation, focused intention, resourcefulness, confidence, skill, communication, initiative, and transforming possibility into form.",
    reversedMeaning: "Scattered energy, unused ability, poor planning, self-doubt, deceptive communication, manipulation, or attempting to force an outcome without the necessary foundation.",
    shadowMeaning: "Creation becomes control. The Magician may use charm, knowledge, or influence to shape another person’s reality, conceal insecurity, or prove personal power at any cost.",
    reflection: "What am I capable of creating when my intention and actions finally agree?",
    keywords: ["Manifestation", "Intention", "Resourcefulness", "Skill", "Confidence", "Initiative", "Communication", "Personal Power"],
    correspondences: [
      { label: "Number", value: "1" },
      { label: "Element", value: "Air" },
      { label: "Planet", value: "Mercury" },
      { label: "Archetype", value: "The Alchemist" },
      { label: "Lesson", value: "Direct potential with intention" }
    ],
    identity: [
      { label: "Arcana", value: "Major Arcana" },
      { label: "Deck", value: "Veilrise Arcana" },
      { label: "Card", value: "I · The Magician" },
      { label: "Position", value: "After The Fool" }
    ],
    traditionalMeaning: "In traditional tarot, The Magician represents manifestation, focused will, skill, communication, and the ability to work consciously with available resources. The card suggests that potential alone is not enough: intention must be supported by attention, knowledge, and deliberate action.",
    categories: {
      love: {
        upright: "The Magician suggests attraction supported by initiative, confidence, and clear communication. A connection may grow when someone is willing to express interest openly and help create the relationship they hope to experience.",
        reversed: "Charm may be masking uncertainty, inconsistency, or a desire for control. Be alert to persuasive words that are not supported by action, and avoid shaping yourself merely to produce another person’s approval."
      },
      career: {
        upright: "You possess more of the skill, knowledge, or opportunity required than you may realize. Choose a direction, gather your resources, and begin turning preparation into visible work.",
        reversed: "Your abilities may be scattered across too many goals or weakened by hesitation. This card may also warn of poor planning, exaggerated promises, workplace manipulation, or talent being used without integrity."
      },
      feelings: {
        upright: "You or another person may feel confident, curious, and motivated to move the situation forward. There is a desire to communicate, create momentum, and discover what can be built through active participation.",
        reversed: "Someone’s intentions may be unclear, carefully managed, or more self-serving than they appear. Feelings could be genuine but hidden beneath performance, insecurity, or an effort to maintain control."
      },
      advice: {
        upright: "Stop waiting for perfect conditions. Work with what is already available, focus your attention, and let consistent action reveal what your potential can become.",
        reversed: "Examine where energy is being wasted, exaggerated, or directed toward appearances rather than progress. Rebuild trust in yourself through honest preparation and smaller, deliberate actions."
      },
      spiritual: {
        upright: "Your attention participates in the reality you experience. Align thought, speech, and action so that your spiritual values become visible through the life you are creating.",
        reversed: "Spiritual language or ritual may be concealing avoidance, ego, or the need to feel powerful. Return to humility and ask whether your practices are transforming your life or merely decorating your identity."
      }
    },
    journey: {
      currentCard: "I · The Magician",
      details: [
        { label: "Stage", value: "The Act of Will" },
        { label: "Gift", value: "Resourcefulness" },
        { label: "Lesson", value: "Give potential direction" },
        { label: "Risk", value: "Manipulation" }
      ],
      nextCard: "II · The High Priestess",
      nextMessage: "Action gives way to inner knowing.",
      summary: "The Fool carries limitless possibility into the journey. The Magician chooses where that possibility will be directed, while The High Priestess reveals what cannot be reached through action alone."
    },
    commonQuestions: [
      { question: "Is The Magician a yes or no card?", answer: "The Magician generally indicates yes, particularly when the outcome depends on initiative, communication, preparation, or using your abilities effectively. It asks you to participate actively rather than wait for events to arrange themselves." },
      { question: "Is The Magician a positive card?", answer: "The Magician is usually empowering and constructive. It represents capability and focused action, although its power can become manipulative or unfocused when intention is unclear." },
      { question: "What does The Magician mean as a person?", answer: "It may describe someone confident, articulate, adaptable, persuasive, talented, inventive, or highly aware of how to use available resources. In a difficult expression, the person may be controlling or deceptive." },
      { question: "What does The Magician mean as advice?", answer: "Clarify what you intend to create, take inventory of what is available, and begin acting with purpose. Your abilities become meaningful when they are directed consistently." },
      { question: "What does The Magician reversed warn about?", answer: "It may warn of manipulation, scattered effort, unused talent, misleading communication, weak preparation, or attempting to produce an outcome through appearance rather than substance." },
      { question: "What does it mean when The Magician appears repeatedly?", answer: "A repeating Magician may indicate that you are being asked to recognize your influence and use your abilities more deliberately. It can also ask whether your actions truly align with the outcome you claim to want." }
    ],
    seo: {
      title: "The Magician Tarot Card Meaning | Astral Veil",
      description: "Explore The Magician tarot card meaning, including upright and reversed interpretations, love, career, feelings, spiritual guidance, symbolism, reflection questions, and its place in the Major Arcana.",
      ogTitle: "The Magician Tarot Card Meaning",
      ogDescription: "Discover The Magician’s meanings, correspondences, life interpretations, reflection questions, and role within the Major Arcana journey.",
      twitterDescription: "Discover The Magician’s meanings, correspondences, life interpretations, reflection questions, and role within the Major Arcana journey.",
      lastModified: "2026-07-21"
    },
    variants: {
      veilrise: {
        deckId: "astralVeilTarot",
        deckName: "Veilrise Arcana",
        cardId: "the-magician",
        image: "/assets/images/cards/astral-veil-tarot/major/01-the-magician.png",
        imageAlt: "The Magician card from the Veilrise Arcana tarot deck",
        subtitle: "What you seek to create begins with what you choose to direct.",
        astralVeilMeaning: "The Magician discovers that reality is not shaped by desire alone, but by attention given form. Every thought, word, and action becomes part of the pattern being created. The card asks whether your power is scattered among possibilities, or gathered around something you are finally prepared to make real.",
        reflectionPrompts: [
          "What ability am I ready to use with greater confidence?",
          "Where could focused action accomplish more than continued preparation?"
        ]
      },
      veilfall: {
        deckId: "astralVeilCrimson",
        deckName: "Veilfall Arcana",
        cardId: "astral-veil-crimson-the-magician",
        image: "/assets/images/cards/astral-veil-crimson/major/01-the-magician.png",
        imageAlt: "The Magician card from the Veilfall Arcana tarot deck",
        subtitle: "Power reveals its price through the hand that wields it.",
        astralVeilMeaning: "The Magician learns how easily creation can become control. Talent may shape reality, but intention determines what kind of reality is being built. Veilfall asks whether your influence serves truth, or whether skill has become a polished disguise for fear, hunger, or manipulation.",
        reflectionPrompts: [
          "Where am I attempting to control what I am afraid to lose?",
          "What truth have I shaped, softened, or withheld to preserve my influence?"
        ]
      }
    }
  },
  {
    id: "the-high-priestess",
    system: "tarot",
    slug: "the-high-priestess",
    title: "The High Priestess",
    displayNumber: "II",
    sortOrder: 2,
    arcana: "Major Arcana",
    suit: null,
    rank: null,
    contentStatus: "approved",
    description: "The High Priestess holds the quiet space where perception deepens before certainty arrives.",
    archetypalMessage: "The High Priestess represents knowledge that cannot be reached through force. She stands at the threshold between conscious thought and the deeper intelligence revealed through silence, intuition, and patient attention.",
    uprightMeaning: "Intuition, inner knowing, mystery, receptivity, observation, spiritual awareness, hidden knowledge, patience, and listening beneath appearances.",
    reversedMeaning: "Disconnection from intuition, ignored inner warnings, confusion, concealed information, emotional withdrawal, passivity, or allowing outside voices to overpower personal knowing.",
    shadowMeaning: "Silence becomes concealment. The High Priestess may hide behind mystery, withhold truth to preserve control, or wait indefinitely because action would make inner knowledge accountable.",
    reflection: "What do I already understand beneath the noise, and why am I hesitating to trust it?",
    keywords: ["Intuition", "Mystery", "Inner Knowing", "Silence", "Receptivity", "Observation", "Patience", "Hidden Knowledge"],
    correspondences: [
      { label: "Number", value: "2" },
      { label: "Element", value: "Water" },
      { label: "Planet", value: "The Moon" },
      { label: "Archetype", value: "The Keeper of the Threshold" },
      { label: "Lesson", value: "Listen before acting" }
    ],
    identity: [
      { label: "Arcana", value: "Major Arcana" },
      { label: "Deck", value: "Veilrise Arcana" },
      { label: "Card", value: "II · The High Priestess" },
      { label: "Position", value: "After The Magician" }
    ],
    traditionalMeaning: "In traditional tarot, The High Priestess is associated with intuition, mystery, the subconscious, spiritual receptivity, and knowledge that is not yet visible. She invites patience around hidden information and reminds us that observation can be more useful than immediate action.",
    categories: {
      love: {
        upright: "A connection may benefit from patience, attentive listening, and room for feelings to unfold without pressure. Attraction can be real even when it is not fully expressed yet. Notice what is communicated through consistency, boundaries, and emotional tone rather than demanding immediate certainty.",
        reversed: "Unspoken feelings or mixed signals can create distance. Someone may be withholding, avoiding vulnerability, or relying on intuition while refusing a necessary conversation. Give ambiguity its proper weight, and do not build a future around information that has not been honestly shared."
      },
      career: {
        upright: "Research, observation, and strategic patience are useful before making a visible move. Important details may still be developing beneath the surface of a role, project, or workplace dynamic. Trust quiet expertise and allow time for a clearer pattern to emerge.",
        reversed: "Missing information, office secrecy, or self-doubt may be clouding a professional decision. Waiting can become avoidance when no new insight is being gathered. Clarify what is knowable, seek reliable context, and distinguish a genuine pause from fear of being seen."
      },
      feelings: {
        upright: "Feelings may be private, subtle, or still forming. You or another person could be observing carefully before speaking, especially where trust matters. The emotional truth is more likely to reveal itself through steady presence than through dramatic declarations.",
        reversed: "Emotional distance may be presented as calm, while uncertainty or fear remains unaddressed. Someone could be concealing a concern, misreading their own instincts, or waiting for impossible proof. Gentle honesty matters more than trying to decode every silence."
      },
      advice: {
        upright: "Reduce the noise before deciding. Give yourself enough quiet to notice recurring feelings, overlooked facts, and the difference between urgency and inner guidance. A measured response can be wiser than a fast solution when the situation has not fully revealed itself.",
        reversed: "Do not confuse delay with wisdom. If you already know what needs attention, choose one grounded action instead of hiding behind uncertainty. Seek perspective where needed, but avoid surrendering your judgment to louder voices or endless analysis."
      },
      spiritual: {
        upright: "A reflective practice can deepen your ability to notice what is already present. Dreams, body signals, contemplation, and silence may offer useful material without becoming supernatural proof. Let inner awareness inform your choices while staying connected to ordinary reality.",
        reversed: "Spiritual language may be covering avoidance or emotional withdrawal. Reconnect intuition with accountability by naming what you know, what you do not know, and what action remains yours to take. Mystery is not an excuse to abandon discernment."
      }
    },
    journey: {
      currentCard: "II · The High Priestess",
      details: [
        { label: "Stage", value: "Inner Knowing" },
        { label: "Gift", value: "Intuition" },
        { label: "Lesson", value: "Trust what cannot yet be proven" },
        { label: "Risk", value: "Passive concealment" }
      ],
      nextCard: "III · The Empress",
      nextMessage: "Inner knowing begins to nurture life.",
      summary: "The Magician discovers the power of conscious action. The High Priestess turns inward toward knowledge that action alone cannot reach, while The Empress carries that hidden potential into growth, embodiment, and creation."
    },
    commonQuestions: [
      { question: "Is The High Priestess a yes or no card?", answer: "The High Priestess is rarely a simple yes or no. She often points to information still unfolding and encourages patience, observation, and trust in what is quietly becoming clear. A decision may be better made after more is known rather than forced from uncertainty." },
      { question: "Is The High Priestess a positive card?", answer: "The High Priestess can be deeply supportive because she strengthens intuition, reflection, and discernment. Her quieter energy may feel frustrating when action is desired, yet it can prevent rushed choices by revealing what surface appearances have not yet shown." },
      { question: "What does The High Priestess mean as a person?", answer: "She may describe someone private, perceptive, observant, emotionally self-contained, or comfortable with complexity. In a difficult expression, the person can become withholding, distant, unclear, or reluctant to make their inner knowledge accountable through honest communication." },
      { question: "What does The High Priestess mean as advice?", answer: "Pause long enough to hear your own perspective beneath outside pressure. Gather information, notice repeated instincts, and avoid treating urgency as proof. Advice from others can help, but the card favors decisions that remain connected to your lived experience and discernment." },
      { question: "What does The High Priestess reversed warn about?", answer: "Reversed, she may warn that intuition is being ignored, confusion is being protected, or silence is serving avoidance. Hidden information and emotional withdrawal deserve attention, especially when someone is waiting for certainty that no situation can realistically provide." },
      { question: "What does it mean when The High Priestess appears repeatedly?", answer: "A repeating High Priestess may indicate an unfinished inner question, a pattern of overlooking your own signals, or a need to slow down before acting. It can also highlight where privacy is healthy and where secrecy is preventing a necessary truth from being named." }
    ],
    seo: {
      title: "The High Priestess Tarot Card Meaning | Astral Veil",
      description: "Explore The High Priestess tarot card’s upright and reversed meanings for love, career, feelings, spiritual guidance, reflection questions, and her place in the Major Arcana.",
      ogTitle: "The High Priestess Tarot Card Meaning",
      ogDescription: "Discover The High Priestess’s intuition, mystery, life interpretations, reflection questions, and role in the Major Arcana journey.",
      twitterDescription: "Discover The High Priestess’s intuition, mystery, life interpretations, reflection questions, and role in the Major Arcana journey.",
      lastModified: "2026-07-21"
    },
    variants: {
      veilrise: {
        deckId: "astralVeilTarot",
        deckName: "Veilrise Arcana",
        cardId: "the-high-priestess",
        image: "/assets/images/cards/astral-veil-tarot/major/02-the-high-priestess.png",
        imageAlt: "The High Priestess card from the Veilrise Arcana tarot deck",
        subtitle: "What is silent is not always absent.",
        astralVeilMeaning: "The High Priestess listens where ordinary perception ends. She recognizes that silence is not emptiness, but a field in which hidden patterns become visible. Her presence asks whether you are seeking another answer because the one within you is inconvenient, unfinished, or impossible to prove.",
        reflectionPrompts: ["What truth becomes clearer when I stop demanding immediate certainty?", "Where has my intuition spoken before my reasoning caught up?"]
      },
      veilfall: {
        deckId: "astralVeilCrimson",
        deckName: "Veilfall Arcana",
        cardId: "astral-veil-crimson-the-high-priestess",
        image: "/assets/images/cards/astral-veil-crimson/major/02-the-high-priestess.png",
        imageAlt: "The High Priestess card from the Veilfall Arcana tarot deck",
        subtitle: "Silence can protect truth, but it can also conceal fear.",
        astralVeilMeaning: "The High Priestess guards what has not been spoken, including truths withheld from the self. Veilfall reveals the danger of using intuition as an excuse for distance, secrecy, or inaction. What remains hidden may be sacred, but it may also be avoiding the consequence of being named.",
        reflectionPrompts: ["What am I keeping hidden because speaking it would require change?", "Where have I confused emotional withdrawal with inner wisdom?"]
      }
    }
  },
  {
    id: "the-empress",
    system: "tarot",
    slug: "the-empress",
    title: "The Empress",
    displayNumber: "III",
    sortOrder: 3,
    arcana: "Major Arcana",
    suit: null,
    rank: null,
    contentStatus: "approved",
    description: "The Empress brings care, creativity, and embodiment to what is ready to grow.",
    archetypalMessage: "The Empress represents the power that nurtures possibility into living form. She teaches that growth depends upon care, embodiment, creativity, receptivity, and an environment capable of sustaining what is being created.",
    uprightMeaning: "Abundance, creativity, nurturing, sensuality, fertility, beauty, comfort, embodiment, emotional generosity, and sustained growth.",
    reversedMeaning: "Creative stagnation, depletion, neglect, overdependence, blocked receptivity, poor boundaries, overgiving, or difficulty caring for oneself while caring for others.",
    shadowMeaning: "Nurturing becomes possession. The Empress may overprotect what she loves, confuse being needed with being valued, or create abundance externally while remaining emotionally depleted within.",
    reflection: "What am I nurturing, and does the way I care for it also allow me to remain whole?",
    keywords: ["Nurturing", "Abundance", "Creation", "Beauty", "Sensuality", "Growth", "Embodiment", "Generosity"],
    correspondences: [
      { label: "Number", value: "3" },
      { label: "Element", value: "Earth" },
      { label: "Planet", value: "Venus" },
      { label: "Archetype", value: "The Great Mother" },
      { label: "Lesson", value: "Nurture without possession" }
    ],
    identity: [
      { label: "Arcana", value: "Major Arcana" },
      { label: "Deck", value: "Veilrise Arcana" },
      { label: "Card", value: "III · The Empress" },
      { label: "Position", value: "After The High Priestess" }
    ],
    traditionalMeaning: "In traditional tarot, The Empress represents creativity, abundance, nature, fertility, comfort, sensuality, and the care that allows life to flourish. She speaks to receiving as well as giving, and to nurturing growth through patience, presence, and embodied attention.",
    categories: {
      love: {
        upright: "Warmth, generosity, and emotional availability can help a relationship or new connection deepen. The Empress favors care that is freely offered rather than earned through performance. Let affection include comfort, pleasure, and mutual support without assuming one person must carry all the nurturing.",
        reversed: "Overgiving, possessiveness, or unmet needs may be draining intimacy. A connection can become imbalanced when care is used to secure loyalty or when someone forgets to receive. Restore boundaries and make room for each person’s independence, rest, and honest needs."
      },
      career: {
        upright: "Creative work, collaboration, and patient cultivation are supported. A project may benefit from better conditions, more resources, or attention to the people sustaining it. Growth is more likely when productivity is paired with care for capacity, quality, and long-term wellbeing.",
        reversed: "Depletion or a lack of support may be limiting your work. You could be producing constantly without replenishment, or waiting for inspiration while the environment remains unsupportive. Reassess what needs nourishment, clearer boundaries, or a more realistic pace."
      },
      feelings: {
        upright: "Feelings may be affectionate, receptive, and oriented toward creating safety or closeness. You or another person could be ready to invest attention in what is growing. Emotional generosity is strongest when it includes respect for each person’s autonomy and practical limits.",
        reversed: "Care may be tangled with insecurity, resentment, or the wish to be indispensable. Someone can appear giving while quietly feeling depleted or unappreciated. Look beneath the surface for needs that deserve direct expression instead of indirect caretaking."
      },
      advice: {
        upright: "Choose a form of care that is sustainable: feed the project, relationship, body, or home with steady attention rather than dramatic effort. Notice what helps you feel resourced too. Growth has a better foundation when generosity does not require self-erasure.",
        reversed: "Take depletion seriously before it becomes resentment. Scale back what you are carrying, accept support where it is available, and question whether usefulness has become your only measure of worth. Rest and boundaries can be part of responsible care."
      },
      spiritual: {
        upright: "Embodiment can be a grounded spiritual practice. Attend to nature, pleasure, creativity, food, rest, and the conditions that make life feel inhabitable. Meaning may become clearer through caring for the living world and your own capacity, not only through abstract insight.",
        reversed: "A spiritual ideal of endless compassion may be hiding neglected needs or blurred boundaries. Return to the body and ask what is actually sustainable. Care becomes more honest when it does not demand that you disappear from the life you are tending."
      }
    },
    journey: {
      currentCard: "III · The Empress",
      details: [
        { label: "Stage", value: "Embodied Creation" },
        { label: "Gift", value: "Nurturing" },
        { label: "Lesson", value: "Sustain what is growing" },
        { label: "Risk", value: "Possessiveness" }
      ],
      nextCard: "IV · The Emperor",
      nextMessage: "Growth is given structure and protection.",
      summary: "The High Priestess receives potential through intuition. The Empress gives that potential body, nourishment, and life, while The Emperor creates the structure required to protect and sustain what has begun to grow."
    },
    commonQuestions: [
      { question: "Is The Empress a yes or no card?", answer: "The Empress often leans toward yes where growth, care, creativity, or receptivity can support the outcome. Her answer is not about forcing results; it favors conditions that can genuinely sustain what you hope will develop over time." },
      { question: "Is The Empress a positive card?", answer: "The Empress is generally generous and life-affirming, associated with abundance, creativity, comfort, and nurturing growth. She also carries a useful reminder: care becomes less positive when it turns into overgiving, possession, or neglect of your own needs." },
      { question: "What does The Empress mean as a person?", answer: "She may describe someone creative, warm, generous, sensual, protective, or naturally skilled at making others feel cared for. In a difficult expression, that same person may become smothering, depleted, overly responsible, or dependent on being needed." },
      { question: "What does The Empress mean as advice?", answer: "Create the conditions your goal needs in order to grow. Offer consistent care, improve the environment around it, and include your own wellbeing in the plan. The card favors sustainable nourishment over pushing for a result before it has roots." },
      { question: "What does The Empress reversed warn about?", answer: "Reversed, The Empress may warn of depletion, creative blocks, poor boundaries, overdependence, or care that has become controlling. It can signal that someone is giving beyond their capacity or expecting growth without providing the conditions it requires." },
      { question: "What does it mean when The Empress appears repeatedly?", answer: "A repeating Empress may draw attention to creativity, embodiment, care, and the quality of your support systems. It can also highlight a pattern of making yourself indispensable, asking whether the life you nurture has enough room for you to be nourished too." }
    ],
    seo: {
      title: "The Empress Tarot Card Meaning | Astral Veil",
      description: "Explore The Empress tarot card’s upright and reversed meanings for love, career, feelings, spiritual guidance, reflection questions, and her place in the Major Arcana.",
      ogTitle: "The Empress Tarot Card Meaning",
      ogDescription: "Discover The Empress’s abundance, creativity, life interpretations, reflection questions, and role in the Major Arcana journey.",
      twitterDescription: "Discover The Empress’s abundance, creativity, life interpretations, reflection questions, and role in the Major Arcana journey.",
      lastModified: "2026-07-21"
    },
    variants: {
      veilrise: {
        deckId: "astralVeilTarot",
        deckName: "Veilrise Arcana",
        cardId: "the-empress",
        image: "/assets/images/cards/astral-veil-tarot/major/03-the-empress.png",
        imageAlt: "The Empress card from the Veilrise Arcana tarot deck",
        subtitle: "What you nurture begins to answer.",
        astralVeilMeaning: "The Empress reveals creation as a relationship rather than a command. Life responds to attention, patience, and the conditions offered to it. She asks whether your desires are being nourished through genuine care, or merely expected to bloom because you have imagined them.",
        reflectionPrompts: ["What part of my life needs patient and consistent nourishment?", "Where can I receive care instead of always being the one who provides it?"]
      },
      veilfall: {
        deckId: "astralVeilCrimson",
        deckName: "Veilfall Arcana",
        cardId: "astral-veil-crimson-the-empress",
        image: "/assets/images/cards/astral-veil-crimson/major/03-the-empress.png",
        imageAlt: "The Empress card from the Veilfall Arcana tarot deck",
        subtitle: "Care becomes a cage when love cannot release what it has grown.",
        astralVeilMeaning: "The Empress enters Veilfall where devotion becomes possession and abundance begins consuming the person who creates it. Care may look generous while quietly demanding dependence in return. What you nurture must be allowed to become something beyond your control.",
        reflectionPrompts: ["Where have I made being needed part of my identity?", "What am I protecting so tightly that it can no longer grow freely?"]
      }
    }
  },
  {
    id: "the-emperor",
    system: "tarot",
    slug: "the-emperor",
    title: "The Emperor",
    displayNumber: "IV",
    sortOrder: 4,
    arcana: "Major Arcana",
    suit: null,
    rank: null,
    contentStatus: "approved",
    description: "The Emperor creates the boundaries and responsibilities that give a vision lasting form.",
    archetypalMessage: "The Emperor represents the structure that gives intention durability. He establishes boundaries, responsibility, order, and protection so that what matters can endure beyond impulse or changing circumstances.",
    uprightMeaning: "Structure, leadership, stability, authority, discipline, protection, responsibility, boundaries, organization, and dependable action.",
    reversedMeaning: "Rigidity, instability, weak boundaries, misuse of authority, controlling behavior, avoidance of responsibility, inflexibility, or leadership driven by insecurity.",
    shadowMeaning: "Protection becomes domination. The Emperor may enforce order to silence uncertainty, suppress vulnerability, or maintain authority long after the structure has stopped serving those within it.",
    reflection: "Where does my life need stronger structure, and where has structure become resistance to change?",
    keywords: ["Structure", "Authority", "Stability", "Leadership", "Discipline", "Protection", "Boundaries", "Responsibility"],
    correspondences: [
      { label: "Number", value: "4" },
      { label: "Element", value: "Fire" },
      { label: "Sign", value: "Aries" },
      { label: "Archetype", value: "The Sovereign" },
      { label: "Lesson", value: "Use authority in service of stability" }
    ],
    identity: [
      { label: "Arcana", value: "Major Arcana" },
      { label: "Deck", value: "Veilrise Arcana" },
      { label: "Card", value: "IV · The Emperor" },
      { label: "Position", value: "After The Empress" }
    ],
    traditionalMeaning: "In traditional tarot, The Emperor represents structure, leadership, authority, boundaries, protection, discipline, and responsibility. He emphasizes dependable action and the value of systems that can hold what matters, while cautioning against confusing control with genuine security.",
    categories: {
      love: {
        upright: "Commitment may be strengthened through reliability, clear boundaries, and practical care. The Emperor values showing up consistently rather than relying on promises alone. In a new connection, it can favor someone who knows what they can offer and communicates expectations with respect.",
        reversed: "Control, rigidity, or unequal power may be shaping the relationship. One person could be setting rules to avoid vulnerability, while another feels they must earn safety. Examine whether boundaries protect both people or simply preserve one person’s authority."
      },
      career: {
        upright: "Leadership, planning, and disciplined follow-through can move work forward. Create a workable structure around a project, clarify responsibilities, and make decisions that support long-term stability. The Emperor is useful for building systems, managing resources, and taking accountable ownership.",
        reversed: "A workplace may be hampered by poor leadership, excessive bureaucracy, or resistance to necessary change. You might also be overcontrolling your own process because mistakes feel threatening. Review the structure itself instead of demanding more effort from an unsound plan."
      },
      feelings: {
        upright: "Feelings may be expressed through protection, consistency, and practical support rather than overt display. You or another person could be trying to create something dependable. Emotional steadiness is valuable, though it still benefits from language that makes care visible and mutual.",
        reversed: "Emotional restraint may have hardened into distance or defensiveness. Someone could be using competence, rules, or certainty to avoid admitting fear. Do not mistake guarded behavior for proof of strength; honest vulnerability may be the missing part of stability."
      },
      advice: {
        upright: "Choose a structure that supports the life you want to sustain. Set boundaries, name priorities, organize the next steps, and make responsibilities realistic. The goal is not perfection; it is a dependable framework that reduces chaos without preventing adaptation.",
        reversed: "Loosen rules that no longer serve their original purpose. If you are forcing progress through control, ask what uncertainty is being avoided. A stronger approach may require clearer accountability, but it may also require flexibility, collaboration, and permission to revise the plan."
      },
      spiritual: {
        upright: "Ground values in repeatable practices, commitments, and boundaries. A spiritual life can become more reliable when insight is supported by routine and responsibility. Seek forms that make integrity easier to live, while remembering that discipline should serve growth rather than replace it.",
        reversed: "Authority, hierarchy, or strict practice may be masking fear of uncertainty. Reconsider any rule that asks you to suppress your humanity in order to appear disciplined. Genuine grounding includes the capacity to listen, adapt, and take responsibility without domination."
      }
    },
    journey: {
      currentCard: "IV · The Emperor",
      details: [
        { label: "Stage", value: "The Foundation" },
        { label: "Gift", value: "Stability" },
        { label: "Lesson", value: "Create dependable structure" },
        { label: "Risk", value: "Domination" }
      ],
      nextCard: "V · The Hierophant",
      nextMessage: "Personal structure becomes shared tradition.",
      summary: "The Empress nurtures life through care and abundance. The Emperor establishes the boundaries that allow it to endure, while The Hierophant transforms individual order into shared teachings, customs, and systems of meaning."
    },
    commonQuestions: [
      { question: "Is The Emperor a yes or no card?", answer: "The Emperor often leans yes when success depends on planning, responsibility, leadership, or creating stronger foundations. His answer favors an outcome that can be supported in practice, not one pursued through wishful thinking or an absence of clear structure." },
      { question: "Is The Emperor a positive card?", answer: "The Emperor can be positive when stability, boundaries, and dependable leadership are needed. He is not automatically comfortable or easy; his lesson includes noticing when order becomes rigidity, when protection becomes control, and when authority stops listening." },
      { question: "What does The Emperor mean as a person?", answer: "He may describe someone organized, protective, decisive, disciplined, responsible, or comfortable taking charge. In a difficult expression, the person may become controlling, emotionally guarded, inflexible, or overly invested in being right and maintaining authority." },
      { question: "What does The Emperor mean as advice?", answer: "Build a clear framework around the situation. Define priorities, responsibilities, limits, and a realistic next step. The Emperor favors choices that make life more dependable, while also asking you to leave enough flexibility for people and circumstances to change." },
      { question: "What does The Emperor reversed warn about?", answer: "Reversed, The Emperor may warn of weak boundaries, instability, misused authority, rigid rules, or control driven by fear. It can also show where someone is avoiding responsibility while insisting on power, or where a system needs revision rather than stricter enforcement." },
      { question: "What does it mean when The Emperor appears repeatedly?", answer: "A repeating Emperor may point to an ongoing lesson around structure, leadership, boundaries, or responsibility. Consider whether you need to create more stability, share authority more wisely, or soften a controlling pattern that has become mistaken for security." }
    ],
    seo: {
      title: "The Emperor Tarot Card Meaning | Astral Veil",
      description: "Explore The Emperor tarot card’s upright and reversed meanings for love, career, feelings, spiritual guidance, reflection questions, and his place in the Major Arcana.",
      ogTitle: "The Emperor Tarot Card Meaning",
      ogDescription: "Discover The Emperor’s structure, authority, life interpretations, reflection questions, and role in the Major Arcana journey.",
      twitterDescription: "Discover The Emperor’s structure, authority, life interpretations, reflection questions, and role in the Major Arcana journey.",
      lastModified: "2026-07-21"
    },
    variants: {
      veilrise: {
        deckId: "astralVeilTarot",
        deckName: "Veilrise Arcana",
        cardId: "the-emperor",
        image: "/assets/images/cards/astral-veil-tarot/major/04-the-emperor.png",
        imageAlt: "The Emperor card from the Veilrise Arcana tarot deck",
        subtitle: "A steady foundation gives power somewhere to stand.",
        astralVeilMeaning: "The Emperor understands that possibility cannot survive without form. Boundaries, commitments, and systems allow energy to become dependable rather than temporary. His presence asks what must be organized, protected, or claimed so that intention can withstand the pressure of reality.",
        reflectionPrompts: ["What structure would make my life feel more stable rather than more restricted?", "Where am I being asked to lead with consistency?"]
      },
      veilfall: {
        deckId: "astralVeilCrimson",
        deckName: "Veilfall Arcana",
        cardId: "astral-veil-crimson-the-emperor",
        image: "/assets/images/cards/astral-veil-crimson/major/04-the-emperor.png",
        imageAlt: "The Emperor card from the Veilfall Arcana tarot deck",
        subtitle: "Order becomes tyranny when fear writes the law.",
        astralVeilMeaning: "The Emperor enters Veilfall when stability becomes an obsession and authority is used to prevent uncertainty from entering. Control may create obedience, but it cannot create trust. The strongest walls often reveal what their builder is most afraid to face.",
        reflectionPrompts: ["Where am I controlling others because I do not trust what may happen without me?", "What vulnerability have I disguised as discipline or authority?"]
      }
    }
  },
  {
    id: "the-hierophant", system: "tarot", slug: "the-hierophant", title: "The Hierophant", displayNumber: "V", sortOrder: 5,
    arcana: "Major Arcana", suit: null, rank: null, contentStatus: "approved",
    description: "The Hierophant explores how shared teachings can guide a life without replacing personal discernment.",
    archetypalMessage: "The Hierophant represents knowledge carried through community, tradition, ritual, and teaching. He asks how inherited wisdom can guide the present without replacing personal discernment.",
    uprightMeaning: "Tradition, mentorship, education, ritual, shared values, spiritual guidance, institutions, commitment, cultural knowledge, and learning through established systems.",
    reversedMeaning: "Questioning tradition, rejecting convention, restrictive beliefs, poor guidance, rebellion without direction, institutional conflict, or the need to form a more personal philosophy.",
    shadowMeaning: "Wisdom becomes dogma. The Hierophant may demand obedience, protect authority through moral certainty, or preserve traditions whose original purpose has been forgotten.",
    reflection: "Which beliefs genuinely guide me, and which have I inherited without ever choosing?",
    keywords: ["Tradition", "Teaching", "Shared Meaning", "Mentorship", "Ritual", "Commitment", "Community", "Belief"],
    correspondences: [{ label: "Number", value: "5" }, { label: "Element", value: "Earth" }, { label: "Sign", value: "Taurus" }, { label: "Archetype", value: "The Teacher" }, { label: "Lesson", value: "Discern wisdom from obedience" }],
    identity: [{ label: "Arcana", value: "Major Arcana" }, { label: "Deck", value: "Veilrise Arcana" }, { label: "Card", value: "V · The Hierophant" }, { label: "Position", value: "After The Emperor" }],
    traditionalMeaning: "In traditional tarot, The Hierophant represents teaching, tradition, institutions, spiritual guidance, mentorship, commitment, and established belief systems. He can offer a useful framework for learning and belonging, while also inviting discernment about which rules still deserve allegiance.",
    categories: {
      love: {
        upright: "Shared values, clear commitments, and guidance from trusted experience can strengthen a relationship or new connection. The Hierophant favors conversations about what each person considers meaningful, ethical, and sustainable, rather than assuming intimacy alone will resolve important differences.",
        reversed: "A relationship may be strained by family expectations, restrictive roles, or beliefs that no longer fit. Avoid trading authenticity for approval. The issue may not be commitment itself, but whether the rules surrounding commitment have been chosen consciously by both people."
      },
      career: {
        upright: "Mentorship, training, professional standards, or an established institution can offer useful support. Learn the craft, respect what experience can teach, and use a proven process where it serves the work. Guidance is most valuable when it expands competence rather than dependence.",
        reversed: "Outdated procedures or gatekeeping may be limiting development. You may need to question a workplace norm, seek a different mentor, or create a more personal approach. Rebellion is strongest when it is informed by a clear alternative rather than frustration alone."
      },
      feelings: {
        upright: "Feelings may be shaped by a wish for shared meaning, belonging, or a relationship with recognizable commitments. You or another person could be considering how values fit into the connection. Honest discussion about expectations may reveal more than romantic assumptions.",
        reversed: "Someone may be torn between personal feelings and inherited expectations. Shame, fear of judgment, or rigid ideas about what a relationship should look like can make emotions difficult to name. Create space for truth without treating convention as the only acceptable measure."
      },
      advice: {
        upright: "Seek sound teaching, useful structure, or a mentor whose experience you respect. Let established wisdom shorten the learning curve, then test it through your own life. A practice becomes meaningful when you understand both its purpose and its limits.",
        reversed: "Examine the rule before obeying or rejecting it. Ask whether it still serves its original purpose, whose interests it protects, and whether your resistance has direction. Personal authority grows through discernment, not through automatic conformity or automatic rebellion."
      },
      spiritual: {
        upright: "Ritual, study, community, and inherited teachings can support a grounded spiritual life. Participate with curiosity and humility, allowing traditions to offer language for experience without requiring you to abandon your own conscience or questioning mind.",
        reversed: "Sacred language may be used to silence doubt or preserve status. Notice where belief has become a substitute for lived integrity. A more honest practice can include reverence and skepticism together, especially when an institution asks for obedience without accountability."
      }
    },
    journey: { currentCard: "V · The Hierophant", details: [{ label: "Stage", value: "Inherited Wisdom" }, { label: "Gift", value: "Guidance" }, { label: "Lesson", value: "Choose belief consciously" }, { label: "Risk", value: "Dogma" }], nextCard: "VI · The Lovers", nextMessage: "Inherited values become personal choice.", summary: "The Emperor establishes external order. The Hierophant gives that order meaning through teaching, tradition, and collective belief, while The Lovers ask whether inherited values truly align with the choices of the individual heart." },
    commonQuestions: [
      { question: "Is The Hierophant a yes or no card?", answer: "The Hierophant often leans yes when the situation benefits from commitment, sound guidance, shared values, or a proven process. He also asks whether the path is genuinely aligned with your beliefs rather than simply approved by the people around you." },
      { question: "Is The Hierophant a positive card?", answer: "The Hierophant can be constructive because he offers teaching, continuity, community, and useful frameworks. His positive side depends on discernment: traditions support growth when they remain connected to purpose, compassion, and the freedom to ask honest questions." },
      { question: "What does The Hierophant mean as a person?", answer: "He may describe a mentor, teacher, counselor, community leader, or someone deeply shaped by tradition and shared values. In a difficult expression, that person may become judgmental, controlling, overly conventional, or invested in being treated as an unquestionable authority." },
      { question: "What does The Hierophant mean as advice?", answer: "Look for reliable teaching, experienced guidance, or a community practice that can help you build understanding. Then apply what you learn thoughtfully. The card favors discernment: useful advice should strengthen your capacity to choose, not require permanent dependence." },
      { question: "What does The Hierophant reversed warn about?", answer: "Reversed, The Hierophant may warn of dogma, restrictive expectations, poor guidance, institutional conflict, or rebellion without a clear foundation. It can signal that an inherited belief needs examination before it continues shaping your choices and relationships." },
      { question: "What does it mean when The Hierophant appears repeatedly?", answer: "A repeating Hierophant may highlight an ongoing lesson around teaching, belonging, commitment, or belief. Consider what wisdom you want to preserve, which voices have shaped you, and where personal experience is asking you to revise an inherited rule." }
    ],
    seo: { title: "The Hierophant Tarot Card Meaning | Astral Veil", description: "Explore The Hierophant tarot card’s upright and reversed meanings for love, career, feelings, spiritual guidance, reflection questions, and his place in the Major Arcana.", ogTitle: "The Hierophant Tarot Card Meaning", ogDescription: "Discover The Hierophant’s tradition, teaching, life interpretations, reflection questions, and role in the Major Arcana journey.", twitterDescription: "Discover The Hierophant’s tradition, teaching, life interpretations, reflection questions, and role in the Major Arcana journey.", lastModified: "2026-07-21" },
    variants: {
      veilrise: { deckId: "astralVeilTarot", deckName: "Veilrise Arcana", cardId: "the-hierophant", image: "/assets/images/cards/astral-veil-tarot/major/05-the-hierophant.png", imageAlt: "The Hierophant card from the Veilrise Arcana tarot deck", subtitle: "Wisdom is inherited, questioned, and made your own.", astralVeilMeaning: "The Hierophant stands among the teachings left by those who crossed the threshold before us. Tradition can preserve discoveries that one lifetime could not rebuild alone. Yet every teaching must eventually pass through personal experience, where repetition becomes either wisdom or empty obedience.", reflectionPrompts: ["What tradition or teaching continues to support my growth?", "Which belief am I ready to examine through my own experience?"] },
      veilfall: { deckId: "astralVeilCrimson", deckName: "Veilfall Arcana", cardId: "astral-veil-crimson-the-hierophant", image: "/assets/images/cards/astral-veil-crimson/major/05-the-hierophant.png", imageAlt: "The Hierophant card from the Veilfall Arcana tarot deck", subtitle: "A borrowed truth can become a prison.", astralVeilMeaning: "The Hierophant enters Veilfall when authority hides behind sacred language and obedience is mistaken for understanding. A belief may offer belonging while quietly demanding the surrender of doubt, identity, or discernment. Not every inherited rule deserves continuation.", reflectionPrompts: ["Where have I accepted authority because questioning it threatened my sense of belonging?", "Which belief would lose its power over me if I examined it honestly?"] }
    }
  },
  {
    id: "the-lovers", system: "tarot", slug: "the-lovers", title: "The Lovers", displayNumber: "VI", sortOrder: 6,
    arcana: "Major Arcana", suit: null, rank: null, contentStatus: "approved",
    description: "The Lovers reveal connection as a choice shaped by values, vulnerability, and mutual recognition.",
    archetypalMessage: "The Lovers represent the moment connection becomes a choice. The card explores intimacy, alignment, values, vulnerability, and the responsibility of choosing what we are willing to join, protect, and become.",
    uprightMeaning: "Union, love, alignment, meaningful choice, intimacy, attraction, shared values, vulnerability, integration, and relationships built through conscious commitment.",
    reversedMeaning: "Misalignment, conflict, avoidance of choice, broken trust, incompatible values, self-abandonment, imbalance, or difficulty creating honest connection.",
    shadowMeaning: "Union becomes erasure. The Lovers may sacrifice personal truth for acceptance, confuse intensity with compatibility, or ask another person to complete what remains divided within the self.",
    reflection: "What choice would bring my actions, relationships, and deepest values into greater alignment?",
    keywords: ["Union", "Choice", "Alignment", "Intimacy", "Values", "Vulnerability", "Attraction", "Commitment"],
    correspondences: [{ label: "Number", value: "6" }, { label: "Element", value: "Air" }, { label: "Sign", value: "Gemini" }, { label: "Archetype", value: "The Sacred Union" }, { label: "Lesson", value: "Choose according to your values" }],
    identity: [{ label: "Arcana", value: "Major Arcana" }, { label: "Deck", value: "Veilrise Arcana" }, { label: "Card", value: "VI · The Lovers" }, { label: "Position", value: "After The Hierophant" }],
    traditionalMeaning: "In traditional tarot, The Lovers concern union, relationships, values, choice, intimacy, attraction, harmony, and alignment. Beyond romance, the card considers whether a commitment reflects your deeper principles and whether divided parts of the self can be brought into honest relationship.",
    categories: {
      love: {
        upright: "Love can deepen through honesty, mutual choice, and a willingness to make values visible. For a new connection, attraction may be accompanied by real potential for alignment. Existing relationships benefit when each person can remain themselves while building something intentionally together.",
        reversed: "Chemistry alone may be disguising a mismatch in values, timing, or emotional availability. Avoid abandoning personal needs to keep closeness. A difficult choice may be necessary when trust has weakened or when a connection repeatedly asks you to become less truthful."
      },
      career: {
        upright: "A work decision may hinge on alignment between your abilities, principles, and the people involved. Collaboration can be especially productive when expectations are explicit. Choose projects and partnerships that allow you to contribute without separating success from what you genuinely value.",
        reversed: "Conflicting priorities, unspoken resentment, or a misaligned partnership may be slowing progress. You might be agreeing to work that compromises an important value. Name the trade-off clearly before it becomes a pattern, and consider whether a different collaboration would be healthier."
      },
      feelings: {
        upright: "Feelings may be sincere, attracted, and open to greater intimacy, though they also invite a conscious choice about what comes next. You or another person could be considering whether the connection fits the life and values each hopes to live.",
        reversed: "Desire may be present alongside hesitation, divided loyalty, or fear of being fully known. Someone could be avoiding a choice because either outcome carries loss. Look for honest communication rather than assuming intensity alone reveals compatibility or commitment."
      },
      advice: {
        upright: "Let values guide the decision, not only fear of losing connection. Notice where your actions, relationships, and stated principles agree, then choose the path that allows greater integrity. A meaningful commitment should make room for both closeness and self-respect.",
        reversed: "Identify the place where you are negotiating against yourself. It may be tempting to delay a choice, keep every option open, or call compromise love. Clearer boundaries and honest conversation can reveal whether the relationship or decision can become more balanced."
      },
      spiritual: {
        upright: "Connection can become a spiritual practice when it teaches reciprocity, responsibility, and integration. Consider how relationships reveal your values and divided inner parts. The work is not to become perfect together, but to choose with awareness and keep returning to truth.",
        reversed: "Spiritual ideals of union may be used to excuse dependency, projection, or self-abandonment. Return to the parts of yourself that need attention before asking another person or path to complete them. Integrity is a more stable foundation than idealized devotion."
      }
    },
    journey: { currentCard: "VI · The Lovers", details: [{ label: "Stage", value: "Conscious Choice" }, { label: "Gift", value: "Alignment" }, { label: "Lesson", value: "Choose without abandoning yourself" }, { label: "Risk", value: "Self-erasure" }], nextCard: "VII · The Chariot", nextMessage: "Choice becomes direction and movement.", summary: "The Hierophant presents inherited values and collective expectations. The Lovers transform those values into personal choice, while The Chariot gathers the consequences of that choice into direction, discipline, and forward movement." },
    commonQuestions: [
      { question: "Is The Lovers a yes or no card?", answer: "The Lovers can lean yes when the choice, relationship, or collaboration is grounded in honesty and shared values. They are not a promise of romance or agreement; the card asks whether what you are joining supports genuine alignment rather than temporary intensity." },
      { question: "Is The Lovers a positive card?", answer: "The Lovers are often positive because they emphasize intimacy, choice, connection, and meaningful alignment. Their deeper value comes from clarity: the card can also reveal a difficult decision, incompatible values, or the need to stop sacrificing truth for acceptance." },
      { question: "What does The Lovers mean as a person?", answer: "They may describe someone relational, affectionate, values-driven, open to intimacy, or deeply aware of choices and their consequences. In a difficult expression, the person may be indecisive, dependent on approval, conflicted, or prone to losing themselves within connection." },
      { question: "What does The Lovers mean as advice?", answer: "Choose in a way that respects your values and your capacity for honest connection. Consider what the relationship, opportunity, or commitment requires of you, then ask whether it allows you to remain whole rather than merely accepted." },
      { question: "What does The Lovers reversed warn about?", answer: "Reversed, The Lovers may warn of misalignment, broken trust, incompatible values, avoidance of choice, or self-abandonment. It can indicate that attraction is being treated as enough even though the deeper terms of the connection remain unclear or unequal." },
      { question: "What does it mean when The Lovers appears repeatedly?", answer: "A repeating Lovers may emphasize an ongoing choice about values, intimacy, or commitment. It can point to a relationship pattern that needs more honesty, or to an inner division asking to be integrated before a sustainable decision becomes possible." }
    ],
    seo: { title: "The Lovers Tarot Card Meaning | Astral Veil", description: "Explore The Lovers tarot card’s upright and reversed meanings for love, career, feelings, spiritual guidance, reflection questions, and their place in the Major Arcana.", ogTitle: "The Lovers Tarot Card Meaning", ogDescription: "Discover The Lovers’ union, choice, life interpretations, reflection questions, and role in the Major Arcana journey.", twitterDescription: "Discover The Lovers’ union, choice, life interpretations, reflection questions, and role in the Major Arcana journey.", lastModified: "2026-07-21" },
    variants: {
      veilrise: { deckId: "astralVeilTarot", deckName: "Veilrise Arcana", cardId: "the-lovers", image: "/assets/images/cards/astral-veil-tarot/major/06-the-lovers.png", imageAlt: "The Lovers card from the Veilrise Arcana tarot deck", subtitle: "Every union reveals a choice.", astralVeilMeaning: "The Lovers reveal connection as a mirror in which hidden values become visible. What we choose to join changes the shape of who we are becoming. The card asks whether love, desire, and loyalty are guiding you toward integration, or asking you to abandon something essential.", reflectionPrompts: ["Which choice would bring me into greater alignment with myself?", "Where can connection deepen without requiring self-abandonment?"] },
      veilfall: { deckId: "astralVeilCrimson", deckName: "Veilfall Arcana", cardId: "astral-veil-crimson-the-lovers", image: "/assets/images/cards/astral-veil-crimson/major/06-the-lovers.png", imageAlt: "The Lovers card from the Veilfall Arcana tarot deck", subtitle: "Desire exposes the values you betray to keep it.", astralVeilMeaning: "The Lovers enter Veilfall when longing becomes a reason to ignore incompatibility, surrender identity, or remain divided against oneself. Intimacy can reveal truth, but desire can also persuade the heart to rename betrayal as devotion.", reflectionPrompts: ["What part of myself have I silenced to preserve a connection?", "Where am I calling intensity love because honesty would require a choice?"] }
    }
  },
  {
    id: "the-chariot", system: "tarot", slug: "the-chariot", title: "The Chariot", displayNumber: "VII", sortOrder: 7,
    arcana: "Major Arcana", suit: null, rank: null, contentStatus: "approved",
    description: "The Chariot gathers competing forces into a direction that can be carried forward with discipline.",
    archetypalMessage: "The Chariot represents movement shaped by discipline and direction. Conflicting forces are brought into alignment so that intention can become momentum rather than scattered effort.",
    uprightMeaning: "Determination, momentum, discipline, direction, confidence, self-command, victory, focused ambition, perseverance, and purposeful movement.",
    reversedMeaning: "Loss of direction, stalled progress, scattered will, aggression, poor self-control, forced movement, burnout, or determination unsupported by emotional balance.",
    shadowMeaning: "Direction becomes domination. The Chariot may pursue victory to outrun vulnerability, force every obstacle into submission, or measure personal worth through conquest and control.",
    reflection: "Where am I truly moving with purpose, and where am I using movement to avoid what remains unresolved?",
    keywords: ["Direction", "Willpower", "Momentum", "Discipline", "Victory", "Confidence", "Perseverance", "Self-Command"],
    correspondences: [{ label: "Number", value: "7" }, { label: "Element", value: "Water" }, { label: "Sign", value: "Cancer" }, { label: "Archetype", value: "The Charioteer" }, { label: "Lesson", value: "Move with discipline without suppressing emotion" }],
    identity: [{ label: "Arcana", value: "Major Arcana" }, { label: "Deck", value: "Veilrise Arcana" }, { label: "Card", value: "VII · The Chariot" }, { label: "Position", value: "After The Lovers" }],
    traditionalMeaning: "In traditional tarot, The Chariot represents determination, movement, victory, discipline, self-control, ambition, and the ability to bring opposing forces into alignment. It favors purposeful progress while reminding us that lasting direction requires emotional balance as well as willpower.",
    categories: {
      love: { upright: "A relationship or new connection may gain momentum through clarity, shared effort, and a willingness to move beyond hesitation. The Chariot supports purposeful action, but not emotional conquest. Progress is healthiest when both people agree on the direction and remain attentive to each other’s pace.", reversed: "Conflicting needs, impatience, or the urge to force progress may be creating strain. One person could be pursuing certainty while avoiding the emotional work underneath. Slow down enough to understand the disagreement before treating movement, distance, or victory as the solution." },
      career: { upright: "Focused ambition, discipline, and follow-through can help you advance a project or professional goal. Choose a destination, organize competing demands, and direct energy toward the work that matters most. The Chariot rewards steady momentum more than frantic activity or scattered effort.", reversed: "Burnout, disorganization, or an overly aggressive push may be undermining progress. You may be trying to win a situation that needs a better strategy, more support, or a pause. Reassess the direction before adding more force to an unsustainable pace." },
      feelings: { upright: "Feelings may be motivated, determined, and ready to move a situation forward. You or another person could be trying to gain clarity through action. Emotional confidence is useful when it includes the ability to hear competing needs instead of overriding them.", reversed: "Someone may feel conflicted, defensive, or unsure how to manage strong impulses. Drive can mask emotional discomfort, especially if stillness feels threatening. Look for consistency between stated intentions and the capacity to handle vulnerability without turning every feeling into a battle." },
      advice: { upright: "Name the destination, then choose a disciplined next step that supports it. Gather scattered priorities into a workable plan and give yourself a pace you can sustain. Progress does not require perfect certainty, but it does require direction, boundaries, and attention to competing demands.", reversed: "Pause before treating more effort as the answer. Notice where exhaustion, aggression, or distraction is replacing strategy. A course correction may be more powerful than pushing ahead; give unresolved feelings and practical limits enough attention to inform the next move." },
      spiritual: { upright: "Inner growth can involve guiding conflicting desires toward one meaningful purpose. Practice self-command without hostility toward the parts of you that need care. A grounded path holds emotion and discipline together, allowing action to become more coherent rather than more controlling.", reversed: "Movement or achievement may be serving as an escape from inner discomfort. Reconnect with the feelings beneath the drive and ask what they need besides conquest. Discipline becomes wiser when it includes rest, compassion, and the willingness to change direction." }
    },
    journey: { currentCard: "VII · The Chariot", details: [{ label: "Stage", value: "Directed Will" }, { label: "Gift", value: "Momentum" }, { label: "Lesson", value: "Guide opposing forces toward one purpose" }, { label: "Risk", value: "Domination" }], nextCard: "VIII · Strength", nextMessage: "External control becomes inner courage.", summary: "The Lovers create direction through conscious choice. The Chariot turns that choice into disciplined movement, while Strength reveals that lasting power depends not only upon control, but upon patience, compassion, and inner courage." },
    commonQuestions: [
      { question: "Is The Chariot a yes or no card?", answer: "The Chariot often leans yes when progress depends on determination, discipline, and a clear direction. Its encouragement is conditional on self-command: the outcome is stronger when momentum is guided by a workable plan rather than force, urgency, or the need to win." },
      { question: "Is The Chariot a positive card?", answer: "The Chariot can be positive because it supports movement, confidence, perseverance, and focused ambition. It also asks for balance. Momentum becomes less helpful when it turns into aggression, burnout, emotional suppression, or an inability to reconsider the destination." },
      { question: "What does The Chariot mean as a person?", answer: "It may describe someone determined, disciplined, competitive, self-directed, resilient, or highly focused on progress. In a difficult expression, that person may become controlling, impatient, emotionally guarded, or so committed to winning that they lose sight of what matters." },
      { question: "What does The Chariot mean as advice?", answer: "Choose a clear direction and organize your energy around it. Set a pace, address competing demands, and make progress through consistent action. The card favors self-command, but it also encourages listening to emotional and practical limits before forcing a result." },
      { question: "What does The Chariot reversed warn about?", answer: "Reversed, The Chariot may warn of stalled progress, scattered will, forced movement, aggression, poor self-control, or burnout. It can indicate that effort is being applied without enough emotional balance, strategy, or agreement about where the path is actually leading." },
      { question: "What does it mean when The Chariot appears repeatedly?", answer: "A repeating Chariot may signal an ongoing lesson about direction, discipline, and how you handle competing pressures. Consider whether you need more focus, a better pace, or a willingness to stop using achievement and movement to avoid unresolved feelings." }
    ],
    seo: { title: "The Chariot Tarot Card Meaning | Astral Veil", description: "Explore The Chariot tarot card’s upright and reversed meanings for love, career, feelings, spiritual guidance, reflection questions, and his place in the Major Arcana.", ogTitle: "The Chariot Tarot Card Meaning", ogDescription: "Discover The Chariot’s direction, discipline, life interpretations, reflection questions, and role in the Major Arcana journey.", twitterDescription: "Discover The Chariot’s direction, discipline, life interpretations, reflection questions, and role in the Major Arcana journey.", lastModified: "2026-07-21" },
    variants: {
      veilrise: { deckId: "astralVeilTarot", deckName: "Veilrise Arcana", cardId: "the-chariot", image: "/assets/images/cards/astral-veil-tarot/major/07-the-chariot.png", imageAlt: "The Chariot card from the Veilrise Arcana tarot deck", subtitle: "Direction turns movement into arrival.", astralVeilMeaning: "The Chariot gathers conflicting forces and gives them a shared destination. Progress does not require the destruction of inner tension, but the ability to move while holding it consciously. Victory begins when willpower stops fighting itself.", reflectionPrompts: ["What destination deserves my full and disciplined attention?", "Which conflicting parts of myself need direction rather than suppression?"] },
      veilfall: { deckId: "astralVeilCrimson", deckName: "Veilfall Arcana", cardId: "astral-veil-crimson-the-chariot", image: "/assets/images/cards/astral-veil-crimson/major/07-the-chariot.png", imageAlt: "The Chariot card from the Veilfall Arcana tarot deck", subtitle: "Victory means little if you abandon yourself to achieve it.", astralVeilMeaning: "The Chariot enters Veilfall when movement becomes escape and discipline becomes violence against the self. An achievement can look like triumph while concealing exhaustion, emotional denial, or the terror of standing still long enough to feel.", reflectionPrompts: ["What am I trying to outrun through constant movement or achievement?", "Where has my desire to win become more important than what victory is costing me?"] }
    }
  },
  ...majorBatchTwo,
  ...majorBatchThree,
  ...wandsBatchOne,
  ...wandsBatchTwo,
  ...cupsBatchOne,
  ...cupsBatchTwo,
  ...swordsBatchOne,
  ...swordsBatchTwo,
  ...pentaclesBatchOne,
  ...pentaclesBatchTwo
];
