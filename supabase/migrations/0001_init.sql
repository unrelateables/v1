-- ============================================================================
-- Biolink platform schema + Row Level Security
-- Run this in the Supabase SQL editor (Dashboard > SQL Editor).
-- Idempotent-ish: safe to re-run individual sections.
-- ============================================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Enums ----------
do $$ begin
  create type user_role as enum ('user', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type bg_type as enum ('solid', 'gradient', 'image', 'video');
exception when duplicate_object then null; end $$;

-- ---------- Tables ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text unique not null check (char_length(username) between 3 and 24
                                        and username ~ '^[a-zA-Z0-9_]+$'),
  display_name text,
  bio          text check (char_length(bio) <= 280),
  avatar_url   text,
  role         user_role not null default 'user',
  banned       boolean not null default false,
  badges       text[] not null default '{}',
  created_at   timestamptz not null default now()
);

-- Backfill the column for existing deployments (safe to re-run).
alter table public.profiles
  add column if not exists badges text[] not null default '{}';

create table if not exists public.profile_settings (
  profile_id     uuid primary key references public.profiles(id) on delete cascade,
  bg_type        bg_type not null default 'solid',
  bg_value       text,                          -- hex / gradient css / url
  bg_overlay     integer not null default 30 check (bg_overlay between 0 and 100),
  accent_color   text not null default '#6366f1',
  text_color     text not null default '#ffffff',
  effects        jsonb not null default '{"particles":"none","snow":false,"rain":false}'::jsonb,
  audio_url      text,
  audio_autoplay boolean not null default false,
  glassmorphism  boolean not null default true,
  typing_effect  boolean not null default false,
  is_public      boolean not null default true,
  -- design controls
  layout         text not null default 'centered',  -- centered | left | card
  text_align     text not null default 'center',    -- center | left
  font_family    text not null default 'sans',      -- sans | mono | serif | display
  radius         text not null default 'full',        -- none | sm | md | lg | xl | full
  button_style   text not null default 'glass',     -- glass | filled | outline | minimal
  button_size    text not null default 'md',        -- sm | md | lg
  name_size      text not null default 'md',        -- sm | md | lg | xl
  avatar_shape   text not null default 'circle',    -- circle | square | rounded
  link_layout    text not null default 'list',      -- list | grid
  show_views     boolean not null default true,
  show_footer    boolean not null default true,
  custom_css     text,
  template       text not null default 'default',
  updated_at     timestamptz not null default now()
);

-- Backfill design columns for existing deployments (safe to re-run).
alter table public.profile_settings add column if not exists bg_overlay     integer not null default 30 check (bg_overlay between 0 and 100);
alter table public.profile_settings add column if not exists layout         text not null default 'centered';
alter table public.profile_settings add column if not exists text_align     text not null default 'center';
alter table public.profile_settings add column if not exists font_family    text not null default 'sans';
alter table public.profile_settings add column if not exists radius         text not null default 'full';
alter table public.profile_settings add column if not exists button_style   text not null default 'glass';
alter table public.profile_settings add column if not exists button_size    text not null default 'md';
alter table public.profile_settings add column if not exists name_size      text not null default 'md';
alter table public.profile_settings add column if not exists avatar_shape   text not null default 'circle';
alter table public.profile_settings add column if not exists link_layout    text not null default 'list';
alter table public.profile_settings add column if not exists show_views     boolean not null default true;
alter table public.profile_settings add column if not exists show_footer    boolean not null default true;
alter table public.profile_settings add column if not exists custom_css     text;
alter table public.profile_settings add column if not exists template       text not null default 'default';

create table if not exists public.links (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title      text not null check (char_length(title) between 1 and 64),
  url        text not null,
  icon       text,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.embeds (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  provider   text not null check (provider in ('youtube','spotify','soundcloud','custom')),
  embed_id   text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

-- analytics
create table if not exists public.views (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  ip_hash    text,
  created_at timestamptz not null default now()
);
create index if not exists views_profile_created_idx on public.views(profile_id, created_at);

create table if not exists public.link_clicks (
  id         uuid primary key default gen_random_uuid(),
  link_id    uuid not null references public.links(id) on delete cascade,
  ip_hash    text,
  created_at timestamptz not null default now()
);
create index if not exists clicks_link_created_idx on public.link_clicks(link_id, created_at);

-- moderation
create table if not exists public.flags (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  reason     text not null,
  resolved   boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- updated_at helper for profile_settings
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists touch_settings on public.profile_settings;
create trigger touch_settings before update on public.profile_settings
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles          enable row level security;
alter table public.profile_settings  enable row level security;
alter table public.links             enable row level security;
alter table public.embeds            enable row level security;
alter table public.views             enable row level security;
alter table public.link_clicks       enable row level security;
alter table public.flags             enable row level security;

-- helper: is current user an admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ---- profiles ----
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read" on public.profiles
  for select using (banned = false);

drop policy if exists "profiles_owner_all" on public.profiles;
create policy "profiles_owner_all" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- profile_settings ----
drop policy if exists "settings_public_read" on public.profile_settings;
create policy "settings_public_read" on public.profile_settings
  for select using (
    is_public = true
    and exists (
      select 1 from public.profiles p
      where p.id = profile_settings.profile_id and p.banned = false
    )
  );

drop policy if exists "settings_owner_all" on public.profile_settings;
create policy "settings_owner_all" on public.profile_settings
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "settings_admin_all" on public.profile_settings;
create policy "settings_admin_all" on public.profile_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- links / embeds ----
drop policy if exists "links_public_read" on public.links;
create policy "links_public_read" on public.links
  for select using (
    exists (
      select 1 from public.profiles p
      join public.profile_settings s on s.profile_id = p.id
      where p.id = links.profile_id and p.banned = false and s.is_public = true
    )
  );

drop policy if exists "links_owner_all" on public.links;
create policy "links_owner_all" on public.links
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "links_admin_all" on public.links;
create policy "links_admin_all" on public.links
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "embeds_public_read" on public.embeds;
create policy "embeds_public_read" on public.embeds
  for select using (
    exists (
      select 1 from public.profiles p
      join public.profile_settings s on s.profile_id = p.id
      where p.id = embeds.profile_id and p.banned = false and s.is_public = true
    )
  );

drop policy if exists "embeds_owner_all" on public.embeds;
create policy "embeds_owner_all" on public.embeds
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "embeds_admin_all" on public.embeds;
create policy "embeds_admin_all" on public.embeds
  for all using (public.is_admin()) with check (public.is_admin());

-- ---- analytics (public inserts, owner reads) ----
drop policy if exists "views_public_insert" on public.views;
create policy "views_public_insert" on public.views
  for insert with check (true);

drop policy if exists "views_owner_read" on public.views;
create policy "views_owner_read" on public.views
  for select using (profile_id = auth.uid() or public.is_admin());

drop policy if exists "clicks_public_insert" on public.link_clicks;
create policy "clicks_public_insert" on public.link_clicks
  for insert with check (true);

drop policy if exists "clicks_owner_read" on public.link_clicks;
create policy "clicks_owner_read" on public.link_clicks
  for select using (
    exists (select 1 from public.links l where l.id = link_clicks.link_id and l.profile_id = auth.uid())
    or public.is_admin()
  );

-- ---- flags ----
drop policy if exists "flags_owner_read" on public.flags;
create policy "flags_owner_read" on public.flags
  for select using (profile_id = auth.uid());

drop policy if exists "flags_insert_auth" on public.flags;
create policy "flags_insert_auth" on public.flags
  for insert to authenticated with check (true);

drop policy if exists "flags_admin_all" on public.flags;
create policy "flags_admin_all" on public.flags
  for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- Storage bucket for avatars
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and (auth.uid()::text = (storage.foldername(name))[1])
  );

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and (auth.uid()::text = (storage.foldername(name))[1])
  );

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and (auth.uid()::text = (storage.foldername(name))[1])
  );

-- ============================================================================
-- Leaderboard: profiles ranked by view count (public profiles only).
-- Safe to re-run.
-- ============================================================================
create or replace function public.get_leaderboard(limit_count int default 100)
returns table (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  role user_role,
  view_count bigint,
  created_at timestamptz
)
language sql
security definer set search_path = public
as $$
  select p.id, p.username, p.display_name, p.avatar_url, p.role,
         count(v.id) as view_count,
         p.created_at
  from public.profiles p
  left join public.views v on v.profile_id = p.id
  where p.banned = false
    and exists (
      select 1 from public.profile_settings s
      where s.profile_id = p.id and s.is_public = true
    )
  group by p.id
  order by view_count desc, p.created_at asc
  limit greatest(1, limit_count);
$$;

-- ============================================================================
-- Make yourself an admin (run once, replace the email):
-- update public.profiles set role = 'admin' where id = (
--   select id from auth.users where email = 'you@example.com'
-- );
-- ============================================================================
