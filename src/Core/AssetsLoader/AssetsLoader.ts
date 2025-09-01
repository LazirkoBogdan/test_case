import * as PIXI from "pixi.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { AssetCache } from "./AssetsCache";
import type { IAudioPlayer, IGame } from "@sharedTypes";
import { parseGLBGroupsByName } from "@utils";
import { DIContainer } from "@core/DI";

interface AssetConfig {
  audio: { id: string; src: string; loop?: boolean; volume?: number }[];
  images: any;
  glb: { name: string; srcs: string }[];
}

export class AssetsLoader {
  private assetCache = AssetCache.instance;
  private audioPlayer?: IAudioPlayer;

  constructor(private config: AssetConfig) {}

  public setAudioPlayer(audioPlayer: IAudioPlayer) {
    this.audioPlayer = audioPlayer;
  }
  public async loadAll() {
    console.log(this.config);

    await Promise.all([
      this.loadPixiImages(),
      this.loadAudio(),
      this.loadGLTFs(),
    ]);

    const game = DIContainer.resolve<IGame>("Game");

    game.eventService.dispatch(game.eventTypes.GAME.START, {});
    game.eventService.dispatch("SOUND:LOADED", true);
  }

  private async loadPixiImages() {
    const manifest = this.config.images;

    await PIXI.Assets.init({ manifest: manifest });

    PIXI.Assets.backgroundLoadBundle(["load-screen", "game-screen"]);

    const loadScreenAssets = await PIXI.Assets.loadBundle("load-screen");
    console.log("Loaded load-screen assets:", loadScreenAssets);
    for (const [key, texture] of Object.entries(loadScreenAssets)) {
      this.assetCache.setImage(key, texture as PIXI.Texture);
    }

    const gameScreenAssets = await PIXI.Assets.loadBundle("game-screen");
    console.log("Loaded game-screen assets:", gameScreenAssets);

    for (const [key, texture] of Object.entries(gameScreenAssets)) {
      this.assetCache.setImage(key, texture as PIXI.Texture);
    }
  }

  private async loadAudio() {
    if (!this.audioPlayer) {
      throw new Error("AudioPlayer is not set.");
    }

    this.audioPlayer.loadTracks(this.config.audio);
  }

  private async loadGLTFs(): Promise<void> {
    const loader = new GLTFLoader();

    const promises = this.config.glb.map((entry) => {
      return new Promise<void>((resolve, reject) => {
        loader.load(
          entry.srcs,
          (gltf) => {
            const groupMap = parseGLBGroupsByName(gltf.scene);

            // Зберігаєш обидва: сцену (як раніше) і групи окремо
            this.assetCache.setGLTF(entry.name, gltf.scene); // основна сцена
            this.assetCache.setGLTFGroups(entry.name, groupMap); // нова функція для груп

            resolve();
          },
          undefined,
          (err) => {
            console.error(`Failed to load GLTF: ${entry.name}`, err);
            reject(err);
          },
        );
      });
    });

    await Promise.all(promises);
  }
}
