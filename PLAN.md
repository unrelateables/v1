# Biolink Platform — Build Plan

A self-hosted biolink / "link-in-bio" platform in the style of guns.lol, shy.bio, and feds.lol.
Users get a customizable personal page (avatar, links, bio, background/video, music, visual effects,
custom username URL, view counter) they can share. Free tier only — no paid features.

**Placeholder project name:** `biolink` (rename later).

---

## 1. Goals & scope (MVP = full bells & whistles)

- Public profile page at `/:username`, SSR for SEO + fast first paint.
- Signed-in dashboard to edit profile, manage links, and configure appearance.
- Visual effects: particles / snow / rain, typing effect, glassmorphism, badges.
- Media: background image / video / gradient / solid, audio player, avatar upload.
- Per-link click analytics + profile view counter.
- Embeds (e.g. YouTube, Spotify) blocks.
- Admin/moderation: view, ban/unban users, remove offending pages.
- "Premium-style" toggles present in UI but **disabled** until paid features ship.

### Out of scope for v1
- Per-user subdomains (`user.domain.com`) — needs Vercel Pro+ wildcard.
- Custom domains.
- Real payments / paid tiers.

---

## 2. Tech stack (all free tier)

| Concern        | Choice                                            |
| -------------- | ------------------------------------------------- |
| Framework      | Next.js 14+ (App Router) + TypeScript              |
| Styling        | Tailwind CSS                                       |
| Database/Auth  | Supabase (Postgres + Auth + Storage)              |
| Auth method    | Email + password (SSR cookie sessions via `@supabase/ssr`) |
| Hosting        | Vercel Hobby                                       |
| Profile URLs   | Path-based `/:username`                            |

---

## 3. URL / route strategy

- `/:username`            → public profile (public, SSR, cached)
- `/login`, `/signup`     → auth pages (public)
- `/dashboard`            → overview / stats (auth)
- `/dashboard/profile`    → avatar, display name, bio, username (auth)
- `/dashboard/links`      → CRUD links (auth)
- `/dashboard/appearance` → background, colors, effects, audio (auth)
- `/dashboard/settings`   → privacy, embeds, premium toggles (auth)
- `/admin`                → moderation tools (admin role only)

> Subdomains deferred: schema is subdomain-ready (`username` unique, own domain
> captured on profile) so we can add `user.domain.com` later without a redesign.

---

## 4. Media strategy (1GB Supabase storage budget)

- **Avatars** → uploaded to Supabase Storage bucket `avatars` (resize client-side).
- **Background image/video** → user-pasted URL (hotlinked).
- **Audio/music** → user-pasted URL (hotlinked).
- **Embeds** → store provider + id, render iframe (no storage used).

---

## 5. Database schema

Tables (all with RLS):

- `profiles` — one row per user: `id (uuid, FK auth.users)`, `username (unique)`,
  `display_name`, `bio`, `avatar_url`, `role (user|admin)`, `banned (bool)`,
  `created_at`.
- `profile_settings` — appearance: `profile_id`, `bg_type (image|video|gradient|solid)`,
  `bg_value`, `accent_color`, `text_color`, `effects (jsonb)`, `audio_url`,
  `glassmorphism (bool)`, `typing_effect (bool)`, `is_public (bool)`.
- `links` — `id`, `profile_id`, `title`, `url`, `icon`, `position (int)`, `created_at`.
- `embeds` — `id`, `profile_id`, `provider`, `embed_id`, `position`, `created_at`.
- `views` — `id`, `profile_id`, `created_at`, `ip_hash` (for dedupe/rate-limit).
- `link_clicks` — `id`, `link_id`, `created_at`, `ip_hash`.
- `flags` — admin moderation: `id`, `profile_id`, `reason`, `resolved (bool)`.

**RLS policies:**
- Public can SELECT `profiles` + `profile_settings` + `links` + `embeds` where
  `is_public = true` and profile not banned.
- Owner can SELECT/INSERT/UPDATE/DELETE their own rows.
- Admins can do everything.
- `views` / `link_clicks`: public INSERT (anon), owner SELECT own stats.

---

## 6. Reserved usernames

`admin, root, api, dashboard, login, signup, settings, profile, links,
appearance, dashboard, www, support, help, about, privacy, terms, biolink`

---

## 7. Build order

1. Scaffold Next.js (TS + Tailwind + App Router).
2. Supabase clients (browser + server) + env.
3. DB schema + RLS SQL migration file.
4. Auth: signup/login/logout, SSR cookies, middleware, route groups.
5. Dashboard: profile editor, links CRUD, appearance editor, settings.
6. Public profile renderer: layout, background, effects, audio, typing, glassmorphism.
7. View counter + link click tracking endpoints.
8. Admin moderation tools.
9. Deploy config (`vercel.json`), README, env template.

---

## 8. Risks & mitigations

| Risk                              | Mitigation                                                        |
| --------------------------------- | ----------------------------------------------------------------- |
| Supabase free DB pauses (1wk idle)| Cron ping (Upstash/preview) or accept manual resume              |
| Vercel 100GB bandwidth cap        | Hotlink heavy media; lazy-load effects; cache SSR profile pages  |
| Hotlink CORS / hotlink protection | Validate URL; provide fallback; warn in UI                        |
| View-counter abuse                | Dedupe by `ip_hash`, rate-limit inserts                           |
| Reserved/abusive usernames        | Reserved list + admin review + profanity allowlist later          |
| UGC abuse (NSFW/illegal links)    | Admin tools, ban, flags table; TOS page                          |

---

## 9. Validation

- `npm run lint` + `npm run build` pass.
- Public profile renders SSR; view increments once per IP.
- Dashboard CRUD flows work; RLS blocks non-owners.
- Admin can ban/unban; banned profiles return 404/hidden.
- Deploy to Vercel preview; verify env vars wired.
