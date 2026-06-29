import { getSupabaseClient, isSupabaseConfigured } from './supabase-client.js';

function getMissingClientError() {
  return new Error('Supabase is not configured for this environment.');
}

function profileHasAdminRole(profile) {
  if (!profile) {
    return false;
  }

  if (profile.is_admin === true) {
    return true;
  }

  if (profile.role === 'admin') {
    return true;
  }

  if (Array.isArray(profile.roles) && profile.roles.includes('admin')) {
    return true;
  }

  return false;
}

export async function signIn(email, password) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: null, error: getMissingClientError() };
  }

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password, { displayName = '' } = {}) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { data: null, error: getMissingClientError() };
  }

  const trimmedDisplayName = String(displayName || '').trim();
  const options = trimmedDisplayName
    ? { data: { display_name: trimmedDisplayName } }
    : undefined;

  return supabase.auth.signUp({
    email,
    password,
    options,
  });
}

export async function signOut() {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return { error: getMissingClientError() };
  }

  return supabase.auth.signOut();
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

  return {
    isAdmin: profileHasAdminRole(profile),
    profile,
    error,
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
