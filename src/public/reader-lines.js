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
const DEBUG_READER_LINES = true;

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

function logReaderLineDebug(details = {}) {
  if (!DEBUG_READER_LINES) {
    return;
  }

  console.log({
    rawReaderId: details.rawReaderId || '',
    rawReaderName: details.rawReaderName || '',
    mappedReaderId: details.mappedReaderId || '',
    rawMode: details.rawMode || '',
    normalizedMode: details.normalizedMode || '',
    rowsReturned: details.rowsReturned || 0,
    error: details.error || null,
  });
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
    return '';
  }

  const cacheKey = `${readerId}:${normalizedMode}`;

  if (selectedLineCache.has(cacheKey)) {
    return selectedLineCache.get(cacheKey);
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return '';
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
    selectedLineCache.set(cacheKey, '');
    return '';
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
      selectedLineCache.set(cacheKey, '');
      return '';
    }

    lines = fallbackResult.lines;
  }

  const selectedLine = pickRandomItem(lines)?.line_text || '';

  selectedLineCache.set(cacheKey, selectedLine);
  return selectedLine;
}

window.AstralVeilReaderLines = {
  getReaderIntroLine,
  getReaderLineId,
};

window.dispatchEvent(new CustomEvent('astralveil:reader-lines-ready'));
