import {
  getAccountStatus,
  getBannedAccountMessage,
  getCurrentUserWithProfile,
  isBannedUser,
  isCurrentUserAdmin,
  signOut,
} from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';
import {
  getProfileUnlockDefinition,
  grantRestrictedWingProfileRewards,
  restrictedWingProfileRewardKeys,
} from './profile-unlocks.js';
import { getUserProgressStats } from './progression.js';
import {
  getCardImageForReadingDeck,
  getReadingDeckIdentity,
  loadReadingDeckData,
} from './reading-deck-resolver.js';
import {
  parseGuidedReflectionText,
  renderGuidedReflection,
} from './journal-guided-reflection.js';
import {
  applyGlowEffectsPreference,
  applyReduceMotionPreference,
  normalizeUserPreferences,
  userPreferenceDefaults,
} from './user-preferences.js';

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
const profileHeroCard = document.querySelector('[data-profile-hero-card]');
const profileTitleBadge = document.querySelector('[data-profile-title-badge]');
const profileTitleLabel = document.querySelector('[data-profile-title-label]');
const profileBackgroundEditButton = document.querySelector('[data-profile-background-edit]');
const profileBackgroundModal = document.querySelector('[data-profile-background-modal]');
const profileBackgroundList = document.querySelector('[data-profile-background-list]');
const profileBackgroundStatus = document.querySelector('[data-profile-background-status]');
const profileBackgroundCloseButtons = Array.from(document.querySelectorAll('[data-profile-background-close]'));
const logoutButtons = Array.from(document.querySelectorAll('[data-logout]'));
const adminLink = document.querySelector('[data-admin-link]');
const memberSinceValue = document.querySelector('[data-member-since]');
const sectionButtons = Array.from(document.querySelectorAll('[data-account-section-target]'));
const accountSections = Array.from(document.querySelectorAll('[data-account-section]'));
const accountNav = document.querySelector('[data-account-nav]');
const accountNavToggle = document.querySelector('[data-account-nav-toggle]');
const savedReadingsList = document.querySelector('[data-saved-readings-list]');
const readingFilterControls = document.querySelector('[data-reading-filter-controls]');
const readingPagination = document.querySelector('[data-reading-pagination]');
const readingPaginationSummary = document.querySelector('[data-reading-pagination-summary]');
const readingPaginationControls = document.querySelector('[data-reading-pagination-controls]');
const savedReadingModal = document.querySelector('[data-saved-reading-modal]');
const savedReadingModalContent = document.querySelector('[data-saved-reading-modal-content]');
const savedReadingModalTitle = document.querySelector('[data-saved-reading-modal-title]');
const savedReadingModalCloseButtons = Array.from(document.querySelectorAll('[data-saved-reading-modal-close]'));
const savedReadingCountValue = document.querySelector('[data-account-saved-reading-count]');
const artifactCountValue = document.querySelector('[data-account-artifact-count]');
const discoveryCountValue = document.querySelector('[data-account-discovery-count]');
const roomCountValue = document.querySelector('[data-account-room-count]');
const journalCountValue = document.querySelector('[data-account-journal-count]');
const activityTitle = document.querySelector('[data-account-activity-title]');
const activityList = document.querySelector('[data-account-activity-list]');
const reflectionTitle = document.querySelector('[data-account-reflection-title]');
const reflectionBody = document.querySelector('[data-account-reflection-body]');
const zodiacValue = document.querySelector('[data-account-zodiac]');
const zodiacIcon = document.querySelector('[data-account-zodiac-icon]');
const zodiacLabel = document.querySelector('[data-account-zodiac-label]');
const profileForm = document.querySelector('[data-profile-form]');
const profileSubmitButton = document.querySelector('[data-profile-submit]');
const profileStatus = document.querySelector('[data-profile-status]');
const showProfileTitleToggle = document.querySelector('[data-preference-show-profile-title]');
const selectedProfileTitleSelect = document.querySelector('[data-preference-selected-profile-title]');
const allowReversedCardsToggle = document.querySelector('[data-preference-allow-reversed-cards]');
const saveReadingsPromptToggle = document.querySelector('[data-preference-save-readings-prompt]');
const reduceMotionToggle = document.querySelector('[data-preference-reduce-motion]');
const disableGlowEffectsToggle = document.querySelector('[data-preference-disable-glow-effects]');
const defaultReadingModeSelect = document.querySelector('[data-preference-default-reading-mode]');
const preferencesStatus = document.querySelector('[data-preferences-status]');
const zodiacPreview = document.querySelector('[data-zodiac-preview]');
const zodiacDates = document.querySelector('[data-zodiac-dates]');
const birthdayInput = document.querySelector('[data-birthday-input]');
const settingsZodiacImage = document.querySelector('[data-settings-zodiac-image]');
const journalStatus = document.querySelector('[data-journal-status]');
const journalForm = document.querySelector('[data-journal-form]');
const journalSaveButton = document.querySelector('[data-journal-save]');
const journalCancelButton = document.querySelector('[data-journal-cancel]');
const journalList = document.querySelector('[data-journal-list]');
const journalEmptyState = document.querySelector('[data-journal-empty]');
const journalFilterButtons = Array.from(document.querySelectorAll('[data-journal-filter]'));
const journalView = document.querySelector('[data-journal-view]');
const journalViewMeta = document.querySelector('[data-journal-view-meta]');
const journalViewTitle = document.querySelector('[data-journal-view-title]');
const journalViewChips = document.querySelector('[data-journal-view-chips]');
const journalViewContent = document.querySelector('[data-journal-view-content]');
const journalViewCloseButton = document.querySelector('[data-journal-view-close]');
const journalViewEditButton = document.querySelector('[data-journal-view-edit]');
const journalViewDeleteButton = document.querySelector('[data-journal-view-delete]');
const journalViewBackdrop = document.querySelector('[data-journal-view-backdrop]');
const journalPagination = document.querySelector('[data-journal-pagination]');
const journalPaginationSummary = document.querySelector('[data-journal-pagination-summary]');
const journalPaginationControls = document.querySelector('[data-journal-pagination-controls]');
const journalFilterControls = document.querySelector('[data-journal-filter-controls]');
const contactForm = document.querySelector('[data-contact-form]');
const contactTopicSelect = document.querySelector('[data-contact-topic]');
const contactEmailInput = document.querySelector('[data-contact-email]');
const contactSubjectInput = document.querySelector('[data-contact-subject]');
const contactMessageInput = document.querySelector('[data-contact-message]');
const contactSubmitButton = document.querySelector('[data-contact-submit]');
const contactStatus = document.querySelector('[data-contact-status]');
const securityAccountEmail = document.querySelector('[data-security-account-email]');
const securityStatus = document.querySelector('[data-security-status]');
const passwordResetSendButton = document.querySelector('[data-password-reset-send]');
const changePasswordModal = document.querySelector('[data-change-password-modal]');
const changePasswordForm = document.querySelector('[data-change-password-form]');
const changePasswordCancelButtons = Array.from(document.querySelectorAll('[data-change-password-cancel]'));
const changePasswordNewInput = document.querySelector('[data-change-password-new]');
const changePasswordConfirmInput = document.querySelector('[data-change-password-confirm]');
const changePasswordSubmitButton = document.querySelector('[data-change-password-submit]');
const changePasswordSecurityEmailButton = document.querySelector('[data-change-password-security-email]');
const changePasswordStatus = document.querySelector('[data-change-password-status]');
const privacyControlsOpenButton = document.querySelector('[data-privacy-controls-open]');
const privacyControlsModal = document.querySelector('[data-privacy-controls-modal]');
const privacyControlsCloseButtons = Array.from(document.querySelectorAll('[data-privacy-controls-close]'));
const privacyCleanupButtons = Array.from(document.querySelectorAll('[data-privacy-cleanup]'));
const privacyControlsStatus = document.querySelector('[data-privacy-controls-status]');
const accountDeletionOpenButton = document.querySelector('[data-account-deletion-open]');
const accountDeletionModal = document.querySelector('[data-account-deletion-modal]');
const accountDeletionForm = document.querySelector('[data-account-deletion-form]');
const accountDeletionCancelButtons = Array.from(document.querySelectorAll('[data-account-deletion-cancel]'));
const accountDeletionConfirmationInput = document.querySelector('[data-account-deletion-confirmation]');
const accountDeletionReasonInput = document.querySelector('[data-account-deletion-reason]');
const accountDeletionSubmitButton = document.querySelector('[data-account-deletion-submit]');
const accountDeletionStatus = document.querySelector('[data-account-deletion-status]');

let savedReadingsLoaded = false;
let savedReadingsCache = [];
let activeReadingFilter = 'all';
let activeReadingPage = 1;
let activeSavedReadingModalId = '';

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
let journalEntriesLoaded = false;
let journalEntriesCache = [];
let activeJournalFilter = 'all';
let editingJournalEntryId = '';
let activeJournalPage = 1;
let journalPageSize = 9;
let journalTotalEntries = 0;
let journalFilterDatesLoaded = false;
let journalFilterDateValues = [];
let activeJournalWeekStart = getStartOfWeek(new Date());
let activeJournalDay = '';
let activeJournalMonth = '';
let activeJournalYear = '';
let overviewMetrics = {
  savedReadings: 0,
  artifacts: 0,
  discoveries: 0,
  rooms: 0,
  journals: 0,
};
let activeUser = null;
let activeProfile = null;
let activeAvatarUrl = '';
let activeProfileUnlocks = [];
let avatarStatusClearTimer = null;
let profileStatusClearTimer = null;
let journalStatusClearTimer = null;
let preferencesStatusClearTimer = null;
let preferencesSaveQueue = Promise.resolve();
let hasContactSubjectBeenEdited = false;

const avatarBucketName = 'avatars';
const defaultProfileBackgroundKey = 'default';
const defaultProfileBackgroundPath = 'assets/images/unlockables/user-profile-bg.png';
const journalEntrySelectColumns = 'id, user_id, title, body, check_in, entry_date, mood_key, mood, tags, prompt, guided_answers, mode, source_type, source_reading_id, linked_reading_id, reflection_type, metadata, created_at, updated_at';
const restrictedWingProfileTitleUnlockKey = 'restricted_wing_title_marked';
const discoveryActivitySelectColumns = [
  'id',
  'discovery_key',
  'discovery_type',
  'source_location',
  'mode_key',
  'related_artifact_key',
  'related_room_key',
  'related_fragment_key',
  'related_veilwalker_key',
  'metadata',
  'discovered_at',
].join(', ');
const savedReadingsPageSize = 10;
const contactEmailMaxLength = 254;
const contactSubjectMaxLength = 160;
const contactMessageMaxLength = 5000;
const accountDeletionReasonMaxLength = 1000;
const privacyCleanupActions = {
  recent: {
    table: 'user_gallery_recent_records',
    label: 'recently viewed Gallery records',
    confirmMessage: 'Clear your recently viewed Gallery records? This only removes your account history for Gallery records.'
  },
  marked: {
    table: 'user_gallery_marked_records',
    label: 'marked Gallery records',
    confirmMessage: 'Clear your marked Gallery records? This only removes your account marks in the Gallery.'
  },
};

// Account archive data is private. Client filters by activeUser.id for UX, and
// Supabase owner-only RLS is the required enforcement layer for deployment.
const maxAvatarInputFileSize = 8 * 1024 * 1024;
const targetAvatarUploadSize = 2 * 1024 * 1024;
const maxAvatarImageSide = 800;
const avatarCompressionQuality = 0.82;
const changePasswordMinimumLength = 8;
let isChangingPassword = false;
let changePasswordCloseTimer = null;
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

  if (accountSections.some((section) => section.dataset.accountSection === sectionName)) {
    return sectionName;
  }

  if (window.location.hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#overview`);
  }

  return 'overview';
}

function setAccountSectionHash(sectionName) {
  const nextSection = accountSections.find((section) => section.dataset.accountSection === sectionName);

  if (!nextSection) {
    return;
  }

  const nextHash = `#${sectionName}`;

  if (window.location.hash === nextHash) {
    showAccountSection(sectionName);
    setMobileNavOpen(false);
    return;
  }

  window.location.hash = sectionName;
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

function getProfilePreferences(profile) {
  return profile?.preferences && typeof profile.preferences === 'object' && !Array.isArray(profile.preferences)
    ? profile.preferences
    : {};
}

function hasProfileTitlePreference(profile) {
  return Object.prototype.hasOwnProperty.call(getProfilePreferences(profile), 'selected_profile_title');
}

function normalizeProfileTitleValue(value) {
  const normalized = String(value || '').trim().toLowerCase();

  if (normalized === 'none' || normalized === 'seeker' || normalized === 'marked') {
    return normalized;
  }

  return '';
}

function isMarkedProfileTitleUnlocked() {
  return Boolean(getUnlockedProfileItem(restrictedWingProfileTitleUnlockKey));
}

function getProfileTitleFromPreferences(profile) {
  if (!hasProfileTitlePreference(profile)) {
    return '';
  }

  const selected = normalizeProfileTitleValue(getProfilePreferences(profile).selected_profile_title);

  if (selected === 'marked' && !isMarkedProfileTitleUnlocked()) {
    return '';
  }

  return selected;
}

function getLegacyProfileTitleKey(profile) {
  return getProfileValue(profile, ['equipped_profile_title']) === restrictedWingProfileTitleUnlockKey && isMarkedProfileTitleUnlocked()
    ? 'marked'
    : '';
}

function getStoredProfileTitleForInput(profile) {
  return getProfileTitleFromPreferences(profile) || getLegacyProfileTitleKey(profile) || 'seeker';
}

function getProfileTitleChoice(profile) {
  const selected = getProfileTitleFromPreferences(profile);
  const stored = selected || getLegacyProfileTitleKey(profile) || 'seeker';

  if (stored === 'marked' && !isMarkedProfileTitleUnlocked()) {
    return {
      key: 'seeker',
      modeKey: 'sun',
      label: 'Seeker',
    };
  }

  if (stored === 'marked') {
    const unlockedTitle = getUnlockedProfileItem(restrictedWingProfileTitleUnlockKey);
    const definition = getProfileUnlockDefinition(restrictedWingProfileTitleUnlockKey);

    return {
      key: 'marked',
      modeKey: 'bloodmoon',
      label: unlockedTitle?.label || definition?.label || 'Marked',
    };
  }

  if (stored === 'seeker') {
    return {
      key: 'seeker',
      modeKey: 'sun',
      label: 'Seeker',
    };
  }

  return null;
}

function shouldShowProfileTitle(profile) {
  return getProfilePreferences(profile).show_profile_title !== false;
}

function getAdvancedUserPreferences(profile) {
  return normalizeUserPreferences({
    ...userPreferenceDefaults,
    ...getProfilePreferences(profile),
  });
}

function updatePreferenceControls(profile) {
  if (showProfileTitleToggle) {
    showProfileTitleToggle.checked = shouldShowProfileTitle(profile);
  }

  const advancedPreferences = getAdvancedUserPreferences(profile);

  if (allowReversedCardsToggle) {
    allowReversedCardsToggle.checked = advancedPreferences.allow_reversed_cards;
  }

  if (saveReadingsPromptToggle) {
    saveReadingsPromptToggle.checked = advancedPreferences.save_readings_prompt;
  }

  if (reduceMotionToggle) {
    reduceMotionToggle.checked = advancedPreferences.reduce_motion;
  }

  if (disableGlowEffectsToggle) {
    disableGlowEffectsToggle.checked = advancedPreferences.disable_glow_effects;
  }

  if (defaultReadingModeSelect) {
    defaultReadingModeSelect.value = advancedPreferences.default_reading_mode;
  }

  applyReduceMotionPreference(advancedPreferences);
  applyGlowEffectsPreference(advancedPreferences);

  if (!selectedProfileTitleSelect) {
    return;
  }

  const selectedTitle = getStoredProfileTitleForInput(profile);
  const markedOption = selectedProfileTitleSelect.querySelector('[value="marked"]');

  if (!markedOption) {
    selectedProfileTitleSelect.value = selectedTitle;
    return;
  }

  markedOption.hidden = !isMarkedProfileTitleUnlocked();

  if (markedOption.hidden && selectedProfileTitleSelect.value === 'marked') {
    selectedProfileTitleSelect.value = 'seeker';
  }

  selectedProfileTitleSelect.value = selectedTitle;

  if (!isMarkedProfileTitleUnlocked() && selectedProfileTitleSelect.value === 'marked') {
    selectedProfileTitleSelect.value = 'seeker';
  }
}

function ensureProfileTitlePreferenceExists(profile) {
  if (!activeUser || hasProfileTitlePreference(profile)) {
    return;
  }

  const nextPreference = getLegacyProfileTitleKey(profile) || 'seeker';
  void updateProfilePreference('selected_profile_title', nextPreference, false);
}

function getUnlockedProfileItem(unlockKey) {
  return activeProfileUnlocks.find((unlock) => unlock.unlock_key === unlockKey) || null;
}

function isDefaultProfileBackgroundKey(unlockKey) {
  return !unlockKey || unlockKey === defaultProfileBackgroundKey;
}

function getEquippedProfileBackground(profile) {
  const backgroundUrl = getProfileValue(profile, ['profile_background_url']);

  if (!backgroundUrl) {
    return {
      key: 'default',
      label: 'Default Archive',
      assetPath: defaultProfileBackgroundPath,
    };
  }

  const unlockedBackground = activeProfileUnlocks.find((unlock) => unlock.asset_path === backgroundUrl) || null;
  const assetPath = unlockedBackground?.asset_path || backgroundUrl;

  if (assetPath) {
    return {
      key: unlockedBackground?.unlock_key || 'custom_background',
      label: unlockedBackground?.label || 'Profile Background',
      assetPath,
    };
  }

  return null;
}

function setProfileHeroBackground(assetPath = defaultProfileBackgroundPath) {
  if (!profileHeroCard) {
    return;
  }

  const sanitizedPath = String(assetPath || defaultProfileBackgroundPath).replace(/"/g, '%22');
  profileHeroCard.style.setProperty('--profile-hero-background', `url("${sanitizedPath}")`);
}

function updateProfileTitleBadge(profile) {
  if (!profileTitleBadge || !profileTitleLabel) {
    return;
  }

  const title = getProfileTitleChoice(profile);
  const selected = getProfileTitleFromPreferences(profile);

  if (!title || !shouldShowProfileTitle(profile) || selected === 'none') {
    profileTitleBadge.hidden = true;
    profileTitleBadge.className = 'profile-title-badge';
    profileTitleLabel.textContent = '';
    return;
  }

  profileTitleBadge.hidden = false;
  profileTitleBadge.className = `profile-title-badge profile-title-badge--${title.key === 'marked' ? 'marked' : 'seeker'}`;
  profileTitleLabel.textContent = title.label;
}

async function loadProfileUnlocks() {
  if (!activeUser) {
    activeProfileUnlocks = [];
    return activeProfileUnlocks;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    activeProfileUnlocks = [];
    return activeProfileUnlocks;
  }

  const { data, error } = await supabase
    .from('user_profile_unlocks')
    .select('unlock_key, unlock_type, label, description, source_key, mode_key, asset_path, metadata, unlocked_at')
    .eq('user_id', activeUser.id)
    .order('unlocked_at', { ascending: false });

  if (error) {
    console.warn('[Astral Veil account] Profile unlocks could not be loaded.');
    activeProfileUnlocks = [];
    return activeProfileUnlocks;
  }

  activeProfileUnlocks = data || [];
  return activeProfileUnlocks;
}

async function ensureRestrictedWingProfileRewards() {
  if (!activeUser) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  const missingReward = restrictedWingProfileRewardKeys.some((key) => !getUnlockedProfileItem(key));

  if (!missingReward) {
    return;
  }

  const [discoveryResponse, artifactResponse] = await Promise.all([
    supabase
      .from('user_discoveries')
      .select('id')
      .eq('user_id', activeUser.id)
      .eq('discovery_key', 'restricted_wing_seal_opened')
      .maybeSingle(),
    supabase
      .from('user_artifacts')
      .select('artifact_key')
      .eq('user_id', activeUser.id),
  ]);

  if (discoveryResponse.error && discoveryResponse.error.code !== 'PGRST116') {
    console.warn('[Astral Veil account] Restricted Wing discovery check failed.');
  }

  if (artifactResponse.error) {
    console.warn('[Astral Veil account] Artifact reward backfill check failed.');
  }

  const artifactKeys = new Set((artifactResponse.data || []).map((artifact) => artifact.artifact_key));
  const hasAllArtifacts = ['air', 'water', 'earth', 'fire'].every((key) => artifactKeys.has(key));
  const hasRestrictedWingDiscovery = Boolean(discoveryResponse.data);

  if (!hasRestrictedWingDiscovery && !hasAllArtifacts) {
    return;
  }

  const result = await grantRestrictedWingProfileRewards();

  if (result.status === 'saved') {
    await loadProfileUnlocks();

    const { profile: refreshedProfile } = await fetchCurrentProfile(supabase, activeUser.id);
    if (refreshedProfile) {
      activeProfile = refreshedProfile;
    }
  }
}

function renderProfileBackgroundOptions() {
  if (!profileBackgroundList) {
    return;
  }

  const equippedBackgroundUrl = getProfileValue(activeProfile, ['profile_background_url']);
  const unlockedBackgrounds = activeProfileUnlocks.filter((unlock) => unlock.unlock_type === 'background');
  const options = [
    {
      unlock_key: defaultProfileBackgroundKey,
      label: 'Default Archive',
      description: 'The original Astral Veil profile background.',
      asset_path: defaultProfileBackgroundPath,
    },
    ...unlockedBackgrounds,
  ];

  profileBackgroundList.innerHTML = options.map((option) => {
    const definition = getProfileUnlockDefinition(option.unlock_key);
    const assetPath = definition?.asset_path || option.asset_path || defaultProfileBackgroundPath;
    const isActive = option.unlock_key === defaultProfileBackgroundKey
      ? !equippedBackgroundUrl
      : assetPath === equippedBackgroundUrl;

    return `
      <button class="profile-background-option${isActive ? ' is-active' : ''}" type="button" data-profile-background-select="${escapeHtml(option.unlock_key)}">
        <span class="profile-background-option__preview" style="background-image: url('${escapeHtml(assetPath)}')"></span>
        <span class="profile-background-option__copy">
          <strong>${escapeHtml(option.label || 'Profile Background')}</strong>
          <small>${escapeHtml(option.description || 'Unlocked profile background.')}</small>
        </span>
        <span class="profile-background-option__state">${isActive ? 'Active' : 'Choose'}</span>
      </button>
    `;
  }).join('');
}

function openProfileBackgroundModal() {
  if (!profileBackgroundModal) {
    return;
  }

  renderProfileBackgroundOptions();

  if (profileBackgroundStatus && !activeProfileUnlocks.some((unlock) => unlock.unlock_type === 'background')) {
    profileBackgroundStatus.textContent = 'No profile backgrounds unlocked yet. Progress through the Archive to reveal new designs.';
  } else if (profileBackgroundStatus) {
    profileBackgroundStatus.textContent = '';
  }

  profileBackgroundModal.hidden = false;
  document.body.classList.add('profile-background-modal-open');
  profileBackgroundModal.querySelector('[data-profile-background-close]')?.focus({ preventScroll: true });
}

function closeProfileBackgroundModal() {
  if (!profileBackgroundModal) {
    return;
  }

  profileBackgroundModal.hidden = true;
  document.body.classList.remove('profile-background-modal-open');

  if (profileBackgroundStatus) {
    profileBackgroundStatus.textContent = '';
  }
}

async function selectProfileBackground(unlockKey) {
  if (!activeUser) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  const isDefault = isDefaultProfileBackgroundKey(unlockKey);
  const selectedUnlock = isDefault
    ? null
    : activeProfileUnlocks.find((unlock) => unlock.unlock_key === unlockKey && unlock.unlock_type === 'background');
  const definition = isDefault ? null : getProfileUnlockDefinition(unlockKey);
  const nextBackgroundUrl = isDefault ? null : definition?.asset_path || selectedUnlock?.asset_path || null;

  if (!isDefault && !selectedUnlock) {
    if (profileBackgroundStatus) {
      profileBackgroundStatus.textContent = 'That background is not unlocked yet.';
    }
    return;
  }

  if (profileBackgroundStatus) {
    profileBackgroundStatus.textContent = 'Equipping background...';
  }

  const { error } = await supabase
    .from('profiles')
    .update({ profile_background_url: nextBackgroundUrl })
    .eq('id', activeUser.id);

  if (error) {
    console.warn('[Astral Veil account] Profile background could not be equipped.', error);
    if (profileBackgroundStatus) {
      profileBackgroundStatus.textContent = 'We could not equip that background. Please try again.';
    }
    return;
  }

  activeProfile = {
    ...(activeProfile || {}),
    profile_background_url: nextBackgroundUrl,
  };
  updateAccountProfileDisplay(activeProfile, activeUser);
  renderProfileBackgroundOptions();

  if (profileBackgroundStatus) {
    profileBackgroundStatus.textContent = 'Background equipped.';
  }

  await refreshProfileAfterUpdate(supabase, { profile_background_url: nextBackgroundUrl });
  renderProfileBackgroundOptions();
}

async function updateProfilePreference(preferenceKey, value, showStatus = true) {
  if (!activeUser) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  const nextPreferences = {
    ...getProfilePreferences(activeProfile),
    [preferenceKey]: value,
  };

  if (preferencesStatus && showStatus) {
    if (preferencesStatusClearTimer) {
      window.clearTimeout(preferencesStatusClearTimer);
      preferencesStatusClearTimer = null;
    }
    preferencesStatus.textContent = 'Saving preference...';
    preferencesStatus.classList.remove('is-error', 'is-success');
  }

  const { error } = await supabase
    .from('profiles')
    .update({ preferences: nextPreferences })
    .eq('id', activeUser.id);

  if (error) {
    console.warn('[Astral Veil account] Preference could not be saved.', error);

    if (preferencesStatus && showStatus) {
      preferencesStatus.textContent = 'We could not save that preference. Please try again.';
      preferencesStatus.classList.add('is-error');
      preferencesStatus.classList.remove('is-success');
    }

    updatePreferenceControls(activeProfile);
    return;
  }

  activeProfile = {
    ...(activeProfile || {}),
    preferences: nextPreferences,
  };
  updateAccountProfileDisplay(activeProfile, activeUser);

  if (preferencesStatus && showStatus) {
    preferencesStatus.textContent = 'Preference saved.';
    preferencesStatus.classList.add('is-success');
    preferencesStatus.classList.remove('is-error');
    preferencesStatusClearTimer = window.setTimeout(() => {
      preferencesStatus.textContent = '';
      preferencesStatus.classList.remove('is-success');
      preferencesStatusClearTimer = null;
    }, 2400);
  }
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
  const equippedBackground = getEquippedProfileBackground(profile);

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

  setProfileHeroBackground(equippedBackground?.assetPath || defaultProfileBackgroundPath);
  updateProfileTitleBadge(profile);

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

function setContactStatus(message = '', type = '') {
  if (!contactStatus) {
    return;
  }

  contactStatus.textContent = message;
  contactStatus.classList.toggle('is-success', type === 'success');
  contactStatus.classList.toggle('is-error', type === 'error');
}

function getContactSubjectForTopic(topic) {
  return topic ? `[Astral Veil] ${topic}` : '';
}

function populateContactEmail(user) {
  if (!contactEmailInput || contactEmailInput.value.trim()) {
    return;
  }

  contactEmailInput.value = user?.email || '';
}

function updateSecurityAccountEmail(user) {
  if (securityAccountEmail) {
    securityAccountEmail.textContent = user?.email || 'No email available';
  }
}

function setSecurityStatus(message = '', type = '') {
  if (!securityStatus) {
    return;
  }

  securityStatus.textContent = message || 'Your account details remain private and connected only to your Archive.';
  securityStatus.classList.toggle('is-success', type === 'success');
  securityStatus.classList.toggle('is-error', type === 'error');
}

function setChangePasswordStatus(message = '', type = '') {
  if (!changePasswordStatus) {
    return;
  }

  changePasswordStatus.textContent = message;
  changePasswordStatus.classList.toggle('is-success', type === 'success');
  changePasswordStatus.classList.toggle('is-error', type === 'error');
}

function setChangePasswordSaving(isSaving) {
  isChangingPassword = isSaving;

  if (changePasswordSubmitButton) {
    changePasswordSubmitButton.disabled = isSaving;
    changePasswordSubmitButton.textContent = isSaving ? 'Updating...' : 'Update Password';
  }

  changePasswordCancelButtons.forEach((button) => {
    button.disabled = isSaving;
  });
}

function setChangePasswordModalOpen(isOpen) {
  if (!changePasswordModal) {
    return;
  }

  window.clearTimeout(changePasswordCloseTimer);
  changePasswordModal.hidden = !isOpen;
  document.body.classList.toggle('change-password-modal-open', isOpen);

  if (!isOpen) {
    changePasswordForm?.reset();
    changePasswordNewInput?.removeAttribute('aria-invalid');
    changePasswordConfirmInput?.removeAttribute('aria-invalid');
    if (changePasswordSecurityEmailButton) {
      changePasswordSecurityEmailButton.hidden = true;
    }
    setChangePasswordSaving(false);
    setChangePasswordStatus('');
    passwordResetSendButton?.focus({ preventScroll: true });
    return;
  }

  if (!activeUser) {
    setChangePasswordStatus('Please log in again to change your password.', 'error');
    if (changePasswordSubmitButton) {
      changePasswordSubmitButton.disabled = true;
    }
    if (changePasswordSecurityEmailButton) {
      changePasswordSecurityEmailButton.hidden = true;
    }
  } else {
    setChangePasswordStatus('');
    if (changePasswordSubmitButton) {
      changePasswordSubmitButton.disabled = false;
    }
    if (changePasswordSecurityEmailButton) {
      changePasswordSecurityEmailButton.hidden = true;
    }
  }

  changePasswordNewInput?.focus({ preventScroll: true });
}

function validateChangePasswordForm() {
  const newPassword = String(changePasswordNewInput?.value || '');
  const confirmPassword = String(changePasswordConfirmInput?.value || '');
  let message = '';

  changePasswordNewInput?.removeAttribute('aria-invalid');
  changePasswordConfirmInput?.removeAttribute('aria-invalid');

  if (!newPassword) {
    message = 'Enter a new password.';
    changePasswordNewInput?.setAttribute('aria-invalid', 'true');
  } else if (!confirmPassword) {
    message = 'Confirm your new password.';
    changePasswordConfirmInput?.setAttribute('aria-invalid', 'true');
  } else if (newPassword.length < changePasswordMinimumLength) {
    message = 'Use at least 8 characters for your new password.';
    changePasswordNewInput?.setAttribute('aria-invalid', 'true');
  } else if (newPassword !== confirmPassword) {
    message = 'The passwords do not match.';
    changePasswordConfirmInput?.setAttribute('aria-invalid', 'true');
  }

  if (message) {
    setChangePasswordStatus(message, 'error');
    return null;
  }

  return newPassword;
}

function isReauthenticationRequiredError(error) {
  const message = String(error?.message || error?.name || error?.code || '').toLowerCase();

  return message.includes('reauth') ||
    message.includes('re-auth') ||
    message.includes('nonce') ||
    message.includes('recent') ||
    message.includes('security');
}

function setPrivacyControlsStatus(message = '', type = '') {
  if (!privacyControlsStatus) {
    return;
  }

  privacyControlsStatus.textContent = message;
  privacyControlsStatus.classList.toggle('is-success', type === 'success');
  privacyControlsStatus.classList.toggle('is-error', type === 'error');
}

function setPrivacyControlsModalOpen(isOpen) {
  if (!privacyControlsModal) {
    return;
  }

  privacyControlsModal.hidden = !isOpen;
  document.body.classList.toggle('privacy-controls-modal-open', isOpen);

  if (!isOpen) {
    setPrivacyControlsStatus('');
    privacyCleanupButtons.forEach((button) => {
      button.disabled = false;
      button.textContent = button.dataset.originalText || button.textContent;
      delete button.dataset.originalText;
    });
    privacyControlsOpenButton?.focus({ preventScroll: true });
    return;
  }

  privacyCleanupButtons[0]?.focus({ preventScroll: true });
}

async function sendPasswordSecurityEmail() {
  const supabase = getSupabaseClient();
  const email = activeUser?.email || '';

  if (!supabase || !email) {
    setChangePasswordStatus('Please log in again to change your password.', 'error');
    return false;
  }

  if (changePasswordSecurityEmailButton) {
    changePasswordSecurityEmailButton.disabled = true;
    changePasswordSecurityEmailButton.textContent = 'Sending...';
  }

  setChangePasswordStatus('Sending security email...');

  const { error } = typeof supabase.auth.reauthenticate === 'function'
    ? await supabase.auth.reauthenticate()
    : await supabase.auth.resetPasswordForEmail(email);

  if (changePasswordSecurityEmailButton) {
    changePasswordSecurityEmailButton.disabled = false;
    changePasswordSecurityEmailButton.textContent = 'Send Security Email';
  }

  if (error) {
    console.error('Password security email failed:', error);
    setChangePasswordStatus('We could not send the security email. Please try again in a moment.', 'error');
    return false;
  }

  setChangePasswordStatus('Security email sent. Follow the email instructions, then return to update your password.', 'success');
  return true;
}

async function handleChangePasswordSubmit(event) {
  event.preventDefault();

  const supabase = getSupabaseClient();
  const newPassword = validateChangePasswordForm();

  if (!activeUser || !supabase) {
    setChangePasswordStatus('Please log in again to change your password.', 'error');
    return;
  }

  if (!newPassword) {
    return;
  }

  setChangePasswordSaving(true);
  setChangePasswordStatus('Updating your password...');

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  setChangePasswordSaving(false);

  if (error) {
    console.error('Password update failed:', error);

    if (isReauthenticationRequiredError(error)) {
      setChangePasswordStatus('For your security, confirm this change through your email before choosing a new password.', 'error');
      if (changePasswordSecurityEmailButton) {
        changePasswordSecurityEmailButton.hidden = false;
        changePasswordSecurityEmailButton.focus({ preventScroll: true });
      }
      return;
    }

    setChangePasswordStatus('We could not update your password. Please try again in a moment.', 'error');
    return;
  }

  if (changePasswordSecurityEmailButton) {
    changePasswordSecurityEmailButton.hidden = true;
  }
  changePasswordForm?.reset();
  setChangePasswordStatus('Your password has been updated.', 'success');
  changePasswordCloseTimer = window.setTimeout(() => {
    setChangePasswordModalOpen(false);
  }, 1400);
}

async function clearPrivacyData(actionKey, button) {
  const action = privacyCleanupActions[actionKey];
  const supabase = getSupabaseClient();

  if (!action) {
    return;
  }

  if (!activeUser || !supabase) {
    setPrivacyControlsStatus('Privacy cleanup is not available right now.', 'error');
    return;
  }

  if (!window.confirm(action.confirmMessage)) {
    return;
  }

  if (button) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.textContent = 'Clearing...';
  }

  setPrivacyControlsStatus(`Clearing ${action.label}...`);

  const { error } = await supabase
    .from(action.table)
    .delete()
    .eq('user_id', activeUser.id);

  if (button) {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Clear';
  }

  if (error) {
    console.error(`Privacy cleanup failed for ${action.table}:`, error);
    setPrivacyControlsStatus(`We could not clear your ${action.label}. Please try again in a moment.`, 'error');
    return;
  }

  setPrivacyControlsStatus(`Your ${action.label} have been cleared.`, 'success');
}

function applyContactTopicSubject() {
  if (!contactTopicSelect || !contactSubjectInput) {
    return;
  }

  if (hasContactSubjectBeenEdited && contactSubjectInput.value.trim()) {
    return;
  }

  contactSubjectInput.value = getContactSubjectForTopic(contactTopicSelect.value);
}

function setAccountDeletionStatus(message = '', type = '') {
  if (!accountDeletionStatus) {
    return;
  }

  accountDeletionStatus.textContent = message;
  accountDeletionStatus.classList.toggle('is-success', type === 'success');
  accountDeletionStatus.classList.toggle('is-error', type === 'error');
}

function setAccountDeletionModalOpen(isOpen) {
  if (!accountDeletionModal) {
    return;
  }

  accountDeletionModal.hidden = !isOpen;
  document.body.classList.toggle('account-deletion-modal-open', isOpen);

  if (!isOpen) {
    accountDeletionForm?.reset();
    setAccountDeletionStatus('');
    return;
  }

  accountDeletionConfirmationInput?.focus({ preventScroll: true });
}

function redirectToSignedOutNotice(notice = 'account_deletion_requested') {
  window.location.replace(`/login?notice=${encodeURIComponent(notice)}`);
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
  ensureProfileTitlePreferenceExists(profile);
  populateProfileForm(profile, user);
  populateContactEmail(user);
  updatePreferenceControls(profile);
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
    bloodmoon: 'Blood Moon',
    blue_moon: 'Blue Moon',
    sun: 'Sun',
    moon: 'Moon',
    threeCard: 'Three Card Spread',
    fiveCard: 'Five Card Spread',
    sevenCard: 'Seven Card Spread',
    standard: 'Standard',
  };
  const normalized = String(value).trim();
  const compactNormalized = normalized.toLowerCase().replace(/[\s_-]+/g, '');

  if (labels[normalized]) {
    return labels[normalized];
  }

  if (labels[compactNormalized]) {
    return labels[compactNormalized];
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

function getReadingSpreadValue(reading) {
  const metadata = getReadingMetadata(reading);
  const spread = reading?.spread_type || metadata.spread || '';

  if (spread && typeof spread === 'object' && !Array.isArray(spread)) {
    return spread.key || spread.label || spread.name || spread.combined_label || '';
  }

  return spread;
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

function isBloodMoonReading(reading) {
  return String(getReadingModeValue(reading)).toLowerCase().includes('blood');
}

function resolveSavedReadingCardArt(card, reading) {
  return getCardImageForReadingDeck(getReadingDeckIdentity(reading), card);
}

function formatSavedCardVisual(card, reading, index) {
  const position = card?.position_label || card?.position || `Card ${index + 1}`;
  const title = card?.name || card?.title || 'Unknown card';
  const orientation = formatOrientation(card) || 'Upright';
  const image = resolveSavedReadingCardArt(card, reading);
  const deck = getReadingDeckIdentity(reading);
  const fallbackImage = deck?.back || 'assets/images/cards/legacy/original/card-back.webp';
  const artworkUnavailable = !image;
  const isReversed = orientation.toLowerCase() === 'reversed';
  const altParts = [toTitleLabel(position, `Card ${index + 1}`), title, orientation].filter(Boolean);
  const protectedMediaClass = isBloodMoonReading(reading) ? ' protected-media' : '';
  const protectedMediaAttrs = isBloodMoonReading(reading) ? ' data-protected-media="true"' : '';

  return `
    <article class="saved-reading-card__visual private-data-card${protectedMediaClass}" tabindex="0" data-private-card="true"${protectedMediaAttrs} draggable="false">
      <div class="saved-reading-card__visual-frame">
        <img
          class="saved-reading-card__visual-image${isReversed ? ' is-reversed' : ''}"
          src="${escapeHtml(image || fallbackImage)}"
          alt="${escapeHtml(altParts.join(' / '))}"
          width="240"
          height="420"
          loading="lazy"
          decoding="async"
          draggable="false"
          data-saved-reading-card-fallback="${escapeHtml(fallbackImage)}"
        />
      </div>
      <div class="saved-reading-card__visual-copy">
        <span>${escapeHtml(toTitleLabel(position, `Card ${index + 1}`))}</span>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(orientation)}</p>
        ${artworkUnavailable ? '<p class="saved-reading-card__artwork-note">Original deck artwork unavailable.</p>' : ''}
      </div>
    </article>
  `;
}

function renderSavedCardCarousel(reading) {
  const cards = Array.isArray(reading.cards) ? reading.cards : [];
  const deck = getReadingDeckIdentity(reading);

  if (!cards.length) {
    return `
      <section class="saved-reading-card__detail-section" aria-label="Cards drawn">
        <h4>Cards Drawn</h4>
        <p>No card details were saved for this reading.</p>
      </section>
    `;
  }

  return `
    <section class="saved-reading-card__visual-section" aria-label="Cards drawn">
      <div class="saved-reading-card__visual-header">
        <span>Cards Drawn</span>
        <h4>Reopened from the spread</h4>
      </div>
      ${deck ? '' : '<p class="saved-reading-card__artwork-note">This reading’s original deck artwork is unavailable.</p>'}
      <div class="saved-reading-card__visual-row${cards.length <= 3 ? ' is-centered' : ''}" tabindex="0">
        ${cards.map((card, index) => formatSavedCardVisual(card, reading, index)).join('')}
      </div>
    </section>
  `;
}

function bindSavedReadingCardImageFallbacks(container) {
  container?.querySelectorAll('[data-saved-reading-card-fallback]').forEach((image) => {
    image.addEventListener('error', () => {
      const fallback = image.dataset.savedReadingCardFallback;

      if (!fallback || image.src.endsWith(fallback)) {
        return;
      }

      console.warn('Saved reading card artwork could not be loaded.', { src: image.currentSrc || image.src });
      image.src = fallback;
      const card = image.closest('.saved-reading-card__visual');
      card?.classList.add('is-artwork-unavailable');

      if (card && !card.querySelector('.saved-reading-card__artwork-note')) {
        const note = document.createElement('p');
        note.className = 'saved-reading-card__artwork-note';
        note.textContent = 'Original deck artwork unavailable.';
        card.querySelector('.saved-reading-card__visual-copy')?.append(note);
      }
    }, { once: true });
  });
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
      value.title,
      value.text,
      value.message,
      value.meaning,
      value.summary,
      value.advice,
      value.content,
      value.description,
      value.interpretation,
      value.reader_message,
      value.readerMessage,
      value.spread_meaning,
      value.spreadMeaning,
    ].flatMap(getReadableTextItems);
  }

  const text = String(value).trim();

  return text ? [text] : [];
}

function uniqueReadableTextItems(items) {
  const seen = new Set();

  return items
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
}

function getSavedCardTextItems(card) {
  return uniqueReadableTextItems([
    card?.summary,
    card?.meaning,
    card?.message,
    card?.description,
    card?.interpretation,
    card?.reader_message,
    card?.readerMessage,
    card?.spread_meaning,
    card?.spreadMeaning,
    card?.position_meaning,
    card?.positionMeaning,
    card?.metadata?.summary,
    card?.metadata?.meaning,
    card?.metadata?.message,
    card?.metadata?.interpretation,
  ].flatMap(getReadableTextItems));
}

function renderTextParagraphs(items, fallbackText = '') {
  const paragraphs = uniqueReadableTextItems(items.flatMap(getReadableTextItems));

  if (!paragraphs.length) {
    return fallbackText ? `<p>${escapeHtml(fallbackText)}</p>` : '';
  }

  return paragraphs
    .map((section) => `<p>${escapeHtml(section)}</p>`)
    .join('');
}

function getReadingThreadTextItems(reading) {
  const metadata = getReadingMetadata(reading);

  return uniqueReadableTextItems([
    reading.result_summary,
    reading.thread_summary,
    reading.threadSummary,
    reading.summary,
    reading.reader_message,
    reading.readerMessage,
    reading.spread_meaning,
    reading.spreadMeaning,
    metadata.combined_title,
    metadata.combined_advice,
    metadata.extra_messages,
    metadata.thread_summary,
    metadata.threadSummary,
    metadata.thread,
    metadata.combined_summary,
    metadata.combinedSummary,
    metadata.reader_message,
    metadata.readerMessage,
    metadata.spread_meaning,
    metadata.spreadMeaning,
    metadata.ai_response,
  ].flatMap(getReadableTextItems));
}

function renderReadingParagraphs(reading) {
  return renderTextParagraphs(
    getReadingThreadTextItems(reading),
    'No detailed interpretation was saved for this reading.'
  );
}

function renderSavedCardDetails(card, index) {
  const position = card?.position_label || card?.position || `Card ${index + 1}`;
  const title = card?.title || card?.name || 'Unknown card';
  const orientation = formatOrientation(card);
  const textItems = getSavedCardTextItems(card);

  return `
    <article class="saved-reading-card__card">
      <span>${escapeHtml(toTitleLabel(position, `Card ${index + 1}`))}</span>
      <strong>${escapeHtml(title)}</strong>
      ${orientation ? `<p class="saved-reading-card__orientation">${escapeHtml(orientation)}</p>` : ''}
      <div class="saved-reading-card__card-copy">
        ${renderTextParagraphs(textItems, 'No detailed interpretation was saved for this card.')}
      </div>
    </article>
  `;
}

function renderSavedReadingDetails(reading, detailsId) {
  const cards = Array.isArray(reading.cards) ? reading.cards : [];
  const metadata = getReadingMetadata(reading);
  const question = getReadingQuestion(reading);
  const modeLabel = toTitleLabel(getReadingModeValue(reading));
  const spreadLabel = toTitleLabel(getReadingSpreadValue(reading));
  const cardCountLabel = `${formatReadableValue(reading.card_count, cards.length || 'Unknown')} Cards`;
  const readerName = reading.reader_name || metadata.reader?.name || metadata.reader_name || 'Astral Reading';

  return `
    <div class="saved-reading-card__details ${getReadingModeClass(reading)}${isBloodMoonReading(reading) ? ' protected-media' : ''}" data-saved-reading-details="${escapeHtml(detailsId)}" data-private-card="true"${isBloodMoonReading(reading) ? ' data-protected-media="true"' : ''} draggable="false">
      <div class="saved-reading-card__detail-header">
        <div>
          <span>${escapeHtml(getReadingTypeLabel(reading))}</span>
          <h4>${escapeHtml(readerName)}</h4>
        </div>
        <p>${escapeHtml(formatDateTime(reading.created_at))}</p>
        <p>${escapeHtml(modeLabel)} · ${escapeHtml(spreadLabel)} · ${escapeHtml(cardCountLabel)}</p>
      </div>
      ${renderSavedCardCarousel(reading)}
      ${isAiReading(reading) && question ? `
        <div class="saved-reading-card__question">
          <span>Question</span>
          <p>${escapeHtml(question)}</p>
        </div>
      ` : ''}
      <section class="saved-reading-card__detail-section" aria-label="Cards drawn">
        <h4>Reading Details</h4>
        ${
          cards.length
            ? `<div class="saved-reading-card__cards">${cards.map(renderSavedCardDetails).join('')}</div>`
            : '<p>No card details were saved for this reading.</p>'
        }
      </section>
      <section class="saved-reading-card__detail-section" aria-label="Reading interpretation">
        <h4>Thread Summary</h4>
        <div class="saved-reading-card__summary">${renderReadingParagraphs(reading)}</div>
      </section>
    </div>
  `;
}

function updateReadingFilters() {
  if (!readingFilterControls) {
    return;
  }

  readingFilterControls.querySelectorAll('[data-reading-filter]').forEach((button) => {
    const isActive = button.dataset.readingFilter === activeReadingFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function getFilteredSavedReadings(readings) {
  return readings.filter((reading) => {
    if (activeReadingFilter === 'ai') {
      return isAiReading(reading);
    }

    if (activeReadingFilter === 'standard') {
      return !isAiReading(reading);
    }

    return true;
  });
}

function renderReadingPagination(totalReadings) {
  if (!readingPagination || !readingPaginationSummary || !readingPaginationControls) {
    return;
  }

  if (!totalReadings) {
    readingPagination.hidden = true;
    readingPaginationSummary.textContent = 'Showing 0 of 0 readings';
    readingPaginationControls.innerHTML = '';
    return;
  }

  const totalPages = Math.ceil(totalReadings / savedReadingsPageSize);
  const start = (activeReadingPage - 1) * savedReadingsPageSize + 1;
  const end = Math.min(activeReadingPage * savedReadingsPageSize, totalReadings);

  readingPaginationSummary.textContent = `Showing ${start}–${end} of ${totalReadings} readings`;

  if (totalPages <= 1) {
    readingPagination.hidden = false;
    readingPaginationControls.innerHTML = '';
    return;
  }

  const buttons = [
    `<button class="reading-pagination__button" type="button" data-reading-page="${activeReadingPage - 1}"${activeReadingPage === 1 ? ' disabled' : ''}>Previous</button>`,
    ...Array.from({ length: totalPages }, (_, index) => {
      const page = index + 1;

      return `
        <button
          class="reading-pagination__button${page === activeReadingPage ? ' is-active' : ''}"
          type="button"
          data-reading-page="${page}"
          aria-current="${page === activeReadingPage ? 'page' : 'false'}"
        >
          ${page}
        </button>
      `;
    }),
    `<button class="reading-pagination__button" type="button" data-reading-page="${activeReadingPage + 1}"${activeReadingPage === totalPages ? ' disabled' : ''}>Next</button>`,
  ];

  readingPagination.hidden = false;
  readingPaginationControls.innerHTML = buttons.join('');
}

function renderSavedReadings(readings) {
  if (!savedReadingsList) {
    return;
  }

  updateReadingFilters();

  if (!readings.length) {
    savedReadingsList.innerHTML = `
      <div class="saved-readings__empty">
        <h3>No saved readings yet.</h3>
        <p>Readings you choose to save will appear here.</p>
      </div>
    `;
    renderReadingPagination(0);
    return;
  }

  const filteredReadings = getFilteredSavedReadings(readings);
  const totalPages = Math.max(1, Math.ceil(filteredReadings.length / savedReadingsPageSize));

  activeReadingPage = Math.min(Math.max(activeReadingPage, 1), totalPages);

  if (!filteredReadings.length) {
    savedReadingsList.innerHTML = `
      <div class="saved-readings__empty">
        <h3>No readings found.</h3>
        <p>No ${activeReadingFilter === 'ai' ? 'AI' : 'standard'} readings are saved yet.</p>
      </div>
    `;
    renderReadingPagination(0);
    return;
  }

  const pageStartIndex = (activeReadingPage - 1) * savedReadingsPageSize;
  const visibleReadings = filteredReadings.slice(pageStartIndex, pageStartIndex + savedReadingsPageSize);

  savedReadingsList.innerHTML = `
    ${visibleReadings
    .map((reading, index) => {
      const metadata = getReadingMetadata(reading);
      const detailsId = reading.id || `saved-reading-${pageStartIndex + index}`;
      const modeLabel = toTitleLabel(getReadingModeValue(reading));
      const spreadLabel = toTitleLabel(getReadingSpreadValue(reading));
      const cardCountLabel = `${formatReadableValue(reading.card_count, Array.isArray(reading.cards) ? reading.cards.length : 'Unknown')} Cards`;
      const creditText = formatCreditCost(reading);
      const readerName = reading.reader_name || metadata.reader?.name || metadata.reader_name || 'Astral Veil';

      return `
      <article class="saved-reading-card private-data-card ${isBloodMoonReading(reading) ? 'protected-media ' : ''}${getReadingModeClass(reading)}" data-private-card="true"${isBloodMoonReading(reading) ? ' data-protected-media="true"' : ''} draggable="false">
        <div class="saved-reading-card__header">
          <div class="saved-reading-card__title">
            <span class="saved-reading-card__badge">${escapeHtml(getReadingTypeLabel(reading))}</span>
            <span class="saved-reading-card__date">${escapeHtml(formatDateTime(reading.created_at))}</span>
            <span class="saved-reading-card__meta"><strong>Veilwalker</strong> ${escapeHtml(readerName)}</span>
            <span class="saved-reading-card__meta"><strong>Mode</strong> ${escapeHtml(modeLabel)}</span>
            <span class="saved-reading-card__meta"><strong>Spread</strong> ${escapeHtml(spreadLabel)}</span>
            <span class="saved-reading-card__meta"><strong>Cards</strong> ${escapeHtml(cardCountLabel)}</span>
            ${creditText ? `<span class="saved-reading-card__credits">${escapeHtml(creditText)}</span>` : ''}
          </div>
          <div class="saved-reading-card__actions">
            <button class="card-action saved-reading-card__toggle" type="button" data-saved-reading-view="${escapeHtml(detailsId)}">View Reading</button>
            <button class="card-action saved-reading-card__delete" type="button" data-saved-reading-delete="${escapeHtml(String(reading.id || ''))}"${reading.id ? '' : ' disabled'}>Delete</button>
          </div>
        </div>
      </article>
    `;
    })
    .join('')}
  `;

  renderReadingPagination(filteredReadings.length);
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
    .select('id, created_at, reader_name, mode_key, deck_key, deck_name, spread_type, card_count, is_saved, cards, result_summary, metadata')
    .eq('user_id', activeUser.id)
    .eq('is_saved', true)
    .order('created_at', { ascending: false });

  if (error) {
    savedReadingsList.innerHTML = '<p class="saved-readings__state">We could not load your saved readings. Please try again.</p>';
    return;
  }

  savedReadingsLoaded = true;
  savedReadingsCache = data || [];
  renderSavedReadings(savedReadingsCache);
}

async function deleteSavedReading(readingId, button) {
  if (!readingId || !activeUser) {
    return;
  }

  const confirmed = window.confirm('Delete this saved reading? This cannot be undone.');

  if (!confirmed) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  const originalText = button?.textContent || 'Delete';

  if (button) {
    button.disabled = true;
    button.textContent = 'Deleting...';
  }

  const { error } = await supabase
    .from('user_readings')
    .delete()
    .eq('id', readingId)
    .eq('user_id', activeUser.id);

  if (error) {
    console.error('Saved reading delete failed:', error);

    if (button) {
      button.disabled = false;
      button.textContent = originalText;
    }

    window.alert('We could not delete this reading. Please try again.');
    return;
  }

  savedReadingsCache = savedReadingsCache.filter((reading) => reading.id !== readingId);
  if (activeSavedReadingModalId === String(readingId)) {
    closeSavedReadingModal();
  }
  renderSavedReadings(savedReadingsCache);
  await loadSavedReadingCount();
}

function findSavedReadingByViewId(readingId) {
  if (!readingId) {
    return null;
  }

  return savedReadingsCache.find((reading) => String(reading.id) === String(readingId)) || null;
}

function closeSavedReadingModal() {
  if (!savedReadingModal) {
    return;
  }

  savedReadingModal.hidden = true;
  document.body.classList.remove('saved-reading-modal-open');
  activeSavedReadingModalId = '';

  if (savedReadingModalContent) {
    savedReadingModalContent.innerHTML = '';
  }
}

async function openSavedReadingModal(readingId) {
  if (!savedReadingModal || !savedReadingModalContent) {
    return;
  }

  const reading = findSavedReadingByViewId(readingId);

  if (!reading) {
    return;
  }

  activeSavedReadingModalId = String(readingId);
  savedReadingModal.hidden = false;
  document.body.classList.add('saved-reading-modal-open');
  savedReadingModalContent.innerHTML = '<p class="saved-readings__state">Opening reading...</p>';

  if (savedReadingModalTitle) {
    savedReadingModalTitle.textContent = reading.reader_name || getReadingMetadata(reading).reader?.name || 'Saved Reading';
  }

  try {
    await loadReadingDeckData();
  } catch (error) {
    console.error('Saved reading card art load failed:', error);
  }

  if (activeSavedReadingModalId !== String(readingId) || savedReadingModal.hidden) {
    return;
  }

  savedReadingModalContent.innerHTML = renderSavedReadingDetails(reading, `modal-${readingId}`);
  bindSavedReadingCardImageFallbacks(savedReadingModalContent);
  savedReadingModal.querySelector('[data-saved-reading-modal-close]')?.focus({ preventScroll: true });
}

async function loadArtifactCount() {
  if (!artifactCountValue || !activeUser) {
    return 0;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    artifactCountValue.textContent = 'Soon';
    return 0;
  }

  artifactCountValue.textContent = '...';

  const { count, error } = await supabase
    .from('user_artifacts')
    .select('artifact_key', { count: 'exact', head: true })
    .eq('user_id', activeUser.id);

  if (error) {
    console.warn('Artifact count load failed.');
    artifactCountValue.textContent = 'Soon';
    return 0;
  }

  overviewMetrics.artifacts = count || 0;
  artifactCountValue.textContent = String(count || 0);
  return count || 0;
}

async function loadRoomCount() {
  if (!roomCountValue && !discoveryCountValue) {
    return 0;
  }

  if (roomCountValue) {
    roomCountValue.textContent = '...';
  }

  if (discoveryCountValue) {
    discoveryCountValue.textContent = '...';
  }

  try {
    const stats = await getUserProgressStats();

    overviewMetrics.rooms = stats.roomsVisited || 0;
    overviewMetrics.discoveries = stats.discoveriesRecorded || 0;

    if (roomCountValue) {
      roomCountValue.textContent = String(stats.roomsVisited || 0);
    }

    if (discoveryCountValue) {
      discoveryCountValue.textContent = String(stats.discoveriesRecorded || 0);
    }

    return stats.roomsVisited || 0;
  } catch (error) {
    console.warn('Progress stats load failed.');

    if (roomCountValue) {
      roomCountValue.textContent = '0';
    }

    if (discoveryCountValue) {
      discoveryCountValue.textContent = '0';
    }

    return 0;
  }
}

async function loadSavedReadingCount() {
  if (!savedReadingCountValue || !activeUser) {
    return 0;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    savedReadingCountValue.textContent = 'Soon';
    return 0;
  }

  savedReadingCountValue.textContent = '...';

  const { count, error } = await supabase
    .from('user_readings')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', activeUser.id)
    .eq('is_saved', true);

  if (error) {
    console.error('Saved reading count load failed:', error);
    savedReadingCountValue.textContent = 'Soon';
    return 0;
  }

  overviewMetrics.savedReadings = count || 0;
  savedReadingCountValue.textContent = String(count || 0);
  return count || 0;
}

function setJournalStatus(message, type = '') {
  if (!journalStatus) {
    return;
  }

  if (journalStatusClearTimer) {
    window.clearTimeout(journalStatusClearTimer);
    journalStatusClearTimer = null;
  }

  journalStatus.textContent = message;
  journalStatus.classList.toggle('is-error', type === 'error');
  journalStatus.classList.toggle('is-success', type === 'success');

  if (message && type !== 'error') {
    journalStatusClearTimer = window.setTimeout(() => {
      setJournalStatus('');
    }, 3200);
  }
}

function getTodayInputValue() {
  const date = new Date();

  return getDateInputValue(date);
}

function getDateInputValue(date) {
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

function getStartOfWeek(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  start.setDate(start.getDate() - start.getDay());

  return start;
}

function addDays(date, dayCount) {
  const next = new Date(date);
  next.setDate(next.getDate() + dayCount);

  return next;
}

function getMonthInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getEntryMonthKey(value) {
  const date = parseEntryDate(value);

  return date ? getMonthInputValue(date) : '';
}

function getEntryYearKey(value) {
  const date = parseEntryDate(value);

  return date ? String(date.getFullYear()) : '';
}

function formatMonthLabel(monthKey) {
  const match = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return 'Unknown month';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(Number(match[1]), Number(match[2]) - 1, 1));
}

function formatWeekRangeLabel(startDate) {
  const endDate = addDays(startDate, 6);
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const startLabel = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(startDate);
  const endLabel = new Intl.DateTimeFormat('en', {
    month: sameMonth ? undefined : 'short',
    day: 'numeric',
    year: startDate.getFullYear() === endDate.getFullYear() ? undefined : 'numeric',
  }).format(endDate);

  return `Week of ${startLabel} - ${endLabel}`;
}

function getJournalFilterWindow(filterName) {
  if (filterName === 'week') {
    const start = new Date(activeJournalWeekStart);
    const end = addDays(start, 7);

    if (activeJournalDay) {
      const selectedDay = parseEntryDate(activeJournalDay);

      if (selectedDay) {
        return { start: selectedDay, end: addDays(selectedDay, 1) };
      }
    }

    return { start, end };
  }

  if (filterName === 'month') {
    const monthKey = activeJournalMonth || getMonthInputValue(new Date());
    const match = monthKey.match(/^(\d{4})-(\d{2})$/);

    if (!match) {
      return null;
    }

    const start = new Date(Number(match[1]), Number(match[2]) - 1, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    return { start, end };
  }

  if (filterName === 'year') {
    const year = Number(activeJournalYear || new Date().getFullYear());

    if (!year) {
      return null;
    }

    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    return { start, end };
  }

  return null;
}

function applyJournalEntryFilters(query) {
  const filterWindow = getJournalFilterWindow(activeJournalFilter);

  if (filterWindow) {
    return query
      .gte('entry_date', getDateInputValue(filterWindow.start))
      .lt('entry_date', getDateInputValue(filterWindow.end));
  }

  if (activeJournalFilter === 'reading') {
    return query.or('reflection_type.eq.reading_reflection,source_type.eq.reading,source_reading_id.not.is.null,linked_reading_id.not.is.null');
  }

  if (activeJournalFilter === 'shadow') {
    return query.or('mode.eq.bloodmoon,mode.eq.blood_moon,reflection_type.eq.shadow_reflection,mood.ilike.%shadow%,mood_key.ilike.%shadow%');
  }

  return query;
}

function getJournalFilterEmptyTitle() {
  if (activeJournalFilter === 'week') {
    return activeJournalDay ? 'No reflections found for this day.' : 'No reflections found for this week.';
  }

  if (activeJournalFilter === 'month') {
    return 'No reflections found for this month.';
  }

  if (activeJournalFilter === 'year') {
    return 'No reflections found for this year.';
  }

  if (activeJournalFilter === 'reading') {
    return 'No reading reflections found yet.';
  }

  if (activeJournalFilter === 'shadow') {
    return 'No shadow reflections found yet.';
  }

  return 'No reflections found yet.';
}

function getJournalEntryDateCounts() {
  return journalFilterDateValues.reduce((counts, entryDate) => {
    counts.set(entryDate, (counts.get(entryDate) || 0) + 1);
    return counts;
  }, new Map());
}

function getAvailableJournalMonths() {
  return [...new Set(journalFilterDateValues.map(getEntryMonthKey).filter(Boolean))];
}

function getAvailableJournalYears() {
  return [...new Set(journalFilterDateValues.map(getEntryYearKey).filter(Boolean))];
}

function ensureJournalDateSelections() {
  const months = getAvailableJournalMonths();
  const years = getAvailableJournalYears();

  if (!activeJournalMonth || (months.length && !months.includes(activeJournalMonth))) {
    activeJournalMonth = months[0] || getMonthInputValue(new Date());
  }

  if (!activeJournalYear || (years.length && !years.includes(activeJournalYear))) {
    activeJournalYear = years[0] || String(new Date().getFullYear());
  }
}

function renderJournalFilterControls() {
  if (!journalFilterControls) {
    return;
  }

  if (!['week', 'month', 'year'].includes(activeJournalFilter)) {
    journalFilterControls.hidden = true;
    journalFilterControls.innerHTML = '';
    return;
  }

  ensureJournalDateSelections();
  journalFilterControls.hidden = false;

  if (activeJournalFilter === 'week') {
    const dateCounts = getJournalEntryDateCounts();
    const days = Array.from({ length: 7 }, (_, index) => addDays(activeJournalWeekStart, index));

    journalFilterControls.innerHTML = `
      <div class="journal-filter-controls__bar">
        <button class="journal-filter-controls__button" type="button" data-journal-week-nav="previous">Previous Week</button>
        <p class="journal-filter-controls__label">${escapeHtml(formatWeekRangeLabel(activeJournalWeekStart))}</p>
        <button class="journal-filter-controls__button" type="button" data-journal-week-nav="next">Next Week</button>
      </div>
      <div class="journal-day-chips" aria-label="Filter selected week by day">
        ${days.map((day) => {
          const dateKey = getDateInputValue(day);
          const label = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(day);
          const count = dateCounts.get(dateKey) || 0;

          return `
            <button class="journal-day-chip${activeJournalDay === dateKey ? ' is-active' : ''}" type="button" data-journal-day="${escapeHtml(dateKey)}" aria-pressed="${activeJournalDay === dateKey ? 'true' : 'false'}">
              ${escapeHtml(label)}<span>${count}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;
    return;
  }

  if (activeJournalFilter === 'month') {
    const months = getAvailableJournalMonths();

    journalFilterControls.innerHTML = `
      <div class="journal-filter-controls__bar">
        <label class="journal-filter-controls__label" for="journal-month-filter">Month</label>
        <select class="journal-filter-select" id="journal-month-filter" data-journal-month-select>
          ${(months.length ? months : [activeJournalMonth]).map((monthKey) => `
            <option value="${escapeHtml(monthKey)}" ${monthKey === activeJournalMonth ? 'selected' : ''}>${escapeHtml(formatMonthLabel(monthKey))}</option>
          `).join('')}
        </select>
      </div>
    `;
    return;
  }

  const years = getAvailableJournalYears();

  journalFilterControls.innerHTML = `
    <div class="journal-filter-controls__bar">
      <label class="journal-filter-controls__label" for="journal-year-filter">Year</label>
      <select class="journal-filter-select" id="journal-year-filter" data-journal-year-select>
        ${(years.length ? years : [activeJournalYear]).map((year) => `
          <option value="${escapeHtml(year)}" ${year === activeJournalYear ? 'selected' : ''}>${escapeHtml(year)}</option>
        `).join('')}
      </select>
    </div>
  `;
}

function normalizeJournalTags(value) {
  if (Array.isArray(value)) {
    return value
      .map((tag) => String(tag || '').trim())
      .filter(Boolean)
      .slice(0, 12);
  }

  return String(value || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function getJournalGuidedAnswers(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return { question: '', answer: item.trim() };
      }

      return {
        question: String(item?.question || '').trim(),
        answer: String(item?.answer || '').trim(),
      };
    })
    .filter((item) => item.answer);
}

function getGuidedAnswersEditText(value) {
  return getJournalGuidedAnswers(value).map((item) => item.answer).join('\n\n');
}

function parseGuidedAnswersText(value, existingAnswers = []) {
  const existing = getJournalGuidedAnswers(existingAnswers);

  return String(value || '')
    .split(/\n{2,}/)
    .map((answer) => answer.trim())
    .filter(Boolean)
    .map((answer, index) => ({
      question: existing[index]?.question || 'Guided note',
      answer,
    }));
}

function getJournalBodyPreviewSource(entry) {
  const text = String(entry?.body || '').replace(/\r\n/g, '\n').trim();

  if (!text) {
    return '';
  }

  const guidedMarkerMatch = text.match(/\n{0,2}(Guided Reflection|Shadow Reflection)\n/i);

  if (!guidedMarkerMatch) {
    return text;
  }

  return text.slice(0, guidedMarkerMatch.index).trim();
}

function resolveJournalMode(entry) {
  const modeCandidates = [
    entry?.mode,
    entry?.mode_key,
    entry?.entry_mode,
    entry?.reading_mode,
    entry?.metadata?.mode,
    entry?.metadata?.mode_key,
    entry?.metadata?.entry_mode,
    entry?.metadata?.reading_mode,
  ];

  const rawMode = modeCandidates.find((value) => typeof value === 'string' && value.trim()) || '';
  const compactMode = String(rawMode || '').trim().toLowerCase().replace(/[\s_-]/g, '');

  if (!compactMode) {
    return 'moon';
  }

  if (compactMode === 'bloodmoon' || compactMode === 'bloodmoonmode' || compactMode.startsWith('blood')) {
    return 'bloodmoon';
  }

  if (compactMode.startsWith('sun')) {
    return 'sun';
  }

  if (compactMode.startsWith('moon') || compactMode.includes('moon')) {
    return 'moon';
  }

  return 'moon';
}

function getJournalModeClass(entry) {
  const mode = resolveJournalMode(entry);

  if (mode === 'sun') {
    return 'sun';
  }

  if (mode === 'bloodmoon') {
    return 'bloodmoon';
  }

  return 'moon';
}

function getJournalCoverImage(entryOrMode) {
  const mode = typeof entryOrMode === 'string' ? entryOrMode : getJournalModeClass(entryOrMode);

  if (mode === 'sun') {
    return 'assets/images/backgrounds/sun_journal.png';
  }

  if (mode === 'bloodmoon') {
    return 'assets/images/backgrounds/bloodmoon_journal.png';
  }

  return 'assets/images/backgrounds/moon_journal.png';
}

function getJournalModeLabel(entry) {
  const mode = resolveJournalMode(entry);

  if (mode === 'bloodmoon') {
    return 'Blood Moon';
  }

  if (mode === 'sun') {
    return 'Sun';
  }

  return 'Moon';
}

function getJournalPreviewText(entry) {
  const guidedAnswers = getJournalGuidedAnswers(entry?.guided_answers);
  const bodyText = getJournalBodyPreviewSource(entry).replace(/\s+/g, ' ').trim();

  if (!bodyText && guidedAnswers.length) {
    return `Guided reflection with ${guidedAnswers.length} answered ${guidedAnswers.length === 1 ? 'question' : 'questions'}.`;
  }

  if (bodyText.length <= 160) {
    return bodyText || 'No details yet.';
  }

  return `${bodyText.slice(0, 157).trim()}...`;
}

function renderJournalCardBadges(entry) {
  const modeLabel = getJournalModeLabel(entry);
  const tags = normalizeJournalTags(entry.tags);
  const visibleTags = tags.slice(0, 3);
  const remainingTagCount = Math.max(0, tags.length - visibleTags.length);
  const badges = [
    modeLabel ? { label: modeLabel, type: 'mode' } : null,
    ...visibleTags.map((tag) => ({ label: toTitleLabel(tag, tag), type: 'tag' })),
    remainingTagCount ? { label: `+${remainingTagCount} more`, type: 'more' } : null,
  ].filter(Boolean);

  if (!badges.length) {
    return '';
  }

  return `
    <div class="journal-entry-card__chips">
      ${badges.map((badge) => `<span class="journal-entry-card__chip journal-entry-card__chip--${escapeHtml(badge.type)}">${escapeHtml(badge.label)}</span>`).join('')}
    </div>
  `;
}

function getJournalArchiveMarker(entry) {
  const entryDate = parseEntryDate(entry?.entry_date) || (entry?.created_at ? new Date(entry.created_at) : null);

  if (!entryDate || Number.isNaN(entryDate.getTime())) {
    return { month: '—', day: '—' };
  }

  const month = entryDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase().replace('.', '');

  return {
    month,
    day: String(entryDate.getDate()).padStart(2, '0'),
  };
}

function hideJournalEntryView() {
  if (!journalView) {
    return;
  }

  journalView.hidden = true;
  document.body.classList.remove('journal-modal-open');
  if (journalViewEditButton) {
    journalViewEditButton.removeAttribute('data-journal-view-edit');
  }
  if (journalViewDeleteButton) {
    journalViewDeleteButton.removeAttribute('data-journal-view-delete');
  }
  journalViewMeta?.replaceChildren();
  journalViewChips?.replaceChildren();
  journalViewContent?.replaceChildren();
}

function appendJournalViewSection(label, value, extraClass = '') {
  const text = String(value || '').trim();

  if (!text || !journalViewContent) {
    return;
  }

  const section = document.createElement('div');
  const sectionLabel = document.createElement('strong');
  const paragraph = document.createElement('p');

  section.className = extraClass
    ? `journal-entry-view__section journal-entry-view__section--${extraClass}`
    : 'journal-entry-view__section';
  sectionLabel.textContent = label;
  paragraph.textContent = text;
  section.append(sectionLabel, paragraph);
  journalViewContent.append(section);
}

function getJournalAttachedReadingSummary(entry) {
  const attachedReading = entry?.metadata?.attached_reading;

  if (!attachedReading || typeof attachedReading !== 'object') {
    return '';
  }

  const summaryParts = [
    attachedReading.reader_name ? `Reader: ${attachedReading.reader_name}` : '',
    attachedReading.spread_label || attachedReading.spread_type
      ? `Spread: ${toTitleLabel(attachedReading.spread_label || attachedReading.spread_type, '')}`
      : '',
    attachedReading.mode_key ? `Mode: ${toTitleLabel(attachedReading.mode_key, '')}` : '',
    attachedReading.reading_date ? `Reading date: ${formatDateTime(attachedReading.reading_date)}` : '',
  ].filter(Boolean);
  const cards = Array.isArray(attachedReading.cards) ? attachedReading.cards : [];
  const cardSummary = cards
    .map((card, index) => {
      const title = String(card?.title || '').trim();
      const positionLabel = String(card?.positionLabel || '').trim();

      if (!title) {
        return '';
      }

      return positionLabel ? `${positionLabel}: ${title}` : title || `Card ${index + 1}`;
    })
    .filter(Boolean);

  if (cardSummary.length) {
    summaryParts.push(`Cards: ${cardSummary.join(' · ')}`);
  }

  return summaryParts.join('\n');
}

function showJournalEntryView(entry) {
  if (!journalView || !journalViewMeta || !journalViewTitle || !journalViewChips || !journalViewContent) {
    return;
  }

  const mood = entry.mood ? toTitleLabel(entry.mood, '') : entry.mood_key ? toTitleLabel(entry.mood_key, '') : '';
  const tags = normalizeJournalTags(entry.tags).slice(0, 8);
  const chips = [
    mood,
    ...tags,
    entry.mode ? toTitleLabel(entry.mode, '') : '',
    entry.reflection_type ? toTitleLabel(entry.reflection_type, '') : '',
  ].filter(Boolean);
  const updatedLabel = entry.updated_at && entry.updated_at !== entry.created_at
    ? `Updated ${formatDateTime(entry.updated_at)}`
    : '';
  const structuredGuidedAnswers = getJournalGuidedAnswers(entry.guided_answers);
  const parsedGuidedReflection = parseGuidedReflectionText(entry.body);
  const guidedAnswers = structuredGuidedAnswers.length
    ? structuredGuidedAnswers
    : parsedGuidedReflection?.items || [];
  const reflectionBody = parsedGuidedReflection
    ? parsedGuidedReflection.body
    : structuredGuidedAnswers.length
      ? getJournalBodyPreviewSource(entry)
      : String(entry?.body || '').replace(/\r\n?/g, '\n').trim();
  const sourceReadingLabel = entry.source_reading_id || entry.linked_reading_id
    ? 'Attached reading'
    : entry.source_type && entry.source_type !== 'journal'
      ? toTitleLabel(entry.source_type, '')
      : '';

  journalViewMeta.innerHTML = `
    <span>${escapeHtml(formatEntryDate(entry.entry_date))}</span>
    ${entry.created_at ? `<span>${escapeHtml(`Created ${formatDateTime(entry.created_at)}`)}</span>` : ''}
    ${updatedLabel ? `<span>${escapeHtml(updatedLabel)}</span>` : ''}
  `;
  journalViewTitle.textContent = entry.title || 'Untitled Entry';
  journalViewChips.innerHTML = chips.map((chip) => `<span>${escapeHtml(chip)}</span>`).join('');
  journalViewContent.replaceChildren();

  appendJournalViewSection('Source', sourceReadingLabel);
  appendJournalViewSection('Attached Reading', getJournalAttachedReadingSummary(entry));
  appendJournalViewSection('Check-in', entry.check_in);
  appendJournalViewSection('Prompt', entry.prompt || entry.metadata?.prompt);
  appendJournalViewSection('Reflection', reflectionBody, 'reflection');

  if (guidedAnswers.length) {
    renderGuidedReflection(journalViewContent, {
      heading: parsedGuidedReflection?.heading || (resolveJournalMode(entry) === 'bloodmoon'
        ? 'Shadow Reflection'
        : 'Guided Reflection'),
      items: guidedAnswers,
    });
  }

  if (!journalViewContent.children.length) {
    appendJournalViewSection('Entry', 'No details yet.');
  }
  if (journalViewEditButton) {
    journalViewEditButton.dataset.journalViewEdit = entry.id;
  }
  if (journalViewDeleteButton) {
    journalViewDeleteButton.dataset.journalViewDelete = entry.id;
  }

  resetJournalForm();
  journalView.hidden = false;
  document.body.classList.add('journal-modal-open');
  journalViewCloseButton?.focus({ preventScroll: true });
}

function getJournalTotalPages() {
  return Math.max(1, Math.ceil(journalTotalEntries / journalPageSize));
}

function getJournalPageNumbers() {
  const totalPages = getJournalTotalPages();
  const maxButtons = 7;
  const halfWindow = Math.floor(maxButtons / 2);
  let start = Math.max(1, activeJournalPage - halfWindow);
  const end = Math.min(totalPages, start + maxButtons - 1);

  start = Math.max(1, end - maxButtons + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function renderJournalPagination() {
  if (!journalPagination || !journalPaginationSummary || !journalPaginationControls) {
    return;
  }

  const hasEntries = journalTotalEntries > 0;
  const from = hasEntries ? (activeJournalPage - 1) * journalPageSize + 1 : 0;
  const to = hasEntries ? Math.min(from + journalEntriesCache.length - 1, journalTotalEntries) : 0;
  const totalPages = getJournalTotalPages();

  journalPagination.hidden = !hasEntries;
  journalPaginationSummary.textContent = `Showing ${from}-${to} of ${journalTotalEntries} entries`;
  journalPaginationControls.replaceChildren();

  if (!hasEntries) {
    return;
  }

  const previousButton = document.createElement('button');
  const nextButton = document.createElement('button');

  previousButton.className = 'journal-pagination__button';
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = activeJournalPage <= 1;
  previousButton.addEventListener('click', () => {
    if (activeJournalPage > 1) {
      activeJournalPage -= 1;
      loadJournalEntries({ force: true });
    }
  });
  journalPaginationControls.append(previousButton);

  getJournalPageNumbers().forEach((pageNumber) => {
    const pageButton = document.createElement('button');

    pageButton.className = `journal-pagination__button${pageNumber === activeJournalPage ? ' is-active' : ''}`;
    pageButton.type = 'button';
    pageButton.textContent = String(pageNumber);
    pageButton.setAttribute('aria-label', `Page ${pageNumber}`);
    pageButton.setAttribute('aria-current', pageNumber === activeJournalPage ? 'page' : 'false');
    pageButton.disabled = pageNumber === activeJournalPage;
    pageButton.addEventListener('click', () => {
      activeJournalPage = pageNumber;
      loadJournalEntries({ force: true });
    });
    journalPaginationControls.append(pageButton);
  });

  nextButton.className = 'journal-pagination__button';
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = activeJournalPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (activeJournalPage < totalPages) {
      activeJournalPage += 1;
      loadJournalEntries({ force: true });
    }
  });
  journalPaginationControls.append(nextButton);
}

function updateJournalCountDisplay(count = journalEntriesCache.length) {
  overviewMetrics.journals = count || 0;

  if (journalCountValue) {
    journalCountValue.textContent = String(count || 0);
  }
}

function getActivityTimestamp(value) {
  const date = new Date(value || 0);

  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function getArtifactActivityLabel(artifact) {
  return toTitleLabel(artifact?.artifact_key || 'artifact', 'Artifact');
}

function renderOverviewActivityItems(items) {
  if (!activityTitle || !activityList) {
    return;
  }

  if (!items.length) {
    activityTitle.textContent = 'Your Archive is listening.';
    activityList.innerHTML = `
      <li>
        <span>
          <strong>Your Archive is listening.</strong>
          <small>Saved readings, artifacts, and reflections will gather here as your path grows.</small>
        </span>
      </li>
    `;
    return;
  }

  activityTitle.textContent = 'Recent Activity';
  activityList.innerHTML = items.slice(0, 10).map((item) => `
    <li>
      <span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.detail)}</small>
      </span>
    </li>
  `).join('');
}

function chooseOverviewReflectionMessage({ journals = [], artifacts = [], savedReadings = [] } = {}) {
  const today = getTodayInputValue();
  const isEntryToday = (entry) => (
    entry.entry_date === today
    || String(entry.created_at || '').startsWith(today)
  );
  const isReadingReflection = (entry) => (
    entry.reflection_type === 'reading_reflection'
    || entry.source_type === 'reading'
    || entry.source_reading_id
    || entry.linked_reading_id
  );
  const isShadowReflection = (entry) => (
    ['bloodmoon', 'blood_moon'].includes(String(entry.mode || '').toLowerCase())
    || entry.reflection_type === 'shadow_reflection'
    || /shadow/i.test(`${entry.mood || ''} ${entry.mood_key || ''}`)
  );
  const hasShadowToday = journals.some((entry) => isEntryToday(entry) && isShadowReflection(entry));
  const hasReadingReflectionToday = journals.some((entry) => isEntryToday(entry) && isReadingReflection(entry));
  const hasJournalToday = journals.some(isEntryToday);

  if (hasShadowToday) {
    return {
      title: 'A shadow has been recorded.',
      body: 'Not every truth arrives softly.',
    };
  }

  if (hasReadingReflectionToday) {
    return {
      title: 'The cards followed you into the Archive.',
      body: 'Some readings ask to be carried beyond the moment.',
    };
  }

  if (hasJournalToday) {
    return {
      title: 'You left a reflection today.',
      body: 'The Archive has received your words.',
    };
  }

  if (artifacts.length || overviewMetrics.artifacts) {
    return {
      title: 'Something hidden has been recovered.',
      body: 'Some doors remember who carries the keys.',
    };
  }

  if (savedReadings.length || overviewMetrics.savedReadings) {
    return {
      title: 'A reading has been preserved.',
      body: 'Return to it when the message begins to change shape.',
    };
  }

  if (overviewMetrics.journals > 1 || journals.length > 1) {
    return {
      title: 'Your reflections are gathering.',
      body: 'Small truths become easier to see when they return in patterns.',
    };
  }

  return {
    title: 'Begin gently.',
    body: 'The Archive remembers every step, even the quiet ones.',
  };
}

function renderOverviewReflection(message) {
  if (!reflectionTitle || !reflectionBody) {
    return;
  }

  reflectionTitle.textContent = message.title;
  reflectionBody.textContent = message.body;
}

function renderJournalEntries() {
  if (!journalList || !journalEmptyState) {
    return;
  }

  renderJournalFilterControls();
  journalFilterButtons.forEach((button) => {
    const isActive = button.dataset.journalFilter === activeJournalFilter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  const entries = journalEntriesCache;

  journalEmptyState.hidden = entries.length > 0;
  const emptyTitle = journalEmptyState.querySelector('h3');

  if (emptyTitle) {
    emptyTitle.textContent = getJournalFilterEmptyTitle();
  }

  if (!entries.length) {
    journalList.innerHTML = '';
    renderJournalPagination();
    return;
  }

      journalList.innerHTML = entries
    .map((entry) => {
      const modeClass = getJournalModeClass(entry);
      const coverImage = getJournalCoverImage(modeClass);
      const protectedMediaClass = modeClass === 'bloodmoon' ? ' protected-media' : '';
      const protectedMediaAttrs = modeClass === 'bloodmoon' ? ' data-protected-media="true"' : '';

      return `
        <article class="journal-entry-card private-data-card${protectedMediaClass} journal-entry-card--${escapeHtml(modeClass)}" data-private-card="true"${protectedMediaAttrs} draggable="false">
          <img class="journal-entry-card__cover" src="${coverImage}" alt="" loading="lazy" draggable="false" data-image-error-fallback="assets/images/backgrounds/moon_journal.png">
          <div class="journal-entry-card__overlay" aria-hidden="true"></div>
          <div class="journal-entry-card__content">
            <p class="journal-entry-card__meta">${escapeHtml(formatEntryDate(entry.entry_date))}</p>
            <h3>${escapeHtml(entry.title || 'Untitled Entry')}</h3>
            <div class="journal-entry-card__actions">
              <button class="journal-entry-card__action" type="button" data-journal-view-entry="${escapeHtml(entry.id)}">View</button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');
  journalList.querySelectorAll('[data-image-error-fallback]').forEach((image) => image.addEventListener('error', () => {
    const fallback = image.dataset.imageErrorFallback;
    if (fallback && image.dataset.fallbackApplied !== 'true') { image.dataset.fallbackApplied = 'true'; image.src = fallback; }
  }, { once: true }));
  renderJournalPagination();
}

function sortJournalEntries(entries) {
  return [...entries].sort((firstEntry, secondEntry) => {
    const firstTime = (parseEntryDate(firstEntry.entry_date) || new Date(firstEntry.created_at || 0)).getTime();
    const secondTime = (parseEntryDate(secondEntry.entry_date) || new Date(secondEntry.created_at || 0)).getTime();

    if (firstTime !== secondTime) {
      return secondTime - firstTime;
    }

    return new Date(secondEntry.updated_at || secondEntry.created_at || 0).getTime()
      - new Date(firstEntry.updated_at || firstEntry.created_at || 0).getTime();
  });
}

function resetJournalForm() {
  if (!journalForm) {
    return;
  }

  editingJournalEntryId = '';
  journalForm.reset();
  journalForm.elements.entry_date.value = getTodayInputValue();
  journalForm.hidden = true;
  if (journalSaveButton) {
    journalSaveButton.textContent = 'Save Entry';
    journalSaveButton.disabled = false;
  }
}

function showJournalForm(entry = null) {
  if (!journalForm) {
    return;
  }

  editingJournalEntryId = entry?.id || '';
  hideJournalEntryView();
  journalForm.hidden = false;
  journalForm.elements.title.value = entry?.title || '';
  journalForm.elements.entry_date.value = entry?.entry_date || getTodayInputValue();
  journalForm.elements.mood.value = entry?.mood || entry?.mood_key || '';
  journalForm.elements.check_in.value = entry?.check_in || '';
  journalForm.elements.tags.value = normalizeJournalTags(entry?.tags).join(', ');
  journalForm.elements.prompt.value = entry?.prompt || entry?.metadata?.prompt || '';
  journalForm.elements.body.value = entry?.body || '';
  journalForm.elements.guided_answers_text.value = getGuidedAnswersEditText(entry?.guided_answers);
  if (journalSaveButton) {
    journalSaveButton.textContent = 'Save Entry';
  }
  setJournalStatus('');
  journalForm.elements.title.focus();
}

async function loadJournalCount() {
  if (!journalCountValue || !activeUser) {
    return 0;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    journalCountValue.textContent = 'Soon';
    return 0;
  }

  journalCountValue.textContent = '...';

  const { count, error } = await supabase
    .from('user_journal_entries')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', activeUser.id);

  if (error) {
    console.error('Journal count load failed:', error);
    journalCountValue.textContent = 'Soon';
    return 0;
  }

  updateJournalCountDisplay(count || 0);
  return count || 0;
}

async function loadOverviewActivity() {
  if (!activeUser) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    renderOverviewActivityItems([]);
    renderOverviewReflection(chooseOverviewReflectionMessage());
    return;
  }

  const [readingsResponse, journalsResponse, artifactsResponse, roomVisitsResponse, discoveriesResponse] = await Promise.all([
    supabase
      .from('user_readings')
      .select('id, created_at, reader_name, mode_key, spread_type, card_count, is_saved, metadata')
      .eq('user_id', activeUser.id)
      .eq('is_saved', true)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('user_journal_entries')
      .select('id, title, entry_date, created_at, updated_at, mode, source_type, source_reading_id, linked_reading_id, reflection_type, mood, mood_key')
      .eq('user_id', activeUser.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('user_artifacts')
      .select('artifact_key')
      .eq('user_id', activeUser.id)
      .limit(10),
    supabase
      .from('user_room_visits')
      .select('room_key, room_name, archive_type, mode, last_visited_at, visit_count')
      .eq('user_id', activeUser.id)
      .order('last_visited_at', { ascending: false })
      .limit(10),
    supabase
      .from('user_discoveries')
      .select(discoveryActivitySelectColumns)
      .eq('user_id', activeUser.id)
      .order('discovered_at', { ascending: false })
      .limit(10),
  ]);

  if (readingsResponse.error) {
    console.warn('Recent saved readings activity load failed.');
  }
  if (journalsResponse.error) {
    console.warn('Recent journal activity load failed.');
  }
  if (artifactsResponse.error) {
    console.warn('Recent artifact activity load failed.');
  }
  if (roomVisitsResponse.error) {
    console.warn('Recent room visit activity load failed.');
  }
  if (discoveriesResponse.error) {
    console.warn('[Astral Veil account] Recent discovery activity skipped.');
  }

  const savedReadings = readingsResponse.error ? [] : readingsResponse.data || [];
  const journals = journalsResponse.error ? [] : journalsResponse.data || [];
  const artifacts = artifactsResponse.error ? [] : artifactsResponse.data || [];
  const roomVisits = roomVisitsResponse.error ? [] : roomVisitsResponse.data || [];
  const discoveries = discoveriesResponse.error ? [] : discoveriesResponse.data || [];
  const activityItems = [
    ...savedReadings.map((reading) => {
      const detailParts = [
        toTitleLabel(reading.mode_key || reading.metadata?.mode, ''),
        toTitleLabel(reading.spread_type || reading.metadata?.spread?.key || reading.metadata?.spread, ''),
        formatDateTime(reading.created_at),
      ].filter(Boolean);

      return {
        timestamp: getActivityTimestamp(reading.created_at),
        title: 'You saved a reading.',
        detail: detailParts.join(' · ') || 'Saved reading',
      };
    }),
    ...journals.map((entry) => {
      const isReadingReflection = entry.reflection_type === 'reading_reflection'
        || entry.source_type === 'reading'
        || entry.source_reading_id
        || entry.linked_reading_id;
      const title = isReadingReflection
        ? 'You wrote a reading reflection.'
        : 'You wrote a journal reflection.';
      const detailParts = [
        entry.title || '',
        formatDateTime(entry.created_at || entry.entry_date),
      ].filter(Boolean);

      return {
        timestamp: getActivityTimestamp(entry.created_at || entry.entry_date),
        title,
        detail: detailParts.join(' · ') || 'Journal reflection',
      };
    }),
    ...artifacts.map((artifact) => {
      return {
        timestamp: 0,
        title: 'You unlocked an artifact.',
        detail: getArtifactActivityLabel(artifact),
      };
    }),
    ...roomVisits.map((visit) => {
      const roomName = visit.room_name || toTitleLabel(visit.room_key, 'Archive room');
      const isReturnVisit = Number(visit.visit_count || 0) > 1;
      const archiveLabel = toTitleLabel(visit.archive_type, '');
      const modeLabel = toTitleLabel(visit.mode, '');
      const detailParts = [
        archiveLabel,
        modeLabel,
        formatDateTime(visit.last_visited_at),
      ].filter(Boolean);

      return {
        timestamp: getActivityTimestamp(visit.last_visited_at),
        title: isReturnVisit ? `You returned to ${roomName}.` : `You entered ${roomName}.`,
        detail: detailParts.join(' · ') || 'Room visit',
      };
    }),
    ...discoveries.map((discovery) => {
      const metadata = discovery.metadata && typeof discovery.metadata === 'object' && !Array.isArray(discovery.metadata)
        ? discovery.metadata
        : {};
      const discoveryType = discovery.discovery_type || '';
      const displayTitle = metadata.title || toTitleLabel(discovery.discovery_key, 'Discovery recorded');
      const displayDescription = metadata.description || [toTitleLabel(discoveryType, ''), discovery.source_location || '']
        .filter(Boolean)
        .join(' · ');
      const isArtifact = discoveryType === 'artifact';
      const isRestrictedWingSeal = discovery.discovery_key === 'restricted_wing_seal_opened';
      const artifactName = isArtifact
        ? String(displayTitle || 'an artifact').replace(/\s+recovered$/i, '')
        : '';
      const detailParts = [
        displayDescription,
        toTitleLabel(discovery.source_location, ''),
        toTitleLabel(discovery.mode_key, ''),
        formatDateTime(discovery.discovered_at),
      ].filter(Boolean);

      return {
        timestamp: getActivityTimestamp(discovery.discovered_at),
        title: isRestrictedWingSeal
          ? 'You opened the Restricted Wing seal.'
          : isArtifact
            ? `You recovered the ${artifactName}.`
            : displayTitle || 'You recorded a discovery.',
        detail: detailParts.join(' · ') || 'Discovery recorded',
      };
    }),
  ].sort((first, second) => second.timestamp - first.timestamp).slice(0, 10);

  renderOverviewActivityItems(activityItems);
  renderOverviewReflection(chooseOverviewReflectionMessage({ journals, artifacts, savedReadings }));
}

async function loadJournalFilterDates({ force = false } = {}) {
  if (!activeUser || (journalFilterDatesLoaded && !force)) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  const { data, error } = await supabase
    .from('user_journal_entries')
    .select('entry_date')
    .eq('user_id', activeUser.id)
    .order('entry_date', { ascending: false })
    .range(0, 999);

  if (error) {
    console.error('Journal filter dates load failed:', error);
    return;
  }

  journalFilterDateValues = (data || [])
    .map((entry) => entry.entry_date)
    .filter(Boolean);
  journalFilterDatesLoaded = true;
  ensureJournalDateSelections();
}

async function loadJournalEntries({ force = false } = {}) {
  if (!journalList || !activeUser || (journalEntriesLoaded && !force)) {
    renderJournalEntries();
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setJournalStatus('Journal entries are not available in this environment.', 'error');
    return;
  }

  await loadJournalFilterDates({ force });

  journalList.innerHTML = '<p class="saved-readings__state">Loading journal entries...</p>';
  journalEmptyState.hidden = true;
  if (journalPagination) {
    journalPagination.hidden = true;
  }

  const from = (activeJournalPage - 1) * journalPageSize;
  const to = from + journalPageSize - 1;

  let query = supabase
    .from('user_journal_entries')
    .select(journalEntrySelectColumns, { count: 'exact' })
    .eq('user_id', activeUser.id)
    .order('entry_date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  query = applyJournalEntryFilters(query);

  const { data, error, count } = await query;

  if (error) {
    console.error('Journal entries load failed:', error);
    journalList.innerHTML = '';
    journalEmptyState.hidden = true;
    setJournalStatus('We could not load your journal entries. Please try again.', 'error');
    return;
  }

  journalEntriesLoaded = true;
  journalEntriesCache = data || [];
  journalTotalEntries = Number(count || 0);

  if (!journalEntriesCache.length && journalTotalEntries > 0 && activeJournalPage > getJournalTotalPages()) {
    activeJournalPage = getJournalTotalPages();
    await loadJournalEntries({ force: true });
    return;
  }

  renderJournalEntries();
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

  if (sectionName === 'overview') {
    loadRoomCount();
  }

  if (sectionName === 'past-readings') {
    loadSavedReadings();
  }

  if (sectionName === 'journal-entries') {
    loadJournalEntries();
  }

  if (sectionName === 'contact-us') {
    populateContactEmail(activeUser);
  }
}

function showHashAccountSection() {
  showAccountSection(getAccountSectionFromHash());
  setMobileNavOpen(false);
}

function shouldOpenChangePasswordFromUrl() {
  const params = new URLSearchParams(window.location.search);

  return /^(1|true|yes|open)$/i.test(params.get('changePassword') || '');
}

function clearChangePasswordUrlFlag() {
  const url = new URL(window.location.href);

  if (!url.searchParams.has('changePassword')) {
    return;
  }

  url.searchParams.delete('changePassword');
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
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
    window.location.replace('/login');
    return;
  }

  activeUser = user;
  activeProfile = profile || {};
  const accountStatus = getAccountStatus(activeProfile);

  if (isBannedUser(activeProfile)) {
    await signOut();
    showError(getBannedAccountMessage());
    return;
  }

  if (accountStatus === 'pending_deletion') {
    await signOut();
    redirectToSignedOutNotice('account_pending_deletion');
    return;
  }

  const { isAdmin } = await isCurrentUserAdmin();

  await loadProfileUnlocks();
  await ensureRestrictedWingProfileRewards();
  updateAccountProfileDisplay(activeProfile, user);
  updateSecurityAccountEmail(user);

  adminLink.hidden = !isAdmin;
  loadingPanel.hidden = true;
  accountPanel.hidden = false;
  Promise.all([
    loadSavedReadingCount(),
    loadArtifactCount(),
    loadJournalCount(),
    loadRoomCount(),
  ]).then(() => {
    loadOverviewActivity();
  });
  showHashAccountSection();

  if (shouldOpenChangePasswordFromUrl()) {
    setAccountSectionHash('privacy-security');
    window.setTimeout(() => setChangePasswordModalOpen(true), 0);
    clearChangePasswordUrlFlag();
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

  window.location.assign('/login');
}

logoutButtons.forEach((button) => {
  button.addEventListener('click', handleLogout);
});

contactTopicSelect?.addEventListener('change', () => {
  applyContactTopicSubject();
});

contactSubjectInput?.addEventListener('input', () => {
  hasContactSubjectBeenEdited = true;
});

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const supabase = getSupabaseClient();

  if (!supabase) {
    setContactStatus('Contact messages are not available in this environment.', 'error');
    return;
  }

  const formData = new FormData(contactForm);
  const topic = String(formData.get('topic') || '').trim();
  const userEmail = String(formData.get('user_email') || '').trim();
  const subject = String(formData.get('subject') || '').trim();
  const message = String(formData.get('message') || '').trim();

  if (!topic || !userEmail || !subject || !message) {
    setContactStatus('Choose a topic and fill in your email, subject, and message.', 'error');
    return;
  }

  if (userEmail.length > contactEmailMaxLength) {
    setContactStatus('Use an email address under 254 characters.', 'error');
    return;
  }

  if (subject.length > contactSubjectMaxLength) {
    setContactStatus('Use a subject under 160 characters.', 'error');
    return;
  }

  if (message.length > contactMessageMaxLength) {
    setContactStatus('Please keep your message under 5,000 characters.', 'error');
    return;
  }

  if (contactSubmitButton) {
    contactSubmitButton.disabled = true;
  }
  setContactStatus('Sending your message...');

  const { error } = await supabase
    .from('contact_messages')
    .insert({
      user_id: activeUser?.id || null,
      user_email: userEmail,
      topic,
      subject,
      message,
    });

  if (contactSubmitButton) {
    contactSubmitButton.disabled = false;
  }

  if (error) {
    console.error('Contact message submit failed:', error);
    setContactStatus('We could not send your message. Please try again in a moment.', 'error');
    return;
  }

  if (contactMessageInput) {
    contactMessageInput.value = '';
  }

  setContactStatus('Your message has been sent. We’ll get back to you soon.', 'success');
});

passwordResetSendButton?.addEventListener('click', () => {
  setChangePasswordModalOpen(true);
});

changePasswordCancelButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (!isChangingPassword) {
      setChangePasswordModalOpen(false);
    }
  });
});

changePasswordForm?.addEventListener('submit', handleChangePasswordSubmit);

changePasswordSecurityEmailButton?.addEventListener('click', sendPasswordSecurityEmail);

privacyControlsOpenButton?.addEventListener('click', () => {
  setPrivacyControlsModalOpen(true);
});

privacyControlsCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setPrivacyControlsModalOpen(false);
  });
});

privacyCleanupButtons.forEach((button) => {
  button.addEventListener('click', () => {
    clearPrivacyData(button.dataset.privacyCleanup, button);
  });
});

accountDeletionOpenButton?.addEventListener('click', () => {
  setAccountDeletionModalOpen(true);
});

accountDeletionCancelButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setAccountDeletionModalOpen(false);
  });
});

accountDeletionForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const confirmation = String(accountDeletionConfirmationInput?.value || '').trim();
  const reason = String(accountDeletionReasonInput?.value || '').trim();
  const supabase = getSupabaseClient();

  if (confirmation !== 'DELETE') {
    setAccountDeletionStatus('Type DELETE to continue.', 'error');
    return;
  }

  if (reason.length > accountDeletionReasonMaxLength) {
    setAccountDeletionStatus('Please keep your reason under 1,000 characters.', 'error');
    return;
  }

  if (!activeUser || !supabase) {
    setAccountDeletionStatus('Account deletion requests are not available right now.', 'error');
    return;
  }

  if (accountDeletionSubmitButton) {
    accountDeletionSubmitButton.disabled = true;
  }
  setAccountDeletionStatus('Sending account deletion request for review...');

  const { error } = await supabase.rpc('request_account_deletion', {
    p_user_email: activeUser.email || '',
    p_reason: reason || null,
  });

  if (error) {
    if (accountDeletionSubmitButton) {
      accountDeletionSubmitButton.disabled = false;
    }
    console.error('Account deletion request failed:', error);
    setAccountDeletionStatus('We could not send your deletion request. Please try again in a moment.', 'error');
    return;
  }

  setAccountDeletionStatus('Deletion request sent for review. Signing you out...', 'success');
  await signOut();
  redirectToSignedOutNotice('account_deletion_requested');
});

sectionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    setAccountSectionHash(button.dataset.accountSectionTarget);
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

profileBackgroundEditButton?.addEventListener('click', openProfileBackgroundModal);

profileBackgroundCloseButtons.forEach((button) => {
  button.addEventListener('click', closeProfileBackgroundModal);
});

profileBackgroundList?.addEventListener('click', async (event) => {
  const option = event.target.closest('[data-profile-background-select]');

  if (!option || option.disabled) {
    return;
  }

  option.disabled = true;
  await selectProfileBackground(option.dataset.profileBackgroundSelect || 'default');
  option.disabled = false;
});

showProfileTitleToggle?.addEventListener('change', () => {
  updateProfilePreference('show_profile_title', showProfileTitleToggle.checked);
});

selectedProfileTitleSelect?.addEventListener('change', () => {
  if (!selectedProfileTitleSelect) {
    return;
  }

  const selectedValue = normalizeProfileTitleValue(selectedProfileTitleSelect.value);

  if (selectedValue === 'marked' && !isMarkedProfileTitleUnlocked()) {
    selectedProfileTitleSelect.value = getStoredProfileTitleForInput(activeProfile);
    return;
  }

  updateProfilePreference('selected_profile_title', selectedValue || 'seeker');
});

async function saveAdvancedPreference(control, preferenceKey, value) {
  if (!control) {
    return;
  }

  control.disabled = true;
  preferencesSaveQueue = preferencesSaveQueue
    .catch(() => undefined)
    .then(() => updateProfilePreference(preferenceKey, value));

  try {
    await preferencesSaveQueue;
  } finally {
    control.disabled = false;
  }
}

allowReversedCardsToggle?.addEventListener('change', () => {
  saveAdvancedPreference(allowReversedCardsToggle, 'allow_reversed_cards', allowReversedCardsToggle.checked);
});

saveReadingsPromptToggle?.addEventListener('change', () => {
  saveAdvancedPreference(saveReadingsPromptToggle, 'save_readings_prompt', saveReadingsPromptToggle.checked);
});

reduceMotionToggle?.addEventListener('change', () => {
  applyReduceMotionPreference({
    ...getAdvancedUserPreferences(activeProfile),
    reduce_motion: reduceMotionToggle.checked,
  });
  saveAdvancedPreference(reduceMotionToggle, 'reduce_motion', reduceMotionToggle.checked);
});

disableGlowEffectsToggle?.addEventListener('change', () => {
  applyGlowEffectsPreference({
    ...getAdvancedUserPreferences(activeProfile),
    disable_glow_effects: disableGlowEffectsToggle.checked,
  });
  saveAdvancedPreference(disableGlowEffectsToggle, 'disable_glow_effects', disableGlowEffectsToggle.checked);
});

defaultReadingModeSelect?.addEventListener('change', () => {
  const nextMode = normalizeUserPreferences({
    default_reading_mode: defaultReadingModeSelect.value,
  }).default_reading_mode;

  defaultReadingModeSelect.value = nextMode;
  saveAdvancedPreference(defaultReadingModeSelect, 'default_reading_mode', nextMode);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && profileBackgroundModal && !profileBackgroundModal.hidden) {
    closeProfileBackgroundModal();
    return;
  }

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

journalCancelButton?.addEventListener('click', () => {
  resetJournalForm();
  setJournalStatus('');
});

journalViewCloseButton?.addEventListener('click', () => {
  hideJournalEntryView();
});

journalViewEditButton?.addEventListener('click', () => {
  if (!journalViewEditButton?.dataset?.journalViewEdit) {
    setJournalStatus('We could not find that journal entry to edit.', 'error');
    return;
  }

  const entry = journalEntriesCache.find((item) => item.id === journalViewEditButton.dataset.journalViewEdit);

  if (!entry) {
    setJournalStatus('We could not find that journal entry. Please refresh and try again.', 'error');
    return;
  }

  hideJournalEntryView();
  showJournalForm(entry);
});

journalViewDeleteButton?.addEventListener('click', async () => {
  if (!journalViewDeleteButton?.dataset?.journalViewDelete) {
    setJournalStatus('We could not find that journal entry to delete.', 'error');
    return;
  }

  await removeJournalEntry(journalViewDeleteButton.dataset.journalViewDelete, journalViewDeleteButton);
});

journalViewBackdrop?.addEventListener('click', () => {
  hideJournalEntryView();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && journalView && !journalView.hidden) {
    hideJournalEntryView();
  }
});

journalFilterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeJournalFilter = button.dataset.journalFilter || 'all';
    activeJournalPage = 1;
    activeJournalDay = '';
    if (activeJournalFilter === 'week' && !activeJournalWeekStart) {
      activeJournalWeekStart = getStartOfWeek(new Date());
    }
    ensureJournalDateSelections();
    journalEntriesLoaded = false;
    hideJournalEntryView();
    loadJournalEntries({ force: true });
  });
});

journalFilterControls?.addEventListener('click', (event) => {
  const weekNavButton = event.target.closest('[data-journal-week-nav]');
  const dayButton = event.target.closest('[data-journal-day]');

  if (weekNavButton) {
    activeJournalWeekStart = addDays(activeJournalWeekStart, weekNavButton.dataset.journalWeekNav === 'next' ? 7 : -7);
    activeJournalDay = '';
    activeJournalPage = 1;
    journalEntriesLoaded = false;
    hideJournalEntryView();
    loadJournalEntries({ force: true });
    return;
  }

  if (dayButton) {
    activeJournalDay = activeJournalDay === dayButton.dataset.journalDay ? '' : dayButton.dataset.journalDay;
    activeJournalPage = 1;
    journalEntriesLoaded = false;
    hideJournalEntryView();
    loadJournalEntries({ force: true });
  }
});

journalFilterControls?.addEventListener('change', (event) => {
  const monthSelect = event.target.closest('[data-journal-month-select]');
  const yearSelect = event.target.closest('[data-journal-year-select]');

  if (monthSelect) {
    activeJournalMonth = monthSelect.value;
  } else if (yearSelect) {
    activeJournalYear = yearSelect.value;
  } else {
    return;
  }

  activeJournalPage = 1;
  journalEntriesLoaded = false;
  hideJournalEntryView();
  loadJournalEntries({ force: true });
});

journalForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!activeUser) {
    setJournalStatus('Please log in before saving a journal entry.', 'error');
    return;
  }

  if (!editingJournalEntryId) {
    setJournalStatus('Open an existing journal entry to edit it here, or write a new entry from the Journal page.', 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setJournalStatus('Journal saving is not available in this environment.', 'error');
    return;
  }

  const formData = new FormData(journalForm);
  const title = String(formData.get('title') || '').trim();
  const body = String(formData.get('body') || '').trim();
  const entryDate = String(formData.get('entry_date') || '').trim();
  const mood = String(formData.get('mood') || '').trim();
  const checkIn = String(formData.get('check_in') || '').trim();
  const tags = normalizeJournalTags(formData.get('tags'));
  const prompt = String(formData.get('prompt') || '').trim();
  const existingEntry = journalEntriesCache.find((entry) => entry.id === editingJournalEntryId);
  const guidedAnswers = parseGuidedAnswersText(formData.get('guided_answers_text'), existingEntry?.guided_answers);

  if (!title || !entryDate || (!checkIn && !body && !guidedAnswers.length)) {
    setJournalStatus('Add a title, date, and check-in, reflection, or guided answer before saving.', 'error');
    return;
  }

  if (!parseEntryDate(entryDate)) {
    setJournalStatus('Choose a valid entry date.', 'error');
    return;
  }

  const payload = {
    title,
    body,
    check_in: checkIn || null,
    entry_date: entryDate,
    mood: mood || null,
    mood_key: mood ? mood.toLowerCase().replace(/\s+/g, '_') : null,
    tags,
    prompt: prompt || null,
    guided_answers: guidedAnswers,
    metadata: {
      ...(existingEntry?.metadata && typeof existingEntry.metadata === 'object' && !Array.isArray(existingEntry.metadata) ? existingEntry.metadata : {}),
      prompt: prompt || existingEntry?.metadata?.prompt || '',
    },
  };

  if (journalSaveButton) {
    journalSaveButton.disabled = true;
  }
  setJournalStatus('Updating journal entry...');

  const response = await supabase
    .from('user_journal_entries')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', editingJournalEntryId)
    .eq('user_id', activeUser.id)
    .select(journalEntrySelectColumns)
    .maybeSingle();

  if (journalSaveButton) {
    journalSaveButton.disabled = false;
  }

  if (response.error) {
    console.error('Journal entry save failed:', response.error);
    setJournalStatus('We could not save your journal entry. Please try again.', 'error');
    return;
  }

  if (!response.data) {
    console.error('Journal entry save returned no row:', { editingJournalEntryId, userId: activeUser.id });
    setJournalStatus('We could not update that journal entry. Please refresh and try again.', 'error');
    return;
  }

  journalEntriesCache = sortJournalEntries(journalEntriesCache.map((entry) => (
    entry.id === response.data.id ? response.data : entry
  )));
  setJournalStatus('Journal entry updated.', 'success');

  journalEntriesLoaded = true;
  resetJournalForm();
  await loadJournalCount();
  await loadJournalEntries({ force: true });
});

async function removeJournalEntry(entryId, actionButton = null) {
  const entry = journalEntriesCache.find((item) => item.id === entryId);

  if (!entry) {
    setJournalStatus('We could not find that journal entry. Please refresh and try again.', 'error');
    return;
  }

  const shouldDelete = window.confirm(`Delete "${entry.title || 'this journal entry'}"?`);

  if (!shouldDelete) {
    return;
  }

  if (!activeUser) {
    setJournalStatus('Please log in before deleting a journal entry.', 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setJournalStatus('Journal deletion is not available in this environment.', 'error');
    return;
  }

  if (actionButton) {
    actionButton.disabled = true;
  }

  setJournalStatus('Deleting journal entry...');

  const { error } = await supabase
    .from('user_journal_entries')
    .delete()
    .eq('id', entryId)
    .eq('user_id', activeUser.id);

  if (actionButton) {
    actionButton.disabled = false;
  }

  if (error) {
    console.error('Journal entry delete failed:', error);
    setJournalStatus('We could not delete your journal entry. Please try again.', 'error');
    return;
  }

  journalEntriesCache = journalEntriesCache.filter((item) => item.id !== entryId);
  resetJournalForm();
  hideJournalEntryView();
  setJournalStatus('Journal entry deleted.', 'success');
  await loadJournalCount();
  await loadJournalEntries({ force: true });
}

journalList?.addEventListener('click', async (event) => {
  const viewButton = event.target.closest('[data-journal-view-entry]');
  const editButton = event.target.closest('[data-journal-edit]');
  const deleteButton = event.target.closest('[data-journal-delete]');

  if (viewButton) {
    const entry = journalEntriesCache.find((item) => item.id === viewButton.dataset.journalViewEntry);

    if (!entry) {
      setJournalStatus('We could not find that journal entry. Please refresh and try again.', 'error');
      return;
    }

    showJournalEntryView(entry);
    return;
  }

  if (editButton) {
    const entry = journalEntriesCache.find((item) => item.id === editButton.dataset.journalEdit);

    if (!entry) {
      setJournalStatus('We could not find that journal entry. Please refresh and try again.', 'error');
      return;
    }

    showJournalForm(entry);
    return;
  }

  if (!deleteButton) {
    return;
  }

  await removeJournalEntry(deleteButton.dataset.journalDelete, deleteButton);
});

readingFilterControls?.addEventListener('click', (event) => {
  const filterButton = event.target.closest('[data-reading-filter]');

  if (!filterButton) {
    return;
  }

  activeReadingFilter = filterButton.dataset.readingFilter || 'all';
  activeReadingPage = 1;
  renderSavedReadings(savedReadingsCache);
});

readingPaginationControls?.addEventListener('click', (event) => {
  const pageButton = event.target.closest('[data-reading-page]');

  if (!pageButton || pageButton.disabled) {
    return;
  }

  const nextPage = Number(pageButton.dataset.readingPage);

  if (!Number.isFinite(nextPage)) {
    return;
  }

  activeReadingPage = nextPage;
  renderSavedReadings(savedReadingsCache);
});

savedReadingsList?.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-saved-reading-view]');

  if (viewButton) {
    openSavedReadingModal(viewButton.dataset.savedReadingView);
    return;
  }

  const deleteButton = event.target.closest('[data-saved-reading-delete]');

  if (!deleteButton || deleteButton.disabled) {
    return;
  }

  deleteSavedReading(deleteButton.dataset.savedReadingDelete, deleteButton);
});

document.addEventListener('dragstart', preventPrivateCardDrag);
document.addEventListener('contextmenu', preventProtectedMediaContextMenu);

savedReadingModalCloseButtons.forEach((button) => {
  button.addEventListener('click', closeSavedReadingModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && changePasswordModal && !changePasswordModal.hidden) {
    if (!isChangingPassword) {
      setChangePasswordModalOpen(false);
    }
    return;
  }

  if (event.key === 'Escape' && savedReadingModal && !savedReadingModal.hidden) {
    closeSavedReadingModal();
    return;
  }

  if (event.key === 'Escape' && privacyControlsModal && !privacyControlsModal.hidden) {
    setPrivacyControlsModalOpen(false);
    return;
  }

  if (event.key === 'Escape' && accountDeletionModal && !accountDeletionModal.hidden) {
    setAccountDeletionModalOpen(false);
    return;
  }

  if (event.key === 'Escape') {
    setMobileNavOpen(false);
  }
});

window.addEventListener('hashchange', showHashAccountSection);

showHashAccountSection();
loadAccount();
