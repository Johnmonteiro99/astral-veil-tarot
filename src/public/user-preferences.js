import { getCurrentUser } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

export const userPreferenceDefaults = {
  allow_reversed_cards: false,
  save_readings_prompt: true,
  reduce_motion: false,
  disable_glow_effects: false,
  default_reading_mode: 'last_used',
};

const validReadingModes = new Set(['last_used', 'sun', 'moon']);
export const disableGlowPreferenceStorageKey = 'astralVeilDisableGlowEffects';
let cachedPreferences = null;
let cachedUserId = undefined;
let preferencesPromise = null;

function getProfilePreferences(profile) {
  return profile?.preferences && typeof profile.preferences === 'object' && !Array.isArray(profile.preferences)
    ? profile.preferences
    : {};
}

function readStoredDisableGlowPreference() {
  try {
    return localStorage.getItem(disableGlowPreferenceStorageKey) === 'true';
  } catch (error) {
    return false;
  }
}

function writeStoredDisableGlowPreference(isDisabled) {
  try {
    localStorage.setItem(disableGlowPreferenceStorageKey, isDisabled ? 'true' : 'false');
  } catch (error) {
    return;
  }
}

function getLocalPreferenceDefaults() {
  return {
    ...userPreferenceDefaults,
    disable_glow_effects: readStoredDisableGlowPreference(),
  };
}

export function normalizeUserPreferences(preferences = {}) {
  const defaultReadingMode = String(preferences.default_reading_mode || '').trim().toLowerCase();

  return {
    allow_reversed_cards: preferences.allow_reversed_cards === true,
    save_readings_prompt: preferences.save_readings_prompt !== false,
    reduce_motion: preferences.reduce_motion === true,
    disable_glow_effects: preferences.disable_glow_effects === true,
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

  if (Object.prototype.hasOwnProperty.call(preferences, 'disable_glow_effects')) {
    normalizedPreferences.disable_glow_effects = preferences.disable_glow_effects === true;
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

export function applyGlowEffectsPreference(preferences = cachedPreferences || getLocalPreferenceDefaults()) {
  const normalizedPreferences = normalizeUserPreferences(preferences);
  const shouldDisableGlow = normalizedPreferences.disable_glow_effects;

  document.documentElement.classList.toggle('no-glow', shouldDisableGlow);
  document.body?.classList.toggle('no-glow', shouldDisableGlow);
  document.documentElement.dataset.disableGlowEffects = shouldDisableGlow ? 'true' : 'false';
  writeStoredDisableGlowPreference(shouldDisableGlow);
}

export function applyUserPreferences(preferences = cachedPreferences || getLocalPreferenceDefaults()) {
  applyReduceMotionPreference(preferences);
  applyGlowEffectsPreference(preferences);
}

export function getCachedUserPreferences() {
  return cachedPreferences || getLocalPreferenceDefaults();
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
      cachedPreferences = getLocalPreferenceDefaults();
      applyUserPreferences(cachedPreferences);
      return cachedPreferences;
    }

    const { user, error: userError } = await getCurrentUser();

    if (userError || !user) {
      cachedUserId = user?.id || null;
      cachedPreferences = getLocalPreferenceDefaults();
      applyUserPreferences(cachedPreferences);
      return cachedPreferences;
    }

    const supabase = getSupabaseClient();

    if (!supabase) {
      cachedUserId = user.id;
      cachedPreferences = getLocalPreferenceDefaults();
      applyUserPreferences(cachedPreferences);
      return cachedPreferences;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .maybeSingle();

    cachedUserId = user.id;
    cachedPreferences = error
      ? getLocalPreferenceDefaults()
      : normalizeUserPreferences(getProfilePreferences(data));
    applyUserPreferences(cachedPreferences);
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
  applyUserPreferences(cachedPreferences);
  return { preferences: cachedPreferences, error: null };
}

window.AstralVeilUserPreferences = {
  applyGlowEffectsPreference,
  applyReduceMotionPreference,
  applyUserPreferences,
  disableGlowPreferenceStorageKey,
  getCachedUserPreferences,
  loadCurrentUserPreferences,
  normalizeUserPreferences,
  saveCurrentUserPreferences,
  userPreferenceDefaults,
};

applyUserPreferences(getLocalPreferenceDefaults());
