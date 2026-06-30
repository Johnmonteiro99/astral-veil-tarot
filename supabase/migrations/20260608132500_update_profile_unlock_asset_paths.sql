-- Keep existing granted profile unlock rows pointed at the current asset name.

do $$
begin
  if to_regclass('public.user_profile_unlocks') is not null then
    update public.user_profile_unlocks
    set asset_path = 'assets/images/unlockables/restricted-wing-profile-bg.png'
    where unlock_key = 'restricted_wing_background';
  end if;
end $$;
