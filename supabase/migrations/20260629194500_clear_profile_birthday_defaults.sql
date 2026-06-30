-- Birthday fields must remain empty until a user explicitly sets them.
-- This is defensive because profile creation may be handled by a Supabase
-- auth trigger that is not represented in the checked-in migrations.

do $$
declare
  profile_column text;
begin
  foreach profile_column in array array['birthday', 'birth_month', 'birth_day', 'zodiac_sign']
  loop
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'profiles'
        and column_name = profile_column
    ) then
      execute format('alter table public.profiles alter column %I drop default', profile_column);
      execute format('alter table public.profiles alter column %I drop not null', profile_column);
    end if;
  end loop;
end $$;
