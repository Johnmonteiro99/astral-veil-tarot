import { getBannedAccountMessage, requireAllowedAccount } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';
import { checkGalleryFragmentUnlock } from './progression.js';
import { loadCurrentUserPreferences } from './user-preferences.js';

const FREE_SAVED_READING_LIMIT = 25;

const readingSaveState = {
  currentReading: null,
  currentAccount: undefined,
  currentUser: undefined,
  savedReadingIds: new Map(),
  savedReadingKeys: new Set(),
  savingReadingKeys: new Set(),
  checkedGalleryUnlockReadingKeys: new Set(),
};

async function getCachedCurrentUser() {
  if (typeof readingSaveState.currentUser !== 'undefined') {
    return readingSaveState.currentUser;
  }

  if (!isSupabaseConfigured()) {
    readingSaveState.currentAccount = null;
    readingSaveState.currentUser = null;
    return null;
  }

  const account = await requireAllowedAccount({ signOutBanned: true });

  readingSaveState.currentAccount = account;
  readingSaveState.currentUser = account.allowed ? account.user : null;
  return readingSaveState.currentUser;
}

async function getAuthenticatedUserForSave() {
  if (!isSupabaseConfigured()) {
    readingSaveState.currentAccount = null;
    readingSaveState.currentUser = null;
    return null;
  }

  // Resolve the user again immediately before a private write. This validates
  // the current Supabase session instead of relying on page or storage state.
  const account = await requireAllowedAccount({ signOutBanned: true });
  readingSaveState.currentAccount = account;
  readingSaveState.currentUser = account.allowed ? account.user : null;
  return readingSaveState.currentUser;
}

// Saved readings are account-bound private data. Every query includes user_id,
// and Supabase RLS must enforce the same owner check server-side.
function getSaveContainer() {
  const threadSection = document.querySelector('[data-reading-thread-section]');
  if (threadSection) {
    const saveActionRow = threadSection.querySelector('[data-reading-save-actions]');

    if (!saveActionRow) {
      return null;
    }

    let container = saveActionRow.querySelector('[data-reading-save-panel]');

    if (!container) {
      const legacyContainer = threadSection.querySelector('[data-reading-save-panel]');

      if (legacyContainer) {
        legacyContainer.remove();
      }

      container = document.createElement('aside');
      container.className = 'reading-save-panel';
      container.dataset.readingSavePanel = '';
      saveActionRow.append(container);
    }

    return container;
  }

  const reveals = document.querySelector('[data-reading-reveals]');

  if (!reveals) {
    return null;
  }

  let container = reveals.querySelector('[data-reading-save-panel]');

  if (!container) {
    container = document.createElement('aside');
    container.className = 'reading-save-panel';
    container.dataset.readingSavePanel = '';
    reveals.append(container);
  }

  return container;
}

function renderLoginPrompt(container) {
  container.innerHTML = `
    <p class="reading-save-panel__prompt">
      Log in to save this reading.
      <a href="/login?returnTo=${encodeURIComponent(window.location.pathname + window.location.search + window.location.hash)}">Log in</a>
    </p>
  `;
}

function renderBannedPrompt(container) {
  container.innerHTML = `
    <p class="reading-save-panel__prompt reading-save-panel__prompt--error">
      ${getBannedAccountMessage()}
    </p>
  `;
}

function renderSaveButton(container, readingKey) {
  const isSaved = readingSaveState.savedReadingKeys.has(readingKey);
  const isSaving = readingSaveState.savingReadingKeys.has(readingKey);
  const bloodMoon = document.body.classList.contains('blood-moon-mode');
  const reflectLabel = bloodMoon ? 'Write What This Exposed' : 'Reflect in Journal';

  container.innerHTML = `
    <div class="reading-actions reading-actions-primary reading-save-panel__actions">
      <button class="primary-action reading-actions__button reading-save-panel__button" type="button" data-save-reading ${isSaved || isSaving ? 'disabled' : ''}>
        ${isSaved ? 'Reading Saved' : isSaving ? 'Saving...' : 'Save Reading'}
      </button>
      <button class="primary-action reading-actions__button reading-save-panel__button" type="button" data-reflect-reading ${isSaving ? 'disabled' : ''}>
        ${reflectLabel}
      </button>
    </div>
    <p class="reading-save-panel__status" data-reading-save-status aria-live="polite">
      ${isSaved ? 'Reading saved to your Archive.' : ''}
    </p>
  `;
}

function buildReadingInsert(reading, userId) {
  return {
    user_id: userId,
    reader_key: reading.reader_key || null,
    reader_name: reading.reader_name || null,
    mode_key: reading.mode_key || null,
    spread_type: reading.spread_type || null,
    card_count: reading.card_count || null,
    cards: Array.isArray(reading.cards) ? reading.cards : [],
    result_summary: reading.result_summary || null,
    metadata: {
      ...(reading.metadata || {}),
      reading_source: 'standard',
      reading_key: reading.reading_key || null,
      ai_generated: false,
      requires_credits: false,
    },
    is_saved: true,
  };
}

async function getSavedReadingCount(supabase, userId) {
  const { count, error } = await supabase
    .from('user_readings')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_saved', true);

  return { count: count || 0, error };
}

async function findSavedReadingId(supabase, userId, readingKey) {
  if (!readingKey) {
    return null;
  }

  if (readingSaveState.savedReadingIds.has(readingKey)) {
    return readingSaveState.savedReadingIds.get(readingKey);
  }

  const { data, error } = await supabase
    .from('user_readings')
    .select('id, metadata')
    .eq('user_id', userId)
    .eq('is_saved', true)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Saved reading lookup failed:', error);
    return null;
  }

  const match = (data || []).find((reading) => reading?.metadata?.reading_key === readingKey);

  if (match?.id) {
    readingSaveState.savedReadingIds.set(readingKey, match.id);
    readingSaveState.savedReadingKeys.add(readingKey);
  }

  return match?.id || null;
}

function showSaveStatus(container, message, { isError = false } = {}) {
  const status = container.querySelector('[data-reading-save-status]');

  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

async function renderReadingSavePanel() {
  const reading = readingSaveState.currentReading;
  const container = getSaveContainer();

  if (!reading || !container) {
    return;
  }

  const user = await getCachedCurrentUser();

  if (readingSaveState.currentAccount?.reason === 'banned') {
    renderBannedPrompt(container);
    return;
  }

  if (!user) {
    renderLoginPrompt(container);
    return;
  }

  const preferences = await loadCurrentUserPreferences();

  if (preferences.save_readings_prompt === false) {
    container.innerHTML = '';
    return;
  }

  renderSaveButton(container, reading.reading_key);
}

async function saveCurrentReading({ redirectToJournal = false } = {}) {
  const reading = readingSaveState.currentReading;
  const container = getSaveContainer();

  if (!reading || !container) {
    return null;
  }

  const readingKey = reading.reading_key;

  // This lock must happen before any awaited lookup. Rendering the disabled
  // state alone cannot prevent two rapid delegated click events from starting
  // separate requests.
  if (readingSaveState.savingReadingKeys.has(readingKey)) {
    return null;
  }

  readingSaveState.savingReadingKeys.add(readingKey);
  renderSaveButton(container, readingKey);

  const user = await getAuthenticatedUserForSave();
  const supabase = getSupabaseClient();

  if (readingSaveState.currentAccount?.reason === 'banned') {
    readingSaveState.savingReadingKeys.delete(readingKey);
    renderBannedPrompt(container);
    return null;
  }

  if (!user || !supabase) {
    readingSaveState.savingReadingKeys.delete(readingKey);
    renderLoginPrompt(container);
    return null;
  }

  const existingReadingId = await findSavedReadingId(supabase, user.id, readingKey);

  if (existingReadingId) {
    readingSaveState.savingReadingKeys.delete(readingKey);
    renderSaveButton(container, readingKey);
    if (redirectToJournal) {
      window.location.href = `/journal?readingId=${encodeURIComponent(existingReadingId)}`;
    }
    return existingReadingId;
  }

  const { count, error: countError } = await getSavedReadingCount(supabase, user.id);

  if (countError) {
    console.error('Saved reading count failed:', countError);
    readingSaveState.savingReadingKeys.delete(readingKey);
    renderSaveButton(container, readingKey);
    showSaveStatus(container, 'We could not check your Archive space. Please try again.', { isError: true });
    return null;
  }

  if (count >= FREE_SAVED_READING_LIMIT) {
    readingSaveState.savingReadingKeys.delete(readingKey);
    renderSaveButton(container, readingKey);
    showSaveStatus(
      container,
      'Your Archive can hold 25 saved readings for now. Delete older readings or expand your Archive when upgrades become available.',
      { isError: true }
    );
    return null;
  }

  const { data, error } = await supabase
    .from('user_readings')
    .insert(buildReadingInsert(reading, user.id))
    .select('id')
    .single();

  readingSaveState.savingReadingKeys.delete(readingKey);

  if (error) {
    console.error('Saved reading insert failed', {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      status: error?.status,
    });
    renderSaveButton(container, readingKey);
    showSaveStatus(container, 'We could not save this reading. Please try again.', { isError: true });
    return null;
  }

  if (!data?.id) {
    console.error('Saved reading insert returned no row:', { readingKey, userId: user.id });
    renderSaveButton(container, readingKey);
    showSaveStatus(container, 'We could not confirm this reading was saved. Please try again.', { isError: true });
    return null;
  }

  readingSaveState.savedReadingIds.set(readingKey, data.id);
  readingSaveState.savedReadingKeys.add(readingKey);
  renderSaveButton(container, readingKey);
  if (redirectToJournal) {
    window.location.href = `/journal?readingId=${encodeURIComponent(data.id)}`;
  }
  return data.id;
}

window.addEventListener('astralveil:reading-completed', (event) => {
  const reading = event.detail;

  if (!reading?.reading_key) {
    return;
  }

  readingSaveState.currentReading = reading;
  if (!readingSaveState.checkedGalleryUnlockReadingKeys.has(reading.reading_key)) {
    readingSaveState.checkedGalleryUnlockReadingKeys.add(reading.reading_key);
    checkGalleryFragmentUnlock('bloodmoon_zephyra_death_sun', '', { reading }).catch((error) => {
      console.warn('[Astral Veil progression] Reading fragment unlock check failed.', error);
    });
  }
  renderReadingSavePanel();
});

document.addEventListener('click', (event) => {
  const saveButton = event.target.closest('[data-save-reading]');
  const reflectButton = event.target.closest('[data-reflect-reading]');

  if (saveButton) {
    saveCurrentReading();
    return;
  }

  if (reflectButton) {
    saveCurrentReading({ redirectToJournal: true });
  }
});
