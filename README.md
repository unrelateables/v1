# biolink

A self-hostable, free biolink / link-in-bio platform in the style of
guns.lol, shy.bio, and feds.lol. Users get a customizable public page
(avatar, links, bio, background/video, music, visual effects, view counter).

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind · Supabase · Vercel.
**Everything is free tier. No paid features (yet).**

See [PLAN.md](./PLAN.md) for the full design.

---

## 1. Prerequisites

- Node 18+
- A free [Vercel](https://vercel.com) account
- A free [Supabase](https://supabase.com) project

## 2. Supabase setup

1. Create a new Supabase project.
2. **SQL Editor →** paste and run [`supabase/migrations/0001_init.sql`](./supabase/migrations/0001_init.sql).
   This creates all tables, RLS policies, triggers, and the `avatars` bucket.
3. **Project Settings → API** and copy:
   - `Project URL`
   - `anon` `public` key
   - `service_role` key (keep secret!)
4. **Authentication → Providers → Email:** ensure Email is enabled.
   - For instant local dev without email confirmation, disable
     "Confirm email" under Sign In / Providers.

## 3. Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in your Supabase keys
npm run dev
```

Open http://localhost:3000

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Make yourself admin

Sign up once, then in the Supabase SQL Editor:

```sql
update public.profiles set role = 'admin'
where id = (select id from auth.users where email = 'you@example.com');
```

## 5. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel (framework auto-detected as Next.js).
3. Add the same env vars in **Project → Settings → Environment Variables**.
4. Set `NEXT_PUBLIC_SITE_URL` to your production URL.
5. Deploy.

## 6. Features

- Path-based profiles at `/:username` (SSR, SEO metadata)
- Avatar upload (Supabase Storage) + URL-based backgrounds/video/audio
- Background: solid / gradient / image / video
- Visual effects: particles (stars/hearts), snow, rain, glassmorphism, typing
- Per-link click tracking + view counter (deduped by IP)
- Admin moderation (ban/unban, reports)
- Reserved usernames, RLS-protected data

## 7. Limitations (free tier)

- Per-user subdomains (`user.domain.com`) need Vercel Pro+ (wildcard). v1 uses `/:username`.
- Supabase free DB pauses after ~1 week of inactivity — resume from the dashboard or ping it.
- Vercel Hobby bandwidth cap (100 GB/mo) — heavy media is hotlinked, not hosted.
- Storage budget is 1 GB — that's why backgrounds/music are URLs, not uploads.

## 8. Scripts

```bash
npm run dev     # dev server
npm run build   # production build
npm run lint    # eslint
```
