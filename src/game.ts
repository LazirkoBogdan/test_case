import { DIContainer } from "@core/DI";
import type { IGame, IRenderPixiTree } from "@sharedTypes";

import type { AudioPlayer } from "@core/Audio/AudioPlayer";
import type { AssetsLoader } from "@core/AssetsLoader/AssetsLoader";
import type { AssetCache } from "@core/AssetsLoader/AssetsCache";
import type { DayNightService } from "@core/Service/DayNightService";
import { EventService } from "@core/Service/EventService";
import { EventTypes } from "@constants/Events";
import { Level } from "./Environment/Level";

export class Game implements IGame {
  public render!: IRenderPixiTree;
  public audioPlayer!: AudioPlayer;
  public assetsLoader!: AssetsLoader;
  public assetCache!: AssetCache;
  public eventService!: EventService;
  public dayNightService!: DayNightService;
  public eventTypes = EventTypes;
  public level!: Level;

  async init() {
    this.audioPlayer = DIContainer.resolve("AudioPlayer");
    this.assetCache = DIContainer.resolve("AssetCache");
    this.assetsLoader = DIContainer.resolve("AssetsLoader");
    this.eventService = DIContainer.resolve("EventService");
    this.dayNightService = DIContainer.resolve("DayNightService");

    await this.initRenderer();
  }

  async initRenderer() {
    this.render = DIContainer.resolve("Renderer");
    await this.render.init();
  }

  async preload() {
    console.log("Preloading assets...");
    await this.assetsLoader.loadAll();
    console.log("Assets preloaded.", this.assetCache);
    this.start();
  }

  start() {
    this.level = new Level(this);
    console.log("Game started!");
  }
}
