import { Howl, Howler } from "howler";

import type { Track, IAudioPlayer } from "@sharedTypes";

export class AudioPlayer implements IAudioPlayer {
  public tracks: Map<string, Howl> = new Map();

  constructor() {}

  loadTracks(trackList: Track[]) {
    for (const track of trackList) {
      const sound = new Howl({
        src: [track.src],
        loop: track.loop ?? false,
        volume: track.volume ?? 1.0,
        onload: () => console.log(`Loaded track: ${track.id}`),
        onloaderror: (_, err) =>
          console.error(`Failed to load: ${track.id}`, err),
      });

      this.tracks.set(track.id, sound);
    }
  }

  public play(id: string) {
    const sound = this.tracks.get(id);
    if (!sound) {
      console.warn(`Track with id "${id}" not found.`);
      return;
    }

    sound.play();
  }

  public stop(id: string) {
    const sound = this.tracks.get(id);
    if (!sound) {
      console.warn(`Track with id "${id}" not found.`);
      return;
    }

    sound.stop();
  }

  public pause(id: string) {
    const sound = this.tracks.get(id);
    if (!sound) {
      console.warn(`Track with id "${id}" not found.`);
      return;
    }

    sound.pause();
  }

  public setVolume(id: string, volume: number) {
    const sound = this.tracks.get(id);
    if (!sound) return;
    sound.volume(volume);
  }

  public isPlaying(id: string): boolean {
    const sound = this.tracks.get(id);
    return sound?.playing() ?? false;
  }

  public mute() {
    Howler.mute(true);
  }

  public unmute() {
    Howler.mute(false);
  }
}
