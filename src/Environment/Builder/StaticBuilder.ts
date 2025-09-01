import { AssetCache } from "@core/AssetsLoader/AssetsCache";
import { Object3D } from "three";
export interface StaticElementConfig {
  groupName: string;
  nodeName: string;
  position?: [x: number, y: number, z: number];
  rotation?: [x: number, y: number, z: number];
  scale?: [x: number, y: number, z: number];
}

export class StaticBuilder {
  constructor(private assetCache: AssetCache) {}

  public build(configs: StaticElementConfig[]): Object3D[] {
    const built: Object3D[] = [];

    for (const cfg of configs) {
      const group = this.assetCache.getGLTFGroupByName(
        cfg.groupName,
        cfg.nodeName,
      );

      if (!group) {
        console.warn(
          `[StaticBuilder] Could not find group "${cfg.groupName}" node "${cfg.nodeName}"`,
        );
        continue;
      }

      const clone = group.clone();

      if (cfg.position) clone.position.set(...cfg.position);
      if (cfg.rotation) clone.rotation.set(...cfg.rotation);
      if (cfg.scale) clone.scale.set(...cfg.scale);

      built.push(clone);
    }

    return built;
  }
}
