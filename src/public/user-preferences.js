import { getCurrentUser } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

export const userPreferenceDefaults = {
  allow_reversed_cards: false,
  save_readings_prompt: true,
  reduce_motion: false,
  default_reading_mode: 'last_used',
};

const validReadingModes = new Set(['last_used', 'sun', 'moon']);
let cachedPreferences = null;
let cachedUserId = undefined;
let preferencesPromise = null;

function getProfilePreferences(profile) {
  return profile?.preferences && typeof profile.preferences === 'object' && !Array.isArray(profile.preferences)
    ? profile.preferences
    : {};
}

export function normalizeUserPreferences(preferences = {}) {
  const defaultReadingMode = String(preferences.default_reading_mode || '').trim().toLowerCase();

  return {
    allow_reversed_cards: preferences.allow_reversed_cards === true,
    save_readings_prompt: preferences.save_readings_prompt !== false,
    reduce_motion: preferences.reduce_motion === true,
    default_reading_mode: validReadingModes.has(defaultReadingMode) ? defaultReadingMode : 'last_used',
  };
}

function normalizePartialUserPreferences(preferences = {}) {
  const normalizedPreferences = {};

  if (Object.prototype.hasOwnProperty.call(preferences, 'allow_reversed_cards')) {
    normalizedPreferences.allow_reversed_cards = preferences.allow_reversed_cards === true;
  }

  if (Object.prototype.hasOwnProperty.call(preferences, 'save_readings_prompt')) {
    normalizedPreferences.save_readings_prompt = preferences.save_readings_prompt !== false;
  }

  if (Object.prototype.hasOwnProperty.call(preferences, 'reduce_motion')) {
    normalizedPreferences.reduce_motion = preferences.reduce_motion === true;
  }

  if (Object.prototype.hasOwnProperty.call(preferences, 'default_reading_mode')) {
    const defaultReadingMode = String(preferences.default_reading_mode || '').trim().toLowerCase();
    normalizedPreferences.default_reading_mode = validReadingModes.has(defaultReadingMode)
      ? defaultReadingMode
      : 'last_used';
  }

  return normalizedPreferences;
}

export function applyReduceMotionPreference(preferences = cachedPreferences || userPreferenceDefaults) {
  const normalizedPreferences = normalizeUserPreferences(preferences);

  document.body?.classList.toggle('reduce-motion', normalizedPreferences.reduce_motion);
  document.documentElement.dataset.reduceMotion = normalizedPreferences.reduce_motion ? 'true' : 'false';
}

export function getCachedUserPreferences() {
  return cachedPreferences || { ...userPreferenceDefaults };
}

export async function loadCurrentUserPreferences({ force = false } = {}) {
  if (!force && cachedPreferences) {
    return cachedPreferences;
  }

  if (!force && preferencesPromise) {
    return preferencesPromise;
  }

  preferencesPromise = (async () => {
    if (!isSupabaseConfigured()) {
      cachedUserId = null;
      cachedPreferences = { ...userPreferenceDefaults };
      applyReduceMotionPreference(cachedPreferences);
      return cachedPreferences;
    }

    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
      cachedUserId = user?.id || null;
      cachedPreferences = { ...userPreferenceDefaults };
      applyReduceMotionPreference(cachedPreferences);
      return cachedPreferences;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      cachedUserId = user.id;
      cachedPreferences = { ...userPreferenceDefaults };
      applyReduceMotionPreference(cachedPreferences);
      return cachedPreferences;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .maybeSingle();

    cachedUserId = user.id;
    cachedPreferences = error
      ? { ...userPreferenceDefaults }
      : normalizeUserPreferences(getProfilePreferences(data));
    applyReduceMotionPreference(cachedPreferences);
    return cachedPreferences;
  })();

  try {
    return await preferencesPromise;
  } finally {
    preferencesPromise = null;
  }
}

export async function saveCurrentUserPreferences(nextPreferences) {
  if (!isSupabaseConfigured()) {
    return { preferences: null, error: new Error('Supabase is not configured.') };
  }

  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { preferences: null, error: userError || new Error('No signed-in user.') };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return { preferences: null, error: new Error('Supabase is not configured.') };
  }

  const { data: profile, error: loadError } = await supabase
    .from('profiles')
    .select('preferences')
    .eq('id', user.id)
    .maybeSingle();

  if (loadError) {
    return { preferences: null, error: loadError };
  }

  const mergedPreferences = {
    ...getProfilePreferences(profile),
    ...normalizePartialUserPreferences(nextPreferences),
  };

  const { error } = await supabase
    .from('profiles')
    .update({ preferences: mergedPreferences })
    .eq('id', user.id);

  if (error) {
    return { preferences: null, error };
  }

  cachedUserId = user.id;
  cachedPreferences = normalizeUserPreferences(mergedPreferences);
  applyReduceMotionPreference(cachedPreferences);
  return { preferences: cachedPreferences, error: null };
}

window.AstralVeilUserPreferences = {
  applyReduceMotionPreference,
  getCachedUserPreferences,
  loadCurrentUserPreferences,
  normalizeUserPreferences,
  saveCurrentUserPreferences,
  userPreferenceDefaults,
};

applyReduceMotionPreference(userPreferenceDefaults);
