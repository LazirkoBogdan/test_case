import * as THREE from "three";

export function createLampLikeLight(
  scene: THREE.Scene,
  position: THREE.Vector3,
) {
  const light = new THREE.SpotLight(0xfff2cc, 1.5, 10, Math.PI / 6, 0.4, 2);
  light.position.copy(position);
  light.target.position.set(position.x, position.y - 1, position.z);
  scene.add(light);
  scene.add(light.target);

  const coneMaterial = new THREE.MeshBasicMaterial({
    color: 0xfff2cc,
    transparent: true,
    opacity: 0.05,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });

  const coneGeometry = new THREE.ConeGeometry(20, 40, 64, 1, true);
  const cone = new THREE.Mesh(coneGeometry, coneMaterial);
  cone.position.copy(position);
  cone.position.y -= 1;

  scene.add(cone);

  return light;
}
