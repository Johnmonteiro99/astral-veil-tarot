-- Journal prompt library foundation for Astral Veil.
-- Apply in the Supabase SQL editor after the user_journal_entries table exists.

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

alter table public.user_journal_entries
  add column if not exists check_in text,
  add column if not exists mood text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists prompt text,
  add column if not exists guided_answers jsonb not null default '[]'::jsonb,
  add column if not exists mode text not null default 'sun',
  add column if not exists source_type text not null default 'journal',
  add column if not exists source_reading_id uuid,
  add column if not exists reflection_type text not null default 'daily_reflection',
  add column if not exists updated_at timestamptz not null default now();

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

alter table public.journal_prompts enable row level security;

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
  (prompt_text, prompt_type, mode, mood, intensity, category, sort_order)
values
  ('What part of today asked to be remembered?', 'prompt_of_day', 'lumen', 'any', 'gentle', 'daily', 10),
  ('What is one feeling you can name without needing to fix it?', 'prompt_of_day', 'lumen', 'any', 'gentle', 'daily', 20),
  ('What small truth feels ready to be written down?', 'prompt_of_day', 'lumen', 'any', 'gentle', 'daily', 30),
  ('What did this reading help you notice about your present path?', 'reading_reflection', 'lumen', 'any', 'gentle', 'reading', 10),
  ('Which card or message stayed with you most clearly, and why?', 'reading_reflection', 'lumen', 'any', 'gentle', 'reading', 20),
  ('What action, pause, or question does this reading invite next?', 'reading_reflection', 'lumen', 'any', 'gentle', 'reading', 30),
  ('What part of you feels most steady right now?', 'guided_question', 'lumen', 'calm', 'gentle', 'mood', 10),
  ('Where did calm show up today, even briefly?', 'guided_question', 'lumen', 'calm', 'gentle', 'mood', 20),
  ('What would help you protect this steadiness tomorrow?', 'guided_question', 'lumen', 'calm', 'gentle', 'mood', 30),
  ('What feels possible today that did not feel possible before?', 'guided_question', 'lumen', 'hopeful', 'gentle', 'mood', 40),
  ('What hope feels realistic enough to hold gently?', 'guided_question', 'lumen', 'hopeful', 'gentle', 'mood', 50),
  ('Who or what helped your hope return?', 'guided_question', 'lumen', 'hopeful', 'gentle', 'mood', 60),
  ('What is your restlessness trying to point toward?', 'guided_question', 'lumen', 'restless', 'steady', 'mood', 70),
  ('Where does your energy want movement, and where does it need care?', 'guided_question', 'lumen', 'restless', 'steady', 'mood', 80),
  ('What would make this feeling less tangled?', 'guided_question', 'lumen', 'restless', 'gentle', 'mood', 90),
  ('What idea or image is asking for attention?', 'guided_question', 'lumen', 'inspired', 'gentle', 'mood', 100),
  ('What part of your inspiration feels alive enough to begin?', 'guided_question', 'lumen', 'inspired', 'gentle', 'mood', 110),
  ('How can you honor this spark without rushing it?', 'guided_question', 'lumen', 'inspired', 'gentle', 'mood', 120),
  ('What felt heavy today, and what helped you carry it?', 'guided_question', 'lumen', 'heavy', 'steady', 'mood', 130),
  ('What part of this weight belongs to you, and what may not?', 'guided_question', 'lumen', 'heavy', 'steady', 'mood', 140),
  ('What would feel like one small relief right now?', 'guided_question', 'lumen', 'heavy', 'gentle', 'mood', 150),
  ('What question keeps returning?', 'guided_question', 'lumen', 'confused', 'gentle', 'mood', 160),
  ('What do you know for sure, even if the whole picture is unclear?', 'guided_question', 'lumen', 'confused', 'gentle', 'mood', 170),
  ('What might become easier if you gave yourself more time?', 'guided_question', 'lumen', 'confused', 'gentle', 'mood', 180),
  ('What are you grateful for that still feels true?', 'guided_question', 'lumen', 'grateful', 'gentle', 'mood', 190),
  ('How did gratitude change the shape of today?', 'guided_question', 'lumen', 'grateful', 'gentle', 'mood', 200),
  ('What deserves to be appreciated before the day ends?', 'guided_question', 'lumen', 'grateful', 'gentle', 'mood', 210),
  ('What feels clear now?', 'guided_question', 'lumen', 'clear', 'gentle', 'mood', 220),
  ('What decision, boundary, or next step feels simpler than before?', 'guided_question', 'lumen', 'clear', 'gentle', 'mood', 230),
  ('What helped the fog lift?', 'guided_question', 'lumen', 'clear', 'gentle', 'mood', 240),
  ('What has been sitting on your mind today?', 'guided_question', 'lumen', 'any', 'gentle', 'fallback', 300),
  ('What did you need today?', 'guided_question', 'lumen', 'any', 'gentle', 'fallback', 310),
  ('What do you want to remember about this moment?', 'guided_question', 'lumen', 'any', 'gentle', 'fallback', 320),
  ('What truth feels safe enough to name tonight?', 'shadow_question', 'bloodmoon', 'any', 'deep', 'shadow', 400),
  ('What feeling keeps returning, and what might it be asking for?', 'shadow_question', 'bloodmoon', 'any', 'deep', 'shadow', 410),
  ('Where are you ready to be more honest with yourself, gently and without blame?', 'shadow_question', 'bloodmoon', 'any', 'deep', 'shadow', 420),
  ('What did feeling exposed reveal about what matters to you?', 'shadow_question', 'bloodmoon', 'exposed', 'deep', 'shadow', 430),
  ('What boundary or tenderness would help you feel less unguarded?', 'shadow_question', 'bloodmoon', 'exposed', 'steady', 'shadow', 440),
  ('What part of this raw feeling deserves patience?', 'shadow_question', 'bloodmoon', 'raw', 'deep', 'shadow', 450),
  ('What does this feeling need before it can soften?', 'shadow_question', 'bloodmoon', 'raw', 'steady', 'shadow', 460),
  ('What is your anger protecting?', 'shadow_question', 'bloodmoon', 'angry', 'deep', 'shadow', 470),
  ('What would it look like to listen to anger without letting it steer everything?', 'shadow_question', 'bloodmoon', 'angry', 'steady', 'shadow', 480),
  ('What might numbness be giving you distance from?', 'shadow_question', 'bloodmoon', 'numb', 'steady', 'shadow', 490),
  ('What small sensation or truth can you notice without forcing more?', 'shadow_question', 'bloodmoon', 'numb', 'gentle', 'shadow', 500),
  ('What memory, pattern, or echo is asking to be understood differently?', 'shadow_question', 'bloodmoon', 'haunted', 'deep', 'shadow', 510),
  ('What would help you meet this echo with more care?', 'shadow_question', 'bloodmoon', 'haunted', 'steady', 'shadow', 520),
  ('What feels unsettled, and what part of it can be named?', 'shadow_question', 'bloodmoon', 'unsettled', 'steady', 'shadow', 530),
  ('What would make the next hour feel more grounded?', 'shadow_question', 'bloodmoon', 'unsettled', 'gentle', 'shadow', 540),
  ('What are you avoiding because it feels too tangled right now?', 'shadow_question', 'bloodmoon', 'avoidant', 'deep', 'shadow', 550),
  ('What is one honest sentence you can write without pushing further?', 'shadow_question', 'bloodmoon', 'avoidant', 'steady', 'shadow', 560),
  ('What are you ready to face with care?', 'shadow_question', 'bloodmoon', 'ready', 'deep', 'shadow', 570),
  ('What support, boundary, or next step would help you stay steady as you face it?', 'shadow_question', 'bloodmoon', 'ready', 'steady', 'shadow', 580)
on conflict (prompt_text, prompt_type, mode, mood) do nothing;
