(function () {
  "use strict";

  const root = document.querySelector(".how-to-read");
  if (!root) return;

  const howToReadTarotAssets = Object.freeze({
    regular: Object.freeze({
      prepareReading: { src: "/assets/images/how_to_read_tarot/regular/prepare_reading.png", width: 1122, height: 1402 },
      formQuestion: { src: "/assets/images/how_to_read_tarot/regular/form_question.png", width: 1122, height: 1402 },
      readImagery: { src: "/assets/images/how_to_read_tarot/regular/read_imagery.png", width: 1122, height: 1402 },
      understandSuitNumber: { src: "/assets/images/how_to_read_tarot/regular/understand_suit.png", width: 1122, height: 1402 },
      interpretPosition: { src: "/assets/images/how_to_read_tarot/regular/interpret_positions.png", width: 1122, height: 1402 },
      uprightReversed: { src: "/assets/images/how_to_read_tarot/regular/upright_vs_reversed.png", width: 1122, height: 1402 },
      connectCards: { src: "/assets/images/how_to_read_tarot/regular/connect_the_cards.png", width: 1448, height: 1086 },
      reflectIntegrate: { src: "/assets/images/how_to_read_tarot/regular/reflect_integrate.png", width: 1122, height: 1402 },
      beginReading: { src: "/assets/images/how_to_read_tarot/regular/begin_reading.png", width: 1672, height: 941 },
      exploreSpreads: { src: "/assets/images/how_to_read_tarot/regular/explore_spreads.png", width: 1672, height: 941 },
      browseMeanings: { src: "/assets/images/how_to_read_tarot/regular/browse_meanings.png", width: 1672, height: 941 },
      recordReflection: { src: "/assets/images/how_to_read_tarot/regular/record_reflection.png", width: 1672, height: 941 }
    }),
    bloodmoon: Object.freeze({
      prepareReading: { src: "/assets/images/how_to_read_tarot/bloodmoon/prepare_reading.png", width: 1122, height: 1402 },
      formQuestion: { src: "/assets/images/how_to_read_tarot/bloodmoon/form_question.png", width: 1122, height: 1402 },
      readImagery: { src: "/assets/images/how_to_read_tarot/bloodmoon/read_imagery.png", width: 1122, height: 1402 },
      understandSuitNumber: { src: "/assets/images/how_to_read_tarot/bloodmoon/understand_suit.png", width: 1122, height: 1402 },
      interpretPosition: { src: "/assets/images/how_to_read_tarot/bloodmoon/interpret_position.png", width: 1122, height: 1402 },
      uprightReversed: { src: "/assets/images/how_to_read_tarot/bloodmoon/upright_vs_reversed.png", width: 1122, height: 1402 },
      connectCards: { src: "/assets/images/how_to_read_tarot/bloodmoon/connect_cards.png", width: 1672, height: 941 },
      reflectIntegrate: { src: "/assets/images/how_to_read_tarot/bloodmoon/reflect_integrate.png", width: 1672, height: 941 },
      beginReading: { src: "/assets/images/how_to_read_tarot/bloodmoon/begin_reading.png", width: 1672, height: 941 },
      exploreSpreads: { src: "/assets/images/how_to_read_tarot/bloodmoon/explore_tarot_cards.png", width: 1672, height: 941 },
      browseMeanings: { src: "/assets/images/how_to_read_tarot/bloodmoon/browse_card_meaning.png", width: 1672, height: 941 },
      recordReflection: { src: "/assets/images/how_to_read_tarot/bloodmoon/record_reflection.png", width: 1672, height: 941 }
    })
  });
  const tarotCurriculum = Object.freeze({
    levels: Object.freeze({
      beginner: Object.freeze({
        label: "Beginner",
        track: "Foundations",
        description: "Learn the full reading process from the ground up with clear explanations and guided examples.",
        hintsOpen: true,
        revealRequiresInput: false
      }),
      intermediate: Object.freeze({
        label: "Intermediate",
        track: "Connection",
        description: "Strengthen your readings by connecting imagery, positions, patterns, and card relationships across a full spread.",
        hintsOpen: false,
        revealRequiresInput: true
      }),
      advanced: Object.freeze({
        label: "Advanced",
        track: "Synthesis",
        description: "Synthesize symbolism, context, contradiction, and intuition into nuanced readings that remain grounded and ethically clear.",
        hintsOpen: false,
        revealRequiresInput: true
      })
    }),
    practiceCards: Object.freeze({
      sixCups: Object.freeze({ title: "Six of Cups", keyword: "Nostalgia · memory", regular: "/assets/images/cards/astral-veil-tarot/cups/06-six-of-cups.png", blood: "/assets/images/cards/astral-veil-crimson/cups/06-six-of-cups.png" }),
      strength: Object.freeze({ title: "Strength", keyword: "Courage · compassion", regular: "/assets/images/cards/astral-veil-tarot/major/08-strength.png", blood: "/assets/images/cards/astral-veil-crimson/major/08-strength.png" }),
      threeWands: Object.freeze({ title: "Three of Wands", keyword: "Expansion · foresight", regular: "/assets/images/cards/astral-veil-tarot/wands/03-three-of-wands.png", blood: "/assets/images/cards/astral-veil-crimson/wands/03-three-of-wands.png" }),
      star: Object.freeze({ title: "The Star", keyword: "Renewal · perspective", regular: "/assets/images/cards/astral-veil-tarot/major/17-the-star.png", blood: "/assets/images/cards/astral-veil-crimson/major/17-the-star.png" }),
      moon: Object.freeze({ title: "The Moon", keyword: "Uncertainty · intuition", regular: "/assets/images/cards/astral-veil-tarot/major/18-the-moon.png", blood: "/assets/images/cards/astral-veil-crimson/major/18-the-moon.png" }),
      twoSwords: Object.freeze({ title: "Two of Swords", keyword: "Tension · decision", regular: "/assets/images/cards/astral-veil-tarot/swords/02-two-of-swords.png", blood: "/assets/images/cards/astral-veil-crimson/swords/02-two-of-swords.png" }),
      threeCups: Object.freeze({ title: "Three of Cups", keyword: "Connection · celebration", regular: "/assets/images/cards/astral-veil-tarot/cups/03-three-of-cups.png", blood: "/assets/images/cards/astral-veil-crimson/cups/03-three-of-cups.png" })
    }),
    lessons: Object.freeze([
      {
        id: "prepare-the-reading", aliases: ["prepare"], number: "01", phase: "Foundations", title: "Prepare the Reading",
        levels: {
          beginner: { eyebrow: "Set the Intention", summary: "Begin with attention, a clear purpose, and a simple spread.", introduction: "You do not need psychic abilities to read tarot. You need attention, curiosity, and a question that leaves room for choice.", coreIdea: "Build a clear beginning", explanation: "Choose a deck you can see clearly, make a calm space, keep a journal nearby, and decide on a one- or three-card spread before shuffling.", steps: ["Choose a clear deck and calm space.", "Keep a journal nearby.", "Choose a one-card or three-card spread.", "Settle your attention, name the purpose, and record the question."], practiceLabel: "At this level", practice: "Start with one narrow question and one to three cards. Let your first impression arrive before checking a guidebook.", guidance: { label: "Preparation hint", text: "Keep the setup simple enough that attention stays with the question and the visible cards." } },
          intermediate: { eyebrow: "Define the Context", summary: "Define the reading’s context, timeframe, emotional stakes, and practical boundary before drawing.", introduction: "A useful reading container clarifies who the reading serves, the timeframe it covers, and what the cards can responsibly address.", coreIdea: "Create a Clear Container", explanation: "Connect the question to its real context before selecting a spread, and distinguish reflective curiosity from urgency that may distort the reading.", steps: ["Decide whether the reading is for yourself or another person.", "Clarify the timeframe and emotional investment.", "Define what the reading can and cannot address.", "Choose the spread from the actual question.", "Distinguish curiosity from urgency."], practiceLabel: "Connection practice", practice: "Write the reading’s purpose, timeframe, emotional context, and one boundary before drawing cards.", guidance: { label: "Context check", text: "If the spread does not match the scope of the question, change the spread before adding more cards." } },
          advanced: { eyebrow: "Establish the Reading Protocol", summary: "Establish consent, privacy, bias checks, and ethical limits before deciding whether a reading should proceed.", introduction: "A repeatable protocol makes expectations, consent, privacy, and reader bias visible before interpretation begins.", coreIdea: "Establish the Reading Protocol", explanation: "Advanced preparation includes recognizing when a question is inappropriate for tarot and when uncertainty, consent, or professional boundaries mean the reading should stop.", steps: ["Name your expectation and possible reader bias.", "Clarify consent and what information remains private.", "Define the ethical limit of the reading.", "Decide whether the question is appropriate for tarot.", "Acknowledge when the reading should not continue."], practiceLabel: "Synthesis practice", practice: "Name one expectation, one possible bias, one ethical boundary, and one reason the reading remains appropriate.", guidance: { label: "Protocol prompt", text: "A technically readable question is not automatically an ethically appropriate one." } }
        }
      },
      {
        id: "form-the-question", aliases: ["question"], number: "02", phase: "Foundations", title: "Form the Question",
        levels: {
          beginner: { eyebrow: "Create Useful Scope", summary: "Shape an open, specific question that keeps choice and agency in view.", introduction: "Useful questions are open-ended, specific enough to focus the spread, and centered on your own choices.", coreIdea: "Move from certainty to agency", explanation: "Questions become clearer when they ask what you can understand, notice, or choose.", steps: ["Transform yes-or-no wording.", "Use open-ended language.", "Keep the question centered on your choices.", "Ask what can be understood, noticed, or chosen."], practiceLabel: "Focus", practice: "Use “what,” “how,” or “where can I focus” to create room for insight and action.", guidance: { label: "Question hint", text: "If the answer could only be yes or no, begin again with what, how, or where." } },
          intermediate: { eyebrow: "Scope the Real Concern", summary: "Separate the presenting question from the deeper concern, then add timeframe, scope, and agency.", introduction: "Stronger questions distinguish the surface concern from the issue underneath it and remove assumptions about another person’s inner state.", coreIdea: "Narrow without losing meaning", explanation: "A well-scoped question has a timeframe, an area of agency, and enough focus to guide the spread without scripting the answer.", steps: ["Name the presenting question and deeper concern.", "Remove assumptions about another person’s inner state.", "Add a useful timeframe.", "Narrow questions that are too broad.", "Combine related questions only when one spread can hold them clearly."], practiceLabel: "Connection practice", practice: "Rewrite one question to include scope, timeframe, and agency.", guidance: { label: "Three-stage example", text: "Move from a vague question, to a narrowed question, to an agency-centered question that the querent can act on." } },
          advanced: { eyebrow: "Deconstruct the Inquiry", summary: "Expose leading premises, projection, and secondary inquiries before designing the reading.", introduction: "Complex questions often contain a preferred answer, a hidden assumption, and several inquiries competing for the same spread.", coreIdea: "Do not frame the answer in advance", explanation: "Separate primary and secondary inquiries, remove emotionally loaded premises, and decide whether the material needs one reading, several readings, or no reading.", steps: ["Identify leading or emotionally loaded wording.", "Name projection and the hidden assumption.", "Separate the primary inquiry from secondary inquiries.", "Rewrite the actionable inquiry without pre-selecting an answer.", "Decide whether multiple readings are actually necessary."], practiceLabel: "Synthesis practice", practice: "Deconstruct one complex question into a core inquiry, hidden assumption, actionable inquiry, and optional secondary question.", guidance: { label: "Framing check", text: "If every plausible card would be bent toward the same desired answer, the question still contains its conclusion." } }
        }
      },
      {
        id: "read-the-imagery", aliases: ["imagery"], number: "03", phase: "Foundations", title: "Read the Imagery",
        levels: {
          beginner: { eyebrow: "See Before You Define", summary: "Observe figures, gestures, setting, color, objects, direction, and emotion before interpreting.", introduction: "Soften your gaze. Notice the figure, gesture, setting, color, objects, direction of movement, and the feeling the scene creates.", coreIdea: "Describe before interpreting", explanation: "Choose one layer at a time. Describe what you can see before deciding what it means. Your emotional response matters, but it is not proof.", steps: ["Name the central figure and gesture.", "Describe the setting, colors, and objects.", "Trace the direction of movement.", "Name your emotional response, then return to visible evidence."], practiceLabel: "Practice", practice: "Name three visible details, then turn them into one plain sentence about the scene.", guidance: { label: "Observation hint", text: "Use literal nouns and verbs before symbolic language: figure, hand, cliff, looking, holding, moving." } },
          intermediate: { eyebrow: "Trace Visual Relationships", summary: "Connect gaze, movement, repeated colors, scale, distance, and visual echoes across neighboring cards.", introduction: "At this depth, imagery becomes relational: figures face or avoid one another, colors repeat, and environments create contrast across the spread.", coreIdea: "Read the conversation between cards", explanation: "Notice movement toward or away from neighboring cards, repeated colors and shapes, environmental contrast, and objects that are obscured or missing.", steps: ["Trace gaze direction and body orientation.", "Compare movement toward or away from nearby cards.", "Find repeated colors, shapes, and visual echoes.", "Compare scale, distance, and environmental contrast.", "Notice missing or obscured objects."], practiceLabel: "Connection practice", practice: "Describe one visual relationship between two cards before checking traditional meanings.", guidance: { label: "Relationship hint", text: "Describe what the two images do together before explaining what either card means alone." } },
          advanced: { eyebrow: "Test Symbolic Hierarchy", summary: "Weigh dominant and conflicting images while separating visible evidence from projection.", introduction: "Advanced visual reading holds hierarchy, paradox, archetypal conflict, and intuitive response without confusing any one layer for proof.", coreIdea: "Let tension complicate the obvious reading", explanation: "Identify which symbol dominates, which image conflicts with it, and where traditional symbolism, personal response, or projection may be shaping the conclusion.", steps: ["Identify the dominant image and symbolic priority.", "Name the conflicting image or paradox.", "Separate projection from visible evidence.", "Compare traditional symbolism with intuitive response.", "Form an alternate interpretation supported by the artwork."], practiceLabel: "Synthesis practice", practice: "Identify the dominant image, the conflicting image, one possible projection, and one alternate interpretation supported by the artwork.", guidance: { label: "Deep-analysis prompt", text: "Ask which visible detail would need to change for your preferred interpretation to become less convincing." } }
        }
      },
      {
        id: "understand-suit-and-number", aliases: ["understand-suit-number", "suit-number"], number: "04", phase: "Interpretation", title: "Understand Suit + Number",
        levels: {
          beginner: { eyebrow: "The Deck’s Grammar", summary: "Combine the suit’s realm with the number’s stage to compose a useful meaning.", introduction: "Major Arcana cards often emphasize large turning points. Minor Arcana cards show daily experience through a suit, a number or court rank, and the card’s position.", coreIdea: "Compose the layers", explanation: "Read the suit as the realm of experience and the number as the stage of movement. Combine both with the question and spread position.", steps: ["Identify Wands, Cups, Swords, or Pentacles.", "Name the Ace-through-Ten stage.", "Combine realm and stage in one sentence.", "Add the question and spread position."], practiceLabel: "Build a sentence", practice: "Read the suit as the realm and the number as the stage: a Three of Cups can suggest emotion or relationship growing through connection.", guidance: { label: "Structure hint", text: "Use this sentence frame: the realm of the suit is moving through the stage of the number." } },
          intermediate: { eyebrow: "Find Structural Patterns", summary: "Connect repeated suits, numbers, court ranks, dominant elements, and meaningful absences.", introduction: "Suit and number become more useful when compared across the spread rather than read as isolated definitions.", coreIdea: "Follow repetition and progression", explanation: "Repeated suits or numbers establish tone and rhythm; court cards can describe people, roles, or modes of behavior; absent suits can reveal what needs attention.", steps: ["Find repeated suits and repeated numbers.", "Describe the dominant elemental tone.", "Read number progression across positions.", "Test court cards as people, roles, or behavior.", "Notice dominant and absent suits."], practiceLabel: "Connection practice", practice: "Choose two cards with a shared number or suit and explain the pattern.", guidance: { label: "Pattern hint", text: "A repetition matters most when it changes how two positions or card roles relate." } },
          advanced: { eyebrow: "Weight the Symbolic System", summary: "Judge elemental balance, numerical rhythm, court dynamics, and Major–Minor hierarchy without overpowering context.", introduction: "Deeper correspondences should support the reading’s evidence, not replace the question, imagery, or spread architecture.", coreIdea: "Decide which structure carries weight", explanation: "Compare elemental relationships, absent elements, numerical rhythm, court dynamics, and the hierarchy between Major and Minor Arcana.", steps: ["Map elemental relationships and imbalance.", "Trace numerical rhythm rather than isolated numbers.", "Read court-card dynamics across the spread.", "Weight Major Arcana against supporting Minor Arcana.", "Use optional correspondences only when they clarify the evidence."], practiceLabel: "Synthesis practice", practice: "Explain which suit, number, rank, or absence carries the most interpretive weight and why.", guidance: { label: "Hierarchy prompt", text: "Name the structural layer that leads the reading and the layer that merely supports it." } }
        }
      },
      {
        id: "interpret-the-position", aliases: ["position"], number: "05", phase: "Interpretation", title: "Interpret the Position",
        levels: {
          beginner: { eyebrow: "Meaning in Context", summary: "Let the spread position decide which part of the question a card addresses.", introduction: "A card does not change identity when its position changes, but the position decides which part of the question it addresses.", coreIdea: "Let the position assign the role", explanation: "Select any position by touch, mouse, or keyboard. Then complete the sentence “In this position, The Star suggests…”", steps: ["Name the card’s base meaning.", "Read the position label.", "Join the two in one sentence.", "Treat Possible Outcome as a direction, not a promise."], practiceLabel: "Use the role directly", practice: "Complete this sentence: “In the position of Past, The Star suggests…”", guidance: { label: "Position hint", text: "Challenge describes friction; Advice describes a useful response. Do not make them interchangeable." } },
          intermediate: { eyebrow: "Read Positional Relationships", summary: "Compare roles across the spread and trace how one position modifies the next.", introduction: "Position meanings become a sequence: present influence, challenge, advice, and possible direction can reinforce or complicate one another.", coreIdea: "Read the positions as a progression", explanation: "Compare the same card across roles, distinguish overlapping labels, and notice how neighboring positions narrow or redirect familiar keywords.", steps: ["Compare one card across two positions.", "Distinguish challenge from advice.", "Connect present influence to possible outcome.", "Notice overlapping positional meanings.", "Read the sequence as a progression."], practiceLabel: "Connection practice", practice: "Place the same card in two positions and explain how its message changes.", guidance: { label: "Sequence hint", text: "Ask what changes between adjacent roles rather than treating every position as an isolated answer." } },
          advanced: { eyebrow: "Design the Spread Architecture", summary: "Weight primary and supporting positions, refine vague labels, and resolve overlapping roles through the question.", introduction: "Advanced positional reading treats the spread as architecture: some roles carry the answer while others qualify, contradict, or support it.", coreIdea: "Make every position earn its role", explanation: "Use the question to define precise positions, weight primary against supporting roles, and allow one card to partially answer more than one position when the architecture supports it.", steps: ["Identify primary and supporting positions.", "Find overlapping or contradictory roles.", "Replace vague labels with precise functions.", "Let the question determine each role.", "Test whether one card legitimately answers more than one position."], practiceLabel: "Synthesis practice", practice: "Rewrite one generic spread position into a more precise role, then explain how that changes interpretation.", guidance: { label: "Architecture prompt", text: "A position should ask a distinct interpretive question; if two positions ask the same thing, redesign them." } }
        }
      },
      {
        id: "upright-and-reversed", aliases: ["upright-reversed", "reversals"], number: "06", phase: "Interpretation", title: "Upright + Reversed",
        levels: {
          beginner: { heading: "Read Upright + Reversed", eyebrow: "Direction and Expression", summary: "Compare direct expression with energy that may be blocked, private, delayed, or internalized.", introduction: "A shift in direction can shift the deeper meaning. Reversals are optional and are not automatically negative.", coreIdea: "Choose a consistent framework", explanation: "Upright can describe direct or available expression. Reversed can suggest energy that is blocked, delayed, private, internalized, or overextended.", steps: ["Begin with the upright meaning.", "Treat reversal as optional.", "Test blocked, delayed, private, or redirected expression.", "Read every card upright if reversals reduce clarity."], practiceLabel: "Keep it simple", practice: "If reversals make the reading less clear, read every card upright while you build confidence.", guidance: { label: "Reversal hint", text: "A reversed card is not automatically negative and does not always mean the fixed opposite." } },
          intermediate: { heading: "Read Upright + Reversed", eyebrow: "Compare Contextual Expression", summary: "Test internalized, blocked, delayed, excessive, diminished, and redirected expressions against context.", introduction: "At this depth, a reversal offers several contextual possibilities rather than one memorized opposite.", coreIdea: "Compare more than one expression", explanation: "Ask whether the energy is internalized, blocked, delayed, excessive, diminished, redirected, misunderstood, or temporarily unavailable.", steps: ["State the upright baseline.", "Generate two contextual reversal possibilities.", "Compare both with nearby cards and position.", "Choose the better-supported expression without treating it as certain."], practiceLabel: "Connection practice", practice: "Interpret one reversed card in two different contextual ways.", guidance: { label: "Context hint", text: "Let position and surrounding cards decide which reversal possibility deserves emphasis." } },
          advanced: { heading: "Read Upright + Reversed", eyebrow: "Decide Whether Orientation Matters", summary: "Treat orientation as one signal among shadow, imbalance, irony, contradiction, and surrounding evidence.", introduction: "Advanced reversal work asks whether orientation materially changes the reading or whether stronger contextual evidence should lead.", coreIdea: "Do not force the reversal to dominate", explanation: "Compare fixed opposite, contextual reversal, and orientation-secondary readings while considering private expression, irony, contradiction, and surrounding cards.", steps: ["Write the fixed-opposite interpretation.", "Write a contextual reversal interpretation.", "Write an interpretation where orientation is secondary.", "Choose the best-supported version and explain why.", "Name when not to emphasize the reversal."], practiceLabel: "Synthesis practice", practice: "Compare fixed opposite, contextual reversal, and orientation-secondary interpretations. Choose the best-supported reading and explain why.", guidance: { label: "Deep-analysis prompt", text: "If the surrounding spread already expresses the reversed theme clearly, the card’s orientation may add emphasis rather than a new meaning." } }
        }
      },
      {
        id: "connect-the-cards", aliases: ["connect"], number: "07", phase: "Interpretation", title: "Connect the Cards",
        levels: {
          beginner: { eyebrow: "From Cards to Story", summary: "Read each card, then summarize the spread in one clear sentence.", introduction: "After reading each card in position, zoom out. Repetition, concentration, direction, contradiction, and absence create a second layer of meaning.", coreIdea: "Read the spread as a relationship", explanation: "The featured Three of Cups and Three of Wands repeat the number Three across emotional and active realms. The cards between them change how that growth unfolds.", steps: ["Read each card in its position.", "Zoom out and identify repetition.", "Notice one strong relationship.", "Summarize the spread in one clear sentence."], practiceLabel: "One-sentence method", practice: "Read every card, then summarize the whole spread in one sentence beginning, “This reading is about…”", guidance: { label: "Story hint", text: "Your synthesis should connect the cards without erasing what makes each position distinct." } },
          intermediate: { eyebrow: "Trace the Card Relationships", summary: "Trace repetition, direction, contrast, and visual relationships across the spread.", introduction: "Connection emerges through repeated numbers and suits, elemental patterns, visual direction, contrast, absence, sequence, card pairs, and clusters.", coreIdea: "Build the relationship before the conclusion", explanation: "Read card pairs and clusters, then decide how repetition, concentration, direction, contradiction, absence, and sequence shape the full narrative.", steps: ["Write one sentence for each card.", "Identify a card pair or cluster.", "Name repetition, direction, contrast, or absence.", "Write one sentence for the relationship.", "Write one sentence for the full spread."], practiceLabel: "Pattern method", practice: "Create one sentence for each card, one sentence for the relationship, and one sentence for the full spread.", guidance: { label: "Connection hint", text: "Rank the two strongest patterns and explain whether they reinforce or challenge one another." } },
          advanced: { eyebrow: "Build the Hierarchy of Meaning", summary: "Build a hierarchy of meaning, reconcile contradiction, and preserve alternate interpretations.", introduction: "Advanced synthesis weighs dominant and supporting cards, central tension, contradiction, Major–Minor hierarchy, and the evidence behind competing narratives.", coreIdea: "Preserve tension without forcing a story", explanation: "Choose a primary synthesis while retaining an alternate reading, unresolved ambiguity, and a clear account of which cards support each claim.", steps: ["Identify dominant and supporting cards.", "Name the spread’s central tension.", "Reconcile or preserve contradiction.", "Write a primary and alternate synthesis.", "State the strongest evidence and unresolved ambiguity."], practiceLabel: "Synthesis method", practice: "Write a primary synthesis, alternate synthesis, strongest supporting evidence, and unresolved ambiguity.", guidance: { label: "Evidence prompt", text: "A compelling narrative is not enough; identify the card, position, pattern, or visual relationship that supports every major claim." } }
        }
      },
      {
        id: "reflect-and-integrate", aliases: ["reflect-integrate", "reflect"], number: "08", phase: "Integration", title: "Reflect + Integrate",
        levels: {
          beginner: { eyebrow: "Close the Reading", summary: "Notice what changed, name what the reading suggested, and choose one grounded next step.", introduction: "End by naming what the reading helped you notice—not what it proved. Record the cards, question, first impression, and one grounded next step.", coreIdea: "Notice, name, and choose", explanation: "Separate what stood out from what the reading suggested, then choose one practical response without demanding certainty.", steps: ["Notice what stood out.", "Name what the reading suggested.", "Choose one grounded next step.", "Record the question, cards, and first impression."], practiceLabel: "Journal prompt", practice: "Which card felt clearest, and what action can you take without needing certainty?", guidance: { label: "Reflection hint", text: "Keep observations, interpretations, and choices in separate sentences." }, reflectionPrompts: { notice: "What image, phrase, or feeling continues to hold your attention?", name: "What did the reading suggest without claiming certainty?", choose: "What grounded action remains yours to take?" } },
          intermediate: { eyebrow: "Compare Observation and Inference", summary: "Separate observation from inference, track what changed, and record what remains uncertain.", introduction: "Integration deepens when you compare the first impression with the connected reading and identify which assumptions changed.", coreIdea: "Audit the movement of the reading", explanation: "Record what you observed, what you inferred, what changed after connecting the cards, what remains uncertain, and one practical response.", steps: ["Record the original observation.", "Name the interpretation you inferred.", "Describe what changed after connecting the cards.", "Identify assumptions and remaining uncertainty.", "Choose a practical response."], practiceLabel: "Journal prompt", practice: "What did I observe, what did I infer, what changed after connecting the cards, and what remains uncertain?", guidance: { label: "Integration hint", text: "If the final reading differs from the first impression, record which relationship or pattern changed it." }, reflectionPrompts: { notice: "What did I observe before I began interpreting?", name: "What did I infer, and what changed after I connected the cards?", choose: "What remains uncertain, and what practical response is still available?" } },
          advanced: { eyebrow: "Audit Confidence and Responsibility", summary: "Assess confidence, alternate interpretations, bias, ethical limits, and what the cards cannot support.", introduction: "Advanced integration examines projection, confidence levels, unresolved ambiguity, and whether a reading should influence action at all.", coreIdea: "State the limit of the interpretation", explanation: "Name the best-supported conclusion, confidence level, possible bias, plausible alternative, ethical limitation, and evidence that would change the reading.", steps: ["State the most-supported conclusion and confidence level.", "Name reader bias or projection.", "Preserve one plausible alternate interpretation.", "Identify unresolved ambiguity and ethical limitation.", "State what should not be claimed from the cards."], practiceLabel: "Journal prompt", practice: "Which conclusion is best supported, how confident am I, what bias may be present, what alternate reading remains plausible, and what should not be claimed?", guidance: { label: "Responsibility prompt", text: "A careful reading includes the conditions under which its conclusion would need to change." }, reflectionPrompts: { notice: "Which conclusion is best supported, and how confident am I?", name: "What bias, projection, or alternate interpretation remains plausible?", choose: "What should not be claimed, and what ethical limit should shape the response?" } }
        }
      },
      {
        id: "guided-practice", aliases: ["practice"], number: "09", phase: "Integration", title: "Guided Practice",
        levels: {
          beginner: { heading: "Read a Three-Card Spread", eyebrow: "Guided Practice", summary: "Read a Past, Present, and Future spread, then compare your synthesis with one example.", introduction: "Put the method together. Observe first, write your interpretation, then compare it with one possible synthesis.", coreIdea: "Practice the complete beginner method", explanation: "Use the visible checklist to move from imagery and structure to position, pattern, and one connected story.", steps: ["Observe before defining.", "Identify suit or Major Arcana.", "Read each card in position.", "Notice a pattern.", "Write one connected interpretation."], practiceLabel: "Three-card practice", practice: "Interpret Past, Present, and Future before revealing the example.", guidance: { label: "Guided hint", text: "Begin with one sentence per card, then join the three sentences into one movement." }, guidedPractice: { cardKeys: ["sixCups", "strength", "threeWands"], positions: ["Past", "Present", "Future"], prompts: [["imagery", "Observe the imagery", "What visual detail draws your eye first, and how does the feeling change from card to card?"], ["structure", "Identify suit or Arcana", "Where do Cups, Major Arcana, and Wands appear—and how does that sequence move from feeling to character to action?"], ["position", "Consider the position", "How does memory shape the Past, courage shape the Present, and expansion become a possible Future?"], ["patterns", "Notice repeating patterns", "What changes across the elements, colors, figures, and directions of movement? What is noticeably absent?"], ["story", "Connect the story", "Tell the spread as one unfolding sentence. Where does the story begin, turn, and open outward?"]], inputLabel: "Your interpretation", placeholder: "Write your interpretation here...", insight: "The Six of Cups places memory and familiar feeling in the past. Strength asks for patient courage now. The Three of Wands suggests that this steadiness can support a wider future." } },
          intermediate: { heading: "Read a Five-Card Spread", eyebrow: "Connection Practice", summary: "Connect five positions through repeated, contrasting, and directional patterns before revealing an example.", introduction: "Use five cards to connect the present situation, underlying influence, challenge, advice, and direction into one coherent reading.", coreIdea: "Move from card-by-card meaning to relationship", explanation: "Observe first, identify at least one relationship and one repeated or contrasting pattern, then write the connected interpretation before viewing the example.", steps: ["Read Present Situation and Underlying Influence together.", "Compare Challenge with Advice.", "Trace the Direction card back through the spread.", "Name one repeated or contrasting pattern.", "Write the synthesis before revealing the example."], practiceLabel: "Five-card practice", practice: "Write a card-by-card reading, one relationship pattern, and a full synthesis.", guidance: { label: "Connection hint", text: "Treat the center and advice positions as a relationship, not two separate instructions." }, guidedPractice: { cardKeys: ["star", "moon", "twoSwords", "strength", "threeWands"], positions: ["Present Situation", "Underlying Influence", "Challenge", "Advice", "Direction"], prompts: [["observe", "Observe before meaning", "What changes when you look across all five images before naming any traditional meaning?"], ["positions", "Compare the positions", "How do the underlying influence and challenge shape the present situation?"], ["relationship", "Find a relationship", "Which two cards form the strongest pair, and how do they modify one another?"], ["pattern", "Trace a pattern", "Identify one repetition, contrast, direction, or absence that crosses the spread."], ["synthesis", "Build the synthesis", "Write the card-by-card reading, relationship pattern, and full connected synthesis."]], inputLabel: "Your connected interpretation", placeholder: "Write the five card meanings, strongest relationship, pattern, and full synthesis...", insight: "Card by card, The Star seeks renewal, The Moon complicates certainty, the Two of Swords holds the challenge of decision, Strength offers patient self-regulation, and the Three of Wands opens a possible direction. The relationship between uncertainty and restraint suggests that clarity grows through deliberate patience rather than urgency. This is one supported synthesis, not the only possible reading." } },
          advanced: { heading: "Read a Seven-Card Synthesis", eyebrow: "Synthesis Practice", summary: "Weigh dominant patterns, contradiction, alternate readings, confidence, and ethical limits across seven positions.", introduction: "Use seven positions to build a primary synthesis while preserving contradictory evidence, an alternate reading, a confidence level, and an ethical limit.", coreIdea: "Demonstrate the reasoning, not an absolute answer", explanation: "Identify symbolic priority and spread architecture, then show how evidence supports the primary interpretation without erasing ambiguity or responsible limits.", steps: ["Name the dominant pattern and symbolic priority.", "Record contradictory evidence.", "Write the primary synthesis.", "Write an alternate synthesis.", "Assign a confidence level.", "State one ethical limitation."], practiceLabel: "Seven-card synthesis", practice: "Record the dominant pattern, contradictory evidence, primary and alternate syntheses, confidence level, and ethical limitation.", guidance: { label: "Deep-analysis prompt", text: "Before revealing the example, identify which single card or relationship carries the most weight and which evidence resists it." }, guidedPractice: { cardKeys: ["moon", "threeCups", "sixCups", "twoSwords", "strength", "star", "threeWands"], positions: ["Core Situation", "Visible Influence", "Hidden Influence", "Central Tension", "Available Resource", "Responsible Action", "Possible Direction"], prompts: [["dominant", "Rank the pattern", "Which card, pair, or repeated structure carries the greatest symbolic weight, and why?"], ["contradiction", "Test contradiction", "What evidence complicates or resists the most obvious interpretation?"], ["primary", "Primary synthesis", "Write the most strongly supported synthesis and cite its key evidence."], ["alternate", "Alternate synthesis", "Write another plausible synthesis supported by a different hierarchy of evidence."], ["confidence", "Confidence level", "How confident are you, and what additional evidence would change that confidence?"], ["ethics", "Ethical limitation", "What should not be claimed from this spread, and what responsible action remains available?" ]], inputLabel: "Your synthesis audit", placeholder: "Record the dominant pattern, contradiction, primary synthesis, alternate synthesis, confidence level, and ethical limitation...", insight: "A primary synthesis centers uncertainty and guarded choice, with Strength and The Star supporting patient, responsible clarification before outward movement. An alternate reading gives greater weight to the two Threes and sees reconnection as the catalyst for expansion. Confidence should remain moderate because the Moon and Two of Swords preserve ambiguity. The spread cannot guarantee an outcome or justify overriding consent, privacy, or professional guidance." } }
        }
      }
    ])
  });
  const tarotLessons = tarotCurriculum.lessons;
  const semanticLessonImages = Array.from(root.querySelectorAll("[data-htr-asset]"));
  const imageMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  function activeAssetTheme() {
    return document.body.classList.contains("blood-moon-mode") ? "bloodmoon" : "regular";
  }

  function setSemanticImageSource(image, asset) {
    if (!asset || image.getAttribute("src") === asset.src) return;
    if (!imageMotionPreference.matches && image.getAttribute("src")) image.classList.add("is-theme-switching");
    image.addEventListener("load", () => image.classList.remove("is-theme-switching"), { once: true });
    image.width = asset.width;
    image.height = asset.height;
    image.style.objectPosition = image.dataset.objectPosition || "center";
    image.setAttribute("src", asset.src);
  }

  function syncSemanticLessonImages() {
    const theme = activeAssetTheme();
    const lessonElements = Array.from(root.querySelectorAll("[data-course-lesson]"));
    const activeLesson = root.querySelector("[data-course-lesson].is-active");
    const activeIndex = Math.max(0, lessonElements.indexOf(activeLesson));
    semanticLessonImages.forEach((image) => {
      const owner = image.closest("[data-lesson]");
      const ownerIndex = lessonElements.indexOf(owner);
      const closeToActive = ownerIndex < 0 || Math.abs(ownerIndex - activeIndex) <= 1;
      if (!closeToActive) return;
      const asset = howToReadTarotAssets[theme][image.dataset.htrAsset];
      image.loading = ownerIndex === activeIndex ? "eager" : "lazy";
      image.setAttribute("fetchpriority", ownerIndex === activeIndex ? "high" : "low");
      setSemanticImageSource(image, asset);
    });
  }

  const levels = Object.keys(tarotCurriculum.levels);
  const levelTabs = Array.from(root.querySelectorAll("[data-level-tab]"));
  const levelPanels = Array.from(root.querySelectorAll("[data-level-panel]"));
  const levelCopy = Array.from(root.querySelectorAll("[data-level-copy]"));
  const levelStorageKey = "astralVeilTarotLearningLevel";
  let activeLevel = "beginner";
  let refreshActiveLessonHeight = () => {};
  let courseUiReady = false;
  let adaptiveUiReady = false;

  function storedLevel() {
    try {
      const value = sessionStorage.getItem(levelStorageKey);
      return levels.includes(value) ? value : "";
    } catch (error) {
      return "";
    }
  }

  function setStoredLevel(level) {
    try { sessionStorage.setItem(levelStorageKey, level); } catch (error) { /* Storage is optional. */ }
  }

  function replaceLevelQuery(level) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("level", level);
    history.replaceState(history.state, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
  }

  function updateLevel(level, options = {}) {
    if (!levels.includes(level)) return;
    const scrollY = window.scrollY;
    const changed = activeLevel !== level;
    activeLevel = level;
    document.body.dataset.learningLevel = level;

    levelTabs.forEach((tab) => {
      const active = tab.dataset.levelTab === level;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    levelPanels.forEach((panel) => {
      const active = panel.dataset.levelPanel === level;
      const description = panel.querySelector("p");
      if (description) description.textContent = tarotCurriculum.levels[panel.dataset.levelPanel]?.description || tarotCurriculum.levels.beginner.description;
      panel.hidden = !active;
      if (active) panel.removeAttribute("inert");
      else panel.setAttribute("inert", "");
    });

    levelCopy.forEach((copy) => {
      const active = copy.dataset.levelCopy === level;
      copy.hidden = !active;
      if (active) copy.removeAttribute("inert");
      else copy.setAttribute("inert", "");
    });

    root.querySelectorAll("[data-practice-keyword]").forEach((keyword) => {
      keyword.hidden = level !== "beginner";
    });
    root.querySelector("[data-position-alternate]")?.toggleAttribute("hidden", level !== "advanced");
    setStoredLevel(level);
    if (options.updateUrl) replaceLevelQuery(level);
    if (adaptiveUiReady) renderAdaptiveCurriculum(level, { animate: changed, announce: changed });
    if (courseUiReady) updateSelectedPreview();
    window.requestAnimationFrame(() => {
      refreshActiveLessonHeight();
      window.scrollTo({ top: scrollY, left: window.scrollX, behavior: "auto" });
    });
  }

  levelTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => updateLevel(tab.dataset.levelTab, { updateUrl: true }));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % levelTabs.length;
      else if (event.key === "ArrowLeft") nextIndex = (index - 1 + levelTabs.length) % levelTabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = levelTabs.length - 1;
      else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateLevel(tab.dataset.levelTab, { updateUrl: true });
        return;
      } else return;
      event.preventDefault();
      levelTabs[nextIndex].focus();
      updateLevel(levelTabs[nextIndex].dataset.levelTab, { updateUrl: true });
    });
  });

  const queryLevel = new URLSearchParams(location.search).get("level");
  const legacyHashLevel = levels.includes(location.hash.slice(1)) ? location.hash.slice(1) : "";
  const directLevel = levels.includes(queryLevel) ? queryLevel : legacyHashLevel;
  updateLevel(directLevel || storedLevel() || "beginner");

  const questionExamples = {
    relationship: { vague: "Does this person love me?", clear: "What can I understand about the dynamic between us and my choices within it?" },
    career: { vague: "Will I get the job?", clear: "What can I focus on as I navigate this opportunity?" },
    decision: { vague: "Will this definitely happen?", clear: "What should I understand about the direction of this situation?" },
    growth: { vague: "When will I finally change?", clear: "What pattern can I work with as I choose my next step?" }
  };
  const questionSelect = root.querySelector("[data-question-select]");
  const questionResult = root.querySelector("[data-question-result]");
  const questionVague = root.querySelector("[data-question-vague]");
  const intentButtons = Array.from(root.querySelectorAll("[data-question-intent]"));

  function setQuestionIntent(intent) {
    const example = questionExamples[intent] || questionExamples.decision;
    if (questionSelect) questionSelect.value = intent;
    if (questionVague) questionVague.textContent = `“${example.vague}”`;
    if (questionResult) questionResult.textContent = example.clear;
    intentButtons.forEach((button) => {
      const selected = button.dataset.questionIntent === intent;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }
  questionSelect?.addEventListener("change", () => setQuestionIntent(questionSelect.value));
  intentButtons.forEach((button) => button.addEventListener("click", () => setQuestionIntent(button.dataset.questionIntent)));
  setQuestionIntent(questionSelect?.value || "decision");

  const observationContent = {
    figure: ["Figure", "Begin with the central presence", "Notice who occupies the scene, how they are dressed, and what role they seem to hold before naming an archetype."],
    gesture: ["Gesture", "Read the body before the symbol", "The figure’s posture, hands, and balance can suggest readiness, caution, openness, or uncertainty."],
    setting: ["Setting", "Let the environment establish context", "Describe the landscape, weather, horizon, and distance. Ask what the setting makes possible or difficult."],
    color: ["Color", "Notice where contrast gathers", "Look for dominant and accent colors, then notice where warmth, coolness, light, or shadow changes the emotional tone."],
    objects: ["Objects", "Inventory what the scene carries", "Name visible tools, plants, animals, clothing, and repeated shapes before assigning traditional meanings."],
    direction: ["Direction", "Follow the visual movement", "Trace where the figure looks, where lines point, and whether the card’s energy moves inward, outward, forward, or back."],
    emotion: ["Emotional response", "Include your response without treating it as proof", "Name the feeling that arrives, then return to visible evidence and ask which details may have created it."]
  };
  const observationStage = root.querySelector(".htr-observation");
  const observationButtons = Array.from(root.querySelectorAll("[data-observation]"));
  const observationLabel = root.querySelector("[data-observation-label]");
  const observationTitle = root.querySelector("[data-observation-title]");
  const observationCopy = root.querySelector("[data-observation-copy]");

  function setObservation(key) {
    const content = observationContent[key];
    if (!content) return;
    if (observationStage) observationStage.dataset.activeObservation = key;
    observationButtons.forEach((button) => button.setAttribute("aria-selected", String(button.dataset.observation === key)));
    if (observationLabel) observationLabel.textContent = content[0];
    if (observationTitle) observationTitle.textContent = content[1];
    if (observationCopy) observationCopy.textContent = content[2];
  }
  observationButtons.forEach((button) => button.addEventListener("click", () => setObservation(button.dataset.observation)));

  const suitContent = {
    wands: { name: "Wands", realm: "Action, creativity, or desire" },
    cups: { name: "Cups", realm: "Emotion, community, or connection" },
    swords: { name: "Swords", realm: "Thought, truth, or communication" },
    pentacles: { name: "Pentacles", realm: "Body, work, or resources" }
  };
  const numberContent = {
    1: { name: "Ace", phrase: "beginning to take form" },
    2: { name: "Two", phrase: "meeting a choice, balance, or counterpart" },
    3: { name: "Three", phrase: "growing through shared experience" },
    4: { name: "Four", phrase: "seeking structure, stability, or protection" },
    5: { name: "Five", phrase: "moving through tension, loss, or change" },
    6: { name: "Six", phrase: "finding exchange, adjustment, or renewed flow" },
    7: { name: "Seven", phrase: "being tested through assessment or persistence" },
    8: { name: "Eight", phrase: "gaining momentum through focus and repetition" },
    9: { name: "Nine", phrase: "approaching completion through independence or endurance" },
    10: { name: "Ten", phrase: "reaching culmination, legacy, or necessary release" }
  };
  const suitButtons = Array.from(root.querySelectorAll("[data-suit]"));
  const numberButtons = Array.from(root.querySelectorAll("[data-number]"));
  const suitNumberTitle = root.querySelector("[data-suit-number-title]");
  const suitNumberCopy = root.querySelector("[data-suit-number-copy]");
  let activeSuit = "wands";
  let activeNumber = "1";

  function updateSuitNumber() {
    const suit = suitContent[activeSuit];
    const number = numberContent[activeNumber];
    if (!suit || !number) return;
    suitButtons.forEach((button) => {
      const selected = button.dataset.suit === activeSuit;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    numberButtons.forEach((button) => {
      const selected = button.dataset.number === activeNumber;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    if (suitNumberTitle) suitNumberTitle.textContent = `${number.name} + ${suit.name}`;
    if (suitNumberCopy) suitNumberCopy.textContent = `${suit.realm} ${number.phrase}.`;
  }
  suitButtons.forEach((button) => button.addEventListener("click", () => { activeSuit = button.dataset.suit; updateSuitNumber(); }));
  numberButtons.forEach((button) => button.addEventListener("click", () => { activeNumber = button.dataset.number; updateSuitNumber(); }));
  updateSuitNumber();

  const positionMeanings = {
    past: ["The Star · Past", "Hope that shaped the present", "A period of healing, renewed trust, or clearer purpose may be an important foundation for the current situation.", "Alternatively, an earlier ideal may still be shaping expectations more strongly than present evidence."],
    present: ["The Star · Present", "A clear place to recover", "Renewal is available now through honesty, patience, and a willingness to reconnect with what feels meaningful.", "The card may also describe vulnerability: hope is present, but still needs protection and practical support."],
    advice: ["The Star · Advice", "Choose the honest horizon", "Let the next step be guided by clarity and restoration rather than urgency. Make room for a longer view.", "Advice may be to test an inspiring vision gently instead of turning it into an expectation."],
    challenge: ["The Star · Challenge", "Hope without avoidance", "The challenge is to remain open without using optimism to bypass grief, uncertainty, or practical constraints.", "A competing reading is that trust has become difficult, and the task is to rebuild it through small evidence."],
    outcome: ["The Star · Possible Outcome", "A direction of renewal", "Current patterns may lead toward greater clarity, confidence, and emotional spaciousness if care continues.", "This is a possible direction, not a promise; it depends on choices that support recovery and openness."]
  };
  const positionButtons = Array.from(root.querySelectorAll("[data-position]"));
  const positionTitle = root.querySelector("[data-position-title]");
  const positionCopy = root.querySelector("[data-position-copy]");
  const positionAlternate = root.querySelector("[data-position-alternate]");
  const positionStage = root.querySelector("[data-position-stage]");

  function setPosition(position) {
    const meaning = positionMeanings[position];
    if (!meaning) return;
    positionButtons.forEach((button) => {
      const selected = button.dataset.position === position;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    if (positionStage) positionStage.dataset.activePosition = position;
    const container = positionTitle?.closest(".htr-position-tool__meaning");
    const label = container?.querySelector("small");
    if (label) label.textContent = meaning[0];
    if (positionTitle) positionTitle.textContent = meaning[1];
    if (positionCopy) positionCopy.textContent = meaning[2];
    if (positionAlternate) positionAlternate.textContent = `Another plausible reading: ${meaning[3]}`;
  }
  positionButtons.forEach((button) => button.addEventListener("click", () => setPosition(button.dataset.position)));
  setPosition("past");

  const reversalCard = root.querySelector("[data-reversal-card]");
  const reversalTitle = root.querySelector("[data-reversal-title]");
  const reversalCopy = root.querySelector("[data-reversal-copy]");
  const orientationButtons = Array.from(root.querySelectorAll("[data-orientation]"));
  const reversalCardToggle = root.querySelector("[data-reversal-card-toggle]");

  function setOrientation(orientation) {
    const reversed = orientation === "reversed";
    orientationButtons.forEach((choice) => {
      const selected = choice.dataset.orientation === orientation;
      choice.classList.toggle("is-active", selected);
      choice.setAttribute("aria-pressed", String(selected));
    });
    reversalCard?.classList.toggle("is-reversed", reversed);
    reversalCardToggle?.setAttribute("aria-pressed", String(reversed));
    if (reversalTitle) reversalTitle.textContent = reversed ? "Energy turned inward" : "Focused expression";
    if (reversalCopy) reversalCopy.textContent = reversed
      ? "Skill or intention may be blocked, scattered, private, underused, or directed toward an unclear aim."
      : "Skill, attention, and available resources are moving directly toward an intention.";
  }
  orientationButtons.forEach((button) => button.addEventListener("click", () => setOrientation(button.dataset.orientation)));
  reversalCardToggle?.addEventListener("click", () => setOrientation(reversalCard?.classList.contains("is-reversed") ? "upright" : "reversed"));

  const patternContent = {
    repetition: { label: "Repetition", title: "A shared number carries weight", copy: "The two Threes echo growth and development across emotional and active realms.", cards: [0, 3] },
    concentration: { label: "Concentration", title: "The center holds the pressure", copy: "The Moon and Two of Swords concentrate uncertainty and deliberation in the middle of the spread.", cards: [1, 2] },
    direction: { label: "Direction", title: "Movement travels across the spread", copy: "The figures and horizons invite the eye from shared feeling toward uncertainty, decision, and outward expansion.", cards: [0, 1, 2, 3] },
    contradiction: { label: "Contradiction", title: "Openness meets restraint", copy: "Celebration and expansion sit beside uncertainty and guarded choice, creating a meaningful tension rather than one fixed answer.", cards: [0, 2, 3] },
    absence: { label: "Absence", title: "What is missing also shapes the reading", copy: "Pentacles are absent, so practical resources, the body, or grounded follow-through may need conscious attention.", cards: [] }
  };
  const patternStage = root.querySelector(".htr-connection-stage");
  const patternButtons = Array.from(root.querySelectorAll("[data-pattern]"));
  const patternCards = Array.from(root.querySelectorAll("[data-pattern-card]"));
  const patternLabel = root.querySelector("[data-pattern-label]");
  const patternTitle = root.querySelector("[data-pattern-title]");
  const patternCopy = root.querySelector("[data-pattern-copy]");

  function setPattern(pattern) {
    const content = patternContent[pattern];
    if (!content) return;
    if (patternStage) patternStage.dataset.activePattern = pattern;
    patternButtons.forEach((button) => {
      const selected = button.dataset.pattern === pattern;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    patternCards.forEach((card, index) => {
      const highlighted = content.cards.includes(index);
      card.classList.toggle("is-highlighted", highlighted);
      card.classList.toggle("is-quiet", content.cards.length > 0 && !highlighted);
    });
    if (patternLabel) patternLabel.textContent = content.label;
    if (patternTitle) patternTitle.textContent = content.title;
    if (patternCopy) patternCopy.textContent = content.copy;
  }
  patternButtons.forEach((button) => button.addEventListener("click", () => setPattern(button.dataset.pattern)));
  setPattern("repetition");

  const reflectionButtons = Array.from(root.querySelectorAll("[data-reflection-stage]"));
  const reflectionPrompt = root.querySelector("[data-reflection-prompt]");
  function setReflectionStage(stage) {
    const reflectionPrompts = levelVariant(tarotLessons[7])?.reflectionPrompts
      || levelVariant(tarotLessons[7], "beginner")?.reflectionPrompts
      || {};
    reflectionButtons.forEach((button) => {
      const selected = button.dataset.reflectionStage === stage;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    if (reflectionPrompt) reflectionPrompt.textContent = reflectionPrompts[stage] || reflectionPrompts.notice;
  }
  reflectionButtons.forEach((button) => button.addEventListener("click", () => setReflectionStage(button.dataset.reflectionStage)));

  function enableRovingRail(buttons) {
    if (!buttons.length) return;
    const isSelected = (button) => button.getAttribute("aria-selected") === "true" || button.getAttribute("aria-pressed") === "true";
    const syncTabStops = (activeButton) => buttons.forEach((button) => { button.tabIndex = button === activeButton ? 0 : -1; });
    syncTabStops(buttons.find(isSelected) || buttons[0]);
    buttons.forEach((button, index) => {
      button.addEventListener("click", () => syncTabStops(button));
      button.addEventListener("keydown", (event) => {
        let nextIndex = index;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % buttons.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + buttons.length) % buttons.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = buttons.length - 1;
        else return;
        event.preventDefault();
        event.stopPropagation();
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
      });
    });
  }
  function connectTabPanel(buttons, panel, idPrefix) {
    if (!buttons.length || !panel) return;
    panel.id ||= `${idPrefix}-panel`;
    panel.setAttribute("role", "tabpanel");
    const syncLabel = (button) => panel.setAttribute("aria-labelledby", button.id);
    buttons.forEach((button, index) => {
      button.id ||= `${idPrefix}-tab-${index + 1}`;
      button.setAttribute("aria-controls", panel.id);
      button.addEventListener("click", () => syncLabel(button));
    });
    syncLabel(buttons.find((button) => button.getAttribute("aria-selected") === "true") || buttons[0]);
  }
  [intentButtons, observationButtons, suitButtons, numberButtons, positionButtons, orientationButtons, patternButtons, reflectionButtons].forEach(enableRovingRail);
  connectTabPanel(observationButtons, root.querySelector(".htr-observation__explanation"), "observation");
  connectTabPanel(numberButtons, root.querySelector(".htr-suit-interpretation"), "suit-number");
  connectTabPanel(positionButtons, root.querySelector(".htr-position-tool__meaning"), "position");
  connectTabPanel(patternButtons, root.querySelector(".htr-pattern-explanation"), "pattern");
  connectTabPanel(reflectionButtons, reflectionPrompt, "reflection");

  const promptTablist = root.querySelector(".htr-prompt-tabs");
  const activePrompt = root.querySelector("[data-practice-prompt-copy]");
  let promptTabs = [];
  let practicePromptCopy = new Map();
  const practiceInput = root.querySelector("[data-practice-input]");
  const practiceInsight = root.querySelector("[data-practice-insight]");
  const insightCopy = root.querySelector("[data-practice-insight-copy]");
  const practiceCardsContainer = root.querySelector(".htr-practice__cards");
  const practiceRevealButton = root.querySelector("[data-practice-reveal]");
  const practiceResetButton = root.querySelector("[data-practice-reset]");
  const practiceInputLabel = practiceInput?.closest(".htr-practice__write")?.querySelector('label[for="practice-reflection"]');
  let practiceCardButtons = [];
  let practiceCardFrames = [];
  let practiceRotateButtons = [];
  let currentPracticeConfig = null;

  function activatePracticePrompt(button) {
    promptTabs.forEach((tab) => {
      const selected = tab === button;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    if (activePrompt) activePrompt.textContent = practicePromptCopy.get(button.dataset.practicePrompt) || "";
  }

  function configurePracticePrompts(prompts) {
    if (!promptTablist || !activePrompt || !Array.isArray(prompts) || !prompts.length) return;
    const fragment = document.createDocumentFragment();
    practicePromptCopy = new Map();
    prompts.forEach(([key, label, copy], index) => {
      practicePromptCopy.set(key, copy);
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(index === 0));
      button.dataset.practicePrompt = key;
      const number = document.createElement("span");
      number.textContent = String(index + 1);
      button.append(number, document.createTextNode(label));
      fragment.append(button);
    });
    promptTablist.replaceChildren(fragment);
    promptTabs = Array.from(promptTablist.querySelectorAll("[data-practice-prompt]"));
    promptTabs.forEach((button) => button.addEventListener("click", () => activatePracticePrompt(button)));
    enableRovingRail(promptTabs);
    connectTabPanel(promptTabs, activePrompt, "practice-prompt");
    activatePracticePrompt(promptTabs[0]);
  }

  function bindPracticeCardControls() {
    practiceCardButtons = Array.from(root.querySelectorAll("[data-practice-card]"));
    practiceCardFrames = Array.from(root.querySelectorAll("[data-practice-card-frame]"));
    practiceRotateButtons = Array.from(root.querySelectorAll("[data-practice-rotate]"));
    practiceCardButtons.forEach((cardButton) => {
      const frame = cardButton.closest("[data-practice-card-frame]");
      cardButton.addEventListener("click", () => {
        const enlarged = !frame?.classList.contains("is-enlarged");
        practiceCardFrames.forEach((item) => item.classList.remove("is-enlarged"));
        practiceCardButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
        frame?.classList.toggle("is-enlarged", enlarged);
        cardButton.setAttribute("aria-expanded", String(enlarged));
      });
    });
    practiceRotateButtons.forEach((button) => button.addEventListener("click", () => {
      const frame = button.closest("[data-practice-card-frame]");
      const rotated = !frame?.classList.contains("is-rotated");
      frame?.classList.toggle("is-rotated", rotated);
      button.setAttribute("aria-pressed", String(rotated));
    }));
  }

  function createPracticeCard(cardKey, position) {
    const card = tarotCurriculum.practiceCards[cardKey];
    if (!card) return null;
    const figure = document.createElement("figure");
    figure.dataset.practiceCardFrame = "";
    const enlarge = document.createElement("button");
    enlarge.className = "htr-practice-card";
    enlarge.type = "button";
    enlarge.setAttribute("aria-expanded", "false");
    enlarge.setAttribute("aria-label", `Enlarge ${card.title} in the ${position} position`);
    enlarge.dataset.practiceCard = "";
    const image = document.createElement("img");
    image.src = document.body.classList.contains("blood-moon-mode") ? card.blood : card.regular;
    image.alt = `${card.title} in the ${position} position`;
    image.width = 1024;
    image.height = 1536;
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    image.dataset.htrThemeImage = "";
    image.dataset.standardSrc = card.regular;
    image.dataset.bloodSrc = card.blood;
    enlarge.append(image);
    const caption = document.createElement("figcaption");
    const label = document.createElement("strong");
    label.textContent = position;
    const keyword = document.createElement("span");
    keyword.dataset.practiceKeyword = "";
    keyword.textContent = card.keyword;
    const rotate = document.createElement("button");
    rotate.type = "button";
    rotate.setAttribute("aria-pressed", "false");
    rotate.dataset.practiceRotate = "";
    rotate.textContent = "Rotate";
    caption.append(label, keyword, rotate);
    figure.append(enlarge, caption);
    return figure;
  }

  function setPracticeKeywordsVisibility(revealed = false) {
    root.querySelectorAll("[data-practice-keyword]").forEach((keyword) => {
      keyword.hidden = activeLevel !== "beginner" && !revealed;
    });
  }

  function updatePracticeRevealAvailability() {
    if (!practiceRevealButton) return;
    const requiresInput = tarotCurriculum.levels[activeLevel]?.revealRequiresInput;
    const ready = !requiresInput || Boolean(practiceInput?.value.trim());
    practiceRevealButton.disabled = !ready;
    const label = practiceRevealButton.querySelector(".htr-button__label");
    if (label) label.textContent = ready ? "Reveal Example Interpretation" : "Write an Interpretation to Reveal";
  }

  function configureGuidedPractice(config) {
    if (!config || !practiceCardsContainer) return;
    currentPracticeConfig = config;
    const fragment = document.createDocumentFragment();
    config.cardKeys.forEach((cardKey, index) => {
      const figure = createPracticeCard(cardKey, config.positions[index] || `Position ${index + 1}`);
      if (figure) fragment.append(figure);
    });
    practiceCardsContainer.replaceChildren(fragment);
    practiceCardsContainer.dataset.cardCount = String(config.cardKeys.length);
    practiceCardsContainer.setAttribute("aria-label", `${config.positions.join(", ")} tarot spread`);
    configurePracticePrompts(config.prompts);
    bindPracticeCardControls();
    if (practiceInputLabel) practiceInputLabel.textContent = config.inputLabel;
    if (practiceInput) practiceInput.placeholder = config.placeholder;
    if (practiceInsight) practiceInsight.hidden = true;
    setPracticeKeywordsVisibility(false);
    updatePracticeRevealAvailability();
    syncThemeImages();
  }

  practiceRevealButton?.addEventListener("click", () => {
    if (practiceRevealButton.disabled || !currentPracticeConfig) return;
    if (insightCopy) insightCopy.textContent = currentPracticeConfig.insight;
    setPracticeKeywordsVisibility(true);
    if (practiceInsight) {
      practiceInsight.hidden = false;
      practiceInsight.focus({ preventScroll: true });
    }
  });
  practiceResetButton?.addEventListener("click", () => {
    if (practiceInput) practiceInput.value = "";
    if (practiceInsight) practiceInsight.hidden = true;
    practiceCardFrames.forEach((frame) => {
      frame.classList.remove("is-enlarged", "is-rotated");
    });
    practiceCardButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
    practiceRotateButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
    promptTabs[0]?.click();
    setPracticeKeywordsVisibility(false);
    updatePracticeRevealAvailability();
  });
  practiceInput?.addEventListener("input", updatePracticeRevealAvailability);

  function levelVariant(lesson, level = activeLevel) {
    return lesson?.levels?.[level] || lesson?.levels?.beginner || null;
  }

  function ensureAdaptiveCurriculumPanel(article) {
    let panel = article.querySelector("[data-adaptive-curriculum]");
    if (panel) return panel;
    article.classList.add("has-adaptive-curriculum");
    panel = document.createElement("section");
    panel.className = "htr-adaptive-curriculum";
    panel.dataset.adaptiveCurriculum = "";
    panel.setAttribute("aria-label", "Learning-level guidance");
    const track = document.createElement("p");
    track.className = "htr-adaptive-curriculum__track";
    track.dataset.adaptiveTrack = "";
    const core = document.createElement("div");
    core.className = "htr-adaptive-curriculum__core";
    core.dataset.adaptiveCoreWrap = "";
    const heading = document.createElement("h3");
    heading.dataset.adaptiveCore = "";
    const explanation = document.createElement("p");
    explanation.dataset.adaptiveExplanation = "";
    core.append(heading, explanation);
    const steps = document.createElement("ol");
    steps.className = "htr-adaptive-curriculum__steps";
    steps.dataset.adaptiveSteps = "";
    const guidance = document.createElement("details");
    guidance.className = "htr-adaptive-curriculum__guidance";
    guidance.dataset.adaptiveGuidance = "";
    const summary = document.createElement("summary");
    summary.dataset.adaptiveGuidanceLabel = "";
    const guidanceCopy = document.createElement("p");
    guidanceCopy.dataset.adaptiveGuidanceCopy = "";
    guidance.append(summary, guidanceCopy);
    const practice = document.createElement("div");
    practice.className = "htr-adaptive-curriculum__practice";
    const practiceLabel = document.createElement("strong");
    practiceLabel.dataset.adaptivePracticeLabel = "";
    const practiceCopy = document.createElement("p");
    practiceCopy.dataset.adaptivePracticeCopy = "";
    practice.append(practiceLabel, practiceCopy);
    panel.append(track, core, steps, guidance, practice);
    article.querySelector(".htr-course-lesson__header")?.insertAdjacentElement("afterend", panel);
    return panel;
  }

  function renderLessonVariant(article, lesson, level) {
    const variant = levelVariant(lesson, level);
    const profile = tarotCurriculum.levels[level] || tarotCurriculum.levels.beginner;
    if (!variant || !article) return;
    article.dataset.learningLevelVariant = level;
    const header = article.querySelector(".htr-course-lesson__header");
    const eyebrow = header?.querySelector(":scope > .htr-eyebrow");
    const heading = header?.querySelector("h2");
    const introduction = heading?.nextElementSibling;
    if (eyebrow) eyebrow.textContent = `${lesson.phase} · ${variant.eyebrow}`;
    if (heading) heading.textContent = variant.heading || lesson.title;
    if (introduction?.matches("p")) introduction.textContent = variant.introduction;

    const existingCoreHeading = article.querySelector(".htr-lesson-copy h3");
    const existingCoreCopy = existingCoreHeading?.nextElementSibling;
    if (existingCoreHeading) existingCoreHeading.textContent = variant.coreIdea;
    if (existingCoreCopy?.matches("p")) existingCoreCopy.textContent = variant.explanation;

    const panel = ensureAdaptiveCurriculumPanel(article);
    panel.querySelector("[data-adaptive-track]").textContent = `${profile.label} · ${profile.track}`;
    const coreWrap = panel.querySelector("[data-adaptive-core-wrap]");
    coreWrap.hidden = Boolean(existingCoreHeading);
    panel.querySelector("[data-adaptive-core]").textContent = variant.coreIdea;
    panel.querySelector("[data-adaptive-explanation]").textContent = variant.explanation;
    const steps = panel.querySelector("[data-adaptive-steps]");
    steps.replaceChildren(...variant.steps.map((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      return item;
    }));
    const guidance = panel.querySelector("[data-adaptive-guidance]");
    guidance.open = profile.hintsOpen;
    panel.querySelector("[data-adaptive-guidance-label]").textContent = variant.guidance.label;
    panel.querySelector("[data-adaptive-guidance-copy]").textContent = variant.guidance.text;
    panel.querySelector("[data-adaptive-practice-label]").textContent = variant.practiceLabel;
    panel.querySelector("[data-adaptive-practice-copy]").textContent = variant.practice;

    levels.forEach((levelKey) => {
      const copy = article.querySelector(`[data-level-copy="${levelKey}"]`);
      const copyVariant = levelVariant(lesson, levelKey);
      if (!copy || !copyVariant) return;
      const copyLabel = copy.querySelector("strong");
      const copyText = copy.querySelector("p");
      if (copyLabel) copyLabel.textContent = copyVariant.practiceLabel;
      if (copyText) copyText.textContent = copyVariant.practice;
    });
  }

  function playLevelTransition() {
    const targets = [root.querySelector(".htr-course-lesson.is-active"), root.querySelector("[data-lesson-preview]")].filter(Boolean);
    targets.forEach((target) => {
      target.classList.remove("is-level-updating");
      void target.offsetWidth;
      target.classList.add("is-level-updating");
      target.addEventListener("animationend", () => target.classList.remove("is-level-updating"), { once: true });
    });
  }

  function renderAdaptiveCurriculum(level, options = {}) {
    const safeLevel = levels.includes(level) ? level : "beginner";
    const profile = tarotCurriculum.levels[safeLevel] || tarotCurriculum.levels.beginner;
    try {
      courseLessons.forEach((article, index) => renderLessonVariant(article, tarotLessons[index], safeLevel));
      starButtons.forEach((button, index) => {
        const lesson = tarotLessons[index];
        const variant = levelVariant(lesson, safeLevel);
        const descriptor = button.querySelector(".lesson-star__descriptor");
        if (descriptor) descriptor.textContent = variant?.eyebrow || lesson.levels.beginner.eyebrow;
        button.setAttribute("aria-label", `Open ${profile.label.toLowerCase()} lesson ${index + 1}: ${lesson.title}`);
      });
      const practice = levelVariant(tarotLessons[8], safeLevel)?.guidedPractice || levelVariant(tarotLessons[8], "beginner")?.guidedPractice;
      configureGuidedPractice(practice);
      const selectedReflectionStage = reflectionButtons.find((button) => button.getAttribute("aria-selected") === "true")?.dataset.reflectionStage || "notice";
      setReflectionStage(selectedReflectionStage);
      updateSelectedPreview();
      if (options.animate) playLevelTransition();
      if (options.announce) {
        const lesson = tarotLessons[activeCourseIndex >= 0 ? activeCourseIndex : selectedLessonIndex] || tarotLessons[0];
        const announcer = root.querySelector("[data-learning-level-announcer]");
        if (announcer) announcer.textContent = `${profile.label} level selected. Lesson ${lesson.number}, ${lesson.title}, updated in place.`;
      }
    } catch (error) {
      if (safeLevel !== "beginner") renderAdaptiveCurriculum("beginner", { animate: false, announce: false });
    }
  }

  function syncThemeImages() {
    const blood = document.body.classList.contains("blood-moon-mode");
    root.querySelectorAll("[data-htr-theme-image]").forEach((image) => {
      const source = blood ? image.dataset.bloodSrc : image.dataset.standardSrc;
      if (source && image.getAttribute("src") !== source) image.setAttribute("src", source);
    });
    syncSemanticLessonImages();
  }
  new MutationObserver(syncThemeImages).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  syncThemeImages();
  window.AstralVeilCardTilt?.initialize(root);

  const learningExperience = root.querySelector("[data-learning-experience]");
  const learningGuide = root.querySelector("[data-learning-guide]");
  const lessonView = root.querySelector("[data-learning-lesson-view]");
  const constellationMap = root.querySelector("[data-constellation-map]");
  const constellationTravelLayer = root.querySelector("[data-constellation-travel-layer]");
  const constellationVignette = root.querySelector("[data-constellation-vignette]");
  const constellationVignetteVeil = root.querySelector("[data-constellation-vignette-veil]");
  const lessonTravelLight = root.querySelector("[data-lesson-travel-light]");
  const courseLessons = Array.from(root.querySelectorAll("[data-course-lesson]"));
  const starList = root.querySelector("[data-lesson-stars]");
  const previewProgress = root.querySelector("[data-preview-progress]");
  const previewPhase = root.querySelector("[data-preview-phase]");
  const previewTitle = root.querySelector("[data-preview-title]");
  const previewSummary = root.querySelector("[data-preview-summary]");
  const openPreviewButton = root.querySelector("[data-open-preview]");
  const beginPathButton = root.querySelector("[data-begin-path]");
  const continuePathButton = root.querySelector("[data-continue-path]");
  const guideCompletion = root.querySelector("[data-guide-completion]");
  const courseProgress = root.querySelector("[data-course-progress]");
  const coursePrevious = root.querySelector("[data-course-previous]");
  const courseNext = root.querySelector("[data-course-next]");
  const bottomPrevious = root.querySelector("[data-course-bottom-previous]");
  const bottomNext = root.querySelector("[data-course-bottom-next]");
  const previousTitle = root.querySelector("[data-course-previous-title]");
  const nextTitle = root.querySelector("[data-course-next-title]");
  const courseBackButtons = Array.from(root.querySelectorAll("[data-course-back]"));
  const mapPanelNumber = root.querySelector("[data-map-panel-number]");
  const mapPanelEyebrow = root.querySelector("[data-map-panel-eyebrow]");
  const mapPanelBeginButton = root.querySelector("[data-map-panel-begin]");
  const mapPanelContinueButton = root.querySelector("[data-map-panel-continue]");
  const mapProgressText = root.querySelector("[data-map-progress-text]");
  const mapProgressDotList = root.querySelector("[data-map-progress-dots]");
  const spiralSvg = root.querySelector("[data-spiral-map-svg]");
  const spiralPathBase = root.querySelector("[data-spiral-path-base]");
  const spiralPathProgress = root.querySelector("[data-spiral-path-progress]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopSpiralViewport = window.matchMedia("(min-width: 980px)");
  const mobileTravelViewport = window.matchMedia("(max-width: 820px)");
  const compactTravelViewport = window.matchMedia("(max-width: 400px)");
  const lessonTravelTiming = Object.freeze({
    desktop: Object.freeze({ awaken: 140, travel: 520, guideExit: 190, reveal: 210, scale: 2.18 }),
    mobile: Object.freeze({ awaken: 110, travel: 420, guideExit: 160, reveal: 170, scale: 1.7 }),
    compact: Object.freeze({ awaken: 100, travel: 400, guideExit: 150, reveal: 160, scale: 1.58 }),
    reduced: Object.freeze({ guideExit: 80, reveal: 100, scale: 1 })
  });
  const travelEasing = "cubic-bezier(0.22, 0.78, 0.22, 1)";
  const portalEasing = "cubic-bezier(0.16, 0.84, 0.24, 1)";
  const lastLessonStorageKey = "astralVeilTarotLastLesson";
  const visitedLessonStorageKey = "astralVeilTarotVisitedLessons";
  const completedPathStorageKey = "astralVeilTarotPathComplete";
  const spiralViewBox = Object.freeze({ width: 940, height: 720 });
  const spiralPathParameters = Object.freeze({
    centerX: 470,
    centerY: 360,
    startRadius: 350,
    endRadius: 0,
    turns: 2.4,
    startAngle: -2.18,
    verticalScale: .76,
    samples: 240
  });
  const spiralLessonLayout = Object.freeze({
    1: Object.freeze({ progress: .04, labelX: 28, labelY: -16, align: "left" }),
    2: Object.freeze({ progress: .16, labelX: 26, labelY: 8, align: "left" }),
    3: Object.freeze({ progress: .28, labelX: 30, labelY: 8, align: "left" }),
    4: Object.freeze({ progress: .4, labelX: 20, labelY: 18, align: "left" }),
    5: Object.freeze({ progress: .52, labelX: 0, labelY: 30, align: "center" }),
    6: Object.freeze({ progress: .64, labelX: -24, labelY: 12, align: "right" }),
    7: Object.freeze({ progress: .75, labelX: -24, labelY: 4, align: "right" }),
    8: Object.freeze({ progress: .82, labelX: 22, labelY: 10, align: "left" }),
    9: Object.freeze({ progress: 1, labelX: 0, labelY: 32, align: "center" })
  });
  const fallbackConstellationPath = spiralPathBase?.getAttribute("d") || "";
  let selectedLessonIndex = 0;
  let activeCourseIndex = -1;
  let originStar = null;
  let starButtons = [];
  let lastVisitedIndex = -1;
  let visitedLessonIndexes = new Set();
  let isTraveling = false;
  let travelRunId = 0;
  let courseLocationFrame = 0;
  let spiralLayoutFrame = 0;
  let spiralLayoutForce = false;
  let spiralPathLength = 0;
  let lastSpiralViewport = "";
  let mapProgressDots = [];
  let spiralResizeObserver = null;
  const activeTravelAnimations = new Set();
  const travelControlStates = new Map();

  function readSessionValue(key) {
    try { return sessionStorage.getItem(key) || ""; } catch (error) { return ""; }
  }

  function writeSessionValue(key, value) {
    try { sessionStorage.setItem(key, value); } catch (error) { /* Progress memory is optional. */ }
  }

  function readCourseProgress() {
    const storedLast = Number.parseInt(readSessionValue(lastLessonStorageKey), 10);
    lastVisitedIndex = Number.isInteger(storedLast) && storedLast >= 0 && storedLast < tarotLessons.length ? storedLast : -1;
    try {
      const storedVisited = JSON.parse(readSessionValue(visitedLessonStorageKey) || "[]");
      visitedLessonIndexes = new Set(storedVisited.filter((index) => Number.isInteger(index) && index >= 0 && index < tarotLessons.length));
    } catch (error) {
      visitedLessonIndexes = new Set();
    }
  }

  function storeCourseProgress() {
    writeSessionValue(lastLessonStorageKey, String(lastVisitedIndex));
    writeSessionValue(visitedLessonStorageKey, JSON.stringify(Array.from(visitedLessonIndexes)));
  }

  function createSpiralPath({ centerX, centerY, startRadius, endRadius, turns, startAngle, verticalScale, samples }) {
    const points = [];
    for (let index = 0; index <= samples; index += 1) {
      const progress = index / samples;
      const angle = startAngle + progress * turns * Math.PI * 2;
      const radius = startRadius + (endRadius - startRadius) * progress;
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius * verticalScale
      });
    }
    if (points.length < 2) return { points, path: "" };
    const formatPoint = (value) => Number(value.toFixed(2));
    let path = `M ${formatPoint(points[0].x)} ${formatPoint(points[0].y)}`;
    for (let index = 0; index < points.length - 1; index += 1) {
      const previous = points[Math.max(0, index - 1)];
      const current = points[index];
      const next = points[index + 1];
      const following = points[Math.min(points.length - 1, index + 2)];
      const controlOne = {
        x: current.x + (next.x - previous.x) / 6,
        y: current.y + (next.y - previous.y) / 6
      };
      const controlTwo = {
        x: next.x - (following.x - current.x) / 6,
        y: next.y - (following.y - current.y) / 6
      };
      path += ` C ${formatPoint(controlOne.x)} ${formatPoint(controlOne.y)} ${formatPoint(controlTwo.x)} ${formatPoint(controlTwo.y)} ${formatPoint(next.x)} ${formatPoint(next.y)}`;
    }
    return { points, path };
  }

  function clearSpiralNodeStyles() {
    starButtons.forEach((button) => {
      const item = button.closest(".htr-constellation__node");
      if (!item) return;
      item.style.removeProperty("left");
      item.style.removeProperty("top");
      item.style.removeProperty("--spiral-label-x");
      item.style.removeProperty("--spiral-label-y");
      delete item.dataset.spiralAlign;
    });
  }

  function restoreLegacyConstellation() {
    constellationMap?.classList.remove("is-spiral-ready");
    if (spiralSvg) {
      spiralSvg.setAttribute("viewBox", "0 0 1200 500");
      spiralSvg.setAttribute("preserveAspectRatio", "none");
    }
    if (spiralPathBase && fallbackConstellationPath) spiralPathBase.setAttribute("d", fallbackConstellationPath);
    spiralPathProgress?.removeAttribute("d");
    spiralPathProgress?.style.removeProperty("stroke-dasharray");
    spiralPathProgress?.style.removeProperty("stroke-dashoffset");
    spiralPathLength = 0;
    lastSpiralViewport = "";
    clearSpiralNodeStyles();
  }

  function layoutDesktopSpiral() {
    if (!desktopSpiralViewport.matches) {
      restoreLegacyConstellation();
      return;
    }
    if (!spiralSvg || !spiralPathBase || !spiralPathProgress || !constellationMap || starButtons.length !== tarotLessons.length) {
      restoreLegacyConstellation();
      return;
    }
    const viewportRect = constellationMap.getBoundingClientRect();
    const viewportKey = `${Math.round(viewportRect.width)}x${Math.round(viewportRect.height)}`;
    if (!viewportRect.width || !viewportRect.height) {
      restoreLegacyConstellation();
      return;
    }
    if (!spiralLayoutForce && constellationMap.classList.contains("is-spiral-ready") && viewportKey === lastSpiralViewport) {
      updateSpiralProgress();
      return;
    }

    try {
      const { path } = createSpiralPath(spiralPathParameters);
      if (!path) throw new Error("Spiral path data is empty.");
      spiralSvg.setAttribute("viewBox", `0 0 ${spiralViewBox.width} ${spiralViewBox.height}`);
      spiralSvg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      spiralPathBase.setAttribute("d", path);
      spiralPathProgress.setAttribute("d", path);
      if (typeof spiralPathBase.getTotalLength !== "function" || typeof spiralPathBase.getPointAtLength !== "function") {
        throw new Error("SVG path measurement is unavailable.");
      }
      const measuredLength = spiralPathBase.getTotalLength();
      if (!Number.isFinite(measuredLength) || measuredLength <= 0) throw new Error("Spiral path length is invalid.");

      const positions = starButtons.map((button, index) => {
        const configuration = spiralLessonLayout[index + 1];
        if (!configuration) throw new Error("Spiral lesson configuration is unavailable.");
        const point = spiralPathBase.getPointAtLength(measuredLength * configuration.progress);
        if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) throw new Error("Spiral lesson position is invalid.");
        return {
          item: button.closest(".htr-constellation__node"),
          configuration,
          left: point.x / spiralViewBox.width * 100,
          top: point.y / spiralViewBox.height * 100
        };
      });
      if (positions.some(({ item }) => !item)) throw new Error("Spiral lesson node is unavailable.");

      positions.forEach(({ item, configuration, left, top }) => {
        item.style.left = `${left.toFixed(4)}%`;
        item.style.top = `${top.toFixed(4)}%`;
        item.style.setProperty("--spiral-label-x", `${configuration.labelX}px`);
        item.style.setProperty("--spiral-label-y", `${configuration.labelY}px`);
        item.dataset.spiralAlign = configuration.align;
      });
      spiralPathLength = measuredLength;
      lastSpiralViewport = viewportKey;
      constellationMap.classList.add("is-spiral-ready");
      updateSpiralProgress();
    } catch (error) {
      restoreLegacyConstellation();
    }
  }

  function scheduleSpiralLayout(force = false) {
    spiralLayoutForce = spiralLayoutForce || force;
    if (spiralLayoutFrame) return;
    spiralLayoutFrame = window.requestAnimationFrame(() => {
      spiralLayoutFrame = 0;
      layoutDesktopSpiral();
      spiralLayoutForce = false;
    });
  }

  function initializeSpiralMap() {
    if (!constellationMap || !spiralSvg || !spiralPathBase || !spiralPathProgress) return;
    scheduleSpiralLayout(true);
    if (typeof ResizeObserver === "function") {
      spiralResizeObserver = new ResizeObserver(() => scheduleSpiralLayout());
      spiralResizeObserver.observe(constellationMap);
    }
    desktopSpiralViewport.addEventListener?.("change", () => scheduleSpiralLayout(true));
    document.fonts?.ready?.then(() => scheduleSpiralLayout(true)).catch(() => { /* Font metrics are an optional refinement. */ });
  }

  function lessonIndexFromHash() {
    let hashId = "";
    try { hashId = decodeURIComponent(location.hash.slice(1)); } catch (error) { hashId = location.hash.slice(1); }
    if (!hashId) return -1;
    return tarotLessons.findIndex((lesson) => lesson.id === hashId || lesson.aliases.includes(hashId));
  }

  function courseUrl(hash = "") {
    const nextUrl = new URL(window.location.href);
    nextUrl.hash = hash;
    return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  }

  function writeCourseUrl(hash, mode) {
    if (mode === "none") return;
    const method = mode === "replace" ? "replaceState" : "pushState";
    history[method]({ ...(history.state || {}), tarotLesson: hash || null }, "", courseUrl(hash));
  }

  function currentLessonTravelTiming() {
    if (reducedMotion.matches) return lessonTravelTiming.reduced;
    if (compactTravelViewport.matches) return lessonTravelTiming.compact;
    if (mobileTravelViewport.matches) return lessonTravelTiming.mobile;
    return lessonTravelTiming.desktop;
  }

  function isActiveTravelRun(runId) {
    return isTraveling && runId === travelRunId;
  }

  function lessonTravelControls() {
    return [
      openPreviewButton,
      beginPathButton,
      continuePathButton,
      mapPanelBeginButton,
      mapPanelContinueButton,
      coursePrevious,
      courseNext,
      bottomPrevious,
      bottomNext,
      ...courseBackButtons
    ].filter(Boolean);
  }

  function lockLessonTravelControls() {
    lessonTravelControls().forEach((button) => {
      if (!travelControlStates.has(button)) travelControlStates.set(button, button.getAttribute("aria-disabled"));
      button.setAttribute("aria-disabled", "true");
      button.dataset.lessonTravelDisabled = "true";
    });
  }

  function unlockLessonTravelControls() {
    travelControlStates.forEach((ariaDisabled, button) => {
      if (ariaDisabled === null) button.removeAttribute("aria-disabled");
      else button.setAttribute("aria-disabled", ariaDisabled);
      delete button.dataset.lessonTravelDisabled;
    });
    travelControlStates.clear();
    if (activeCourseIndex >= 0) updateCourseNavigation(activeCourseIndex);
  }

  function createTravelAnimation(element, keyframes, options) {
    if (!element || typeof element.animate !== "function") throw new Error("Lesson travel animation is unavailable.");
    const animation = element.animate(keyframes, { fill: "both", ...options });
    activeTravelAnimations.add(animation);
    return animation;
  }

  function cancelTravelAnimation(animation) {
    try { animation.cancel(); } catch (error) { /* A finished animation may already be detached. */ }
    activeTravelAnimations.delete(animation);
  }

  function cancelAllTravelAnimations() {
    Array.from(activeTravelAnimations).forEach(cancelTravelAnimation);
  }

  async function waitForTravelAnimations(animations) {
    await Promise.all(animations.map((animation) => animation.finished));
    animations.forEach(cancelTravelAnimation);
  }

  function getStarTravelCoordinates(star) {
    const marker = star?.querySelector(".lesson-star__marker") || star;
    if (!marker || !constellationMap || !constellationTravelLayer) return null;
    const markerRect = marker.getBoundingClientRect();
    const mapRect = constellationMap.getBoundingClientRect();
    const layerRect = constellationTravelLayer.getBoundingClientRect();
    if (!markerRect.width || !markerRect.height || !mapRect.width || !mapRect.height || !layerRect.width || !layerRect.height) return null;

    const markerCenterX = markerRect.left + markerRect.width / 2;
    const markerCenterY = markerRect.top + markerRect.height / 2;
    const coordinates = {
      x: mapRect.left + mapRect.width / 2 - markerCenterX,
      y: mapRect.top + mapRect.height / 2 - markerCenterY,
      lightX: markerCenterX - mapRect.left,
      lightY: markerCenterY - mapRect.top,
      originX: markerCenterX - layerRect.left,
      originY: markerCenterY - layerRect.top
    };
    return Object.values(coordinates).every(Number.isFinite) ? coordinates : null;
  }

  function setLessonTravelCoordinates(coordinates, scale) {
    if (!constellationMap) return;
    constellationMap.style.setProperty("--travel-x", `${coordinates.x}px`);
    constellationMap.style.setProperty("--travel-y", `${coordinates.y}px`);
    constellationMap.style.setProperty("--travel-light-x", `${coordinates.lightX}px`);
    constellationMap.style.setProperty("--travel-light-y", `${coordinates.lightY}px`);
    constellationMap.style.setProperty("--travel-origin-x", `${coordinates.originX}px`);
    constellationMap.style.setProperty("--travel-origin-y", `${coordinates.originY}px`);
    constellationMap.style.setProperty("--travel-scale", String(scale));
  }

  function clearMapTravelVisuals() {
    constellationMap?.classList.remove("is-awakening", "is-traveling");
    learningGuide?.classList.remove("is-exiting");
    starButtons.forEach((button) => button.classList.remove("is-travel-target"));
    ["--travel-x", "--travel-y", "--travel-light-x", "--travel-light-y", "--travel-origin-x", "--travel-origin-y", "--travel-scale"].forEach((property) => {
      constellationMap?.style.removeProperty(property);
    });
  }

  function clearLessonTravelState() {
    cancelAllTravelAnimations();
    clearMapTravelVisuals();
    lessonView?.classList.remove("is-travel-revealing");
    if (lessonView?.dataset.lessonTravelFocusHandoff === "true") {
      lessonView.removeAttribute("tabindex");
      delete lessonView.dataset.lessonTravelFocusHandoff;
    }
    learningExperience?.removeAttribute("data-lesson-traveling");
    unlockLessonTravelControls();
    isTraveling = false;
  }

  function cancelLessonTravel() {
    if (!isTraveling && !activeTravelAnimations.size) return;
    travelRunId += 1;
    clearLessonTravelState();
  }

  function focusLessonRevealHandoff() {
    if (!lessonView) return;
    lessonView.tabIndex = -1;
    lessonView.dataset.lessonTravelFocusHandoff = "true";
    lessonView.focus({ preventScroll: true });
  }

  async function animateStarAwakening(star, timing) {
    const marker = star.querySelector(".lesson-star__marker");
    const core = star.querySelector(".lesson-star__core");
    if (!marker || !core || !lessonTravelLight || !constellationMap) throw new Error("Lesson star travel target is incomplete.");
    const coreStart = getComputedStyle(core).transform === "none" ? "scale(1)" : getComputedStyle(core).transform;
    const markerStart = getComputedStyle(marker).transform === "none" ? "scale(1)" : getComputedStyle(marker).transform;
    constellationMap.classList.add("is-awakening");

    const animations = [
      createTravelAnimation(core, [{ transform: coreStart }, { transform: "scale(1.5)" }], { duration: timing.awaken, easing: portalEasing }),
      createTravelAnimation(marker, [{ transform: markerStart, opacity: .84 }, { transform: "scale(1.12)", opacity: 1 }], { duration: timing.awaken, easing: portalEasing }),
      createTravelAnimation(lessonTravelLight, [
        { transform: "translate(-50%, -50%) translate3d(0, 0, 0) scale(.3)", opacity: 0 },
        { transform: "translate(-50%, -50%) translate3d(0, 0, 0) scale(1.6)", opacity: .62 }
      ], { duration: timing.awaken, easing: portalEasing })
    ];
    const pathTargets = [
      constellationTravelLayer?.querySelector(".htr-constellation__lines path"),
      constellationTravelLayer?.querySelector("[data-spiral-path-progress]"),
      constellationTravelLayer?.querySelector(".htr-constellation__mobile-path")
    ].filter((element) => element && getComputedStyle(element).display !== "none");
    pathTargets.forEach((path) => {
      animations.push(createTravelAnimation(path, [{ opacity: .58 }, { opacity: 1 }], { duration: timing.awaken, easing: "ease-out" }));
    });
    await waitForTravelAnimations(animations);
  }

  async function animateConstellationTravel(star, coordinates, timing) {
    if (!constellationMap || !constellationTravelLayer || !constellationVignette || !constellationVignetteVeil || !lessonTravelLight || !learningGuide) {
      throw new Error("Lesson travel layers are unavailable.");
    }
    const marker = star.querySelector(".lesson-star__marker");
    const core = star.querySelector(".lesson-star__core");
    const copy = star.querySelector(".lesson-star__copy");
    if (!marker || !core || !copy) throw new Error("Lesson star travel target is incomplete.");

    constellationMap.classList.remove("is-awakening");
    constellationMap.classList.add("is-traveling");
    learningGuide.classList.add("is-exiting");
    const targetTransform = `translate3d(${coordinates.x}px, ${coordinates.y}px, 0) scale(${timing.scale})`;
    const targetLightTransform = `translate(-50%, -50%) translate3d(${coordinates.x}px, ${coordinates.y}px, 0) scale(5)`;
    const targetVignetteTransform = `translate(-50%, -50%) translate3d(${coordinates.x}px, ${coordinates.y}px, 0)`;
    const guideHoldOffset = Math.max(0, Math.min(1, (timing.travel - timing.guideExit) / timing.travel));
    const animationOptions = { duration: timing.travel, easing: travelEasing };
    const animations = [
      createTravelAnimation(constellationTravelLayer, [
        { transform: "translate3d(0, 0, 0) scale(1)" },
        { transform: targetTransform }
      ], animationOptions),
      createTravelAnimation(lessonTravelLight, [
        { transform: "translate(-50%, -50%) translate3d(0, 0, 0) scale(1.6)", opacity: .62 },
        { transform: targetLightTransform, opacity: 1 }
      ], { duration: timing.travel, easing: portalEasing }),
      createTravelAnimation(constellationVignette, [{ opacity: 0 }, { opacity: 1 }], animationOptions),
      createTravelAnimation(constellationVignetteVeil, [
        { transform: "translate(-50%, -50%) translate3d(0, 0, 0)" },
        { transform: targetVignetteTransform }
      ], animationOptions),
      createTravelAnimation(marker, [{ transform: "scale(1.12)", opacity: 1 }, { transform: "scale(1.08)", opacity: 1 }], animationOptions),
      createTravelAnimation(core, [{ transform: "scale(1.5)" }, { transform: "scale(1.65)" }], { duration: timing.travel, easing: portalEasing }),
      createTravelAnimation(copy, [{ opacity: 1 }, { opacity: .12 }], {
        duration: timing.travel * .55,
        delay: timing.travel * .35,
        easing: "ease-in"
      }),
      createTravelAnimation(learningGuide, [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: guideHoldOffset, easing: "ease" },
        { opacity: 0, offset: 1 }
      ], { duration: timing.travel, easing: "linear" })
    ];

    const fadeTargets = [
      constellationTravelLayer.querySelector(".htr-constellation__phase-labels"),
      constellationTravelLayer.querySelector(".htr-constellation__lines"),
      constellationTravelLayer.querySelector(".htr-constellation__mobile-path"),
      ...Array.from(constellationTravelLayer.querySelectorAll(".htr-constellation__node")).filter((node) => !node.contains(star))
    ].filter((element) => element && getComputedStyle(element).display !== "none");
    fadeTargets.forEach((element) => {
      const targetOpacity = element.classList.contains("htr-constellation__node")
        ? .05
        : element.classList.contains("htr-constellation__mobile-path") ? .08 : .1;
      animations.push(createTravelAnimation(element, [{ opacity: 1 }, { opacity: targetOpacity }], animationOptions));
    });
    await waitForTravelAnimations(animations);
  }

  async function animateReducedGuideExit(timing) {
    if (!learningGuide) throw new Error("Learning guide is unavailable.");
    learningGuide.classList.remove("is-entering");
    learningGuide.classList.add("is-exiting");
    await waitForTravelAnimations([
      createTravelAnimation(learningGuide, [{ opacity: 1 }, { opacity: 0 }], { duration: timing.guideExit, easing: "ease" })
    ]);
  }

  async function animateLessonReveal(index, timing) {
    const heading = courseLessons[index]?.querySelector("h2");
    if (!lessonView || !heading) throw new Error("Lesson reveal target is unavailable.");
    const animations = [
      createTravelAnimation(lessonView, [{ opacity: 0 }, { opacity: 1 }], { duration: timing.reveal, easing: "ease-out" })
    ];
    if (!reducedMotion.matches) {
      animations.push(createTravelAnimation(heading.closest(".htr-course-lesson__header") || heading, [
        { transform: "translate3d(0, 8px, 0)" },
        { transform: "translate3d(0, 0, 0)" }
      ], { duration: timing.reveal, easing: portalEasing }));
    }
    await waitForTravelAnimations(animations);
  }

  function createStarButton(lesson, index) {
    const variant = levelVariant(lesson);
    const item = document.createElement("li");
    item.className = "htr-constellation__node";
    const button = document.createElement("button");
    button.className = "lesson-star";
    button.type = "button";
    button.dataset.lessonStar = String(index);
    button.dataset.lessonId = lesson.id;
    button.setAttribute("aria-label", `Open ${tarotCurriculum.levels[activeLevel].label.toLowerCase()} lesson ${index + 1}: ${lesson.title}`);
    button.setAttribute("aria-pressed", "false");

    const marker = document.createElement("span");
    marker.className = "lesson-star__marker";
    marker.setAttribute("aria-hidden", "true");
    const core = document.createElement("span");
    core.className = "lesson-star__core";
    marker.append(core);

    const copy = document.createElement("span");
    copy.className = "lesson-star__copy";
    const number = document.createElement("span");
    number.className = "lesson-star__number";
    number.textContent = lesson.number;
    const title = document.createElement("span");
    title.className = "lesson-star__title";
    title.textContent = lesson.title;
    const descriptor = document.createElement("span");
    descriptor.className = "lesson-star__descriptor";
    descriptor.textContent = variant?.eyebrow || lesson.levels.beginner.eyebrow;
    copy.append(number, title, descriptor);
    button.append(marker, copy);
    item.append(button);
    return { item, button };
  }

  function buildConstellation() {
    if (!starList) return;
    const fragment = document.createDocumentFragment();
    starButtons = tarotLessons.map((lesson, index) => {
      const { item, button } = createStarButton(lesson, index);
      fragment.append(item);
      button.addEventListener("click", () => travelToLesson(index, button));
      button.addEventListener("focus", () => selectLesson(index));
      button.addEventListener("mouseenter", () => selectLesson(index));
      return button;
    });
    starList.replaceChildren(fragment);
  }

  function currentLevelSummary(index) {
    const lesson = tarotLessons[index];
    return levelVariant(lesson)?.summary || lesson?.levels?.beginner?.summary || "";
  }

  function buildMapProgressDots() {
    if (!mapProgressDotList) return;
    const fragment = document.createDocumentFragment();
    mapProgressDots = tarotLessons.map((lesson, index) => {
      const item = document.createElement("li");
      const dot = document.createElement("span");
      dot.className = "htr-learning-map-progress__dot";
      dot.dataset.mapProgressDot = String(index);
      dot.setAttribute("role", "img");
      item.append(dot);
      fragment.append(item);
      return dot;
    });
    mapProgressDotList.replaceChildren(fragment);
  }

  function updateSpiralProgress() {
    if (!spiralPathProgress || !spiralPathLength || !constellationMap?.classList.contains("is-spiral-ready")) return;
    const furthestVisitedIndex = visitedLessonIndexes.size ? Math.max(...visitedLessonIndexes) : -1;
    const progressIndex = Math.max(0, selectedLessonIndex, furthestVisitedIndex);
    const progress = spiralLessonLayout[progressIndex + 1]?.progress || spiralLessonLayout[1].progress;
    spiralPathProgress.style.strokeDasharray = `${spiralPathLength} ${spiralPathLength}`;
    spiralPathProgress.style.strokeDashoffset = String(spiralPathLength * (1 - progress));
  }

  function updateMapProgressState() {
    const pathComplete = readSessionValue(completedPathStorageKey) === "true";
    const exploredCount = visitedLessonIndexes.size;
    if (mapProgressText) {
      mapProgressText.textContent = pathComplete
        ? `${tarotLessons.length} of ${tarotLessons.length} lessons completed`
        : `${exploredCount} of ${tarotLessons.length} lessons explored`;
    }
    mapProgressDots.forEach((dot, index) => {
      const current = index === selectedLessonIndex;
      const visited = visitedLessonIndexes.has(index);
      const completed = pathComplete && visited;
      dot.classList.toggle("is-current", current);
      dot.classList.toggle("is-visited", visited);
      dot.classList.toggle("is-completed", completed);
      if (current) dot.setAttribute("aria-current", "step");
      else dot.removeAttribute("aria-current");
      const states = [current ? "current" : "", completed ? "completed" : visited ? "explored" : "not explored"].filter(Boolean);
      dot.setAttribute("aria-label", `Lesson ${index + 1}: ${tarotLessons[index].title}, ${states.join(", ")}`);
    });
    updateSpiralProgress();
  }

  function updateSelectedPreview() {
    const lesson = tarotLessons[selectedLessonIndex];
    if (!lesson) return;
    const profile = tarotCurriculum.levels[activeLevel] || tarotCurriculum.levels.beginner;
    if (previewProgress) previewProgress.textContent = `Lesson ${lesson.number} of 09`;
    if (previewPhase) previewPhase.textContent = lesson.phase;
    if (previewTitle) previewTitle.textContent = lesson.title;
    if (previewSummary) previewSummary.textContent = currentLevelSummary(selectedLessonIndex);
    if (mapPanelNumber) mapPanelNumber.textContent = `Lesson ${lesson.number}`;
    if (mapPanelEyebrow) mapPanelEyebrow.textContent = `${profile.track} · Your Next Step`;
    openPreviewButton?.setAttribute("aria-label", `Open Lesson ${lesson.number}: ${lesson.title}`);
    updateSpiralProgress();
  }

  function refreshStarStates() {
    starButtons.forEach((button, index) => {
      const selected = index === selectedLessonIndex;
      button.classList.toggle("is-selected", selected);
      button.classList.toggle("is-visited", visitedLessonIndexes.has(index));
      button.classList.toggle("is-last-visited", index === lastVisitedIndex);
      button.setAttribute("aria-pressed", String(selected));
    });
    updateMapProgressState();
  }

  function selectLesson(index, options = {}) {
    if (isTraveling && !options.force) return;
    if (index < 0 || index >= tarotLessons.length) return;
    selectedLessonIndex = index;
    updateSelectedPreview();
    refreshStarStates();
  }

  function updateContinueButton() {
    const available = lastVisitedIndex >= 0 && lastVisitedIndex < tarotLessons.length;
    if (continuePathButton) {
      continuePathButton.hidden = !available;
      if (available) continuePathButton.textContent = `Continue Lesson ${tarotLessons[lastVisitedIndex].number}`;
    }
    if (mapPanelContinueButton) {
      mapPanelContinueButton.hidden = !available;
      if (available) {
        const lesson = tarotLessons[lastVisitedIndex];
        mapPanelContinueButton.textContent = `Continue Lesson ${lesson.number}`;
        mapPanelContinueButton.setAttribute("aria-label", `Continue with Lesson ${lesson.number}: ${lesson.title}`);
      }
    }
  }

  function markLessonVisited(index) {
    lastVisitedIndex = index;
    visitedLessonIndexes.add(index);
    storeCourseProgress();
    updateContinueButton();
    refreshStarStates();
  }

  function updateCourseNavigation(index) {
    const lesson = tarotLessons[index];
    if (!lesson) return;
    if (courseProgress) courseProgress.textContent = `Lesson ${lesson.number} of 09`;
    const atStart = index === 0;
    const atEnd = index === tarotLessons.length - 1;
    if (coursePrevious) coursePrevious.disabled = atStart;
    if (bottomPrevious) bottomPrevious.disabled = atStart;
    if (previousTitle) previousTitle.textContent = atStart ? "Start of the path" : tarotLessons[index - 1].title;
    if (courseNext) courseNext.textContent = atEnd ? "Complete the Path" : "Next →";
    if (nextTitle) nextTitle.textContent = atEnd ? "Complete the Path" : tarotLessons[index + 1].title;
  }

  function setActiveCourseLesson(index) {
    courseLessons.forEach((lesson, lessonIndex) => {
      const active = lessonIndex === index;
      lesson.hidden = !active;
      lesson.classList.toggle("is-active", active);
      if (active) lesson.removeAttribute("inert");
      else lesson.setAttribute("inert", "");
    });
  }

  function focusLessonHeading(index) {
    const heading = courseLessons[index]?.querySelector("h2");
    heading?.focus({ preventScroll: true });
  }

  function scrollLearningExperience(behavior = reducedMotion.matches ? "auto" : "smooth") {
    learningExperience?.scrollIntoView({ behavior, block: "start" });
  }

  function openLesson(index, options = {}) {
    if (index < 0 || index >= tarotLessons.length || !learningGuide || !lessonView) return false;
    const wasGuideVisible = !learningGuide.hidden;
    if (wasGuideVisible) originStar = starButtons[index] || originStar;
    selectedLessonIndex = index;
    activeCourseIndex = index;
    markLessonVisited(index);
    setActiveCourseLesson(index);
    updateSelectedPreview();
    updateCourseNavigation(index);

    learningGuide.hidden = true;
    learningGuide.setAttribute("inert", "");
    lessonView.hidden = false;
    lessonView.removeAttribute("inert");
    lessonView.classList.remove("is-entering");
    if (!options.deferEntryAnimation) window.requestAnimationFrame(() => lessonView.classList.add("is-entering"));

    const mode = options.historyMode || "push";
    writeCourseUrl(tarotLessons[index].id, mode);
    syncSemanticLessonImages();
    window.AstralVeilCardTilt?.initialize(courseLessons[index]);

    window.requestAnimationFrame(() => {
      if (options.scroll !== false) scrollLearningExperience(options.scrollBehavior);
      if (options.focus !== false) focusLessonHeading(index);
    });
    return true;
  }

  async function travelToLesson(index, sourceElement) {
    if (isTraveling || index < 0 || index >= tarotLessons.length) return;
    selectLesson(index);
    const star = starButtons[index];
    if (learningGuide?.hidden) {
      if (activeCourseIndex !== index) openLesson(index);
      return;
    }
    const canAnimate = star
      && constellationMap
      && constellationTravelLayer
      && constellationVignette
      && constellationVignetteVeil
      && lessonTravelLight
      && learningGuide
      && lessonView
      && typeof constellationTravelLayer.animate === "function";
    if (!canAnimate) {
      openLesson(index);
      return;
    }

    const timing = currentLessonTravelTiming();
    const coordinates = reducedMotion.matches ? null : getStarTravelCoordinates(star);
    if (!reducedMotion.matches && !coordinates) {
      openLesson(index);
      return;
    }

    const runId = ++travelRunId;
    let hashWritten = false;
    let lessonOpened = false;
    isTraveling = true;
    originStar = sourceElement?.matches?.("[data-lesson-star]") ? sourceElement : star;
    learningExperience?.setAttribute("data-lesson-traveling", "true");
    learningGuide.classList.remove("is-entering");
    star.classList.add("is-travel-target");
    if (coordinates) setLessonTravelCoordinates(coordinates, timing.scale);
    lockLessonTravelControls();

    try {
      writeCourseUrl(tarotLessons[index].id, "push");
      hashWritten = true;

      if (reducedMotion.matches) {
        await animateReducedGuideExit(timing);
      } else {
        await animateStarAwakening(star, timing);
        if (!isActiveTravelRun(runId)) return;
        await animateConstellationTravel(star, coordinates, timing);
      }
      if (!isActiveTravelRun(runId)) return;

      lessonView.classList.add("is-travel-revealing");
      lessonOpened = openLesson(index, {
        historyMode: "none",
        scroll: false,
        focus: false,
        deferEntryAnimation: true
      });
      if (!lessonOpened) throw new Error("Lesson view could not be opened.");
      lockLessonTravelControls();
      clearMapTravelVisuals();
      scrollLearningExperience("auto");
      focusLessonRevealHandoff();
      await animateLessonReveal(index, timing);
      if (!isActiveTravelRun(runId)) return;
      lessonView.classList.remove("is-travel-revealing");
      focusLessonHeading(index);
    } catch (error) {
      if (!isActiveTravelRun(runId)) return;
      clearLessonTravelState();
      if (lessonOpened) {
        scrollLearningExperience("auto");
        focusLessonHeading(index);
      } else {
        openLesson(index, { historyMode: hashWritten ? "none" : "push" });
      }
      return;
    } finally {
      if (isActiveTravelRun(runId)) clearLessonTravelState();
    }
  }

  function showGuide(options = {}) {
    if (!learningGuide || !lessonView) return;
    if (isTraveling) cancelLessonTravel();
    if (activeCourseIndex >= 0) selectLesson(activeCourseIndex);
    activeCourseIndex = -1;
    lessonView.hidden = true;
    lessonView.setAttribute("inert", "");
    lessonView.classList.remove("is-entering", "is-travel-revealing");
    learningGuide.hidden = false;
    learningGuide.removeAttribute("inert");
    learningGuide.classList.remove("is-entering");
    window.requestAnimationFrame(() => {
      if (!isTraveling && !learningGuide.hidden) learningGuide.classList.add("is-entering");
    });

    if (options.completed) {
      tarotLessons.forEach((lesson, index) => visitedLessonIndexes.add(index));
      writeSessionValue(completedPathStorageKey, "true");
      storeCourseProgress();
      if (guideCompletion) guideCompletion.hidden = false;
      refreshStarStates();
    }
    writeCourseUrl("", options.historyMode || "push");
    window.requestAnimationFrame(() => {
      if (options.scroll !== false) scrollLearningExperience();
      if (options.focus !== false) (originStar || starButtons[selectedLessonIndex])?.focus({ preventScroll: true });
    });
  }

  function goToPreviousLesson() {
    if (isTraveling) return;
    if (activeCourseIndex > 0) openLesson(activeCourseIndex - 1);
  }

  function goToNextLesson() {
    if (isTraveling) return;
    if (activeCourseIndex < 0) return;
    if (activeCourseIndex === tarotLessons.length - 1) {
      showGuide({ completed: true });
      return;
    }
    openLesson(activeCourseIndex + 1);
  }

  function syncCourseFromLocation(options = {}) {
    cancelLessonTravel();
    let hashId = "";
    try { hashId = decodeURIComponent(location.hash.slice(1)); } catch (error) { hashId = location.hash.slice(1); }
    const index = lessonIndexFromHash();
    if (index >= 0) {
      openLesson(index, { historyMode: "none", focus: options.focus, scroll: options.scroll });
      return;
    }
    if (levels.includes(hashId)) updateLevel(hashId);
    if (hashId) {
      showGuide({ historyMode: "none", focus: false, scroll: false });
      return;
    }
    showGuide({ historyMode: "none", focus: options.focus, scroll: options.scroll });
  }

  function scheduleCourseLocationSync() {
    if (courseLocationFrame) return;
    courseLocationFrame = window.requestAnimationFrame(() => {
      courseLocationFrame = 0;
      syncCourseFromLocation({ focus: true });
    });
  }

  readCourseProgress();
  buildConstellation();
  buildMapProgressDots();
  initializeSpiralMap();
  courseUiReady = true;
  selectLesson(0);
  adaptiveUiReady = true;
  renderAdaptiveCurriculum(activeLevel, { animate: false, announce: false });
  updateContinueButton();
  if (guideCompletion && readSessionValue(completedPathStorageKey) === "true") guideCompletion.hidden = false;

  beginPathButton?.addEventListener("click", () => travelToLesson(0, beginPathButton));
  continuePathButton?.addEventListener("click", () => travelToLesson(lastVisitedIndex >= 0 ? lastVisitedIndex : 0, continuePathButton));
  mapPanelBeginButton?.addEventListener("click", () => travelToLesson(0, mapPanelBeginButton));
  mapPanelContinueButton?.addEventListener("click", () => travelToLesson(lastVisitedIndex >= 0 ? lastVisitedIndex : 0, mapPanelContinueButton));
  openPreviewButton?.addEventListener("click", () => travelToLesson(selectedLessonIndex, openPreviewButton));
  courseBackButtons.forEach((button) => button.addEventListener("click", () => {
    if (!isTraveling) showGuide();
  }));
  coursePrevious?.addEventListener("click", goToPreviousLesson);
  courseNext?.addEventListener("click", goToNextLesson);
  bottomPrevious?.addEventListener("click", goToPreviousLesson);
  bottomNext?.addEventListener("click", goToNextLesson);
  window.addEventListener("popstate", scheduleCourseLocationSync);
  window.addEventListener("hashchange", scheduleCourseLocationSync);

  const initialLessonIndex = lessonIndexFromHash();
  if (initialLessonIndex >= 0) {
    openLesson(initialLessonIndex, { historyMode: "none", focus: false, scroll: false });
  } else {
    showGuide({ historyMode: "none", focus: false, scroll: false });
  }
})();
