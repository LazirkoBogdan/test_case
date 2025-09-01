import * as PIXI from "pixi.js";
import { AssetCache } from "@core/AssetsLoader/AssetsCache";
import type { IGame } from "@sharedTypes";

interface DropHandler {
  dropFromSelector(id: string, x: number, y: number): void;
}

export class ObjectSelectorUI extends PIXI.Container {
  private buttonSize = 64;
  private padding = 12;
  private dragSprite: PIXI.Sprite | null = null;
  private dragData: {
    id: string;
    startX: number;
    startY: number;
    sound: string;
  } | null = null;
  private dropHandler: DropHandler;
  private game: IGame;

  constructor(dropHandler: DropHandler, game: IGame) {
    super();
    this.dropHandler = dropHandler;
    this.game = game;
    this.initUI();
  }
  getObjects() {
    return [
      {
        id: "grape_1",
        texture: AssetCache.instance.getImage("grape"),
        sound: "throw_spear",
      },
      {
        id: "grape_2",
        texture: AssetCache.instance.getImage("grape"),
        sound: "throw_spear",
      },
      {
        id: "grape_3",
        texture: AssetCache.instance.getImage("grape"),
        sound: "throw_spear",
      },
      {
        id: "fence",
        texture: AssetCache.instance.getImage("plus"),
        sound: "throw_spear",
      },
      {
        id: "chicken003",
        texture: AssetCache.instance.getImage("plus"),
        sound: "chicken",
      },
      { id: "cow", texture: AssetCache.instance.getImage("cow"), sound: "cow" },
      {
        id: "sheep",
        texture: AssetCache.instance.getImage("sheep"),
        sound: "sheep",
      },
      {
        id: "corn_2",
        texture: AssetCache.instance.getImage("corn"),
        sound: "throw_spear",
      },
      {
        id: "corn_3",
        texture: AssetCache.instance.getImage("corn"),
        sound: "throw_spear",
      },
      {
        id: "strawberry_1",
        texture: AssetCache.instance.getImage("strawberry"),
        sound: "throw_spear",
      },
      {
        id: "strawberry_2",
        texture: AssetCache.instance.getImage("strawberry"),
        sound: "throw_spear",
      },
      {
        id: "strawberry_3",
        texture: AssetCache.instance.getImage("strawberry"),
        sound: "throw_spear",
      },
      {
        id: "tomato_1",
        texture: AssetCache.instance.getImage("tomato"),
        sound: "throw_spear",
      },
      {
        id: "tomato_2",
        texture: AssetCache.instance.getImage("tomato"),
        sound: "throw_spear",
      },
      {
        id: "tomato_3",
        texture: AssetCache.instance.getImage("tomato"),
        sound: "throw_spear",
      },
    ];
  }

  private initUI() {
    const getObjects = this.getObjects();

    getObjects.forEach((obj, index) => {
      const texture = obj.texture;
      console.log("Texture for", obj.id, texture);
      if (!texture) return;

      const sprite = new PIXI.Sprite(texture);
      sprite.cursor = "pointer";
      sprite.eventMode = "static";
      sprite.width = this.buttonSize;
      sprite.height = this.buttonSize;
      sprite.x = (this.buttonSize + this.padding) * index;

      sprite.on("pointerdown", (event) => {
        console.log("Started dragging", obj.id);
        this.startDrag(event, obj.id, texture, obj.sound);
      });

      this.addChild(sprite);
    });
  }

  private startDrag(
    event: PIXI.FederatedPointerEvent,
    id: string,
    texture: PIXI.Texture,
    sound: string,
  ) {
    this.dragSprite = new PIXI.Sprite(texture);
    this.dragSprite.width = this.buttonSize;
    this.dragSprite.height = this.buttonSize;
    this.dragSprite.anchor.set(0.5);
    this.dragData = {
      id,
      startX: event.client.x,
      startY: event.client.y,
      sound,
    };

    this.addChild(this.dragSprite);
    this.updateDrag(event);

    window.addEventListener("pointermove", this.updateDrag);
    window.addEventListener("pointerup", this.endDrag);
  }

  private updateDrag = (event: PointerEvent) => {
    if (this.dragSprite) {
      const rect = this.getBounds();
      const scale = this.game.render.scaleOffest ?? 1;
      this.dragSprite.x = (event.clientX - rect.x) / scale;
      this.dragSprite.y = (event.clientY - rect.y) / scale;
    }
  };

  private endDrag = (event: PointerEvent) => {
    if (this.dragSprite && this.dragData) {
      this.dropHandler.dropFromSelector(
        this.dragData.id,
        event.clientX,
        event.clientY,
      );
      const sound = this.dragData.sound;
      this.game.audioPlayer?.play(sound);
    }

    if (this.dragSprite) {
      this.removeChild(this.dragSprite);
    }

    this.dragSprite = null;
    this.dragData = null;

    window.removeEventListener("pointermove", this.updateDrag);
    window.removeEventListener("pointerup", this.endDrag);
  };
}
