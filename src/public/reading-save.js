import { getCurrentUser } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

const FREE_SAVED_READING_LIMIT = 25;

const readingSaveState = {
  currentReading: null,
  currentUser: undefined,
  savedReadingKeys: new Set(),
  savingReadingKeys: new Set(),
};

async function getCachedCurrentUser() {
  if (typeof readingSaveState.currentUser !== 'undefined') {
    return readingSaveState.currentUser;
  }

  if (!isSupabaseConfigured()) {
    readingSaveState.currentUser = null;
    return null;
  }

  const { user, error } = await getCurrentUser();

  readingSaveState.currentUser = error ? null : user;
  return readingSaveState.currentUser;
}

function getSaveContainer() {
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
      <a href="auth.html">Log in</a>
    </p>
  `;
}

function renderSaveButton(container, readingKey) {
  const isSaved = readingSaveState.savedReadingKeys.has(readingKey);
  const isSaving = readingSaveState.savingReadingKeys.has(readingKey);

  container.innerHTML = `
    <button class="primary-action reading-save-panel__button" type="button" data-save-reading ${isSaved || isSaving ? 'disabled' : ''}>
      ${isSaved ? 'Reading Saved' : isSaving ? 'Saving...' : 'Save Reading'}
    </button>
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

  if (!user) {
    renderLoginPrompt(container);
    return;
  }

  renderSaveButton(container, reading.reading_key);
}

async function saveCurrentReading() {
  const reading = readingSaveState.currentReading;
  const container = getSaveContainer();

  if (!reading || !container || readingSaveState.savedReadingKeys.has(reading.reading_key)) {
    return;
  }

  const user = await getCachedCurrentUser();
  const supabase = getSupabaseClient();

  if (!user || !supabase) {
    renderLoginPrompt(container);
    return;
  }

  readingSaveState.savingReadingKeys.add(reading.reading_key);
  renderSaveButton(container, reading.reading_key);

  const { count, error: countError } = await getSavedReadingCount(supabase, user.id);

  if (countError) {
    readingSaveState.savingReadingKeys.delete(reading.reading_key);
    renderSaveButton(container, reading.reading_key);
    showSaveStatus(container, 'We could not check your Archive space. Please try again.', { isError: true });
    return;
  }

  if (count >= FREE_SAVED_READING_LIMIT) {
    readingSaveState.savingReadingKeys.delete(reading.reading_key);
    renderSaveButton(container, reading.reading_key);
    showSaveStatus(
      container,
      'Your Archive can hold 25 saved readings for now. Delete older readings or expand your Archive when upgrades become available.',
      { isError: true }
    );
    return;
  }

  const { error } = await supabase
    .from('user_readings')
    .insert(buildReadingInsert(reading, user.id));

  readingSaveState.savingReadingKeys.delete(reading.reading_key);

  if (error) {
    renderSaveButton(container, reading.reading_key);
    showSaveStatus(container, 'We could not save this reading. Please try again.', { isError: true });
    return;
  }

  readingSaveState.savedReadingKeys.add(reading.reading_key);
  renderSaveButton(container, reading.reading_key);
}

window.addEventListener('astralveil:reading-completed', (event) => {
  const reading = event.detail;

  if (!reading?.reading_key) {
    return;
  }

  readingSaveState.currentReading = reading;
  renderReadingSavePanel();
});

document.addEventListener('click', (event) => {
  const saveButton = event.target.closest('[data-save-reading]');

  if (!saveButton) {
    return;
  }

  saveCurrentReading();
});
