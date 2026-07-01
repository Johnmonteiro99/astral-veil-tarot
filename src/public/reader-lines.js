import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

const readerLineIdMap = {
  aries: 'zahira_veyra',
  zahira: 'zahira_veyra',
  zahira_veyra: 'zahira_veyra',
  'zahira-veyra': 'zahira_veyra',
  taurus: 'nadia_vale',
  nadia: 'nadia_vale',
  nadia_vale: 'nadia_vale',
  'nadia-vale': 'nadia_vale',
  gemini: 'eren_astra_auralis',
  eren: 'eren_astra_auralis',
  astra: 'eren_astra_auralis',
  eren_astra_auralis: 'eren_astra_auralis',
  'eren-astra-auralis': 'eren_astra_auralis',
  eren_and_astra_auralis: 'eren_astra_auralis',
  'eren-and-astra-auralis': 'eren_astra_auralis',
  cancer: 'meghan_caelia',
  meghan: 'meghan_caelia',
  meghan_caelia: 'meghan_caelia',
  'meghan-caelia': 'meghan_caelia',
  leo: 'cassian_solari',
  cassian: 'cassian_solari',
  cassian_solari: 'cassian_solari',
  'cassian-solari': 'cassian_solari',
  virgo: 'amara_violeth',
  amara: 'amara_violeth',
  amara_violeth: 'amara_violeth',
  'amara-violeth': 'amara_violeth',
  libra: 'abigail_asteria',
  abigail: 'abigail_asteria',
  abigail_asteria: 'abigail_asteria',
  'abigail-asteria': 'abigail_asteria',
  scorpio: 'zephyra_noctis',
  zephyra: 'zephyra_noctis',
  zephyra_noctis: 'zephyra_noctis',
  'zephyra-noctis': 'zephyra_noctis',
  sagittarius: 'orion_valehart',
  orion: 'orion_valehart',
  orion_valehart: 'orion_valehart',
  'orion-valehart': 'orion_valehart',
  capricorn: 'samira_obsidian',
  samira: 'samira_obsidian',
  samira_obsidian: 'samira_obsidian',
  'samira-obsidian': 'samira_obsidian',
  aquarius: 'lyssara_voss',
  lyssara: 'lyssara_voss',
  lyssara_voss: 'lyssara_voss',
  'lyssara-voss': 'lyssara_voss',
  pisces: 'malakai_nereon',
  malakai: 'malakai_nereon',
  malakai_nereon: 'malakai_nereon',
  'malakai-nereon': 'malakai_nereon',
};

const selectedLineCache = new Map();

const readerIntroLineFallbacks = {
  zahira_veyra: {
    all: [
      'Stand with me for a moment. We are not here to fear the path. We are here to meet it.',
      'You made it here. Good. Now let us find the part of you that already knows how to move.',
    ],
  },
  nadia_vale: {
    all: [
      'Take a breath. Not every answer needs to arrive running.',
      'Let the noise settle. What remains may be enough.',
    ],
  },
  eren_astra_auralis: {
    all: [
      'Eren says one side of the question is speaking too loudly. Astra says the quiet side is not silent.',
      'Bring us the contradiction. We will listen for the third truth between it.',
    ],
  },
  meghan_caelia: {
    all: [
      'Come closer to the tide. Nothing tender in you has to be rushed.',
      'Let the feeling rise without naming it too quickly. The water remembers what the mind edits away.',
    ],
  },
  cassian_solari: {
    all: [
      'Let yourself be seen for one honest breath. The answer does not need you to perform.',
      'Stand where the light can reach you. Courage is allowed to be warm.',
    ],
  },
  amara_violeth: {
    all: [
      'We will begin with the smallest sign. The path often hides inside what is almost overlooked.',
      'Set the question down carefully. Clarity does not need to cut in order to be true.',
    ],
  },
  abigail_asteria: {
    all: [
      'Let the scales become still. The choice will speak when urgency stops leaning on it.',
      'There is a graceful answer here, but grace will not ask you to abandon yourself.',
    ],
  },
  zephyra_noctis: {
    all: [
      'Do not ask unless you are ready to hear what your shadow has been saying all along.',
      'Some truths do not knock. They wait until you stop pretending the door is closed.',
    ],
  },
  orion_valehart: {
    all: [
      'Look toward the horizon inside the question. It already knows which way your courage is facing.',
      'The next step does not need the whole map. It needs one honest star to follow.',
    ],
  },
  samira_obsidian: {
    all: [
      'Stand steady. The answer that can endure will not need to shout.',
      'Bring me the weight of it. We will find the structure strong enough to hold the truth.',
    ],
  },
  lyssara_voss: {
    all: [
      'Step back until the pattern appears. Distance can reveal what urgency keeps blurring.',
      'There is a signal beneath the silence. Let us trace it without forcing it to become noise.',
    ],
  },
  malakai_nereon: {
    all: [
      'Let the symbol surface in its own shape. Dreams rarely arrive in straight lines.',
      'The answer may come as feeling before language. Stay with it until it begins to shimmer.',
    ],
  },
};

function normalizeReaderLineMode(mode) {
  if (!mode) {
    return 'moon';
  }

  const value = String(mode).toLowerCase();
  const normalizedMode = value
    .trim()
    .replace(/[\s_-]+/g, '');

  if (value.includes('blood') || normalizedMode === 'bloodmoon') {
    return 'bloodMoon';
  }

  if (value.includes('blue') || normalizedMode === 'bluemoon') {
    return 'blueMoon';
  }

  if (normalizedMode === 'all') {
    return 'all';
  }

  if (normalizedMode === 'moon') {
    return 'moon';
  }

  return 'sun';
}

function slugifyReaderLineValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeReaderLookupValue(value) {
  return slugifyReaderLineValue(value).replace(/_/g, '-');
}

function getReaderLineId(reader) {
  if (!reader) {
    return '';
  }

  const lookupValues = [
    reader.reader_id,
    reader.readerId,
    reader.id,
    reader.slug,
    reader.key,
    reader.name,
    reader.sign,
    reader.zodiac,
  ];

  for (const value of lookupValues) {
    const underscoredValue = slugifyReaderLineValue(value);
    const dashedValue = normalizeReaderLookupValue(value);

    if (readerLineIdMap[underscoredValue]) {
      return readerLineIdMap[underscoredValue];
    }

    if (readerLineIdMap[dashedValue]) {
      return readerLineIdMap[dashedValue];
    }
  }

  return slugifyReaderLineValue(reader.name);
}

function pickRandomItem(items) {
  if (!Array.isArray(items) || !items.length) {
    return null;
  }

  return items[Math.floor(Math.random() * items.length)];
}

function getReaderIntroFallbackLines(reader, normalizedMode = 'moon') {
  const readerId = getReaderLineId(reader);
  const fallback = readerIntroLineFallbacks[readerId] || {};
  const modeLines = Array.isArray(fallback[normalizedMode]) ? fallback[normalizedMode] : [];
  const allLines = Array.isArray(fallback.all) ? fallback.all : [];
  const readerLines = Array.isArray(reader?.heroLines)
    ? reader.heroLines
    : Array.isArray(reader?.lines)
      ? reader.lines
      : [];

  if (modeLines.length) {
    return modeLines;
  }

  if (allLines.length) {
    return allLines;
  }

  return readerLines;
}

function getReaderIntroFallbackLine({ reader, mode } = {}) {
  const normalizedMode = normalizeReaderLineMode(mode);
  const fallbackLines = getReaderIntroFallbackLines(reader, normalizedMode);
  const selectedFallback = pickRandomItem(fallbackLines);

  if (selectedFallback) {
    return selectedFallback;
  }

  if (normalizedMode === 'bloodMoon') {
    const bloodMoonLine = pickRandomItem(reader?.bloodMoonHeroLines) ||
      pickRandomItem(reader?.bloodMoonLines) ||
      pickRandomItem(reader?.bloodMoonQuotes);

    if (bloodMoonLine) {
      return bloodMoonLine;
    }
  }

  return reader?.heroLine || reader?.subtitle || reader?.description || '';
}

function logReaderLineDebug(details = {}) {
  void details;
}

async function fetchReaderIntroLines(supabase, { reader, readerId, rawMode, normalizedMode, modes }) {
  const { data, error } = await supabase
    .from('reader_lines')
    .select('id, reader_id, mode, context, line_text, sort_order')
    .eq('reader_id', readerId)
    .eq('context', 'reading_intro')
    .eq('is_active', true)
    .in('mode', modes)
    .order('sort_order', { ascending: true });

  logReaderLineDebug({
    rawReaderId: reader?.id || reader?.slug || reader?.key || '',
    rawReaderName: reader?.name || '',
    mappedReaderId: readerId,
    rawMode,
    normalizedMode,
    rowsReturned: Array.isArray(data) ? data.length : 0,
    error: error?.message || null,
  });

  if (error) {
    const hasPublicFallback = getReaderIntroFallbackLines(reader, normalizedMode).length > 0;

    if (!hasPublicFallback) {
      console.warn('Unable to load reader intro line.', {
        rawReaderId: reader?.id || reader?.slug || reader?.key || '',
        rawReaderName: reader?.name || '',
        mappedReaderId: readerId,
        rawMode,
        normalizedMode,
        modes,
        errorMessage: error.message,
        error,
      });
    }

    return { lines: [], error };
  }

  return {
    lines: Array.isArray(data) ? data.filter((line) => line.line_text) : [],
    error: null,
  };
}

async function getReaderIntroLine({ reader, mode } = {}) {
  const readerId = getReaderLineId(reader);
  const normalizedMode = normalizeReaderLineMode(mode);
  const rawMode = mode || '';

  if (!readerId || !isSupabaseConfigured()) {
    logReaderLineDebug({
      rawReaderId: reader?.id || reader?.slug || reader?.key || '',
      rawReaderName: reader?.name || '',
      mappedReaderId: readerId,
      rawMode,
      normalizedMode,
      rowsReturned: 0,
      error: isSupabaseConfigured() ? null : 'Supabase is not configured.',
    });
    return getReaderIntroFallbackLine({ reader, mode });
  }

  const cacheKey = `${readerId}:${normalizedMode}`;

  if (selectedLineCache.has(cacheKey)) {
    return selectedLineCache.get(cacheKey);
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return getReaderIntroFallbackLine({ reader, mode });
  }

  const preferredModes = normalizedMode === 'bloodMoon'
    ? ['bloodMoon']
    : [normalizedMode, 'all'];

  const preferredResult = await fetchReaderIntroLines(supabase, {
    reader,
    readerId,
    rawMode,
    normalizedMode,
    modes: preferredModes,
  });

  if (preferredResult.error) {
    return getReaderIntroFallbackLine({ reader, mode });
  }

  let lines = preferredResult.lines;

  if (normalizedMode !== 'bloodMoon') {
    const exactModeLines = lines.filter((line) => line.mode === normalizedMode);
    lines = exactModeLines.length ? exactModeLines : lines.filter((line) => line.mode === 'all');
  }

  if (!lines.length && normalizedMode === 'bloodMoon') {
    const fallbackResult = await fetchReaderIntroLines(supabase, {
      reader,
      readerId,
      rawMode,
      normalizedMode,
      modes: ['all'],
    });

    if (fallbackResult.error) {
      return getReaderIntroFallbackLine({ reader, mode });
    }

    lines = fallbackResult.lines;
  }

  const selectedDatabaseLine = pickRandomItem(lines)?.line_text || '';
  const selectedLine = selectedDatabaseLine || getReaderIntroFallbackLine({ reader, mode });

  if (selectedDatabaseLine) {
    selectedLineCache.set(cacheKey, selectedDatabaseLine);
  }

  return selectedLine;
}

window.AstralVeilReaderLines = {
  getReaderIntroLine,
  getReaderIntroFallbackLine,
  getReaderLineId,
};

window.dispatchEvent(new CustomEvent('astralveil:reader-lines-ready'));
