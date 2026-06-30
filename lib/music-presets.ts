// Free, hotlinkable ambient/lofi tracks for quick selection.
// These are royalty-free CC0/CC-BY tracks hosted on reliable CDNs.

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
    url: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
  },
  {
    id: "ambient-dream",
    title: "Ambient Dream",
    mood: "Calm",
    url: "https://cdn.pixabay.com/audio/2022/03/15/audio_8e9a3f1c82.mp3",
  },
  {
    id: "synthwave",
    title: "Synthwave",
    mood: "Retro",
    url: "https://cdn.pixabay.com/audio/2022/10/30/audio_347a3d2f9b.mp3",
  },
  {
    id: "rain-piano",
    title: "Rain & Piano",
    mood: "Melancholy",
    url: "https://cdn.pixabay.com/audio/2023/01/12/audio_5f6b8c3d1e.mp3",
  },
  {
    id: "future-bass",
    title: "Future Bass",
    mood: "Upbeat",
    url: "https://cdn.pixabay.com/audio/2022/08/04/audio_2a1f3c4d5b.mp3",
  },
  {
    id: "dark-ambient",
    title: "Dark Ambient",
    mood: "Mysterious",
    url: "https://cdn.pixabay.com/audio/2022/01/18/audio_dc4e1f3a2b.mp3",
  },
];
