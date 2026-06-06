import { getCurrentUserWithProfile, isCurrentUserAdmin, signOut } from '../services/auth.js';
import { isSupabaseConfigured } from '../services/supabase-client.js';

const loadingPanel = document.querySelector('[data-account-loading]');
const accountPanel = document.querySelector('[data-account-panel]');
const errorPanel = document.querySelector('[data-account-error]');
const emailValue = document.querySelector('[data-account-email]');
const nameValue = document.querySelector('[data-account-name]');
const roleValue = document.querySelector('[data-account-role]');
const avatar = document.querySelector('[data-account-avatar]');
const logoutButton = document.querySelector('[data-logout]');
const adminLink = document.querySelector('[data-admin-link]');

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

function showError(message) {
  loadingPanel.hidden = true;
  accountPanel.hidden = true;
  errorPanel.hidden = false;
  errorPanel.textContent = message;
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

  const email = user.email || 'Signed-in user';
  const displayName = getProfileValue(profile, ['display_name', 'name', 'full_name', 'username'])
    || getProfileValue(user.user_metadata, ['display_name', 'name', 'full_name']);
  const avatarUrl = getProfileValue(profile, ['avatar_url']);
  const role = getProfileValue(profile, ['role']) || 'user';
  const { isAdmin } = await isCurrentUserAdmin();

  emailValue.textContent = email;
  nameValue.textContent = displayName || 'Astral Veil Seeker';
  roleValue.textContent = role;
  avatar.textContent = getInitials(displayName, email);

  if (avatarUrl) {
    avatar.style.backgroundImage = `url("${avatarUrl.replace(/"/g, '%22')}")`;
    avatar.classList.add('has-image');
    avatar.setAttribute('aria-label', `${displayName || email} avatar`);
  }

  adminLink.hidden = !isAdmin;
  loadingPanel.hidden = true;
  accountPanel.hidden = false;
}

logoutButton.addEventListener('click', async () => {
  logoutButton.disabled = true;
  logoutButton.textContent = 'Logging Out...';

  const { error } = await signOut();

  if (error) {
    logoutButton.disabled = false;
    logoutButton.textContent = 'Log Out';
    showError('We could not log you out. Please try again.');
    return;
  }

  window.location.assign('auth.html');
});

loadAccount();
