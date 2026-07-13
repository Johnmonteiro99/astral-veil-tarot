// Static full-deck data for the new 78-card Astral Veil decks.
// Existing Major Arcana meanings stay sourced from data/cards.js.
(function () {
  const minorSuits = ["cups", "wands", "pentacles", "swords"];
  const minorRanks = [
    { rank: "ace", title: "Ace", number: 1 },
    { rank: "two", title: "Two", number: 2 },
    { rank: "three", title: "Three", number: 3 },
    { rank: "four", title: "Four", number: 4 },
    { rank: "five", title: "Five", number: 5 },
    { rank: "six", title: "Six", number: 6 },
    { rank: "seven", title: "Seven", number: 7 },
    { rank: "eight", title: "Eight", number: 8 },
    { rank: "nine", title: "Nine", number: 9 },
    { rank: "ten", title: "Ten", number: 10 },
    { rank: "page", title: "Page", number: 11 },
    { rank: "knight", title: "Knight", number: 12 },
    { rank: "queen", title: "Queen", number: 13 },
    { rank: "king", title: "King", number: 14 }
  ];

  const deckRoots = {
    tarot: "assets/images/cards/astral-veil-tarot",
    crimson: "assets/images/cards/astral-veil-crimson"
  };

  const cupsMeanings = {
    ace: {
      keywords: ["opening", "healing", "renewal", "love", "receptivity", "intuition"],
      shortMeaning: "A new emotional current opens the heart and invites healing from within.",
      summary:
        "The Ace of Cups is the first clear water after a long silence. It brings renewal, tenderness, and the courage to receive love without needing to control where it leads.",
      uprightMeaning: "Emotional renewal, healing, and the beginning of a sincere feeling.",
      shadowMeaning: "Overwhelm, emotional spilling, or giving the heart away before it is rooted.",
      reflectionQuestion: "What feeling is asking to be welcomed instead of managed?",
      themes: ["love", "healing", "renewal", "intuition"],
      archetype: "The Open Chalice",
      energy: "positive",
      upright: {
        summary: "Your inner waters are beginning again, soft but unmistakable.",
        meaning:
          "Let the feeling arrive without rushing to name it. This card favors forgiveness, creative renewal, spiritual tenderness, and the first honest movement of love after numbness or guardedness.",
        reflection: "Where can I receive without proving I deserve it?",
        keywords: ["opening", "healing", "renewal", "love", "receptivity", "intuition"]
      },
      reversed: {
        summary: "The cup is full, but the heart may not yet know how to hold it.",
        meaning:
          "Emotion may be blocked, leaking, or arriving all at once. Move gently; the lesson is not to shut down, but to create enough safety for feeling to become wisdom.",
        reflection: "What boundary would make this tenderness safer to feel?",
        shadow: "Emotional flooding, guardedness, or seeking rescue through another person's affection."
      },
      bloodMoon: {
        shortMeaning: "Craving the first rush can masquerade as healing.",
        summary:
          "Under the Blood Moon, the Ace of Cups becomes the intoxicating beginning: the first message, the first touch, the first flood of relief. It asks whether you are opening to love or becoming dependent on intensity.",
        shadowMessage: "Not every emotional surge is medicine.",
        veilHint: "Watch the moment where longing calls itself destiny.",
        upright: {
          headline: "The First Flood",
          summary: "A powerful emotional opening arrives with a dangerous sweetness.",
          meaning:
            "This may feel like healing because it moves so much through you so quickly. Stay awake to whether the heart is being restored or simply fed by novelty, attention, and the beautiful shock of being wanted.",
          shadow: "Intensity becomes proof, and the body mistakes flooding for devotion.",
          mask: "I am finally healed because I feel everything again.",
          wound: "A hunger to be filled before the self has learned to hold its own cup.",
          work: "Slow the rush, name the need, and let tenderness prove itself through steadiness.",
          veilHint: "The first wave is real, but it is not the whole ocean.",
          reflection: "Am I receiving love, or am I chasing relief?",
          thread: "The cup opens; the craving answers first."
        },
        reversed: {
          headline: "The Emptying Cup",
          summary: "Feeling pours out faster than it can become understanding.",
          meaning:
            "Dependency, panic, or emotional withdrawal may distort the promise of renewal. The task is to stop treating another person, fantasy, or sign as the source of your survival.",
          shadow: "Need becomes attachment, and attachment calls itself spiritual truth.",
          mask: "I cannot be okay unless this feeling returns.",
          wound: "Old abandonment turning every new tenderness into a test.",
          work: "Return to the body, reduce the drama, and separate genuine care from emotional withdrawal.",
          veilHint: "A cup cannot bless you while you are breaking it for proof.",
          reflection: "What am I asking this feeling to save me from?",
          thread: "When the chalice tips, the hidden hunger shows."
        }
      }
    },
    two: {
      keywords: ["connection", "trust", "mutuality", "bond", "exchange", "harmony"],
      shortMeaning: "A mutual bond forms through honest exchange, trust, and emotional recognition.",
      summary:
        "The Two of Cups reflects the sacred mirror of relationship. It honors the moment when two hearts meet without conquest, each offering presence rather than performance.",
      uprightMeaning: "Trust, mutual attraction, repair, and emotionally honest connection.",
      shadowMeaning: "Attachment, projection, or confusing chemistry with true alignment.",
      reflectionQuestion: "Where does connection feel mutual rather than pursued?",
      themes: ["relationship", "trust", "mutuality", "harmony"],
      archetype: "The Sacred Mirror",
      energy: "balanced",
      upright: {
        summary: "Two waters recognize each other without needing to become one.",
        meaning:
          "This card favors partnership, reconciliation, mutual care, and emotional agreements made with sincerity. It asks for equal presence: the kind of bond where listening matters as much as longing.",
        reflection: "What does my heart feel safe enough to say in this connection?",
        keywords: ["connection", "trust", "mutuality", "bond", "exchange", "harmony"]
      },
      reversed: {
        summary: "The mirror may be clouded by projection, imbalance, or unmet need.",
        meaning:
          "A bond may need clearer terms, calmer pacing, or a more honest look at what each person is bringing. Love cannot stay sacred if one heart keeps disappearing into the other.",
        reflection: "Where am I mistaking being chosen for being met?",
        shadow: "Codependency, uneven devotion, unresolved conflict, or attraction without real reciprocity."
      },
      bloodMoon: {
        shortMeaning: "Chemistry can become a chain when longing outruns truth.",
        summary:
          "Under the Blood Moon, the Two of Cups exposes obsession, emotional dependency, and the hunger to be completed by another. The bond may be real, but the distortion begins when intensity replaces reciprocity.",
        shadowMessage: "Wanting someone is not the same as being aligned with them.",
        veilHint: "Notice what you excuse when the connection feels fated.",
        upright: {
          headline: "The Devouring Mirror",
          summary: "A bond gleams with recognition, but it may also feed old hunger.",
          meaning:
            "The connection is charged, intimate, and difficult to dismiss. Look closely at whether both people are present, or whether one is being used as a mirror for rescue, validation, or unfinished attachment.",
          shadow: "Obsession dresses itself as sacred union.",
          mask: "No one has ever understood me like this.",
          wound: "The terror of being separate, ordinary, or unchosen.",
          work: "Practice reciprocity in action, not fantasy; let consistency matter more than signs.",
          veilHint: "A true mirror does not ask you to abandon your own face.",
          reflection: "Do I feel met, or merely activated?",
          thread: "Two cups touch; one thirst may try to drink both."
        },
        reversed: {
          headline: "The Bond That Binds",
          summary: "Attachment tightens where trust should breathe.",
          meaning:
            "A relationship pattern may be revealing dependence, jealousy, fixation, or fear of abandonment. This is not a sentence against love, but a demand that love stop being used as anesthesia.",
          shadow: "Need controls the room while calling itself devotion.",
          mask: "I only react this way because this matters so much.",
          wound: "Old rejection turning closeness into possession.",
          work: "Withdraw from the spiral, tell the truth plainly, and let the other person be separate.",
          veilHint: "If it requires self-betrayal, it is not union.",
          reflection: "What part of me believes love must feel like urgency?",
          thread: "The shared cup cracks where fear grips too hard."
        }
      }
    },
    three: {
      keywords: ["friendship", "joy", "community", "celebration", "belonging", "support"],
      shortMeaning: "Shared joy, friendship, and chosen family remind the heart it does not heal alone.",
      summary:
        "The Three of Cups gathers the soul back into community. It celebrates friendship, emotional support, creative circles, and the kind of belonging that lets happiness become communal.",
      uprightMeaning: "Celebration, friendship, support, and joyful emotional connection.",
      shadowMeaning: "Overindulgence, performative happiness, or losing yourself in group approval.",
      reflectionQuestion: "Who helps my joy feel honest rather than performed?",
      themes: ["friendship", "community", "celebration", "belonging"],
      archetype: "The Chosen Circle",
      energy: "positive",
      upright: {
        summary: "The heart remembers itself through laughter, witness, and shared cups.",
        meaning:
          "Lean into the people who celebrate your becoming without asking you to shrink. This card blesses reunions, creative kinship, emotional support, and the sacred medicine of being glad together.",
        reflection: "Where am I allowed to be joyful without earning it?",
        keywords: ["friendship", "joy", "community", "celebration", "belonging", "support"]
      },
      reversed: {
        summary: "The circle may feel noisy, exclusive, or unable to hold the truth beneath the smile.",
        meaning:
          "Group dynamics, gossip, comparison, or avoidance may be clouding real connection. Return to the people with whom joy can include honesty, rest, and complexity.",
        reflection: "Where am I performing happiness to keep my place?",
        shadow: "Escapism, social exhaustion, shallow validation, or belonging bought through self-erasure."
      },
      bloodMoon: {
        shortMeaning: "The party can become a shrine to avoidance.",
        summary:
          "Under the Blood Moon, the Three of Cups reveals intoxication, social masking, and the hunger to be validated by the room. Joy turns distorted when it cannot survive silence.",
        shadowMessage: "A crowd can hide loneliness as easily as it heals it.",
        veilHint: "Listen for the grief underneath the laughter that will not stop.",
        upright: {
          headline: "The Glittering Escape",
          summary: "Community offers pleasure, but also a place to disappear.",
          meaning:
            "There may be genuine affection here, yet the group mood can become a drug. Notice where celebration turns compulsive, where approval replaces intimacy, and where no one wants to be sober with the truth.",
          shadow: "Validation becomes the cup everyone drinks from.",
          mask: "I am fine as long as everyone is having fun.",
          wound: "Fear that your unedited self will not be invited back.",
          work: "Choose one honest conversation over a room full of applause.",
          veilHint: "The loudest toast may be covering the quietest need.",
          reflection: "Who would still sit with me after the music ends?",
          thread: "Three cups rise; the hidden emptiness clinks beneath them."
        },
        reversed: {
          headline: "The Hollow Circle",
          summary: "Belonging curdles into performance, exclusion, or emotional excess.",
          meaning:
            "A social pattern may be feeding avoidance, intoxication, comparison, or dependency on group approval. Step back from the ritual of appearing happy long enough to ask what kind of connection you actually need.",
          shadow: "The group protects the fantasy and punishes the truth.",
          mask: "Everyone does this, so it cannot be hurting me.",
          wound: "Loneliness disguised as popularity.",
          work: "Leave the performance, sober the signal, and seek friendship that can hold reality.",
          veilHint: "A chosen family should not require a false self as entry fee.",
          reflection: "What do I keep doing just to feel included?",
          thread: "When the circle darkens, the mask becomes the invitation."
        }
      }
    },
    four: {
      keywords: ["pause", "reevaluation", "dissatisfaction", "stillness", "listening", "discernment"],
      shortMeaning: "A quiet emotional pause asks you to listen beneath dissatisfaction.",
      summary:
        "The Four of Cups is the inward tide, the moment when the heart withdraws to understand what it truly wants. It may feel flat or restless, but its gift is discernment.",
      uprightMeaning: "Emotional pause, reevaluation, and listening for the offer beneath the mood.",
      shadowMeaning: "Numbness, apathy, avoidance, or refusing support because it arrives quietly.",
      reflectionQuestion: "What is my dissatisfaction trying to teach me?",
      themes: ["pause", "discernment", "listening", "dissatisfaction"],
      archetype: "The Still Pool",
      energy: "neutral",
      upright: {
        summary: "Stillness gives the heart room to separate true longing from passing mood.",
        meaning:
          "Do not force enthusiasm before you have listened. This card invites emotional inventory, sacred boredom, and the humility to notice a subtle gift that may not match your expectations.",
        reflection: "What offer have I overlooked because it did not arrive dramatically?",
        keywords: ["pause", "reevaluation", "dissatisfaction", "stillness", "listening", "discernment"]
      },
      reversed: {
        summary: "The inward pause may be ending, or avoidance may be reaching its limit.",
        meaning:
          "Apathy can begin to loosen when you risk engaging again. If you have been waiting to feel inspired, start by making one honest movement toward the life that still calls you.",
        reflection: "What small act of response would reopen my heart?",
        shadow: "Emotional stagnation, refusal, resentment, or using detachment to avoid vulnerability."
      },
      bloodMoon: {
        shortMeaning: "Numbness can become a locked room with the key still in your hand.",
        summary:
          "Under the Blood Moon, the Four of Cups reveals avoidance, emotional stagnation, and the stubborn refusal of help. The danger is not stillness itself, but making emptiness into an identity.",
        shadowMessage: "Refusing the cup does not make the thirst disappear.",
        veilHint: "Notice the offer you reject because accepting it would require change.",
        upright: {
          headline: "The Refused Cup",
          summary: "A gift waits nearby, but numbness has become familiar.",
          meaning:
            "You may be protecting yourself through disinterest, cynicism, or withdrawal. The heart is not wrong to need quiet, but it may be using quiet to avoid the vulnerability of receiving.",
          shadow: "Apathy becomes armor, then a prison.",
          mask: "Nothing matters enough to reach for it.",
          wound: "Disappointment so old it expects every offer to fail.",
          work: "Name the refusal honestly and test one small act of receptivity.",
          veilHint: "The cup you ignore may not be perfect, but it may be alive.",
          reflection: "What would I have to feel if I stopped acting untouched?",
          thread: "The still pool darkens when nothing is allowed to enter."
        },
        reversed: {
          headline: "The Numb Spell",
          summary: "Avoidance begins to crack, exposing the grief beneath indifference.",
          meaning:
            "You may be waking from stagnation, or realizing how long you have used detachment to stay safe. Do not shame the numbness; ask what it protected, then choose one living thing anyway.",
          shadow: "Refusal keeps the wound unchanged.",
          mask: "I am above wanting this.",
          wound: "The fear of hoping again and being disappointed again.",
          work: "Accept help in a concrete form; let action interrupt the trance.",
          veilHint: "The door opens when you admit you wanted it to.",
          reflection: "Where has my no become automatic?",
          thread: "When the spell thins, the buried wanting stirs."
        }
      }
    },
    five: {
      keywords: ["grief", "loss", "disappointment", "remembrance", "acceptance", "recovery"],
      shortMeaning: "Grief is real, but the remaining cups ask you not to abandon the whole story.",
      summary:
        "The Five of Cups honors sorrow without making it the entire horizon. It asks you to mourn what spilled while slowly remembering what still stands, waits, and loves you back.",
      uprightMeaning: "Grief, disappointment, and the first difficult movement toward what remains.",
      shadowMeaning: "Fixation on loss, regret, or loyalty to pain at the expense of healing.",
      reflectionQuestion: "What remains beside me, even while I grieve what is gone?",
      themes: ["grief", "loss", "acceptance", "recovery"],
      archetype: "The Mourner",
      energy: "challenging",
      upright: {
        summary: "The spilled cups matter, but they are not the only truth in the room.",
        meaning:
          "Let grief be honest and specific. This card does not rush forgiveness or closure; it simply asks that sorrow share the altar with memory, support, and the life that has not left.",
        reflection: "What part of my life is still reaching for me?",
        keywords: ["grief", "loss", "disappointment", "remembrance", "acceptance", "recovery"]
      },
      reversed: {
        summary: "The heart begins to turn, slowly, toward repair.",
        meaning:
          "Release may be possible, but it will not come through denial. Let yourself retrieve meaning from the loss without making the loss your permanent name.",
        reflection: "What am I ready to stop punishing myself for?",
        shadow: "Grief loops, regret, bitterness, or refusing comfort because pain feels loyal."
      },
      bloodMoon: {
        shortMeaning: "Sorrow can become a home when healing feels like betrayal.",
        summary:
          "Under the Blood Moon, the Five of Cups exposes grief loops, self-punishment, and the strange loyalty to pain. The wound may be real, but the shadow asks why you keep kneeling where nothing can be restored.",
        shadowMessage: "Pain deserves witness, not a throne.",
        veilHint: "Look for the moment sorrow starts protecting your identity.",
        upright: {
          headline: "The Altar of Loss",
          summary: "Grief is honored, but it may be demanding permanent worship.",
          meaning:
            "You may be circling what was lost because moving forward feels like disrespect. The Blood Moon asks you to distinguish remembrance from self-abandonment, mourning from devotion to the wound.",
          shadow: "The spilled cups become proof that nothing good can last.",
          mask: "I am just being realistic about what happened.",
          wound: "A heartbreak that taught the soul to expect abandonment.",
          work: "Grieve with ritual, then turn toward one living source of support.",
          veilHint: "The remaining cups are not insults to your loss.",
          reflection: "Who would I be if pain were part of my story, not all of it?",
          thread: "The mourner counts the dead cups until the living ones blur."
        },
        reversed: {
          headline: "The Loyal Sorrow",
          summary: "Healing threatens the identity built around what hurt.",
          meaning:
            "You may be ready to loosen a grief pattern, but part of you fears that recovery means forgetting, forgiving too soon, or losing the last bond to what mattered. Let healing be a continuation of love, not a betrayal of it.",
          shadow: "Refusing repair keeps the wound in command.",
          mask: "If I stop hurting, it means it did not matter.",
          wound: "Love fused with loss until peace feels disloyal.",
          work: "Create a boundary around rumination and give memory a kinder place to live.",
          veilHint: "You can carry love without carrying the blade.",
          reflection: "What grief am I afraid to survive?",
          thread: "When sorrow loosens, the self beneath it breathes."
        }
      }
    },
    six: {
      keywords: ["memory", "innocence", "tenderness", "nostalgia", "roots", "kindness"],
      shortMeaning: "Tender memory returns to show what shaped the heart and what can still be healed.",
      summary:
        "The Six of Cups carries old sweetness, emotional roots, and the kindness that survives time. It may bring reunion, remembrance, or a softer relationship with the child within.",
      uprightMeaning: "Memory, innocence, tenderness, and healing contact with the past.",
      shadowMeaning: "Idealizing the past, emotional regression, or longing for what was never whole.",
      reflectionQuestion: "What memory wants tenderness without being allowed to rule me?",
      themes: ["memory", "nostalgia", "tenderness", "roots"],
      archetype: "The Inner Child",
      energy: "mysterious",
      upright: {
        summary: "The past returns with a small cup of tenderness.",
        meaning:
          "This card invites kindness toward your younger self, old bonds, and the emotional roots beneath current longing. Let memory become medicine by seeing it clearly, not by polishing it into myth.",
        reflection: "What did my younger heart need to hear then, and can I offer it now?",
        keywords: ["memory", "innocence", "tenderness", "nostalgia", "roots", "kindness"]
      },
      reversed: {
        summary: "A memory may be sweet, but it is not a place to live.",
        meaning:
          "You may be outgrowing an old role, family pattern, or sentimental attachment. Honor the past without giving it authority over the person you are becoming.",
        reflection: "Where am I repeating an old need instead of meeting the present?",
        shadow: "Nostalgia, regression, idealization, or seeking safety in a story that was incomplete."
      },
      bloodMoon: {
        shortMeaning: "The past can become more seductive than the truth.",
        summary:
          "Under the Blood Moon, the Six of Cups becomes the nostalgia trap: a longing for innocence, old lovers, old homes, or versions of people that never fully existed. Memory becomes dangerous when it edits out the wound.",
        shadowMessage: "Not everything familiar was safe.",
        veilHint: "Ask what the memory leaves out in order to stay beautiful.",
        upright: {
          headline: "The Velvet Past",
          summary: "Memory glows warmly, but the light may be staged.",
          meaning:
            "You may be drawn back to an old person, place, pattern, or self-image because it promises relief from the present. Look gently but directly at what was missing, harmful, or unfinished.",
          shadow: "Idealization turns history into a spell.",
          mask: "Things were better then.",
          wound: "A child-self still trying to return to the moment before loss.",
          work: "Retrieve the tenderness without resurrecting the pattern.",
          veilHint: "The sweetest cup may still hold old poison.",
          reflection: "What am I remembering, and what am I refusing to remember?",
          thread: "The past offers flowers; the roots may still be tangled."
        },
        reversed: {
          headline: "The Regression Door",
          summary: "Old longing pulls the self back into a smaller shape.",
          meaning:
            "A familiar dynamic may be inviting you to abandon your growth. This could look like returning to an old attachment, replaying family roles, or asking the past to repair what only the present can hold.",
          shadow: "Comfort becomes captivity when it requires forgetting what you know.",
          mask: "I just miss how simple it was.",
          wound: "Unmet childhood needs searching for a perfect replay.",
          work: "Parent the longing, keep the lesson, and decline the old role.",
          veilHint: "The doorway back is not always a doorway home.",
          reflection: "What younger part of me is choosing here?",
          thread: "When memory darkens, innocence asks for protection."
        }
      }
    },
    seven: {
      keywords: ["dreams", "choices", "imagination", "possibility", "vision", "discernment"],
      shortMeaning: "Many visions shimmer before you, asking for imagination guided by discernment.",
      summary:
        "The Seven of Cups opens the dream chamber, full of possibilities, desires, and symbols. Its gift is imagination; its lesson is choosing what can become real.",
      uprightMeaning: "Dreams, options, creative vision, and the need to choose with clarity.",
      shadowMeaning: "Illusion, scattered desire, fantasy, or avoiding reality through possibility.",
      reflectionQuestion: "Which vision still feels true when the glitter fades?",
      themes: ["dreams", "choices", "imagination", "discernment"],
      archetype: "The Dream Chamber",
      energy: "mysterious",
      upright: {
        summary: "The heart sees many doors, but not every door leads to nourishment.",
        meaning:
          "Let yourself imagine broadly, then return to the body and choose. This card favors creative vision, spiritual messages, and emotional possibility when fantasy is paired with grounded discernment.",
        reflection: "What choice would make my dream more embodied?",
        keywords: ["dreams", "choices", "imagination", "possibility", "vision", "discernment"]
      },
      reversed: {
        summary: "The fog begins to thin when desire stops scattering itself.",
        meaning:
          "Clarity comes from choosing one real cup over seven imagined ones. You may need to release a fantasy, simplify your options, or stop using possibility to postpone commitment.",
        reflection: "What reality am I ready to choose over fantasy?",
        shadow: "Confusion, temptation, fantasy addiction, indecision, or chasing visions to avoid action."
      },
      bloodMoon: {
        shortMeaning: "Fantasy becomes addictive when reality asks too much.",
        summary:
          "Under the Blood Moon, the Seven of Cups reveals illusion, temptation, and scattered desire. The danger is not dreaming, but using dreams as a beautiful room where no truth can reach you.",
        shadowMessage: "A vision that costs your life force is not a prophecy.",
        veilHint: "The most dazzling cup may be the one designed to distract you.",
        upright: {
          headline: "The Hall of False Cups",
          summary: "Every desire glows, and each glow wants to be believed.",
          meaning:
            "You may be surrounded by fantasies, options, temptations, or imagined futures that feed longing without requiring commitment. The Blood Moon asks which desire is alive and which is only anesthesia.",
          shadow: "Imagination becomes a maze built to avoid reality.",
          mask: "I am just exploring my options.",
          wound: "Fear that choosing one life means grieving all the others.",
          work: "Name the cost of each fantasy, then choose one grounded next step.",
          veilHint: "What sparkles may still be hollow.",
          reflection: "Which dream asks me to become more honest?",
          thread: "Seven cups shine; one truth waits without decoration."
        },
        reversed: {
          headline: "The Broken Glamour",
          summary: "Illusion loses its perfume, leaving appetite exposed.",
          meaning:
            "A fantasy may be collapsing, or temptation may be showing its real price. This is a chance to stop bargaining with mirages and return to the desire that can survive daylight.",
          shadow: "Disappointment turns sharp when fantasy is treated as a promise.",
          mask: "I was misled, so I have no responsibility here.",
          wound: "A craving for escape from the limits of ordinary life.",
          work: "Withdraw from the illusion, simplify the field, and let one honest choice anchor you.",
          veilHint: "When the glamour breaks, do not rebuild it from shame.",
          reflection: "What have I been avoiding by staying enchanted?",
          thread: "The dream cracks; desire steps out unmasked."
        }
      }
    },
    eight: {
      keywords: ["departure", "maturity", "release", "searching", "truth", "transition"],
      shortMeaning: "The heart matures by leaving what can no longer nourish the soul.",
      summary:
        "The Eight of Cups is the sacred departure. It asks you to honor what once mattered while admitting when a path, bond, or dream no longer feeds your deeper life.",
      uprightMeaning: "Walking away, emotional maturity, and seeking a truer horizon.",
      shadowMeaning: "Avoidance, fleeing, ghosting, or calling escape growth.",
      reflectionQuestion: "What am I ready to leave because my soul has already begun moving?",
      themes: ["departure", "release", "maturity", "transition"],
      archetype: "The Pilgrim",
      energy: "transformative",
      upright: {
        summary: "Leaving is not always rejection; sometimes it is devotion to truth.",
        meaning:
          "This card supports departure from emotional arrangements that have gone dry. It asks for courage, gratitude, and the willingness to seek meaning beyond the familiar shore.",
        reflection: "What truth becomes clearer when I stop trying to make this enough?",
        keywords: ["departure", "maturity", "release", "searching", "truth", "transition"]
      },
      reversed: {
        summary: "The threshold is near, but fear or unfinished grief may keep you circling.",
        meaning:
          "You may be staying too long, leaving too abruptly, or confusing restlessness with wisdom. The question is whether your movement comes from truth or from refusal to face what is here.",
        reflection: "Am I leaving from clarity, or from the fear of staying present?",
        shadow: "Emotional avoidance, abandonment, unfinished conversations, or escape disguised as growth."
      },
      bloodMoon: {
        shortMeaning: "Escape can wear the robes of spiritual growth.",
        summary:
          "Under the Blood Moon, the Eight of Cups reveals fleeing, ghosting, and abandoning the scene before the truth is spoken. The shadow calls every exit a pilgrimage, even when it is running.",
        shadowMessage: "Leaving is not liberation if the pattern travels with you.",
        veilHint: "Notice whether the departure includes truth, repair, and accountability.",
        upright: {
          headline: "The Beautiful Exit",
          summary: "A path away opens, but the motive must be purified.",
          meaning:
            "You may need to leave, but the Blood Moon asks you to examine how. Departure becomes shadow when it avoids conversation, consequence, grief, or the humility of naming what happened.",
          shadow: "The self vanishes and calls the silence maturity.",
          mask: "I am choosing my peace.",
          wound: "Fear that staying long enough to be honest will trap you.",
          work: "Leave cleanly: speak the truth, own your part, and do not romanticize disappearance.",
          veilHint: "A true pilgrimage does not begin with a lie.",
          reflection: "What truth am I trying to outrun?",
          thread: "The moonlit road opens; the unfinished cups follow."
        },
        reversed: {
          headline: "The Return of the Pattern",
          summary: "What was abandoned comes back as repetition.",
          meaning:
            "You may discover that leaving did not resolve the deeper issue. The same emptiness, conflict, or longing reappears until you face it directly instead of changing scenery.",
          shadow: "Avoidance repeats itself under new names.",
          mask: "This time will be different because the setting is different.",
          wound: "A learned impulse to disappear before being seen in conflict.",
          work: "Stop at the threshold, complete the conversation, and learn the lesson before moving on.",
          veilHint: "The road is not wrong; the avoidance is.",
          reflection: "Where have I confused distance with healing?",
          thread: "The pilgrim turns back and finds the same cup waiting."
        }
      }
    },
    nine: {
      keywords: ["satisfaction", "gratitude", "pleasure", "fulfillment", "enoughness", "contentment"],
      shortMeaning: "Emotional fulfillment arrives when pleasure is received with gratitude and enoughness.",
      summary:
        "The Nine of Cups is the full table after a long inward journey. It celebrates earned pleasure, contentment, and the quiet spiritual power of letting enough be enough.",
      uprightMeaning: "Satisfaction, gratitude, emotional fulfillment, and pleasure that feels earned.",
      shadowMeaning: "Indulgence, complacency, or pleasure used to cover emptiness.",
      reflectionQuestion: "What does enough feel like in my body?",
      themes: ["fulfillment", "gratitude", "pleasure", "contentment"],
      archetype: "The Satisfied Heart",
      energy: "positive",
      upright: {
        summary: "The heart is invited to enjoy what has finally gathered around it.",
        meaning:
          "Receive the good without suspicion. This card honors self-worth, celebration, sensual pleasure, and the gratitude that deepens joy instead of grasping for more.",
        reflection: "Where can I let contentment be sacred instead of temporary?",
        keywords: ["satisfaction", "gratitude", "pleasure", "fulfillment", "enoughness", "contentment"]
      },
      reversed: {
        summary: "Pleasure may be plentiful, yet something essential still asks to be felt.",
        meaning:
          "You may be chasing satisfaction through excess, approval, or private comforts that do not reach the wound. Return to what genuinely nourishes rather than what only quiets the ache.",
        reflection: "What pleasure restores me, and what pleasure only distracts me?",
        shadow: "Indulgence, emotional emptiness, addiction, entitlement, or self-soothing without healing."
      },
      bloodMoon: {
        shortMeaning: "Pleasure can become a velvet cover for emptiness.",
        summary:
          "Under the Blood Moon, the Nine of Cups exposes indulgence, addiction, and the hunger that keeps asking for one more cup. Fulfillment distorts when gratification replaces contact with the wound.",
        shadowMessage: "Getting what you want will not heal what you refuse to feel.",
        veilHint: "Watch the cup you reach for when silence arrives.",
        upright: {
          headline: "The Velvet Appetite",
          summary: "Pleasure is abundant, but it may be serving the ache beneath it.",
          meaning:
            "There may be comfort, sensuality, success, or gratification available now. Enjoyment becomes shadow when it is used compulsively to avoid loneliness, shame, grief, or the terrifying quiet of enough.",
          shadow: "The self keeps drinking because satisfaction never lands.",
          mask: "I deserve this, so it cannot be harmful.",
          wound: "An emptiness that learned to negotiate through reward.",
          work: "Distinguish nourishment from numbing and let one pleasure become conscious.",
          veilHint: "The full table may still hide a starving heart.",
          reflection: "What do I keep feeding that is not actually hungry?",
          thread: "Nine cups gleam; the tenth absence speaks."
        },
        reversed: {
          headline: "The Bitter Feast",
          summary: "Excess reveals the emptiness it was hired to conceal.",
          meaning:
            "A pattern of indulgence, addiction, or emotional self-soothing may be reaching its consequence. Shame will not heal it; honest contact with the need beneath the behavior can.",
          shadow: "Pleasure becomes punishment when it is used against the self.",
          mask: "I can stop whenever I want.",
          wound: "A private ache looking for comfort without vulnerability.",
          work: "Interrupt the loop, ask for support, and choose repair over another round of escape.",
          veilHint: "The cup is not the enemy; unconscious thirst is.",
          reflection: "What feeling arrives when I do not reach for my usual comfort?",
          thread: "The feast fades; the hunger finally names itself."
        }
      }
    },
    ten: {
      keywords: ["harmony", "belonging", "family", "safety", "joy", "wholeness"],
      shortMeaning: "Shared emotional safety creates a sense of home, harmony, and belonging.",
      summary:
        "The Ten of Cups is the rainbow after the storm, the vision of love made livable. It speaks of chosen or given family, shared joy, and the deep relief of belonging somewhere real.",
      uprightMeaning: "Harmony, family, emotional safety, and shared joy.",
      shadowMeaning: "Forced peace, denial, or maintaining a perfect image at the cost of truth.",
      reflectionQuestion: "Where does belonging feel honest enough to include the whole truth?",
      themes: ["belonging", "family", "harmony", "safety"],
      archetype: "The Living Home",
      energy: "positive",
      upright: {
        summary: "The heart recognizes home in a bond, family, community, or inner state.",
        meaning:
          "This card blesses harmony that has room for real feeling. It honors emotional safety, shared dreams, and the kind of happiness that becomes stronger when everyone is allowed to be human.",
        reflection: "What does a truthful home ask us to practice?",
        keywords: ["harmony", "belonging", "family", "safety", "joy", "wholeness"]
      },
      reversed: {
        summary: "The image of harmony may need to break so real belonging can begin.",
        meaning:
          "A family, relationship, or community may be avoiding conflict to preserve peace. Let the rainbow become real by allowing honesty, repair, and difference into the room.",
        reflection: "Where am I keeping peace by hiding what is true?",
        shadow: "Dysfunction behind a perfect image, emotional performance, denial, or belonging with conditions."
      },
      bloodMoon: {
        shortMeaning: "The perfect picture can hide a house full of silence.",
        summary:
          "Under the Blood Moon, the Ten of Cups exposes forced happiness, denial, and the emotional performance required to keep the image intact. Peace becomes dangerous when truth is exiled to preserve it.",
        shadowMessage: "A happy ending that forbids honesty is another kind of cage.",
        veilHint: "Look behind the picture everyone insists is beautiful.",
        upright: {
          headline: "The Painted Rainbow",
          summary: "Harmony glows on the surface while harder truths wait underneath.",
          meaning:
            "There may be love here, but also pressure to maintain the story of happiness. The Blood Moon asks whether belonging is real enough to survive conflict, grief, difference, and repair.",
          shadow: "The image of peace becomes more protected than the people inside it.",
          mask: "Everything is fine because it has to be.",
          wound: "Fear that truth will destroy the only home you have known.",
          work: "Let one honest feeling enter the family, group, or dream without making it the enemy.",
          veilHint: "The rainbow is false if no one may mention the storm.",
          reflection: "What truth would make this belonging more real?",
          thread: "Ten cups shine; the house holds its breath."
        },
        reversed: {
          headline: "The House of Denial",
          summary: "The performance of joy collapses under its own silence.",
          meaning:
            "A family system, partnership, or cherished dream may be showing dysfunction that can no longer be hidden. This is painful, but it also creates the possibility of belonging built on truth instead of choreography.",
          shadow: "Forced happiness becomes a pact against reality.",
          mask: "We do not talk about that here.",
          wound: "Conditional belonging that trained the heart to smile on command.",
          work: "Name the pattern, refuse the role, and seek harmony that can hold accountability.",
          veilHint: "A real home has room for repair.",
          reflection: "What peace am I no longer willing to purchase with silence?",
          thread: "When the painted rainbow runs, the true weather begins."
        }
      }
    },
    page: {
      keywords: ["curiosity", "wonder", "message", "sensitivity", "inner child", "imagination"],
      shortMeaning: "A tender message from the heart invites curiosity, wonder, and emotional openness.",
      summary:
        "The Page of Cups is the young dreamer at the water's edge. It brings intuitive messages, creative beginnings, apologies, crushes, and the vulnerable magic of feeling before certainty arrives.",
      uprightMeaning: "Emotional curiosity, wonder, intuition, and messages from the heart.",
      shadowMeaning: "Immaturity, fantasy, fragile feelings, or craving attention through vulnerability.",
      reflectionQuestion: "What tender feeling wants curiosity instead of judgment?",
      themes: ["curiosity", "wonder", "intuition", "inner child"],
      archetype: "The Young Dreamer",
      energy: "mysterious",
      upright: {
        summary: "A small, sincere feeling arrives like a fish speaking from the cup.",
        meaning:
          "Stay open to surprising messages, creative impulses, and emotional beginnings. This card asks you to protect innocence without dismissing it, and to let wonder soften the places that became too defended.",
        reflection: "Where can I meet my own tenderness with more imagination?",
        keywords: ["curiosity", "wonder", "message", "sensitivity", "inner child", "imagination"]
      },
      reversed: {
        summary: "Tenderness may hide behind fantasy, mood, or fear of being seen.",
        meaning:
          "Feelings are real, but they may not yet be mature. Give the inner child care and structure so imagination can become expression instead of avoidance.",
        reflection: "What feeling needs care before it becomes a story?",
        shadow: "Emotional immaturity, fantasy as defense, attention-seeking, or fragile sensitivity."
      },
      bloodMoon: {
        shortMeaning: "Fragile feeling can disguise itself as magic to avoid growing up.",
        summary:
          "Under the Blood Moon, the Page of Cups reveals emotional immaturity, fantasy as shield, and the craving to be special, noticed, or rescued. Wonder is not the problem; refusing accountability is.",
        shadowMessage: "A delicate feeling is still responsible for how it moves.",
        veilHint: "Watch where innocence is used to avoid impact.",
        upright: {
          headline: "The Fragile Spell",
          summary: "A tender message arrives wrapped in fantasy and need.",
          meaning:
            "There may be a real feeling, apology, creative impulse, or intuitive signal here. The shadow appears when sensitivity demands protection from consequence or turns vulnerability into a way to pull attention.",
          shadow: "The inner child takes the throne and calls every limit cruelty.",
          mask: "I cannot help it; I just feel so much.",
          wound: "A young part of the self begging to be noticed before it disappears.",
          work: "Validate the feeling, then ask what mature action it requires.",
          veilHint: "Magic deepens when it can tell the truth.",
          reflection: "Where do I want care without having to be clear?",
          thread: "The cup speaks softly; the unmet child speaks louder."
        },
        reversed: {
          headline: "The Sulking Oracle",
          summary: "Fantasy curdles when tenderness refuses form.",
          meaning:
            "A mood, crush, apology, or dream may be stuck in childish patterns. This can show passive signals, emotional testing, or retreating into imagination when direct expression is needed.",
          shadow: "Feeling becomes manipulation when it refuses to name itself.",
          mask: "If they cared, they would just know.",
          wound: "Fear of asking directly and being denied.",
          work: "Say the feeling plainly, accept the answer, and give the fantasy a boundary.",
          veilHint: "The oracle loses power when it only hints.",
          reflection: "What am I hoping someone will guess?",
          thread: "The little cup clouds; the message waits to grow teeth."
        }
      }
    },
    knight: {
      keywords: ["devotion", "romance", "quest", "courage", "beauty", "pursuit"],
      shortMeaning: "The heart rides toward beauty, devotion, and the courage to follow sincere feeling.",
      summary:
        "The Knight of Cups is the romantic seeker, carrying a cup through dream and danger. It asks for emotional courage, creative devotion, and movement guided by the heart rather than vanity.",
      uprightMeaning: "Romantic pursuit, devotion, emotional courage, and following the heart.",
      shadowMeaning: "Seduction, idealization, moodiness, or chasing feeling instead of practicing devotion.",
      reflectionQuestion: "What would devotion look like after the first beautiful feeling fades?",
      themes: ["romance", "devotion", "quest", "courage"],
      archetype: "The Heart's Knight",
      energy: "positive",
      upright: {
        summary: "A feeling becomes a quest when the heart is brave enough to move.",
        meaning:
          "This card favors invitations, romance, artistry, apology, and sincere emotional pursuit. Let beauty guide you, but let integrity decide the pace.",
        reflection: "Where is my heart asking me to act with grace and courage?",
        keywords: ["devotion", "romance", "quest", "courage", "beauty", "pursuit"]
      },
      reversed: {
        summary: "The quest may be led by fantasy, performance, or the thrill of pursuit.",
        meaning:
          "Feelings can be sincere and still unsteady. Beware charm without follow-through, promises made in the mood of the moment, or romantic gestures that avoid real intimacy.",
        reflection: "Am I offering devotion, or trying to be adored?",
        shadow: "Love-bombing, seduction, idealization, emotional inconsistency, or desire mistaken for devotion."
      },
      bloodMoon: {
        shortMeaning: "Desire can perform devotion until the chase is won.",
        summary:
          "Under the Blood Moon, the Knight of Cups reveals seduction, love-bombing, and the intoxication of pursuit. The shadow is not romance, but using romance to avoid the discipline of love.",
        shadowMessage: "A beautiful approach is not proof of a faithful heart.",
        veilHint: "Notice what happens after the door opens.",
        upright: {
          headline: "The Perfumed Chase",
          summary: "The pursuit is beautiful, charged, and possibly more hungry than devoted.",
          meaning:
            "A romantic or creative impulse may be sweeping, persuasive, and emotionally vivid. Look for consistency beneath the poetry; desire becomes dangerous when it wants the feeling more than the person.",
          shadow: "Seduction borrows the language of soul vows.",
          mask: "I have never felt this way before.",
          wound: "A need to be adored through conquest, rescue, or impossible romance.",
          work: "Slow the gesture, match words with behavior, and let pursuit become care.",
          veilHint: "The song is lovely; listen for the footsteps after it ends.",
          reflection: "Am I in love with them, or with what I become while pursuing them?",
          thread: "The knight offers the cup; the horse already wants to run."
        },
        reversed: {
          headline: "The Vanishing Lover",
          summary: "Charm withdraws when intimacy asks for substance.",
          meaning:
            "A pattern of chasing, idealizing, promising, then disappearing may be active. This card can expose love-bombing, emotional manipulation, or the crash that follows desire mistaken for devotion.",
          shadow: "The fantasy needs distance to stay beautiful.",
          mask: "I meant it when I said it.",
          wound: "Fear that ordinary love will reveal an ordinary self.",
          work: "Stop performing feeling; practice reliability, honesty, and repair.",
          veilHint: "The cup is empty if it cannot stay.",
          reflection: "Where do my promises outrun my capacity?",
          thread: "When the chase ends, the unkept vow echoes."
        }
      }
    },
    queen: {
      keywords: ["compassion", "intuition", "depth", "care", "empathy", "inner knowing"],
      shortMeaning: "Compassion and intuition deepen when the heart stays open without losing itself.",
      summary:
        "The Queen of Cups is the deep vessel of feeling, empathy, and inner knowing. She teaches care that listens beneath words while honoring the boundary that keeps compassion from becoming disappearance.",
      uprightMeaning: "Compassion, intuition, emotional depth, and wise care.",
      shadowMeaning: "Enmeshment, martyrdom, overwhelm, or caring until the self disappears.",
      reflectionQuestion: "How can I remain compassionate without abandoning my own waters?",
      themes: ["compassion", "intuition", "empathy", "boundaries"],
      archetype: "The Deep Vessel",
      energy: "balanced",
      upright: {
        summary: "The heart becomes a deep vessel: receptive, wise, and quietly powerful.",
        meaning:
          "Trust your inner knowing, especially where words fail. This card supports emotional healing, spiritual listening, creative sensitivity, and care that remains connected to the self.",
        reflection: "What does my intuition know before my fear begins explaining?",
        keywords: ["compassion", "intuition", "depth", "care", "empathy", "inner knowing"]
      },
      reversed: {
        summary: "The vessel may be overflowing because it has held too much for too long.",
        meaning:
          "Empathy needs edges. You may need to step back from emotional labor, psychic noise, or a caretaker role that has blurred love with self-erasure.",
        reflection: "Where have I confused being needed with being connected?",
        shadow: "Emotional enmeshment, martyrdom, overwhelm, secrecy, or porous boundaries."
      },
      bloodMoon: {
        shortMeaning: "Care becomes a haunting when the self disappears into another's pain.",
        summary:
          "Under the Blood Moon, the Queen of Cups reveals enmeshment, martyrdom, psychic overwhelm, and the hidden control that can live inside endless care. Compassion darkens when it has no boundary.",
        shadowMessage: "Drowning with someone is not the same as loving them.",
        veilHint: "Ask what you receive from being the only one who understands.",
        upright: {
          headline: "The Drowned Mother",
          summary: "Compassion deepens into sacrifice, and sacrifice asks for a name.",
          meaning:
            "You may be absorbing too much, rescuing too often, or mistaking emotional fusion for intimacy. The Blood Moon asks whether care is freely given or secretly bargaining for safety, worth, or control.",
          shadow: "Empathy becomes possession through suffering.",
          mask: "I am the only one who can hold this.",
          wound: "A belief that love must be earned by becoming indispensable.",
          work: "Return every feeling to its rightful owner and keep your own cup nearby.",
          veilHint: "The deepest water still needs a shore.",
          reflection: "Who am I when I am not managing everyone else's feelings?",
          thread: "The queen holds the sea until she forgets her own breath."
        },
        reversed: {
          headline: "The Flooded Vessel",
          summary: "Psychic overwhelm spills into withdrawal, resentment, or covert control.",
          meaning:
            "The emotional field may be too saturated to read clearly. This can show martyrdom, manipulation through hurt, or compassion collapsing into exhaustion because no boundary was allowed to stand.",
          shadow: "The wounded caretaker punishes what she never directly refused.",
          mask: "After everything I have done, they should know.",
          wound: "Old neglect turning care into proof of worth.",
          work: "Stop rescuing, speak the resentment plainly, and rebuild a boundary before offering more.",
          veilHint: "A closed cup can be mercy when the ocean is too loud.",
          reflection: "What boundary would make my compassion honest again?",
          thread: "When the vessel cracks, the unspoken bargain leaks out."
        }
      }
    },
    king: {
      keywords: ["mastery", "calm", "leadership", "compassion", "boundaries", "wisdom"],
      shortMeaning: "Emotional mastery brings calm leadership, compassion, and steady boundaries.",
      summary:
        "The King of Cups rules the inner sea without needing to freeze it. He brings mature feeling, wise counsel, and the ability to stay compassionate while holding a clear emotional center.",
      uprightMeaning: "Emotional mastery, calm leadership, compassion, and mature boundaries.",
      shadowMeaning: "Emotional control, hidden manipulation, suppression, or calm used as a mask.",
      reflectionQuestion: "Where can I lead with feeling without being ruled by it?",
      themes: ["mastery", "leadership", "compassion", "boundaries"],
      archetype: "The Sea King",
      energy: "balanced",
      upright: {
        summary: "The waves are strong, but the inner throne remains steady.",
        meaning:
          "This card supports emotional regulation, wise counsel, compassionate authority, and love expressed through steadiness. It asks you to feel deeply without making others responsible for the tide.",
        reflection: "What would emotional maturity choose in this moment?",
        keywords: ["mastery", "calm", "leadership", "compassion", "boundaries", "wisdom"]
      },
      reversed: {
        summary: "Calm may be genuine, or it may be hiding control, distance, or unspoken feeling.",
        meaning:
          "Emotional intelligence can heal or manipulate. Examine whether composure is creating safety, avoiding vulnerability, or quietly steering the room.",
        reflection: "Where am I using calm to avoid being honest?",
        shadow: "Suppression, emotional manipulation, coldness, control, or wisdom used without vulnerability."
      },
      bloodMoon: {
        shortMeaning: "Emotional intelligence can become a beautiful instrument of control.",
        summary:
          "Under the Blood Moon, the King of Cups exposes the calm mask, hidden manipulation, and the ability to steer others without appearing forceful. The sea is still, but something beneath it is moving.",
        shadowMessage: "Control is not maturity just because it speaks softly.",
        veilHint: "Watch who benefits from the calm.",
        upright: {
          headline: "The Calm Mask",
          summary: "Composure holds the room, but its motive needs examination.",
          meaning:
            "There may be genuine emotional mastery here, but also the temptation to manage perception, withhold vulnerability, or guide others through subtle pressure. Wisdom becomes shadow when it refuses transparency.",
          shadow: "The steady voice hides the hand on the current.",
          mask: "I am simply being reasonable.",
          wound: "Fear that open feeling will cost authority, respect, or control.",
          work: "Let honesty accompany composure; state the need without orchestrating the response.",
          veilHint: "A still sea can still pull ships under.",
          reflection: "Am I creating safety, or managing the outcome?",
          thread: "The king smiles; the tide obeys something unspoken."
        },
        reversed: {
          headline: "The Hidden Current",
          summary: "Suppressed feeling moves through manipulation, distance, or quiet punishment.",
          meaning:
            "Emotions may be controlled rather than integrated. This can show passive control, strategic silence, coercive calm, or using insight into others as leverage instead of care.",
          shadow: "The unexpressed feeling rules from beneath the surface.",
          mask: "I am not emotional about this.",
          wound: "A learned distrust of vulnerability and visible need.",
          work: "Admit the feeling before it becomes strategy, and repair any quiet control.",
          veilHint: "What is not confessed becomes a current.",
          reflection: "What truth would my calm have to stop concealing?",
          thread: "When the king denies the sea, the undertow speaks for him."
        }
      }
    }
  };

  const wandsMeanings = {
    ace: {
      keywords: ["spark", "inspiration", "ignition", "passion", "creation", "awakening"],
      shortMeaning: "A fresh spark of life-force arrives, asking to become action.",
      summary:
        "The Ace of Wands is the soul catching fire in a clean, living way. It brings inspiration, creative birth, spiritual ignition, and the courage to follow the first honest flame.",
      uprightMeaning: "New passion, creative ignition, and the first brave movement of will.",
      shadowMeaning: "Craving intensity, burning too fast, or mistaking excitement for purpose.",
      reflectionQuestion: "What spark wants action before doubt smothers it?",
      themes: ["inspiration", "creativity", "passion", "awakening"],
      archetype: "The First Flame",
      energy: "positive",
      upright: {
        summary: "The first flame is alive; protect it by giving it form.",
        meaning:
          "A new impulse, attraction, idea, or creative path is asking for your yes. Begin before the whole road is visible, and let instinct become devotion through one concrete act.",
        reflection: "Where is my life-force asking for permission to move?",
        keywords: ["spark", "inspiration", "ignition", "passion", "creation", "awakening"]
      },
      reversed: {
        summary: "The flame may be delayed, scattered, or burning without a vessel.",
        meaning:
          "Inspiration needs space, pacing, and a reason deeper than novelty. Clear what drains your fire, then return to the impulse that still feels warm after the rush fades.",
        reflection: "What would help this spark become sustainable?",
        shadow: "Restlessness, blocked creativity, dangerous ignition, or chasing the rush of beginning."
      },
      bloodMoon: {
        shortMeaning: "The first spark becomes dangerous when intensity is the only prayer.",
        summary:
          "Under the Blood Moon, the Ace of Wands reveals obsession with the beginning: the rush, the heat, the charged first yes. Fire is sacred, but it can also teach you to crave combustion more than creation.",
        shadowMessage: "Not every flame that wakes you is meant to consume you.",
        veilHint: "Watch the moment inspiration becomes appetite.",
        upright: {
          headline: "The Red Spark",
          summary: "A powerful ignition arrives, bright enough to distort judgment.",
          meaning:
            "A new passion may feel undeniable, almost holy in its force. Test whether it wants to become art, courage, and life, or whether it only wants another hit of intensity.",
          shadow: "The spark is worshiped before it is understood.",
          mask: "This feels too alive to question.",
          wound: "A fear of emptiness that confuses heat with meaning.",
          work: "Slow the first yes long enough to give the flame a clean vessel.",
          veilHint: "A true fire can survive being tended.",
          reflection: "Am I creating from life-force, or chasing the rush of ignition?",
          thread: "The wand flares; hunger leans close to the light."
        },
        reversed: {
          headline: "The Burnt Match",
          summary: "The craving for ignition leaves ash where devotion should grow.",
          meaning:
            "You may be starting, stopping, provoking, or pursuing danger just to feel lit again. The work is to stop sacrificing peace for proof that you are alive.",
          shadow: "Excitement becomes compulsion, then exhaustion.",
          mask: "I need this to feel like myself.",
          wound: "A dim inner life searching for rescue through intensity.",
          work: "Withdraw from the immediate spark and rebuild desire through steadiness.",
          veilHint: "Ash is also information.",
          reflection: "What am I afraid I will feel when the fire goes quiet?",
          thread: "When the match dies, the hand still reaches for flame."
        }
      }
    },
    two: {
      keywords: ["vision", "planning", "choice", "direction", "power", "horizon"],
      shortMeaning: "A larger future appears, asking you to choose your direction with power and care.",
      summary:
        "The Two of Wands stands at the threshold between desire and design. It asks the soul to look outward, claim personal power, and choose a path without needing every uncertainty resolved.",
      uprightMeaning: "Vision, planning, personal power, and choosing the future path.",
      shadowMeaning: "Overcontrol, fear of uncertainty, or trying to own every outcome.",
      reflectionQuestion: "What future am I ready to choose without controlling every detail?",
      themes: ["vision", "planning", "choice", "power"],
      archetype: "The Horizon Keeper",
      energy: "balanced",
      upright: {
        summary: "The horizon is calling, and your will is learning to answer.",
        meaning:
          "Make a plan that honors your fire without shrinking it into fear. This card favors strategy, bold decisions, and the first conscious claim of a life larger than the familiar room.",
        reflection: "Where can I act from vision instead of prediction?",
        keywords: ["vision", "planning", "choice", "direction", "power", "horizon"]
      },
      reversed: {
        summary: "The future may feel too wide, or too tightly controlled to breathe.",
        meaning:
          "Indecision and domination are two faces of the same fear. Release the need to see every consequence, then choose the next direction that strengthens your light.",
        reflection: "What am I trying to control because I do not yet trust my power?",
        shadow: "Control, hesitation, narrow ambition, or fear of stepping beyond the known."
      },
      bloodMoon: {
        shortMeaning: "Vision darkens when the future must obey.",
        summary:
          "Under the Blood Moon, the Two of Wands reveals the urge to dominate the path ahead. Planning becomes shadow when uncertainty is treated as an enemy to conquer.",
        shadowMessage: "A future you must possess is already possessing you.",
        veilHint: "Notice where strategy becomes a cage.",
        upright: {
          headline: "The Owned Horizon",
          summary: "The future is imagined so intensely it begins to feel like property.",
          meaning:
            "Ambition and vision are active, but the shadow wants guarantees, leverage, and command over every variable. Let your plan be strong without becoming tyrannical.",
          shadow: "Personal power hardens into control.",
          mask: "I am just being prepared.",
          wound: "Fear that uncertainty will expose helplessness.",
          work: "Build the plan, then leave room for life to answer back.",
          veilHint: "The horizon recedes from the hand that tries to own it.",
          reflection: "Where has my vision stopped listening?",
          thread: "Two wands mark the gate; the future refuses the chain."
        },
        reversed: {
          headline: "The Locked Gate",
          summary: "Fear of the unknown turns choice into paralysis or domination.",
          meaning:
            "You may be delaying action until certainty arrives, or forcing a path so nothing can surprise you. Both patterns drain the fire that vision was meant to awaken.",
          shadow: "Control disguises itself as wisdom.",
          mask: "I cannot move until I know everything.",
          wound: "A history of instability that made freedom feel unsafe.",
          work: "Choose one direction and one flexible condition; let movement teach you.",
          veilHint: "The gate opens when the hand unclenches.",
          reflection: "What outcome am I gripping so tightly that I cannot begin?",
          thread: "The map burns at the edges where fear holds it too close."
        }
      }
    },
    three: {
      keywords: ["expansion", "growth", "waiting", "progress", "courage", "return"],
      shortMeaning: "Your efforts begin to move outward, and the horizon answers with growth.",
      summary:
        "The Three of Wands is expansion after the first brave choice. It asks you to wait actively, trust the ships you have sent, and become large enough to receive what your courage set in motion.",
      uprightMeaning: "Expansion, progress, patience, and courage to look beyond the known.",
      shadowMeaning: "Hunger for more, restless ambition, or never feeling satisfied with the horizon.",
      reflectionQuestion: "What growth is already returning because I dared to begin?",
      themes: ["expansion", "growth", "progress", "patience"],
      archetype: "The Far Seer",
      energy: "positive",
      upright: {
        summary: "The fire you sent outward is beginning to find its way back.",
        meaning:
          "Progress may not arrive instantly, but movement is underway. Keep your stance wide, your vision honest, and your willingness open to opportunities beyond the first plan.",
        reflection: "How can I make space for the future I asked for?",
        keywords: ["expansion", "growth", "waiting", "progress", "courage", "return"]
      },
      reversed: {
        summary: "Expansion may be delayed by impatience, narrow expectations, or fear of scale.",
        meaning:
          "You may need to adjust the plan, widen your perspective, or stop demanding that growth arrive in one preferred form. The horizon is teaching trust.",
        reflection: "Where am I measuring progress too narrowly?",
        shadow: "Restlessness, overreach, delayed returns, or ambition that cannot feel satisfied."
      },
      bloodMoon: {
        shortMeaning: "The horizon becomes a hunger that cannot be fed.",
        summary:
          "Under the Blood Moon, the Three of Wands exposes expansion turned ravenous. What began as courage can become a need for more territory, more proof, and more future than the soul can inhabit.",
        shadowMessage: "More is not a direction when the self is starving.",
        veilHint: "Watch the moment growth stops nourishing and starts devouring.",
        upright: {
          headline: "The Ravenous Horizon",
          summary: "The future opens wide, and appetite widens with it.",
          meaning:
            "Ambition is stretching outward, but satisfaction keeps moving farther away. Ask whether expansion is serving your calling or feeding a fear that stillness will reveal insufficiency.",
          shadow: "The horizon becomes a mouth.",
          mask: "I am only reaching my potential.",
          wound: "A belief that worth must keep expanding to remain safe.",
          work: "Define enough before you pursue more.",
          veilHint: "A ship returning is still a blessing, even if it is not an empire.",
          reflection: "What am I hoping the next horizon will prove?",
          thread: "Three wands face the distance; desire lengthens its shadow."
        },
        reversed: {
          headline: "The Empty Return",
          summary: "Overreach reveals the cost of chasing a horizon without rest.",
          meaning:
            "Plans may stall because the fire has been stretched too thin. This is a chance to reclaim direction from appetite and let one meaningful return matter.",
          shadow: "Nothing feels like progress unless it enlarges the self-image.",
          mask: "I cannot stop now.",
          wound: "Fear of becoming ordinary if the climb slows.",
          work: "Gather the scattered fire, revise the reach, and receive what is already here.",
          veilHint: "The far shore cannot heal a hollow center.",
          reflection: "Where has ambition made me unable to receive?",
          thread: "The ships come in; the hunger looks past them."
        }
      }
    },
    four: {
      keywords: ["celebration", "homecoming", "stability", "joy", "community", "altar"],
      shortMeaning: "Shared fire becomes sacred joy, homecoming, and stability after effort.",
      summary:
        "The Four of Wands is the threshold decorated with flame. It celebrates belonging, milestones, chosen home, and the joy that becomes stronger when it is shared.",
      uprightMeaning: "Celebration, homecoming, shared fire, and stable joy after effort.",
      shadowMeaning: "Forced celebration, image management, or happiness performed for approval.",
      reflectionQuestion: "Where can I let joy be real instead of impressive?",
      themes: ["celebration", "homecoming", "stability", "joy"],
      archetype: "The Sacred Threshold",
      energy: "positive",
      upright: {
        summary: "The fire has found a hearth, and the hearth asks to be honored.",
        meaning:
          "Pause to mark the milestone. This card blesses gatherings, commitment, creative completion, and the stability that appears when people tend a shared flame.",
        reflection: "What achievement deserves to be welcomed home?",
        keywords: ["celebration", "homecoming", "stability", "joy", "community", "altar"]
      },
      reversed: {
        summary: "The celebration may be delayed, strained, or too focused on appearances.",
        meaning:
          "A home, group, or milestone may need a more honest foundation. Let joy include imperfection so the fire can warm the room rather than light a stage.",
        reflection: "What tension needs truth before joy can settle?",
        shadow: "Forced happiness, unstable foundations, approval-seeking, or tension hidden under ceremony."
      },
      bloodMoon: {
        shortMeaning: "The party can become a performance staged over a fault line.",
        summary:
          "Under the Blood Moon, the Four of Wands reveals forced celebration and the image of success hiding tension. Joy distorts when it is arranged for approval instead of rooted in truth.",
        shadowMessage: "A beautiful threshold still cracks if no one names the pressure beneath it.",
        veilHint: "Look for the silence everyone decorates around.",
        upright: {
          headline: "The Decorated Fault Line",
          summary: "The lights are warm, but the foundation may be strained.",
          meaning:
            "There may be a real milestone here, yet the demand to appear happy can silence what needs repair. Let celebration be honest enough to include the tension under the garland.",
          shadow: "Approval becomes the host of the gathering.",
          mask: "Everything looks wonderful, so it must be.",
          wound: "Fear that truth will ruin belonging.",
          work: "Honor the milestone while naming one real need beneath it.",
          veilHint: "The hearth does not need a perfect photograph.",
          reflection: "What am I performing so others will bless my joy?",
          thread: "Four wands hold the arch; pressure gathers under the floor."
        },
        reversed: {
          headline: "The Forced Toast",
          summary: "Happiness is demanded where honesty has been postponed.",
          meaning:
            "A celebration, home, relationship, or public success may be revealing hidden strain. Stop using ceremony to cover instability; the fire needs a stronger hearth.",
          shadow: "The image of success becomes more important than the people inside it.",
          mask: "We should be grateful, not difficult.",
          wound: "Conditional acceptance tied to appearing joyful and accomplished.",
          work: "Let the performance end and rebuild the foundation through truth.",
          veilHint: "A quiet room can be more sacred than a forced feast.",
          reflection: "Where has approval replaced belonging?",
          thread: "The cups are raised; the room does not exhale."
        }
      }
    },
    five: {
      keywords: ["challenge", "friction", "competition", "testing", "strength", "heat"],
      shortMeaning: "Friction tests your strength and teaches the fire how to move with others.",
      summary:
        "The Five of Wands brings heat, challenge, and the lively clash of competing wills. It can teach courage, skill, and resilience when conflict becomes practice rather than proof.",
      uprightMeaning: "Challenge, competition, friction, and strength tested through engagement.",
      shadowMeaning: "Ego clashes, chaos, conflict addiction, or needing the fight to feel alive.",
      reflectionQuestion: "What is this friction teaching me about my fire?",
      themes: ["challenge", "competition", "friction", "strength"],
      archetype: "The Trial by Fire",
      energy: "challenging",
      upright: {
        summary: "The heat is real, but it can sharpen rather than destroy.",
        meaning:
          "Expect competing opinions, creative tension, or a test of will. Stay engaged without becoming consumed; the aim is skill, not domination.",
        reflection: "How can I remain alive in the challenge without becoming ruled by it?",
        keywords: ["challenge", "friction", "competition", "testing", "strength", "heat"]
      },
      reversed: {
        summary: "The fight may be losing purpose, or the lesson may require disengagement.",
        meaning:
          "Conflict can clarify, but needless chaos only scatters your power. Choose whether to resolve, redirect, or step away from a battle that no longer teaches.",
        reflection: "What fight am I ready to stop feeding?",
        shadow: "Avoided conflict, petty rivalry, escalation, or chaos used to avoid deeper truth."
      },
      bloodMoon: {
        shortMeaning: "The fight becomes addictive when conflict is the only place fire feels alive.",
        summary:
          "Under the Blood Moon, the Five of Wands exposes ego clashes, chaos, and the craving for friction. The shadow does not want resolution; it wants heat.",
        shadowMessage: "Winning the fight can still mean losing your center.",
        veilHint: "Notice when your body starts craving the argument.",
        upright: {
          headline: "The Addicted Clash",
          summary: "Friction turns electric, feeding ego more than truth.",
          meaning:
            "A conflict may be stimulating enough to feel meaningful, even when it is draining everyone involved. Ask whether the challenge is sharpening you or simply keeping your nervous system lit.",
          shadow: "Ego needs an opponent to feel real.",
          mask: "I am just standing up for myself.",
          wound: "A learned belief that attention arrives through conflict.",
          work: "Separate the real issue from the rush of the fight.",
          veilHint: "Heat is not always courage.",
          reflection: "What do I get from keeping this conflict alive?",
          thread: "Five wands strike; the sparks start asking for blood."
        },
        reversed: {
          headline: "The Smoke After Battle",
          summary: "The chaos clears enough to reveal what the fight was hiding.",
          meaning:
            "You may be exhausted from rivalry, drama, or constant provocation. Let the withdrawal of heat show the unspoken need beneath the noise.",
          shadow: "Without conflict, the wound has nowhere to hide.",
          mask: "They started it.",
          wound: "Fear of being unseen unless the room is burning.",
          work: "Refuse the bait, name the need, and choose a cleaner contest.",
          veilHint: "When the smoke thins, the real wound is visible.",
          reflection: "Who am I when no one is opposing me?",
          thread: "The wands fall quiet; the body still waits for impact."
        }
      }
    },
    six: {
      keywords: ["victory", "recognition", "pride", "success", "visibility", "honor"],
      shortMeaning: "Earned recognition arrives, asking you to receive victory without losing humility.",
      summary:
        "The Six of Wands is the return from effort into visibility. It honors victory, public recognition, and the healing pride of being seen after staying faithful to the path.",
      uprightMeaning: "Victory, recognition, earned pride, and being seen after effort.",
      shadowMeaning: "Vanity, dependence on applause, or confusing attention with worth.",
      reflectionQuestion: "How can I receive recognition without handing it my worth?",
      themes: ["victory", "recognition", "pride", "visibility"],
      archetype: "The Honored Flame",
      energy: "positive",
      upright: {
        summary: "Your fire is visible now, and the world reflects it back.",
        meaning:
          "Accept praise where it is earned. This card favors success, leadership, and the confidence that grows when effort is witnessed without becoming your only source of value.",
        reflection: "What victory can I let myself fully receive?",
        keywords: ["victory", "recognition", "pride", "success", "visibility", "honor"]
      },
      reversed: {
        summary: "Recognition may be delayed, private, or too powerful over your self-worth.",
        meaning:
          "Do not let silence erase your effort, and do not let applause own your center. Return to the inner standard that first made the work sacred.",
        reflection: "What remains true about my effort even when no one claps?",
        shadow: "Ego hunger, insecurity, public pressure, or chasing validation."
      },
      bloodMoon: {
        shortMeaning: "Applause becomes a mirror that asks to be worshiped.",
        summary:
          "Under the Blood Moon, the Six of Wands exposes vanity, worship, and dependence on being seen. Recognition becomes shadow when attention replaces worth.",
        shadowMessage: "A crown made of applause disappears when the room goes quiet.",
        veilHint: "Watch what happens to your selfhood after praise fades.",
        upright: {
          headline: "The Applause Throne",
          summary: "Victory shines, but the hunger to be admired grows beside it.",
          meaning:
            "You may be receiving attention, success, or social proof. Enjoy the recognition, but examine whether the gaze of others is becoming the place where your identity lives.",
          shadow: "Visibility becomes a drug.",
          mask: "I just want my work to matter.",
          wound: "A self-worth that never learned to exist offstage.",
          work: "Receive praise, then return to the private flame that does not need witnesses.",
          veilHint: "The laurel is not the soul.",
          reflection: "What part of me feels unreal without recognition?",
          thread: "Six wands rise; the crowd becomes a mirror with teeth."
        },
        reversed: {
          headline: "The Fallen Laurel",
          summary: "The absence of applause exposes the dependency beneath pride.",
          meaning:
            "A loss of recognition, comparison, or public insecurity may be burning through you. This is a chance to reclaim worth from the audience and rebuild honor from within.",
          shadow: "Shame rushes in where applause used to stand.",
          mask: "No one sees me, so none of this matters.",
          wound: "Old invisibility turning recognition into survival.",
          work: "Practice unseen excellence and let one trusted witness be enough.",
          veilHint: "The crown falls so the spine can remember itself.",
          reflection: "Who am I when success is not being reflected back?",
          thread: "The parade ends; the rider meets the quiet road."
        }
      }
    },
    seven: {
      keywords: ["defense", "courage", "values", "pressure", "conviction", "standing"],
      shortMeaning: "You are asked to stand for your values without letting pressure dim your fire.",
      summary:
        "The Seven of Wands is courage under challenge. It asks you to defend what matters, hold the high ground, and let resistance clarify rather than corrupt your conviction.",
      uprightMeaning: "Defending values, courage under pressure, and standing your ground.",
      shadowMeaning: "Paranoia, defensiveness, or mistaking every question for an attack.",
      reflectionQuestion: "What is truly worth defending, and what only feels threatened?",
      themes: ["defense", "courage", "values", "pressure"],
      archetype: "The Flame Defender",
      energy: "challenging",
      upright: {
        summary: "Your position is tested, and your fire learns its true shape.",
        meaning:
          "Hold your ground where the principle matters. Courage does not require aggression; it requires a clear yes, a clear no, and the discipline to know the difference.",
        reflection: "How can I protect my light without hardening around it?",
        keywords: ["defense", "courage", "values", "pressure", "conviction", "standing"]
      },
      reversed: {
        summary: "Defensiveness may be exhausting you or weakening the cause you mean to protect.",
        meaning:
          "You may need firmer boundaries, less reactivity, or the humility to stop fighting shadows. Not every challenge is a threat to your worth.",
        reflection: "Where am I reacting to an old attack, not this moment?",
        shadow: "Paranoia, overwhelm, surrendering values, or fighting everyone from fear."
      },
      bloodMoon: {
        shortMeaning: "Defense becomes paranoia when every voice sounds like an enemy.",
        summary:
          "Under the Blood Moon, the Seven of Wands exposes hyperdefensiveness, suspicion, and the lonely high ground of someone who cannot stop fighting. Courage becomes distortion when it has no trust.",
        shadowMessage: "If every question is an attack, truth has no way to enter.",
        veilHint: "Notice when protection becomes isolation.",
        upright: {
          headline: "The Besieged Flame",
          summary: "The stance is strong, but the nervous system may be at war.",
          meaning:
            "You may need to defend something real, yet the shadow can make every disagreement feel like a siege. Separate actual threat from pride, trauma, and exhaustion.",
          shadow: "Conviction sharpens into suspicion.",
          mask: "I am the only one brave enough to stand here.",
          wound: "A history of being challenged until safety felt impossible.",
          work: "Name the real boundary and lower the weapon where no attack exists.",
          veilHint: "The high ground can become a lonely altar.",
          reflection: "Am I protecting my values, or protecting my fear from being questioned?",
          thread: "Seven wands rise below; the defender sees enemies in sparks."
        },
        reversed: {
          headline: "The War Without Opponents",
          summary: "The fight continues after the threat has gone.",
          meaning:
            "Defensiveness may be draining your authority and pushing away allies. The work is to let the body learn that rest is not surrender.",
          shadow: "Paranoia keeps the fire armed.",
          mask: "I cannot let my guard down.",
          wound: "Old humiliation turning every question into a trial.",
          work: "Ask what is happening now, not what happened then.",
          veilHint: "A lowered wand can be strength.",
          reflection: "What support have I mistaken for opposition?",
          thread: "The battle ends; the flame still flinches."
        }
      }
    },
    eight: {
      keywords: ["momentum", "messages", "movement", "speed", "alignment", "signal"],
      shortMeaning: "Energy moves quickly now, carrying messages, momentum, and decisive motion.",
      summary:
        "The Eight of Wands is fire in flight. It brings swift communication, accelerated progress, and the strange grace of events aligning once resistance falls away.",
      uprightMeaning: "Momentum, messages, swift movement, and energy in motion.",
      shadowMeaning: "Impulsiveness, rushing, or acting before truth catches up.",
      reflectionQuestion: "What needs to move now, and what still needs one breath of truth?",
      themes: ["momentum", "movement", "messages", "speed"],
      archetype: "The Flying Fire",
      energy: "transformative",
      upright: {
        summary: "The path opens, and the fire travels faster than before.",
        meaning:
          "Expect movement, news, travel, or decisions that gather speed. Move with the current, but keep your aim clean so momentum carries purpose rather than panic.",
        reflection: "Where can I trust swift movement without becoming careless?",
        keywords: ["momentum", "messages", "movement", "speed", "alignment", "signal"]
      },
      reversed: {
        summary: "The message may be delayed, misdirected, or moving too fast to land well.",
        meaning:
          "Slow down enough to check timing, truth, and impact. Not every urgent impulse is a clear signal.",
        reflection: "What would change if I paused before sending the fire forward?",
        shadow: "Haste, miscommunication, scattered action, or fire moving beyond wisdom."
      },
      bloodMoon: {
        shortMeaning: "Speed becomes a spell when action outruns truth.",
        summary:
          "Under the Blood Moon, the Eight of Wands reveals impulsiveness, rushing, and fire out of control. Momentum can feel like fate while carrying you past the facts.",
        shadowMessage: "Urgency is not the same as guidance.",
        veilHint: "Watch the message you send to avoid sitting with the truth.",
        upright: {
          headline: "The Unbridled Signal",
          summary: "Everything moves fast, and speed begins to impersonate certainty.",
          meaning:
            "A message, desire, or opportunity may demand immediate action. Before you launch the wand, ask whether the fire is aligned or simply escaping the discomfort of waiting.",
          shadow: "The rush becomes authority.",
          mask: "I had to act now.",
          wound: "Fear that stillness will make the chance disappear.",
          work: "Take one breath between impulse and impact.",
          veilHint: "A true signal survives a pause.",
          reflection: "What truth is trying to catch up with my speed?",
          thread: "Eight wands fly; one hidden fact runs behind them."
        },
        reversed: {
          headline: "The Backfired Message",
          summary: "Haste reveals its cost through delay, confusion, or consequence.",
          meaning:
            "A rushed action may create friction, miscommunication, or regret. Use the slowdown as mercy; the fire is asking to be aimed again.",
          shadow: "Impulse scatters what intention could have carried.",
          mask: "There was no time to think.",
          wound: "A nervous system trained to treat delay as danger.",
          work: "Repair the message, clarify the aim, and refuse panic as a messenger.",
          veilHint: "The delayed wand may save the house from burning.",
          reflection: "Where did urgency make my choice for me?",
          thread: "The arrows fall; the silence asks what was true."
        }
      }
    },
    nine: {
      keywords: ["resilience", "endurance", "guardedness", "strength", "survival", "resolve"],
      shortMeaning: "You have survived the long path, and your guarded strength is nearing its lesson.",
      summary:
        "The Nine of Wands honors endurance after repeated trials. It asks you to protect what matters while remembering that survival is a passage, not a permanent posture.",
      uprightMeaning: "Resilience, endurance, guarded strength, and surviving the long path.",
      shadowMeaning: "Burnout, hypervigilance, or making exhaustion part of identity.",
      reflectionQuestion: "What strength have I earned, and what guard can I begin to lower?",
      themes: ["resilience", "endurance", "survival", "boundaries"],
      archetype: "The Last Guardian",
      energy: "challenging",
      upright: {
        summary: "You are tired, but the fire has not left you.",
        meaning:
          "Keep your boundary, gather your remaining strength, and do not mistake weariness for failure. The path is asking for wise endurance, not reckless depletion.",
        reflection: "How can I protect my flame without living as if everything is a threat?",
        keywords: ["resilience", "endurance", "guardedness", "strength", "survival", "resolve"]
      },
      reversed: {
        summary: "The guard may be too heavy, or the body may be asking for surrender before collapse.",
        meaning:
          "Rest is not betrayal of the struggle. You may need support, recovery, or a new boundary that does not require constant vigilance.",
        reflection: "What would rest look like if I trusted it as part of survival?",
        shadow: "Burnout, suspicion, collapse, stubbornness, or refusing to stop fighting."
      },
      bloodMoon: {
        shortMeaning: "Survival becomes a prison when exhaustion is mistaken for identity.",
        summary:
          "Under the Blood Moon, the Nine of Wands exposes burnout, hypervigilance, and the pride of never putting the weapon down. The wound has become a sentry.",
        shadowMessage: "Being tired is not proof that you are worthy.",
        veilHint: "Notice where vigilance keeps recreating the battlefield.",
        upright: {
          headline: "The Wounded Sentry",
          summary: "The guard still stands, but the cost is written through the body.",
          meaning:
            "You may be strong because you had to be, but the shadow begins when endurance becomes the only identity available. Let protection become intelligent instead of automatic.",
          shadow: "Hypervigilance calls itself discipline.",
          mask: "I am fine; I can keep going.",
          wound: "A long history of needing to be ready for impact.",
          work: "Let someone trustworthy stand watch with you.",
          veilHint: "The ninth wand is a boundary, not a coffin.",
          reflection: "Who would I be if I did not have to prove I can survive this?",
          thread: "Nine wands hold the line; the body asks for dawn."
        },
        reversed: {
          headline: "The Burnout Oath",
          summary: "The refusal to rest becomes the final wound.",
          meaning:
            "Exhaustion may be approaching a breaking point. The Blood Moon asks you to stop romanticizing depletion and let recovery become an act of power.",
          shadow: "Suffering becomes a credential.",
          mask: "No one else can handle it.",
          wound: "A fear that rest will make you vulnerable or useless.",
          work: "Cancel one unnecessary battle and choose a real form of restoration.",
          veilHint: "The flame does not need to be dying to be devoted.",
          reflection: "Where have I made exhaustion part of my name?",
          thread: "The sentry kneels; the war inside keeps marching."
        }
      }
    },
    ten: {
      keywords: ["burden", "responsibility", "completion", "effort", "duty", "release"],
      shortMeaning: "A heavy responsibility nears completion, but the fire needs help carrying what matters.",
      summary:
        "The Ten of Wands is the long carry before the threshold. It honors responsibility and devotion while asking whether the load still serves the light it was meant to protect.",
      uprightMeaning: "Responsibility, burden, carrying what matters, and nearing completion.",
      shadowMeaning: "Self-punishment, martyr work, or carrying too much to avoid asking for help.",
      reflectionQuestion: "Which burden is sacred, and which one only proves I am suffering?",
      themes: ["responsibility", "burden", "completion", "release"],
      archetype: "The Burden Bearer",
      energy: "challenging",
      upright: {
        summary: "The load is real, and so is the need to carry it differently.",
        meaning:
          "You may be close to completing a demanding cycle. Keep what is truly yours, delegate what can be shared, and do not confuse devotion with collapse.",
        reflection: "What support would let this responsibility stay honorable?",
        keywords: ["burden", "responsibility", "completion", "effort", "duty", "release"]
      },
      reversed: {
        summary: "The weight may be ready to fall because it was never meant to be carried alone.",
        meaning:
          "Release, renegotiate, or refuse what has become self-erasure. A burden that destroys the bearer cannot serve the sacred fire.",
        reflection: "What am I carrying because asking for help feels too exposing?",
        shadow: "Overload, martyrdom, resentment, burnout, or pride in suffering."
      },
      bloodMoon: {
        shortMeaning: "The burden becomes a crown when suffering is used to prove worth.",
        summary:
          "Under the Blood Moon, the Ten of Wands reveals martyr work, self-punishment, and pride in carrying too much. Responsibility distorts when it becomes a way to avoid receiving help.",
        shadowMessage: "A load can be meaningful and still be too much.",
        veilHint: "Notice the burden you resent but refuse to release.",
        upright: {
          headline: "The Martyr's Bundle",
          summary: "The carry is heavy, and pride has begun to bind it tighter.",
          meaning:
            "You may be doing too much, perhaps for worthy reasons. The shadow asks whether the burden is still service, or whether suffering has become proof of love, power, or indispensability.",
          shadow: "Duty becomes self-punishment.",
          mask: "I am the responsible one.",
          wound: "A belief that being needed is safer than being supported.",
          work: "Put down one wand publicly enough that help can reach you.",
          veilHint: "The final hill is not asking for your ruin.",
          reflection: "What do I gain by being the one who carries everything?",
          thread: "Ten wands bend the back; pride calls it devotion."
        },
        reversed: {
          headline: "The Collapse of Duty",
          summary: "The body refuses the role the will kept enforcing.",
          meaning:
            "Overload may be breaking through denial. Let the collapse become information rather than shame; the load must be divided, released, or renamed.",
          shadow: "Resentment leaks from the burden no one was allowed to share.",
          mask: "I can handle it.",
          wound: "Fear that asking for help will cost love or respect.",
          work: "Name the limit, ask clearly, and stop treating support as failure.",
          veilHint: "The dropped wand may be the first honest prayer.",
          reflection: "What responsibility has become a punishment?",
          thread: "The bundle falls; the flame survives the empty hands."
        }
      }
    },
    page: {
      keywords: ["curiosity", "adventure", "discovery", "spark", "play", "experiment"],
      shortMeaning: "A young fire wakes through curiosity, adventure, and creative discovery.",
      summary:
        "The Page of Wands is the first brave explorer of the inner flame. It brings curiosity, play, messages of inspiration, and the joy of learning what your fire can do.",
      uprightMeaning: "Curiosity, adventure, first spark, and creative discovery.",
      shadowMeaning: "Reckless craving, immature impulse, or needing excitement to avoid stillness.",
      reflectionQuestion: "What experiment would let my fire learn without needing perfection?",
      themes: ["curiosity", "adventure", "discovery", "creativity"],
      archetype: "The Fire Student",
      energy: "positive",
      upright: {
        summary: "The young flame wants to explore, not perform mastery.",
        meaning:
          "Follow the idea, invitation, or urge to try something new. This card favors play, creative risk, and the beginner's courage that keeps the soul awake.",
        reflection: "Where can I let myself be new and alive?",
        keywords: ["curiosity", "adventure", "discovery", "spark", "play", "experiment"]
      },
      reversed: {
        summary: "The spark may be restless, immature, or afraid to begin badly.",
        meaning:
          "Your fire needs guidance, not shame. Give excitement a container so it can become discovery instead of distraction.",
        reflection: "What structure would help this impulse become real?",
        shadow: "Impulsiveness, scattered enthusiasm, fear of failure, or excitement used to avoid stillness."
      },
      bloodMoon: {
        shortMeaning: "The young flame turns reckless when stillness feels unbearable.",
        summary:
          "Under the Blood Moon, the Page of Wands reveals immature impulse, craving, and the need for constant excitement. Adventure becomes shadow when it is used to escape the self.",
        shadowMessage: "A spark without listening can still burn the hand that carries it.",
        veilHint: "Watch the impulse that arrives the moment quiet gets too honest.",
        upright: {
          headline: "The Reckless Spark",
          summary: "Excitement wakes quickly, hungry for movement before meaning.",
          meaning:
            "A new impulse may be vivid and tempting, but it needs maturity before it becomes action. Ask whether this is discovery or a way to outrun boredom, grief, or accountability.",
          shadow: "The inner child lights matches to avoid the dark.",
          mask: "I am just being spontaneous.",
          wound: "Fear that stillness will reveal emptiness.",
          work: "Give the impulse one safe experiment before giving it the whole road.",
          veilHint: "Play is sacred when it does not burn the room.",
          reflection: "What quiet feeling am I trying not to meet?",
          thread: "The page grins at the flame; the shadow watches the curtain."
        },
        reversed: {
          headline: "The Restless Match",
          summary: "Excitement burns out because it never learned devotion.",
          meaning:
            "Scattered starts, risky choices, or attention-seeking moves may be draining your creative force. The medicine is not repression, but a wiser container for aliveness.",
          shadow: "Novelty becomes a shield against commitment.",
          mask: "I get bored easily.",
          wound: "A fear that ordinary effort will extinguish the self.",
          work: "Choose one spark and tend it for longer than the mood lasts.",
          veilHint: "The real adventure begins after the first thrill.",
          reflection: "Where do I abandon my fire before it can teach me?",
          thread: "The matchbox empties; the hearth waits untouched."
        }
      }
    },
    knight: {
      keywords: ["passion", "pursuit", "boldness", "movement", "courage", "desire"],
      shortMeaning: "Passion moves boldly, asking courage to act with aim and integrity.",
      summary:
        "The Knight of Wands is fire on horseback: swift, daring, magnetic, and alive. It asks you to pursue what calls you without burning through the path or the people beside it.",
      uprightMeaning: "Passion, pursuit, bold movement, and courage in action.",
      shadowMeaning: "Chaos, seduction, conquest, or burning through people and paths.",
      reflectionQuestion: "What would my passion do if it also respected consequence?",
      themes: ["passion", "pursuit", "movement", "courage"],
      archetype: "The Fire Rider",
      energy: "transformative",
      upright: {
        summary: "The fire wants motion, and courage is ready to answer.",
        meaning:
          "Take bold action where desire and purpose align. Move quickly if the aim is clean, but let integrity ride with you.",
        reflection: "Where can I move boldly without becoming careless?",
        keywords: ["passion", "pursuit", "boldness", "movement", "courage", "desire"]
      },
      reversed: {
        summary: "The ride may be wild, seductive, or too fast to honor what it touches.",
        meaning:
          "Slow the charge before passion becomes chaos. The lesson is to let desire mature into direction rather than conquest.",
        reflection: "What am I chasing, and what might I burn if I catch it?",
        shadow: "Recklessness, lust for speed, inconsistency, conquest, or passion without accountability."
      },
      bloodMoon: {
        shortMeaning: "The chase becomes a fire that consumes whatever cannot keep up.",
        summary:
          "Under the Blood Moon, the Knight of Wands reveals chaos, seduction, conquest, and lust for speed. Passion becomes shadow when it values impact over care.",
        shadowMessage: "Desire is not exempt from consequence.",
        veilHint: "Notice who is left singed after your passion passes through.",
        upright: {
          headline: "The Burning Rider",
          summary: "The charge is magnetic, but the fire may not know how to stay.",
          meaning:
            "A pursuit may feel thrilling and inevitable. Look closely at whether courage is leading, or whether conquest, impatience, and appetite are wearing courage's face.",
          shadow: "Movement becomes a way to avoid intimacy with consequence.",
          mask: "I follow my passion wherever it leads.",
          wound: "Fear that slowing down will expose doubt or emptiness.",
          work: "Aim the fire before you enter the room.",
          veilHint: "A trail of sparks is still a trail.",
          reflection: "Am I pursuing a calling, or feeding the need to conquer?",
          thread: "The rider laughs; the road smolders behind him."
        },
        reversed: {
          headline: "The Scorched Path",
          summary: "Reckless passion leaves consequences that speed cannot outrun.",
          meaning:
            "A pattern of seduction, impulsive exits, or dramatic pursuit may be catching up. Stop romanticizing chaos and repair where your fire has taken more than it gave.",
          shadow: "Desire burns through people, then calls the ashes freedom.",
          mask: "I cannot be tied down.",
          wound: "A terror of being known after the thrill is gone.",
          work: "Pause, repair, and choose one direction you can stay with.",
          veilHint: "The fastest horse cannot outrun accountability.",
          reflection: "What have I abandoned in the name of passion?",
          thread: "The chase ends; smoke names the cost."
        }
      }
    },
    queen: {
      keywords: ["confidence", "magnetism", "warmth", "creativity", "self-possession", "radiance"],
      shortMeaning: "Self-possessed fire radiates confidence, creativity, warmth, and magnetic power.",
      summary:
        "The Queen of Wands is the hearth and the spotlight held in one body. She teaches confidence without apology, creative radiance, and warmth that empowers rather than consumes.",
      uprightMeaning: "Confidence, magnetism, creative fire, warmth, and self-possession.",
      shadowMeaning: "Attention hunger, ego glamour, possessive charisma, or controlling the room through radiance.",
      reflectionQuestion: "How can I let my radiance empower rather than possess?",
      themes: ["confidence", "magnetism", "creativity", "warmth"],
      archetype: "The Radiant Sovereign",
      energy: "positive",
      upright: {
        summary: "Your fire does not need permission to be visible.",
        meaning:
          "Stand in your warmth, beauty, creativity, and command of self. This card favors leadership through presence, generous confidence, and the power to inspire without shrinking.",
        reflection: "Where am I ready to be seen as fully alive?",
        keywords: ["confidence", "magnetism", "warmth", "creativity", "self-possession", "radiance"]
      },
      reversed: {
        summary: "Radiance may be dimmed by insecurity or sharpened into control.",
        meaning:
          "Return to a confidence that does not need to dominate the room. Your fire is strongest when it belongs to you first.",
        reflection: "What part of my confidence still depends on being admired?",
        shadow: "Jealousy, attention hunger, insecurity, possessiveness, or charisma used to control."
      },
      bloodMoon: {
        shortMeaning: "Radiance becomes a leash when admiration is required.",
        summary:
          "Under the Blood Moon, the Queen of Wands reveals ego glamour, attention hunger, and possessive charisma. The shadow uses warmth to command the room while calling it generosity.",
        shadowMessage: "Magnetism is not consent to control the orbit of others.",
        veilHint: "Notice when being admired becomes more important than being true.",
        upright: {
          headline: "The Glamour Flame",
          summary: "Charisma fills the room, but it may be feeding a private hunger.",
          meaning:
            "Your presence may be powerful and persuasive. The shadow asks whether the radiance is shared freely or used to secure loyalty, attention, and emotional territory.",
          shadow: "The room is warmed, then quietly owned.",
          mask: "I just bring energy wherever I go.",
          wound: "A fear of becoming invisible unless desire gathers around you.",
          work: "Let your fire shine without monitoring who turns toward it.",
          veilHint: "The brightest flame still casts a shadow.",
          reflection: "Where do I confuse admiration with safety?",
          thread: "The queen smiles; every candle waits for her permission."
        },
        reversed: {
          headline: "The Possessive Sun",
          summary: "Insecurity turns radiance into jealousy, control, or performance.",
          meaning:
            "Attention may feel like survival, and any shift away from you may sting. This is a call to reclaim self-possession from the audience and stop using charm as a tether.",
          shadow: "Warmth punishes when it is not worshiped.",
          mask: "I am only asking for respect.",
          wound: "Old invisibility becoming hunger for constant proof.",
          work: "Practice being powerful without being central.",
          veilHint: "A sovereign fire does not chase every gaze.",
          reflection: "Who am I when I am not the one holding the room?",
          thread: "The glamour flickers; the need beneath it reaches."
        }
      }
    },
    king: {
      keywords: ["leadership", "vision", "mastery", "direction", "authority", "command"],
      shortMeaning: "Mastered fire becomes bold leadership, clear vision, and direction that inspires action.",
      summary:
        "The King of Wands is the sovereign flame: visionary, decisive, and capable of turning inspiration into a living path. He teaches command that serves the light rather than feeding the ego.",
      uprightMeaning: "Leadership, vision, mastery of fire, and bold direction.",
      shadowMeaning: "Domination, tyranny, or confusing command with wisdom.",
      reflectionQuestion: "What does my power serve when no one is applauding it?",
      themes: ["leadership", "vision", "mastery", "authority"],
      archetype: "The Fire King",
      energy: "balanced",
      upright: {
        summary: "The fire has matured into vision that others can gather around.",
        meaning:
          "Lead with courage, clarity, and creative authority. This card asks you to act decisively while remembering that true command protects the future it summons.",
        reflection: "How can my leadership make others more alive, not smaller?",
        keywords: ["leadership", "vision", "mastery", "direction", "authority", "command"]
      },
      reversed: {
        summary: "Authority may be overheating into control, impatience, or ego.",
        meaning:
          "Power needs humility to remain wise. Step back from domination, listen before directing, and let vision become service rather than identity.",
        reflection: "Where has my command stopped making room for truth?",
        shadow: "Tyranny, arrogance, impatience, control, or power used as identity."
      },
      bloodMoon: {
        shortMeaning: "Power becomes tyranny when command replaces wisdom.",
        summary:
          "Under the Blood Moon, the King of Wands exposes domination, power as identity, and the hunger to be obeyed. Mastery of fire darkens when leadership no longer listens.",
        shadowMessage: "A throne built from fear is not authority; it is a warning.",
        veilHint: "Watch who becomes smaller around your vision.",
        upright: {
          headline: "The Commanding Flame",
          summary: "Vision burns bright, but it may be asking others to orbit too tightly.",
          meaning:
            "You may hold real power, talent, or leadership. The shadow appears when confidence becomes entitlement and every room is treated as material for your will.",
          shadow: "Command mistakes obedience for respect.",
          mask: "I know where this needs to go.",
          wound: "Fear that listening will weaken authority.",
          work: "Invite dissent before deciding, and measure power by what it protects.",
          veilHint: "A wise flame leaves others with oxygen.",
          reflection: "Is my leadership creating life, or demanding submission?",
          thread: "The king raises the wand; the room forgets to breathe."
        },
        reversed: {
          headline: "The Tyrant's Ember",
          summary: "Power clings harder as its inner fire grows insecure.",
          meaning:
            "Control, intimidation, impatience, or ego may be steering the situation. The medicine is accountability: power must answer to truth before it can lead again.",
          shadow: "The self becomes indistinguishable from command.",
          mask: "Someone has to be in charge.",
          wound: "A deep fear of being powerless, ordinary, or ignored.",
          work: "Release the grip, repair the impact, and let authority be earned again.",
          veilHint: "The throne cools when the hand opens.",
          reflection: "What am I trying to control because I do not trust my own worth?",
          thread: "The ember remains; the crown begins to smoke."
        }
      }
    }
  };

  const pentaclesMeanings = {
    ace: {
      keywords: ["opportunity", "seed", "stability", "body", "resources", "beginning"],
      shortMeaning: "A new material seed offers stability, embodiment, and a practical blessing.",
      summary:
        "The Ace of Pentacles is spirit taking root in the physical world. It brings opportunity, a new resource, a body-level yes, or the first small seed of lasting stability.",
      uprightMeaning: "New material beginning, opportunity, and the seed of grounded stability.",
      shadowMeaning: "Attachment to potential, fear of loss, or worshiping the seed before it grows.",
      reflectionQuestion: "What small practical seed is asking for patient devotion?",
      themes: ["opportunity", "stability", "resources", "embodiment"],
      archetype: "The Sacred Seed",
      energy: "positive",
      upright: {
        summary: "A seed of real-world possibility is being placed in your hands.",
        meaning:
          "This card favors new work, money, health, home, craft, or practical support. Treat the opportunity as living matter: plant it, protect it, and let spirit become tangible through care.",
        reflection: "How can I honor this beginning without demanding instant harvest?",
        keywords: ["opportunity", "seed", "stability", "body", "resources", "beginning"]
      },
      reversed: {
        summary: "The seed may be delayed, neglected, or burdened with too much expectation.",
        meaning:
          "Potential needs conditions, not panic. Revisit your resources, timing, body, and willingness to begin small before deciding the opportunity has failed.",
        reflection: "What practical condition would help this seed survive?",
        shadow: "Missed opportunity, insecurity, material anxiety, or clinging to promise instead of tending growth."
      },
      bloodMoon: {
        shortMeaning: "The seed becomes an idol when security hunger kneels before potential.",
        summary:
          "Under the Blood Moon, the Ace of Pentacles reveals attachment to the first sign of safety. Opportunity becomes shadow when fear of losing it makes you worship the seed before it has roots.",
        shadowMessage: "Potential is not possession.",
        veilHint: "Notice where hope turns into a clenched hand.",
        upright: {
          headline: "The Golden Seed",
          summary: "A promising beginning glows with security, and hunger gathers around it.",
          meaning:
            "A new resource, offer, job, home, body change, or practical opening may feel like salvation. The shadow asks whether you are tending it or trying to make it guarantee your safety forever.",
          shadow: "The first sign of stability becomes an object of fear.",
          mask: "I cannot risk losing this chance.",
          wound: "A history of instability that makes every opportunity feel like the last one.",
          work: "Plant the seed through action, not possession; give it rhythm, soil, and time.",
          veilHint: "A blessing cannot grow in a fist.",
          reflection: "Am I nurturing this beginning, or demanding it save me?",
          thread: "The seed shines; the hungry hand closes."
        },
        reversed: {
          headline: "The Buried Coin",
          summary: "Fear of wasting potential keeps the beginning underground.",
          meaning:
            "You may be delaying, hoarding, or overprotecting an opportunity because failure feels unbearable. The medicine is to risk ordinary effort instead of keeping possibility perfect and unused.",
          shadow: "Safety becomes fantasy when nothing is allowed to grow.",
          mask: "I am waiting for the right conditions.",
          wound: "Fear that one wrong move will return you to scarcity.",
          work: "Choose one practical step that makes the potential real.",
          veilHint: "A buried coin cannot become a garden.",
          reflection: "What am I preserving so carefully that it cannot live?",
          thread: "The soil waits; the seed fears daylight."
        }
      }
    },
    two: {
      keywords: ["balance", "adaptation", "movement", "responsibility", "rhythm", "change"],
      shortMeaning: "Changing demands ask for balance, adaptation, and a steadier inner rhythm.",
      summary:
        "The Two of Pentacles is the dance of practical life: bills, bodies, work, care, timing, and change. It asks you to move with demands without letting constant motion replace choice.",
      uprightMeaning: "Balance, adaptation, and managing responsibilities with flexible rhythm.",
      shadowMeaning: "Juggling to avoid choosing, or instability hidden behind performance.",
      reflectionQuestion: "What rhythm would help me manage life without disappearing into motion?",
      themes: ["balance", "adaptation", "responsibility", "rhythm"],
      archetype: "The Earth Dancer",
      energy: "balanced",
      upright: {
        summary: "The ground is moving, but you can still find rhythm.",
        meaning:
          "Adjust with care. This card supports managing resources, changing schedules, and finding practical flow when life asks you to hold more than one need at once.",
        reflection: "Which responsibility needs rhythm, and which one needs a decision?",
        keywords: ["balance", "adaptation", "movement", "responsibility", "rhythm", "change"]
      },
      reversed: {
        summary: "The juggling act may be costing more energy than the truth would.",
        meaning:
          "Something may need to be simplified, chosen, postponed, or released. Flexibility is useful until it becomes a way to avoid naming what cannot be sustained.",
        reflection: "What choice am I postponing by staying busy?",
        shadow: "Overload, avoidance, disorganization, instability, or chaos disguised as flexibility."
      },
      bloodMoon: {
        shortMeaning: "Chaos can perform flexibility while the real choice waits in the dark.",
        summary:
          "Under the Blood Moon, the Two of Pentacles exposes instability hidden behind competence. The hands keep moving so no one notices the ground is shaking.",
        shadowMessage: "Juggling everything may be how you avoid choosing anything.",
        veilHint: "Listen for the demand that keeps returning beneath the motion.",
        upright: {
          headline: "The Endless Juggle",
          summary: "The performance of balance hides a life stretched too thin.",
          meaning:
            "You may be praised for handling everything, but the shadow asks what this motion protects you from deciding. Adaptation becomes costly when it keeps you loyal to instability.",
          shadow: "Chaos wears the mask of capability.",
          mask: "I can keep all of this moving.",
          wound: "Fear that choosing one thing means losing the rest.",
          work: "Stop one spinning coin long enough to name the real priority.",
          veilHint: "The body knows which coin is too heavy.",
          reflection: "What would fall if I stopped performing balance?",
          thread: "Two coins turn; the floor tilts underneath."
        },
        reversed: {
          headline: "The Dropped Coin",
          summary: "The act breaks, revealing the instability it concealed.",
          meaning:
            "A missed payment, delay, body signal, or emotional rupture may show that the old rhythm cannot continue. Let the disruption force simplification instead of shame.",
          shadow: "Avoided choices return as practical consequences.",
          mask: "Everything was fine until this happened.",
          wound: "A belief that rest or refusal will make the whole life collapse.",
          work: "Choose what can be carried honestly and release the rest with intention.",
          veilHint: "What falls may be what was never yours to keep in the air.",
          reflection: "Where has motion replaced stability?",
          thread: "One coin falls; the hidden truth lands with it."
        }
      }
    },
    three: {
      keywords: ["collaboration", "craft", "skill", "contribution", "learning", "teamwork"],
      shortMeaning: "Shared work builds skill, belonging, and a stronger foundation through contribution.",
      summary:
        "The Three of Pentacles is the workshop where spirit learns through craft and cooperation. It honors skill-building, feedback, shared effort, and the dignity of useful contribution.",
      uprightMeaning: "Collaboration, craft, shared work, and learning through contribution.",
      shadowMeaning: "Perfectionism, resentment in teamwork, or working to be approved.",
      reflectionQuestion: "Where can I contribute without making usefulness my whole worth?",
      themes: ["collaboration", "craft", "skill", "teamwork"],
      archetype: "The Sacred Apprentice",
      energy: "positive",
      upright: {
        summary: "Your craft grows in the presence of others who can witness and shape it.",
        meaning:
          "Build with people who respect the work. This card favors apprenticeship, collaboration, feedback, and the practical humility of improving something one careful piece at a time.",
        reflection: "What skill is strengthened when I let others into the process?",
        keywords: ["collaboration", "craft", "skill", "contribution", "learning", "teamwork"]
      },
      reversed: {
        summary: "The work may suffer from poor alignment, hidden resentment, or fear of critique.",
        meaning:
          "Clarify roles, expectations, and standards. Collaboration cannot thrive when approval is the secret wage or perfection is the only acceptable offering.",
        reflection: "What do I need to say plainly about my part in the work?",
        shadow: "Validation-seeking, perfectionism, resentment, poor teamwork, or usefulness as self-worth."
      },
      bloodMoon: {
        shortMeaning: "Usefulness becomes a hunger when approval is the hidden wage.",
        summary:
          "Under the Blood Moon, the Three of Pentacles reveals perfectionism, resentment, and the need to be valued through contribution. The workshop becomes a confessional for worth.",
        shadowMessage: "Being useful is not the same as being loved.",
        veilHint: "Notice what you give while secretly waiting to be chosen.",
        upright: {
          headline: "The Approval Workshop",
          summary: "The craft is real, but validation may be steering the hands.",
          meaning:
            "You may be doing good work with others, yet the hidden motive could be approval, indispensability, or fear of being replaceable. Let contribution be honest instead of a bargain.",
          shadow: "Skill becomes a plea for worth.",
          mask: "I just want to do excellent work.",
          wound: "A belief that value must be earned through usefulness.",
          work: "Ask for clear feedback and stop making silence mean rejection.",
          veilHint: "A cathedral built for approval still echoes.",
          reflection: "Where am I working to be wanted?",
          thread: "Three hands build; one heart waits to be praised."
        },
        reversed: {
          headline: "The Resentful Craft",
          summary: "Unspoken needs sour the shared work.",
          meaning:
            "Teamwork may be strained by perfectionism, comparison, or resentment over unseen labor. The shadow wants recognition but may punish others instead of asking directly.",
          shadow: "The helpful one keeps a hidden ledger.",
          mask: "I am the only one doing this right.",
          wound: "Old invisibility turning every task into a test of loyalty.",
          work: "Name the expectation, renegotiate the labor, and let good enough be human.",
          veilHint: "The cracked stone shows where the pressure lived.",
          reflection: "What approval am I angry I have not received?",
          thread: "The tools gleam; the unsaid demand rusts beneath them."
        }
      }
    },
    four: {
      keywords: ["boundaries", "saving", "protection", "resources", "caution", "security"],
      shortMeaning: "Resources need protection, but safety must not become a locked room.",
      summary:
        "The Four of Pentacles preserves what has been earned. It teaches caution, boundaries, saving, and the wisdom of stewardship while asking whether protection still allows life to move.",
      uprightMeaning: "Boundaries, saving, protection, and preserving resources with care.",
      shadowMeaning: "Possessiveness, scarcity mindset, control, or safety becoming a cage.",
      reflectionQuestion: "What am I protecting, and what has protection begun to imprison?",
      themes: ["boundaries", "security", "resources", "control"],
      archetype: "The Locked Chest",
      energy: "neutral",
      upright: {
        summary: "Hold what matters with care, not fear.",
        meaning:
          "This card supports saving money, setting limits, guarding energy, and protecting stability. The practice is to keep resources safe without closing the heart or freezing the body.",
        reflection: "What boundary would protect my stability without shrinking my life?",
        keywords: ["boundaries", "saving", "protection", "resources", "caution", "security"]
      },
      reversed: {
        summary: "The grip may loosen, or the cost of holding too tightly may become clear.",
        meaning:
          "Release what has become hoarded, stagnant, or fear-bound. Security grows healthier when resources can circulate with intention.",
        reflection: "Where would wise release create more life than control?",
        shadow: "Hoarding, fear of loss, rigidity, possessiveness, or blocked generosity."
      },
      bloodMoon: {
        shortMeaning: "Safety becomes a cage when fear is allowed to hold the key.",
        summary:
          "Under the Blood Moon, the Four of Pentacles reveals scarcity, possessiveness, and control disguised as protection. The locked chest may be guarding a wound more than a treasure.",
        shadowMessage: "What you clutch can begin to own you.",
        veilHint: "Look for the fear underneath the word mine.",
        upright: {
          headline: "The Locked Chest",
          summary: "Resources are protected, but the soul may be locked in with them.",
          meaning:
            "You may be preserving money, time, status, space, or emotional safety. The shadow begins when caution becomes control and every opening feels like a threat.",
          shadow: "Scarcity crowns itself as wisdom.",
          mask: "I am just being careful.",
          wound: "A memory of loss that made openness feel dangerous.",
          work: "Choose one controlled place where life can circulate again.",
          veilHint: "A locked chest cannot tell the difference between treasure and fear.",
          reflection: "What am I afraid will happen if I loosen my grip?",
          thread: "Four coins guard the body; the breath grows small."
        },
        reversed: {
          headline: "The Cage of Safety",
          summary: "The need to protect has hardened into isolation.",
          meaning:
            "Control may be breaking down, or you may be realizing that security has cost you movement, intimacy, or peace. Let the release be deliberate rather than explosive.",
          shadow: "The protected life becomes unlived.",
          mask: "This is the only way to stay safe.",
          wound: "Fear that generosity, trust, or risk will invite ruin.",
          work: "Release one hoarded resource with clear boundaries and conscious choice.",
          veilHint: "The door opens from the inside.",
          reflection: "Where has stability become a substitute for aliveness?",
          thread: "The chest opens; the old fear blinks in the light."
        }
      }
    },
    five: {
      keywords: ["hardship", "exclusion", "strain", "support", "poverty", "winter"],
      shortMeaning: "Hardship asks you to seek support instead of making exile your home.",
      summary:
        "The Five of Pentacles brings material or emotional winter: scarcity, illness, rejection, or strain. It does not deny hardship; it asks you to notice the door, the hand, and the help you may be too hurt to seek.",
      uprightMeaning: "Hardship, exclusion, financial or emotional strain, and asking for support.",
      shadowMeaning: "Isolation as identity, refusing help, or believing abandonment is permanent.",
      reflectionQuestion: "Where is support available, even if my wound says I am alone?",
      themes: ["hardship", "support", "scarcity", "exclusion"],
      archetype: "The Winter Pilgrim",
      energy: "challenging",
      upright: {
        summary: "The cold is real, but it is not the whole landscape.",
        meaning:
          "Reach toward practical help, community, care, or repair. This card asks for humility and courage: the willingness to admit need before isolation becomes fate.",
        reflection: "What support am I allowed to ask for now?",
        keywords: ["hardship", "exclusion", "strain", "support", "poverty", "winter"]
      },
      reversed: {
        summary: "The door may be opening, or the pattern of exile may be ready to soften.",
        meaning:
          "Recovery begins when you stop treating need as shame. Accept help, rebuild slowly, and let belonging return through concrete acts of care.",
        reflection: "What belief about being alone am I ready to question?",
        shadow: "Poverty wound, shame, chronic isolation, refusal of support, or loyalty to abandonment."
      },
      bloodMoon: {
        shortMeaning: "The wound of lack can become an identity that refuses the open door.",
        summary:
          "Under the Blood Moon, the Five of Pentacles reveals poverty wounds, exile, and the belief that abandonment is permanent. Scarcity becomes shadow when it starts defending itself from help.",
        shadowMessage: "Being left once does not mean you must live outside forever.",
        veilHint: "Notice the help you reject because it threatens the story of abandonment.",
        upright: {
          headline: "The Exile's Door",
          summary: "Need stands in the cold while help glows nearby.",
          meaning:
            "You may be facing real strain, but the deeper shadow is the belief that no one will come, no door will open, and no request will be honored. Ask anyway.",
          shadow: "Isolation becomes proof, then prophecy.",
          mask: "I have always had to survive alone.",
          wound: "Old abandonment fused with money, body, home, or belonging.",
          work: "Make one specific request for practical support.",
          veilHint: "The lit window is not mocking you; it is calling.",
          reflection: "What help would I accept if shame were not speaking?",
          thread: "Five coins shine above the door; the exile looks at the snow."
        },
        reversed: {
          headline: "The Poverty Vow",
          summary: "Scarcity clings to the self even when rescue appears.",
          meaning:
            "Recovery may be available, yet part of you may distrust it, refuse it, or feel guilty receiving it. The Blood Moon asks whether lack has become more familiar than relief.",
          shadow: "The wound rejects the medicine to preserve the old story.",
          mask: "Help never lasts, so why reach?",
          wound: "A body trained to expect loss after every kindness.",
          work: "Accept support without immediately repaying, minimizing, or disappearing.",
          veilHint: "The vow of exile can be broken quietly.",
          reflection: "Who would I be if abandonment were not my identity?",
          thread: "The door opens; the old winter asks to stay."
        }
      }
    },
    six: {
      keywords: ["generosity", "exchange", "support", "fairness", "receiving", "balance"],
      shortMeaning: "Giving and receiving seek a fair exchange that honors dignity on both sides.",
      summary:
        "The Six of Pentacles is the economy of care. It asks how resources, attention, labor, and help move between people, and whether generosity preserves dignity or quietly creates debt.",
      uprightMeaning: "Generosity, fair exchange, support, and balanced giving and receiving.",
      shadowMeaning: "Power imbalance, transactional kindness, control through giving, or guilt around receiving.",
      reflectionQuestion: "Where can I let support move without turning it into debt?",
      themes: ["generosity", "exchange", "fairness", "support"],
      archetype: "The Open Hand",
      energy: "balanced",
      upright: {
        summary: "Resources become sacred when they circulate with respect.",
        meaning:
          "Give where you can, receive where you need, and keep dignity at the center. This card favors mutual aid, fair payment, generosity, and practical repair.",
        reflection: "What does fair exchange look like in this situation?",
        keywords: ["generosity", "exchange", "support", "fairness", "receiving", "balance"]
      },
      reversed: {
        summary: "The exchange may be uneven, conditional, or tangled with shame.",
        meaning:
          "Examine who holds power, who feels indebted, and who is afraid to receive. Support is not clean when it becomes leverage.",
        reflection: "Where is giving or receiving carrying an unspoken price?",
        shadow: "Debt, guilt, imbalance, conditional help, or generosity used as control."
      },
      bloodMoon: {
        shortMeaning: "Kindness becomes control when every gift keeps a hidden ledger.",
        summary:
          "Under the Blood Moon, the Six of Pentacles reveals transactional care, power imbalance, and guilt around receiving. The open hand may also be the hand that holds the chain.",
        shadowMessage: "A gift with a hook is not generosity.",
        veilHint: "Look for the debt that was never spoken aloud.",
        upright: {
          headline: "The Gilded Hand",
          summary: "Support is offered, but power gathers in the exchange.",
          meaning:
            "Help may be real, but the shadow asks whether it comes with control, performance, or an expectation of loyalty. True generosity does not need the receiver to kneel.",
          shadow: "Giving becomes a throne.",
          mask: "I am only trying to help.",
          wound: "Fear of being powerless unless someone needs you.",
          work: "Make the terms explicit, or give without claiming authority over the receiver.",
          veilHint: "The scale remembers what the mouth denies.",
          reflection: "Where do I use support to secure my place?",
          thread: "Six coins fall; one hand measures obedience."
        },
        reversed: {
          headline: "The Debt of Kindness",
          summary: "Receiving feels dangerous because help has carried hooks before.",
          meaning:
            "You may be trapped in guilt, obligation, or mistrust around support. The work is to separate clean care from control and refuse exchanges that purchase your freedom.",
          shadow: "Need becomes a contract written in shame.",
          mask: "I owe them because they helped me.",
          wound: "A history of care that demanded repayment in silence or compliance.",
          work: "Receive cleanly, repay honestly where needed, and reject manipulative debt.",
          veilHint: "The coin is not the chain unless you accept the terms.",
          reflection: "What kind of help lets me keep my dignity?",
          thread: "The scale tips; the hidden price slides into view."
        }
      }
    },
    seven: {
      keywords: ["patience", "investment", "waiting", "harvest", "growth", "tending"],
      shortMeaning: "Long-term growth asks for patience, tending, and trust in the unseen harvest.",
      summary:
        "The Seven of Pentacles is the pause beside the growing field. It asks you to assess what you have invested, keep tending what is alive, and let time be part of the work.",
      uprightMeaning: "Patience, investment, waiting, and tending long-term growth.",
      shadowMeaning: "Impatience, obsession with results, or measuring worth only by outcome.",
      reflectionQuestion: "What deserves more tending before I judge the harvest?",
      themes: ["patience", "investment", "growth", "harvest"],
      archetype: "The Patient Gardener",
      energy: "neutral",
      upright: {
        summary: "The field is not empty just because it is not finished.",
        meaning:
          "Review your effort with honesty, then keep tending what still has life. This card supports long-term work, patient investment, and the discipline of not uprooting growth too soon.",
        reflection: "How can I honor effort before the results are visible?",
        keywords: ["patience", "investment", "waiting", "harvest", "growth", "tending"]
      },
      reversed: {
        summary: "The wait may be revealing impatience, poor investment, or fear of wasted effort.",
        meaning:
          "Adjust the plan if the field is truly barren, but do not let anxiety decide too early. Worth is not proven only at harvest.",
        reflection: "What outcome am I using to measure my worth?",
        shadow: "Impatience, discouragement, sunk-cost fear, obsession with results, or wasted effort."
      },
      bloodMoon: {
        shortMeaning: "The harvest becomes a verdict when worth depends on results.",
        summary:
          "Under the Blood Moon, the Seven of Pentacles reveals impatience, outcome obsession, and the fear that effort was wasted. The field becomes a courtroom.",
        shadowMessage: "A slow harvest is not a sentence against your worth.",
        veilHint: "Notice when assessment turns into self-punishment.",
        upright: {
          headline: "The Judging Field",
          summary: "The growing thing is watched so intensely it cannot simply grow.",
          meaning:
            "You may be measuring progress, money, body change, skill, or work through fear. The shadow turns every delay into evidence that you failed.",
          shadow: "Patience curdles into surveillance.",
          mask: "I just need to know if this is worth it.",
          wound: "A belief that effort only matters when it produces visible reward.",
          work: "Measure the process, not only the harvest; tend one living sign.",
          veilHint: "Roots do not report their progress.",
          reflection: "Where am I demanding proof before trust can breathe?",
          thread: "Seven coins ripen slowly; the watcher sharpens the verdict."
        },
        reversed: {
          headline: "The Wasted Season",
          summary: "Fear of lost effort tempts you to tear up the field.",
          meaning:
            "Disappointment may be real, but panic can turn a delay into destruction. Decide carefully whether to continue, revise, or leave; do not let shame make the choice.",
          shadow: "Outcome becomes identity, and delay becomes humiliation.",
          mask: "I cannot have wasted all this time.",
          wound: "Fear that patience will make you foolish.",
          work: "Name what has been learned, then choose the next investment consciously.",
          veilHint: "Even a failed crop can return nutrients to the soil.",
          reflection: "What did this season teach that success could not?",
          thread: "The field lies quiet; the old fear calls it ruin."
        }
      }
    },
    eight: {
      keywords: ["discipline", "practice", "mastery", "craft", "devotion", "improvement"],
      shortMeaning: "Devoted practice turns ordinary effort into mastery and embodied skill.",
      summary:
        "The Eight of Pentacles is the sacred repetition of craft. It honors discipline, apprenticeship, improvement, and the quiet dignity of doing the work with your whole attention.",
      uprightMeaning: "Discipline, practice, mastery, craft, and devotion to improvement.",
      shadowMeaning: "Workaholism, perfectionism, self-punishment, or productivity as a mask for pain.",
      reflectionQuestion: "What am I practicing, and what is that practice making of me?",
      themes: ["discipline", "practice", "mastery", "craft"],
      archetype: "The Devoted Maker",
      energy: "positive",
      upright: {
        summary: "Mastery is being built through repetition, attention, and care.",
        meaning:
          "Keep refining the craft. This card supports study, training, work, and practical devotion that shapes both the product and the person making it.",
        reflection: "Where would patient practice restore my confidence?",
        keywords: ["discipline", "practice", "mastery", "craft", "devotion", "improvement"]
      },
      reversed: {
        summary: "The work may be losing soul through perfectionism, boredom, or exhaustion.",
        meaning:
          "Return to purpose before discipline becomes punishment. Skill grows best when the maker is allowed to remain human.",
        reflection: "Where has improvement become a way to criticize myself?",
        shadow: "Workaholism, burnout, careless effort, perfectionism, or productivity hiding pain."
      },
      bloodMoon: {
        shortMeaning: "Productivity becomes punishment when pain is sent to work in your place.",
        summary:
          "Under the Blood Moon, the Eight of Pentacles reveals workaholism, perfectionism, and discipline turned against the self. The bench becomes an altar where rest is sacrificed.",
        shadowMessage: "Mastery should not require your disappearance.",
        veilHint: "Watch the task you reach for when you cannot bear to feel.",
        upright: {
          headline: "The Punishing Craft",
          summary: "Devotion looks noble while exhaustion collects beneath it.",
          meaning:
            "You may be building real skill, but the shadow asks whether work is also hiding grief, shame, fear, or a need to earn worth through constant output.",
          shadow: "The craft becomes a whip.",
          mask: "I am just dedicated.",
          wound: "A belief that rest must be earned through flawless performance.",
          work: "Set one humane limit and let the work continue without self-cruelty.",
          veilHint: "The finest tool still breaks under endless force.",
          reflection: "What feeling appears when I stop producing?",
          thread: "Eight coins shine; the maker's hands tremble."
        },
        reversed: {
          headline: "The Broken Bench",
          summary: "Perfectionism or burnout interrupts the work that once gave meaning.",
          meaning:
            "A loss of focus, mistakes, or exhaustion may reveal that discipline has become self-punishment. This is a call to repair your relationship with effort.",
          shadow: "Failure feels like proof of unworthiness.",
          mask: "I should be better than this by now.",
          wound: "Old criticism internalized as a work ethic.",
          work: "Lower the standard to a living standard, then practice again gently.",
          veilHint: "A cracked coin can still teach the hand.",
          reflection: "Where did I learn that improvement must hurt?",
          thread: "The pattern breaks; the body asks to be included."
        }
      }
    },
    nine: {
      keywords: ["independence", "self-worth", "luxury", "peace", "confidence", "attainment"],
      shortMeaning: "Earned peace and embodied self-worth invite you to enjoy what you have cultivated.",
      summary:
        "The Nine of Pentacles is the garden of earned independence. It speaks of self-worth, beauty, comfort, financial or emotional steadiness, and the pleasure of living well in your own body.",
      uprightMeaning: "Independence, self-worth, luxury, earned peace, and embodied confidence.",
      shadowMeaning: "Isolation inside success, comfort hiding loneliness, or self-sufficiency as armor.",
      reflectionQuestion: "Can I enjoy what I have built without using independence as a wall?",
      themes: ["independence", "self-worth", "luxury", "confidence"],
      archetype: "The Gardened Self",
      energy: "positive",
      upright: {
        summary: "The garden reflects the care you have learned to give yourself.",
        meaning:
          "Receive comfort without apology. This card honors financial steadiness, sensual pleasure, self-respect, and the confidence that comes from tending your own life.",
        reflection: "What pleasure have I earned the right to receive?",
        keywords: ["independence", "self-worth", "luxury", "peace", "confidence", "attainment"]
      },
      reversed: {
        summary: "The garden may be beautiful, but it may also be lonely or too carefully guarded.",
        meaning:
          "Self-sufficiency is powerful until it becomes isolation. Let comfort support intimacy, not replace it.",
        reflection: "Where has independence protected me from being known?",
        shadow: "Loneliness, overdependence, financial insecurity, guarded luxury, or worth tied to status."
      },
      bloodMoon: {
        shortMeaning: "Luxury becomes lonely when self-sufficiency hardens into armor.",
        summary:
          "Under the Blood Moon, the Nine of Pentacles reveals isolation inside success. Comfort, beauty, and control may hide the ache of being unseen behind the garden wall.",
        shadowMessage: "A beautiful life can still be a locked room.",
        veilHint: "Notice where comfort replaces contact.",
        upright: {
          headline: "The Gilded Garden",
          summary: "The life looks abundant, but the gate may not open.",
          meaning:
            "You may have earned peace, money, skill, or independence. The shadow asks whether you can let anyone close without feeling that your freedom or dignity is at risk.",
          shadow: "Self-sufficiency becomes a polished wall.",
          mask: "I do not need anyone.",
          wound: "A fear that needing others will make you powerless.",
          work: "Let one trusted person see beyond the beautiful surface.",
          veilHint: "The garden is alive because it receives.",
          reflection: "Where has success made it harder to admit longing?",
          thread: "Nine coins bloom; the gate stays locked."
        },
        reversed: {
          headline: "The Lonely Silk",
          summary: "Comfort fails to quiet the need for real connection.",
          meaning:
            "Material ease, beauty, or independence may be covering loneliness, insecurity, or fear of dependence. Let the ache guide you toward honest contact, not more decoration.",
          shadow: "The self performs having enough while starving for witness.",
          mask: "This should be enough for me.",
          wound: "Old dependence wounds turning autonomy into a fortress.",
          work: "Ask for companionship without surrendering self-respect.",
          veilHint: "Silk cannot answer back.",
          reflection: "What comfort am I using to avoid vulnerability?",
          thread: "The room is rich; the chair beside you remains empty."
        }
      }
    },
    ten: {
      keywords: ["legacy", "family", "ancestry", "wealth", "belonging", "roots"],
      shortMeaning: "Long-term stability, ancestry, and shared resources ask what legacy you are building.",
      summary:
        "The Ten of Pentacles is the ancestral house: roots, wealth, family, inheritance, and belonging that outlives a single season. It asks how material life can serve memory, care, and those who come after.",
      uprightMeaning: "Legacy, family, ancestry, wealth, long-term belonging, and rooted stability.",
      shadowMeaning: "Inherited burden, family pressure, status obsession, or perfect legacy hiding old wounds.",
      reflectionQuestion: "What legacy am I receiving, and what legacy am I choosing to change?",
      themes: ["legacy", "family", "ancestry", "stability"],
      archetype: "The Ancestral House",
      energy: "balanced",
      upright: {
        summary: "The roots of material life reach backward and forward at once.",
        meaning:
          "This card supports family systems, shared wealth, inheritance, long-term planning, and the grounded belonging of a life built to last. Honor what nourishes; revise what only repeats.",
        reflection: "What kind of stability would bless more than just me?",
        keywords: ["legacy", "family", "ancestry", "wealth", "belonging", "roots"]
      },
      reversed: {
        summary: "The ancestral house may reveal pressure, exclusion, or a legacy ready to be healed.",
        meaning:
          "Question inherited definitions of success, duty, and belonging. You are allowed to build roots that do not copy the old wound.",
        reflection: "What family or status script am I ready to stop obeying?",
        shadow: "Family burden, status pressure, inherited scarcity, unstable legacy, or belonging with conditions."
      },
      bloodMoon: {
        shortMeaning: "Legacy becomes a chain when the house demands your obedience.",
        summary:
          "Under the Blood Moon, the Ten of Pentacles reveals family pressure, inherited burden, and status obsession. The perfect legacy may be built over rooms no one is allowed to enter.",
        shadowMessage: "An inheritance can be a wound wearing gold.",
        veilHint: "Listen for the ancestor whose silence still runs the house.",
        upright: {
          headline: "The Ancestral Vault",
          summary: "The legacy is powerful, but its walls may be heavy.",
          meaning:
            "Family, status, money, property, or tradition may carry real value and real pressure. The shadow asks what you must hide, inherit, or perform to keep your place at the table.",
          shadow: "Belonging becomes obedience to the old wound.",
          mask: "This is how our family succeeds.",
          wound: "Inherited fear that security requires conformity.",
          work: "Keep the blessing, name the burden, and refuse the script that harms the living.",
          veilHint: "The family crest may cover a bruise.",
          reflection: "What legacy am I afraid to disappoint?",
          thread: "Ten coins line the hall; the old house listens."
        },
        reversed: {
          headline: "The Cracked Inheritance",
          summary: "The legacy shows its fracture, and the pressure can no longer stay hidden.",
          meaning:
            "A family pattern, financial expectation, or status story may be breaking open. This is not only loss; it is a chance to build belonging without repeating the wound.",
          shadow: "The image of stability demands the sacrifice of truth.",
          mask: "We do not bring shame to the family.",
          wound: "Conditional belonging tied to achievement, wealth, obedience, or silence.",
          work: "Separate your worth from the family ledger and choose one pattern to end.",
          veilHint: "A cracked foundation can finally be inspected.",
          reflection: "What inherited burden ends with me?",
          thread: "The vault opens; old dust names the debt."
        }
      }
    },
    page: {
      keywords: ["study", "curiosity", "skill", "beginning", "ambition", "practice"],
      shortMeaning: "A humble practical beginning invites study, curiosity, and steady skill-building.",
      summary:
        "The Page of Pentacles is the student of earth, holding a new skill or path with reverence. It brings study, practical curiosity, humble ambition, and the willingness to begin before mastery arrives.",
      uprightMeaning: "Study, curiosity, new skill, practical beginning, and humble ambition.",
      shadowMeaning: "Fear of inexperience, overplanning, or proving worth through preparation.",
      reflectionQuestion: "What can I learn by beginning before I feel fully ready?",
      themes: ["study", "skill", "beginning", "ambition"],
      archetype: "The Earth Student",
      energy: "positive",
      upright: {
        summary: "A new skill or path is ready to be studied with both hands.",
        meaning:
          "Begin practically. This card favors learning, training, budgeting, body care, new work, and the sacred humility of being a beginner in the material world.",
        reflection: "What small practice would make this dream touch the ground?",
        keywords: ["study", "curiosity", "skill", "beginning", "ambition", "practice"]
      },
      reversed: {
        summary: "The student may be stalled by insecurity, distraction, or too much planning.",
        meaning:
          "Preparation has value, but it cannot replace experience. Let the first imperfect lesson teach what the perfect plan cannot.",
        reflection: "Where am I planning because I am afraid to be seen learning?",
        shadow: "Insecurity, procrastination, overplanning, lack of follow-through, or worth tied to achievement."
      },
      bloodMoon: {
        shortMeaning: "The beginner hides behind the plan to avoid the risk of being seen.",
        summary:
          "Under the Blood Moon, the Page of Pentacles reveals fear of inexperience and attachment to proving worth. The student keeps polishing the map because the first step feels too exposing.",
        shadowMessage: "You cannot become worthy enough to skip being new.",
        veilHint: "Notice where preparation protects you from practice.",
        upright: {
          headline: "The Perfect Plan",
          summary: "The beginning is studied so carefully it may never be lived.",
          meaning:
            "A new skill, job, body practice, or material path is calling, but insecurity may be wearing the mask of responsibility. Let study serve action, not replace it.",
          shadow: "Ambition freezes under the demand to prove worth first.",
          mask: "I am not ready yet.",
          wound: "Fear that being a beginner will expose inadequacy.",
          work: "Take one small public or measurable step before you feel polished.",
          veilHint: "The coin teaches only when it leaves the pedestal.",
          reflection: "What mistake am I trying to avoid so completely that I cannot learn?",
          thread: "The page studies the coin; the road waits."
        },
        reversed: {
          headline: "The Insecure Student",
          summary: "Fear of failure turns learning into delay or self-judgment.",
          meaning:
            "You may be procrastinating, comparing, or abandoning the path because early effort feels too awkward. The medicine is modest repetition, not dramatic proof.",
          shadow: "The need to be impressive blocks the ability to grow.",
          mask: "I work better when everything is figured out.",
          wound: "Old criticism making every lesson feel like a verdict.",
          work: "Practice badly enough to continue, then continue.",
          veilHint: "The first coin is not a final grade.",
          reflection: "Where can I let humility be stronger than shame?",
          thread: "The lesson opens; the wound reaches for the eraser."
        }
      }
    },
    knight: {
      keywords: ["dedication", "patience", "reliability", "progress", "loyalty", "routine"],
      shortMeaning: "Steady dedication moves the path forward through patience, reliability, and care.",
      summary:
        "The Knight of Pentacles is the faithful traveler of the long road. It honors routine, loyalty, patient work, and the kind of progress that becomes trustworthy because it does not need to rush.",
      uprightMeaning: "Dedication, patience, reliability, steady progress, and loyalty to the path.",
      shadowMeaning: "Stagnation, stubbornness, fear of change, or devotion becoming a rut.",
      reflectionQuestion: "Where does my path need steady devotion, and where does it need movement?",
      themes: ["dedication", "patience", "reliability", "progress"],
      archetype: "The Steady Traveler",
      energy: "balanced",
      upright: {
        summary: "The road is long, and your steady steps matter.",
        meaning:
          "Keep showing up. This card favors consistency, practical duty, grounded promises, and the slow trust built through repeated honorable action.",
        reflection: "What reliable step would make the future more solid?",
        keywords: ["dedication", "patience", "reliability", "progress", "loyalty", "routine"]
      },
      reversed: {
        summary: "The steady path may have hardened into a rut or stalled through fear.",
        meaning:
          "Reliability is sacred until it becomes refusal. Reassess the routine, invite change where needed, and make sure loyalty still serves life.",
        reflection: "What routine once protected me but now limits my growth?",
        shadow: "Stagnation, stubbornness, delay, fear of change, or duty without aliveness."
      },
      bloodMoon: {
        shortMeaning: "Devotion becomes a rut when safety fears every new road.",
        summary:
          "Under the Blood Moon, the Knight of Pentacles reveals stagnation, stubbornness, and loyalty to patterns that no longer live. The path is familiar, but familiarity is not always faithfulness.",
        shadowMessage: "Steady does not mean stuck.",
        veilHint: "Notice where patience is being used to avoid change.",
        upright: {
          headline: "The Unmoving Road",
          summary: "Dedication looks honorable while fear roots it in place.",
          meaning:
            "You may be committed, reliable, and careful, yet the shadow asks whether the routine still serves the soul. Devotion becomes a cage when it refuses new information.",
          shadow: "Loyalty hardens into inertia.",
          mask: "I am staying the course.",
          wound: "Fear that change will destroy the safety you worked to build.",
          work: "Keep the vow but revise the method.",
          veilHint: "The road can be faithful and still turn.",
          reflection: "Where has caution become my identity?",
          thread: "The knight holds the reins; the earth waits for one new step."
        },
        reversed: {
          headline: "The Buried Hooves",
          summary: "Stagnation reveals the cost of confusing fear with commitment.",
          meaning:
            "A job, relationship, habit, or plan may be stuck because change feels unsafe. The Blood Moon asks for movement that honors the past without embalming it.",
          shadow: "The rut becomes a shrine to old safety.",
          mask: "This is just who I am.",
          wound: "A body trained to distrust disruption, even when disruption is growth.",
          work: "Change one practical pattern and let the ground prove it can hold you.",
          veilHint: "The field is not a tomb unless you refuse to leave it.",
          reflection: "What am I calling loyalty because I am afraid to move?",
          thread: "The path sinks; the horse dreams of distance."
        }
      }
    },
    queen: {
      keywords: ["nurture", "embodiment", "home", "resourcefulness", "care", "wisdom"],
      shortMeaning: "Grounded care turns home, body, and resources into places of wise nourishment.",
      summary:
        "The Queen of Pentacles is embodied wisdom, the hearth that knows how to feed the spirit through ordinary life. She brings nurture, resourcefulness, home, body care, and practical magic made gentle.",
      uprightMeaning: "Nurture, embodied wisdom, home, resourcefulness, and grounded care.",
      shadowMeaning: "Overgiving, caretaking as control, comfort as avoidance, or self-worth tied to being needed.",
      reflectionQuestion: "How can I nurture others without abandoning the body that carries me?",
      themes: ["nurture", "embodiment", "home", "care"],
      archetype: "The Living Hearth",
      energy: "positive",
      upright: {
        summary: "Care becomes sacred when it includes the body, home, and daily life.",
        meaning:
          "Tend what is near: food, rest, money, space, touch, plants, children, work, or the self. This card honors practical love that nourishes without needing to perform sacrifice.",
        reflection: "What form of care would make my body feel included?",
        keywords: ["nurture", "embodiment", "home", "resourcefulness", "care", "wisdom"]
      },
      reversed: {
        summary: "The hearth may be overextended, controlling, or used to avoid a deeper need.",
        meaning:
          "Care needs reciprocity and rest. Step back from overgiving, comfort patterns, or caretaking roles that make your worth depend on being needed.",
        reflection: "Where am I giving care that I secretly need to receive?",
        shadow: "Overgiving, depletion, domestic control, comfort avoidance, or self-worth tied to usefulness."
      },
      bloodMoon: {
        shortMeaning: "The hearth becomes a hook when care is used to secure being needed.",
        summary:
          "Under the Blood Moon, the Queen of Pentacles reveals overgiving, caretaking as control, and comfort as avoidance. The warm room may hide a bargain: need me, and I will feel safe.",
        shadowMessage: "Nurture is not clean when it quietly demands dependence.",
        veilHint: "Ask what you fear would happen if everyone could care for themselves.",
        upright: {
          headline: "The Hungry Hearth",
          summary: "Care fills the room, but its hidden need asks to be fed.",
          meaning:
            "You may be providing real support, comfort, or stability. The shadow asks whether your care leaves others freer, or whether it keeps you central, necessary, and protected from your own unmet need.",
          shadow: "Nurture becomes possession through usefulness.",
          mask: "I just want everyone taken care of.",
          wound: "A belief that being needed is the safest form of love.",
          work: "Offer care with a boundary and receive one concrete form of support.",
          veilHint: "The hearth should warm you too.",
          reflection: "Where do I confuse being needed with being loved?",
          thread: "The queen feeds the house; her own bowl stays empty."
        },
        reversed: {
          headline: "The Comfort Trap",
          summary: "Overgiving collapses into resentment, avoidance, or control.",
          meaning:
            "Caretaking may be hiding exhaustion, loneliness, body neglect, or fear of change. Comfort becomes a cage when it keeps everyone from telling the truth.",
          shadow: "The soft room becomes a place where growth goes to sleep.",
          mask: "This is what love looks like.",
          wound: "Old deprivation turning care into a bid for permanence.",
          work: "Stop managing everyone and return to the body's honest need.",
          veilHint: "Too many cushions can muffle the alarm.",
          reflection: "What discomfort am I covering with caretaking?",
          thread: "The hearth smolders; the unspoken need thickens the air."
        }
      }
    },
    king: {
      keywords: ["stability", "leadership", "prosperity", "protection", "resources", "mastery"],
      shortMeaning: "Mastered resources become stable leadership, protection, and prosperous stewardship.",
      summary:
        "The King of Pentacles is mature earth: prosperous, protective, disciplined, and rooted. He teaches resource mastery, practical leadership, and wealth that becomes wise when it serves life beyond possession.",
      uprightMeaning: "Stability, leadership, prosperity, protection, and mastery of resources.",
      shadowMeaning: "Greed, domination through resources, status as identity, or confusing ownership with safety.",
      reflectionQuestion: "What does my stability protect, and what does it control?",
      themes: ["stability", "leadership", "prosperity", "resources"],
      archetype: "The Rooted Sovereign",
      energy: "balanced",
      upright: {
        summary: "Resources are strongest when they are mastered, protected, and used with wisdom.",
        meaning:
          "Lead practically. This card favors financial steadiness, responsible authority, material success, and protection that strengthens rather than possesses what it loves.",
        reflection: "How can my resources become shelter instead of proof?",
        keywords: ["stability", "leadership", "prosperity", "protection", "resources", "mastery"]
      },
      reversed: {
        summary: "Power over resources may be turning rigid, greedy, or status-bound.",
        meaning:
          "Examine where ownership has replaced safety and status has replaced self-worth. True mastery does not need to dominate in order to feel secure.",
        reflection: "Where am I using control to feel wealthy, safe, or important?",
        shadow: "Greed, materialism, control, rigidity, status obsession, or domination through resources."
      },
      bloodMoon: {
        shortMeaning: "Ownership becomes a throne when safety is confused with control.",
        summary:
          "Under the Blood Moon, the King of Pentacles reveals greed, domination through resources, and status as identity. The vault is full, but the heart may still be bargaining with fear.",
        shadowMessage: "Possession cannot heal the terror of loss.",
        veilHint: "Watch who must depend on you for you to feel secure.",
        upright: {
          headline: "The Vaulted Throne",
          summary: "Stability is powerful, but control may be sitting inside it.",
          meaning:
            "You may hold money, property, authority, or practical influence. The shadow asks whether those resources protect life or make others orbit your need for security.",
          shadow: "Stewardship hardens into ownership of people and outcomes.",
          mask: "I am providing security.",
          wound: "Fear that without control, everything valuable will be taken.",
          work: "Use resources to empower others, not bind them.",
          veilHint: "A locked vault cannot become a home.",
          reflection: "Where do I confuse being needed financially or materially with being safe?",
          thread: "The king counts the coins; the room waits for permission."
        },
        reversed: {
          headline: "The Greed Root",
          summary: "Status and control reveal the insecurity they were built to hide.",
          meaning:
            "Greed, rigidity, financial control, or status anxiety may be driving the situation. The Blood Moon asks for accountability around how resources are used to dominate, withhold, or define worth.",
          shadow: "The self becomes the estate it defends.",
          mask: "I earned this, so I decide.",
          wound: "A scarcity wound buried beneath achievement.",
          work: "Release one controlling claim and practice stewardship with transparency.",
          veilHint: "The root rots when it only feeds itself.",
          reflection: "What am I protecting that has become more important than love?",
          thread: "The vault deepens; the old hunger keeps digging."
        }
      }
    }
  };

  const swordsMeanings = {
    ace: {
      keywords: ["clarity", "truth", "breakthrough", "focus", "insight", "decision"],
      shortMeaning: "A clear truth cuts through confusion and asks to be used with care.",
      summary:
        "The Ace of Swords is the first clean breath after mental fog. It brings insight, focus, honest perception, and the responsibility to let truth liberate rather than wound.",
      uprightMeaning: "Clarity, breakthrough, mental focus, and honest insight.",
      shadowMeaning: "Harsh certainty, cutting words, or truth used before understanding.",
      reflectionQuestion: "What truth is becoming clear, and how can I hold it without cruelty?",
      themes: ["clarity", "truth", "focus", "insight"],
      archetype: "The Clear Blade",
      energy: "transformative",
      upright: {
        summary: "A clean line of truth appears where confusion once gathered.",
        meaning:
          "Let the mind become precise without becoming cold. This card supports honest speech, clear decisions, new ideas, and the courage to name what is real.",
        reflection: "Where would clarity set me free if I stopped arguing with it?",
        keywords: ["clarity", "truth", "breakthrough", "focus", "insight", "decision"]
      },
      reversed: {
        summary: "The blade may be clouded, withheld, or swung too quickly.",
        meaning:
          "Pause before speaking or deciding from reactivity. Truth needs context, timing, and humility if it is going to heal rather than merely cut.",
        reflection: "What am I calling truth that may still need listening?",
        shadow: "Confusion, weaponized certainty, mental rigidity, or cutting before understanding."
      },
      bloodMoon: {
        shortMeaning: "Truth becomes a blade when certainty matters more than understanding.",
        summary:
          "Under the Blood Moon, the Ace of Swords reveals harsh clarity, weaponized certainty, and the pleasure of cutting cleanly through complexity. The shadow loves being right more than being whole.",
        shadowMessage: "A true blade still needs a wise hand.",
        veilHint: "Notice the moment clarity starts craving a victim.",
        upright: {
          headline: "The Blooded Blade",
          summary: "A truth arrives sharp enough to tempt cruelty.",
          meaning:
            "You may see something clearly now, but the Blood Moon asks how you intend to use that sight. Insight can liberate, expose, or punish; the motive decides the wound it leaves.",
          shadow: "Certainty becomes permission to cut.",
          mask: "I am only telling the truth.",
          wound: "A history of confusion that made sharpness feel like safety.",
          work: "Speak the truth with enough room for context, consequence, and humanity.",
          veilHint: "The blade reflects the hand that raises it.",
          reflection: "Am I seeking clarity, or seeking the power to cut?",
          thread: "The sword shines; the hidden anger finds an edge."
        },
        reversed: {
          headline: "The Cruel Certainty",
          summary: "The mind clings to one sharp answer to avoid a deeper truth.",
          meaning:
            "A thought, accusation, or decision may be too rigid because complexity feels unsafe. Let the blade lower before it confuses speed with wisdom.",
          shadow: "Being right becomes a shield against being changed.",
          mask: "There is nothing else to understand.",
          wound: "Fear that softness will return you to confusion or powerlessness.",
          work: "Ask one sincere question before making the final cut.",
          veilHint: "A duller edge may reveal the living shape of truth.",
          reflection: "What would I have to feel if I stopped being certain?",
          thread: "The sword turns inward; the verdict begins to bleed."
        }
      }
    },
    two: {
      keywords: ["choice", "pause", "balance", "truth", "stillness", "discernment"],
      shortMeaning: "A difficult choice asks for stillness while two truths are honestly weighed.",
      summary:
        "The Two of Swords holds the mind at a crossroads. It asks for inner balance, careful discernment, and the courage to choose when neutrality has finished teaching.",
      uprightMeaning: "Difficult choice, pause, inner balance, and weighing truth before action.",
      shadowMeaning: "Avoidance, denial, emotional shutdown, or refusing to choose because both truths hurt.",
      reflectionQuestion: "What choice becomes clearer when I stop pretending not to know?",
      themes: ["choice", "discernment", "balance", "pause"],
      archetype: "The Blindfolded Gate",
      energy: "neutral",
      upright: {
        summary: "The pause is sacred when it helps the truth become audible.",
        meaning:
          "Do not rush the decision, but do not hide inside the pause. Listen beneath fear, compare the facts with the body's knowing, and prepare to act when the inner scale settles.",
        reflection: "What truth am I ready to weigh without flinching?",
        keywords: ["choice", "pause", "balance", "truth", "stillness", "discernment"]
      },
      reversed: {
        summary: "Avoidance may be ending, or denial may be making the choice for you.",
        meaning:
          "The longer a necessary decision is refused, the more life decides around it. Remove the blindfold gently, but remove it.",
        reflection: "What has my silence already chosen?",
        shadow: "Indecision, denial, emotional shutdown, avoidance, or paralysis in the face of painful truth."
      },
      bloodMoon: {
        shortMeaning: "The blindfold becomes a refuge when both truths hurt.",
        summary:
          "Under the Blood Moon, the Two of Swords reveals avoidance, denial, and emotional shutdown. The mind creates a still room where no choice can enter, but pain waits on both sides.",
        shadowMessage: "Refusing to choose is still a choice with consequences.",
        veilHint: "Listen for the truth you keep calling too complicated.",
        upright: {
          headline: "The Locked Blindfold",
          summary: "Stillness protects you from a decision that cannot be delayed forever.",
          meaning:
            "You may be withholding action because every option asks you to lose something. The shadow turns discernment into paralysis and calls numbness peace.",
          shadow: "The mind freezes to avoid the grief of choosing.",
          mask: "I need more time.",
          wound: "Fear that any decision will make you responsible for pain.",
          work: "Name the cost of each option and choose the cost you can live with honestly.",
          veilHint: "The crossed swords are also a door.",
          reflection: "What pain am I avoiding by staying undecided?",
          thread: "Two blades cross; the hidden heart stops breathing."
        },
        reversed: {
          headline: "The Refused Door",
          summary: "Denial cracks, revealing the choice that has been waiting.",
          meaning:
            "A truth may be forcing itself into view. Do not punish yourself for the delay; use the clarity to act before the old shutdown rebuilds the wall.",
          shadow: "Avoidance becomes crisis when it is protected too long.",
          mask: "I did not know what else to do.",
          wound: "Old consequences that taught the self to disappear under pressure.",
          work: "Make one honest decision and communicate it plainly.",
          veilHint: "The blindfold falls where courage begins.",
          reflection: "What choice would restore my self-respect?",
          thread: "The cloth slips; the moonlight names both blades."
        }
      }
    },
    three: {
      keywords: ["heartbreak", "grief", "truth", "release", "sorrow", "honesty"],
      shortMeaning: "Painful truth opens the heart so grief can move instead of harden.",
      summary:
        "The Three of Swords is heartbreak made visible. It asks you to let truth pierce denial so grief can release, cleanse, and eventually make room for a more honest love.",
      uprightMeaning: "Heartbreak, grief, painful truth, and emotional release through honesty.",
      shadowMeaning: "Pain as identity, betrayal loops, or using hurt as proof that love is unsafe.",
      reflectionQuestion: "What grief needs honesty so it can finally move?",
      themes: ["heartbreak", "grief", "truth", "release"],
      archetype: "The Pierced Heart",
      energy: "challenging",
      upright: {
        summary: "The wound is speaking clearly now, and denial cannot hold it closed.",
        meaning:
          "Let sorrow have language. This card does not romanticize pain; it honors the cleansing honesty that lets a broken heart stop pretending it is untouched.",
        reflection: "What truth would let this pain become clean?",
        keywords: ["heartbreak", "grief", "truth", "release", "sorrow", "honesty"]
      },
      reversed: {
        summary: "The heart may be ready to remove a blade it has carried too long.",
        meaning:
          "Healing begins when pain is witnessed without being rehearsed forever. Release does not erase what happened; it stops giving the wound your whole identity.",
        reflection: "What hurt am I ready to stop reopening for proof?",
        shadow: "Unprocessed grief, resentment, betrayal fixation, or pain used to keep love at a distance."
      },
      bloodMoon: {
        shortMeaning: "The wound becomes an identity when hurt is used to prove love is unsafe.",
        summary:
          "Under the Blood Moon, the Three of Swords reveals betrayal loops, reopened wounds, and pain guarded like evidence. Grief becomes shadow when it is kept bleeding to defend against future love.",
        shadowMessage: "A wound can be real without being the whole truth of you.",
        veilHint: "Notice the story that keeps pressing the blade back in.",
        upright: {
          headline: "The Kept Wound",
          summary: "Heartbreak is real, but the mind may be preserving it as proof.",
          meaning:
            "You may be returning to a betrayal, rejection, or loss because the pain explains everything. The Blood Moon asks whether grief is moving through you or being used to build a locked theory of love.",
          shadow: "Pain becomes a witness that never leaves the stand.",
          mask: "I am only protecting myself.",
          wound: "A heartbreak that taught the mind to equate love with danger.",
          work: "Tell the truth once without sharpening it into a lifelong verdict.",
          veilHint: "The heart cannot heal around a blade you keep polishing.",
          reflection: "What would I lose if this pain stopped proving my story?",
          thread: "Three swords remain; the heart learns their names by repetition."
        },
        reversed: {
          headline: "The Betrayal Loop",
          summary: "The old pain returns because it has become the map.",
          meaning:
            "A wound may be replaying through suspicion, comparison, or self-protective withdrawal. The task is to honor what happened without making every future intimacy pay for it.",
          shadow: "Grief becomes prophecy.",
          mask: "This always happens to me.",
          wound: "The terror that healing will make you vulnerable to the same hurt again.",
          work: "Separate memory from prediction and choose one act of present-tense trust.",
          veilHint: "The scar can feel weather without becoming the storm.",
          reflection: "Where am I using old pain to reject new evidence?",
          thread: "The blade loosens; the story reaches to hold it in."
        }
      }
    },
    four: {
      keywords: ["rest", "recovery", "stillness", "healing", "pause", "sanctuary"],
      shortMeaning: "The mind needs sacred rest so healing can happen beneath the noise.",
      summary:
        "The Four of Swords is the quiet chamber after conflict, grief, or strain. It asks for recovery, mental stillness, and the humility to let rest become part of wisdom.",
      uprightMeaning: "Rest, recovery, mental stillness, sacred pause, and healing after strain.",
      shadowMeaning: "Withdrawal, numbness, hiding from life, or silence becoming a locked room.",
      reflectionQuestion: "What kind of rest would help my mind return to truth?",
      themes: ["rest", "recovery", "stillness", "healing"],
      archetype: "The Quiet Chapel",
      energy: "neutral",
      upright: {
        summary: "Silence can become medicine when it is chosen with care.",
        meaning:
          "Step back from noise, argument, and constant analysis. This card supports sleep, retreat, therapy, prayer, meditation, and any pause that helps the nervous system repair.",
        reflection: "What would I stop hearing if I allowed true quiet?",
        keywords: ["rest", "recovery", "stillness", "healing", "pause", "sanctuary"]
      },
      reversed: {
        summary: "The pause may be ending, or rest may have turned into avoidance.",
        meaning:
          "Return slowly if you are healed enough to move. If you are hiding, open one window; the mind cannot recover by refusing life forever.",
        reflection: "Where is my retreat healing me, and where is it hiding me?",
        shadow: "Isolation, mental exhaustion, numbness, avoidance, or refusal to reengage."
      },
      bloodMoon: {
        shortMeaning: "Silence becomes a locked room when rest turns into disappearance.",
        summary:
          "Under the Blood Moon, the Four of Swords reveals withdrawal, numbness, and hiding from life. The sanctuary becomes shadow when no one, not even truth, is allowed inside.",
        shadowMessage: "Peace without return can become another form of fear.",
        veilHint: "Notice when quiet stops restoring you and starts erasing you.",
        upright: {
          headline: "The Sealed Chapel",
          summary: "Rest protects the mind, but the door may be locked from within.",
          meaning:
            "You may need retreat, yet the shadow asks whether silence is healing or numbing. Recovery requires safety, but it also requires eventual contact with life.",
          shadow: "Withdrawal calls itself peace.",
          mask: "I just need to be alone.",
          wound: "A mind so overstimulated by pain that absence feels like survival.",
          work: "Keep the rest, but set a gentle point of return.",
          veilHint: "A chapel is not a tomb unless you refuse to leave it.",
          reflection: "What am I avoiding by staying silent?",
          thread: "Four swords guard the room; the sleeping truth waits."
        },
        reversed: {
          headline: "The Numb Sanctuary",
          summary: "The retreat cracks, revealing life waiting outside the door.",
          meaning:
            "A period of withdrawal may be losing its healing power. Step back into contact gradually, and distinguish true readiness from the fear of being touched by reality again.",
          shadow: "Numbness becomes identity when rest is prolonged past repair.",
          mask: "I am not ready for anything.",
          wound: "Fear that reentry will recreate the original wound.",
          work: "Let one trusted signal, person, or task cross the threshold.",
          veilHint: "The first sound after silence may be mercy.",
          reflection: "What would reconnect me without overwhelming me?",
          thread: "The door opens; the quiet resists the light."
        }
      }
    },
    five: {
      keywords: ["conflict", "victory", "ego", "cost", "argument", "release"],
      shortMeaning: "A conflict reveals whether winning is worth the damage it leaves behind.",
      summary:
        "The Five of Swords is the hollow victory after words have cut too deeply. It asks you to see the real cost of conflict, ego, and being right when connection or integrity is lost.",
      uprightMeaning: "Conflict, hollow victory, ego clash, and knowing when the fight costs too much.",
      shadowMeaning: "Cruelty, humiliation, winning to feel powerful, or truth used as punishment.",
      reflectionQuestion: "What would I gain by stepping away from a victory that wounds everyone?",
      themes: ["conflict", "ego", "cost", "release"],
      archetype: "The Hollow Victor",
      energy: "challenging",
      upright: {
        summary: "The argument may be won, but the field asks what was lost.",
        meaning:
          "Choose integrity over domination. This card may point to conflict, disagreement, or necessary separation, but it asks you not to confuse triumph with healing.",
        reflection: "Where is being right costing more than it gives?",
        keywords: ["conflict", "victory", "ego", "cost", "argument", "release"]
      },
      reversed: {
        summary: "The fight may be ready to end if pride can loosen its grip.",
        meaning:
          "Repair is possible when blame stops needing a throne. Walk away, apologize, or choose peace before the damage becomes the whole story.",
        reflection: "What would repair ask of my pride?",
        shadow: "Resentment, unresolved conflict, revenge thinking, humiliation, or refusal to stop fighting."
      },
      bloodMoon: {
        shortMeaning: "Truth becomes punishment when winning matters more than repair.",
        summary:
          "Under the Blood Moon, the Five of Swords exposes cruelty, humiliation, and the need to win in order to feel powerful. The sharpest word may be less about truth than control.",
        shadowMessage: "A victory that requires degradation has already lost its soul.",
        veilHint: "Notice where your argument wants an audience for someone else's defeat.",
        upright: {
          headline: "The Cruel Victory",
          summary: "The battle is won, but the winner is not clean.",
          meaning:
            "You may have the facts, leverage, or sharper language. The shadow asks whether you are seeking resolution or the satisfaction of making someone smaller.",
          shadow: "Truth is sharpened into punishment.",
          mask: "They needed to hear it.",
          wound: "Powerlessness that learned to survive by striking first.",
          work: "Stop before the final cut and choose the repairable sentence.",
          veilHint: "The defeated face reflects the victor's wound.",
          reflection: "What part of me feels powerful only when someone else is humbled?",
          thread: "Five swords glitter; the battlefield goes quiet with shame."
        },
        reversed: {
          headline: "The Aftertaste of Winning",
          summary: "The conflict ends, but the cruelty remains in the mouth.",
          meaning:
            "Regret, resentment, or the consequences of a verbal wound may be surfacing. Accountability is the only clean way out of the hollow victory.",
          shadow: "The mind replays the fight to keep the ego alive.",
          mask: "I had no choice.",
          wound: "Fear that admitting harm will return you to powerlessness.",
          work: "Name the harm without defending the wound that caused it.",
          veilHint: "The sword laid down can still become a bridge.",
          reflection: "What am I ready to repair without needing to be declared innocent?",
          thread: "The victor walks away; the echo follows."
        }
      }
    },
    six: {
      keywords: ["transition", "recovery", "passage", "perspective", "leaving", "calm"],
      shortMeaning: "A transition carries the mind away from conflict toward calmer understanding.",
      summary:
        "The Six of Swords is the passage after the storm. It brings mental recovery, distance from conflict, and the sober grace of moving toward calmer waters with lessons still in the boat.",
      uprightMeaning: "Transition, mental recovery, leaving conflict, and moving toward calmer waters.",
      shadowMeaning: "Fleeing without healing, emotional exile, or carrying the old storm into the next place.",
      reflectionQuestion: "What am I carrying across this passage that still needs healing?",
      themes: ["transition", "recovery", "leaving", "perspective"],
      archetype: "The Quiet Ferryman",
      energy: "transformative",
      upright: {
        summary: "The shore behind you may still ache, but movement is possible.",
        meaning:
          "Let distance help the mind heal. This card supports leaving conflict, changing environments, seeking help, and moving toward a more peaceful perspective without pretending the past vanished.",
        reflection: "What calmer place is my mind ready to travel toward?",
        keywords: ["transition", "recovery", "passage", "perspective", "leaving", "calm"]
      },
      reversed: {
        summary: "The passage may be delayed because the old storm is still inside the boat.",
        meaning:
          "Escape alone will not create peace. Name what you are carrying, repair what can be repaired, and let the transition include healing rather than only distance.",
        reflection: "Where have I confused leaving with being free?",
        shadow: "Stuckness, avoidance, unresolved conflict, emotional exile, or escape dressed as peace."
      },
      bloodMoon: {
        shortMeaning: "Escape dresses as peace while the old storm travels with you.",
        summary:
          "Under the Blood Moon, the Six of Swords reveals fleeing without healing, emotional exile, and the fantasy that distance alone will save you. The boat moves, but the mind may remain in the wreckage.",
        shadowMessage: "A new shore cannot heal what you refuse to unpack.",
        veilHint: "Look at the storm you brought with you.",
        upright: {
          headline: "The Exile Boat",
          summary: "The passage is quiet, but silence may be hiding unfinished pain.",
          meaning:
            "You may need to leave, relocate, detach, or move on. The shadow asks whether this transition includes integration or only a more graceful disappearance.",
          shadow: "Peace becomes distance without repair.",
          mask: "I just need to get away.",
          wound: "A belief that safety only exists elsewhere.",
          work: "Carry the lesson consciously instead of smuggling the wound.",
          veilHint: "Calmer water still reflects what is in the boat.",
          reflection: "What have I not healed that I am hoping distance will dissolve?",
          thread: "Six swords cross the water; the old storm sits among them."
        },
        reversed: {
          headline: "The Returning Storm",
          summary: "The unresolved past reappears on the new shore.",
          meaning:
            "A pattern may follow you into another place, relationship, job, or identity. This is not failure; it is the invitation to heal what movement alone could not.",
          shadow: "Flight repeats the wound in fresh scenery.",
          mask: "Why does this keep happening here too?",
          wound: "Old conflict carried as a private weather system.",
          work: "Stop rowing long enough to name the pattern and ask for support.",
          veilHint: "The shore changes; the hidden cargo remains.",
          reflection: "What truth has traveled with me because I never faced it?",
          thread: "The boat lands; the storm steps out first."
        }
      }
    },
    seven: {
      keywords: ["strategy", "secrecy", "independence", "caution", "plan", "discernment"],
      shortMeaning: "Careful strategy may be needed, but secrecy must answer to integrity.",
      summary:
        "The Seven of Swords moves quietly through complicated terrain. It asks for strategy, independence, and careful timing while warning that hidden plans can become self-deception.",
      uprightMeaning: "Strategy, secrecy, independence, careful movement, and a hidden plan.",
      shadowMeaning: "Deception, self-deception, manipulation, or hiding from accountability.",
      reflectionQuestion: "What am I keeping hidden, and is secrecy protecting truth or avoiding it?",
      themes: ["strategy", "secrecy", "integrity", "independence"],
      archetype: "The Shadow Strategist",
      energy: "mysterious",
      upright: {
        summary: "Move carefully, but keep your integrity awake.",
        meaning:
          "A private plan, strategic withdrawal, or unconventional route may be wise. Check your motive: protection and manipulation can look similar until accountability arrives.",
        reflection: "Where does this situation require discretion rather than avoidance?",
        keywords: ["strategy", "secrecy", "independence", "caution", "plan", "discernment"]
      },
      reversed: {
        summary: "A hidden truth may be surfacing, or a strategy may need confession and repair.",
        meaning:
          "Self-deception loses power when named. Return what was taken, clarify what was hidden, or stop protecting a story that cannot withstand the truth.",
        reflection: "What truth would restore my integrity if I admitted it?",
        shadow: "Exposure, lies, manipulation, avoidance, theft of truth, or accountability deferred."
      },
      bloodMoon: {
        shortMeaning: "The hidden plan becomes a theft when truth is taken from the room.",
        summary:
          "Under the Blood Moon, the Seven of Swords exposes deception, self-deception, and manipulation. The shadow is not only lying to others; it is arranging reality so accountability cannot find you.",
        shadowMessage: "A secret kept from truth will eventually become a cage.",
        veilHint: "Notice the fact you keep removing from the story.",
        upright: {
          headline: "The Stolen Truth",
          summary: "Strategy moves in the dark, but motive leaves footprints.",
          meaning:
            "You may be keeping something hidden for survival, privacy, or advantage. The Blood Moon asks whether secrecy protects what is sacred or steals someone else's ability to choose.",
          shadow: "Control hides inside omission.",
          mask: "They do not need to know everything.",
          wound: "Fear that honesty will cost freedom, safety, or power.",
          work: "Name the real reason for secrecy and restore consent where truth was withheld.",
          veilHint: "The missing sword is the one that will speak.",
          reflection: "Who loses agency when I hide this?",
          thread: "Seven swords leave the tent; one shadow carries the account."
        },
        reversed: {
          headline: "The Lie That Learned Your Voice",
          summary: "Self-deception begins to sound like strategy.",
          meaning:
            "A hidden motive, half-truth, or avoided confession may be surfacing. Do not only ask what you can get away with; ask what kind of self the secret is making.",
          shadow: "The mind edits reality to protect the ego.",
          mask: "I had my reasons.",
          wound: "A learned belief that directness is dangerous.",
          work: "Tell the cleanest truth available and accept the consequence it opens.",
          veilHint: "The shadow cannot negotiate with dawn.",
          reflection: "What lie has become easier than my integrity?",
          thread: "The stolen blade returns; the hand recognizes itself."
        }
      }
    },
    eight: {
      keywords: ["restriction", "fear", "beliefs", "prison", "awareness", "liberation"],
      shortMeaning: "A mental prison begins to loosen when you see the belief that built it.",
      summary:
        "The Eight of Swords shows fear, restriction, and the stories that make escape seem impossible. Its gift is awareness: the moment you realize the cage has seams.",
      uprightMeaning: "Restriction, fear, mental prison, limiting beliefs, and seeing the way out.",
      shadowMeaning: "Victim loops, learned helplessness, or protecting the prison because freedom feels unsafe.",
      reflectionQuestion: "What belief makes this cage feel stronger than it is?",
      themes: ["restriction", "fear", "beliefs", "liberation"],
      archetype: "The Bound Mind",
      energy: "challenging",
      upright: {
        summary: "The bindings are real enough to feel, but not as absolute as fear claims.",
        meaning:
          "Notice the thought pattern, rule, or internal voice that limits your movement. Small awareness matters here; each honest perception loosens the knot.",
        reflection: "What option appears when I question the fearful story?",
        keywords: ["restriction", "fear", "beliefs", "prison", "awareness", "liberation"]
      },
      reversed: {
        summary: "The mind may be finding a way out, or realizing how long it has defended the cage.",
        meaning:
          "Liberation begins with one movement that contradicts the old belief. Do not wait to feel fearless; freedom often begins as a trembling step.",
        reflection: "What small act would prove I am not as trapped as I thought?",
        shadow: "Self-limitation, fear loops, learned helplessness, avoidance, or freedom anxiety."
      },
      bloodMoon: {
        shortMeaning: "Fear becomes a cage the self protects because freedom feels dangerous.",
        summary:
          "Under the Blood Moon, the Eight of Swords reveals victim loops, learned helplessness, and the strange safety of the prison. The mind may defend the very story that keeps it bound.",
        shadowMessage: "A cage can feel like home when choice once felt unsafe.",
        veilHint: "Notice the freedom you argue against before testing it.",
        upright: {
          headline: "The Beloved Cage",
          summary: "The prison hurts, but it also protects the old identity.",
          meaning:
            "You may be restricted by real pressures and by the meanings fear has built around them. The shadow insists there is no way out because possibility would require responsibility.",
          shadow: "Helplessness becomes protection from risk.",
          mask: "There is nothing I can do.",
          wound: "A past where choice led to punishment, loss, or shame.",
          work: "Find one choice that is small enough to be safe and real enough to matter.",
          veilHint: "The blindfold loosens where responsibility begins.",
          reflection: "What part of me benefits from believing I am trapped?",
          thread: "Eight swords stand; the open path frightens the bound one."
        },
        reversed: {
          headline: "The Open Knot",
          summary: "Freedom appears, and the old fear tries to call it danger.",
          meaning:
            "A limiting belief may be breaking, but release can feel destabilizing. Move gently, and do not mistake the unfamiliar feeling of agency for a warning.",
          shadow: "The prison speaks in the voice of caution.",
          mask: "I am not ready to change this.",
          wound: "Fear that freedom will expose needs, desires, or mistakes.",
          work: "Take the step, then let the body learn it survived.",
          veilHint: "The first breath outside the cage may shake.",
          reflection: "What freedom am I afraid to admit I want?",
          thread: "The knot opens; the old story reaches for your wrists."
        }
      }
    },
    nine: {
      keywords: ["anxiety", "nightmares", "guilt", "anguish", "haunting", "worry"],
      shortMeaning: "What haunts the mind asks to be faced with compassion and reality.",
      summary:
        "The Nine of Swords is the hour when fear speaks too loudly in the dark. It brings anxiety, guilt, nightmares, and the need to separate real responsibility from mental torment.",
      uprightMeaning: "Anxiety, nightmares, guilt, mental anguish, and facing what haunts the mind.",
      shadowMeaning: "Obsessive fear, shame spirals, or believing the nightmare more than reality.",
      reflectionQuestion: "What fear grows in the dark because I have not brought it into truth?",
      themes: ["anxiety", "guilt", "fear", "compassion"],
      archetype: "The Midnight Mind",
      energy: "challenging",
      upright: {
        summary: "The mind is loud in the dark, but every fear deserves daylight before belief.",
        meaning:
          "Do not shame yourself for being afraid. Bring the thought into language, support, and proportion so guilt can become repair and anxiety can stop ruling the room.",
        reflection: "What would this fear sound like if spoken to someone safe?",
        keywords: ["anxiety", "nightmares", "guilt", "anguish", "haunting", "worry"]
      },
      reversed: {
        summary: "The nightmare may be loosening, or the shame spiral may be asking for help.",
        meaning:
          "You do not have to endure torment as punishment. Seek support, correct what can be corrected, and stop treating fear as the final authority.",
        reflection: "What support would interrupt this loop?",
        shadow: "Obsession, insomnia, shame, catastrophizing, mental punishment, or refusal to reality-check fear."
      },
      bloodMoon: {
        shortMeaning: "The nightmare becomes a judge when shame demands punishment.",
        summary:
          "Under the Blood Moon, the Nine of Swords reveals obsessive fear, shame spirals, and torment treated as justice. The mind may believe suffering proves responsibility, but punishment is not repair.",
        shadowMessage: "Torment is not the same as accountability.",
        veilHint: "Notice the fear you keep feeding because it feels deserved.",
        upright: {
          headline: "The Punishing Night",
          summary: "The mind turns against itself in the dark and calls it truth.",
          meaning:
            "Anxiety or guilt may be circling with cruel precision. The shadow wants you to believe the worst thought because it feels like control, penance, or preparation for pain.",
          shadow: "Shame becomes the executioner of the mind.",
          mask: "I deserve to feel this bad.",
          wound: "Old blame teaching the self that suffering prevents harm.",
          work: "Separate accountability from punishment and bring the fear to a real witness.",
          veilHint: "The nightmare grows where no one is allowed to turn on the light.",
          reflection: "What am I trying to pay for with my suffering?",
          thread: "Nine swords hang above the bed; shame counts them aloud."
        },
        reversed: {
          headline: "The Endless Spiral",
          summary: "Fear repeats itself until reality is invited back in.",
          meaning:
            "A mental loop may be nearing exhaustion. Interrupt it with evidence, care, confession, therapy, repair, or whatever turns the nightmare from a private sentence into a workable truth.",
          shadow: "The mind confuses repetition with proof.",
          mask: "I cannot stop thinking about it because it must be true.",
          wound: "A nervous system trained to survive by rehearsing disaster.",
          work: "Write the fear beside the facts and let another mind help you read it.",
          veilHint: "Reality enters through a door obsession cannot lock.",
          reflection: "What fact does the nightmare keep leaving out?",
          thread: "The spiral tightens; one honest voice cuts through."
        }
      }
    },
    ten: {
      keywords: ["ending", "collapse", "finality", "surrender", "betrayal", "dawn"],
      shortMeaning: "A painful ending asks for surrender so the dawn can reach what survived.",
      summary:
        "The Ten of Swords is the final collapse of a thought, story, conflict, or betrayal that cannot continue. It is painful, but it is also complete; the sky is already beginning to change.",
      uprightMeaning: "Painful ending, collapse, finality, and surrender after betrayal or exhaustion.",
      shadowMeaning: "Dramatic ruin, self-destruction, or identifying with the ending so completely that dawn is refused.",
      reflectionQuestion: "What is truly over, and what is still waiting for dawn?",
      themes: ["ending", "collapse", "surrender", "dawn"],
      archetype: "The Final Dawn",
      energy: "transformative",
      upright: {
        summary: "The ending is real, but it is not the end of the self.",
        meaning:
          "Let what is done be done. This card asks for surrender after betrayal, exhaustion, or mental collapse, and it reminds you that finality can be the first mercy.",
        reflection: "What story can I stop trying to revive?",
        keywords: ["ending", "collapse", "finality", "surrender", "betrayal", "dawn"]
      },
      reversed: {
        summary: "The worst may be passing, but the mind may still be lying under the old ending.",
        meaning:
          "Recovery begins when you stop identifying with the collapse. Rise slowly, accept help, and let the ending become history instead of identity.",
        reflection: "What part of me is ready to stand after the ending?",
        shadow: "Resistance to closure, victim identity, despair, repeated collapse, or refusal to let dawn arrive."
      },
      bloodMoon: {
        shortMeaning: "The ending becomes a throne when ruin is mistaken for identity.",
        summary:
          "Under the Blood Moon, the Ten of Swords reveals dramatic ruin, self-destruction, and the refusal of dawn because the wound feels absolute. The shadow wants the ending to explain everything forever.",
        shadowMessage: "Collapse can be real without being eternal.",
        veilHint: "Notice where you keep lying down after the dawn has begun.",
        upright: {
          headline: "The Crown of Ruin",
          summary: "The collapse is painful, but the mind may be making it total.",
          meaning:
            "Something may be truly over, betrayed, exhausted, or broken. The Blood Moon asks whether you are surrendering to reality or performing devastation to avoid the next life.",
          shadow: "Ruin becomes identity.",
          mask: "This destroyed everything.",
          wound: "A fear that rising would make the pain meaningless.",
          work: "Let the ending be complete without making it sacred ground forever.",
          veilHint: "Dawn does not ask permission from despair.",
          reflection: "Who would I be if this ending were not my final name?",
          thread: "Ten swords pin the story; the horizon reddens anyway."
        },
        reversed: {
          headline: "The Refused Dawn",
          summary: "The old ending loosens, but the wound wants to remain absolute.",
          meaning:
            "Recovery may feel possible and threatening. If you have built identity around collapse, healing can feel like betrayal; let life return without forcing the pain to vanish.",
          shadow: "The self reopens the ending to avoid beginning again.",
          mask: "I cannot come back from this.",
          wound: "A belief that suffering is the only proof of what happened.",
          work: "Take one post-ending action, however small, and let it count.",
          veilHint: "The first light may hurt closed eyes.",
          reflection: "What dawn am I refusing because the night feels familiar?",
          thread: "The body stirs; the final sword loses its claim."
        }
      }
    },
    page: {
      keywords: ["curiosity", "observation", "learning", "alertness", "ideas", "questions"],
      shortMeaning: "A curious mind watches, learns, and asks sharper questions in search of truth.",
      summary:
        "The Page of Swords is the young seeker of air: alert, observant, restless, and ready to learn. It brings new ideas, messages, study, and the need to let curiosity mature into honest communication.",
      uprightMeaning: "Curiosity, observation, learning, alertness, new ideas, and truth-seeking.",
      shadowMeaning: "Suspicion, gossip, defensive watching, immature words, or needing information to feel safe.",
      reflectionQuestion: "What question would help my curiosity become wisdom?",
      themes: ["curiosity", "learning", "observation", "communication"],
      archetype: "The Young Observer",
      energy: "mysterious",
      upright: {
        summary: "The mind is awake, watching the world for signs of truth.",
        meaning:
          "Ask, study, write, listen, and gather information. This card favors beginnings in communication and learning, but asks that alertness remain curious rather than suspicious.",
        reflection: "Where can I ask directly instead of watching from a distance?",
        keywords: ["curiosity", "observation", "learning", "alertness", "ideas", "questions"]
      },
      reversed: {
        summary: "Curiosity may be turning into defensiveness, gossip, or anxious surveillance.",
        meaning:
          "Information cannot create safety if it is gathered through fear. Speak plainly, check assumptions, and let the mind learn without making every silence a threat.",
        reflection: "What am I trying to find out because I am afraid to ask?",
        shadow: "Gossip, suspicion, immature communication, defensiveness, spying, or scattered thinking."
      },
      bloodMoon: {
        shortMeaning: "The watchful mind becomes suspicious when information is used as armor.",
        summary:
          "Under the Blood Moon, the Page of Swords reveals defensive watching, gossip, immature words, and the need to know in order to feel safe. Curiosity becomes shadow when it stops trusting direct contact.",
        shadowMessage: "Information gathered from fear rarely becomes wisdom.",
        veilHint: "Notice the question you avoid asking face to face.",
        upright: {
          headline: "The Watchful Blade",
          summary: "The mind observes sharply, but fear may be directing its gaze.",
          meaning:
            "You may be scanning for clues, messages, contradictions, or danger. The shadow asks whether you are seeking truth or building a case before anyone has spoken.",
          shadow: "Observation becomes surveillance.",
          mask: "I am just paying attention.",
          wound: "A fear of being fooled, blindsided, or made naive.",
          work: "Ask the direct question and stop feeding on fragments.",
          veilHint: "A rumor is a blade with no handle.",
          reflection: "What am I watching because I do not feel safe enough to say?",
          thread: "The page peers through the keyhole; the unsent question sharpens."
        },
        reversed: {
          headline: "The Whispering Edge",
          summary: "Immature words or anxious investigation begin to distort the truth.",
          meaning:
            "Gossip, assumptions, or defensive speech may be creating harm. The Blood Moon asks you to stop treating every piece of information as proof of danger.",
          shadow: "The mind wounds before it understands.",
          mask: "People deserve to know.",
          wound: "Old betrayal turning curiosity into suspicion.",
          work: "Verify, apologize where needed, and choose clean communication over whispers.",
          veilHint: "The sharpest rumor often hides the deepest fear.",
          reflection: "Where have my words moved faster than my wisdom?",
          thread: "The whisper travels; the young blade learns its weight."
        }
      }
    },
    knight: {
      keywords: ["action", "speed", "truth", "directness", "courage", "pursuit"],
      shortMeaning: "Bold thought becomes action when truth is pursued with courage and discipline.",
      summary:
        "The Knight of Swords charges toward the truth with speed, conviction, and sharp focus. It asks for direct communication and brave action while warning that urgency without wisdom can become attack.",
      uprightMeaning: "Bold action, direct communication, mental speed, and courage to pursue truth.",
      shadowMeaning: "Aggression, recklessness, verbal attack, or charging ahead without wisdom.",
      reflectionQuestion: "What truth am I pursuing, and what wisdom needs to ride with me?",
      themes: ["action", "truth", "speed", "communication"],
      archetype: "The Truth Rider",
      energy: "transformative",
      upright: {
        summary: "The mind knows its target and wants movement now.",
        meaning:
          "Act decisively where clarity and courage align. Speak plainly, move quickly if needed, but keep your blade guided by purpose rather than adrenaline.",
        reflection: "Where can I be direct without becoming destructive?",
        keywords: ["action", "speed", "truth", "directness", "courage", "pursuit"]
      },
      reversed: {
        summary: "Speed may be outrunning wisdom, or fear may be blocking needed directness.",
        meaning:
          "Slow the charge before communication becomes collision. The truth deserves courage, but courage is not the same as force.",
        reflection: "What would change if I paused before striking with words?",
        shadow: "Impulsiveness, aggression, scattered force, verbal attack, or reckless certainty."
      },
      bloodMoon: {
        shortMeaning: "The charge becomes an attack when speed replaces wisdom.",
        summary:
          "Under the Blood Moon, the Knight of Swords reveals aggression, recklessness, and verbal force. The shadow does not seek truth; it seeks impact.",
        shadowMessage: "A fast blade can still be wrong.",
        veilHint: "Notice whether urgency is carrying truth or anger.",
        upright: {
          headline: "The Charging Blade",
          summary: "Conviction moves fast, but the motive may be sharpened by rage.",
          meaning:
            "You may feel compelled to confront, declare, expose, or decide. The Blood Moon asks whether directness is serving clarity or giving aggression a noble costume.",
          shadow: "Speed becomes violence in the name of truth.",
          mask: "Someone has to say it.",
          wound: "Fear of being silenced, delayed, or dismissed.",
          work: "Aim the message, soften the impact, and let truth arrive with accountability.",
          veilHint: "The horse cannot read the battlefield for the rider.",
          reflection: "Am I pursuing truth, or pursuing the feeling of impact?",
          thread: "The knight lowers the sword; the road has no time to answer."
        },
        reversed: {
          headline: "The Verbal Wound",
          summary: "Words strike before wisdom arrives.",
          meaning:
            "A rushed confrontation, harsh message, or reckless decision may be causing harm. Repair begins when you admit that speed did not make the strike righteous.",
          shadow: "The mouth becomes a weapon the heart cannot control.",
          mask: "I was just being honest.",
          wound: "Old suppression exploding as force.",
          work: "Pause, repair, and say the true thing without the extra blade.",
          veilHint: "The cleanest truth may need fewer words.",
          reflection: "What did I add to the truth in order to make it hurt?",
          thread: "The charge ends; the echo bleeds."
        }
      }
    },
    queen: {
      keywords: ["discernment", "honesty", "independence", "boundaries", "clarity", "wisdom"],
      shortMeaning: "Wise discernment speaks honestly while keeping the heart clear and protected.",
      summary:
        "The Queen of Swords is clear air after sorrow: independent, perceptive, and unwilling to trade truth for comfort. She teaches boundaries that protect tenderness without denying it.",
      uprightMeaning: "Discernment, honesty, independence, emotional clarity, and wise boundaries.",
      shadowMeaning: "Coldness, cutting judgment, isolation through intellect, or using truth to stay untouchable.",
      reflectionQuestion: "How can I speak clearly without exiling my own tenderness?",
      themes: ["discernment", "honesty", "boundaries", "clarity"],
      archetype: "The Clear Witness",
      energy: "balanced",
      upright: {
        summary: "The mind is clear because it has survived illusion and chosen truth.",
        meaning:
          "Trust your discernment. This card supports honest conversation, mature boundaries, independence, and the ability to see clearly without abandoning compassion.",
        reflection: "What boundary would make my truth cleaner, not colder?",
        keywords: ["discernment", "honesty", "independence", "boundaries", "clarity", "wisdom"]
      },
      reversed: {
        summary: "Clarity may be hardening into judgment, distance, or defensive coldness.",
        meaning:
          "The boundary may be needed, but the blade does not need contempt. Let the heart remain present even when the answer is no.",
        reflection: "Where have I used intellect to avoid being touched?",
        shadow: "Bitterness, isolation, cutting judgment, emotional avoidance, or truth used as armor."
      },
      bloodMoon: {
        shortMeaning: "Truth becomes an ice wall when clarity is used to stay untouchable.",
        summary:
          "Under the Blood Moon, the Queen of Swords reveals coldness, cutting judgment, and isolation through intellect. The wound has learned to speak beautifully while keeping everyone outside the gate.",
        shadowMessage: "A boundary is not wisdom if it forbids the heart to exist.",
        veilHint: "Notice where discernment secretly wants distance from feeling.",
        upright: {
          headline: "The Ice-Edged Queen",
          summary: "Her clarity is immaculate, but warmth may be exiled.",
          meaning:
            "You may see the situation accurately and still be using truth as a way to remain unreachable. The Blood Moon asks whether your boundary protects tenderness or refuses it.",
          shadow: "Discernment freezes into superiority.",
          mask: "I am simply being clear.",
          wound: "A grief that made vulnerability feel foolish.",
          work: "Keep the boundary and let one honest feeling stand beside it.",
          veilHint: "Even the cleanest blade casts a cold shadow.",
          reflection: "What tenderness am I protecting by appearing untouchable?",
          thread: "The queen raises her sword; the room lowers its warmth."
        },
        reversed: {
          headline: "The Cutting Judgment",
          summary: "Pain speaks through precision and calls itself wisdom.",
          meaning:
            "Judgment, bitterness, or emotional distance may be shaping your truth. Look for the hurt beneath the verdict before the blade becomes your only language.",
          shadow: "The mind punishes what the heart is afraid to need.",
          mask: "I have standards.",
          wound: "Old betrayal turning independence into exile.",
          work: "Separate the boundary from the contempt and speak from the cleaner place.",
          veilHint: "The locked gate may be protecting an abandoned garden.",
          reflection: "Where has my no become a way to never risk yes?",
          thread: "The verdict falls; the hidden wound signs it."
        }
      }
    },
    king: {
      keywords: ["authority", "logic", "strategy", "ethics", "discipline", "judgment"],
      shortMeaning: "Disciplined thought brings ethical clarity, strategy, and responsible authority.",
      summary:
        "The King of Swords is the mind seated in mature authority. He brings logic, strategy, ethical judgment, and the responsibility to use reason in service of truth rather than control.",
      uprightMeaning: "Authority, logic, strategy, ethical clarity, and disciplined thought.",
      shadowMeaning: "Control through intellect, emotional distance, rigid judgment, or power hiding behind reason.",
      reflectionQuestion: "How can my reason serve truth without controlling what is human?",
      themes: ["authority", "logic", "strategy", "ethics"],
      archetype: "The Ethical Judge",
      energy: "balanced",
      upright: {
        summary: "The mind is called to lead with discipline, fairness, and restraint.",
        meaning:
          "Use clear thinking, structure, and ethical judgment. This card supports strategy, counsel, decisions, and leadership that protects truth without becoming detached from impact.",
        reflection: "What decision would be both logical and honorable?",
        keywords: ["authority", "logic", "strategy", "ethics", "discipline", "judgment"]
      },
      reversed: {
        summary: "Reason may be turning rigid, controlling, or severed from emotional truth.",
        meaning:
          "Examine where intellect is being used to dominate, dismiss, or distance. Wisdom needs feeling to remain human.",
        reflection: "Where am I hiding power behind reason?",
        shadow: "Control, rigidity, manipulation through logic, emotional distance, or unethical authority."
      },
      bloodMoon: {
        shortMeaning: "Reason becomes a throne when intellect is used to control the room.",
        summary:
          "Under the Blood Moon, the King of Swords reveals control through intellect, rigid judgment, and power hiding behind reason. The argument may be flawless while the heart is absent.",
        shadowMessage: "Logic without humility can become law without mercy.",
        veilHint: "Watch who is silenced by the structure of your reason.",
        upright: {
          headline: "The Iron Verdict",
          summary: "Authority speaks with precision, but control may sit behind the words.",
          meaning:
            "You may hold knowledge, strategy, or decision-making power. The Blood Moon asks whether reason is serving justice or arranging the room so no one can challenge you.",
          shadow: "Intellect becomes domination with clean hands.",
          mask: "I am only being rational.",
          wound: "Fear that emotion will weaken authority or expose need.",
          work: "Invite lived truth into the logic and let ethics include impact.",
          veilHint: "A perfect argument can still be a locked door.",
          reflection: "Where does my reasoning protect power more than truth?",
          thread: "The king signs the verdict; the silenced heart reads the fine print."
        },
        reversed: {
          headline: "The Cold Law",
          summary: "Rigid judgment reveals the fear underneath control.",
          meaning:
            "A system, decision, or authority pattern may be using logic to dismiss emotion, complexity, or accountability. The medicine is humility: reason must answer to truth beyond its own architecture.",
          shadow: "The mind builds a court where it can never be accused.",
          mask: "Facts do not care about feelings.",
          wound: "A learned distrust of vulnerability and relational consequence.",
          work: "Admit the emotional stake and revise the judgment with humanity included.",
          veilHint: "The law cracks where life was excluded.",
          reflection: "What human truth have I ruled inadmissible?",
          thread: "The crown of air grows heavy; the verdict starts to frost."
        }
      }
    }
  };

  const minorSuitMeanings = {
    cups: cupsMeanings,
    wands: wandsMeanings,
    pentacles: pentaclesMeanings,
    swords: swordsMeanings
  };

  function cloneData(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function getMajorFilename(card) {
    return `${String(card.number).padStart(2, "0")}-${slugify(card.name)}.png`;
  }

  function getMinorFilename(rank, suit) {
    return `${String(rank.number).padStart(2, "0")}-${rank.rank}-of-${suit}.png`;
  }

  function getNormalizedMajorCard(card) {
    return typeof withOrientationMeanings === "function"
      ? withOrientationMeanings(card)
      : card;
  }

  const astralVeilTarotMajorCards = majorArcanaCards.map((card) => {
    const clonedCard = cloneData(getNormalizedMajorCard(card));

    return {
      ...clonedCard,
      image: `${deckRoots.tarot}/major/${getMajorFilename(card)}`,
      meaning: clonedCard.shortMeaning
    };
  });

  const astralVeilCrimsonMajorCards = majorArcanaCards.map((card) => {
    const clonedCard = cloneData(getNormalizedMajorCard(card));

    return {
      ...clonedCard,
      id: `astral-veil-crimson-${card.id}`,
      originalCardId: card.id,
      image: `${deckRoots.crimson}/major/${getMajorFilename(card)}`,
      meaning: clonedCard.bloodMoon?.shortMeaning || clonedCard.shortMeaning,
      isBloodMoonCard: true
    };
  });

  function createMinorMeaning({ title, isCrimson }) {
    const placeholder = "Meaning coming soon.";
    const reflection = "Reflection coming soon.";

    return {
      upright: {
        headline: placeholder,
        summary: placeholder,
        meaning: placeholder,
        reflection,
        shadow: placeholder,
        mask: isCrimson ? placeholder : "",
        wound: isCrimson ? placeholder : "",
        work: isCrimson ? placeholder : "",
        veilHint: reflection,
        thread: placeholder,
        keywords: placeholder
      },
      reversed: {
        headline: placeholder,
        summary: placeholder,
        meaning: placeholder,
        reflection,
        shadow: placeholder,
        mask: isCrimson ? placeholder : "",
        wound: isCrimson ? placeholder : "",
        work: isCrimson ? placeholder : "",
        veilHint: reflection,
        thread: placeholder
      },
      bloodMoon: {
        shortMeaning: placeholder,
        summary: placeholder,
        shadowMessage: placeholder,
        veilHint: reflection,
        upright: {
          headline: placeholder,
          summary: placeholder,
          meaning: placeholder,
          shadow: placeholder,
          reflection,
          mask: placeholder,
          wound: placeholder,
          work: placeholder,
          veilHint: reflection,
          thread: placeholder
        },
        reversed: {
          headline: placeholder,
          summary: placeholder,
          meaning: placeholder,
          shadow: placeholder,
          reflection,
          mask: placeholder,
          wound: placeholder,
          work: placeholder,
          veilHint: reflection,
          thread: placeholder
        }
      }
    };
  }

  function createMinorCard(suit, rank, { isCrimson = false } = {}) {
    const suitTitle = suit.charAt(0).toUpperCase() + suit.slice(1);
    const name = `${rank.title} of ${suitTitle}`;
    const id = `${suit}-${String(rank.number).padStart(2, "0")}-${slugify(name)}`;
    const root = isCrimson ? deckRoots.crimson : deckRoots.tarot;
    const meaning = createMinorMeaning({ title: name, isCrimson });
    const suitMeaning = minorSuitMeanings[suit]?.[rank.rank] || null;

    return {
      id: isCrimson ? `astral-veil-crimson-${id}` : id,
      originalCardId: id,
      number: rank.number,
      name,
      keywords: suitMeaning?.keywords || ["meaning coming soon"],
      shortMeaning: suitMeaning?.shortMeaning || "Meaning coming soon.",
      summary: suitMeaning?.summary || "Meaning coming soon.",
      uprightMeaning: suitMeaning?.uprightMeaning || "Meaning coming soon.",
      shadowMeaning: suitMeaning?.shadowMeaning || "Meaning coming soon.",
      reflectionQuestion: suitMeaning?.reflectionQuestion || "Reflection coming soon.",
      themes: suitMeaning?.themes || [suit, rank.rank],
      archetype: suitMeaning?.archetype || name,
      energy: suitMeaning?.energy || "neutral",
      image: `${root}/${suit}/${getMinorFilename(rank, suit)}`,
      upright: suitMeaning?.upright || meaning.upright,
      reversed: suitMeaning?.reversed || meaning.reversed,
      bloodMoon: suitMeaning?.bloodMoon || meaning.bloodMoon,
      isBloodMoonCard: isCrimson
    };
  }

  const astralVeilTarotMinorCards = minorSuits.flatMap((suit) =>
    minorRanks.map((rank) => createMinorCard(suit, rank))
  );

  const astralVeilCrimsonMinorCards = minorSuits.flatMap((suit) =>
    minorRanks.map((rank) => createMinorCard(suit, rank, { isCrimson: true }))
  );

  const astralVeilTarotCards = [
    ...astralVeilTarotMajorCards,
    ...astralVeilTarotMinorCards
  ];

  const astralVeilCrimsonCards = [
    ...astralVeilCrimsonMajorCards,
    ...astralVeilCrimsonMinorCards
  ];

  const astralVeilTarotDeck = {
    id: "astralVeilTarot",
    name: "Veilrise Arcana",
    cards: astralVeilTarotCards
  };

  const astralVeilCrimsonDeck = {
    id: "astralVeilCrimson",
    name: "Veilfall Arcana",
    cards: astralVeilCrimsonCards
  };

  if (typeof window !== "undefined") {
    window.astralVeilTarotCards = astralVeilTarotCards;
    window.astralVeilCrimsonCards = astralVeilCrimsonCards;
    window.astralVeilTarotDeck = astralVeilTarotDeck;
    window.astralVeilCrimsonDeck = astralVeilCrimsonDeck;
  }
})();
