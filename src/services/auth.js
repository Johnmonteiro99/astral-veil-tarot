import { getSupabaseClient, isSupabaseConfigured } from './supabase-client.js';

const ADMIN_GATE_KEY = 'astral_admin_verified';
const ADMIN_GATE_AT_KEY = 'astral_admin_verified_at';
const ADMIN_GATE_MAX_AGE_MS = 2 * 60 * 60 * 1000;

function getMissingClientError() {
  return new Error('Supabase is not configured for this environment.');
}

function getSessionStorage() {
  try {
    return window.sessionStorage;
  } catch (error) {
    return null;
  }
}

const bannedAccountMessage =
  'This account has been restricted from using Astral Veil. If you believe this is a mistake, contact support@astralveil.world.';

export function getAccountStatus(profile) {
  const status = String(profile?.account_status || 'active').trim().toLowerCase();

  return status || 'active';
}

export function isBannedUser(profile) {
  return getAccountStatus(profile) === 'banned';
}

export function isRestrictedUser(profile) {
  return getAccountStatus(profile) === 'restricted';
}

export function getBannedAccountMessage() {
  return bannedAccountMessage;
}

export async function signIn(email, password) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: null, error: getMissingClientError() };
  }

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password, { displayName = '', emailRedirectTo = '' } = {}) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: null, error: getMissingClientError() };
  }

  const trimmedDisplayName = String(displayName || '').trim();
  const options = {};

  if (trimmedDisplayName) {
    options.data = { display_name: trimmedDisplayName };
  }

  if (emailRedirectTo) {
    options.emailRedirectTo = emailRedirectTo;
  }

  return supabase.auth.signUp({
    email,
    password,
    options: Object.keys(options).length ? options : undefined,
  });
}

export async function signOut() {
  const supabase = getSupabaseClient();

  clearAdminVerified();

  if (!supabase) {
    return { error: getMissingClientError() };
  }

  return supabase.auth.signOut();
}

export function setAdminVerified() {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  storage.setItem(ADMIN_GATE_KEY, 'true');
  storage.setItem(ADMIN_GATE_AT_KEY, String(Date.now()));
}

export function clearAdminVerified() {
  const storage = getSessionStorage();

  if (!storage) {
    return;
  }

  storage.removeItem(ADMIN_GATE_KEY);
  storage.removeItem(ADMIN_GATE_AT_KEY);
}

export function hasAdminVerified() {
  const storage = getSessionStorage();

  if (!storage) {
    return false;
  }

  const verified = storage.getItem(ADMIN_GATE_KEY) === 'true';
  const verifiedAt = Number(storage.getItem(ADMIN_GATE_AT_KEY) || '0');
  const isFresh = verifiedAt > 0 && Date.now() - verifiedAt < ADMIN_GATE_MAX_AGE_MS;

  if (!verified || !isFresh) {
    clearAdminVerified();
    return false;
  }

  return true;
}

export function requireAdminGate() {
  if (!hasAdminVerified()) {
    return {
      authorized: false,
      reason: 'admin_gate_required',
      message: 'Admin access required.',
    };
  }

  return {
    authorized: true,
    reason: 'admin_gate',
    message: 'Admin gate confirmed.',
  };
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { user: null, error: getMissingClientError() };
  }

  // Use getSession only as a cheap presence check; getUser validates the JWT
  // with Supabase before protected pages trust the identity.
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    return { user: null, error: sessionError };
  }

  if (!sessionData?.session) {
    return { user: null, error: null };
  }

  const { data, error } = await supabase.auth.getUser();

  return { user: data?.user || null, error };
}

export async function getCurrentProfile() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { profile: null, error: getMissingClientError() };
  }

  const { user, error: userError } = await getCurrentUser();

  if (userError) {
    return { profile: null, error: userError };
  }

  if (!user) {
    return { profile: null, error: null };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  return { profile: data || null, error };
}

export async function getCurrentUserWithProfile() {
  const { user, error: userError } = await getCurrentUser();

  if (userError || !user) {
    return { user, profile: null, error: userError };
  }

  const { profile, error: profileError } = await getCurrentProfile();

  return { user, profile, error: profileError };
}

export async function isCurrentUserAdmin() {
  const { profile, error } = await getCurrentProfile();

  if (error) {
    return { isAdmin: false, profile, error };
  }

  const supabase = getSupabaseClient();
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

  return {
    isAdmin: isAdmin === true,
    profile,
    error: adminError,
  };
}

export async function requireAllowedAccount({ signOutBanned = false } = {}) {
  if (!isSupabaseConfigured()) {
    return {
      allowed: false,
      reason: 'not_configured',
      message: 'Supabase is not configured for this environment.',
      user: null,
      profile: null,
      isRestricted: false,
      error: getMissingClientError(),
    };
  }

  const { user, profile, error } = await getCurrentUserWithProfile();

  if (error) {
    return {
      allowed: false,
      reason: 'auth_error',
      message: error.message,
      user,
      profile,
      isRestricted: false,
      error,
    };
  }

  if (!user) {
    return {
      allowed: false,
      reason: 'not_logged_in',
      message: 'Please sign in to continue.',
      user: null,
      profile: null,
      isRestricted: false,
      error: null,
    };
  }

  // Account bans are enforced here for protected frontend features.
  // Supabase RLS and admin-only profile policies still protect writes server-side.
  if (isBannedUser(profile)) {
    if (signOutBanned) {
      await signOut();
    }

    return {
      allowed: false,
      reason: 'banned',
      message: bannedAccountMessage,
      user,
      profile,
      isRestricted: false,
      error: null,
    };
  }

  return {
    allowed: true,
    reason: isRestrictedUser(profile) ? 'restricted' : 'active',
    message: '',
    user,
    profile,
    isRestricted: isRestrictedUser(profile),
    error: null,
  };
}

export async function requireAdmin({ redirectTo = '', redirectDelay = 0 } = {}) {
  if (!isSupabaseConfigured()) {
    return {
      authorized: false,
      reason: 'not_configured',
      message: 'Supabase is not configured for this environment.',
      user: null,
      profile: null,
      error: getMissingClientError(),
    };
  }

  const { user, error: userError } = await getCurrentUser();

  if (userError) {
    return {
      authorized: false,
      reason: 'auth_error',
      message: userError.message,
      user: null,
      profile: null,
      error: userError,
    };
  }

  if (!user) {
    if (redirectTo) {
      window.setTimeout(() => {
        window.location.assign(redirectTo);
      }, redirectDelay);
    }

    return {
      authorized: false,
      reason: 'not_logged_in',
      message: 'Please sign in with an admin account.',
      user: null,
      profile: null,
      error: null,
    };
  }

  // Frontend admin gating is only for UX. Database writes still depend on
  // Supabase RLS policies and the public.is_admin() helper in migrations.
  const { isAdmin, profile, error: profileError } = await isCurrentUserAdmin();

  if (profileError) {
    return {
      authorized: false,
      reason: 'profile_error',
      message: profileError.message,
      user,
      profile: null,
      error: profileError,
    };
  }

  if (isBannedUser(profile)) {
    await signOut();
    return {
      authorized: false,
      reason: 'banned',
      message: bannedAccountMessage,
      user,
      profile,
      error: null,
    };
  }

  if (!isAdmin) {
    return {
      authorized: false,
      reason: 'not_admin',
      message: 'This account does not have admin access.',
      user,
      profile,
      error: null,
    };
  }

  return {
    authorized: true,
    reason: 'admin',
    message: 'Admin access confirmed.',
    user,
    profile,
    error: null,
  };
}
