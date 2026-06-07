import { getCurrentUserWithProfile, isCurrentUserAdmin, signOut } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

const loadingPanel = document.querySelector('[data-account-loading]');
const accountPanel = document.querySelector('[data-account-panel]');
const errorPanel = document.querySelector('[data-account-error]');
const emailValue = document.querySelector('[data-account-email]');
const nameValue = document.querySelector('[data-account-name]');
const roleValue = document.querySelector('[data-account-role]');
const avatar = document.querySelector('[data-account-avatar]');
const avatarInitials = document.querySelector('[data-account-avatar-initials]');
const avatarImage = document.querySelector('[data-account-avatar-image]');
const avatarUploadButton = document.querySelector('[data-avatar-upload-trigger]');
const avatarUploadInput = document.querySelector('[data-avatar-upload-input]');
const avatarStatus = document.querySelector('[data-avatar-status]');
const avatarPreviewModal = document.querySelector('[data-avatar-preview-modal]');
const avatarPreviewImage = document.querySelector('[data-avatar-preview-image]');
const avatarPreviewCloseButtons = Array.from(document.querySelectorAll('[data-avatar-preview-close]'));
const logoutButtons = Array.from(document.querySelectorAll('[data-logout]'));
const adminLink = document.querySelector('[data-admin-link]');
const memberSinceValue = document.querySelector('[data-member-since]');
const sectionButtons = Array.from(document.querySelectorAll('[data-account-section-target]'));
const accountSections = Array.from(document.querySelectorAll('[data-account-section]'));
const accountNav = document.querySelector('[data-account-nav]');
const accountNavToggle = document.querySelector('[data-account-nav-toggle]');
const savedReadingsList = document.querySelector('[data-saved-readings-list]');
const artifactCountValue = document.querySelector('[data-account-artifact-count]');
const roomCountValue = document.querySelector('[data-account-room-count]');
const zodiacValue = document.querySelector('[data-account-zodiac]');
const zodiacIcon = document.querySelector('[data-account-zodiac-icon]');
const zodiacLabel = document.querySelector('[data-account-zodiac-label]');
const profileForm = document.querySelector('[data-profile-form]');
const profileSubmitButton = document.querySelector('[data-profile-submit]');
const profileStatus = document.querySelector('[data-profile-status]');
const zodiacPreview = document.querySelector('[data-zodiac-preview]');
const zodiacDates = document.querySelector('[data-zodiac-dates]');
const birthdayInput = document.querySelector('[data-birthday-input]');
const settingsZodiacImage = document.querySelector('[data-settings-zodiac-image]');
const journalNewEntryButton = document.querySelector('[data-journal-new-entry]');
const journalStatus = document.querySelector('[data-journal-status]');

let savedReadingsLoaded = false;
let savedReadingsCache = [];
let activeReadingFilter = 'all';
let activeUser = null;
let activeProfile = null;
let activeAvatarUrl = '';
let avatarStatusClearTimer = null;
let profileStatusClearTimer = null;

const avatarBucketName = 'avatars';
const maxAvatarInputFileSize = 8 * 1024 * 1024;
const targetAvatarUploadSize = 2 * 1024 * 1024;
const maxAvatarImageSide = 800;
const avatarCompressionQuality = 0.82;
const allowedAvatarTypes = new Map([
  ['image/png', 'png'],
  ['image/jpeg', 'jpg'],
  ['image/webp', 'webp'],
]);
const zodiacRanges = [
  ['Capricorn', 1, 19],
  ['Aquarius', 2, 18],
  ['Pisces', 3, 20],
  ['Aries', 4, 19],
  ['Taurus', 5, 20],
  ['Gemini', 6, 20],
  ['Cancer', 7, 22],
  ['Leo', 8, 22],
  ['Virgo', 9, 22],
  ['Libra', 10, 22],
  ['Scorpio', 11, 21],
  ['Sagittarius', 12, 21],
  ['Capricorn', 12, 31],
];
const zodiacDateRanges = {
  Aries: 'Mar 21 - Apr 19',
  Taurus: 'Apr 20 - May 20',
  Gemini: 'May 21 - Jun 20',
  Cancer: 'Jun 21 - Jul 22',
  Leo: 'Jul 23 - Aug 22',
  Virgo: 'Aug 23 - Sep 22',
  Libra: 'Sep 23 - Oct 22',
  Scorpio: 'Oct 23 - Nov 21',
  Sagittarius: 'Nov 22 - Dec 21',
  Capricorn: 'Dec 22 - Jan 19',
  Aquarius: 'Jan 20 - Feb 18',
  Pisces: 'Feb 19 - Mar 20',
};

function getAccountSectionFromHash() {
  const sectionName = window.location.hash.replace(/^#/, '');

  return accountSections.some((section) => section.dataset.accountSection === sectionName)
    ? sectionName
    : 'overview';
}

function getProfileValue(profile, keys) {
  for (const key of keys) {
    const value = profile?.[key];

    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }

  return '';
}

function getInitials(name, email) {
  const source = name || email || 'Astral Veil';
  const parts = source
    .replace(/@.*/, '')
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part.charAt(0).toUpperCase()).join('') || 'AV';
}

function getZodiacSign(month, day) {
  const numericMonth = Number(month);
  const numericDay = Number(day);

  if (!numericMonth || !numericDay) {
    return '';
  }

  return zodiacRanges.find(([, endMonth, endDay]) => (
    numericMonth < endMonth || (numericMonth === endMonth && numericDay <= endDay)
  ))?.[0] || '';
}

function isValidBirthday(month, day) {
  if (!month && !day) {
    return true;
  }

  const numericMonth = Number(month);
  const numericDay = Number(day);

  if (!Number.isInteger(numericMonth) || !Number.isInteger(numericDay)) {
    return false;
  }

  if (numericMonth < 1 || numericMonth > 12) {
    return false;
  }

  const daysByMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return numericDay >= 1 && numericDay <= daysByMonth[numericMonth - 1];
}

function formatBirthdayInput(month, day) {
  if (!month || !day) {
    return '';
  }

  return `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
}

function parseBirthdayInput(value) {
  const trimmed = String(value || '').trim();

  if (!trimmed) {
    return {
      day: '',
      isComplete: false,
      isEmpty: true,
      isValid: true,
      month: '',
    };
  }

  const match = trimmed.match(/^(\d{1,2})\s*\/\s*(\d{1,2})$/);

  if (!match) {
    return {
      day: '',
      isComplete: false,
      isEmpty: false,
      isValid: false,
      month: '',
    };
  }

  const month = Number(match[1]);
  const day = Number(match[2]);

  return {
    day,
    isComplete: true,
    isEmpty: false,
    isValid: isValidBirthday(month, day),
    month,
  };
}

function normalizeBirthdayInputValue(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 4);

  if (digits.length <= 2) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function syncBirthdayHiddenFields(month, day) {
  if (!profileForm) {
    return;
  }

  profileForm.elements.birth_month.value = month || '';
  profileForm.elements.birth_day.value = day || '';
}

function getZodiacCardImagePath(sign) {
  const iconName = String(sign || '').trim().toLowerCase();

  return iconName ? `processed-zodiac-cards/${iconName}-card-cutout.png` : '';
}

function getProfileDisplayName(profile, user) {
  return getProfileValue(profile, ['display_name', 'name', 'full_name', 'username'])
    || getProfileValue(user?.user_metadata, ['display_name', 'name', 'full_name']);
}

function setProfileStatus(message, type = '') {
  if (!profileStatus) {
    return;
  }

  if (profileStatusClearTimer) {
    window.clearTimeout(profileStatusClearTimer);
    profileStatusClearTimer = null;
  }

  profileStatus.textContent = message;
  profileStatus.removeAttribute('aria-label');
  profileStatus.classList.toggle('is-error', type === 'error');
  profileStatus.classList.toggle('is-success', type === 'success');
  profileStatus.classList.remove('is-complete');
}

function showProfileSavedStatus() {
  if (!profileStatus) {
    return;
  }

  if (profileStatusClearTimer) {
    window.clearTimeout(profileStatusClearTimer);
  }

  profileStatus.innerHTML = '<img class="profile-form__status-icon" src="assets/icons/symbols/checked.svg" alt="" aria-hidden="true" />';
  profileStatus.setAttribute('aria-label', 'Profile saved.');
  profileStatus.classList.remove('is-error');
  profileStatus.classList.add('is-success', 'is-complete');

  profileStatusClearTimer = window.setTimeout(() => {
    setProfileStatus('');
  }, 3200);
}

function setAvatarStatus(message, type = '') {
  if (!avatarStatus) {
    return;
  }

  if (avatarStatusClearTimer) {
    window.clearTimeout(avatarStatusClearTimer);
    avatarStatusClearTimer = null;
  }

  avatarStatus.textContent = message;
  avatarStatus.removeAttribute('aria-label');
  avatarStatus.classList.toggle('is-error', type === 'error');
  avatarStatus.classList.toggle('is-success', type === 'success');
  avatarStatus.classList.remove('is-complete');
}

function showAvatarCompleteStatus() {
  if (!avatarStatus) {
    return;
  }

  if (avatarStatusClearTimer) {
    window.clearTimeout(avatarStatusClearTimer);
  }

  avatarStatus.innerHTML = '<img class="avatar-status__icon" src="assets/icons/symbols/checked.svg" alt="" aria-hidden="true" />';
  avatarStatus.setAttribute('aria-label', 'Profile picture updated.');
  avatarStatus.classList.remove('is-error');
  avatarStatus.classList.add('is-success', 'is-complete');

  avatarStatusClearTimer = window.setTimeout(() => {
    setAvatarStatus('');
  }, 3200);
}

function updateSettingsZodiacPreview(sign) {
  if (zodiacPreview) {
    zodiacPreview.textContent = sign || 'Enter your birthday to reveal your zodiac.';
  }

  if (zodiacDates) {
    zodiacDates.textContent = sign ? zodiacDateRanges[sign] || '' : '';
    zodiacDates.hidden = !sign;
  }

  if (!settingsZodiacImage) {
    return;
  }

  const iconName = String(sign || '').trim().toLowerCase();
  const previewFrame = settingsZodiacImage.closest('.profile-preview__icon');

  settingsZodiacImage.hidden = !iconName;
  settingsZodiacImage.removeAttribute('src');
  settingsZodiacImage.onerror = null;
  previewFrame?.classList.remove('is-fallback');
  if (previewFrame) {
    previewFrame.hidden = !iconName;
  }

  if (!iconName) {
    return;
  }

  settingsZodiacImage.onerror = () => {
    settingsZodiacImage.onerror = () => {
      settingsZodiacImage.hidden = true;
    };
    previewFrame?.classList.add('is-fallback');
    settingsZodiacImage.src = `assets/icons/zodiac/${iconName}.svg`;
  };
  settingsZodiacImage.src = getZodiacCardImagePath(sign);
}

function updateZodiacDisplay(sign) {
  const label = sign ? `Zodiac: ${sign}` : 'Zodiac: Not set';

  if (zodiacValue) {
    zodiacValue.classList.toggle('is-empty', !sign);
  }

  if (zodiacLabel) {
    zodiacLabel.textContent = sign || 'Zodiac not set';
  } else if (zodiacValue) {
    zodiacValue.textContent = sign || 'Zodiac not set';
  }

  if (zodiacIcon) {
    const iconName = String(sign || '').trim().toLowerCase();

    zodiacIcon.hidden = !iconName;
    zodiacIcon.removeAttribute('src');
    zodiacIcon.onerror = () => {
      zodiacIcon.hidden = true;
    };

    if (iconName) {
      zodiacIcon.src = `assets/icons/zodiac/${iconName}.svg`;
    }
  }

  updateSettingsZodiacPreview(sign);
}

function updateHeroProfile(profile, user) {
  const email = user?.email || 'Signed-in user';
  const displayName = getProfileDisplayName(profile, user);
  const avatarUrl = getProfileValue(profile, ['avatar_url']);
  const profileBackgroundUrl = getProfileValue(profile, ['profile_background_url']);
  const heroCard = document.querySelector('.hero-card');

  nameValue.textContent = displayName || 'Astral Veil Seeker';
  activeAvatarUrl = avatarUrl;
  avatarInitials.textContent = getInitials(displayName, email);
  avatar.classList.remove('has-image');
  avatar.setAttribute('aria-label', avatarUrl ? 'Preview profile picture' : 'Profile picture not set');
  avatarImage.hidden = true;
  avatarImage.removeAttribute('src');

  if (avatarUrl) {
    avatarImage.src = avatarUrl;
    avatarImage.hidden = false;
    avatar.classList.add('has-image');
    avatar.setAttribute('aria-label', `Preview ${displayName || email} profile picture`);
  }

  if (heroCard && profileBackgroundUrl) {
    heroCard.style.backgroundImage = `linear-gradient(135deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.014)), url("${profileBackgroundUrl.replace(/"/g, '%22')}")`;
    heroCard.style.backgroundSize = 'cover';
    heroCard.style.backgroundPosition = 'center';
  }

  updateZodiacDisplay(getProfileValue(profile, ['zodiac_sign']));
}

function updateNavbarProfileAvatars(profile, user) {
  const avatarUrl = getProfileValue(profile, ['avatar_url']);
  const initials = getInitials(getProfileDisplayName(profile, user), user?.email);

  document.querySelectorAll('.navbar-account__avatar').forEach((navAvatar) => {
    navAvatar.classList.toggle('has-image', Boolean(avatarUrl));

    if (avatarUrl) {
      navAvatar.textContent = '';
      navAvatar.style.backgroundImage = `url("${avatarUrl.replace(/"/g, '%22')}")`;
      return;
    }

    navAvatar.textContent = initials;
    navAvatar.style.backgroundImage = '';
  });
}

function populateProfileForm(profile, user) {
  if (!profileForm) {
    return;
  }

  profileForm.elements.display_name.value = getProfileDisplayName(profile, user) || '';
  syncBirthdayHiddenFields(profile?.birth_month || '', profile?.birth_day || '');
  if (birthdayInput) {
    birthdayInput.value = formatBirthdayInput(profile?.birth_month, profile?.birth_day);
  }
  updateZodiacDisplay(getProfileValue(profile, ['zodiac_sign']) || getZodiacSign(profile?.birth_month, profile?.birth_day));
  setProfileStatus('');
}

async function fetchCurrentProfile(supabase, userId) {
  if (!supabase || !userId) {
    return { profile: null, error: null };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  return { profile: data || null, error };
}

function updateAccountProfileDisplay(profile, user) {
  const email = user?.email || 'Signed-in user';
  const role = getProfileValue(profile, ['role']) || 'user';
  const memberSince = getProfileValue(profile, ['created_at', 'inserted_at']) || user?.created_at;

  emailValue.textContent = email;
  if (roleValue) {
    roleValue.textContent = role;
  }
  memberSinceValue.textContent = formatDate(memberSince);
  updateHeroProfile(profile, user);
  updateNavbarProfileAvatars(profile, user);
  populateProfileForm(profile, user);
}

function getAvatarFileExtension(file) {
  const extensionFromType = allowedAvatarTypes.get(file?.type);

  if (extensionFromType) {
    return extensionFromType;
  }

  const extensionFromName = String(file?.name || '').split('.').pop()?.toLowerCase();

  return ['png', 'jpg', 'jpeg', 'webp'].includes(extensionFromName) ? extensionFromName : '';
}

function validateAvatarFile(file) {
  if (!file) {
    return {
      isValid: false,
      message: 'Choose an image to upload.',
      debug: { reason: 'missing-file' },
    };
  }

  const extension = getAvatarFileExtension(file);
  const debug = {
    name: file.name,
    type: file.type,
    size: file.size,
    extension,
  };

  if (!allowedAvatarTypes.has(file.type) || !extension) {
    return {
      isValid: false,
      message: 'Please choose a PNG, JPG, or WebP image.',
      debug,
    };
  }

  if (file.size > maxAvatarInputFileSize) {
    return {
      isValid: false,
      message: 'Profile picture must be 8MB or smaller.',
      debug,
    };
  }

  return {
    isValid: true,
    extension,
  };
}

function setAvatarUploadLoading(isLoading, label = 'Uploading...') {
  if (!avatarUploadButton) {
    return;
  }

  if (isLoading) {
    avatarUploadButton.setAttribute('aria-busy', 'true');
    avatarUploadButton.title = label;
    avatarUploadButton.disabled = true;
    return;
  }

  avatarUploadButton.removeAttribute('aria-busy');
  avatarUploadButton.removeAttribute('title');
  avatarUploadButton.disabled = false;
}

function loadImageForAvatar(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('The selected image could not be loaded.'));
    };
    image.src = objectUrl;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function isUsableAvatarBlob(blob, expectedType) {
  return blob instanceof Blob && blob.size > 0 && blob.type === expectedType;
}

async function createCompressedAvatarBlob(canvas) {
  const compressionQualities = [avatarCompressionQuality, 0.72, 0.62];

  for (const quality of compressionQualities) {
    const webpBlob = await canvasToBlob(canvas, 'image/webp', quality);

    if (isUsableAvatarBlob(webpBlob, 'image/webp') && (webpBlob.size <= targetAvatarUploadSize || quality === compressionQualities[compressionQualities.length - 1])) {
      return {
        blob: webpBlob,
        contentType: 'image/webp',
        extension: 'webp',
      };
    }
  }

  for (const quality of compressionQualities) {
    const jpegBlob = await canvasToBlob(canvas, 'image/jpeg', quality);

    if (isUsableAvatarBlob(jpegBlob, 'image/jpeg') && (jpegBlob.size <= targetAvatarUploadSize || quality === compressionQualities[compressionQualities.length - 1])) {
      return {
        blob: jpegBlob,
        contentType: 'image/jpeg',
        extension: 'jpg',
      };
    }
  }

  throw new Error('The selected image could not be compressed.');
}

async function prepareAvatarUpload(file) {
  const image = await loadImageForAvatar(file);
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = longestSide > maxAvatarImageSide ? maxAvatarImageSide / longestSide : 1;
  const canvas = document.createElement('canvas');
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('Canvas is not available for profile picture compression.');
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  const compressed = await createCompressedAvatarBlob(canvas);
  const uploadFile = new File(
    [compressed.blob],
    `profile-${Date.now()}.${compressed.extension}`,
    { type: compressed.contentType }
  );

  if (uploadFile.size > targetAvatarUploadSize) {
    console.warn('Compressed avatar is still larger than 2MB:', {
      originalSize: file.size,
      compressedSize: uploadFile.size,
      width,
      height,
      contentType: compressed.contentType,
    });
  }

  return {
    file: uploadFile,
    contentType: compressed.contentType,
    extension: compressed.extension,
    originalSize: file.size,
    resizedWidth: width,
    resizedHeight: height,
  };
}

function openAvatarPreview() {
  if (!avatarPreviewModal || !avatarPreviewImage || !activeAvatarUrl) {
    return;
  }

  avatarPreviewImage.src = activeAvatarUrl;
  avatarPreviewModal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeAvatarPreview() {
  if (!avatarPreviewModal || !avatarPreviewImage) {
    return;
  }

  avatarPreviewModal.hidden = true;
  avatarPreviewImage.removeAttribute('src');
  document.body.style.overflow = '';
}

function formatDate(value) {
  if (!value) {
    return 'Coming soon';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Coming soon';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatDateTime(value) {
  if (!value) {
    return 'Unknown date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
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

function formatReadableValue(value, fallback = 'Unknown') {
  if (value === null || typeof value === 'undefined' || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

function toTitleLabel(value, fallback = 'Unknown') {
  if (value === null || typeof value === 'undefined' || value === '') {
    return fallback;
  }

  const labels = {
    blood_moon: 'Blood Moon',
    blue_moon: 'Blue Moon',
    sun: 'Sun',
    moon: 'Moon',
    threeCard: 'Three Card Spread',
    fiveCard: 'Five Card Spread',
    sevenCard: 'Seven Card Spread',
    standard: 'Standard',
  };
  const normalized = String(value).trim();

  if (labels[normalized]) {
    return labels[normalized];
  }

  return normalized
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || fallback;
}

function getReadingMetadata(reading) {
  return reading?.metadata && typeof reading.metadata === 'object' && !Array.isArray(reading.metadata)
    ? reading.metadata
    : {};
}

function isAiReading(reading) {
  const metadata = getReadingMetadata(reading);

  return metadata.reading_source === 'ai' || metadata.ai_generated === true;
}

function getReadingTypeLabel(reading) {
  return isAiReading(reading) ? 'AI Reading' : 'Standard Reading';
}

function getReadingQuestion(reading) {
  const metadata = getReadingMetadata(reading);

  return reading?.question || metadata.question || '';
}

function getReadingModeValue(reading) {
  const metadata = getReadingMetadata(reading);

  return reading?.mode_key || metadata.mode || '';
}

function getReadingModeClass(reading) {
  const mode = String(getReadingModeValue(reading)).toLowerCase().replace(/[\s-]+/g, '_');

  if (mode.includes('blood')) {
    return 'is-blood-moon';
  }

  if (mode.includes('blue')) {
    return 'is-blue-moon';
  }

  if (mode.includes('sun')) {
    return 'is-sun';
  }

  if (mode.includes('moon')) {
    return 'is-moon';
  }

  return 'is-standard';
}

function formatOrientation(card) {
  const orientation = card?.orientation
    || (card?.reversed ? 'reversed' : card?.upright ? 'upright' : '');

  return orientation ? toTitleLabel(orientation, '') : '';
}

function formatCreditCost(reading) {
  const metadata = getReadingMetadata(reading);
  const creditCost = reading?.credit_cost ?? metadata.credit_cost ?? metadata.credits_used;

  if (!isAiReading(reading) || creditCost === null || typeof creditCost === 'undefined' || creditCost === '') {
    return '';
  }

  const numericCost = Number(creditCost);
  const label = numericCost === 1 ? 'credit' : 'credits';

  return Number.isFinite(numericCost) ? `${numericCost} ${label} used` : `${creditCost} credits used`;
}

function formatSavedCard(card, index) {
  const position = card?.position_label || card?.position || `Card ${index + 1}`;
  const title = card?.title || card?.name || 'Unknown card';
  const orientation = formatOrientation(card);
  const summary = getReadableTextItems(card?.summary || card?.meaning || card?.description)[0] || '';

  return `
    <article class="saved-reading-card__card">
      <span>${escapeHtml(toTitleLabel(position, `Card ${index + 1}`))}</span>
      <strong>${escapeHtml(title)}</strong>
      ${orientation ? `<p class="saved-reading-card__orientation">${escapeHtml(orientation)}</p>` : ''}
      ${summary ? `<p>${escapeHtml(summary)}</p>` : ''}
    </article>
  `;
}

function getReadableTextItems(value) {
  if (value === null || typeof value === 'undefined' || value === '') {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(getReadableTextItems);
  }

  if (typeof value === 'object') {
    return [
      value.text,
      value.message,
      value.summary,
      value.advice,
      value.content,
    ].flatMap(getReadableTextItems);
  }

  const text = String(value).trim();

  return text ? [text] : [];
}

function renderReadingParagraphs(reading) {
  const metadata = getReadingMetadata(reading);
  const sections = [
    reading.result_summary,
    metadata.combined_advice,
    metadata.extra_messages,
    metadata.ai_response,
  ]
    .flatMap(getReadableTextItems);

  if (!sections.length) {
    return '<p>No reading interpretation was saved.</p>';
  }

  return sections
    .map((section) => `<p>${escapeHtml(String(section).trim())}</p>`)
    .join('');
}

function renderSavedReadingDetails(reading, detailsId) {
  const cards = Array.isArray(reading.cards) ? reading.cards : [];
  const metadata = getReadingMetadata(reading);
  const question = getReadingQuestion(reading);
  const modeLabel = toTitleLabel(getReadingModeValue(reading));
  const spreadLabel = toTitleLabel(reading.spread_type || metadata.spread);
  const cardCountLabel = `${formatReadableValue(reading.card_count, cards.length || 'Unknown')} Cards`;

  return `
    <div class="saved-reading-card__details" data-saved-reading-details="${escapeHtml(detailsId)}" hidden>
      <div class="saved-reading-card__detail-header">
        <div>
          <span>${escapeHtml(getReadingTypeLabel(reading))}</span>
          <h4>${escapeHtml(reading.reader_name || 'Astral Reading')}</h4>
        </div>
        <p>${escapeHtml(formatDateTime(reading.created_at))}</p>
        <p>${escapeHtml(modeLabel)} · ${escapeHtml(spreadLabel)} · ${escapeHtml(cardCountLabel)}</p>
      </div>
      ${isAiReading(reading) && question ? `
        <div class="saved-reading-card__question">
          <span>Question</span>
          <p>${escapeHtml(question)}</p>
        </div>
      ` : ''}
      <section class="saved-reading-card__detail-section" aria-label="Cards drawn">
        <h4>Cards Drawn</h4>
        ${
          cards.length
            ? `<div class="saved-reading-card__cards">${cards.map(formatSavedCard).join('')}</div>`
            : '<p>No card details were saved for this reading.</p>'
        }
      </section>
      <section class="saved-reading-card__detail-section" aria-label="Reading interpretation">
        <h4>Reading Interpretation</h4>
        <div class="saved-reading-card__summary">${renderReadingParagraphs(reading)}</div>
      </section>
    </div>
  `;
}

function renderReadingFilters() {
  return `
    <div class="reading-filter-chips" role="group" aria-label="Filter reading archive">
      ${['all', 'standard', 'ai'].map((filter) => `
        <button
          class="reading-filter-chip${activeReadingFilter === filter ? ' is-active' : ''}"
          type="button"
          data-reading-filter="${filter}"
          aria-pressed="${activeReadingFilter === filter ? 'true' : 'false'}"
        >
          ${filter === 'all' ? 'All' : filter === 'ai' ? 'AI' : 'Standard'}
        </button>
      `).join('')}
    </div>
  `;
}

function renderSavedReadings(readings) {
  if (!savedReadingsList) {
    return;
  }

  if (!readings.length) {
    savedReadingsList.innerHTML = `
      ${renderReadingFilters()}
      <div class="saved-readings__empty">
        <h3>No saved readings yet.</h3>
        <p>Readings you choose to save will appear here.</p>
      </div>
    `;
    return;
  }

  const filteredReadings = readings.filter((reading) => {
    if (activeReadingFilter === 'ai') {
      return isAiReading(reading);
    }

    if (activeReadingFilter === 'standard') {
      return !isAiReading(reading);
    }

    return true;
  });

  if (!filteredReadings.length) {
    savedReadingsList.innerHTML = `
      ${renderReadingFilters()}
      <div class="saved-readings__empty">
        <h3>No readings found.</h3>
        <p>No ${activeReadingFilter === 'ai' ? 'AI' : 'standard'} readings are saved yet.</p>
      </div>
    `;
    return;
  }

  savedReadingsList.innerHTML = `
    ${renderReadingFilters()}
    ${filteredReadings
    .map((reading, index) => {
      const metadata = getReadingMetadata(reading);
      const detailsId = reading.id || `saved-reading-${index}`;
      const question = getReadingQuestion(reading);
      const title = isAiReading(reading) && question
        ? `“${question}”`
        : reading.reader_name || metadata.title || 'Astral Reading';
      const modeLabel = toTitleLabel(getReadingModeValue(reading));
      const spreadLabel = toTitleLabel(reading.spread_type || metadata.spread);
      const cardCountLabel = `${formatReadableValue(reading.card_count, Array.isArray(reading.cards) ? reading.cards.length : 'Unknown')} Cards`;
      const creditText = formatCreditCost(reading);

      return `
      <article class="saved-reading-card ${getReadingModeClass(reading)}">
        <div class="saved-reading-card__header">
          <div class="saved-reading-card__title">
            <span class="saved-reading-card__badge">${escapeHtml(getReadingTypeLabel(reading))}</span>
            <span class="saved-reading-card__date">${escapeHtml(formatDateTime(reading.created_at))}</span>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml([
              isAiReading(reading) && question ? reading.reader_name : '',
              modeLabel,
              spreadLabel,
              cardCountLabel,
            ].filter(Boolean).join(' · '))}</p>
            ${creditText ? `<p class="saved-reading-card__credits">${escapeHtml(creditText)}</p>` : ''}
          </div>
          <button class="card-action saved-reading-card__toggle" type="button" data-saved-reading-toggle="${escapeHtml(detailsId)}">View Reading</button>
        </div>
        ${renderSavedReadingDetails(reading, detailsId)}
      </article>
    `;
    })
    .join('')}
  `;
}

async function loadSavedReadings() {
  if (!savedReadingsList || savedReadingsLoaded || !activeUser) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    savedReadingsList.innerHTML = '<p class="saved-readings__state">Saved readings are not available in this environment.</p>';
    return;
  }

  savedReadingsList.innerHTML = '<p class="saved-readings__state">Loading saved readings...</p>';

  const { data, error } = await supabase
    .from('user_readings')
    .select('id, created_at, reader_name, mode_key, spread_type, card_count, is_saved, cards, result_summary, metadata')
    .eq('user_id', activeUser.id)
    .order('created_at', { ascending: false });

  if (error) {
    savedReadingsList.innerHTML = '<p class="saved-readings__state">We could not load your saved readings. Please try again.</p>';
    return;
  }

  savedReadingsLoaded = true;
  savedReadingsCache = data || [];
  renderSavedReadings(savedReadingsCache);
}

async function loadArtifactCount() {
  if (!artifactCountValue || !activeUser) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    artifactCountValue.textContent = 'Soon';
    return;
  }

  artifactCountValue.textContent = '...';

  const { count, error } = await supabase
    .from('user_artifacts')
    .select('artifact_key', { count: 'exact', head: true })
    .eq('user_id', activeUser.id);

  artifactCountValue.textContent = error ? 'Soon' : String(count || 0);
}

async function loadRoomCount() {
  if (!roomCountValue || !activeUser) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    roomCountValue.textContent = 'Soon';
    return;
  }

  roomCountValue.textContent = '...';

  const { count, error } = await supabase
    .from('user_rooms')
    .select('room_key', { count: 'exact', head: true })
    .eq('user_id', activeUser.id);

  roomCountValue.textContent = error ? 'Soon' : String(count || 0);
}

function showError(message) {
  loadingPanel.hidden = true;
  accountPanel.hidden = true;
  errorPanel.hidden = false;
  errorPanel.textContent = message;
}

function showAccountSection(sectionName) {
  const nextSection = accountSections.find((section) => section.dataset.accountSection === sectionName);

  if (!nextSection) {
    return;
  }

  accountSections.forEach((section) => {
    section.hidden = section !== nextSection;
  });

  sectionButtons.forEach((button) => {
    const isActive = button.dataset.accountSectionTarget === sectionName;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-current', isActive ? 'page' : 'false');
  });

  if (sectionName === 'past-readings') {
    loadSavedReadings();
  }
}

function showHashAccountSection() {
  showAccountSection(getAccountSectionFromHash());
}

function setMobileNavOpen(isOpen) {
  accountNav?.classList.toggle('is-open', isOpen);
  accountNavToggle?.setAttribute('aria-expanded', String(isOpen));
  accountNavToggle?.setAttribute('aria-label', isOpen ? 'Close account navigation' : 'Open account navigation');
}

async function loadAccount() {
  if (!isSupabaseConfigured()) {
    showError('Account access is not configured for this environment.');
    return;
  }

  const { user, profile, error } = await getCurrentUserWithProfile();

  if (error) {
    showError('Your account could not be loaded. Please try again.');
    return;
  }

  if (!user) {
    window.location.replace('auth.html');
    return;
  }

  activeUser = user;
  activeProfile = profile || {};

  const { isAdmin } = await isCurrentUserAdmin();

  updateAccountProfileDisplay(activeProfile, user);

  adminLink.hidden = !isAdmin;
  loadingPanel.hidden = true;
  accountPanel.hidden = false;
  loadArtifactCount();
  loadRoomCount();

  if (getAccountSectionFromHash() === 'past-readings') {
    loadSavedReadings();
  }
}

async function handleLogout(event) {
  const clickedButton = event.currentTarget;
  logoutButtons.forEach((button) => {
    button.disabled = true;
  });
  clickedButton.dataset.originalText = clickedButton.textContent;
  clickedButton.textContent = 'Logging Out...';

  const { error } = await signOut();

  if (error) {
    logoutButtons.forEach((button) => {
      button.disabled = false;
    });
    clickedButton.textContent = clickedButton.dataset.originalText || 'Log Out';
    showError('We could not log you out. Please try again.');
    return;
  }

  window.location.assign('auth.html');
}

logoutButtons.forEach((button) => {
  button.addEventListener('click', handleLogout);
});

sectionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showAccountSection(button.dataset.accountSectionTarget);
    setMobileNavOpen(false);
  });
});

accountNavToggle?.addEventListener('click', () => {
  setMobileNavOpen(!accountNav?.classList.contains('is-open'));
});

async function refreshProfileAfterUpdate(supabase, fallbackProfile) {
  const { profile: refreshedProfile, error: refetchError } = await fetchCurrentProfile(supabase, activeUser.id);

  if (refetchError) {
    console.error('Account profile refetch failed:', refetchError);
  }

  activeProfile = refreshedProfile || {
    ...activeProfile,
    ...fallbackProfile,
  };
  updateAccountProfileDisplay(activeProfile, activeUser);
}

async function uploadAvatar(file) {
  setAvatarStatus('');
  setProfileStatus('');

  if (!activeUser) {
    setAvatarStatus('Please log in before changing your profile picture.', 'error');
    return;
  }

  const validation = validateAvatarFile(file);

  if (!validation.isValid) {
    console.error('Avatar file validation failed:', validation.debug || { file });
    setAvatarStatus(validation.message, 'error');
    setProfileStatus(validation.message, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setAvatarStatus('Profile picture uploads are not available in this environment.', 'error');
    setProfileStatus('Profile picture uploads are not available in this environment.', 'error');
    return;
  }

  setAvatarUploadLoading(true, 'Preparing...');
  setAvatarStatus('Preparing profile picture...');
  setProfileStatus('Preparing profile picture...');

  try {
  let uploadCandidate;

  try {
    uploadCandidate = await prepareAvatarUpload(file);
  } catch (compressionError) {
    console.error('Avatar compression failed:', compressionError);
    setAvatarUploadLoading(false);
    setAvatarStatus('We could not prepare your profile picture. Please try another image.', 'error');
    setProfileStatus('We could not prepare your profile picture. Please try another image.', 'error');
    return;
  }

  const uploadFile = uploadCandidate.file;
  const uploadContentType = uploadCandidate.contentType || uploadFile.type;
  const supportedUploadTypes = new Set(['image/webp', 'image/jpeg']);

  if (!(uploadFile instanceof Blob) || uploadFile.size <= 0 || !supportedUploadTypes.has(uploadContentType)) {
    console.error('Avatar compression produced an invalid upload file:', {
      file: uploadFile,
      contentType: uploadContentType,
      candidate: uploadCandidate,
    });
    setAvatarUploadLoading(false);
    setAvatarStatus('We could not prepare your profile picture. Please try another image.', 'error');
    setProfileStatus('We could not prepare your profile picture. Please try another image.', 'error');
    return;
  }

  const uploadExtension = uploadContentType === 'image/jpeg' ? 'jpg' : 'webp';
  const storagePath = `${activeUser.id}/profile-${Date.now()}.${uploadExtension}`;
  const uploadDebugContext = {
    bucket: avatarBucketName,
    path: storagePath,
    contentType: uploadContentType,
    fileSize: uploadFile.size,
    originalFileSize: uploadCandidate.originalSize || file.size,
    resizedWidth: uploadCandidate.resizedWidth,
    resizedHeight: uploadCandidate.resizedHeight,
    userId: activeUser.id,
  };

  if (!storagePath.startsWith(`${activeUser.id}/`) || storagePath.includes('avatars/')) {
    console.error('Avatar storage path is invalid:', uploadDebugContext);
    setAvatarUploadLoading(false);
    setAvatarStatus('We could not prepare your profile picture. Please try another image.', 'error');
    setProfileStatus('We could not prepare your profile picture. Please try another image.', 'error');
    return;
  }

  setAvatarStatus('Uploading profile picture...');
  setProfileStatus('Uploading profile picture...');
  setAvatarUploadLoading(true, 'Uploading...');

  const { error: uploadError } = await supabase.storage
    .from(avatarBucketName)
    .upload(storagePath, uploadFile, {
      cacheControl: '3600',
      contentType: uploadContentType,
      upsert: false,
    });

  if (uploadError) {
    console.error('Avatar storage upload failed:', {
      error: uploadError,
      ...uploadDebugContext,
    });
    setAvatarUploadLoading(false);
    setAvatarStatus('We could not upload your profile picture. Please try again.', 'error');
    setProfileStatus('We could not upload your profile picture. Please try again.', 'error');
    return;
  }

  const { data: publicUrlData } = supabase.storage
    .from(avatarBucketName)
    .getPublicUrl(storagePath);
  const avatarUrl = publicUrlData?.publicUrl || '';

  if (!avatarUrl) {
    console.error('Avatar public URL retrieval failed:', {
      data: publicUrlData,
      ...uploadDebugContext,
    });
    setAvatarUploadLoading(false);
    setAvatarStatus('We could not finish updating your profile picture. Please try again.', 'error');
    setProfileStatus('We could not finish updating your profile picture. Please try again.', 'error');
    return;
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', activeUser.id);

  setAvatarUploadLoading(false);

  if (profileError) {
    console.error('Avatar profile update failed', profileError);
    console.error('Avatar profile update failed after storage upload:', {
      error: profileError,
      avatarUrl,
      userId: activeUser.id,
    });
    setAvatarStatus('Image uploaded, but we could not update your profile. Please try again.', 'error');
    setProfileStatus('Image uploaded, but we could not update your profile. Please try again.', 'error');
    return;
  }

  await refreshProfileAfterUpdate(supabase, { avatar_url: avatarUrl });
  showAvatarCompleteStatus();
  setProfileStatus('');
  } finally {
    setAvatarUploadLoading(false);
  }
}

avatarUploadButton?.addEventListener('click', () => {
  avatarUploadInput?.click();
});

avatar?.addEventListener('click', openAvatarPreview);

avatarPreviewCloseButtons.forEach((button) => {
  button.addEventListener('click', closeAvatarPreview);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && avatarPreviewModal && !avatarPreviewModal.hidden) {
    closeAvatarPreview();
  }
});

avatarUploadInput?.addEventListener('change', async () => {
  const [file] = avatarUploadInput.files || [];

  await uploadAvatar(file);
  avatarUploadInput.value = '';
});

function updateZodiacPreviewFromForm() {
  if (!profileForm || !birthdayInput) {
    return;
  }

  const birthday = parseBirthdayInput(birthdayInput.value);
  const sign = birthday.isComplete && birthday.isValid ? getZodiacSign(birthday.month, birthday.day) : '';

  syncBirthdayHiddenFields(
    birthday.isComplete && birthday.isValid ? birthday.month : '',
    birthday.isComplete && birthday.isValid ? birthday.day : ''
  );
  updateSettingsZodiacPreview(sign);
}

profileForm?.addEventListener('input', (event) => {
  if (event.target.matches('[data-birthday-input]')) {
    const normalizedValue = normalizeBirthdayInputValue(event.target.value);

    if (event.target.value !== normalizedValue) {
      event.target.value = normalizedValue;
    }

    updateZodiacPreviewFromForm();
    setProfileStatus('');
  }
});

profileForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!activeUser) {
    setProfileStatus('Please log in before saving your profile.', 'error');
    return;
  }

  const formData = new FormData(profileForm);
  const displayName = String(formData.get('display_name') || '').trim();
  const birthday = parseBirthdayInput(birthdayInput?.value || '');
  const hasBirthday = !birthday.isEmpty;

  if (hasBirthday && !birthday.isComplete) {
    setProfileStatus('Enter your birthday as MM/DD, or leave it blank.', 'error');
    return;
  }

  if (!birthday.isValid) {
    setProfileStatus('That birthday month and day do not look valid.', 'error');
    return;
  }

  const birthMonth = hasBirthday ? birthday.month : null;
  const birthDay = hasBirthday ? birthday.day : null;
  const zodiacSign = hasBirthday ? getZodiacSign(birthMonth, birthDay) : null;
  const supabase = getSupabaseClient();

  syncBirthdayHiddenFields(birthMonth, birthDay);

  if (!supabase) {
    setProfileStatus('Profile saving is not available in this environment.', 'error');
    return;
  }

  profileSubmitButton.disabled = true;
  setProfileStatus('Saving profile...');

  const payload = {
    display_name: displayName || null,
    birth_month: birthMonth,
    birth_day: birthDay,
    zodiac_sign: zodiacSign,
  };

  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', activeUser.id);

  profileSubmitButton.disabled = false;

  if (error) {
    console.error('Account profile save failed:', error);
    setProfileStatus('We could not save your profile. Please try again.', 'error');
    return;
  }

  const { profile: refreshedProfile, error: refetchError } = await fetchCurrentProfile(supabase, activeUser.id);

  if (refetchError) {
    console.error('Account profile refetch failed:', refetchError);
  }

  activeProfile = refreshedProfile || {
    ...activeProfile,
    ...payload,
  };
  updateAccountProfileDisplay(activeProfile, activeUser);
  showProfileSavedStatus();
});

journalNewEntryButton?.addEventListener('click', () => {
  if (!journalStatus) {
    return;
  }

  journalStatus.textContent = 'Journal writing is coming soon.';

  window.setTimeout(() => {
    if (journalStatus.textContent === 'Journal writing is coming soon.') {
      journalStatus.textContent = '';
    }
  }, 3200);
});

savedReadingsList?.addEventListener('click', (event) => {
  const filterButton = event.target.closest('[data-reading-filter]');

  if (filterButton) {
    activeReadingFilter = filterButton.dataset.readingFilter || 'all';
    renderSavedReadings(savedReadingsCache);
    return;
  }

  const toggleButton = event.target.closest('[data-saved-reading-toggle]');

  if (!toggleButton) {
    return;
  }

  const details = savedReadingsList.querySelector(
    `[data-saved-reading-details="${CSS.escape(toggleButton.dataset.savedReadingToggle)}"]`
  );

  if (!details) {
    return;
  }

  const isOpening = details.hidden;
  details.hidden = !isOpening;
  toggleButton.textContent = isOpening ? 'Hide Reading' : 'View Reading';
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    setMobileNavOpen(false);
  }
});

window.addEventListener('hashchange', showHashAccountSection);

showHashAccountSection();
loadAccount();
