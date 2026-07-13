-- Create the reusable Journal Prompts library for Astral Veil.
-- Apply with Supabase migrations or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.journal_prompts (
  id uuid primary key default gen_random_uuid(),
  prompt_text text not null,
  prompt_type text not null default 'guided_question',
  mode text not null default 'all',
  mood text not null default 'any',
  intensity text not null default 'gentle',
  category text,
  is_active boolean not null default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.journal_prompts
  add column if not exists prompt_text text,
  add column if not exists prompt_type text not null default 'guided_question',
  add column if not exists mode text not null default 'all',
  add column if not exists mood text not null default 'any',
  add column if not exists intensity text not null default 'gentle',
  add column if not exists category text,
  add column if not exists is_active boolean not null default true,
  add column if not exists sort_order integer default 0,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.journal_prompts
set prompt_text = 'Untitled journal prompt'
where prompt_text is null;

alter table public.journal_prompts
  alter column prompt_text set not null;

update public.journal_prompts
set mode = 'lumen'
where mode = 'all'
  and prompt_type in ('guided_question', 'prompt_of_day', 'reading_reflection');

update public.journal_prompts
set mode = 'bloodmoon'
where mode = 'blood_moon';

do $$
begin
  if to_regclass('public.user_journal_entries') is not null
    and exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'user_journal_entries'
        and column_name = 'mode'
    ) then
    update public.user_journal_entries
    set mode = 'bloodmoon'
    where mode = 'blood_moon';
  end if;

  if to_regclass('public.user_readings') is not null
    and exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'user_readings'
        and column_name = 'mode_key'
    ) then
    update public.user_readings
    set mode_key = 'bloodmoon'
    where mode_key = 'blood_moon';
  end if;
end $$;

-- Historical SQL-editor deployments and the mode normalizations above can
-- leave multiple rows that now represent the same prompt. Retain the oldest
-- row as canonical and remove only exact duplicates of the unique-index key.
create temporary table journal_prompt_duplicate_map
on commit drop
as
with ranked_prompts as (
  select
    id,
    first_value(id) over (
      partition by prompt_text, prompt_type, mode, mood
      order by created_at asc nulls last, id asc
    ) as canonical_id,
    row_number() over (
      partition by prompt_text, prompt_type, mode, mood
      order by created_at asc nulls last, id asc
    ) as duplicate_rank
  from public.journal_prompts
)
select id as duplicate_id, canonical_id
from ranked_prompts
where duplicate_rank > 1;

-- Remap every single-column foreign key to the canonical prompt before the
-- duplicate rows are removed. Composite references are deliberately rejected:
-- they need an explicit, data-model-specific migration rather than a lossy
-- generic rewrite. The transaction rolls back if a dependent unique/check
-- constraint makes a remap unsafe.
do $$
declare
  dependent record;
  journal_prompts_id_attnum smallint;
begin
  select attnum
  into journal_prompts_id_attnum
  from pg_catalog.pg_attribute
  where attrelid = 'public.journal_prompts'::regclass
    and attname = 'id'
    and not attisdropped;

  if exists (
    select 1
    from pg_catalog.pg_constraint as con
    where con.contype = 'f'
      and con.confrelid = 'public.journal_prompts'::regclass
      and (
        cardinality(con.conkey) <> 1
        or cardinality(con.confkey) <> 1
        or con.confkey[1] <> journal_prompts_id_attnum
      )
  ) then
    raise exception
      'Cannot safely deduplicate journal_prompts: a composite or non-id foreign key references it';
  end if;

  for dependent in
    select
      dependent_schema.nspname as schema_name,
      dependent_table.relname as table_name,
      dependent_column.attname as column_name
    from pg_catalog.pg_constraint as con
    join pg_catalog.pg_class as dependent_table
      on dependent_table.oid = con.conrelid
    join pg_catalog.pg_namespace as dependent_schema
      on dependent_schema.oid = dependent_table.relnamespace
    join pg_catalog.pg_attribute as dependent_column
      on dependent_column.attrelid = con.conrelid
      and dependent_column.attnum = con.conkey[1]
    where con.contype = 'f'
      and con.confrelid = 'public.journal_prompts'::regclass
      and cardinality(con.conkey) = 1
      and cardinality(con.confkey) = 1
      and con.confkey[1] = journal_prompts_id_attnum
  loop
    execute format(
      'update %I.%I as dependent set %I = duplicate_map.canonical_id from pg_temp.journal_prompt_duplicate_map as duplicate_map where dependent.%I = duplicate_map.duplicate_id',
      dependent.schema_name,
      dependent.table_name,
      dependent.column_name,
      dependent.column_name
    );
  end loop;
end;
$$;

delete from public.journal_prompts as prompt
using pg_temp.journal_prompt_duplicate_map as duplicate_map
where prompt.id = duplicate_map.duplicate_id;

-- Verification query: this must return zero rows before the unique index is
-- created. It is kept as a result-producing query for deploy logs as well as
-- being enforced by the guard below.
select prompt_text, prompt_type, mode, mood, count(*) as duplicate_count
from public.journal_prompts
group by prompt_text, prompt_type, mode, mood
having count(*) > 1;

-- Raise rather than silently proceed if the verification query is non-empty.
do $$
begin
  if exists (
    select 1
    from public.journal_prompts
    group by prompt_text, prompt_type, mode, mood
    having count(*) > 1
  ) then
    raise exception 'journal_prompts still contains duplicate unique-index keys after cleanup';
  end if;
end;
$$;

create unique index if not exists journal_prompts_unique_prompt_idx
on public.journal_prompts (prompt_text, prompt_type, mode, mood);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_journal_prompts_updated_at on public.journal_prompts;
create trigger set_journal_prompts_updated_at
before update on public.journal_prompts
for each row
execute function public.set_updated_at();

alter table public.journal_prompts enable row level security;

revoke all on public.journal_prompts from anon;
revoke all on public.journal_prompts from authenticated;
grant select on public.journal_prompts to anon;
grant select, insert, update on public.journal_prompts to authenticated;

drop policy if exists "Anyone can read active journal prompts" on public.journal_prompts;
drop policy if exists "Admins can read all journal prompts" on public.journal_prompts;
drop policy if exists "Admins can create journal prompts" on public.journal_prompts;
drop policy if exists "Admins can update journal prompts" on public.journal_prompts;

create policy "Anyone can read active journal prompts"
on public.journal_prompts
for select
to anon, authenticated
using (is_active = true);

create policy "Admins can read all journal prompts"
on public.journal_prompts
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and (
        to_jsonb(profile)->>'role' = 'admin'
        or to_jsonb(profile)->>'is_admin' = 'true'
        or (to_jsonb(profile)->'roles') ? 'admin'
      )
  )
);

create policy "Admins can create journal prompts"
on public.journal_prompts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and (
        to_jsonb(profile)->>'role' = 'admin'
        or to_jsonb(profile)->>'is_admin' = 'true'
        or (to_jsonb(profile)->'roles') ? 'admin'
      )
  )
);

create policy "Admins can update journal prompts"
on public.journal_prompts
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and (
        to_jsonb(profile)->>'role' = 'admin'
        or to_jsonb(profile)->>'is_admin' = 'true'
        or (to_jsonb(profile)->'roles') ? 'admin'
      )
  )
)
with check (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and (
        to_jsonb(profile)->>'role' = 'admin'
        or to_jsonb(profile)->>'is_admin' = 'true'
        or (to_jsonb(profile)->'roles') ? 'admin'
      )
  )
);

insert into public.journal_prompts
  (prompt_text, prompt_type, mode, mood, intensity, category, sort_order, is_active)
values
  ('What part of today asked to be remembered?', 'prompt_of_day', 'lumen', 'any', 'gentle', 'daily', 10, true),
  ('What is one feeling you can name without needing to fix it?', 'prompt_of_day', 'lumen', 'any', 'gentle', 'daily', 20, true),
  ('What small truth feels ready to be written down?', 'prompt_of_day', 'lumen', 'any', 'gentle', 'daily', 30, true),
  ('What did this reading help you notice about your present path?', 'reading_reflection', 'lumen', 'any', 'gentle', 'reading', 10, true),
  ('Which card or message stayed with you most clearly, and why?', 'reading_reflection', 'lumen', 'any', 'reflective', 'reading', 20, true),
  ('What action, pause, or question does this reading invite next?', 'reading_reflection', 'lumen', 'any', 'gentle', 'reading', 30, true),
  ('What part of you feels most steady right now?', 'guided_question', 'lumen', 'calm', 'gentle', 'mood', 10, true),
  ('Where did calm show up today, even briefly?', 'guided_question', 'lumen', 'calm', 'gentle', 'mood', 20, true),
  ('What would help you protect this steadiness tomorrow?', 'guided_question', 'lumen', 'calm', 'gentle', 'mood', 30, true),
  ('What feels possible today that did not feel possible before?', 'guided_question', 'lumen', 'hopeful', 'gentle', 'mood', 40, true),
  ('What hope feels realistic enough to hold gently?', 'guided_question', 'lumen', 'hopeful', 'gentle', 'mood', 50, true),
  ('Who or what helped your hope return?', 'guided_question', 'lumen', 'hopeful', 'gentle', 'mood', 60, true),
  ('What is your restlessness trying to point toward?', 'guided_question', 'lumen', 'restless', 'reflective', 'mood', 70, true),
  ('Where does your energy want movement, and where does it need care?', 'guided_question', 'lumen', 'restless', 'reflective', 'mood', 80, true),
  ('What would make this feeling less tangled?', 'guided_question', 'lumen', 'restless', 'gentle', 'mood', 90, true),
  ('What idea or image is asking for attention?', 'guided_question', 'lumen', 'inspired', 'gentle', 'mood', 100, true),
  ('What part of your inspiration feels alive enough to begin?', 'guided_question', 'lumen', 'inspired', 'gentle', 'mood', 110, true),
  ('How can you honor this spark without rushing it?', 'guided_question', 'lumen', 'inspired', 'gentle', 'mood', 120, true),
  ('What felt heavy today, and what helped you carry it?', 'guided_question', 'lumen', 'heavy', 'reflective', 'mood', 130, true),
  ('What part of this weight belongs to you, and what may not?', 'guided_question', 'lumen', 'heavy', 'reflective', 'mood', 140, true),
  ('What would feel like one small relief right now?', 'guided_question', 'lumen', 'heavy', 'gentle', 'mood', 150, true),
  ('What question keeps returning?', 'guided_question', 'lumen', 'confused', 'gentle', 'mood', 160, true),
  ('What do you know for sure, even if the whole picture is unclear?', 'guided_question', 'lumen', 'confused', 'gentle', 'mood', 170, true),
  ('What might become easier if you gave yourself more time?', 'guided_question', 'lumen', 'confused', 'gentle', 'mood', 180, true),
  ('What are you grateful for that still feels true?', 'guided_question', 'lumen', 'grateful', 'gentle', 'mood', 190, true),
  ('How did gratitude change the shape of today?', 'guided_question', 'lumen', 'grateful', 'gentle', 'mood', 200, true),
  ('What deserves to be appreciated before the day ends?', 'guided_question', 'lumen', 'grateful', 'gentle', 'mood', 210, true),
  ('What feels clear now?', 'guided_question', 'lumen', 'clear', 'gentle', 'mood', 220, true),
  ('What decision, boundary, or next step feels simpler than before?', 'guided_question', 'lumen', 'clear', 'gentle', 'mood', 230, true),
  ('What helped the fog lift?', 'guided_question', 'lumen', 'clear', 'gentle', 'mood', 240, true),
  ('What has been sitting on your mind today?', 'guided_question', 'lumen', 'any', 'gentle', 'fallback', 300, true),
  ('What did you need today?', 'guided_question', 'lumen', 'any', 'gentle', 'fallback', 310, true),
  ('What do you want to remember about this moment?', 'guided_question', 'lumen', 'any', 'gentle', 'fallback', 320, true),
  ('What truth feels safe enough to name tonight?', 'shadow_question', 'bloodmoon', 'any', 'deep', 'shadow', 400, true),
  ('What feeling keeps returning, and what might it be asking for?', 'shadow_question', 'bloodmoon', 'any', 'deep', 'shadow', 410, true),
  ('Where are you ready to be more honest with yourself, gently and without blame?', 'shadow_question', 'bloodmoon', 'any', 'deep', 'shadow', 420, true),
  ('What did feeling exposed reveal about what matters to you?', 'shadow_question', 'bloodmoon', 'exposed', 'deep', 'shadow', 430, true),
  ('What boundary or tenderness would help you feel less unguarded?', 'shadow_question', 'bloodmoon', 'exposed', 'reflective', 'shadow', 440, true),
  ('What part of this raw feeling deserves patience?', 'shadow_question', 'bloodmoon', 'raw', 'deep', 'shadow', 450, true),
  ('What does this feeling need before it can soften?', 'shadow_question', 'bloodmoon', 'raw', 'reflective', 'shadow', 460, true),
  ('What is your anger protecting?', 'shadow_question', 'bloodmoon', 'angry', 'deep', 'shadow', 470, true),
  ('What would it look like to listen to anger without letting it steer everything?', 'shadow_question', 'bloodmoon', 'angry', 'reflective', 'shadow', 480, true),
  ('What might numbness be giving you distance from?', 'shadow_question', 'bloodmoon', 'numb', 'reflective', 'shadow', 490, true),
  ('What small sensation or truth can you notice without forcing more?', 'shadow_question', 'bloodmoon', 'numb', 'gentle', 'shadow', 500, true),
  ('What memory, pattern, or echo is asking to be understood differently?', 'shadow_question', 'bloodmoon', 'haunted', 'deep', 'shadow', 510, true),
  ('What would help you meet this echo with more care?', 'shadow_question', 'bloodmoon', 'haunted', 'reflective', 'shadow', 520, true),
  ('What feels unsettled, and what part of it can be named?', 'shadow_question', 'bloodmoon', 'unsettled', 'reflective', 'shadow', 530, true),
  ('What would make the next hour feel more grounded?', 'shadow_question', 'bloodmoon', 'unsettled', 'gentle', 'shadow', 540, true),
  ('What are you avoiding because it feels too tangled right now?', 'shadow_question', 'bloodmoon', 'avoidant', 'deep', 'shadow', 550, true),
  ('What is one honest sentence you can write without pushing further?', 'shadow_question', 'bloodmoon', 'avoidant', 'reflective', 'shadow', 560, true),
  ('What are you ready to face with care?', 'shadow_question', 'bloodmoon', 'ready', 'deep', 'shadow', 570, true),
  ('What support, boundary, or next step would help you stay steady as you face it?', 'shadow_question', 'bloodmoon', 'ready', 'reflective', 'shadow', 580, true)
on conflict (prompt_text, prompt_type, mode, mood) do nothing;
