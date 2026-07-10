"use client";

interface DiscordCardProps {
  username: string;
  displayName?: string;
  avatarUrl?: string;
}

export function DiscordStatus({ username, displayName, avatarUrl }: DiscordCardProps) {
  return (
    <div className="mt-4 flex items-center gap-3 rounded-2xl bg-[#5865F2]/10 p-3 ring-1 ring-[#5865F2]/20">
      {/* Avatar or Discord icon */}
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt=""
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5865F2]/20">
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-[#5865F2]">
            <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.01-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .01.01.03.03.04 1.75 1.29 3.44 2.07 5.1 2.58.04.01.08 0 .1-.02.39-.53.74-1.1 1.04-1.69.02-.04 0-.08-.03-.1-.42-.31-.82-.67-1.2-1.05-.03-.03-.03-.07 0-.1.1-.08.2-.16.3-.25.02-.02.05-.02.07 0 3.49 1.6 7.27 1.6 10.73 0 .02-.02.05-.02.07 0 .1.08.2.16.3.25.04.03.04.07 0 .1-.38.38-.78.74-1.2 1.05-.03.02-.05.06-.03.1.3.6.66 1.17 1.04 1.69.03.02.07.03.1.02 1.67-.51 3.36-1.29 5.1-2.58.02-.01.03-.03.03-.04.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12z" />
          </svg>
        </div>
      )}

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">
          {displayName || username}
        </p>
        <p className="truncate text-xs text-[#5865F2]">
          @{username}
        </p>
      </div>

      {/* Online indicator */}
      <div className="ml-auto flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#43b581]" style={{ boxShadow: "0 0 6px #43b581" }} />
        <span className="text-[10px] text-neutral-400">Online</span>
      </div>
    </div>
  );
}
