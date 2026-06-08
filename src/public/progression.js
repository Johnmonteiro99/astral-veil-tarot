import { getCurrentUser } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

function normalizeKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_-]+/g, '')
    .replace(/_+/g, '_')
    .replace(/^[_-]+|[_-]+$/g, '');
}

function isDuplicateError(error) {
  return error?.code === '23505' || /duplicate|unique/i.test(error?.message || '');
}

function logProgressionError(message, error) {
  console.warn(`[Astral Veil progression] ${message}`, error);
}

function logRoomVisit(message, detail = '') {
  console.info(`[Astral Veil progression] ${message}${detail ? `: ${detail}` : ''}`);
}

function logDiscovery(message, detail = '') {
  console.info(`[Astral Veil progression] ${message}${detail ? `: ${detail}` : ''}`);
}

async function getProgressionContext() {
  if (!isSupabaseConfigured()) {
    return { user: null, supabase: null };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return { user: null, supabase: null };
  }

  try {
    const { user, error } = await getCurrentUser();

    if (error) {
      logProgressionError('Could not resolve current user.', error);
    }

    return { user: user || null, supabase };
  } catch (error) {
    logProgressionError('Could not resolve current user.', error);
    return { user: null, supabase };
  }
}

export async function trackProgressEvent(event = {}) {
  return { status: 'skipped', reason: 'user_progress_events_not_enabled' };
}

export async function trackRoomVisit(room = {}) {
  const { user, supabase } = await getProgressionContext();

  if (!user || !supabase) {
    logRoomVisit('Room visit skipped', 'no user');
    return { status: 'skipped' };
  }

  const roomKey = normalizeKey(room.room_key || room.roomKey || room.key || room.id);
  const archiveType = normalizeKey(room.archive_type || room.archiveType);

  if (!roomKey || !archiveType) {
    logRoomVisit('Room visit skipped', 'missing room key or archive type');
    return { status: 'skipped' };
  }

  logRoomVisit('Tracking room visit', roomKey);

  const visitedAt = new Date().toISOString();
  const { data: existingVisit, error: lookupError } = await supabase
    .from('user_room_visits')
    .select('id, visit_count, metadata')
    .eq('user_id', user.id)
    .eq('room_key', roomKey)
    .maybeSingle();

  if (lookupError) {
    logRoomVisit('Room visit failed', roomKey);
    logProgressionError('Room visit lookup failed.', lookupError);
    return { status: 'error', error: lookupError };
  }

  const metadata = room.metadata && typeof room.metadata === 'object' && !Array.isArray(room.metadata)
    ? room.metadata
    : {};
  const payload = {
    user_id: user.id,
    room_key: roomKey,
    room_name: room.room_name || room.roomName || room.name || room.title || null,
    archive_type: archiveType,
    mode: room.mode || null,
    last_visited_at: visitedAt,
    metadata: {
      ...(existingVisit?.metadata || {}),
      ...metadata,
    },
  };

  let saveError = null;

  if (existingVisit) {
    const { error } = await supabase
      .from('user_room_visits')
      .update({
        ...payload,
        visit_count: Number(existingVisit.visit_count || 0) + 1,
      })
      .eq('user_id', user.id)
      .eq('room_key', roomKey);

    saveError = error;
  } else {
    const { error } = await supabase
      .from('user_room_visits')
      .insert({
        ...payload,
        first_visited_at: visitedAt,
        visit_count: 1,
      });

    saveError = error;
  }

  if (saveError) {
    if (!existingVisit && isDuplicateError(saveError)) {
      const { data: retryVisit, error: retryLookupError } = await supabase
        .from('user_room_visits')
        .select('id, visit_count, metadata')
        .eq('user_id', user.id)
        .eq('room_key', roomKey)
        .maybeSingle();

      if (retryLookupError || !retryVisit) {
        logRoomVisit('Room visit failed', roomKey);
        logProgressionError('Room visit duplicate recovery lookup failed.', retryLookupError || saveError);
        return { status: 'error', error: retryLookupError || saveError };
      }

      const { error: retryError } = await supabase
        .from('user_room_visits')
        .update({
          room_name: payload.room_name,
          archive_type: payload.archive_type,
          mode: payload.mode,
          last_visited_at: payload.last_visited_at,
          visit_count: Number(retryVisit.visit_count || 0) + 1,
          metadata: {
            ...(retryVisit.metadata || {}),
            ...metadata,
          },
        })
        .eq('user_id', user.id)
        .eq('room_key', roomKey);

      if (retryError) {
        logRoomVisit('Room visit failed', roomKey);
        logProgressionError('Room visit was not updated after duplicate insert.', retryError);
        return { status: 'error', error: retryError };
      }

      logRoomVisit('Room visit updated', roomKey);
    } else {
      logRoomVisit('Room visit failed', roomKey);
      logProgressionError('Room visit was not saved.', saveError);
      return { status: 'error', error: saveError };
    }
  }

  if (!saveError) {
    logRoomVisit(existingVisit ? 'Room visit updated' : 'Room visit inserted', roomKey);
  }

  return { status: existingVisit ? 'updated' : 'saved' };
}

export async function trackDiscovery(discovery = {}) {
  const { user, supabase } = await getProgressionContext();

  if (!user || !supabase) {
    logDiscovery('Discovery skipped', 'no user');
    return { status: 'skipped' };
  }

  const discoveryKey = normalizeKey(discovery.discovery_key || discovery.discoveryKey || discovery.key || discovery.id);

  if (!discoveryKey) {
    logDiscovery('Discovery skipped', 'missing discovery key');
    return { status: 'skipped' };
  }

  const { data: existingDiscovery, error: lookupError } = await supabase
    .from('user_discoveries')
    .select('id')
    .eq('user_id', user.id)
    .eq('discovery_key', discoveryKey)
    .maybeSingle();

  if (lookupError) {
    logProgressionError('Discovery lookup failed.', lookupError);
    return { status: 'error', error: lookupError };
  }

  if (existingDiscovery) {
    logDiscovery('Discovery duplicate skipped', discoveryKey);
    return { status: 'duplicate' };
  }

  const metadata = discovery.metadata && typeof discovery.metadata === 'object' && !Array.isArray(discovery.metadata)
    ? discovery.metadata
    : {};
  const payload = {
    user_id: user.id,
    discovery_key: discoveryKey,
    discovery_type: normalizeKey(discovery.discovery_type || discovery.discoveryType || discovery.category || 'discovery'),
    source_location: discovery.source_location || discovery.sourceLocation || discovery.archive_type || discovery.archiveType || metadata.archive_room || null,
    mode_key: discovery.mode_key || discovery.modeKey || discovery.mode || metadata.mode || null,
    related_artifact_key: discovery.related_artifact_key || discovery.relatedArtifactKey || metadata.artifact_key || null,
    related_room_key: discovery.related_room_key || discovery.relatedRoomKey || metadata.room_key || metadata.archive_room || null,
    related_fragment_key: discovery.related_fragment_key || discovery.relatedFragmentKey || metadata.fragment_key || null,
    related_veilwalker_key: discovery.related_veilwalker_key || discovery.relatedVeilwalkerKey || metadata.veilwalker_key || null,
    metadata: {
      ...metadata,
      title: discovery.title || metadata.title || '',
      description: discovery.description || metadata.description || '',
      category: discovery.category || metadata.category || '',
      archive_type: discovery.archive_type || discovery.archiveType || metadata.archive_type || '',
      mode: discovery.mode || metadata.mode || '',
    },
  };

  const { error } = await supabase
    .from('user_discoveries')
    .insert(payload);

  if (error) {
    if (isDuplicateError(error)) {
      logDiscovery('Discovery duplicate skipped', discoveryKey);
      return { status: 'duplicate' };
    }

    logProgressionError('Discovery was not saved.', error);
    return { status: 'error', error };
  }

  logDiscovery('Discovery recorded', discoveryKey);
  return { status: 'saved' };
}

export async function hasDiscovery(discoveryKey) {
  const { user, supabase } = await getProgressionContext();
  const normalizedKey = normalizeKey(discoveryKey);

  if (!user || !supabase || !normalizedKey) {
    return false;
  }

  const { data, error } = await supabase
    .from('user_discoveries')
    .select('id')
    .eq('user_id', user.id)
    .eq('discovery_key', normalizedKey)
    .maybeSingle();

  if (error) {
    logProgressionError('Discovery lookup failed.', error);
    return false;
  }

  return Boolean(data);
}

export async function getUserProgressStats() {
  const { user, supabase } = await getProgressionContext();

  if (!user || !supabase) {
    return { roomsVisited: 0, discoveriesRecorded: 0 };
  }

  const [roomsResponse, discoveriesResponse] = await Promise.all([
    supabase
      .from('user_room_visits')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase
      .from('user_discoveries')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  if (roomsResponse.error) {
    logProgressionError('Room visit count failed.', roomsResponse.error);
  }

  if (discoveriesResponse.error) {
    logProgressionError('Discovery count failed.', discoveriesResponse.error);
  }

  return {
    roomsVisited: roomsResponse.error ? 0 : roomsResponse.count || 0,
    discoveriesRecorded: discoveriesResponse.error ? 0 : discoveriesResponse.count || 0,
  };
}
