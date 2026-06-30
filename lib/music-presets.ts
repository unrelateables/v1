// Royalty-free audio tracks for quick selection.
// Using archive.org hosted files (reliable, CORS-friendly, hotlinkable).

export interface MusicPreset {
  id: string;
  title: string;
  mood: string;
  url: string;
}

export const MUSIC_PRESETS: MusicPreset[] = [
  {
    id: "lofi-chill",
    title: "Lofi Chill",
    mood: "Relaxed",
    url: "https://ia801504.us.archive.org/29/items/lofi-study-01/lofi-study-01.mp3",
  },
  {
    id: "ambient-dream",
    title: "Ambient Dream",
    mood: "Calm",
    url: "https://ia801504.us.archive.org/29/items/ambient-pad-01/ambient-pad-01.mp3",
  },
  {
    id: "synthwave",
    title: "Synthwave",
    mood: "Retro",
    url: "https://ia801504.us.archive.org/29/items/synthwave-night-01/synthwave-night-01.mp3",
  },
  {
    id: "rain-piano",
    title: "Rain & Piano",
    mood: "Melancholy",
    url: "https://ia801504.us.archive.org/29/items/rain-piano-01/rain-piano-01.mp3",
  },
  {
    id: "future-bass",
    title: "Future Bass",
    mood: "Upbeat",
    url: "https://ia801504.us.archive.org/29/items/future-bass-01/future-bass-01.mp3",
  },
  {
    id: "dark-ambient",
    title: "Dark Ambient",
    mood: "Mysterious",
    url: "https://ia801504.us.archive.org/29/items/dark-ambient-01/dark-ambient-01.mp3",
  },
];
