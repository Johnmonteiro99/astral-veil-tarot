import { getCurrentUserWithProfile } from '../services/auth.js';
import { isSupabaseConfigured } from '../services/supabase-client.js';
import { loadCurrentUserPreferences } from './user-preferences.js';

const returnToStorageKey = 'astralVeilReturnTo';
const publicAuthNavCacheKey = 'astralVeilPublicAuthNav';

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

function getCachedPublicAuthNav() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(publicAuthNavCacheKey) || 'null');

    if (!cached || cached.state !== 'authenticated') {
      return null;
    }

    return cached;
  } catch {
    return null;
  }
}

function cachePublicAuthNav({ user, profile }) {
  try {
    if (!user) {
      sessionStorage.removeItem(publicAuthNavCacheKey);
      return;
    }

    sessionStorage.setItem(publicAuthNavCacheKey, JSON.stringify({
      state: 'authenticated',
      userId: user.id,
      avatarUrl: getProfileValue(profile, user, ['avatar_url', 'picture']),
      initials: getInitials(profile, user),
    }));
  } catch {
    return;
  }
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

function createAuthPlaceholder(mobile = false) {
  const placeholder = document.createElement('span');

  placeholder.className = mobile
    ? 'navbar-account-placeholder navbar-account-placeholder--mobile'
    : 'navbar-account-placeholder';
  placeholder.dataset.publicAuthNavPlaceholder = mobile ? 'mobile' : 'desktop';
  placeholder.setAttribute('aria-hidden', 'true');

  return placeholder;
}

function createAvatar({ avatarUrl = '', initials = 'AV' } = {}) {
  const avatar = document.createElement('span');

  avatar.className = 'navbar-account__avatar';
  avatar.setAttribute('aria-hidden', 'true');

  if (avatarUrl) {
    avatar.style.backgroundImage = `url("${avatarUrl.replace(/"/g, '%22')}")`;
    avatar.classList.add('has-image');
  } else {
    avatar.textContent = initials;
  }

  return avatar;
}

function createAccountControl({ avatarUrl = '', initials = 'AV', mobile = false } = {}) {
  const wrap = document.createElement('div');
  const link = document.createElement('a');

  wrap.className = mobile ? 'navbar-account navbar-account--mobile' : 'navbar-account';
  link.className = mobile ? 'navbar-account__button navbar-account__button--mobile' : 'navbar-account__button';
  link.href = 'account.html#overview';
  link.setAttribute('aria-label', 'Open account page');
  link.append(createAvatar({ avatarUrl, initials }));

  if (mobile) {
    const label = document.createElement('span');
    label.textContent = 'Account';
    link.append(label);
  }

  wrap.append(link);
  return wrap;
}

function getResolvedAuthView({ user, profile, cached, loading = false }) {
  if (loading && cached) {
    return {
      state: 'authenticated',
      avatarUrl: cached.avatarUrl || '',
      initials: cached.initials || 'AV',
    };
  }

  if (loading) {
    return { state: 'loading' };
  }

  if (!user) {
    return { state: 'anonymous' };
  }

  return {
    state: 'authenticated',
    avatarUrl: getProfileValue(profile, user, ['avatar_url', 'picture']),
    initials: getInitials(profile, user),
  };
}

function renderPublicAuthMount(mount, view, { mobile = false } = {}) {
  if (!mount) {
    return;
  }

  if (mount.dataset.publicAuthState === view.state) {
    if (view.state !== 'authenticated') {
      return;
    }

    const avatar = mount.querySelector('.navbar-account__avatar');

    if (avatar) {
      avatar.textContent = view.avatarUrl ? '' : view.initials;
      avatar.style.backgroundImage = view.avatarUrl ? `url("${view.avatarUrl.replace(/"/g, '%22')}")` : '';
      avatar.classList.toggle('has-image', Boolean(view.avatarUrl));
    }

    return;
  }

  mount.dataset.publicAuthState = view.state;

  if (view.state === 'loading') {
    mount.replaceChildren(createAuthPlaceholder(mobile));
    return;
  }

  if (view.state === 'authenticated') {
    mount.replaceChildren(createAccountControl({
      avatarUrl: view.avatarUrl,
      initials: view.initials,
      mobile,
    }));
    return;
  }

  mount.replaceChildren(createLoginLink(
    mobile ? 'navbar__mobile-link navbar__mobile-link--account' : 'navbar__link navbar__link--account',
    mobile ? 'mobile' : 'desktop'
  ));
}

function renderPublicAuthNav({ user = null, profile = null, cached = null, loading = false } = {}) {
  const desktopMount = document.querySelector('[data-public-auth-nav="desktop"]');
  const mobileMount = document.querySelector('[data-public-auth-nav="mobile"]');
  const view = getResolvedAuthView({ user, profile, cached, loading });

  renderPublicAuthMount(desktopMount, view);
  renderPublicAuthMount(mobileMount, view, { mobile: true });
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
  const cached = getCachedPublicAuthNav();

  renderPublicAuthNav({ cached, loading: true });
  void loadCurrentUserPreferences();

  if (!isSupabaseConfigured()) {
    renderPublicAuthNav({ user: null, profile: null });
    return;
  }

  const { user, profile, error } = await getCurrentUserWithProfile();

  if (error) {
    renderPublicAuthNav(cached ? { cached, loading: true } : { user: null, profile: null });
    return;
  }

  if (!user) {
    cachePublicAuthNav({ user: null, profile: null });
    renderPublicAuthNav({ user: null, profile: null });
    return;
  }

  cachePublicAuthNav({ user, profile });
  renderPublicAuthNav({ user, profile });
}

initPublicAuthNav();
