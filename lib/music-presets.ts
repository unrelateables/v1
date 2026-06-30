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
    id: "electronic-1",
    title: "Midnight Drive",
    mood: "Electronic",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "electronic-2",
    title: "Neon Pulse",
    mood: "Electronic",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "electronic-3",
    title: "Deep Waves",
    mood: "Chill",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: "electronic-4",
    title: "Synth Garden",
    mood: "Ambient",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: "electronic-5",
    title: "Gravity",
    mood: "Electronic",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    id: "electronic-6",
    title: "Afterglow",
    mood: "Chill",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
];
