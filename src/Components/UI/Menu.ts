import { Container, Texture } from "pixi.js";
import type { IGame } from "@sharedTypes";
import { BasicToggleButton } from "./Button";
export class Menu extends Container {
  public soundButton!: BasicToggleButton;
  protected game: IGame;

  constructor(game: IGame) {
    super();
    this.game = game;

    this.setupUI();
  }

  protected setupUI() {
    this.setupSoundButton();
  }

  private setupSoundButton(): void {
    const soundOn = this.getTextureOrThrow("soundOn");
    const soundOff = this.getTextureOrThrow("soundOff");

    this.soundButton = this.createSoundToggleButton(soundOn, soundOff);
    this.soundButton.position.set(30, 100);
    this.soundButton.setState(false);

    this.addChild(this.soundButton);
  }

  private getTextureOrThrow(name: string): Texture {
    const texture = this.game.assetCache.getImage(name);
    if (!texture) throw new Error(`Missing texture: ${name}`);
    return texture;
  }

  private createSoundToggleButton(
    onTex: Texture,
    offTex: Texture,
  ): BasicToggleButton {
    return new BasicToggleButton(onTex, offTex, this.game, () => {
      const track = "theme";
      if (this.soundButton.enable) {
        this.game.audioPlayer?.play(track);
      } else {
        this.game.audioPlayer?.stop(track);
      }
    });
  }
}
