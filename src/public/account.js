import { getCurrentUserWithProfile, isCurrentUserAdmin, signOut } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

const loadingPanel = document.querySelector('[data-account-loading]');
const accountPanel = document.querySelector('[data-account-panel]');
const errorPanel = document.querySelector('[data-account-error]');
const emailValue = document.querySelector('[data-account-email]');
const nameValue = document.querySelector('[data-account-name]');
const roleValue = document.querySelector('[data-account-role]');
const avatar = document.querySelector('[data-account-avatar]');
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

let savedReadingsLoaded = false;
let activeUser = null;

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

function formatSavedCard(card, index) {
  const position = card?.position_label || card?.position || `Card ${index + 1}`;
  const title = card?.title || card?.name || 'Unknown card';
  const orientation = card?.orientation || (card?.reversed ? 'reversed' : card?.upright ? 'upright' : '');
  const summary = card?.summary || card?.meaning || '';

  return `
    <div class="saved-reading-card__card">
      <strong>${escapeHtml(position)}</strong>
      <p>${escapeHtml(title)}${orientation ? ` · ${escapeHtml(orientation)}` : ''}</p>
      ${summary ? `<p>${escapeHtml(summary)}</p>` : ''}
    </div>
  `;
}

function renderSavedReadingDetails(reading) {
  const cards = Array.isArray(reading.cards) ? reading.cards : [];
  const metadata = reading.metadata && Object.keys(reading.metadata).length
    ? JSON.stringify(reading.metadata, null, 2)
    : '';

  return `
    <div class="saved-reading-card__details" data-saved-reading-details="${escapeHtml(reading.id || '')}" hidden>
      ${
        cards.length
          ? `<div class="saved-reading-card__cards">${cards.map(formatSavedCard).join('')}</div>`
          : '<p>No card details were saved for this reading.</p>'
      }
      ${
        reading.result_summary
          ? `<p class="saved-reading-card__summary">${escapeHtml(reading.result_summary)}</p>`
          : '<p>No reading summary was saved.</p>'
      }
      ${metadata ? `<pre class="saved-reading-card__metadata">${escapeHtml(metadata)}</pre>` : ''}
    </div>
  `;
}

function renderSavedReadings(readings) {
  if (!savedReadingsList) {
    return;
  }

  if (!readings.length) {
    savedReadingsList.innerHTML = '<p class="saved-readings__state">No saved readings yet.</p>';
    return;
  }

  savedReadingsList.innerHTML = readings
    .map((reading) => `
      <article class="saved-reading-card">
        <div class="saved-reading-card__header">
          <div class="saved-reading-card__title">
            <span class="saved-reading-card__date">${escapeHtml(formatDateTime(reading.created_at))}</span>
            <h3>${escapeHtml(reading.reader_name || 'Astral Reading')}</h3>
          </div>
          <button class="card-action" type="button" data-saved-reading-toggle="${escapeHtml(reading.id || '')}">View Reading</button>
        </div>
        <div class="saved-reading-card__meta">
          <span>Mode: ${escapeHtml(formatReadableValue(reading.mode_key))}</span>
          <span>Spread: ${escapeHtml(formatReadableValue(reading.spread_type))}</span>
          <span>Cards: ${escapeHtml(formatReadableValue(reading.card_count))}</span>
          <span>Saved: ${escapeHtml(formatReadableValue(reading.is_saved))}</span>
        </div>
        ${renderSavedReadingDetails(reading)}
      </article>
    `)
    .join('');
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
  renderSavedReadings(data || []);
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

  const email = user.email || 'Signed-in user';
  const displayName = getProfileValue(profile, ['display_name', 'name', 'full_name', 'username'])
    || getProfileValue(user.user_metadata, ['display_name', 'name', 'full_name']);
  const role = getProfileValue(profile, ['role']) || 'user';
  const memberSince = getProfileValue(profile, ['created_at', 'inserted_at']) || user.created_at;
  const { isAdmin } = await isCurrentUserAdmin();

  emailValue.textContent = email;
  nameValue.textContent = displayName || 'Astral Veil Seeker';
  roleValue.textContent = role;
  memberSinceValue.textContent = formatDate(memberSince);
  avatar.textContent = getInitials(displayName, email);

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

savedReadingsList?.addEventListener('click', (event) => {
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
