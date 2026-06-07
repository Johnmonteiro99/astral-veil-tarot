import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';
import { requireAdmin, signOut } from '../services/auth.js';

const countTables = [
  'journals',
  'journal_prompts',
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
const journalNewButton = document.querySelector('[data-journal-new]');
const journalFormPanel = document.querySelector('[data-journal-form-panel]');
const journalForm = document.querySelector('[data-journal-form]');
const journalFormTitle = document.querySelector('[data-journal-form-title]');
const journalFormState = document.querySelector('[data-journal-form-state]');
const journalFormSubmitButton = document.querySelector('[data-journal-form-submit]');
const journalFormCancelButtons = document.querySelectorAll('[data-journal-form-cancel], [data-journal-form-cancel-secondary]');
const journalPromptsState = document.querySelector('[data-journal-prompts-state]');
const journalPromptsTableWrap = document.querySelector('[data-journal-prompts-table-wrap]');
const journalPromptsTableBody = document.querySelector('[data-journal-prompts-table-body]');
const journalPromptsPagination = document.querySelector('[data-journal-prompts-pagination]');
const journalPromptsPaginationSummary = document.querySelector('[data-journal-prompts-pagination-summary]');
const journalPromptsPaginationControls = document.querySelector('[data-journal-prompts-pagination-controls]');
const journalPromptsPageSizeSelect = document.querySelector('[data-journal-prompts-page-size]');
const journalPromptNewButton = document.querySelector('[data-journal-prompt-new]');
const journalPromptFormPanel = document.querySelector('[data-journal-prompt-form-panel]');
const journalPromptForm = document.querySelector('[data-journal-prompt-form]');
const journalPromptFormTitle = document.querySelector('[data-journal-prompt-form-title]');
const journalPromptFormState = document.querySelector('[data-journal-prompt-form-state]');
const journalPromptFormSubmitButton = document.querySelector('[data-journal-prompt-form-submit]');
const journalPromptFormCancelButtons = document.querySelectorAll('[data-journal-prompt-form-cancel], [data-journal-prompt-form-cancel-secondary]');
const journalPromptFilters = Array.from(document.querySelectorAll('[data-journal-prompt-filter]'));
const archiveRoomsState = document.querySelector('[data-archive-rooms-state]');
const archiveRoomsTableWrap = document.querySelector('[data-archive-rooms-table-wrap]');
const archiveRoomsTableBody = document.querySelector('[data-archive-rooms-table-body]');
const archiveRoomDetail = document.querySelector('[data-archive-room-detail]');
const archiveRoomDetailTitle = document.querySelector('[data-archive-room-detail-title]');
const archiveRoomDetailMeta = document.querySelector('[data-archive-room-detail-meta]');
const archiveRoomDetailFields = document.querySelector('[data-archive-room-detail-fields]');
const archiveRoomDetailBody = document.querySelector('[data-archive-room-detail-body]');
const archiveRoomDetailCloseButton = document.querySelector('[data-archive-room-detail-close]');
const archiveRoomNewButton = document.querySelector('[data-archive-room-new]');
const archiveRoomFormPanel = document.querySelector('[data-archive-room-form-panel]');
const archiveRoomForm = document.querySelector('[data-archive-room-form]');
const archiveRoomFormTitle = document.querySelector('[data-archive-room-form-title]');
const archiveRoomFormState = document.querySelector('[data-archive-room-form-state]');
const archiveRoomFormSubmitButton = document.querySelector('[data-archive-room-form-submit]');
const archiveRoomFormCancelButtons = document.querySelectorAll('[data-archive-room-form-cancel], [data-archive-room-form-cancel-secondary]');
const artifactsState = document.querySelector('[data-artifacts-state]');
const artifactsTableWrap = document.querySelector('[data-artifacts-table-wrap]');
const artifactsTableBody = document.querySelector('[data-artifacts-table-body]');
const artifactDetail = document.querySelector('[data-artifact-detail]');
const artifactDetailTitle = document.querySelector('[data-artifact-detail-title]');
const artifactDetailMeta = document.querySelector('[data-artifact-detail-meta]');
const artifactDetailFields = document.querySelector('[data-artifact-detail-fields]');
const artifactDetailBody = document.querySelector('[data-artifact-detail-body]');
const artifactDetailCloseButton = document.querySelector('[data-artifact-detail-close]');
const artifactNewButton = document.querySelector('[data-artifact-new]');
const artifactFormPanel = document.querySelector('[data-artifact-form-panel]');
const artifactForm = document.querySelector('[data-artifact-form]');
const artifactFormTitle = document.querySelector('[data-artifact-form-title]');
const artifactFormState = document.querySelector('[data-artifact-form-state]');
const artifactFormSubmitButton = document.querySelector('[data-artifact-form-submit]');
const artifactFormCancelButtons = document.querySelectorAll('[data-artifact-form-cancel], [data-artifact-form-cancel-secondary]');
const memoryFragmentsState = document.querySelector('[data-memory-fragments-state]');
const memoryFragmentsTableWrap = document.querySelector('[data-memory-fragments-table-wrap]');
const memoryFragmentsTableBody = document.querySelector('[data-memory-fragments-table-body]');
const memoryFragmentDetail = document.querySelector('[data-memory-fragment-detail]');
const memoryFragmentDetailTitle = document.querySelector('[data-memory-fragment-detail-title]');
const memoryFragmentDetailMeta = document.querySelector('[data-memory-fragment-detail-meta]');
const memoryFragmentDetailFields = document.querySelector('[data-memory-fragment-detail-fields]');
const memoryFragmentDetailBody = document.querySelector('[data-memory-fragment-detail-body]');
const memoryFragmentDetailCloseButton = document.querySelector('[data-memory-fragment-detail-close]');
const memoryFragmentNewButton = document.querySelector('[data-memory-fragment-new]');
const memoryFragmentFormPanel = document.querySelector('[data-memory-fragment-form-panel]');
const memoryFragmentForm = document.querySelector('[data-memory-fragment-form]');
const memoryFragmentFormTitle = document.querySelector('[data-memory-fragment-form-title]');
const memoryFragmentFormState = document.querySelector('[data-memory-fragment-form-state]');
const memoryFragmentFormSubmitButton = document.querySelector('[data-memory-fragment-form-submit]');
const memoryFragmentFormCancelButtons = document.querySelectorAll('[data-memory-fragment-form-cancel], [data-memory-fragment-form-cancel-secondary]');
const memoryFragmentRoomOptions = document.querySelector('[data-memory-fragment-room-options]');
const memoryFragmentArtifactOptions = document.querySelector('[data-memory-fragment-artifact-options]');
const veilwalkerNotesState = document.querySelector('[data-veilwalker-notes-state]');
const veilwalkerNotesTableWrap = document.querySelector('[data-veilwalker-notes-table-wrap]');
const veilwalkerNotesTableBody = document.querySelector('[data-veilwalker-notes-table-body]');
const veilwalkerNoteDetail = document.querySelector('[data-veilwalker-note-detail]');
const veilwalkerNoteDetailTitle = document.querySelector('[data-veilwalker-note-detail-title]');
const veilwalkerNoteDetailMeta = document.querySelector('[data-veilwalker-note-detail-meta]');
const veilwalkerNoteDetailFields = document.querySelector('[data-veilwalker-note-detail-fields]');
const veilwalkerNoteDetailBody = document.querySelector('[data-veilwalker-note-detail-body]');
const veilwalkerNoteDetailCloseButton = document.querySelector('[data-veilwalker-note-detail-close]');
const veilwalkerNoteNewButton = document.querySelector('[data-veilwalker-note-new]');
const veilwalkerNoteFormPanel = document.querySelector('[data-veilwalker-note-form-panel]');
const veilwalkerNoteForm = document.querySelector('[data-veilwalker-note-form]');
const veilwalkerNoteFormTitle = document.querySelector('[data-veilwalker-note-form-title]');
const veilwalkerNoteFormState = document.querySelector('[data-veilwalker-note-form-state]');
const veilwalkerNoteFormSubmitButton = document.querySelector('[data-veilwalker-note-form-submit]');
const veilwalkerNoteFormCancelButtons = document.querySelectorAll('[data-veilwalker-note-form-cancel], [data-veilwalker-note-form-cancel-secondary]');
const veilwalkerNoteVeilwalkerOptions = document.querySelector('[data-veilwalker-note-veilwalker-options]');
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
const veilwalkerNewButton = document.querySelector('[data-veilwalker-new]');
const veilwalkerFormPanel = document.querySelector('[data-veilwalker-form-panel]');
const veilwalkerForm = document.querySelector('[data-veilwalker-form]');
const veilwalkerFormTitle = document.querySelector('[data-veilwalker-form-title]');
const veilwalkerFormState = document.querySelector('[data-veilwalker-form-state]');
const veilwalkerFormSubmitButton = document.querySelector('[data-veilwalker-form-submit]');
const veilwalkerFormCancelButtons = document.querySelectorAll('[data-veilwalker-form-cancel], [data-veilwalker-form-cancel-secondary]');
const veilwalkerProfileNoteOptions = document.querySelector('[data-veilwalker-profile-note-options]');
const appSettingsState = document.querySelector('[data-app-settings-state]');
const appSettingsTableWrap = document.querySelector('[data-app-settings-table-wrap]');
const appSettingsTableBody = document.querySelector('[data-app-settings-table-body]');
const appSettingDetail = document.querySelector('[data-app-setting-detail]');
const appSettingDetailTitle = document.querySelector('[data-app-setting-detail-title]');
const appSettingDetailMeta = document.querySelector('[data-app-setting-detail-meta]');
const appSettingDetailFields = document.querySelector('[data-app-setting-detail-fields]');
const appSettingDetailBody = document.querySelector('[data-app-setting-detail-body]');
const appSettingDetailCloseButton = document.querySelector('[data-app-setting-detail-close]');
const appSettingNewButton = document.querySelector('[data-app-setting-new]');
const appSettingFormPanel = document.querySelector('[data-app-setting-form-panel]');
const appSettingForm = document.querySelector('[data-app-setting-form]');
const appSettingFormTitle = document.querySelector('[data-app-setting-form-title]');
const appSettingFormState = document.querySelector('[data-app-setting-form-state]');
const appSettingFormSubmitButton = document.querySelector('[data-app-setting-form-submit]');
const appSettingFormCancelButtons = document.querySelectorAll('[data-app-setting-form-cancel], [data-app-setting-form-cancel-secondary]');
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
let editingJournalId = null;
let journalPromptsLoaded = false;
let journalPromptRows = [];
let editingJournalPromptId = null;
let journalPromptsCurrentPage = 1;
let journalPromptsPageSize = 10;
let journalPromptsTotalCount = 0;
let archiveRoomsLoaded = false;
let archiveRoomRows = [];
let editingArchiveRoomId = null;
let artifactsLoaded = false;
let artifactRows = [];
let editingArtifactId = null;
let memoryFragmentsLoaded = false;
let memoryFragmentRows = [];
let editingMemoryFragmentId = null;
let veilwalkerNotesLoaded = false;
let veilwalkerNoteRows = [];
let editingVeilwalkerNoteId = null;
let veilwalkersLoaded = false;
let veilwalkerRows = [];
let editingVeilwalkerId = null;
let appSettingsLoaded = false;
let appSettingRows = [];
let editingAppSettingId = null;
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

function getJournalId(row) {
  return getFirstValue(row, ['id']);
}

function getJournalKey(row) {
  return formatValue(getFirstValue(row, ['journal_key', 'key', 'id']));
}

function getJournalType(row) {
  return formatValue(getFirstValue(row, ['journal_type', 'entry_type', 'type']));
}

function getJournalArchiveSection(row) {
  return formatValue(getFirstValue(row, ['archive_section', 'section']));
}

function getJournalThemeMode(row) {
  return formatValue(getFirstValue(row, ['theme_mode', 'mode_key', 'mode', 'site_mode', 'event_mode', 'collection_mode']));
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

function getJournalPublishedBoolean(row) {
  const publishedValue = getFirstValue(row, ['is_published', 'published']);

  if (typeof publishedValue === 'boolean') {
    return publishedValue;
  }

  return String(publishedValue || '').toLowerCase() === 'true';
}

function getJournalMode(row) {
  return getJournalThemeMode(row);
}

function getJournalBody(row) {
  return formatValue(
    getFirstValue(row, ['body', 'content', 'text', 'entry', 'description', 'summary']),
    'No body/content field available for this journal.',
  );
}

function getJournalExcerpt(row) {
  return formatValue(getFirstValue(row, ['excerpt', 'summary']));
}

function getJournalRelatedCharacter(row) {
  return formatValue(getFirstValue(row, ['related_character', 'character_key', 'veilwalker_key']));
}

function getJournalSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order', 'display_order', 'order']));
}

function getJournalPromptId(row) {
  return getFirstValue(row, ['id']);
}

function getJournalPromptText(row) {
  return formatValue(getFirstValue(row, ['prompt_text', 'text', 'question']), 'Untitled prompt');
}

function getJournalPromptPreview(row) {
  return formatCompactValue(getJournalPromptText(row), 'Untitled prompt');
}

function getJournalPromptType(row) {
  return formatValue(getFirstValue(row, ['prompt_type', 'type']), 'guided_question');
}

function getJournalPromptMode(row) {
  return formatValue(getFirstValue(row, ['mode']), 'all');
}

function getJournalPromptMood(row) {
  return formatValue(getFirstValue(row, ['mood']), 'any');
}

function getJournalPromptIntensity(row) {
  return formatValue(getFirstValue(row, ['intensity']), 'gentle');
}

function getJournalPromptCategory(row) {
  return formatValue(getFirstValue(row, ['category']));
}

function getJournalPromptSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order']));
}

function getJournalPromptActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
}

function getJournalPromptActiveState(row) {
  return getJournalPromptActiveBoolean(row) ? 'Active' : 'Inactive';
}

function getArchiveRoomTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name']), 'Untitled room');
}

function getArchiveRoomId(row) {
  return getFirstValue(row, ['id']);
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

function getArchiveRoomName(row) {
  return formatValue(getFirstValue(row, ['name']));
}

function getArchiveRoomKind(row) {
  return formatValue(getFirstValue(row, ['room_kind', 'kind']));
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

function getArchiveRoomActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
}

function getArchiveRoomUnlockableState(row) {
  return getBooleanState(row, ['is_unlockable', 'unlockable']);
}

function getArchiveRoomUnlockableBoolean(row) {
  const unlockableValue = getFirstValue(row, ['is_unlockable', 'unlockable']);

  if (typeof unlockableValue === 'boolean') {
    return unlockableValue;
  }

  return String(unlockableValue || '').toLowerCase() === 'true';
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

function getArchiveRoomMetadata(row) {
  return getFirstValue(row, ['metadata', 'meta', 'settings']);
}

function getArtifactTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name']), 'Untitled artifact');
}

function getArtifactId(row) {
  return getFirstValue(row, ['id']);
}

function getArtifactKey(row) {
  return formatValue(getFirstValue(row, ['artifact_key', 'key', 'slug', 'id']));
}

function getArtifactName(row) {
  return formatValue(getFirstValue(row, ['name']));
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

function getArtifactActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
}

function getArtifactSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order', 'display_order', 'order']));
}

function getArtifactMetadata(row) {
  return getFirstValue(row, ['metadata', 'meta', 'settings']);
}

function getMemoryFragmentTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name']), 'Untitled fragment');
}

function getMemoryFragmentId(row) {
  return getFirstValue(row, ['id']);
}

function getMemoryFragmentKey(row) {
  return formatValue(getFirstValue(row, ['fragment_key', 'key', 'slug', 'id']));
}

function getMemoryFragmentName(row) {
  return formatValue(getFirstValue(row, ['name']));
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
    getFirstValue(row, ['description', 'summary']),
    'No description/body field available for this memory fragment.',
  );
}

function getMemoryFragmentBody(row) {
  return formatValue(
    getFirstValue(row, ['body', 'content', 'text']),
    getMemoryFragmentDescription(row),
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

function getMemoryFragmentActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
}

function getMemoryFragmentSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order', 'display_order', 'order']));
}

function getMemoryFragmentMetadata(row) {
  return getFirstValue(row, ['metadata', 'meta', 'settings']);
}

function getVeilwalkerNoteTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name', 'heading']), 'Untitled note');
}

function getVeilwalkerNoteId(row) {
  return getFirstValue(row, ['id']);
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

function getVeilwalkerNoteHiddenBoolean(row) {
  const hiddenValue = getFirstValue(row, ['is_hidden', 'hidden']);

  if (typeof hiddenValue === 'boolean') {
    return hiddenValue;
  }

  return String(hiddenValue || '').toLowerCase() === 'true';
}

function getVeilwalkerNoteActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
}

function getVeilwalkerNoteSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order', 'display_order', 'order']));
}

function getVeilwalkerNoteMetadata(row) {
  return getFirstValue(row, ['metadata', 'meta', 'settings']);
}

function getVeilwalkerName(row) {
  return formatValue(getFirstValue(row, ['display_name', 'name', 'title']), 'Unnamed veilwalker');
}

function getVeilwalkerId(row) {
  return getFirstValue(row, ['id']);
}

function getVeilwalkerKey(row) {
  return formatValue(getFirstValue(row, ['veilwalker_key', 'reader_key', 'key', 'slug', 'id']));
}

function getVeilwalkerZodiac(row) {
  return formatValue(getFirstValue(row, ['zodiac_key', 'zodiac', 'sign']));
}

function getVeilwalkerThemeMode(row) {
  return formatValue(getFirstValue(row, ['theme_mode', 'mode_key', 'mode', 'site_mode', 'event_mode']));
}

function getVeilwalkerFormKey(row) {
  return formatValue(getFirstValue(row, ['form_key', 'form', 'variant_key']));
}

function getVeilwalkerFormLabel(row) {
  return formatValue(getFirstValue(row, ['form_label', 'variant_label']));
}

function getVeilwalkerElement(row) {
  return formatValue(getFirstValue(row, ['element', 'element_key', 'suit']));
}

function getVeilwalkerSymbol(row) {
  return formatValue(getFirstValue(row, ['symbol', 'glyph']));
}

function getVeilwalkerAccentColor(row) {
  return formatValue(getFirstValue(row, ['accent_color', 'accent']));
}

function getVeilwalkerGlowColor(row) {
  return formatValue(getFirstValue(row, ['glow_color']));
}

function getVeilwalkerCardImageUrl(row) {
  return formatValue(getFirstValue(row, ['card_image_url', 'card_image', 'image_url', 'phase1_image']));
}

function getVeilwalkerProfileImageUrl(row) {
  return formatValue(getFirstValue(row, ['profile_image_url', 'profile_image', 'phase2_image', 'image_url']));
}

function getVeilwalkerTitle(row) {
  return formatValue(getFirstValue(row, ['profile_title', 'title', 'role']));
}

function getVeilwalkerTagline(row) {
  return formatValue(getFirstValue(row, ['short_quote', 'tagline', 'subtitle']));
}

function getVeilwalkerFocus(row) {
  return formatValue(getFirstValue(row, ['focus_text', 'focus', 'specialty']));
}

function getVeilwalkerFocusLabel(row) {
  return formatValue(getFirstValue(row, ['focus_label']));
}

function getVeilwalkerTraits(row) {
  return formatValue(getFirstValue(row, ['traits', 'trait_list']));
}

function getVeilwalkerDescription(row) {
  return formatValue(
    getFirstValue(row, ['profile_body', 'card_description', 'description', 'lore', 'body', 'content', 'summary']),
    'No description/lore field available for this veilwalker.',
  );
}

function getVeilwalkerCardDescription(row) {
  return formatValue(getFirstValue(row, ['card_description', 'summary', 'description']));
}

function getVeilwalkerMode(row) {
  return getVeilwalkerThemeMode(row);
}

function getVeilwalkerAccentClass(row) {
  return formatValue(getFirstValue(row, ['accent_class', 'accent']));
}

function getVeilwalkerActiveState(row) {
  return getBooleanState(row, ['is_active', 'active', 'enabled']);
}

function getVeilwalkerActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
}

function getVeilwalkerReadingEnabledBoolean(row) {
  const readingValue = getFirstValue(row, ['reading_enabled', 'can_read']);

  if (typeof readingValue === 'boolean') {
    return readingValue;
  }

  return String(readingValue || '').toLowerCase() === 'true';
}

function getVeilwalkerHasProfileNoteBoolean(row) {
  const noteValue = getFirstValue(row, ['has_profile_note', 'profile_note_enabled']);

  if (typeof noteValue === 'boolean') {
    return noteValue;
  }

  return String(noteValue || '').toLowerCase() === 'true';
}

function getVeilwalkerMysteryBoolean(row) {
  const mysteryValue = getFirstValue(row, ['is_mystery', 'mystery']);

  if (typeof mysteryValue === 'boolean') {
    return mysteryValue;
  }

  return String(mysteryValue || '').toLowerCase() === 'true';
}

function getVeilwalkerReadingEnabledState(row) {
  return getBooleanState(row, ['reading_enabled', 'can_read']);
}

function getVeilwalkerHasProfileNoteState(row) {
  return getBooleanState(row, ['has_profile_note', 'profile_note_enabled']);
}

function getVeilwalkerMysteryState(row) {
  return getBooleanState(row, ['is_mystery', 'mystery']);
}

function getVeilwalkerReadingStyle(row) {
  return formatValue(getFirstValue(row, ['reading_style']));
}

function getVeilwalkerProfileNoteKey(row) {
  return formatValue(getFirstValue(row, ['profile_note_key', 'note_key']));
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

function getAppSettingId(row) {
  return getFirstValue(row, ['id']);
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

function getAppSettingPublicBoolean(row) {
  const publicValue = getFirstValue(row, ['is_public', 'public']);

  if (typeof publicValue === 'boolean') {
    return publicValue;
  }

  return String(publicValue || '').toLowerCase() === 'true';
}

function getAppSettingActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
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

function setJournalFormState(message, state = '') {
  journalFormState.textContent = message;
  journalFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  journalFormState.hidden = false;
}

function hideJournalFormState() {
  journalFormState.hidden = true;
  journalFormState.textContent = '';
  journalFormState.className = 'admin-state';
}

function setJournalPromptsState(message, state = '') {
  journalPromptsState.textContent = message;
  journalPromptsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  journalPromptsState.hidden = false;
}

function setJournalPromptFormState(message, state = '') {
  journalPromptFormState.textContent = message;
  journalPromptFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  journalPromptFormState.hidden = false;
}

function hideJournalPromptFormState() {
  journalPromptFormState.hidden = true;
  journalPromptFormState.textContent = '';
  journalPromptFormState.className = 'admin-state';
}

function setArchiveRoomsState(message, state = '') {
  archiveRoomsState.textContent = message;
  archiveRoomsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  archiveRoomsState.hidden = false;
}

function setArchiveRoomFormState(message, state = '') {
  archiveRoomFormState.textContent = message;
  archiveRoomFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  archiveRoomFormState.hidden = false;
}

function hideArchiveRoomFormState() {
  archiveRoomFormState.hidden = true;
  archiveRoomFormState.textContent = '';
  archiveRoomFormState.className = 'admin-state';
}

function setArtifactsState(message, state = '') {
  artifactsState.textContent = message;
  artifactsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  artifactsState.hidden = false;
}

function setArtifactFormState(message, state = '') {
  artifactFormState.textContent = message;
  artifactFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  artifactFormState.hidden = false;
}

function hideArtifactFormState() {
  artifactFormState.hidden = true;
  artifactFormState.textContent = '';
  artifactFormState.className = 'admin-state';
}

function setMemoryFragmentsState(message, state = '') {
  memoryFragmentsState.textContent = message;
  memoryFragmentsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  memoryFragmentsState.hidden = false;
}

function setMemoryFragmentFormState(message, state = '') {
  memoryFragmentFormState.textContent = message;
  memoryFragmentFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  memoryFragmentFormState.hidden = false;
}

function hideMemoryFragmentFormState() {
  memoryFragmentFormState.hidden = true;
  memoryFragmentFormState.textContent = '';
  memoryFragmentFormState.className = 'admin-state';
}

function setVeilwalkerNotesState(message, state = '') {
  veilwalkerNotesState.textContent = message;
  veilwalkerNotesState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  veilwalkerNotesState.hidden = false;
}

function setVeilwalkerNoteFormState(message, state = '') {
  veilwalkerNoteFormState.textContent = message;
  veilwalkerNoteFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  veilwalkerNoteFormState.hidden = false;
}

function hideVeilwalkerNoteFormState() {
  veilwalkerNoteFormState.hidden = true;
  veilwalkerNoteFormState.textContent = '';
  veilwalkerNoteFormState.className = 'admin-state';
}

function setVeilwalkersState(message, state = '') {
  veilwalkersState.textContent = message;
  veilwalkersState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  veilwalkersState.hidden = false;
}

function setVeilwalkerFormState(message, state = '') {
  veilwalkerFormState.textContent = message;
  veilwalkerFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  veilwalkerFormState.hidden = false;
}

function hideVeilwalkerFormState() {
  veilwalkerFormState.hidden = true;
  veilwalkerFormState.textContent = '';
  veilwalkerFormState.className = 'admin-state';
}

function setAppSettingsState(message, state = '') {
  appSettingsState.textContent = message;
  appSettingsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  appSettingsState.hidden = false;
}

function setAppSettingFormState(message, state = '') {
  appSettingFormState.textContent = message;
  appSettingFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  appSettingFormState.hidden = false;
}

function hideAppSettingFormState() {
  appSettingFormState.hidden = true;
  appSettingFormState.textContent = '';
  appSettingFormState.className = 'admin-state';
}

function setUserProgressState(message, state = '') {
  userProgressState.textContent = message;
  userProgressState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  userProgressState.hidden = false;
}

function hideJournalDetail() {
  journalDetail.hidden = true;
}

function hideJournalForm() {
  editingJournalId = null;
  journalForm.reset();
  hideJournalFormState();
  journalFormPanel.hidden = true;
  journalFormSubmitButton.disabled = false;
  journalFormSubmitButton.textContent = 'Save Journal';
}

function setJournalPromptFormCancelVisible(isVisible) {
  journalPromptFormCancelButtons.forEach((button) => {
    button.hidden = !isVisible;
  });
}

function hideJournalPromptForm() {
  editingJournalPromptId = null;
  journalPromptForm.reset();
  journalPromptForm.elements.prompt_type.value = 'guided_question';
  journalPromptForm.elements.mode.value = 'lumen';
  journalPromptForm.elements.mood.value = 'any';
  journalPromptForm.elements.intensity.value = 'gentle';
  journalPromptForm.elements.is_active.checked = true;
  hideJournalPromptFormState();
  journalPromptFormTitle.textContent = 'New Prompt';
  journalPromptFormSubmitButton.disabled = false;
  journalPromptFormSubmitButton.textContent = 'Save Prompt';
  setJournalPromptFormCancelVisible(false);
}

function hideArchiveRoomDetail() {
  archiveRoomDetail.hidden = true;
}

function hideArchiveRoomForm() {
  editingArchiveRoomId = null;
  archiveRoomForm.reset();
  hideArchiveRoomFormState();
  archiveRoomFormPanel.hidden = true;
  archiveRoomFormSubmitButton.disabled = false;
  archiveRoomFormSubmitButton.textContent = 'Save Archive Room';
}

function hideArtifactDetail() {
  artifactDetail.hidden = true;
}

function hideArtifactForm() {
  editingArtifactId = null;
  artifactForm.reset();
  hideArtifactFormState();
  artifactFormPanel.hidden = true;
  artifactFormSubmitButton.disabled = false;
  artifactFormSubmitButton.textContent = 'Save Artifact';
}

function hideMemoryFragmentDetail() {
  memoryFragmentDetail.hidden = true;
}

function hideMemoryFragmentForm() {
  editingMemoryFragmentId = null;
  memoryFragmentForm.reset();
  hideMemoryFragmentFormState();
  memoryFragmentFormPanel.hidden = true;
  memoryFragmentFormSubmitButton.disabled = false;
  memoryFragmentFormSubmitButton.textContent = 'Save Memory Fragment';
}

function hideVeilwalkerNoteDetail() {
  veilwalkerNoteDetail.hidden = true;
}

function hideVeilwalkerNoteForm() {
  editingVeilwalkerNoteId = null;
  veilwalkerNoteForm.reset();
  hideVeilwalkerNoteFormState();
  veilwalkerNoteFormPanel.hidden = true;
  veilwalkerNoteFormSubmitButton.disabled = false;
  veilwalkerNoteFormSubmitButton.textContent = 'Save Veilwalker Note';
}

function hideVeilwalkerDetail() {
  veilwalkerDetail.hidden = true;
}

function hideVeilwalkerForm() {
  editingVeilwalkerId = null;
  veilwalkerForm.reset();
  hideVeilwalkerFormState();
  veilwalkerFormPanel.hidden = true;
  veilwalkerFormSubmitButton.disabled = false;
  veilwalkerFormSubmitButton.textContent = 'Save Veilwalker';
}

function hideAppSettingDetail() {
  appSettingDetail.hidden = true;
}

function hideAppSettingForm() {
  editingAppSettingId = null;
  appSettingForm.reset();
  hideAppSettingFormState();
  appSettingFormPanel.hidden = true;
  appSettingFormSubmitButton.disabled = false;
  appSettingFormSubmitButton.textContent = 'Save Setting';
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

function appendJournalPromptBadgeCell(rowElement, label, value, badgeClassName = '') {
  const cell = document.createElement('td');
  const badge = document.createElement('span');

  cell.dataset.label = label;
  cell.className = 'journal-prompts-table__meta';
  badge.className = `admin-badge${badgeClassName ? ` ${badgeClassName}` : ''}`;
  badge.textContent = value || '--';
  cell.append(badge);
  rowElement.append(cell);
}

function renderJournalRows(rows) {
  journalsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const publishButton = document.createElement('button');

    appendTextCell(tableRow, 'Title', getJournalTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Slug', getJournalSlug(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Journal Key', getJournalKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Type', getJournalType(row));
    appendTextCell(tableRow, 'Mode', getJournalMode(row));
    appendTextCell(tableRow, 'Published', getJournalPublishedState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showJournalDetail(index));

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showJournalForm(row));

    publishButton.className = 'admin-row-action';
    publishButton.type = 'button';
    publishButton.textContent = getJournalPublishedBoolean(row) ? 'Unpublish' : 'Publish';
    publishButton.addEventListener('click', () => toggleJournalPublished(row, publishButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(viewButton, editButton, publishButton);
    actionCell.append(actionGroup);
    tableRow.append(actionCell);
    journalsTableBody.append(tableRow);
  });
}

function getJournalPromptFilterValue(filterName) {
  const field = journalPromptFilters.find((filter) => filter.dataset.journalPromptFilter === filterName);

  return field?.value || '__all';
}

function applyJournalPromptFilters(query) {
  const typeFilter = getJournalPromptFilterValue('prompt_type');
  const modeFilter = getJournalPromptFilterValue('mode');
  const moodFilter = getJournalPromptFilterValue('mood');
  const activeFilter = getJournalPromptFilterValue('active');

  let nextQuery = query;

  if (typeFilter !== '__all') {
    nextQuery = nextQuery.eq('prompt_type', typeFilter);
  }

  if (modeFilter !== '__all') {
    nextQuery = nextQuery.eq('mode', modeFilter);
  }

  if (moodFilter !== '__all') {
    nextQuery = nextQuery.eq('mood', moodFilter);
  }

  if (activeFilter === 'active') {
    nextQuery = nextQuery.eq('is_active', true);
  }

  if (activeFilter === 'inactive') {
    nextQuery = nextQuery.eq('is_active', false);
  }

  return nextQuery;
}

function getJournalPromptsTotalPages() {
  return Math.max(1, Math.ceil(journalPromptsTotalCount / journalPromptsPageSize));
}

function getJournalPromptsPageNumbers() {
  const totalPages = getJournalPromptsTotalPages();
  const maxButtons = 7;
  const halfWindow = Math.floor(maxButtons / 2);
  let start = Math.max(1, journalPromptsCurrentPage - halfWindow);
  const end = Math.min(totalPages, start + maxButtons - 1);

  start = Math.max(1, end - maxButtons + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function renderJournalPromptsPagination() {
  const totalPages = getJournalPromptsTotalPages();
  const hasPrompts = journalPromptsTotalCount > 0;

  if (!journalPromptsPagination || !journalPromptsPaginationControls || !journalPromptsPaginationSummary) {
    return;
  }

  journalPromptsPagination.hidden = !hasPrompts;
  journalPromptsPaginationControls.replaceChildren();

  if (!hasPrompts) {
    journalPromptsPaginationSummary.textContent = 'Showing 0-0 of 0 prompts';
    return;
  }

  const from = (journalPromptsCurrentPage - 1) * journalPromptsPageSize + 1;
  const to = Math.min(from + journalPromptRows.length - 1, journalPromptsTotalCount);
  const previousButton = document.createElement('button');
  const nextButton = document.createElement('button');

  journalPromptsPaginationSummary.textContent = `Showing ${from}-${to} of ${journalPromptsTotalCount} prompts`;

  previousButton.className = 'admin-pagination__button';
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = journalPromptsCurrentPage <= 1;
  previousButton.addEventListener('click', () => {
    if (journalPromptsCurrentPage > 1) {
      journalPromptsCurrentPage -= 1;
      loadJournalPrompts();
    }
  });
  journalPromptsPaginationControls.append(previousButton);

  getJournalPromptsPageNumbers().forEach((pageNumber) => {
    const pageButton = document.createElement('button');

    pageButton.className = `admin-pagination__button${pageNumber === journalPromptsCurrentPage ? ' is-active' : ''}`;
    pageButton.type = 'button';
    pageButton.textContent = String(pageNumber);
    pageButton.setAttribute('aria-label', `Page ${pageNumber}`);
    pageButton.setAttribute('aria-current', pageNumber === journalPromptsCurrentPage ? 'page' : 'false');
    pageButton.disabled = pageNumber === journalPromptsCurrentPage;
    pageButton.addEventListener('click', () => {
      journalPromptsCurrentPage = pageNumber;
      loadJournalPrompts();
    });
    journalPromptsPaginationControls.append(pageButton);
  });

  nextButton.className = 'admin-pagination__button';
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = journalPromptsCurrentPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (journalPromptsCurrentPage < totalPages) {
      journalPromptsCurrentPage += 1;
      loadJournalPrompts();
    }
  });
  journalPromptsPaginationControls.append(nextButton);
}

function renderJournalPromptRows(rows = journalPromptRows) {
  journalPromptsTableBody.replaceChildren();

  if (!rows.length) {
    setJournalPromptsState('No prompts found for these filters.');
    journalPromptsTableWrap.hidden = true;
    renderJournalPromptsPagination();
    return;
  }

  rows.forEach((row) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const editButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendTextCell(tableRow, 'Prompt', getJournalPromptText(row), 'journal-prompts-table__prompt');
    appendTextCell(tableRow, 'Type', getJournalPromptType(row), 'journal-prompts-table__meta');
    appendJournalPromptBadgeCell(tableRow, 'Mode', getJournalPromptMode(row), 'admin-badge--mode');
    appendJournalPromptBadgeCell(tableRow, 'Mood', getJournalPromptMood(row), 'admin-badge--mood');
    appendJournalPromptBadgeCell(tableRow, 'Intensity', getJournalPromptIntensity(row), 'admin-badge--intensity');
    appendTextCell(tableRow, 'Category', getJournalPromptCategory(row), 'journal-prompts-table__meta');
    appendJournalPromptBadgeCell(
      tableRow,
      'Status',
      getJournalPromptActiveState(row),
      getJournalPromptActiveBoolean(row) ? 'admin-badge--active' : 'admin-badge--inactive',
    );

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showJournalPromptForm(row));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getJournalPromptActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleJournalPromptActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(editButton, activeButton);
    actionCell.append(actionGroup);
    tableRow.append(actionCell);
    journalPromptsTableBody.append(tableRow);
  });

  journalPromptsState.hidden = true;
  journalPromptsTableWrap.hidden = false;
  renderJournalPromptsPagination();
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

function setJournalFormValue(fieldName, value) {
  const field = journalForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function showJournalForm(row = null) {
  hideJournalDetail();
  hideJournalFormState();
  journalForm.reset();

  if (row) {
    editingJournalId = getJournalId(row);
    journalFormTitle.textContent = 'Edit Journal';
    journalFormSubmitButton.textContent = 'Save Changes';
    setJournalFormValue('title', getJournalTitle(row));
    setJournalFormValue('slug', getJournalSlug(row));
    setJournalFormValue('journal_type', getJournalType(row));
    setJournalFormValue('archive_section', getJournalArchiveSection(row));
    setJournalFormValue('theme_mode', getJournalThemeMode(row));
    setJournalFormValue('excerpt', getJournalExcerpt(row));
    setJournalFormValue('body', getJournalBody(row));
    setJournalFormValue('related_character', getJournalRelatedCharacter(row));
    setJournalFormValue('is_published', getJournalPublishedBoolean(row));
    setJournalFormValue('sort_order', getJournalSortOrder(row));
  } else {
    editingJournalId = null;
    journalFormTitle.textContent = 'New Journal';
    journalFormSubmitButton.textContent = 'Create Journal';
  }

  journalFormPanel.hidden = false;
  journalForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getJournalFormPayload() {
  const formData = new FormData(journalForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const payload = {
    title: String(formData.get('title') || '').trim(),
    slug: String(formData.get('slug') || '').trim(),
    journal_type: String(formData.get('journal_type') || '').trim() || null,
    archive_section: String(formData.get('archive_section') || '').trim() || null,
    theme_mode: String(formData.get('theme_mode') || '').trim() || null,
    excerpt: String(formData.get('excerpt') || '').trim() || null,
    body: String(formData.get('body') || '').trim(),
    related_character: String(formData.get('related_character') || '').trim() || null,
    is_published: formData.has('is_published'),
  };

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  return payload;
}

function validateJournalPayload(payload) {
  const missingFields = [];

  if (!payload.title) {
    missingFields.push('title');
  }

  if (!payload.slug) {
    missingFields.push('slug');
  }

  if (!payload.body) {
    missingFields.push('body');
  }

  return missingFields;
}

async function refreshJournals(message = '') {
  journalsLoaded = false;
  hideJournalDetail();
  await loadJournals();

  if (message) {
    setJournalsState(message, 'success');
  }
}

async function handleJournalFormSubmit(event) {
  event.preventDefault();

  const payload = getJournalFormPayload();
  const missingFields = validateJournalPayload(payload);

  if (missingFields.length) {
    setJournalFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setJournalFormState('Journals cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  journalFormSubmitButton.disabled = true;
  setJournalFormState(editingJournalId ? 'Saving journal changes...' : 'Creating journal...');

  const query = editingJournalId
    ? supabase.from('journals').update(payload).eq('id', editingJournalId).select('*').single()
    : supabase.from('journals').insert(payload).select('*').single();

  const { error } = await query;

  if (error) {
    journalFormSubmitButton.disabled = false;
    setJournalFormState(`Journal could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingJournalId ? 'Journal updated successfully.' : 'Journal created successfully.';
  hideJournalForm();
  await refreshJournals(successMessage);
}

async function toggleJournalPublished(row, button) {
  const journalId = getJournalId(row);
  const supabase = getSupabaseClient();

  if (!journalId) {
    setJournalsState('This journal cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setJournalsState('Journals cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextPublishedState = !getJournalPublishedBoolean(row);
  const { error } = await supabase
    .from('journals')
    .update({ is_published: nextPublishedState })
    .eq('id', journalId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setJournalsState(`Publish status could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshJournals(nextPublishedState ? 'Journal published.' : 'Journal unpublished.');
}

function setJournalPromptFormValue(fieldName, value) {
  const field = journalPromptForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function showJournalPromptForm(row = null) {
  hideJournalPromptFormState();

  if (row) {
    editingJournalPromptId = getJournalPromptId(row);
    journalPromptFormTitle.textContent = 'Edit Prompt';
    journalPromptFormSubmitButton.textContent = 'Save Prompt';
    setJournalPromptFormCancelVisible(true);
    setJournalPromptFormValue('prompt_text', getJournalPromptText(row));
    setJournalPromptFormValue('prompt_type', getJournalPromptType(row));
    setJournalPromptFormValue('mode', getJournalPromptMode(row));
    setJournalPromptFormValue('mood', getJournalPromptMood(row));
    setJournalPromptFormValue('intensity', getJournalPromptIntensity(row));
    setJournalPromptFormValue('category', getJournalPromptCategory(row));
    setJournalPromptFormValue('sort_order', getJournalPromptSortOrder(row));
    setJournalPromptFormValue('is_active', getJournalPromptActiveBoolean(row));
  } else {
    hideJournalPromptForm();
  }

  journalPromptFormPanel.hidden = false;
  journalPromptForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getJournalPromptFormPayload() {
  const formData = new FormData(journalPromptForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const payload = {
    prompt_text: String(formData.get('prompt_text') || '').trim(),
    prompt_type: String(formData.get('prompt_type') || 'guided_question').trim() || 'guided_question',
    mode: String(formData.get('mode') || 'lumen').trim() || 'lumen',
    mood: String(formData.get('mood') || 'any').trim() || 'any',
    intensity: String(formData.get('intensity') || 'gentle').trim() || 'gentle',
    category: String(formData.get('category') || '').trim() || null,
    is_active: formData.has('is_active'),
  };

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  return payload;
}

async function getNextJournalPromptSortOrder(supabase, payload) {
  const { data, error } = await supabase
    .from('journal_prompts')
    .select('sort_order')
    .eq('prompt_type', payload.prompt_type)
    .eq('mode', payload.mode)
    .eq('mood', payload.mood)
    .not('sort_order', 'is', null)
    .order('sort_order', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Journal prompt sort order lookup failed:', error);
    throw error;
  }

  const maxSortOrder = Number(data?.[0]?.sort_order);

  return Number.isFinite(maxSortOrder) ? maxSortOrder + 1 : 1;
}

function validateJournalPromptPayload(payload) {
  const missingFields = [];

  if (!payload.prompt_text) {
    missingFields.push('prompt text');
  }

  return missingFields;
}

async function refreshJournalPrompts(message = '') {
  journalPromptsLoaded = false;
  await loadJournalPrompts();

  if (message) {
    setJournalPromptsState(message, 'success');
  }
}

async function handleJournalPromptFormSubmit(event) {
  event.preventDefault();

  const payload = getJournalPromptFormPayload();
  const missingFields = validateJournalPromptPayload(payload);

  if (missingFields.length) {
    setJournalPromptFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setJournalPromptFormState('Journal prompts cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  journalPromptFormSubmitButton.disabled = true;
  setJournalPromptFormState(editingJournalPromptId ? 'Saving prompt changes...' : 'Creating prompt...');

  if (!editingJournalPromptId && !Object.prototype.hasOwnProperty.call(payload, 'sort_order')) {
    try {
      payload.sort_order = await getNextJournalPromptSortOrder(supabase, payload);
    } catch {
      journalPromptFormSubmitButton.disabled = false;
      setJournalPromptFormState('Journal prompt could not be sorted automatically. Please try again or enter a sort order.', 'error');
      return;
    }
  }

  const nextPayload = {
    ...payload,
    updated_at: new Date().toISOString(),
  };

  const query = editingJournalPromptId
    ? supabase.from('journal_prompts').update(nextPayload).eq('id', editingJournalPromptId).select('*').single()
    : supabase.from('journal_prompts').insert(payload).select('*').single();

  const { error } = await query;

  if (error) {
    journalPromptFormSubmitButton.disabled = false;
    setJournalPromptFormState(`Journal prompt could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingJournalPromptId ? 'Journal prompt updated successfully.' : 'Journal prompt created successfully.';
  hideJournalPromptForm();
  await refreshJournalPrompts(successMessage);
}

async function toggleJournalPromptActive(row, button) {
  const promptId = getJournalPromptId(row);
  const supabase = getSupabaseClient();

  if (!promptId) {
    setJournalPromptsState('This prompt cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setJournalPromptsState('Journal prompts cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextActiveState = !getJournalPromptActiveBoolean(row);
  const { error } = await supabase
    .from('journal_prompts')
    .update({
      is_active: nextActiveState,
      updated_at: new Date().toISOString(),
    })
    .eq('id', promptId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setJournalPromptsState(`Prompt status could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshJournalPrompts(nextActiveState ? 'Journal prompt activated.' : 'Journal prompt deactivated.');
}

function renderArchiveRoomRows(rows) {
  archiveRoomsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendTextCell(tableRow, 'Room Key', getArchiveRoomKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Title', getArchiveRoomTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Mode', getArchiveRoomMode(row));
    appendTextCell(tableRow, 'Archive Type', getArchiveRoomType(row));
    appendTextCell(tableRow, 'Status', getArchiveRoomStatus(row));
    appendTextCell(tableRow, 'Active', getArchiveRoomActiveState(row));
    appendTextCell(tableRow, 'Sort', getArchiveRoomSortOrder(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showArchiveRoomDetail(index));

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showArchiveRoomForm(row));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getArchiveRoomActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleArchiveRoomActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(viewButton, editButton, activeButton);
    actionCell.append(actionGroup);
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
  appendDetailField(archiveRoomDetailFields, 'Name', getArchiveRoomName(row));
  appendDetailField(archiveRoomDetailFields, 'Mode', getArchiveRoomMode(row));
  appendDetailField(archiveRoomDetailFields, 'Archive Type', getArchiveRoomType(row));
  appendDetailField(archiveRoomDetailFields, 'Room Kind', getArchiveRoomKind(row));
  appendDetailField(archiveRoomDetailFields, 'Status', getArchiveRoomStatus(row));
  appendDetailField(archiveRoomDetailFields, 'Active', getArchiveRoomActiveState(row));
  appendDetailField(archiveRoomDetailFields, 'Unlockable', getArchiveRoomUnlockableState(row));
  appendDetailField(archiveRoomDetailFields, 'Image URL', getArchiveRoomImageUrl(row));
  appendDetailField(archiveRoomDetailFields, 'Sort Order', getArchiveRoomSortOrder(row));
  appendDetailField(archiveRoomDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(archiveRoomDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(archiveRoomDetailFields, 'Metadata', formatJsonValue(getArchiveRoomMetadata(row)));

  archiveRoomDetail.hidden = false;
  archiveRoomDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setArchiveRoomFormValue(fieldName, value) {
  const field = archiveRoomForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function showArchiveRoomForm(row = null) {
  hideArchiveRoomDetail();
  hideArchiveRoomFormState();
  archiveRoomForm.reset();

  if (row) {
    editingArchiveRoomId = getArchiveRoomId(row);
    archiveRoomFormTitle.textContent = 'Edit Archive Room';
    archiveRoomFormSubmitButton.textContent = 'Save Changes';
    setArchiveRoomFormValue('room_key', getArchiveRoomKey(row));
    setArchiveRoomFormValue('title', getArchiveRoomTitle(row));
    setArchiveRoomFormValue('name', getArchiveRoomName(row));
    setArchiveRoomFormValue('archive_type', getArchiveRoomType(row));
    setArchiveRoomFormValue('room_kind', getArchiveRoomKind(row));
    setArchiveRoomFormValue('mode_key', getArchiveRoomMode(row));
    setArchiveRoomFormValue('status', getArchiveRoomStatus(row));
    setArchiveRoomFormValue('description', getArchiveRoomDescription(row));
    setArchiveRoomFormValue('image_url', getArchiveRoomImageUrl(row));
    setArchiveRoomFormValue('sort_order', getArchiveRoomSortOrder(row));
    setArchiveRoomFormValue('is_active', getArchiveRoomActiveBoolean(row));
    setArchiveRoomFormValue('is_unlockable', getArchiveRoomUnlockableBoolean(row));
    setArchiveRoomFormValue('metadata', formatJsonValue(getArchiveRoomMetadata(row), ''));
  } else {
    editingArchiveRoomId = null;
    archiveRoomFormTitle.textContent = 'New Archive Room';
    archiveRoomFormSubmitButton.textContent = 'Create Archive Room';
  }

  archiveRoomFormPanel.hidden = false;
  archiveRoomForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getArchiveRoomFormPayload() {
  const formData = new FormData(archiveRoomForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const metadataValue = String(formData.get('metadata') || '').trim();
  const payload = {
    room_key: String(formData.get('room_key') || '').trim(),
    title: String(formData.get('title') || '').trim() || null,
    name: String(formData.get('name') || '').trim() || null,
    archive_type: String(formData.get('archive_type') || '').trim() || null,
    room_kind: String(formData.get('room_kind') || '').trim() || null,
    mode_key: String(formData.get('mode_key') || '').trim() || null,
    status: String(formData.get('status') || '').trim() || null,
    description: String(formData.get('description') || '').trim() || null,
    image_url: String(formData.get('image_url') || '').trim() || null,
    is_active: formData.has('is_active'),
    is_unlockable: formData.has('is_unlockable'),
  };

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  if (metadataValue) {
    try {
      payload.metadata = JSON.parse(metadataValue);
    } catch {
      return { payload, error: 'Metadata must be valid JSON.' };
    }
  } else {
    payload.metadata = null;
  }

  return { payload, error: '' };
}

function validateArchiveRoomPayload(payload) {
  const missingFields = [];

  if (!payload.room_key) {
    missingFields.push('room_key');
  }

  if (!payload.title && !payload.name) {
    missingFields.push('title or name');
  }

  return missingFields;
}

async function archiveRoomKeyExists(supabase, roomKey) {
  const { data, error } = await supabase
    .from('archive_rooms')
    .select('id')
    .eq('room_key', roomKey)
    .limit(1)
    .maybeSingle();

  if (error) {
    return { exists: false, error };
  }

  return { exists: Boolean(data), error: null };
}

async function refreshArchiveRooms(message = '') {
  archiveRoomsLoaded = false;
  hideArchiveRoomDetail();
  await loadArchiveRooms();

  if (message) {
    setArchiveRoomsState(message, 'success');
  }
}

async function handleArchiveRoomFormSubmit(event) {
  event.preventDefault();

  const { payload, error: parseError } = getArchiveRoomFormPayload();

  if (parseError) {
    setArchiveRoomFormState(parseError, 'error');
    return;
  }

  const missingFields = validateArchiveRoomPayload(payload);

  if (missingFields.length) {
    setArchiveRoomFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setArchiveRoomFormState('Archive rooms cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  archiveRoomFormSubmitButton.disabled = true;
  setArchiveRoomFormState(editingArchiveRoomId ? 'Saving archive room changes...' : 'Creating archive room...');

  if (!editingArchiveRoomId) {
    const { exists, error } = await archiveRoomKeyExists(supabase, payload.room_key);

    if (error) {
      archiveRoomFormSubmitButton.disabled = false;
      setArchiveRoomFormState(`Archive room key could not be checked. ${error.message || 'Please try again later.'}`, 'error');
      return;
    }

    if (exists) {
      archiveRoomFormSubmitButton.disabled = false;
      setArchiveRoomFormState('An archive room with this room_key already exists.', 'error');
      return;
    }
  }

  const query = editingArchiveRoomId
    ? supabase.from('archive_rooms').update(payload).eq('id', editingArchiveRoomId).select('*').single()
    : supabase.from('archive_rooms').insert(payload).select('*').single();

  const { error } = await query;

  if (error) {
    archiveRoomFormSubmitButton.disabled = false;
    setArchiveRoomFormState(`Archive room could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingArchiveRoomId ? 'Archive room updated successfully.' : 'Archive room created successfully.';
  hideArchiveRoomForm();
  await refreshArchiveRooms(successMessage);
}

async function toggleArchiveRoomActive(row, button) {
  const archiveRoomId = getArchiveRoomId(row);
  const supabase = getSupabaseClient();

  if (!archiveRoomId) {
    setArchiveRoomsState('This archive room cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setArchiveRoomsState('Archive rooms cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextActiveState = !getArchiveRoomActiveBoolean(row);
  const { error } = await supabase
    .from('archive_rooms')
    .update({ is_active: nextActiveState })
    .eq('id', archiveRoomId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setArchiveRoomsState(`Active state could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshArchiveRooms(nextActiveState ? 'Archive room activated.' : 'Archive room deactivated.');
}

function renderArtifactRows(rows) {
  artifactsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendTextCell(tableRow, 'Artifact Key', getArtifactKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Title', getArtifactTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Element', getArtifactElement(row));
    appendTextCell(tableRow, 'Type', getArtifactType(row));
    appendTextCell(tableRow, 'Unlock', getArtifactUnlockMethod(row));
    appendTextCell(tableRow, 'Source', getArtifactSourceLocation(row));
    appendTextCell(tableRow, 'Active', getArtifactActiveState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showArtifactDetail(index));

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showArtifactForm(row));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getArtifactActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleArtifactActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(viewButton, editButton, activeButton);
    actionCell.append(actionGroup);
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
  appendDetailField(artifactDetailFields, 'Name', getArtifactName(row));
  appendDetailField(artifactDetailFields, 'Element', getArtifactElement(row));
  appendDetailField(artifactDetailFields, 'Artifact Type', getArtifactType(row));
  appendDetailField(artifactDetailFields, 'Unlock Method', getArtifactUnlockMethod(row));
  appendDetailField(artifactDetailFields, 'Source Location', getArtifactSourceLocation(row));
  appendDetailField(artifactDetailFields, 'Image URL', getArtifactImageUrl(row));
  appendDetailField(artifactDetailFields, 'Active', getArtifactActiveState(row));
  appendDetailField(artifactDetailFields, 'Sort Order', getArtifactSortOrder(row));
  appendDetailField(artifactDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(artifactDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(artifactDetailFields, 'Metadata', formatJsonValue(getArtifactMetadata(row)));

  artifactDetail.hidden = false;
  artifactDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setArtifactFormValue(fieldName, value) {
  const field = artifactForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function showArtifactForm(row = null) {
  hideArtifactDetail();
  hideArtifactFormState();
  artifactForm.reset();

  if (row) {
    editingArtifactId = getArtifactId(row);
    artifactFormTitle.textContent = 'Edit Artifact';
    artifactFormSubmitButton.textContent = 'Save Changes';
    setArtifactFormValue('artifact_key', getArtifactKey(row));
    setArtifactFormValue('title', getArtifactTitle(row));
    setArtifactFormValue('name', getArtifactName(row));
    setArtifactFormValue('element', getArtifactElement(row));
    setArtifactFormValue('artifact_type', getArtifactType(row));
    setArtifactFormValue('description', getArtifactDescription(row));
    setArtifactFormValue('unlock_method', getArtifactUnlockMethod(row));
    setArtifactFormValue('source_location', getArtifactSourceLocation(row));
    setArtifactFormValue('image_url', getArtifactImageUrl(row));
    setArtifactFormValue('is_active', getArtifactActiveBoolean(row));
    setArtifactFormValue('sort_order', getArtifactSortOrder(row));
    setArtifactFormValue('metadata', formatJsonValue(getArtifactMetadata(row), ''));
  } else {
    editingArtifactId = null;
    artifactFormTitle.textContent = 'New Artifact';
    artifactFormSubmitButton.textContent = 'Create Artifact';
  }

  artifactFormPanel.hidden = false;
  artifactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getArtifactFormPayload() {
  const formData = new FormData(artifactForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const metadataValue = String(formData.get('metadata') || '').trim();
  const payload = {
    artifact_key: String(formData.get('artifact_key') || '').trim(),
    title: String(formData.get('title') || '').trim() || null,
    name: String(formData.get('name') || '').trim() || null,
    element: String(formData.get('element') || '').trim() || null,
    artifact_type: String(formData.get('artifact_type') || '').trim() || null,
    description: String(formData.get('description') || '').trim() || null,
    unlock_method: String(formData.get('unlock_method') || '').trim() || null,
    source_location: String(formData.get('source_location') || '').trim() || null,
    image_url: String(formData.get('image_url') || '').trim() || null,
    is_active: formData.has('is_active'),
  };

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  if (metadataValue) {
    try {
      payload.metadata = JSON.parse(metadataValue);
    } catch {
      return { payload, error: 'Metadata must be valid JSON.' };
    }
  } else {
    payload.metadata = null;
  }

  return { payload, error: '' };
}

function validateArtifactPayload(payload) {
  const missingFields = [];

  if (!payload.artifact_key) {
    missingFields.push('artifact_key');
  }

  if (!payload.title && !payload.name) {
    missingFields.push('title or name');
  }

  return missingFields;
}

async function artifactKeyExists(supabase, artifactKey) {
  const { data, error } = await supabase
    .from('artifacts')
    .select('id')
    .eq('artifact_key', artifactKey)
    .limit(1)
    .maybeSingle();

  if (error) {
    return { exists: false, error };
  }

  return { exists: Boolean(data), error: null };
}

async function refreshArtifacts(message = '') {
  artifactsLoaded = false;
  hideArtifactDetail();
  await loadArtifacts();

  if (message) {
    setArtifactsState(message, 'success');
  }
}

async function handleArtifactFormSubmit(event) {
  event.preventDefault();

  const { payload, error: parseError } = getArtifactFormPayload();

  if (parseError) {
    setArtifactFormState(parseError, 'error');
    return;
  }

  const missingFields = validateArtifactPayload(payload);

  if (missingFields.length) {
    setArtifactFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setArtifactFormState('Artifacts cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  artifactFormSubmitButton.disabled = true;
  setArtifactFormState(editingArtifactId ? 'Saving artifact changes...' : 'Creating artifact...');

  if (!editingArtifactId) {
    const { exists, error } = await artifactKeyExists(supabase, payload.artifact_key);

    if (error) {
      artifactFormSubmitButton.disabled = false;
      setArtifactFormState(`Artifact key could not be checked. ${error.message || 'Please try again later.'}`, 'error');
      return;
    }

    if (exists) {
      artifactFormSubmitButton.disabled = false;
      setArtifactFormState('An artifact with this artifact_key already exists.', 'error');
      return;
    }
  }

  const query = editingArtifactId
    ? supabase.from('artifacts').update(payload).eq('id', editingArtifactId).select('*').single()
    : supabase.from('artifacts').insert(payload).select('*').single();

  const { error } = await query;

  if (error) {
    artifactFormSubmitButton.disabled = false;
    setArtifactFormState(`Artifact could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingArtifactId ? 'Artifact updated successfully.' : 'Artifact created successfully.';
  hideArtifactForm();
  await refreshArtifacts(successMessage);
}

async function toggleArtifactActive(row, button) {
  const artifactId = getArtifactId(row);
  const supabase = getSupabaseClient();

  if (!artifactId) {
    setArtifactsState('This artifact cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setArtifactsState('Artifacts cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextActiveState = !getArtifactActiveBoolean(row);
  const { error } = await supabase
    .from('artifacts')
    .update({ is_active: nextActiveState })
    .eq('id', artifactId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setArtifactsState(`Active state could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshArtifacts(nextActiveState ? 'Artifact activated.' : 'Artifact deactivated.');
}

function renderMemoryFragmentRows(rows) {
  memoryFragmentsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendTextCell(tableRow, 'Fragment Key', getMemoryFragmentKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Title', getMemoryFragmentTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Type', getMemoryFragmentType(row));
    appendTextCell(tableRow, 'Sequence', getMemoryFragmentSequence(row));
    appendTextCell(tableRow, 'Room', getMemoryFragmentRoomKey(row));
    appendTextCell(tableRow, 'Artifact', getMemoryFragmentArtifactKey(row));
    appendTextCell(tableRow, 'Active', getMemoryFragmentActiveState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showMemoryFragmentDetail(index));

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showMemoryFragmentForm(row));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getMemoryFragmentActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleMemoryFragmentActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(viewButton, editButton);

    if (Object.prototype.hasOwnProperty.call(row, 'is_active')) {
      actionGroup.append(activeButton);
    }

    actionCell.append(actionGroup);
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
  memoryFragmentDetailBody.textContent = getMemoryFragmentBody(row);

  appendDetailChip(memoryFragmentDetailMeta, 'Type', getMemoryFragmentType(row));
  appendDetailChip(memoryFragmentDetailMeta, 'Sequence', getMemoryFragmentSequence(row));
  appendDetailChip(memoryFragmentDetailMeta, 'Fragment Key', getMemoryFragmentKey(row));
  appendDetailChip(memoryFragmentDetailMeta, 'Active', getMemoryFragmentActiveState(row));
  appendDetailField(memoryFragmentDetailFields, 'Fragment Key', getMemoryFragmentKey(row));
  appendDetailField(memoryFragmentDetailFields, 'Name', getMemoryFragmentName(row));
  appendDetailField(memoryFragmentDetailFields, 'Fragment Type', getMemoryFragmentType(row));
  appendDetailField(memoryFragmentDetailFields, 'Sequence Number', getMemoryFragmentSequence(row));
  appendDetailField(memoryFragmentDetailFields, 'Related Room Key', getMemoryFragmentRoomKey(row));
  appendDetailField(memoryFragmentDetailFields, 'Related Artifact Key', getMemoryFragmentArtifactKey(row));
  appendDetailField(memoryFragmentDetailFields, 'Description', getMemoryFragmentDescription(row));
  appendDetailField(memoryFragmentDetailFields, 'Image URL', getMemoryFragmentImageUrl(row));
  appendDetailField(memoryFragmentDetailFields, 'Active', getMemoryFragmentActiveState(row));
  appendDetailField(memoryFragmentDetailFields, 'Sort Order', getMemoryFragmentSortOrder(row));
  appendDetailField(memoryFragmentDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(memoryFragmentDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(memoryFragmentDetailFields, 'Metadata', formatJsonValue(getMemoryFragmentMetadata(row)));

  memoryFragmentDetail.hidden = false;
  memoryFragmentDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setMemoryFragmentFormValue(fieldName, value) {
  const field = memoryFragmentForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function setDatalistOptions(datalist, values) {
  if (!datalist) {
    return;
  }

  datalist.replaceChildren();
  [...new Set(values.filter((value) => value && value !== '--'))].sort().forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    datalist.append(option);
  });
}

function updateMemoryFragmentRelationOptions() {
  setDatalistOptions(memoryFragmentRoomOptions, archiveRoomRows.map((row) => getArchiveRoomKey(row)));
  setDatalistOptions(memoryFragmentArtifactOptions, artifactRows.map((row) => getArtifactKey(row)));
}

function showMemoryFragmentForm(row = null) {
  hideMemoryFragmentDetail();
  hideMemoryFragmentFormState();
  memoryFragmentForm.reset();
  updateMemoryFragmentRelationOptions();

  if (row) {
    editingMemoryFragmentId = getMemoryFragmentId(row);
    memoryFragmentFormTitle.textContent = 'Edit Memory Fragment';
    memoryFragmentFormSubmitButton.textContent = 'Save Changes';
    setMemoryFragmentFormValue('fragment_key', getMemoryFragmentKey(row));
    setMemoryFragmentFormValue('title', getMemoryFragmentTitle(row));
    setMemoryFragmentFormValue('name', getMemoryFragmentName(row));
    setMemoryFragmentFormValue('fragment_type', getMemoryFragmentType(row));
    setMemoryFragmentFormValue('sequence_number', getMemoryFragmentSequence(row));
    setMemoryFragmentFormValue('related_room_key', getMemoryFragmentRoomKey(row));
    setMemoryFragmentFormValue('related_artifact_key', getMemoryFragmentArtifactKey(row));
    setMemoryFragmentFormValue('description', getMemoryFragmentDescription(row));
    setMemoryFragmentFormValue('body', getMemoryFragmentBody(row));
    setMemoryFragmentFormValue('image_url', getMemoryFragmentImageUrl(row));
    setMemoryFragmentFormValue('is_active', getMemoryFragmentActiveBoolean(row));
    setMemoryFragmentFormValue('sort_order', getMemoryFragmentSortOrder(row));
    setMemoryFragmentFormValue('metadata', formatJsonValue(getMemoryFragmentMetadata(row), ''));
  } else {
    editingMemoryFragmentId = null;
    memoryFragmentFormTitle.textContent = 'New Memory Fragment';
    memoryFragmentFormSubmitButton.textContent = 'Create Memory Fragment';
  }

  memoryFragmentFormPanel.hidden = false;
  memoryFragmentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getMemoryFragmentFormPayload() {
  const formData = new FormData(memoryFragmentForm);
  const sequenceNumberValue = String(formData.get('sequence_number') || '').trim();
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const metadataValue = String(formData.get('metadata') || '').trim();
  const payload = {
    fragment_key: String(formData.get('fragment_key') || '').trim(),
    title: String(formData.get('title') || '').trim() || null,
    name: String(formData.get('name') || '').trim() || null,
    fragment_type: String(formData.get('fragment_type') || '').trim() || null,
    related_room_key: String(formData.get('related_room_key') || '').trim() || null,
    related_artifact_key: String(formData.get('related_artifact_key') || '').trim() || null,
    description: String(formData.get('description') || '').trim() || null,
    body: String(formData.get('body') || '').trim() || null,
    image_url: String(formData.get('image_url') || '').trim() || null,
    is_active: formData.has('is_active'),
  };

  if (sequenceNumberValue !== '') {
    const sequenceNumber = Number(sequenceNumberValue);

    if (!Number.isNaN(sequenceNumber)) {
      payload.sequence_number = sequenceNumber;
    }
  }

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  if (metadataValue) {
    try {
      payload.metadata = JSON.parse(metadataValue);
    } catch {
      return { payload, error: 'Metadata must be valid JSON.' };
    }
  } else {
    payload.metadata = null;
  }

  return { payload, error: '' };
}

function validateMemoryFragmentPayload(payload) {
  const missingFields = [];

  if (!payload.fragment_key) {
    missingFields.push('fragment_key');
  }

  if (!payload.title && !payload.name) {
    missingFields.push('title or name');
  }

  return missingFields;
}

function getMissingSchemaColumn(error, tableName) {
  const message = error?.message || '';
  const tableColumnMatch = message.match(new RegExp(`'([^']+)' column of '${tableName}'`));
  const schemaCacheMatch = message.match(/Could not find the '([^']+)' column/);
  const match = tableColumnMatch || schemaCacheMatch;

  return match?.[1] || '';
}

async function runMemoryFragmentMutation(supabase, payload) {
  let nextPayload = { ...payload };

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const query = editingMemoryFragmentId
      ? supabase.from('memory_fragments').update(nextPayload).eq('id', editingMemoryFragmentId).select('*').single()
      : supabase.from('memory_fragments').insert(nextPayload).select('*').single();
    const { error } = await query;

    if (!error) {
      return { error: null };
    }

    const missingColumn = getMissingSchemaColumn(error, 'memory_fragments');

    if (!missingColumn || !Object.prototype.hasOwnProperty.call(nextPayload, missingColumn)) {
      return { error };
    }

    const { [missingColumn]: _removedColumn, ...prunedPayload } = nextPayload;
    nextPayload = prunedPayload;
  }

  return { error: new Error('Memory fragment could not be saved because too many optional fields are unavailable.') };
}

async function memoryFragmentKeyExists(supabase, fragmentKey) {
  let query = supabase
    .from('memory_fragments')
    .select('id')
    .eq('fragment_key', fragmentKey)
    .limit(1);

  if (editingMemoryFragmentId) {
    query = query.neq('id', editingMemoryFragmentId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return { exists: false, error };
  }

  return { exists: Boolean(data), error: null };
}

async function refreshMemoryFragments(message = '') {
  memoryFragmentsLoaded = false;
  hideMemoryFragmentDetail();
  await loadMemoryFragments();

  if (message) {
    setMemoryFragmentsState(message, 'success');
  }
}

async function handleMemoryFragmentFormSubmit(event) {
  event.preventDefault();

  const { payload, error: parseError } = getMemoryFragmentFormPayload();

  if (parseError) {
    setMemoryFragmentFormState(parseError, 'error');
    return;
  }

  const missingFields = validateMemoryFragmentPayload(payload);

  if (missingFields.length) {
    setMemoryFragmentFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setMemoryFragmentFormState('Memory fragments cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  memoryFragmentFormSubmitButton.disabled = true;
  setMemoryFragmentFormState(editingMemoryFragmentId ? 'Saving memory fragment changes...' : 'Creating memory fragment...');

  const { exists, error: duplicateError } = await memoryFragmentKeyExists(supabase, payload.fragment_key);

  if (duplicateError) {
    memoryFragmentFormSubmitButton.disabled = false;
    setMemoryFragmentFormState(`Fragment key could not be checked. ${duplicateError.message || 'Please try again later.'}`, 'error');
    return;
  }

  if (exists) {
    memoryFragmentFormSubmitButton.disabled = false;
    setMemoryFragmentFormState('A memory fragment with this fragment_key already exists.', 'error');
    return;
  }

  const { error } = await runMemoryFragmentMutation(supabase, payload);

  if (error) {
    memoryFragmentFormSubmitButton.disabled = false;
    setMemoryFragmentFormState(`Memory fragment could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingMemoryFragmentId ? 'Memory fragment updated successfully.' : 'Memory fragment created successfully.';
  hideMemoryFragmentForm();
  await refreshMemoryFragments(successMessage);
}

async function toggleMemoryFragmentActive(row, button) {
  const memoryFragmentId = getMemoryFragmentId(row);
  const supabase = getSupabaseClient();

  if (!Object.prototype.hasOwnProperty.call(row, 'is_active')) {
    setMemoryFragmentsState('Active state is not available for this memory fragment table.', 'error');
    return;
  }

  if (!memoryFragmentId) {
    setMemoryFragmentsState('This memory fragment cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setMemoryFragmentsState('Memory fragments cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextActiveState = !getMemoryFragmentActiveBoolean(row);
  const { error } = await supabase
    .from('memory_fragments')
    .update({ is_active: nextActiveState })
    .eq('id', memoryFragmentId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setMemoryFragmentsState(`Active state could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshMemoryFragments(nextActiveState ? 'Memory fragment activated.' : 'Memory fragment deactivated.');
}

function renderVeilwalkerNoteRows(rows) {
  veilwalkerNotesTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const hiddenButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendTextCell(tableRow, 'Note Key', getVeilwalkerNoteKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Title', getVeilwalkerNoteTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Veilwalker', getVeilwalkerNoteVeilwalkerKey(row));
    appendTextCell(tableRow, 'Type', getVeilwalkerNoteType(row));
    appendTextCell(tableRow, 'Mode', getVeilwalkerNoteMode(row));
    appendTextCell(tableRow, 'Hidden', getVeilwalkerNoteHiddenState(row));
    appendTextCell(tableRow, 'Active', getVeilwalkerNoteActiveState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showVeilwalkerNoteDetail(index));

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showVeilwalkerNoteForm(row));

    hiddenButton.className = 'admin-row-action';
    hiddenButton.type = 'button';
    hiddenButton.textContent = getVeilwalkerNoteHiddenBoolean(row) ? 'Show' : 'Hide';
    hiddenButton.addEventListener('click', () => toggleVeilwalkerNoteHidden(row, hiddenButton));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getVeilwalkerNoteActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleVeilwalkerNoteActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(viewButton, editButton);

    if (Object.prototype.hasOwnProperty.call(row, 'is_hidden')) {
      actionGroup.append(hiddenButton);
    }

    if (Object.prototype.hasOwnProperty.call(row, 'is_active')) {
      actionGroup.append(activeButton);
    }

    actionCell.append(actionGroup);
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
  appendDetailField(veilwalkerNoteDetailFields, 'Sort Order', getVeilwalkerNoteSortOrder(row));
  appendDetailField(veilwalkerNoteDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(veilwalkerNoteDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(veilwalkerNoteDetailFields, 'Metadata', formatJsonValue(getVeilwalkerNoteMetadata(row)));

  veilwalkerNoteDetail.hidden = false;
  veilwalkerNoteDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setVeilwalkerNoteFormValue(fieldName, value) {
  const field = veilwalkerNoteForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function updateVeilwalkerNoteRelationOptions() {
  setDatalistOptions(veilwalkerNoteVeilwalkerOptions, veilwalkerRows.map((row) => getVeilwalkerKey(row)));
}

function showVeilwalkerNoteForm(row = null) {
  hideVeilwalkerNoteDetail();
  hideVeilwalkerNoteFormState();
  veilwalkerNoteForm.reset();
  updateVeilwalkerNoteRelationOptions();

  if (row) {
    editingVeilwalkerNoteId = getVeilwalkerNoteId(row);
    veilwalkerNoteFormTitle.textContent = 'Edit Veilwalker Note';
    veilwalkerNoteFormSubmitButton.textContent = 'Save Changes';
    setVeilwalkerNoteFormValue('note_key', getVeilwalkerNoteKey(row));
    setVeilwalkerNoteFormValue('veilwalker_key', getVeilwalkerNoteVeilwalkerKey(row));
    setVeilwalkerNoteFormValue('title', getVeilwalkerNoteTitle(row));
    setVeilwalkerNoteFormValue('note_type', getVeilwalkerNoteType(row));
    setVeilwalkerNoteFormValue('mode_key', getVeilwalkerNoteMode(row));
    setVeilwalkerNoteFormValue('source_location', getVeilwalkerNoteSourceLocation(row));
    setVeilwalkerNoteFormValue('sort_order', getVeilwalkerNoteSortOrder(row));
    setVeilwalkerNoteFormValue('is_hidden', getVeilwalkerNoteHiddenBoolean(row));
    setVeilwalkerNoteFormValue('is_active', getVeilwalkerNoteActiveBoolean(row));
    setVeilwalkerNoteFormValue('body', getVeilwalkerNoteBody(row));
    setVeilwalkerNoteFormValue('metadata', formatJsonValue(getVeilwalkerNoteMetadata(row), ''));
  } else {
    editingVeilwalkerNoteId = null;
    veilwalkerNoteFormTitle.textContent = 'New Veilwalker Note';
    veilwalkerNoteFormSubmitButton.textContent = 'Create Veilwalker Note';
  }

  veilwalkerNoteFormPanel.hidden = false;
  veilwalkerNoteForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getVeilwalkerNoteFormPayload() {
  const formData = new FormData(veilwalkerNoteForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const metadataValue = String(formData.get('metadata') || '').trim();
  const payload = {
    note_key: String(formData.get('note_key') || '').trim(),
    veilwalker_key: String(formData.get('veilwalker_key') || '').trim() || null,
    title: String(formData.get('title') || '').trim(),
    note_type: String(formData.get('note_type') || '').trim() || null,
    mode_key: String(formData.get('mode_key') || '').trim() || null,
    source_location: String(formData.get('source_location') || '').trim() || null,
    body: String(formData.get('body') || '').trim(),
    is_hidden: formData.has('is_hidden'),
    is_active: formData.has('is_active'),
  };

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  if (metadataValue) {
    try {
      payload.metadata = JSON.parse(metadataValue);
    } catch {
      return { payload, error: 'Metadata must be valid JSON.' };
    }
  } else {
    payload.metadata = null;
  }

  return { payload, error: '' };
}

function validateVeilwalkerNotePayload(payload) {
  const missingFields = [];

  if (!payload.note_key) {
    missingFields.push('note_key');
  }

  if (!payload.title) {
    missingFields.push('title');
  }

  if (!payload.body) {
    missingFields.push('body');
  }

  return missingFields;
}

async function runVeilwalkerNoteMutation(supabase, payload) {
  let nextPayload = { ...payload };

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const query = editingVeilwalkerNoteId
      ? supabase.from('veilwalker_notes').update(nextPayload).eq('id', editingVeilwalkerNoteId).select('*').single()
      : supabase.from('veilwalker_notes').insert(nextPayload).select('*').single();
    const { error } = await query;

    if (!error) {
      return { error: null };
    }

    const missingColumn = getMissingSchemaColumn(error, 'veilwalker_notes');

    if (!missingColumn || !Object.prototype.hasOwnProperty.call(nextPayload, missingColumn)) {
      return { error };
    }

    const { [missingColumn]: _removedColumn, ...prunedPayload } = nextPayload;
    nextPayload = prunedPayload;
  }

  return { error: new Error('Veilwalker note could not be saved because too many optional fields are unavailable.') };
}

async function veilwalkerNoteKeyExists(supabase, noteKey) {
  let query = supabase
    .from('veilwalker_notes')
    .select('id')
    .eq('note_key', noteKey)
    .limit(1);

  if (editingVeilwalkerNoteId) {
    query = query.neq('id', editingVeilwalkerNoteId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return { exists: false, error };
  }

  return { exists: Boolean(data), error: null };
}

async function refreshVeilwalkerNotes(message = '') {
  veilwalkerNotesLoaded = false;
  hideVeilwalkerNoteDetail();
  await loadVeilwalkerNotes();

  if (message) {
    setVeilwalkerNotesState(message, 'success');
  }
}

async function handleVeilwalkerNoteFormSubmit(event) {
  event.preventDefault();

  const { payload, error: parseError } = getVeilwalkerNoteFormPayload();

  if (parseError) {
    setVeilwalkerNoteFormState(parseError, 'error');
    return;
  }

  const missingFields = validateVeilwalkerNotePayload(payload);

  if (missingFields.length) {
    setVeilwalkerNoteFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setVeilwalkerNoteFormState('Veilwalker notes cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  veilwalkerNoteFormSubmitButton.disabled = true;
  setVeilwalkerNoteFormState(editingVeilwalkerNoteId ? 'Saving veilwalker note changes...' : 'Creating veilwalker note...');

  const { exists, error: duplicateError } = await veilwalkerNoteKeyExists(supabase, payload.note_key);

  if (duplicateError) {
    veilwalkerNoteFormSubmitButton.disabled = false;
    setVeilwalkerNoteFormState(`Note key could not be checked. ${duplicateError.message || 'Please try again later.'}`, 'error');
    return;
  }

  if (exists) {
    veilwalkerNoteFormSubmitButton.disabled = false;
    setVeilwalkerNoteFormState('A veilwalker note with this note_key already exists.', 'error');
    return;
  }

  const { error } = await runVeilwalkerNoteMutation(supabase, payload);

  if (error) {
    veilwalkerNoteFormSubmitButton.disabled = false;
    setVeilwalkerNoteFormState(`Veilwalker note could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingVeilwalkerNoteId ? 'Veilwalker note updated successfully.' : 'Veilwalker note created successfully.';
  hideVeilwalkerNoteForm();
  await refreshVeilwalkerNotes(successMessage);
}

async function toggleVeilwalkerNoteBoolean(row, button, fieldName, getCurrentValue, enabledMessage, disabledMessage) {
  const veilwalkerNoteId = getVeilwalkerNoteId(row);
  const supabase = getSupabaseClient();

  if (!Object.prototype.hasOwnProperty.call(row, fieldName)) {
    setVeilwalkerNotesState(`${fieldName} is not available for this veilwalker notes table.`, 'error');
    return;
  }

  if (!veilwalkerNoteId) {
    setVeilwalkerNotesState('This veilwalker note cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setVeilwalkerNotesState('Veilwalker notes cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextValue = !getCurrentValue(row);
  const { error } = await supabase
    .from('veilwalker_notes')
    .update({ [fieldName]: nextValue })
    .eq('id', veilwalkerNoteId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setVeilwalkerNotesState(`Veilwalker note could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshVeilwalkerNotes(nextValue ? enabledMessage : disabledMessage);
}

async function toggleVeilwalkerNoteHidden(row, button) {
  await toggleVeilwalkerNoteBoolean(row, button, 'is_hidden', getVeilwalkerNoteHiddenBoolean, 'Veilwalker note hidden.', 'Veilwalker note visible.');
}

async function toggleVeilwalkerNoteActive(row, button) {
  await toggleVeilwalkerNoteBoolean(row, button, 'is_active', getVeilwalkerNoteActiveBoolean, 'Veilwalker note activated.', 'Veilwalker note deactivated.');
}

function renderVeilwalkerRows(rows) {
  veilwalkersTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendTextCell(tableRow, 'Key', getVeilwalkerKey(row), 'admin-table__muted');
    appendTextCell(tableRow, 'Name', getVeilwalkerName(row), 'admin-table__title');
    appendTextCell(tableRow, 'Zodiac', getVeilwalkerZodiac(row));
    appendTextCell(tableRow, 'Element', getVeilwalkerElement(row));
    appendTextCell(tableRow, 'Title', getVeilwalkerTitle(row));
    appendTextCell(tableRow, 'Mode', getVeilwalkerMode(row));
    appendTextCell(tableRow, 'Active', getVeilwalkerActiveState(row));
    appendTextCell(tableRow, 'Sort', getVeilwalkerSortOrder(row));

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showVeilwalkerDetail(index));

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showVeilwalkerForm(row));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getVeilwalkerActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleVeilwalkerActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(viewButton, editButton);

    if (Object.prototype.hasOwnProperty.call(row, 'is_active')) {
      actionGroup.append(activeButton);
    }

    actionCell.append(actionGroup);
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
  appendDetailField(veilwalkerDetailFields, 'Theme Mode', getVeilwalkerThemeMode(row));
  appendDetailField(veilwalkerDetailFields, 'Form Key', getVeilwalkerFormKey(row));
  appendDetailField(veilwalkerDetailFields, 'Form Label', getVeilwalkerFormLabel(row));
  appendDetailField(veilwalkerDetailFields, 'Element', getVeilwalkerElement(row));
  appendDetailField(veilwalkerDetailFields, 'Symbol', getVeilwalkerSymbol(row));
  appendDetailField(veilwalkerDetailFields, 'Accent Color', getVeilwalkerAccentColor(row));
  appendDetailField(veilwalkerDetailFields, 'Glow Color', getVeilwalkerGlowColor(row));
  appendDetailField(veilwalkerDetailFields, 'Title', getVeilwalkerTitle(row));
  appendDetailField(veilwalkerDetailFields, 'Short Quote', getVeilwalkerTagline(row));
  appendDetailField(veilwalkerDetailFields, 'Card Description', getVeilwalkerCardDescription(row));
  appendDetailField(veilwalkerDetailFields, 'Focus Label', getVeilwalkerFocusLabel(row));
  appendDetailField(veilwalkerDetailFields, 'Focus Text', getVeilwalkerFocus(row));
  appendDetailField(veilwalkerDetailFields, 'Traits', getVeilwalkerTraits(row));
  appendDetailField(veilwalkerDetailFields, 'Mode', getVeilwalkerMode(row));
  appendDetailField(veilwalkerDetailFields, 'Reading Enabled', getVeilwalkerReadingEnabledState(row));
  appendDetailField(veilwalkerDetailFields, 'Reading Style', getVeilwalkerReadingStyle(row));
  appendDetailField(veilwalkerDetailFields, 'Has Profile Note', getVeilwalkerHasProfileNoteState(row));
  appendDetailField(veilwalkerDetailFields, 'Profile Note Key', getVeilwalkerProfileNoteKey(row));
  appendDetailField(veilwalkerDetailFields, 'Mystery', getVeilwalkerMysteryState(row));
  appendDetailField(veilwalkerDetailFields, 'Active', getVeilwalkerActiveState(row));
  appendDetailField(veilwalkerDetailFields, 'Sort Order', getVeilwalkerSortOrder(row));
  appendDetailField(veilwalkerDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(veilwalkerDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));
  appendDetailField(veilwalkerDetailFields, 'Metadata', formatValue(getFirstValue(row, ['metadata', 'meta', 'settings'])));

  appendImagePreview(veilwalkerDetailImages, 'Card Image URL', getVeilwalkerCardImageUrl(row));
  appendImagePreview(veilwalkerDetailImages, 'Profile Image URL', getVeilwalkerProfileImageUrl(row));
  appendImagePreview(veilwalkerDetailImages, 'Image URL', getVeilwalkerImageValue(row, 'image_url'));
  appendImagePreview(veilwalkerDetailImages, 'Phase 1 Image', getVeilwalkerImageValue(row, 'phase1_image'));
  appendImagePreview(veilwalkerDetailImages, 'Phase 2 Image', getVeilwalkerImageValue(row, 'phase2_image'));
  appendImagePreview(veilwalkerDetailImages, 'Blood Moon Image', getVeilwalkerImageValue(row, 'blood_moon_image'));

  veilwalkerDetail.hidden = false;
  veilwalkerDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatTraitsForForm(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }

  return value && value !== '--' ? String(value) : '';
}

function parseVeilwalkerTraits(value) {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    return { value: null, error: '' };
  }

  if (trimmedValue.startsWith('[') || trimmedValue.startsWith('{')) {
    try {
      return { value: JSON.parse(trimmedValue), error: '' };
    } catch {
      return { value: trimmedValue, error: 'Traits must be valid JSON when they start with [ or {.' };
    }
  }

  return {
    value: trimmedValue
      .split(',')
      .map((trait) => trait.trim())
      .filter(Boolean),
    error: '',
  };
}

function setVeilwalkerFormValue(fieldName, value) {
  const field = veilwalkerForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function updateVeilwalkerProfileNoteOptions() {
  setDatalistOptions(veilwalkerProfileNoteOptions, veilwalkerNoteRows.map((row) => getVeilwalkerNoteKey(row)));
}

function showVeilwalkerForm(row = null) {
  hideVeilwalkerDetail();
  hideVeilwalkerFormState();
  veilwalkerForm.reset();
  updateVeilwalkerProfileNoteOptions();

  if (row) {
    editingVeilwalkerId = getVeilwalkerId(row);
    veilwalkerFormTitle.textContent = 'Edit Veilwalker';
    veilwalkerFormSubmitButton.textContent = 'Save Changes';
    setVeilwalkerFormValue('veilwalker_key', getVeilwalkerKey(row));
    setVeilwalkerFormValue('zodiac_key', getVeilwalkerZodiac(row));
    setVeilwalkerFormValue('theme_mode', getVeilwalkerThemeMode(row));
    setVeilwalkerFormValue('form_key', getVeilwalkerFormKey(row));
    setVeilwalkerFormValue('display_name', getVeilwalkerName(row));
    setVeilwalkerFormValue('form_label', getVeilwalkerFormLabel(row));
    setVeilwalkerFormValue('element', getVeilwalkerElement(row));
    setVeilwalkerFormValue('symbol', getVeilwalkerSymbol(row));
    setVeilwalkerFormValue('accent_color', getVeilwalkerAccentColor(row));
    setVeilwalkerFormValue('glow_color', getVeilwalkerGlowColor(row));
    setVeilwalkerFormValue('card_image_url', getVeilwalkerCardImageUrl(row));
    setVeilwalkerFormValue('profile_image_url', getVeilwalkerProfileImageUrl(row));
    setVeilwalkerFormValue('short_quote', getVeilwalkerTagline(row));
    setVeilwalkerFormValue('card_description', getVeilwalkerCardDescription(row));
    setVeilwalkerFormValue('profile_title', getVeilwalkerTitle(row));
    setVeilwalkerFormValue('profile_body', getVeilwalkerDescription(row));
    setVeilwalkerFormValue('focus_label', getVeilwalkerFocusLabel(row));
    setVeilwalkerFormValue('focus_text', getVeilwalkerFocus(row));
    setVeilwalkerFormValue('traits', formatTraitsForForm(getFirstValue(row, ['traits', 'trait_list'])));
    setVeilwalkerFormValue('reading_enabled', getVeilwalkerReadingEnabledBoolean(row));
    setVeilwalkerFormValue('reading_style', getVeilwalkerReadingStyle(row));
    setVeilwalkerFormValue('has_profile_note', getVeilwalkerHasProfileNoteBoolean(row));
    setVeilwalkerFormValue('profile_note_key', getVeilwalkerProfileNoteKey(row));
    setVeilwalkerFormValue('is_mystery', getVeilwalkerMysteryBoolean(row));
    setVeilwalkerFormValue('is_active', getVeilwalkerActiveBoolean(row));
    setVeilwalkerFormValue('sort_order', getVeilwalkerSortOrder(row));
  } else {
    editingVeilwalkerId = null;
    veilwalkerFormTitle.textContent = 'New Veilwalker';
    veilwalkerFormSubmitButton.textContent = 'Create Veilwalker';
  }

  veilwalkerFormPanel.hidden = false;
  veilwalkerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getVeilwalkerFormPayload() {
  const formData = new FormData(veilwalkerForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const { value: traitsValue, error: traitsError } = parseVeilwalkerTraits(formData.get('traits'));
  const payload = {
    veilwalker_key: String(formData.get('veilwalker_key') || '').trim(),
    zodiac_key: String(formData.get('zodiac_key') || '').trim(),
    theme_mode: String(formData.get('theme_mode') || '').trim() || null,
    form_key: String(formData.get('form_key') || '').trim() || null,
    display_name: String(formData.get('display_name') || '').trim(),
    form_label: String(formData.get('form_label') || '').trim() || null,
    element: String(formData.get('element') || '').trim() || null,
    symbol: String(formData.get('symbol') || '').trim() || null,
    accent_color: String(formData.get('accent_color') || '').trim() || null,
    glow_color: String(formData.get('glow_color') || '').trim() || null,
    card_image_url: String(formData.get('card_image_url') || '').trim() || null,
    profile_image_url: String(formData.get('profile_image_url') || '').trim() || null,
    short_quote: String(formData.get('short_quote') || '').trim() || null,
    card_description: String(formData.get('card_description') || '').trim() || null,
    profile_title: String(formData.get('profile_title') || '').trim() || null,
    profile_body: String(formData.get('profile_body') || '').trim() || null,
    focus_label: String(formData.get('focus_label') || '').trim() || null,
    focus_text: String(formData.get('focus_text') || '').trim() || null,
    traits: traitsValue,
    reading_enabled: formData.has('reading_enabled'),
    reading_style: String(formData.get('reading_style') || '').trim() || null,
    has_profile_note: formData.has('has_profile_note'),
    profile_note_key: String(formData.get('profile_note_key') || '').trim() || null,
    is_mystery: formData.has('is_mystery'),
    is_active: formData.has('is_active'),
  };

  if (traitsError) {
    return { payload, error: traitsError };
  }

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  return { payload, error: '' };
}

function validateVeilwalkerPayload(payload) {
  const missingFields = [];

  if (!payload.veilwalker_key) {
    missingFields.push('veilwalker_key');
  }

  if (!payload.zodiac_key) {
    missingFields.push('zodiac_key');
  }

  if (!payload.display_name) {
    missingFields.push('display_name');
  }

  return missingFields;
}

async function runVeilwalkerMutation(supabase, payload) {
  let nextPayload = { ...payload };

  for (let attempt = 0; attempt < 28; attempt += 1) {
    const query = editingVeilwalkerId
      ? supabase.from('veilwalkers').update(nextPayload).eq('id', editingVeilwalkerId).select('*').single()
      : supabase.from('veilwalkers').insert(nextPayload).select('*').single();
    const { error } = await query;

    if (!error) {
      return { error: null };
    }

    const missingColumn = getMissingSchemaColumn(error, 'veilwalkers');

    if (!missingColumn || !Object.prototype.hasOwnProperty.call(nextPayload, missingColumn)) {
      return { error };
    }

    const { [missingColumn]: _removedColumn, ...prunedPayload } = nextPayload;
    nextPayload = prunedPayload;
  }

  return { error: new Error('Veilwalker could not be saved because too many optional fields are unavailable.') };
}

async function veilwalkerKeyExists(supabase, veilwalkerKey) {
  let query = supabase
    .from('veilwalkers')
    .select('id')
    .eq('veilwalker_key', veilwalkerKey)
    .limit(1);

  if (editingVeilwalkerId) {
    query = query.neq('id', editingVeilwalkerId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    return { exists: false, error };
  }

  return { exists: Boolean(data), error: null };
}

async function refreshVeilwalkers(message = '') {
  veilwalkersLoaded = false;
  hideVeilwalkerDetail();
  await loadVeilwalkers();

  if (message) {
    setVeilwalkersState(message, 'success');
  }
}

async function handleVeilwalkerFormSubmit(event) {
  event.preventDefault();

  const { payload, error: parseError } = getVeilwalkerFormPayload();

  if (parseError) {
    setVeilwalkerFormState(parseError, 'error');
    return;
  }

  const missingFields = validateVeilwalkerPayload(payload);

  if (missingFields.length) {
    setVeilwalkerFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setVeilwalkerFormState('Veilwalkers cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  veilwalkerFormSubmitButton.disabled = true;
  setVeilwalkerFormState(editingVeilwalkerId ? 'Saving veilwalker changes...' : 'Creating veilwalker...');

  const { exists, error: duplicateError } = await veilwalkerKeyExists(supabase, payload.veilwalker_key);

  if (duplicateError) {
    veilwalkerFormSubmitButton.disabled = false;
    setVeilwalkerFormState(`Veilwalker key could not be checked. ${duplicateError.message || 'Please try again later.'}`, 'error');
    return;
  }

  if (exists) {
    veilwalkerFormSubmitButton.disabled = false;
    setVeilwalkerFormState('A veilwalker with this veilwalker_key already exists.', 'error');
    return;
  }

  const { error } = await runVeilwalkerMutation(supabase, payload);

  if (error) {
    veilwalkerFormSubmitButton.disabled = false;
    setVeilwalkerFormState(`Veilwalker could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingVeilwalkerId ? 'Veilwalker updated successfully.' : 'Veilwalker created successfully.';
  hideVeilwalkerForm();
  await refreshVeilwalkers(successMessage);
}

async function toggleVeilwalkerActive(row, button) {
  const veilwalkerId = getVeilwalkerId(row);
  const supabase = getSupabaseClient();

  if (!Object.prototype.hasOwnProperty.call(row, 'is_active')) {
    setVeilwalkersState('Active state is not available for this veilwalkers table.', 'error');
    return;
  }

  if (!veilwalkerId) {
    setVeilwalkersState('This veilwalker cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setVeilwalkersState('Veilwalkers cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextActiveState = !getVeilwalkerActiveBoolean(row);
  const { error } = await supabase
    .from('veilwalkers')
    .update({ is_active: nextActiveState })
    .eq('id', veilwalkerId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setVeilwalkersState(`Active state could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshVeilwalkers(nextActiveState ? 'Veilwalker activated.' : 'Veilwalker deactivated.');
}

function renderAppSettingRows(rows) {
  appSettingsTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const publicButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendTextCell(tableRow, 'Setting Key', getAppSettingKey(row), 'admin-table__title');
    appendTextCell(tableRow, 'Value', formatCompactValue(getAppSettingValue(row)));
    appendTextCell(tableRow, 'Description', getAppSettingDescription(row));
    appendTextCell(tableRow, 'Public', getAppSettingPublicState(row));
    appendTextCell(tableRow, 'Active', getAppSettingActiveState(row));
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showAppSettingDetail(index));

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showAppSettingForm(row));

    publicButton.className = 'admin-row-action';
    publicButton.type = 'button';
    publicButton.textContent = getAppSettingPublicBoolean(row) ? 'Private' : 'Public';
    publicButton.addEventListener('click', () => toggleAppSettingPublic(row, publicButton));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getAppSettingActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleAppSettingActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(viewButton, editButton);

    if (Object.prototype.hasOwnProperty.call(row, 'is_public')) {
      actionGroup.append(publicButton);
    }

    if (Object.prototype.hasOwnProperty.call(row, 'is_active')) {
      actionGroup.append(activeButton);
    }

    actionCell.append(actionGroup);
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

function setAppSettingFormValue(fieldName, value) {
  const field = appSettingForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function showAppSettingForm(row = null) {
  hideAppSettingDetail();
  hideAppSettingFormState();
  appSettingForm.reset();

  if (row) {
    editingAppSettingId = getAppSettingId(row);
    appSettingFormTitle.textContent = 'Edit Setting';
    appSettingFormSubmitButton.textContent = 'Save Changes';
    setAppSettingFormValue('setting_key', getAppSettingKey(row));
    setAppSettingFormValue('setting_value', formatJsonValue(getAppSettingValue(row), ''));
    setAppSettingFormValue('description', getAppSettingDescription(row));
    setAppSettingFormValue('is_public', getAppSettingPublicBoolean(row));
    setAppSettingFormValue('is_active', getAppSettingActiveBoolean(row));
  } else {
    editingAppSettingId = null;
    appSettingFormTitle.textContent = 'New Setting';
    appSettingFormSubmitButton.textContent = 'Create Setting';
    setAppSettingFormValue('setting_value', '{}');
  }

  appSettingFormPanel.hidden = false;
  appSettingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getAppSettingFormPayload() {
  const formData = new FormData(appSettingForm);
  const settingValueText = String(formData.get('setting_value') || '').trim();
  const payload = {
    setting_key: String(formData.get('setting_key') || '').trim(),
    description: String(formData.get('description') || '').trim() || null,
    is_public: formData.has('is_public'),
    is_active: formData.has('is_active'),
  };

  if (!settingValueText) {
    return { payload, error: 'Setting value JSON is required.' };
  }

  try {
    payload.setting_value = JSON.parse(settingValueText);
  } catch {
    return { payload, error: 'Setting value must be valid JSON.' };
  }

  return { payload, error: '' };
}

function validateAppSettingPayload(payload) {
  const missingFields = [];

  if (!payload.setting_key) {
    missingFields.push('setting_key');
  }

  if (typeof payload.setting_value === 'undefined') {
    missingFields.push('setting_value');
  }

  return missingFields;
}

async function runAppSettingMutation(supabase, payload) {
  let nextPayload = { ...payload };

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const query = editingAppSettingId
      ? supabase.from('app_settings').update(nextPayload).eq('id', editingAppSettingId).select('*').single()
      : supabase.from('app_settings').insert(nextPayload).select('*').single();
    const { error } = await query;

    if (!error) {
      return { error: null };
    }

    const missingColumn = getMissingSchemaColumn(error, 'app_settings');

    if (!missingColumn || !Object.prototype.hasOwnProperty.call(nextPayload, missingColumn)) {
      return { error };
    }

    const removedValue = nextPayload[missingColumn];
    const { [missingColumn]: _removedColumn, ...prunedPayload } = nextPayload;

    if (missingColumn === 'setting_value' && !Object.prototype.hasOwnProperty.call(prunedPayload, 'value')) {
      prunedPayload.value = removedValue;
    }

    if (missingColumn === 'setting_key' && !Object.prototype.hasOwnProperty.call(prunedPayload, 'key')) {
      prunedPayload.key = removedValue;
    }

    nextPayload = prunedPayload;
  }

  return { error: new Error('App setting could not be saved because too many optional fields are unavailable.') };
}

async function appSettingKeyExists(supabase, settingKey) {
  const keyColumns = ['setting_key', 'key'];

  for (const keyColumn of keyColumns) {
    let query = supabase
      .from('app_settings')
      .select('id')
      .eq(keyColumn, settingKey)
      .limit(1);

    if (editingAppSettingId) {
      query = query.neq('id', editingAppSettingId);
    }

    const { data, error } = await query.maybeSingle();

    if (!error) {
      return { exists: Boolean(data), error: null };
    }

    if (getMissingSchemaColumn(error, 'app_settings') !== keyColumn) {
      return { exists: false, error };
    }
  }

  return { exists: false, error: null };
}

async function refreshAppSettings(message = '') {
  appSettingsLoaded = false;
  hideAppSettingDetail();
  await loadAppSettings();

  if (message) {
    setAppSettingsState(message, 'success');
  }
}

async function handleAppSettingFormSubmit(event) {
  event.preventDefault();

  const { payload, error: parseError } = getAppSettingFormPayload();

  if (parseError) {
    setAppSettingFormState(parseError, 'error');
    return;
  }

  const missingFields = validateAppSettingPayload(payload);

  if (missingFields.length) {
    setAppSettingFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setAppSettingFormState('App settings cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  appSettingFormSubmitButton.disabled = true;
  setAppSettingFormState(editingAppSettingId ? 'Saving app setting changes...' : 'Creating app setting...');

  const { exists, error: duplicateError } = await appSettingKeyExists(supabase, payload.setting_key);

  if (duplicateError) {
    appSettingFormSubmitButton.disabled = false;
    setAppSettingFormState(`Setting key could not be checked. ${duplicateError.message || 'Please try again later.'}`, 'error');
    return;
  }

  if (exists) {
    appSettingFormSubmitButton.disabled = false;
    setAppSettingFormState('An app setting with this setting_key already exists.', 'error');
    return;
  }

  const { error } = await runAppSettingMutation(supabase, payload);

  if (error) {
    appSettingFormSubmitButton.disabled = false;
    setAppSettingFormState(`App setting could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingAppSettingId ? 'App setting updated successfully.' : 'App setting created successfully.';
  hideAppSettingForm();
  await refreshAppSettings(successMessage);
}

async function toggleAppSettingBoolean(row, button, fieldName, getCurrentValue, enabledMessage, disabledMessage) {
  const appSettingId = getAppSettingId(row);
  const supabase = getSupabaseClient();

  if (!Object.prototype.hasOwnProperty.call(row, fieldName)) {
    setAppSettingsState(`${fieldName} is not available for this app settings table.`, 'error');
    return;
  }

  if (!appSettingId) {
    setAppSettingsState('This app setting cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setAppSettingsState('App settings cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextValue = !getCurrentValue(row);
  const { error } = await supabase
    .from('app_settings')
    .update({ [fieldName]: nextValue })
    .eq('id', appSettingId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setAppSettingsState(`App setting could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshAppSettings(nextValue ? enabledMessage : disabledMessage);
}

async function toggleAppSettingPublic(row, button) {
  await toggleAppSettingBoolean(row, button, 'is_public', getAppSettingPublicBoolean, 'App setting marked public.', 'App setting marked private.');
}

async function toggleAppSettingActive(row, button) {
  await toggleAppSettingBoolean(row, button, 'is_active', getAppSettingActiveBoolean, 'App setting activated.', 'App setting deactivated.');
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
  hideJournalForm();

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

async function loadJournalPrompts() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    setJournalPromptsState('Journal prompts are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  const from = (journalPromptsCurrentPage - 1) * journalPromptsPageSize;
  const to = from + journalPromptsPageSize - 1;

  setJournalPromptsState('Loading journal prompts...');
  journalPromptsTableWrap.hidden = true;
  if (journalPromptsPagination) {
    journalPromptsPagination.hidden = true;
  }

  let query = supabase
    .from('journal_prompts')
    .select('*', { count: 'exact' })
    .order('mode', { ascending: true })
    .order('mood', { ascending: true })
    .order('prompt_type', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, to);

  query = applyJournalPromptFilters(query);

  const { data, error, count } = await query;

  if (error) {
    setJournalPromptsState('Journal prompts could not be loaded. Please try again later.', 'error');
    return;
  }

  journalPromptRows = Array.isArray(data) ? data : [];
  journalPromptsTotalCount = Number(count || 0);
  journalPromptsLoaded = true;

  if (!journalPromptRows.length && journalPromptsTotalCount > 0 && journalPromptsCurrentPage > getJournalPromptsTotalPages()) {
    journalPromptsCurrentPage = getJournalPromptsTotalPages();
    await loadJournalPrompts();
    return;
  }

  renderJournalPromptRows();
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
  hideArchiveRoomForm();

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
  hideArtifactForm();

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
  hideMemoryFragmentForm();

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
  hideVeilwalkerNoteForm();

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
  hideVeilwalkerForm();

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
  hideAppSettingForm();

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
  const availableViews = ['overview', 'journals', 'journal-prompts', 'archive-rooms', 'artifacts', 'memory-fragments', 'veilwalkers', 'veilwalker-notes', 'user-progress', 'app-settings'];
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

  if (normalizedViewName === 'journal-prompts') {
    loadJournalPrompts();
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
  journalNewButton.addEventListener('click', () => showJournalForm());
  journalForm.addEventListener('submit', handleJournalFormSubmit);
  journalFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideJournalForm);
  });
  journalPromptNewButton.addEventListener('click', () => showJournalPromptForm());
  journalPromptForm.addEventListener('submit', handleJournalPromptFormSubmit);
  journalPromptFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideJournalPromptForm);
  });
  journalPromptFilters.forEach((filter) => {
    filter.addEventListener('change', () => {
      journalPromptsCurrentPage = 1;
      journalPromptsLoaded = false;
      loadJournalPrompts();
    });
  });
  journalPromptsPageSizeSelect?.addEventListener('change', () => {
    journalPromptsPageSize = Number(journalPromptsPageSizeSelect.value) || 10;
    journalPromptsCurrentPage = 1;
    journalPromptsLoaded = false;
    loadJournalPrompts();
  });
  archiveRoomDetailCloseButton.addEventListener('click', hideArchiveRoomDetail);
  archiveRoomNewButton.addEventListener('click', () => showArchiveRoomForm());
  archiveRoomForm.addEventListener('submit', handleArchiveRoomFormSubmit);
  archiveRoomFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideArchiveRoomForm);
  });
  artifactDetailCloseButton.addEventListener('click', hideArtifactDetail);
  artifactNewButton.addEventListener('click', () => showArtifactForm());
  artifactForm.addEventListener('submit', handleArtifactFormSubmit);
  artifactFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideArtifactForm);
  });
  memoryFragmentDetailCloseButton.addEventListener('click', hideMemoryFragmentDetail);
  memoryFragmentNewButton.addEventListener('click', () => showMemoryFragmentForm());
  memoryFragmentForm.addEventListener('submit', handleMemoryFragmentFormSubmit);
  memoryFragmentFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideMemoryFragmentForm);
  });
  veilwalkerDetailCloseButton.addEventListener('click', hideVeilwalkerDetail);
  veilwalkerNewButton.addEventListener('click', () => showVeilwalkerForm());
  veilwalkerForm.addEventListener('submit', handleVeilwalkerFormSubmit);
  veilwalkerFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideVeilwalkerForm);
  });
  veilwalkerNoteDetailCloseButton.addEventListener('click', hideVeilwalkerNoteDetail);
  veilwalkerNoteNewButton.addEventListener('click', () => showVeilwalkerNoteForm());
  veilwalkerNoteForm.addEventListener('submit', handleVeilwalkerNoteFormSubmit);
  veilwalkerNoteFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideVeilwalkerNoteForm);
  });
  userProgressDetailCloseButton.addEventListener('click', hideUserProgressDetail);
  appSettingDetailCloseButton.addEventListener('click', hideAppSettingDetail);
  appSettingNewButton.addEventListener('click', () => showAppSettingForm());
  appSettingForm.addEventListener('submit', handleAppSettingFormSubmit);
  appSettingFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideAppSettingForm);
  });
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
