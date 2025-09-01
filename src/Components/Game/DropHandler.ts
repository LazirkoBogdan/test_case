import * as THREE from "three";
import type { IGame } from "@sharedTypes";
import { gsap } from "gsap";

export class DropHandler {
  private game: IGame;
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor(game: IGame) {
    this.game = game;
    this.setupDropListener();
  }

  private setupDropListener() {
    window.addEventListener("drop", this.handleDrop);
    window.addEventListener("dragover", (e) => e.preventDefault());
  }

  private handleDrop = async (e: DragEvent) => {
    e.preventDefault();

    const id = e.dataTransfer?.getData("text/plain");
    if (!id) return;

    const ground = this.getGround();
    if (!ground) return;

    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.game.render.camera);
    const intersects = this.raycaster.intersectObject(ground);

    if (intersects.length > 0) {
      const point = intersects[0].point;

      const glbName = "objects";
      const group = this.game.assetCache.getGLTFGroupByName(glbName, id);
      if (!group) {
        console.warn(`Group ${id} not found`);
        return;
      }

      const clone = group.clone();
      clone.position.copy(point);
      clone.position.y += 0.01;

      clone.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.game.render.scene.add(clone);
    }
  };

  public async dropFromSelector(id: string, clientX: number, clientY: number) {
    const ground = this.getGround();

    if (!ground) return;

    this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.game.render.camera);
    const intersects = this.raycaster.intersectObject(ground);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const glbName = "objects";
      const group = this.game.assetCache.getGLTFGroupByName(glbName, id);
      if (!group) {
        console.warn(`Group ${id} not found`);
        return;
      }

      console.error(id, "id");

      let clone = group.clone();

      if (
        id.includes("cow") ||
        id.includes("sheep") ||
        id.includes("chicken")
      ) {
        clone = this.deepCloneGroup(group as THREE.Group);
      }

      clone.position.copy(point);
      clone.position.y = ground.position.y + 0.01;

      clone.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.game.render.scene.add(clone);

      clone.scale.set(0, 0, 0);

      gsap.to(clone.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: "back.out(1.7)",
      });
    }
  }

  private getGround(): THREE.Object3D | null {
    const envScene = this.game.envaironmentScene as
      | import("../../Environment/EnvironmentScene").EnvironmentScene
      | undefined;
    return envScene?.ground ?? null;
  }

  private deepCloneGroup(group: THREE.Group): THREE.Group {
    const newGroup = new THREE.Group();

    group.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = this.deepCloneMesh(child as THREE.Mesh);
        newGroup.add(mesh);
      }
    });

    return newGroup;
  }

  deepCloneMesh(mesh: THREE.Mesh) {
    const geometry = mesh.geometry.clone();
    const material = Array.isArray(mesh.material)
      ? mesh.material.map((m) => m.clone())
      : mesh.material.clone();

    const newMesh = new THREE.Mesh(geometry, material);

    newMesh.position.set(2, 0.4, 2);
    newMesh.rotation.copy(mesh.rotation);
    newMesh.scale.set(1, 1, 1);

    newMesh.castShadow = true;
    newMesh.receiveShadow = mesh.receiveShadow;

    return newMesh;
  }
}
