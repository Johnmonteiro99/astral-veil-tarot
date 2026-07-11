# Admin authorization security verification

Apply `20260711120000_protect_admin_authorization.sql` in a non-production
Supabase project first. Create two ordinary authenticated accounts (User A and
User B), and add a separate known administrator to `public.admin_memberships`
from the SQL editor or service role:

```sql
insert into public.admin_memberships (user_id)
values ('<admin-auth-user-uuid>')
on conflict (user_id) do nothing;
```

Use User A's Supabase browser/client session for the following direct API
checks. These calls intentionally bypass the product UI.

```js
// 1. User A cannot promote themself.
const attempt = await supabase
  .from('profiles')
  .update({ role: 'admin', roles: ['admin'], is_admin: true })
  .eq('id', userA.id);
console.assert(attempt.error, 'self-promotion must be rejected');

// 2. The same restriction applies to a direct Supabase request, including
// moderation/restriction fields.
const directAttempt = await supabase
  .from('profiles')
  .update({ account_status: 'banned', ban_reason: 'forged' })
  .eq('id', userA.id);
console.assert(directAttempt.error, 'direct moderation change must be rejected');

const deletionStatusAttempt = await supabase
  .from('profiles')
  .update({ account_status: 'pending_deletion' })
  .eq('id', userA.id);
console.assert(deletionStatusAttempt.error, 'direct deletion status change must be rejected');

// 3. Ordinary profile updates remain available.
const safeUpdate = await supabase
  .from('profiles')
  .update({ display_name: 'User A', avatar_url: 'https://example.test/a.png', biography: 'Hello' })
  .eq('id', userA.id);
console.assert(!safeUpdate.error, safeUpdate.error?.message);

// The supported deletion workflow still works; it alone sets the protected
// transaction-local marker required by the profile trigger.
const deletionRequest = await supabase.rpc('request_account_deletion', {
  p_user_email: userA.email,
  p_reason: 'Integration test',
});
console.assert(!deletionRequest.error, deletionRequest.error?.message);

// 4. Membership—not profiles.role—determines admin access.
const adminCheck = await supabase.rpc('is_admin');
console.assert(adminCheck.data === false, 'User A is not an admin');

// 5. User A has no access to the protected membership table.
const memberships = await supabase.from('admin_memberships').select('*');
console.assert(memberships.error || memberships.data.length === 0,
  'User A must not be able to read admin memberships');

for (const operation of [
  supabase.from('admin_memberships').insert({ user_id: userA.id }),
  supabase.from('admin_memberships').update({ granted_at: new Date().toISOString() }).eq('user_id', userA.id),
  supabase.from('admin_memberships').delete().eq('user_id', userA.id),
]) {
  const { error } = await operation;
  console.assert(error, 'User A must not be able to modify admin memberships');
}
```

Then sign in as the administrator and verify `supabase.rpc('is_admin')` returns
`true`, the admin dashboard can read/administer its RLS-protected tables, and
an admin update to a profile's `account_status` succeeds. Finally, inspect
`public.admin_memberships` in the SQL editor and confirm User A was not added.

## Rollback notes

Do not roll this back by restoring the old `public.is_admin()` implementation:
that immediately reintroduces self-promotion. If a rollback is essential,
first deploy an equivalent server-controlled authorization source, then replace
`public.is_admin()` to read that source. The membership table can be retained
without user impact. Only after all RLS policies have been migrated to a safe
replacement should the trigger/function be removed and, if necessary, the
table dropped. Keep a backup of `public.admin_memberships` before any rollback.
