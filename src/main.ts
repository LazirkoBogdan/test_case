import { Game } from "./game";

import { DIContainer } from "@core/DI";
import { AudioPlayer } from "@core/Audio/AudioPlayer";
import { AssetCache } from "@core/AssetsLoader/AssetsCache";
import { AssetsLoader } from "@core/AssetsLoader/AssetsLoader";
import { config } from "./config";
import { RenderPixiTree } from "@core/Render/PixiTree";
import { EventService } from "@core/Service/EventService";
import { DayNightService } from "@core/Service/DayNightService";

DIContainer.register("Game", () => new Game());
DIContainer.register("Renderer", () => new RenderPixiTree());
DIContainer.register("AudioPlayer", () => new AudioPlayer());
DIContainer.register("AssetCache", () => AssetCache.instance);
DIContainer.register("EventService", () => EventService.getInstance());
DIContainer.register("DayNightService", () => DayNightService.getInstance());
DIContainer.register("AssetsLoader", () => {
  const loader = new AssetsLoader(config.assets);
  loader.setAudioPlayer(DIContainer.resolve("AudioPlayer"));
  return loader;
});

(async () => {
  const game = DIContainer.resolve<Game>("Game");
  await game.init();
  await game.preload();
})();
