import { getCurrentUserWithProfile } from '../services/auth.js';
import { isSupabaseConfigured } from '../services/supabase-client.js';

const returnToStorageKey = 'astralVeilReturnTo';

function getSafeCurrentPath() {
  const path = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  return path.includes('auth.html') ? 'index.html' : path;
}

function getAuthHref() {
  return `auth.html?returnTo=${encodeURIComponent(getSafeCurrentPath())}`;
}

function storeReturnTo() {
  try {
    sessionStorage.setItem(returnToStorageKey, getSafeCurrentPath());
  } catch {
    return;
  }
}

function getProfileValue(profile, user, keys) {
  for (const key of keys) {
    const profileValue = profile?.[key];
    const userValue = user?.user_metadata?.[key];
    const value = profileValue || userValue;

    if (value !== null && value !== undefined && String(value).trim()) {
      return String(value).trim();
    }
  }

  return '';
}

function getInitials(profile, user) {
  const source = getProfileValue(profile, user, ['display_name', 'name', 'full_name', 'username'])
    || user?.email
    || 'Astral Veil';
  const parts = source
    .replace(/@.*/, '')
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2);

  return parts.map((part) => part.charAt(0).toUpperCase()).join('') || 'AV';
}

function createLoginLink(className, datasetValue) {
  const link = document.createElement('a');

  link.className = className;
  link.href = getAuthHref();
  link.textContent = 'Log In';
  link.dataset.publicAuthNav = datasetValue;
  link.setAttribute('aria-label', 'Log in to Astral Veil');
  link.addEventListener('click', storeReturnTo);

  return link;
}

function createAvatar(profile, user) {
  const avatar = document.createElement('span');
  const avatarUrl = getProfileValue(profile, user, ['avatar_url', 'picture']);

  avatar.className = 'navbar-account__avatar';

  if (avatarUrl) {
    avatar.style.backgroundImage = `url("${avatarUrl.replace(/"/g, '%22')}")`;
    avatar.classList.add('has-image');
  } else {
    avatar.textContent = getInitials(profile, user);
  }

  return avatar;
}

function createAccountControl({ user, profile, mobile = false }) {
  const wrap = document.createElement('div');
  const link = document.createElement('a');

  wrap.className = mobile ? 'navbar-account navbar-account--mobile' : 'navbar-account';
  link.className = mobile ? 'navbar-account__button navbar-account__button--mobile' : 'navbar-account__button';
  link.href = 'account.html';
  link.setAttribute('aria-label', 'Open account page');
  link.append(createAvatar(profile, user));

  if (mobile) {
    const label = document.createElement('span');
    label.textContent = 'Account';
    link.append(label);
  }

  wrap.append(link);
  return wrap;
}

function renderPublicAuthNav({ user, profile }) {
  const desktopMount = document.querySelector('[data-public-auth-nav="desktop"]');
  const mobileMount = document.querySelector('[data-public-auth-nav="mobile"]');

  if (desktopMount) {
    desktopMount.replaceChildren(user
      ? createAccountControl({ user, profile })
      : createLoginLink('navbar__link navbar__link--account', 'desktop'));
  }

  if (mobileMount) {
    mobileMount.replaceChildren(user
      ? createAccountControl({ user, profile, mobile: true })
      : createLoginLink('navbar__mobile-link navbar__mobile-link--account', 'mobile'));
  }
}

function ensurePublicAuthMounts() {
  const desktopNav = document.querySelector('.navbar__links');
  const mobileNav = document.querySelector('.navbar__mobile-menu');

  if (desktopNav && !desktopNav.querySelector('[data-public-auth-nav="desktop"]')) {
    const listItem = document.createElement('li');
    listItem.dataset.publicAuthNav = 'desktop';
    desktopNav.append(listItem);
  }

  if (mobileNav && !mobileNav.querySelector('[data-public-auth-nav="mobile"]')) {
    const mobileItem = document.createElement('div');
    mobileItem.dataset.publicAuthNav = 'mobile';
    mobileNav.append(mobileItem);
  }
}

async function initPublicAuthNav() {
  ensurePublicAuthMounts();
  renderPublicAuthNav({ user: null, profile: null });

  if (!isSupabaseConfigured()) {
    return;
  }

  const { user, profile, error } = await getCurrentUserWithProfile();

  if (error || !user) {
    renderPublicAuthNav({ user: null, profile: null });
    return;
  }

  renderPublicAuthNav({ user, profile });
}

initPublicAuthNav();
