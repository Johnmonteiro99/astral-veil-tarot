import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';
import { clearAdminVerified, requireAdmin, requireAdminGate, signOut } from '../services/auth.js';

const countTables = [
  'profiles',
  'noctis_documents',
  'journal_prompts',
  'reader_lines',
  'contact_messages',
  'archive_rooms',
  'gallery_records',
  'artifacts',
  'memory_fragments',
  'veilwalkers',
  'veilwalker_notes',
];

const adminOverviewActivityTables = [
  { tableName: 'user_journal_entries', timestampColumns: ['updated_at', 'created_at'] },
  { tableName: 'user_readings', timestampColumns: ['created_at'] },
  { tableName: 'user_artifacts', timestampColumns: ['unlocked_at', 'created_at'] },
  { tableName: 'user_room_visits', timestampColumns: ['last_visited_at', 'first_visited_at'] },
  { tableName: 'user_gallery_recent_records', timestampColumns: ['last_viewed_at', 'created_at'] },
  { tableName: 'user_gallery_marked_records', timestampColumns: ['marked_at', 'created_at'] },
  { tableName: 'user_gallery_fragments', timestampColumns: ['collected_at', 'created_at'] },
  { tableName: 'user_noctis_saved_documents', timestampColumns: ['created_at'] },
  { tableName: 'user_profile_unlocks', timestampColumns: ['unlocked_at', 'created_at'] },
];

// Admin UI checks prevent accidental access in the browser; all admin writes
// must also be protected by Supabase RLS/public.is_admin() policies.

const characterLineModes = ['sun', 'moon', 'bloodMoon', 'blueMoon', 'all'];
const characterLineContexts = [
  'reading_intro',
  'post_reading',
  'deck_intro',
  'room_encounter',
  'room_unlock',
  'artifact_hint',
  'memory_fragment',
  'restricted_wing',
  'journal_prompt',
  'custom',
];
const galleryStorageBucket = 'gallery-records';
const galleryUploadFolders = ['featured', 'portraits', 'places', 'symbols', 'maps', 'anomalies', 'unknown', 'recovered', 'fragments'];
const NOCTIS_DOCUMENTS_PAGE_SIZE = 10;
const ADMIN_USERS_PAGE_SIZE = 10;
const noctisDocumentTypes = ['journal', 'manuscript', 'letter', 'cipher', 'fragment', 'veil_lore', 'unstable_text', 'blood_moon', 'other'];
const noctisDocumentModes = ['blood_moon', 'moon', 'sun', 'blue_moon', 'all'];

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
const overviewStatElements = {
  totalAccounts: document.querySelector('[data-admin-overview-stat="totalAccounts"]'),
  activeUsers: document.querySelector('[data-admin-overview-stat="activeUsers"]'),
  newThisWeek: document.querySelector('[data-admin-overview-stat="newThisWeek"]'),
  journalEntries: document.querySelector('[data-admin-overview-stat="journalEntries"]'),
  savedReadings: document.querySelector('[data-admin-overview-stat="savedReadings"]'),
  recoveredArtifacts: document.querySelector('[data-admin-overview-stat="recoveredArtifacts"]'),
  sessionStatus: document.querySelector('[data-admin-overview-stat="sessionStatus"]'),
};
const noctisDocumentsState = document.querySelector('[data-noctis-documents-state]');
const noctisDocumentsTableWrap = document.querySelector('[data-noctis-documents-table-wrap]');
const noctisDocumentsTableBody = document.querySelector('[data-noctis-documents-table-body]');
const noctisDocumentsPagination = document.querySelector('[data-noctis-documents-pagination]');
const noctisDocumentsPaginationSummary = document.querySelector('[data-noctis-documents-pagination-summary]');
const noctisDocumentsPaginationControls = document.querySelector('[data-noctis-documents-pagination-controls]');
const noctisDocumentDetail = document.querySelector('[data-noctis-document-detail]');
const noctisDocumentDetailTitle = document.querySelector('[data-noctis-document-detail-title]');
const noctisDocumentDetailMeta = document.querySelector('[data-noctis-document-detail-meta]');
const noctisDocumentDetailFields = document.querySelector('[data-noctis-document-detail-fields]');
const noctisDocumentDetailBody = document.querySelector('[data-noctis-document-detail-body]');
const noctisDocumentDetailCloseButton = document.querySelector('[data-noctis-document-detail-close]');
const noctisDocumentNewButton = document.querySelector('[data-noctis-document-new]');
const noctisDocumentFormPanel = document.querySelector('[data-noctis-document-form-panel]');
const noctisDocumentForm = document.querySelector('[data-noctis-document-form]');
const noctisDocumentFormTitle = document.querySelector('[data-noctis-document-form-title]');
const noctisDocumentFormState = document.querySelector('[data-noctis-document-form-state]');
const noctisDocumentFormSubmitButton = document.querySelector('[data-noctis-document-form-submit]');
const noctisDocumentFormCancelButtons = document.querySelectorAll('[data-noctis-document-form-cancel], [data-noctis-document-form-cancel-secondary]');
const noctisDocumentFilters = Array.from(document.querySelectorAll('[data-noctis-document-filter]'));
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
const characterLinesState = document.querySelector('[data-character-lines-state]');
const characterLinesTableWrap = document.querySelector('[data-character-lines-table-wrap]');
const characterLinesTableBody = document.querySelector('[data-character-lines-table-body]');
const characterLinesPagination = document.querySelector('[data-character-lines-pagination]');
const characterLinesPaginationSummary = document.querySelector('[data-character-lines-pagination-summary]');
const characterLinesPaginationControls = document.querySelector('[data-character-lines-pagination-controls]');
const characterLinesPageSizeSelect = document.querySelector('[data-character-lines-page-size]');
const characterLineNewButton = document.querySelector('[data-character-line-new]');
const characterLineFormPanel = document.querySelector('[data-character-line-form-panel]');
const characterLineForm = document.querySelector('[data-character-line-form]');
const characterLineFormTitle = document.querySelector('[data-character-line-form-title]');
const characterLineFormState = document.querySelector('[data-character-line-form-state]');
const characterLineFormSubmitButton = document.querySelector('[data-character-line-form-submit]');
const characterLineFormCancelButtons = document.querySelectorAll('[data-character-line-form-cancel], [data-character-line-form-cancel-secondary]');
const characterLineFilters = Array.from(document.querySelectorAll('[data-character-line-filter]'));
const contactMessagesState = document.querySelector('[data-contact-messages-state]');
const contactMessagesTableWrap = document.querySelector('[data-contact-messages-table-wrap]');
const contactMessagesTableBody = document.querySelector('[data-contact-messages-table-body]');
const contactMessagesPagination = document.querySelector('[data-contact-messages-pagination]');
const contactMessagesPaginationSummary = document.querySelector('[data-contact-messages-pagination-summary]');
const contactMessagesPaginationControls = document.querySelector('[data-contact-messages-pagination-controls]');
const contactMessagesPageSizeSelect = document.querySelector('[data-contact-messages-page-size]');
const contactMessageFilters = Array.from(document.querySelectorAll('[data-contact-message-filter]'));
const contactMessageDetail = document.querySelector('[data-contact-message-detail]');
const contactMessageDetailTitle = document.querySelector('[data-contact-message-detail-title]');
const contactMessageDetailMeta = document.querySelector('[data-contact-message-detail-meta]');
const contactMessageDetailFields = document.querySelector('[data-contact-message-detail-fields]');
const contactMessageDetailBody = document.querySelector('[data-contact-message-detail-body]');
const contactMessageDetailCloseButton = document.querySelector('[data-contact-message-detail-close]');
const contactMessageNotesForm = document.querySelector('[data-contact-message-notes-form]');
const contactMessageDetailStatus = document.querySelector('[data-contact-message-detail-status]');
const contactMessageAdminNotes = document.querySelector('[data-contact-message-admin-notes]');
const contactMessageNotesSubmitButton = document.querySelector('[data-contact-message-notes-submit]');
const contactMessageDetailState = document.querySelector('[data-contact-message-detail-state]');
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
const galleryRecordsState = document.querySelector('[data-gallery-records-state]');
const galleryRecordsTableWrap = document.querySelector('[data-gallery-records-table-wrap]');
const galleryRecordsTableBody = document.querySelector('[data-gallery-records-table-body]');
const galleryRecordsPagination = document.querySelector('[data-gallery-records-pagination]');
const galleryRecordsPaginationSummary = document.querySelector('[data-gallery-records-pagination-summary]');
const galleryRecordsPaginationControls = document.querySelector('[data-gallery-records-pagination-controls]');
const galleryRecordFilters = Array.from(document.querySelectorAll('[data-gallery-record-filter]'));
const galleryRecordStats = {
  total: document.querySelector('[data-gallery-record-stat="total"]'),
  active: document.querySelector('[data-gallery-record-stat="active"]'),
  featured: document.querySelector('[data-gallery-record-stat="featured"]'),
  inactive: document.querySelector('[data-gallery-record-stat="inactive"]'),
};
const galleryRecordDetail = document.querySelector('[data-gallery-record-detail]');
const galleryRecordDetailTitle = document.querySelector('[data-gallery-record-detail-title]');
const galleryRecordDetailMeta = document.querySelector('[data-gallery-record-detail-meta]');
const galleryRecordDetailFields = document.querySelector('[data-gallery-record-detail-fields]');
const galleryRecordDetailImages = document.querySelector('[data-gallery-record-detail-images]');
const galleryRecordDetailBody = document.querySelector('[data-gallery-record-detail-body]');
const galleryRecordDetailCloseButton = document.querySelector('[data-gallery-record-detail-close]');
const galleryRecordNewButton = document.querySelector('[data-gallery-record-new]');
const galleryRecordFormPanel = document.querySelector('[data-gallery-record-form-panel]');
const galleryRecordForm = document.querySelector('[data-gallery-record-form]');
const galleryRecordFormTitle = document.querySelector('[data-gallery-record-form-title]');
const galleryRecordFormState = document.querySelector('[data-gallery-record-form-state]');
const galleryRecordFormSubmitButton = document.querySelector('[data-gallery-record-form-submit]');
const galleryRecordFormCancelButtons = document.querySelectorAll('[data-gallery-record-form-cancel], [data-gallery-record-form-cancel-secondary]');
const galleryRecordPreviewImage = document.querySelector('[data-gallery-record-preview-image]');
const galleryRecordPreviewLink = document.querySelector('[data-gallery-record-preview-link]');
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
const adminUsersState = document.querySelector('[data-admin-users-state]');
const adminUsersTableWrap = document.querySelector('[data-admin-users-table-wrap]');
const adminUsersTableBody = document.querySelector('[data-admin-users-table-body]');
const adminUserSearchInput = document.querySelector('[data-admin-user-search]');
const adminUserSearchClearButton = document.querySelector('[data-admin-user-search-clear]');
const adminUsersPagination = document.querySelector('[data-admin-users-pagination]');
const adminUsersPaginationSummary = document.querySelector('[data-admin-users-pagination-summary]');
const adminUsersPaginationControls = document.querySelector('[data-admin-users-pagination-controls]');
const adminUserDetail = document.querySelector('[data-admin-user-detail]');
const adminUserDetailTitle = document.querySelector('[data-admin-user-detail-title]');
const adminUserDetailMeta = document.querySelector('[data-admin-user-detail-meta]');
const adminUserDetailFields = document.querySelector('[data-admin-user-detail-fields]');
const adminUserDetailCloseButton = document.querySelector('[data-admin-user-detail-close]');
const userModerationForm = document.querySelector('[data-user-moderation-form]');
const userModerationStatusSelect = document.querySelector('[data-user-moderation-status]');
const userModerationReasonField = document.querySelector('[data-user-moderation-reason]');
const userModerationState = document.querySelector('[data-user-moderation-state]');
const userModerationSubmitButton = document.querySelector('[data-user-moderation-submit]');

const userProgressSummaryTables = [
  'profiles',
  'user_artifacts',
  'user_room_visits',
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
    tableName: 'user_room_visits',
    columns: [
      ['Room Key', ['room_key', 'key']],
      ['First Visited', ['first_visited_at', 'created_at']],
      ['Last Visited', ['last_visited_at', 'updated_at']],
      ['Visit Count', ['visit_count', 'visits']],
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

let noctisDocumentsLoaded = false;
let noctisDocumentRows = [];
let noctisDocumentsPage = 1;
let editingNoctisDocumentId = null;
let noctisDocumentFiltersInitialized = false;
let journalPromptsLoaded = false;
let journalPromptRows = [];
let editingJournalPromptId = null;
let journalPromptsCurrentPage = 1;
let journalPromptsPageSize = 10;
let journalPromptsTotalCount = 0;
let characterLinesLoaded = false;
let characterLineRows = [];
let editingCharacterLineId = null;
let characterLinesCurrentPage = 1;
let characterLinesPageSize = 10;
let characterLinesTotalCount = 0;
let contactMessagesLoaded = false;
let contactMessageRows = [];
let contactMessagesCurrentPage = 1;
let contactMessagesPageSize = 10;
let contactMessagesTotalCount = 0;
let activeContactMessageId = null;
let archiveRoomsLoaded = false;
let archiveRoomRows = [];
let editingArchiveRoomId = null;
let galleryRecordsLoaded = false;
let galleryRecordRows = [];
let filteredGalleryRecordRows = [];
let editingGalleryRecordId = null;
let galleryRecordsCurrentPage = 1;
const galleryRecordsPageSize = 10;
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
let adminUsersLoaded = false;
let adminUserRows = [];
let filteredAdminUserRows = [];
let adminUsersCurrentPage = 1;
let userProgressLoaded = false;
let profileRows = [];
let currentAdminUserId = null;
let adminDashboardBindingsInitialized = false;

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

function getNoctisDocumentTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'name', 'heading']), 'Untitled document');
}

function getNoctisDocumentSlug(row) {
  return formatValue(getFirstValue(row, ['slug']));
}

function getNoctisDocumentId(row) {
  return getFirstValue(row, ['id']);
}

function getNoctisDocumentKey(row) {
  return formatValue(getFirstValue(row, ['shelf_mark', 'key', 'id']));
}

function getNoctisDocumentType(row) {
  return normalizeNoctisDocumentType(getFirstValue(row, ['document_type', 'entry_type', 'type']));
}

function getNoctisDocumentArchiveSection(row) {
  return formatValue(getFirstValue(row, ['category_label', 'category', 'archive_section', 'section']));
}

function getNoctisDocumentThemeMode(row) {
  return formatValue(getFirstValue(row, ['mode', 'moon_phase', 'theme_mode', 'mode_key', 'site_mode', 'event_mode', 'collection_mode']));
}

function normalizeNoctisDocumentFilterMatchValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, '_');
}

function isAllFilterValue(value) {
  return value == null || ['__all', 'all', ''].includes(normalizeNoctisDocumentFilterMatchValue(value));
}

function getNormalizedNoctisDocumentTypeFilterValue(value) {
  return isAllFilterValue(value) ? '__all' : normalizeNoctisDocumentType(value);
}

function getNormalizedNoctisDocumentPublishedFilterValue(value) {
  const normalized = normalizeNoctisDocumentFilterMatchValue(value);

  if (isAllFilterValue(normalized)) {
    return '__all';
  }

  return ['published', 'unpublished'].includes(normalized) ? normalized : '__all';
}

function getNormalizedNoctisDocumentModeFilterValue(value) {
  const normalized = normalizeNoctisDocumentFilterMatchValue(value);

  return isAllFilterValue(normalized) ? '__all' : normalized;
}

function getNormalizedNoctisDocumentBloodMoonFilterValue(value) {
  const normalized = normalizeNoctisDocumentFilterMatchValue(value);

  if (isAllFilterValue(normalized)) {
    return '__all';
  }

  if (['blood_moon', 'blood_moon_only', 'bloodmoon', 'bloodmoon_only'].includes(normalized)) {
    return 'blood_moon';
  }

  if (['not_blood_moon', 'non_blood_moon', 'not_bloodmoon', 'non_bloodmoon'].includes(normalized)) {
    return 'not_blood_moon';
  }

  return '__all';
}

function getNoctisDocumentPublishedState(row) {
  const publishedValue = getFirstValue(row, ['is_published', 'published', 'published_at', 'status', 'state', 'visibility']);

  if (typeof publishedValue === 'boolean') {
    return publishedValue ? 'Yes' : 'No';
  }

  if (publishedValue) {
    return formatValue(publishedValue);
  }

  return '--';
}

function getNoctisDocumentPublishedBoolean(row) {
  const publishedValue = getFirstValue(row, ['is_published', 'published']);

  if (typeof publishedValue === 'boolean') {
    return publishedValue;
  }

  return String(publishedValue || '').toLowerCase() === 'true';
}

function getNoctisDocumentMode(row) {
  return getNoctisDocumentThemeMode(row);
}

function getNoctisDocumentModeForFilter(row) {
  return normalizeNoctisDocumentFilterMatchValue(getFirstValue(row, ['mode', 'moon_phase', 'theme_mode', 'mode_key', 'site_mode', 'event_mode', 'collection_mode']));
}

function getNoctisDocumentBody(row) {
  return formatValue(
    getFirstValue(row, ['body', 'content', 'text', 'entry', 'description', 'summary']),
    'No body/content field available for this document.',
  );
}

function getNoctisDocumentExcerpt(row) {
  return formatValue(getFirstValue(row, ['excerpt', 'summary']));
}

function getNoctisDocumentRelatedCharacter(row) {
  return formatValue(getFirstValue(row, ['attribution', 'related_character', 'character_key', 'veilwalker_key']));
}

function getNoctisDocumentSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order', 'display_order', 'order']));
}

function normalizeNoctisDocumentType(value) {
  const normalized = String(value || 'journal').trim().toLowerCase();
  const typeMap = {
    journals: 'journal',
    journal_fragment: 'journal',
    recovered_journal: 'journal',
    manuscripts: 'manuscript',
    letters: 'letter',
    cryptic_codes: 'cipher',
    codes: 'cipher',
    fragments: 'fragment',
    veil: 'veil_lore',
    the_veil: 'veil_lore',
    unstable_texts: 'unstable_text',
    blood_moon_record: 'blood_moon',
    bloodmoon: 'blood_moon',
  };
  const nextType = typeMap[normalized] || normalized;

  return noctisDocumentTypes.includes(nextType) ? nextType : 'other';
}

function getNoctisDocumentAuthor(row) {
  return formatValue(getFirstValue(row, ['author']));
}

function getNoctisDocumentAttribution(row) {
  return formatValue(getFirstValue(row, ['attribution']));
}

function getNoctisDocumentAuthorAttribution(row) {
  const author = getNoctisDocumentAuthor(row);
  const attribution = getNoctisDocumentAttribution(row);

  if (author !== '--' && attribution !== '--' && author !== attribution) {
    return `${author} / ${attribution}`;
  }

  return author !== '--' ? author : attribution;
}

function getNoctisDocumentShelfMark(row) {
  return formatValue(getFirstValue(row, ['shelf_mark']));
}

function getNoctisDocumentTags(row) {
  return normalizeAdminListField(getFirstValue(row, ['tags']));
}

function getNoctisDocumentThemes(row) {
  return normalizeAdminListField(getFirstValue(row, ['themes']));
}

function getNoctisDocumentFeaturedBoolean(row) {
  return Boolean(getFirstValue(row, ['is_featured']));
}

function getNoctisDocumentNotableBoolean(row) {
  return Boolean(getFirstValue(row, ['is_notable']));
}

function getNoctisDocumentBloodMoonBoolean(row) {
  return Boolean(getFirstValue(row, ['is_blood_moon'])) || getNoctisDocumentModeForFilter(row) === 'blood_moon' || getNoctisDocumentType(row) === 'blood_moon';
}

function getNoctisDocumentFeaturedNotableState(row) {
  const states = [];

  if (getNoctisDocumentFeaturedBoolean(row)) {
    states.push('Featured');
  }

  if (getNoctisDocumentNotableBoolean(row)) {
    states.push('Notable');
  }

  return states.join(' / ') || '--';
}

function getNoctisDocumentCategory(type) {
  const categoryMap = {
    journal: 'journals',
    manuscript: 'manuscripts',
    letter: 'letters',
    cipher: 'cryptic_codes',
    fragment: 'fragments',
    veil_lore: 'veil_lore',
    unstable_text: 'unstable_texts',
    blood_moon: 'blood_moon',
    other: 'other',
  };

  return categoryMap[type] || 'other';
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

function getCharacterLineId(row) {
  return getFirstValue(row, ['id']);
}

function getCharacterLineReaderId(row) {
  return formatValue(getFirstValue(row, ['reader_id']));
}

function getCharacterLineReaderName(row) {
  return formatValue(getFirstValue(row, ['reader_name']), 'Unnamed reader');
}

function getCharacterLineMode(row) {
  return formatValue(getFirstValue(row, ['mode']), 'all');
}

function getCharacterLineContext(row) {
  return formatValue(getFirstValue(row, ['context']), 'custom');
}

function getCharacterLineText(row) {
  return formatValue(getFirstValue(row, ['line_text', 'text', 'body']), 'Untitled line');
}

function getCharacterLinePreview(row) {
  return formatCompactValue(getCharacterLineText(row), 'Untitled line');
}

function getCharacterLineTone(row) {
  return formatValue(getFirstValue(row, ['tone']));
}

function getCharacterLineDeckId(row) {
  return formatValue(getFirstValue(row, ['deck_id']));
}

function getCharacterLineRoomId(row) {
  return formatValue(getFirstValue(row, ['room_id']));
}

function getCharacterLineSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order']));
}

function getCharacterLineActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active', 'active', 'enabled']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
}

function getCharacterLineActiveState(row) {
  return getCharacterLineActiveBoolean(row) ? 'Active' : 'Inactive';
}

function getContactMessageId(row) {
  return getFirstValue(row, ['id']);
}

function getContactMessageCreatedAt(row) {
  return formatDate(getFirstValue(row, ['created_at']));
}

function getContactMessageEmail(row) {
  return formatValue(getFirstValue(row, ['user_email', 'email']), 'Unknown email');
}

function getContactMessageTopic(row) {
  return formatValue(getFirstValue(row, ['topic']), 'General Question');
}

function getContactMessageSubject(row) {
  return formatValue(getFirstValue(row, ['subject']), 'Untitled message');
}

function getContactMessageText(row) {
  return formatValue(getFirstValue(row, ['message', 'body', 'content']), 'No message provided.');
}

function getContactMessagePreview(row) {
  return formatCompactValue(getContactMessageText(row), 'No message provided.');
}

function getContactMessageStatus(row) {
  return formatValue(getFirstValue(row, ['status']), 'new');
}

function getContactMessageAdminNotes(row) {
  return formatValue(getFirstValue(row, ['admin_notes']), '');
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

function getGalleryRecordTitle(row) {
  return formatValue(getFirstValue(row, ['title', 'unknown_title']), 'Untitled gallery record');
}

function getGalleryRecordId(row) {
  return getFirstValue(row, ['id']);
}

function getGalleryRecordSlug(row) {
  return formatValue(getFirstValue(row, ['slug']));
}

function getGalleryRecordType(row) {
  return formatValue(getFirstValue(row, ['record_type']));
}

function getGalleryRecordStatus(row) {
  return formatValue(getFirstValue(row, ['status']));
}

function getGalleryRecordDescription(row) {
  return formatValue(getFirstValue(row, ['description']));
}

function getGalleryRecordLoreNote(row) {
  return formatValue(getFirstValue(row, ['lore_note']));
}

function getGalleryRecordImageUrl(row) {
  return formatValue(getFirstValue(row, ['preview_image_url', 'full_image_url']));
}

function getGalleryRecordFullImageUrl(row) {
  return formatValue(getFirstValue(row, ['full_image_url', 'preview_image_url']));
}

function getGalleryRecordFeaturedBoolean(row) {
  const featuredValue = getFirstValue(row, ['is_featured']);

  if (typeof featuredValue === 'boolean') {
    return featuredValue;
  }

  return String(featuredValue || '').toLowerCase() === 'true';
}

function getGalleryRecordActiveBoolean(row) {
  const activeValue = getFirstValue(row, ['is_active']);

  if (typeof activeValue === 'boolean') {
    return activeValue;
  }

  return String(activeValue || '').toLowerCase() === 'true';
}

function getGalleryRecordFeaturedState(row) {
  return getGalleryRecordFeaturedBoolean(row) ? 'Yes' : 'No';
}

function getGalleryRecordActiveState(row) {
  return getGalleryRecordActiveBoolean(row) ? 'Yes' : 'No';
}

function getGalleryRecordSortOrder(row) {
  return formatValue(getFirstValue(row, ['sort_order']));
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
  return formatValue(getFirstValue(row, ['zodiac_sign', 'zodiac_key', 'zodiac', 'sign']));
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

function getProfileEmail(row) {
  return formatValue(getFirstValue(row, ['email', 'user_email']));
}

function getProfileAccountStatus(row) {
  const status = String(getFirstValue(row, ['account_status']) || 'active').trim().toLowerCase();

  return status || 'active';
}

function getProfileAccountStatusLabel(row) {
  const labels = {
    active: 'Active',
    restricted: 'Restricted',
    banned: 'Banned',
    pending_deletion: 'Pending Deletion',
  };

  return labels[getProfileAccountStatus(row)] || formatValue(getProfileAccountStatus(row));
}

function getProfileBanReason(row) {
  return formatValue(getFirstValue(row, ['ban_reason']));
}

function getProfileBannedAt(row) {
  return formatDate(getFirstValue(row, ['banned_at']));
}

function getProfileCreatedAt(row) {
  return formatDate(getFirstValue(row, ['created_at', 'inserted_at']));
}

function getProfileUpdatedAt(row) {
  return formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated']));
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

function setNoctisDocumentsState(message, state = '') {
  noctisDocumentsState.textContent = message;
  noctisDocumentsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  noctisDocumentsState.hidden = false;
}

function setNoctisDocumentFormState(message, state = '') {
  noctisDocumentFormState.textContent = message;
  noctisDocumentFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  noctisDocumentFormState.hidden = false;
}

function hideNoctisDocumentFormState() {
  noctisDocumentFormState.hidden = true;
  noctisDocumentFormState.textContent = '';
  noctisDocumentFormState.className = 'admin-state';
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

function setCharacterLinesState(message, state = '') {
  characterLinesState.textContent = message;
  characterLinesState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  characterLinesState.hidden = false;
}

function setCharacterLineFormState(message, state = '') {
  characterLineFormState.textContent = message;
  characterLineFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  characterLineFormState.hidden = false;
}

function hideCharacterLineFormState() {
  characterLineFormState.hidden = true;
  characterLineFormState.textContent = '';
  characterLineFormState.className = 'admin-state';
}

function setContactMessagesState(message, state = '') {
  contactMessagesState.textContent = message;
  contactMessagesState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  contactMessagesState.hidden = false;
}

function setContactMessageDetailState(message, state = '') {
  contactMessageDetailState.textContent = message;
  contactMessageDetailState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  contactMessageDetailState.hidden = false;
}

function hideContactMessageDetailState() {
  contactMessageDetailState.hidden = true;
  contactMessageDetailState.textContent = '';
  contactMessageDetailState.className = 'admin-state';
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

function setGalleryRecordsState(message, state = '') {
  galleryRecordsState.textContent = message;
  galleryRecordsState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  galleryRecordsState.hidden = false;
}

function setGalleryRecordFormState(message, state = '') {
  galleryRecordFormState.textContent = message;
  galleryRecordFormState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  galleryRecordFormState.hidden = false;
}

function hideGalleryRecordFormState() {
  galleryRecordFormState.hidden = true;
  galleryRecordFormState.textContent = '';
  galleryRecordFormState.className = 'admin-state';
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

function setAdminUsersState(message, state = '') {
  adminUsersState.textContent = message;
  adminUsersState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  adminUsersState.hidden = false;
}

function setUserModerationState(message, state = '') {
  if (!userModerationState) {
    return;
  }

  userModerationState.textContent = message;
  userModerationState.className = `admin-state${state ? ` admin-state--${state}` : ''}`;
  userModerationState.hidden = false;
}

function hideUserModerationState() {
  if (userModerationState) {
    userModerationState.hidden = true;
  }
}

function hideNoctisDocumentDetail() {
  noctisDocumentDetail.hidden = true;
}

function hideNoctisDocumentForm() {
  editingNoctisDocumentId = null;
  noctisDocumentForm.reset();
  hideNoctisDocumentFormState();
  noctisDocumentFormPanel.hidden = true;
  noctisDocumentFormSubmitButton.disabled = false;
  noctisDocumentFormSubmitButton.textContent = 'Save Document';
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

function setCharacterLineFormCancelVisible(isVisible) {
  characterLineFormCancelButtons.forEach((button) => {
    button.hidden = !isVisible;
  });
}

function hideCharacterLineForm() {
  editingCharacterLineId = null;
  characterLineForm.reset();
  characterLineForm.elements.mode.value = 'all';
  characterLineForm.elements.context.value = 'reading_intro';
  characterLineForm.elements.is_active.checked = true;
  hideCharacterLineFormState();
  characterLineFormTitle.textContent = 'New Line';
  characterLineFormSubmitButton.disabled = false;
  characterLineFormSubmitButton.textContent = 'Save Line';
  setCharacterLineFormCancelVisible(false);
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

function hideGalleryRecordDetail() {
  galleryRecordDetail.hidden = true;
}

function updateGalleryRecordPreview(url = '') {
  const imageUrl = String(url || '').trim();

  if (!galleryRecordPreviewImage || !galleryRecordPreviewLink) {
    return;
  }

  galleryRecordPreviewImage.hidden = !imageUrl;
  galleryRecordPreviewLink.hidden = !imageUrl;

  if (!imageUrl) {
    galleryRecordPreviewImage.removeAttribute('src');
    galleryRecordPreviewLink.removeAttribute('href');
    return;
  }

  galleryRecordPreviewImage.src = imageUrl;
  galleryRecordPreviewLink.href = imageUrl;
}

function hideGalleryRecordForm() {
  editingGalleryRecordId = null;
  galleryRecordForm.reset();
  galleryRecordForm.elements.slug.dataset.manual = 'false';
  galleryRecordForm.elements.record_type.value = 'portrait';
  galleryRecordForm.elements.status.value = 'available';
  galleryRecordForm.elements.upload_folder.value = 'portraits';
  galleryRecordForm.elements.origin.value = 'Noctis Archive';
  galleryRecordForm.elements.related_room.value = 'The Gallery';
  galleryRecordForm.elements.required_fragments.value = '0';
  galleryRecordForm.elements.is_active.checked = true;
  galleryRecordForm.elements.is_featured.checked = false;
  galleryRecordForm.elements.is_fragmented.checked = false;
  updateGalleryRecordPreview('');
  hideGalleryRecordFormState();
  galleryRecordFormPanel.hidden = true;
  galleryRecordFormSubmitButton.disabled = false;
  galleryRecordFormSubmitButton.textContent = 'Save Gallery Record';
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
  userProgressDetail.dataset.profileIndex = '';
}

function hideAdminUserDetail() {
  adminUserDetail.hidden = true;
  adminUserDetail.dataset.userIndex = '';
  userModerationForm?.setAttribute('hidden', '');
  hideUserModerationState();
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

function appendImageCell(rowElement, label, imageUrl, altText = '') {
  const cell = document.createElement('td');
  const url = String(imageUrl || '').trim();
  const appendPlaceholder = () => {
    const placeholder = document.createElement('span');

    placeholder.className = 'admin-table__thumbnail-placeholder';
    placeholder.textContent = 'Image';
    cell.replaceChildren(placeholder);
  };

  cell.dataset.label = label;
  cell.className = 'admin-table__thumbnail';

  if (url && url !== '--') {
    const image = document.createElement('img');

    image.src = url;
    image.alt = altText;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', appendPlaceholder, { once: true });
    cell.append(image);
  } else {
    appendPlaceholder();
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

function appendCharacterLineBadgeCell(rowElement, label, value, badgeClassName = '') {
  const cell = document.createElement('td');
  const badge = document.createElement('span');

  cell.dataset.label = label;
  cell.className = 'character-lines-table__meta';
  badge.className = `admin-badge${badgeClassName ? ` ${badgeClassName}` : ''}`;
  badge.textContent = value || '--';
  cell.append(badge);
  rowElement.append(cell);
}

function createNoctisDocumentBadge(label, modifier = '') {
  const badge = document.createElement('span');

  badge.className = `noctis-document-badge${modifier ? ` noctis-document-badge--${modifier}` : ''}`;
  badge.textContent = label || '--';
  return badge;
}

function appendNoctisDocumentSummaryCell(rowElement, row) {
  const cell = document.createElement('td');
  const wrapper = document.createElement('div');
  const title = document.createElement('div');
  const chips = document.createElement('div');
  const slug = document.createElement('div');
  const metadata = [
    [getNoctisDocumentType(row), 'type'],
    [getNoctisDocumentMode(row), 'mode'],
    [getNoctisDocumentShelfMark(row), 'shelf'],
  ].filter(([value]) => value && value !== '--');

  cell.dataset.label = 'Document';
  wrapper.className = 'noctis-document-cell';
  title.className = 'noctis-document-cell__title';
  title.textContent = getNoctisDocumentTitle(row);
  chips.className = 'noctis-document-chip-row';
  metadata.forEach(([value, modifier]) => {
    chips.append(createNoctisDocumentBadge(value, modifier));
  });

  wrapper.append(title);

  if (chips.childElementCount) {
    wrapper.append(chips);
  }

  if (getNoctisDocumentSlug(row) !== '--') {
    slug.className = 'noctis-document-cell__slug';
    slug.textContent = getNoctisDocumentSlug(row);
    wrapper.append(slug);
  }

  cell.append(wrapper);
  rowElement.append(cell);
}

function appendNoctisDocumentStatusCell(rowElement, row) {
  const cell = document.createElement('td');
  const statusRow = document.createElement('div');
  const isPublished = getNoctisDocumentPublishedBoolean(row);

  cell.dataset.label = 'Status';
  statusRow.className = 'noctis-document-status-row';
  statusRow.append(createNoctisDocumentBadge(isPublished ? 'Published' : 'Draft', isPublished ? 'published' : 'draft'));

  if (getNoctisDocumentFeaturedBoolean(row)) {
    statusRow.append(createNoctisDocumentBadge('Featured', 'featured'));
  }

  if (getNoctisDocumentNotableBoolean(row)) {
    statusRow.append(createNoctisDocumentBadge('Notable', 'notable'));
  }

  if (getNoctisDocumentBloodMoonBoolean(row)) {
    statusRow.append(createNoctisDocumentBadge('Blood Moon', 'blood'));
  }

  cell.append(statusRow);
  rowElement.append(cell);
}

function getNoctisDocumentsTotalPages(rowCount) {
  return Math.max(1, Math.ceil(rowCount / NOCTIS_DOCUMENTS_PAGE_SIZE));
}

function getPaginatedNoctisDocumentRows(rows) {
  const totalPages = getNoctisDocumentsTotalPages(rows.length);
  noctisDocumentsPage = Math.min(Math.max(noctisDocumentsPage, 1), totalPages);
  const startIndex = (noctisDocumentsPage - 1) * NOCTIS_DOCUMENTS_PAGE_SIZE;

  return rows.slice(startIndex, startIndex + NOCTIS_DOCUMENTS_PAGE_SIZE);
}

function renderNoctisDocumentsPagination(totalCount) {
  noctisDocumentsPaginationControls.replaceChildren();

  if (!totalCount || totalCount <= NOCTIS_DOCUMENTS_PAGE_SIZE) {
    noctisDocumentsPagination.hidden = true;
    noctisDocumentsPaginationSummary.textContent = `Showing ${totalCount ? `1-${totalCount}` : '0-0'} of ${totalCount} documents`;
    return;
  }

  const totalPages = getNoctisDocumentsTotalPages(totalCount);
  const from = (noctisDocumentsPage - 1) * NOCTIS_DOCUMENTS_PAGE_SIZE + 1;
  const to = Math.min(from + NOCTIS_DOCUMENTS_PAGE_SIZE - 1, totalCount);
  const previousButton = document.createElement('button');
  const pageIndicator = document.createElement('span');
  const nextButton = document.createElement('button');

  noctisDocumentsPaginationSummary.textContent = `Showing ${from}-${to} of ${totalCount} documents`;

  previousButton.className = 'admin-pagination__button';
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = noctisDocumentsPage <= 1;
  previousButton.addEventListener('click', () => {
    if (noctisDocumentsPage > 1) {
      noctisDocumentsPage -= 1;
      applyNoctisDocumentFilters({ resetPage: false });
    }
  });

  pageIndicator.className = 'admin-pagination__summary';
  pageIndicator.textContent = `Page ${noctisDocumentsPage} of ${totalPages}`;

  nextButton.className = 'admin-pagination__button';
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = noctisDocumentsPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (noctisDocumentsPage < totalPages) {
      noctisDocumentsPage += 1;
      applyNoctisDocumentFilters({ resetPage: false });
    }
  });

  noctisDocumentsPaginationControls.append(previousButton, pageIndicator, nextButton);
  noctisDocumentsPagination.hidden = false;
}

function renderNoctisDocumentRows(rows = noctisDocumentRows) {
  noctisDocumentsTableBody.replaceChildren();

  if (!rows.length) {
    setNoctisDocumentsState('No Noctis documents found for these filters.');
    noctisDocumentsTableWrap.hidden = true;
    return;
  }

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const featureButton = document.createElement('button');
    const publishButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    appendNoctisDocumentSummaryCell(tableRow, row);
    appendTextCell(tableRow, 'Author', getNoctisDocumentAuthorAttribution(row), 'noctis-document-author');
    appendNoctisDocumentStatusCell(tableRow, row);
    appendTextCell(tableRow, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])), 'noctis-document-date');

    viewButton.className = 'admin-row-action admin-row-action--view';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showNoctisDocumentDetail(row));

    editButton.className = 'admin-row-action admin-row-action--edit';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showNoctisDocumentForm(row));

    featureButton.className = 'admin-row-action admin-row-action--feature';
    featureButton.type = 'button';
    if (!getNoctisDocumentPublishedBoolean(row)) {
      featureButton.textContent = 'Publish to Feature';
      featureButton.disabled = true;
      featureButton.title = 'Publish this document before featuring it.';
    } else if (getNoctisDocumentFeaturedBoolean(row)) {
      featureButton.textContent = 'Current Feature';
      featureButton.disabled = true;
      featureButton.setAttribute('aria-current', 'true');
    } else {
      featureButton.textContent = 'Make Featured';
      featureButton.addEventListener('click', () => makeNoctisDocumentFeatured(row, featureButton));
    }

    publishButton.className = `admin-row-action ${getNoctisDocumentPublishedBoolean(row) ? 'admin-row-action--unpublish' : 'admin-row-action--publish'}`;
    publishButton.type = 'button';
    publishButton.textContent = getNoctisDocumentPublishedBoolean(row) ? 'Unpublish' : 'Publish';
    publishButton.addEventListener('click', () => toggleNoctisDocumentPublished(row, publishButton));

    deleteButton.className = 'admin-row-action admin-row-action--delete';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteNoctisDocument(row, deleteButton));

    const primaryActionRow = document.createElement('div');
    const featureActionRow = document.createElement('div');
    const statusActionRow = document.createElement('div');

    actionGroup.className = 'admin-action-group noctis-doc-actions';
    primaryActionRow.className = 'noctis-doc-actions__row';
    featureActionRow.className = 'noctis-doc-actions__row noctis-doc-actions__row--feature';
    statusActionRow.className = 'noctis-doc-actions__row';
    actionCell.dataset.label = 'Actions';
    primaryActionRow.append(viewButton, editButton);
    featureActionRow.append(featureButton);
    statusActionRow.append(publishButton, deleteButton);
    actionGroup.append(primaryActionRow, featureActionRow, statusActionRow);
    actionCell.append(actionGroup);
    tableRow.append(actionCell);
    noctisDocumentsTableBody.append(tableRow);
  });

  noctisDocumentsState.hidden = true;
  noctisDocumentsTableWrap.hidden = false;
}

function renderNoctisDocuments(rows = noctisDocumentRows) {
  renderNoctisDocumentRows(rows);
}

function getNoctisDocumentFilterValue(filterName) {
  const field = noctisDocumentFilters.find((filter) => filter.dataset.noctisDocumentFilter === filterName);

  if (filterName === 'search') {
    return isAllFilterValue(field?.value) ? '' : field?.value || '';
  }

  return isAllFilterValue(field?.value) ? '__all' : field?.value || '__all';
}

function getNoctisDocumentSearchText(row) {
  return [
    getNoctisDocumentTitle(row),
    getNoctisDocumentAuthor(row),
    getNoctisDocumentAttribution(row),
    getNoctisDocumentShelfMark(row),
    getNoctisDocumentBody(row),
    getNoctisDocumentExcerpt(row),
    getNoctisDocumentTags(row).join(' '),
    getNoctisDocumentThemes(row).join(' '),
  ].filter(Boolean).join(' ').toLowerCase();
}

function getFilteredNoctisDocumentRows() {
  const query = String(getNoctisDocumentFilterValue('search') || '').trim().toLowerCase();
  const typeFilter = getNormalizedNoctisDocumentTypeFilterValue(getNoctisDocumentFilterValue('document_type'));
  const publishedFilter = getNormalizedNoctisDocumentPublishedFilterValue(getNoctisDocumentFilterValue('published'));
  const modeFilter = getNormalizedNoctisDocumentModeFilterValue(getNoctisDocumentFilterValue('mode'));
  const bloodMoonFilter = getNormalizedNoctisDocumentBloodMoonFilterValue(getNoctisDocumentFilterValue('blood_moon'));

  return noctisDocumentRows.filter((row) => {
    if (query && !getNoctisDocumentSearchText(row).includes(query)) {
      return false;
    }

    if (typeFilter !== '__all' && getNoctisDocumentType(row) !== typeFilter) {
      return false;
    }

    if (publishedFilter === 'published' && !getNoctisDocumentPublishedBoolean(row)) {
      return false;
    }

    if (publishedFilter === 'unpublished' && getNoctisDocumentPublishedBoolean(row)) {
      return false;
    }

    if (modeFilter !== '__all' && getNoctisDocumentModeForFilter(row) !== modeFilter) {
      return false;
    }

    if (bloodMoonFilter === 'blood_moon' && !getNoctisDocumentBloodMoonBoolean(row)) {
      return false;
    }

    if (bloodMoonFilter === 'not_blood_moon' && getNoctisDocumentBloodMoonBoolean(row)) {
      return false;
    }

    return true;
  });
}

function getNoctisDocumentActiveFilters() {
  return {
    search: String(getNoctisDocumentFilterValue('search') || '').trim(),
    document_type: getNoctisDocumentFilterValue('document_type'),
    published: getNoctisDocumentFilterValue('published'),
    mode: getNoctisDocumentFilterValue('mode'),
    blood_moon: getNoctisDocumentFilterValue('blood_moon'),
    normalized: {
      document_type: getNormalizedNoctisDocumentTypeFilterValue(getNoctisDocumentFilterValue('document_type')),
      published: getNormalizedNoctisDocumentPublishedFilterValue(getNoctisDocumentFilterValue('published')),
      mode: getNormalizedNoctisDocumentModeFilterValue(getNoctisDocumentFilterValue('mode')),
      blood_moon: getNormalizedNoctisDocumentBloodMoonFilterValue(getNoctisDocumentFilterValue('blood_moon')),
    },
  };
}

function areNoctisDocumentFiltersDefault() {
  return !String(getNoctisDocumentFilterValue('search') || '').trim()
    && getNormalizedNoctisDocumentTypeFilterValue(getNoctisDocumentFilterValue('document_type')) === '__all'
    && getNormalizedNoctisDocumentPublishedFilterValue(getNoctisDocumentFilterValue('published')) === '__all'
    && getNormalizedNoctisDocumentModeFilterValue(getNoctisDocumentFilterValue('mode')) === '__all'
    && getNormalizedNoctisDocumentBloodMoonFilterValue(getNoctisDocumentFilterValue('blood_moon')) === '__all';
}

function applyNoctisDocumentFilters({ resetPage = false } = {}) {
  if (resetPage) {
    noctisDocumentsPage = 1;
  }

  const currentFilters = getNoctisDocumentActiveFilters();
  const filteredRows = getFilteredNoctisDocumentRows();

  if (!filteredRows.length && noctisDocumentRows.length && areNoctisDocumentFiltersDefault()) {
    resetNoctisDocumentFiltersToDefaults();
    noctisDocumentsPage = 1;
    renderNoctisDocuments(getPaginatedNoctisDocumentRows(noctisDocumentRows));
    renderNoctisDocumentsPagination(noctisDocumentRows.length);
    return;
  }

  renderNoctisDocuments(getPaginatedNoctisDocumentRows(filteredRows));
  renderNoctisDocumentsPagination(filteredRows.length);
}

function resetNoctisDocumentFiltersToDefaults() {
  noctisDocumentFilters.forEach((filter) => {
    if (filter.dataset.noctisDocumentFilter === 'search') {
      filter.value = '';
      return;
    }

    filter.value = '__all';
  });
}

function sortNoctisDocumentRows(rows) {
  return rows.slice().sort((first, second) => {
    const firstOrder = Number(getFirstValue(first, ['sort_order'])) || 0;
    const secondOrder = Number(getFirstValue(second, ['sort_order'])) || 0;

    if (firstOrder !== secondOrder) {
      return firstOrder - secondOrder;
    }

    const firstUpdated = new Date(getFirstValue(first, ['updated_at', 'created_at']) || 0).getTime();
    const secondUpdated = new Date(getFirstValue(second, ['updated_at', 'created_at']) || 0).getTime();

    if (firstUpdated !== secondUpdated) {
      return secondUpdated - firstUpdated;
    }

    return getNoctisDocumentTitle(first).localeCompare(getNoctisDocumentTitle(second));
  });
}

async function fetchNoctisDocumentRows(supabase) {
  const attempts = [
    {
      label: 'sort_order_updated_at',
      query: () => supabase
        .from('noctis_documents')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('updated_at', { ascending: false })
        .limit(500),
    },
    {
      label: 'updated_at',
      query: () => supabase
        .from('noctis_documents')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(500),
    },
    {
      label: 'unordered',
      query: () => supabase
        .from('noctis_documents')
        .select('*')
        .limit(500),
    },
  ];
  let lastError = null;

  for (const attempt of attempts) {
    const { data, error } = await attempt.query();

    if (!error) {
      return { data, error: null };
    }

    lastError = error;
  }

  return { data: null, error: lastError };
}

function logNoctisDocumentQueryError(error) {
  if (!error) {
    return;
  }

  console.error('[Noctis Admin] query failed:', {
    message: error.message || '',
    details: error.details || '',
    hint: error.hint || '',
    code: error.code || '',
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

function getCharacterLineFilterValue(filterName) {
  const field = characterLineFilters.find((filter) => filter.dataset.characterLineFilter === filterName);

  return field?.value || '__all';
}

function applyCharacterLineFilters(query) {
  const readerFilter = String(getCharacterLineFilterValue('reader') || '').trim();
  const modeFilter = getCharacterLineFilterValue('mode');
  const contextFilter = getCharacterLineFilterValue('context');
  const activeFilter = getCharacterLineFilterValue('active');

  let nextQuery = query;

  if (readerFilter && readerFilter !== '__all') {
    const safeReaderFilter = readerFilter.replace(/[,()]/g, '');
    nextQuery = nextQuery.or(`reader_id.ilike.%${safeReaderFilter}%,reader_name.ilike.%${safeReaderFilter}%`);
  }

  if (modeFilter !== '__all') {
    nextQuery = nextQuery.eq('mode', modeFilter);
  }

  if (contextFilter !== '__all') {
    nextQuery = nextQuery.eq('context', contextFilter);
  }

  if (activeFilter === 'active') {
    nextQuery = nextQuery.eq('is_active', true);
  }

  if (activeFilter === 'inactive') {
    nextQuery = nextQuery.eq('is_active', false);
  }

  return nextQuery;
}

function getCharacterLinesTotalPages() {
  return Math.max(1, Math.ceil(characterLinesTotalCount / characterLinesPageSize));
}

function getCharacterLinesPageNumbers() {
  const totalPages = getCharacterLinesTotalPages();
  const maxButtons = 7;
  const halfWindow = Math.floor(maxButtons / 2);
  let start = Math.max(1, characterLinesCurrentPage - halfWindow);
  const end = Math.min(totalPages, start + maxButtons - 1);

  start = Math.max(1, end - maxButtons + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function renderCharacterLinesPagination() {
  const totalPages = getCharacterLinesTotalPages();
  const hasLines = characterLinesTotalCount > 0;

  if (!characterLinesPagination || !characterLinesPaginationControls || !characterLinesPaginationSummary) {
    return;
  }

  characterLinesPagination.hidden = !hasLines;
  characterLinesPaginationControls.replaceChildren();

  if (!hasLines) {
    characterLinesPaginationSummary.textContent = 'Showing 0-0 of 0 lines';
    return;
  }

  const from = (characterLinesCurrentPage - 1) * characterLinesPageSize + 1;
  const to = Math.min(from + characterLineRows.length - 1, characterLinesTotalCount);
  const previousButton = document.createElement('button');
  const nextButton = document.createElement('button');

  characterLinesPaginationSummary.textContent = `Showing ${from}-${to} of ${characterLinesTotalCount} lines`;

  previousButton.className = 'admin-pagination__button';
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = characterLinesCurrentPage <= 1;
  previousButton.addEventListener('click', () => {
    if (characterLinesCurrentPage > 1) {
      characterLinesCurrentPage -= 1;
      loadCharacterLines();
    }
  });
  characterLinesPaginationControls.append(previousButton);

  getCharacterLinesPageNumbers().forEach((pageNumber) => {
    const pageButton = document.createElement('button');

    pageButton.className = `admin-pagination__button${pageNumber === characterLinesCurrentPage ? ' is-active' : ''}`;
    pageButton.type = 'button';
    pageButton.textContent = String(pageNumber);
    pageButton.setAttribute('aria-label', `Page ${pageNumber}`);
    pageButton.setAttribute('aria-current', pageNumber === characterLinesCurrentPage ? 'page' : 'false');
    pageButton.disabled = pageNumber === characterLinesCurrentPage;
    pageButton.addEventListener('click', () => {
      characterLinesCurrentPage = pageNumber;
      loadCharacterLines();
    });
    characterLinesPaginationControls.append(pageButton);
  });

  nextButton.className = 'admin-pagination__button';
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = characterLinesCurrentPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (characterLinesCurrentPage < totalPages) {
      characterLinesCurrentPage += 1;
      loadCharacterLines();
    }
  });
  characterLinesPaginationControls.append(nextButton);
}

function renderCharacterLineRows(rows = characterLineRows) {
  characterLinesTableBody.replaceChildren();

  if (!rows.length) {
    setCharacterLinesState('No character lines found for these filters.');
    characterLinesTableWrap.hidden = true;
    renderCharacterLinesPagination();
    return;
  }

  rows.forEach((row) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const statusCell = document.createElement('td');
    const statusStack = document.createElement('div');
    const activeBadge = document.createElement('span');
    const orderMeta = document.createElement('span');
    const actionGroup = document.createElement('div');
    const editButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendTextCell(tableRow, 'Reader', getCharacterLineReaderName(row), 'admin-table__title');
    appendTextCell(tableRow, 'Reader ID', getCharacterLineReaderId(row), 'character-lines-table__meta');
    appendCharacterLineBadgeCell(tableRow, 'Mode', getCharacterLineMode(row), 'admin-badge--mode');
    appendTextCell(tableRow, 'Context', getCharacterLineContext(row), 'character-lines-table__meta');
    appendTextCell(tableRow, 'Tone', getCharacterLineTone(row), 'character-lines-table__meta');
    appendTextCell(tableRow, 'Deck', getCharacterLineDeckId(row), 'character-lines-table__meta');
    appendTextCell(tableRow, 'Room', getCharacterLineRoomId(row), 'character-lines-table__meta');
    appendTextCell(tableRow, 'Line Preview', getCharacterLinePreview(row), 'character-lines-table__line');

    statusCell.dataset.label = 'Status / Order';
    statusCell.className = 'character-lines-table__meta';
    statusStack.className = 'admin-action-group';
    activeBadge.className = `admin-badge${getCharacterLineActiveBoolean(row) ? ' admin-badge--active' : ' admin-badge--inactive'}`;
    activeBadge.textContent = getCharacterLineActiveState(row);
    orderMeta.textContent = `Order: ${getCharacterLineSortOrder(row)}`;
    statusStack.append(activeBadge, orderMeta);
    statusCell.append(statusStack);
    tableRow.append(statusCell);

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showCharacterLineForm(row));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getCharacterLineActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleCharacterLineActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(editButton, activeButton);
    actionCell.append(actionGroup);
    tableRow.append(actionCell);
    characterLinesTableBody.append(tableRow);
  });

  characterLinesState.hidden = true;
  characterLinesTableWrap.hidden = false;
  renderCharacterLinesPagination();
}

function getContactMessageFilterValue(filterName) {
  const field = contactMessageFilters.find((filter) => filter.dataset.contactMessageFilter === filterName);

  return field?.value || '__all';
}

function applyContactMessageFilters(query) {
  const statusFilter = getContactMessageFilterValue('status');
  const topicFilter = getContactMessageFilterValue('topic');
  let nextQuery = query;

  if (statusFilter !== '__all') {
    nextQuery = nextQuery.eq('status', statusFilter);
  }

  if (topicFilter !== '__all') {
    nextQuery = nextQuery.eq('topic', topicFilter);
  }

  return nextQuery;
}

function getContactMessagesTotalPages() {
  return Math.max(1, Math.ceil(contactMessagesTotalCount / contactMessagesPageSize));
}

function getContactMessagesPageNumbers() {
  const totalPages = getContactMessagesTotalPages();
  const maxButtons = 7;
  const halfWindow = Math.floor(maxButtons / 2);
  let start = Math.max(1, contactMessagesCurrentPage - halfWindow);
  const end = Math.min(totalPages, start + maxButtons - 1);

  start = Math.max(1, end - maxButtons + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function renderContactMessagesPagination() {
  const totalPages = getContactMessagesTotalPages();
  const hasMessages = contactMessagesTotalCount > 0;

  if (!contactMessagesPagination || !contactMessagesPaginationControls || !contactMessagesPaginationSummary) {
    return;
  }

  contactMessagesPagination.hidden = !hasMessages;
  contactMessagesPaginationControls.replaceChildren();

  if (!hasMessages) {
    contactMessagesPaginationSummary.textContent = 'Showing 0-0 of 0 messages';
    return;
  }

  const from = (contactMessagesCurrentPage - 1) * contactMessagesPageSize + 1;
  const to = Math.min(from + contactMessageRows.length - 1, contactMessagesTotalCount);
  const previousButton = document.createElement('button');
  const nextButton = document.createElement('button');

  contactMessagesPaginationSummary.textContent = `Showing ${from}-${to} of ${contactMessagesTotalCount} messages`;

  previousButton.className = 'admin-pagination__button';
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = contactMessagesCurrentPage <= 1;
  previousButton.addEventListener('click', () => {
    if (contactMessagesCurrentPage > 1) {
      contactMessagesCurrentPage -= 1;
      loadContactMessages();
    }
  });
  contactMessagesPaginationControls.append(previousButton);

  getContactMessagesPageNumbers().forEach((pageNumber) => {
    const pageButton = document.createElement('button');

    pageButton.className = `admin-pagination__button${pageNumber === contactMessagesCurrentPage ? ' is-active' : ''}`;
    pageButton.type = 'button';
    pageButton.textContent = String(pageNumber);
    pageButton.setAttribute('aria-label', `Page ${pageNumber}`);
    pageButton.setAttribute('aria-current', pageNumber === contactMessagesCurrentPage ? 'page' : 'false');
    pageButton.disabled = pageNumber === contactMessagesCurrentPage;
    pageButton.addEventListener('click', () => {
      contactMessagesCurrentPage = pageNumber;
      loadContactMessages();
    });
    contactMessagesPaginationControls.append(pageButton);
  });

  nextButton.className = 'admin-pagination__button';
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = contactMessagesCurrentPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (contactMessagesCurrentPage < totalPages) {
      contactMessagesCurrentPage += 1;
      loadContactMessages();
    }
  });
  contactMessagesPaginationControls.append(nextButton);
}

function renderContactMessageRows(rows = contactMessageRows) {
  contactMessagesTableBody.replaceChildren();

  if (!rows.length) {
    setContactMessagesState('No contact messages found for these filters.');
    contactMessagesTableWrap.hidden = true;
    renderContactMessagesPagination();
    return;
  }

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const statusCell = document.createElement('td');
    const statusSelect = document.createElement('select');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');

    appendTextCell(tableRow, 'Created', getContactMessageCreatedAt(row), 'contact-messages-table__meta');
    appendTextCell(tableRow, 'Email', getContactMessageEmail(row), 'admin-table__title');
    appendTextCell(tableRow, 'Topic', getContactMessageTopic(row), 'contact-messages-table__meta');
    appendTextCell(tableRow, 'Subject', getContactMessageSubject(row), 'contact-messages-table__subject');
    appendTextCell(tableRow, 'Message Preview', getContactMessagePreview(row), 'contact-messages-table__message');

    statusCell.dataset.label = 'Status';
    statusSelect.className = 'admin-row-select';
    statusSelect.setAttribute('aria-label', `Update status for ${getContactMessageSubject(row)}`);
    ['new', 'in_review', 'resolved', 'archived'].forEach((status) => {
      const option = document.createElement('option');
      option.value = status;
      option.textContent = status;
      option.selected = getContactMessageStatus(row) === status;
      statusSelect.append(option);
    });
    statusSelect.addEventListener('change', () => updateContactMessageStatus(row, statusSelect.value, statusSelect));
    statusCell.append(statusSelect);
    tableRow.append(statusCell);

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showContactMessageDetail(index));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Action';
    actionGroup.append(viewButton);
    actionCell.append(actionGroup);
    tableRow.append(actionCell);
    contactMessagesTableBody.append(tableRow);
  });

  contactMessagesState.hidden = true;
  contactMessagesTableWrap.hidden = false;
  renderContactMessagesPagination();
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

function showNoctisDocumentDetail(rowOrIndex) {
  const row = typeof rowOrIndex === 'number' ? noctisDocumentRows[rowOrIndex] : rowOrIndex;

  if (!row) {
    return;
  }

  noctisDocumentDetailTitle.textContent = getNoctisDocumentTitle(row);
  noctisDocumentDetailMeta.replaceChildren();
  noctisDocumentDetailFields.replaceChildren();
  noctisDocumentDetailBody.textContent = getNoctisDocumentBody(row);

  appendDetailChip(noctisDocumentDetailMeta, 'Published', getNoctisDocumentPublishedState(row));
  appendDetailChip(noctisDocumentDetailMeta, 'Type', getNoctisDocumentType(row));
  appendDetailChip(noctisDocumentDetailMeta, 'Mode', getNoctisDocumentMode(row));
  appendDetailChip(noctisDocumentDetailMeta, 'Slug', getNoctisDocumentSlug(row));
  appendDetailChip(noctisDocumentDetailMeta, 'Shelf Mark', getNoctisDocumentShelfMark(row));
  appendDetailField(noctisDocumentDetailFields, 'Slug', getNoctisDocumentSlug(row));
  appendDetailField(noctisDocumentDetailFields, 'Shelf Mark', getNoctisDocumentShelfMark(row));
  appendDetailField(noctisDocumentDetailFields, 'Type', getNoctisDocumentType(row));
  appendDetailField(noctisDocumentDetailFields, 'Category Label', getNoctisDocumentArchiveSection(row));
  appendDetailField(noctisDocumentDetailFields, 'Author', getNoctisDocumentAuthor(row));
  appendDetailField(noctisDocumentDetailFields, 'Attribution', getNoctisDocumentAttribution(row));
  appendDetailField(noctisDocumentDetailFields, 'Mode', getNoctisDocumentMode(row));
  appendDetailField(noctisDocumentDetailFields, 'Published', getNoctisDocumentPublishedState(row));
  appendDetailField(noctisDocumentDetailFields, 'Featured / Notable', getNoctisDocumentFeaturedNotableState(row));
  appendDetailField(noctisDocumentDetailFields, 'Blood Moon', getNoctisDocumentBloodMoonBoolean(row) ? 'Yes' : 'No');
  appendDetailField(noctisDocumentDetailFields, 'Tags', formatAdminList(getNoctisDocumentTags(row)) || '--');
  appendDetailField(noctisDocumentDetailFields, 'Themes', formatAdminList(getNoctisDocumentThemes(row)) || '--');
  appendDetailField(noctisDocumentDetailFields, 'Unlock Key', formatValue(getFirstValue(row, ['unlock_key'])));
  appendDetailField(noctisDocumentDetailFields, 'Required Artifact', formatValue(getFirstValue(row, ['required_artifact_key'])));
  appendDetailField(noctisDocumentDetailFields, 'Required Fragment', formatValue(getFirstValue(row, ['required_fragment_key'])));
  appendDetailField(noctisDocumentDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(noctisDocumentDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

  noctisDocumentDetail.hidden = false;
  noctisDocumentDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setNoctisDocumentFormValue(fieldName, value) {
  const field = noctisDocumentForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function showNoctisDocumentForm(row = null) {
  hideNoctisDocumentDetail();
  hideNoctisDocumentFormState();
  noctisDocumentForm.reset();

  if (row) {
    editingNoctisDocumentId = getNoctisDocumentId(row);
    noctisDocumentFormTitle.textContent = 'Edit Document';
    noctisDocumentFormSubmitButton.textContent = 'Save Changes';
    setNoctisDocumentFormValue('title', getNoctisDocumentTitle(row));
    setNoctisDocumentFormValue('slug', getNoctisDocumentSlug(row));
    setNoctisDocumentFormValue('document_type', getNoctisDocumentType(row));
    setNoctisDocumentFormValue('category_label', getNoctisDocumentArchiveSection(row));
    setNoctisDocumentFormValue('author', getNoctisDocumentAuthor(row));
    setNoctisDocumentFormValue('attribution', getNoctisDocumentAttribution(row));
    setNoctisDocumentFormValue('shelf_mark', getNoctisDocumentShelfMark(row));
    setNoctisDocumentFormValue('excerpt', getNoctisDocumentExcerpt(row));
    setNoctisDocumentFormValue('body', getNoctisDocumentBody(row));
    setNoctisDocumentFormValue('tags', formatAdminList(getNoctisDocumentTags(row)));
    setNoctisDocumentFormValue('themes', formatAdminList(getNoctisDocumentThemes(row)));
    setNoctisDocumentFormValue('mode', getNoctisDocumentMode(row) === '--' ? 'blood_moon' : getNoctisDocumentMode(row));
    setNoctisDocumentFormValue('is_published', getNoctisDocumentPublishedBoolean(row));
    setNoctisDocumentFormValue('is_featured', getNoctisDocumentFeaturedBoolean(row));
    setNoctisDocumentFormValue('is_notable', getNoctisDocumentNotableBoolean(row));
    setNoctisDocumentFormValue('is_blood_moon', getNoctisDocumentBloodMoonBoolean(row));
    setNoctisDocumentFormValue('sort_order', getNoctisDocumentSortOrder(row));
    setNoctisDocumentFormValue('unlock_key', formatValue(getFirstValue(row, ['unlock_key'])));
    setNoctisDocumentFormValue('required_artifact_key', formatValue(getFirstValue(row, ['required_artifact_key'])));
    setNoctisDocumentFormValue('required_fragment_key', formatValue(getFirstValue(row, ['required_fragment_key'])));
  } else {
    editingNoctisDocumentId = null;
    noctisDocumentFormTitle.textContent = 'New Document';
    noctisDocumentFormSubmitButton.textContent = 'Create Document';
    setNoctisDocumentFormValue('document_type', 'journal');
    setNoctisDocumentFormValue('mode', 'blood_moon');
  }

  noctisDocumentFormPanel.hidden = false;
  noctisDocumentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getNoctisDocumentFormPayload() {
  const formData = new FormData(noctisDocumentForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const title = String(formData.get('title') || '').trim();
  const documentType = normalizeNoctisDocumentType(formData.get('document_type'));
  const mode = String(formData.get('mode') || 'blood_moon').trim() || 'blood_moon';
  const payload = {
    title,
    slug: String(formData.get('slug') || '').trim() || toKebabCase(title),
    document_type: documentType,
    category_label: String(formData.get('category_label') || '').trim() || null,
    category: getNoctisDocumentCategory(documentType),
    author: String(formData.get('author') || '').trim() || null,
    attribution: String(formData.get('attribution') || '').trim() || null,
    shelf_mark: String(formData.get('shelf_mark') || '').trim() || null,
    excerpt: String(formData.get('excerpt') || '').trim() || null,
    body: String(formData.get('body') || '').trim(),
    tags: parseAdminList(formData.get('tags')),
    themes: parseAdminList(formData.get('themes')),
    mode,
    moon_phase: mode,
    is_published: formData.has('is_published'),
    is_featured: formData.has('is_featured'),
    is_notable: formData.has('is_notable'),
    is_blood_moon: formData.has('is_blood_moon') || mode === 'blood_moon' || documentType === 'blood_moon',
    unlock_key: String(formData.get('unlock_key') || '').trim() || null,
    required_artifact_key: String(formData.get('required_artifact_key') || '').trim() || null,
    required_fragment_key: String(formData.get('required_fragment_key') || '').trim() || null,
  };

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  return payload;
}

function validateNoctisDocumentPayload(payload) {
  const missingFields = [];

  if (!payload.title) {
    missingFields.push('title');
  }

  if (!payload.document_type) {
    missingFields.push('document_type');
  }

  if (!payload.body) {
    missingFields.push('body');
  }

  return missingFields;
}

async function refreshNoctisDocuments(message = '') {
  noctisDocumentsLoaded = false;
  hideNoctisDocumentDetail();
  await loadNoctisDocuments();

  if (message) {
    setNoctisDocumentsState(message, 'success');
  }
}

async function makeNoctisDocumentFeatured(row, button) {
  const documentId = getNoctisDocumentId(row);
  const supabase = getSupabaseClient();

  if (!documentId) {
    setNoctisDocumentsState('This document cannot be featured because it is missing an id.', 'error');
    return;
  }

  if (!getNoctisDocumentPublishedBoolean(row)) {
    setNoctisDocumentsState('Publish this document before featuring it.', 'error');
    return;
  }

  if (!supabase) {
    setNoctisDocumentsState('Noctis documents cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;

  try {
    const { error: clearError } = await supabase
      .from('noctis_documents')
      .update({ is_featured: false, updated_at: new Date().toISOString() })
      .neq('id', documentId);

    if (clearError) {
      throw clearError;
    }

    const { error: featureError } = await supabase
      .from('noctis_documents')
      .update({ is_featured: true, updated_at: new Date().toISOString() })
      .eq('id', documentId)
      .select('id')
      .single();

    if (featureError) {
      throw featureError;
    }

    await refreshNoctisDocuments('Featured document updated.');
  } catch (error) {
    button.disabled = false;
    setNoctisDocumentsState(`Featured document could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    await loadNoctisDocuments();
  }
}

async function handleNoctisDocumentFormSubmit(event) {
  event.preventDefault();

  const payload = getNoctisDocumentFormPayload();
  const missingFields = validateNoctisDocumentPayload(payload);

  if (missingFields.length) {
    setNoctisDocumentFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setNoctisDocumentFormState('Noctis documents cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  noctisDocumentFormSubmitButton.disabled = true;
  setNoctisDocumentFormState(editingNoctisDocumentId ? 'Saving document changes...' : 'Creating document...');

  const query = editingNoctisDocumentId
    ? supabase.from('noctis_documents').update(payload).eq('id', editingNoctisDocumentId).select('*').single()
    : supabase.from('noctis_documents').insert(payload).select('*').single();

  const { error } = await query;

  if (error) {
    noctisDocumentFormSubmitButton.disabled = false;
    setNoctisDocumentFormState(`Document could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingNoctisDocumentId ? 'Document updated successfully.' : 'Document created successfully.';
  hideNoctisDocumentForm();
  await refreshNoctisDocuments(successMessage);
}

async function toggleNoctisDocumentPublished(row, button) {
  const documentId = getNoctisDocumentId(row);
  const supabase = getSupabaseClient();

  if (!documentId) {
    setNoctisDocumentsState('This document cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setNoctisDocumentsState('Noctis documents cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextPublishedState = !getNoctisDocumentPublishedBoolean(row);
  const { error } = await supabase
    .from('noctis_documents')
    .update({ is_published: nextPublishedState })
    .eq('id', documentId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setNoctisDocumentsState(`Publish status could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshNoctisDocuments(nextPublishedState ? 'Document published.' : 'Document unpublished.');
}

async function deleteNoctisDocument(row, button) {
  const documentId = getNoctisDocumentId(row);
  const title = getNoctisDocumentTitle(row);
  const supabase = getSupabaseClient();

  if (!documentId) {
    setNoctisDocumentsState('This document cannot be deleted because it is missing an id.', 'error');
    return;
  }

  if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
    return;
  }

  if (!supabase) {
    setNoctisDocumentsState('Noctis documents cannot be deleted because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const { error } = await supabase
    .from('noctis_documents')
    .delete()
    .eq('id', documentId);

  if (error) {
    button.disabled = false;
    setNoctisDocumentsState(`Document could not be deleted. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshNoctisDocuments('Document deleted.');
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

function setCharacterLineFormValue(fieldName, value) {
  const field = characterLineForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function showCharacterLineForm(row = null) {
  hideCharacterLineFormState();

  if (row) {
    editingCharacterLineId = getCharacterLineId(row);
    characterLineFormTitle.textContent = 'Edit Line';
    characterLineFormSubmitButton.textContent = 'Save Line';
    setCharacterLineFormCancelVisible(true);
    setCharacterLineFormValue('reader_id', getCharacterLineReaderId(row));
    setCharacterLineFormValue('reader_name', getCharacterLineReaderName(row));
    setCharacterLineFormValue('mode', getCharacterLineMode(row));
    setCharacterLineFormValue('context', getCharacterLineContext(row));
    setCharacterLineFormValue('line_text', getCharacterLineText(row));
    setCharacterLineFormValue('tone', getCharacterLineTone(row));
    setCharacterLineFormValue('deck_id', getCharacterLineDeckId(row));
    setCharacterLineFormValue('room_id', getCharacterLineRoomId(row));
    setCharacterLineFormValue('sort_order', getCharacterLineSortOrder(row));
    setCharacterLineFormValue('is_active', getCharacterLineActiveBoolean(row));
  } else {
    hideCharacterLineForm();
  }

  characterLineFormPanel.hidden = false;
  characterLineForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getCharacterLineFormPayload() {
  const formData = new FormData(characterLineForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const payload = {
    reader_id: String(formData.get('reader_id') || '').trim(),
    reader_name: String(formData.get('reader_name') || '').trim(),
    mode: String(formData.get('mode') || 'all').trim() || 'all',
    context: String(formData.get('context') || 'reading_intro').trim() || 'reading_intro',
    line_text: String(formData.get('line_text') || '').trim(),
    tone: String(formData.get('tone') || '').trim() || null,
    deck_id: String(formData.get('deck_id') || '').trim() || null,
    room_id: String(formData.get('room_id') || '').trim() || null,
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

async function getNextCharacterLineSortOrder(supabase, payload) {
  let query = supabase
    .from('reader_lines')
    .select('sort_order')
    .eq('reader_id', payload.reader_id)
    .eq('mode', payload.mode)
    .eq('context', payload.context)
    .not('sort_order', 'is', null)
    .order('sort_order', { ascending: false })
    .limit(1);

  query = payload.deck_id ? query.eq('deck_id', payload.deck_id) : query.is('deck_id', null);
  query = payload.room_id ? query.eq('room_id', payload.room_id) : query.is('room_id', null);

  const { data, error } = await query;

  if (error) {
    console.error('Character line sort order lookup failed:', error);
    throw error;
  }

  const maxSortOrder = Number(data?.[0]?.sort_order);

  return Number.isFinite(maxSortOrder) ? maxSortOrder + 1 : 1;
}

function validateCharacterLinePayload(payload) {
  const missingFields = [];

  if (!payload.reader_id) {
    missingFields.push('reader id');
  }

  if (!payload.reader_name) {
    missingFields.push('reader name');
  }

  if (!characterLineModes.includes(payload.mode)) {
    missingFields.push('valid mode');
  }

  if (!characterLineContexts.includes(payload.context)) {
    missingFields.push('valid context');
  }

  if (!payload.line_text) {
    missingFields.push('line text');
  }

  return missingFields;
}

async function refreshCharacterLines(message = '') {
  characterLinesLoaded = false;
  await loadCharacterLines();

  if (message) {
    setCharacterLinesState(message, 'success');
  }
}

async function handleCharacterLineFormSubmit(event) {
  event.preventDefault();

  const payload = getCharacterLineFormPayload();
  const missingFields = validateCharacterLinePayload(payload);

  if (missingFields.length) {
    setCharacterLineFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setCharacterLineFormState('Character lines cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  characterLineFormSubmitButton.disabled = true;
  setCharacterLineFormState(editingCharacterLineId ? 'Saving line changes...' : 'Creating line...');

  if (!editingCharacterLineId && !Object.prototype.hasOwnProperty.call(payload, 'sort_order')) {
    try {
      payload.sort_order = await getNextCharacterLineSortOrder(supabase, payload);
    } catch {
      characterLineFormSubmitButton.disabled = false;
      setCharacterLineFormState('Character line could not be sorted automatically. Please try again or enter a sort order.', 'error');
      return;
    }
  }

  const query = editingCharacterLineId
    ? supabase.from('reader_lines').update(payload).eq('id', editingCharacterLineId).select('*').single()
    : supabase.from('reader_lines').insert(payload).select('*').single();

  const { error } = await query;

  if (error) {
    characterLineFormSubmitButton.disabled = false;
    setCharacterLineFormState(`Character line could not be saved. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  const successMessage = editingCharacterLineId ? 'Character line updated successfully.' : 'Character line created successfully.';
  hideCharacterLineForm();
  await refreshCharacterLines(successMessage);
}

async function toggleCharacterLineActive(row, button) {
  const lineId = getCharacterLineId(row);
  const supabase = getSupabaseClient();

  if (!lineId) {
    setCharacterLinesState('This character line cannot be updated because it is missing an id.', 'error');
    return;
  }

  if (!supabase) {
    setCharacterLinesState('Character lines cannot be updated because the archive connection is not configured.', 'error');
    return;
  }

  button.disabled = true;
  const nextActiveState = !getCharacterLineActiveBoolean(row);
  const { error } = await supabase
    .from('reader_lines')
    .update({ is_active: nextActiveState })
    .eq('id', lineId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setCharacterLinesState(`Character line status could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshCharacterLines(nextActiveState ? 'Character line activated.' : 'Character line deactivated.');
}

function hideContactMessageDetail() {
  activeContactMessageId = null;
  contactMessageDetail.hidden = true;
  hideContactMessageDetailState();
}

function showContactMessageDetail(indexOrRow) {
  const row = typeof indexOrRow === 'number' ? contactMessageRows[indexOrRow] : indexOrRow;

  if (!row) {
    return;
  }

  activeContactMessageId = getContactMessageId(row);
  contactMessageDetailTitle.textContent = getContactMessageSubject(row);
  contactMessageDetailMeta.replaceChildren();
  contactMessageDetailFields.replaceChildren();
  contactMessageDetailBody.textContent = getContactMessageText(row);
  hideContactMessageDetailState();

  appendDetailChip(contactMessageDetailMeta, 'Status', getContactMessageStatus(row));
  appendDetailChip(contactMessageDetailMeta, 'Topic', getContactMessageTopic(row));
  appendDetailChip(contactMessageDetailMeta, 'Email', getContactMessageEmail(row));
  appendDetailField(contactMessageDetailFields, 'Created', getContactMessageCreatedAt(row));
  appendDetailField(contactMessageDetailFields, 'Email', getContactMessageEmail(row));
  appendDetailField(contactMessageDetailFields, 'Topic', getContactMessageTopic(row));
  appendDetailField(contactMessageDetailFields, 'Status', getContactMessageStatus(row));
  appendDetailField(contactMessageDetailFields, 'User ID', formatValue(getFirstValue(row, ['user_id'])));
  appendDetailField(contactMessageDetailFields, 'Message ID', formatValue(getContactMessageId(row)));

  if (contactMessageDetailStatus) {
    contactMessageDetailStatus.value = getContactMessageStatus(row);
  }

  if (contactMessageAdminNotes) {
    const notes = getContactMessageAdminNotes(row);
    contactMessageAdminNotes.value = notes === '--' ? '' : notes;
  }

  contactMessageDetail.hidden = false;
  contactMessageDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function refreshContactMessages(message = '') {
  contactMessagesLoaded = false;
  await loadContactMessages();

  if (message) {
    setContactMessagesState(message, 'success');
  }
}

async function refreshContactMessagesAfterUpdate(updatedRow = null, message = '') {
  const shouldKeepDetailOpen = Boolean(activeContactMessageId);

  await refreshContactMessages(message);

  if (!shouldKeepDetailOpen) {
    return;
  }

  const refreshedRow = contactMessageRows.find((row) => getContactMessageId(row) === activeContactMessageId) || updatedRow;

  if (refreshedRow) {
    showContactMessageDetail(refreshedRow);
  }
}

async function updateContactMessageStatus(row, nextStatus, field) {
  const messageId = getContactMessageId(row);
  const previousStatus = getContactMessageStatus(row);
  const supabase = getSupabaseClient();

  if (!messageId || !supabase) {
    setContactMessagesState('Contact message status cannot be updated right now.', 'error');
    if (field) {
      field.value = previousStatus;
    }
    return;
  }

  if (field) {
    field.disabled = true;
  }

  const payload = {
    status: nextStatus,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('contact_messages')
    .update(payload)
    .eq('id', messageId)
    .select('*')
    .single();

  if (field) {
    field.disabled = false;
  }

  if (error) {
    if (field) {
      field.value = previousStatus;
    }
    setContactMessagesState(`Contact message status could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshContactMessagesAfterUpdate(data, 'Contact message status updated.');
}

async function handleContactMessageNotesSubmit(event) {
  event.preventDefault();

  const supabase = getSupabaseClient();

  if (!activeContactMessageId || !supabase) {
    setContactMessageDetailState('Contact message cannot be updated right now.', 'error');
    return;
  }

  const payload = {
    status: contactMessageDetailStatus?.value || 'new',
    admin_notes: String(contactMessageAdminNotes?.value || '').trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (contactMessageNotesSubmitButton) {
    contactMessageNotesSubmitButton.disabled = true;
  }
  setContactMessageDetailState('Saving contact message...');

  const { data, error } = await supabase
    .from('contact_messages')
    .update(payload)
    .eq('id', activeContactMessageId)
    .select('*')
    .single();

  if (contactMessageNotesSubmitButton) {
    contactMessageNotesSubmitButton.disabled = false;
  }

  if (error) {
    setContactMessageDetailState(`Contact message could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  setContactMessageDetailState('Contact message updated.', 'success');
  await refreshContactMessagesAfterUpdate(data);
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

function createAdminImagePreview(label, imageUrl) {
  const url = String(imageUrl || '').trim();

  if (!url || url === '--') {
    return null;
  }

  const preview = document.createElement('div');
  const labelElement = document.createElement('span');
  const image = document.createElement('img');
  const link = document.createElement('a');

  preview.className = 'admin-image-preview';
  labelElement.textContent = label;
  image.src = url;
  image.alt = label;
  image.loading = 'lazy';
  image.decoding = 'async';
  link.href = url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.textContent = url;
  preview.append(labelElement, image, link);

  return preview;
}

function toKebabCase(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseAdminList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeAdminListField(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (value && typeof value === 'object') {
    return Object.values(value).map((item) => String(item || '').trim()).filter(Boolean);
  }

  return parseAdminList(value);
}

function formatAdminList(value) {
  return normalizeAdminListField(value).join(', ');
}

function normalizeGalleryAdminValue(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ');
}

function getGalleryRecordFilterValue(filterName) {
  const field = galleryRecordFilters.find((filter) => filter.dataset.galleryRecordFilter === filterName);
  return field ? String(field.value || '').trim() : '__all';
}

function getGalleryRecordSearchText(row) {
  return [
    getGalleryRecordTitle(row),
    getGalleryRecordSlug(row),
    getGalleryRecordType(row),
    getGalleryRecordStatus(row),
    formatAdminList(row.tags),
    formatAdminList(row.themes),
  ]
    .map(normalizeGalleryAdminValue)
    .join(' ');
}

function matchesGalleryRecordFilters(row) {
  const search = normalizeGalleryAdminValue(getGalleryRecordFilterValue('search'));
  const type = getGalleryRecordFilterValue('type');
  const status = getGalleryRecordFilterValue('status');
  const visibility = getGalleryRecordFilterValue('visibility');

  if (search && !getGalleryRecordSearchText(row).includes(search)) {
    return false;
  }

  if (type !== '__all' && normalizeGalleryAdminValue(getGalleryRecordType(row)) !== normalizeGalleryAdminValue(type)) {
    return false;
  }

  if (status !== '__all' && normalizeGalleryAdminValue(getGalleryRecordStatus(row)) !== normalizeGalleryAdminValue(status)) {
    return false;
  }

  if (visibility === 'active' && !getGalleryRecordActiveBoolean(row)) {
    return false;
  }

  if (visibility === 'inactive' && getGalleryRecordActiveBoolean(row)) {
    return false;
  }

  if (visibility === 'featured' && !getGalleryRecordFeaturedBoolean(row)) {
    return false;
  }

  return true;
}

function updateGalleryRecordStats() {
  const total = galleryRecordRows.length;
  const active = galleryRecordRows.filter(getGalleryRecordActiveBoolean).length;
  const featured = galleryRecordRows.filter(getGalleryRecordFeaturedBoolean).length;
  const inactive = total - active;

  if (galleryRecordStats.total) {
    galleryRecordStats.total.textContent = String(total);
  }

  if (galleryRecordStats.active) {
    galleryRecordStats.active.textContent = String(active);
  }

  if (galleryRecordStats.featured) {
    galleryRecordStats.featured.textContent = String(featured);
  }

  if (galleryRecordStats.inactive) {
    galleryRecordStats.inactive.textContent = String(inactive);
  }
}

function applyGalleryRecordFilters({ resetPage = true } = {}) {
  filteredGalleryRecordRows = galleryRecordRows.filter(matchesGalleryRecordFilters);

  if (resetPage) {
    galleryRecordsCurrentPage = 1;
  }
}

function setGalleryRecordFormValue(fieldName, value) {
  const field = galleryRecordForm.elements[fieldName];

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value && value !== '--' ? value : '';
}

function showGalleryRecordForm(row = null) {
  hideGalleryRecordDetail();
  hideGalleryRecordFormState();
  galleryRecordForm.reset();

  if (row) {
    editingGalleryRecordId = getGalleryRecordId(row);
    galleryRecordForm.elements.slug.dataset.manual = 'true';
    galleryRecordFormTitle.textContent = 'Edit Gallery Record';
    galleryRecordFormSubmitButton.textContent = 'Save Changes';
    setGalleryRecordFormValue('title', row.title || '');
    setGalleryRecordFormValue('slug', row.slug || '');
    setGalleryRecordFormValue('unknown_title', row.unknown_title || '');
    setGalleryRecordFormValue('record_type', row.record_type || 'portrait');
    setGalleryRecordFormValue('status', row.status || 'available');
    setGalleryRecordFormValue('origin', row.origin || 'Noctis Archive');
    setGalleryRecordFormValue('related_room', row.related_room || 'The Gallery');
    setGalleryRecordFormValue('sort_order', row.sort_order ?? '');
    setGalleryRecordFormValue('required_fragments', row.required_fragments ?? 0);
    setGalleryRecordFormValue('description', row.description || '');
    setGalleryRecordFormValue('lore_note', row.lore_note || '');
    setGalleryRecordFormValue('tags', formatAdminList(row.tags));
    setGalleryRecordFormValue('themes', formatAdminList(row.themes));
    setGalleryRecordFormValue('preview_image_url', row.preview_image_url || '');
    setGalleryRecordFormValue('full_image_url', row.full_image_url || '');
    setGalleryRecordFormValue('related_document_id', row.related_document_id || '');
    setGalleryRecordFormValue('is_featured', getGalleryRecordFeaturedBoolean(row));
    setGalleryRecordFormValue('is_active', getGalleryRecordActiveBoolean(row));
    setGalleryRecordFormValue('is_fragmented', Boolean(row.is_fragmented));
    setGalleryRecordFormValue('upload_folder', inferGalleryUploadFolder(row));
    updateGalleryRecordPreview(getGalleryRecordImageUrl(row));
  } else {
    editingGalleryRecordId = null;
    galleryRecordForm.elements.slug.dataset.manual = 'false';
    galleryRecordFormTitle.textContent = 'New Gallery Record';
    galleryRecordFormSubmitButton.textContent = 'Create Gallery Record';
    galleryRecordForm.elements.record_type.value = 'portrait';
    galleryRecordForm.elements.status.value = 'available';
    galleryRecordForm.elements.upload_folder.value = 'portraits';
    galleryRecordForm.elements.origin.value = 'Noctis Archive';
    galleryRecordForm.elements.related_room.value = 'The Gallery';
    galleryRecordForm.elements.required_fragments.value = '0';
    galleryRecordForm.elements.is_active.checked = true;
    galleryRecordForm.elements.is_featured.checked = false;
    galleryRecordForm.elements.is_fragmented.checked = false;
    updateGalleryRecordPreview('');
  }

  galleryRecordFormPanel.hidden = false;
  galleryRecordForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function inferGalleryUploadFolder(row) {
  const imageUrl = String(row?.preview_image_url || row?.full_image_url || '');
  const folder = galleryUploadFolders.find((folderName) => imageUrl.includes(`/${folderName}/`));

  if (folder) {
    return folder;
  }

  const type = String(row?.record_type || '').toLowerCase();

  if (type === 'portrait') {
    return 'portraits';
  }

  if (type === 'place') {
    return 'places';
  }

  if (type === 'symbol') {
    return 'symbols';
  }

  if (type === 'map') {
    return 'maps';
  }

  if (type === 'anomaly') {
    return 'anomalies';
  }

  if (galleryUploadFolders.includes(type)) {
    return type;
  }

  return 'featured';
}

function getGalleryRecordFormPayload() {
  const formData = new FormData(galleryRecordForm);
  const title = String(formData.get('title') || '').trim();
  const slug = toKebabCase(formData.get('slug') || title);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const requiredFragmentsValue = String(formData.get('required_fragments') || '').trim();
  const payload = {
    title,
    slug,
    unknown_title: String(formData.get('unknown_title') || '').trim() || null,
    description: String(formData.get('description') || '').trim() || null,
    lore_note: String(formData.get('lore_note') || '').trim() || null,
    record_type: String(formData.get('record_type') || 'portrait').trim() || 'portrait',
    origin: String(formData.get('origin') || 'Noctis Archive').trim() || 'Noctis Archive',
    status: String(formData.get('status') || 'available').trim() || 'available',
    preview_image_url: String(formData.get('preview_image_url') || '').trim() || null,
    full_image_url: String(formData.get('full_image_url') || '').trim() || null,
    required_fragments: 0,
    is_fragmented: formData.has('is_fragmented'),
    is_featured: formData.has('is_featured'),
    is_active: formData.has('is_active'),
    tags: parseAdminList(formData.get('tags')),
    themes: parseAdminList(formData.get('themes')),
    related_room: String(formData.get('related_room') || 'The Gallery').trim() || null,
    related_document_id: String(formData.get('related_document_id') || '').trim() || null,
  };

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      payload.sort_order = sortOrder;
    }
  }

  if (requiredFragmentsValue !== '') {
    const requiredFragments = Number(requiredFragmentsValue);

    if (!Number.isNaN(requiredFragments)) {
      payload.required_fragments = requiredFragments;
    }
  }

  return { payload, file: formData.get('image_file'), uploadFolder: String(formData.get('upload_folder') || 'featured').trim() };
}

function validateGalleryRecordPayload(payload, file) {
  const missingFields = [];

  if (!payload.title) {
    missingFields.push('title');
  }

  if (!payload.slug) {
    missingFields.push('slug');
  }

  if (!payload.record_type) {
    missingFields.push('record_type');
  }

  if (!payload.status) {
    missingFields.push('status');
  }

  if (file && file.size && !file.type.startsWith('image/')) {
    missingFields.push('image file must be an image');
  }

  return missingFields;
}

function getGalleryRecordUploadPath({ folder, slug, title, file }) {
  const safeFolder = galleryUploadFolders.includes(folder) ? folder : 'featured';
  const extension = String(file.name || '').split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const baseName = toKebabCase(slug || title || 'gallery-record') || 'gallery-record';

  return `${safeFolder}/${baseName}-${Date.now()}.${extension}`;
}

async function uploadGalleryRecordImage(supabase, { file, folder, slug, title }) {
  if (!file || !file.size) {
    return '';
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file must be an image.');
  }

  const uploadPath = getGalleryRecordUploadPath({ folder, slug, title, file });
  const { error } = await supabase.storage
    .from(galleryStorageBucket)
    .upload(uploadPath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage
    .from(galleryStorageBucket)
    .getPublicUrl(uploadPath);

  return data?.publicUrl || '';
}

async function galleryRecordSlugExists(supabase, slug) {
  const { data, error } = await supabase
    .from('gallery_records')
    .select('id')
    .eq('slug', slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    return { exists: false, error };
  }

  return { exists: Boolean(data), error: null };
}

async function refreshGalleryRecords(message = '') {
  galleryRecordsLoaded = false;
  hideGalleryRecordDetail();
  await loadGalleryRecords();

  if (message) {
    setGalleryRecordsState(message, 'success');
  }
}

function getGalleryRecordsTotalPages() {
  return Math.max(1, Math.ceil(filteredGalleryRecordRows.length / galleryRecordsPageSize));
}

function getGalleryRecordPageNumbers() {
  const totalPages = getGalleryRecordsTotalPages();
  const maxButtons = 7;
  const halfWindow = Math.floor(maxButtons / 2);
  let start = Math.max(1, galleryRecordsCurrentPage - halfWindow);
  const end = Math.min(totalPages, start + maxButtons - 1);

  start = Math.max(1, end - maxButtons + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function getPaginatedGalleryRecordRows() {
  const start = (galleryRecordsCurrentPage - 1) * galleryRecordsPageSize;
  return filteredGalleryRecordRows.slice(start, start + galleryRecordsPageSize);
}

function renderGalleryRecordsPagination() {
  const totalPages = getGalleryRecordsTotalPages();
  const hasRecords = filteredGalleryRecordRows.length > 0;

  if (!galleryRecordsPagination || !galleryRecordsPaginationControls || !galleryRecordsPaginationSummary) {
    return;
  }

  galleryRecordsPagination.hidden = !hasRecords;
  galleryRecordsPaginationControls.replaceChildren();

  if (!hasRecords) {
    galleryRecordsPaginationSummary.textContent = 'Showing 0-0 of 0 records';
    return;
  }

  const from = (galleryRecordsCurrentPage - 1) * galleryRecordsPageSize + 1;
  const to = Math.min(from + getPaginatedGalleryRecordRows().length - 1, filteredGalleryRecordRows.length);
  const previousButton = document.createElement('button');
  const nextButton = document.createElement('button');

  galleryRecordsPaginationSummary.textContent = `Showing ${from}-${to} of ${filteredGalleryRecordRows.length} records`;

  previousButton.className = 'admin-pagination__button';
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = galleryRecordsCurrentPage <= 1;
  previousButton.addEventListener('click', () => {
    if (galleryRecordsCurrentPage > 1) {
      galleryRecordsCurrentPage -= 1;
      renderGalleryRecordRows();
    }
  });
  galleryRecordsPaginationControls.append(previousButton);

  getGalleryRecordPageNumbers().forEach((pageNumber) => {
    const pageButton = document.createElement('button');

    pageButton.className = `admin-pagination__button${pageNumber === galleryRecordsCurrentPage ? ' is-active' : ''}`;
    pageButton.type = 'button';
    pageButton.textContent = String(pageNumber);
    pageButton.setAttribute('aria-label', `Page ${pageNumber}`);
    pageButton.setAttribute('aria-current', pageNumber === galleryRecordsCurrentPage ? 'page' : 'false');
    pageButton.disabled = pageNumber === galleryRecordsCurrentPage;
    pageButton.addEventListener('click', () => {
      galleryRecordsCurrentPage = pageNumber;
      renderGalleryRecordRows();
    });
    galleryRecordsPaginationControls.append(pageButton);
  });

  nextButton.className = 'admin-pagination__button';
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = galleryRecordsCurrentPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (galleryRecordsCurrentPage < totalPages) {
      galleryRecordsCurrentPage += 1;
      renderGalleryRecordRows();
    }
  });
  galleryRecordsPaginationControls.append(nextButton);
}

function renderGalleryRecordRows(rows = getPaginatedGalleryRecordRows()) {
  galleryRecordsTableBody.replaceChildren();

  if (galleryRecordsCurrentPage > getGalleryRecordsTotalPages()) {
    galleryRecordsCurrentPage = getGalleryRecordsTotalPages();
    rows = getPaginatedGalleryRecordRows();
  }

  if (!rows.length) {
    setGalleryRecordsState(galleryRecordRows.length ? 'No Gallery records match these filters.' : 'No Gallery records found.');
    galleryRecordsTableWrap.hidden = true;
    renderGalleryRecordsPagination();
    return;
  }

  galleryRecordsState.hidden = true;
  galleryRecordsTableWrap.hidden = false;

  rows.forEach((row) => {
    const tableRow = document.createElement('tr');
    const featuredCell = document.createElement('td');
    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    const viewButton = document.createElement('button');
    const editButton = document.createElement('button');
    const featuredButton = document.createElement('button');
    const activeButton = document.createElement('button');

    appendImageCell(tableRow, 'Preview', getGalleryRecordImageUrl(row), getGalleryRecordTitle(row));
    appendTextCell(tableRow, 'Title', getGalleryRecordTitle(row), 'admin-table__title');
    appendTextCell(tableRow, 'Type', getGalleryRecordType(row));
    appendTextCell(tableRow, 'Status', getGalleryRecordStatus(row));

    featuredCell.dataset.label = 'Featured';
    featuredButton.className = `gallery-record-feature-button${getGalleryRecordFeaturedBoolean(row) ? ' is-active' : ''}`;
    featuredButton.type = 'button';
    featuredButton.textContent = getGalleryRecordFeaturedBoolean(row) ? '★' : '☆';
    featuredButton.setAttribute('aria-label', getGalleryRecordFeaturedBoolean(row) ? 'Remove from featured' : 'Mark as featured');
    featuredButton.title = getGalleryRecordFeaturedBoolean(row) ? 'Remove from featured' : 'Mark as featured';
    featuredButton.addEventListener('click', () => toggleGalleryRecordFeatured(row, featuredButton));
    featuredCell.append(featuredButton);
    tableRow.append(featuredCell);

    appendTextCell(tableRow, 'Active', getGalleryRecordActiveState(row));
    appendTextCell(tableRow, 'Sort', getGalleryRecordSortOrder(row));

    viewButton.className = 'admin-row-action';
    viewButton.type = 'button';
    viewButton.textContent = 'View';
    viewButton.addEventListener('click', () => showGalleryRecordDetail(row));

    editButton.className = 'admin-row-action';
    editButton.type = 'button';
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => showGalleryRecordForm(row));

    activeButton.className = 'admin-row-action';
    activeButton.type = 'button';
    activeButton.textContent = getGalleryRecordActiveBoolean(row) ? 'Deactivate' : 'Activate';
    activeButton.addEventListener('click', () => toggleGalleryRecordActive(row, activeButton));

    actionGroup.className = 'admin-action-group';
    actionCell.dataset.label = 'Actions';
    actionGroup.append(viewButton, editButton, activeButton);
    actionCell.append(actionGroup);
    tableRow.append(actionCell);
    galleryRecordsTableBody.append(tableRow);
  });

  renderGalleryRecordsPagination();
}

function showGalleryRecordDetail(row) {
  if (!row) {
    return;
  }

  galleryRecordDetailTitle.textContent = getGalleryRecordTitle(row);
  galleryRecordDetailMeta.replaceChildren();
  galleryRecordDetailFields.replaceChildren();
  galleryRecordDetailImages.replaceChildren();
  galleryRecordDetailBody.textContent = getGalleryRecordLoreNote(row) !== '--'
    ? getGalleryRecordLoreNote(row)
    : getGalleryRecordDescription(row);

  appendDetailChip(galleryRecordDetailMeta, 'Type', getGalleryRecordType(row));
  appendDetailChip(galleryRecordDetailMeta, 'Status', getGalleryRecordStatus(row));
  appendDetailChip(galleryRecordDetailMeta, 'Featured', getGalleryRecordFeaturedState(row));
  appendDetailChip(galleryRecordDetailMeta, 'Active', getGalleryRecordActiveState(row));
  appendDetailField(galleryRecordDetailFields, 'Slug', getGalleryRecordSlug(row));
  appendDetailField(galleryRecordDetailFields, 'Unknown Title', formatValue(row.unknown_title));
  appendDetailField(galleryRecordDetailFields, 'Origin', formatValue(row.origin));
  appendDetailField(galleryRecordDetailFields, 'Related Room', formatValue(row.related_room));
  appendDetailField(galleryRecordDetailFields, 'Sort Order', getGalleryRecordSortOrder(row));
  appendDetailField(galleryRecordDetailFields, 'Required Fragments', formatValue(row.required_fragments));
  appendDetailField(galleryRecordDetailFields, 'Fragmented', row.is_fragmented ? 'Yes' : 'No');
  appendDetailField(galleryRecordDetailFields, 'Tags', formatAdminList(row.tags) || '--');
  appendDetailField(galleryRecordDetailFields, 'Themes', formatAdminList(row.themes) || '--');
  appendDetailField(galleryRecordDetailFields, 'Related Document ID', formatValue(row.related_document_id));
  appendDetailField(galleryRecordDetailFields, 'Created', formatDate(row.created_at));
  appendDetailField(galleryRecordDetailFields, 'Updated', formatDate(row.updated_at));

  [createAdminImagePreview('Preview Image', row.preview_image_url), createAdminImagePreview('Full Image', row.full_image_url)]
    .filter(Boolean)
    .forEach((preview) => galleryRecordDetailImages.append(preview));

  galleryRecordDetail.hidden = false;
  galleryRecordDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function handleGalleryRecordFormSubmit(event) {
  event.preventDefault();

  const { payload, file, uploadFolder } = getGalleryRecordFormPayload();
  const missingFields = validateGalleryRecordPayload(payload, file);

  if (missingFields.length) {
    setGalleryRecordFormState(`Please fill in required fields: ${missingFields.join(', ')}.`, 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setGalleryRecordFormState('Gallery records cannot be saved because the archive connection is not configured.', 'error');
    return;
  }

  galleryRecordFormSubmitButton.disabled = true;
  setGalleryRecordFormState(file && file.size ? 'Uploading image and saving gallery record...' : 'Saving gallery record...');

  if (!editingGalleryRecordId) {
    const { exists, error } = await galleryRecordSlugExists(supabase, payload.slug);

    if (error) {
      galleryRecordFormSubmitButton.disabled = false;
      setGalleryRecordFormState(`Gallery slug could not be checked. ${error.message || 'Please try again later.'}`, 'error');
      return;
    }

    if (exists) {
      galleryRecordFormSubmitButton.disabled = false;
      setGalleryRecordFormState('A Gallery record with this slug already exists.', 'error');
      return;
    }
  }

  try {
    const uploadedUrl = await uploadGalleryRecordImage(supabase, {
      file,
      folder: uploadFolder,
      slug: payload.slug,
      title: payload.title,
    });

    if (uploadedUrl) {
      payload.preview_image_url = uploadedUrl;
      payload.full_image_url = uploadedUrl;
    }

    if (!payload.preview_image_url && payload.full_image_url) {
      payload.preview_image_url = payload.full_image_url;
    }

    if (!payload.full_image_url && payload.preview_image_url) {
      payload.full_image_url = payload.preview_image_url;
    }

    const query = editingGalleryRecordId
      ? supabase.from('gallery_records').update(payload).eq('id', editingGalleryRecordId).select('*').single()
      : supabase.from('gallery_records').insert(payload).select('*').single();
    const { error } = await query;

    if (error) {
      throw error;
    }

    const successMessage = editingGalleryRecordId ? 'Gallery record updated successfully.' : 'Gallery record created successfully.';
    hideGalleryRecordForm();
    await refreshGalleryRecords(successMessage);
  } catch (error) {
    galleryRecordFormSubmitButton.disabled = false;
    setGalleryRecordFormState(`Gallery record could not be saved. ${error.message || 'Please try again later.'}`, 'error');
  }
}

async function toggleGalleryRecordFeatured(row, button) {
  const recordId = getGalleryRecordId(row);
  const supabase = getSupabaseClient();

  if (!recordId || !supabase) {
    setGalleryRecordsState('Featured state cannot be updated for this record.', 'error');
    return;
  }

  button.disabled = true;
  const nextFeaturedState = !getGalleryRecordFeaturedBoolean(row);
  const { error } = await supabase
    .from('gallery_records')
    .update({ is_featured: nextFeaturedState, updated_at: new Date().toISOString() })
    .eq('id', recordId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setGalleryRecordsState(`Featured state could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshGalleryRecords(nextFeaturedState ? 'Gallery record marked as featured.' : 'Gallery record removed from featured.');
}

async function toggleGalleryRecordActive(row, button) {
  const recordId = getGalleryRecordId(row);
  const supabase = getSupabaseClient();

  if (!recordId || !supabase) {
    setGalleryRecordsState('Active state cannot be updated for this record.', 'error');
    return;
  }

  button.disabled = true;
  const nextActiveState = !getGalleryRecordActiveBoolean(row);
  const { error } = await supabase
    .from('gallery_records')
    .update({ is_active: nextActiveState, updated_at: new Date().toISOString() })
    .eq('id', recordId)
    .select('id')
    .single();

  if (error) {
    button.disabled = false;
    setGalleryRecordsState(`Active state could not be updated. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  await refreshGalleryRecords(nextActiveState ? 'Gallery record activated.' : 'Gallery record deactivated.');
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

async function refreshVeilwalkers(message = '') {
  veilwalkersLoaded = false;
  hideVeilwalkerDetail();
  await loadVeilwalkers();

  if (message) {
    setVeilwalkersState(message, 'success');
  }
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

const veilwalkerVariantFormGroups = [
  { prefix: 'oracle', defaultKey: 'oracle', defaultMode: 'normal', defaultPhase: 'phase_1' },
  { prefix: 'ascendant', defaultKey: 'ascendant', defaultMode: 'normal', defaultPhase: 'phase_2' },
  { prefix: 'bloodmoon', defaultKey: 'bloodmoon', defaultMode: 'blood_moon', defaultPhase: '' },
];

function getVeilwalkerVariants(row) {
  const variants = row?.veilwalker_variants || row?.variants || [];
  return Array.isArray(variants) ? variants : [];
}

function getVeilwalkerVariantCount(row) {
  return String(getVeilwalkerVariants(row).length);
}

function getVariantForFormGroup(row, config) {
  return getVeilwalkerVariants(row).find((variant) => (
    variant?.variant_key === config.defaultKey
    || (config.defaultPhase && variant?.phase === config.defaultPhase)
    || (config.defaultMode === 'blood_moon' && variant?.mode === 'blood_moon')
  )) || null;
}

function parseVeilwalkerTextList(value) {
  const trimmedValue = String(value || '').trim();

  if (!trimmedValue) {
    return [];
  }

  if (trimmedValue.startsWith('[')) {
    try {
      const parsedValue = JSON.parse(trimmedValue);
      return Array.isArray(parsedValue) ? parsedValue.map((item) => String(item).trim()).filter(Boolean) : [];
    } catch {
      return trimmedValue.split(',').map((item) => item.trim()).filter(Boolean);
    }
  }

  return trimmedValue.split(',').map((item) => item.trim()).filter(Boolean);
}

function formatVeilwalkerTextList(value) {
  return Array.isArray(value) ? value.join(', ') : String(value || '');
}

function getVeilwalkerFormField(name) {
  return veilwalkerForm.elements[name] || null;
}

function setVeilwalkerVariantFormValue(name, value) {
  const field = getVeilwalkerFormField(name);

  if (!field) {
    return;
  }

  if (field.type === 'checkbox') {
    field.checked = Boolean(value);
    return;
  }

  field.value = value || '';
}

function populateVeilwalkerVariantFormGroup(row, config) {
  const variant = getVariantForFormGroup(row, config);
  const prefix = `variant_${config.prefix}`;

  setVeilwalkerVariantFormValue(`${prefix}_id`, variant?.id || '');
  setVeilwalkerVariantFormValue(`${prefix}_key`, variant?.variant_key || config.defaultKey);
  setVeilwalkerVariantFormValue(`${prefix}_mode`, variant?.mode || config.defaultMode);
  setVeilwalkerVariantFormValue(`${prefix}_phase`, variant?.phase || config.defaultPhase);
  setVeilwalkerVariantFormValue(`${prefix}_title`, variant?.title || '');
  setVeilwalkerVariantFormValue(`${prefix}_description`, variant?.description || '');
  setVeilwalkerVariantFormValue(`${prefix}_focus`, variant?.focus || '');
  setVeilwalkerVariantFormValue(`${prefix}_image_url`, variant?.image_url || '');
  setVeilwalkerVariantFormValue(`${prefix}_profile_image_url`, variant?.profile_image_url || '');
  setVeilwalkerVariantFormValue(`${prefix}_traits`, formatVeilwalkerTextList(variant?.traits));
  setVeilwalkerVariantFormValue(`${prefix}_symbolic_traits`, formatVeilwalkerTextList(variant?.symbolic_traits));
  setVeilwalkerVariantFormValue(`${prefix}_is_available`, variant ? variant.is_available !== false : true);
}

function resetVeilwalkerVariantFormGroups() {
  veilwalkerVariantFormGroups.forEach((config) => populateVeilwalkerVariantFormGroup(null, config));
}

function getVeilwalkerVariantPayloads(formData) {
  return veilwalkerVariantFormGroups
    .map((config, index) => {
      const prefix = `variant_${config.prefix}`;
      const variantKey = String(formData.get(`${prefix}_key`) || config.defaultKey).trim();
      const payload = {
        id: String(formData.get(`${prefix}_id`) || '').trim() || null,
        variant_key: variantKey,
        mode: String(formData.get(`${prefix}_mode`) || config.defaultMode).trim() || 'normal',
        phase: String(formData.get(`${prefix}_phase`) || '').trim() || null,
        title: String(formData.get(`${prefix}_title`) || '').trim() || null,
        subtitle: String(formData.get(`${prefix}_subtitle`) || '').trim() || null,
        description: String(formData.get(`${prefix}_description`) || '').trim() || null,
        focus: String(formData.get(`${prefix}_focus`) || '').trim() || null,
        traits: parseVeilwalkerTextList(formData.get(`${prefix}_traits`)),
        symbolic_traits: parseVeilwalkerTextList(formData.get(`${prefix}_symbolic_traits`)),
        image_url: String(formData.get(`${prefix}_image_url`) || '').trim() || null,
        profile_image_url: String(formData.get(`${prefix}_profile_image_url`) || '').trim() || null,
        is_available: formData.has(`${prefix}_is_available`),
        sort_order: index,
      };

      return payload;
    })
    .filter((payload) => payload.variant_key);
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

    appendTextCell(tableRow, 'Name', getVeilwalkerName(row), 'admin-table__title');
    appendTextCell(tableRow, 'Zodiac', getVeilwalkerZodiac(row));
    appendTextCell(tableRow, 'Element', getVeilwalkerElement(row));
    appendTextCell(tableRow, 'Active', getVeilwalkerActiveState(row));
    appendTextCell(tableRow, 'Variants', getVeilwalkerVariantCount(row));
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
    actionGroup.append(viewButton, editButton, activeButton);
    actionCell.append(actionGroup);
    tableRow.append(actionCell);
    veilwalkersTableBody.append(tableRow);
  });
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
  veilwalkerDetailBody.replaceChildren();

  appendDetailChip(veilwalkerDetailMeta, 'Zodiac', getVeilwalkerZodiac(row));
  appendDetailChip(veilwalkerDetailMeta, 'Element', getVeilwalkerElement(row));
  appendDetailChip(veilwalkerDetailMeta, 'Slug', getVeilwalkerKey(row));
  appendDetailChip(veilwalkerDetailMeta, 'Active', getVeilwalkerActiveState(row));
  appendDetailField(veilwalkerDetailFields, 'Slug', getVeilwalkerKey(row));
  appendDetailField(veilwalkerDetailFields, 'Display Name', getVeilwalkerName(row));
  appendDetailField(veilwalkerDetailFields, 'Zodiac Sign', getVeilwalkerZodiac(row));
  appendDetailField(veilwalkerDetailFields, 'Element', getVeilwalkerElement(row));
  appendDetailField(veilwalkerDetailFields, 'Active', getVeilwalkerActiveState(row));
  appendDetailField(veilwalkerDetailFields, 'Variant Count', getVeilwalkerVariantCount(row));
  appendDetailField(veilwalkerDetailFields, 'Sort Order', getVeilwalkerSortOrder(row));
  appendDetailField(veilwalkerDetailFields, 'Created', formatDate(getFirstValue(row, ['created_at', 'inserted_at'])));
  appendDetailField(veilwalkerDetailFields, 'Updated', formatDate(getFirstValue(row, ['updated_at', 'modified_at', 'last_updated'])));

  getVeilwalkerVariants(row).forEach((variant) => {
    const section = document.createElement('section');
    const title = document.createElement('h4');
    const description = document.createElement('p');

    title.textContent = `${variant.variant_key || 'variant'} / ${variant.mode || 'normal'}${variant.phase ? ` / ${variant.phase}` : ''}`;
    description.textContent = variant.description || variant.focus || 'No variant copy yet.';
    section.append(title, description);
    veilwalkerDetailBody.append(section);

    appendImagePreview(veilwalkerDetailImages, `${variant.variant_key || 'Variant'} Image`, variant.image_url);
    appendImagePreview(veilwalkerDetailImages, `${variant.variant_key || 'Variant'} Profile Image`, variant.profile_image_url);
  });

  veilwalkerDetail.hidden = false;
  veilwalkerDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showVeilwalkerForm(row = null) {
  hideVeilwalkerDetail();
  hideVeilwalkerFormState();
  veilwalkerForm.reset();
  resetVeilwalkerVariantFormGroups();

  if (row) {
    editingVeilwalkerId = getVeilwalkerId(row);
    veilwalkerFormTitle.textContent = 'Edit Veilwalker';
    veilwalkerFormSubmitButton.textContent = 'Save Changes';
    setVeilwalkerFormValue('slug', getFirstValue(row, ['slug', 'veilwalker_key', 'reader_key', 'key']));
    setVeilwalkerFormValue('display_name', getVeilwalkerName(row));
    setVeilwalkerFormValue('zodiac_sign', getVeilwalkerZodiac(row));
    setVeilwalkerFormValue('element', getVeilwalkerElement(row));
    setVeilwalkerFormValue('sort_order', getVeilwalkerSortOrder(row));
    setVeilwalkerFormValue('is_active', getVeilwalkerActiveBoolean(row));
    veilwalkerVariantFormGroups.forEach((config) => populateVeilwalkerVariantFormGroup(row, config));
  } else {
    editingVeilwalkerId = null;
    veilwalkerFormTitle.textContent = 'New Veilwalker';
    veilwalkerFormSubmitButton.textContent = 'Create Veilwalker';
    setVeilwalkerFormValue('is_active', true);
  }

  veilwalkerFormPanel.hidden = false;
  veilwalkerForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getVeilwalkerFormPayload() {
  const formData = new FormData(veilwalkerForm);
  const sortOrderValue = String(formData.get('sort_order') || '').trim();
  const basePayload = {
    slug: String(formData.get('slug') || '').trim(),
    display_name: String(formData.get('display_name') || '').trim(),
    zodiac_sign: String(formData.get('zodiac_sign') || '').trim() || null,
    element: String(formData.get('element') || '').trim() || null,
    is_active: formData.has('is_active'),
  };

  if (sortOrderValue !== '') {
    const sortOrder = Number(sortOrderValue);

    if (!Number.isNaN(sortOrder)) {
      basePayload.sort_order = sortOrder;
    }
  }

  return {
    payload: {
      base: basePayload,
      variants: getVeilwalkerVariantPayloads(formData),
    },
    error: '',
  };
}

function validateVeilwalkerPayload(payload) {
  const missingFields = [];

  if (!payload.base.slug) {
    missingFields.push('slug');
  }

  if (!payload.base.display_name) {
    missingFields.push('display_name');
  }

  return missingFields;
}

async function runVeilwalkerMutation(supabase, payload) {
  const baseQuery = editingVeilwalkerId
    ? supabase.from('veilwalkers').update(payload.base).eq('id', editingVeilwalkerId).select('*').single()
    : supabase.from('veilwalkers').insert(payload.base).select('*').single();
  const { data: savedVeilwalker, error: baseError } = await baseQuery;

  if (baseError) {
    return { error: baseError };
  }

  const veilwalkerId = savedVeilwalker?.id || editingVeilwalkerId;

  for (const variantPayload of payload.variants) {
    const { id, ...variantFields } = variantPayload;
    const mutationPayload = {
      ...variantFields,
      veilwalker_id: veilwalkerId,
    };
    const variantQuery = id
      ? supabase.from('veilwalker_variants').update(mutationPayload).eq('id', id).select('id').single()
      : supabase.from('veilwalker_variants').insert(mutationPayload).select('id').single();
    const { error: variantError } = await variantQuery;

    if (variantError) {
      return { error: variantError };
    }
  }

  return { error: null };
}

async function veilwalkerKeyExists(supabase, slug) {
  let query = supabase
    .from('veilwalkers')
    .select('id')
    .eq('slug', slug)
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

  const { exists, error: duplicateError } = await veilwalkerKeyExists(supabase, payload.base.slug);

  if (duplicateError) {
    veilwalkerFormSubmitButton.disabled = false;
    setVeilwalkerFormState(`Slug could not be checked. ${duplicateError.message || 'Please try again later.'}`, 'error');
    return;
  }

  if (exists) {
    veilwalkerFormSubmitButton.disabled = false;
    setVeilwalkerFormState('A veilwalker with this slug already exists.', 'error');
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

function getAdminUserSearchText(row) {
  return [
    getProfileDisplayName(row),
    getProfileEmail(row),
    getProfileRole(row),
    getProfileAccountStatusLabel(row),
    getProfileId(row),
  ].join(' ').toLowerCase();
}

function getFilteredAdminUserRows() {
  const search = String(adminUserSearchInput?.value || '').trim().toLowerCase();

  if (!search) {
    return [...adminUserRows];
  }

  return adminUserRows.filter((row) => getAdminUserSearchText(row).includes(search));
}

function getAdminUsersTotalPages(rowCount) {
  return Math.max(1, Math.ceil(rowCount / ADMIN_USERS_PAGE_SIZE));
}

function getPaginatedAdminUserRows(rows) {
  const totalPages = getAdminUsersTotalPages(rows.length);
  adminUsersCurrentPage = Math.min(Math.max(adminUsersCurrentPage, 1), totalPages);
  const startIndex = (adminUsersCurrentPage - 1) * ADMIN_USERS_PAGE_SIZE;

  return rows.slice(startIndex, startIndex + ADMIN_USERS_PAGE_SIZE);
}

function renderAdminUsersPagination(totalCount) {
  if (!adminUsersPagination || !adminUsersPaginationSummary || !adminUsersPaginationControls) {
    return;
  }

  adminUsersPaginationControls.replaceChildren();

  if (!totalCount || totalCount <= ADMIN_USERS_PAGE_SIZE) {
    adminUsersPagination.hidden = true;
    adminUsersPaginationSummary.textContent = `Showing ${totalCount ? `1-${totalCount}` : '0-0'} of ${totalCount} users`;
    return;
  }

  const totalPages = getAdminUsersTotalPages(totalCount);
  const from = (adminUsersCurrentPage - 1) * ADMIN_USERS_PAGE_SIZE + 1;
  const to = Math.min(from + ADMIN_USERS_PAGE_SIZE - 1, totalCount);
  const previousButton = document.createElement('button');
  const pageIndicator = document.createElement('span');
  const nextButton = document.createElement('button');

  adminUsersPaginationSummary.textContent = `Showing ${from}-${to} of ${totalCount} users`;

  previousButton.className = 'admin-pagination__button';
  previousButton.type = 'button';
  previousButton.textContent = 'Previous';
  previousButton.disabled = adminUsersCurrentPage <= 1;
  previousButton.addEventListener('click', () => {
    if (adminUsersCurrentPage > 1) {
      adminUsersCurrentPage -= 1;
      renderAdminUserRows();
    }
  });

  pageIndicator.className = 'admin-pagination__summary';
  pageIndicator.textContent = `Page ${adminUsersCurrentPage} of ${totalPages}`;

  nextButton.className = 'admin-pagination__button';
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  nextButton.disabled = adminUsersCurrentPage >= totalPages;
  nextButton.addEventListener('click', () => {
    if (adminUsersCurrentPage < totalPages) {
      adminUsersCurrentPage += 1;
      renderAdminUserRows();
    }
  });

  adminUsersPaginationControls.append(previousButton, pageIndicator, nextButton);
  adminUsersPagination.hidden = false;
}

function createAdminUserBadge(label, modifier = '') {
  const badge = document.createElement('span');

  badge.className = `noctis-document-badge${modifier ? ` noctis-document-badge--${modifier}` : ''}`;
  badge.textContent = label || '--';
  return badge;
}

function getAdminUserInitials(row) {
  return getInitials(getProfileDisplayName(row) || getProfileEmail(row) || 'User');
}

function appendAdminUserCell(rowElement, row) {
  const cell = document.createElement('td');
  const wrapper = document.createElement('div');
  const avatar = document.createElement('span');
  const avatarUrl = getProfileAvatarUrl(row);
  const text = document.createElement('div');
  const name = document.createElement('div');
  const email = document.createElement('div');

  cell.dataset.label = 'User';
  wrapper.className = 'admin-user-cell';
  avatar.className = 'admin-user-avatar';

  if (avatarUrl && avatarUrl !== '--') {
    const image = document.createElement('img');

    image.src = avatarUrl;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error', () => {
      avatar.textContent = getAdminUserInitials(row);
    }, { once: true });
    avatar.append(image);
  } else {
    avatar.textContent = getAdminUserInitials(row);
  }

  name.className = 'admin-user-name';
  name.textContent = getProfileDisplayName(row);
  email.className = 'admin-user-email';
  email.textContent = getProfileEmail(row) === '--' ? 'Email unavailable' : getProfileEmail(row);
  text.append(name, email);
  wrapper.append(avatar, text);
  cell.append(wrapper);
  rowElement.append(cell);
}

function appendAdminUserBadgeCell(rowElement, label, value, modifier) {
  const cell = document.createElement('td');

  cell.dataset.label = label;
  cell.append(createAdminUserBadge(value, modifier));
  rowElement.append(cell);
}

function appendAdminUserDateCell(rowElement, row) {
  const cell = document.createElement('td');
  const wrapper = document.createElement('div');
  const created = document.createElement('span');
  const updated = document.createElement('span');

  cell.dataset.label = 'Joined / Updated';
  wrapper.className = 'admin-user-date';
  created.textContent = getProfileCreatedAt(row);
  updated.className = 'admin-user-date__sub';
  updated.textContent = `Updated ${getProfileUpdatedAt(row)}`;
  wrapper.append(created, updated);
  cell.append(wrapper);
  rowElement.append(cell);
}

function renderAdminUserRows() {
  adminUsersTableBody.replaceChildren();
  filteredAdminUserRows = getFilteredAdminUserRows();
  const visibleRows = getPaginatedAdminUserRows(filteredAdminUserRows);

  if (adminUserSearchClearButton) {
    adminUserSearchClearButton.hidden = !String(adminUserSearchInput?.value || '').trim();
  }

  visibleRows.forEach((row) => {
    const tableRow = document.createElement('tr');
    const actionsCell = document.createElement('td');
    const actions = document.createElement('div');
    const viewButton = document.createElement('button');
    const restrictButton = document.createElement('button');
    const banButton = document.createElement('button');
    const restoreButton = document.createElement('button');
    const rowIndex = adminUserRows.indexOf(row);
    const status = getProfileAccountStatus(row);

    appendAdminUserCell(tableRow, row);
    appendAdminUserBadgeCell(tableRow, 'Role', getProfileRole(row), getProfileRole(row) === 'admin' ? 'featured' : '');
    appendAdminUserBadgeCell(tableRow, 'Status', getProfileAccountStatusLabel(row), status === 'active' ? 'published' : status === 'banned' ? 'blood' : 'draft');
    appendAdminUserDateCell(tableRow, row);
    appendTextCell(tableRow, 'User ID', getTruncatedId(getProfileId(row)), 'admin-user-id');

    actions.className = 'admin-action-group';
    viewButton.className = 'admin-row-action admin-row-action--view';
    viewButton.type = 'button';
    viewButton.textContent = 'View User';
    viewButton.addEventListener('click', () => showAdminUserDetail(rowIndex));

    restrictButton.className = 'admin-row-action admin-row-action--restrict';
    restrictButton.type = 'button';
    restrictButton.textContent = 'Restrict';
    restrictButton.disabled = status === 'restricted';
    restrictButton.addEventListener('click', () => updateAdminUserAccountStatus(rowIndex, 'restricted'));

    banButton.className = 'admin-row-action admin-row-action--ban';
    banButton.type = 'button';
    banButton.textContent = 'Ban';
    banButton.disabled = status === 'banned';
    banButton.addEventListener('click', () => updateAdminUserAccountStatus(rowIndex, 'banned'));

    restoreButton.className = 'admin-row-action admin-row-action--restore';
    restoreButton.type = 'button';
    restoreButton.textContent = 'Restore Active';
    restoreButton.addEventListener('click', () => updateAdminUserAccountStatus(rowIndex, 'active'));

    actions.append(viewButton);

    if (status === 'active') {
      actions.append(restrictButton, banButton);
    } else if (status === 'restricted') {
      actions.append(restoreButton, banButton);
    } else {
      actions.append(restoreButton);
    }

    actionsCell.dataset.label = 'Actions';
    actionsCell.append(actions);
    tableRow.append(actionsCell);
    adminUsersTableBody.append(tableRow);
  });

  if (!filteredAdminUserRows.length) {
    setAdminUsersState(adminUserRows.length ? 'No users match this search.' : 'No users found.');
    adminUsersTableWrap.hidden = adminUserRows.length === 0;

    if (adminUsersPagination) {
      adminUsersPagination.hidden = true;
    }

    return;
  }

  renderAdminUsersPagination(filteredAdminUserRows.length);
  adminUsersState.hidden = true;
  adminUsersTableWrap.hidden = false;
}

async function fetchAdminUserAggregateStats(supabase, userId) {
  const statConfigs = [
    ['Journal Entries', 'user_journal_entries'],
    ['Readings', 'user_readings'],
    ['Artifacts', 'user_artifacts'],
    ['Gallery Fragments', 'user_gallery_fragments'],
    ['Room Visits', 'user_room_visits'],
  ];
  const results = await Promise.allSettled(
    statConfigs.map(async ([label, tableName]) => {
      const { count, error } = await supabase
        .from(tableName)
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId);

      return {
        label,
        value: error || typeof count !== 'number' ? '—' : count,
      };
    }),
  );

  return results.map((result, index) => (
    result.status === 'fulfilled'
      ? result.value
      : { label: statConfigs[index][0], value: '—' }
  ));
}

async function showAdminUserDetail(index) {
  const row = adminUserRows[index];
  const userId = getProfileId(row);

  if (!row || !userId) {
    return;
  }

  const supabase = getSupabaseClient();

  adminUserDetailTitle.textContent = getProfileDisplayName(row);
  adminUserDetail.dataset.userIndex = String(index);
  adminUserDetailMeta.replaceChildren();
  adminUserDetailFields.replaceChildren();

  appendDetailChip(adminUserDetailMeta, 'Role', getProfileRole(row));
  appendDetailChip(adminUserDetailMeta, 'Status', getProfileAccountStatusLabel(row));
  appendDetailChip(adminUserDetailMeta, 'User ID', getTruncatedId(userId));
  appendDetailField(adminUserDetailFields, 'Display Name', getProfileDisplayName(row));
  appendDetailField(adminUserDetailFields, 'Email', getProfileEmail(row));
  appendDetailField(adminUserDetailFields, 'Role', getProfileRole(row));
  appendDetailField(adminUserDetailFields, 'Account Status', getProfileAccountStatusLabel(row));
  appendDetailField(adminUserDetailFields, 'User ID', formatValue(userId));
  appendDetailField(adminUserDetailFields, 'Avatar URL', getProfileAvatarUrl(row));
  appendDetailField(adminUserDetailFields, 'Created', getProfileCreatedAt(row));
  appendDetailField(adminUserDetailFields, 'Updated', getProfileUpdatedAt(row));
  appendDetailField(adminUserDetailFields, 'Ban Reason', getProfileBanReason(row));
  appendDetailField(adminUserDetailFields, 'Banned At', getProfileBannedAt(row));
  appendDetailField(adminUserDetailFields, 'Banned By', formatValue(getFirstValue(row, ['banned_by'])));

  if (supabase) {
    const aggregateStats = await fetchAdminUserAggregateStats(supabase, userId);

    aggregateStats.forEach(({ label, value }) => {
      appendDetailField(adminUserDetailFields, label, formatValue(value));
    });
  }

  populateUserModerationForm(row, index);
  adminUserDetail.hidden = false;
  adminUserDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function populateUserModerationForm(row, index) {
  if (!userModerationForm || !userModerationStatusSelect || !userModerationReasonField) {
    return;
  }

  const status = getProfileAccountStatus(row);
  const editableStatus = ['active', 'restricted', 'banned'].includes(status) ? status : 'active';

  userModerationForm.dataset.userIndex = String(index);
  userModerationStatusSelect.value = editableStatus;
  userModerationReasonField.value = getFirstValue(row, ['ban_reason']) || '';
  userModerationForm.hidden = false;
  hideUserModerationState();
}

async function updateAdminUserAccountStatus(index, nextStatus, { reason = null } = {}) {
  const row = adminUserRows[index];
  const profileId = getProfileId(row);
  const detailIsOpen = adminUserDetail && !adminUserDetail.hidden;
  const setModerationFeedback = (message, state = '') => {
    if (detailIsOpen) {
      setUserModerationState(message, state);
      return;
    }

    setAdminUsersState(message, state);
  };

  if (!row || !profileId) {
    setModerationFeedback('Select a user before changing account status.', 'error');
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setModerationFeedback('The archive connection is not configured.', 'error');
    return null;
  }

  const normalizedStatus = ['active', 'restricted', 'banned'].includes(nextStatus) ? nextStatus : 'active';

  if (normalizedStatus === 'banned' && getProfileAccountStatus(row) !== 'banned') {
    const confirmed = window.confirm('This prevents the account from using protected Astral Veil features. Ban this user?');

    if (!confirmed) {
      return null;
    }
  }

  const moderationReason = typeof reason === 'string' ? reason.trim() : getFirstValue(row, ['ban_reason']) || null;
  const existingBannedAt = getFirstValue(row, ['banned_at']);
  const payload = {
    account_status: normalizedStatus,
    ban_reason: normalizedStatus === 'active' ? null : moderationReason || null,
    banned_at: normalizedStatus === 'banned' ? existingBannedAt || new Date().toISOString() : null,
    banned_by: normalizedStatus === 'banned' ? currentAdminUserId : null,
    updated_at: new Date().toISOString(),
  };

  if (userModerationSubmitButton) {
    userModerationSubmitButton.disabled = true;
  }
  setModerationFeedback('Saving account status...');

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', profileId)
    .select('*')
    .maybeSingle();

  if (userModerationSubmitButton) {
    userModerationSubmitButton.disabled = false;
  }

  if (error) {
    console.error('Account moderation update failed:', error);
    setModerationFeedback('Account status could not be saved. Check admin RLS policies and try again.', 'error');
    return;
  }

  adminUserRows[index] = data || { ...row, ...payload };
  profileRows = profileRows.map((profileRow) => (
    getProfileId(profileRow) === profileId ? { ...profileRow, ...adminUserRows[index] } : profileRow
  ));
  if (userProgressLoaded) {
    renderProfileRows(profileRows);
  }
  renderAdminUserRows();
  if (detailIsOpen) {
    showAdminUserDetail(index);
  }
  setModerationFeedback('Account status saved.', 'success');
  return adminUserRows[index];
}

async function handleUserModerationSubmit(event) {
  event.preventDefault();

  if (!userModerationForm || !userModerationStatusSelect || !userModerationReasonField) {
    return;
  }

  await updateAdminUserAccountStatus(Number(userModerationForm.dataset.userIndex), userModerationStatusSelect.value, {
    reason: userModerationReasonField.value,
  });
}

function renderProfileRows(rows) {
  userProgressTableBody.replaceChildren();

  rows.forEach((row, index) => {
    const tableRow = document.createElement('tr');
    const actionCell = document.createElement('td');
    const actionButton = document.createElement('button');

    appendTextCell(tableRow, 'User', getProfileDisplayName(row), 'admin-table__title');
    appendTextCell(tableRow, 'Role', getProfileRole(row));
    appendTextCell(tableRow, 'Status', getProfileAccountStatusLabel(row));
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
  userProgressDetail.dataset.profileIndex = String(index);
  userProgressDetailMeta.replaceChildren();
  userProgressDetailFields.replaceChildren();
  userProgressDetailGroups.replaceChildren();

  appendDetailChip(userProgressDetailMeta, 'Role', getProfileRole(row));
  appendDetailChip(userProgressDetailMeta, 'Status', getProfileAccountStatusLabel(row));
  appendDetailChip(userProgressDetailMeta, 'User ID', getTruncatedId(userId));
  appendDetailField(userProgressDetailFields, 'Display Name', getProfileDisplayName(row));
  appendDetailField(userProgressDetailFields, 'Role', getProfileRole(row));
  appendDetailField(userProgressDetailFields, 'Account Status', getProfileAccountStatusLabel(row));
  appendDetailField(userProgressDetailFields, 'Ban Reason', getProfileBanReason(row));
  appendDetailField(userProgressDetailFields, 'Banned At', getProfileBannedAt(row));
  appendDetailField(userProgressDetailFields, 'Banned By', formatValue(getFirstValue(row, ['banned_by'])));
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

  const progressResults = await Promise.allSettled(
    userProgressSections.map(async (config) => ({
      config,
      result: await fetchUserProgressRows(supabase, config.tableName, userId),
    })),
  );

  userProgressDetailGroups.replaceChildren();

  const resolvedProgressResults = progressResults.map((progressResult, index) => {
    if (progressResult.status === 'fulfilled') {
      return progressResult.value;
    }

    logAdminMetricWarning('User progress detail', progressResult.reason);
    return {
      config: userProgressSections[index],
      result: { rows: [], error: true },
    };
  });

  const totalProgressRows = resolvedProgressResults.reduce((total, { config, result }) => total + renderProgressGroup(config, result), 0);

  if (!totalProgressRows && resolvedProgressResults.every(({ result }) => !result.error)) {
    const state = document.createElement('p');
    state.className = 'admin-state';
    state.textContent = 'No progress recorded yet.';
    userProgressDetailGroups.prepend(state);
  }
}

async function loadNoctisDocuments() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    setNoctisDocumentsState('Noctis documents are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  setNoctisDocumentsState('Loading Noctis documents...');
  noctisDocumentsTableWrap.hidden = true;
  hideNoctisDocumentDetail();
  hideNoctisDocumentForm();

  if (!noctisDocumentFiltersInitialized) {
    resetNoctisDocumentFiltersToDefaults();
    noctisDocumentFiltersInitialized = true;
  }

  const { data, error } = await fetchNoctisDocumentRows(supabase);

  if (error) {
    logNoctisDocumentQueryError(error);
    noctisDocumentsPagination.hidden = true;
    setNoctisDocumentsState('Noctis documents could not be loaded. Please try again later.', 'error');
    return;
  }

  noctisDocumentRows = sortNoctisDocumentRows(Array.isArray(data) ? data : []);
  noctisDocumentsLoaded = true;

  if (!noctisDocumentRows.length) {
    noctisDocumentsPagination.hidden = true;
    setNoctisDocumentsState('No Noctis documents found.');
    return;
  }

  applyNoctisDocumentFilters();
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

async function loadCharacterLines() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    setCharacterLinesState('Character lines are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  const from = (characterLinesCurrentPage - 1) * characterLinesPageSize;
  const to = from + characterLinesPageSize - 1;

  setCharacterLinesState('Loading character lines...');
  characterLinesTableWrap.hidden = true;
  if (characterLinesPagination) {
    characterLinesPagination.hidden = true;
  }

  let query = supabase
    .from('reader_lines')
    .select('*', { count: 'exact' })
    .order('reader_name', { ascending: true })
    .order('reader_id', { ascending: true })
    .order('mode', { ascending: true })
    .order('context', { ascending: true })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .range(from, to);

  query = applyCharacterLineFilters(query);

  const { data, error, count } = await query;

  if (error) {
    setCharacterLinesState(`Character lines could not be loaded. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  characterLineRows = Array.isArray(data) ? data : [];
  characterLinesTotalCount = Number(count || 0);
  characterLinesLoaded = true;

  if (!characterLineRows.length && characterLinesTotalCount > 0 && characterLinesCurrentPage > getCharacterLinesTotalPages()) {
    characterLinesCurrentPage = getCharacterLinesTotalPages();
    await loadCharacterLines();
    return;
  }

  renderCharacterLineRows();
}

async function loadContactMessages() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    setContactMessagesState('Contact messages are unavailable because the archive connection is not configured.', 'error');
    return;
  }

  const from = (contactMessagesCurrentPage - 1) * contactMessagesPageSize;
  const to = from + contactMessagesPageSize - 1;

  setContactMessagesState('Loading contact messages...');
  contactMessagesTableWrap.hidden = true;
  if (contactMessagesPagination) {
    contactMessagesPagination.hidden = true;
  }

  let query = supabase
    .from('contact_messages')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  query = applyContactMessageFilters(query);

  const { data, error, count } = await query;

  if (error) {
    setContactMessagesState(`Contact messages could not be loaded. ${error.message || 'Please try again later.'}`, 'error');
    return;
  }

  contactMessageRows = Array.isArray(data) ? data : [];
  contactMessagesTotalCount = Number(count || 0);
  contactMessagesLoaded = true;

  if (!contactMessageRows.length && contactMessagesTotalCount > 0 && contactMessagesCurrentPage > getContactMessagesTotalPages()) {
    contactMessagesCurrentPage = getContactMessagesTotalPages();
    await loadContactMessages();
    return;
  }

  renderContactMessageRows();
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

async function loadGalleryRecords() {
  if (galleryRecordsLoaded) {
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setGalleryRecordsState('Gallery records are unavailable because the archive connection is not configured.', 'error');
    if (galleryRecordsPagination) {
      galleryRecordsPagination.hidden = true;
    }
    return;
  }

  setGalleryRecordsState('Loading gallery records...');
  galleryRecordsTableWrap.hidden = true;
  if (galleryRecordsPagination) {
    galleryRecordsPagination.hidden = true;
  }
  hideGalleryRecordDetail();
  hideGalleryRecordForm();

  const { data, error } = await supabase
    .from('gallery_records')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    setGalleryRecordsState(`Gallery records could not be loaded. ${error.message || 'Please try again later.'}`, 'error');
    if (galleryRecordsPagination) {
      galleryRecordsPagination.hidden = true;
    }
    return;
  }

  galleryRecordRows = Array.isArray(data) ? data : [];
  updateGalleryRecordStats();
  applyGalleryRecordFilters({ resetPage: false });
  galleryRecordsLoaded = true;

  if (!galleryRecordRows.length) {
    setGalleryRecordsState('No Gallery records found.');
    renderGalleryRecordsPagination();
    return;
  }

  galleryRecordsCurrentPage = Math.min(galleryRecordsCurrentPage, getGalleryRecordsTotalPages());
  renderGalleryRecordRows();
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
    .select('*, veilwalker_variants(*)')
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
  const summaryResults = await Promise.allSettled(
    userProgressSummaryTables.map(async (tableName) => ({
      tableName,
      count: await fetchTableCount(tableName),
    })),
  );

  summaryResults.forEach((summaryResult) => {
    if (summaryResult.status !== 'fulfilled') {
      logAdminMetricWarning('User progress summary', summaryResult.reason);
      return;
    }

    setUserProgressCount(summaryResult.value.tableName, summaryResult.value.count);
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

async function loadAdminUsers() {
  if (adminUsersLoaded) {
    renderAdminUserRows();
    return;
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    setAdminUsersState('Users are unavailable because the archive connection is not configured.', 'error');
    if (adminUsersPagination) {
      adminUsersPagination.hidden = true;
    }
    return;
  }

  setAdminUsersState('Loading users...');
  adminUsersTableWrap.hidden = true;
  if (adminUsersPagination) {
    adminUsersPagination.hidden = true;
  }
  hideAdminUserDetail();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(250);

  if (error) {
    console.warn('[Astral Veil admin] Users could not be loaded.');
    setAdminUsersState('Users could not be loaded. Check admin RLS policies and try again.', 'error');
    if (adminUsersPagination) {
      adminUsersPagination.hidden = true;
    }
    return;
  }

  adminUserRows = Array.isArray(data) ? data : [];
  adminUsersLoaded = true;
  adminUsersCurrentPage = 1;

  adminUserRows.sort((firstRow, secondRow) => {
    const firstDate = new Date(getFirstValue(firstRow, ['updated_at', 'created_at']) || 0).getTime();
    const secondDate = new Date(getFirstValue(secondRow, ['updated_at', 'created_at']) || 0).getTime();

    if (firstDate !== secondDate) {
      return secondDate - firstDate;
    }

    return getProfileDisplayName(firstRow).localeCompare(getProfileDisplayName(secondRow));
  });

  renderAdminUserRows();
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

function formatAdminStatValue(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat().format(value);
}

function setOverviewStat(statName, value) {
  const statElement = overviewStatElements[statName];

  if (!statElement) {
    return;
  }

  statElement.textContent = typeof value === 'string' ? value : formatAdminStatValue(value);
}

function setOverviewStatsLoading() {
  Object.entries(overviewStatElements).forEach(([statName, statElement]) => {
    if (!statElement || statName === 'sessionStatus') {
      return;
    }

    statElement.textContent = 'Loading...';
  });

  setOverviewStat('sessionStatus', 'Live');
}

function logAdminMetricWarning(label, error) {
  console.warn(`[Astral Veil admin] ${label} unavailable.`, {
    message: error?.message || '',
    code: error?.code || '',
  });
}

function getSevenDaySinceIso() {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return Number.isNaN(since.getTime()) ? '' : since.toISOString();
}

async function fetchOverviewCount(supabase, tableName, { sinceColumn = '', sinceDate = '' } = {}) {
  let query = supabase
    .from(tableName)
    .select('id', { count: 'exact', head: true });

  if (sinceColumn && sinceDate && !Number.isNaN(new Date(sinceDate).getTime())) {
    query = query.gte(sinceColumn, sinceDate);
  }

  const { count, error } = await query;

  if (error || typeof count !== 'number') {
    logAdminMetricWarning(`Overview stat for ${tableName}`, error);
    return null;
  }

  return count;
}

async function fetchRecentActiveUsersForTable(supabase, config, sinceDate) {
  if (!sinceDate || Number.isNaN(new Date(sinceDate).getTime())) {
    return {
      isAvailable: false,
      tableName: config.tableName,
      userIds: [],
    };
  }

  for (const timestampColumn of config.timestampColumns) {
    const { data, error } = await supabase
      .from(config.tableName)
      .select('user_id')
      .gte(timestampColumn, sinceDate)
      .limit(500);

    if (!error) {
      return {
        isAvailable: true,
        tableName: config.tableName,
        userIds: (data || []).map((row) => row?.user_id).filter(Boolean),
      };
    }

    logAdminMetricWarning(`Active-user source ${config.tableName}.${timestampColumn}`, error);
  }

  return {
    isAvailable: false,
    tableName: config.tableName,
    userIds: [],
  };
}

async function fetchActiveUserCount(supabase, sinceDate) {
  const activeUserIds = new Set();
  let availableSourceCount = 0;
  const results = await Promise.allSettled(
    adminOverviewActivityTables.map((config) => fetchRecentActiveUsersForTable(supabase, config, sinceDate)),
  );

  results.forEach((result) => {
    if (result.status !== 'fulfilled') {
      return;
    }

    if (result.value.isAvailable) {
      availableSourceCount += 1;
    }

    result.value.userIds.forEach((userId) => {
      activeUserIds.add(userId);
    });
  });

  if (!availableSourceCount) {
    return null;
  }

  return activeUserIds.size;
}

async function loadAdminOverviewStats() {
  const supabase = getSupabaseClient();

  setOverviewStatsLoading();

  if (!supabase) {
    ['totalAccounts', 'activeUsers', 'newThisWeek', 'journalEntries', 'savedReadings', 'recoveredArtifacts'].forEach((statName) => {
      setOverviewStat(statName, '—');
    });
    return;
  }

  const sinceDate = getSevenDaySinceIso();
  const statLoaders = {
    totalAccounts: () => fetchOverviewCount(supabase, 'profiles'),
    activeUsers: () => fetchActiveUserCount(supabase, sinceDate),
    newThisWeek: () => fetchOverviewCount(supabase, 'profiles', { sinceColumn: 'created_at', sinceDate }),
    journalEntries: () => fetchOverviewCount(supabase, 'user_journal_entries'),
    savedReadings: () => fetchOverviewCount(supabase, 'user_readings'),
    recoveredArtifacts: () => fetchOverviewCount(supabase, 'user_artifacts'),
  };

  const results = await Promise.allSettled(
    Object.entries(statLoaders).map(async ([statName, loader]) => ({
      statName,
      value: await loader(),
    })),
  );

  results.forEach((result) => {
    if (result.status !== 'fulfilled' || result.value.value === null) {
      const statName = result.status === 'fulfilled' ? result.value.statName : '';

      if (statName) {
        setOverviewStat(statName, '—');
      }
      return;
    }

    setOverviewStat(result.value.statName, result.value.value);
  });
}

async function loadAdminCounts() {
  await Promise.allSettled(
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

function normalizeAdminViewName(viewName = 'overview') {
  return String(viewName || 'overview').trim();
}

function setCurrentView(viewName = 'overview', { updateHistory = true } = {}) {
  const availableViews = ['overview', 'noctis-documents', 'journal-prompts', 'character-lines', 'contact-messages', 'archive-rooms', 'gallery-records', 'artifacts', 'memory-fragments', 'veilwalkers', 'veilwalker-notes', 'users', 'user-progress', 'app-settings'];
  const requestedViewName = normalizeAdminViewName(viewName);
  const normalizedViewName = availableViews.includes(requestedViewName) ? requestedViewName : 'overview';

  adminViews.forEach((view) => {
    view.hidden = view.dataset.adminView !== normalizedViewName;
  });

  navLinks.forEach((navLink) => {
    navLink.setAttribute('aria-current', navLink.dataset.adminViewLink === normalizedViewName ? 'page' : 'false');
  });

  if (updateHistory && window.location.hash !== `#${normalizedViewName}`) {
    window.history.pushState(null, '', `#${normalizedViewName}`);
  }

  if (normalizedViewName === 'noctis-documents') {
    loadNoctisDocuments();
  }

  if (normalizedViewName === 'journal-prompts') {
    loadJournalPrompts();
  }

  if (normalizedViewName === 'character-lines') {
    loadCharacterLines();
  }

  if (normalizedViewName === 'contact-messages') {
    loadContactMessages();
  }

  if (normalizedViewName === 'archive-rooms') {
    loadArchiveRooms();
  }

  if (normalizedViewName === 'gallery-records') {
    loadGalleryRecords();
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

  if (normalizedViewName === 'users') {
    loadAdminUsers();
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

  noctisDocumentDetailCloseButton.addEventListener('click', hideNoctisDocumentDetail);
  noctisDocumentNewButton.addEventListener('click', () => showNoctisDocumentForm());
  noctisDocumentForm.addEventListener('submit', handleNoctisDocumentFormSubmit);
  noctisDocumentFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideNoctisDocumentForm);
  });
  noctisDocumentFilters.forEach((filter) => {
    filter.addEventListener('input', () => applyNoctisDocumentFilters({ resetPage: true }));
    filter.addEventListener('change', () => applyNoctisDocumentFilters({ resetPage: true }));
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
  characterLineNewButton.addEventListener('click', () => showCharacterLineForm());
  characterLineForm.addEventListener('submit', handleCharacterLineFormSubmit);
  characterLineFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideCharacterLineForm);
  });
  characterLineFilters.forEach((filter) => {
    const eventName = filter.matches('input') ? 'input' : 'change';

    filter.addEventListener(eventName, () => {
      characterLinesCurrentPage = 1;
      characterLinesLoaded = false;
      loadCharacterLines();
    });
  });
  characterLinesPageSizeSelect?.addEventListener('change', () => {
    characterLinesPageSize = Number(characterLinesPageSizeSelect.value) || 10;
    characterLinesCurrentPage = 1;
    characterLinesLoaded = false;
    loadCharacterLines();
  });
  contactMessageDetailCloseButton?.addEventListener('click', hideContactMessageDetail);
  contactMessageNotesForm?.addEventListener('submit', handleContactMessageNotesSubmit);
  contactMessageFilters.forEach((filter) => {
    filter.addEventListener('change', () => {
      contactMessagesCurrentPage = 1;
      contactMessagesLoaded = false;
      loadContactMessages();
    });
  });
  contactMessagesPageSizeSelect?.addEventListener('change', () => {
    contactMessagesPageSize = Number(contactMessagesPageSizeSelect.value) || 10;
    contactMessagesCurrentPage = 1;
    contactMessagesLoaded = false;
    loadContactMessages();
  });
  archiveRoomDetailCloseButton.addEventListener('click', hideArchiveRoomDetail);
  archiveRoomNewButton.addEventListener('click', () => showArchiveRoomForm());
  archiveRoomForm.addEventListener('submit', handleArchiveRoomFormSubmit);
  archiveRoomFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideArchiveRoomForm);
  });
  galleryRecordDetailCloseButton.addEventListener('click', hideGalleryRecordDetail);
  galleryRecordNewButton.addEventListener('click', () => showGalleryRecordForm());
  galleryRecordForm.addEventListener('submit', handleGalleryRecordFormSubmit);
  galleryRecordFormCancelButtons.forEach((button) => {
    button.addEventListener('click', hideGalleryRecordForm);
  });
  galleryRecordFilters.forEach((filter) => {
    const eventName = filter.matches('input') ? 'input' : 'change';

    filter.addEventListener(eventName, () => {
      applyGalleryRecordFilters();
      renderGalleryRecordRows();
    });
  });
  galleryRecordForm.elements.title.addEventListener('input', () => {
    if (!editingGalleryRecordId && galleryRecordForm.elements.slug.dataset.manual !== 'true') {
      galleryRecordForm.elements.slug.value = toKebabCase(galleryRecordForm.elements.title.value);
    }
  });
  galleryRecordForm.elements.slug.addEventListener('input', () => {
    galleryRecordForm.elements.slug.dataset.manual = String(galleryRecordForm.elements.slug.value || '').trim() ? 'true' : 'false';
  });
  galleryRecordForm.elements.preview_image_url.addEventListener('input', () => {
    updateGalleryRecordPreview(galleryRecordForm.elements.preview_image_url.value || galleryRecordForm.elements.full_image_url.value);
  });
  galleryRecordForm.elements.full_image_url.addEventListener('input', () => {
    updateGalleryRecordPreview(galleryRecordForm.elements.preview_image_url.value || galleryRecordForm.elements.full_image_url.value);
  });
  galleryRecordForm.elements.image_file.addEventListener('change', () => {
    const [file] = galleryRecordForm.elements.image_file.files || [];

    if (!file) {
      updateGalleryRecordPreview(galleryRecordForm.elements.preview_image_url.value || galleryRecordForm.elements.full_image_url.value);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setGalleryRecordFormState('Selected file must be an image.', 'error');
      galleryRecordForm.elements.image_file.value = '';
      return;
    }

    updateGalleryRecordPreview(URL.createObjectURL(file));
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
  adminUserDetailCloseButton?.addEventListener('click', hideAdminUserDetail);
  adminUserSearchInput?.addEventListener('input', () => {
    adminUsersCurrentPage = 1;
    renderAdminUserRows();
    hideAdminUserDetail();
  });
  adminUserSearchClearButton?.addEventListener('click', () => {
    if (adminUserSearchInput) {
      adminUserSearchInput.value = '';
    }

    adminUsersCurrentPage = 1;
    renderAdminUserRows();
    hideAdminUserDetail();
    adminUserSearchInput?.focus();
  });
  userModerationForm?.addEventListener('submit', handleUserModerationSubmit);
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

function bindAdminDashboardEvents() {
  if (adminDashboardBindingsInitialized) {
    return;
  }

  bindSignOutButtons();
  bindNavToggle();
  bindViewLinks();
  adminDashboardBindingsInitialized = true;
}

function isAdminInitDebugEnabled() {
  try {
    return window.localStorage?.getItem('astral_admin_debug') === 'true'
      || new URLSearchParams(window.location.search).has('debugAdmin');
  } catch {
    return false;
  }
}

function logAdminInitDebug(label, value) {
  if (!isAdminInitDebugEnabled()) {
    return;
  }

  console.info(`[Astral Veil admin] ${label}:`, value);
}

function logAdminInitError(error) {
  console.error('Admin init failed:', {
    message: error?.message || '',
    code: error?.code || '',
    details: error?.details || '',
    hint: error?.hint || '',
  });
}

function redirectToAdminLogin() {
  window.location.replace('admin-login.html');
}

function showAdminInitError(message) {
  adminLayout.classList.remove('is-auth-checking');
  adminLayout.classList.add('is-access-denied');
  setAccessMessage(message, 'error');
  loginLink.hidden = false;
  accessSignOutButton.hidden = true;
}

async function initAdminDashboard() {
  try {
    if (!isSupabaseConfigured()) {
      showAdminInitError('The archive connection is not configured for this environment.');
      return;
    }

    const gateResult = requireAdminGate();
    logAdminInitDebug('Admin gate present', gateResult.authorized);

    if (!gateResult.authorized) {
      clearAdminVerified();
      redirectToAdminLogin();
      return;
    }

    const supabase = getSupabaseClient();
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    const hasSession = Boolean(sessionData?.session);
    logAdminInitDebug('Supabase session present', hasSession);

    if (!hasSession) {
      clearAdminVerified();
      redirectToAdminLogin();
      return;
    }

    const result = await requireAdmin();
    logAdminInitDebug('Admin profile check passed', Boolean(result?.authorized));

    if (!result?.authorized) {
      clearAdminVerified();

      if (!result || result.reason === 'not_logged_in' || result.reason === 'not_admin') {
        redirectToAdminLogin();
        return;
      }

      showAdminInitError(result.message || 'Admin access could not be verified.');
      return;
    }

    bindAdminDashboardEvents();
    adminLayout.classList.remove('is-auth-checking', 'is-access-denied');
    currentAdminUserId = result.user?.id || null;
    setAccessMessage('Admin access confirmed.', 'success');
    showIdentity(result.user, result.profile);
    shell.classList.add('is-visible');
    statusStrip.hidden = false;
    signOutButton.hidden = false;
    setCurrentView(window.location.hash.replace('#', '') || 'overview');
    Promise.allSettled([
      loadAdminOverviewStats(),
      loadAdminCounts(),
    ]).then((results) => {
      results.forEach((metricResult) => {
        if (metricResult.status === 'rejected') {
          logAdminMetricWarning('Admin startup metric', metricResult.reason);
        }
      });
    });
  } catch (error) {
    logAdminInitError(error);
    clearAdminVerified();
    showAdminInitError('Admin access could not be verified. Please return to admin login and try again.');
  }
}

initAdminDashboard();
