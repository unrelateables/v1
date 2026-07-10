"use client";

export function ConnectDiscord({
  connected,
  username,
  displayName,
  avatar,
  discordId,
}: {
  connected: boolean;
  username: string | null;
  displayName: string | null;
  avatar: string | null;
  discordId: string | null;
}) {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "";

  // Redirect to our callback, which will use the Supabase session to know who the user is
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const redirect = encodeURIComponent(`${origin}/api/discord/callback`);

  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirect}&scope=identify`;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#5865F2]">
          <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.01-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .01.01.03.03.04 1.75 1.29 3.44 2.07 5.1 2.58.04.01.08 0 .1-.02.39-.53.74-1.1 1.04-1.69.02-.04 0-.08-.03-.1-.42-.31-.82-.67-1.2-1.05-.03-.03-.03-.07 0-.1.1-.08.2-.16.3-.25.02-.02.05-.02.07 0 3.49 1.6 7.27 1.6 10.73 0 .02-.02.05-.02.07 0 .1.08.2.16.3.25.04.03.04.07 0 .1-.38.38-.78.74-1.2 1.05-.03.02-.05.06-.03.1.3.6.66 1.17 1.04 1.69.03.02.07.03.1.02 1.67-.51 3.36-1.29 5.1-2.58.02-.01.03-.03.03-.04.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
        </svg>
        <h2 className="text-sm font-medium text-white">Discord</h2>
      </div>

      {connected ? (
        <div className="flex items-center gap-3">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png?size=64`}
              alt={displayName || username || ""}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[#5865F2]/40"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865F2]/20">
              <span className="text-sm font-bold text-[#5865F2]">
                {(displayName || username || "?").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white">
              {displayName || username}
            </p>
            {username && displayName && (
              <p className="text-xs text-neutral-500">@{username}</p>
            )}
          </div>
          <a
            href={oauthUrl}
            className="rounded-full bg-[#5865F2]/15 px-3 py-1.5 text-xs text-[#5865F2] transition hover:bg-[#5865F2]/25"
          >
            Reconnect
          </a>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-xs text-neutral-400">
            Connect your Discord account to show your real Discord avatar,
            username, and profile on your bio page.
          </p>
          {clientId ? (
            <a
              href={oauthUrl}
              className="inline-flex items-center gap-2 rounded-full bg-[#5865F2] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#4752C4]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.01-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .01.01.03.03.04 1.75 1.29 3.44 2.07 5.1 2.58.04.01.08 0 .1-.02.39-.53.74-1.1 1.04-1.69.02-.04 0-.08-.03-.1-.42-.31-.82-.67-1.2-1.05-.03-.03-.03-.07 0-.1.1-.08.2-.16.3-.25.02-.02.05-.02.07 0 3.49 1.6 7.27 1.6 10.73 0 .02-.02.05-.02.07 0 .1.08.2.16.3.25.04.03.04.07 0 .1-.38.38-.78.74-1.2 1.05-.03.02-.05.06-.03.1.3.6.66 1.17 1.04 1.69.03.02.07.03.1.02 1.67-.51 3.36-1.29 5.1-2.58.02-.01.03-.03.03-.04.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02z" />
              </svg>
              Connect Discord
            </a>
          ) : (
            <p className="text-xs text-amber-400">
              Discord integration requires a Discord Application. Set{" "}
              <code className="rounded bg-white/5 px-1">
                DISCORD_CLIENT_ID
              </code>{" "}
              and{" "}
              <code className="rounded bg-white/5 px-1">
                DISCORD_CLIENT_SECRET
              </code>{" "}
              env vars to enable.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
