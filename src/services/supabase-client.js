import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

import { SUPABASE_CONFIG } from '../config/supabase-config.js';

let supabaseClient = null;

function getRuntimeConfig() {
  return window.ASTRAL_VEIL_SUPABASE_CONFIG || {};
}

function normalizeSupabaseUrl(url) {
  return String(url || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

export function getSupabaseConfig() {
  const runtimeConfig = getRuntimeConfig();

  return {
    url: normalizeSupabaseUrl(runtimeConfig.url || SUPABASE_CONFIG.url),
    anonKey: runtimeConfig.anonKey || SUPABASE_CONFIG.anonKey,
  };
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseConfig();

  return Boolean(url && anonKey);
}

export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!supabaseClient) {
    const { url, anonKey } = getSupabaseConfig();

    // This client intentionally uses the frontend-safe publishable/anon key.
    // Private data boundaries must be enforced by Supabase RLS, not by secrets
    // embedded in the static site.
    supabaseClient = createClient(url, anonKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true,
      },
    });
  }

  return supabaseClient;
}
