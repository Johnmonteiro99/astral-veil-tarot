import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';
import { requireAdmin, signOut } from '../services/auth.js';

const countTables = [
  'journals',
  'archive_rooms',
  'artifacts',
  'memory_fragments',
  'veilwalkers',
  'veilwalker_notes',
];

const accessMessage = document.querySelector('[data-access-message]');
const loginLink = document.querySelector('[data-login-link]');
const accessSignOutButton = document.querySelector('[data-access-sign-out]');
const shell = document.querySelector('[data-admin-shell]');
const statusStrip = document.querySelector('[data-admin-status-strip]');
const adminLayout = document.querySelector('[data-admin-layout]');
const signOutButton = document.querySelector('[data-sign-out]');
const adminIdentity = document.querySelector('[data-admin-identity]');
const adminEmail = document.querySelector('[data-admin-email]');
const roleBadge = document.querySelector('[data-role-badge]');
const adminAvatar = document.querySelector('[data-admin-avatar]');
const navToggleButton = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelectorAll('#admin-navigation a');
const sidebarOpenButton = document.querySelector('[data-sidebar-open]');
const sidebarScrim = document.querySelector('[data-sidebar-scrim]');
const mobileNavigationQuery = window.matchMedia('(max-width: 900px)');

function setAccessMessage(text, state = '') {
  accessMessage.textContent = text;
  accessMessage.className = `status${state ? ` status--${state}` : ''}`;
}

function setCount(tableName, value) {
  const countElement = document.querySelector(`[data-count-table="${tableName}"]`);

  if (!countElement) {
    return;
  }

  countElement.textContent = `Count: ${value}`;
}

function showIdentity(user, profile) {
  adminEmail.textContent = user.email || 'Admin user';
  setAdminAvatar(user, profile);
  adminIdentity.hidden = false;
  roleBadge.textContent = profile?.role === 'admin' ? 'Admin' : 'Admin Access';
  roleBadge.hidden = false;
}

function getInitials(value = '') {
  const cleanedValue = value.trim();

  if (!cleanedValue) {
    return 'AV';
  }

  return cleanedValue
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'AV';
}

function setAdminAvatar(user, profile) {
  if (!adminAvatar) {
    return;
  }

  const avatarUrl = profile?.avatar_url;

  if (avatarUrl) {
    const safeAvatarUrl = String(avatarUrl).replace(/["\\\n\r]/g, '');

    adminAvatar.style.setProperty('--avatar-url', `url("${safeAvatarUrl}")`);
    adminAvatar.classList.add('has-image');
    adminAvatar.textContent = '';
    return;
  }

  adminAvatar.style.removeProperty('--avatar-url');
  adminAvatar.classList.remove('has-image');
  adminAvatar.textContent = getInitials(user.email || 'Admin user');
}

async function fetchTableCount(tableName) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return 'Unavailable';
  }

  const { count, error } = await supabase
    .from(tableName)
    .select('id', { count: 'exact', head: true });

  if (error || typeof count !== 'number') {
    return 'Unavailable';
  }

  return count;
}

async function loadAdminCounts() {
  await Promise.all(
    countTables.map(async (tableName) => {
      const count = await fetchTableCount(tableName);
      setCount(tableName, count);
    }),
  );
}

async function handleSignOut() {
  signOutButton.disabled = true;
  accessSignOutButton.disabled = true;
  await signOut();
  window.location.assign('admin-login.html');
}

function bindSignOutButtons() {
  signOutButton.addEventListener('click', handleSignOut);
  accessSignOutButton.addEventListener('click', handleSignOut);
}

function bindNavToggle() {
  const setSidebarState = ({ collapsed = false, open = false } = {}) => {
    const sidebarVisible = mobileNavigationQuery.matches ? open : !collapsed;

    adminLayout.classList.toggle('sidebar-collapsed', collapsed);
    adminLayout.classList.toggle('sidebar-open', open);
    document.body.classList.toggle('admin-nav-open', mobileNavigationQuery.matches && open);
    navToggleButton.setAttribute('aria-expanded', String(sidebarVisible));
    sidebarOpenButton.setAttribute('aria-expanded', String(sidebarVisible));
    navToggleButton.textContent = mobileNavigationQuery.matches ? 'Close Navigation' : 'Hide Navigation';
  };

  const openSidebar = () => {
    if (mobileNavigationQuery.matches) {
      setSidebarState({ open: true });
      return;
    }

    setSidebarState();
  };

  const closeSidebar = () => {
    if (mobileNavigationQuery.matches) {
      setSidebarState();
      return;
    }

    setSidebarState({ collapsed: true });
  };

  navToggleButton.addEventListener('click', closeSidebar);
  sidebarOpenButton.addEventListener('click', openSidebar);
  sidebarScrim.addEventListener('click', closeSidebar);
  navLinks.forEach((navLink) => {
    navLink.addEventListener('click', () => {
      if (mobileNavigationQuery.matches) {
        closeSidebar();
      }
    });
  });
  mobileNavigationQuery.addEventListener('change', () => {
    setSidebarState({ collapsed: !mobileNavigationQuery.matches && adminLayout.classList.contains('sidebar-collapsed') });
  });
  setSidebarState();
}

async function initAdminDashboard() {
  bindSignOutButtons();
  bindNavToggle();

  if (!isSupabaseConfigured()) {
    setAccessMessage('The archive connection is not configured for this environment.', 'error');
    loginLink.hidden = false;
    return;
  }

  const result = await requireAdmin({ redirectTo: 'admin-login.html', redirectDelay: 1200 });

  if (!result.authorized) {
    setAccessMessage(result.message, 'error');

    if (result.reason === 'not_admin') {
      showIdentity(result.user, result.profile);
      accessSignOutButton.hidden = false;
      return;
    }

    loginLink.hidden = false;
    return;
  }

  setAccessMessage('Admin access confirmed.', 'success');
  showIdentity(result.user, result.profile);
  shell.classList.add('is-visible');
  statusStrip.hidden = false;
  signOutButton.hidden = false;
  await loadAdminCounts();
}

initAdminDashboard();
