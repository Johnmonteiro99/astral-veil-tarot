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
const recentTitle = document.querySelector('[data-recent-title]');
const recentSubtitle = document.querySelector('[data-recent-subtitle]');

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

let activeUser = null;
let activeProfile = null;
let attachedReading = null;
let activeQuestions = [];
let confirmedGuidedAnswers = [];
let questionCursor = 0;
let promptRequestToken = 0;
let messageClearTimer = null;

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
    return ['lumen', 'sun'];
  }

  return ['lumen', 'moon'];
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
    guidedHelper.textContent = 'Answer a few questions to go deeper.';
  }

  if (guidedToggle) {
    guidedToggle.setAttribute(
      'aria-label',
      bloodMoon ? 'Begin shadow reflection' : 'Open guided reflection questions',
    );
  }

  if (privacyReminder) {
    privacyReminder.textContent = bloodMoon
      ? 'This shadow stays in your private archive.'
      : 'Only you can see this reflection.';
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

function renderTags(selectedTags = []) {
  if (!tagWrap) {
    return;
  }

  tagWrap.innerHTML = `
    <legend>Quick Tags</legend>
    ${tagOptions.map((tag) => `
      <label class="journal-tag-option">
        <input type="checkbox" name="tags" value="${escapeHtml(tag)}" ${selectedTags.includes(tag) ? 'checked' : ''} />
        <span class="journal-icon journal-icon--${escapeHtml(tagIconMap[tag] || 'star')}" aria-hidden="true"></span>
        ${escapeHtml(tag)}
      </label>
    `).join('')}
  `;
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

function getPromptRowsText(rows) {
  return (rows || [])
    .map((prompt) => prompt?.prompt_text)
    .filter(Boolean);
}

async function fetchPromptRows({ promptType, mood }) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('journal_prompts')
    .select('prompt_text, prompt_type, mode, mood, sort_order, created_at')
    .eq('is_active', true)
    .eq('prompt_type', promptType)
    .in('mode', getPromptModeFilters())
    .in('mood', mood && mood !== 'any' ? [mood, 'any'] : ['any'])
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

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
  const rows = await fetchPromptRows({ promptType, mood: selectedMood });
  const usableRows = rows.length ? rows : getPromptFallbackRows(promptType);
  const moodSpecificRows = selectedMood === 'any'
    ? []
    : usableRows.filter((prompt) => normalizePromptValue(prompt.mood, 'any') === selectedMood);
  const fallbackRows = usableRows.filter((prompt) => normalizePromptValue(prompt.mood, 'any') === 'any');
  const promptTexts = [
    ...getPromptRowsText(moodSpecificRows),
    ...getPromptRowsText(fallbackRows),
    ...getFallbackQuestions(),
  ];

  return getRotatedPromptTexts(promptTexts, 3);
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
  renderGuidedQuestions();
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
      <textarea id="guided-answer-${index}" rows="4" data-guided-answer data-guided-question="${escapeHtml(question)}"></textarea>
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

function addGuidedAnswersToReflection() {
  const answers = getDraftGuidedAnswers();

  if (!answers.length) {
    setMessage('Answer at least one guided question before adding it to your reflection.', 'error');
    return;
  }

  const bodyField = journalForm?.elements.body;

  if (!bodyField) {
    return;
  }

  const existingBody = String(bodyField.value || '').trimEnd();
  const guidedText = formatGuidedReflectionText(answers);
  bodyField.value = existingBody ? `${existingBody}\n\n${guidedText}` : guidedText;
  confirmedGuidedAnswers = answers;
  closeGuidedModal({ force: true });
  updateReflectionLength();
  setMessage('Guided reflection added.', 'success');
  bodyField.focus();
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
  }
  closeGuidedModal({ force: true });
  updateReflectionLength();
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
      <a class="journal-entry-card" href="account.html#journal-entries" aria-label="${escapeHtml(`Open journal archive for ${title}`)}">
        <span class="journal-entry-card__media" aria-hidden="true"></span>
        <span class="journal-entry-card__date">
          <time datetime="${escapeHtml(entry.entry_date || '')}">${escapeHtml(formatEntryDate(entry.entry_date))}</time>
          <span>${escapeHtml(createdLabel)}</span>
        </span>
        <h3>${escapeHtml(title)}</h3>
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
    redirectToLogin();
    return;
  }

  activeUser = user;
  activeProfile = profile || {};

  applyThemeCopy();
  renderMoodOptions();
  renderTags();

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

clearButton?.addEventListener('click', () => {
  resetForm();
  setMessage('');
});

moodSelect?.addEventListener('change', () => {
  activeQuestions = [];
  questionCursor = 0;
  if (guidedModal && !guidedModal.hidden) {
    chooseQuestions();
  }
});

guidedToggle?.addEventListener('click', () => {
  openGuidedModal();
});
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
  if (event.key === 'Escape' && guidedModal && !guidedModal.hidden) {
    closeGuidedModal();
  }
});

initJournalPage();
