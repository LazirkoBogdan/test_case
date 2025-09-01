import { Group, Object3D } from "three";

export function parseGLBGroupsByName(root: Object3D): Record<string, Group> {
  const groupMap: Record<string, Group> = {};

  root.traverse((child) => {
    if (child instanceof Group && child.name) {
      groupMap[child.name] = child;
    }
  });

  return groupMap;
}
