import * as THREE from "three";
import gsap from "gsap";

type CameraState = "base" | "edit" | "action";

export class CameraService {
  private camera: THREE.Camera;
  private state: CameraState = "base";
  private loopTween: gsap.core.Tween | null = null;
  private currentTarget: THREE.Object3D;

  constructor(camera: THREE.Camera) {
    this.camera = camera;
    this.currentTarget = new THREE.Object3D();
  }

  public getCurrentTarget(): THREE.Object3D {
    return this.currentTarget;
  }

  public setBase(position: THREE.Vector3, lookAt: THREE.Vector3) {
    this.state = "base";
    this.stopLoop();

    gsap.to(this.camera.position, {
      duration: 1.2,
      x: position.x,
      y: position.y,
      z: position.z,
      onUpdate: () => {
        this.camera.lookAt(lookAt);
      },
    });
  }

  public setEdit(target: THREE.Vector3, lookAt?: THREE.Vector3) {
    this.state = "edit";
    this.stopLoop();

    gsap.to(this.camera.position, {
      duration: 1,
      x: target.x,
      y: target.y,
      z: target.z,
      onUpdate: () => {
        this.camera.lookAt(lookAt ?? new THREE.Vector3(0, 0, 0));
      },
    });
  }

  public setActionLoop(
    target: THREE.Object3D,
    radius = 10,
    height = 5,
    speed = 2,
  ) {
    this.state = "action";
    this.currentTarget = target;
    this.stopLoop();

    let angle = 0;
    this.loopTween = gsap.to(
      {},
      {
        duration: 100000,
        repeat: -1,
        onUpdate: () => {
          angle += 0.01 * speed;
          const x = target.position.x + Math.cos(angle) * radius;
          const z = target.position.z + Math.sin(angle) * radius;
          const y = target.position.y + height;

          this.camera.position.set(x, y, z);
          this.camera.lookAt(target.position);
        },
      },
    );
  }

  private stopLoop() {
    if (this.loopTween) {
      this.loopTween.kill();
      this.loopTween = null;
    }
  }

  public getState(): CameraState {
    return this.state;
  }
}
