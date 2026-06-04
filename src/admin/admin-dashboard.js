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
const adminViews = document.querySelectorAll('[data-admin-view]');
const viewLinks = document.querySelectorAll('[data-admin-view-link]');
const journalsState = document.querySelector('[data-journals-state]');
const journalsTableWrap = document.querySelector('[data-journals-table-wrap]');
const journalsTableBody = document.querySelector('[data-journals-table-body]');
const journalDetail = document.querySelector('[data-journal-detail]');
const journalDetailTitle = document.querySelector('[data-journal-detail-title]');
const journalDetailMeta = document.querySelector('[data-journal-detail-meta]');
const journalDetailFields = document.querySelector('[data-journal-detail-fields]');
const journalDetailBody = document.querySelector('[data-journal-detail-body]');
const journalDetailCloseButton = document.querySelector('[data-journal-detail-close]');

let journalsLoaded = false;
let journalRows = [];

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

function getFirstValue(row, fieldNames) {
  return fieldNames.map((fieldName) => row?.[fieldName]).find((value) => {
    if (typeof value === 'undefined' || value === null) {
      return false;
    }

    return String(value).trim() !== '';
  });
}

function formatValue(value, fallback = '--') {
  if (typeof value === 'undefined' || value === null || value === '') {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).join('\n\n') || fallback;
  }

  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function formatDate(value) {
  if (!value) {
    return '--';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function getJournalTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name', 'heading']), 'Untitled journal');
}

function getJournalKey(row) {
  return formatValue(getFirstValue(row, ['slug', 'journal_key', 'key', 'id']));
}

function getJournalStatus(row) {
  const explicitStatus = getFirstValue(row, ['status', 'state', 'visibility']);

  if (explicitStatus) {
    return formatValue(explicitStatus);
  }

  const publishedValue = getFirstValue(row, ['published', 'is_published', 'published_at']);

  if (typeof publishedValue === 'boolean') {
    return publishedValue ? 'Published' : 'Draft';
  }

  if (publishedValue) {
    return 'Published';
  }

  return '--';
}

function getJournalMode(row) {
  return formatValue(getFirstValue(row, ['mode', 'site_mode', 'event_mode', 'collection_mode']));
}

function getJournalBody(row) {
  return formatValue(
    getFirstValue(row, ['body', 'content', 'text', 'entry', 'description', 'summary']),
    'No body/content field available for this journal.',
  );
}

function setJournalsState(message, state = '') {
  journalsState.textContent = message;
  journalsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  journalsState.hidden = false;
}

function hideJournalDetail() {
  journalDetail.hidden = true;
}

function appendTextCell(rowElement, value, className = '') {
  const cell = document.createElement('td');
  cell.textContent = value;

  if (className) {
    cell.className = className;
  }

  rowElement.append(cell);
}

function renderJournalRows(rows) {
  journalsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, getJournalTitle(row), 'admin-table__title');
    appendTextCell(tableRow, getJournalKey(row), 'admin-table__muted');
    appendTextCell(tableRow, getJournalStatus(row));
    appendTextCell(tableRow, getJournalMode(row));
    appendTextCell(tableRow, formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
    appendTextCell(tableRow, formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View';
    actionButton.addEventListener('click', () => showJournalDetail(index));
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    journalsTableBody.append(tableRow);
  });
}

function appendDetailField(label, value) {
  const field = document.createElement('p');
  const labelElement = document.createElement('span');
  const valueElement = document.createElement('span');

  field.className = 'admin-detail-field';
  labelElement.textContent = label;
  valueElement.textContent = value;
  field.append(labelElement, valueElement);
  journalDetailFields.append(field);
}

function appendDetailChip(label, value) {
  if (!value || value === '--') {
    return;
  }

  const chip = document.createElement('span');
  chip.className = 'admin-detail-chip';
  chip.textContent = `${label}: ${value}`;
  journalDetailMeta.append(chip);
}

function showJournalDetail(index) {
  const row = journalRows[index];

  if (!row) {
    return;
  }

  journalDetailTitle.textContent = getJournalTitle(row);
  journalDetailMeta.replaceChildren();
  journalDetailFields.replaceChildren();
  journalDetailBody.textContent = getJournalBody(row);

  appendDetailChip('Status', getJournalStatus(row));
  appendDetailChip('Mode', getJournalMode(row));
  appendDetailChip('Key', getJournalKey(row));
  appendDetailField('Source', formatValue(getFirstValue(row, ['source', 'origin', 'author'])));
  appendDetailField('Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField('Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField('Metadata', formatValue(getFirstValue(row, ['metadata', 'meta', 'settings'])));

  journalDetail.hidden = false;
  journalDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function loadJournals() {
  if (journalsLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setJournalsState('Journals are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setJournalsState('Loading journals...');
  journalsTableWrap.hidden = true;
  hideJournalDetail();

  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .limit(100);

  if (error) {
    setJournalsState('Journals could not be loaded. Please try again later.', 'error');
    return;
  }

  journalRows = Array.isArray(data) ? data : [];
  journalsLoaded = true;

  if (!journalRows.length) {
    setJournalsState('No journals found.');
    return;
  }

  journalRows.sort((firstRow, secondRow) => {
    const firstDate = new Date(getFirstValue(firstRow, ['updated_at', 'created_at']) || 0).getTime();
    const secondDate = new Date(getFirstValue(secondRow, ['updated_at', 'created_at']) || 0).getTime();
    return secondDate - firstDate;
  });

  renderJournalRows(journalRows);
  journalsState.hidden = true;
  journalsTableWrap.hidden = false;
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

function setCurrentView(viewName = 'overview', { updateHistory = true } = {}) {
  const normalizedViewName = viewName === 'journals' ? 'journals' : 'overview';

  adminViews.forEach((view) => {
    view.hidden = view.dataset.adminView !== normalizedViewName;
  });

  navLinks.forEach((navLink) => {
    navLink.setAttribute('aria-current', navLink.dataset.adminViewLink === normalizedViewName ? 'page' : 'false');
  });

  if (updateHistory && window.location.hash !== `#${normalizedViewName}`) {
    window.history.pushState(null, '', `#${normalizedViewName}`);
  }

  if (normalizedViewName === 'journals') {
    loadJournals();
  }
}

function bindViewLinks() {
  viewLinks.forEach((viewLink) => {
    viewLink.addEventListener('click', (event) => {
      const viewName = viewLink.dataset.adminViewLink;

      if (!viewName) {
        return;
      }

      event.preventDefault();
      setCurrentView(viewName);
    });

    if (viewLink.matches('[role="button"]')) {
      viewLink.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setCurrentView(viewLink.dataset.adminViewLink);
        }
      });
    }
  });

  journalDetailCloseButton.addEventListener('click', hideJournalDetail);
  window.addEventListener('popstate', () => {
    setCurrentView(window.location.hash.replace('#', ''), { updateHistory: false });
  });
}

async function initAdminDashboard() {
  bindSignOutButtons();
  bindNavToggle();
  bindViewLinks();

  if (!isSupabaseConfigured()) {
    adminLayout.classList.remove('is-auth-checking');
    adminLayout.classList.add('is-access-denied');
    setAccessMessage('The archive connection is not configured for this environment.', 'error');
    loginLink.hidden = false;
    return;
  }

  const result = await requireAdmin();

  if (!result.authorized) {
    if (result.reason === 'not_logged_in') {
      window.location.replace('admin-login.html');
      return;
    }

    adminLayout.classList.remove('is-auth-checking');
    adminLayout.classList.add('is-access-denied');

    if (result.reason === 'not_admin') {
      setAccessMessage('Access denied. This account does not have admin access.', 'error');
      showIdentity(result.user, result.profile);
      accessSignOutButton.hidden = false;
      loginLink.hidden = false;
      return;
    }

    setAccessMessage(result.message, 'error');
    loginLink.hidden = false;
    return;
  }

  adminLayout.classList.remove('is-auth-checking', 'is-access-denied');
  setAccessMessage('Admin access confirmed.', 'success');
  showIdentity(result.user, result.profile);
  shell.classList.add('is-visible');
  statusStrip.hidden = false;
  signOutButton.hidden = false;
  setCurrentView(window.location.hash.replace('#', '') || 'overview');
  await loadAdminCounts();
}

initAdminDashboard();
