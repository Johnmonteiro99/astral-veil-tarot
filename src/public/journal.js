import { getCurrentUserWithProfile } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

const returnToStorageKey = 'astralVeilReturnTo';
const shell = document.querySelector('[data-journal-shell]');
const loadingState = document.querySelector('[data-journal-auth-loading]');
const journalForm = document.querySelector('[data-journal-form]');
const saveButton = document.querySelector('[data-journal-save]');
const clearButton = document.querySelector('[data-journal-clear]');
const message = document.querySelector('[data-journal-message]');
const greeting = document.querySelector('[data-journal-greeting]');
const intro = document.querySelector('[data-journal-intro]');
const promptOfDay = document.querySelector('[data-prompt-of-day]');
const mainPrompt = document.querySelector('[data-main-journal-prompt]');
const checkInLabel = document.querySelector('[data-check-in-label]');
const checkInHelper = document.querySelector('[data-check-in-helper]');
const moodSelect = document.querySelector('[data-mood-select]');
const tagWrap = document.querySelector('[data-journal-tags]');
const guidedHelper = document.querySelector('[data-guided-helper]');
const guidedToggle = document.querySelector('[data-guided-toggle]');
const guidedSection = document.querySelector('[data-guided-section]');
const reflectionEditor = document.querySelector('[data-reflection-editor]');
const reflectionHiddenField = document.querySelector('[data-reflection-hidden]');
const guidedModal = document.querySelector('[data-guided-modal]');
const guidedModalDialog = guidedModal?.querySelector('.journal-guided-modal__dialog');
const guidedModalBackdrop = document.querySelector('[data-guided-modal-backdrop]');
const guidedModalTitle = document.querySelector('[data-guided-modal-title]');
const guidedModalSubtitle = document.querySelector('[data-guided-modal-subtitle]');
const guidedModalEyebrow = document.querySelector('[data-guided-modal-eyebrow]');
const guidedQuestionsWrap = document.querySelector('[data-guided-questions]');
const guidedRefresh = document.querySelector('[data-guided-refresh]');
const guidedAddButton = document.querySelector('[data-guided-add]');
const guidedCancelButtons = document.querySelectorAll('[data-guided-modal-cancel]');
const reflectionLength = document.querySelector('[data-reflection-length]');
const privacyReminder = document.querySelector('[data-privacy-reminder]');
const attachedReadingWrap = document.querySelector('[data-attached-reading]');
const recentEntriesWrap = document.querySelector('[data-recent-journal-entries]');
const reminderQuote = document.querySelector('[data-journal-reminder-quote]');
const recentTitle = document.querySelector('[data-recent-title]');
const recentSubtitle = document.querySelector('[data-recent-subtitle]');
const journalVibeSelect = document.querySelector('[data-journal-vibe-select]');
const journalLockModal = document.querySelector('[data-journal-lock-modal]');
const journalLockDialog = journalLockModal?.querySelector('.journal-lock-modal__dialog');
const journalLockEyebrow = document.querySelector('[data-journal-lock-eyebrow]');
const journalLockTitle = document.querySelector('[data-journal-lock-title]');
const journalLockCopy = document.querySelector('[data-journal-lock-copy]');
const journalLockCopySecondary = document.querySelector('[data-journal-lock-copy-secondary]');
const journalLockLogin = document.querySelector('[data-journal-lock-login]');
const journalLockSignup = document.querySelector('[data-journal-lock-signup]');
const journalLockReturn = document.querySelector('[data-journal-lock-return]');

const sunMoonMoods = ['Calm', 'Hopeful', 'Restless', 'Inspired', 'Heavy', 'Confused', 'Grateful', 'Clear'];
const bloodMoonMoods = ['Exposed', 'Raw', 'Angry', 'Numb', 'Haunted', 'Unsettled', 'Avoidant', 'Ready'];
const tagOptions = ['Dream', 'Love', 'Work', 'Fear', 'Healing', 'Reading', 'Memory', 'Shadow', 'Gratitude', 'Question'];
const tagIconMap = {
  Dream: 'dream',
  Love: 'love',
  Work: 'work',
  Fear: 'fear',
  Healing: 'healing',
  Reading: 'reading',
  Memory: 'memory',
  Shadow: 'shadow-bloodmoon',
  Gratitude: 'gratitude',
  Question: 'question',
};
const reflectionReminderQuotes = [
  'Not every thought needs an answer. Some only need a place to land.',
  'The page does not ask you to be finished. It only asks you to begin.',
  'What you write today may become a lantern for the self you meet later.',
  'Even the quietest truth becomes clearer when given room to breathe.',
  'You are allowed to arrive here unfinished.',
];
const fallbackSunMoonQuestions = [
  'What has been sitting on your mind today?',
  'What gave you peace today?',
  'What felt heavier than it looked?',
  'What is something you needed today?',
  'What are you grateful for right now?',
  'What do you wish you could say freely?',
];
const fallbackBloodMoonQuestions = [
  'What truth feels safe enough to name tonight?',
  'What feeling keeps returning, and what might it be asking for?',
  'Where are you ready to be more honest with yourself, gently and without blame?',
  'What does this deeper feeling need before it can soften?',
  'What would help you feel more grounded as you write?',
  'What part of you deserves patience right now?',
];
const fallbackPromptOfDay = 'What part of today asked to be remembered?';
const fallbackBloodMoonPromptOfDay = 'What truth feels safe enough to name tonight?';
const journalVibeStorageKey = 'astralVeilJournalVibe';
const journalVibeOptions = [
  { value: 'default', label: 'Default' },
  { value: 'modern', label: 'Modern' },
  { value: 'gentle', label: 'Gentle' },
  { value: 'poetic', label: 'Poetic' },
  { value: 'handwritten', label: 'Handwritten' },
  { value: 'velvet', label: 'Velvet' },
];
const journalVibeClassPrefix = 'journal-vibe-';
let currentJournalVibe = 'default';

let activeUser = null;
let activeProfile = null;
let attachedReading = null;
let activeQuestions = [];
let confirmedGuidedAnswers = [];
let questionCursor = 0;
let promptRequestToken = 0;
let messageClearTimer = null;
let insertedGuidedBlock = '';

function normalizeJournalVibe(value) {
  return String(value || '').trim().toLowerCase();
}

function isJournalVibe(value) {
  const normalized = normalizeJournalVibe(value);
  return journalVibeOptions.some((option) => option.value === normalized);
}

function getDefaultJournalVibe() {
  return 'default';
}

function getStoredJournalVibe() {
  try {
    return normalizeJournalVibe(localStorage.getItem(journalVibeStorageKey)) || getDefaultJournalVibe();
  } catch {
    return getDefaultJournalVibe();
  }
}

function persistJournalVibe(vibe) {
  try {
    localStorage.setItem(journalVibeStorageKey, vibe);
  } catch {
    // Storage unavailable in some environments; continue silently.
  }
}

function buildJournalVibeOptions() {
  if (!journalVibeSelect) {
    return;
  }

  const current = normalizeJournalVibe(journalVibeSelect.value) || currentJournalVibe;
  journalVibeSelect.innerHTML = journalVibeOptions
    .map((option) => `<option value="${option.value}">${option.label}</option>`)
    .join('');
  journalVibeSelect.value = isJournalVibe(current) ? current : getDefaultJournalVibe();
}

function applyJournalVibe(vibe) {
  const nextVibe = isJournalVibe(vibe) ? normalizeJournalVibe(vibe) : getDefaultJournalVibe();

  journalVibeOptions.forEach((option) => {
    document.body.classList.remove(`${journalVibeClassPrefix}${option.value}`);
  });
  document.body.classList.add(`${journalVibeClassPrefix}${nextVibe}`);

  if (journalVibeSelect) {
    journalVibeSelect.value = nextVibe;
  }

  currentJournalVibe = nextVibe;
  persistJournalVibe(nextVibe);
}

function initializeJournalVibe() {
  buildJournalVibeOptions();
  const storedVibe = getStoredJournalVibe();
  applyJournalVibe(storedVibe);
}

function getCurrentReturnPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function redirectToLogin() {
  const returnTo = getCurrentReturnPath();

  try {
    sessionStorage.setItem(returnToStorageKey, returnTo);
  } catch {
    // Query string returnTo is still enough when sessionStorage is unavailable.
  }

  window.location.replace(`auth.html?returnTo=${encodeURIComponent(returnTo)}`);
}

function getJournalAuthUrl(mode = 'login') {
  const params = new URLSearchParams({
    returnTo: getCurrentReturnPath(),
  });

  if (mode === 'signup') {
    params.set('mode', 'signup');
  }

  return `auth.html?${params.toString()}`;
}

function isBloodMoonMode() {
  return document.body.classList.contains('blood-moon-mode');
}

function isBloodMoonValue(value) {
  return ['bloodmoon', 'blood_moon', 'blood moon'].includes(String(value || '').trim().toLowerCase());
}

function getAttachedReadingMode(reading = attachedReading) {
  const metadata = reading?.metadata && typeof reading.metadata === 'object' ? reading.metadata : {};

  return reading?.mode_key || metadata.mode || '';
}

function isAttachedReadingBloodMoon(reading = attachedReading) {
  return isBloodMoonValue(getAttachedReadingMode(reading));
}

function isReadingReflectionContext() {
  return Boolean(attachedReading);
}

function isReadingReflectionBloodMoon() {
  return isBloodMoonMode() || isAttachedReadingBloodMoon();
}

function getModeValue() {
  if (isBloodMoonMode()) {
    return 'bloodmoon';
  }

  return document.body.classList.contains('sun-mode') ? 'sun' : 'moon';
}

function normalizeJournalModeValue(value, fallback = getModeValue()) {
  const normalized = normalizePromptValue(value, fallback);

  return isBloodMoonValue(normalized) ? 'bloodmoon' : normalized;
}

function getPromptModeValue() {
  if (isBloodMoonMode()) {
    return 'bloodmoon';
  }

  return document.body.classList.contains('sun-mode') ? 'sun' : 'moon';
}

function getPromptModeFilters() {
  const mode = getPromptModeValue();

  if (mode === 'bloodmoon') {
    return ['bloodmoon'];
  }

  if (mode === 'sun') {
    return ['sun', 'lumen', 'all'];
  }

  return ['moon', 'lumen', 'all'];
}

function normalizePromptValue(value, fallback = '') {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
}

function getSelectedMoodKey() {
  return normalizePromptValue(moodSelect?.value || '', 'any') || 'any';
}

function getGuidedPromptType() {
  return isBloodMoonMode() ? 'shadow_question' : 'guided_question';
}

function getProfileValue(profile, user, keys) {
  for (const key of keys) {
    const value = profile?.[key] || user?.user_metadata?.[key];

    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }

  return '';
}

function getDisplayName() {
  return getProfileValue(activeProfile, activeUser, ['display_name', 'name', 'full_name', 'username']) || 'Veilwalker';
}

function getJournalMainPromptText() {
  if (isReadingReflectionContext()) {
    return isReadingReflectionBloodMoon()
      ? 'What did this reading expose?'
      : 'What did this reading reveal to you?';
  }

  return isBloodMoonMode()
    ? 'Write what keeps returning in the dark.'
    : 'Express what the mind is thinking of today.';
}

function getGreetingText() {
  const hour = new Date().getHours();
  const name = getDisplayName();

  if (hour >= 5 && hour < 12) {
    return `Good morning, ${name}.`;
  }

  if (hour >= 12 && hour < 17) {
    return `Good afternoon, ${name}.`;
  }

  if (hour >= 17 && hour < 22) {
    return `Good evening, ${name}.`;
  }

  return `Hope your night is going well, ${name}.`;
}

function applyThemeCopy() {
  const bloodMoon = isBloodMoonMode();

  if (greeting) {
    greeting.textContent = getGreetingText();
  }

  if (intro) {
    intro.textContent = bloodMoon
      ? 'The quiet parts of you have been waiting to speak.'
      : 'A quiet place to check in with yourself.';
  }

  if (promptOfDay) {
    promptOfDay.textContent = bloodMoon ? fallbackBloodMoonPromptOfDay : fallbackPromptOfDay;
  }

  if (mainPrompt) {
    mainPrompt.textContent = getJournalMainPromptText();
  }

  if (checkInLabel) {
    checkInLabel.textContent = bloodMoon
      ? 'What is stirring beneath the surface?'
      : 'How are you feeling today?';
  }

  if (checkInHelper) {
    checkInHelper.textContent = 'Optional - a small check-in for you.';
  }

  if (guidedHelper) {
    guidedHelper.textContent = bloodMoon
      ? 'Need a shadow to follow? The Archive can place deeper questions into your reflection.'
      : 'Need a starting point? The Archive can place a few questions into your reflection.';
  }

  if (guidedToggle) {
    guidedToggle.setAttribute(
      'aria-label',
      bloodMoon ? 'Add shadow reflection questions' : 'Add guided reflection questions',
    );
  }

  if (privacyReminder) {
    privacyReminder.textContent = 'Your entries are private to your Astral Veil account and saved only under your signed-in profile.';
  }

  if (recentTitle) {
    recentTitle.textContent = bloodMoon ? 'Recent Shadows' : 'Recent Reflections';
  }

  if (recentSubtitle) {
    recentSubtitle.textContent = bloodMoon
      ? 'What has already been recorded.'
      : 'A few echoes from your private archive.';
  }
}

function setJournalFieldsLocked(isLocked) {
  const fields = journalForm
    ? Array.from(journalForm.querySelectorAll('input, select, textarea, button'))
    : [];

  fields.forEach((field) => {
    field.disabled = isLocked;
  });

  const editor = getReflectionEditor();
  if (editor) {
    editor.contentEditable = isLocked ? 'false' : 'plaintext-only';
    editor.setAttribute('aria-readonly', String(isLocked));
    editor.tabIndex = isLocked ? -1 : 0;
  }

  shell?.querySelectorAll('a[href]').forEach((link) => {
    if (isLocked) {
      link.dataset.previousTabindex = link.getAttribute('tabindex') || '';
      link.tabIndex = -1;
      return;
    }

    const previousTabindex = link.dataset.previousTabindex;
    if (previousTabindex) {
      link.setAttribute('tabindex', previousTabindex);
    } else {
      link.removeAttribute('tabindex');
    }
    delete link.dataset.previousTabindex;
  });
}

function getJournalLockFocusableElements() {
  if (!journalLockModal || journalLockModal.hidden) {
    return [];
  }

  return Array.from(journalLockModal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
    .filter((element) => !element.hasAttribute('disabled'));
}

function focusJournalLockModal() {
  const firstFocusable = getJournalLockFocusableElements()[0];

  if (firstFocusable) {
    firstFocusable.focus();
    return;
  }

  journalLockDialog?.focus();
}

function getJournalLockCopy() {
  if (isBloodMoonMode()) {
    return {
      eyebrow: 'Private Journal',
      title: 'The Journal Is Sealed',
      copy: 'Blood Moon reflections are not meant to drift unguarded.',
      copySecondary: 'Create an account or log in to keep your shadows, readings, and recovered truths bound safely to you.',
      returnLabel: 'Return to the Veil',
    };
  }

  return {
    eyebrow: 'Private Journal',
    title: 'Your Journal Awaits',
    copy: 'The Astral Veil Journal is a private space for reflection, readings, moods, and moments you want to return to.',
    copySecondary: 'To keep your entries safe and connected to your account, you’ll need to log in or create an account before writing.',
    returnLabel: 'Return to Astral Veil',
  };
}

function renderJournalLockModal() {
  if (!journalLockModal) {
    return;
  }

  const copy = getJournalLockCopy();

  if (journalLockEyebrow) {
    journalLockEyebrow.textContent = copy.eyebrow;
  }
  if (journalLockTitle) {
    journalLockTitle.textContent = copy.title;
  }
  if (journalLockCopy) {
    journalLockCopy.textContent = copy.copy;
  }
  if (journalLockCopySecondary) {
    journalLockCopySecondary.textContent = copy.copySecondary;
  }
  if (journalLockLogin) {
    journalLockLogin.href = getJournalAuthUrl('login');
  }
  if (journalLockSignup) {
    journalLockSignup.href = getJournalAuthUrl('signup');
  }
  if (journalLockReturn) {
    journalLockReturn.href = 'index.html';
    journalLockReturn.textContent = copy.returnLabel;
  }

  journalLockModal.hidden = false;
}

function lockJournalForSignedOutUser() {
  activeUser = null;
  activeProfile = {};

  applyThemeCopy();
  renderMoodOptions();
  renderTags();
  setJournalFieldsLocked(true);

  if (journalForm?.elements.entry_date) {
    journalForm.elements.entry_date.value = getTodayInputValue();
  }
  updateReflectionLength();
  renderRecentEntries([]);
  renderReflectionReminderQuote();

  if (loadingState) {
    loadingState.hidden = true;
  }
  if (shell) {
    shell.hidden = false;
  }

  document.body.classList.add('journal-locked');
  renderJournalLockModal();
  window.requestAnimationFrame(focusJournalLockModal);
}

function renderMoodOptions() {
  if (!moodSelect) {
    return;
  }

  const options = isBloodMoonMode() ? bloodMoonMoods : sunMoonMoods;
  moodSelect.innerHTML = [
    '<option value="">Choose a mood</option>',
    ...options.map((mood) => `<option value="${escapeHtml(mood)}">${escapeHtml(mood)}</option>`),
  ].join('');
}

function renderReflectionReminderQuote() {
  if (!reminderQuote) {
    return;
  }

  const quoteIndex = Math.floor(Math.random() * reflectionReminderQuotes.length);
  reminderQuote.textContent = reflectionReminderQuotes[quoteIndex];
}

function preventPrivateCardDrag(event) {
  if (event.target?.closest?.('[data-private-card="true"], .private-data-card, [data-protected-media="true"], .protected-media')) {
    event.preventDefault();
  }
}

function preventProtectedMediaContextMenu(event) {
  if (event.target?.closest?.('[data-protected-media="true"], .protected-media')) {
    event.preventDefault();
  }
}

function renderTags(selectedTags = []) {
  if (!tagWrap) {
    return;
  }

  const wasOpen = tagWrap.classList.contains('is-open');
  const selectedCount = selectedTags.length;
  const toggleLabel = selectedCount
    ? `Quick Tags (${selectedCount} selected)`
    : 'Quick Tags';

  tagWrap.innerHTML = `
    <legend>Quick Tags</legend>
    <button
      class="journal-tags__toggle"
      type="button"
      aria-expanded="${wasOpen ? 'true' : 'false'}"
      data-journal-tags-toggle
    >
      <span>${escapeHtml(toggleLabel)}</span>
      <span class="journal-tags__toggle-arrow" aria-hidden="true"></span>
    </button>
    <div class="journal-tags__options" data-journal-tags-options>
      ${tagOptions.map((tag) => `
        <label class="journal-tag-option">
          <input type="checkbox" name="tags" value="${escapeHtml(tag)}" ${selectedTags.includes(tag) ? 'checked' : ''} />
          <span class="journal-icon journal-icon--${escapeHtml(tagIconMap[tag] || 'star')}" aria-hidden="true"></span>
          ${escapeHtml(tag)}
        </label>
      `).join('')}
    </div>
  `;

  tagWrap.classList.toggle('is-open', wasOpen);

  const toggle = tagWrap.querySelector('[data-journal-tags-toggle]');
  const updateToggleLabel = () => {
    const count = tagWrap.querySelectorAll('input[name="tags"]:checked').length;
    const label = count ? `Quick Tags (${count} selected)` : 'Quick Tags';
    const labelWrap = toggle?.querySelector('span');

    if (labelWrap) {
      labelWrap.textContent = label;
    }
  };

  tagWrap.onclick = (event) => {
    const toggleButton = event.target.closest('[data-journal-tags-toggle]');

    if (!toggleButton) {
      return;
    }

    const isOpen = tagWrap.classList.toggle('is-open');
    toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };
  tagWrap.querySelector('[data-journal-tags-options]')?.addEventListener('change', updateToggleLabel);
}

function getDefaultTagsForContext() {
  if (!attachedReading) {
    return [];
  }

  const tags = ['Reading'];

  if (isReadingReflectionBloodMoon()) {
    tags.push('Shadow');
  }

  return tags;
}

function setMessage(text, type = '') {
  if (!message) {
    return;
  }

  if (messageClearTimer) {
    window.clearTimeout(messageClearTimer);
    messageClearTimer = null;
  }

  message.textContent = text;
  message.classList.toggle('is-error', type === 'error');
  message.classList.toggle('is-success', type === 'success');

  if (text && type !== 'error') {
    messageClearTimer = window.setTimeout(() => {
      setMessage('');
    }, 3600);
  }
}

function getTodayInputValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseEntryDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatEntryDate(value) {
  const date = parseEntryDate(value) || new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatEntryTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Time unknown';
  }

  return new Intl.DateTimeFormat('en', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function toTitleLabel(value) {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getSelectedTags() {
  return Array.from(journalForm?.querySelectorAll('input[name="tags"]:checked') || [])
    .map((input) => input.value)
    .filter(Boolean);
}

function getGuidedAnswers() {
  return confirmedGuidedAnswers.slice();
}

function getDraftGuidedAnswers() {
  return Array.from(guidedModal?.querySelectorAll('[data-guided-answer]') || [])
    .map((textarea) => ({
      question: textarea.dataset.guidedQuestion || '',
      answer: textarea.value.trim(),
    }))
    .filter((item) => item.question && item.answer);
}

function getReflectionField() {
  return reflectionHiddenField || null;
}

function isGuidedQuestionLine(value) {
  return /^\s*[IVXLCM]+\.\s+/.test(String(value || '').trim());
}

function renderGuidedReflectionDisplay(value) {
  if (!reflectionEditor) {
    return;
  }

  if (!String(value).trim()) {
    reflectionEditor.innerHTML = '';
    return;
  }

  const lines = String(value || '').split('\n');
  let inGuidedQuestionSection = false;
  const rendered = lines
    .map((line, index) => {
      const escaped = escapeHtml(line);
      if (!escaped) {
        return '<span>&nbsp;</span>';
      }

      const trimmedLine = line.trim();
      if (/^(Shadow|Guided) Reflection$/i.test(trimmedLine)) {
        inGuidedQuestionSection = true;
        return escaped;
      }

      if (!inGuidedQuestionSection) {
        return escaped;
      }

      if (trimmedLine === '') {
        return '<span>&nbsp;</span>';
      }

      if (/^Answer:\s*$/i.test(trimmedLine)) {
        return escaped;
      }

      const nextLine = lines[index + 1] || '';
      const nextIsAnswer = /^Answer:\s*$/i.test(String(nextLine).trim());

      return isGuidedQuestionLine(line) && inGuidedQuestionSection && nextIsAnswer
        ? `<span class="journal-reflection__question-line">${escaped}</span>`
        : escaped;
    })
    .join('<br>');

  reflectionEditor.innerHTML = rendered;
}

function setReflectionValue(value, refreshDisplay = true) {
  const nextValue = String(value || '');

  if (reflectionHiddenField) {
    reflectionHiddenField.value = nextValue;
  }

  if (refreshDisplay) {
    renderGuidedReflectionDisplay(nextValue);
  }
}

function syncReflectionFromEditor() {
  if (!reflectionEditor || !reflectionHiddenField) {
    return;
  }

  reflectionHiddenField.value = reflectionEditor.textContent || '';
  updateReflectionLength();
}

function getReflectionEditor() {
  return reflectionEditor || null;
}

function getReflectionLengthLabel() {
  const body = String(journalForm?.elements.body.value || '');
  const checkIn = String(journalForm?.elements.check_in.value || '');
  const guidedText = getGuidedAnswers().map((item) => item.answer).join(' ');
  const length = `${checkIn} ${body} ${guidedText}`.trim().length;

  if (!length) {
    return 'Empty';
  }

  if (length <= 250) {
    return 'A small reflection';
  }

  if (length <= 800) {
    return 'A steady reflection';
  }

  if (length <= 1500) {
    return 'A deep reflection';
  }

  return 'A long unfolding';
}

function updateReflectionLength() {
  if (reflectionLength) {
    reflectionLength.textContent = getReflectionLengthLabel();
  }
}

function getFallbackTitle({ title, mood, entryDate }) {
  if (title) {
    return title;
  }

  if (mood) {
    return `${mood} Reflection`;
  }

  return `Reflection from ${formatEntryDate(entryDate).replace(/, \d{4}$/, '')}`;
}

function getReadingSpreadLabel(reading = attachedReading) {
  const metadata = reading?.metadata && typeof reading.metadata === 'object' ? reading.metadata : {};
  const spread = metadata.spread && typeof metadata.spread === 'object'
    ? metadata.spread.key || metadata.spread.combined_label
    : metadata.spread;

  return toTitleLabel(reading?.spread_type || spread || '');
}

function getReadingFallbackTitle(reading = attachedReading) {
  const readerName = String(reading?.reader_name || '').trim();
  const spreadLabel = getReadingSpreadLabel(reading);

  if (readerName) {
    return `${readerName} Reading Reflection`;
  }

  if (spreadLabel) {
    return `Reflection on ${spreadLabel} Reading`;
  }

  return 'Reading Reflection';
}

function getFallbackQuestions() {
  return isBloodMoonMode() ? fallbackBloodMoonQuestions : fallbackSunMoonQuestions;
}

function getRotatedPromptTexts(promptTexts, count = 3) {
  const uniquePrompts = [...new Set(promptTexts.map((text) => String(text || '').trim()).filter(Boolean))];

  if (!uniquePrompts.length) {
    return [];
  }

  const selected = [];

  for (let index = 0; index < Math.min(count, uniquePrompts.length); index += 1) {
    selected.push(uniquePrompts[(questionCursor + index) % uniquePrompts.length]);
  }

  questionCursor = (questionCursor + count) % uniquePrompts.length;
  return selected;
}

function getRandomizedPromptTexts(promptTexts, count = 3) {
  const uniquePrompts = [...new Set(promptTexts.map((text) => String(text || '').trim()).filter(Boolean))];

  for (let index = uniquePrompts.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const currentPrompt = uniquePrompts[index];

    uniquePrompts[index] = uniquePrompts[randomIndex];
    uniquePrompts[randomIndex] = currentPrompt;
  }

  return uniquePrompts.slice(0, count);
}

function appendRandomPromptTexts(targetPrompts, rows, count = 3) {
  if (targetPrompts.length >= count) {
    return targetPrompts;
  }

  const existingPrompts = new Set(targetPrompts.map((prompt) => String(prompt || '').trim()));
  const nextPrompts = getRandomizedPromptTexts(getPromptRowsText(rows), count);

  nextPrompts.forEach((prompt) => {
    if (targetPrompts.length < count && prompt && !existingPrompts.has(prompt)) {
      targetPrompts.push(prompt);
      existingPrompts.add(prompt);
    }
  });

  return targetPrompts;
}

function getPromptRowsText(rows) {
  return (rows || [])
    .map((prompt) => prompt?.prompt_text)
    .filter(Boolean);
}

async function fetchPromptRows({ promptType, mood, includeAllMoods = false }) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  let query = supabase
    .from('journal_prompts')
    .select('prompt_text, prompt_type, mode, mood, sort_order, created_at')
    .eq('is_active', true)
    .eq('prompt_type', promptType)
    .in('mode', getPromptModeFilters())
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (!includeAllMoods) {
    query = query.in('mood', mood && mood !== 'any' ? [mood, 'any'] : ['any']);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Journal prompt load failed:', error);
    return [];
  }

  return data || [];
}

function getPromptFallbackRows(promptType) {
  if (promptType === 'shadow_question') {
    return fallbackBloodMoonQuestions.map((promptText) => ({
      mood: 'any',
      prompt_text: promptText,
    }));
  }

  if (promptType === 'prompt_of_day') {
    return [{
      mood: 'any',
      prompt_text: isBloodMoonMode() ? fallbackBloodMoonPromptOfDay : fallbackPromptOfDay,
    }];
  }

  if (promptType === 'reading_reflection') {
    return [{
      mood: 'any',
      prompt_text: 'What did this reading help you notice about your present path?',
    }];
  }

  return fallbackSunMoonQuestions.map((promptText) => ({
    mood: 'any',
    prompt_text: promptText,
  }));
}

async function getPromptsForCurrentContext(promptType) {
  const selectedMood = getSelectedMoodKey();
  const rows = await fetchPromptRows({ promptType, mood: selectedMood, includeAllMoods: true });
  const fallbackRows = getPromptFallbackRows(promptType);
  const usableRows = rows.length ? rows : fallbackRows;
  const selectedPrompts = [];

  if (selectedMood === 'any') {
    appendRandomPromptTexts(selectedPrompts, usableRows, 3);
  } else {
    const moodSpecificRows = usableRows.filter((prompt) => normalizePromptValue(prompt.mood, 'any') === selectedMood);
    const anyMoodRows = usableRows.filter((prompt) => normalizePromptValue(prompt.mood, 'any') === 'any');

    appendRandomPromptTexts(selectedPrompts, moodSpecificRows, 3);
    appendRandomPromptTexts(selectedPrompts, anyMoodRows, 3);
    appendRandomPromptTexts(selectedPrompts, usableRows, 3);
  }

  appendRandomPromptTexts(selectedPrompts, fallbackRows, 3);

  return selectedPrompts.slice(0, 3);
}

async function loadPromptOfDay() {
  if (!promptOfDay) {
    return;
  }

  const promptType = attachedReading ? 'reading_reflection' : 'prompt_of_day';
  const rows = await fetchPromptRows({ promptType, mood: 'any' });
  const fallbackRows = getPromptFallbackRows(promptType);
  const promptText = rows[0]?.prompt_text
    || fallbackRows[0]?.prompt_text
    || (isBloodMoonMode() ? fallbackBloodMoonPromptOfDay : fallbackPromptOfDay);

  promptOfDay.textContent = promptText;
}

async function chooseQuestions() {
  const requestToken = promptRequestToken + 1;
  promptRequestToken = requestToken;

  if (guidedToggle) {
    guidedToggle.disabled = true;
  }
  if (guidedRefresh) {
    guidedRefresh.disabled = true;
  }
  if (guidedAddButton) {
    guidedAddButton.disabled = true;
  }
  setMessage('Loading journal questions...');

  const selected = await getPromptsForCurrentContext(getGuidedPromptType());

  if (requestToken !== promptRequestToken) {
    return;
  }

  activeQuestions = selected.length ? selected : getFallbackQuestions().slice(0, 3);
  if (guidedModal && !guidedModal.hidden) {
    renderGuidedQuestions();
  }
  setMessage('');
  if (guidedToggle) {
    guidedToggle.disabled = false;
  }
  if (guidedRefresh) {
    guidedRefresh.disabled = false;
  }
  if (guidedAddButton) {
    guidedAddButton.disabled = false;
  }
}

function renderGuidedQuestions() {
  if (!guidedQuestionsWrap) {
    return;
  }

  guidedQuestionsWrap.innerHTML = activeQuestions.map((question, index) => `
    <div class="journal-guided__question">
      <label for="guided-answer-${index}">${escapeHtml(question)}</label>
      <textarea
        id="guided-answer-${index}"
        class="journal-vibe-writing-field"
        rows="4"
        data-guided-answer
        data-guided-question="${escapeHtml(question)}"
      ></textarea>
    </div>
  `).join('');
  updateReflectionLength();
}

function hasDraftGuidedAnswers() {
  return getDraftGuidedAnswers().length > 0;
}

function setGuidedModalCopy() {
  const bloodMoon = isBloodMoonMode();
  const title = bloodMoon ? 'Shadow Reflection' : 'Guided Reflection';
  const subtitle = bloodMoon ? 'Let the deeper questions speak first.' : 'Answer a few questions to go deeper.';

  if (guidedModalEyebrow) {
    guidedModalEyebrow.textContent = title;
  }
  if (guidedModalTitle) {
    guidedModalTitle.textContent = title;
  }
  if (guidedModalSubtitle) {
    guidedModalSubtitle.textContent = subtitle;
  }
  if (guidedAddButton) {
    guidedAddButton.textContent = bloodMoon ? 'Record Answers' : 'Add to Reflection';
  }
}

function closeGuidedModal({ force = false } = {}) {
  if (!guidedModal || guidedModal.hidden) {
    return true;
  }

  if (!force && hasDraftGuidedAnswers() && !window.confirm('Discard these guided answers?')) {
    return false;
  }

  guidedModal.hidden = true;
  document.body.classList.remove('journal-guided-modal-open');
  guidedSection?.classList.remove('is-expanded');
  renderGuidedQuestions();
  guidedToggle?.focus();
  return true;
}

async function openGuidedModal() {
  if (!guidedModal) {
    return;
  }

  setGuidedModalCopy();
  guidedModal.hidden = false;
  document.body.classList.add('journal-guided-modal-open');
  guidedSection?.classList.add('is-expanded');

  if (!activeQuestions.length) {
    await chooseQuestions();
  } else {
    renderGuidedQuestions();
  }

  window.requestAnimationFrame(() => {
    guidedModalDialog?.focus?.();
    const firstAnswer = guidedModal.querySelector('[data-guided-answer]');
    firstAnswer?.focus?.();
  });
}

function formatGuidedReflectionText(answers) {
  const heading = isBloodMoonMode() ? 'Shadow Reflection' : 'Guided Reflection';

  return [
    heading,
    '',
    ...answers.flatMap((item) => [
      item.question,
      item.answer,
      '',
    ]),
  ].join('\n').trim();
}

function toRomanNumeral(index) {
  return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][index] || `${index + 1}`;
}

function formatGuidedQuestionBlock(questions) {
  const heading = isBloodMoonMode() ? 'Shadow Reflection' : 'Guided Reflection';
  const questionLines = questions.flatMap((question, index) => [
    `${toRomanNumeral(index)}. ${question}`,
    'Answer:',
    '',
  ]);

  return [
    heading,
    '',
    ...questionLines,
  ].join('\n').trim();
}

function removeInsertedGuidedBlock() {
  const bodyField = getReflectionField();

  if (!bodyField || !insertedGuidedBlock) {
    return true;
  }

  const currentValue = String(bodyField?.value || '');
  const trimmedBlock = insertedGuidedBlock.trim();
  const patterns = [
    insertedGuidedBlock,
    `\n\n${insertedGuidedBlock}`,
    trimmedBlock,
    `\n\n${trimmedBlock}`,
  ];
  const match = patterns.find((pattern) => currentValue.endsWith(pattern));

  if (!match) {
    setMessage('Guided questions will stay in your reflection so your writing is not removed.', 'success');
    insertedGuidedBlock = '';
    return false;
  }

  setReflectionValue(currentValue.slice(0, currentValue.length - match.length).trimEnd(), true);
  insertedGuidedBlock = '';
  updateReflectionLength();
  return true;
}

async function addGuidedQuestionsToReflection() {
  const bodyField = getReflectionField();

  if (!bodyField) {
    return;
  }

  if (!activeQuestions.length) {
    await chooseQuestions();
  }

  if (!activeQuestions.length) {
    setMessage('Guided questions are unavailable right now.', 'error');
    guidedToggle.checked = false;
    return;
  }

  removeInsertedGuidedBlock();

  const existingBody = String(bodyField?.value || '').trimEnd();
  insertedGuidedBlock = formatGuidedQuestionBlock(activeQuestions);
  setReflectionValue(existingBody ? `${existingBody}\n\n${insertedGuidedBlock}` : insertedGuidedBlock, true);
  updateReflectionLength();
  setMessage('Guided questions added to your reflection.', 'success');
  getReflectionEditor()?.focus();
}

async function handleGuidedToggleChange() {
  if (!guidedToggle) {
    return;
  }

  if (guidedToggle.checked) {
    await addGuidedQuestionsToReflection();
    return;
  }

  removeInsertedGuidedBlock();
}

function addGuidedAnswersToReflection() {
  const answers = getDraftGuidedAnswers();

  if (!answers.length) {
    setMessage('Answer at least one guided question before adding it to your reflection.', 'error');
    return;
  }

  const bodyField = getReflectionField();

  if (!bodyField) {
    return;
  }

  const existingBody = String(bodyField?.value || '').trimEnd();
  const guidedText = formatGuidedReflectionText(answers);
  setReflectionValue(existingBody ? `${existingBody}\n\n${guidedText}` : guidedText, true);
  confirmedGuidedAnswers = answers;
  closeGuidedModal({ force: true });
  updateReflectionLength();
  setMessage('Guided reflection added.', 'success');
  getReflectionEditor()?.focus();
}

function resetForm() {
  if (!journalForm) {
    return;
  }

  journalForm.reset();
  journalForm.elements.entry_date.value = getTodayInputValue();
  renderTags(getDefaultTagsForContext());
  activeQuestions = [];
  confirmedGuidedAnswers = [];
  insertedGuidedBlock = '';
  questionCursor = 0;
  promptRequestToken += 1;
  if (guidedQuestionsWrap) {
    guidedQuestionsWrap.innerHTML = '';
  }
  if (guidedRefresh) {
    guidedRefresh.disabled = false;
  }
  if (guidedToggle) {
    guidedToggle.disabled = false;
    guidedToggle.checked = false;
  }
  setReflectionValue('');
  closeGuidedModal({ force: true });
  updateReflectionLength();
  if (journalVibeSelect) {
    journalVibeSelect.value = currentJournalVibe;
  }
  journalForm.elements.title.focus();
}

function getReadableTextItems(value) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(getReadableTextItems);
  }

  if (typeof value === 'object') {
    return [value.title, value.name, value.text, value.summary].flatMap(getReadableTextItems);
  }

  const text = String(value).trim();

  return text ? [text] : [];
}

function getReadingCardTitle(card) {
  return String(card?.title || card?.name || card?.card_name || '').trim();
}

function getReadingCards(reading) {
  return Array.isArray(reading?.cards) ? reading.cards : [];
}

function getReadingPositionLabels(reading) {
  const metadata = reading?.metadata && typeof reading.metadata === 'object' ? reading.metadata : {};
  const spread = metadata.spread && typeof metadata.spread === 'object' ? metadata.spread : {};

  return Array.isArray(spread.positions) ? spread.positions : [];
}

function getReadingCardRows(reading) {
  const positions = getReadingPositionLabels(reading);

  return getReadingCards(reading)
    .map((card, index) => {
      const title = getReadingCardTitle(card);
      const positionLabel = String(card?.position_label || positions[index] || '').trim();

      return title ? { title, positionLabel } : null;
    })
    .filter(Boolean);
}

function renderReadingCardList(reading) {
  const cardRows = getReadingCardRows(reading);

  if (!cardRows.length) {
    return '';
  }

  const hasPositions = cardRows.some((card) => card.positionLabel);

  if (!hasPositions) {
    return `
      <div class="journal-attached-reading__cards-group">
        <span>Cards Pulled</span>
        <p class="journal-attached-reading__cards">
          ${escapeHtml(cardRows.map((card) => card.title).join(' · '))}
        </p>
      </div>
    `;
  }

  return `
    <div class="journal-attached-reading__cards-group">
      <span>Cards Pulled</span>
      <dl class="journal-attached-reading__positions">
        ${cardRows.map((card, index) => `
          <div>
            <dt>${escapeHtml(card.positionLabel || `Card ${index + 1}`)}</dt>
            <dd>${escapeHtml(card.title)}</dd>
          </div>
        `).join('')}
      </dl>
    </div>
  `;
}

function renderAttachedReading(reading) {
  if (!attachedReadingWrap) {
    return;
  }

  if (!reading) {
    attachedReadingWrap.hidden = true;
    attachedReadingWrap.innerHTML = '';
    return;
  }

  const cards = Array.isArray(reading.cards) ? reading.cards : [];
  const metadata = reading.metadata && typeof reading.metadata === 'object' ? reading.metadata : {};
  const spreadLabel = getReadingSpreadLabel(reading);
  const modeLabel = toTitleLabel(getAttachedReadingMode(reading));
  const readerLabel = reading.reader_name || metadata.reader?.name || 'Astral Veil';
  const readingDate = formatEntryDate(reading.created_at);
  const cardCountLabel = `${cards.length || reading.card_count || 'Unknown'} ${Number(cards.length || reading.card_count) === 1 ? 'card' : 'cards'}`;

  attachedReadingWrap.hidden = false;
  attachedReadingWrap.innerHTML = `
    <div class="journal-attached-reading__header">
      <span>Reflecting on Your Reading</span>
      <p>${escapeHtml(cardCountLabel)}</p>
    </div>
    <dl class="journal-attached-reading__meta">
      <div>
        <dt>Reader</dt>
        <dd>${escapeHtml(readerLabel)}</dd>
      </div>
      ${spreadLabel ? `
        <div>
          <dt>Spread</dt>
          <dd>${escapeHtml(spreadLabel)}</dd>
        </div>
      ` : ''}
      ${modeLabel ? `
        <div>
          <dt>Mode</dt>
          <dd>${escapeHtml(modeLabel)}</dd>
        </div>
      ` : ''}
      <div>
        <dt>Date</dt>
        <dd>${escapeHtml(readingDate)}</dd>
      </div>
    </dl>
    ${renderReadingCardList(reading)}
  `;
}

function renderRecentEntries(entries = []) {
  if (!recentEntriesWrap) {
    return;
  }

  if (!entries.length) {
    const emptyText = isBloodMoonMode()
      ? 'No shadows have been recorded yet.'
      : 'No reflections have been saved yet.';

    recentEntriesWrap.innerHTML = `
      <div class="journal-recent-empty">
        <p>${escapeHtml(emptyText)}</p>
        <small>Write your first entry when you are ready.</small>
      </div>
    `;
    return;
  }

  recentEntriesWrap.innerHTML = entries.map((entry) => {
    const title = getFallbackTitle({
      title: entry.title,
      mood: entry.mood || entry.mood_key,
      entryDate: entry.entry_date,
    });
    const createdLabel = formatEntryTime(entry.created_at);

    return `
      <a class="journal-entry-card journal-vibe-preview-entry private-data-card" href="account.html#journal-entries" aria-label="${escapeHtml(`Open journal archive for ${title}`)}" data-private-card="true" draggable="false">
        <span class="journal-entry-card__media" aria-hidden="true"></span>
        <span class="journal-entry-card__date">
          <time datetime="${escapeHtml(entry.entry_date || '')}" class="journal-vibe-preview-date">${escapeHtml(formatEntryDate(entry.entry_date))}</time>
          <span class="journal-vibe-preview-date">${escapeHtml(createdLabel)}</span>
        </span>
        <h3 class="journal-vibe-preview-title">${escapeHtml(title)}</h3>
      </a>
    `;
  }).join('');
}

async function loadRecentEntries() {
  if (!recentEntriesWrap || !activeUser) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    renderRecentEntries([]);
    return;
  }

  const { data, error } = await supabase
    .from('user_journal_entries')
    .select('id, title, entry_date, mood_key, mood, created_at')
    .eq('user_id', activeUser.id)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Recent journal entries load failed:', error);
    renderRecentEntries([]);
    return;
  }

  renderRecentEntries(data || []);
}

async function loadAttachedReading() {
  const params = new URLSearchParams(window.location.search);
  const readingId = params.get('readingId');

  if (!readingId || !activeUser) {
    renderAttachedReading(null);
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    renderAttachedReading(null);
    return;
  }

  const { data, error } = await supabase
    .from('user_readings')
    .select('id, created_at, reader_name, mode_key, spread_type, card_count, cards, result_summary, metadata')
    .eq('id', readingId)
    .eq('user_id', activeUser.id)
    .maybeSingle();

  if (error) {
    console.error('Attached reading load failed:', error);
  }

  attachedReading = data || null;
  renderAttachedReading(attachedReading);
  applyThemeCopy();
  renderTags(getDefaultTagsForContext());
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!activeUser) {
    redirectToLogin();
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setMessage('Journal saving is not available in this environment.', 'error');
    return;
  }

  const formData = new FormData(journalForm);
  const rawTitle = String(formData.get('title') || '').trim();
  const body = String(formData.get('body') || '').trim();
  const checkIn = String(formData.get('check_in') || '').trim();
  const entryDate = String(formData.get('entry_date') || '').trim();
  const mood = String(formData.get('mood') || '').trim();
  const tags = getSelectedTags();
  const guidedAnswers = getGuidedAnswers();
  const prompt = promptOfDay?.textContent || '';
  const sourceReadingId = attachedReading?.id || null;
  const mode = sourceReadingId
    ? normalizeJournalModeValue(getAttachedReadingMode(), getModeValue())
    : getModeValue();
  const reflectionType = sourceReadingId
    ? 'reading_reflection'
    : mode === 'bloodmoon'
      ? 'shadow_reflection'
      : 'daily_reflection';
  const sourceType = sourceReadingId ? 'reading' : 'journal';
  const title = rawTitle
    || (sourceReadingId ? getReadingFallbackTitle() : getFallbackTitle({ title: rawTitle, mood, entryDate }));

  if (!entryDate || (!checkIn && !body && !guidedAnswers.length)) {
    setMessage('Add a date and either a check-in, reflection, or guided answer before saving.', 'error');
    return;
  }

  if (!parseEntryDate(entryDate)) {
    setMessage('Choose a valid entry date.', 'error');
    return;
  }

  saveButton.disabled = true;
  setMessage('Saving journal entry...');

  const { error } = await supabase
    .from('user_journal_entries')
    .insert({
      user_id: activeUser.id,
      title,
      body,
      check_in: checkIn || null,
      entry_date: entryDate,
      mood: mood || null,
      mood_key: mood ? mood.toLowerCase().replace(/\s+/g, '_') : null,
      tags,
      prompt,
      guided_answers: guidedAnswers,
      mode,
      source_type: sourceType,
      source_reading_id: sourceReadingId,
      linked_reading_id: sourceReadingId,
      reflection_type: reflectionType,
      metadata: {
        prompt,
        length_label: getReflectionLengthLabel(),
        attached_reading: sourceReadingId ? {
          id: sourceReadingId,
          reader_name: attachedReading?.reader_name || '',
          spread_type: attachedReading?.spread_type || '',
          spread_label: getReadingSpreadLabel(),
          mode_key: getAttachedReadingMode(),
          reading_date: attachedReading?.created_at || '',
          cards: getReadingCardRows(attachedReading),
        } : null,
      },
    });

  saveButton.disabled = false;

  if (error) {
    console.error('Journal entry save failed:', error);
    setMessage('We could not save your journal entry. Please try again.', 'error');
    return;
  }

  resetForm();
  setMessage(isBloodMoonMode() ? 'The shadow has been recorded.' : 'Journal entry saved.', 'success');
  loadRecentEntries();
}

async function initJournalPage() {
  initializeJournalVibe();

  if (!isSupabaseConfigured()) {
    if (loadingState) {
      loadingState.textContent = 'Journal access is not configured for this environment.';
    }
    return;
  }

  const { user, profile, error } = await getCurrentUserWithProfile();

  if (error) {
    console.error('Journal auth check failed:', error);
    if (loadingState) {
      loadingState.textContent = 'We could not open your journal. Please try again.';
    }
    return;
  }

  if (!user) {
    lockJournalForSignedOutUser();
    return;
  }

  activeUser = user;
  activeProfile = profile || {};

  applyThemeCopy();
  renderMoodOptions();
  renderTags();
  renderReflectionReminderQuote();

  if (loadingState) {
    loadingState.hidden = true;
  }
  if (shell) {
    shell.hidden = false;
  }

  resetForm();
  await loadAttachedReading();
  await loadPromptOfDay();
  await loadRecentEntries();
}

journalForm?.addEventListener('submit', handleSubmit);
journalForm?.addEventListener('input', updateReflectionLength);
journalForm?.addEventListener('change', updateReflectionLength);
reflectionEditor?.addEventListener('input', syncReflectionFromEditor);
journalVibeSelect?.addEventListener('change', () => {
  applyJournalVibe(journalVibeSelect.value);
});

clearButton?.addEventListener('click', () => {
  resetForm();
  setMessage('');
});

moodSelect?.addEventListener('change', () => {
  activeQuestions = [];
  questionCursor = 0;
  if (guidedToggle?.checked) {
    guidedToggle.checked = false;
    removeInsertedGuidedBlock();
  }
});

guidedToggle?.addEventListener('change', handleGuidedToggleChange);
guidedRefresh?.addEventListener('click', () => {
  if (hasDraftGuidedAnswers() && !window.confirm('Refresh questions and discard these draft answers?')) {
    return;
  }
  chooseQuestions();
});
guidedAddButton?.addEventListener('click', addGuidedAnswersToReflection);
guidedCancelButtons.forEach((button) => {
  button.addEventListener('click', () => closeGuidedModal());
});
guidedModalBackdrop?.addEventListener('click', () => closeGuidedModal());
document.addEventListener('keydown', (event) => {
  if (document.body.classList.contains('journal-locked')) {
    if (event.key === 'Escape') {
      event.preventDefault();
      focusJournalLockModal();
      return;
    }

    if (event.key === 'Tab') {
      const focusableElements = getJournalLockFocusableElements();

      if (!focusableElements.length) {
        event.preventDefault();
        journalLockDialog?.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  if (event.key === 'Escape' && guidedModal && !guidedModal.hidden) {
    closeGuidedModal();
  }
});

document.addEventListener('dragstart', preventPrivateCardDrag);
document.addEventListener('contextmenu', preventProtectedMediaContextMenu);

initJournalPage();
