import * as PIXI from "pixi.js";
import type { IGame } from "@sharedTypes";
import { ObjectSelectorUI } from "@components/UI/ObjectSelectorUI";
import { DropHandler } from "@components/Game/DropHandler";
import { Menu } from "@components/UI/Menu";
import { TimeDisplay } from "@components/UI/TimeDisplay";

export class EnvironmentUI extends PIXI.Container {
  game: IGame;

  constructor(game: IGame) {
    super();
    this.game = game;
    this.game.render.stage.addChild(this);

    this.setupScene();
  }

  setupScene() {
    const dropHandler = new DropHandler(this.game);
    const amazingUI = new ObjectSelectorUI(dropHandler, this.game);
    const menu = new Menu(this.game);
    const timeDisplay = new TimeDisplay(this.game);

    this.addChild(amazingUI, menu, timeDisplay);
  }
}
