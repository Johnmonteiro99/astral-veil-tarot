-- Persist the selected reading deck independently from mode or current UI state.
alter table if exists public.user_readings
  add column if not exists deck_key text,
  add column if not exists deck_name text;

-- Existing readings can be backfilled only from their explicitly saved metadata.
-- Rows without a known identifier remain null so the client can show a legacy
-- artwork-unavailable state instead of substituting an unrelated deck.
update public.user_readings
set
  deck_key = case lower(regexp_replace(coalesce(metadata -> 'deck' ->> 'id', ''), '[^a-z0-9]', '', 'g'))
    when 'lumen' then 'lumen'
    when 'dreambound' then 'dreambound'
    when 'moonveil' then 'moonveil'
    when 'astralveiltarot' then 'astralVeilTarot'
    when 'bloodmoon' then 'bloodMoon'
    when 'astralveilcrimson' then 'astralVeilCrimson'
    else null
  end,
  deck_name = coalesce(deck_name, metadata -> 'deck' ->> 'title')
where deck_key is null
  and metadata -> 'deck' ->> 'id' is not null;

create index if not exists user_readings_user_deck_key_idx
  on public.user_readings (user_id, deck_key)
  where is_saved = true;
