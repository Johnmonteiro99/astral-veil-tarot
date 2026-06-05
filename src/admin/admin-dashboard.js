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
const archiveRoomsState = document.querySelector('[data-archive-rooms-state]');
const archiveRoomsTableWrap = document.querySelector('[data-archive-rooms-table-wrap]');
const archiveRoomsTableBody = document.querySelector('[data-archive-rooms-table-body]');
const archiveRoomDetail = document.querySelector('[data-archive-room-detail]');
const archiveRoomDetailTitle = document.querySelector('[data-archive-room-detail-title]');
const archiveRoomDetailMeta = document.querySelector('[data-archive-room-detail-meta]');
const archiveRoomDetailFields = document.querySelector('[data-archive-room-detail-fields]');
const archiveRoomDetailBody = document.querySelector('[data-archive-room-detail-body]');
const archiveRoomDetailCloseButton = document.querySelector('[data-archive-room-detail-close]');
const artifactsState = document.querySelector('[data-artifacts-state]');
const artifactsTableWrap = document.querySelector('[data-artifacts-table-wrap]');
const artifactsTableBody = document.querySelector('[data-artifacts-table-body]');
const artifactDetail = document.querySelector('[data-artifact-detail]');
const artifactDetailTitle = document.querySelector('[data-artifact-detail-title]');
const artifactDetailMeta = document.querySelector('[data-artifact-detail-meta]');
const artifactDetailFields = document.querySelector('[data-artifact-detail-fields]');
const artifactDetailBody = document.querySelector('[data-artifact-detail-body]');
const artifactDetailCloseButton = document.querySelector('[data-artifact-detail-close]');
const memoryFragmentsState = document.querySelector('[data-memory-fragments-state]');
const memoryFragmentsTableWrap = document.querySelector('[data-memory-fragments-table-wrap]');
const memoryFragmentsTableBody = document.querySelector('[data-memory-fragments-table-body]');
const memoryFragmentDetail = document.querySelector('[data-memory-fragment-detail]');
const memoryFragmentDetailTitle = document.querySelector('[data-memory-fragment-detail-title]');
const memoryFragmentDetailMeta = document.querySelector('[data-memory-fragment-detail-meta]');
const memoryFragmentDetailFields = document.querySelector('[data-memory-fragment-detail-fields]');
const memoryFragmentDetailBody = document.querySelector('[data-memory-fragment-detail-body]');
const memoryFragmentDetailCloseButton = document.querySelector('[data-memory-fragment-detail-close]');
const veilwalkerNotesState = document.querySelector('[data-veilwalker-notes-state]');
const veilwalkerNotesTableWrap = document.querySelector('[data-veilwalker-notes-table-wrap]');
const veilwalkerNotesTableBody = document.querySelector('[data-veilwalker-notes-table-body]');
const veilwalkerNoteDetail = document.querySelector('[data-veilwalker-note-detail]');
const veilwalkerNoteDetailTitle = document.querySelector('[data-veilwalker-note-detail-title]');
const veilwalkerNoteDetailMeta = document.querySelector('[data-veilwalker-note-detail-meta]');
const veilwalkerNoteDetailFields = document.querySelector('[data-veilwalker-note-detail-fields]');
const veilwalkerNoteDetailBody = document.querySelector('[data-veilwalker-note-detail-body]');
const veilwalkerNoteDetailCloseButton = document.querySelector('[data-veilwalker-note-detail-close]');
const veilwalkersState = document.querySelector('[data-veilwalkers-state]');
const veilwalkersTableWrap = document.querySelector('[data-veilwalkers-table-wrap]');
const veilwalkersTableBody = document.querySelector('[data-veilwalkers-table-body]');
const veilwalkerDetail = document.querySelector('[data-veilwalker-detail]');
const veilwalkerDetailTitle = document.querySelector('[data-veilwalker-detail-title]');
const veilwalkerDetailMeta = document.querySelector('[data-veilwalker-detail-meta]');
const veilwalkerDetailFields = document.querySelector('[data-veilwalker-detail-fields]');
const veilwalkerDetailImages = document.querySelector('[data-veilwalker-detail-images]');
const veilwalkerDetailBody = document.querySelector('[data-veilwalker-detail-body]');
const veilwalkerDetailCloseButton = document.querySelector('[data-veilwalker-detail-close]');
const appSettingsState = document.querySelector('[data-app-settings-state]');
const appSettingsTableWrap = document.querySelector('[data-app-settings-table-wrap]');
const appSettingsTableBody = document.querySelector('[data-app-settings-table-body]');
const appSettingDetail = document.querySelector('[data-app-setting-detail]');
const appSettingDetailTitle = document.querySelector('[data-app-setting-detail-title]');
const appSettingDetailMeta = document.querySelector('[data-app-setting-detail-meta]');
const appSettingDetailFields = document.querySelector('[data-app-setting-detail-fields]');
const appSettingDetailBody = document.querySelector('[data-app-setting-detail-body]');
const appSettingDetailCloseButton = document.querySelector('[data-app-setting-detail-close]');
const userProgressState = document.querySelector('[data-user-progress-state]');
const userProgressTableWrap = document.querySelector('[data-user-progress-table-wrap]');
const userProgressTableBody = document.querySelector('[data-user-progress-table-body]');
const userProgressDetail = document.querySelector('[data-user-progress-detail]');
const userProgressDetailTitle = document.querySelector('[data-user-progress-detail-title]');
const userProgressDetailMeta = document.querySelector('[data-user-progress-detail-meta]');
const userProgressDetailFields = document.querySelector('[data-user-progress-detail-fields]');
const userProgressDetailGroups = document.querySelector('[data-user-progress-detail-groups]');
const userProgressDetailCloseButton = document.querySelector('[data-user-progress-detail-close]');

const userProgressSummaryTables = [
  'profiles',
  'user_artifacts',
  'user_rooms',
  'user_fragments',
  'user_discoveries',
  'user_readings',
  'user_events',
];

const userProgressSections = [
  {
    title: 'Artifacts unlocked',
    tableName: 'user_artifacts',
    columns: [
      ['Artifact Key', ['artifact_key', 'key']],
      ['Unlock Method', ['unlock_method', 'method']],
      ['Source Location', ['source_location', 'location', 'source']],
      ['Unlocked At', ['unlocked_at', 'created_at']],
    ],
    emptyMessage: 'No artifacts unlocked.',
  },
  {
    title: 'Rooms',
    tableName: 'user_rooms',
    columns: [
      ['Room Key', ['room_key', 'key']],
      ['Status', ['status', 'state']],
      ['Unlock Method', ['unlock_method', 'method']],
      ['Source Location', ['source_location', 'location', 'source']],
      ['Unlocked At', ['unlocked_at', 'created_at']],
      ['Updated At', ['updated_at', 'modified_at']],
    ],
    emptyMessage: 'No room progress recorded.',
  },
  {
    title: 'Fragments',
    tableName: 'user_fragments',
    columns: [
      ['Fragment Key', ['fragment_key', 'key']],
      ['Discovery Method', ['discovery_method', 'method']],
      ['Source Location', ['source_location', 'location', 'source']],
      ['Discovered At', ['discovered_at', 'created_at']],
    ],
    emptyMessage: 'No fragments discovered.',
  },
  {
    title: 'Discoveries',
    tableName: 'user_discoveries',
    columns: [
      ['Discovery Key', ['discovery_key', 'key']],
      ['Discovery Type', ['discovery_type', 'type']],
      ['Source Location', ['source_location', 'location', 'source']],
      ['Mode', ['mode_key', 'mode']],
      ['Discovered At', ['discovered_at', 'created_at']],
    ],
    emptyMessage: 'No discoveries recorded.',
  },
  {
    title: 'Readings',
    tableName: 'user_readings',
    columns: [
      ['Reader Key', ['reader_key', 'veilwalker_key']],
      ['Reader Name', ['reader_name', 'reader']],
      ['Mode', ['mode_key', 'mode']],
      ['Spread Type', ['spread_type', 'spread']],
      ['Card Count', ['card_count', 'cards_count']],
      ['Saved', ['is_saved', 'saved']],
      ['Created At', ['created_at']],
    ],
    emptyMessage: 'No readings recorded.',
  },
  {
    title: 'Events',
    tableName: 'user_events',
    columns: [
      ['Event Type', ['event_type', 'type']],
      ['Event Key', ['event_key', 'key']],
      ['Source Location', ['source_location', 'location', 'source']],
      ['Created At', ['created_at']],
    ],
    emptyMessage: 'No events recorded.',
  },
];

let journalsLoaded = false;
let journalRows = [];
let archiveRoomsLoaded = false;
let archiveRoomRows = [];
let artifactsLoaded = false;
let artifactRows = [];
let memoryFragmentsLoaded = false;
let memoryFragmentRows = [];
let veilwalkerNotesLoaded = false;
let veilwalkerNoteRows = [];
let veilwalkersLoaded = false;
let veilwalkerRows = [];
let appSettingsLoaded = false;
let appSettingRows = [];
let userProgressLoaded = false;
let profileRows = [];

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

function formatJsonValue(value, fallback = '--') {
  if (typeof value === 'undefined' || value === null || value === '') {
    return fallback;
  }

  try {
    if (typeof value === 'string') {
      return JSON.stringify(JSON.parse(value), null, 2);
    }

    return JSON.stringify(value, null, 2);
  } catch {
    return formatValue(value, fallback);
  }
}

function formatCompactValue(value, fallback = '--') {
  const formattedValue = formatValue(value, fallback);

  if (formattedValue === fallback) {
    return formattedValue;
  }

  const compactValue = formattedValue.replace(/\s+/g, ' ').trim();
  return compactValue.length > 82 ? `${compactValue.slice(0, 79)}...` : compactValue;
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

function getJournalSlug(row) {
  return formatValue(getFirstValue(row, ['slug']));
}

function getJournalKey(row) {
  return formatValue(getFirstValue(row, ['journal_key', 'key', 'id']));
}

function getJournalType(row) {
  return formatValue(getFirstValue(row, ['entry_type', 'type']));
}

function getJournalPublishedState(row) {
  const publishedValue = getFirstValue(row, ['is_published', 'published', 'published_at', 'status', 'state', 'visibility']);

  if (typeof publishedValue === 'boolean') {
    return publishedValue ? 'Yes' : 'No';
  }

  if (publishedValue) {
    return formatValue(publishedValue);
  }

  return '--';
}

function getJournalMode(row) {
  return formatValue(getFirstValue(row, ['mode_key', 'mode', 'site_mode', 'event_mode', 'collection_mode']));
}

function getJournalBody(row) {
  return formatValue(
    getFirstValue(row, ['body', 'content', 'text', 'entry', 'description', 'summary']),
    'No body/content field available for this journal.',
  );
}

function getArchiveRoomTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name']), 'Untitled room');
}

function getArchiveRoomKey(row) {
  return formatValue(getFirstValue(row, ['room_key', 'key', 'slug', 'id']));
}

function getArchiveRoomMode(row) {
  return formatValue(getFirstValue(row, ['mode_key', 'mode', 'site_mode', 'event_mode']));
}

function getArchiveRoomType(row) {
  return formatValue(getFirstValue(row, ['archive_type', 'type', 'room_type']));
}

function getArchiveRoomStatus(row) {
  return formatValue(getFirstValue(row, ['status', 'state', 'visibility']));
}

function getArchiveRoomActiveState(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue ? 'Yes' : 'No';
  }

  return formatValue(activeValue);
}

function getArchiveRoomDescription(row) {
  return formatValue(
    getFirstValue(row, ['description', 'summary', 'body', 'content']),
    'No description field available for this archive room.',
  );
}

function getArchiveRoomImageUrl(row) {
  return formatValue(getFirstValue(row, ['image_url', 'image', 'hero_image_url', 'thumbnail_url']));
}

function getArchiveRoomSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order', 'display_order', 'order']));
}

function getArtifactTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name']), 'Untitled artifact');
}

function getArtifactKey(row) {
  return formatValue(getFirstValue(row, ['artifact_key', 'key', 'slug', 'id']));
}

function getArtifactElement(row) {
  return formatValue(getFirstValue(row, ['element', 'element_key', 'suit']));
}

function getArtifactType(row) {
  return formatValue(getFirstValue(row, ['artifact_type', 'type', 'category']));
}

function getArtifactDescription(row) {
  return formatValue(
    getFirstValue(row, ['description', 'summary', 'body', 'content']),
    'No description field available for this artifact.',
  );
}

function getArtifactUnlockMethod(row) {
  return formatValue(getFirstValue(row, ['unlock_method', 'unlock', 'unlock_condition']));
}

function getArtifactSourceLocation(row) {
  return formatValue(getFirstValue(row, ['source_location', 'location', 'source']));
}

function getArtifactImageUrl(row) {
  return formatValue(getFirstValue(row, ['image_url', 'image', 'thumbnail_url']));
}

function getArtifactActiveState(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue ? 'Yes' : 'No';
  }

  return formatValue(activeValue);
}

function getMemoryFragmentTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name']), 'Untitled fragment');
}

function getMemoryFragmentKey(row) {
  return formatValue(getFirstValue(row, ['fragment_key', 'key', 'slug', 'id']));
}

function getMemoryFragmentType(row) {
  return formatValue(getFirstValue(row, ['fragment_type', 'type', 'category']));
}

function getMemoryFragmentSequence(row) {
  return formatValue(getFirstValue(row, ['sequence_number', 'sequence', 'sort_order', 'order']));
}

function getMemoryFragmentRoomKey(row) {
  return formatValue(getFirstValue(row, ['related_room_key', 'room_key', 'archive_room_key']));
}

function getMemoryFragmentArtifactKey(row) {
  return formatValue(getFirstValue(row, ['related_artifact_key', 'artifact_key']));
}

function getMemoryFragmentDescription(row) {
  return formatValue(
    getFirstValue(row, ['body', 'description', 'content', 'summary']),
    'No description/body field available for this memory fragment.',
  );
}

function getMemoryFragmentImageUrl(row) {
  return formatValue(getFirstValue(row, ['image_url', 'image', 'thumbnail_url']));
}

function getMemoryFragmentActiveState(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue ? 'Yes' : 'No';
  }

  return formatValue(activeValue);
}

function getVeilwalkerNoteTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name', 'heading']), 'Untitled note');
}

function getVeilwalkerNoteKey(row) {
  return formatValue(getFirstValue(row, ['note_key', 'key', 'slug', 'id']));
}

function getVeilwalkerNoteVeilwalkerKey(row) {
  return formatValue(getFirstValue(row, ['veilwalker_key', 'reader_key', 'character_key']));
}

function getVeilwalkerNoteType(row) {
  return formatValue(getFirstValue(row, ['note_type', 'type', 'category']));
}

function getVeilwalkerNoteMode(row) {
  return formatValue(getFirstValue(row, ['mode_key', 'mode', 'site_mode', 'event_mode']));
}

function getVeilwalkerNoteSourceLocation(row) {
  return formatValue(getFirstValue(row, ['source_location', 'location', 'source']));
}

function getVeilwalkerNoteBody(row) {
  return formatValue(
    getFirstValue(row, ['body', 'content', 'text', 'description', 'summary']),
    'No body/content field available for this veilwalker note.',
  );
}

function getBooleanState(row, fieldNames) {
  const value = getFirstValue(row, fieldNames);

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return formatValue(value);
}

function getVeilwalkerNoteHiddenState(row) {
  return getBooleanState(row, ['is_hidden', 'hidden']);
}

function getVeilwalkerNoteActiveState(row) {
  return getBooleanState(row, ['is_active', 'active', 'enabled']);
}

function getVeilwalkerName(row) {
  return formatValue(getFirstValue(row, ['name', 'title']), 'Unnamed veilwalker');
}

function getVeilwalkerKey(row) {
  return formatValue(getFirstValue(row, ['veilwalker_key', 'reader_key', 'key', 'slug', 'id']));
}

function getVeilwalkerZodiac(row) {
  return formatValue(getFirstValue(row, ['zodiac', 'sign']));
}

function getVeilwalkerElement(row) {
  return formatValue(getFirstValue(row, ['element', 'element_key', 'suit']));
}

function getVeilwalkerTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'role']));
}

function getVeilwalkerTagline(row) {
  return formatValue(getFirstValue(row, ['tagline', 'subtitle']));
}

function getVeilwalkerFocus(row) {
  return formatValue(getFirstValue(row, ['focus', 'specialty']));
}

function getVeilwalkerTraits(row) {
  return formatValue(getFirstValue(row, ['traits', 'trait_list']));
}

function getVeilwalkerDescription(row) {
  return formatValue(
    getFirstValue(row, ['description', 'lore', 'body', 'content', 'summary']),
    'No description/lore field available for this veilwalker.',
  );
}

function getVeilwalkerMode(row) {
  return formatValue(getFirstValue(row, ['mode_key', 'mode', 'site_mode', 'event_mode']));
}

function getVeilwalkerAccentClass(row) {
  return formatValue(getFirstValue(row, ['accent_class', 'accent']));
}

function getVeilwalkerActiveState(row) {
  return getBooleanState(row, ['is_active', 'active', 'enabled']);
}

function getVeilwalkerSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order', 'display_order', 'order']));
}

function getVeilwalkerImageValue(row, fieldName) {
  return formatValue(getFirstValue(row, [fieldName]));
}

function getAppSettingKey(row) {
  return formatValue(getFirstValue(row, ['setting_key', 'key', 'name', 'id']));
}

function getAppSettingValue(row) {
  return getFirstValue(row, ['setting_value', 'value']);
}

function getAppSettingDescription(row) {
  return formatValue(getFirstValue(row, ['description', 'summary', 'notes']));
}

function getAppSettingPublicState(row) {
  return getBooleanState(row, ['is_public', 'public']);
}

function getAppSettingActiveState(row) {
  return getBooleanState(row, ['is_active', 'active', 'enabled']);
}

function getProfileId(row) {
  return getFirstValue(row, ['id', 'user_id', 'profile_id']);
}

function getProfileDisplayName(row) {
  return formatValue(getFirstValue(row, ['display_name', 'username', 'name', 'email']), 'Unnamed user');
}

function getProfileRole(row) {
  return formatValue(getFirstValue(row, ['role', 'account_role']));
}

function getProfileAvatarUrl(row) {
  return formatValue(getFirstValue(row, ['avatar_url', 'avatar', 'image_url']));
}

function getTruncatedId(value) {
  const formattedValue = formatValue(value);

  if (formattedValue === '--') {
    return formattedValue;
  }

  return formattedValue.length > 14 ? `${formattedValue.slice(0, 8)}...${formattedValue.slice(-4)}` : formattedValue;
}

function setJournalsState(message, state = '') {
  journalsState.textContent = message;
  journalsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  journalsState.hidden = false;
}

function setArchiveRoomsState(message, state = '') {
  archiveRoomsState.textContent = message;
  archiveRoomsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  archiveRoomsState.hidden = false;
}

function setArtifactsState(message, state = '') {
  artifactsState.textContent = message;
  artifactsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  artifactsState.hidden = false;
}

function setMemoryFragmentsState(message, state = '') {
  memoryFragmentsState.textContent = message;
  memoryFragmentsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  memoryFragmentsState.hidden = false;
}

function setVeilwalkerNotesState(message, state = '') {
  veilwalkerNotesState.textContent = message;
  veilwalkerNotesState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  veilwalkerNotesState.hidden = false;
}

function setVeilwalkersState(message, state = '') {
  veilwalkersState.textContent = message;
  veilwalkersState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  veilwalkersState.hidden = false;
}

function setAppSettingsState(message, state = '') {
  appSettingsState.textContent = message;
  appSettingsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  appSettingsState.hidden = false;
}

function setUserProgressState(message, state = '') {
  userProgressState.textContent = message;
  userProgressState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  userProgressState.hidden = false;
}

function hideJournalDetail() {
  journalDetail.hidden = true;
}

function hideArchiveRoomDetail() {
  archiveRoomDetail.hidden = true;
}

function hideArtifactDetail() {
  artifactDetail.hidden = true;
}

function hideMemoryFragmentDetail() {
  memoryFragmentDetail.hidden = true;
}

function hideVeilwalkerNoteDetail() {
  veilwalkerNoteDetail.hidden = true;
}

function hideVeilwalkerDetail() {
  veilwalkerDetail.hidden = true;
}

function hideAppSettingDetail() {
  appSettingDetail.hidden = true;
}

function hideUserProgressDetail() {
  userProgressDetail.hidden = true;
}

function appendTextCell(rowElement, label, value, className = '') {
  const cell = document.createElement('td');
  cell.textContent = value;
  cell.dataset.label = label;

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

    appendTextCell(tableRow, 'Title', getJournalTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Slug', getJournalSlug(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Journal Key', getJournalKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Type', getJournalType(row));
    appendTextCell(tableRow, 'Mode', getJournalMode(row));
    appendTextCell(tableRow, 'Published', getJournalPublishedState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View';
    actionButton.addEventListener('click', () => showJournalDetail(index));
    actionCell.dataset.label = 'Action';
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    journalsTableBody.append(tableRow);
  });
}

function appendDetailField(container, label, value) {
  const field = document.createElement('p');
  const labelElement = document.createElement('span');
  const valueElement = document.createElement('span');

  field.className = 'admin-detail-field';
  labelElement.textContent = label;
  valueElement.textContent = value;
  field.append(labelElement, valueElement);
  container.append(field);
}

function appendDetailChip(container, label, value) {
  if (!value || value === '--') {
    return;
  }

  const chip = document.createElement('span');
  chip.className = 'admin-detail-chip';
  chip.textContent = `${label}: ${value}`;
  container.append(chip);
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

  appendDetailChip(journalDetailMeta, 'Published', getJournalPublishedState(row));
  appendDetailChip(journalDetailMeta, 'Type', getJournalType(row));
  appendDetailChip(journalDetailMeta, 'Mode', getJournalMode(row));
  appendDetailChip(journalDetailMeta, 'Slug', getJournalSlug(row));
  appendDetailChip(journalDetailMeta, 'Key', getJournalKey(row));
  appendDetailField(journalDetailFields, 'Slug', getJournalSlug(row));
  appendDetailField(journalDetailFields, 'Journal Key', getJournalKey(row));
  appendDetailField(journalDetailFields, 'Type', getJournalType(row));
  appendDetailField(journalDetailFields, 'Mode', getJournalMode(row));
  appendDetailField(journalDetailFields, 'Published', getJournalPublishedState(row));
  appendDetailField(journalDetailFields, 'Source', formatValue(getFirstValue(row, ['source', 'origin', 'author'])));
  appendDetailField(journalDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(journalDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(journalDetailFields, 'Metadata', formatValue(getFirstValue(row, ['metadata', 'meta', 'settings'])));

  journalDetail.hidden = false;
  journalDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderArchiveRoomRows(rows) {
  archiveRoomsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, 'Room Key', getArchiveRoomKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Title', getArchiveRoomTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Mode', getArchiveRoomMode(row));
    appendTextCell(tableRow, 'Archive Type', getArchiveRoomType(row));
    appendTextCell(tableRow, 'Status', getArchiveRoomStatus(row));
    appendTextCell(tableRow, 'Active', getArchiveRoomActiveState(row));
    appendTextCell(tableRow, 'Sort', getArchiveRoomSortOrder(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View';
    actionButton.addEventListener('click', () => showArchiveRoomDetail(index));
    actionCell.dataset.label = 'Action';
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    archiveRoomsTableBody.append(tableRow);
  });
}

function showArchiveRoomDetail(index) {
  const row = archiveRoomRows[index];

  if (!row) {
    return;
  }

  archiveRoomDetailTitle.textContent = getArchiveRoomTitle(row);
  archiveRoomDetailMeta.replaceChildren();
  archiveRoomDetailFields.replaceChildren();
  archiveRoomDetailBody.textContent = getArchiveRoomDescription(row);

  appendDetailChip(archiveRoomDetailMeta, 'Status', getArchiveRoomStatus(row));
  appendDetailChip(archiveRoomDetailMeta, 'Mode', getArchiveRoomMode(row));
  appendDetailChip(archiveRoomDetailMeta, 'Type', getArchiveRoomType(row));
  appendDetailChip(archiveRoomDetailMeta, 'Room Key', getArchiveRoomKey(row));
  appendDetailField(archiveRoomDetailFields, 'Room Key', getArchiveRoomKey(row));
  appendDetailField(archiveRoomDetailFields, 'Name', formatValue(getFirstValue(row, ['name'])));
  appendDetailField(archiveRoomDetailFields, 'Mode', getArchiveRoomMode(row));
  appendDetailField(archiveRoomDetailFields, 'Archive Type', getArchiveRoomType(row));
  appendDetailField(archiveRoomDetailFields, 'Status', getArchiveRoomStatus(row));
  appendDetailField(archiveRoomDetailFields, 'Active', getArchiveRoomActiveState(row));
  appendDetailField(archiveRoomDetailFields, 'Image URL', getArchiveRoomImageUrl(row));
  appendDetailField(archiveRoomDetailFields, 'Sort Order', getArchiveRoomSortOrder(row));
  appendDetailField(archiveRoomDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(archiveRoomDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(archiveRoomDetailFields, 'Metadata', formatValue(getFirstValue(row, ['metadata', 'meta', 'settings'])));

  archiveRoomDetail.hidden = false;
  archiveRoomDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderArtifactRows(rows) {
  artifactsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, 'Artifact Key', getArtifactKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Title', getArtifactTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Element', getArtifactElement(row));
    appendTextCell(tableRow, 'Type', getArtifactType(row));
    appendTextCell(tableRow, 'Unlock', getArtifactUnlockMethod(row));
    appendTextCell(tableRow, 'Source', getArtifactSourceLocation(row));
    appendTextCell(tableRow, 'Active', getArtifactActiveState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View';
    actionButton.addEventListener('click', () => showArtifactDetail(index));
    actionCell.dataset.label = 'Action';
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    artifactsTableBody.append(tableRow);
  });
}

function showArtifactDetail(index) {
  const row = artifactRows[index];

  if (!row) {
    return;
  }

  artifactDetailTitle.textContent = getArtifactTitle(row);
  artifactDetailMeta.replaceChildren();
  artifactDetailFields.replaceChildren();
  artifactDetailBody.textContent = getArtifactDescription(row);

  appendDetailChip(artifactDetailMeta, 'Element', getArtifactElement(row));
  appendDetailChip(artifactDetailMeta, 'Type', getArtifactType(row));
  appendDetailChip(artifactDetailMeta, 'Artifact Key', getArtifactKey(row));
  appendDetailChip(artifactDetailMeta, 'Active', getArtifactActiveState(row));
  appendDetailField(artifactDetailFields, 'Artifact Key', getArtifactKey(row));
  appendDetailField(artifactDetailFields, 'Name', formatValue(getFirstValue(row, ['name'])));
  appendDetailField(artifactDetailFields, 'Element', getArtifactElement(row));
  appendDetailField(artifactDetailFields, 'Artifact Type', getArtifactType(row));
  appendDetailField(artifactDetailFields, 'Unlock Method', getArtifactUnlockMethod(row));
  appendDetailField(artifactDetailFields, 'Source Location', getArtifactSourceLocation(row));
  appendDetailField(artifactDetailFields, 'Image URL', getArtifactImageUrl(row));
  appendDetailField(artifactDetailFields, 'Active', getArtifactActiveState(row));
  appendDetailField(artifactDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(artifactDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(artifactDetailFields, 'Metadata', formatValue(getFirstValue(row, ['metadata', 'meta', 'settings'])));

  artifactDetail.hidden = false;
  artifactDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderMemoryFragmentRows(rows) {
  memoryFragmentsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, 'Fragment Key', getMemoryFragmentKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Title', getMemoryFragmentTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Type', getMemoryFragmentType(row));
    appendTextCell(tableRow, 'Sequence', getMemoryFragmentSequence(row));
    appendTextCell(tableRow, 'Room', getMemoryFragmentRoomKey(row));
    appendTextCell(tableRow, 'Artifact', getMemoryFragmentArtifactKey(row));
    appendTextCell(tableRow, 'Active', getMemoryFragmentActiveState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View';
    actionButton.addEventListener('click', () => showMemoryFragmentDetail(index));
    actionCell.dataset.label = 'Action';
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    memoryFragmentsTableBody.append(tableRow);
  });
}

function showMemoryFragmentDetail(index) {
  const row = memoryFragmentRows[index];

  if (!row) {
    return;
  }

  memoryFragmentDetailTitle.textContent = getMemoryFragmentTitle(row);
  memoryFragmentDetailMeta.replaceChildren();
  memoryFragmentDetailFields.replaceChildren();
  memoryFragmentDetailBody.textContent = getMemoryFragmentDescription(row);

  appendDetailChip(memoryFragmentDetailMeta, 'Type', getMemoryFragmentType(row));
  appendDetailChip(memoryFragmentDetailMeta, 'Sequence', getMemoryFragmentSequence(row));
  appendDetailChip(memoryFragmentDetailMeta, 'Fragment Key', getMemoryFragmentKey(row));
  appendDetailChip(memoryFragmentDetailMeta, 'Active', getMemoryFragmentActiveState(row));
  appendDetailField(memoryFragmentDetailFields, 'Fragment Key', getMemoryFragmentKey(row));
  appendDetailField(memoryFragmentDetailFields, 'Name', formatValue(getFirstValue(row, ['name'])));
  appendDetailField(memoryFragmentDetailFields, 'Fragment Type', getMemoryFragmentType(row));
  appendDetailField(memoryFragmentDetailFields, 'Sequence Number', getMemoryFragmentSequence(row));
  appendDetailField(memoryFragmentDetailFields, 'Related Room Key', getMemoryFragmentRoomKey(row));
  appendDetailField(memoryFragmentDetailFields, 'Related Artifact Key', getMemoryFragmentArtifactKey(row));
  appendDetailField(memoryFragmentDetailFields, 'Image URL', getMemoryFragmentImageUrl(row));
  appendDetailField(memoryFragmentDetailFields, 'Active', getMemoryFragmentActiveState(row));
  appendDetailField(memoryFragmentDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(memoryFragmentDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(memoryFragmentDetailFields, 'Metadata', formatValue(getFirstValue(row, ['metadata', 'meta', 'settings'])));

  memoryFragmentDetail.hidden = false;
  memoryFragmentDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderVeilwalkerNoteRows(rows) {
  veilwalkerNotesTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, 'Note Key', getVeilwalkerNoteKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Title', getVeilwalkerNoteTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Veilwalker', getVeilwalkerNoteVeilwalkerKey(row));
    appendTextCell(tableRow, 'Type', getVeilwalkerNoteType(row));
    appendTextCell(tableRow, 'Mode', getVeilwalkerNoteMode(row));
    appendTextCell(tableRow, 'Hidden', getVeilwalkerNoteHiddenState(row));
    appendTextCell(tableRow, 'Active', getVeilwalkerNoteActiveState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View';
    actionButton.addEventListener('click', () => showVeilwalkerNoteDetail(index));
    actionCell.dataset.label = 'Action';
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    veilwalkerNotesTableBody.append(tableRow);
  });
}

function showVeilwalkerNoteDetail(index) {
  const row = veilwalkerNoteRows[index];

  if (!row) {
    return;
  }

  veilwalkerNoteDetailTitle.textContent = getVeilwalkerNoteTitle(row);
  veilwalkerNoteDetailMeta.replaceChildren();
  veilwalkerNoteDetailFields.replaceChildren();
  veilwalkerNoteDetailBody.textContent = getVeilwalkerNoteBody(row);

  appendDetailChip(veilwalkerNoteDetailMeta, 'Type', getVeilwalkerNoteType(row));
  appendDetailChip(veilwalkerNoteDetailMeta, 'Mode', getVeilwalkerNoteMode(row));
  appendDetailChip(veilwalkerNoteDetailMeta, 'Note Key', getVeilwalkerNoteKey(row));
  appendDetailChip(veilwalkerNoteDetailMeta, 'Veilwalker', getVeilwalkerNoteVeilwalkerKey(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Note Key', getVeilwalkerNoteKey(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Veilwalker Key', getVeilwalkerNoteVeilwalkerKey(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Note Type', getVeilwalkerNoteType(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Mode', getVeilwalkerNoteMode(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Source Location', getVeilwalkerNoteSourceLocation(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Hidden', getVeilwalkerNoteHiddenState(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Active', getVeilwalkerNoteActiveState(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(veilwalkerNoteDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(veilwalkerNoteDetailFields, 'Metadata', formatValue(getFirstValue(row, ['metadata', 'meta', 'settings'])));

  veilwalkerNoteDetail.hidden = false;
  veilwalkerNoteDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderVeilwalkerRows(rows) {
  veilwalkersTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, 'Key', getVeilwalkerKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Name', getVeilwalkerName(row), 'admin-table__title');
    appendTextCell(tableRow, 'Zodiac', getVeilwalkerZodiac(row));
    appendTextCell(tableRow, 'Element', getVeilwalkerElement(row));
    appendTextCell(tableRow, 'Title', getVeilwalkerTitle(row));
    appendTextCell(tableRow, 'Mode', getVeilwalkerMode(row));
    appendTextCell(tableRow, 'Active', getVeilwalkerActiveState(row));
    appendTextCell(tableRow, 'Sort', getVeilwalkerSortOrder(row));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View';
    actionButton.addEventListener('click', () => showVeilwalkerDetail(index));
    actionCell.dataset.label = 'Action';
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    veilwalkersTableBody.append(tableRow);
  });
}

function appendImagePreview(container, label, value) {
  if (!value || value === '--') {
    return;
  }

  const preview = document.createElement('figure');
  const labelElement = document.createElement('span');
  const image = document.createElement('img');
  const link = document.createElement('a');

  preview.className = 'admin-image-preview';
  labelElement.textContent = label;
  image.src = value;
  image.alt = `${label} preview`;
  image.loading = 'lazy';
  image.addEventListener('error', () => {
    image.hidden = true;
    if (!preview.querySelector('small')) {
      const fallback = document.createElement('small');
      fallback.textContent = 'Image preview unavailable';
      preview.insertBefore(fallback, link);
    }
  });
  link.href = value;
  link.textContent = value;
  link.target = '_blank';
  link.rel = 'noreferrer';

  preview.append(labelElement, image, link);
  container.append(preview);
}

function showVeilwalkerDetail(index) {
  const row = veilwalkerRows[index];

  if (!row) {
    return;
  }

  veilwalkerDetailTitle.textContent = getVeilwalkerName(row);
  veilwalkerDetailMeta.replaceChildren();
  veilwalkerDetailFields.replaceChildren();
  veilwalkerDetailImages.replaceChildren();
  veilwalkerDetailBody.textContent = getVeilwalkerDescription(row);

  appendDetailChip(veilwalkerDetailMeta, 'Zodiac', getVeilwalkerZodiac(row));
  appendDetailChip(veilwalkerDetailMeta, 'Element', getVeilwalkerElement(row));
  appendDetailChip(veilwalkerDetailMeta, 'Key', getVeilwalkerKey(row));
  appendDetailChip(veilwalkerDetailMeta, 'Active', getVeilwalkerActiveState(row));
  appendDetailField(veilwalkerDetailFields, 'Veilwalker Key', getVeilwalkerKey(row));
  appendDetailField(veilwalkerDetailFields, 'Zodiac/Sign', getVeilwalkerZodiac(row));
  appendDetailField(veilwalkerDetailFields, 'Element', getVeilwalkerElement(row));
  appendDetailField(veilwalkerDetailFields, 'Title', getVeilwalkerTitle(row));
  appendDetailField(veilwalkerDetailFields, 'Tagline', getVeilwalkerTagline(row));
  appendDetailField(veilwalkerDetailFields, 'Focus', getVeilwalkerFocus(row));
  appendDetailField(veilwalkerDetailFields, 'Traits', getVeilwalkerTraits(row));
  appendDetailField(veilwalkerDetailFields, 'Mode', getVeilwalkerMode(row));
  appendDetailField(veilwalkerDetailFields, 'Accent Class', getVeilwalkerAccentClass(row));
  appendDetailField(veilwalkerDetailFields, 'Active', getVeilwalkerActiveState(row));
  appendDetailField(veilwalkerDetailFields, 'Sort Order', getVeilwalkerSortOrder(row));
  appendDetailField(veilwalkerDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(veilwalkerDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(veilwalkerDetailFields, 'Metadata', formatValue(getFirstValue(row, ['metadata', 'meta', 'settings'])));

  appendImagePreview(veilwalkerDetailImages, 'Image URL', getVeilwalkerImageValue(row, 'image_url'));
  appendImagePreview(veilwalkerDetailImages, 'Phase 1 Image', getVeilwalkerImageValue(row, 'phase1_image'));
  appendImagePreview(veilwalkerDetailImages, 'Phase 2 Image', getVeilwalkerImageValue(row, 'phase2_image'));
  appendImagePreview(veilwalkerDetailImages, 'Blood Moon Image', getVeilwalkerImageValue(row, 'blood_moon_image'));

  veilwalkerDetail.hidden = false;
  veilwalkerDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderAppSettingRows(rows) {
  appSettingsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, 'Setting Key', getAppSettingKey(row), 'admin-table__title');
    appendTextCell(tableRow, 'Value', formatCompactValue(getAppSettingValue(row)));
    appendTextCell(tableRow, 'Description', getAppSettingDescription(row));
    appendTextCell(tableRow, 'Public', getAppSettingPublicState(row));
    appendTextCell(tableRow, 'Active', getAppSettingActiveState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View';
    actionButton.addEventListener('click', () => showAppSettingDetail(index));
    actionCell.dataset.label = 'Action';
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    appSettingsTableBody.append(tableRow);
  });
}

function showAppSettingDetail(index) {
  const row = appSettingRows[index];

  if (!row) {
    return;
  }

  appSettingDetailTitle.textContent = getAppSettingKey(row);
  appSettingDetailMeta.replaceChildren();
  appSettingDetailFields.replaceChildren();
  appSettingDetailBody.textContent = formatJsonValue(getAppSettingValue(row), 'No setting_value available for this setting.');

  appendDetailChip(appSettingDetailMeta, 'Public', getAppSettingPublicState(row));
  appendDetailChip(appSettingDetailMeta, 'Active', getAppSettingActiveState(row));
  appendDetailField(appSettingDetailFields, 'Setting Key', getAppSettingKey(row));
  appendDetailField(appSettingDetailFields, 'Description', getAppSettingDescription(row));
  appendDetailField(appSettingDetailFields, 'Public', getAppSettingPublicState(row));
  appendDetailField(appSettingDetailFields, 'Active', getAppSettingActiveState(row));
  appendDetailField(appSettingDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(appSettingDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

  appSettingDetail.hidden = false;
  appSettingDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setUserProgressCount(tableName, value) {
  const countElement = document.querySelector(`[data-user-progress-count="${tableName}"]`);

  if (!countElement) {
    return;
  }

  countElement.textContent = value;
}

function renderProfileRows(rows) {
  userProgressTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, 'User', getProfileDisplayName(row), 'admin-table__title');
    appendTextCell(tableRow, 'Role', getProfileRole(row));
    appendTextCell(tableRow, 'Avatar', getProfileAvatarUrl(row), 'admin-table__muted');
    appendTextCell(tableRow, 'User ID', getTruncatedId(getProfileId(row)), 'admin-table__muted');
    appendTextCell(tableRow, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    actionButton.className = 'admin-row-action';
    actionButton.type = 'button';
    actionButton.textContent = 'View Progress';
    actionButton.addEventListener('click', () => {
      showUserProgressDetail(index);
    });
    actionCell.dataset.label = 'Action';
    actionCell.append(actionButton);
    tableRow.append(actionCell);
    userProgressTableBody.append(tableRow);
  });
}

function formatProgressValue(row, fieldNames) {
  const value = getFirstValue(row, fieldNames);
  const firstFieldName = fieldNames[0] || '';

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (firstFieldName.endsWith('_at') || firstFieldName === 'created_at' || firstFieldName === 'updated_at') {
    return formatDate(value);
  }

  return formatValue(value);
}

function renderProgressRows(groupElement, config, rows) {
  const scrollWrap = document.createElement('div');
  const table = document.createElement('table');
  const tableHead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const tableBody = document.createElement('tbody');

  scrollWrap.className = 'admin-progress-table-scroll';
  table.className = 'admin-table';

  config.columns.forEach(([label]) => {
    const heading = document.createElement('th');
    heading.scope = 'col';
    heading.textContent = label;
    headerRow.append(heading);
  });

  rows.forEach((row) => {
    const tableRow = document.createElement('tr');

    config.columns.forEach(([label, fieldNames]) => {
      appendTextCell(tableRow, label, formatProgressValue(row, fieldNames));
    });

    tableBody.append(tableRow);
  });

  tableHead.append(headerRow);
  table.append(tableHead, tableBody);
  scrollWrap.append(table);
  groupElement.append(scrollWrap);
}

function renderProgressGroup(config, result) {
  const group = document.createElement('section');
  const heading = document.createElement('h4');

  group.className = 'admin-progress-group';
  heading.textContent = config.title;
  group.append(heading);

  if (result.error) {
    const state = document.createElement('p');
    state.className = 'admin-progress-group__state';
    state.textContent = `${config.title} could not be loaded.`;
    group.append(state);
    userProgressDetailGroups.append(group);
    return 0;
  }

  if (!result.rows.length) {
    const state = document.createElement('p');
    state.className = 'admin-progress-group__state';
    state.textContent = config.emptyMessage;
    group.append(state);
    userProgressDetailGroups.append(group);
    return 0;
  }

  renderProgressRows(group, config, result.rows);
  userProgressDetailGroups.append(group);
  return result.rows.length;
}

async function fetchUserProgressRows(supabase, tableName, userId) {
  const queryAttempts = ['user_id', 'profile_id'];

  for (const fieldName of queryAttempts) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq(fieldName, userId)
      .limit(100);

    if (!error) {
      return { rows: Array.isArray(data) ? data : [], error: null };
    }
  }

  return { rows: [], error: true };
}

async function showUserProgressDetail(index) {
  const row = profileRows[index];
  const userId = getProfileId(row);

  if (!row || !userId) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return;
  }

  userProgressDetailTitle.textContent = getProfileDisplayName(row);
  userProgressDetailMeta.replaceChildren();
  userProgressDetailFields.replaceChildren();
  userProgressDetailGroups.replaceChildren();

  appendDetailChip(userProgressDetailMeta, 'Role', getProfileRole(row));
  appendDetailChip(userProgressDetailMeta, 'User ID', getTruncatedId(userId));
  appendDetailField(userProgressDetailFields, 'Display Name', getProfileDisplayName(row));
  appendDetailField(userProgressDetailFields, 'Role', getProfileRole(row));
  appendDetailField(userProgressDetailFields, 'Avatar URL', getProfileAvatarUrl(row));
  appendDetailField(userProgressDetailFields, 'User ID', formatValue(userId));
  appendDetailField(userProgressDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(userProgressDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

  const loadingState = document.createElement('p');
  loadingState.className = 'admin-state';
  loadingState.textContent = 'Loading user progress...';
  userProgressDetailGroups.append(loadingState);
  userProgressDetail.hidden = false;
  userProgressDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const progressResults = await Promise.all(
    userProgressSections.map(async (config) => ({
      config,
      result: await fetchUserProgressRows(supabase, config.tableName, userId),
    })),
  );

  userProgressDetailGroups.replaceChildren();

  const totalProgressRows = progressResults.reduce((total, { config, result }) => total + renderProgressGroup(config, result), 0);

  if (!totalProgressRows && progressResults.every(({ result }) => !result.error)) {
    const state = document.createElement('p');
    state.className = 'admin-state';
    state.textContent = 'No progress recorded yet.';
    userProgressDetailGroups.prepend(state);
  }
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

async function loadArchiveRooms() {
  if (archiveRoomsLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setArchiveRoomsState('Archive rooms are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setArchiveRoomsState('Loading archive rooms...');
  archiveRoomsTableWrap.hidden = true;
  hideArchiveRoomDetail();

  const { data, error } = await supabase
    .from('archive_rooms')
    .select('*')
    .limit(100);

  if (error) {
    setArchiveRoomsState('Archive rooms could not be loaded. Please try again later.', 'error');
    return;
  }

  archiveRoomRows = Array.isArray(data) ? data : [];
  archiveRoomsLoaded = true;

  if (!archiveRoomRows.length) {
    setArchiveRoomsState('No archive rooms found.');
    return;
  }

  archiveRoomRows.sort((firstRow, secondRow) => {
    const firstSort = Number(getFirstValue(firstRow, ['sort_order', 'display_order', 'order']));
    const secondSort = Number(getFirstValue(secondRow, ['sort_order', 'display_order', 'order']));

    if (!Number.isNaN(firstSort) && !Number.isNaN(secondSort) && firstSort !== secondSort) {
      return firstSort - secondSort;
    }

    const firstDate = new Date(getFirstValue(firstRow, ['updated_at', 'created_at']) || 0).getTime();
    const secondDate = new Date(getFirstValue(secondRow, ['updated_at', 'created_at']) || 0).getTime();
    return secondDate - firstDate;
  });

  renderArchiveRoomRows(archiveRoomRows);
  archiveRoomsState.hidden = true;
  archiveRoomsTableWrap.hidden = false;
}

async function loadArtifacts() {
  if (artifactsLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setArtifactsState('Artifacts are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setArtifactsState('Loading artifacts...');
  artifactsTableWrap.hidden = true;
  hideArtifactDetail();

  const { data, error } = await supabase
    .from('artifacts')
    .select('*')
    .limit(100);

  if (error) {
    setArtifactsState('Artifacts could not be loaded. Please try again later.', 'error');
    return;
  }

  artifactRows = Array.isArray(data) ? data : [];
  artifactsLoaded = true;

  if (!artifactRows.length) {
    setArtifactsState('No artifacts found.');
    return;
  }

  artifactRows.sort((firstRow, secondRow) => {
    const firstDate = new Date(getFirstValue(firstRow, ['updated_at', 'created_at']) || 0).getTime();
    const secondDate = new Date(getFirstValue(secondRow, ['updated_at', 'created_at']) || 0).getTime();
    return secondDate - firstDate;
  });

  renderArtifactRows(artifactRows);
  artifactsState.hidden = true;
  artifactsTableWrap.hidden = false;
}

async function loadMemoryFragments() {
  if (memoryFragmentsLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setMemoryFragmentsState('Memory fragments are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setMemoryFragmentsState('Loading memory fragments...');
  memoryFragmentsTableWrap.hidden = true;
  hideMemoryFragmentDetail();

  const { data, error } = await supabase
    .from('memory_fragments')
    .select('*')
    .limit(100);

  if (error) {
    setMemoryFragmentsState('Memory fragments could not be loaded. Please try again later.', 'error');
    return;
  }

  memoryFragmentRows = Array.isArray(data) ? data : [];
  memoryFragmentsLoaded = true;

  if (!memoryFragmentRows.length) {
    setMemoryFragmentsState('No memory fragments found.');
    return;
  }

  memoryFragmentRows.sort((firstRow, secondRow) => {
    const firstSequence = Number(getFirstValue(firstRow, ['sequence_number', 'sequence', 'sort_order', 'order']));
    const secondSequence = Number(getFirstValue(secondRow, ['sequence_number', 'sequence', 'sort_order', 'order']));

    if (!Number.isNaN(firstSequence) && !Number.isNaN(secondSequence) && firstSequence !== secondSequence) {
      return firstSequence - secondSequence;
    }

    const firstDate = new Date(getFirstValue(firstRow, ['updated_at', 'created_at']) || 0).getTime();
    const secondDate = new Date(getFirstValue(secondRow, ['updated_at', 'created_at']) || 0).getTime();
    return secondDate - firstDate;
  });

  renderMemoryFragmentRows(memoryFragmentRows);
  memoryFragmentsState.hidden = true;
  memoryFragmentsTableWrap.hidden = false;
}

async function loadVeilwalkerNotes() {
  if (veilwalkerNotesLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setVeilwalkerNotesState('Veilwalker notes are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setVeilwalkerNotesState('Loading veilwalker notes...');
  veilwalkerNotesTableWrap.hidden = true;
  hideVeilwalkerNoteDetail();

  const { data, error } = await supabase
    .from('veilwalker_notes')
    .select('*')
    .limit(100);

  if (error) {
    setVeilwalkerNotesState('Veilwalker notes could not be loaded. Please try again later.', 'error');
    return;
  }

  veilwalkerNoteRows = Array.isArray(data) ? data : [];
  veilwalkerNotesLoaded = true;

  if (!veilwalkerNoteRows.length) {
    setVeilwalkerNotesState('No veilwalker notes found.');
    return;
  }

  veilwalkerNoteRows.sort((firstRow, secondRow) => {
    const firstDate = new Date(getFirstValue(firstRow, ['updated_at', 'created_at']) || 0).getTime();
    const secondDate = new Date(getFirstValue(secondRow, ['updated_at', 'created_at']) || 0).getTime();
    return secondDate - firstDate;
  });

  renderVeilwalkerNoteRows(veilwalkerNoteRows);
  veilwalkerNotesState.hidden = true;
  veilwalkerNotesTableWrap.hidden = false;
}

async function loadVeilwalkers() {
  if (veilwalkersLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setVeilwalkersState('Veilwalkers are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setVeilwalkersState('Loading veilwalkers...');
  veilwalkersTableWrap.hidden = true;
  hideVeilwalkerDetail();

  const { data, error } = await supabase
    .from('veilwalkers')
    .select('*')
    .limit(100);

  if (error) {
    setVeilwalkersState('Veilwalkers could not be loaded. Please try again later.', 'error');
    return;
  }

  veilwalkerRows = Array.isArray(data) ? data : [];
  veilwalkersLoaded = true;

  if (!veilwalkerRows.length) {
    setVeilwalkersState('No veilwalkers found.');
    return;
  }

  veilwalkerRows.sort((firstRow, secondRow) => {
    const firstSort = Number(getFirstValue(firstRow, ['sort_order', 'display_order', 'order']));
    const secondSort = Number(getFirstValue(secondRow, ['sort_order', 'display_order', 'order']));

    if (!Number.isNaN(firstSort) && !Number.isNaN(secondSort) && firstSort !== secondSort) {
      return firstSort - secondSort;
    }

    const firstName = getVeilwalkerName(firstRow);
    const secondName = getVeilwalkerName(secondRow);
    return firstName.localeCompare(secondName);
  });

  renderVeilwalkerRows(veilwalkerRows);
  veilwalkersState.hidden = true;
  veilwalkersTableWrap.hidden = false;
}

async function loadAppSettings() {
  if (appSettingsLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setAppSettingsState('App settings are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setAppSettingsState('Loading app settings...');
  appSettingsTableWrap.hidden = true;
  hideAppSettingDetail();

  const { data, error } = await supabase
    .from('app_settings')
    .select('*')
    .limit(100);

  if (error) {
    setAppSettingsState('App settings could not be loaded. Please try again later.', 'error');
    return;
  }

  appSettingRows = Array.isArray(data) ? data : [];
  appSettingsLoaded = true;

  if (!appSettingRows.length) {
    setAppSettingsState('No app settings found.');
    return;
  }

  appSettingRows.sort((firstRow, secondRow) => {
    const firstKey = getAppSettingKey(firstRow);
    const secondKey = getAppSettingKey(secondRow);
    return firstKey.localeCompare(secondKey);
  });

  renderAppSettingRows(appSettingRows);
  appSettingsState.hidden = true;
  appSettingsTableWrap.hidden = false;
}

async function loadUserProgressSummary() {
  const summaryResults = await Promise.all(
    userProgressSummaryTables.map(async (tableName) => ({
      tableName,
      count: await fetchTableCount(tableName),
    })),
  );

  summaryResults.forEach(({ tableName, count }) => {
    setUserProgressCount(tableName, count);
  });
}

async function loadUserProgress() {
  if (userProgressLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setUserProgressState('User progress is unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setUserProgressState('Loading user profiles...');
  userProgressTableWrap.hidden = true;
  hideUserProgressDetail();
  loadUserProgressSummary();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(100);

  if (error) {
    setUserProgressState('User profiles could not be loaded. Please try again later.', 'error');
    return;
  }

  profileRows = Array.isArray(data) ? data : [];
  userProgressLoaded = true;

  if (!profileRows.length) {
    setUserProgressState('No users found.');
    return;
  }

  profileRows.sort((firstRow, secondRow) => {
    const firstDate = new Date(getFirstValue(firstRow, ['updated_at', 'created_at']) || 0).getTime();
    const secondDate = new Date(getFirstValue(secondRow, ['updated_at', 'created_at']) || 0).getTime();

    if (firstDate !== secondDate) {
      return secondDate - firstDate;
    }

    return getProfileDisplayName(firstRow).localeCompare(getProfileDisplayName(secondRow));
  });

  renderProfileRows(profileRows);
  userProgressState.hidden = true;
  userProgressTableWrap.hidden = false;
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
  const availableViews = ['overview', 'journals', 'archive-rooms', 'artifacts', 'memory-fragments', 'veilwalkers', 'veilwalker-notes', 'user-progress', 'app-settings'];
  const normalizedViewName = availableViews.includes(viewName) ? viewName : 'overview';

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

  if (normalizedViewName === 'archive-rooms') {
    loadArchiveRooms();
  }

  if (normalizedViewName === 'artifacts') {
    loadArtifacts();
  }

  if (normalizedViewName === 'memory-fragments') {
    loadMemoryFragments();
  }

  if (normalizedViewName === 'veilwalkers') {
    loadVeilwalkers();
  }

  if (normalizedViewName === 'veilwalker-notes') {
    loadVeilwalkerNotes();
  }

  if (normalizedViewName === 'user-progress') {
    loadUserProgress();
  }

  if (normalizedViewName === 'app-settings') {
    loadAppSettings();
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
  archiveRoomDetailCloseButton.addEventListener('click', hideArchiveRoomDetail);
  artifactDetailCloseButton.addEventListener('click', hideArtifactDetail);
  memoryFragmentDetailCloseButton.addEventListener('click', hideMemoryFragmentDetail);
  veilwalkerDetailCloseButton.addEventListener('click', hideVeilwalkerDetail);
  veilwalkerNoteDetailCloseButton.addEventListener('click', hideVeilwalkerNoteDetail);
  userProgressDetailCloseButton.addEventListener('click', hideUserProgressDetail);
  appSettingDetailCloseButton.addEventListener('click', hideAppSettingDetail);
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
