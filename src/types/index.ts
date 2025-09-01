import * as THREE from "three";
import * as PIXI from "pixi.js";

interface IRender {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  debug: boolean;

  init(): Promise<void>;
  start(): Promise<void>;
  resize(): void;
}

interface IRenderPixiTree extends IRender {
  pixiRenderer: PIXI.WebGLRenderer;
  stage: PIXI.Container;
  scaleOffest?: number;
}

import { Howl } from "howler";

interface Track {
  id: string;
  src: string;
  loop?: boolean;
  volume?: number;
}

interface IAudioPlayer {
  tracks: Map<string, Howl>;

  loadTracks(trackList: Track[]): void;

  play(id: string): void;
  stop(id: string): void;
  pause(id: string): void;

  setVolume(id: string, volume: number): void;
  isPlaying(id: string): boolean;

  mute(): void;
  unmute(): void;
}

interface IDIContainer {
  register<T>(key: string, factory: () => T): void;
  resolve<T>(key: string): T;
  reset(): void;
}
type ServiceFactory<T> = () => T;

import type { AssetsLoader } from "@core/AssetsLoader/AssetsLoader";
import type { AssetCache } from "@core/AssetsLoader/AssetsCache";
import type { EventService } from "@core/Service/EventService";
import type { DayNightService } from "@core/Service/DayNightService";
import type { EventTypes } from "@constants/Events";

interface IGame {
  render: IRenderPixiTree;
  assetsLoader: AssetsLoader;
  assetCache: AssetCache;
  eventService: EventService;
  dayNightService: DayNightService;
  eventTypes: typeof EventTypes;
  audioPlayer?: IAudioPlayer;
  envaironmentScene?: THREE.Scene;

  initRenderer(): Promise<void>;
  preload(): Promise<void>;
}

interface IScene {
  name: string;
  enter(): void;
  exit(): void;
}

export type {
  IRender,
  IRenderPixiTree,
  IGame,
  IAudioPlayer,
  Track,
  ServiceFactory,
  IDIContainer,
  IScene,
};
