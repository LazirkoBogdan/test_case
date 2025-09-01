import { Sprite, Texture, Container } from "pixi.js";
import { gsap } from "gsap";
import type { IGame } from "@sharedTypes";

export class BasicToggleButton extends Container {
  private onTexture: Texture;
  private offTexture: Texture;
  private sprite: Sprite;
  public enable: boolean = false;
  protected game: IGame;
  protected callBack: () => void = () => {};
  constructor(
    onTexture: Texture,
    offTexture: Texture,
    game: IGame,
    callBack?: () => void,
  ) {
    super();

    this.onTexture = onTexture;
    this.offTexture = offTexture;

    this.sprite = new Sprite(this.offTexture);
    this.sprite.anchor.set(0.5);
    this.addChild(this.sprite);

    this.eventMode = "static";

    this.on("pointerdown", this.handleClick.bind(this));
    this.game = game;
    if (callBack) {
      this.callBack = callBack;
    }
  }

  private handleClick() {
    gsap.to(this.sprite.scale, {
      x: 1.2,
      y: 1.2,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power1.out",
    });

    this.toggle();
  }

  private toggle() {
    this.enable = !this.enable;
    this.sprite.texture = this.enable ? this.onTexture : this.offTexture;

    this.callBack();
  }

  public get isOn(): boolean {
    return this.enable;
  }

  public setState(on: boolean) {
    this.enable = on;
    this.sprite.texture = this.enable ? this.onTexture : this.offTexture;
  }
}
