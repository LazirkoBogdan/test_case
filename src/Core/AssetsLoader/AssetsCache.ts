import * as PIXI from "pixi.js";
import * as THREE from "three";

export class AssetCache {
  private static _instance: AssetCache;

  private imageAssets: Map<string, PIXI.Texture> = new Map();
  private gltfAssets: Map<string, THREE.Group> = new Map();
  private gltfGroups: Record<string, Record<string, THREE.Group>> = {};

  private constructor() {}

  public static get instance(): AssetCache {
    if (!AssetCache._instance) {
      AssetCache._instance = new AssetCache();
    }
    return AssetCache._instance;
  }

  public setImage(id: string, texture: PIXI.Texture) {
    this.imageAssets.set(id, texture);
  }

  public getImage(id: string): PIXI.Texture | undefined {
    return this.imageAssets.get(id);
  }

  public setGLTF(id: string, model: THREE.Group) {
    this.gltfAssets.set(id, model);
  }

  public getGLTF(id: string): THREE.Group | undefined {
    return this.gltfAssets.get(id);
  }

  public setGLTFGroups(name: string, groups: Record<string, THREE.Group>) {
    this.gltfGroups[name] = groups;
  }

  public getGLTFGroupByName(
    glbName: string,
    groupName: string,
  ): THREE.Group | undefined {
    return this.gltfGroups[glbName]?.[groupName];
  }
  public logAllGLTFGroupNames(): void {
    console.log(
      "%c[AssetCache] Available GLTF Groups:",
      "color: cyan; font-weight: bold;",
    );

    for (const glbName in this.gltfGroups) {
      const groups = this.gltfGroups[glbName];
      console.log(`%c• ${glbName}`, "color: yellow; font-weight: bold;");

      Object.keys(groups).forEach((groupName) => {
        console.log(`   - ${groupName}`);
      });
    }
  }
}
