import { getCurrentUser } from '../services/auth.js';
import { getSupabaseClient, isSupabaseConfigured } from '../services/supabase-client.js';

export const profileUnlockDefinitions = {
  restricted_wing_background: {
    unlock_key: 'restricted_wing_background',
    unlock_type: 'background',
    label: 'Restricted Wing',
    description: 'A Blood Moon profile background unlocked by opening the Restricted Wing.',
    source_key: 'restricted_wing_seal_opened',
    mode_key: 'bloodmoon',
    asset_path: 'assets/images/unlockables/restricted-wing-profile-bg.png',
    metadata: {
      title: 'Restricted Wing',
      accent: 'bloodmoon',
    },
  },
  restricted_wing_title_marked: {
    unlock_key: 'restricted_wing_title_marked',
    unlock_type: 'title',
    label: 'Marked',
    description: 'A Blood Moon title earned by opening the Restricted Wing.',
    source_key: 'restricted_wing_seal_opened',
    mode_key: 'bloodmoon',
    asset_path: '',
    metadata: {
      title: 'Marked',
      accent: 'bloodmoon',
    },
  },
};

export const restrictedWingProfileRewardKeys = [
  'restricted_wing_background',
  'restricted_wing_title_marked',
];

function isDuplicateError(error) {
  return error?.code === '23505' || /duplicate|unique/i.test(error?.message || '');
}

async function getUnlockContext() {
  if (!isSupabaseConfigured()) {
    return { user: null, supabase: null };
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return { user: null, supabase: null };
  }

  const { user, error } = await getCurrentUser();

  if (error) {
    console.warn('[Astral Veil profile unlocks] Could not resolve current user.');
  }

  return { user: user || null, supabase };
}

export function getProfileUnlockDefinition(unlockKey) {
  return profileUnlockDefinitions[unlockKey] || null;
}

export function getProfileUnlockDefinitionsByType(unlockType) {
  return Object.values(profileUnlockDefinitions).filter((definition) => definition.unlock_type === unlockType);
}

export async function grantProfileUnlocks(unlockKeys = [], { autoEquip = true } = {}) {
  const { user, supabase } = await getUnlockContext();

  if (!user || !supabase) {
    return { status: 'skipped' };
  }

  const keys = [...new Set(unlockKeys)].filter((key) => profileUnlockDefinitions[key]);

  if (!keys.length) {
    return { status: 'skipped' };
  }

  const unlockRows = keys.map((key) => {
    const definition = profileUnlockDefinitions[key];

    return {
      user_id: user.id,
      unlock_key: definition.unlock_key,
      unlock_type: definition.unlock_type,
      label: definition.label,
      description: definition.description || null,
      source_key: definition.source_key || null,
      mode_key: definition.mode_key || null,
      asset_path: definition.asset_path || null,
      metadata: definition.metadata || {},
    };
  });

  const grantedKeys = [];

  for (const row of unlockRows) {
    const { error } = await supabase
      .from('user_profile_unlocks')
      .insert(row);

    if (!error || isDuplicateError(error)) {
      grantedKeys.push(row.unlock_key);
      continue;
    }

    console.warn('[Astral Veil profile unlocks] Profile unlock was not saved.');
  }

  if (autoEquip && grantedKeys.length) {
    const { data: profile, error: profileLookupError } = await supabase
      .from('profiles')
      .select('profile_background_url')
      .eq('id', user.id)
      .maybeSingle();

    if (profileLookupError) {
      console.warn('[Astral Veil profile unlocks] Could not check equipped cosmetics.');
      return { status: 'saved', grantedKeys };
    }

    const equipPayload = {};

    if (!profile?.profile_background_url && grantedKeys.includes('restricted_wing_background')) {
      equipPayload.profile_background_url = profileUnlockDefinitions.restricted_wing_background.asset_path;
    }

    if (Object.keys(equipPayload).length) {
      const { error: equipError } = await supabase
        .from('profiles')
        .update(equipPayload)
        .eq('id', user.id);

      if (equipError) {
        console.warn('[Astral Veil profile unlocks] Profile cosmetics were granted but not equipped.');
      }
    }
  }

  return { status: 'saved', grantedKeys };
}

export async function grantRestrictedWingProfileRewards(options = {}) {
  return grantProfileUnlocks(restrictedWingProfileRewardKeys, options);
}
