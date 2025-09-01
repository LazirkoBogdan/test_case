import type { IGame } from "@sharedTypes";
import { EnvironmentScene } from "./EnvironmentScene";
import { EnvironmentUI } from "./EnvironmentUI";
import { Container } from "pixi.js";
// import * as THREE from "three";

export class Level {
  game: IGame;
  scene: EnvironmentScene;
  ui: Container;

  constructor(game: IGame) {
    this.game = game;
    this.scene = new EnvironmentScene(this.game);
    this.ui = new EnvironmentUI(this.game);

    // const cow = this.game.assetCache.getGLTFGroupByName('objects', 'cow') as THREE.Group;
    // this.scene.add(cow);
  }
}
